"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SyntaxTextarea } from "@/components/ui/syntax-textarea";
import { ChevronRight, Import, Database, ChevronLeft, Gauge, Share2, FileText, Upload, Layout, Play, Eye, AlertTriangle } from "lucide-react";
import Examples from "./examples";
import { toast } from "@/components/ui/use-toast";
import DBMLDiagram from "./components/DBMLDiagram";
// import { useDBMLStructure } from "./hooks/use-dbml-structure";
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
import { DialogClose } from "@/components/ui/dialog";

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
  const [isInputCollapsed, setIsInputCollapsed] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile && dbmlStructure.nodes.length > 0) {
      setIsSidebarCollapsed(true);
    }
  }, [dbmlStructure.nodes.length, isMobile]);

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
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-white">Live Schema Visualization</h1>
              <div className="hidden sm:block h-6 w-px bg-gray-700"></div>
              <p className="hidden sm:block text-sm text-gray-400">
                Real-time database schema visualization
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700"
                title={isSidebarCollapsed ? "Show Input" : "Hide Input"}
              >
                {isSidebarCollapsed ? (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Show Input</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Hide Input</span>
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => document.getElementById("sql-upload")?.click()}
                className="text-gray-300 hover:bg-gray-800"
                title="Import SQL"
              >
                <Upload className="h-4 w-4" />
              </Button>
              <input
                id="sql-upload"
                type="file"
                accept=".sql"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsShareDialogOpen(true)}
                className="text-gray-300 hover:bg-gray-800"
                title="Share"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Collapsible Sidebar */}
        <div className={`relative transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-0' : 'w-96'}`}>
          <div className="absolute right-0 top-4 z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="bg-gray-800/80 hover:bg-gray-700/80 text-gray-300 rounded-l-none"
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="h-full overflow-y-auto bg-gray-900/50 backdrop-blur-sm border-r border-gray-800">
            <div className="p-4 space-y-4">
              {/* Input Section */}
              <Card className="bg-gray-800/50 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-200">
                    SQL Schema Input
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select
                    value={dialect}
                    onValueChange={(v: "mysql" | "postgres" | "mssql") => setDialect(v)}
                  >
                    <SelectTrigger className="w-full border-gray-700 bg-gray-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="postgres">PostgreSQL</SelectItem>
                      <SelectItem value="mysql">MySQL</SelectItem>
                      <SelectItem value="mssql">MS SQL Server</SelectItem>
                    </SelectContent>
                  </Select>
                  <SyntaxTextarea
                    placeholder="Paste your SQL schema here..."
                    value={schema}
                    onValueChange={setSchema}
                    className="min-h-[200px] font-mono text-sm bg-gray-800/50 border-gray-700"
                  />
                  <div className="space-y-2">
                    <Button
                      onClick={generateDiagram}
                      disabled={!schema.trim() || isGenerating}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          Generate Diagram
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSchema(exampleSchema)}
                      className="w-full border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Load Example
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Visualization Area */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full p-4">
            <Card className="h-full bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardContent className="h-full p-4">
                {renderError ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-red-400 mb-2">
                        Error Generating Diagram
                      </h3>
                      <p className="text-sm text-gray-400">{renderError}</p>
                    </div>
                  </div>
                ) : isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mx-auto mb-4"></div>
                      <p className="text-sm text-gray-400">Generating diagram...</p>
                    </div>
                  </div>
                ) : !dbmlStructure.nodes.length ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <Database className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-300 mb-2">
                        No Schema Entered
                      </h3>
                      <p className="text-sm text-gray-400">
                        Enter a SQL schema or load the example to generate a diagram
                      </p>
                    </div>
                  </div>
                ) : (
                  <DBMLDiagram
                    nodes={dbmlStructure.nodes}
                    edges={dbmlStructure.edges}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Schema</DialogTitle>
            <DialogDescription>
              Share this schema with others by copying the link below.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input
                id="link"
                defaultValue="https://example.com/share/123"
                readOnly
              />
            </div>
            <Button type="submit" size="sm" className="px-3">
              <span className="sr-only">Copy</span>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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