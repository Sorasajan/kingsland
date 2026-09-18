"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { GraduationCap, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }
      const next = searchParams.get("next") || "/admin";
      // Hard navigation (not router.push) so the browser sends the
      // just-set session cookie on a fresh request and middleware runs
      // cleanly against it — router.push + router.refresh can race with
      // the App Router's RSC cache and silently stall on this redirect.
      window.location.href = next;
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-slate-900">
            Kingsland Abroad
          </h1>
          <p className="text-sm text-slate-500 mt-1">Admin Dashboard</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 space-y-5"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kingsland.edu.np"
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-600">
                Password
              </label>
              <a
                href="/admin/forgot-password"
                className="text-xs font-semibold text-slate-500 hover:text-slate-900"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-accent-600 bg-accent-50 border border-accent-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
