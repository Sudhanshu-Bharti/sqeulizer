import { NextRequest, NextResponse } from "next/server";
import { getHybridUser } from "@/lib/auth/hybrid-session";
import { db } from "@/lib/db/drizzle";
import { and, eq, gte, count } from "drizzle-orm";
import { diagramGenerations, teamMembers } from "@/lib/db/schema";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Constants
const FREE_USER_LIMIT = 3;
const ANALYSIS_WINDOW_DAYS = 30;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" });

export async function POST(req: NextRequest) {
  try {
    const user = await getHybridUser();
    if (!user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userTeam = await db.query.teamMembers.findFirst({
      where: eq(teamMembers.userId, user.id),
      with: { team: true },
    });

    if (!userTeam?.team) {
      return NextResponse.json({ message: "No team found" }, { status: 404 });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - ANALYSIS_WINDOW_DAYS);

    const [result] = await db
      .select({ generationCount: count(diagramGenerations.id) })
      .from(diagramGenerations)
      .where(
        and(
          eq(diagramGenerations.userId, user.id),
          gte(diagramGenerations.generatedAt, thirtyDaysAgo)
        )
      );

    const limit = userTeam.team.planName === "Free" ? FREE_USER_LIMIT : Infinity;

    const analysisStats = {
      used: result?.generationCount || 0,
      limit,
      remainingDays: Math.ceil(
        (new Date().getTime() - thirtyDaysAgo.getTime()) / (1000 * 60 * 60 * 24)
      ),
      plan: userTeam.team.planName,
    };

    if (limit !== Infinity && analysisStats.used >= limit) {
      return NextResponse.json(
        {
          message: `Free users are limited to ${FREE_USER_LIMIT} schema analyses per ${ANALYSIS_WINDOW_DAYS} days. Please upgrade to Plus or Base plan for unlimited analyses.`,
          ...analysisStats,
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { sql, dialect = "postgres" } = body;

    if (!sql || typeof sql !== "string") {
      return NextResponse.json({ message: "SQL schema is required" }, { status: 400 });
    }

    try {
      // Improved prompt requesting raw JSON only
      const prompt = `Analyze the following SQL schema for potential security vulnerabilities, normalization issues (up to 3NF), performance bottlenecks, and overall schema robustness. Provide the analysis results in a raw JSON object matching the following TypeScript structure. **Do not include any explanations or markdown blocks. Output only valid JSON.**

interface SecurityIssue {
  type: "critical" | "warning" | "info";
  category: "authentication" | "authorization" | "data-integrity" | "injection" | "encryption" | "audit" | "performance";
  table: string;
  field?: string;
  title: string;
  description: string;
  recommendation: string;
  impact: "high" | "medium" | "low";
}

interface NormalizationIssue {
  type: "violation" | "warning" | "suggestion";
  normalForm: "1NF" | "2NF" | "3NF" | "BCNF";
  table: string;
  fields?: string[];
  title: string;
  description: string;
  recommendation: string;
}

interface RobustnessMetric {
  category: "performance" | "maintainability" | "scalability" | "reliability";
  metric: string;
  score: number; // Numerical score from 0 to 100, representing a percentage.
  status: "excellent" | "good" | "fair" | "poor";
  description: string;
  suggestions: string[];
}

interface SchemaAnalysisResult {
  overallScore: number;
  securityIssues: SecurityIssue[];
  normalizationIssues: NormalizationIssue[];
  robustnessMetrics: RobustnessMetric[];
  summary: {
    totalTables: number;
    totalFields: number;
    totalRelationships: number;
    securityScore: number;
    normalizationScore: number;
    robustnessScore: number;
  };
}

Analyze the following SQL schema (dialect: ${dialect}) and return only the raw JSON object:

${sql}
`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text().trim();

      // Optional logging for debugging
      console.log("Gemini raw response:", text);

      // Try parsing JSON: from markdown block or raw text
      let analysisResult: any = null;
      try {
        const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
        const rawJson = jsonMatch?.[1] ?? text;
        analysisResult = JSON.parse(rawJson);

        // Validate expected structure
        if (
          typeof analysisResult.overallScore !== "number" ||
          !Array.isArray(analysisResult.securityIssues)
        ) {
          throw new Error("Parsed JSON does not match expected SchemaAnalysisResult structure.");
        }
      } catch (jsonError) {
        console.error("Failed to parse Gemini JSON response:", jsonError);
        return NextResponse.json(
          {
            message: "Failed to parse analysis result from AI. Please try again.",
            error: jsonError instanceof Error ? jsonError.message : "Unknown parsing error",
            analysisStats,
          },
          { status: 500 }
        );
      }

      // Log the analysis attempt
      await db.insert(diagramGenerations).values({
        userId: user.id,
        generatedAt: new Date(),
      });

      analysisStats.used += 1;

      return NextResponse.json({
        success: true,
        analysis: analysisResult,
        schemaInfo: {
          dialect,
          tablesCount: analysisResult.summary?.totalTables || 0,
          fieldsCount: analysisResult.summary?.totalFields || 0,
          relationshipsCount: analysisResult.summary?.totalRelationships || 0,
        },
        analysisStats,
      });
    } catch (error) {
      console.error("Gemini analysis error:", error);
      return NextResponse.json(
        {
          message: "Failed to perform schema analysis using AI.",
          error: error instanceof Error ? error.message : "Unknown error",
          analysisStats,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Route error:", error);
    return NextResponse.json(
      {
        message: "Internal server error during schema analysis",
        error: error instanceof Error ? error.message : "Unknown error",
        details: "An unexpected error occurred while processing your request",
      },
      { status: 500 }
    );
  }
}
