"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { SyntaxTextarea } from "@/components/ui/syntax-textarea";
import { ChevronRight, Import, Database } from "lucide-react";
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

export default function DBSchemaVisualizer() {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
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
    const timeoutDuration = 60000; // 10 seconds
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
        throw new Error("Failed to generate DBML");
      }

      const data = await result.json();
      console.log("DBML data:", data);
      if (data.dbml) {
        setDbmlStructure(data.dbml);
        setRenderError(null);
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
        description: timeoutError
          ? "Generation timed out. Please check your SQL syntax."
          : "Failed to generate the DBML. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
    }
  };

  // const copyToClipboard = () => {
  //   if (!dbmlCode) return;

  //   navigator.clipboard
  //     .writeText(dbmlCode)
  //     .then(() => {
  //       toast({
  //         title: "Copied!",
  //         description: "DBML code copied to clipboard",
  //       });
  //     })
  //     .catch((err) => {
  //       console.error("Failed to copy:", err);
  //       toast({
  //         title: "Copy Failed",
  //         description: "Could not copy to clipboard",
  //         variant: "destructive",
  //       });
  //     });
  // };

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
    <div className="h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Top Navigation */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 dark:border-gray-800">
        <div className="container flex h-14 items-center justify-between">
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => document.getElementById("sql-upload")?.click()}
              className="hover:bg-orange-100 hover:text-orange-600 dark:hover:bg-orange-900/50 dark:hover:text-orange-400 transition-colors"
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
            <Select
              value={dialect}
              onValueChange={(v: "mysql" | "postgres" | "mssql") =>
                setDialect(v)
              }
            >
              <SelectTrigger className="w-[140px] hover:border-orange-200 dark:hover:border-orange-600 dark:border-gray-700">
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
              className="hover:border-orange-200 dark:hover:border-orange-600 dark:border-gray-700"
            >
              Save
            </Button>
            <Button
              size="sm"
              className="bg-orange-600 hover:bg-orange-700 text-white dark:bg-orange-700 dark:hover:bg-orange-800"
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
        <div className="border-r bg-muted/10 flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden dark:border-gray-800 dark:bg-gray-900/50">
          <div className="flex-none p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                SQL Input
              </h2>
            </div>
            <div className="relative">
              <SyntaxTextarea
                placeholder="Enter your SQL schema here..."
                value={schema}
                onValueChange={setSchema}
                className="min-h-[300px] resize-none font-mono text-sm border-gray-200 hover:border-orange-200 focus:border-orange-300 focus:ring-orange-200 dark:border-gray-700 dark:hover:border-orange-600 dark:focus:border-orange-500 dark:focus:ring-orange-500/20 dark:bg-gray-800/50 dark:text-gray-100"
              />
            </div>
            <Button
              className="w-full bg-orange-600 hover:bg-orange-700 text-white dark:bg-orange-700 dark:hover:bg-orange-800"
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
          {renderError ? (
            <div className="flex items-center justify-center h-full p-4 text-red-500 dark:text-red-400">
              <p>{renderError}</p>
            </div>
          ) : isGenerating ? (
            <div className="flex items-center justify-center h-full">
              <div className="loading-skeleton h-full w-full dark:bg-gray-800/50" />
            </div>
          ) : !dbmlStructure.nodes.length ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 gap-3">
              <div className="bg-orange-100 dark:bg-orange-900/50 p-4 rounded-full">
                <ChevronRight className="h-10 w-10 text-orange-600 dark:text-orange-400" />
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

      <ShareDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        schema={schema}
        dialect={dialect}
      />
    </div>
  );
}
