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
    // Extract tables and relationships using regex
    const nodes: TableNode[] = [];
    const edges: Relationship[] = [];

    // Extract table definitions
    const tableRegex = /CREATE\s+TABLE\s+(\w+)\s*\(([\s\S]*?)\);/gm;
    let match;

    while ((match = tableRegex.exec(sqlInput)) !== null) {
      const [_, tableName, tableContent] = match;
      const fields: TableField[] = [];

      // Parse fields
      const lines = tableContent
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("FOREIGN KEY"));

      for (const line of lines) {
        const fieldMatch = line.match(/^(\w+)\s+([\w\(\),\s]+)([^,]*)/);
        if (fieldMatch) {
          const [_, name, type, constraints] = fieldMatch;
          fields.push({
            name,
            type: type.trim(),
            constraints: [],
          });
        }
      }

      nodes.push({
        id: tableName,
        name: tableName,
        fields,
      });
    }

    // Extract relationships
    const fkRegex =
      /FOREIGN\s+KEY\s*\((\w+)\)\s*REFERENCES\s+(\w+)\s*\((\w+)\)/gm;
    while ((match = fkRegex.exec(sqlInput)) !== null) {
      const [_, sourceField, targetTable, targetField] = match;

      // Find the source table
      const sourceTableMatch = sqlInput
        .substring(0, match.index)
        .match(/CREATE\s+TABLE\s+(\w+)/i);
      if (sourceTableMatch) {
        const sourceTable = sourceTableMatch[1];
        edges.push({
          id: `${sourceTable}-${targetTable}`,
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

    return { nodes, edges };
  } catch (error) {
    console.error("SQL parsing error:", error);
    throw new Error(`Failed to parse SQL: ${error.message}`);
  }
}
