interface TableField {
  name: string;
  type: string;
  constraints: string[];
}

interface CustomRule {
  name: string;
  description: string;
  check: (table: TableNode) => SecurityIssue[];
}

interface AnalyzerConfig {
  strictMode: boolean;
  ignoreInfoIssues: boolean;
  customRules: CustomRule[];
  performanceThresholds: {
    maxTableWidth: number;
    maxVarcharSize: number;
  };
}

interface TableNode {
  id: string;
  name: string;
  fields: TableField[];
}

interface Relationship {
  id: string;
  source: string;
  target: string;
  sourceField: string;
  targetField: string;
  relationshipType: {
    type: "one-to-many" | "one-to-one" | "many-to-many";
    sourceRequired: boolean;
    targetRequired: boolean;
  };
}

export interface SecurityIssue {
  type: "critical" | "warning" | "info";
  category:
    | "authentication"
    | "authorization"
    | "data-integrity"
    | "injection"
    | "encryption"
    | "audit"
    | "performance";
  table: string;
  field?: string;
  title: string;
  description: string;
  recommendation: string;
  impact: "high" | "medium" | "low";
}

export interface NormalizationIssue {
  type: "violation" | "warning" | "suggestion";
  normalForm: "1NF" | "2NF" | "3NF" | "BCNF";
  table: string;
  fields?: string[];
  title: string;
  description: string;
  recommendation: string;
}

export interface RobustnessMetric {
  category: "performance" | "maintainability" | "scalability" | "reliability";
  metric: string;
  score: number; // 0-100
  status: "excellent" | "good" | "fair" | "poor";
  description: string;
  suggestions: string[];
}

export interface SchemaAnalysisResult {
  overallScore: number;
  securityIssues: SecurityIssue[];
  normalizationIssues: NormalizationIssue[];
  robustnessMetrics: RobustnessMetric[];
  summary: {
    totalTables: number;
    totalFields: number;
    totalRelationships: number;
    securityScore: number;
    normalizationScore: number;
    robustnessScore: number;
  };
}

export class DatabaseSchemaAnalyzer {
  private tables: TableNode[];
  private relationships: Relationship[];

  constructor(tables: TableNode[], relationships: Relationship[]) {
    this.tables = tables;
    this.relationships = relationships;
  }

  public analyze(): SchemaAnalysisResult {
    const securityIssues = this.analyzeSecurityIssues();
    const normalizationIssues = this.analyzeNormalization();
    const robustnessMetrics = this.analyzeRobustness();

    const securityScore = this.calculateSecurityScore(securityIssues);
    const normalizationScore =
      this.calculateNormalizationScore(normalizationIssues);
    const robustnessScore = this.calculateRobustnessScore(robustnessMetrics);
    const overallScore = Math.round(
      (securityScore + normalizationScore + robustnessScore) / 3
    );

    return {
      overallScore,
      securityIssues,
      normalizationIssues,
      robustnessMetrics,
      summary: {
        totalTables: this.tables.length,
        totalFields: this.tables.reduce(
          (sum, table) => sum + table.fields.length,
          0
        ),
        totalRelationships: this.relationships.length,
        securityScore,
        normalizationScore,
        robustnessScore,
      },
    };
  }
  private analyzeSecurityIssues(): SecurityIssue[] {
    const issues: SecurityIssue[] = [];

    for (const table of this.tables) {
      // Check for password security
      issues.push(...this.checkPasswordSecurity(table));

      // Check for sensitive data exposure
      issues.push(...this.checkSensitiveDataExposure(table));

      // Check for missing audit trails
      issues.push(...this.checkAuditTrails(table));

      // Check for injection vulnerabilities
      issues.push(...this.checkInjectionVulnerabilities(table));

      // Check for access control
      issues.push(...this.checkAccessControl(table));

      // Check for primary key presence
      issues.push(...this.checkPrimaryKeyPresence(table));

      // Check for NOT NULL constraints on important fields
      issues.push(...this.checkNullConstraints(table));
    }

    // Check for relationship integrity issues
    issues.push(...this.validateRelationshipIntegrity());

    // Check for reserved word usage
    issues.push(...this.checkReservedWords());

    return issues;
  }

  private checkPasswordSecurity(table: TableNode): SecurityIssue[] {
    const issues: SecurityIssue[] = [];

    const passwordFields = table.fields.filter(
      (field) =>
        field.name.toLowerCase().includes("password") ||
        field.name.toLowerCase().includes("passwd") ||
        field.name.toLowerCase().includes("pwd")
    );

    for (const field of passwordFields) {
      if (
        !field.name.toLowerCase().includes("hash") &&
        !field.name.toLowerCase().includes("encrypted")
      ) {
        issues.push({
          type: "critical",
          category: "authentication",
          table: table.name,
          field: field.name,
          title: "Potential Plain Text Password Storage",
          description: `Field "${field.name}" appears to store passwords but doesn't indicate hashing or encryption.`,
          recommendation:
            "Use password_hash, password_encrypted, or similar naming. Store only hashed passwords using bcrypt, scrypt, or Argon2.",
          impact: "high",
        });
      }

      if (
        field.type.toLowerCase().includes("varchar") &&
        field.type.includes("(") &&
        parseInt(field.type.match(/\((\d+)\)/)?.[1] || "0") < 60
      ) {
        issues.push({
          type: "warning",
          category: "authentication",
          table: table.name,
          field: field.name,
          title: "Insufficient Password Hash Length",
          description: `Password field "${field.name}" has insufficient length for modern hash algorithms.`,
          recommendation:
            "Use VARCHAR(255) or TEXT for password hashes to accommodate different hash algorithms.",
          impact: "medium",
        });
      }
    }

    return issues;
  }

  private checkSensitiveDataExposure(table: TableNode): SecurityIssue[] {
    const issues: SecurityIssue[] = [];

    const sensitiveFieldNames = [
      "ssn",
      "social_security",
      "credit_card",
      "card_number",
      "cvv",
      "ccv",
      "bank_account",
      "routing_number",
      "tax_id",
      "passport",
      "driver_license",
    ];

    for (const field of table.fields) {
      const fieldNameLower = field.name.toLowerCase();

      if (
        sensitiveFieldNames.some((sensitive) =>
          fieldNameLower.includes(sensitive)
        )
      ) {
        if (
          !fieldNameLower.includes("encrypted") &&
          !fieldNameLower.includes("hash")
        ) {
          issues.push({
            type: "critical",
            category: "encryption",
            table: table.name,
            field: field.name,
            title: "Unencrypted Sensitive Data",
            description: `Field "${field.name}" appears to store sensitive data without encryption.`,
            recommendation:
              "Encrypt sensitive data at rest using AES-256 or similar. Consider using database-level encryption or application-level encryption.",
            impact: "high",
          });
        }
      }

      // Check for email fields without proper constraints
      if (fieldNameLower === "email" || fieldNameLower.includes("email")) {
        if (!field.constraints.includes("unique")) {
          issues.push({
            type: "warning",
            category: "data-integrity",
            table: table.name,
            field: field.name,
            title: "Email Field Without Unique Constraint",
            description: `Email field "${field.name}" should have a unique constraint to prevent duplicate accounts.`,
            recommendation:
              "Add UNIQUE constraint to email fields used for authentication.",
            impact: "medium",
          });
        }
      }
    }

    return issues;
  }

  private checkAuditTrails(table: TableNode): SecurityIssue[] {
    const issues: SecurityIssue[] = [];

    const hasCreatedAt = table.fields.some(
      (field) =>
        field.name.toLowerCase().includes("created") &&
        field.name.toLowerCase().includes("at")
    );
    const hasUpdatedAt = table.fields.some(
      (field) =>
        field.name.toLowerCase().includes("updated") &&
        field.name.toLowerCase().includes("at")
    );
    const hasDeletedAt = table.fields.some(
      (field) =>
        field.name.toLowerCase().includes("deleted") &&
        field.name.toLowerCase().includes("at")
    );

    // Skip system/junction tables
    const isSystemTable =
      table.name.toLowerCase().includes("_") && table.fields.length <= 3;

    if (!isSystemTable) {
      if (!hasCreatedAt) {
        issues.push({
          type: "warning",
          category: "audit",
          table: table.name,
          title: "Missing Creation Timestamp",
          description: `Table "${table.name}" lacks a creation timestamp field.`,
          recommendation:
            "Add created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP for audit trail.",
          impact: "medium",
        });
      }

      if (!hasUpdatedAt) {
        issues.push({
          type: "info",
          category: "audit",
          table: table.name,
          title: "Missing Update Timestamp",
          description: `Table "${table.name}" lacks an update timestamp field.`,
          recommendation:
            "Add updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP for change tracking.",
          impact: "low",
        });
      }

      // Recommend soft deletes for important tables
      const isImportantTable = table.fields.some(
        (field) =>
          field.constraints.includes("pk") ||
          field.name.toLowerCase().includes("user") ||
          table.name.toLowerCase().includes("user") ||
          table.name.toLowerCase().includes("customer")
      );

      if (isImportantTable && !hasDeletedAt) {
        issues.push({
          type: "info",
          category: "audit",
          table: table.name,
          title: "Consider Soft Delete Pattern",
          description: `Important table "${table.name}" could benefit from soft delete capability.`,
          recommendation:
            "Add deleted_at TIMESTAMP NULL for soft delete pattern to maintain data integrity and audit trail.",
          impact: "low",
        });
      }
    }

    return issues;
  }

  private checkInjectionVulnerabilities(table: TableNode): SecurityIssue[] {
    const issues: SecurityIssue[] = [];

    for (const field of table.fields) {
      // Check for very large text fields that might be vulnerable to injection
      if (
        field.type.toLowerCase() === "text" ||
        (field.type.toLowerCase().includes("varchar") &&
          field.type.includes("(") &&
          parseInt(field.type.match(/\((\d+)\)/)?.[1] || "0") > 1000)
      ) {
        issues.push({
          type: "info",
          category: "injection",
          table: table.name,
          field: field.name,
          title: "Large Text Field Requires Input Validation",
          description: `Field "${field.name}" accepts large text input and requires proper validation.`,
          recommendation:
            "Implement input validation, sanitization, and parameterized queries. Consider length limits based on business requirements.",
          impact: "medium",
        });
      }
    }

    return issues;
  }

  private checkAccessControl(table: TableNode): SecurityIssue[] {
    const issues: SecurityIssue[] = [];

    // Check for user/role management tables
    const isUserTable =
      table.name.toLowerCase().includes("user") ||
      table.name.toLowerCase().includes("account");

    if (isUserTable) {
      const hasRoleField = table.fields.some(
        (field) =>
          field.name.toLowerCase().includes("role") ||
          field.name.toLowerCase().includes("permission") ||
          field.name.toLowerCase().includes("access")
      );

      if (!hasRoleField) {
        issues.push({
          type: "warning",
          category: "authorization",
          table: table.name,
          title: "Missing Role-Based Access Control",
          description: `User table "${table.name}" lacks role or permission fields.`,
          recommendation:
            "Consider adding role-based access control fields for proper authorization.",
          impact: "medium",
        });
      }
    }

    return issues;
  }
  private analyzeNormalization(): NormalizationIssue[] {
    const issues: NormalizationIssue[] = [];

    for (const table of this.tables) {
      // Check First Normal Form (1NF)
      issues.push(...this.check1NF(table));

      // Check Second Normal Form (2NF)
      issues.push(...this.check2NF(table));

      // Check Third Normal Form (3NF)
      issues.push(...this.check3NF(table));

      // Validate data types for normalization
      issues.push(...this.validateDataTypes(table));
    }

    return issues;
  }

  private check1NF(table: TableNode): NormalizationIssue[] {
    const issues: NormalizationIssue[] = [];

    for (const field of table.fields) {
      // Check for fields that might contain multiple values
      const fieldNameLower = field.name.toLowerCase();
      const multiValueIndicators = [
        "list",
        "array",
        "comma",
        "separated",
        "multiple",
        "tags",
        "categories",
      ];

      if (
        multiValueIndicators.some((indicator) =>
          fieldNameLower.includes(indicator)
        )
      ) {
        issues.push({
          type: "violation",
          normalForm: "1NF",
          table: table.name,
          fields: [field.name],
          title: "Potential 1NF Violation - Multiple Values in Single Field",
          description: `Field "${field.name}" may contain multiple values, violating atomicity.`,
          recommendation:
            "Create a separate table for multiple values with proper foreign key relationships.",
        });
      }

      // Check for JSON/JSONB fields that might indicate denormalization
      if (field.type.toLowerCase().includes("json")) {
        issues.push({
          type: "suggestion",
          normalForm: "1NF",
          table: table.name,
          fields: [field.name],
          title: "JSON Field May Indicate Denormalization",
          description: `JSON field "${field.name}" might contain structured data that could be normalized.`,
          recommendation:
            "Consider if the JSON data should be normalized into separate tables for better query performance and data integrity.",
        });
      }
    }

    return issues;
  }

  private check2NF(table: TableNode): NormalizationIssue[] {
    const issues: NormalizationIssue[] = [];

    const primaryKeys = table.fields.filter(
      (field) =>
        field.constraints.includes("pk") ||
        field.constraints.includes("composite-pk")
    );

    // 2NF is only relevant for tables with composite primary keys
    if (primaryKeys.length > 1) {
      // Look for fields that might be partially dependent on the primary key
      const nonKeyFields = table.fields.filter(
        (field) => !primaryKeys.includes(field)
      );

      for (const field of nonKeyFields) {
        //  heuristic: if field name contains part of a primary key name, it might be partially dependent
        const fieldNameLower = field.name.toLowerCase();
        for (const pk of primaryKeys) {
          const pkNameLower = pk.name.toLowerCase();
          if (
            fieldNameLower.includes(pkNameLower.split("_")[0]) &&
            fieldNameLower !== pkNameLower
          ) {
            issues.push({
              type: "warning",
              normalForm: "2NF",
              table: table.name,
              fields: [field.name, pk.name],
              title: "Potential 2NF Violation - Partial Dependency",
              description: `Field "${field.name}" might be partially dependent on primary key component "${pk.name}".`,
              recommendation:
                "Consider moving partially dependent fields to a separate table.",
            });
          }
        }
      }
    }

    return issues;
  }

  private check3NF(table: TableNode): NormalizationIssue[] {
    const issues: NormalizationIssue[] = [];

    // Look for transitive dependencies
    const nonKeyFields = table.fields.filter(
      (field) =>
        !field.constraints.includes("pk") &&
        !field.constraints.includes("composite-pk")
    );

    // Simple heuristic: look for fields that might form transitive dependencies
    for (let i = 0; i < nonKeyFields.length; i++) {
      for (let j = i + 1; j < nonKeyFields.length; j++) {
        const field1 = nonKeyFields[i];
        const field2 = nonKeyFields[j];

        // Check if one field name contains the root of another (potential dependency)
        const name1Parts = field1.name.toLowerCase().split("_");
        const name2Parts = field2.name.toLowerCase().split("_");

        if (name1Parts.length > 1 && name2Parts.length > 1) {
          const commonRoot = name1Parts.find((part) =>
            name2Parts.includes(part)
          );
          if (commonRoot && commonRoot !== "id" && commonRoot !== "name") {
            issues.push({
              type: "suggestion",
              normalForm: "3NF",
              table: table.name,
              fields: [field1.name, field2.name],
              title: "Potential 3NF Violation - Transitive Dependency",
              description: `Fields "${field1.name}" and "${field2.name}" might have a transitive dependency.`,
              recommendation:
                "Consider if these related fields should be moved to a separate table to eliminate transitive dependencies.",
            });
            break;
          }
        }
      }
    }

    return issues;
  }
  private analyzeRobustness(): RobustnessMetric[] {
    const metrics: RobustnessMetric[] = [];

    // Index coverage metric
    metrics.push(this.analyzeIndexCoverage());

    // Foreign key integrity
    metrics.push(this.analyzeForeignKeyIntegrity());

    // Naming conventions
    metrics.push(this.analyzeNamingConventions());

    // Data type consistency
    metrics.push(this.analyzeDataTypeConsistency());

    // Scalability indicators
    metrics.push(this.analyzeScalabilityIndicators());

    // Performance anti-patterns
    metrics.push(this.checkPerformanceAntiPatterns());

    return metrics;
  }

  private analyzeIndexCoverage(): RobustnessMetric {
    let score = 60; // Base score
    const suggestions: string[] = [];

    const foreignKeyFields = this.tables.flatMap((table) =>
      table.fields.filter((field) => field.constraints.includes("fk"))
    );

    // Foreign keys should have indexes for performance
    if (foreignKeyFields.length > 0) {
      score += 20;
      suggestions.push(
        "Foreign key fields identified - ensure they have indexes for optimal join performance."
      );
    }

    // Check for potential composite indexes
    const tablesWithMultipleFKs = this.tables.filter(
      (table) =>
        table.fields.filter((field) => field.constraints.includes("fk"))
          .length > 1
    );

    if (tablesWithMultipleFKs.length > 0) {
      suggestions.push(
        "Consider composite indexes for tables with multiple foreign keys based on query patterns."
      );
    }

    const status =
      score >= 80
        ? "excellent"
        : score >= 60
        ? "good"
        : score >= 40
        ? "fair"
        : "poor";

    return {
      category: "performance",
      metric: "Index Coverage",
      score,
      status,
      description:
        "Evaluation of potential indexing strategy for optimal query performance.",
      suggestions,
    };
  }

  private analyzeForeignKeyIntegrity(): RobustnessMetric {
    let score = 50;
    const suggestions: string[] = [];

    const totalRelationships = this.relationships.length;
    const foreignKeyFields = this.tables.flatMap((table) =>
      table.fields.filter((field) => field.constraints.includes("fk"))
    ).length;

    // Score based on relationship consistency
    if (totalRelationships > 0 && foreignKeyFields > 0) {
      const ratio = foreignKeyFields / totalRelationships;
      score = Math.min(100, 50 + ratio * 50);
    }

    if (totalRelationships === 0) {
      suggestions.push(
        "No relationships detected - consider adding foreign key constraints for data integrity."
      );
    } else {
      suggestions.push(
        "Maintain referential integrity with proper foreign key constraints."
      );
      suggestions.push(
        "Consider cascading delete/update rules based on business requirements."
      );
    }

    const status =
      score >= 80
        ? "excellent"
        : score >= 60
        ? "good"
        : score >= 40
        ? "fair"
        : "poor";

    return {
      category: "reliability",
      metric: "Foreign Key Integrity",
      score,
      status,
      description:
        "Assessment of referential integrity through foreign key relationships.",
      suggestions,
    };
  }

  private analyzeNamingConventions(): RobustnessMetric {
    let score = 70;
    const suggestions: string[] = [];

    // Check table naming consistency
    const tableNames = this.tables.map((table) => table.name);
    const isSnakeCase = tableNames.every((name) =>
      /^[a-z][a-z0-9_]*$/.test(name)
    );
    const isPascalCase = tableNames.every((name) =>
      /^[A-Z][a-zA-Z0-9]*$/.test(name)
    );

    if (!isSnakeCase && !isPascalCase) {
      score -= 15;
      suggestions.push(
        "Inconsistent table naming convention. Choose either snake_case or PascalCase consistently."
      );
    }

    // Check field naming consistency
    let consistentFieldNaming = true;
    for (const table of this.tables) {
      const fieldNames = table.fields.map((field) => field.name);
      const tableIsSnakeCase = fieldNames.every((name) =>
        /^[a-z][a-z0-9_]*$/.test(name)
      );
      const tableIsPascalCase = fieldNames.every((name) =>
        /^[a-z][a-zA-Z0-9]*$/.test(name)
      );

      if (!tableIsSnakeCase && !tableIsPascalCase) {
        consistentFieldNaming = false;
        break;
      }
    }

    if (!consistentFieldNaming) {
      score -= 10;
      suggestions.push("Inconsistent field naming convention within tables.");
    }

    // Check for primary key naming
    const pkNamingConsistent = this.tables.every((table) => {
      const pkFields = table.fields.filter((field) =>
        field.constraints.includes("pk")
      );
      return (
        pkFields.length === 0 ||
        pkFields.some(
          (field) => field.name === "id" || field.name.endsWith("_id")
        )
      );
    });

    if (!pkNamingConsistent) {
      score -= 5;
      suggestions.push(
        'Consider consistent primary key naming (e.g., "id" or "table_id").'
      );
    }

    const status =
      score >= 80
        ? "excellent"
        : score >= 60
        ? "good"
        : score >= 40
        ? "fair"
        : "poor";

    return {
      category: "maintainability",
      metric: "Naming Conventions",
      score,
      status,
      description:
        "Consistency of naming conventions across tables and fields.",
      suggestions,
    };
  }

  private analyzeDataTypeConsistency(): RobustnessMetric {
    let score = 75;
    const suggestions: string[] = [];

    // Check for consistent ID field types
    const idFields = this.tables.flatMap((table) =>
      table.fields.filter(
        (field) =>
          field.name.toLowerCase() === "id" ||
          field.name.toLowerCase().endsWith("_id")
      )
    );

    const idTypes = [
      ...new Set(idFields.map((field) => field.type.toLowerCase())),
    ];
    if (idTypes.length > 2) {
      score -= 15;
      suggestions.push(
        "Inconsistent ID field types. Consider standardizing on SERIAL/BIGSERIAL or UUID."
      );
    }

    // Check for timestamp consistency
    const timestampFields = this.tables.flatMap((table) =>
      table.fields.filter(
        (field) =>
          field.name.toLowerCase().includes("_at") ||
          field.name.toLowerCase().includes("time") ||
          field.name.toLowerCase().includes("date")
      )
    );

    const timestampTypes = [
      ...new Set(timestampFields.map((field) => field.type.toLowerCase())),
    ];
    if (timestampTypes.length > 2) {
      score -= 10;
      suggestions.push(
        "Inconsistent timestamp field types. Standardize on TIMESTAMP or TIMESTAMPTZ."
      );
    }

    suggestions.push(
      "Use appropriate data types for the expected data range and precision."
    );

    const status =
      score >= 80
        ? "excellent"
        : score >= 60
        ? "good"
        : score >= 40
        ? "fair"
        : "poor";

    return {
      category: "maintainability",
      metric: "Data Type Consistency",
      score,
      status,
      description: "Consistency of data types across similar fields.",
      suggestions,
    };
  }

  private analyzeScalabilityIndicators(): RobustnessMetric {
    let score = 65;
    const suggestions: string[] = [];

    // Check for potential scalability patterns
    const hasPartitioning = this.tables.some(
      (table) => table.name.includes("_") && /\d+$/.test(table.name)
    );

    if (hasPartitioning) {
      score += 15;
      suggestions.push(
        "Table partitioning pattern detected - good for scalability."
      );
    }

    // Check for audit trail support
    const hasAuditTrails = this.tables.some(
      (table) =>
        table.fields.some((field) =>
          field.name.toLowerCase().includes("created_at")
        ) &&
        table.fields.some((field) =>
          field.name.toLowerCase().includes("updated_at")
        )
    );

    if (hasAuditTrails) {
      score += 10;
      suggestions.push(
        "Audit trail fields present - supports change tracking."
      );
    }

    // Check for soft delete pattern
    const hasSoftDelete = this.tables.some((table) =>
      table.fields.some((field) =>
        field.name.toLowerCase().includes("deleted_at")
      )
    );

    if (hasSoftDelete) {
      score += 5;
      suggestions.push(
        "Soft delete pattern detected - supports data recovery."
      );
    }

    suggestions.push("Consider horizontal partitioning for large tables.");
    suggestions.push(
      "Implement proper indexing strategy for high-traffic queries."
    );

    const status =
      score >= 80
        ? "excellent"
        : score >= 60
        ? "good"
        : score >= 40
        ? "fair"
        : "poor";

    return {
      category: "scalability",
      metric: "Scalability Indicators",
      score,
      status,
      description: "Assessment of schema features that support scalability.",
      suggestions,
    };
  }

  private calculateSecurityScore(issues: SecurityIssue[]): number {
    let score = 100;

    for (const issue of issues) {
      switch (issue.type) {
        case "critical":
          score -=
            issue.impact === "high" ? 15 : issue.impact === "medium" ? 10 : 5;
          break;
        case "warning":
          score -=
            issue.impact === "high" ? 10 : issue.impact === "medium" ? 7 : 3;
          break;
        case "info":
          score -=
            issue.impact === "high" ? 5 : issue.impact === "medium" ? 3 : 1;
          break;
      }
    }

    return Math.max(0, score);
  }

  private calculateNormalizationScore(issues: NormalizationIssue[]): number {
    let score = 100;

    for (const issue of issues) {
      switch (issue.type) {
        case "violation":
          score -= 15;
          break;
        case "warning":
          score -= 10;
          break;
        case "suggestion":
          score -= 5;
          break;
      }
    }

    return Math.max(0, score);
  }

  private calculateRobustnessScore(metrics: RobustnessMetric[]): number {
    if (metrics.length === 0) return 50;

    const averageScore =
      metrics.reduce((sum, metric) => sum + metric.score, 0) / metrics.length;
    return Math.round(averageScore);
  }

  private checkPrimaryKeyPresence(table: TableNode): SecurityIssue[] {
    const issues: SecurityIssue[] = [];

    // Skip system/junction tables with few columns
    const isSystemTable =
      table.name.toLowerCase().includes("_") && table.fields.length <= 3;

    if (isSystemTable) {
      return issues;
    }

    const hasPrimaryKey = table.fields.some(
      (field) =>
        field.constraints.includes("pk") ||
        field.constraints.includes("composite-pk")
    );

    if (!hasPrimaryKey) {
      issues.push({
        type: "critical",
        category: "data-integrity",
        table: table.name,
        title: "Missing Primary Key",
        description: `Table "${table.name}" does not have a defined primary key.`,
        recommendation:
          "Add a primary key to ensure data integrity and optimal query performance. Consider using an auto-incrementing integer (serial/identity) or UUID.",
        impact: "high",
      });
    }

    return issues;
  }
  private checkNullConstraints(table: TableNode): SecurityIssue[] {
    const issues: SecurityIssue[] = [];

    // Critical fields that should always have NOT NULL constraint
    const criticalFields = [
      { pattern: "id", category: "data-integrity" },
      { pattern: "email", category: "data-integrity" },
      { pattern: "password", category: "authentication" },
      { pattern: "username", category: "authentication" },
      { pattern: "amount", category: "data-integrity" },
      { pattern: "total", category: "data-integrity" },
      { pattern: "price", category: "data-integrity" },
      { pattern: "payment", category: "data-integrity" },
      { pattern: "status", category: "data-integrity" },
    ];

    for (const field of table.fields) {
      // Skip fields that are foreign keys and may legitimately be NULL
      // for optional relationships or fields with default values
      if (
        field.constraints.includes("fk") &&
        !field.constraints.includes("pk")
      ) {
        continue;
      }

      const fieldNameLower = field.name.toLowerCase();

      // Check if this is a critical field based on name patterns
      const matchedCriticalField = criticalFields.find((cf) =>
        fieldNameLower.includes(cf.pattern)
      );

      if (matchedCriticalField && !field.constraints.includes("not null")) {
        issues.push({
          type: "warning",
          category: matchedCriticalField.category as any, // Type cast to satisfy TypeScript
          table: table.name,
          field: field.name,
          title: "Missing NOT NULL Constraint on Critical Field",
          description: `Field "${field.name}" in table "${table.name}" should have a NOT NULL constraint.`,
          recommendation: `Add NOT NULL constraint to the "${field.name}" field to prevent null values that could affect application logic or data integrity.`,
          impact: "medium",
        });
      }
    }

    return issues;
  }
  // Missing: Orphaned foreign keys and circular dependencies
  private validateRelationshipIntegrity(): SecurityIssue[] {
    const issues: SecurityIssue[] = [];

    // Check for orphaned relationships (referencing non-existent tables)
    const tableNames = new Set(this.tables.map((table) => table.name));

    // Build a graph of relationships to detect circular dependencies
    const relationshipGraph = new Map<string, string[]>();

    // Track references to validate they exist
    const foreignKeys = new Map<string, { field: string; table: string }[]>();

    // Check foreign keys for existence/validity
    for (const relationship of this.relationships) {
      // Check if source table exists
      if (!tableNames.has(relationship.source)) {
        issues.push({
          type: "critical",
          category: "data-integrity",
          table: relationship.source,
          field: relationship.sourceField,
          title: "Invalid Relationship Source Table",
          description: `Relationship references non-existent source table "${relationship.source}".`,
          recommendation:
            "Fix or remove the invalid foreign key reference. The referenced source table does not exist.",
          impact: "high",
        });
      }

      // Check if target table exists
      if (!tableNames.has(relationship.target)) {
        issues.push({
          type: "critical",
          category: "data-integrity",
          table: relationship.source,
          field: relationship.sourceField,
          title: "Invalid Relationship Target Table",
          description: `Foreign key in "${relationship.source}.${relationship.sourceField}" references non-existent target table "${relationship.target}".`,
          recommendation:
            "Fix or remove the invalid foreign key reference. The referenced target table does not exist.",
          impact: "high",
        });
      }

      // Build graph for circular dependency detection
      if (!relationshipGraph.has(relationship.source)) {
        relationshipGraph.set(relationship.source, []);
      }
      relationshipGraph.get(relationship.source)?.push(relationship.target);

      // Track foreign key for unindexed detection
      if (!foreignKeys.has(relationship.source)) {
        foreignKeys.set(relationship.source, []);
      }
      foreignKeys.get(relationship.source)?.push({
        field: relationship.sourceField,
        table: relationship.target,
      });
    }

    // Check for circular dependencies
    const circularDeps = this.detectCircularDependencies(relationshipGraph);
    for (const cycle of circularDeps) {
      issues.push({
        type: "warning",
        category: "data-integrity",
        table: cycle[0], // Use first table in cycle as reference
        title: "Circular Dependency Detected",
        description: `Circular dependency found in tables: ${cycle.join(
          " → "
        )} → ${cycle[0]}`,
        recommendation:
          "Review the circular reference pattern and consider restructuring. Circular dependencies can cause insertion order problems and cascading deletion issues.",
        impact: "medium",
      });
    }

    // Check for unindexed foreign keys
    const unindexedForeignKeys = this.findUnindexedForeignKeys(foreignKeys);
    issues.push(...unindexedForeignKeys);

    return issues;
  }

  private detectCircularDependencies(graph: Map<string, string[]>): string[][] {
    const visited = new Set<string>();
    const pathStack: string[] = [];
    const cycles: string[][] = [];

    function dfs(node: string, onPath: Set<string>) {
      if (onPath.has(node)) {
        // Found a cycle
        const cycleStart = pathStack.indexOf(node);
        cycles.push(pathStack.slice(cycleStart).concat(node));
        return;
      }

      if (visited.has(node)) {
        return;
      }

      visited.add(node);
      onPath.add(node);
      pathStack.push(node);

      const neighbors = graph.get(node) || [];
      for (const neighbor of neighbors) {
        dfs(neighbor, onPath);
      }

      pathStack.pop();
      onPath.delete(node);
    }

    // Start DFS from each node
    for (const node of graph.keys()) {
      if (!visited.has(node)) {
        dfs(node, new Set<string>());
      }
    }

    return cycles;
  }

  private findUnindexedForeignKeys(
    foreignKeys: Map<string, { field: string; table: string }[]>
  ): SecurityIssue[] {
    const issues: SecurityIssue[] = [];

    for (const [tableName, fks] of foreignKeys.entries()) {
      const table = this.tables.find((t) => t.name === tableName);

      if (!table) continue;

      for (const fk of fks) {
        // Check if this foreign key field has an index
        const field = table.fields.find((f) => f.name === fk.field);

        if (!field) continue;

        // Fields that are part of primary key are already indexed
        if (
          field.constraints.includes("pk") ||
          field.constraints.includes("composite-pk")
        ) {
          continue;
        }

        // Check if there's a unique constraint (which creates an index)
        if (field.constraints.includes("unique")) {
          continue;
        }

        // If we reached here, the foreign key is not indexed
        issues.push({
          type: "warning",
          category: "performance",
          table: tableName,
          field: fk.field,
          title: "Unindexed Foreign Key",
          description: `Foreign key "${fk.field}" in table "${tableName}" is not indexed.`,
          recommendation: `Add an index on "${fk.field}" to improve JOIN performance. Foreign keys are commonly used in JOINs, and indexing them significantly improves query performance.`,
          impact: "medium",
        });
      }
    }

    return issues;
  }

  private checkReservedWords(): SecurityIssue[] {
    const issues: SecurityIssue[] = [];

    // Common SQL reserved words across PostgreSQL, MySQL, and SQL Server
    const reservedWords = new Set([
      "absolute",
      "action",
      "add",
      "admin",
      "after",
      "aggregate",
      "all",
      "allocate",
      "alter",
      "analyse",
      "analyze",
      "and",
      "any",
      "are",
      "array",
      "as",
      "asc",
      "assertion",
      "at",
      "authorization",
      "backup",
      "before",
      "begin",
      "between",
      "binary",
      "bit",
      "blob",
      "boolean",
      "both",
      "breadth",
      "by",
      "call",
      "cascade",
      "cascaded",
      "case",
      "cast",
      "catalog",
      "check",
      "class",
      "clob",
      "close",
      "cluster",
      "collate",
      "collation",
      "column",
      "commit",
      "completion",
      "connect",
      "connection",
      "constraint",
      "constraints",
      "constructor",
      "continue",
      "convert",
      "corresponding",
      "create",
      "cross",
      "cube",
      "current",
      "current_date",
      "current_path",
      "current_role",
      "current_time",
      "current_timestamp",
      "current_user",
      "cursor",
      "cycle",
      "data",
      "database",
      "date",
      "day",
      "deallocate",
      "dec",
      "decimal",
      "declare",
      "default",
      "deferrable",
      "deferred",
      "delete",
      "depth",
      "deref",
      "desc",
      "describe",
      "descriptor",
      "destroy",
      "destructor",
      "deterministic",
      "diagnostics",
      "dictionary",
      "disconnect",
      "distinct",
      "do",
      "domain",
      "double",
      "drop",
      "dynamic",
      "each",
      "else",
      "end",
      "end-exec",
      "equals",
      "escape",
      "every",
      "except",
      "exception",
      "exec",
      "execute",
      "external",
      "extract",
      "false",
      "fetch",
      "first",
      "float",
      "for",
      "foreign",
      "found",
      "free",
      "from",
      "full",
      "function",
      "general",
      "get",
      "global",
      "go",
      "goto",
      "grant",
      "group",
      "grouping",
      "having",
      "host",
      "hour",
      "identity",
      "ignore",
      "immediate",
      "in",
      "indicator",
      "initialize",
      "initially",
      "inner",
      "inout",
      "input",
      "insert",
      "int",
      "integer",
      "intersect",
      "interval",
      "into",
      "is",
      "isolation",
      "iterate",
      "join",
      "key",
      "language",
      "large",
      "last",
      "lateral",
      "leading",
      "left",
      "less",
      "level",
      "like",
      "limit",
      "local",
      "localtime",
      "localtimestamp",
      "locator",
      "map",
      "match",
      "minute",
      "modifies",
      "modify",
      "module",
      "month",
      "names",
      "natural",
      "nchar",
      "nclob",
      "new",
      "next",
      "no",
      "none",
      "not",
      "null",
      "numeric",
      "object",
      "of",
      "off",
      "old",
      "on",
      "only",
      "open",
      "operation",
      "option",
      "or",
      "order",
      "ordinality",
      "out",
      "outer",
      "output",
      "pad",
      "parameter",
      "parameters",
      "partial",
      "path",
      "precision",
      "prepare",
      "preserve",
      "primary",
      "prior",
      "privileges",
      "procedure",
      "public",
      "read",
      "reads",
      "real",
      "recursive",
      "ref",
      "references",
      "referencing",
      "relative",
      "restrict",
      "result",
      "return",
      "returns",
      "revoke",
      "right",
      "role",
      "rollback",
      "rollup",
      "routine",
      "row",
      "rows",
      "savepoint",
      "schema",
      "scope",
      "scroll",
      "search",
      "second",
      "section",
      "select",
      "sequence",
      "session",
      "session_user",
      "set",
      "sets",
      "size",
      "smallint",
      "some",
      "space",
      "specific",
      "specifictype",
      "sql",
      "sqlexception",
      "sqlstate",
      "sqlwarning",
      "start",
      "state",
      "statement",
      "static",
      "structure",
      "system_user",
      "table",
      "temporary",
      "terminate",
      "than",
      "then",
      "time",
      "timestamp",
      "timezone_hour",
      "timezone_minute",
      "to",
      "trailing",
      "transaction",
      "translation",
      "treat",
      "trigger",
      "true",
      "under",
      "union",
      "unique",
      "unknown",
      "unnest",
      "update",
      "usage",
      "user",
      "using",
      "value",
      "values",
      "varchar",
      "variable",
      "varying",
      "view",
      "when",
      "whenever",
      "where",
      "while",
      "with",
      "without",
      "work",
      "write",
      "year",
      "zone",
    ]);

    // Check table names
    for (const table of this.tables) {
      const tableNameLower = table.name.toLowerCase();

      if (reservedWords.has(tableNameLower)) {
        issues.push({
          type: "warning",
          category: "data-integrity",
          table: table.name,
          title: "Table Name Uses Reserved Word",
          description: `Table name "${table.name}" is a SQL reserved word.`,
          recommendation: `Rename the table or ensure it's always quoted in SQL statements. Using reserved words as identifiers can cause syntax errors and maintenance issues.`,
          impact: "medium",
        });
      }

      // Check field names
      for (const field of table.fields) {
        const fieldNameLower = field.name.toLowerCase();

        if (reservedWords.has(fieldNameLower)) {
          issues.push({
            type: "info",
            category: "data-integrity",
            table: table.name,
            field: field.name,
            title: "Field Name Uses Reserved Word",
            description: `Field "${field.name}" in table "${table.name}" is a SQL reserved word.`,
            recommendation: `Rename the field or ensure it's always quoted in SQL statements. Using reserved words as identifiers requires special handling and can lead to errors.`,
            impact: "low",
          });
        }
      }
    }

    return issues;
  }
  private validateDataTypes(table: TableNode): NormalizationIssue[] {
    const issues: NormalizationIssue[] = [];

    for (const field of table.fields) {
      const fieldType = field.type.toLowerCase();

      // Check for oversized varchar fields
      if (fieldType.includes("varchar") && fieldType.includes("(")) {
        const sizeMatch = fieldType.match(/\((\d+)\)/);
        if (sizeMatch) {
          const size = parseInt(sizeMatch[1]);

          // Warn about extremely large VARCHAR fields - consider using TEXT instead
          if (size > 1000) {
            issues.push({
              type: "suggestion",
              normalForm: "3NF", // Domain integrity is part of 3NF
              table: table.name,
              fields: [field.name],
              title: "Consider Using TEXT Instead of Large VARCHAR",
              description: `Field "${field.name}" uses VARCHAR(${size}) which is very large.`,
              recommendation:
                "For strings that might exceed a few hundred characters, consider using TEXT datatype instead of a very large VARCHAR for better storage efficiency.",
            });
          }
        }
      }

      // Check for appropriate monetary data types
      const fieldNameLower = field.name.toLowerCase();
      const isCurrencyField =
        fieldNameLower.includes("price") ||
        fieldNameLower.includes("amount") ||
        fieldNameLower.includes("cost") ||
        fieldNameLower.includes("fee") ||
        fieldNameLower.includes("salary") ||
        fieldNameLower.includes("payment");

      if (isCurrencyField) {
        // Check if using proper types for currency (numeric/decimal)
        if (
          !fieldType.includes("numeric") &&
          !fieldType.includes("decimal") &&
          !fieldType.includes("money")
        ) {
          issues.push({
            type: "warning",
            normalForm: "3NF", // Domain integrity is part of 3NF
            table: table.name,
            fields: [field.name],
            title: "Inappropriate Data Type for Currency",
            description: `Field "${field.name}" appears to store monetary values but uses type "${field.type}".`,
            recommendation:
              "Use NUMERIC(precision,scale) or DECIMAL(precision,scale) for currency values to avoid rounding errors. For example, NUMERIC(10,2) for standard currency amounts.",
          });
        }
      }

      // Check if using deprecated or problematic types
      if (fieldType === "float" || fieldType === "real") {
        if (isCurrencyField) {
          issues.push({
            type: "violation",
            normalForm: "3NF", // Domain integrity is part of 3NF
            table: table.name,
            fields: [field.name],
            title: "Floating Point Type Used for Currency",
            description: `Field "${field.name}" uses floating-point type for what appears to be currency data.`,
            recommendation:
              "Never use floating-point types (FLOAT, REAL) for currency or precise calculations. Use NUMERIC or DECIMAL instead to avoid rounding errors.",
          });
        }
      }

      // Check if using text for boolean values
      if (
        (fieldType === "varchar" ||
          fieldType === "char" ||
          fieldType === "text") &&
        (fieldNameLower === "active" ||
          fieldNameLower === "enabled" ||
          fieldNameLower === "status" ||
          fieldNameLower.includes("is_") ||
          fieldNameLower.includes("has_"))
      ) {
        issues.push({
          type: "suggestion",
          normalForm: "3NF", // Domain integrity is part of 3NF
          table: table.name,
          fields: [field.name],
          title: "Consider Using BOOLEAN Type",
          description: `Field "${field.name}" might represent a boolean state but uses a string type.`,
          recommendation:
            "Consider using the BOOLEAN data type for fields that represent a true/false state instead of strings like 'Y'/'N' or '1'/'0'.",
        });
      }
    }

    return issues;
  }
  private checkPerformanceAntiPatterns(): RobustnessMetric {
    let score = 100;
    const suggestions: string[] = [];

    // Check for tables with too many columns (wide tables)
    const wideTables = this.tables.filter((table) => table.fields.length > 20);
    if (wideTables.length > 0) {
      score -= Math.min(20, wideTables.length * 5); // -5 points per wide table, max -20
      const wideTableNames = wideTables
        .map((t) => `"${t.name}" (${t.fields.length} columns)`)
        .join(", ");
      suggestions.push(
        `Consider vertically partitioning wide tables: ${wideTableNames}. Tables with many columns can cause performance issues due to increased I/O and memory usage.`
      );
    }

    // Check for tables with no primary key
    const tablesWithoutPK = this.tables.filter(
      (table) =>
        !table.fields.some(
          (field) =>
            field.constraints.includes("pk") ||
            field.constraints.includes("composite-pk")
        )
    );

    if (tablesWithoutPK.length > 0) {
      score -= Math.min(15, tablesWithoutPK.length * 3); // -3 points per table without PK, max -15
      const tableNames = tablesWithoutPK.map((t) => `"${t.name}"`).join(", ");
      suggestions.push(
        `Add primary keys to tables: ${tableNames}. Tables without primary keys can't use certain optimizations and may slow down as they grow.`
      );
    }

    // Check for potential excessive joins
    // Tables with many foreign keys might indicate a schema that requires many joins
    const tablesWithManyForeignKeys = this.tables.filter((table) => {
      const fkCount = table.fields.filter((field) =>
        field.constraints.includes("fk")
      ).length;
      return fkCount > 5; // Arbitrary threshold for "many" foreign keys
    });

    if (tablesWithManyForeignKeys.length > 0) {
      score -= Math.min(10, tablesWithManyForeignKeys.length * 5); // -5 points per table with many FKs, max -10
      const tableNames = tablesWithManyForeignKeys
        .map((t) => `"${t.name}"`)
        .join(", ");
      suggestions.push(
        `Tables with many foreign keys may indicate excessive join requirements: ${tableNames}. Consider denormalizing some data or implementing materialized views for frequently joined queries.`
      );
    }

    // Check for potentially poor indexing strategies
    // This is a simplified check - we're just counting FKs that don't appear to be indexed
    const unindexedForeignKeyCount = this.tables.reduce((count, table) => {
      const fkFields = table.fields.filter(
        (field) =>
          field.constraints.includes("fk") &&
          !field.constraints.includes("pk") &&
          !field.constraints.includes("composite-pk") &&
          !field.constraints.includes("unique")
      );
      return count + fkFields.length;
    }, 0);

    if (unindexedForeignKeyCount > 0) {
      score -= Math.min(15, unindexedForeignKeyCount * 2); // -2 points per unindexed FK, max -15
      suggestions.push(
        `Add indexes to ${unindexedForeignKeyCount} foreign key fields. Unindexed foreign keys can cause slow JOIN operations.`
      );
    }

    // Check for potential excessive denormalization
    const potentiallyDenormalizedTables = this.tables.filter((table) => {
      // Tables that have many text/varchar columns might be denormalized
      const textColumns = table.fields.filter(
        (field) =>
          field.type.toLowerCase().includes("text") ||
          (field.type.toLowerCase().includes("varchar") &&
            !field.constraints.includes("pk"))
      );
      return textColumns.length > 5; // Arbitrary threshold
    });

    if (potentiallyDenormalizedTables.length > 0) {
      score -= Math.min(10, potentiallyDenormalizedTables.length * 3); // -3 points per potentially denormalized table, max -10
      const tableNames = potentiallyDenormalizedTables
        .map((t) => `"${t.name}"`)
        .join(", ");
      suggestions.push(
        `Tables with many text columns might be excessively denormalized: ${tableNames}. This can lead to data redundancy and update anomalies.`
      );
    }

    // Determine status based on score
    let status: "excellent" | "good" | "fair" | "poor" = "excellent";
    if (score < 60) status = "poor";
    else if (score < 75) status = "fair";
    else if (score < 90) status = "good";

    return {
      category: "performance",
      metric: "Performance Anti-Patterns",
      score,
      status,
      description:
        "Assessment of database design patterns that could impact performance.",
      suggestions: suggestions.length
        ? suggestions
        : ["No significant performance anti-patterns detected."],
    };
  }
}
