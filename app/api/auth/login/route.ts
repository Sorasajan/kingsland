import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation";
import { signSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";

// Basic brute-force slow-down:
// Maximum 8 login attempts per IP within 10 minutes.
//
// NOTE:
// This is in-memory and therefore applies only to this Node.js process.
// For multiple PM2 instances/servers, use Redis or database-backed rate limiting.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 8;

const attempts = new Map<string, number[]>();

function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");

  if (forwardedFor) {
    // x-forwarded-for can contain:
    // client-ip, proxy-ip, proxy-ip
    return forwardedFor.split(",")[0].trim();
  }

  return req.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();

  const timestamps = (attempts.get(ip) || []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  timestamps.push(now);
  attempts.set(ip, timestamps);

  return timestamps.length > RATE_LIMIT_MAX;
}

// Periodically remove old entries to prevent the Map from growing forever.
function cleanupRateLimitStore() {
  const now = Date.now();

  for (const [ip, timestamps] of attempts.entries()) {
    const validTimestamps = timestamps.filter(
      (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
    );

    if (validTimestamps.length === 0) {
      attempts.delete(ip);
    } else {
      attempts.set(ip, validTimestamps);
    }
  }
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        error: "Too many login attempts. Please try again later.",
      },
      { status: 429 },
    );
  }

  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }

  const { email, password } = parsed.data;

  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.adminUser.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 },
    );
  }

  const token = await signSession({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role as any,
  });

  const res = NextResponse.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });

  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);

  // Cleanup occasionally rather than on every request.
  if (Math.random() < 0.05) {
    cleanupRateLimitStore();
  }

  return res;
}
