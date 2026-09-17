"use client";

import { useEffect, useState } from "react";
import { Trash2, Pencil, Plus, X, ShieldCheck } from "lucide-react";
import PageHeader from "../../_components/PageHeader";
import { ROLES, ROLE_LABELS, type Role } from "@/lib/permissions";

interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

const ROLE_DESCRIPTIONS: Record<Role, string> = {
  SUPER_ADMIN: "Full access, including managing other admin users.",
  ADMIN: "Full access to leads and content — no user management.",
  EDITOR: "Manage testimonials, destinations, services, and blog only.",
  SUPPORT: "View and respond to leads and newsletter signups only.",
};

const emptyForm = { name: "", email: "", password: "", role: "EDITOR" as Role };
const emptyEditForm = { name: "", role: "EDITOR" as Role, password: "" };

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);

  const [editing, setEditing] = useState<AdminUserRow | null>(null);
  const [editForm, setEditForm] = useState(emptyEditForm);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    if (res.ok) {
      const data = await res.json();
      setUsers(data.users || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError("");
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createForm),
    });
    setCreating(false);
    if (res.ok) {
      setShowCreate(false);
      setCreateForm(emptyForm);
      load();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to create user.");
    }
  }

  function openEdit(u: AdminUserRow) {
    setEditing(u);
    setEditForm({ name: u.name, role: u.role, password: "" });
    setError("");
  }

  async function handleEditSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setError("");
    const payload: Record<string, unknown> = { name: editForm.name, role: editForm.role };
    if (editForm.password) payload.password = editForm.password;
    const res = await fetch(`/api/admin/users/${editing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      setEditing(null);
      load();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to update user.");
    }
  }

  async function handleDelete(u: AdminUserRow) {
    if (!confirm(`Remove ${u.name} (${u.email})? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/users/${u.id}`, { method: "DELETE" });
    if (res.ok) {
      load();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Failed to remove user.");
    }
  }

  return (
    <div>
      <PageHeader
        title="Admin Users"
        description="Who can access the dashboard, and what they can do."
        action={
          <button
            onClick={() => {
              setError("");
              setShowCreate(true);
            }}
            className="flex items-center gap-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add User
          </button>
        }
      />

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-6">
        {loading && <p className="p-6 text-sm text-slate-400">Loading…</p>}
        {!loading && users.length === 0 && <p className="p-6 text-sm text-slate-400">No admin users yet.</p>}
        <div className="divide-y divide-slate-100">
          {users.map((u) => (
            <div key={u.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-slate-900 text-sm">{u.name}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-50 text-indigo-700 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> {ROLE_LABELS[u.role]}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{u.email} · joined {new Date(u.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(u)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(u)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-accent-600 hover:bg-accent-50">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h3 className="font-bold text-sm text-slate-900 mb-3">Roles explained</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {ROLES.map((r) => (
            <div key={r} className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs font-semibold text-slate-800">{ROLE_LABELS[r]}</p>
              <p className="text-xs text-slate-500 mt-0.5">{ROLE_DESCRIPTIONS[r]}</p>
            </div>
          ))}
        </div>
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleCreate} className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Add Admin User</h3>
              <button type="button" onClick={() => setShowCreate(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <Field label="Full Name *">
                <input required value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} className="input" />
              </Field>
              <Field label="Email *">
                <input required type="email" value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} className="input" />
              </Field>
              <Field label="Temporary Password *">
                <input required type="text" minLength={8} value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} className="input" placeholder="At least 8 characters" />
              </Field>
              <Field label="Role *">
                <select value={createForm.role} onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as Role })} className="input bg-white">
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                  ))}
                </select>
              </Field>
              {error && <p className="text-sm text-accent-600 bg-accent-50 rounded-lg px-3 py-2">{error}</p>}
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100">
              <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100">
                Cancel
              </button>
              <button type="submit" disabled={creating} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-60">
                {creating ? "Creating…" : "Create User"}
              </button>
            </div>
          </form>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleEditSave} className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Edit {editing.name}</h3>
              <button type="button" onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <Field label="Full Name">
                <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="input" />
              </Field>
              <Field label="Role">
                <select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value as Role })} className="input bg-white">
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                  ))}
                </select>
              </Field>
              <Field label="Reset Password (optional)">
                <input type="text" minLength={8} value={editForm.password} onChange={(e) => setEditForm({ ...editForm, password: e.target.value })} className="input" placeholder="Leave blank to keep current password" />
              </Field>
              {error && <p className="text-sm text-accent-600 bg-accent-50 rounded-lg px-3 py-2">{error}</p>}
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100">
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100">
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
