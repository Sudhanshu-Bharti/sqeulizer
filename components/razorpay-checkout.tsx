"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayCheckoutProps {
  orderId: string;
  amount: number;
  currency: string;
  razorpayKey: string;
  subscriptionId?: string;
  onSuccess: () => void;
}

export function RazorpayCheckout({
  orderId,
  amount,
  currency,
  razorpayKey,
  subscriptionId,
  onSuccess,
}: RazorpayCheckoutProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // Only initialize Razorpay when the script is loaded and we have all required props
    if (!isScriptLoaded || !orderId || !amount || !currency || !razorpayKey)
      return;

    const options = {
      key: razorpayKey,
      amount: amount,
      currency: currency,
      order_id: orderId,
      subscription_id: subscriptionId,
      name: "Your Company Name",
      description: "Payment for subscription",
      handler: function (response: any) {
        // Handle successful payment
        if (response.razorpay_payment_id) {
          onSuccess();
        }
      },
      prefill: {
        name: "",
        email: "",
      },
      theme: {
        color: "#F59E0B",
      },
    };

    try {
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error initializing Razorpay:", error);
    }
  }, [
    isScriptLoaded,
    orderId,
    amount,
    currency,
    razorpayKey,
    subscriptionId,
    onSuccess,
  ]);

  return (
    <Script
      src="https://checkout.razorpay.com/v1/checkout.js"
      strategy="afterInteractive"
      onLoad={() => setIsScriptLoaded(true)}
    />
  );
}
