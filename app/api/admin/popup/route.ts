import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sanitizeRichText } from "@/lib/sanitizeHtml";

const popupSchema = z.object({
  enabled: z.boolean().optional().default(false),
  title: z.string().trim().max(200).optional().default(""),
  message: z.string().trim().max(5000).optional().default(""),
  imageUrl: z.string().trim().max(500).optional().default(""),
  ctaText: z.string().trim().max(60).optional().default(""),
  ctaLink: z.string().trim().max(300).optional().default(""),
  delaySeconds: z.coerce.number().min(0).max(120).optional().default(3),
  frequency: z.enum(["always", "session", "daily"]).optional().default("session"),
});

export async function GET() {
  const row = await prisma.siteContent.findUnique({ where: { key: "popup" } });
  return NextResponse.json({ popup: row?.data ?? null });
}

export async function PUT(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = popupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const row = await prisma.siteContent.upsert({
    where: { key: "popup" },
    update: { data: { ...parsed.data, message: sanitizeRichText(parsed.data.message) } },
    create: { key: "popup", data: { ...parsed.data, message: sanitizeRichText(parsed.data.message) } },
  });

  return NextResponse.json({ popup: row.data });
}
