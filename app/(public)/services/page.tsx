import ServicesSection from "../_components/services/ServicesSection";
import CTASection from "../_components/cta/CTASection";
import type { Metadata } from "next";
import { getServices } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Services | Summit Abroad",
  description:
    "End-to-end education consultancy services: free counseling, university application, IELTS/PTE coaching, visa assistance, and scholarship guidance.",
};

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <section className="pt-36 pb-16 bg-gradient-to-br from-slate-900 via-primary-900 to-primary-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pattern-dots-light" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent-700/10 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary-300 mb-4">
            <span className="w-8 h-0.5 bg-primary-400 rounded" /> Our Services
          </span>
          <h1 className="font-serif text-5xl lg:text-6xl font-bold text-white mb-6 mt-3">
            Everything You Need, Under One Roof
          </h1>
          <p className="text-xl text-primary-200 max-w-2xl mx-auto">
            From test preparation to visa approval — complete end-to-end support so you can focus on your dreams.
          </p>
        </div>
      </section>
      <ServicesSection services={services} />
      <CTASection />
    </>
  );
}
