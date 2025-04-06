"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import DBMLDiagram from "@/app/(dashboard)/live/components/DBMLDiagram";
import { toast } from "@/components/ui/use-toast";
import { ChevronRight } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface TableNode {
  id: string;
  name: string;
  fields: {
    name: string;
    type: string;
    constraints: string[];
  }[];
}

export default function SharePage() {
  const searchParams = useSearchParams();
  const [nodes, setNodes] = useState<TableNode[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateDiagram = async () => {
      const sharedSchema = searchParams.get("schema");
      const sharedDialect = searchParams.get("dialect") as
        | "mysql"
        | "postgres"
        | "mssql";

      if (!sharedSchema) {
        setError("No schema provided");
        setIsLoading(false);
        return;
      }

      try {
        const decodedSchema = decodeURIComponent(sharedSchema);
        const formData = new FormData();
        formData.append("sql", decodedSchema);
        formData.append("dialect", sharedDialect || "mysql");

        const result = await fetch("/api/generate", {
          method: "POST",
          body: formData,
        });

        if (!result.ok) {
          throw new Error("Failed to generate diagram");
        }

        const data = await result.json();
        if (data.dbml) {
          setNodes(data.dbml.nodes);
          setEdges(data.dbml.edges);
          setError(null);
        } else {
          throw new Error("No diagram data generated");
        }
      } catch (error) {
        console.error("Error generating diagram:", error);
        setError("Failed to generate diagram");
        toast({
          title: "Error",
          description: "Failed to generate the diagram. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    generateDiagram();
  }, [searchParams]);

  return (
      <div className="h-screen flex flex-col">
        {/* Main Content */}
        <div className="flex-1 relative bg-background/50 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="loading-skeleton h-full w-full" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full p-4 text-red-500 dark:text-red-400">
              <p>{error}</p>
            </div>
          ) : !nodes.length ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <div className="bg-orange-100  p-4 rounded-full">
                <ChevronRight className="h-10 w-10 text-orange-600 dark:text-orange-400" />
              </div>
              <p>No diagram data available</p>
            </div>
          ) : (
            <DBMLDiagram nodes={nodes} edges={edges} />
          )}
        </div>
      </div>
  );
}
