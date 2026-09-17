import crypto from "node:crypto";

// Used to encrypt sensitive admin-configured secrets (currently: the
// SMTP password) before they're stored in the database. Set a dedicated
// ENCRYPTION_KEY in production — falling back to JWT_SECRET means
// rotating one rotates the other, which is fine for dev but not ideal
// long-term.
const KEY_SOURCE =
  process.env.ENCRYPTION_KEY || process.env.JWT_SECRET || "dev-only-insecure-key-change-me";
const KEY = crypto.createHash("sha256").update(KEY_SOURCE).digest(); // 32 bytes, required for aes-256

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", KEY, iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

export function decrypt(payload: string): string {
  const buf = Buffer.from(payload, "base64");
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const encrypted = buf.subarray(28);
  const decipher = crypto.createDecipheriv("aes-256-gcm", KEY, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString("utf8");
}
