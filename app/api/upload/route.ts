import { NextRequest, NextResponse } from "next/server";
import { saveUploadedImage } from "@/lib/uploadImage";

// Public upload endpoint — used ONLY by the "Share Your Story" form so
// visitors can attach a photo without an admin account. Tightly rate
// limited since it's unauthenticated. Do not reuse this for other
// public forms without reviewing the limit below.

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
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
    return NextResponse.json({ error: "Too many uploads. Please try again later." }, { status: 429 });
  }

  const formData = await req.formData();
  const result = await saveUploadedImage(formData);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json({ url: result.url }, { status: 201 });
}
