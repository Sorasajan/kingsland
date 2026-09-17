import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
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

function flatten(row: { id: string; name: string; order: number; data: any }) {
  return { id: row.id, ...(row.data as object) };
}

export async function GET() {
  const rows = await prisma.teamMember.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ team: rows.map(flatten) });
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = teamSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const baseSlug = slugify(parsed.data.name) || "team-member";
  let id = baseSlug;
  let n = 1;
  while (await prisma.teamMember.findUnique({ where: { id } })) {
    id = `${baseSlug}-${++n}`;
  }

  const row = await prisma.teamMember.create({
    data: { id, name: parsed.data.name, order: parsed.data.order, data: parsed.data },
  });

  return NextResponse.json({ member: flatten(row) }, { status: 201 });
}
