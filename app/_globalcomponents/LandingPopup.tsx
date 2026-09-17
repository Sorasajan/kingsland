"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import type { PopupConfig } from "@/lib/content";

const STORAGE_KEY = "kingsland_popup_dismissed_at";

function shouldShow(frequency: PopupConfig["frequency"]): boolean {
  if (typeof window === "undefined") return false;
  if (frequency === "always") return true;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return true;

  const dismissedAt = Number(raw);
  if (Number.isNaN(dismissedAt)) return true;

  if (frequency === "session") {
    // sessionStorage flag handles "once per browser tab session";
    // localStorage timestamp here is a fallback for "daily" below.
    return !window.sessionStorage.getItem(STORAGE_KEY);
  }

  if (frequency === "daily") {
    const dayMs = 24 * 60 * 60 * 1000;
    return Date.now() - dismissedAt > dayMs;
  }

  return true;
}

function markDismissed(frequency: PopupConfig["frequency"]) {
  if (typeof window === "undefined") return;
  if (frequency === "session") {
    window.sessionStorage.setItem(STORAGE_KEY, "1");
  } else if (frequency === "daily") {
    window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
  }
}

export default function LandingPopup({ config }: { config: PopupConfig | null }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!config?.enabled) return;
    if (!shouldShow(config.frequency)) return;

    const timer = setTimeout(() => {
      setVisible(true);
    }, Math.max(0, config.delaySeconds) * 1000);

    return () => clearTimeout(timer);
  }, [config]);

  if (!config?.enabled || !visible) return null;

  function handleClose() {
    setVisible(false);
    if (config) markDismissed(config.frequency);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={handleClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-slate-700" />
        </button>

        {config.imageUrl && (
          <div className="relative w-full h-48">
            <Image src={config.imageUrl} alt={config.title || "Announcement"} fill className="object-cover" />
          </div>
        )}

        <div className="p-6 text-center">
          {config.title && (
            <h3 className="font-serif text-2xl font-bold text-slate-900 mb-2">{config.title}</h3>
          )}
          {config.message && (
            <div
              className="prose prose-sm prose-slate max-w-none mb-5 text-center"
              dangerouslySetInnerHTML={{ __html: config.message }}
            />
          )}
          {config.ctaText && config.ctaLink && (
            <Link
              href={config.ctaLink}
              onClick={handleClose}
              className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
            >
              {config.ctaText}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
