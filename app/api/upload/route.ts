import { NextRequest, NextResponse } from "next/server";
import { saveUploadedImage } from "@/lib/uploadImage";

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

const hits = new Map<string, number[]>();

function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return req.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();

  const timestamps = (hits.get(ip) || []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  timestamps.push(now);
  hits.set(ip, timestamps);

  return timestamps.length > RATE_LIMIT_MAX;
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        error: "Too many uploads. Please try again later.",
      },
      { status: 429 },
    );
  }

  try {
    const formData = await req.formData();

    const result = await saveUploadedImage(formData);

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    return NextResponse.json({ url: result.url }, { status: 201 });
  } catch (error) {
    console.error("Public image upload error:", error);

    return NextResponse.json(
      { error: "Failed to upload image." },
      { status: 500 },
    );
  }
}
