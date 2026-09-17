import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Local JSON type — avoids depending on @prisma/client's internal type exports,
// which seem to differ from the standard package in this project's setup.
type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

// Company info is a flexible JSON blob (many optional nested sections —
// contact, address, office hours, social, stats, certifications, awards)
// so we only require the essentials here and pass the rest through.
const companySchema = z
  .object({
    name: z.string().trim().min(2).max(200),
  })
  .passthrough();

export async function GET() {
  const row = await prisma.siteContent.findUnique({
    where: { key: "company" },
  });
  return NextResponse.json({ company: row?.data ?? null });
}

export async function PUT(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = companySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const existing = await prisma.siteContent.findUnique({
    where: { key: "company" },
  });
  const mergedData = { ...((existing?.data as object) ?? {}), ...parsed.data };

  const row = await prisma.siteContent.upsert({
    where: { key: "company" },
    update: { data: mergedData as JsonValue as any },
    create: { key: "company", data: mergedData as JsonValue as any },
  });

  return NextResponse.json({ company: row.data });
}
