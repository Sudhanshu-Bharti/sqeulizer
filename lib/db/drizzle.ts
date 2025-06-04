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
  caCertContent = envCaCert.replace(/\\n/g, "\n");
} else {
  console.log(
    "[DB_SETUP] POSTGRES_CA_CERT is not set. If SSL is enabled (e.g. sslmode=require), system CAs will be used. For 'verify-ca' or 'verify-full' without POSTGRES_CA_CERT, connection might fail if the server CA is not in the system trust store."
  );
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

  let tempSslConfig: { rejectUnauthorized?: boolean; ca?: string } = {};

  // Default for SSL connections in 'postgres' library is rejectUnauthorized: true
  tempSslConfig.rejectUnauthorized = true;
  console.log(
    "[DB_SETUP] SSL is enabled, rejectUnauthorized defaults to true."
  );

  if (caCertContent) {
    tempSslConfig.ca = caCertContent;
    console.log(
      "[DB_SETUP] Custom CA certificate from POSTGRES_CA_CERT will be used."
    );
  }

  const isConnectingToLocalhost =
    postgresUrl.includes("localhost") || postgresUrl.includes("127.0.0.1");
  const isVerifyCaMode = postgresUrl.includes("sslmode=verify-ca");
  const isVerifyFullMode = postgresUrl.includes("sslmode=verify-full");

  if ((isVerifyCaMode || isVerifyFullMode) && !caCertContent) {
    console.warn(
      "[DB_SETUP] WARNING: sslmode is verify-ca or verify-full, but POSTGRES_CA_CERT is not set. Verification will rely on system CAs, which might not include the specific CA required by the server. Connection may fail."
    );
    // rejectUnauthorized remains true.
  }

  // Override for localhost tunnel in local development (non-production and not Vercel)
  // This allows hostname mismatch for the tunnel.
  if (!(isProduction || isVercel) && isConnectingToLocalhost) {
    console.log(
      "[DB_SETUP] Local development on localhost: Overriding rejectUnauthorized to false for potential tunnel hostname mismatch (if SSL is not disabled)."
    );
    tempSslConfig.rejectUnauthorized = false;
  }
  sslOptionForClient = tempSslConfig;
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
