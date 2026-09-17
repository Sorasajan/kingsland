import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/_globalcomponents/shared/ScrollReveal";
import GalleryGrid, { type GalleryImageItem } from "./GalleryGrid";

const PREVIEW_COUNT = 6;

export default function GallerySection({ images }: { images: GalleryImageItem[] }) {
  if (images.length === 0) return null;
  const preview = images.slice(0, PREVIEW_COUNT);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="section-label text-accent-600 mb-3">
              <span className="w-8 h-0.5 bg-accent-400 rounded" /> Life at Summit Abroad <span className="w-8 h-0.5 bg-accent-400 rounded" />
            </span>
            <h2 className="font-serif text-4xl font-bold text-slate-900 mt-3 mb-4">
              Inside Our World
            </h2>
            <p className="text-slate-500">
              Glimpses of our vibrant counseling sessions, test prep classes, and student celebrations.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <GalleryGrid images={preview} />
        </ScrollReveal>

        {images.length > PREVIEW_COUNT && (
          <ScrollReveal delay={150}>
            <div className="text-center mt-10">
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              >
                View Full Gallery ({images.length} photos)
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
