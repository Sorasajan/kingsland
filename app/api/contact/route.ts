import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validation";
import {
  contactNotificationHtml,
  contactReceiverEmail,
  sendMail,
} from "@/lib/mailer";

// Very small in-memory rate limiter: max 5 submissions per IP per 10 minutes.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const timestamps = (hits.get(ip) || []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS,
  );
  timestamps.push(now);
  hits.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  // Honeypot tripped — pretend success so bots don't learn anything.
  if (parsed.data.company_website) {
    return NextResponse.json({ success: true });
  }

  const { name, phone, email, destination, service, message } = parsed.data;

  const lead = await prisma.lead.create({
    data: {
      name,
      phone,
      email,
      destination,
      service,
      message,
      status: "new",
      source: "contact-form",
    },
  });

  try {
    await sendMail({
      to: await contactReceiverEmail(),
      subject: `New consultation request — ${name}`,
      html: contactNotificationHtml({
        ...lead,
        destination: lead.destination ?? undefined,
        service: lead.service ?? undefined,
        message: lead.message ?? undefined,
      }),
      replyTo: email,
    });
  } catch (err) {
    // Don't fail the request just because email delivery failed — the
    // lead is already saved and visible in the admin dashboard.
    console.error("[api/contact] Email send failed:", err);
  }

  return NextResponse.json({ success: true, id: lead.id });
}
