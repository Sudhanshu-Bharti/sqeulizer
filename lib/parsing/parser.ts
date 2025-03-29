import { importer } from "@dbml/core";

type SQLDialect = "mysql" | "postgres" | "mssql";

interface TableField {
  name: string;
  type: string;
  constraints: string[];
}

interface TableNode {
  id: string;
  name: string;
  fields: TableField[];
}

interface RelationshipType {
  type: "one-to-many" | "one-to-one" | "many-to-many";
  sourceRequired: boolean;
  targetRequired: boolean;
}

interface Relationship {
  id: string;
  source: string;
  target: string;
  sourceField: string;
  targetField: string;
  relationshipType: RelationshipType;
}

interface DBMLStructure {
  nodes: TableNode[];
  edges: Relationship[];
}

function cleanSQLInput(sql: string, dialect: SQLDialect): string {
  const commonRules = {
    removeSpaces: (s: string) => s.replace(/\s+/g, " ").trim(),
  };

  const mysqlSpecificRules = {
    // Remove special table prefix and backticks
    cleanTableName: (s: string) =>
      s.replace(/`#__([^`]+)`/g, '"$1"').replace(/`([^`]+)`/g, '"$1"'),

    // Clean MySQL-specific syntax
    cleanSyntax: (s: string) =>
      s
        .replace(/IF NOT EXISTS /gi, "")
        .replace(/ENGINE.*?(?=[,;]|$)/gi, "")
        .replace(/DEFAULT\s+CHARSET.*?(?=[,;]|$)/gi, "")
        .replace(/COLLATE\s+\w+(?:\s*\w+)?/gi, "")
        .replace(/CHARACTER SET\s+\w+/gi, "")
        .replace(/AUTO_INCREMENT(?:=\d+)?/gi, "")
        .replace(/\s+UNSIGNED/gi, ""),

    // Convert MySQL types to PostgreSQL
    convertTypes: (s: string) =>
      s
        .replace(/int\(\d+\)/gi, "INTEGER")
        .replace(/tinyint\(\d+\)/gi, "SMALLINT")
        .replace(/varchar\((\d+)\)/gi, "VARCHAR($1)")
        .replace(/datetime/gi, "TIMESTAMP")
        .replace(/text(?:\(\d+\))?/gi, "TEXT"),

    // Fix default values
    cleanDefaults: (s: string) =>
      s
        .replace(/'0000-00-00 00:00:00'/g, "CURRENT_TIMESTAMP")
        .replace(/DEFAULT\s+''/g, "DEFAULT NULL")
        .replace(/NOT NULL DEFAULT '0'/g, "DEFAULT '0' NOT NULL")
        .replace(/DEFAULT '-1'/g, "DEFAULT -1"),

    // Remove KEY definitions
    removeKeys: (s: string) =>
      s
        .replace(/,\s*(?:PRIMARY\s+)?KEY\s+.*?(?=,|\))/g, "")
        .replace(/,\s*(?:UNIQUE\s+)?KEY\s+`[^`]+`\s*\([^)]+\)/g, "")
        .replace(
          /,\s*CONSTRAINT\s+`[^`]+`\s*FOREIGN KEY\s*\([^)]+\)\s*REFERENCES\s*`[^`]+`\s*\([^)]+\)/g,
          ""
        ),

    // Clean up trailing commas and spaces
    cleanupFormat: (s: string) =>
      s
        .replace(/,(\s*[}\)])/g, "$1")
        .replace(/\(\s+/g, "(")
        .replace(/\s+\)/g, ")"),
  };

  const dialectRules = {
    mysql: mysqlSpecificRules,
    postgres: {
      // PostgreSQL specific cleaning
      cleanSerial: (s: string) =>
        s.replace(/SERIAL/gi, "INTEGER GENERATED ALWAYS AS IDENTITY"),
    },
    mssql: {
      // MSSQL specific cleaning
      cleanIdentity: (s: string) =>
        s.replace(/IDENTITY\(\d+,\d+\)/gi, "GENERATED ALWAYS AS IDENTITY"),
      cleanTypes: (s: string) =>
        s.replace(/nvarchar/gi, "varchar").replace(/datetime2/gi, "timestamp"),
    },
  };

  let cleaned = sql;

  if (dialect === "mysql") {
    // Apply MySQL rules in specific order
    const rules = dialectRules.mysql;
    const orderOfOperations = [
      "cleanTableName",
      "cleanSyntax",
      "convertTypes",
      "cleanDefaults",
      "removeKeys",
      "cleanupFormat",
    ];

    for (const operation of orderOfOperations) {
      cleaned = rules[operation](cleaned);
    }
  } else if (dialect === "postgres") {
    const rules = dialectRules.postgres;
    cleaned = Object.values(rules).reduce((s, rule) => rule(s), cleaned);
  } else if (dialect === "mssql") {
    const rules = dialectRules.mssql;
    cleaned = Object.values(rules).reduce((s, rule) => rule(s), cleaned);
  }

  // Apply common rules last
  cleaned = commonRules.removeSpaces(cleaned);

  console.log("Original SQL:", sql);
  console.log("Cleaned SQL:", cleaned);

  return cleaned;
}

export function sqlToDbml(
  sqlInput: string,
  dialect: SQLDialect = "postgres"
): DBMLStructure {
  try {
    const cleanedSQL = cleanSQLInput(sqlInput, dialect);

    try {
      const dbml = importer.import(cleanedSQL, dialect);
      return parseDBMLToStructure(dbml);
    } catch (importError) {
      console.error("First import attempt failed:", importError);

      const alternativeSQL = cleanedSQL
        .replace(/,\s*(?:PRIMARY\s+)?KEY\s+(?:`[^`]+`|\([^)]+\))/g, "")
        .replace(/,(\s*\))/g, "$1")
        .replace(/\s+CHARACTER\s+SET\s+\w+/gi, "")
        .replace(/\s+COLLATE\s+\w+(?:\s*\w+)?/gi, "");

      console.log("Alternative SQL:", alternativeSQL);
      const dbml = importer.import(alternativeSQL, dialect);
      return parseDBMLToStructure(dbml);
    }
  } catch (error) {
    console.error("DBML conversion error:", error);
    throw new Error(
      `Failed to convert ${dialect.toUpperCase()} to DBML: Invalid SQL syntax`
    );
  }
}

function determineRelationType(
  field: TableField,
  referencedField: TableField
): RelationshipType {
  // Check for primary and foreign key patterns
  const isPK = field.constraints.includes("pk");
  const isFK =
    field.name.toLowerCase().includes("_id") ||
    field.name.toLowerCase().endsWith("id");
  const isUnique = field.constraints.includes("unique");
  const isRequired = field.constraints.includes("not null");

  if (isPK && isFK) {
    return {
      type: "one-to-one",
      sourceRequired: true,
      targetRequired: true,
    };
  } else if (isFK && isUnique) {
    return {
      type: "one-to-one",
      sourceRequired: isRequired,
      targetRequired: false,
    };
  } else {
    return {
      type: "one-to-many",
      sourceRequired: isRequired,
      targetRequired: false,
    };
  }
}

function parseDBMLToStructure(dbml: string): DBMLStructure {
  const nodes: TableNode[] = [];
  const edges: Relationship[] = [];
  let currentTable: TableNode | null = null;

  const lines = dbml.split("\n");

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith("Table")) {
      const tableName = trimmedLine.match(/Table\s+"([^"]+)"/)?.[1];
      if (tableName) {
        currentTable = {
          id: tableName,
          name: tableName,
          fields: [],
        };
        nodes.push(currentTable);
      }
    } else if (trimmedLine.startsWith('"') && currentTable) {
      const fieldMatch = trimmedLine.match(
        /"([^"]+)"\s+([^\s\[]+)(\s+\[([^\]]+)\])?/
      );
      if (fieldMatch) {
        const [_, name, type, __, constraintsStr] = fieldMatch;
        const constraints = constraintsStr
          ? constraintsStr.split(",").map((c) => c.trim())
          : [];
        currentTable.fields.push({ name, type, constraints });
      }
    } else if (trimmedLine.startsWith("Ref:")) {
      const refMatch = trimmedLine.match(
        /Ref:"([^"]+)"\."([^"]+)"\s*(<|>|\-)\s*"([^"]+)"\."([^"]+)"/
      );
      if (refMatch) {
        const [_, source, sourceField, relation, target, targetField] =
          refMatch;
        const sourceTable = nodes.find((n) => n.id === source);
        const sourceFieldData = sourceTable?.fields.find(
          (f) => f.name === sourceField
        );

        edges.push({
          id: `${source}-${target}`,
          source,
          target,
          sourceField,
          targetField,
          relationshipType: determineRelationType(
            sourceFieldData || { name: "", type: "", constraints: [] },
            { name: "", type: "", constraints: [] }
          ),
        });
      }
    }
  }

  nodes.forEach((sourceTable) => {
    sourceTable.fields.forEach((sourceField) => {
      const referencedTableName = sourceField.name.match(/(\w+)_id$/)?.[1];
      if (referencedTableName) {
        const targetTable = nodes.find(
          (n) => n.name.toLowerCase() === referencedTableName.toLowerCase()
        );

        if (targetTable) {
          const targetField = targetTable.fields.find((f) =>
            f.constraints.includes("pk")
          );
          if (targetField) {
            edges.push({
              id: `${sourceTable.id}-${targetTable.id}`,
              source: sourceTable.id,
              target: targetTable.id,
              sourceField: sourceField.name,
              targetField: targetField.name,
              relationshipType: determineRelationType(sourceField, targetField),
            });
          }
        }
      }
    });
  });

  return { nodes, edges };
}
