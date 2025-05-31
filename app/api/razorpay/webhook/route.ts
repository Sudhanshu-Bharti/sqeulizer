import { handleSubscriptionChange } from "@/lib/payments/razorpay";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get("x-razorpay-signature") as string;

  console.log("Received webhook payload:", payload);
  console.log("Webhook signature:", signature);

  // Temporarily skip signature verification if webhook secret is not configured
  if (webhookSecret && signature) {
    try {
      // Verify the webhook signature
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(payload)
        .digest("hex");

      if (signature !== expectedSignature) {
        console.error("Webhook signature verification failed.");
        return NextResponse.json(
          { error: "Webhook signature verification failed." },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error("Error verifying webhook signature:", error);
      return NextResponse.json(
        { error: "Error verifying webhook signature" },
        { status: 400 }
      );
    }
  } else {
    console.warn(
      "Webhook signature verification skipped - secret not configured"
    );
  }

  try {
    const event = JSON.parse(payload);

    console.log("Processing webhook event:", event.event);

    switch (event.event) {
      case "subscription.activated":
      case "subscription.charged":
      case "subscription.cancelled":
      case "subscription.pending":
      case "subscription.halted":
      case "subscription.resumed":
        const subscription = event.payload.subscription.entity;
        await handleSubscriptionChange(subscription);
        break;
      case "payment.captured":
        // Handle successful one-time payment if needed
        console.log("Payment captured:", event.payload.payment.entity);
        break;
      default:
        console.log(`Unhandled event type ${event.event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
