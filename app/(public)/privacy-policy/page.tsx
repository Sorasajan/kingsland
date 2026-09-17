import type { Metadata } from "next";
import { getPrivacyPolicy } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy | Summit Abroad",
};

export default async function PrivacyPolicyPage() {
  const page = await getPrivacyPolicy();

  return (
    <div className="min-h-screen bg-white">
      <section className="pt-36 pb-12 bg-slate-50 border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl font-bold text-slate-900 mb-2">
            {page?.title || "Privacy Policy"}
          </h1>
          {page?.updatedAt && (
            <p className="text-sm text-slate-400">
              Last updated {new Date(page.updatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          )}
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {page?.content ? (
          <div
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        ) : (
          <p className="text-slate-400">
            This page hasn&apos;t been set up yet. An admin can add the Privacy Policy from the dashboard under Page Content.
          </p>
        )}
      </div>
    </div>
  );
}
