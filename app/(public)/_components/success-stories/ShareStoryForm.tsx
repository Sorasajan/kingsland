"use client";

import { useState } from "react";
import { Send, CheckCircle2, Loader2, Star } from "lucide-react";
import ImageUploadField from "@/app/admin/_components/ImageUploadField";

const initialForm = {
  name: "",
  email: "",
  program: "",
  university: "",
  country: "",
  year: new Date().getFullYear(),
  quote: "",
  avatar: "",
  rating: 5,
  company_website: "", // honeypot
};

export default function ShareStoryForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.quote) {
      setErrorMsg("Please fill in your name, email, and story.");
      setStatus("error");
      return;
    }
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
      setForm(initialForm);
    } catch {
      setErrorMsg("Couldn't reach the server. Please check your connection and try again.");
      setStatus("error");
    }
  }

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl font-bold text-slate-900 mb-3">Share Your Story</h2>
          <p className="text-slate-500">
            Studied abroad with us? Tell future students about your journey — approved stories are featured here.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
          {status === "success" ? (
            <div className="flex flex-col items-center text-center py-8">
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1.5">Thank you for sharing!</h3>
              <p className="text-sm text-slate-500 max-w-xs mb-5">
                Your story is in for review — we&apos;ll publish it here once our team approves it.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="text-sm font-semibold text-slate-700 hover:underline"
              >
                Share another story
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="company_website"
                value={form.company_website}
                onChange={handleChange}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name *</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all" />
                  <p className="text-[11px] text-slate-400 mt-1">Only for us to verify — never shown publicly.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">University</label>
                  <input type="text" name="university" value={form.university} onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Country</label>
                  <input type="text" name="country" value={form.country} onChange={handleChange} placeholder="Australia"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Program</label>
                  <input type="text" name="program" value={form.program} onChange={handleChange} placeholder="Master of IT"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Year</label>
                  <input type="number" name="year" value={form.year} onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Your Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, rating: n }))}
                      className="p-0.5"
                    >
                      <Star className={`w-6 h-6 ${n <= form.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                    </button>
                  ))}
                </div>
              </div>

              <ImageUploadField
                label="Your Photo (optional)"
                value={form.avatar}
                onChange={(url) => setForm((prev) => ({ ...prev, avatar: url }))}
                uploadUrl="/api/upload"
              />

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Your Story *</label>
                <textarea
                  rows={4}
                  name="quote"
                  value={form.quote}
                  onChange={handleChange}
                  required
                  placeholder="Tell us about your experience — the process, the challenges, and where you are now..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all resize-none"
                />
              </div>

              {status === "error" && (
                <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
              >
                {status === "submitting" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {status === "submitting" ? "Submitting..." : "Submit Your Story"}
              </button>
              <p className="text-xs text-slate-400 text-center">
                Submissions are reviewed by our team before appearing on the site.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
