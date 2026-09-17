"use client";

import { useEffect, useState } from "react";
import { Trash2, Pencil, Plus, X, Star } from "lucide-react";
import PageHeader from "../../_components/PageHeader";
import ImageUploadField from "../../_components/ImageUploadField";

interface TeamMember {
  id: string;
  name: string;
  role?: string;
  department?: string;
  experience?: string;
  specialisation?: string[];
  image?: string;
  bio?: string;
  qualifications?: string[];
  languages?: string[];
  studiedIn?: string;
  linkedIn?: string;
  email?: string;
  isFeatured?: boolean;
  order?: number;
}

const emptyForm = {
  name: "",
  role: "",
  department: "",
  experience: "",
  specialisation: "",
  image: "",
  bio: "",
  qualifications: "",
  languages: "",
  studiedIn: "",
  linkedIn: "",
  email: "",
  isFeatured: false,
  order: 0,
};

// Convert comma-separated form fields <-> string[] stored on the record.
function toList(value: string): string[] {
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [form, setForm] = useState<any>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/team");
    const data = await res.json();
    setMembers(data.team || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openNew() {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  }

  function openEdit(m: TeamMember) {
    setEditing(m);
    setForm({
      ...emptyForm,
      ...m,
      specialisation: (m.specialisation || []).join(", "),
      qualifications: (m.qualifications || []).join(", "),
      languages: (m.languages || []).join(", "),
    });
    setError("");
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      ...form,
      specialisation: toList(form.specialisation),
      qualifications: toList(form.qualifications),
      languages: toList(form.languages),
      order: Number(form.order) || 0,
    };
    const url = editing ? `/api/admin/team/${editing.id}` : "/api/admin/team";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      setShowForm(false);
      load();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to save. Check required fields.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this team member?")) return;
    setMembers((prev) => prev.filter((m) => m.id !== id));
    await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
  }

  return (
    <div>
      <PageHeader
        title="Team"
        description="Counselors and staff shown on the About page. Upload a photo or paste an image URL — uploaded photos are saved locally to /public/uploads."
        action={
          <button
            onClick={openNew}
            className="flex items-center gap-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Team Member
          </button>
        }
      />

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading && <p className="text-sm text-slate-400">Loading…</p>}
        {!loading && members.length === 0 && (
          <p className="text-sm text-slate-400">No team members yet.</p>
        )}
        {members.map((m) => (
          <div key={m.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-start gap-3 mb-3">
              {m.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.image} alt={m.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 text-sm truncate">{m.name}</p>
                <p className="text-xs text-slate-500 truncate">{m.role}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => openEdit(m)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(m.id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-accent-600 hover:bg-accent-50">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-500 line-clamp-2 mb-2">{m.bio}</p>
            {m.isFeatured && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                <Star className="w-3 h-3 fill-slate-700 text-slate-700" /> Featured
              </span>
            )}
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">{editing ? "Edit" : "Add"} Team Member</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <ImageUploadField
                label="Photo"
                value={form.image}
                onChange={(url) => setForm({ ...form, image: url })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Full Name *">
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
                </Field>
                <Field label="Role / Title">
                  <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="input" placeholder="e.g. Head of Visa Division" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Department">
                  <input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="input" placeholder="e.g. Visa" />
                </Field>
                <Field label="Experience">
                  <input value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} className="input" placeholder="e.g. 12 years" />
                </Field>
              </div>
              <Field label="Specialisation (comma separated)">
                <input value={form.specialisation} onChange={(e) => setForm({ ...form, specialisation: e.target.value })} className="input" placeholder="Canada, USA, Visa Documentation" />
              </Field>
              <Field label="Bio">
                <textarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="input resize-none" />
              </Field>
              <Field label="Qualifications (comma separated)">
                <input value={form.qualifications} onChange={(e) => setForm({ ...form, qualifications: e.target.value })} className="input" placeholder="M.Sc. ..., QEAC Certified, ..." />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Languages (comma separated)">
                  <input value={form.languages} onChange={(e) => setForm({ ...form, languages: e.target.value })} className="input" placeholder="Nepali, English, Hindi" />
                </Field>
                <Field label="Studied In">
                  <input value={form.studiedIn} onChange={(e) => setForm({ ...form, studiedIn: e.target.value })} className="input" placeholder="Australia" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Email">
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" />
                </Field>
                <Field label="LinkedIn URL">
                  <input value={form.linkedIn} onChange={(e) => setForm({ ...form, linkedIn: e.target.value })} className="input" placeholder="https://linkedin.com/in/..." />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Display Order">
                  <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} className="input" />
                </Field>
                <label className="flex items-center gap-2 text-sm text-slate-600 pt-6">
                  <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
                  Feature on About page
                </label>
              </div>
              {error && <p className="text-sm text-accent-600 bg-accent-50 rounded-lg px-3 py-2">{error}</p>}
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-60">
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </form>
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
          box-shadow: 0 0 0 2px #3b82f6;
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
