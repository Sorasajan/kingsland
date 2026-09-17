import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ filename: string }>;
  },
) {
  const { filename } = await params;

  if (
    filename.includes("/") ||
    filename.includes("\\") ||
    filename.includes("..")
  ) {
    return new NextResponse("Invalid filename", {
      status: 400,
    });
  }

  const filePath = path.join(process.cwd(), "uploads", filename);

  try {
    const file = await fs.readFile(filePath);

    const extension = path.extname(filename).toLowerCase();

    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type": MIME_TYPES[extension] || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Image not found:", filePath, error);

    return new NextResponse("File not found", {
      status: 404,
    });
  }
}
