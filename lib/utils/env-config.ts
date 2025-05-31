/**
 * Environment configuration utility
 * Provides easy access to environment-specific settings
 */

export const ENV_CONFIG = {
  // Environment detection
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",

  // Razorpay mode detection
  isRazorpayTestMode:
    process.env.RAZORPAY_MODE === "test" ||
    process.env.RAZORPAY_KEY_ID?.includes("test") ||
    false,
  isRazorpayLiveMode:
    process.env.RAZORPAY_MODE === "live" ||
    process.env.RAZORPAY_KEY_ID?.includes("live") ||
    false,

  // Razorpay configuration
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID!,
    keySecret: process.env.RAZORPAY_KEY_SECRET!,
    publicKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
    mode: process.env.RAZORPAY_MODE || "test",
  },

  // App configuration
  app: {
    baseUrl: process.env.BASE_URL || "http://localhost:3000",
    authSecret: process.env.AUTH_SECRET!,
  },

  // Database
  database: {
    url: process.env.POSTGRES_URL!,
  },
} as const;

/**
 * Get environment-specific display information
 */
export function getEnvironmentInfo() {
  return {
    environment: ENV_CONFIG.isDevelopment
      ? "Development"
      : ENV_CONFIG.isProduction
      ? "Production"
      : "Test",
    razorpayMode: ENV_CONFIG.isRazorpayTestMode ? "Test Mode" : "Live Mode",
    razorpayKeyType: ENV_CONFIG.razorpay.keyId?.includes("test")
      ? "Test Key"
      : "Live Key",
    safeToTest: ENV_CONFIG.isRazorpayTestMode,
  };
}

/**
 * Validate environment configuration
 */
export function validateEnvironment() {
  const errors: string[] = [];

  // Check required environment variables
  if (!ENV_CONFIG.razorpay.keyId) {
    errors.push("RAZORPAY_KEY_ID is required");
  }

  if (!ENV_CONFIG.razorpay.keySecret) {
    errors.push("RAZORPAY_KEY_SECRET is required");
  }

  if (!ENV_CONFIG.razorpay.publicKeyId) {
    errors.push("NEXT_PUBLIC_RAZORPAY_KEY_ID is required");
  }

  if (!ENV_CONFIG.app.authSecret) {
    errors.push("AUTH_SECRET is required");
  }

  // Check for mismatched keys
  const isPrivateKeyTest = ENV_CONFIG.razorpay.keyId?.includes("test");
  const isPublicKeyTest = ENV_CONFIG.razorpay.publicKeyId?.includes("test");

  if (isPrivateKeyTest !== isPublicKeyTest) {
    errors.push(
      "Razorpay key mismatch: private and public keys must both be test or live"
    );
  }

  // Production warnings
  if (ENV_CONFIG.isProduction && ENV_CONFIG.isRazorpayTestMode) {
    errors.push("WARNING: Using test Razorpay keys in production");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: errors.filter((e) => e.startsWith("WARNING:")),
  };
}

/**
 * Log current environment configuration (safe for production)
 */
export function logEnvironmentInfo() {
  const info = getEnvironmentInfo();
  const validation = validateEnvironment();

  console.log("🌍 Environment Configuration:");
  console.log(`   Environment: ${info.environment}`);
  console.log(`   Razorpay: ${info.razorpayMode} (${info.razorpayKeyType})`);
  console.log(`   Base URL: ${ENV_CONFIG.app.baseUrl}`);
  console.log(`   Safe to test: ${info.safeToTest ? "✅" : "⚠️"}`);

  if (!validation.isValid) {
    console.error("❌ Environment validation errors:");
    validation.errors.forEach((error) => {
      if (error.startsWith("WARNING:")) {
        console.warn(`   ⚠️  ${error}`);
      } else {
        console.error(`   ❌ ${error}`);
      }
    });
  } else {
    console.log("✅ Environment validation passed");
  }
}

/**
 * Initialize environment logging on app startup
 * Call this in your main app file to show environment status
 */
export function initializeEnvironmentLogging() {
  // Only log in development or when explicitly enabled
  if (ENV_CONFIG.isDevelopment || process.env.LOG_ENV_INFO === "true") {
    console.log("\n" + "=".repeat(50));
    logEnvironmentInfo();
    console.log("=".repeat(50) + "\n");
  }
}

// Auto-initialize when this module is imported (only in development)
if (ENV_CONFIG.isDevelopment) {
  initializeEnvironmentLogging();
}
