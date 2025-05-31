import { NextResponse } from "next/server";
import { razorpay } from "@/lib/payments/razorpay";

export async function GET() {
  try {
    console.log("Fetching Razorpay plans for debugging...");

    // Fetch all plans
    const plansResponse = await razorpay.plans.all();
    console.log("Raw plans response:", plansResponse);

    return NextResponse.json({
      success: true,
      mode: process.env.RAZORPAY_MODE,
      keyId: process.env.RAZORPAY_KEY_ID?.substring(0, 12) + "...",
      plansCount: plansResponse.items?.length || 0,
      plans:
        plansResponse.items?.map((plan: any) => ({
          id: plan.id,
          name: plan.item?.name,
          amount: plan.item?.amount,
          currency: plan.item?.currency,
          period: plan.period,
          interval: plan.interval,
        })) || [],
    });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json({
      success: false,
      mode: process.env.RAZORPAY_MODE,
      keyId: process.env.RAZORPAY_KEY_ID?.substring(0, 12) + "...",
      error: error instanceof Error ? error.message : "Unknown error",
      errorDetails: error,
    });
  }
}
