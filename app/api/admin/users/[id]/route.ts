import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { getAdminSession } from "@/lib/requireAdmin";
import { z } from "zod";
import { ROLES } from "@/lib/permissions";

const updateUserSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  role: z.enum(ROLES).optional(),
  password: z.string().min(8).optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getAdminSession(req);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = updateUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const target = await prisma.adminUser.findUnique({ where: { id } });
  if (!target) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Guard against locking everyone out: you can't demote yourself away
  // from SUPER_ADMIN, and you can't demote the last remaining SUPER_ADMIN.
  if (parsed.data.role && parsed.data.role !== "SUPER_ADMIN" && target.role === "SUPER_ADMIN") {
    if (session?.sub === target.id) {
      return NextResponse.json(
        { error: "You can't demote your own account." },
        { status: 400 }
      );
    }
    const superAdminCount = await prisma.adminUser.count({ where: { role: "SUPER_ADMIN" } });
    if (superAdminCount <= 1) {
      return NextResponse.json(
        { error: "Can't demote the last remaining Super Admin." },
        { status: 400 }
      );
    }
  }

  const data: Record<string, unknown> = {};
  if (parsed.data.name) data.name = parsed.data.name;
  if (parsed.data.role) data.role = parsed.data.role;
  if (parsed.data.password) data.passwordHash = await hashPassword(parsed.data.password);

  const updated = await prisma.adminUser.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return NextResponse.json({ user: updated });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getAdminSession(req);

  if (session?.sub === id) {
    return NextResponse.json({ error: "You can't delete your own account." }, { status: 400 });
  }

  const target = await prisma.adminUser.findUnique({ where: { id } });
  if (!target) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (target.role === "SUPER_ADMIN") {
    const superAdminCount = await prisma.adminUser.count({ where: { role: "SUPER_ADMIN" } });
    if (superAdminCount <= 1) {
      return NextResponse.json(
        { error: "Can't delete the last remaining Super Admin." },
        { status: 400 }
      );
    }
  }

  await prisma.adminUser.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
