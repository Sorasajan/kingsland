import ContactSection from "../_components/contact/ContactSection";
import type { Metadata } from "next";
import { getCompany } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact Us | Summit Abroad",
  description:
    "Get in touch with Summit Abroad for a free counseling session. Located in Dillibazar, Kathmandu. Call, WhatsApp, or walk in.",
};

export default async function ContactPage() {
  const company = await getCompany();
  return (
    <>
      <section className="pt-36 pb-16 bg-gradient-to-br from-primary-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pattern-dots-light" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary-300 mb-4">
            <span className="w-8 h-0.5 bg-primary-400 rounded" /> Contact Us
          </span>
          <h1 className="font-serif text-5xl lg:text-6xl font-bold text-white mb-6 mt-3">
            Start Your Journey Today
          </h1>
          <p className="text-xl text-primary-200 max-w-2xl mx-auto">
            Book a free 60-minute counseling session. No obligations — just honest, expert advice.
          </p>
        </div>
      </section>
      <ContactSection company={company} />
    </>
  );
}
