"use client";

import Image from "next/image";
import ScrollReveal from "@/_globalcomponents/shared/ScrollReveal";
import { Star, Quote } from "lucide-react";
import type { Testimonial, SiteConfig } from "@/types";

export default function SuccessStories({
  testimonials: allTestimonials,
  siteConfig,
}: {
  testimonials: Testimonial[];
  siteConfig: SiteConfig;
}) {
  const testimonials = allTestimonials.filter((t) => t.isFeatured);
  const universities = siteConfig.partnerUniversities;
  if (testimonials.length === 0) return null;
  return (
    <section id="success" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="section-label text-accent-600 mb-3">
              <span className="w-8 h-0.5 bg-accent-400 rounded" /> Success Stories <span className="w-8 h-0.5 bg-accent-400 rounded" />
            </span>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-slate-900 mt-3 mb-6">
              From Nepal to the World&apos;s Best Universities
            </h2>
            <p className="text-lg text-slate-500">
              Real stories of Nepali students who transformed their futures with our guidance. Their success is our greatest achievement.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {testimonials.map((t, index) => (
            <ScrollReveal key={t.id} delay={index * 80}>
              <div className="bg-slate-50 rounded-2xl p-7 border border-slate-100 card-hover hover:border-primary-100 hover:bg-white group h-full flex flex-col">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating ?? 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-primary-100 group-hover:text-primary-200 transition-colors" />
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed text-sm flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="pt-5 border-t border-slate-100">
                  <div className="flex items-center gap-4">
                    {t.avatar ? (
                      <Image
                        src={t.avatar}
                        alt={t.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-bold">{t.name.charAt(0)}</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                      <p className="text-xs text-slate-500 truncate">{t.program}</p>
                      <p className="text-xs text-primary-600 font-medium">{t.university}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {t.flagImage && (
                        <Image
                          src={t.flagImage}
                          alt={t.country || t.name}
                          width={32}
                          height={20}
                          className="w-8 h-5 rounded shadow-sm"
                        />
                      )}
                      {t.scholarship && (
                        <span className="text-xs text-green-600 font-semibold">{t.scholarship}</span>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {t.ieltsBand && (
                      <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                        IELTS {t.ieltsBand}
                      </span>
                    )}
                    {t.visaProcessingDays && (
                      <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                        Visa: {t.visaProcessingDays} days
                      </span>
                    )}
                    {t.intake && (
                      <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                        {t.intake}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* University Marquee */}
        <ScrollReveal delay={200}>
          <div className="overflow-hidden">
            <p className="text-center text-xs text-slate-400 uppercase tracking-widest mb-6 font-medium">
              {siteConfig.stats.find(s => s.id === "universities")?.value}+ Partner Universities Worldwide
            </p>
            <div className="flex gap-10 animate-marquee whitespace-nowrap">
              {[...universities, ...universities].map((uni, i) => (
                <span
                  key={i}
                  className="text-xl font-serif font-bold text-slate-200 hover:text-primary-500 transition-colors cursor-default inline-flex items-center gap-8"
                >
                  {uni}
                  <span className="text-slate-300 text-base">✦</span>
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
