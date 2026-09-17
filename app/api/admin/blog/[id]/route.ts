import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { blogSchema } from "@/lib/validation";
import { sanitizeRichText } from "@/lib/sanitizeHtml";
import { slugify } from "@/lib/slug";

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

  const parsed = blogSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const data: Record<string, unknown> = { ...parsed.data };

  if (parsed.data.content) {
    data.content = sanitizeRichText(parsed.data.content);
  }

  // If the admin edited the slug, dedupe it against every OTHER post
  // (excluding this one) the same way creation does, instead of letting
  // a collision crash with an unhandled unique-constraint error.
  if (parsed.data.slug) {
    const baseSlug = slugify(parsed.data.slug);
    if (!baseSlug) {
      return NextResponse.json({ error: "Slug can't be empty." }, { status: 400 });
    }
    let slug = baseSlug;
    let n = 1;
    while (await prisma.blogPost.findFirst({ where: { slug, NOT: { id } } })) {
      slug = `${baseSlug}-${++n}`;
    }
    data.slug = slug;
  }

  try {
    const updated = await prisma.blogPost.update({
      where: { id },
      data,
    });
    return NextResponse.json({ post: updated });
  } catch {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
}
