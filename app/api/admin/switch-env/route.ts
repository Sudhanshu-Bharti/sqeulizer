/**
 * Environment Switching API Route
 * Handles switching between test and live Razorpay environments
 */

import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/admin";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    // Block access in production
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Admin API is disabled in production" },
        { status: 403 }
      );
    }

    // Check admin authentication
    const isAuthenticated = await isAdminAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Admin authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { environment } = body;

    // Validate environment parameter
    if (!environment || !["test", "live"].includes(environment)) {
      return NextResponse.json(
        { error: "Invalid environment. Must be 'test' or 'live'" },
        { status: 400 }
      );
    }

    // Path to the switch script
    const scriptPath = path.join(process.cwd(), "scripts", "switch-env.js");

    // Execute the environment switch script
    const { stdout, stderr } = await execAsync(
      `node "${scriptPath}" ${environment}`,
      {
        cwd: process.cwd(),
        timeout: 10000, // 10 second timeout
      }
    );

    if (stderr) {
      console.error("Environment switch stderr:", stderr);
      return NextResponse.json(
        { error: "Failed to switch environment", details: stderr },
        { status: 500 }
      );
    }

    // Parse the response from the script
    const result = {
      success: true,
      environment,
      message: `Successfully switched to ${environment} environment`,
      output: stdout.trim(),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Environment switch error:", error);

    // Handle specific error types
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Handle exec errors
    if (error && typeof error === "object") {
      const execError = error as any;

      if (execError.code === "ENOENT") {
        return NextResponse.json(
          { error: "Environment switch script not found" },
          { status: 500 }
        );
      }

      if (execError.killed || execError.signal === "SIGTERM") {
        return NextResponse.json(
          { error: "Environment switch operation timed out" },
          { status: 408 }
        );
      }
    }

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to switch environment", details: errorMessage },
      { status: 500 }
    );
  }
}

// Only allow POST requests for environment switching
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: "Method not allowed. Use POST to switch environments." },
    { status: 405 }
  );
}
