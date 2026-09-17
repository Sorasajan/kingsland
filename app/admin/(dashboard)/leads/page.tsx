"use client";

import { useEffect, useState } from "react";
import { Trash2, Phone, Mail as MailIcon } from "lucide-react";
import PageHeader from "../../_components/PageHeader";
import { useAdminSession } from "../../_components/useAdminSession";
import { can } from "@/lib/permissions";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  destination?: string;
  service?: string;
  message?: string;
  status: string;
  createdAt: string;
}

const STATUS_OPTIONS = ["new", "contacted", "in-progress", "converted", "closed"];

const STATUS_STYLES: Record<string, string> = {
  new: "bg-indigo-50 text-indigo-700 border-indigo-200",
  contacted: "bg-amber-50 text-amber-700 border-amber-200",
  "in-progress": "bg-violet-50 text-violet-700 border-violet-200",
  converted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  closed: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function LeadsPage() {
  const { session } = useAdminSession();
  const canDelete = session ? can(session.role, "leads", "delete") : false;
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/leads");
    const data = await res.json();
    setLeads(data.leads || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: string) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function deleteLead(id: string) {
    if (!confirm("Delete this lead? This cannot be undone.")) return;
    setLeads((prev) => prev.filter((l) => l.id !== id));
    await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
  }

  const filtered = filter === "all" ? leads : leads.filter((l) => l.status === filter);

  return (
    <div>
      <PageHeader
        title="Leads"
        description="Consultation requests submitted through the contact form."
        action={
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white"
          >
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        }
      />

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading && <p className="p-6 text-sm text-slate-400">Loading…</p>}
        {!loading && filtered.length === 0 && (
          <p className="p-6 text-sm text-slate-400">No leads found.</p>
        )}
        <div className="divide-y divide-slate-100">
          {filtered.map((lead) => (
            <div key={lead.id} className="p-6 flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1 min-w-[240px]">
                <div className="flex items-center gap-2 mb-1.5">
                  <p className="font-bold text-slate-900">{lead.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_STYLES[lead.status] || STATUS_STYLES.new}`}>
                    {lead.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mb-2">
                  <a href={`mailto:${lead.email}`} className="flex items-center gap-1 hover:text-slate-900">
                    <MailIcon className="w-3.5 h-3.5" /> {lead.email}
                  </a>
                  <a href={`tel:${lead.phone}`} className="flex items-center gap-1 hover:text-slate-900">
                    <Phone className="w-3.5 h-3.5" /> {lead.phone}
                  </a>
                  <span>{lead.destination || "No destination"}</span>
                  <span>{lead.service || "No service"}</span>
                  <span>{new Date(lead.createdAt).toLocaleString()}</span>
                </div>
                {lead.message && (
                  <p className="text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2 max-w-xl">{lead.message}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={lead.status}
                  onChange={(e) => updateStatus(lead.id, e.target.value)}
                  className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {canDelete && (
                  <button
                    onClick={() => deleteLead(lead.id)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:text-accent-600 hover:border-accent-200 hover:bg-accent-50 transition-colors"
                    title="Delete lead"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
