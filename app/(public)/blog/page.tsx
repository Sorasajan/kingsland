import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Calendar, User, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Blog | Summit Abroad",
  description:
    "Guides, deadlines, and tips for studying abroad from Nepal — scholarships, visas, IELTS/PTE prep, and more.",
};

export const revalidate = 60;

export default async function BlogIndexPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      coverImage: true,
      author: true,
      tags: true,
      createdAt: true,
    },
  });

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Study Abroad Blog
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Guides, deadlines, and honest advice for Nepali students planning to study overseas.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        {posts.length === 0 ? (
          <p className="text-center text-slate-500">
            No posts published yet — check back soon.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: (typeof posts)[number]) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden bg-white"
              >
                <div className="relative h-48 bg-slate-100">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-100 to-accent-100" />
                  )}
                </div>
                <div className="p-6">
                  {post.tags?.length > 0 && (
                    <span className="inline-block text-xs font-semibold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-full mb-3">
                      {post.tags[0]}
                    </span>
                  )}
                  <h2 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" /> {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 mt-4 group-hover:gap-2 transition-all">
                    Read more <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
