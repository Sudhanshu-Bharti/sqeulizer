"use server";

import { createCheckoutSession } from "@/lib/payments/razorpay";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/db/queries";
import { createCustomerPortalSession } from "./razorpay";
import { withTeam } from "@/lib/auth/middleware";
import { db } from "@/lib/db/drizzle";
import { eq } from "drizzle-orm";
import { teams, teamMembers } from "@/lib/db/schema";

export async function checkoutAction(formData: FormData): Promise<any> {
  "use server";

  const planId = formData.get("planId") as string;
  const user = await getUser();

  if (!user) {
    redirect("/sign-up?redirect=checkout&planId=" + planId);
  }

  // Get user's team with complete team data
  const userTeam = await db
    .select({
      team: teams,
    })
    .from(teamMembers)
    .innerJoin(teams, eq(teams.id, teamMembers.teamId))
    .where(eq(teamMembers.userId, user.id))
    .limit(1);

  if (!userTeam.length) {
    redirect("/sign-up?redirect=checkout&planId=" + planId);
  }
  const team = userTeam[0].team;

  console.log("Starting checkout for planId:", planId);
  console.log("Team details:", { id: team.id, name: team.name });

  const checkout = await createCheckoutSession({
    team,
    planId,
  });
  console.log("Checkout result:", checkout);
  // Always return checkout data for integrated payment (including subscriptions)
  // This ensures users go through the Razorpay modal and get redirected back properly
  return {
    orderId: checkout.orderId,
    amount: checkout.amount,
    currency: checkout.currency,
    subscriptionId: checkout.subscriptionId,
    short_url: checkout.short_url, // Include short_url for payment option selector
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  };
}

export const customerPortalAction = withTeam(async (_, team) => {
  "use server";

  const portalSession = await createCustomerPortalSession(team);

  if ("redirectTo" in portalSession && portalSession.redirectTo) {
    redirect(portalSession.redirectTo);
  }

  if ("url" in portalSession && portalSession.url) {
    redirect(portalSession.url);
  }

  // Fallback if neither redirectTo nor url is present
  redirect("/dashboard");
});
