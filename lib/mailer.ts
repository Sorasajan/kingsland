import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";
import { decrypt, encrypt } from "@/lib/crypto";

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  passEncrypted: string; // stored encrypted; decrypt right before use
  from: string;
  contactReceiverEmail: string;
}

/**
 * SMTP settings now live in the database (SiteContent key "smtp-settings",
 * editable from /admin/smtp) instead of only environment variables. Env
 * vars still work as a fallback for anything not set in the DB, so an
 * existing .env.local-based setup keeps working untouched.
 */
async function getEffectiveConfig(): Promise<SmtpConfig | null> {
  const row = await prisma.siteContent.findUnique({ where: { key: "smtp-settings" } });
  const db = (row?.data as any) ?? {};

  const host = db.host || process.env.SMTP_HOST || "";
  const user = db.user || process.env.SMTP_USER || "";
  const passEncrypted = db.passEncrypted || "";
  const envPass = process.env.SMTP_PASS || "";

  if (!host || !user || (!passEncrypted && !envPass)) return null;

  return {
    host,
    port: Number(db.port) || Number(process.env.SMTP_PORT) || 587,
    secure: db.secure ?? Number(process.env.SMTP_PORT) === 465,
    user,
    // If a DB password was ever saved, it takes priority; otherwise use
    // the (unencrypted) env var directly.
    passEncrypted: passEncrypted || (envPass ? encrypt(envPass) : ""),
    from: db.from || process.env.SMTP_FROM || user,
    contactReceiverEmail: db.contactReceiverEmail || process.env.CONTACT_RECEIVER_EMAIL || user,
  };
}

export async function isMailConfigured(): Promise<boolean> {
  return (await getEffectiveConfig()) !== null;
}

async function getTransporter(): Promise<{ transporter: nodemailer.Transporter; config: SmtpConfig } | null> {
  const config = await getEffectiveConfig();
  if (!config) return null;
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: decrypt(config.passEncrypted) },
  });
  return { transporter, config };
}

interface SendMailInput {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

/**
 * Sends an email if SMTP is configured (DB or env). If not, this
 * silently no-ops (logging instead) so the rest of the app — saving the
 * lead/subscriber — still works without email set up.
 */
export async function sendMail({ to, subject, html, replyTo }: SendMailInput) {
  const result = await getTransporter();
  if (!result) {
    console.warn(
      "[mailer] SMTP not configured — skipping email send. Configure it from /admin/smtp or set SMTP_HOST/SMTP_USER/SMTP_PASS in .env.local."
    );
    return { sent: false as const };
  }
  const { transporter, config } = result;
  await transporter.sendMail({ from: config.from, to, subject, html, replyTo });
  return { sent: true as const };
}

/**
 * Sends a test email using whatever config is passed in (used by the
 * "Send Test Email" button in /admin/smtp so an admin can verify new
 * settings BEFORE saving them, without needing a separate save step).
 */
export async function sendTestMail(config: {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  to: string;
}) {
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.pass },
  });
  await transporter.sendMail({
    from: config.from || config.user,
    to: config.to,
    subject: "Test email from your admin dashboard",
    html: `<p>This is a test email confirming your SMTP settings work correctly.</p>`,
  });
}

export function contactNotificationHtml(lead: {
  name: string;
  email: string;
  phone: string;
  destination?: string;
  service?: string;
  message?: string;
}) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;">
      <h2 style="color:#1e40af;">New Consultation Request</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#64748b;">Name</td><td style="padding:6px 0;font-weight:600;">${lead.name}</td></tr>
        <tr><td style="padding:6px 0;color:#64748b;">Email</td><td style="padding:6px 0;">${lead.email}</td></tr>
        <tr><td style="padding:6px 0;color:#64748b;">Phone</td><td style="padding:6px 0;">${lead.phone}</td></tr>
        <tr><td style="padding:6px 0;color:#64748b;">Destination</td><td style="padding:6px 0;">${lead.destination || "—"}</td></tr>
        <tr><td style="padding:6px 0;color:#64748b;">Service</td><td style="padding:6px 0;">${lead.service || "—"}</td></tr>
      </table>
      <p style="color:#64748b;margin-top:12px;">Message:</p>
      <p style="background:#f8fafc;padding:12px;border-radius:8px;">${lead.message || "—"}</p>
    </div>
  `;
}

export async function contactReceiverEmail(): Promise<string> {
  const config = await getEffectiveConfig();
  return config?.contactReceiverEmail || "info@kingsland.edu.np";
}

export function campaignEmailHtml({
  bodyHtml,
  unsubscribeUrl,
  companyName,
}: {
  bodyHtml: string;
  unsubscribeUrl: string;
  companyName: string;
}) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1e293b;">
      <div style="padding:24px 0;">
        ${bodyHtml}
      </div>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
      <p style="font-size:12px;color:#94a3b8;text-align:center;">
        You're receiving this because you subscribed to ${companyName}'s newsletter.
        <br />
        <a href="${unsubscribeUrl}" style="color:#94a3b8;">Unsubscribe</a>
      </p>
    </div>
  `;
}
