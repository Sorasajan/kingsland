"use client";

import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/_globalcomponents/shared/ScrollReveal";
import { Building2, Clock, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { Destination } from "@/types";

export default function DestinationsSection({ destinations }: { destinations: Destination[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  if (destinations.length === 0) return null;

  return (
    <section id="destinations" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary-50/40 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-50/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="section-label text-accent-600 mb-3">
              <span className="w-8 h-0.5 bg-accent-400 rounded" /> Study Destinations <span className="w-8 h-0.5 bg-accent-400 rounded" />
            </span>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-slate-900 mt-3 mb-6">
              Where Will Your Journey Take You?
            </h2>
            <p className="text-lg text-slate-500">
              From the sun-kissed campuses of Australia to tuition-free universities in Germany — we guide Nepali students to the perfect destination.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {destinations.map((dest, index) => (
            <ScrollReveal key={dest.id} delay={index * 80}>
              <Link
                href={`/destinations/${dest.slug}`}
                className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 block"
                onMouseEnter={() => setHoveredId(dest.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="h-72 relative overflow-hidden">
                  {dest.image ? (
                    <Image
                      src={dest.image}
                      alt={`Study in ${dest.name}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center">
                      <span className="text-5xl">{dest.flag}</span>
                    </div>
                  )}
                  <div className={`absolute inset-0 bg-gradient-to-t ${dest.color} opacity-60 group-hover:opacity-70 transition-opacity duration-500`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {dest.badge && (
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${dest.badgeColor}`}>
                        {dest.badge}
                      </span>
                    </div>
                  )}

                  <div className="absolute top-4 right-4">
                    <Image
                      src={`https://flagcdn.com/w40/${dest.flagCode}.png`}
                      alt={dest.name}
                      width={28}
                      height={20}
                      className="rounded shadow"
                    />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-xl font-bold text-white mb-1">{dest.name}</h3>
                    <p className={`text-white/80 text-xs leading-relaxed transition-all duration-300 ${hoveredId === dest.id ? "max-h-20 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
                      {dest.description}
                    </p>
                    <div className={`mt-3 transition-all duration-300 ${hoveredId !== dest.id ? "block" : "hidden"}`}>
                      <div className="flex items-center gap-3 text-xs text-white/70">
                        <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{dest.partnerUniversities}+ Partners</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{dest.postStudyWork.split("(")[0].trim()}</span>
                      </div>
                    </div>
                    <div className={`mt-3 transition-all duration-300 ${hoveredId === dest.id ? "flex" : "hidden"} flex-wrap gap-1.5`}>
                      <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full">{dest.studentsPlaced}+ placed</span>
                      <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full">{dest.highlights[0]}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Intakes: <strong className="text-slate-700">{dest.intakes.join(" & ")}</strong></span>
                    <span className="flex items-center gap-1 text-primary-600 font-semibold group-hover:gap-2 transition-all">
                      Explore <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={300}>
          <div className="mt-12 text-center">
            <p className="text-slate-500 text-sm mb-4">Not sure which destination is right for you?</p>
            <Link href="/contact" className="btn-primary text-white px-8 py-3 rounded-full font-semibold inline-flex items-center gap-2 shadow-lg shadow-primary-500/20">
              Get Free Destination Guidance <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
