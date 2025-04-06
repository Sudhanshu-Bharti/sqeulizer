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

// Helper function to temporarily replace commas inside parentheses
function replaceCommasInParens(text: string): string {
  let result = "";
  let parenLevel = 0;
  for (const char of text) {
    if (char === "(") {
      parenLevel++;
      result += char;
    } else if (char === ")") {
      parenLevel--;
      result += char;
    } else if (char === "," && parenLevel > 0) {
      result += "@@COMMA@@"; // Use placeholder
    } else {
      result += char;
    }
  }
  return result;
}

// Helper function to restore commas from placeholder
function restoreCommas(text: string): string {
  return text.replace(/@@COMMA@@/g, ",");
}

export function sqlToDbml(
  sqlInput: string,
  dialect: SQLDialect = "postgres"
): DBMLStructure {
  try {
    // Log the input SQL
    console.log("--- SQL Input for sqlToDbml ---");
    console.log(sqlInput);
    console.log("---------------------------------");

    // Validate SQL input
    if (!sqlInput || typeof sqlInput !== "string" || sqlInput.trim() === "") {
      throw new Error("Invalid SQL input: SQL string is empty or not a string");
    }

    const nodes: TableNode[] = [];
    const edges: Relationship[] = [];

    const tableRegex = /CREATE\s+TABLE\s+([^\s(]+)\s*\(([\s\S]*?)\);/gim;
    let tableMatch;

    const fkClauseRegex =
      /FOREIGN\s+KEY\s*\(\s*([^\s)]+)\s*\)\s*REFERENCES\s+([^\s(]+)\s*\(\s*([^\s)]+)\s*\)/i;
    // Regex for separate PRIMARY KEY constraint: captures column list
    const pkClauseRegex = /PRIMARY\s+KEY\s*\(([^)]+)\)/i;
    // Regex for separate UNIQUE constraint: captures column list
    const uniqueClauseRegex = /UNIQUE(?:[\s_]+KEY)?\s*\(([^)]+)\)/i;

    while ((tableMatch = tableRegex.exec(sqlInput)) !== null) {
      const tableName = tableMatch[1].replace(/[\"\'`]/g, "").trim();
      const tableContent = tableMatch[2];

      const fields: TableField[] = [];
      const constraintsToAdd: { fieldName: string; constraint: "pk" | "fk" | "unique" | "composite-pk" }[] = []; // Updated constraint types

      const protectedContent = replaceCommasInParens(tableContent);
      const rawFieldLines = protectedContent.split(",").map((line) => line.trim()).filter(Boolean);
      const fieldLines = rawFieldLines.map(restoreCommas);

      for (const line of fieldLines) {
        // 1. Check for separate FOREIGN KEY definition
        if (line.toLowerCase().startsWith("foreign key")) {
            const fkMatch = line.match(fkClauseRegex);
            if (fkMatch) {
                const sourceField = fkMatch[1].replace(/[\"\'`]/g, "").trim();
                const targetTable = fkMatch[2].replace(/[\"\'`]/g, "").trim();
                const targetField = fkMatch[3].replace(/[\"\'`]/g, "").trim();
                edges.push({
                  id: `${tableName}-${targetTable}-${sourceField}`,
                  source: tableName,
                  target: targetTable,
                  sourceField,
                  targetField,
                  relationshipType: { type: "one-to-many", sourceRequired: true, targetRequired: true },
                });
                constraintsToAdd.push({ fieldName: sourceField, constraint: "fk" });
             }
             continue;
        }

        // 2. Check for separate PRIMARY KEY definition
        if (line.toLowerCase().startsWith("primary key")) {
          const pkMatch = line.match(pkClauseRegex);
          if (pkMatch) {
            const pkColumns = restoreCommas(pkMatch[1]).split(',').map(col => col.replace(/["\'`]/g, "").trim());
            // Differentiate between single and composite PK
            const constraintType = pkColumns.length > 1 ? "composite-pk" : "pk";
            pkColumns.forEach(colName => {
              constraintsToAdd.push({ fieldName: colName, constraint: constraintType });
            });
          }
          continue;
        }

        // 3. Check for separate UNIQUE definition
        if (line.toLowerCase().startsWith("unique")) {
          const uniqueMatch = line.match(uniqueClauseRegex);
          if (uniqueMatch) {
            const uniqueColumns = restoreCommas(uniqueMatch[1]).split(',').map(col => col.replace(/[\"\'`]/g, "").trim());
            uniqueColumns.forEach(colName => {
              constraintsToAdd.push({ fieldName: colName, constraint: "unique" });
            });
          }
          continue;
        }

        // 4. Skip simple KEY index or CONSTRAINT lines
        if (line.match(/^\s*(?:KEY|INDEX)\s+/i) || line.toLowerCase().startsWith("constraint")) {
           continue;
        }

        // 5. Attempt to parse as a column definition
        const fieldMatch = line.match(/^([^\s]+)\s+([^\s]+(?:\s*\(.*\))?)\s*(.*)/i);
        if (fieldMatch) {
            const [_, name, type, constraintsText] = fieldMatch;
            const cleanedName = name.replace(/[\"\'`]/g, "").trim();
            const constraints: string[] = [];
            const cleanedType = type.trim();

            // Add inline constraints (PK here is always single column)
            if (constraintsText.toLowerCase().includes("primary key")) constraints.push("pk");
            if (constraintsText.toLowerCase().includes("not null")) constraints.push("not null");
            if (constraintsText.toLowerCase().includes("unique")) constraints.push("unique");

            const referenceMatch = constraintsText.match(/REFERENCES\s+([^\s(]+)\s*\(\s*([^\s)]+)\s*\)/i);
            if (referenceMatch) {
              constraints.push("fk");
              const targetTableInline = referenceMatch[1].replace(/[\"\'`]/g, "").trim();
              const targetFieldInline = referenceMatch[2].replace(/[\"\'`]/g, "").trim();
              edges.push({
                id: `${tableName}-${targetTableInline}-${cleanedName}`,
                source: tableName,
                target: targetTableInline,
                sourceField: cleanedName,
                targetField: targetFieldInline,
                relationshipType: { type: "one-to-many", sourceRequired: constraints.includes("not null"), targetRequired: true },
              });
            }
            fields.push({
              name: cleanedName,
              type: cleanedType,
              constraints,
            });
        }
      }

      // After processing all lines, apply collected constraints
      constraintsToAdd.forEach(({ fieldName, constraint }) => {
        const fieldToUpdate = fields.find(f => f.name === fieldName);
        if (fieldToUpdate && !fieldToUpdate.constraints.includes(constraint)) {
          fieldToUpdate.constraints.push(constraint);
        }
      });

      // Add the table node if it has fields
      if (fields.length > 0) {
        nodes.push({
          id: tableName,
          name: tableName,
          fields,
        });
      }
    }

    console.log("Parsed Structure (Composite PK Handled):", { nodes, edges });
    return { nodes, edges };
  } catch (error) {
    console.error("SQL parsing error:", error);
    throw new Error(`Failed to parse SQL: ${error instanceof Error ? error.message : String(error)}`);
  }
}
