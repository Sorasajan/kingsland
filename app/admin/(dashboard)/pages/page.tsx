"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, CheckCircle2 } from "lucide-react";
import PageHeader from "../../_components/PageHeader";
import RichTextEditor from "../../_components/RichTextEditor";

type TabKey = "page-about-hero" | "page-test-prep-hero" | "legal-privacy-policy" | "legal-terms-of-service";

const TABS: Array<{ key: TabKey; label: string; kind: "hero" | "legal" }> = [
  { key: "page-about-hero", label: "About Hero", kind: "hero" },
  { key: "page-test-prep-hero", label: "Test Prep Hero", kind: "hero" },
  { key: "legal-privacy-policy", label: "Privacy Policy", kind: "legal" },
  { key: "legal-terms-of-service", label: "Terms of Service", kind: "legal" },
];

const emptyHero = { badge: "", title: "", subtitle: "" };
const emptyLegal = { title: "", content: "" };

export default function PagesAdminPage() {
  const [active, setActive] = useState<TabKey>("page-about-hero");
  const [form, setForm] = useState<any>(emptyHero);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const activeTab = TABS.find((t) => t.key === active)!;

  async function load(key: TabKey) {
    setLoading(true);
    setError("");
    setSaved(false);
    const res = await fetch(`/api/admin/pages/${key}`);
    const data = await res.json();
    const fallback = activeTab.kind === "hero" ? emptyHero : emptyLegal;
    setForm({ ...fallback, ...(data.data || {}) });
    setLoading(false);
  }

  useEffect(() => {
    load(active);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaved(false);

    if (activeTab.kind === "legal") {
      const plainText = (form.content || "").replace(/<[^>]*>/g, "").trim();
      if (plainText.length < 1) {
        setError("Please write some content before saving.");
        return;
      }
    }

    setSaving(true);
    const res = await fetch(`/api/admin/pages/${active}`, {
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

  return (
    <div>
      <PageHeader
        title="Page Content"
        description="Hero text for About & Test Prep, plus your Privacy Policy and Terms of Service."
        action={
          <button
            type="submit"
            form="page-content-form"
            disabled={saving || loading}
            className="flex items-center gap-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-xl transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        }
      />

      <div className="flex gap-1 mb-6 border-b border-slate-200">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              active === tab.key
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {saved && (
        <p className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5 mb-6">
          <CheckCircle2 className="w-4 h-4" /> Saved. Live on the site immediately.
        </p>
      )}
      {error && (
        <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-4 py-2.5 mb-6">{error}</p>
      )}

      {loading ? (
        <p className="text-sm text-slate-400">Loading…</p>
      ) : (
        <form id="page-content-form" onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          {activeTab.kind === "hero" ? (
            <>
              <Field label="Badge Label">
                <input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} className="input" placeholder="About Summit Abroad" />
              </Field>
              <Field label="Headline *">
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" />
              </Field>
              <Field label="Subtitle">
                <textarea rows={3} value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="input resize-none" />
              </Field>
            </>
          ) : (
            <>
              <Field label="Page Title *">
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" />
              </Field>
              <Field label="Content *">
                <RichTextEditor
                  value={form.content}
                  onChange={(html) => setForm({ ...form, content: html })}
                  placeholder="Write your policy here…"
                  minHeight="22rem"
                />
              </Field>
            </>
          )}
        </form>
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
