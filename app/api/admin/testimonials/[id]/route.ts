import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { testimonialSchema } from "@/lib/validation";
import { z } from "zod";

function flatten(row: { id: string; approved: boolean; createdAt: Date; data: any }) {
  return { id: row.id, approved: row.approved, createdAt: row.createdAt, ...(row.data as object) };
}

const updateSchema = testimonialSchema.partial().extend({
  approved: z.boolean().optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const existing = await prisma.testimonial.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
  }

  const { approved, ...rest } = parsed.data;
  const mergedData = { ...(existing.data as object), ...rest };
  const updated = await prisma.testimonial.update({
    where: { id },
    data: {
      name: rest.name ?? existing.name,
      featured: rest.isFeatured ?? existing.featured,
      approved: approved ?? existing.approved,
      order: rest.order ?? existing.order,
      data: mergedData,
    },
  });

  return NextResponse.json({ testimonial: flatten(updated) });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.testimonial.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
  }
}
