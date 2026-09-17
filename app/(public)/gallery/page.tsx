import type { Metadata } from "next";
import GalleryGrid from "../_components/gallery/GalleryGrid";
import { getGalleryImages, getCompany } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const company = await getCompany();
  return {
    title: `Gallery | ${company.shortName || company.name || "Summit Abroad"}`,
    description: "Photos from our counseling sessions, test prep classes, orientations, and student celebrations.",
  };
}

export const revalidate = 60;

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <div className="min-h-screen bg-white">
      <section className="pt-36 pb-16 bg-slate-50 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary-600 mb-4">
            <span className="w-8 h-0.5 bg-primary-400 rounded" /> Life at Summit Abroad
          </span>
          <h1 className="font-serif text-5xl font-bold text-slate-900 mb-4 mt-3">
            Inside Our World
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Every counseling session, test prep class, and visa celebration — click any photo to enlarge it.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {images.length === 0 ? (
          <p className="text-center text-slate-400">No photos yet — check back soon.</p>
        ) : (
          <GalleryGrid images={images} />
        )}
      </section>
    </div>
  );
}
