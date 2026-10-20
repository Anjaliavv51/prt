import crypto from "crypto";
import fs from "fs";
import path from "path";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "portfolio_admin_session";
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS = 10;

// In-memory rate limiter
interface RateLimitEntry {
  attempts: number;
  blockedUntil: number;
}
const rateLimitMap = new Map<string, RateLimitEntry>();

function getSecretKey(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("CRITICAL SECURITY ERROR: SESSION_SECRET is required in production");
    }
    return "dev_local_only_session_fallback_secret_key_8f3d6c7b9a1e4f2";
  }
  return secret;
}

/**
 * Hash password securely using Node.js crypto scrypt + cryptographic salt
 * (OWASP recommended password hashing algorithm)
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `scrypt$${salt}$${derivedKey.toString("hex")}`;
}

/**
 * Verify a candidate password against a stored scrypt or bcrypt hash
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!password || !storedHash) return false;

  const check = (candidate: string): boolean => {
    // Support scrypt format: scrypt$salt$hash
    if (storedHash.startsWith("scrypt$")) {
      const parts = storedHash.split("$");
      if (parts.length !== 3) return false;
      const [, salt, expectedHashHex] = parts;
      const derivedKey = crypto.scryptSync(candidate, salt, 64);
      const expectedBuffer = Buffer.from(expectedHashHex, "hex");
      if (derivedKey.length !== expectedBuffer.length) return false;
      return crypto.timingSafeEqual(derivedKey, expectedBuffer);
    }

    // Plain-text fallback check for initial development env comparison (timing-safe)
    const a = Buffer.from(candidate);
    const b = Buffer.from(storedHash);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  };

  return check(password) || (password.trim() !== password && check(password.trim()));
}

/**
 * Path to secure admin credentials store
 */
const AUTH_FILE_PATH = path.join(process.cwd(), "data", "admin-auth.json");

interface AdminAuthStore {
  username: string;
  passwordHash: string;
  updatedAt: string;
}

/**
 * Get configured admin credentials from environment or secure local hash store
 */
export function getAdminCredentials(): { username: string; passwordHash: string } {
  const envUsername = (process.env.ADMIN_USERNAME || "plpanjali05").trim();
  const envPassword = (process.env.ADMIN_PASSWORD || "").trim();

  // Check if hash store exists
  if (fs.existsSync(AUTH_FILE_PATH)) {
    try {
      const raw = fs.readFileSync(AUTH_FILE_PATH, "utf-8");
      const store: AdminAuthStore = JSON.parse(raw);
      if (store.username && store.passwordHash) {
        return { username: store.username, passwordHash: store.passwordHash };
      }
    } catch {
      // fallback to re-init
    }
  }

  // If no password configured in environment, return empty hash to prevent any login
  if (!envPassword) {
    return { username: envUsername, passwordHash: "" };
  }

  // Initialize hash store from env
  const hash = hashPassword(envPassword);
  const initialStore: AdminAuthStore = {
    username: envUsername,
    passwordHash: hash,
    updatedAt: new Date().toISOString(),
  };

  try {
    const dir = path.dirname(AUTH_FILE_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(AUTH_FILE_PATH, JSON.stringify(initialStore, null, 2), "utf-8");
  } catch {
    // In serverless / read-only production environments this is harmless
  }

  return { username: envUsername, passwordHash: hash };
}

/**
 * Check and record login rate limiting
 */
export function checkRateLimit(identifier: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry) {
    return { allowed: true };
  }

  if (entry.blockedUntil > now) {
    const remaining = Math.ceil((entry.blockedUntil - now) / 1000);
    return { allowed: false, retryAfterSeconds: remaining };
  }

  // Window expired, reset
  if (now - (entry.blockedUntil - RATE_LIMIT_WINDOW_MS) > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.delete(identifier);
    return { allowed: true };
  }

  return { allowed: true };
}

export function recordFailedAttempt(identifier: string): { blocked: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier) || { attempts: 0, blockedUntil: 0 };

  entry.attempts += 1;
  if (entry.attempts >= MAX_ATTEMPTS) {
    entry.blockedUntil = now + RATE_LIMIT_WINDOW_MS;
    rateLimitMap.set(identifier, entry);
    return { blocked: true, retryAfterSeconds: Math.ceil(RATE_LIMIT_WINDOW_MS / 1000) };
  }

  rateLimitMap.set(identifier, entry);
  return { blocked: false };
}

export function clearRateLimit(identifier: string): void {
  rateLimitMap.delete(identifier);
}

/**
 * Create a cryptographically signed session token
 */
export function createSessionToken(username: string): string {
  const payload = {
    username,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_DURATION_MS,
    nonce: crypto.randomBytes(16).toString("hex"),
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", getSecretKey())
    .update(payloadBase64)
    .digest("base64url");

  return `${payloadBase64}.${signature}`;
}

/**
 * Verify a session token
 */
export function verifySessionToken(token: string): { valid: boolean; username?: string } {
  if (!token || typeof token !== "string") return { valid: false };

  const parts = token.split(".");
  if (parts.length !== 2) return { valid: false };

  const [payloadBase64, providedSig] = parts;

  const expectedSig = crypto
    .createHmac("sha256", getSecretKey())
    .update(payloadBase64)
    .digest("base64url");

  const a = Buffer.from(providedSig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return { valid: false };
  }

  try {
    const jsonStr = Buffer.from(payloadBase64, "base64url").toString("utf-8");
    const payload = JSON.parse(jsonStr);

    if (Date.now() > payload.expiresAt) {
      return { valid: false };
    }

    return { valid: true, username: payload.username };
  } catch {
    return { valid: false };
  }
}

/**
 * Server-side helper to verify the current admin request session from cookies
 */
export async function getAuthenticatedAdmin(): Promise<{ authenticated: boolean; username?: string }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return { authenticated: false };

    const result = verifySessionToken(token);
    if (!result.valid || !result.username) {
      return { authenticated: false };
    }

    const credentials = getAdminCredentials();
    if (result.username !== credentials.username) {
      return { authenticated: false };
    }

    return { authenticated: true, username: result.username };
  } catch {
    return { authenticated: false };
  }
}

export { SESSION_COOKIE_NAME, SESSION_DURATION_MS };
