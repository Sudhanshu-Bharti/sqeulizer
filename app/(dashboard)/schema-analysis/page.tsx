"use client";
import { useState } from "react";
import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SyntaxTextarea } from "@/components/ui/syntax-textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  ChevronRight,
  Zap,
  TrendingUp,
  Activity,
  Lock,
  Search,
  Code,
  AlertTriangle,
  Play,
} from "lucide-react";
import type { SchemaAnalysisResult } from "@/lib/schema-analysis/analyzer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

export default function SchemaAnalysisPage() {
  const [schema, setSchema] = useState("");
  const [dialect, setDialect] = useState<"mysql" | "postgres" | "mssql">(
    "postgres"
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<SchemaAnalysisResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);
  const [showQuotaDialog, setShowQuotaDialog] = useState(false);
  const [analysisStats, setAnalysisStats] = useState<{
    used: number;
    limit: number;
    remainingDays: number;
    plan: string;
  } | null>(null);

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
        if (response.status === 403 && data.used !== undefined) {
          setAnalysisStats({
            used: data.used,
            limit: data.limit,
            remainingDays: data.remainingDays,
            plan: data.plan,
          });
          setIsUpgradeDialogOpen(true);
          throw new Error(data.message);
        }
        throw new Error(data.message || "Failed to analyze schema");
      }
      setAnalysisResult(data.analysis);

      if (data.analysisStats) {
        setAnalysisStats(data.analysisStats);
      }

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

  const analysisFeatures = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Security Vulnerabilities",
      description:
        "Detect password storage issues, data exposure risks, and access control gaps",
      color: "from-red-500/20 to-red-600/5",
      iconColor: "text-red-400",
      items: [
        "Password vulnerabilities",
        "Sensitive data exposure",
        "Missing audit trails",
        "SQL injection risks",
      ],
    },
    {
      icon: <Layers className="h-6 w-6" />,
      title: "Normalization Analysis",
      description:
        "Evaluate compliance with database normal forms and optimization opportunities",
      color: "from-blue-500/20 to-blue-600/5",
      iconColor: "text-blue-400",
      items: [
        "1NF, 2NF, 3NF compliance",
        "BCNF validation",
        "Redundancy detection",
        "Optimization suggestions",
      ],
    },
    {
      icon: <Gauge className="h-6 w-6" />,
      title: "Performance Metrics",
      description:
        "Assess scalability, maintainability, and reliability indicators",
      color: "from-emerald-500/20 to-emerald-600/5",
      iconColor: "text-emerald-400",
      items: [
        "Index coverage",
        "Foreign key integrity",
        "Naming conventions",
        "Data type optimization",
      ],
    },
  ];

  const quickStats = [
    {
      label: "Schemas Analyzed",
      value: "1M+",
      icon: <Database className="h-5 w-5 text-cyan-400" />,
    },
    {
      label: "Issues Detected",
      value: "500K+",
      icon: <AlertTriangle className="h-5 w-5 text-amber-400" />,
    },
    {
      label: "Avg. Score Improvement",
      value: "35%",
      icon: <TrendingUp className="h-5 w-5 text-emerald-400" />,
    },
    {
      label: "Analysis Time",
      value: "<30s",
      icon: <Zap className="h-5 w-5 text-purple-400" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800/50 bg-slate-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-slate-800/50">
                <Search className="h-6 w-6 text-slate-300" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-100">
                  Schema Analysis
                </h1>
                <p className="text-slate-400">
                  Powerful database optimization and security analysis
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {analysisStats && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowQuotaDialog(true)}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  <Gauge className="h-4 w-4 mr-2" />
                  {analysisStats.plan === "Free"
                    ? `${analysisStats.used}/${analysisStats.limit}`
                    : "Unlimited"}
                </Button>
              )}
              {/* <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                <Settings className="h-4 w-4" />
              </Button> */}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Bento Grid */}
        <div className="grid grid-cols-12 gap-6 mb-12">
          {/* Main CTA Card */}
          <div className="col-span-12 lg:col-span-8">
            <Card className="h-full bg-gradient-to-br from-indigo-500/10 to-purple-600/5 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    {/* <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 mb-4">
                      <Sparkles className="h-4 w-4 mr-2" />
                      AI-Powered Analysis
                    </Badge> */}
                    <h2 className="text-4xl font-bold text-slate-100 mb-4">
                      Optimize Your Database{" "}
                      <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        Architecture
                      </span>
                    </h2>
                    <p className="text-xl text-slate-300 mb-6 max-w-2xl">
                      Get comprehensive insights into security vulnerabilities,
                      normalization issues, and performance bottlenecks in
                      seconds.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-slate-300">
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                      <span>Instant Analysis</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                      <span>Actionable Insights</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                      <span>Multi-Database Support</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="col-span-12 lg:col-span-4 grid grid-cols-2 gap-4">
            {quickStats.map((stat, index) => (
              <Card
                key={index}
                className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm"
              >
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-3">{stat.icon}</div>
                  <div className="text-2xl font-bold text-slate-100 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-slate-400 text-sm">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Analysis Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {analysisFeatures.map((feature, index) => (
            <Card
              key={index}
              className={`bg-gradient-to-br ${feature.color} border-slate-700/50 backdrop-blur-sm hover:scale-105 transition-transform group`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 rounded-xl bg-slate-800/50">
                    <div className={feature.iconColor}>{feature.icon}</div>
                  </div>
                  <div>
                    <CardTitle className="text-slate-100 text-lg">
                      {feature.title}
                    </CardTitle>
                  </div>
                </div>
                <p className="text-slate-300 text-sm">{feature.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {feature.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-center gap-2 text-slate-400 text-sm"
                    >
                      <ChevronRight className="h-3 w-3" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Analysis Interface */}
        <Tabs defaultValue="input" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-slate-900/50 border border-slate-700/50">
            <TabsTrigger
              value="input"
              className="data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100"
            >
              <Code className="h-4 w-4 mr-2" />
              Schema Input
            </TabsTrigger>
            <TabsTrigger
              value="demo"
              className="data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100"
            >
              <Play className="h-4 w-4 mr-2" />
              Try Demo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Input Section */}
              <div className="lg:col-span-2">
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-slate-100">
                        <FileText className="h-5 w-5" />
                        SQL Schema Input
                      </CardTitle>
                      <div className="flex items-center gap-3">
                        <Select
                          value={dialect}
                          onValueChange={(v: "mysql" | "postgres" | "mssql") =>
                            setDialect(v)
                          }
                        >
                          <SelectTrigger className="w-[140px] border-slate-700 bg-slate-800">
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
                          className="border-slate-700 text-slate-300 hover:bg-slate-800"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                        <input
                          id="sql-upload"
                          type="file"
                          accept=".sql"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <SyntaxTextarea
                      placeholder="Paste your SQL schema here or upload a .sql file..."
                      value={schema}
                      onValueChange={setSchema}
                      className="min-h-[400px] font-mono text-sm bg-slate-800/50 border-slate-700"
                    />
                    <div className="flex gap-3">
                      <Button
                        onClick={analyzeSchema}
                        disabled={!schema.trim() || isAnalyzing}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white flex-1"
                      >
                        {isAnalyzing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Analyzing Schema...
                          </>
                        ) : (
                          <>
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Analyze Schema
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setSchema(exampleSchema)}
                        className="border-slate-700 text-slate-300 hover:bg-slate-800"
                      >
                        <Database className="h-4 w-4 mr-2" />
                        Load Example
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Analysis Info */}
              <div className="space-y-6">
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-slate-100">
                      Analysis Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30">
                        <Lock className="h-5 w-5 text-red-400" />
                        <div>
                          <div className="font-medium text-slate-200">
                            Security Scan
                          </div>
                          <div className="text-sm text-slate-400">
                            Vulnerability detection
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30">
                        <Layers className="h-5 w-5 text-blue-400" />
                        <div>
                          <div className="font-medium text-slate-200">
                            Normalization
                          </div>
                          <div className="text-sm text-slate-400">
                            Structure optimization
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30">
                        <Activity className="h-5 w-5 text-emerald-400" />
                        <div>
                          <div className="font-medium text-slate-200">
                            Performance
                          </div>
                          <div className="text-sm text-slate-400">
                            Robustness metrics
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {selectedFile && (
                  <Card className="bg-emerald-500/10 border-emerald-500/20 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-400" />
                        <div>
                          <div className="font-medium text-emerald-300">
                            File Loaded
                          </div>
                          <div className="text-sm text-emerald-400">
                            {selectedFile.name}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="demo" className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="space-y-6">
                  <div>
                    <Play className="h-16 w-16 text-indigo-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-slate-100 mb-2">
                      Interactive Demo
                    </h3>
                    <p className="text-slate-300 max-w-2xl mx-auto">
                      Try our schema analysis with a pre-loaded e-commerce
                      database example. See how we detect issues and provide
                      optimization recommendations.
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setSchema(exampleSchema);
                      analyzeSchema();
                    }}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-6 text-lg"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Run Demo Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Analysis Results */}
        {analysisResult && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-100">
                Analysis Results
              </h2>
              {/* <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button> */}
            </div>
            <SchemaAnalysisDisplay analysis={analysisResult} />
          </div>
        )}

        {/* Upgrade Dialog */}
        <Dialog
          open={isUpgradeDialogOpen}
          onOpenChange={setIsUpgradeDialogOpen}
        >
          <DialogContent className="bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-slate-100">
                Analysis Limit Reached
              </DialogTitle>
              <DialogDescription className="text-slate-300">
                You've used {analysisStats?.used} out of {analysisStats?.limit}{" "}
                schema analyses in your free plan. Your limit will reset in{" "}
                {analysisStats?.remainingDays} days. Upgrade now to get
                unlimited analyses and additional features!
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsUpgradeDialogOpen(false)}
                className="border-slate-700"
              >
                Cancel
              </Button>
              <Button
                onClick={() => (window.location.href = "/pricing")}
                className="bg-indigo-500 hover:bg-indigo-600"
              >
                View Plans
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Quota Dialog */}
        <Dialog open={showQuotaDialog} onOpenChange={setShowQuotaDialog}>
          <DialogContent className="bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-slate-100">
                Analysis Quota
              </DialogTitle>
              <DialogDescription className="text-slate-300">
                {analysisStats?.plan === "Free"
                  ? "Free tier usage and limits"
                  : `${analysisStats?.plan} plan benefits`}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium text-slate-200">
                      {analysisStats?.plan === "Free"
                        ? "Free Tier"
                        : `${analysisStats?.plan} Plan`}
                    </h4>
                    <p className="text-sm text-slate-400">
                      {analysisStats?.plan === "Free"
                        ? `Resets in ${analysisStats?.remainingDays} days`
                        : "Unlimited analyses"}
                    </p>
                  </div>
                  {analysisStats?.plan === "Free" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowQuotaDialog(false);
                        window.location.href = "/pricing";
                      }}
                      className="border-slate-700"
                    >
                      Upgrade
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Analyses used</span>
                    <span className="font-medium text-slate-200">
                      {analysisStats?.plan === "Free"
                        ? `${analysisStats?.used} of ${analysisStats?.limit}`
                        : `${analysisStats?.used} analyses`}
                    </span>
                  </div>
                  <Progress
                    value={
                      analysisStats?.plan === "Free"
                        ? (analysisStats.used / analysisStats.limit) * 100
                        : 100
                    }
                    className="h-2 bg-slate-800"
                  />
                  {analysisStats?.plan === "Free" && (
                    <p className="text-xs text-slate-500">
                      {analysisStats.limit - analysisStats.used} analyses
                      remaining
                    </p>
                  )}
                </div>
              </div>
              {analysisStats?.plan === "Free" && (
                <div className="rounded-lg bg-slate-800/50 p-4 border border-slate-700">
                  <h5 className="text-sm font-medium mb-2 text-slate-200">
                    Upgrade to get more
                  </h5>
                  <ul className="text-sm space-y-2 text-slate-300">
                    <li className="flex items-center">
                      <ChevronRight className="h-3 w-3 mr-2" />
                      Unlimited schema analyses
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="h-3 w-3 mr-2" />
                      Priority support
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="h-3 w-3 mr-2" />
                      Advanced features
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowQuotaDialog(false)}
                className="border-slate-700"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
