"use client";

import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/_globalcomponents/shared/ScrollReveal";
import { CalendarCheck, Phone, Star } from "lucide-react";

const avatars = [
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=40&h=40&fit=crop",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop",
];

export default function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-slate-900" />
      <div className="absolute inset-0 opacity-10 pattern-dots-light" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent-900/20 to-transparent" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent-700/10 rounded-full blur-3xl" />

      <ScrollReveal>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Social Proof Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white text-sm mb-8">
            <div className="flex -space-x-1.5">
              {avatars.map((src, i) => (
                <Image
                  key={i}
                  src={src}
                  alt=""
                  width={28}
                  height={28}
                  className="w-7 h-7 rounded-full border-2 border-white/40 object-cover"
                />
              ))}
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="text-white/80 text-xs">Trusted by 2,500+ students</span>
          </div>

          <h2 className="font-serif text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Your Dream University<br />
            <span className="text-gradient-gold">Awaits You.</span>
          </h2>
          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Book a free 60-minute counseling session. No obligations, no pressure — just expert guidance to map your path to global education.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/contact"
              className="btn-accent text-white px-10 py-4 rounded-full text-lg font-semibold shadow-2xl shadow-accent-900/40 inline-flex items-center justify-center gap-2"
            >
              <CalendarCheck className="w-5 h-5" />
              Book Free Session
            </Link>
            <a
              href="tel:+97714444444"
              className="px-10 py-4 rounded-full text-lg font-semibold text-white border-2 border-white/30 hover:bg-white/10 backdrop-blur-sm transition-all inline-flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Call: +977-1-4444444
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {[
              { val: "Free", desc: "Initial Counseling" },
              { val: "24hr", desc: "Response Time" },
              { val: "98%", desc: "Visa Success" },
              { val: "2,500+", desc: "Students Placed" },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-bold text-white">{item.val}</p>
                <p className="text-xs text-primary-200 mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
