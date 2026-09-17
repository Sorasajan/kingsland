import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/crypto";
import { z } from "zod";

const smtpSchema = z.object({
  host: z.string().trim().max(200).optional().default(""),
  port: z.coerce.number().min(1).max(65535).optional().default(587),
  secure: z.boolean().optional().default(false),
  user: z.string().trim().max(200).optional().default(""),
  // Empty string = "leave the currently-saved password alone".
  password: z.string().max(500).optional().default(""),
  from: z.string().trim().max(200).optional().default(""),
  contactReceiverEmail: z.string().trim().max(200).optional().default(""),
});

export async function GET() {
  const row = await prisma.siteContent.findUnique({ where: { key: "smtp-settings" } });
  const data = (row?.data as any) ?? {};
  // Never return the encrypted password blob to the client — just
  // whether one is currently saved, so the UI can show "•••• saved".
  const { passEncrypted, ...safe } = data;
  return NextResponse.json({ smtp: { ...safe, passwordSet: Boolean(passEncrypted) } });
}

export async function PUT(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = smtpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const existing = await prisma.siteContent.findUnique({ where: { key: "smtp-settings" } });
  const existingData = (existing?.data as any) ?? {};

  const { password, ...rest } = parsed.data;
  const data = {
    ...rest,
    passEncrypted: password ? encrypt(password) : existingData.passEncrypted || "",
  };

  const row = await prisma.siteContent.upsert({
    where: { key: "smtp-settings" },
    update: { data },
    create: { key: "smtp-settings", data },
  });

  const saved = row.data as any;
  return NextResponse.json({
    smtp: { ...saved, passEncrypted: undefined, passwordSet: Boolean(saved.passEncrypted) },
  });
}
