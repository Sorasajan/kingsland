import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/crypto";
import { sendTestMail } from "@/lib/mailer";
import { z } from "zod";

// Lets an admin verify SMTP settings work BEFORE (or right after)
// saving them — tests using whatever is currently in the form, not
// necessarily what's already saved, by accepting the full config here.
const testSchema = z.object({
  host: z.string().trim().min(1, "Host is required"),
  port: z.coerce.number().min(1).max(65535).default(587),
  secure: z.boolean().optional().default(false),
  user: z.string().trim().min(1, "Username is required"),
  password: z.string().optional().default(""), // may be blank if reusing the saved one
  from: z.string().trim().optional().default(""),
  to: z.string().trim().email("Enter a valid test recipient email"),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = testSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  let password = parsed.data.password;
  if (!password) {
    // Fall back to the already-saved encrypted password.
    const row = await prisma.siteContent.findUnique({ where: { key: "smtp-settings" } });
    const saved = (row?.data as any) ?? {};
    if (!saved.passEncrypted) {
      return NextResponse.json(
        { error: "No password saved yet — enter one to test with." },
        { status: 400 }
      );
    }
    password = decrypt(saved.passEncrypted);
  }

  try {
    await sendTestMail({
      host: parsed.data.host,
      port: parsed.data.port,
      secure: parsed.data.secure,
      user: parsed.data.user,
      pass: password,
      from: parsed.data.from,
      to: parsed.data.to,
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to send test email. Check your settings." },
      { status: 400 }
    );
  }
}
