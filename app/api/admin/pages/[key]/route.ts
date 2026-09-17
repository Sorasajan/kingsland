import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sanitizeRichText } from "@/lib/sanitizeHtml";

// Reuses the SiteContent singleton-JSON-blob table (also used for
// company/site-config) but scoped to a fixed whitelist of page-content
// keys, so this endpoint can never touch "company" or "site-config".
const ALLOWED_KEYS = [
  "page-about-hero",
  "page-test-prep-hero",
  "legal-privacy-policy",
  "legal-terms-of-service",
] as const;

const heroSchema = z.object({
  badge: z.string().trim().max(80).optional().default(""),
  title: z.string().trim().max(200),
  subtitle: z.string().trim().max(500).optional().default(""),
});

const legalSchema = z.object({
  title: z.string().trim().max(200),
  content: z.string().trim().min(1),
});

function isAllowedKey(key: string): key is (typeof ALLOWED_KEYS)[number] {
  return (ALLOWED_KEYS as readonly string[]).includes(key);
}

function schemaFor(key: string) {
  return key.startsWith("legal-") ? legalSchema : heroSchema;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  if (!isAllowedKey(key)) {
    return NextResponse.json({ error: "Unknown page key" }, { status: 404 });
  }
  const row = await prisma.siteContent.findUnique({ where: { key } });
  return NextResponse.json({ data: row?.data ?? null });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  if (!isAllowedKey(key)) {
    return NextResponse.json({ error: "Unknown page key" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = schemaFor(key).safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const data = key.startsWith("legal-")
    ? {
        ...parsed.data,
        content: sanitizeRichText((parsed.data as { content: string }).content),
        updatedAt: new Date().toISOString(),
      }
    : parsed.data;

  const row = await prisma.siteContent.upsert({
    where: { key },
    update: { data },
    create: { key, data },
  });

  return NextResponse.json({ data: row.data });
}
