"use server";
import { checkoutAction } from "@/lib/payments/actions";
import { Check } from "lucide-react";
import { getRazorpayPlans, getRazorpayProducts } from "@/lib/payments/razorpay";
import { SubmitButton } from "./submit-button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getUser } from "@/lib/db/queries";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";
import { teamMembers, teams } from "@/lib/db/schema";

export default async function PricingPage() {
  const user = await getUser();
  if (!user) {
    redirect("/sign-in");
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
    redirect("/sign-up");
  }

  const currentTeam = userTeam[0].team;
  const [plans, products] = await Promise.all([
    getRazorpayPlans(),
    getRazorpayProducts(),
  ]);

  const basePlan = products.find((plan) => plan.name === "Base");
  const plusPlan = products.find((plan) => plan.name === "Plus");

  return (
    <div className="py-14 px-6">
      <div className="relative">
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-orange-600/20 to-amber-500/20 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-orange-400/20 to-amber-300/20 blur-3xl" />

        <div className="text-center relative">
          <h2 className="text-4xl font-bold mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-muted-foreground">
            Choose the plan that's right for you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-12">
          {basePlan && (
            <PricingCard
              name="Base"
              price={basePlan.amount / 100}
              interval={basePlan.interval}
              trialDays={basePlan.trialPeriodDays || 0}
              features={[
                "Up to 5 team members",
                "Basic analytics",
                "Email support",
              ]}
              planId={basePlan.id}
              action={checkoutAction}
              className={cn(
                "hover:shadow-lg transition-all duration-300 hover:scale-[1.02]",
                currentTeam.planName === "Base" && "border-primary"
              )}
              isCurrentPlan={currentTeam.planName === "Base"}
            />
          )}

          {plusPlan && (
            <PricingCard
              name="Plus"
              price={plusPlan.amount / 100}
              interval={plusPlan.interval}
              trialDays={plusPlan.trialPeriodDays || 0}
              features={[
                "Unlimited team members",
                "Advanced analytics",
                "Priority support",
                "Custom integrations",
              ]}
              planId={plusPlan.id}
              action={checkoutAction}
              className={cn(
                "border-primary/20 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] relative",
                currentTeam.planName === "Plus" && "border-primary"
              )}
              popular
              isCurrentPlan={currentTeam.planName === "Plus"}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function PricingCard({
  name,
  price,
  interval,
  trialDays,
  features,
  planId,
  action,
  className,
  popular,
  isCurrentPlan,
}: {
  name: string;
  price: number;
  interval: string;
  trialDays: number;
  features: string[];
  planId?: string;
  action?: (formData: FormData) => Promise<any>;
  className?: string;
  popular?: boolean;
  isCurrentPlan?: boolean;
}) {
  return (
    <Card
      className={cn(
        "relative flex flex-col p-6 bg-background border rounded-lg",
        className,
        {
          "border-primary": popular || isCurrentPlan,
        }
      )}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-br from-orange-500 to-amber-500 text-white text-sm rounded-full">
          Popular
        </div>
      )}
      {isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary text-white text-sm rounded-full">
          Current Plan
        </div>
      )}
      <div className="text-xl font-semibold mb-2">{name}</div>
      <div className="flex items-baseline mb-8">
        <span className="text-4xl font-bold text-foreground">₹{price}</span>
        <span className="text-muted-foreground ml-2">/user/{interval}</span>
      </div>

      <ul className="mt-8 space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      <form action={action} className="pt-4">
        <input type="hidden" name="planId" value={planId} />
        <SubmitButton action={action} className="w-full">
          {isCurrentPlan ? "Current Plan" : price === 0 ? "Start Free Trial" : "Get Started"}
        </SubmitButton>
      </form>
    </Card>
  );
}
