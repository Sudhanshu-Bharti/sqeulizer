import { NextResponse, NextRequest } from "next/server";
import { sqlToDbml } from "@/lib/parsing/parser";
import { db } from "@/lib/db/drizzle";
import { and, eq, gte, count } from "drizzle-orm";
import { diagramGenerations, users, teams, teamMembers } from "@/lib/db/schema";
import { getHybridUser } from "@/lib/auth/hybrid-session";

const FREE_USER_LIMIT = 3;
const GENERATION_WINDOW_DAYS = 30;

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user
    const user = await getHybridUser();
    if (!user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get user's team and check plan
    const userTeam = await db.query.teamMembers.findFirst({
      where: eq(teamMembers.userId, user.id),
      with: {
        team: true
      }
    });

    if (!userTeam?.team) {
      return NextResponse.json({ message: "No team found" }, { status: 404 });
    }

    // Check generations in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - GENERATION_WINDOW_DAYS);

    const [result] = await db
      .select({ generationCount: count(diagramGenerations.id) })
      .from(diagramGenerations)
      .where(
        and(
          eq(diagramGenerations.userId, user.id),
          gte(diagramGenerations.generatedAt, thirtyDaysAgo)
        )
      );

    // Set limit based on plan
    const limit = userTeam.team.planName === "Free" ? FREE_USER_LIMIT : Infinity;
    
    const generationStats = {
      used: result?.generationCount || 0,
      limit: limit,
      remainingDays: Math.ceil((thirtyDaysAgo.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      plan: userTeam.team.planName
    };

    // Only check limits for free plan
    if (userTeam.team.planName === "Free" && generationStats.used >= FREE_USER_LIMIT) {
      return NextResponse.json(
        {
          message: `Free users are limited to ${FREE_USER_LIMIT} diagram generations per ${GENERATION_WINDOW_DAYS} days. Please upgrade to Plus or Base plan for unlimited generations.`,
          ...generationStats
        },
        { status: 403 }
      );
    }

    console.log(`User on ${userTeam.team.planName} plan has used ${generationStats.used} generations`);

    const formData = await req.formData();
    const sqlContent = formData.get("sql") as string;
    const dialect = (formData.get("dialect") as string) || "postgres";

    if (!sqlContent) {
      return NextResponse.json(
        { message: "No SQL content provided" },
        { status: 400 }
      );
    }

    console.log("Attempting to parse SQL:", {
      dialect,
      sqlLength: sqlContent.length,
      firstFewChars: sqlContent.substring(0, 100),
    });

    try {
      const dbmlStructure = sqlToDbml(
        sqlContent,
        dialect as "mysql" | "postgres" | "mssql"
      );

      if (!dbmlStructure || !dbmlStructure.nodes || !dbmlStructure.edges) {
        console.error("Invalid DBML structure:", dbmlStructure);
        return NextResponse.json(
          {
            message: "Failed to generate valid diagram structure",
            details: "The parser returned an invalid or empty structure",
            generationStats
          },
          { status: 500 }
        );
      }

      // Record the generation
      await db.insert(diagramGenerations).values({
        userId: user.id,
        generatedAt: new Date(),
      });

      // Update the stats after recording the generation
      generationStats.used += 1;

      return NextResponse.json({
        dbml: dbmlStructure,
        source: "sql-parser",
        generationStats
      });
    } catch (parserError) {
      console.error("SQL parsing error:", parserError);
      return NextResponse.json(
        {
          message: "Failed to parse SQL schema",
          error: parserError instanceof Error ? parserError.message : String(parserError),
          details: "The SQL parser encountered an error while processing your schema",
          generationStats
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Route error:", error);
    return NextResponse.json(
      {
        message: "Failed to process request",
        error: error instanceof Error ? error.message : String(error),
        details: "An unexpected error occurred while processing your request"
      },
      { status: 500 }
    );
  }
}
