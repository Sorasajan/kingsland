import SuccessStories from "../_components/success-stories/SuccessStories";
import ShareStoryForm from "../_components/success-stories/ShareStoryForm";
import CTASection from "../_components/cta/CTASection";
import type { Metadata } from "next";
import { getTestimonials, getSiteConfig } from "@/lib/content";

export const metadata: Metadata = {
  title: "Success Stories | Summit Abroad",
  description:
    "Read real success stories of Nepali students placed in top universities worldwide through Summit Abroad Education Consultancy.",
};

export default async function SuccessStoriesPage() {
  const [testimonials, siteConfig] = await Promise.all([getTestimonials(), getSiteConfig()]);
  return (
    <>
      <section className="pt-36 pb-16 bg-gradient-to-br from-primary-900 via-primary-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pattern-dots-light" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary-300 mb-4">
            <span className="w-8 h-0.5 bg-primary-400 rounded" /> Success Stories
          </span>
          <h1 className="font-serif text-5xl lg:text-6xl font-bold text-white mb-6 mt-3">
            From Nepal to the World&apos;s Best Universities
          </h1>
          <p className="text-xl text-primary-200 max-w-2xl mx-auto">
            Real stories of Nepali students who transformed their futures with our guidance.
          </p>
        </div>
      </section>
      <SuccessStories testimonials={testimonials} siteConfig={siteConfig} />
      <ShareStoryForm />
      <CTASection />
    </>
  );
}
