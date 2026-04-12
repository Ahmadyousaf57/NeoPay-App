import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { logger } from "../lib/logger";

const authRouter = Router();

const JWT_SECRET = process.env["SESSION_SECRET"] ?? "fallback-dev-secret";

function signToken(userId: number) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "30d" });
}

function verifyToken(token: string): { userId: number } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number };
  } catch {
    return null;
  }
}

function getBearerToken(req: { headers: { authorization?: string } }): string | null {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return null;
  return auth.slice(7);
}

function formatUser(user: typeof usersTable.$inferSelect) {
  return {
    id:                user.id,
    name:              user.name,
    email:             user.email,
    biometricEnrolled: user.biometricEnrolled,
    createdAt:         user.createdAt.toISOString(),
  };
}

// ──────────────────────────────────────────────
// POST /api/auth/signup
// ──────────────────────────────────────────────
authRouter.post("/auth/signup", async (req, res) => {
  const { name, email, password } = req.body as {
    name?: string;
    email?: string;
    password?: string;
  };

  if (!name || !email || !password) {
    res.status(400).json({ error: "name, email, and password are required" });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ error: "Password must be at least 6 characters" });
    return;
  }

  try {
    const existing = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, email.toLowerCase().trim()))
      .limit(1);

    if (existing.length > 0) {
      res.status(409).json({ error: "An account with this email already exists" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const [user] = await db
      .insert(usersTable)
      .values({
        name:              name.trim(),
        email:             email.toLowerCase().trim(),
        passwordHash,
        biometricEnrolled: false,
      })
      .returning();

    const token = signToken(user.id);
    res.status(201).json({ token, user: formatUser(user) });
  } catch (err) {
    logger.error({ err }, "Signup error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// ──────────────────────────────────────────────
// POST /api/auth/login
// ──────────────────────────────────────────────
authRouter.post("/auth/login", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ error: "email and password are required" });
    return;
  }

  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email.toLowerCase().trim()))
      .limit(1);

    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const token = signToken(user.id);
    res.json({ token, user: formatUser(user) });
  } catch (err) {
    logger.error({ err }, "Login error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// ──────────────────────────────────────────────
// GET /api/auth/me
// ──────────────────────────────────────────────
authRouter.get("/auth/me", async (req, res) => {
  const token = getBearerToken(req);
  if (!token) { res.status(401).json({ error: "Unauthorized" }); return; }

  const payload = verifyToken(token);
  if (!payload) { res.status(401).json({ error: "Invalid or expired token" }); return; }

  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, payload.userId))
      .limit(1);

    if (!user) { res.status(401).json({ error: "User not found" }); return; }
    res.json(formatUser(user));
  } catch (err) {
    logger.error({ err }, "Get me error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// ──────────────────────────────────────────────
// PATCH /api/auth/biometric  (legacy flag update)
// ──────────────────────────────────────────────
authRouter.patch("/auth/biometric", async (req, res) => {
  const token = getBearerToken(req);
  if (!token) { res.status(401).json({ error: "Unauthorized" }); return; }

  const payload = verifyToken(token);
  if (!payload) { res.status(401).json({ error: "Invalid or expired token" }); return; }

  const { enrolled } = req.body as { enrolled?: boolean };
  if (typeof enrolled !== "boolean") {
    res.status(400).json({ error: "enrolled must be a boolean" });
    return;
  }

  try {
    const [user] = await db
      .update(usersTable)
      .set({ biometricEnrolled: enrolled })
      .where(eq(usersTable.id, payload.userId))
      .returning();

    res.json(formatUser(user));
  } catch (err) {
    logger.error({ err }, "Update biometric error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// ──────────────────────────────────────────────
// POST /api/auth/biometric-enroll
// Called after user's biometric scan succeeds on device.
// Generates a secure random token, saves it in DB, returns it to store on device.
// ──────────────────────────────────────────────
authRouter.post("/auth/biometric-enroll", async (req, res) => {
  const token = getBearerToken(req);
  if (!token) { res.status(401).json({ error: "Unauthorized" }); return; }

  const payload = verifyToken(token);
  if (!payload) { res.status(401).json({ error: "Invalid or expired token" }); return; }

  try {
    const biometricToken = crypto.randomBytes(40).toString("hex");

    const [user] = await db
      .update(usersTable)
      .set({ biometricEnrolled: true, biometricToken })
      .where(eq(usersTable.id, payload.userId))
      .returning();

    logger.info({ userId: user.id }, "Biometric enrolled");
    res.json({ biometricToken, user: formatUser(user) });
  } catch (err) {
    logger.error({ err }, "Biometric enroll error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// ──────────────────────────────────────────────
// POST /api/auth/biometric-login
// Client sends the stored biometric token; server looks it up in DB.
// If found → returns a fresh JWT. Biometric scan was already verified on device.
// ──────────────────────────────────────────────
authRouter.post("/auth/biometric-login", async (req, res) => {
  const { biometricToken } = req.body as { biometricToken?: string };

  if (!biometricToken || biometricToken.length < 10) {
    res.status(400).json({ error: "biometricToken is required" });
    return;
  }

  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.biometricToken, biometricToken))
      .limit(1);

    if (!user || !user.biometricEnrolled) {
      res.status(401).json({ error: "Biometric login not set up or token invalid" });
      return;
    }

    const jwtToken = signToken(user.id);
    logger.info({ userId: user.id }, "Biometric login success");
    res.json({ token: jwtToken, user: formatUser(user) });
  } catch (err) {
    logger.error({ err }, "Biometric login error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default authRouter;
