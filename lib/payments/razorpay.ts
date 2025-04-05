import Razorpay from "razorpay";
import { redirect } from "next/navigation";
import { Team } from "@/lib/db/schema";
import {
  getTeamByRazorpayCustomerId,
  getUser,
  updateTeamSubscription,
} from "@/lib/db/queries";

// Add logging to debug credentials
console.log("Razorpay Key ID exists:", !!process.env.RAZORPAY_KEY_ID);
console.log("Razorpay Secret exists:", !!process.env.RAZORPAY_KEY_SECRET);

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
    const user = await getUser();

    if (!team || !user) {
      redirect(`/sign-up?redirect=checkout&planId=${planId}`);
    }

    // Fetch plan details first
    const plan = await razorpay.plans.fetch(planId);

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

    const order = await razorpay.orders.create(options);

    // Create a subscription if it's a recurring plan
    if (planId.includes("subscription")) {
      const subscription = await razorpay.subscriptions.create({
        plan_id: planId,
        customer_notify: 1,
        total_count: 12, // 1 year subscription
        notes: {
          userId: user.id.toString(),
          teamId: team.id.toString(),
        },
      });

      return {
        orderId: order.id,
        subscriptionId: subscription.id,
        amount: order.amount,
        currency: order.currency,
      };
    }

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    };
  } catch (error) {
    console.error("Error creating checkout session:", error);
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
