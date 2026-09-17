import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

// Stores uploaded files outside `public` so they are not tied to the
// Next.js build/static asset system.
//
// Recommended structure:
//   project/
//     uploads/
//     public/
//     .next/
//
// This works with a traditional Node.js/VPS deployment.
// For serverless platforms such as Vercel, use object storage instead.

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export type UploadResult =
  | { ok: true; url: string }
  | { ok: false; status: number; error: string };

export async function saveUploadedImage(
  formData: FormData,
): Promise<UploadResult> {
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return {
      ok: false,
      status: 400,
      error: "No file provided",
    };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      ok: false,
      status: 400,
      error: "Unsupported file type. Use JPEG, PNG, WebP, or GIF.",
    };
  }

  if (file.size > MAX_SIZE_BYTES) {
    return {
      ok: false,
      status: 400,
      error: "File too large (max 5MB).",
    };
  }

  const ext =
    path.extname(file.name).toLowerCase() || `.${file.type.split("/")[1]}`;

  const filename = `${crypto.randomUUID()}${ext}`;

  // IMPORTANT:
  // Do NOT put user uploads inside `public`.
  const uploadDir = path.join(process.cwd(), "uploads");

  await fs.mkdir(uploadDir, {
    recursive: true,
  });

  const filePath = path.join(uploadDir, filename);

  const bytes = Buffer.from(await file.arrayBuffer());

  await fs.writeFile(filePath, bytes);

  return {
    ok: true,
    url: `/api/uploads/${filename}`,
  };
}
