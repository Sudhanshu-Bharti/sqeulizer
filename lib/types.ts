export interface DbmlStructure {
  nodes: {
    id: string;
    data: {
      name: string;
      columns: Array<{
        name: string;
        type: string;
        isPrimaryKey?: boolean;
        isForeignKey?: boolean;
        isNullable?: boolean;
        references?: {
          table: string;
          column: string;
        };
      }>;
    };
  }[];
  edges: {
    id: string;
    source: string;
    target: string;
    data?: {
      sourceColumn?: string;
      targetColumn?: string;
    };
  }[];
} 