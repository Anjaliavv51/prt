import { NextRequest, NextResponse } from "next/server";
import {
  getAdminCredentials,
  verifyPassword,
  checkRateLimit,
  recordFailedAttempt,
  clearRateLimit,
  createSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_DURATION_MS,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    // 1. Rate limiting check
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Too many failed attempts. Please wait ${rateCheck.retryAfterSeconds} seconds before trying again.`,
        },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body.username !== "string" || typeof body.password !== "string") {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 400 }
      );
    }

    const { username, password } = body;
    const credentials = getAdminCredentials();

    // Case-insensitive trimmed username check
    const usernameMatches =
      username.trim().toLowerCase() === credentials.username.toLowerCase();
    const passwordMatches = verifyPassword(password, credentials.passwordHash);

    if (!usernameMatches || !passwordMatches) {
      const failResult = recordFailedAttempt(ip);
      const message = failResult.blocked
        ? `Too many failed attempts. Account locked for ${failResult.retryAfterSeconds} seconds.`
        : "Invalid username or password";

      return NextResponse.json(
        { error: message },
        { status: failResult.blocked ? 429 : 401 }
      );
    }

    // Success: clear rate limiter
    clearRateLimit(ip);

    // Create secure signed session token
    const token = createSessionToken(credentials.username);

    const response = NextResponse.json({
      success: true,
      message: "Authentication successful",
      user: { username: credentials.username },
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: Math.floor(SESSION_DURATION_MS / 1000),
    });

    return response;
  } catch (err) {
    console.error("Login route error:", err);
    return NextResponse.json(
      { error: "Internal authentication error" },
      { status: 500 }
    );
  }
}
