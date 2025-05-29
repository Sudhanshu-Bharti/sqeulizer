import type { Config } from "drizzle-kit";
import * as fs from "fs";

const filePath = "./aws-certificate-rds.pem";
console.log("File path:", filePath);

export default {
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    // url: `${process.env.POSTGRES_URL!}?sslmode=no-verify`,
    url: process.env.POSTGRES_URL!,
    // ssl: {
    //   checkServerIdentity: () => undefined,
    //   ca: fs.readFileSync("./aws-certificate-rds.pem").toString(),
    // },
    // host: process.env.DATABASE_HOST!,
    // port: parseInt(process.env.DATABASE_PORT!),
    // user: process.env.DATABASE_USER!,
    // password: process.env.DATABASE_PASSWORD!,
    // database: process.env.DATABASE_NAME!,
    ssl: true,
    // ssl: true,
  },
} satisfies Config;
