import { eq } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";
import { users, teams, teamMembers } from "@/lib/db/schema";
import { setSession } from "@/lib/auth/session";
import { NextRequest, NextResponse } from "next/server";
import { razorpay } from "@/lib/payments/razorpay";

export async function GET(request: NextRequest) {
  console.log("Starting checkout route handler");
  const searchParams = request.nextUrl.searchParams;
  const orderId = searchParams.get("order_id");
  const paymentId = searchParams.get("razorpay_payment_id");
  const subscriptionId = searchParams.get("subscription_id");

  console.log("Received parameters:", { orderId, paymentId, subscriptionId });

  if (!orderId || !paymentId) {
    console.log("Missing required parameters, redirecting to pricing");
    return NextResponse.redirect(new URL("/pricing", request.url));
  }

  try {
    console.log("Fetching order details from Razorpay");
    const order = await razorpay.orders.fetch(orderId);
    const userId = order.notes?.userId;

    console.log("Order details:", { orderId, userId });

    if (!userId) {
      throw new Error("No user ID found in order notes.");
    }

    console.log("Fetching user from database");
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(userId)))
      .limit(1);

    if (user.length === 0) {
      throw new Error("User not found in database.");
    }

    console.log("Fetching user's team");
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

    console.log("Verifying payment status");
    const payment = await razorpay.payments.fetch(paymentId);
    console.log("Payment status:", payment.status);

    // For subscription payments, we accept both 'authorized' and 'captured' statuses
    if (subscriptionId) {
      if (payment.status !== "authorized" && payment.status !== "captured") {
        throw new Error("Payment was not successful");
      }
    } else {
      // For one-time payments, we only accept 'captured' status
      if (payment.status !== "captured") {
        throw new Error("Payment was not successful");
      }
    }

    // If this is a subscription payment
    if (subscriptionId) {
      console.log("Processing subscription payment");
      const subscription = await razorpay.subscriptions.fetch(subscriptionId);
      const plan = await razorpay.plans.fetch(subscription.plan_id);

      console.log("Subscription and plan details:", {
        subscriptionId,
        planId: plan.id,
        status: subscription.status,
        customerId: subscription.customer_id,
      });

      // Update team with subscription details
      console.log("Updating team subscription in database");
      const updateResult = await db
        .update(teams)
        .set({
          razorpayCustomerId: subscription.customer_id,
          razorpaySubscriptionId: subscriptionId,
          razorpayPlanId: plan.id,
          planName: plan.item.name,
          subscriptionStatus: subscription.status,
          updatedAt: new Date(),
        })
        .where(eq(teams.id, userTeam[0].teamId))
        .returning();

      console.log("Team subscription updated successfully:", updateResult[0]);
    } else {
      console.log("Processing one-time payment");
      const updateResult = await db
        .update(teams)
        .set({
          razorpayCustomerId: payment.customer_id,
          updatedAt: new Date(),
        })
        .where(eq(teams.id, userTeam[0].teamId))
        .returning();

      console.log("Team payment details updated successfully:", updateResult[0]);
    }

    console.log("Setting user session");
    await setSession(user[0]);
    console.log("Redirecting to dashboard");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error("Error in checkout route:", error);
    return NextResponse.redirect(new URL("/error", request.url));
  }
}
