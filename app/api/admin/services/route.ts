import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
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

const serviceSchema = z
  .object({
    title: z.string().trim().min(2).max(120),
  })
  .passthrough();

function flatten(row: { id: string; slug: string; data: any }) {
  return { id: row.id, slug: row.slug, ...(row.data as object) };
}

export async function GET() {
  const rows = await prisma.service.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json({ services: rows.map(flatten) });
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = serviceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const baseSlug = slugify(parsed.data.title);
  let slug = baseSlug;
  let n = 1;
  while (await prisma.service.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${++n}`;
  }

  const row = await prisma.service.create({
    data: {
      id: slug,
      slug,
      title: parsed.data.title,
      data: parsed.data as JsonValue as any,
    },
  });

  return NextResponse.json({ service: flatten(row) }, { status: 201 });
}
