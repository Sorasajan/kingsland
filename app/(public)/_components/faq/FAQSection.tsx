"use client";

import Link from "next/link";
import ScrollReveal from "@/_globalcomponents/shared/ScrollReveal";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FAQ } from "@/types";

export default function FAQSection({ faqs }: { faqs: FAQ[] }) {
  const [open, setOpen] = useState<number | null>(null);
  if (faqs.length === 0) return null;

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-14">
            <span className="section-label text-accent-600 mb-3">
              <span className="w-8 h-0.5 bg-accent-400 rounded" /> FAQs <span className="w-8 h-0.5 bg-accent-400 rounded" />
            </span>
            <h2 className="font-serif text-4xl font-bold text-slate-900 mt-3 mb-4">
              Questions We Hear Every Day
            </h2>
            <p className="text-slate-500">
              Answers to the most common questions from Nepali students planning to study abroad.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <ScrollReveal key={faq.id} delay={i * 50}>
              <div className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                open === i ? "border-primary-200 shadow-md" : "border-slate-100 shadow-sm"
              }`}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left gap-4"
                >
                  <span className={`font-semibold text-sm lg:text-base transition-colors ${
                    open === i ? "text-primary-700" : "text-slate-900"
                  }`}>
                    {faq.question}
                  </span>
                  <ChevronDown className={`w-5 h-5 flex-shrink-0 text-slate-400 transition-transform duration-300 ${
                    open === i ? "rotate-180 text-primary-500" : ""
                  }`} />
                </button>
                {open === i && (
                  <div className="px-6 pb-6">
                    <p className="text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                      {faq.answer}
                    </p>
                    {faq.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {faq.tags.map((tag) => (
                          <span key={tag} className="text-xs bg-primary-50 text-primary-600 px-2.5 py-0.5 rounded-full font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={200}>
          <div className="mt-10 text-center">
            <p className="text-slate-500 text-sm mb-3">Still have questions?</p>
            <Link href="/contact" className="btn-primary text-white px-6 py-3 rounded-full text-sm font-semibold inline-flex items-center gap-2">
              Ask Our Counselors — It&apos;s Free
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
