"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, CheckCircle2 } from "lucide-react";
import PageHeader from "../../_components/PageHeader";
import ImageUploadField from "../../_components/ImageUploadField";

const emptyForm = {
  siteUrl: "",
  defaultMetaTitle: "",
  defaultMetaDescription: "",
  ogImage: "",
  twitterHandle: "",
  googleAnalyticsId: "",
  googleSiteVerification: "",
  bingSiteVerification: "",
};

export default function SeoSettingsPage() {
  const [form, setForm] = useState<any>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/seo");
      const data = await res.json();
      if (data.seo) setForm({ ...emptyForm, ...data.seo });
      setLoading(false);
    })();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaved(false);
    setSaving(true);
    const res = await fetch("/api/admin/seo", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
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
        <PageHeader title="SEO" description="Search engine and social sharing settings." />
        <p className="text-sm text-slate-400">Loading…</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="SEO"
        description="Search engine visibility, social sharing previews, and analytics."
        action={
          <button
            type="submit"
            form="seo-form"
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
          <CheckCircle2 className="w-4 h-4" /> Saved. Takes effect on next page load.
        </p>
      )}
      {error && (
        <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-4 py-2.5 mb-6">{error}</p>
      )}

      <form id="seo-form" onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Site & Defaults</h3>
          <Field label="Site URL" hint="Used to build your sitemap and canonical links. No trailing slash.">
            <input value={form.siteUrl} onChange={(e) => setForm({ ...form, siteUrl: e.target.value })} className="input" placeholder="https://kingslandabroad.com" />
          </Field>
          <Field label="Default Meta Title" hint="Used on pages without their own specific title.">
            <input value={form.defaultMetaTitle} onChange={(e) => setForm({ ...form, defaultMetaTitle: e.target.value })} className="input" placeholder="Kingsland Abroad — Your Gateway to Global Education" />
          </Field>
          <Field label="Default Meta Description">
            <textarea rows={2} value={form.defaultMetaDescription} onChange={(e) => setForm({ ...form, defaultMetaDescription: e.target.value })} className="input resize-none" />
          </Field>
          <ImageUploadField label="Default Social Share Image (Open Graph)" value={form.ogImage} onChange={(url) => setForm({ ...form, ogImage: url })} />
          <Field label="Twitter / X Handle" hint="Without the @ symbol.">
            <input value={form.twitterHandle} onChange={(e) => setForm({ ...form, twitterHandle: e.target.value })} className="input" placeholder="kingslandabroad" />
          </Field>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Analytics & Verification</h3>
          <Field label="Google Analytics Measurement ID" hint="Starts with G-. Leave blank to disable analytics.">
            <input value={form.googleAnalyticsId} onChange={(e) => setForm({ ...form, googleAnalyticsId: e.target.value })} className="input" placeholder="G-XXXXXXXXXX" />
          </Field>
          <Field label="Google Search Console Verification" hint="The content value from the HTML tag verification method.">
            <input value={form.googleSiteVerification} onChange={(e) => setForm({ ...form, googleSiteVerification: e.target.value })} className="input" />
          </Field>
          <Field label="Bing Webmaster Verification">
            <input value={form.bingSiteVerification} onChange={(e) => setForm({ ...form, bingSiteVerification: e.target.value })} className="input" />
          </Field>
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

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}
