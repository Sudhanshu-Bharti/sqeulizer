"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CustomButton } from "@/components/ui/custom-button";
import { SyntaxTextarea } from "@/components/ui/syntax-textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRight, Copy, Download, Sparkles, Code } from "lucide-react";
import { useTheme } from "next-themes";
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

export default function DBSchemaVisualizer() {
  const [schema, setSchema] = useState("");
  const [dbmlCode, setDbmlCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dbmlStructure, setDbmlStructure] = useState({ nodes: [], edges: [] });
  const [timeoutError, setTimeoutError] = useState(false);
  const [dialect, setDialect] = useState<"mysql" | "postgres" | "mssql">(
    "postgres"
  );

  // Function to handle file upload
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

      const result = await Promise.race([
        fetch("/api/generate", {
          method: "POST",
          body: formData,
        }),
        timeoutPromise,
      ]);

      if (!result.ok) {
        throw new Error("Failed to generate DBML");
      }

      const data = await result.json();
      if (data.dbml) {
        setDbmlStructure(data.dbml);
        setRenderError(null);
      } else {
        throw new Error("No DBML generated");
      }
    } catch (error) {
      console.error("Error generating DBML:", error);
      if (error.message === "Generation timed out") {
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

  const copyToClipboard = () => {
    if (!dbmlCode) return;

    navigator.clipboard
      .writeText(dbmlCode)
      .then(() => {
        toast({
          title: "Copied!",
          description: "DBML code copied to clipboard",
        });
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
        toast({
          title: "Copy Failed",
          description: "Could not copy to clipboard",
          variant: "destructive",
        });
      });
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
    <div className="h-screen flex flex-col">
      {/* Top Navigation */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-14 items-center justify-between">
          <h1 className="font-semibold">Database Schema Visualizer</h1>
          <div className="flex items-center gap-2">
            <Select value={dialect} onValueChange={(v) => setDialect(v)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mysql">MySQL</SelectItem>
                <SelectItem value="postgres">PostgreSQL</SelectItem>
                <SelectItem value="mssql">MS SQL Server</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              Save
            </Button>
            <Button size="sm">Share</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-[320px_1fr] overflow-hidden">
        {/* Left Sidebar */}
        <div className="border-r bg-muted/10 flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden">
          <div className="flex-none p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium">SQL Input</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => document.getElementById("sql-upload")?.click()}
              >
                Upload SQL
              </Button>
              <input
                id="sql-upload"
                type="file"
                accept=".sql"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            <div className="relative">
              <SyntaxTextarea
                placeholder="Enter your SQL schema here..."
                value={schema}
                onValueChange={setSchema}
                className="min-h-[300px] resize-none font-mono text-sm"
              />
            </div>
            <Button
              className="w-full"
              onClick={generateDiagram}
              disabled={!schema.trim()}
              isLoading={isLoading}
              variant="default"
            >
              {isLoading ? "Generating..." : "Generate Diagram"}
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto border-t bg-background/50">
            <div className="p-4">
              <h2 className="text-sm font-medium mb-3">Example Schemas</h2>
              <Examples onSelectExample={handleExampleSelect} vertical />
            </div>
          </div>
        </div>

        {/* Main Diagram Area */}
        <div className="relative bg-background/50 overflow-hidden">
          {renderError ? (
            <div className="flex items-center justify-center h-full p-4 text-destructive">
              <p>{renderError}</p>
            </div>
          ) : isGenerating ? (
            <div className="flex items-center justify-center h-full">
              <div className="loading-skeleton h-full w-full" />
            </div>
          ) : !dbmlStructure.nodes.length ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
              <div className="bg-muted p-4 rounded-full">
                <ChevronRight className="h-10 w-10" />
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
  );
}
