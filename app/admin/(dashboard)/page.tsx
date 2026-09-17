"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Mail, Quote, Newspaper, ArrowRight, Clock } from "lucide-react";
import PageHeader from "../_components/PageHeader";

interface Lead {
  id: string;
  name: string;
  email: string;
  destination?: string;
  service?: string;
  status: string;
  createdAt: string;
}

export default function AdminOverviewPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [newsletterCount, setNewsletterCount] = useState(0);
  const [testimonialCount, setTestimonialCount] = useState(0);
  const [blogCount, setBlogCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [leadsRes, newsRes, testRes, blogRes] = await Promise.all([
        fetch("/api/admin/leads").then((r) => r.json()),
        fetch("/api/admin/newsletter").then((r) => r.json()),
        fetch("/api/admin/testimonials").then((r) => r.json()),
        fetch("/api/admin/blog").then((r) => r.json()),
      ]);
      setLeads(leadsRes.leads || []);
      setNewsletterCount((newsRes.subscribers || []).length);
      setTestimonialCount((testRes.testimonials || []).length);
      setBlogCount((blogRes.posts || []).length);
      setLoading(false);
    })();
  }, []);

  const stats = [
    { label: "Total Leads", value: leads.length, icon: Users, href: "/admin/leads", accent: "text-indigo-600 bg-indigo-50" },
    { label: "Newsletter Subscribers", value: newsletterCount, icon: Mail, href: "/admin/newsletter", accent: "text-slate-600 bg-slate-100" },
    { label: "Testimonials", value: testimonialCount, icon: Quote, href: "/admin/testimonials", accent: "text-amber-600 bg-amber-50" },
    { label: "Blog Posts", value: blogCount, icon: Newspaper, href: "/admin/blog", accent: "text-emerald-600 bg-emerald-50" },
  ];

  return (
    <div>
      <PageHeader title="Overview" description="A snapshot of what's happening on your site." />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, href, accent }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${accent}`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{loading ? "—" : value}</p>
            <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
              {label}
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </p>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            Recent Leads
          </h2>
          <Link href="/admin/leads" className="text-sm text-slate-700 font-semibold hover:text-slate-900 hover:underline">
            View all
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {loading && <p className="p-6 text-sm text-slate-400">Loading…</p>}
          {!loading && leads.length === 0 && (
            <p className="p-6 text-sm text-slate-400">No leads yet. They&apos;ll show up here as visitors submit the contact form.</p>
          )}
          {leads.slice(0, 6).map((lead) => (
            <div key={lead.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="font-semibold text-slate-900 text-sm">{lead.name}</p>
                <p className="text-xs text-slate-500">{lead.email} · {lead.destination || "No destination"} · {lead.service || "No service"}</p>
              </div>
              <span className="text-xs text-slate-400">{new Date(lead.createdAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
