import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const teamSchema = z.object({
  name: z.string().trim().min(2).max(120),
  role: z.string().trim().max(160).optional().default(""),
  department: z.string().trim().max(80).optional().default(""),
  experience: z.string().trim().max(40).optional().default(""),
  specialisation: z.array(z.string()).optional().default([]),
  image: z.string().trim().max(500).optional().default(""),
  bio: z.string().trim().max(2000).optional().default(""),
  qualifications: z.array(z.string()).optional().default([]),
  languages: z.array(z.string()).optional().default([]),
  studiedIn: z.string().trim().max(80).optional().default(""),
  linkedIn: z.string().trim().max(300).optional().default(""),
  email: z.string().trim().max(160).optional().default(""),
  isFeatured: z.boolean().optional().default(false),
  order: z.coerce.number().optional().default(0),
});

function flatten(row: { id: string; data: any }) {
  return { id: row.id, ...(row.data as object) };
}

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

  const parsed = teamSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const existing = await prisma.teamMember.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Team member not found" }, { status: 404 });
  }

  const mergedData = { ...(existing.data as object), ...parsed.data };
  const updated = await prisma.teamMember.update({
    where: { id },
    data: {
      name: parsed.data.name ?? existing.name,
      order: parsed.data.order ?? existing.order,
      data: mergedData,
    },
  });

  return NextResponse.json({ member: flatten(updated) });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.teamMember.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Team member not found" }, { status: 404 });
  }
}
