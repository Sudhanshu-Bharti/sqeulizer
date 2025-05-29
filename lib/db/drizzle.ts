import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL environment variable is not set");
}

// Check if we're in production/Vercel environment
const isProduction = process.env.NODE_ENV === "production";
const isVercel = process.env.VERCEL === "1";

let sslConfig;

if (isProduction || isVercel) {
  sslConfig = {
    rejectUnauthorized: true,
  };
} else {
  // In development, try to use the certificate file if it exists
  const certPath = path.join(process.cwd(), "isrgrootx1.pem");

  if (fs.existsSync(certPath)) {
    const caCert = fs.readFileSync(certPath).toString();
    sslConfig = {
      rejectUnauthorized: true,
      ca: caCert,
    };
  } else {
    // Fallback for development without certificate
    sslConfig = {
      rejectUnauthorized: false,
    };
  }
}

export const client = postgres(process.env.POSTGRES_URL, {
  ssl: sslConfig,
});

export const db = drizzle(client, { schema });
