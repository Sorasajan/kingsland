import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unsubscribed",
  robots: { index: false, follow: false },
};

export default function UnsubscribedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
      <div className="max-w-md w-full text-center bg-white rounded-2xl border border-slate-100 shadow-sm p-10">
        <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-7 h-7 text-emerald-600" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-slate-900 mb-2">You're unsubscribed</h1>
        <p className="text-sm text-slate-500 mb-6">
          You won't receive any more newsletter emails from us. You're welcome to sign up again any time.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 px-5 py-2.5 rounded-xl transition-colors"
        >
          Back to homepage
        </Link>
      </div>
    </div>
  );
}
