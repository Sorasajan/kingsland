import { SignJWT, jwtVerify } from "jose";
import type { Role } from "@/lib/permissions";

// Password hashing (bcryptjs) lives in lib/password.ts, kept separate from
// this file so that middleware.ts — which runs in the Edge runtime and only
// needs to *verify* the session token — doesn't pull in Node-only APIs.
//
// We use `jose` here (not `jsonwebtoken`) specifically because it's built
// on the Web Crypto API and works identically in both the Node.js runtime
// (API routes) and the Edge runtime (middleware.ts). `jsonwebtoken` relies
// on Node's `crypto` module, which Edge Middleware doesn't fully support —
// `jwt.verify()` there can silently throw on every call, which looks like
// "the user is never logged in" even though the cookie is set correctly.

const JWT_SECRET =
  process.env.JWT_SECRET || "dev-only-insecure-secret-change-me";
const secretKey = new TextEncoder().encode(JWT_SECRET);

export const SESSION_COOKIE = "kingsland_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours

export interface AdminSessionPayload {
  sub: string; // admin user id
  email: string;
  name: string;
  role: Role;
}

export async function signSession(
  payload: AdminSessionPayload,
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS)
    .sign(secretKey);
}

export async function verifySession(
  token: string,
): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as AdminSessionPayload;
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  // secure: process.env.NODE_ENV === "production",
  secure: false,
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
};
