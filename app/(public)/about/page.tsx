import AboutSection from "../_components/about/AboutSection";
import GallerySection from "../_components/gallery/GallerySection";
import CTASection from "../_components/cta/CTASection";
import type { Metadata } from "next";
import { getCompany, getTeam, getGalleryImages, getAboutHero } from "@/lib/content";

export const metadata: Metadata = {
  title: "About Us | Summit Abroad",
  description:
    "Learn about Summit Abroad — Nepal's most trusted education consultancy since 2010. Meet our certified team and discover our proven track record.",
};

export default async function AboutPage() {
  const [company, team, galleryImages, hero] = await Promise.all([
    getCompany(),
    getTeam(),
    getGalleryImages(),
    getAboutHero(),
  ]);
  return (
    <>
      <section className="pt-36 pb-16 bg-gradient-to-br from-primary-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pattern-dots-light" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary-300 mb-4">
            <span className="w-8 h-0.5 bg-primary-400 rounded" /> {hero.badge}
          </span>
          <h1 className="font-serif text-5xl lg:text-6xl font-bold text-white mb-6 mt-3">
            {hero.title}
          </h1>
          <p className="text-xl text-primary-200 max-w-2xl mx-auto">
            {hero.subtitle}
          </p>
        </div>
      </section>
      <AboutSection company={company} team={team} />
      <GallerySection images={galleryImages} />
      <CTASection />
    </>
  );
}
