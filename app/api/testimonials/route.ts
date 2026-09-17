import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { publicTestimonialSchema } from "@/lib/validation";
import { slugify } from "@/lib/slug";

// Public endpoint — anyone can submit a success story. It's saved with
// approved:false and never shown on the site until an admin reviews and
// approves it from /admin/testimonials.

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 3;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const timestamps = (hits.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  hits.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = publicTestimonialSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  // Honeypot tripped — pretend success so bots don't learn anything.
  if (parsed.data.company_website) {
    return NextResponse.json({ success: true });
  }

  const { company_website, email, ...rest } = parsed.data;

  const baseSlug = slugify(rest.name) || "student";
  let id = baseSlug;
  let n = 1;
  while (await prisma.testimonial.findUnique({ where: { id } })) {
    id = `${baseSlug}-${++n}`;
  }

  await prisma.testimonial.create({
    data: {
      id,
      name: rest.name,
      featured: false,
      approved: false,
      order: 0,
      data: {
        ...rest,
        isFeatured: false,
        // Kept for admin follow-up only — stripped before any public read.
        contactEmail: email,
        submittedAt: new Date().toISOString(),
        source: "public-submission",
      },
    },
  });

  return NextResponse.json({ success: true });
}
