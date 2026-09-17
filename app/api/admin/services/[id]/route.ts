import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function flatten(row: { id: string; slug: string; data: any }) {
  return { id: row.id, slug: row.slug, ...(row.data as object) };
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
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  const patch = body as Record<string, unknown>;
  const mergedData = { ...(existing.data as object), ...patch };
  const updated = await prisma.service.update({
    where: { id },
    data: {
      title: (patch.title as string) ?? existing.title,
      data: mergedData,
    },
  });

  return NextResponse.json({ service: flatten(updated) });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }
}
