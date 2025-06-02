"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Shield,
  Database,
  Gauge,
  AlertTriangle,
  CheckCircle,
  Info,
  AlertCircle,
  Activity,
  Lock,
  Layers,
  TrendingUp,
  BarChart3,
  Users,
  Zap,
  Eye,
  Download,
  FileJson,
  FileText,
  ChevronDown,
} from "lucide-react";
import type { SchemaAnalysisResult } from "@/lib/schema-analysis/analyzer";

interface SchemaAnalysisDisplayProps {
  analysis: SchemaAnalysisResult;
  className?: string;
  onSettingsChange?: (settings: SchemaAnalysisSettings) => void;
}

export type SchemaAnalysisSettings = {
  showSecurityIssues: boolean;
  showNormalizationIssues: boolean;
  showRobustnessMetrics: boolean;
  minSeverityLevel: "info" | "warning" | "critical";
  displayDensity: "comfortable" | "compact" | "spacious";
};

export function SchemaAnalysisDisplay({
  analysis,
  className = "",
  onSettingsChange,
}: SchemaAnalysisDisplayProps) {
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [settings, setSettings] = useState<SchemaAnalysisSettings>({
    showSecurityIssues: true,
    showNormalizationIssues: true,
    showRobustnessMetrics: true,
    minSeverityLevel: "info",
    displayDensity: "comfortable",
  });

  const handleSettingsSave = (newSettings: SchemaAnalysisSettings) => {
    setSettings(newSettings);
    setShowSettingsDialog(false);
    if (onSettingsChange) {
      onSettingsChange(newSettings);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    if (score >= 40) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-emerald-500/20 to-emerald-600/5";
    if (score >= 60) return "from-amber-500/20 to-amber-600/5";
    if (score >= 40) return "from-orange-500/20 to-orange-600/5";
    return "from-red-500/20 to-red-600/5";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-amber-500";
    if (score >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-amber-400" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-400" />;
      default:
        return <Info className="h-4 w-4 text-slate-400" />;
    }
  };
  const getMetricIcon = (category: string) => {
    switch (category) {
      case "performance":
        return <TrendingUp className="h-5 w-5 text-emerald-400" />;
      case "maintainability":
        return <Activity className="h-5 w-5 text-blue-400" />;
      case "scalability":
        return <Layers className="h-5 w-5 text-purple-400" />;
      case "reliability":
        return <Shield className="h-5 w-5 text-cyan-400" />;
      default:
        return <Gauge className="h-5 w-5 text-slate-400" />;
    }
  };

  const exportAsJson = () => {
    const blob = new Blob([JSON.stringify(analysis, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `schema-analysis-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportAsHtml = () => {
    // Create a styled HTML report
    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Schema Analysis Report</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; max-width: 1200px; margin: 0 auto; padding: 20px; }
        h1, h2, h3 { margin-top: 2rem; color: #1a202c; }
        .score { font-size: 1.2rem; font-weight: bold; }
        .card { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 1rem; padding: 1rem; }
        .excellent { color: #10b981; }
        .good { color: #3b82f6; }
        .fair { color: #f59e0b; }
        .poor { color: #ef4444; }
        .critical { color: #ef4444; }
        .warning { color: #f59e0b; }
        .info { color: #3b82f6; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 1rem; margin-bottom: 1rem; }
        .section { margin-top: 2rem; }
        .issue { margin-bottom: 1.5rem; padding-left: 1rem; border-left: 3px solid #e2e8f0; }
        .critical-issue { border-left-color: #ef4444; }
        .warning-issue { border-left-color: #f59e0b; }
        .info-issue { border-left-color: #3b82f6; }
        .footer { margin-top: 2rem; text-align: center; font-size: 0.8rem; color: #a0aec0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Database Schema Analysis Report</h1>
        <div>Generated on: ${new Date().toLocaleDateString()}</div>
      </div>
      
      <div class="card">
        <h2>Summary</h2>
        <div><strong>Overall Score:</strong> <span class="${
          analysis.overallScore >= 80
            ? "excellent"
            : analysis.overallScore >= 60
            ? "good"
            : analysis.overallScore >= 40
            ? "fair"
            : "poor"
        }">${analysis.overallScore}/100</span></div>
        <div><strong>Security Score:</strong> <span class="${
          analysis.summary.securityScore >= 80
            ? "excellent"
            : analysis.summary.securityScore >= 60
            ? "good"
            : analysis.summary.securityScore >= 40
            ? "fair"
            : "poor"
        }">${analysis.summary.securityScore}/100</span></div>
        <div><strong>Normalization Score:</strong> <span class="${
          analysis.summary.normalizationScore >= 80
            ? "excellent"
            : analysis.summary.normalizationScore >= 60
            ? "good"
            : analysis.summary.normalizationScore >= 40
            ? "fair"
            : "poor"
        }">${analysis.summary.normalizationScore}/100</span></div>
        <div><strong>Robustness Score:</strong> <span class="${
          analysis.summary.robustnessScore >= 80
            ? "excellent"
            : analysis.summary.robustnessScore >= 60
            ? "good"
            : analysis.summary.robustnessScore >= 40
            ? "fair"
            : "poor"
        }">${analysis.summary.robustnessScore}/100</span></div>
        <div><strong>Tables:</strong> ${analysis.summary.totalTables}</div>
        <div><strong>Fields:</strong> ${analysis.summary.totalFields}</div>
        <div><strong>Relationships:</strong> ${
          analysis.summary.totalRelationships
        }</div>
      </div>
      
      <div class="section">
        <h2>Security Issues (${analysis.securityIssues.length})</h2>
        ${analysis.securityIssues
          .map(
            (issue) => `
          <div class="issue ${issue.type}-issue">
            <h3 class="${issue.type}">${issue.title}</h3>
            <div><strong>Type:</strong> ${issue.type}</div>
            <div><strong>Category:</strong> ${issue.category}</div>
            <div><strong>Table:</strong> ${issue.table}${
              issue.field ? `, Field: ${issue.field}` : ""
            }</div>
            <div><strong>Description:</strong> ${issue.description}</div>
            <div><strong>Recommendation:</strong> ${issue.recommendation}</div>
            <div><strong>Impact:</strong> ${issue.impact}</div>
          </div>
        `
          )
          .join("")}
      </div>
      
      <div class="section">
        <h2>Normalization Issues (${analysis.normalizationIssues.length})</h2>
        ${analysis.normalizationIssues
          .map(
            (issue) => `
          <div class="issue">
            <h3>${issue.title}</h3>
            <div><strong>Type:</strong> ${issue.type}</div>
            <div><strong>Normal Form:</strong> ${issue.normalForm}</div>
            <div><strong>Table:</strong> ${issue.table}${
              issue.fields ? `, Fields: ${issue.fields.join(", ")}` : ""
            }</div>
            <div><strong>Description:</strong> ${issue.description}</div>
            <div><strong>Recommendation:</strong> ${issue.recommendation}</div>
          </div>
        `
          )
          .join("")}
      </div>
      
      <div class="section">
        <h2>Robustness Metrics</h2>
        ${analysis.robustnessMetrics
          .map(
            (metric) => `
          <div class="issue">
            <h3>${metric.metric}</h3>
            <div><strong>Category:</strong> ${metric.category}</div>
            <div><strong>Score:</strong> <span class="${metric.status}">${
              metric.score
            }/100 (${metric.status})</span></div>
            <div><strong>Description:</strong> ${metric.description}</div>
            <h4>Suggestions:</h4>
            <ul>
              ${metric.suggestions.map((s) => `<li>${s}</li>`).join("")}
            </ul>
          </div>
        `
          )
          .join("")}
      </div>
      
      <div class="footer">
        <p>Generated by Database Schema Analyzer</p>
      </div>
    </body>
    </html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `schema-analysis-report-${
      new Date().toISOString().split("T")[0]
    }.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const criticalIssues = analysis.securityIssues.filter(
    (issue) => issue.type === "critical"
  );
  const warningIssues = analysis.securityIssues.filter(
    (issue) => issue.type === "warning"
  );
  const infoIssues = analysis.securityIssues.filter(
    (issue) => issue.type === "info"
  );

  return (
    <div className={`min-h-screen bg-slate-950 ${className}`}>
      {/* Header */}
      <div className="border-b border-slate-800/50 bg-slate-900/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-slate-800/50">
                <Database className="h-6 w-6 text-slate-300" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-100">
                  Schema Analysis
                </h1>
                <p className="text-slate-400 text-sm">
                  Database health & optimization report
                </p>
              </div>
            </div>{" "}
            <div className="flex items-center gap-3">
              {" "}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-700 text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export Analysis
                    <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-800 border border-slate-700">
                  <DropdownMenuItem
                    onClick={exportAsJson}
                    className="text-slate-300 hover:bg-slate-700 cursor-pointer"
                  >
                    <FileJson className="h-4 w-4 mr-2 text-blue-400" />
                    Export as JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={exportAsHtml}
                    className="text-slate-300 hover:bg-slate-700 cursor-pointer"
                  >
                    <FileText className="h-4 w-4 mr-2 text-green-400" />
                    Export as HTML Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-6 mb-8">
          {/* Main Score - Large Card */}
          <div className="col-span-12 lg:col-span-4">
            <Card
              className={`h-full bg-gradient-to-br ${getScoreGradient(
                analysis.overallScore
              )} border-slate-700/50 backdrop-blur-sm`}
            >
              <CardContent className="p-8 text-center">
                <div className="mb-4">
                  <div
                    className={`text-6xl font-bold ${getScoreColor(
                      analysis.overallScore
                    )} mb-2`}
                  >
                    {analysis.overallScore}
                  </div>
                  <div className="text-slate-300 text-lg font-medium">
                    Overall Health Score
                  </div>
                  <div className="text-slate-500 text-sm">
                    Out of 100 points
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Performance</span>
                    <span
                      className={`font-semibold ${getScoreColor(
                        analysis.summary.securityScore
                      )}`}
                    >
                      {analysis.summary.securityScore}%
                    </span>
                  </div>
                  <Progress
                    value={analysis.summary.securityScore}
                    className="h-2 bg-slate-800"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats - 2x2 Grid */}
          <div className="col-span-12 lg:col-span-4 grid grid-cols-2 gap-4">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-8 w-8 text-cyan-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-slate-100">
                  {analysis.summary.totalTables}
                </div>
                <div className="text-slate-400 text-sm">Tables</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Zap className="h-8 w-8 text-amber-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-slate-100">
                  {analysis.summary.totalFields}
                </div>
                <div className="text-slate-400 text-sm">Fields</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-slate-100">
                  {analysis.summary.totalRelationships}
                </div>
                <div className="text-slate-400 text-sm">Relations</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-slate-100">
                  {analysis.securityIssues.length}
                </div>
                <div className="text-slate-400 text-sm">Issues</div>
              </CardContent>
            </Card>
          </div>

          {/* Score Breakdown */}
          <div className="col-span-12 lg:col-span-4">
            <Card className="h-full bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-slate-100 text-lg">
                  Score Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-emerald-400" />
                      <span className="text-slate-300 text-sm">Security</span>
                    </div>
                    <span
                      className={`font-bold ${getScoreColor(
                        analysis.summary.securityScore
                      )}`}
                    >
                      {analysis.summary.securityScore}
                    </span>
                  </div>
                  <Progress
                    value={analysis.summary.securityScore}
                    className="h-2 bg-slate-800"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-blue-400" />
                      <span className="text-slate-300 text-sm">
                        Normalization
                      </span>
                    </div>
                    <span
                      className={`font-bold ${getScoreColor(
                        analysis.summary.normalizationScore
                      )}`}
                    >
                      {analysis.summary.normalizationScore}
                    </span>
                  </div>
                  <Progress
                    value={analysis.summary.normalizationScore}
                    className="h-2 bg-slate-800"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-purple-400" />
                      <span className="text-slate-300 text-sm">Robustness</span>
                    </div>
                    <span
                      className={`font-bold ${getScoreColor(
                        analysis.summary.robustnessScore
                      )}`}
                    >
                      {analysis.summary.robustnessScore}
                    </span>
                  </div>
                  <Progress
                    value={analysis.summary.robustnessScore}
                    className="h-2 bg-slate-800"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Issue Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-red-500/5 border-red-500/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                  <div>
                    <div className="font-semibold text-slate-100">
                      Critical Issues
                    </div>
                    <div className="text-slate-400 text-sm">
                      Requires immediate attention
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-red-400">
                  {criticalIssues.length}
                </div>
              </div>
              {criticalIssues.length > 0 && (
                <div className="text-sm text-slate-300">
                  Latest: {criticalIssues[0].title}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-amber-500/5 border-amber-500/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-amber-400" />
                  <div>
                    <div className="font-semibold text-slate-100">Warnings</div>
                    <div className="text-slate-400 text-sm">
                      Should be addressed
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-amber-400">
                  {warningIssues.length}
                </div>
              </div>
              {warningIssues.length > 0 && (
                <div className="text-sm text-slate-300">
                  Latest: {warningIssues[0].title}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-blue-500/5 border-blue-500/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Info className="h-6 w-6 text-blue-400" />
                  <div>
                    <div className="font-semibold text-slate-100">
                      Informational
                    </div>
                    <div className="text-slate-400 text-sm">
                      Optimization suggestions
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-400">
                  {infoIssues.length}
                </div>
              </div>
              {infoIssues.length > 0 && (
                <div className="text-sm text-slate-300">
                  Latest: {infoIssues[0].title}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analysis Tabs */}
        <Tabs defaultValue="security" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-900/50 border border-slate-700/50">
            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100"
            >
              <Lock className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger
              value="normalization"
              className="data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100"
            >
              <Layers className="h-4 w-4 mr-2" />
              Normalization
            </TabsTrigger>
            <TabsTrigger
              value="robustness"
              className="data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100"
            >
              <Activity className="h-4 w-4 mr-2" />
              Robustness
            </TabsTrigger>
          </TabsList>

          <TabsContent value="security" className="space-y-4">
            {analysis.securityIssues.length === 0 ? (
              <Card className="bg-emerald-500/10 border-emerald-500/20 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-emerald-300 mb-2">
                    All Clear!
                  </h3>
                  <p className="text-emerald-400">
                    No security issues detected in your schema.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {analysis.securityIssues.map((issue, index) => (
                  <Card
                    key={index}
                    className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-900/70 transition-colors"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {getIssueIcon(issue.type)}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h4 className="font-semibold text-slate-100">
                              {issue.title}
                            </h4>
                            <Badge
                              variant="outline"
                              className="border-slate-600 text-slate-300"
                            >
                              {issue.category}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="border-slate-600 text-slate-300"
                            >
                              {issue.impact} impact
                            </Badge>
                          </div>
                          <p className="text-slate-300">{issue.description}</p>
                          <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
                            <span className="font-medium text-slate-200">
                              💡 Recommendation:{" "}
                            </span>
                            <span className="text-slate-300">
                              {issue.recommendation}
                            </span>
                          </div>
                          {issue.table && (
                            <div className="text-sm text-slate-400">
                              📍 <span className="font-medium">Location:</span>{" "}
                              {issue.table}
                              {issue.field && ` → ${issue.field}`}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="normalization" className="space-y-4">
            {analysis.normalizationIssues.length === 0 ? (
              <Card className="bg-emerald-500/10 border-emerald-500/20 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-emerald-300 mb-2">
                    Perfect Normalization!
                  </h3>
                  <p className="text-emerald-400">
                    Your schema follows excellent normalization practices.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {analysis.normalizationIssues.map((issue, index) => (
                  <Card
                    key={index}
                    className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-900/70 transition-colors"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {issue.type === "violation" ? (
                          <AlertTriangle className="h-5 w-5 text-red-400" />
                        ) : issue.type === "warning" ? (
                          <AlertCircle className="h-5 w-5 text-amber-400" />
                        ) : (
                          <Info className="h-5 w-5 text-blue-400" />
                        )}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h4 className="font-semibold text-slate-100">
                              {issue.title}
                            </h4>
                            <Badge
                              variant="outline"
                              className="border-slate-600 text-slate-300"
                            >
                              {issue.normalForm}
                            </Badge>
                          </div>
                          <p className="text-slate-300">{issue.description}</p>
                          <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
                            <span className="font-medium text-slate-200">
                              💡 Recommendation:{" "}
                            </span>
                            <span className="text-slate-300">
                              {issue.recommendation}
                            </span>
                          </div>
                          <div className="text-sm text-slate-400">
                            📍 <span className="font-medium">Table:</span>{" "}
                            {issue.table}
                            {issue.fields &&
                              ` → Fields: ${issue.fields.join(", ")}`}
                          </div>
                        </div>
                  
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="robustness" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {analysis.robustnessMetrics.map((metric, index) => (
                <Card
                  key={index}
                  className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-900/70 transition-colors"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getMetricIcon(metric.category)}
                        <div>
                          <CardTitle className="text-slate-100 text-lg">
                            {metric.metric}
                          </CardTitle>
                          <p className="text-slate-400 text-sm">
                            {metric.category}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`text-3xl font-bold ${getScoreColor(
                          metric.score
                        )}`}
                      >
                        {metric.score}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-sm">
                          Performance
                        </span>
                        <Badge
                          className={
                            metric.status === "excellent"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : metric.status === "good"
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                              : metric.status === "fair"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : "bg-red-500/10 text-red-400 border-red-500/20"
                          }
                        >
                          {metric.status}
                        </Badge>
                      </div>
                      <Progress
                        value={metric.score}
                        className="h-3 bg-slate-800"
                      />
                    </div>
                    <p className="text-slate-300 text-sm">
                      {metric.description}
                    </p>
                    {metric.suggestions.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-slate-200">
                          Suggestions:
                        </div>
                        <div className="space-y-1">
                          {metric.suggestions.map(
                            (suggestion, suggestionIndex) => (
                              <div
                                key={suggestionIndex}
                                className="text-xs text-slate-400 pl-3 border-l-2 border-slate-600 bg-slate-800/20 p-2 rounded-r"
                              >
                                {suggestion}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
