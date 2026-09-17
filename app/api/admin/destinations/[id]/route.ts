import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
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

// Adjust this to match the schema used in your POST route.
// Using .passthrough() so arbitrary extra fields still land in `data`,
// but at least `name` (and any other required fields) are validated.
const destinationUpdateSchema = z
  .object({
    name: z.string().min(1).optional(),
  })
  .passthrough();

function flatten(row: { id: string; slug: string; data: any }) {
  return {
    id: row.id,
    slug: row.slug,
    ...(row.data as object),
  };
}

function isJsonObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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

  if (!isJsonObject(body)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const parsed = destinationUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const existing = await prisma.destination.findUnique({
    where: { id },
  });

  if (!existing) {
    return NextResponse.json(
      { error: "Destination not found" },
      { status: 404 },
    );
  }

  const existingData = isJsonObject(existing.data) ? existing.data : {};

  const mergedData = {
    ...existingData,
    ...parsed.data,
  };

  try {
    const updated = await prisma.destination.update({
      where: { id },
      data: {
        name: parsed.data.name ?? existing.name,
        data: mergedData as JsonValue as any,
      },
    });

    return NextResponse.json({
      destination: flatten(updated),
    });
  } catch (err) {
    if (isPrismaNotFoundError(err)) {
      return NextResponse.json(
        { error: "Destination not found" },
        { status: 404 },
      );
    }

    console.error(err);
    return NextResponse.json(
      { error: "Failed to update destination" },
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
    await prisma.destination.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    if (isPrismaNotFoundError(err)) {
      return NextResponse.json(
        { error: "Destination not found" },
        { status: 404 },
      );
    }

    console.error(err);
    return NextResponse.json(
      { error: "Failed to delete destination" },
      { status: 500 },
    );
  }
}
