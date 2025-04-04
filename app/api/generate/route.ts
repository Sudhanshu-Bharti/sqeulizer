import { NextResponse, NextRequest } from "next/server";
import { sqlToDbml } from "@/lib/parsing/parser";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const sqlContent = formData.get("sql") as string;
    const dialect = (formData.get("dialect") as string) || "postgres";

    console.log("Received SQL:", sqlContent);

    const dbmlStructure = sqlToDbml(
      sqlContent,
      dialect as "mysql" | "postgres" | "mssql"
    );

    console.log("Generated DBML Structure:", dbmlStructure);

    return NextResponse.json({
      dbml: dbmlStructure,
      source: "sql-parser",
    });
  } catch (error) {
    console.error("Error processing SQL:", error);
    return NextResponse.json(
      {
        message: "Failed to parse SQL schema",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
