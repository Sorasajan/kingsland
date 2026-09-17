"use client";

import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/_globalcomponents/shared/ScrollReveal";
import { BookOpen, Clock, Users, Star, CheckCircle, Trophy, Monitor, Mic } from "lucide-react";
import { useState } from "react";
import type { Service } from "@/types";

// UI-only mapping (images and colours can't live in JSON cleanly)
const testUIMeta: Record<string, {
  image: string; color: string; accent: string; popular: boolean; subtitle: string;
  tabLabel: string; stats: { duration: string; classSize: string; avgBand: string; mockTests: string };
  topics: string[];
}> = {
  "IELTS Academic": {
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop&q=80",
    color: "from-blue-600 to-blue-800", accent: "blue", popular: true,
    subtitle: "Academic & General",
    tabLabel: "IELTS",
    stats: { duration: "6 Weeks", classSize: "Max 15 students", avgBand: "7.0+ avg band", mockTests: "20+ mocks" },
    topics: ["Listening strategies", "Reading speed techniques", "Academic & GT Writing", "Speaking fluency"],
  },
  "PTE Academic": {
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=600&h=400&fit=crop&q=80",
    color: "from-purple-600 to-purple-800", accent: "purple", popular: false,
    subtitle: "Pearson Test",
    tabLabel: "PTE",
    stats: { duration: "4 Weeks", classSize: "Max 12 students", avgBand: "79+ avg score", mockTests: "Unlimited mocks" },
    topics: ["Read Aloud & Repeat Sentence", "Essay & Summarize", "Highlight Correct Summary", "Answer Short Questions"],
  },
  "SAT": {
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop&q=80",
    color: "from-amber-600 to-orange-700", accent: "amber", popular: false,
    subtitle: "SAT / GRE / GMAT",
    tabLabel: "SAT / GRE",
    stats: { duration: "8–12 Weeks", classSize: "Max 10 students", avgBand: "Top 85th percentile", mockTests: "15+ mocks" },
    topics: ["Math & Evidence-Based Reading", "Verbal Reasoning", "Analytical Writing", "Quantitative Reasoning"],
  },
};

const facilityFeatures = [
  { icon: <Monitor className="w-5 h-5" />, title: "Smart Classroom", desc: "LCD projectors, audio systems, digital whiteboards" },
  { icon: <Mic className="w-5 h-5" />,     title: "Speaking Lab",   desc: "Dedicated speaking practice with native audio" },
  { icon: <Trophy className="w-5 h-5" />,  title: "Band Guarantee", desc: "Free re-enrollment if you don't hit target score" },
  { icon: <Users className="w-5 h-5" />,   title: "Small Batches",  desc: "Max 15 students for personalized attention" },
];

export default function TestPrepSection({ services }: { services: Service[] }) {
  const testPrepService = services.find((s) => s.id === "test-prep");
  if (!testPrepService) return null;

  // Derive tab list from the tests array
  const rawTests = (testPrepService.tests ?? []) as NonNullable<Service["tests"]>;
  const tests = rawTests.reduce<Array<{ key: string; meta: typeof testUIMeta[string]; jsonTest: typeof rawTests[0] }>>((acc, t) => {
    const meta = testUIMeta[t.name];
    if (meta) acc.push({ key: t.name, meta, jsonTest: t });
    return acc;
  }, []);
  if (tests.length === 0) return null;

  const [activeKey, setActiveKey] = useState(tests[0]?.key ?? "IELTS Academic");
  const active = tests.find(t => t.key === activeKey) ?? tests[0];

  return (
    <section id="test-prep" className="py-24 bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 pattern-dots-light opacity-30" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-600/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="section-label text-amber-400 mb-3">
              <span className="w-8 h-0.5 bg-amber-400 rounded" /> Test Preparation <span className="w-8 h-0.5 bg-amber-400 rounded" />
            </span>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-white mt-3 mb-5">
              Score Higher. Get There Faster.
            </h2>
            <p className="text-lg text-slate-300">{testPrepService.shortDescription}</p>
          </div>
        </ScrollReveal>

        {/* Tab Selector */}
        <ScrollReveal delay={100}>
          <div className="flex justify-center mb-10">
            <div className="bg-slate-800/80 backdrop-blur-sm p-1.5 rounded-2xl flex gap-1 border border-slate-700">
              {tests.map(({ key, meta }) => (
                <button
                  key={key}
                  onClick={() => setActiveKey(key)}
                  className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative ${
                    activeKey === key ? "bg-white text-slate-900 shadow-lg" : "text-slate-300 hover:text-white"
                  }`}
                >
                  {meta.tabLabel}
                  {meta.popular && (
                    <span className="absolute -top-2 -right-1 text-[9px] bg-amber-400 text-amber-900 font-bold px-1.5 py-0.5 rounded-full">HOT</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Active Test Content */}
        {active && (
          <ScrollReveal delay={150}>
            <div className="grid lg:grid-cols-2 gap-8 mb-14">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image src={active.meta.image} alt={active.key} width={600} height={400} className="w-full h-72 object-cover" />
                <div className={`absolute inset-0 bg-gradient-to-t ${active.meta.color} opacity-70`} />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <h3 className="text-3xl font-bold text-white mb-1">{active.key}</h3>
                  <p className="text-white/70 text-sm">{active.meta.subtitle}</p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {Object.entries(active.meta.stats).map(([label, val]) => (
                      <div key={label} className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                        <div className="text-white/70 text-xs capitalize mb-1">{label.replace(/([A-Z])/g, ' $1')}</div>
                        <p className="text-white font-bold text-sm">{val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <p className="text-slate-300 leading-relaxed mb-7 text-base">{testPrepService.description}</p>
                <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">What You&apos;ll Master</h4>
                <div className="space-y-3 mb-8">
                  {active.meta.topics.map((topic, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary-600/30 border border-primary-500/40 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-3.5 h-3.5 text-primary-400" />
                      </div>
                      <span className="text-slate-200 text-sm">{topic}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/contact" className="btn-primary text-white px-6 py-3 rounded-full text-sm font-semibold text-center">
                    Enroll Now — Free Demo Class
                  </Link>
                  <Link href="/contact" className="px-6 py-3 rounded-full text-sm font-semibold text-white border border-slate-600 hover:bg-slate-800 transition-colors text-center">
                    Download Schedule
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Facility Features */}
        <ScrollReveal delay={200}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {facilityFeatures.map((feat, i) => (
              <div key={i} className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl p-5 hover:bg-slate-800 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-primary-600/20 text-primary-400 flex items-center justify-center mb-4">
                  {feat.icon}
                </div>
                <h5 className="font-bold text-white text-sm mb-1">{feat.title}</h5>
                <p className="text-slate-400 text-xs leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
