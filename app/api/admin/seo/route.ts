import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const seoSchema = z.object({
  siteUrl: z.string().trim().max(300).optional().default(""),
  defaultMetaTitle: z.string().trim().max(200).optional().default(""),
  defaultMetaDescription: z.string().trim().max(300).optional().default(""),
  ogImage: z.string().trim().max(500).optional().default(""),
  twitterHandle: z.string().trim().max(60).optional().default(""),
  googleAnalyticsId: z.string().trim().max(60).optional().default(""),
  googleSiteVerification: z.string().trim().max(200).optional().default(""),
  bingSiteVerification: z.string().trim().max(200).optional().default(""),
});

export async function GET() {
  const row = await prisma.siteContent.findUnique({ where: { key: "seo-settings" } });
  return NextResponse.json({ seo: row?.data ?? null });
}

export async function PUT(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = seoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const row = await prisma.siteContent.upsert({
    where: { key: "seo-settings" },
    update: { data: parsed.data },
    create: { key: "seo-settings", data: parsed.data },
  });

  return NextResponse.json({ seo: row.data });
}
