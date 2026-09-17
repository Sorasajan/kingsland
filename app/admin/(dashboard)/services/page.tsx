"use client";

import { useEffect, useState } from "react";
import { Trash2, Pencil, Plus, X } from "lucide-react";
import PageHeader from "../../_components/PageHeader";
import RepeaterEditor from "../../_components/RepeaterEditor";

interface Service {
  id: string;
  slug?: string;
  icon?: string;
  title: string;
  shortDescription?: string;
  description?: string;
  tag?: string;
  tagColor?: string;
  accent?: boolean;
  isFree?: boolean;
  duration?: string;
  deliverables?: string[];
  processSteps?: string[];
  visaSuccessRate?: string;
  countriesHandled?: number;
  scholarshipsSecured?: string;
  orientationTopics?: string[];
  order?: number;
  scholarshipTypes?: unknown[];
  tests?: unknown[];
}

const emptyForm = {
  title: "",
  icon: "",
  shortDescription: "",
  description: "",
  tag: "",
  tagColor: "",
  accent: false,
  isFree: false,
  duration: "",
  deliverables: "",
  processSteps: "",
  visaSuccessRate: "",
  countriesHandled: "",
  scholarshipsSecured: "",
  orientationTopics: "",
  order: 0,
  scholarshipTypes: [] as Array<{ type: string; coverage: string; examples: string[] }>,
  tests: [] as Array<{ name: string; duration: string; classSize: string; mockTests: string; guarantee: string; schedule: string }>,
};

function toList(value: string): string[] {
  return value.split(",").map((v) => v.trim()).filter(Boolean);
}

export default function ServicesPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState<any>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/services");
    const data = await res.json();
    setItems(data.services || []);
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

  function openEdit(s: Service) {
    setEditing(s);
    const { scholarshipTypes, tests, deliverables, processSteps, orientationTopics, ...rest } = s;
    setForm({
      ...emptyForm,
      ...rest,
      deliverables: (deliverables || []).join(", "),
      processSteps: (processSteps || []).join(", "),
      orientationTopics: (orientationTopics || []).join(", "),
      scholarshipTypes: scholarshipTypes || [],
      tests: tests || [],
    });
    setError("");
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const payload: any = {
      title: form.title,
      icon: form.icon,
      shortDescription: form.shortDescription,
      description: form.description,
      tag: form.tag,
      tagColor: form.tagColor,
      accent: form.accent,
      isFree: form.isFree,
      duration: form.duration,
      deliverables: toList(form.deliverables),
      processSteps: toList(form.processSteps),
      order: Number(form.order) || 0,
    };
    if (form.visaSuccessRate) payload.visaSuccessRate = form.visaSuccessRate;
    if (form.countriesHandled) payload.countriesHandled = Number(form.countriesHandled);
    if (form.scholarshipsSecured) payload.scholarshipsSecured = form.scholarshipsSecured;
    if (form.orientationTopics) payload.orientationTopics = toList(form.orientationTopics);
    if (form.scholarshipTypes?.length) payload.scholarshipTypes = form.scholarshipTypes;
    if (form.tests?.length) payload.tests = form.tests;

    setSaving(true);
    const url = editing ? `/api/admin/services/${editing.id}` : "/api/admin/services";
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
    if (!confirm("Delete this service?")) return;
    setItems((prev) => prev.filter((s) => s.id !== id));
    await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
  }

  return (
    <div>
      <PageHeader
        title="Services"
        description="Services shown on the Services page."
        action={
          <button
            onClick={openNew}
            className="flex items-center gap-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Service
          </button>
        }
      />

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading && <p className="text-sm text-slate-400">Loading…</p>}
        {!loading && items.length === 0 && <p className="text-sm text-slate-400">No services yet.</p>}
        {items.map((s) => (
          <div key={s.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-start justify-between mb-2">
              <p className="font-bold text-slate-900 text-sm">{s.title}</p>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(s)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(s.id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-accent-600 hover:bg-accent-50">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p className="text-sm text-slate-600 line-clamp-3">{s.shortDescription}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">{editing ? "Edit" : "Add"} Service</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Title *">
                  <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" />
                </Field>
                <Field label="Icon (Lucide icon name)">
                  <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="input" placeholder="MessagesSquare" />
                </Field>
              </div>

              <Field label="Short Description">
                <textarea rows={2} value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className="input resize-none" />
              </Field>
              <Field label="Full Description">
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input resize-none" />
              </Field>

              <div className="grid grid-cols-3 gap-4">
                <Field label="Tag Text">
                  <input value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} className="input" placeholder="Free" />
                </Field>
                <Field label="Tag Color (Tailwind classes)">
                  <input value={form.tagColor} onChange={(e) => setForm({ ...form, tagColor: e.target.value })} className="input" placeholder="bg-green-100 text-green-700" />
                </Field>
                <Field label="Duration">
                  <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="input" placeholder="60 minutes" />
                </Field>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" checked={form.accent} onChange={(e) => setForm({ ...form, accent: e.target.checked })} />
                  Accent style
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" checked={form.isFree} onChange={(e) => setForm({ ...form, isFree: e.target.checked })} />
                  Free service
                </label>
              </div>

              <Field label="Deliverables (comma separated)">
                <textarea rows={2} value={form.deliverables} onChange={(e) => setForm({ ...form, deliverables: e.target.value })} className="input resize-none" />
              </Field>
              <Field label="Process Steps (comma separated)">
                <textarea rows={2} value={form.processSteps} onChange={(e) => setForm({ ...form, processSteps: e.target.value })} className="input resize-none" />
              </Field>

              <div className="grid grid-cols-3 gap-4">
                <Field label="Visa Success Rate (if applicable)">
                  <input value={form.visaSuccessRate} onChange={(e) => setForm({ ...form, visaSuccessRate: e.target.value })} className="input" placeholder="98%" />
                </Field>
                <Field label="Countries Handled (if applicable)">
                  <input type="number" value={form.countriesHandled} onChange={(e) => setForm({ ...form, countriesHandled: e.target.value })} className="input" />
                </Field>
                <Field label="Scholarships Secured (if applicable)">
                  <input value={form.scholarshipsSecured} onChange={(e) => setForm({ ...form, scholarshipsSecured: e.target.value })} className="input" placeholder="450+" />
                </Field>
              </div>
              <Field label="Orientation Topics (comma separated, if applicable)">
                <input value={form.orientationTopics} onChange={(e) => setForm({ ...form, orientationTopics: e.target.value })} className="input" />
              </Field>

              <RepeaterEditor
                label="Scholarship Types"
                description="Only relevant for the Scholarship Guidance service."
                fields={[
                  { key: "type", label: "Type", placeholder: "Government Scholarships" },
                  { key: "coverage", label: "Coverage", placeholder: "Usually full funding" },
                  { key: "examples", label: "Examples (comma separated)", type: "list", placeholder: "Chevening (UK), Australia Awards" },
                ]}
                rows={form.scholarshipTypes}
                onChange={(rows) => setForm({ ...form, scholarshipTypes: rows })}
              />

              <RepeaterEditor
                label="Test Prep Tests"
                description="Only relevant for the Test Preparation service."
                fields={[
                  { key: "name", label: "Test Name", placeholder: "IELTS Academic" },
                  { key: "duration", label: "Duration", placeholder: "6 weeks" },
                  { key: "classSize", label: "Class Size", placeholder: "15" },
                  { key: "mockTests", label: "Mock Tests", placeholder: "20 or Unlimited" },
                  { key: "guarantee", label: "Guarantee", placeholder: "Target band or free re-enroll" },
                  { key: "schedule", label: "Schedule", placeholder: "Morning & Evening batches" },
                ]}
                rows={form.tests}
                onChange={(rows) => setForm({ ...form, tests: rows })}
              />

              <Field label="Display Order">
                <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} className="input w-32" />
              </Field>

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
