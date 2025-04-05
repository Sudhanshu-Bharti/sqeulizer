"use server";
import { checkoutAction } from "@/lib/payments/actions";
import { Check } from "lucide-react";
import { getRazorpayPlans, getRazorpayProducts } from "@/lib/payments/razorpay";
import { SubmitButton } from "./submit-button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default async function PricingPage() {
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

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-8">
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
              action={checkoutAction} // Pass the server action
              className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
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
              action={checkoutAction} // Pass the server action
              className="border-primary/20 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] relative"
              popular
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
  action, // Add action prop
  className,
  popular,
}: {
  name: string;
  price: number;
  interval: string;
  trialDays: number;
  features: string[];
  planId?: string;
  action?: (formData: FormData) => Promise<any>; // Define action prop type
  className?: string;
  popular?: boolean;
}) {
  return (
    <Card
      className={cn(
        "relative flex flex-col p-6 bg-background border rounded-lg",
        className,
        {
          "border-primary": popular,
        }
      )}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-br from-orange-500 to-amber-500 text-white text-sm rounded-full">
          Popular
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
          {price === 0 ? "Start Free Trial" : "Get Started"}
        </SubmitButton>
      </form>
    </Card>
  );
}
