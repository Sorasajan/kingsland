import TestPrepSection from "../_components/test-prep/TestPrepSection";
import CTASection from "../_components/cta/CTASection";
import FAQSection from "../_components/faq/FAQSection";
import type { Metadata } from "next";
import { getServices, getFaqs, getTestPrepHero } from "@/lib/content";

export const metadata: Metadata = {
  title: "Test Preparation | Summit Abroad",
  description:
    "Expert IELTS, PTE, SAT, GRE & GMAT coaching in Kathmandu. Band guarantee programs, small batches, and experienced instructors.",
};

export default async function TestPrepPage() {
  const [services, faqs, hero] = await Promise.all([getServices(), getFaqs(), getTestPrepHero()]);
  return (
    <>
      <section className="pt-36 pb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-primary-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pattern-dots-light" />
        <div className="absolute -top-24 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-amber-400 mb-4">
            <span className="w-8 h-0.5 bg-amber-400 rounded" /> {hero.badge}
          </span>
          <h1 className="font-serif text-5xl lg:text-6xl font-bold text-white mb-6 mt-3">
            {hero.title}
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            {hero.subtitle}
          </p>
        </div>
      </section>
      <TestPrepSection services={services} />
      <FAQSection faqs={faqs} />
      <CTASection />
    </>
  );
}
