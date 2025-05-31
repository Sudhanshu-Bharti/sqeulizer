/**
 * Admin Authentication API
 * Simple password-based authentication for development tools
 */

import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin, logoutAdmin } from "@/lib/auth/admin";

export async function POST(request: NextRequest) {
  try {
    // Block admin access in production
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Admin access is disabled in production" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    const isAuthenticated = await authenticateAdmin(password);

    if (isAuthenticated) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
  } catch (error) {
    console.error("Admin auth error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await logoutAdmin();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin logout error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
