import { NextRequest, NextResponse } from "next/server";
import { razorpay } from "@/lib/payments/razorpay";
import { db } from "@/lib/db/drizzle";
import { users, teams, teamMembers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { setSession } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  console.log("Razorpay success route hit");
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get("session_id");
  const subscriptionId = searchParams.get("subscription_id");
  
  console.log("Success route parameters:", { sessionId, subscriptionId });
  
  if (!sessionId && !subscriptionId) {
    console.log("No session ID or subscription ID, redirecting to pricing");
    return NextResponse.redirect(new URL("/pricing", request.url));
  }

  try {
    // Handle subscription success
    if (subscriptionId) {
      console.log("Processing subscription success");
      const subscription = await razorpay.subscriptions.fetch(subscriptionId);
      const plan = await razorpay.plans.fetch(subscription.plan_id);
      
      // Get user ID from subscription notes
      const userId = subscription.notes?.userId;
      if (!userId) {
        throw new Error("No user ID found in subscription notes");
      }

      // Fetch user and team
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, Number(userId)))
        .limit(1);

      if (user.length === 0) {
        throw new Error("User not found");
      }

      const userTeam = await db
        .select({
          teamId: teamMembers.teamId,
        })
        .from(teamMembers)
        .where(eq(teamMembers.userId, user[0].id))
        .limit(1);

      if (userTeam.length === 0) {
        throw new Error("User team not found");
      }

      // Update team with subscription details
      await db
        .update(teams)
        .set({
          razorpayCustomerId: subscription.customer_id,
          razorpaySubscriptionId: subscriptionId,
          razorpayPlanId: plan.id,
          planName: plan.item.name,
          subscriptionStatus: "active",
          updatedAt: new Date(),
        })
        .where(eq(teams.id, userTeam[0].teamId));

      // Set user session
      await setSession(user[0]);
      
      console.log("Subscription processed successfully, redirecting to live page");
      return NextResponse.redirect(new URL("/live", request.url));
    }

    // Fallback redirect
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error("Error in success route:", error);
    return NextResponse.redirect(new URL("/error", request.url));
  }
}
