import { eq } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";
import { users, teams, teamMembers } from "@/lib/db/schema";
import { setSession } from "@/lib/auth/session";
import { NextRequest, NextResponse } from "next/server";
import { razorpay } from "@/lib/payments/razorpay";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const orderId = searchParams.get("order_id");
  const paymentId = searchParams.get("razorpay_payment_id");
  const subscriptionId = searchParams.get("subscription_id");

  if (!orderId || !paymentId) {
    return NextResponse.redirect(new URL("/pricing", request.url));
  }

  try {
    const order = await razorpay.orders.fetch(orderId);
    const userId = order.notes?.userId;

    if (!userId) {
      throw new Error("No user ID found in order notes.");
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(userId)))
      .limit(1);

    if (user.length === 0) {
      throw new Error("User not found in database.");
    }

    const userTeam = await db
      .select({
        teamId: teamMembers.teamId,
      })
      .from(teamMembers)
      .where(eq(teamMembers.userId, user[0].id))
      .limit(1);

    if (userTeam.length === 0) {
      throw new Error("User is not associated with any team.");
    }

    // Verify the payment was successful
    const payment = await razorpay.payments.fetch(paymentId);
    if (payment.status !== "captured") {
      throw new Error("Payment was not successful");
    }

    // If this is a subscription payment
    if (subscriptionId) {
      const subscription = await razorpay.subscriptions.fetch(subscriptionId);
      const plan = await razorpay.plans.fetch(subscription.plan_id);

      // Update team with subscription details
      await db
        .update(teams)
        .set({
          razorpayCustomerId: subscription.customer_id,
          razorpaySubscriptionId: subscriptionId,
          razorpayPlanId: plan.id,
          planName: plan.item.name,
          subscriptionStatus: subscription.status,
          updatedAt: new Date(),
        })
        .where(eq(teams.id, userTeam[0].teamId));

      // Log the subscription creation
      console.log(`Subscription created for team ${userTeam[0].teamId}:`, {
        subscriptionId,
        planId: plan.id,
        status: subscription.status,
      });
    } else {
      // For one-time payments
      await db
        .update(teams)
        .set({
          razorpayCustomerId: payment.customer_id,
          updatedAt: new Date(),
        })
        .where(eq(teams.id, userTeam[0].teamId));
    }

    await setSession(user[0]);
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error("Error handling successful checkout:", error);
    return NextResponse.redirect(new URL("/error", request.url));
  }
}
