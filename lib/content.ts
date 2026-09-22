import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type {
  Company,
  Destination,
  Service,
  Testimonial,
  SiteConfig,
  FAQ,
} from "@/types";
/**
 * All content the public site displays (company info, nav config,
 * destinations, services, testimonials, FAQs, team) now lives in
 * Postgres and is managed from /admin. These helpers are wrapped in
 * React's `cache()` so multiple components rendering in the same request
 * share one DB round trip instead of each re-querying.
 */

function flatten<T extends { id: string; slug?: string; data: any }>(row: T) {
  return {
    id: row.id,
    ...(row.slug ? { slug: row.slug } : {}),
    ...(row.data as object),
  };
}

export const getCompany = cache(async (): Promise<Company> => {
  const row = await prisma.siteContent.findUnique({
    where: { key: "company" },
  });
  return row?.data as unknown as Company;
});

export const getSiteConfig = cache(async (): Promise<SiteConfig> => {
  const row = await prisma.siteContent.findUnique({
    where: { key: "site-config" },
  });
  return row?.data as unknown as SiteConfig;
});

export const getDestinations = cache(async (): Promise<Destination[]> => {
  const rows = await prisma.destination.findMany({
    orderBy: { createdAt: "asc" },
  });
  return rows.map(flatten) as unknown as Destination[];
});

export const getDestinationBySlug = cache(
  async (slug: string): Promise<Destination | undefined> => {
    const row = await prisma.destination.findUnique({ where: { slug } });
    return row ? (flatten(row) as unknown as Destination) : undefined;
  },
);

export const getServices = cache(async (): Promise<Service[]> => {
  const rows = await prisma.service.findMany({ orderBy: { createdAt: "asc" } });
  return rows.map(flatten) as unknown as Service[];
});

export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  const rows = await prisma.testimonial.findMany({
    where: { approved: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return rows.map((row: any) => {
    const flat = flatten(row);
    // contactEmail/submittedAt/source are for admin review only — never
    // expose them to the public site even though they live in the same
    // JSON blob as everything else.
    const { contactEmail, submittedAt, source, ...pub } = flat as any;
    return pub;
  }) as unknown as Testimonial[];
});

export const getFaqs = cache(async (): Promise<FAQ[]> => {
  const rows = await prisma.fAQ.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });

  return rows.map(
    (r: { id: string; category: string; data: any }): FAQ => ({
      id: r.id,
      category: r.category,
      question: r.data.question,
      answer: r.data.answer,
      tags: r.data.tags ?? [],
      order: r.data.order ?? 0,
    }),
  );
});

export const getTeam = cache(async () => {
  const rows = await prisma.teamMember.findMany({ orderBy: { order: "asc" } });
  return rows.map((r: { id: string; name: string; data: any }) => ({
    id: r.id,
    name: r.name,
    ...(r.data as object),
  }));
});

export const getGalleryImages = cache(async () => {
  return prisma.galleryImage.findMany({ orderBy: { order: "asc" } });
});

export interface PageHero {
  badge: string;
  title: string;
  subtitle: string;
}

export interface LegalPage {
  title: string;
  content: string;
  updatedAt?: string;
}

const DEFAULT_ABOUT_HERO: PageHero = {
  badge: "About Summit Abroad",
  title: "Nepal's Most Trusted Education Partner",
  subtitle:
    "Founded in 2019, we have helped 2,500+ Nepali students reach world-class universities across 5 countries.",
};

const DEFAULT_TEST_PREP_HERO: PageHero = {
  badge: "Test Preparation",
  title: "Score Higher. Get There Faster.",
  subtitle:
    "Expert-led IELTS, PTE, SAT, GRE & GMAT coaching with proven strategies and guaranteed results.",
};

export const getAboutHero = cache(async (): Promise<PageHero> => {
  const row = await prisma.siteContent.findUnique({
    where: { key: "page-about-hero" },
  });
  return (row?.data as unknown as PageHero) ?? DEFAULT_ABOUT_HERO;
});

export const getTestPrepHero = cache(async (): Promise<PageHero> => {
  const row = await prisma.siteContent.findUnique({
    where: { key: "page-test-prep-hero" },
  });
  return (row?.data as unknown as PageHero) ?? DEFAULT_TEST_PREP_HERO;
});

export const getPrivacyPolicy = cache(async (): Promise<LegalPage | null> => {
  const row = await prisma.siteContent.findUnique({
    where: { key: "legal-privacy-policy" },
  });
  return (row?.data as unknown as LegalPage) ?? null;
});

export const getTermsOfService = cache(async (): Promise<LegalPage | null> => {
  const row = await prisma.siteContent.findUnique({
    where: { key: "legal-terms-of-service" },
  });
  return (row?.data as unknown as LegalPage) ?? null;
});

export interface PopupConfig {
  enabled: boolean;
  title: string;
  message: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  delaySeconds: number;
  frequency: "always" | "session" | "daily";
}

export const getPopupConfig = cache(async (): Promise<PopupConfig | null> => {
  const row = await prisma.siteContent.findUnique({ where: { key: "popup" } });
  return (row?.data as unknown as PopupConfig) ?? null;
});

export interface SeoSettings {
  siteUrl: string;
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  ogImage: string;
  twitterHandle: string;
  googleAnalyticsId: string;
  googleSiteVerification: string;
  bingSiteVerification: string;
}

export const getSeoSettings = cache(async (): Promise<SeoSettings | null> => {
  const row = await prisma.siteContent.findUnique({
    where: { key: "seo-settings" },
  });
  return (row?.data as unknown as SeoSettings) ?? null;
});
