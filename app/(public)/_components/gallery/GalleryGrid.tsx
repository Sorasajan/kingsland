"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export interface GalleryImageItem {
  id: string;
  src: string;
  alt: string;
}

// Frontend decides the visual rhythm of the masonry grid — admins just
// pick photos and ordering. This repeating pattern gives a varied,
// intentional-looking layout no matter what's uploaded.
const SIZE_PATTERN: Array<"normal" | "wide" | "tall"> = [
  "wide", "normal", "tall", "normal", "normal", "wide", "tall", "normal",
];

const SIZE_CLASSES: Record<string, { span: string; h: string }> = {
  normal: { span: "col-span-1 row-span-1", h: "h-52" },
  wide: { span: "col-span-2 row-span-1", h: "h-52" },
  tall: { span: "col-span-1 row-span-2", h: "h-full min-h-[28rem]" },
};

export default function GalleryGrid({ images }: { images: GalleryImageItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeIndex === null) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowRight") setActiveIndex((i) => (i === null ? i : (i + 1) % images.length));
      if (e.key === "ArrowLeft") setActiveIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, images.length]);

  if (images.length === 0) return null;

  const active = activeIndex !== null ? images[activeIndex] : null;

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {images.map((img, i) => {
          const { span, h } = SIZE_CLASSES[SIZE_PATTERN[i % SIZE_PATTERN.length]];
          return (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`${span} overflow-hidden rounded-2xl group cursor-zoom-in text-left`}
            >
              <div className={`relative ${h} w-full`}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-colors duration-300" />
                {img.alt && (
                  <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white text-xs font-medium bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      {img.alt}
                    </span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/85 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setActiveIndex(null)}
        >
          <button
            onClick={() => setActiveIndex(null)}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex((i) => (i === null ? i : (i + 1) % images.length));
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}

          <div
            className="relative w-full max-w-4xl h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={active.src}
              alt={active.alt}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
            {active.alt && (
              <p className="absolute -bottom-9 left-0 right-0 text-center text-sm text-white/70">
                {active.alt}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
