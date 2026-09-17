import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { testimonialSchema } from "@/lib/validation";
import { slugify } from "@/lib/slug";

function flatten(row: { id: string; approved: boolean; createdAt: Date; data: any }) {
  return { id: row.id, approved: row.approved, createdAt: row.createdAt, ...(row.data as object) };
}

export async function GET() {
  const rows = await prisma.testimonial.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
  return NextResponse.json({ testimonials: rows.map(flatten) });
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = testimonialSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const baseSlug = slugify(parsed.data.name) || "student";
  let id = baseSlug;
  let n = 1;
  while (await prisma.testimonial.findUnique({ where: { id } })) {
    id = `${baseSlug}-${++n}`;
  }

  const row = await prisma.testimonial.create({
    data: {
      id,
      name: parsed.data.name,
      featured: parsed.data.isFeatured,
      approved: true, // testimonials added directly by an admin are live immediately
      order: parsed.data.order,
      data: parsed.data,
    },
  });

  return NextResponse.json({ testimonial: flatten(row) }, { status: 201 });
}
