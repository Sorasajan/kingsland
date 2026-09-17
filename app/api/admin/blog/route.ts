import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { blogSchema } from "@/lib/validation";
import { slugify } from "@/lib/slug";
import { sanitizeRichText } from "@/lib/sanitizeHtml";

export async function GET() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = blogSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const baseSlug = slugify(parsed.data.slug || parsed.data.title);
  let slug = baseSlug;
  let n = 1;
  while (await prisma.blogPost.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${++n}`;
  }

  const post = await prisma.blogPost.create({
    data: { ...parsed.data, content: sanitizeRichText(parsed.data.content), slug },
  });

  return NextResponse.json({ post }, { status: 201 });
}
