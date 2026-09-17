import crypto from "node:crypto";

export const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Generates a random reset token. The RAW token goes in the emailed
 * link; only its hash is ever stored in the database, so a database
 * leak alone can't be used to reset anyone's password.
 */
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function hashResetToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
