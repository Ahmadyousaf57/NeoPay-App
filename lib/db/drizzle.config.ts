import { defineConfig } from "drizzle-kit";
import path from "node:path";
import fs from "node:fs";

// Manually load .env from root if DATABASE_URL is missing
if (!process.env.DATABASE_URL) {
  const envPath = "../../.env";
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, "utf-8");
    envFile.split("\n").forEach((line: string) => {
      const match = line.match(/^\s*DATABASE_URL\s*=\s*['"]?(.*?)['"]?\s*$/);
      if (match) {
        process.env.DATABASE_URL = match[1].trim();
      }
    });
  }
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  schema: "./src/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
