"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  RefreshCw,
  Settings,
} from "lucide-react";
import type { SchemaAnalysisResult } from "@/lib/schema-analysis/analyzer";

interface SchemaAnalysisDisplayProps {
  analysis: SchemaAnalysisResult;
  className?: string;
}

export function SchemaAnalysisDisplay({
  analysis,
  className = "",
}: SchemaAnalysisDisplayProps) {
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
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                <Settings className="h-4 w-4" />
              </Button>
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
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-600 text-slate-300 hover:bg-slate-800"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
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
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-600 text-slate-300 hover:bg-slate-800"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
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
