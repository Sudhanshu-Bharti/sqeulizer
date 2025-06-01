import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config(); // Ensures .env is loaded

console.log("[DB_SETUP] Initializing database connection setup...");

const postgresUrl = process.env.POSTGRES_URL;
console.log(`[DB_SETUP] POSTGRES_URL: ${postgresUrl}`);
console.log(`[DB_SETUP] NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`[DB_SETUP] VERCEL: ${process.env.VERCEL}`);

if (!postgresUrl) {
  console.error(
    "[DB_SETUP] ERROR: POSTGRES_URL environment variable is not set"
  );
  throw new Error("POSTGRES_URL environment variable is not set");
}

let caCertContent: string | undefined;
const envCaCert = process.env.POSTGRES_CA_CERT;

if (envCaCert) {
  console.log(
    "[DB_SETUP] Using CA certificate from POSTGRES_CA_CERT environment variable."
  );
  // Replace escaped newlines if present, Vercel might store it this way
  caCertContent = envCaCert.replace(/\n/g, "\n");
} else {
  const certPath = path.join(process.cwd(), "aws-certificate-rds.pem");
  if (fs.existsSync(certPath)) {
    caCertContent = fs.readFileSync(certPath).toString();
    console.log(
      "[DB_SETUP] CA certificate aws-certificate-rds.pem loaded from file system."
    );
  } else {
    console.warn(
      `[DB_SETUP] WARNING: CA certificate not found in POSTGRES_CA_CERT env var or at ${certPath}. This may be an issue for sslmode=verify-ca or verify-full if the CA is not in the system trust store.`
    );
  }
}

let sslOptionForClient: postgres.Options<any>["ssl"];

const isSslDisabledInUrl = postgresUrl.includes("sslmode=disable");
console.log(`[DB_SETUP] isSslDisabledInUrl: ${isSslDisabledInUrl}`);

if (isSslDisabledInUrl) {
  sslOptionForClient = false; // Explicitly false for 'disable'
} else {
  // SSL is not 'disable', so it's some form of enabled (require, prefer, verify-ca, verify-full)
  const isProduction = process.env.NODE_ENV === "production";
  const isVercel = process.env.VERCEL === "1";
  console.log(
    `[DB_SETUP] isProduction: ${isProduction}, isVercel: ${isVercel}`
  );

  let tempConfig: { rejectUnauthorized?: boolean; ca?: string } = {};

  const isConnectingToLocalhost =
    postgresUrl.includes("localhost") || postgresUrl.includes("127.0.0.1");
  const isVerifyCaMode = postgresUrl.includes("sslmode=verify-ca");
  const isVerifyFullMode = postgresUrl.includes("sslmode=verify-full");

  if (isVerifyCaMode || isVerifyFullMode) {
    console.log(`[DB_SETUP] SSL mode: verify-ca or verify-full detected.`);
    if (caCertContent) {
      tempConfig.ca = caCertContent;
      tempConfig.rejectUnauthorized = true;
    } else {
      console.error(
        "[DB_SETUP] ERROR: sslmode is verify-ca/verify-full but CA certificate (from POSTGRES_CA_CERT or aws-certificate-rds.pem) is not available. Connection will likely fail if server CA is not in system trust store."
      );
      // For verify-ca/full, if no CA is provided, it cannot truly verify against a specific CA.
      // Setting rejectUnauthorized to true is safer but might fail if system CAs don't cover the server's CA.
      tempConfig.rejectUnauthorized = true;
    }
  } else {
    // For sslmode=require or sslmode=prefer (or if sslmode is not specified, which defaults to prefer)
    console.log("[DB_SETUP] SSL mode: require, prefer, or default detected.");
    // For 'require', the server certificate must be valid (e.g., not expired, trusted by system CAs),
    // but we don't verify it against a *specific* CA unless provided.
    // rejectUnauthorized: true is the default for postgresjs when SSL is on.
    tempConfig.rejectUnauthorized = true;
    if (caCertContent) {
      // If CA is available, might as well use it for stricter check even in 'require'
      tempConfig.ca = caCertContent;
    }
  }

  // Override for localhost tunnel in local development (non-production and not Vercel)
  // This allows hostname mismatch for the tunnel.
  if (!(isProduction || isVercel) && isConnectingToLocalhost) {
    console.log(
      "[DB_SETUP] Local development on localhost: Overriding rejectUnauthorized to false for tunnel hostname mismatch (if SSL is not disabled)."
    );
    tempConfig.rejectUnauthorized = false;
    // tempConfig.ca will still be used if set (e.g. for local testing of verify-ca via tunnel)
  }
  sslOptionForClient = tempConfig;
}

console.log(
  "[DB_SETUP] Final SSL options for postgres client:",
  sslOptionForClient
);

export const client = postgres(postgresUrl, {
  ssl: sslOptionForClient,
  connect_timeout: 10, // Optional: connection timeout in seconds
});

try {
  console.log("[DB_SETUP] Postgres client instance configured.");
} catch (error) {
  console.error(
    "[DB_SETUP] Error during postgres client object configuration (not connection attempt):",
    error
  );
}

const isActualProduction = process.env.NODE_ENV === "production";
export const db = drizzle(client, { schema, logger: !isActualProduction }); // Enable logger in dev
console.log("[DB_SETUP] Drizzle ORM initialized.");
