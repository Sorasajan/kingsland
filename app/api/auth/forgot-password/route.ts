import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { generateResetToken, hashResetToken, RESET_TOKEN_TTL_MS } from "@/lib/passwordReset";
import { sendMail, isMailConfigured } from "@/lib/mailer";

const schema = z.object({ email: z.string().trim().email() });

// Rate limit per IP, separate from login's own limiter.
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const timestamps = (hits.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  hits.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX;
}

// Always the same generic response regardless of whether the email
// exists — prevents this endpoint being used to enumerate admin
// accounts by email address.
const GENERIC_RESPONSE = {
  message: "If that email belongs to an admin account, a reset link has been sent.",
};

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    // Still generic — don't leak validation details that could aid enumeration.
    return NextResponse.json(GENERIC_RESPONSE);
  }

  const email = parsed.data.email.toLowerCase();
  const user = await prisma.adminUser.findUnique({ where: { email } });

  if (user) {
    const rawToken = generateResetToken();
    await prisma.adminUser.update({
      where: { id: user.id },
      data: {
        resetTokenHash: hashResetToken(rawToken),
        resetTokenExpiry: new Date(Date.now() + RESET_TOKEN_TTL_MS),
      },
    });

    if (await isMailConfigured()) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
      const resetUrl = `${siteUrl}/admin/reset-password?token=${rawToken}`;
      try {
        await sendMail({
          to: user.email,
          subject: "Reset your admin password",
          html: `
            <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;">
              <h2 style="color:#0f172a;">Reset your password</h2>
              <p style="color:#475569;">We received a request to reset the admin password for ${user.email}. This link expires in 1 hour.</p>
              <p style="margin:24px 0;">
                <a href="${resetUrl}" style="background:#0f172a;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:600;">Reset Password</a>
              </p>
              <p style="color:#94a3b8;font-size:13px;">If you didn't request this, you can safely ignore this email — your password won't change.</p>
            </div>
          `,
        });
      } catch (err) {
        console.error("[forgot-password] Failed to send reset email:", err);
      }
    } else {
      console.warn(
        "[forgot-password] SMTP not configured — can't send reset email. Configure it from /admin/smtp."
      );
    }
  }

  return NextResponse.json(GENERIC_RESPONSE);
}
