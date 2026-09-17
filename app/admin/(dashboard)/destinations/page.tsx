"use client";

import { useEffect, useState } from "react";
import { Trash2, Pencil, Plus, X } from "lucide-react";
import PageHeader from "../../_components/PageHeader";
import ImageUploadField from "../../_components/ImageUploadField";
import RepeaterEditor from "../../_components/RepeaterEditor";
import CountrySelect from "../../_components/CountrySelect";
import { CURRENCIES } from "@/lib/currencies";

interface Destination {
  id: string;
  name: string;
  slug?: string;
  flag?: string;
  flagCode?: string;
  image?: string;
  badge?: string;
  tagline?: string;
  description?: string;
  longDescription?: string;
  currency?: string;
  capital?: string;
  studentVisaType?: string;
  averageTuitionRange?: { undergraduate?: string; postgraduate?: string };
  averageLivingCost?: string;
  partnerUniversities?: number;
  studentsPlaced?: number;
  postStudyWork?: string;
  processingTime?: string;
  intakes?: string[];
  englishRequirements?: { ielts?: string; pte?: string; toefl?: string };
  topUniversities?: string[];
  popularCourses?: string[];
  highlights?: string[];
  featured?: boolean;
  order?: number;
  scholarships?: unknown[];
}

const emptyForm = {
  name: "",
  flag: "",
  flagCode: "",
  image: "",
  badge: "",
  tagline: "",
  description: "",
  longDescription: "",
  currency: "",
  capital: "",
  studentVisaType: "",
  tuitionUndergrad: "",
  tuitionPostgrad: "",
  averageLivingCost: "",
  partnerUniversities: 0,
  studentsPlaced: 0,
  postStudyWork: "",
  processingTime: "",
  intakes: "",
  ieltsReq: "",
  pteReq: "",
  toeflReq: "",
  topUniversities: "",
  popularCourses: "",
  highlights: "",
  featured: false,
  order: 0,
  scholarships: [] as Array<{ name: string; coverage: string; eligibility: string }>,
};

function toList(value: string): string[] {
  return value.split(",").map((v) => v.trim()).filter(Boolean);
}

export default function DestinationsPage() {
  const [items, setItems] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Destination | null>(null);
  const [form, setForm] = useState<any>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/destinations");
    const data = await res.json();
    setItems(data.destinations || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openNew() {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  }

  function openEdit(d: Destination) {
    setEditing(d);
    setForm({
      ...emptyForm,
      ...d,
      tuitionUndergrad: d.averageTuitionRange?.undergraduate || "",
      tuitionPostgrad: d.averageTuitionRange?.postgraduate || "",
      ieltsReq: d.englishRequirements?.ielts || "",
      pteReq: d.englishRequirements?.pte || "",
      toeflReq: d.englishRequirements?.toefl || "",
      intakes: (d.intakes || []).join(", "),
      topUniversities: (d.topUniversities || []).join(", "),
      popularCourses: (d.popularCourses || []).join(", "),
      highlights: (d.highlights || []).join(", "),
      scholarships: d.scholarships || [],
    });
    setError("");
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const payload = {
      name: form.name,
      flag: form.flag,
      flagCode: form.flagCode,
      image: form.image,
      badge: form.badge,
      tagline: form.tagline,
      description: form.description,
      longDescription: form.longDescription,
      currency: form.currency,
      capital: form.capital,
      studentVisaType: form.studentVisaType,
      averageTuitionRange: {
        undergraduate: form.tuitionUndergrad,
        postgraduate: form.tuitionPostgrad,
      },
      averageLivingCost: form.averageLivingCost,
      partnerUniversities: Number(form.partnerUniversities) || 0,
      studentsPlaced: Number(form.studentsPlaced) || 0,
      postStudyWork: form.postStudyWork,
      processingTime: form.processingTime,
      intakes: toList(form.intakes),
      englishRequirements: { ielts: form.ieltsReq, pte: form.pteReq, toefl: form.toeflReq },
      topUniversities: toList(form.topUniversities),
      popularCourses: toList(form.popularCourses),
      highlights: toList(form.highlights),
      featured: form.featured,
      order: Number(form.order) || 0,
      scholarships: form.scholarships,
    };

    setSaving(true);
    const url = editing ? `/api/admin/destinations/${editing.id}` : "/api/admin/destinations";
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
    if (!confirm("Delete this destination?")) return;
    setItems((prev) => prev.filter((d) => d.id !== id));
    await fetch(`/api/admin/destinations/${id}`, { method: "DELETE" });
  }

  return (
    <div>
      <PageHeader
        title="Destinations"
        description="Countries shown on the Destinations page."
        action={
          <button
            onClick={openNew}
            className="flex items-center gap-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Destination
          </button>
        }
      />

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading && <p className="text-sm text-slate-400">Loading…</p>}
        {!loading && items.length === 0 && <p className="text-sm text-slate-400">No destinations yet.</p>}
        {items.map((d) => (
          <div key={d.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-bold text-slate-900 text-sm">{d.flag} {d.name}</p>
                <p className="text-xs text-slate-500">{d.studentsPlaced ?? 0} students placed</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(d)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(d.id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-accent-600 hover:bg-accent-50">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p className="text-sm text-slate-600 line-clamp-3">{d.tagline || d.description}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">{editing ? "Edit" : "Add"} Destination</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <ImageUploadField label="Cover Image" value={form.image} onChange={(url) => setForm({ ...form, image: url })} />

              <div className="grid grid-cols-2 gap-4">
                <CountrySelect
                  value={form.flagCode}
                  onChange={({ flagCode, flag, countryName }) =>
                    setForm((prev: any) => ({
                      ...prev,
                      flagCode,
                      flag,
                      name: prev.name || countryName,
                    }))
                  }
                />
                <Field label="Country Name *">
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Badge Text">
                  <input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} className="input" placeholder="Most Popular" />
                </Field>
                <Field label="Currency">
                  <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className="input bg-white">
                    <option value="">Select a currency…</option>
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>{c.label}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Tagline">
                <input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="input" />
              </Field>
              <Field label="Short Description">
                <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input resize-none" />
              </Field>
              <Field label="Long Description">
                <textarea rows={3} value={form.longDescription} onChange={(e) => setForm({ ...form, longDescription: e.target.value })} className="input resize-none" />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Capital">
                  <input value={form.capital} onChange={(e) => setForm({ ...form, capital: e.target.value })} className="input" />
                </Field>
                <Field label="Student Visa Type">
                  <input value={form.studentVisaType} onChange={(e) => setForm({ ...form, studentVisaType: e.target.value })} className="input" placeholder="Subclass 500" />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Tuition — Undergraduate">
                  <input value={form.tuitionUndergrad} onChange={(e) => setForm({ ...form, tuitionUndergrad: e.target.value })} className="input" placeholder="AUD 20,000 – 45,000/year" />
                </Field>
                <Field label="Tuition — Postgraduate">
                  <input value={form.tuitionPostgrad} onChange={(e) => setForm({ ...form, tuitionPostgrad: e.target.value })} className="input" placeholder="AUD 22,000 – 50,000/year" />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Average Living Cost">
                  <input value={form.averageLivingCost} onChange={(e) => setForm({ ...form, averageLivingCost: e.target.value })} className="input" />
                </Field>
                <Field label="Post-Study Work">
                  <input value={form.postStudyWork} onChange={(e) => setForm({ ...form, postStudyWork: e.target.value })} className="input" />
                </Field>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Field label="Partner Universities #">
                  <input type="number" value={form.partnerUniversities} onChange={(e) => setForm({ ...form, partnerUniversities: e.target.value })} className="input" />
                </Field>
                <Field label="Students Placed #">
                  <input type="number" value={form.studentsPlaced} onChange={(e) => setForm({ ...form, studentsPlaced: e.target.value })} className="input" />
                </Field>
                <Field label="Processing Time">
                  <input value={form.processingTime} onChange={(e) => setForm({ ...form, processingTime: e.target.value })} className="input" placeholder="4-6 weeks" />
                </Field>
              </div>

              <Field label="Intakes (comma separated)">
                <input value={form.intakes} onChange={(e) => setForm({ ...form, intakes: e.target.value })} className="input" placeholder="February, July" />
              </Field>

              <div className="grid grid-cols-3 gap-4">
                <Field label="IELTS Requirement">
                  <input value={form.ieltsReq} onChange={(e) => setForm({ ...form, ieltsReq: e.target.value })} className="input" placeholder="6.0–6.5 overall" />
                </Field>
                <Field label="PTE Requirement">
                  <input value={form.pteReq} onChange={(e) => setForm({ ...form, pteReq: e.target.value })} className="input" placeholder="50–58" />
                </Field>
                <Field label="TOEFL Requirement">
                  <input value={form.toeflReq} onChange={(e) => setForm({ ...form, toeflReq: e.target.value })} className="input" placeholder="64–79" />
                </Field>
              </div>

              <Field label="Top Universities (comma separated)">
                <textarea rows={2} value={form.topUniversities} onChange={(e) => setForm({ ...form, topUniversities: e.target.value })} className="input resize-none" />
              </Field>
              <Field label="Popular Courses (comma separated)">
                <textarea rows={2} value={form.popularCourses} onChange={(e) => setForm({ ...form, popularCourses: e.target.value })} className="input resize-none" />
              </Field>
              <Field label="Highlights (comma separated)">
                <textarea rows={2} value={form.highlights} onChange={(e) => setForm({ ...form, highlights: e.target.value })} className="input resize-none" />
              </Field>

              <RepeaterEditor
                label="Scholarships"
                description="Shown on the destination's page."
                fields={[
                  { key: "name", label: "Name", placeholder: "Australia Awards Scholarships" },
                  { key: "coverage", label: "Coverage", placeholder: "Full tuition + living allowance" },
                  { key: "eligibility", label: "Eligibility", placeholder: "Nepali government/private sector professionals" },
                ]}
                rows={form.scholarships}
                onChange={(rows) => setForm({ ...form, scholarships: rows })}
              />

              <div className="grid grid-cols-2 gap-4">
                <Field label="Display Order">
                  <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} className="input" />
                </Field>
                <label className="flex items-center gap-2 text-sm text-slate-600 pt-6">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                  Featured destination
                </label>
              </div>

              {error && <p className="text-sm text-accent-600 bg-accent-50 rounded-lg px-3 py-2">{error}</p>}
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
          box-shadow: 0 0 0 2px #3b82f6;
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
