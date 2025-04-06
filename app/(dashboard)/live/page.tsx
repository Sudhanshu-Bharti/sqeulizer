"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { SyntaxTextarea } from "@/components/ui/syntax-textarea";
import { ChevronRight, Import, Database, ChevronLeft, Gauge } from "lucide-react";
import Examples from "./examples";
import { toast } from "@/components/ui/use-toast";
import DBMLDiagram from "./components/DBMLDiagram";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShareDialog } from "@/components/share-dialog";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { DbmlStructure } from "@/lib/types";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function DBSchemaVisualizer() {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);
  const [generationStats, setGenerationStats] = useState<{
    used: number;
    limit: number;
    remainingDays: number;
    plan: string;
  } | null>(null);
  const [schema, setSchema] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dbmlStructure, setDbmlStructure] = useState({ nodes: [], edges: [] });
  const [timeoutError, setTimeoutError] = useState(false);
  const [dialect, setDialect] = useState<"mysql" | "postgres" | "mssql">(
    "postgres"
  );
  const [sql, setSql] = useState("");
  const [dbml, setDbml] = useState<DbmlStructure | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showQuotaDialog, setShowQuotaDialog] = useState(false);

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

  // Function to generate DBML
  const generateDiagram = async () => {
    if (!schema.trim() && !selectedFile) {
      toast({
        title: "Empty Schema",
        description: "Please enter your database schema or upload a SQL file.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setIsGenerating(true);
    setRenderError(null);
    setTimeoutError(false);

    // Add timeout
    const timeoutDuration = 60000; // 60 seconds
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Generation timed out"));
      }, timeoutDuration);
    });

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append("file", selectedFile);
      } else {
        formData.append("sql", schema);
      }
      formData.append("dialect", dialect);

      const result = (await Promise.race([
        fetch("/api/generate", {
          method: "POST",
          body: formData,
        }),
        timeoutPromise,
      ])) as Response;

      if (!result.ok) {
        const data = await result.json();
        if (result.status === 403) {
          // Generation limit exceeded
          setGenerationStats({
            used: data.used,
            limit: data.limit,
            remainingDays: data.remainingDays,
            plan: data.plan,
          });
          setIsUpgradeDialogOpen(true);
          throw new Error(data.message);
        }
        throw new Error("Failed to generate DBML");
      }

      const data = await result.json();
      console.log("DBML data:", data);
      if (data.dbml) {
        setDbmlStructure(data.dbml);
        setRenderError(null);

        // Update generation stats if they were returned
        if (data.generationStats) {
          setGenerationStats(data.generationStats);
        }
      } else {
        throw new Error("No DBML generated");
      }
    } catch (error) {
      console.error("Error generating DBML:", error);
      if (error instanceof Error && error.message === "Generation timed out") {
        setTimeoutError(true);
        setRenderError(
          "Generation timed out. The SQL might be too complex or invalid."
        );
      } else {
        setRenderError("Failed to generate the DBML");
      }
      toast({
        title: "Generation Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to generate the DBML. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
    }
  };

  const handleExampleSelect = (exampleSchema: string) => {
    setSchema("");
    setTimeout(() => {
      setSchema(exampleSchema);
    }, 10);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderContent = () => {
    if (renderError) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-red-500 p-4 text-center">
          <p className="mb-2 font-semibold">Error generating DBML</p>
          <p className="text-sm">{renderError}</p>
        </div>
      );
    }

    if (isGenerating) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <div className="loading-skeleton h-40 w-full rounded-lg"></div>
          <div className="loading-skeleton h-24 w-3/4 rounded-lg"></div>
        </div>
      );
    }

    if (!dbmlStructure.nodes.length) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
          <div className="bg-secondary/50 p-4 rounded-full">
            <ChevronRight className="h-10 w-10" />
          </div>
          <p>DBML will appear here after generation</p>
        </div>
      );
    }

    return (
      <DBMLDiagram nodes={dbmlStructure.nodes} edges={dbmlStructure.edges} />
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Top Navigation */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-gray-800">
        <div className="container flex h-14 items-center justify-between">
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => document.getElementById("sql-upload")?.click()}
              className="hover:bg-orange-900/50 dark:hover:text-orange-400 transition-colors"
            >
              <Import className="mr-2" size={16} /> Import SQL
            </Button>
            <input
              id="sql-upload"
              type="file"
              accept=".sql"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
          <div className="flex items-center gap-2">
            {generationStats && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowQuotaDialog(true)}
                className="flex items-center gap-2  hover:border-orange-600 border-gray-700"
              >
                <Gauge className="h-4 w-4" />
                <span className="font-medium">
                  {generationStats.plan === "Free" 
                    ? `${generationStats.used}/${generationStats.limit}`
                    : "Unlimited"}
                </span>
              </Button>
            )}
            <Select
              value={dialect}
              onValueChange={(v: "mysql" | "postgres" | "mssql") => setDialect(v)}
            >
              <SelectTrigger className="w-[140px] hover:border-orange-600 border-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mysql">MySQL</SelectItem>
                <SelectItem value="postgres">PostgreSQL</SelectItem>
                <SelectItem value="mssql">MS SQL Server</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              className="hover:border-orange-600 border-gray-700"
            >
              Save
            </Button>
            <Button
              size="sm"
              className=" bg-orange-700 hover:bg-orange-800"
              onClick={() => setIsShareDialogOpen(true)}
            >
              Share
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-[320px_1fr] overflow-hidden">
        {/* Left Sidebar */}
        <div className="border-r  flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden border-gray-800 bg-gray-900/50">
          <div className="flex-none p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-100">
                SQL Input
              </h2>
            </div>
            <div className="relative">
              <SyntaxTextarea
                placeholder="Enter your SQL schema here..."
                value={schema}
                onValueChange={setSchema}
                className="min-h-[300px] resize-none font-mono text-sm  border-gray-700 hover:border-orange-600 focus:border-orange-500 focus:ring-orange-500/20 bg-gray-800/50 text-gray-100"
              />
            </div>
            <Button
              className="w-full  bg-orange-700 hover:bg-orange-800"
              onClick={generateDiagram}
              disabled={!schema.trim()}
              isLoading={isLoading}
              variant="default"
            >
              {isLoading ? "Generating..." : "Generate Diagram"}
              <Database className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto border-t bg-background/50 dark:border-gray-800 dark:bg-gray-900/30">
            <div className="p-4">
              <h2 className="text-sm font-medium mb-3 text-gray-900 dark:text-gray-100">
                Example Schemas
              </h2>
              <Examples onSelectExample={handleExampleSelect} vertical />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden dark:bg-transparent">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 min-h-[500px] relative">
              {renderError ? (
                <div className="flex items-center justify-center h-full p-4 text-red-400">
                  <p>{renderError}</p>
                </div>
              ) : isGenerating ? (
                <div className="flex items-center justify-center h-full">
                  <div className="loading-skeleton h-full w-full bg-gray-800/50" />
                </div>
              ) : !dbmlStructure.nodes.length ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
                  <div className="bg-orange-900/50 p-4 rounded-full">
                    <ChevronRight className="h-10 w-10 text-orange-400" />
                  </div>
                  <p>Enter your SQL schema and click Generate</p>
                </div>
              ) : (
                <DBMLDiagram
                  nodes={dbmlStructure.nodes}
                  edges={dbmlStructure.edges}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <ShareDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        schema={schema}
        dialect={dialect}
      />

      {/* Upgrade Dialog */}
      <Dialog open={isUpgradeDialogOpen} onOpenChange={setIsUpgradeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generation Limit Reached</DialogTitle>
            <DialogDescription>
              You've used {generationStats?.used} out of{" "}
              {generationStats?.limit} generations in your free plan. Your limit
              will reset in {generationStats?.remainingDays} days. Upgrade now
              to get unlimited generations and additional features!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUpgradeDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => (window.location.href = "/pricing")}>
              View Plans
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generation Stats Dialog */}
      <Dialog open={showQuotaDialog} onOpenChange={setShowQuotaDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Generation Quota</DialogTitle>
            <DialogDescription>
              {generationStats?.plan === "Free" 
                ? "Free tier usage and limits"
                : `${generationStats?.plan} plan benefits`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-medium">
                    {generationStats?.plan === "Free" ? "Free Tier" : `${generationStats?.plan} Plan`}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {generationStats?.plan === "Free"
                      ? `Resets in ${generationStats?.remainingDays} days`
                      : "Unlimited generations"}
                  </p>
                </div>
                {generationStats?.plan === "Free" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowQuotaDialog(false);
                      window.location.href = "/pricing";
                    }}
                  >
                    Upgrade
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Generations used</span>
                  <span className="font-medium">
                    {generationStats?.plan === "Free"
                      ? `${generationStats?.used} of ${generationStats?.limit}`
                      : `${generationStats?.used} generations`}
                  </span>
                </div>
                <div className="relative">
                  <Progress
                    value={generationStats?.plan === "Free"
                      ? (generationStats.used / generationStats.limit) * 100
                      : 100}
                    className="h-2"
                  />
                  {generationStats?.plan !== "Free" && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 animate-gradient" />
                  )}
                </div>
                {generationStats?.plan === "Free" && (
                  <p className="text-xs text-muted-foreground">
                    {generationStats.limit - generationStats.used} generations remaining
                  </p>
                )}
              </div>
            </div>

            {generationStats?.plan === "Free" && (
              <div className="rounded-lg bg-muted p-4">
                <h5 className="text-sm font-medium mb-2">Upgrade to get more</h5>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center">
                    <ChevronRight className="h-3 w-3 mr-2" />
                    Unlimited generations
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
            <Button variant="outline" onClick={() => setShowQuotaDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
          background-size: 200% 200%;
        }
      `}</style>
    </div>
  );
}