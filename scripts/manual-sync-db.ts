import { pool, db } from "../lib/db/src/index.ts";
import { usersTable } from "../lib/db/src/schema/users.ts";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Creating tables...");
  try {
    // Manually create the users table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" serial PRIMARY KEY NOT NULL,
        "name" text NOT NULL,
        "email" text NOT NULL,
        "password_hash" text NOT NULL,
        "biometric_enrolled" boolean DEFAULT false NOT NULL,
        "biometric_token" text,
        "created_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "users_email_unique" UNIQUE("email")
      );
    `);
    console.log("Users table verified/created.");
  } catch (err) {
    console.error("Error creating tables:", err);
  } finally {
    await pool.end();
  }
}

main();
