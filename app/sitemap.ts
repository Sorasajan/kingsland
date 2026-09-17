import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getDestinations } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://kingslandabroad.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/services`, changeFrequency: "monthly", priority: 0.8 },
    {
      url: `${siteUrl}/destinations`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    { url: `${siteUrl}/test-prep`, changeFrequency: "monthly", priority: 0.8 },
    {
      url: `${siteUrl}/success-stories`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    { url: `${siteUrl}/gallery`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/contact`, changeFrequency: "yearly", priority: 0.6 },
    {
      url: `${siteUrl}/privacy-policy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms-of-service`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  try {
    const [destinations, posts] = await Promise.all([
      getDestinations(),
      prisma.blogPost.findMany({
        where: { published: true },
        select: {
          slug: true,
          updatedAt: true,
        },
      }),
    ]);

    return [
      ...staticRoutes,
      ...destinations.map((d) => ({
        url: `${siteUrl}/destinations/${d.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
      ...posts.map((p) => ({
        url: `${siteUrl}/blog/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ];
  } catch (error) {
    console.error("Sitemap database unavailable:", error);

    // Build still succeeds without database
    return staticRoutes;
  }
}
