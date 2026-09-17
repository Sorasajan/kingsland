import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  CheckCircle,
  Clock,
  Building2,
  GraduationCap,
  DollarSign,
  Users,
  BookOpen,
  Award,
  ChevronRight,
  ArrowLeft,
  MapPin,
  Briefcase,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";
import { getDestinations, getDestinationBySlug } from "@/lib/content";
import type { Destination } from "@/types";

// ── No static params at build time — DB isn't guaranteed reachable during
// build. Pages render on-demand per slug instead (see dynamicParams below).
export async function generateStaticParams() {
  return [];
}

export const dynamicParams = true;

// ── Per-page SEO metadata ─────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dest = await getDestinationBySlug(slug);
  if (!dest) return { title: "Destination Not Found" };
  return {
    title: `Study in ${dest.name} | Summit Abroad`,
    description: dest.description,
    keywords: [
      `study in ${dest.name} from Nepal`,
      `${dest.name} student visa Nepal`,
      `${dest.name} universities for Nepali students`,
      `IELTS requirement ${dest.name}`,
    ],
  };
}

// ── Colour helpers ────────────────────────────────────────────────────────────
const gradients: Record<
  string,
  { hero: string; accent: string; light: string }
> = {
  australia: {
    hero: "from-blue-700 via-cyan-600 to-blue-800",
    accent: "bg-blue-600",
    light: "bg-blue-50 text-blue-700",
  },
  uk: {
    hero: "from-blue-900 via-blue-700 to-indigo-800",
    accent: "bg-blue-800",
    light: "bg-blue-50 text-blue-800",
  },
  canada: {
    hero: "from-red-700 via-red-600 to-orange-700",
    accent: "bg-red-600",
    light: "bg-red-50 text-red-700",
  },
  usa: {
    hero: "from-slate-800 via-slate-700 to-blue-900",
    accent: "bg-slate-700",
    light: "bg-slate-100 text-slate-700",
  },
  europe: {
    hero: "from-emerald-800 via-teal-700 to-green-800",
    accent: "bg-emerald-700",
    light: "bg-emerald-50 text-emerald-700",
  },
  "new-zealand": {
    hero: "from-teal-700 via-cyan-600 to-teal-800",
    accent: "bg-teal-600",
    light: "bg-teal-50 text-teal-700",
  },
  japan: {
    hero: "from-pink-700 via-rose-600 to-pink-900",
    accent: "bg-pink-700",
    light: "bg-pink-50 text-pink-700",
  },
  ireland: {
    hero: "from-green-700 via-emerald-600 to-green-900",
    accent: "bg-green-700",
    light: "bg-green-50 text-green-700",
  },
};

// ── Page Component ────────────────────────────────────────────────────────────
export default async function CountryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dest = await getDestinationBySlug(slug);
  if (!dest) notFound();

  const colors = gradients[slug] ?? gradients["australia"];

  // Neighbour destinations for "Explore more" strip
  const allDestinations = await getDestinations();
  const others = allDestinations.filter((d) => d.slug !== slug).slice(0, 4);

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
        {dest.image ? (
          <Image
            src={dest.image}
            alt={`Study in ${dest.name}`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div
            className={`absolute inset-0 bg-gradient-to-br ${colors.hero} flex items-center justify-center`}
          >
            <span className="text-9xl opacity-30">{dest.flag}</span>
          </div>
        )}
        {/* Gradient overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t ${colors.hero} opacity-80`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Back link */}
        <Link
          href="/destinations"
          className="absolute top-28 left-6 lg:left-12 flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full transition-colors z-10"
        >
          <ArrowLeft className="w-4 h-4" /> All Destinations
        </Link>

        {/* Badge */}
        {dest.badge && (
          <div className="absolute top-28 right-6 lg:right-12 z-10">
            <span className="bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-full shadow">
              {dest.badge}
            </span>
          </div>
        )}

        {/* Hero text */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
          <div className="flex items-center gap-3 mb-4">
            <Image
              src={`https://flagcdn.com/w40/${dest.flagCode}.png`}
              alt={dest.name}
              width={40}
              height={28}
              className="rounded shadow-md"
            />
            <span className="text-white/70 text-sm font-medium uppercase tracking-widest">
              Study Destination
            </span>
          </div>
          <h1 className="font-serif text-5xl lg:text-7xl font-bold text-white mb-3 leading-tight">
            Study in {dest.name}
          </h1>
          <p className="text-xl text-white/80 max-w-2xl leading-relaxed mb-8">
            {dest.tagline}
          </p>

          {/* Quick stats strip */}
          <div className="flex flex-wrap gap-3">
            {[
              {
                icon: <Building2 className="w-4 h-4" />,
                text: `${dest.partnerUniversities}+ Partner Universities`,
              },
              {
                icon: <Users className="w-4 h-4" />,
                text: `${dest.studentsPlaced}+ Students Placed`,
              },
              {
                icon: <Briefcase className="w-4 h-4" />,
                text: dest.postStudyWork,
              },
              {
                icon: <Clock className="w-4 h-4" />,
                text: `Visa: ${dest.processingTime}`,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-xs font-medium px-3 py-2 rounded-full border border-white/20"
              >
                {item.icon} {item.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* ── Left: Detail columns ── */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            <div>
              <h2 className="font-serif text-3xl font-bold text-slate-900 mb-4">
                Why Study in {dest.name}?
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                {dest.longDescription}
              </p>
            </div>

            {/* Key Highlights */}
            <div>
              <h3 className="font-serif text-2xl font-bold text-slate-900 mb-5 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-primary-600" /> Key
                Highlights
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {dest.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm leading-relaxed">
                      {h}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tuition & Living Costs */}
            <div>
              <h3 className="font-serif text-2xl font-bold text-slate-900 mb-5 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-primary-600" /> Costs at a
                Glance
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-medium">
                    Undergraduate Tuition
                  </p>
                  <p className="font-bold text-slate-900 text-sm">
                    {dest.averageTuitionRange.undergraduate}
                  </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-medium">
                    Postgraduate Tuition
                  </p>
                  <p className="font-bold text-slate-900 text-sm">
                    {dest.averageTuitionRange.postgraduate}
                  </p>
                </div>
                <div className="bg-white border border-primary-100 rounded-2xl p-5 shadow-sm bg-primary-50">
                  <p className="text-xs text-primary-500 uppercase tracking-wider mb-1 font-medium">
                    Avg. Living Cost
                  </p>
                  <p className="font-bold text-primary-800 text-sm">
                    {dest.averageLivingCost}
                  </p>
                </div>
              </div>
            </div>

            {/* English Requirements */}
            <div>
              <h3 className="font-serif text-2xl font-bold text-slate-900 mb-5 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary-600" /> English
                Requirements
              </h3>
              <div className="flex flex-wrap gap-3">
                {Object.entries(dest.englishRequirements).map(([test, req]) => (
                  <div
                    key={test}
                    className="bg-white border border-slate-200 rounded-xl px-5 py-4 shadow-sm min-w-[160px]"
                  >
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                      {test.toUpperCase()}
                    </p>
                    <p className="font-bold text-slate-900 text-sm">{req}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Universities */}
            <div>
              <h3 className="font-serif text-2xl font-bold text-slate-900 mb-5 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-primary-600" /> Top
                Partner Universities
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {dest.topUniversities.map((uni, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:border-primary-200 hover:shadow-md transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center text-xs font-bold flex-shrink-0 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                      {i + 1}
                    </div>
                    <span className="text-slate-800 text-sm font-medium">
                      {uni}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Courses */}
            <div>
              <h3 className="font-serif text-2xl font-bold text-slate-900 mb-5 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary-600" /> Popular
                Courses
              </h3>
              <div className="flex flex-wrap gap-2">
                {dest.popularCourses.map((course, i) => (
                  <span
                    key={i}
                    className="bg-slate-100 hover:bg-primary-50 hover:text-primary-700 text-slate-700 text-sm font-medium px-4 py-2 rounded-full border border-slate-200 hover:border-primary-200 transition-colors cursor-default"
                  >
                    {course}
                  </span>
                ))}
              </div>
            </div>

            {/* Scholarships */}
            <div>
              <h3 className="font-serif text-2xl font-bold text-slate-900 mb-5 flex items-center gap-2">
                <Award className="w-6 h-6 text-amber-500" /> Available
                Scholarships
              </h3>
              <div className="space-y-4">
                {dest.scholarships.map((s, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-r from-amber-50 to-white border border-amber-100 rounded-2xl p-6 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">
                          {s.name}
                        </h4>
                        <p className="text-sm text-slate-500">
                          {s.eligibility}
                        </p>
                      </div>
                      <span className="flex-shrink-0 text-sm font-bold text-amber-700 bg-amber-100 px-3 py-1.5 rounded-full">
                        {s.coverage}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right Sidebar ── */}
          <div className="space-y-6">
            {/* Quick Facts Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-28">
              <div className={`bg-gradient-to-br ${colors.hero} p-5`}>
                <div className="flex items-center gap-3">
                  <Image
                    src={`https://flagcdn.com/w40/${dest.flagCode}.png`}
                    alt={dest.name}
                    width={40}
                    height={28}
                    className="rounded shadow"
                  />
                  <div>
                    <h3 className="font-bold text-white text-lg">
                      Quick Facts
                    </h3>
                    <p className="text-white/70 text-xs">{dest.name}</p>
                  </div>
                </div>
              </div>
              <div className="p-5 space-y-4">
                {[
                  {
                    label: "Capital",
                    value: dest.capital,
                    icon: <MapPin className="w-4 h-4" />,
                  },
                  {
                    label: "Currency",
                    value: dest.currency,
                    icon: <DollarSign className="w-4 h-4" />,
                  },
                  {
                    label: "Student Visa",
                    value: dest.studentVisaType,
                    icon: <ShieldCheck className="w-4 h-4" />,
                  },
                  {
                    label: "Intakes",
                    value: dest.intakes.join(", "),
                    icon: <CalendarDays className="w-4 h-4" />,
                  },
                  {
                    label: "Post-Study Work",
                    value: dest.postStudyWork,
                    icon: <Briefcase className="w-4 h-4" />,
                  },
                  {
                    label: "Visa Processing",
                    value: dest.processingTime,
                    icon: <Clock className="w-4 h-4" />,
                  },
                  {
                    label: "Partner Universities",
                    value: `${dest.partnerUniversities}+`,
                    icon: <Building2 className="w-4 h-4" />,
                  },
                  {
                    label: "Students Placed",
                    value: `${dest.studentsPlaced}+`,
                    icon: <Users className="w-4 h-4" />,
                  },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center flex-shrink-0">
                      {icon}
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">
                        {label}
                      </p>
                      <p className="text-sm font-semibold text-slate-800 leading-snug">
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-5 pt-0 space-y-2">
                <Link
                  href="/contact"
                  className="w-full block btn-primary text-white text-center py-3 rounded-xl text-sm font-bold shadow-md shadow-primary-500/20"
                >
                  Apply for {dest.name} — Free
                </Link>
                <Link
                  href="/test-prep"
                  className="w-full block text-center py-3 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  Book IELTS Coaching
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Explore More Destinations ── */}
      <section className="bg-slate-50 border-t border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              Explore More Destinations
            </h2>
            <Link
              href="/destinations"
              className="text-sm text-primary-600 font-semibold hover:underline flex items-center gap-1"
            >
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {others.map((d) => (
              <Link
                key={d.id}
                href={`/destinations/${d.slug}`}
                className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-44">
                  {d.image ? (
                    <Image
                      src={d.image}
                      alt={d.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center">
                      <span className="text-4xl">{d.flag}</span>
                    </div>
                  )}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${d.color} opacity-60`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-2">
                      <Image
                        src={`https://flagcdn.com/w40/${d.flagCode}.png`}
                        alt={d.name}
                        width={24}
                        height={16}
                        className="rounded-sm shadow"
                      />
                      <span className="text-white font-bold text-base">
                        {d.name}
                      </span>
                    </div>
                    <p className="text-white/70 text-xs mt-1">{d.tagline}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section
        className={`py-16 bg-gradient-to-br ${colors.hero} relative overflow-hidden`}
      >
        <div className="absolute inset-0 opacity-10 pattern-dots-light" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Study in {dest.name}?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Book a free counseling session and get a personalised {dest.name}{" "}
            study plan within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-slate-900 font-bold px-8 py-4 rounded-full text-base hover:bg-slate-100 transition-colors shadow-xl inline-flex items-center justify-center gap-2"
            >
              Book Free Session <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/destinations"
              className="border-2 border-white/40 text-white font-semibold px-8 py-4 rounded-full text-base hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2"
            >
              Compare Other Countries
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
