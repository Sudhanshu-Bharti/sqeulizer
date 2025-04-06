interface TableNode {
  id: string;
  name: string;
  fields: {
    name: string;
    type: string;
    constraints: string[];
  }[];
}

interface ParseResult {
  nodes: TableNode[];
  edges: any[];
}

export function parseDBML(schema: string, dialect: string): ParseResult {
  const nodes: TableNode[] = [];
  const edges: any[] = [];
  const tableRegex = /Table\s+(\w+)\s*{([^}]*)}/g;
  const fieldRegex = /(\w+)\s+(\w+)(?:\s*\[([^\]]*)\])?/g;
  const refRegex = /Ref:\s*(\w+)\.(\w+)\s*<\s*(\w+)\.(\w+)/g;

  let match;
  const tables = new Map<string, TableNode>();

  // Parse tables
  while ((match = tableRegex.exec(schema)) !== null) {
    const [, tableName, tableContent] = match;
    const fields: TableNode["fields"] = [];
    let fieldMatch;

    while ((fieldMatch = fieldRegex.exec(tableContent)) !== null) {
      const [, fieldName, fieldType, constraints] = fieldMatch;
      fields.push({
        name: fieldName,
        type: fieldType,
        constraints: constraints ? constraints.split(",").map(c => c.trim()) : [],
      });
    }

    const node: TableNode = {
      id: tableName,
      name: tableName,
      fields,
    };

    tables.set(tableName, node);
    nodes.push(node);
  }

  // Parse references
  while ((match = refRegex.exec(schema)) !== null) {
    const [, fromTable, fromField, toTable, toField] = match;
    
    if (tables.has(fromTable) && tables.has(toTable)) {
      edges.push({
        id: `e${edges.length}`,
        source: fromTable,
        target: toTable,
        sourceHandle: fromField,
        targetHandle: toField,
        type: "smoothstep",
        animated: false,
      });
    }
  }

  return { nodes, edges };
} 