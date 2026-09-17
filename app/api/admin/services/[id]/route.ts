import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Local JSON type — avoids depending on @prisma/client's internal type exports,
// which seem to differ from the standard package in this project's setup.
type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

function flatten(row: { id: string; slug: string; data: any }) {
  return { id: row.id, slug: row.slug, ...(row.data as object) };
}

function isPrismaNotFoundError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: unknown }).code === "P2025"
  );
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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

  try {
    const updated = await prisma.service.update({
      where: { id },
      data: {
        title: (patch.title as string) ?? existing.title,
        data: mergedData as JsonValue as any,
      },
    });

    return NextResponse.json({ service: flatten(updated) });
  } catch (err) {
    if (isPrismaNotFoundError(err)) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    if (isPrismaNotFoundError(err)) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }
    console.error(err);
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 },
    );
  }
}
