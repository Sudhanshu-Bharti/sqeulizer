/**
 * Admin Authentication for Environment Management
 * Simple password-based access control for development tools
 */

import { cookies } from "next/headers";

// Simple admin authentication - only for development
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "dev123";
const ADMIN_SESSION_COOKIE = "admin_session";

export async function isAdminAuthenticated(): Promise<boolean> {
  // In production, admin panel should be completely disabled
  if (process.env.NODE_ENV === "production") {
    return false;
  }

  const cookieStore = await cookies();
  const adminSession = cookieStore.get(ADMIN_SESSION_COOKIE);

  return adminSession?.value === "authenticated";
}

export async function authenticateAdmin(password: string): Promise<boolean> {
  // Never allow admin access in production
  if (process.env.NODE_ENV === "production") {
    return false;
  }

  const isValid = password === ADMIN_PASSWORD;

  if (isValid) {
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_SESSION_COOKIE, "authenticated", {
      httpOnly: true,
      secure: false, // Always false since admin is disabled in production
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
    });
  }

  return isValid;
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}
