import { NextResponse, NextRequest } from "next/server";
import { sqlToDbml } from "@/lib/parsing/parser";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const sqlFile = formData.get("file") as File;
  const sqlContent = formData.get("sql") as string;
  const dialect = (formData.get("dialect") as string) || "postgres";

  if (!sqlFile && !sqlContent) {
    return NextResponse.json(
      { message: "Either SQL file or SQL content is required" },
      { status: 400 }
    );
  }

  try {
    let dbmlCode;
    if (sqlFile) {
      const buffer = await sqlFile.arrayBuffer();
      const content = Buffer.from(buffer).toString("utf-8");
      dbmlCode = sqlToDbml(content, dialect as "mysql" | "postgres" | "mssql");
    } else {
      dbmlCode = sqlToDbml(
        sqlContent,
        dialect as "mysql" | "postgres" | "mssql"
      );
    }

    return NextResponse.json({
      dbml: dbmlCode,
      source: "dbml-parser",
    });
  } catch (error) {
    console.error("Error processing SQL:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);

    return NextResponse.json(
      { message: "Failed to parse SQL schema", error: errorMessage },
      { status: 500 }
    );
  }
}
