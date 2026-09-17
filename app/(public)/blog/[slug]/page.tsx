import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSeoSettings } from "@/lib/content";

export const revalidate = 60;

async function getPost(slug: string) {
  return prisma.blogPost.findFirst({ where: { slug, published: true } });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post Not Found" };

  const seo = await getSeoSettings();
  const siteUrl = seo?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://kingslandabroad.com";
  const url = `${siteUrl}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.excerpt || undefined,
    keywords: post.tags?.length > 0 ? post.tags : undefined,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: "article",
      url,
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.author],
      ...(post.coverImage ? { images: [{ url: post.coverImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || undefined,
      ...(post.coverImage ? { images: [post.coverImage] } : {}),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const seo = await getSeoSettings();
  const siteUrl = seo?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://kingslandabroad.com";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || undefined,
    image: post.coverImage || undefined,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Person", name: post.author },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}/blog/${post.slug}` },
    ...(post.tags?.length > 0 ? { keywords: post.tags.join(", ") } : {}),
  };

  return (
    <article className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <div className="max-w-3xl mx-auto px-4 pt-12 pb-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="text-xs font-semibold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-sm text-slate-500 mb-8">
          <span className="flex items-center gap-1.5">
            <User className="w-4 h-4" /> {post.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {post.coverImage && (
        <div className="max-w-4xl mx-auto px-4 mb-10">
          <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden bg-slate-100">
            <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 pb-20">
        <div
          className="prose prose-slate max-w-none prose-headings:font-serif"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </article>
  );
}
