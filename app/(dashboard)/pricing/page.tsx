"use server";

import { getUser, getTeamForUser } from "@/lib/db/queries";
import { getRazorpayProducts } from "@/lib/payments/razorpay";
import { PricingClient } from "./_components/pricing-client";

export default async function PricingPage() {
  const user = await getUser();
  const currentTeam = user ? await getTeamForUser(user.id) : null;
  const plans = await getRazorpayProducts();

  return <PricingClient plans={plans} currentTeam={currentTeam} />;
}
