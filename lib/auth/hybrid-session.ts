import { getServerSession } from "next-auth/next";
import { authOptions } from "./nextauth";
import { User } from "@/lib/db/schema";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/session";
import { desc, and, eq, isNull } from "drizzle-orm";

export async function getHybridUser(): Promise<User | null> {
  // First try to get NextAuth session (for OAuth users)
  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    // For NextAuth users, query the database directly
    const { db } = await import("@/lib/db/drizzle");
    const { users } = await import("@/lib/db/schema");

    const user = await db
      .select()
      .from(users)
      .where(
        and(eq(users.id, parseInt(session.user.id)), isNull(users.deletedAt))
      )
      .limit(1);

    return user.length > 0 ? user[0] : null;
  }

  // Fall back to custom session management (for credential users)
  return await getCustomUser();
}

// Custom session user retrieval (moved here to avoid circular dependency)
async function getCustomUser(): Promise<User | null> {
  const sessionCookie = (await cookies()).get("session");
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const sessionData = await verifyToken(sessionCookie.value);
  if (
    !sessionData ||
    !sessionData.user ||
    typeof sessionData.user.id !== "number"
  ) {
    return null;
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }

  const { db } = await import("@/lib/db/drizzle");
  const { users } = await import("@/lib/db/schema");

  const user = await db
    .select()
    .from(users)
    .where(and(eq(users.id, sessionData.user.id), isNull(users.deletedAt)))
    .limit(1);

  if (user.length === 0) {
    return null;
  }

  return user[0];
}

export async function getSession() {
  const session = await getServerSession(authOptions);
  return session;
}
