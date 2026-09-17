"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import defaultLogo from "@/public/resources/logo/logo.png";
import {
  Menu,
  X,
  Phone,
  ChevronDown,
  MessagesSquare,
  FileText,
  BookOpen,
  Image as ImageIcon,
  ShieldCheck,
  Award,
  Plane,
  GraduationCap,
  Globe,
  ArrowRight,
  Star,
  Users,
  Building2,
  MapPin,
  Mail,
  Clock,
  CheckCircle,
  Trophy,
  Mic,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Company, SiteConfig, Destination, Service } from "@/types";

interface NavbarProps {
  company: Company;
  siteConfig: SiteConfig;
  destinations: Destination[];
  services: Service[];
}

// ── Icon maps ─────────────────────────────────────────────────────────────────
const serviceIconMap: Record<string, React.ReactNode> = {
  MessagesSquare: <MessagesSquare className="w-5 h-5" />,
  FileText: <FileText className="w-5 h-5" />,
  BookOpen: <BookOpen className="w-5 h-5" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5" />,
  Award: <Award className="w-5 h-5" />,
  Plane: <Plane className="w-5 h-5" />,
};

// Test colour/emoji config (UI-only, not in JSON)
const testMeta: Record<
  string,
  {
    emoji: string;
    color: string;
    bg: string;
    description: string;
    countries: string[];
  }
> = {
  "IELTS Academic": {
    emoji: "📘",
    color: "text-blue-600",
    bg: "bg-blue-50 group-hover:bg-blue-600 group-hover:text-white",
    description:
      "For university admission. Accepted in Australia, UK, Canada, NZ & 140+ countries.",
    countries: ["🇦🇺", "🇬🇧", "🇨🇦", "🇳🇿"],
  },
  "IELTS General Training": {
    emoji: "📗",
    color: "text-green-600",
    bg: "bg-green-50 group-hover:bg-green-600 group-hover:text-white",
    description:
      "For skilled migration, work visas, and secondary education programmes.",
    countries: ["🇦🇺", "🇨🇦", "🇳🇿"],
  },
  "PTE Academic": {
    emoji: "💻",
    color: "text-purple-600",
    bg: "bg-purple-50 group-hover:bg-purple-600 group-hover:text-white",
    description:
      "AI-scored computer test. Results in 5 days. Preferred for Australian student visas.",
    countries: ["🇦🇺", "🇳🇿", "🇬🇧"],
  },
  SAT: {
    emoji: "🎓",
    color: "text-amber-600",
    bg: "bg-amber-50 group-hover:bg-amber-600 group-hover:text-white",
    description:
      "For US undergraduate admissions. Also accepted by some UK & Canadian universities.",
    countries: ["🇺🇸", "🇨🇦"],
  },
  GRE: {
    emoji: "🔬",
    color: "text-rose-600",
    bg: "bg-rose-50 group-hover:bg-rose-600 group-hover:text-white",
    description:
      "Required for most US & Canadian graduate programmes including MS and MBA.",
    countries: ["🇺🇸", "🇨🇦", "🇬🇧"],
  },
  GMAT: {
    emoji: "📊",
    color: "text-indigo-600",
    bg: "bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white",
    description:
      "Essential for MBA admissions at top business schools worldwide.",
    countries: ["🇺🇸", "🇬🇧", "🇦🇺", "🇨🇦"],
  },
};

type MegaKey = "Destinations" | "Services" | "TestPrep" | "About";

// ─────────────────────────────────────────────────────────────────────────────
// MEGA PANELS
// ─────────────────────────────────────────────────────────────────────────────

// ── Destinations ─────────────────────────────────────────────────────────────
function DestinationsMega({
  close,
  destinations,
  company,
}: {
  close: () => void;
  destinations: Destination[];
  company: Company;
}) {
  const featured = destinations.filter((d) => d.featured);
  const rest = destinations.filter((d) => !d.featured);
  return (
    <div className="grid grid-cols-12 gap-0 min-h-[400px]">
      {/* Left */}
      <div className="col-span-3 bg-gradient-to-br from-primary-900 via-primary-800 to-slate-900 p-8 rounded-bl-2xl flex flex-col justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary-300 mb-2">
            Study Destinations
          </p>
          <h3 className="font-serif text-2xl font-bold text-white leading-tight mb-4">
            Find Your Perfect Study Country
          </h3>
          <p className="text-sm text-primary-200 leading-relaxed">
            We guide Nepali students to world-class universities across{" "}
            {company.stats.countriesCovered}+ countries with{" "}
            {company.stats.visaSuccessRate}% visa success.
          </p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-primary-300">
            <Building2 className="w-4 h-4 text-primary-400 flex-shrink-0" />
            {company.stats.partnerUniversities}+ partner universities
          </div>
          <div className="flex items-center gap-2 text-xs text-primary-300">
            <GraduationCap className="w-4 h-4 text-primary-400 flex-shrink-0" />
            {company.stats.studentsPlaced.toLocaleString()}+ students placed
          </div>
          <div className="flex items-center gap-2 text-xs text-primary-300">
            <Star className="w-4 h-4 text-amber-400 flex-shrink-0" />
            {company.stats.visaSuccessRate}% visa success rate
          </div>
          <Link
            href="/destinations"
            onClick={close}
            className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-white bg-white/15 hover:bg-white/25 px-4 py-2.5 rounded-xl transition-colors w-full justify-center"
          >
            All Destinations <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Centre — featured */}
      <div className="col-span-6 p-8">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">
          Most Popular
        </p>
        <div className="grid grid-cols-2 gap-3">
          {featured.map((dest) => (
            <Link
              key={dest.id}
              href={`/destinations/${dest.slug}`}
              onClick={close}
              className="group flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all"
            >
              <div className="relative w-12 h-8 flex-shrink-0 rounded-lg overflow-hidden shadow-sm">
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="48px"
                />
                <div className="absolute inset-0 bg-black/20" />
                <span className="absolute bottom-0.5 right-0.5 text-xs leading-none">
                  {dest.flag}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-slate-900 group-hover:text-primary-600 transition-colors leading-tight">
                  {dest.name}
                </p>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {dest.tagline}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-300 -rotate-90 group-hover:text-primary-500 transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* Right — more */}
      <div className="col-span-3 bg-slate-50 p-8 rounded-br-2xl flex flex-col justify-between border-l border-slate-100">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">
            More Destinations
          </p>
          <div className="space-y-1.5">
            {rest.map((dest) => (
              <Link
                key={dest.id}
                href={`/destinations/${dest.slug}`}
                onClick={close}
                className="group flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white hover:shadow-sm transition-all"
              >
                <span className="text-base leading-none">{dest.flag}</span>
                <span className="text-sm text-slate-700 group-hover:text-primary-600 transition-colors font-medium">
                  {dest.name}
                </span>
                <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-primary-500 ml-auto transition-colors" />
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-6 pt-5 border-t border-slate-200">
          <p className="text-xs text-slate-500 mb-3">Not sure where to go?</p>
          <Link
            href="/contact"
            onClick={close}
            className="w-full block btn-accent text-white text-center py-2.5 rounded-xl text-sm font-semibold"
          >
            Get Free Guidance
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Services ──────────────────────────────────────────────────────────────────
function ServicesMega({
  close,
  services,
  company,
}: {
  close: () => void;
  services: Service[];
  company: Company;
}) {
  const serviceColors: Record<string, string> = {
    counseling:
      "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
    application:
      "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
    "test-prep":
      "bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white",
    visa: "bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white",
    scholarship:
      "bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
    departure:
      "bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white",
  };
  return (
    <div className="grid grid-cols-12 gap-0 min-h-[380px]">
      <div className="col-span-3 bg-gradient-to-br from-slate-900 via-slate-800 to-primary-900 p-8 rounded-bl-2xl flex flex-col justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
            Our Services
          </p>
          <h3 className="font-serif text-2xl font-bold text-white leading-tight mb-4">
            End-to-End Support for Every Step
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            From free counseling to visa approval — everything you need in one
            place.
          </p>
        </div>
        <div className="space-y-2">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-500" />
            Dedicated counselor per student
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            {company.stats.visaSuccessRate}% visa success
          </div>
          <Link
            href="/services"
            onClick={close}
            className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-white bg-white/15 hover:bg-white/25 px-4 py-2.5 rounded-xl transition-colors w-full justify-center"
          >
            All Services <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
      <div className="col-span-9 p-8">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">
          What We Offer
        </p>
        <div className="grid grid-cols-3 gap-4">
          {services.map((svc) => (
            <Link
              key={svc.id}
              href="/services"
              onClick={close}
              className="group p-4 rounded-xl border border-slate-100 hover:border-primary-200 hover:shadow-md transition-all bg-white"
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all duration-200",
                  serviceColors[svc.id] ??
                    "bg-slate-50 text-slate-600 group-hover:bg-slate-600 group-hover:text-white",
                )}
              >
                {serviceIconMap[svc.icon] ?? <BookOpen className="w-5 h-5" />}
              </div>
              <h4 className="font-semibold text-sm text-slate-900 group-hover:text-primary-700 transition-colors leading-tight mb-1">
                {svc.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                {svc.shortDescription}
              </p>
              {svc.isFree && (
                <span className="mt-2 inline-block text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  Free
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Test Prep ─────────────────────────────────────────────────────────────────
function TestPrepMega({ close, services }: { close: () => void; services: Service[] }) {
  const testPrepSvc = services.find((s) => s.id === "test-prep") as any;
  const testPrepTests = (testPrepSvc?.tests ?? []) as Array<{
    name: string;
    duration: string;
    classSize: number;
    mockTests: number | string;
    guarantee: string | null;
    schedule: string;
  }>;
  const [hoveredTest, setHoveredTest] = useState<string | null>(null);
  const activeTest = hoveredTest ?? testPrepTests[0]?.name ?? "";
  const activeMeta = testMeta[activeTest];
  const activeData = testPrepTests.find((t) => t.name === activeTest);

  return (
    <div className="grid grid-cols-12 gap-0 min-h-[420px]">
      {/* Left — dark intro */}
      <div className="col-span-3 bg-gradient-to-br from-slate-900 via-amber-950/60 to-slate-900 p-8 rounded-bl-2xl flex flex-col justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
            Test Preparation
          </p>
          <h3 className="font-serif text-2xl font-bold text-white leading-tight mb-4">
            Score Higher. Get There Faster.
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            {testPrepSvc?.shortDescription}
          </p>
          <div className="mt-5 space-y-2.5">
            {testPrepSvc?.deliverables
              ?.slice(0, 4)
              .map((d: string, i: number) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-xs text-slate-300"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                  {d}
                </div>
              ))}
          </div>
        </div>
        <div className="space-y-2 mt-4">
          <div className="flex items-center gap-2 text-xs text-amber-300">
            <Trophy className="w-3.5 h-3.5 flex-shrink-0" />
            Band score guarantee
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Users className="w-3.5 h-3.5 flex-shrink-0" />
            Max 15 students per batch
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Mic className="w-3.5 h-3.5 flex-shrink-0" />
            Dedicated speaking lab
          </div>
          <Link
            href="/test-prep"
            onClick={close}
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-white bg-white/15 hover:bg-white/25 px-4 py-2.5 rounded-xl transition-colors w-full justify-center"
          >
            All Programmes <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Centre — test list */}
      <div className="col-span-5 p-8 border-r border-slate-100">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">
          Choose Your Test
        </p>
        <div className="space-y-2">
          {testPrepTests.map((test) => {
            const meta = testMeta[test.name];
            const isHovered = hoveredTest === test.name;
            return (
              <button
                key={test.name}
                onMouseEnter={() => setHoveredTest(test.name)}
                className={cn(
                  "w-full group flex items-center gap-4 p-3.5 rounded-xl border transition-all duration-200 text-left",
                  isHovered
                    ? "bg-primary-50 border-primary-200 shadow-sm"
                    : "bg-white border-slate-100 hover:border-slate-200",
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-all duration-200",
                    meta?.bg ?? "bg-slate-50",
                  )}
                >
                  {meta?.emoji ?? "📝"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p
                      className={cn(
                        "font-semibold text-sm transition-colors",
                        isHovered ? "text-primary-700" : "text-slate-900",
                      )}
                    >
                      {test.name}
                    </p>
                    {test.guarantee && (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full flex-shrink-0">
                        Guarantee
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {test.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      Max {test.classSize}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      {test.mockTests} mocks
                    </span>
                  </div>
                </div>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 -rotate-90 flex-shrink-0 transition-colors",
                    isHovered ? "text-primary-500" : "text-slate-300",
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Right — test detail */}
      <div className="col-span-4 bg-slate-50 p-8 rounded-br-2xl flex flex-col">
        {activeMeta && activeData ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center text-2xl",
                  activeMeta.bg.split(" ")[0],
                )}
              >
                {activeMeta.emoji}
              </div>
              <div>
                <h4 className={cn("font-bold text-base", activeMeta.color)}>
                  {activeData.name}
                </h4>
                <p className="text-xs text-slate-400">{activeData.schedule}</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-5">
              {activeMeta.description}
            </p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label: "Duration", val: activeData.duration },
                { label: "Class Size", val: `Max ${activeData.classSize}` },
                { label: "Mock Tests", val: `${activeData.mockTests}` },
                { label: "Schedule", val: activeData.schedule.split(" ")[0] },
              ].map(({ label, val }) => (
                <div
                  key={label}
                  className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm"
                >
                  <p className="text-xs text-slate-400 font-medium mb-0.5">
                    {label}
                  </p>
                  <p className="text-sm font-bold text-slate-800">{val}</p>
                </div>
              ))}
            </div>

            {/* Accepted by */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Accepted For
              </p>
              <div className="flex gap-1.5">
                {activeMeta.countries.map((flag, i) => (
                  <span key={i} className="text-xl">
                    {flag}
                  </span>
                ))}
              </div>
            </div>

            {/* Guarantee badge */}
            {activeData.guarantee && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 flex items-start gap-2">
                <Trophy className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 font-medium">
                  {activeData.guarantee}
                </p>
              </div>
            )}

            <div className="mt-auto space-y-2">
              <Link
                href="/contact"
                onClick={close}
                className="w-full block btn-primary text-white text-center py-2.5 rounded-xl text-sm font-semibold"
              >
                Enroll — Free Demo Class
              </Link>
              <Link
                href="/test-prep"
                onClick={close}
                className="w-full block text-center py-2 rounded-xl text-sm font-medium text-slate-500 hover:text-primary-600 transition-colors"
              >
                View Full Schedule →
              </Link>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 text-sm">
            Hover a test to see details
          </div>
        )}
      </div>
    </div>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────
function AboutMega({ close, company }: { close: () => void; company: Company }) {
  const aboutLinks = [
    {
      href: "/about",
      icon: <Users className="w-5 h-5" />,
      label: "Our Story",
      desc: `Founded in ${company.founded} in Kathmandu`,
    },
    {
      href: "/about",
      icon: <Award className="w-5 h-5" />,
      label: "Team & Experts",
      desc: "Meet our certified counselors",
    },
    {
      href: "/success-stories",
      icon: <GraduationCap className="w-5 h-5" />,
      label: "Success Stories",
      desc: `${company.stats.studentsPlaced.toLocaleString()}+ students placed globally`,
    },
    {
      href: "/blog",
      icon: <BookOpen className="w-5 h-5" />,
      label: "Blog",
      desc: "Guides, deadlines & study-abroad tips",
    },
    {
      href: "/gallery",
      icon: <ImageIcon className="w-5 h-5" />,
      label: "Gallery",
      desc: "Photos from our counseling sessions & events",
    },
    {
      href: "/contact",
      icon: <MapPin className="w-5 h-5" />,
      label: "Find Us",
      desc: `${company.address.street}, ${company.address.district}`,
    },
    {
      href: "/contact",
      icon: <Mail className="w-5 h-5" />,
      label: "Contact Us",
      desc: company.contact.email.general,
    },
    {
      href: "/contact",
      icon: <Phone className="w-5 h-5" />,
      label: "Call Us",
      desc: company.contact.phone.primary,
    },
  ];
  return (
    <div className="grid grid-cols-12 gap-0 min-h-[320px]">
      <div className="col-span-3 bg-gradient-to-br from-primary-800 to-slate-900 p-8 rounded-bl-2xl flex flex-col justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary-300 mb-2">
            About Us
          </p>
          <h3 className="font-serif text-2xl font-bold text-white leading-tight mb-4">
            Nepal&apos;s Most Trusted Education Partner
          </h3>
          <p className="text-sm text-primary-200 leading-relaxed">
            {company.yearsOfExperience}+ years of experience,{" "}
            {company.stats.studentsPlaced.toLocaleString()}+ students placed,{" "}
            {company.stats.visaSuccessRate}% visa success.
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-4">
          {company.certifications.slice(0, 3).map((cert) => (
            <span
              key={cert.id}
              className="text-xs bg-white/10 text-white/80 px-2.5 py-1 rounded-lg"
            >
              {cert.name}
            </span>
          ))}
        </div>
      </div>
      <div className="col-span-6 p-8">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">
          Quick Links
        </p>
        <div className="grid grid-cols-2 gap-3">
          {aboutLinks.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              onClick={close}
              className="group flex items-start gap-3 p-3.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all"
            >
              <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                {item.icon}
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-900 group-hover:text-primary-600 transition-colors">
                  {item.label}
                </p>
                <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                  {item.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="col-span-3 bg-slate-50 p-8 rounded-br-2xl border-l border-slate-100 flex flex-col justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
            Awards
          </p>
          <div className="space-y-3">
            {company.awards.map((award) => (
              <div
                key={award.id}
                className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm"
              >
                <p className="text-xs font-bold text-amber-600">
                  🏆 {award.year}
                </p>
                <p className="text-xs font-semibold text-slate-800 mt-0.5 leading-tight">
                  {award.title}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{award.issuer}</p>
              </div>
            ))}
          </div>
        </div>
        <Link
          href="/contact"
          onClick={close}
          className="mt-4 w-full block btn-primary text-white text-center py-2.5 rounded-xl text-sm font-semibold"
        >
          Book Free Session
        </Link>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN NAVBAR
// ─────────────────────────────────────────────────────────────────────────────
export default function Navbar({ company, siteConfig, destinations, services }: NavbarProps) {
  const logoSrc = (company as any).logo?.imageUrl || defaultLogo;
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<MegaKey | null>(null);
  const [mobileExpanded, setMobileExp] = useState<string | null>(null);
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setActiveMega(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node))
        setActiveMega(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const openMega = useCallback((key: MegaKey) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setActiveMega(key);
  }, []);
  const closeMega = useCallback(() => {
    timerRef.current = setTimeout(() => setActiveMega(null), 120);
  }, []);
  const keepOpen = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href) && href !== "/";

  const testPrepSvcForMobile = services.find((s) => s.id === "test-prep") as any;
  const testPrepTests = (testPrepSvcForMobile?.tests ?? []) as Array<{
    name: string;
    duration: string;
    classSize: number;
    mockTests: number | string;
    guarantee: string | null;
    schedule: string;
  }>;

  const navItems: Array<{
    label: string;
    href: string;
    mega?: MegaKey;
    exact?: boolean;
  }> = [
    { label: "Home", href: "/", exact: true },
    { label: "Destinations", href: "/destinations", mega: "Destinations" },
    { label: "Services", href: "/services", mega: "Services" },
    { label: "Test Prep", href: "/test-prep", mega: "TestPrep" },
    { label: "About", href: "/about", mega: "About" },
  ];

  return (
    <nav
      ref={navRef}
      className={cn(
        "fixed w-full z-50 top-0 transition-all duration-500",
        scrolled && "shadow-xl shadow-slate-900/10",
      )}
    >
      {/* ── Top Bar ── */}
      <div className="hidden lg:block bg-primary-900 py-1.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6 text-primary-200">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3" />
              {company.address.street}, {company.address.district}, Nepal
            </span>
            <span>⏰ Sun–Fri: {company.officeHours.sunday}</span>
          </div>
          <div className="flex items-center gap-5 text-primary-200">
            <a
              href={`tel:${company.contact.phone.primary}`}
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Phone className="w-3 h-3" />
              {company.contact.phone.primary}
            </a>
            <span className="w-px h-3 bg-primary-700" />
            <a
              href={`mailto:${company.contact.email.general}`}
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-3 h-3" />
              {company.contact.email.general}
            </a>
          </div>
        </div>
      </div>

      {/* ── Main Bar ── */}
      <div className="glass-nav border-b border-slate-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link
              href="/"
              className="relative w-20 aspect-square flex-shrink-0 flex items-center gap-3 group"
            >
              <Image
                src={logoSrc}
                alt="Kingsland  Abroad"
                fill
                className="object-fit"
              />
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const active = isActive(item.href, item.exact);
                const isMegaOpen = activeMega === item.mega;

                return item.mega ? (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => openMega(item.mega!)}
                    onMouseLeave={closeMega}
                  >
                    <button
                      className={cn(
                        "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                        active || isMegaOpen
                          ? "text-primary-600 bg-primary-50"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
                      )}
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          "w-3.5 h-3.5 transition-transform duration-300",
                          isMegaOpen
                            ? "rotate-180 text-primary-500"
                            : "text-slate-400",
                        )}
                      />
                    </button>
                    {active && (
                      <div className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      active
                        ? "text-primary-600 bg-primary-50"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
                    )}
                  >
                    {item.label}
                    {active && (
                      <div className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              <a
                href={`tel:${company.contact.phone.primary}`}
                className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden xl:inline">
                  {company.contact.phone.primary}
                </span>
              </a>
              <Link
                href={siteConfig.navigation.cta.href}
                className="hidden sm:inline-flex btn-primary text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg shadow-primary-500/25 hover:-translate-y-0.5 transition-transform"
              >
                {siteConfig.navigation.cta.label}
              </Link>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <X className="w-6 h-6 text-slate-700" />
                ) : (
                  <Menu className="w-6 h-6 text-slate-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mega Menu Panel ── */}
      <div
        onMouseEnter={keepOpen}
        onMouseLeave={closeMega}
        className={cn(
          "hidden lg:block absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-2xl shadow-slate-900/15 transition-all duration-300 max-h-[85vh] overflow-y-auto",
          activeMega
            ? "opacity-100 scale-y-100 pointer-events-auto"
            : "opacity-0 scale-y-95 pointer-events-none",
        )}
        style={{ transformOrigin: "top center" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            {activeMega === "Destinations" && (
              <DestinationsMega close={() => setActiveMega(null)} destinations={destinations} company={company} />
            )}
            {activeMega === "Services" && (
              <ServicesMega close={() => setActiveMega(null)} services={services} company={company} />
            )}
            {activeMega === "TestPrep" && (
              <TestPrepMega close={() => setActiveMega(null)} services={services} />
            )}
            {activeMega === "About" && (
              <AboutMega close={() => setActiveMega(null)} company={company} />
            )}
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-primary-200/50 to-transparent" />
      </div>

      {/* ── Backdrop overlay ── */}
      {activeMega && (
        <div
          className="hidden lg:block fixed inset-0 bg-slate-900/20 backdrop-blur-sm -z-10"
          style={{ top: "calc(var(--nav-h, 88px))" }}
          onClick={() => setActiveMega(null)}
        />
      )}

      {/* ── Mobile Menu ── */}
      <div
        className={cn(
          "lg:hidden bg-white border-b border-slate-100 shadow-xl overflow-hidden transition-all duration-300",
          mobileOpen
            ? "max-h-[90vh] opacity-100 overflow-y-auto"
            : "max-h-0 opacity-0",
        )}
      >
        <div className="px-4 pt-3 pb-6 divide-y divide-slate-100">
          {navItems.map((item) => (
            <div key={item.href}>
              {item.mega ? (
                <>
                  <button
                    onClick={() =>
                      setMobileExp(
                        mobileExpanded === item.label ? null : item.label,
                      )
                    }
                    className="w-full flex items-center justify-between py-3.5 text-sm font-semibold text-slate-700"
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 text-slate-400 transition-transform duration-300",
                        mobileExpanded === item.label &&
                          "rotate-180 text-primary-500",
                      )}
                    />
                  </button>
                  {mobileExpanded === item.label && (
                    <div className="pb-3 pl-3 space-y-1">
                      {item.mega === "Destinations" &&
                        destinations.map((d) => (
                          <Link
                            key={d.id}
                            href={`/destinations/${d.slug}`}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-2.5 py-2 px-3 rounded-lg text-sm text-slate-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                          >
                            <span>{d.flag}</span>
                            {d.name}
                          </Link>
                        ))}
                      {item.mega === "Services" &&
                        services.map((s) => (
                          <Link
                            key={s.id}
                            href="/services"
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-2.5 py-2 px-3 rounded-lg text-sm text-slate-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                          >
                            <span className="text-primary-500">
                              {serviceIconMap[s.icon]}
                            </span>
                            {s.title}
                          </Link>
                        ))}
                      {item.mega === "TestPrep" &&
                        testPrepTests.map((t) => (
                          <Link
                            key={t.name}
                            href="/test-prep"
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm text-slate-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                          >
                            <span className="flex items-center gap-2">
                              <span>{testMeta[t.name]?.emoji ?? "📝"}</span>
                              <span className="font-medium">{t.name}</span>
                            </span>
                            <span className="text-xs text-slate-400">
                              {t.duration}
                            </span>
                          </Link>
                        ))}
                      {item.mega === "About" && (
                        <>
                          <Link
                            href="/about"
                            onClick={() => setMobileOpen(false)}
                            className="block py-2 px-3 rounded-lg text-sm text-slate-600 hover:text-primary-600 hover:bg-primary-50"
                          >
                            Our Story
                          </Link>
                          <Link
                            href="/success-stories"
                            onClick={() => setMobileOpen(false)}
                            className="block py-2 px-3 rounded-lg text-sm text-slate-600 hover:text-primary-600 hover:bg-primary-50"
                          >
                            Success Stories
                          </Link>
                          <Link
                            href="/blog"
                            onClick={() => setMobileOpen(false)}
                            className="block py-2 px-3 rounded-lg text-sm text-slate-600 hover:text-primary-600 hover:bg-primary-50"
                          >
                            Blog
                          </Link>
                          <Link
                            href="/gallery"
                            onClick={() => setMobileOpen(false)}
                            className="block py-2 px-3 rounded-lg text-sm text-slate-600 hover:text-primary-600 hover:bg-primary-50"
                          >
                            Gallery
                          </Link>
                          <Link
                            href="/contact"
                            onClick={() => setMobileOpen(false)}
                            className="block py-2 px-3 rounded-lg text-sm text-slate-600 hover:text-primary-600 hover:bg-primary-50"
                          >
                            Contact Us
                          </Link>
                        </>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block py-3.5 text-sm font-semibold transition-colors",
                    isActive(item.href, item.exact)
                      ? "text-primary-600"
                      : "text-slate-700 hover:text-primary-600",
                  )}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}

          <div className="pt-4 space-y-3">
            <Link
              href={siteConfig.navigation.cta.href}
              onClick={() => setMobileOpen(false)}
              className="block btn-primary text-white text-center px-6 py-3 rounded-full text-sm font-semibold"
            >
              {siteConfig.navigation.cta.label}
            </Link>
            <div className="text-xs text-slate-400 space-y-1 pt-1">
              <p className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3" />
                {company.address.street}, {company.address.district}
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="w-3 h-3" />
                {company.contact.phone.primary}
              </p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
