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

export function sqlToDbml(
  sqlInput: string,
  dialect: SQLDialect = "postgres"
): DBMLStructure {
  try {
    // Validate SQL input
    if (!sqlInput || typeof sqlInput !== "string" || sqlInput.trim() === "") {
      throw new Error("Invalid SQL input: SQL string is empty or not a string");
    }

    // Extract tables and relationships manually using regex
    const nodes: TableNode[] = [];
    const edges: Relationship[] = [];

    // Extract table definitions
    const tableRegex = /CREATE\s+TABLE\s+([^\s(]+)\s*\(([\s\S]*?)\);/gim;
    let tableMatch;

    while ((tableMatch = tableRegex.exec(sqlInput)) !== null) {
      const tableName = tableMatch[1].replace(/["'`]/g, "").trim();
      const tableContent = tableMatch[2];

      // Extract fields
      const fields: TableField[] = [];
      const fieldLines = tableContent
        .split(",")
        .map((line) => line.trim())
        .filter(
          (line) =>
            line &&
            !line.toLowerCase().startsWith("foreign key") &&
            !line.toLowerCase().startsWith("primary key")
        );

      for (const line of fieldLines) {
        // Basic field pattern: name type constraints
        const fieldMatch = line.match(
          /^([^\s]+)\s+([^\s(]+(?:\([^)]*\))?)\s*(.*)/i
        );

        if (fieldMatch) {
          const [_, name, type, constraintsText] = fieldMatch;
          const constraints: string[] = [];

          if (constraintsText.toLowerCase().includes("primary key"))
            constraints.push("pk");
          if (constraintsText.toLowerCase().includes("not null"))
            constraints.push("not null");
          if (constraintsText.toLowerCase().includes("unique"))
            constraints.push("unique");
          if (constraintsText.toLowerCase().includes("references"))
            constraints.push("fk");

          fields.push({
            name: name.replace(/["'`]/g, "").trim(),
            type: type.trim(),
            constraints,
          });
        }
      }

      if (fields.length > 0) {
        nodes.push({
          id: tableName,
          name: tableName,
          fields,
        });
      }
    }

    // Extract relationships
    const fkRegex =
      /FOREIGN\s+KEY\s*\(\s*([^\s)]+)\s*\)\s*REFERENCES\s+([^\s(]+)\s*\(\s*([^\s)]+)\s*\)/gim;
    let fkMatch;

    while ((fkMatch = fkRegex.exec(sqlInput)) !== null) {
      const sourceField = fkMatch[1].replace(/["'`]/g, "").trim();
      const targetTable = fkMatch[2].replace(/["'`]/g, "").trim();
      const targetField = fkMatch[3].replace(/["'`]/g, "").trim();

      // Find which table this FK belongs to by looking at the surrounding CREATE TABLE statement
      const tableSql = sqlInput.substring(0, fkMatch.index);
      const lastCreateIndex = tableSql.lastIndexOf("CREATE TABLE");
      if (lastCreateIndex !== -1) {
        const tableNameMatch = tableSql
          .substring(lastCreateIndex)
          .match(/CREATE\s+TABLE\s+([^\s(]+)/i);

        if (tableNameMatch) {
          const sourceTable = tableNameMatch[1].replace(/["'`]/g, "").trim();

          edges.push({
            id: `${sourceTable}-${targetTable}-${sourceField}`,
            source: sourceTable,
            target: targetTable,
            sourceField,
            targetField,
            relationshipType: {
              type: "one-to-many",
              sourceRequired: true,
              targetRequired: true,
            },
          });
        }
      }
    }

    console.log("Parsed Structure:", { nodes, edges });
    return { nodes, edges };
  } catch (error) {
    console.error("SQL parsing error:", error);
    throw new Error(`Failed to parse SQL: ${error instanceof Error ? error.message : String(error)}`);
  }
}
