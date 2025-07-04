"use client";

import * as React from "react";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { checkoutAction } from "@/lib/payments/actions";
import { Check } from "lucide-react";
import { SubmitButton } from "../submit-button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function CurrencySwitcher({
  currency,
  onCurrencyChange,
}: {
  currency: "INR" | "USD";
  onCurrencyChange: (currency: "INR" | "USD") => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      <Label htmlFor="currency-switch" className="text-slate-300">
        INR
      </Label>
      <Switch
        id="currency-switch"
        checked={currency === "USD"}
        onCheckedChange={(checked: boolean) =>
          onCurrencyChange(checked ? "USD" : "INR")
        }
      />
      <Label htmlFor="currency-switch" className="text-slate-300">
        USD
      </Label>
    </div>
  );
}

function PricingDisplay({
  plans,
  currentTeam,
  currency,
}: {
  plans: any[];
  currentTeam: any | null;
  currency: "INR" | "USD";
}) {
  const exchangeRate = 85.64;

  const convertPrice = (price: number) => {
    if (currency === "USD") {
      return Math.round(price / exchangeRate);
    }
    return price;
  };

  const basePlan = plans.find((plan) => plan.name === "Base");
  const plusPlan = plans.find((plan) => plan.name === "Plus");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      {basePlan && (
        <PricingCard
          name="Base"
          price={convertPrice(basePlan.amount / 100)}
          interval={basePlan.interval}
          trialDays={basePlan.trialPeriodDays || 0}
          features={[
            "Up to 5 team members",
            "Basic schema analysis",
            "Email support",
            "Core visualization features",
            "Basic security checks",
          ]}
          planId={basePlan.id}
          action={checkoutAction}
          className={cn(
            "hover:shadow-lg transition-all duration-300 hover:scale-[1.02]",
            currentTeam?.planName === "Base" && "border-primary"
          )}
          isCurrentPlan={currentTeam?.planName === "Base"}
          currency={currency}
        />
      )}

      {plusPlan && (
        <PricingCard
          name="Plus"
          price={convertPrice(plusPlan.amount / 100)}
          interval={plusPlan.interval}
          trialDays={plusPlan.trialPeriodDays || 0}
          features={[
            "Unlimited team members",
            "Advanced schema analysis",
            "Priority support",
            "Advanced visualization features",
            "Comprehensive security checks",
            "Performance optimization",
          ]}
          planId={plusPlan.id}
          action={checkoutAction}
          className={cn(
            "border-emerald-600 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]",
            currentTeam?.planName === "Plus" && "border-sky-400"
          )}
          popular
          isCurrentPlan={currentTeam?.planName === "Plus"}
          currency={currency}
        />
      )}
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
  currency,
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
  currency: "INR" | "USD";
}) {
  const getCurrencySymbol = () => {
    return currency === "USD" ? "$" : "₹";
  };

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

      <div className="flex flex-col h-full">
        {/* Plan name and price */}
        <div>
          <h3 className="text-2xl font-bold mb-2">{name}</h3>
          <div className="flex items-baseline">
            <span className="text-4xl font-bold tracking-tight">
              {getCurrencySymbol()}
              {price}
            </span>
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

export function PricingClient({
  plans,
  currentTeam,
}: {
  plans: any[];
  currentTeam: any | null;
}) {
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");

  return (
    <div className="py-8 md:py-14 px-4 md:px-6">
      <div className="relative max-w-7xl mx-auto">
        <div className="absolute top-1/4 right-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full bg-gradient-to-br opacity-60 from-emerald-600/20 to-sky-500/20 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[200px] md:w-[400px] h-[200px] md:h-[400px] rounded-full bg-gradient-to-br opacity-60 from-emerald-400/20 to-sky-300/20 blur-3xl" />

        <div className="text-center relative mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Choose the plan that's right for you. All plans include a free
            trial.
          </p>

          <CurrencySwitcher
            currency={currency}
            onCurrencyChange={setCurrency}
          />
        </div>

        <PricingDisplay
          plans={plans}
          currentTeam={currentTeam}
          currency={currency}
        />
      </div>
    </div>
  );
}
