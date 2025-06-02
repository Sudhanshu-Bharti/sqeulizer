import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/db/queries";
import { sqlToDbml } from "@/lib/parsing/parser";
import { DatabaseSchemaAnalyzer } from "@/lib/schema-analysis/analyzer";

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { sql, dialect = "postgres" } = body;

    if (!sql || typeof sql !== "string") {
      return NextResponse.json(
        { message: "SQL schema is required" },
        { status: 400 }
      );
    }

    try {
      // Parse the SQL schema first
      const dbmlStructure = sqlToDbml(sql, dialect);

      if (!dbmlStructure.nodes || dbmlStructure.nodes.length === 0) {
        return NextResponse.json(
          { message: "No tables found in the provided SQL schema" },
          { status: 400 }
        );
      }

      // Analyze the schema
      const analyzer = new DatabaseSchemaAnalyzer(
        dbmlStructure.nodes,
        dbmlStructure.edges
      );
      const analysisResult = analyzer.analyze();

      return NextResponse.json({
        success: true,
        analysis: analysisResult,
        schemaInfo: {
          dialect,
          tablesCount: dbmlStructure.nodes.length,
          relationshipsCount: dbmlStructure.edges.length,
        },
      });
    } catch (parseError) {
      console.error("Schema parsing error:", parseError);
      return NextResponse.json(
        {
          message: "Failed to parse SQL schema",
          error:
            parseError instanceof Error
              ? parseError.message
              : "Unknown parsing error",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Schema analysis error:", error);
    return NextResponse.json(
      {
        message: "Internal server error during schema analysis",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
