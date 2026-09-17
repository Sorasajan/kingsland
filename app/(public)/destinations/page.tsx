import DestinationsSection from "../_components/destinations/DestinationsSection";
import CTASection from "../_components/cta/CTASection";
import type { Metadata } from "next";
import { getDestinations } from "@/lib/content";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Study Destinations | Summit Abroad",
  description:
    "Explore 8 top study destinations — Australia, UK, Canada, USA, Europe, New Zealand, Japan & Ireland. Expert guidance for Nepali students.",
};

export default async function DestinationsPage() {
  const destinations = await getDestinations();
  return (
    <>
      {/* Page Hero */}
      <section className="pt-36 pb-20 bg-gradient-to-br from-primary-900 via-primary-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pattern-dots-light" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary-300 mb-4">
            <span className="w-8 h-0.5 bg-primary-400 rounded" /> Study Destinations
          </span>
          <h1 className="font-serif text-5xl lg:text-6xl font-bold text-white mb-6 mt-3">
            Where Will Your Journey Take You?
          </h1>
          <p className="text-xl text-primary-200 max-w-2xl mx-auto mb-10">
            From the sun-kissed campuses of Australia to tuition-free universities in Germany — find your perfect destination below.
          </p>

          {/* Quick country nav pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {destinations.map((d) => (
              <Link
                key={d.id}
                href={`/destinations/${d.slug}`}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-full transition-all"
              >
                <Image
                  src={`https://flagcdn.com/w40/${d.flagCode}.png`}
                  alt={d.name}
                  width={20}
                  height={14}
                  className="rounded-sm"
                />
                {d.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <DestinationsSection destinations={destinations} />
      <CTASection />
    </>
  );
}
