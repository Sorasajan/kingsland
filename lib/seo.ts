import { cache } from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export interface SeoSettings {
  siteName: string;
  titleTemplate: string;
  defaultTitle: string;
  defaultDescription: string;
  keywords: string;
  ogImage: string;
  twitterHandle: string;
  googleSiteVerification: string;
  bingSiteVerification: string;
  googleAnalyticsId: string;
  googleTagManagerId: string;
  robotsIndexing: boolean;
  canonicalBaseUrl: string;
}

const DEFAULT_SEO: SeoSettings = {
  siteName: "Summit Abroad",
  titleTemplate: "%s | %SITE%",
  defaultTitle: "Summit Abroad — Your Gateway to Global Education",
  defaultDescription:
    "Nepal's premier education consultancy guiding ambitious students to world-class universities in Australia, UK, Canada, USA & Europe since 2010.",
  keywords: "education consultancy Nepal, study abroad Nepal, study in Australia, study in UK, IELTS coaching Nepal, visa assistance Nepal",
  ogImage: "",
  twitterHandle: "",
  googleSiteVerification: "",
  bingSiteVerification: "",
  googleAnalyticsId: "",
  googleTagManagerId: "",
  robotsIndexing: true,
  canonicalBaseUrl: "",
};

export const getSeoSettings = cache(async (): Promise<SeoSettings> => {
  const row = await prisma.siteContent.findUnique({ where: { key: "seo-settings" } });
  return { ...DEFAULT_SEO, ...((row?.data as Partial<SeoSettings>) ?? {}) };
});

/**
 * Builds a page's <title>/description/OG/Twitter metadata on top of the
 * site-wide SEO defaults. Every page should call this instead of writing
 * openGraph/twitter blocks by hand, so a change to the OG image or
 * Twitter handle in /admin/seo instantly applies everywhere.
 */
export function buildMetadata(
  seo: SeoSettings,
  page: {
    title: string;
    description?: string;
    path?: string; // e.g. "/destinations/australia" — used for canonical + OG url
    image?: string; // page-specific OG image, falls back to seo.ogImage
    type?: "website" | "article";
  }
): Metadata {
  const description = page.description || seo.defaultDescription;
  const image = page.image || seo.ogImage;
  const url = seo.canonicalBaseUrl && page.path
    ? `${seo.canonicalBaseUrl.replace(/\/$/, "")}${page.path}`
    : undefined;

  return {
    title: page.title,
    description,
    keywords: seo.keywords ? seo.keywords.split(",").map((k) => k.trim()).filter(Boolean) : undefined,
    alternates: url ? { canonical: url } : undefined,
    robots: seo.robotsIndexing
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      title: page.title,
      description,
      siteName: seo.siteName,
      type: page.type || "website",
      url,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: page.title,
      description,
      images: image ? [image] : undefined,
      site: seo.twitterHandle || undefined,
    },
  };
}
