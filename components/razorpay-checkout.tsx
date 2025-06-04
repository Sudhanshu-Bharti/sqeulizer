"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  useEffect(() => {
    // Only initialize Razorpay when the script is loaded and we have all required props
    if (!isScriptLoaded || !orderId || !amount || !currency || !razorpayKey)
      return;

    console.log("=== RAZORPAY FRONTEND DEBUG ===");
    console.log("Initializing Razorpay with:", {
      key: razorpayKey,
      keyType: razorpayKey.startsWith("rzp_live") ? "LIVE" : "TEST",
      orderId,
      amount,
      currency,
      subscriptionId,
    });

    const options = {
      key: razorpayKey,
      amount: amount,
      currency: currency,
      order_id: orderId,
      subscription_id: subscriptionId,
      name: "PandaView",
      description: "Payment for subscription",
      image: "/favicon.ico", // Add your logo
      method: {
        netbanking: true,
        card: true,
        upi: true,
        wallet: true,
        emi: true,
        paylater: true,
      },
      config: {
        display: {
          preferences: {
            show_default_blocks: true, // This shows all available payment methods
          },
        },
      },
      modal: {
        ondismiss: function () {
          console.log("Checkout modal was closed");
        },
        escape: false,
        animation: true,
      },
      // Add error handler to catch payment failures
      error: function (error: any) {
        console.error("Razorpay payment error:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));
        alert(
          "Payment failed: " +
            (error.description || error.message || "Unknown error")
        );
      },
      handler: function (response: any) {
        console.log("Payment success response:", response);
        // Handle successful payment
        if (response.razorpay_payment_id) {
          // Construct the checkout URL with payment details
          const checkoutUrl = new URL(
            "/api/razorpay/checkout",
            window.location.origin
          );
          checkoutUrl.searchParams.append("order_id", orderId);
          checkoutUrl.searchParams.append(
            "razorpay_payment_id",
            response.razorpay_payment_id
          );
          if (subscriptionId) {
            checkoutUrl.searchParams.append("subscription_id", subscriptionId);
          }

          console.log("Redirecting to checkout URL:", checkoutUrl.toString());
          // Redirect to checkout route
          window.location.href = checkoutUrl.toString();
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
      console.log("Creating Razorpay instance...");
      console.log("Final Razorpay options:", JSON.stringify(options, null, 2));
      const razorpay = new window.Razorpay(options);
      console.log("Opening Razorpay modal...");
      razorpay.open();
      console.log("Razorpay modal opened successfully");
    } catch (error) {
      console.error("Error initializing Razorpay:", error);
      alert(
        "Failed to initialize payment: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
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
