import { NextResponse } from "next/server";
import { razorpay } from "@/lib/payments/razorpay";

export async function GET() {
  try {
    console.log("Testing Razorpay live mode capabilities...");

    // Test 1: Create a small test order to see if basic functionality works
    const testOrder = await razorpay.orders.create({
      amount: 100, // ₹1.00
      currency: "INR",
      receipt: "test_receipt_" + Date.now(),
      payment_capture: 1,
      notes: {
        test: "true",
      },
    });

    console.log("Test order created successfully:", testOrder);

    // Test 2: Check account status/methods (if available in Razorpay API)
    let accountInfo = null;
    try {
      // This might not be available in all Razorpay versions
      accountInfo = await razorpay.payments.all({ count: 1 });
    } catch (e) {
      console.log("Payment history check not available");
    }

    return NextResponse.json({
      success: true,
      mode: process.env.RAZORPAY_MODE,
      keyId: process.env.RAZORPAY_KEY_ID?.substring(0, 12) + "...",
      tests: {
        orderCreation: {
          success: true,
          orderId: testOrder.id,
          amount: testOrder.amount,
          currency: testOrder.currency,
          status: testOrder.status,
        },
        accountAccess: {
          success: accountInfo !== null,
          info: accountInfo ? "Available" : "Not available",
        },
      },
      message: "Live mode basic functionality working",
    });
  } catch (error) {
    console.error("Error testing Razorpay live mode:", error);

    let errorDetails = {
      message: error instanceof Error ? error.message : "Unknown error",
      name: error instanceof Error ? error.name : "Unknown",
    };

    // Check if it's a Razorpay API error with specific details
    if (error && typeof error === "object" && "error" in error) {
      const rzpError = error as any;
      errorDetails = {
        ...errorDetails,
        code: rzpError.error?.code,
        description: rzpError.error?.description,
        field: rzpError.error?.field,
        source: rzpError.error?.source,
        step: rzpError.error?.step,
        reason: rzpError.error?.reason,
      };
    }

    return NextResponse.json({
      success: false,
      mode: process.env.RAZORPAY_MODE,
      keyId: process.env.RAZORPAY_KEY_ID?.substring(0, 12) + "...",
      error: errorDetails,
      message:
        "Live mode test failed - this might indicate account verification issues",
    });
  }
}
