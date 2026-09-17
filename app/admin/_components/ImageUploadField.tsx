"use client";

import { useRef, useState } from "react";
import { Upload, Loader2, X } from "lucide-react";

export default function ImageUploadField({
  label,
  value,
  onChange,
  uploadUrl = "/api/admin/upload",
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  uploadUrl?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(uploadUrl, { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed");
      } else {
        onChange(data.url);
      }
    } catch {
      setError("Upload failed — please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
      <div className="flex items-center gap-3">
        {value ? (
          <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0 bg-slate-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-slate-900/70 text-white flex items-center justify-center"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </div>
        ) : (
          <div className="w-16 h-16 rounded-xl border border-dashed border-slate-300 flex items-center justify-center flex-shrink-0 text-slate-300">
            <Upload className="w-5 h-5" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="text-sm font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-2 rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-60 flex items-center gap-2"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? "Uploading…" : value ? "Replace photo" : "Upload photo"}
          </button>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="or paste an image URL"
            className="mt-2 w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg text-slate-500"
          />
          {error && <p className="text-xs text-accent-600 mt-1">{error}</p>}
        </div>
      </div>
    </div>
  );
}
