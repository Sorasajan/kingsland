import { NextRequest, NextResponse } from "next/server";
import { saveUploadedImage } from "@/lib/uploadImage";

// Local image upload used by admin forms (team photos, blog cover
// images, etc). See lib/uploadImage.ts for the filesystem caveat on
// serverless hosts.

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const result = await saveUploadedImage(formData);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json({ url: result.url }, { status: 201 });
}
