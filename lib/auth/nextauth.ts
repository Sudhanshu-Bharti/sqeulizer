import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db/drizzle";
import {
  users,
  teams,
  teamMembers,
  type NewUser,
  type NewTeam,
  type NewTeamMember,
  ActivityType,
  activityLogs,
  type NewActivityLog,
} from "@/lib/db/schema";
import { comparePasswords } from "@/lib/auth/session";
import { eq, and, isNull } from "drizzle-orm";

// Helper function to log user activity
async function logActivity(
  teamId: number | null | undefined,
  userId: number,
  type: ActivityType,
  ipAddress?: string
) {
  if (teamId === null || teamId === undefined) {
    return;
  }
  const newActivity: NewActivityLog = {
    teamId,
    userId,
    action: type,
    ipAddress: ipAddress || "",
  };
  await db.insert(activityLogs).values(newActivity);
}

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role?: string;
      provider?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    role?: string;
    provider?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: string;
    provider?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db
          .select()
          .from(users)
          .where(
            and(eq(users.email, credentials.email), isNull(users.deletedAt))
          )
          .limit(1);

        if (user.length === 0 || !user[0].passwordHash) {
          return null;
        }

        const isPasswordValid = await comparePasswords(
          credentials.password,
          user[0].passwordHash
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user[0].id.toString(),
          email: user[0].email,
          name: user[0].name,
          image: user[0].image,
          role: user[0].role,
          provider: user[0].provider || "credentials",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Check if user already exists
          const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, user.email!))
            .limit(1);

          if (existingUser.length === 0) {
            // Create new user for Google OAuth
            const newUserData: NewUser = {
              name: user.name,
              email: user.email!,
              provider: "google",
              providerId: account.providerAccountId,
              image: user.image,
              emailVerified: new Date(),
              role: "owner",
            };

            const newUser = await db
              .insert(users)
              .values(newUserData)
              .returning();

            if (newUser.length > 0) {
              // Create a default team for the new user
              const teamData: NewTeam = {
                name: `${
                  user.name || user.email?.split("@")[0] || "User"
                }'s Team`,
              };

              const team = await db.insert(teams).values(teamData).returning();

              if (team.length > 0) {
                const teamMemberData: NewTeamMember = {
                  userId: newUser[0].id,
                  teamId: team[0].id,
                  role: "owner",
                };

                await db.insert(teamMembers).values(teamMemberData);

                // Log the signup activity
                await logActivity(
                  team[0].id,
                  newUser[0].id,
                  ActivityType.SIGN_UP
                );
              }

              // Update user object with database ID
              user.id = newUser[0].id.toString();
              user.role = newUser[0].role;
              user.provider = newUser[0].provider || "google";
            }
          } else {
            // Update existing user with Google info if not already set
            if (existingUser[0].provider === "credentials") {
              await db
                .update(users)
                .set({
                  provider: "google",
                  providerId: account.providerAccountId,
                  image: user.image,
                  emailVerified: new Date(),
                })
                .where(eq(users.id, existingUser[0].id));
            }

            // Use existing user data
            user.id = existingUser[0].id.toString();
            user.role = existingUser[0].role;
            user.provider = existingUser[0].provider || "google";

            // Get user's team for activity logging
            const userTeam = await db
              .select({ teamId: teamMembers.teamId })
              .from(teamMembers)
              .where(eq(teamMembers.userId, existingUser[0].id))
              .limit(1);

            if (userTeam.length > 0) {
              await logActivity(
                userTeam[0].teamId,
                existingUser[0].id,
                ActivityType.SIGN_IN
              );
            }
          }
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.provider = user.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.provider = token.provider;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  secret: process.env.AUTH_SECRET,
};
