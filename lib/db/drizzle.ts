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

const caCert = fs
  .readFileSync(path.join(process.cwd(), "isrgrootx1.pem"))
  .toString();

export const client = postgres(process.env.POSTGRES_URL, {
  ssl: {
    rejectUnauthorized: true,
    ca: caCert,
  },
});

export const db = drizzle(client, { schema });
