"use client";

import { useEffect, useState } from "react";
import { Trash2, Pencil, Plus, X, GripVertical } from "lucide-react";
import PageHeader from "../../_components/PageHeader";
import ImageUploadField from "../../_components/ImageUploadField";

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  order: number;
}

const emptyForm = { src: "", alt: "", order: 0 };

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<GalleryImage | null>(null);
  const [form, setForm] = useState<any>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/gallery");
    const data = await res.json();
    setImages((data.images || []).sort((a: GalleryImage, b: GalleryImage) => a.order - b.order));
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openNew() {
    setEditing(null);
    setForm({ ...emptyForm, order: images.length });
    setError("");
    setShowForm(true);
  }

  function openEdit(img: GalleryImage) {
    setEditing(img);
    setForm({ ...img });
    setError("");
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.src) {
      setError("Please upload an image or paste a URL.");
      return;
    }
    setSaving(true);
    setError("");
    const payload = { src: form.src, alt: form.alt, order: Number(form.order) || 0 };
    const url = editing ? `/api/admin/gallery/${editing.id}` : "/api/admin/gallery";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      setShowForm(false);
      load();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to save.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this photo from the gallery?")) return;
    setImages((prev) => prev.filter((i) => i.id !== id));
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
  }

  return (
    <div>
      <PageHeader
        title="Gallery"
        description={'"Inside Our World" section on the homepage, About page, and the full gallery page. Photo sizing in the grid is handled automatically by the site — you only control which photo shows and in what order.'}
        action={
          <button
            onClick={openNew}
            className="flex items-center gap-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Photo
          </button>
        }
      />

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading && <p className="text-sm text-slate-400">Loading…</p>}
        {!loading && images.length === 0 && (
          <p className="text-sm text-slate-400">No gallery photos yet — this section will be hidden on the site until you add some.</p>
        )}
        {images.map((img) => (
          <div key={img.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="relative h-40 bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-xs text-slate-500 truncate flex-1">{img.alt || "No caption"}</p>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(img)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(img.id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <GripVertical className="w-3 h-3" /> Order {img.order}
              </span>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">{editing ? "Edit" : "Add"} Photo</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <ImageUploadField label="Photo *" value={form.src} onChange={(url) => setForm({ ...form, src: url })} />
              <Field label="Caption (shown on hover)">
                <input value={form.alt} onChange={(e) => setForm({ ...form, alt: e.target.value })} className="input" placeholder="Students in group counseling session" />
              </Field>
              <Field label="Display Order">
                <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} className="input" />
              </Field>
              {error && <p className="text-sm text-rose-600 bg-rose-50 rounded-lg px-3 py-2">{error}</p>}
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors disabled:opacity-60">
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      <style jsx global>{`
        .input {
          width: 100%;
          padding: 0.6rem 0.9rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          font-size: 0.875rem;
        }
        .input:focus {
          outline: none;
          box-shadow: 0 0 0 2px #94a3b8;
          border-color: transparent;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
