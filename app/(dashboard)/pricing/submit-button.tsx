"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { RazorpayCheckout } from "@/components/razorpay-checkout";
import { PaymentOptionSelector } from "@/components/payment-option-selector";
import { cn } from "@/lib/utils";

interface SubmitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  action?: (formData: FormData) => Promise<any>; // Add action prop
}

export function SubmitButton({
  children,
  className,
  variant = "default",
  action, // Accept the server action as a prop
  ...props
}: SubmitButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [checkoutData, setCheckoutData] = useState<any>(null);

  return (
    <>
      <Button
        type="submit"
        className={cn(className)}
        variant={variant}
        aria-disabled={isPending}
        onClick={(e) => {
          const form = (e.target as HTMLButtonElement).closest("form");
          if (form && action) {
            // Check if action is provided
            e.preventDefault();
            const formData = new FormData(form);
            startTransition(async () => {
              try {
                const data = await action(formData); // Call the action directly
                // If we get data back (non-subscription plans), show checkout
                if (data && data.orderId) {
                  setCheckoutData(data);
                }
                // If no data is returned, it means we were redirected to short_url
              } catch (error: any) {
                // Check if this is a redirect error (expected behavior)
                if (error?.digest?.includes("NEXT_REDIRECT")) {
                  // This is expected when redirect() is called, don't treat as error
                  return;
                }
                console.error("Error during checkout:", error);
              }
            });
          }
        }}
        {...props}
      >
        {isPending ? "Loading..." : children}
      </Button>

      {checkoutData && (
        <PaymentOptionSelector
          orderId={checkoutData.orderId}
          amount={checkoutData.amount}
          currency={checkoutData.currency}
          razorpayKey={checkoutData.key}
          subscriptionId={checkoutData.subscriptionId}
          shortUrl={checkoutData.short_url}
          onSuccess={() => {
            router.push("/live");
          }}
        />
      )}
    </>
  );
}
