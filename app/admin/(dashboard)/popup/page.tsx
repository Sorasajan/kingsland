"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, CheckCircle2 } from "lucide-react";
import PageHeader from "../../_components/PageHeader";
import ImageUploadField from "../../_components/ImageUploadField";
import RichTextEditor from "../../_components/RichTextEditor";

const emptyForm = {
  enabled: false,
  title: "",
  message: "",
  imageUrl: "",
  ctaText: "",
  ctaLink: "",
  delaySeconds: 3,
  frequency: "session" as "always" | "session" | "daily",
};

export default function PopupPage() {
  const [form, setForm] = useState<any>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/popup");
      const data = await res.json();
      if (data.popup) setForm({ ...emptyForm, ...data.popup });
      setLoading(false);
    })();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaved(false);
    setSaving(true);
    const res = await fetch("/api/admin/popup", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, delaySeconds: Number(form.delaySeconds) || 0 }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to save.");
    }
  }

  if (loading) {
    return (
      <div>
        <PageHeader title="Landing Popup" description="A dismissible announcement shown on the homepage." />
        <p className="text-sm text-slate-400">Loading…</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Landing Popup"
        description="A dismissible announcement modal shown on the homepage."
        action={
          <button
            type="submit"
            form="popup-form"
            disabled={saving}
            className="flex items-center gap-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-xl transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        }
      />

      {saved && (
        <p className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5 mb-6">
          <CheckCircle2 className="w-4 h-4" /> Saved. Live on the homepage immediately.
        </p>
      )}
      {error && (
        <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-4 py-2.5 mb-6">{error}</p>
      )}

      <form id="popup-form" onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <label className="flex items-center gap-3 mb-1">
            <input
              type="checkbox"
              checked={form.enabled}
              onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="font-bold text-sm text-slate-900">Enable popup on the homepage</span>
          </label>
          <p className="text-xs text-slate-500 ml-7">Turn off to hide it without losing your content below.</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <ImageUploadField label="Image (optional)" value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} />
          <Field label="Title">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" placeholder="Spring Intake Scholarships Open!" />
          </Field>
          <Field label="Message">
            <RichTextEditor
              value={form.message}
              onChange={(html) => setForm({ ...form, message: html })}
              placeholder="Apply before March 15 to be considered for up to 50% tuition waivers."
              minHeight="6rem"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Button Text">
              <input value={form.ctaText} onChange={(e) => setForm({ ...form, ctaText: e.target.value })} className="input" placeholder="Book Free Counseling" />
            </Field>
            <Field label="Button Link">
              <input value={form.ctaLink} onChange={(e) => setForm({ ...form, ctaLink: e.target.value })} className="input" placeholder="/contact" />
            </Field>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-bold text-sm text-slate-900 mb-4">Timing</h3>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Show after (seconds)">
              <input type="number" min={0} max={120} value={form.delaySeconds} onChange={(e) => setForm({ ...form, delaySeconds: e.target.value })} className="input" />
            </Field>
            <Field label="How often to show">
              <select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} className="input bg-white">
                <option value="session">Once per browser session</option>
                <option value="daily">Once per day</option>
                <option value="always">Every page load</option>
              </select>
            </Field>
          </div>
        </div>
      </form>

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
