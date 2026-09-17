"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, CheckCircle2, Send, Mail } from "lucide-react";
import PageHeader from "../../_components/PageHeader";

const emptyForm = {
  host: "",
  port: 587,
  secure: false,
  user: "",
  password: "",
  from: "",
  contactReceiverEmail: "",
  passwordSet: false,
};

export default function SmtpSettingsPage() {
  const [form, setForm] = useState<any>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [testEmail, setTestEmail] = useState("");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/smtp");
    const data = await res.json();
    if (data.smtp) setForm({ ...emptyForm, ...data.smtp, password: "" });
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaved(false);
    setSaving(true);
    const res = await fetch("/api/admin/smtp", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, port: Number(form.port) || 587 }),
    });
    setSaving(false);
    if (res.ok) {
      const data = await res.json();
      setForm((prev: any) => ({ ...prev, ...data.smtp, password: "" }));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to save.");
    }
  }

  async function handleTest() {
    if (!testEmail) return;
    setTesting(true);
    setTestResult(null);
    const res = await fetch("/api/admin/smtp/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, port: Number(form.port) || 587, to: testEmail }),
    });
    const data = await res.json();
    setTesting(false);
    setTestResult(
      res.ok
        ? { success: true, message: `Test email sent to ${testEmail}.` }
        : { success: false, message: data.error || "Failed to send test email." }
    );
  }

  if (loading) {
    return (
      <div>
        <PageHeader title="Email (SMTP)" description="Used for the contact form, and newsletter broadcasts." />
        <p className="text-sm text-slate-400">Loading…</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Email (SMTP)"
        description="Used for the contact form's notification email and newsletter broadcasts."
        action={
          <button
            type="submit"
            form="smtp-form"
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
          <CheckCircle2 className="w-4 h-4" /> Saved.
        </p>
      )}
      {error && (
        <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-4 py-2.5 mb-6">{error}</p>
      )}

      <form id="smtp-form" onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Mail className="w-4 h-4" /> Server Settings
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Field label="SMTP Host *">
              <input value={form.host} onChange={(e) => setForm({ ...form, host: e.target.value })} className="input" placeholder="smtp.gmail.com" />
            </Field>
            <Field label="Port">
              <input type="number" value={form.port} onChange={(e) => setForm({ ...form, port: e.target.value })} className="input" placeholder="587" />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={form.secure} onChange={(e) => setForm({ ...form, secure: e.target.checked })} />
            Use SSL (usually only for port 465 — leave off for 587/TLS)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Username *">
              <input value={form.user} onChange={(e) => setForm({ ...form, user: e.target.value })} className="input" placeholder="you@yourdomain.com" />
            </Field>
            <Field label={form.passwordSet ? "Password (saved — leave blank to keep)" : "Password *"}>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input"
                placeholder={form.passwordSet ? "••••••••" : ""}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="From Address" hint="Shown as the sender. Defaults to Username if left blank.">
              <input value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} className="input" placeholder="Kingsland Abroad <no-reply@yourdomain.com>" />
            </Field>
            <Field label="Contact Form Notifications Go To">
              <input value={form.contactReceiverEmail} onChange={(e) => setForm({ ...form, contactReceiverEmail: e.target.value })} className="input" placeholder="info@yourdomain.com" />
            </Field>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-bold text-sm text-slate-900 mb-1">Send a Test Email</h3>
          <p className="text-xs text-slate-500 mb-4">
            Tests using whatever's currently in the form above — save first if you want to confirm the saved settings specifically.
          </p>
          <div className="flex gap-3">
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="you@example.com"
              className="input flex-1"
            />
            <button
              type="button"
              onClick={handleTest}
              disabled={testing || !testEmail}
              className="flex items-center gap-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-colors disabled:opacity-50 flex-shrink-0"
            >
              {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {testing ? "Sending…" : "Send Test"}
            </button>
          </div>
          {testResult && (
            <p className={`text-sm mt-3 px-3 py-2 rounded-lg ${testResult.success ? "text-emerald-700 bg-emerald-50" : "text-rose-600 bg-rose-50"}`}>
              {testResult.message}
            </p>
          )}
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
