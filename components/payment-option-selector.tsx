"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RazorpayCheckout } from "./razorpay-checkout";
import { CreditCard, Smartphone, Building } from "lucide-react";

interface PaymentOptionSelectorProps {
  orderId: string;
  amount: number;
  currency: string;
  razorpayKey: string;
  subscriptionId?: string;
  shortUrl?: string;
  onSuccess: () => void;
}

export function PaymentOptionSelector({
  orderId,
  amount,
  currency,
  razorpayKey,
  subscriptionId,
  shortUrl,
  onSuccess,
}: PaymentOptionSelectorProps) {
  const [selectedOption, setSelectedOption] = useState<
    "modal" | "hosted" | null
  >(null);

  if (selectedOption === "modal") {
    return (
      <RazorpayCheckout
        orderId={orderId}
        amount={amount}
        currency={currency}
        razorpayKey={razorpayKey}
        subscriptionId={subscriptionId}
        onSuccess={onSuccess}
      />
    );
  }

  if (selectedOption === "hosted" && shortUrl) {
    // Redirect to hosted page
    window.location.href = shortUrl;
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Choose Payment Method
          </h2>
          <div className="space-y-3">
            <Card
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setSelectedOption("modal")}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <CreditCard className="h-5 w-5" />
                  Quick Checkout
                </CardTitle>
                <CardDescription className="text-sm">
                  Pay with card or UPI in popup modal
                </CardDescription>
              </CardHeader>
            </Card>

            {shortUrl && (
              <Card
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setSelectedOption("hosted")}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Building className="h-5 w-5" />
                    Full Checkout
                  </CardTitle>
                  <CardDescription className="text-sm">
                    All payment options (UPI, Net Banking, Wallets, etc.)
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => setSelectedOption(null)}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
