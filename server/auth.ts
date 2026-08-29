import { SignJWT, jwtVerify } from "jose";
import type { Request, Response, NextFunction } from "express";

const COOKIE_NAME = "team_up_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set.");
  }
  return new TextEncoder().encode(secret);
}

export async function createAdminSession(email: string): Promise<string> {
  return new SignJWT({ role: "admin", email })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifyAdminSession(token: string): Promise<{ role: string; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (payload.role !== "admin") return null;
    return { role: "admin", email: payload.email as string };
  } catch {
    return null;
  }
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: SESSION_DURATION_SECONDS * 1000,
    path: "/",
  };
}

export { COOKIE_NAME };

/** Express middleware, blocks the request unless a valid admin session cookie is present. */
export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) {
    return res.status(401).json({ error: "Not signed in." });
  }
  const session = await verifyAdminSession(token);
  if (!session) {
    return res.status(401).json({ error: "Session expired or invalid." });
  }
  next();
}
