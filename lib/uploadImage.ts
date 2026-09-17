import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

// IMPORTANT: this writes to the local filesystem, which works for
// `npm run dev` / a traditional Node server, but NOT on serverless
// platforms like Vercel — their filesystem is read-only/ephemeral
// outside /tmp, so uploaded files would vanish. If you deploy there,
// swap this for an object-storage upload (S3, Cloudinary, Vercel Blob,
// etc) instead.

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export type UploadResult =
  | { ok: true; url: string }
  | { ok: false; status: number; error: string };

export async function saveUploadedImage(formData: FormData): Promise<UploadResult> {
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return { ok: false, status: 400, error: "No file provided" };
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { ok: false, status: 400, error: "Unsupported file type. Use JPEG, PNG, WebP, or GIF." };
  }
  if (file.size > MAX_SIZE_BYTES) {
    return { ok: false, status: 400, error: "File too large (max 5MB)." };
  }

  const ext = path.extname(file.name) || `.${file.type.split("/")[1]}`;
  const filename = `${crypto.randomUUID()}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });

  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(uploadDir, filename), bytes);

  return { ok: true, url: `/uploads/${filename}` };
}
