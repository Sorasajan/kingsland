import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMail, campaignEmailHtml, isMailConfigured } from "@/lib/mailer";
import { sanitizeRichText } from "@/lib/sanitizeHtml";
import { getCompany } from "@/lib/content";
import { z } from "zod";

const campaignSchema = z.object({
  subject: z.string().trim().min(1, "Subject is required").max(200),
  bodyHtml: z.string().trim().min(1, "Message is required"),
});

// Sends one email per subscriber (not a single BCC blast) so each
// person gets their own unsubscribe link and nobody sees anyone else's
// address. Sent in small concurrent batches rather than one-by-one or
// all-at-once, to keep this reasonably fast without hammering the SMTP
// provider — most providers rate-limit aggressively.
const BATCH_SIZE = 5;

export async function POST(req: NextRequest) {
  if (!(await isMailConfigured())) {
    return NextResponse.json(
      { error: "Email isn't configured yet. Set SMTP_HOST/SMTP_USER/SMTP_PASS in your environment first." },
      { status: 400 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = campaignSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const subscribers = await prisma.newsletterSubscriber.findMany();
  if (subscribers.length === 0) {
    return NextResponse.json({ error: "There are no newsletter subscribers yet." }, { status: 400 });
  }

  const [company] = await Promise.all([getCompany()]);
  const companyName = company?.shortName || company?.name || "our newsletter";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
  const safeBody = sanitizeRichText(parsed.data.bodyHtml);

  let sent = 0;
  let failed = 0;
  const failedEmails: string[] = [];

  for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
    const batch = subscribers.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map((sub: { id: string; email: string }) =>
        sendMail({
          to: sub.email,
          subject: parsed.data.subject,
          html: campaignEmailHtml({
            bodyHtml: safeBody,
            unsubscribeUrl: `${siteUrl}/api/newsletter/unsubscribe?id=${sub.id}`,
            companyName,
          }),
        })
      )
    );
    results.forEach((r: PromiseSettledResult<unknown>, idx: number) => {
      if (r.status === "fulfilled") {
        sent++;
      } else {
        failed++;
        failedEmails.push(batch[idx].email);
      }
    });
  }

  return NextResponse.json({
    success: true,
    total: subscribers.length,
    sent,
    failed,
    failedEmails: failedEmails.slice(0, 20), // cap in case of a large failure list
  });
}
