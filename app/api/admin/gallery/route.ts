import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const gallerySchema = z.object({
  src: z.string().trim().min(1, "Image is required"),
  alt: z.string().trim().max(200).optional().default(""),
  size: z.enum(["normal", "wide", "tall"]).optional().default("normal"),
  order: z.coerce.number().optional().default(0),
});

export async function GET() {
  const images = await prisma.galleryImage.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ images });
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = gallerySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const image = await prisma.galleryImage.create({ data: parsed.data });
  return NextResponse.json({ image }, { status: 201 });
}
