"use client";

import { useEffect, useState } from "react";
import { Trash2, Pencil, Plus, X, Star, CheckCircle2, Clock, Mail } from "lucide-react";
import PageHeader from "../../_components/PageHeader";
import ImageUploadField from "../../_components/ImageUploadField";

interface Testimonial {
  id: string;
  name: string;
  program?: string;
  university?: string;
  country?: string;
  year?: number;
  quote: string;
  avatar?: string;
  rating?: number;
  isFeatured?: boolean;
  approved: boolean;
  contactEmail?: string;
  source?: string;
  createdAt: string;
}

const emptyForm = {
  name: "",
  program: "",
  university: "",
  country: "",
  year: new Date().getFullYear(),
  quote: "",
  avatar: "",
  rating: 5,
  isFeatured: false,
};

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<any>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/testimonials");
    const data = await res.json();
    setItems(data.testimonials || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const pendingCount = items.filter((t) => !t.approved).length;
  const filtered = items.filter((t) => {
    if (filter === "pending") return !t.approved;
    if (filter === "approved") return t.approved;
    return true;
  });

  function openNew() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(t: Testimonial) {
    setEditing(t);
    setForm({ ...emptyForm, ...t });
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const url = editing ? `/api/admin/testimonials/${editing.id}` : "/api/admin/testimonials";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      setShowForm(false);
      load();
    } else {
      alert("Failed to save. Check required fields.");
    }
  }

  async function setApproved(id: string, approved: boolean) {
    setItems((prev) => prev.map((t) => (t.id === id ? { ...t, approved } : t)));
    await fetch(`/api/admin/testimonials/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved }),
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    setItems((prev) => prev.filter((t) => t.id !== id));
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
  }

  return (
    <div>
      <PageHeader
        title="Testimonials"
        description="Success stories shown across the site. Public submissions stay hidden until approved."
        action={
          <div className="flex items-center gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white"
            >
              <option value="all">All ({items.length})</option>
              <option value="pending">Pending review ({pendingCount})</option>
              <option value="approved">Approved</option>
            </select>
            <button
              onClick={openNew}
              className="flex items-center gap-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Testimonial
            </button>
          </div>
        }
      />

      {pendingCount > 0 && filter !== "pending" && (
        <button
          onClick={() => setFilter("pending")}
          className="flex items-center gap-2 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5 mb-6 hover:bg-amber-100 transition-colors"
        >
          <Clock className="w-4 h-4" />
          {pendingCount} testimonial{pendingCount === 1 ? "" : "s"} waiting for review
        </button>
      )}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading && <p className="text-sm text-slate-400">Loading…</p>}
        {!loading && filtered.length === 0 && <p className="text-sm text-slate-400">Nothing here.</p>}
        {filtered.map((t) => (
          <div
            key={t.id}
            className={`bg-white rounded-2xl border shadow-sm p-5 ${
              t.approved ? "border-slate-100" : "border-amber-200 bg-amber-50/30"
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                <p className="text-xs text-slate-500">{t.program} · {t.university}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(t)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(t.id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="flex gap-0.5 mb-2">
              {Array.from({ length: t.rating || 5 }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-sm text-slate-600 line-clamp-3">{t.quote}</p>
            {t.contactEmail && (
              <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                <Mail className="w-3 h-3" /> {t.contactEmail}
              </p>
            )}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {t.isFeatured && (
                <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">Featured</span>
              )}
              {t.approved ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" /> Approved
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                  <Clock className="w-3 h-3" /> Pending review
                </span>
              )}
            </div>
            <div className="mt-3">
              {t.approved ? (
                <button
                  onClick={() => setApproved(t.id, false)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  Unpublish
                </button>
              ) : (
                <button
                  onClick={() => setApproved(t.id, true)}
                  className="text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Approve &amp; Publish
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">{editing ? "Edit" : "Add"} Testimonial</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Name *">
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
                </Field>
                <Field label="Country">
                  <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="input" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Program">
                  <input value={form.program} onChange={(e) => setForm({ ...form, program: e.target.value })} className="input" />
                </Field>
                <Field label="University">
                  <input value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} className="input" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Year">
                  <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} className="input" />
                </Field>
                <Field label="Rating (1-5)">
                  <input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="input" />
                </Field>
              </div>
              <ImageUploadField label="Avatar Photo" value={form.avatar} onChange={(url) => setForm({ ...form, avatar: url })} />
              <Field label="Quote *">
                <textarea required rows={4} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} className="input resize-none" />
              </Field>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
                Feature this testimonial
              </label>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-60">
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
