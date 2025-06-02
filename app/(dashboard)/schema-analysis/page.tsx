"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SyntaxTextarea } from "@/components/ui/syntax-textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { SchemaAnalysisDisplay } from "@/components/schema-analysis/SchemaAnalysisDisplay";
import {
  Database,
  Shield,
  Layers,
  Gauge,
  FileText,
  Upload,
  BarChart3,
  CheckCircle,
} from "lucide-react";
import { SchemaAnalysisResult } from "@/lib/schema-analysis/analyzer";

export default function SchemaAnalysisPage() {
  const [schema, setSchema] = useState("");
  const [dialect, setDialect] = useState<"mysql" | "postgres" | "mssql">(
    "postgres"
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<SchemaAnalysisResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith(".sql")) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSchema(e.target?.result as string);
      };
      reader.readAsText(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please upload a .sql file",
        variant: "destructive",
      });
    }
  };

  const analyzeSchema = async () => {
    if (!schema.trim()) {
      toast({
        title: "Empty Schema",
        description: "Please enter your database schema or upload a SQL file.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/analyze-schema", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sql: schema,
          dialect,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to analyze schema");
      }

      setAnalysisResult(data.analysis);

      toast({
        title: "Analysis Complete",
        description: `Schema analyzed successfully! Overall score: ${data.analysis.overallScore}/100`,
        variant: "default",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description:
          error instanceof Error ? error.message : "Failed to analyze schema",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const exampleSchema = `-- Example E-commerce Database Schema
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  category_id INTEGER REFERENCES categories(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL
);`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Database Schema Analysis
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Analyze your PostgreSQL/SQL database schema for security
            vulnerabilities, normalization issues, and robustness metrics. Get
            actionable insights to improve your database design.
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Shield className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Security Analysis</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Detect password vulnerabilities, sensitive data exposure, and
                missing security controls.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Layers className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Normalization Check
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Evaluate compliance with 1NF, 2NF, 3NF, and BCNF database normal
                forms.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Gauge className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Robustness Metrics</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Assess performance, maintainability, scalability, and
                reliability indicators.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  SQL Schema Input
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Select
                    value={dialect}
                    onValueChange={(v: "mysql" | "postgres" | "mssql") =>
                      setDialect(v)
                    }
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="postgres">PostgreSQL</SelectItem>
                      <SelectItem value="mysql">MySQL</SelectItem>
                      <SelectItem value="mssql">MS SQL Server</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      document.getElementById("sql-upload")?.click()
                    }
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload SQL File
                  </Button>
                  <input
                    id="sql-upload"
                    type="file"
                    accept=".sql"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                <div className="space-y-2">
                  <SyntaxTextarea
                    placeholder="Enter your SQL schema here or upload a .sql file..."
                    value={schema}
                    onValueChange={setSchema}
                    className="min-h-[400px] font-mono text-sm"
                  />

                  <div className="flex gap-2">
                    <Button
                      onClick={analyzeSchema}
                      disabled={!schema.trim() || isAnalyzing}
                      className="flex items-center gap-2"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <BarChart3 className="h-4 w-4" />
                          Analyze Schema
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setSchema(exampleSchema)}
                      className="flex items-center gap-2"
                    >
                      <Database className="h-4 w-4" />
                      Load Example
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  What We Analyze
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-blue-600 mb-2">
                      🔒 Security Issues
                    </h4>
                    <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                      <li>• Password storage vulnerabilities</li>
                      <li>• Sensitive data exposure risks</li>
                      <li>• Missing audit trails</li>
                      <li>• Access control gaps</li>
                      <li>• SQL injection vulnerabilities</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-green-600 mb-2">
                      📊 Normalization
                    </h4>
                    <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                      <li>• First Normal Form (1NF) compliance</li>
                      <li>• Second Normal Form (2NF) validation</li>
                      <li>• Third Normal Form (3NF) assessment</li>
                      <li>• Boyce-Codd Normal Form (BCNF) check</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-purple-600 mb-2">
                      ⚡ Robustness
                    </h4>
                    <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                      <li>• Index coverage analysis</li>
                      <li>• Foreign key integrity</li>
                      <li>• Naming convention consistency</li>
                      <li>• Data type appropriateness</li>
                      <li>• Scalability indicators</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {selectedFile && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="h-4 w-4" />
                    <span>Loaded: {selectedFile.name}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Analysis Results */}
        {analysisResult && (
          <div className="mt-12">
            <SchemaAnalysisDisplay analysis={analysisResult} />
          </div>
        )}
      </div>
    </div>
  );
}
