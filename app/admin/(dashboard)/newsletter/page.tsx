"use client";

import { useEffect, useState } from "react";
import { Trash2, Download, Send, X, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import PageHeader from "../../_components/PageHeader";
import RichTextEditor from "../../_components/RichTextEditor";
import { useAdminSession } from "../../_components/useAdminSession";
import { can } from "@/lib/permissions";

interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

interface SendResult {
  total: number;
  sent: number;
  failed: number;
  failedEmails: string[];
}

const emptyCampaign = { subject: "", bodyHtml: "" };

export default function NewsletterPage() {
  const { session } = useAdminSession();
  const canSend = session ? can(session.role, "newsletter", "write") : false;
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  const [showCompose, setShowCompose] = useState(false);
  const [campaign, setCampaign] = useState(emptyCampaign);
  const [confirming, setConfirming] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<SendResult | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/newsletter");
    const data = await res.json();
    setSubs(data.subscribers || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function deleteSub(id: string) {
    if (!confirm("Remove this subscriber?")) return;
    setSubs((prev) => prev.filter((s) => s.id !== id));
    await fetch(`/api/admin/newsletter/${id}`, { method: "DELETE" });
  }

  function exportCsv() {
    const rows = [["email", "subscribed_at"], ...subs.map((s) => [s.email, s.createdAt])];
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter-subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function openCompose() {
    setCampaign(emptyCampaign);
    setError("");
    setResult(null);
    setConfirming(false);
    setShowCompose(true);
  }

  function handleReviewSend(e: React.FormEvent) {
    e.preventDefault();
    const plainText = campaign.bodyHtml.replace(/<[^>]*>/g, "").trim();
    if (!campaign.subject.trim() || plainText.length < 5) {
      setError("Please add a subject and a message.");
      return;
    }
    setError("");
    setConfirming(true);
  }

  async function handleConfirmSend() {
    setSending(true);
    setError("");
    const res = await fetch("/api/admin/newsletter/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(campaign),
    });
    const data = await res.json();
    setSending(false);
    if (res.ok) {
      setResult(data);
      setConfirming(false);
    } else {
      setError(data.error || "Failed to send.");
      setConfirming(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Newsletter"
        description="Everyone who subscribed via the footer signup form."
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={exportCsv}
              disabled={subs.length === 0}
              className="flex items-center gap-2 text-sm font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
            {canSend && (
              <button
                onClick={openCompose}
                disabled={subs.length === 0}
                className="flex items-center gap-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" /> Compose & Send
              </button>
            )}
          </div>
        }
      />

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading && <p className="p-6 text-sm text-slate-400">Loading…</p>}
        {!loading && subs.length === 0 && (
          <p className="p-6 text-sm text-slate-400">No subscribers yet.</p>
        )}
        <div className="divide-y divide-slate-100">
          {subs.map((s) => (
            <div key={s.id} className="flex items-center justify-between px-6 py-3.5">
              <div>
                <p className="text-sm font-medium text-slate-900">{s.email}</p>
                <p className="text-xs text-slate-400">{new Date(s.createdAt).toLocaleString()}</p>
              </div>
              <button
                onClick={() => deleteSub(s.id)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {showCompose && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">
                {result ? "Send Complete" : confirming ? "Confirm Send" : "Compose Newsletter"}
              </h3>
              <button
                type="button"
                onClick={() => setShowCompose(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {result ? (
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">
                      Sent to {result.sent} of {result.total} subscriber{result.total === 1 ? "" : "s"}
                    </p>
                    {result.failed > 0 && (
                      <p className="text-sm text-amber-600">{result.failed} failed to send</p>
                    )}
                  </div>
                </div>
                {result.failedEmails.length > 0 && (
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700 mb-4">
                    <p className="font-semibold mb-1">Failed addresses:</p>
                    <p className="break-words">{result.failedEmails.join(", ")}</p>
                  </div>
                )}
                <button
                  onClick={() => setShowCompose(false)}
                  className="w-full text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2.5 rounded-xl transition-colors"
                >
                  Done
                </button>
              </div>
            ) : confirming ? (
              <div className="p-6">
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl p-4 mb-5">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800">
                    This will email <strong>{subs.length}</strong> subscriber{subs.length === 1 ? "" : "s"} right away. This can't be undone — double-check the subject and message below.
                  </p>
                </div>
                <p className="text-xs font-semibold text-slate-500 mb-1">Subject</p>
                <p className="text-sm text-slate-900 mb-4">{campaign.subject}</p>
                <p className="text-xs font-semibold text-slate-500 mb-1">Message preview</p>
                <div
                  className="prose prose-sm prose-slate max-w-none border border-slate-200 rounded-xl p-4 mb-5 max-h-52 overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: campaign.bodyHtml }}
                />
                {error && <p className="text-sm text-rose-600 bg-rose-50 rounded-lg px-3 py-2 mb-4">{error}</p>}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setConfirming(false)}
                    className="flex-1 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition-colors"
                  >
                    Back to edit
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmSend}
                    disabled={sending}
                    className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2.5 rounded-xl transition-colors disabled:opacity-60"
                  >
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {sending ? "Sending…" : `Send to ${subs.length}`}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleReviewSend} className="p-6 space-y-4">
                <p className="text-xs text-slate-400">
                  Sends to all {subs.length} subscriber{subs.length === 1 ? "" : "s"}. Each person gets their own email with their own unsubscribe link — nobody sees anyone else's address.
                </p>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Subject *</label>
                  <input
                    required
                    value={campaign.subject}
                    onChange={(e) => setCampaign({ ...campaign, subject: e.target.value })}
                    className="input"
                    placeholder="Spring Intake Scholarships Now Open"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Message *</label>
                  <RichTextEditor
                    value={campaign.bodyHtml}
                    onChange={(html) => setCampaign({ ...campaign, bodyHtml: html })}
                    placeholder="Write your newsletter…"
                    minHeight="14rem"
                  />
                </div>
                {error && <p className="text-sm text-rose-600 bg-rose-50 rounded-lg px-3 py-2">{error}</p>}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCompose(false)}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
                  >
                    Review & Send
                  </button>
                </div>
              </form>
            )}
          </div>
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
