import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { sqlToDbml } from "@/lib/parsing/parser";
import { DatabaseSchemaAnalyzer } from "@/lib/schema-analysis/analyzer";
import { db } from "@/lib/db/drizzle";
import { and, eq, gte, count } from "drizzle-orm";
import { diagramGenerations, users, teams, teamMembers } from "@/lib/db/schema";

// Analysis has the same limits as diagram generation
const FREE_USER_LIMIT = 3;
const ANALYSIS_WINDOW_DAYS = 30;

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get user's team and check plan
    const userTeam = await db.query.teamMembers.findFirst({
      where: eq(teamMembers.userId, session.user.id),
      with: {
        team: true,
      },
    });

    if (!userTeam?.team) {
      return NextResponse.json({ message: "No team found" }, { status: 404 });
    }

    // Check analysis/generations in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - ANALYSIS_WINDOW_DAYS);

    const [result] = await db
      .select({ generationCount: count(diagramGenerations.id) })
      .from(diagramGenerations)
      .where(
        and(
          eq(diagramGenerations.userId, session.user.id),
          gte(diagramGenerations.generatedAt, thirtyDaysAgo)
        )
      );

    // Set limit based on plan
    const limit =
      userTeam.team.planName === "Free" ? FREE_USER_LIMIT : Infinity;

    const analysisStats = {
      used: result?.generationCount || 0,
      limit: limit,
      remainingDays: Math.ceil(
        (new Date().getTime() - thirtyDaysAgo.getTime()) / (1000 * 60 * 60 * 24)
      ),
      plan: userTeam.team.planName,
    };

    // Only check limits for free plan
    if (
      userTeam.team.planName === "Free" &&
      analysisStats.used >= FREE_USER_LIMIT
    ) {
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
      const analysisResult = analyzer.analyze(); // Record the analysis as a generation (using the same tracking system)
      await db.insert(diagramGenerations).values({
        userId: session.user.id,
        generatedAt: new Date(),
      });

      // Update the stats after recording the analysis
      analysisStats.used += 1;

      return NextResponse.json({
        success: true,
        analysis: analysisResult,
        schemaInfo: {
          dialect,
          tablesCount: dbmlStructure.nodes.length,
          relationshipsCount: dbmlStructure.edges.length,
        },
        analysisStats,
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
          analysisStats,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Schema analysis error:", error);
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
