"use client";

import Link from "next/link";
import ScrollReveal from "@/_globalcomponents/shared/ScrollReveal";
import {
  MessagesSquare, FileText, ShieldCheck, Plane,
  CheckCircle, BookOpen, Award, Users, Clock,
} from "lucide-react";
import type { Service } from "@/types";

function buildServices(servicesData: Service[]) {
  return servicesData.map((s) => ({
    ...s,
    iconEl: iconMap(s.icon),
  }));
}

function iconMap(name: string): React.ReactNode {
  const cls = "w-6 h-6";
  const icons: Record<string, React.ReactNode> = {
    MessagesSquare: <MessagesSquare className={cls} />,
    FileText:       <FileText className={cls} />,
    BookOpen:       <BookOpen className={cls} />,
    ShieldCheck:    <ShieldCheck className={cls} />,
    Award:          <Award className={cls} />,
    Plane:          <Plane className={cls} />,
  };
  return icons[name] ?? <CheckCircle className={cls} />;
}

const processSteps = [
  { step: "01", title: "Initial Assessment",    desc: "Free 60-min session to evaluate your profile, goals, and eligibility" },
  { step: "02", title: "Destination Planning",  desc: "Shortlist best-fit countries, universities, and intake dates" },
  { step: "03", title: "Test Preparation",      desc: "IELTS/PTE coaching to hit your target band score" },
  { step: "04", title: "Application Submission",desc: "SOP, LOR, documents compiled and submitted" },
  { step: "05", title: "Visa Processing",       desc: "Documentation review, GTE/SOP drafting, interview prep" },
  { step: "06", title: "Pre-Departure",         desc: "Orientation, accommodation help, and alumni introduction" },
];

export default function ServicesSection({ services: rawServices }: { services: Service[] }) {
  const services = buildServices(rawServices);
  if (services.length === 0) return null;
  return (
    <section id="services" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-primary-50/30" />
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="section-label text-accent-600 mb-3">
              <span className="w-8 h-0.5 bg-accent-400 rounded" /> Our Services <span className="w-8 h-0.5 bg-accent-400 rounded" />
            </span>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-slate-900 mt-3 mb-6">
              Everything You Need, Under One Roof
            </h2>
            <p className="text-lg text-slate-500">
              From test preparation to visa approval — we provide end-to-end support so you can focus on your dreams, not the paperwork.
            </p>
          </div>
        </ScrollReveal>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {services.map((service, index) => (
            <ScrollReveal key={service.id} delay={index * 80}>
              <Link href={`/services`} className={`group bg-white rounded-2xl p-7 border shadow-sm hover:shadow-xl transition-all duration-400 card-hover block ${
                service.accent ? "border-accent-200 ring-1 ring-accent-100" : "border-slate-100"
              }`}>
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    service.accent
                      ? "bg-accent-50 text-accent-600 group-hover:bg-accent-600 group-hover:text-white"
                      : "bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white"
                  }`}>
                    {service.iconEl}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${service.tagColor}`}>
                      {service.tag}
                    </span>
                    {service.isFree && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">Free</span>
                    )}
                  </div>
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">{service.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{service.shortDescription}</p>
                {service.duration && (
                  <p className="mt-3 text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {service.duration}
                  </p>
                )}
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {/* Process Timeline */}
        <ScrollReveal>
          <div className="bg-white rounded-3xl p-8 lg:p-12 border border-slate-100 shadow-sm">
            <div className="text-center mb-12">
              <h3 className="font-serif text-3xl font-bold text-slate-900 mb-3">Your Journey With Us</h3>
              <p className="text-slate-500">A clear, guided path from dream to departure</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {processSteps.map((step, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-primary-500/30">
                      {step.step}
                    </div>
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 mb-1 group-hover:text-primary-600 transition-colors">{step.title}</h5>
                    <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6 text-sm text-slate-500">
                <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary-500" /> Process takes 3–6 months</span>
                <span className="flex items-center gap-2"><Users className="w-4 h-4 text-primary-500" /> Dedicated counselor assigned</span>
              </div>
              <Link href="/contact" className="btn-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-md shadow-primary-500/20">
                Start Your Process
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
