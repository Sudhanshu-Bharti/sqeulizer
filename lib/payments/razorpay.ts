import Razorpay from "razorpay";
import { redirect } from "next/navigation";
import { Team } from "@/lib/db/schema";
import {
  getTeamByRazorpayCustomerId,
  getUser,
  updateTeamSubscription,
} from "@/lib/db/queries";

// Add logging to debug credentials
console.log("=== RAZORPAY ENVIRONMENT DEBUG ===");
console.log(
  "RAZORPAY_KEY_ID:",
  process.env.RAZORPAY_KEY_ID?.substring(0, 12) + "..."
);
console.log(
  "NEXT_PUBLIC_RAZORPAY_KEY_ID:",
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.substring(0, 12) + "..."
);
console.log("RAZORPAY_MODE:", process.env.RAZORPAY_MODE);
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log(
  "Key starts with live?",
  process.env.RAZORPAY_KEY_ID?.startsWith("rzp_live")
);
console.log(
  "Key starts with test?",
  process.env.RAZORPAY_KEY_ID?.startsWith("rzp_test")
);
console.log("Razorpay Key ID exists:", !!process.env.RAZORPAY_KEY_ID);
console.log("Razorpay Secret exists:", !!process.env.RAZORPAY_KEY_SECRET);
console.log("================================");

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createCheckoutSession({
  team,
  planId,
}: {
  team: Team | null;
  planId: string;
}) {
  try {
    console.log("=== CREATE CHECKOUT SESSION DEBUG ===");
    console.log("Creating checkout for planId:", planId);
    console.log("Using Razorpay mode:", process.env.RAZORPAY_MODE);
    console.log(
      "Using key ID:",
      process.env.RAZORPAY_KEY_ID?.substring(0, 12) + "..."
    );

    const user = await getUser();

    if (!team || !user) {
      redirect(`/sign-up?redirect=checkout&planId=${planId}`);
    }

    // Fetch plan details first
    console.log("Fetching plan details from Razorpay...");
    const plan = await razorpay.plans.fetch(planId);
    console.log("Fetched plan details:", {
      id: plan.id,
      name: plan.item?.name,
      amount: plan.item?.amount,
      currency: plan.item?.currency,
      period: plan.period,
    });
    const options = {
      amount: plan.item.amount,
      currency: plan.item.currency,
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
      notes: {
        userId: user.id.toString(),
        teamId: team.id.toString(),
      },
    };

    console.log("Creating Razorpay order with options:", options);
    const order = await razorpay.orders.create(options);
    console.log("Created order successfully:", {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
    }); // Create a subscription if it's a recurring plan (checking plan properties)
    if (plan.period === "monthly" || plan.period === "yearly") {
      console.log("Creating subscription for recurring plan");
      const subscriptionOptions = {
        plan_id: planId,
        customer_notify: 1 as const,
        total_count: plan.period === "monthly" ? 12 : 1, // 12 months for monthly, 1 year for yearly
        notes: {
          userId: user.id.toString(),
          teamId: team.id.toString(),
        },
      };

      console.log("Creating subscription with options:", subscriptionOptions);
      const subscription = await razorpay.subscriptions.create(
        subscriptionOptions
      );

      console.log("Created subscription successfully:", {
        id: subscription.id,
        status: subscription.status,
        plan_id: subscription.plan_id,
        short_url: subscription.short_url,
      });

      return {
        orderId: order.id,
        subscriptionId: subscription.id,
        amount: order.amount,
        currency: order.currency,
        short_url: subscription.short_url, // Return the subscription's short_url
      };
    }

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    };
  } catch (error) {
    console.error("Error creating checkout session:", error);

    // Add more detailed error logging for live mode debugging
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    // Check if it's a Razorpay API error
    if (error && typeof error === "object" && "error" in error) {
      console.error("Razorpay error details:", JSON.stringify(error, null, 2));
    }

    throw error;
  }
}

export async function createCustomerPortalSession(team: Team) {
  if (!team.razorpayCustomerId || !team.razorpayPlanId) {
    return { redirectTo: "/pricing" };
  }

  try {
    // In Razorpay, we'll redirect to the subscription management page
    const subscription = await razorpay.subscriptions.fetch(
      team.razorpaySubscriptionId!
    );
    return {
      url: `https://dashboard.razorpay.com/app/subscriptions/${subscription.id}`,
    };
  } catch (error) {
    console.error("Error creating customer portal session:", error);
    throw error;
  }
}

export async function handleSubscriptionChange(subscription: any) {
  try {
    const customerId = subscription.customer_id;
    const subscriptionId = subscription.id;
    const status = subscription.status;

    const team = await getTeamByRazorpayCustomerId(customerId);

    if (!team) {
      console.error("Team not found for Razorpay customer:", customerId);
      return;
    }

    if (status === "active") {
      const plan = await razorpay.plans.fetch(subscription.plan_id);
      await updateTeamSubscription(team.id, {
        razorpaySubscriptionId: subscriptionId,
        razorpayPlanId: plan.id,
        planName: plan.item.name,
        subscriptionStatus: status,
      });
    } else if (status === "cancelled" || status === "expired") {
      await updateTeamSubscription(team.id, {
        razorpaySubscriptionId: null,
        razorpayPlanId: null,
        planName: null,
        subscriptionStatus: status,
      });
    }
  } catch (error) {
    console.error("Error handling subscription change:", error);
    throw error;
  }
}

export async function getRazorpayPlans() {
  try {
    const plans = await razorpay.plans.all();
    console.log("Razorpay plans response:", plans);
    return plans.items.map((plan: any) => ({
      id: plan.id,
      entity: plan.entity,
      interval: plan.interval,
      period: plan.period,
      item: plan.item,
      notes: plan.notes,
      created_at: plan.created_at,
    }));
  } catch (error) {
    console.error("Error getting Razorpay plans:", error);
    throw error;
  }
}

export async function getRazorpayProducts() {
  try {
    const plans = await getRazorpayPlans();
    return plans.map((plan: any) => ({
      id: plan.id,
      name: plan.item.name,
      description: plan.item.description,
      amount: plan.item.amount,
      currency: plan.item.currency,
      interval: plan.period,
      trialPeriodDays: plan.item.trial_period_days,
    }));
  } catch (error) {
    console.error("Error getting Razorpay products:", error);
    throw error;
  }
}
