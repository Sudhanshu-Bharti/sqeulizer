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
  // const testPlan = products.find((plan) => plan.name === "Test");

  return (
    <div className="py-8 md:py-14 px-4 md:px-6">
      <div className="relative max-w-7xl mx-auto">
        {/* Gradient effects */}
        <div className="absolute top-1/4 right-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full bg-gradient-to-br from-orange-600/20 to-amber-500/20 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[200px] md:w-[400px] h-[200px] md:h-[400px] rounded-full bg-gradient-to-br from-orange-400/20 to-amber-300/20 blur-3xl" />

        {/* Header */}
        <div className="text-center relative mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that's right for you. All plans include a free
            trial.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto mt-8 relative z-10">
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
                "Core features",
                "24/7 customer service",
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
                "Advanced security",
                "Dedicated account manager",
                "Custom branding options",
              ]}
              planId={plusPlan.id}
              action={checkoutAction}
              className={cn(
                "border-primary/20 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]",
                currentTeam.planName === "Plus" && "border-primary"
              )}
              popular
              isCurrentPlan={currentTeam.planName === "Plus"}
            />
          )}
          {/* {testPlan && (
            <PricingCard
              name="Plus"
              price={testPlan.amount / 100}
              interval={testPlan.interval}
              trialDays={testPlan.trialPeriodDays || 0}
              features={[
                "Test ",
              ]}
              planId={testPlan.id}
              action={checkoutAction}
              className={cn(
                "border-primary/20 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]",
                currentTeam.planName === "Plus" && "border-primary"
              )}
            />
          )} */}
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
        "relative flex flex-col p-6 md:p-8 bg-background border rounded-lg shadow-sm",
        className,
        {
          "border-primary border-2": popular || isCurrentPlan,
          "hover:border-primary/50": !isCurrentPlan,
        }
      )}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-br from-orange-500 to-amber-500 text-white text-sm font-medium rounded-full shadow-sm">
          Popular
        </div>
      )}
      {isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-gray-700 text-sm font-medium rounded-full shadow-sm">
          Current Plan
        </div>
      )}

      <div className="space-y-6">
        {/* Plan name and price */}
        <div>
          <h3 className="text-2xl font-bold mb-2">{name}</h3>
          <div className="flex items-baseline">
            <span className="text-4xl font-bold tracking-tight">₹{price}</span>
            <span className="text-muted-foreground ml-2 text-sm">
              /user/{interval}
            </span>
          </div>
          {trialDays > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              {trialDays} days free trial
            </p>
          )}
        </div>

        {/* Features list */}
        <ul className="space-y-3 flex-1">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-primary shrink-0 mr-3" />
              <span className="text-sm text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Action button */}
        <form action={action} className="mt-auto">
          <input type="hidden" name="planId" value={planId} />
          <SubmitButton
            action={action}
            className={cn(
              "w-full shadow-sm text-sm font-medium",
              popular && !isCurrentPlan
                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600"
                : ""
            )}
          >
            {isCurrentPlan ? (
              "Current Plan"
            ) : price === 0 ? (
              "Start Free Trial"
            ) : (
              <>Get Started{trialDays > 0 && " - Free Trial"}</>
            )}
          </SubmitButton>
        </form>
      </div>
    </Card>
  );
}
