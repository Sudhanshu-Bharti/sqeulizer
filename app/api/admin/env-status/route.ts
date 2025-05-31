/**
 * Environment Status API Route
 * Returns current environment configuration and validation status
 */

import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/admin";
import {
  ENV_CONFIG,
  getEnvironmentInfo,
  validateEnvironment,
} from "@/lib/utils/env-config";

export async function GET(request: NextRequest) {
  try {
    // Block access in production
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Admin API is disabled in production" },
        { status: 403 }
      );
    }

    // Check admin authentication
    const isAuthenticated = await isAdminAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Admin authentication required" },
        { status: 401 }
      );
    }
    const info = getEnvironmentInfo();
    const validation = validateEnvironment();

    // Create response with safe configuration details
    const status = {
      environment: info.environment,
      razorpayMode: info.razorpayMode,
      razorpayKeyType: info.razorpayKeyType,
      safeToTest: info.safeToTest,
      validation: {
        isValid: validation.isValid,
        errors: validation.errors,
        warnings: validation.warnings,
      },
      config: {
        baseUrl: ENV_CONFIG.app.baseUrl,
        hasWebhookSecret: !!ENV_CONFIG.razorpay.webhookSecret,
        razorpayKeyId: ENV_CONFIG.razorpay.keyId,
      },
    };

    return NextResponse.json(status);
  } catch (error) {
    console.error("Failed to get environment status:", error);
    return NextResponse.json(
      { error: "Failed to get environment status" },
      { status: 500 }
    );
  }
}
