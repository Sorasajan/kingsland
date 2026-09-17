import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// One-click unsubscribe link used in campaign emails. GET (not POST) is
// intentional here — email clients only support plain clickable links.
// The subscriber's UUID id is the token; UUIDs aren't practically
// guessable, so this is an acceptable tradeoff for a low-stakes action
// (worst case: someone removes another person's newsletter subscription).
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;

  if (id) {
    await prisma.newsletterSubscriber.deleteMany({ where: { id } });
  }

  return NextResponse.redirect(new URL("/unsubscribed", siteUrl));
}
