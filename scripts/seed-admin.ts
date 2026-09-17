/**
 * Creates/resets the admin login AND imports ALL of the site's original
 * JSON content (company, site-config, destinations, services, testimonials,
 * faqs, team) into Postgres. After this runs, `prisma/seed-data/*.json` is
 * no longer read by the app — everything is served live from the database.
 *
 * Run with: npm run seed:admin
 * Requires DATABASE_URL to be set (see .env.example) and the Prisma
 * client to have been generated (`npx prisma generate`).
 *
 * This is a .ts file run via `tsx` (see package.json) rather than plain
 * `node`, because Prisma ORM v7's generated client is TypeScript-only —
 * there's no compiled .js file for a plain Node `require()`/`import` to
 * load directly.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { config as loadEnv } from "dotenv";

loadEnv({ path: path.join(process.cwd(), ".env") });
loadEnv({ path: path.join(process.cwd(), ".env.local"), override: true });

async function loadPrisma() {
  try {
    const { PrismaClient } = await import("../lib/generated/prisma/client");
    const { PrismaPg } = await import("@prisma/adapter-pg");
    return { PrismaClient, PrismaPg };
  } catch (err: any) {
    if (err?.code === "ERR_MODULE_NOT_FOUND" || err?.code === "MODULE_NOT_FOUND") {
      console.error(
        "\nCan't find the generated Prisma client (lib/generated/prisma).\n" +
          "You need to generate it before seeding. Run these in order:\n\n" +
          "  npx prisma generate\n" +
          "  npx prisma migrate dev --name init\n" +
          "  npm run seed:admin\n"
      );
      process.exit(1);
    }
    throw err;
  }
}

function slugify(input: string): string {
  return String(input)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function readJsonIfExists(dataDir: string, filename: string): any[] | null {
  const file = path.join(dataDir, filename);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

async function seedAdmin(prisma: any) {
  const email = (process.env.ADMIN_EMAIL || "admin@kingsland.edu.np").toLowerCase();
  const name = process.env.ADMIN_NAME || "Kingsland Admin";
  const password = process.env.ADMIN_PASSWORD || crypto.randomBytes(9).toString("base64url");
  const generated = !process.env.ADMIN_PASSWORD;

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.adminUser.upsert({
    where: { email },
    update: { name, passwordHash, role: "SUPER_ADMIN" },
    create: { email, name, passwordHash, role: "SUPER_ADMIN" },
  });

  console.log("\n----------------------------------------");
  console.log("Admin login: /admin/login");
  console.log(`Email:    ${email}`);
  console.log("Role:     SUPER_ADMIN (full access, incl. managing other admin users)");
  console.log(
    generated
      ? `Password: ${password}  (auto-generated — save this now)`
      : "Password: (the one set in ADMIN_PASSWORD)"
  );
  console.log("----------------------------------------\n");
}

async function seedSingleton(prisma: any, dataDir: string, key: string, filename: string) {
  const count = await prisma.siteContent.count({ where: { key } });
  if (count > 0) return;
  const data = readJsonIfExists(dataDir, filename);
  if (!data) return;
  await prisma.siteContent.upsert({ where: { key }, update: {}, create: { key, data } });
  console.log(`Imported ${filename} -> site_content["${key}"]`);
}

async function seedDestinations(prisma: any, dataDir: string) {
  const count = await prisma.destination.count();
  if (count > 0) return;
  const items = readJsonIfExists(dataDir, "destinations.json");
  if (!items) return;
  for (const item of items) {
    const { id, slug, name } = item;
    const finalSlug = slug || slugify(name) || id;
    await prisma.destination.upsert({
      where: { id: id || finalSlug },
      update: {},
      create: { id: id || finalSlug, slug: finalSlug, name, data: item },
    });
  }
  console.log(`Imported ${items.length} destinations into Postgres.`);
}

async function seedServices(prisma: any, dataDir: string) {
  const count = await prisma.service.count();
  if (count > 0) return;
  const items = readJsonIfExists(dataDir, "services.json");
  if (!items) return;
  for (const item of items) {
    const { id, slug, title } = item;
    const finalSlug = slug || slugify(title) || id;
    await prisma.service.upsert({
      where: { id: id || finalSlug },
      update: {},
      create: { id: id || finalSlug, slug: finalSlug, title, data: item },
    });
  }
  console.log(`Imported ${items.length} services into Postgres.`);
}

async function seedTestimonials(prisma: any, dataDir: string) {
  const count = await prisma.testimonial.count();
  if (count > 0) return;
  const items = readJsonIfExists(dataDir, "testimonials.json");
  if (!items) return;
  let order = 0;
  for (const item of items) {
    const { id, name, isFeatured } = item;
    const finalId = id || slugify(name) || `testimonial-${order}`;
    await prisma.testimonial.upsert({
      where: { id: finalId },
      update: {},
      create: { id: finalId, name, featured: Boolean(isFeatured), order: order++, data: item },
    });
  }
  console.log(`Imported ${items.length} testimonials into Postgres.`);
}

async function seedFaqs(prisma: any, dataDir: string) {
  const count = await prisma.fAQ.count();
  if (count > 0) return;
  const items = readJsonIfExists(dataDir, "faqs.json");
  if (!items) return;
  let order = 0;
  for (const item of items) {
    const { id, category } = item;
    const finalId = id || crypto.randomUUID();
    await prisma.fAQ.upsert({
      where: { id: finalId },
      update: {},
      create: { id: finalId, category: category || "General", order: order++, data: item },
    });
  }
  console.log(`Imported ${items.length} FAQs into Postgres.`);
}

async function seedTeam(prisma: any, dataDir: string) {
  const count = await prisma.teamMember.count();
  if (count > 0) return;
  const items = readJsonIfExists(dataDir, "team.json");
  if (!items) return;
  let order = 0;
  for (const item of items) {
    const { id, name } = item;
    const finalId = id || slugify(name) || `team-${order}`;
    await prisma.teamMember.upsert({
      where: { id: finalId },
      update: {},
      create: { id: finalId, name, order: order++, data: item },
    });
  }
  console.log(`Imported ${items.length} team members into Postgres.`);
}

async function seedGallery(prisma: any, dataDir: string) {
  const count = await prisma.galleryImage.count();
  if (count > 0) return;
  const items = readJsonIfExists(dataDir, "gallery.json");
  if (!items) return;
  for (const item of items) {
    await prisma.galleryImage.create({ data: item });
  }
  console.log(`Imported ${items.length} gallery photos into Postgres.`);
}

async function seedPageContentDefaults(prisma: any) {
  const defaults: Record<string, any> = {
    "page-about-hero": {
      badge: "About Summit Abroad",
      title: "Nepal's Most Trusted Education Partner",
      subtitle:
        "Founded in 2010, we have helped 2,500+ Nepali students reach world-class universities across 15+ countries.",
    },
    "page-test-prep-hero": {
      badge: "Test Preparation",
      title: "Score Higher. Get There Faster.",
      subtitle:
        "Expert-led IELTS, PTE, SAT, GRE & GMAT coaching with proven strategies and guaranteed results.",
    },
    "legal-privacy-policy": {
      title: "Privacy Policy",
      content:
        "This is a placeholder Privacy Policy. Replace this text from the admin dashboard (Page Content \u2192 Privacy Policy) with your actual policy \u2014 what information you collect, how it's used, and how students can request their data be removed. Consider having this reviewed by a lawyer before publishing.",
      updatedAt: new Date().toISOString(),
    },
    "legal-terms-of-service": {
      title: "Terms of Service",
      content:
        "This is a placeholder Terms of Service. Replace this text from the admin dashboard (Page Content \u2192 Terms of Service) with your actual terms \u2014 service fees, refund conditions, liability limitations, and dispute resolution. Consider having this reviewed by a lawyer before publishing.",
      updatedAt: new Date().toISOString(),
    },
  };

  for (const [key, data] of Object.entries(defaults)) {
    const existing = await prisma.siteContent.findUnique({ where: { key } });
    if (existing) continue;
    await prisma.siteContent.create({ data: { key, data } });
    console.log(`Seeded default content for "${key}".`);
  }
}

async function seedPopupDefault(prisma: any) {
  const existing = await prisma.siteContent.findUnique({ where: { key: "popup" } });
  if (existing) return;
  await prisma.siteContent.create({
    data: {
      key: "popup",
      data: {
        enabled: false,
        title: "",
        message: "",
        imageUrl: "",
        ctaText: "",
        ctaLink: "",
        delaySeconds: 3,
        frequency: "session",
      },
    },
  });
  console.log('Seeded default (disabled) popup config.');
}

async function main() {
  const { PrismaClient, PrismaPg } = await loadPrisma();
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });
  const dataDir = path.join(process.cwd(), "prisma", "seed-data");

  try {
    await seedAdmin(prisma);
    await seedSingleton(prisma, dataDir, "company", "company.json");
    await seedSingleton(prisma, dataDir, "site-config", "site-config.json");
    await seedDestinations(prisma, dataDir);
    await seedServices(prisma, dataDir);
    await seedTestimonials(prisma, dataDir);
    await seedFaqs(prisma, dataDir);
    await seedTeam(prisma, dataDir);
    await seedGallery(prisma, dataDir);
    await seedPageContentDefaults(prisma);
    await seedPopupDefault(prisma);
    console.log("\nSeed complete. All content is now served from Postgres.\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
