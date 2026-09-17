"use client";

import { useEffect, useMemo, useState } from "react";
import { Trash2, Pencil, Plus, X, Eye, EyeOff, Search } from "lucide-react";
import PageHeader from "../../_components/PageHeader";
import ImageUploadField from "../../_components/ImageUploadField";
import RichTextEditor from "../../_components/RichTextEditor";
import TagInput from "../../_components/TagInput";
import { slugify } from "@/lib/slug";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  tags: string[];
  published: boolean;
  createdAt: string;
}

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  author: "Kingsland Abroad Team",
  tags: [] as string[],
  published: false,
};

const SITE_URL_DISPLAY =
  (process.env.NEXT_PUBLIC_SITE_URL || "yoursite.com").replace(/^https?:\/\//, "");

export default function BlogPage() {
  const [items, setItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState<any>(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const allTags = useMemo(() => {
    const set = new Set<string>();
    items.forEach((p) => (p.tags || []).forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [items]);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/blog");
    const data = await res.json();
    setItems(data.posts || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openNew() {
    setEditing(null);
    setForm(emptyForm);
    setSlugTouched(false);
    setError("");
    setShowForm(true);
  }

  function openEdit(post: Post) {
    setEditing(post);
    setForm({ ...post });
    setSlugTouched(true); // existing posts: never silently overwrite a live URL
    setError("");
    setShowForm(true);
  }

  function handleTitleChange(title: string) {
    setForm((prev: any) => ({
      ...prev,
      title,
      // Only auto-derive the slug while creating a new post and the
      // admin hasn't typed their own slug yet — never touch it once
      // it's been manually edited or the post already exists.
      slug: !editing && !slugTouched ? slugify(title) : prev.slug,
    }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const plainTextContent = form.content.replace(/<[^>]*>/g, "").trim();
    if (plainTextContent.length < 10) {
      setError("Please write some content for the post (at least a sentence or two).");
      return;
    }
    setSaving(true);
    const payload = { ...form, slug: form.slug ? slugify(form.slug) : undefined };
    const url = editing ? `/api/admin/blog/${editing.id}` : "/api/admin/blog";
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
      setError(data.error || "Failed to save. Check required fields (title, content).");
    }
  }

  async function togglePublish(post: Post) {
    setItems((prev) => prev.map((p) => (p.id === post.id ? { ...p, published: !p.published } : p)));
    await fetch(`/api/admin/blog/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !post.published }),
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this post?")) return;
    setItems((prev) => prev.filter((p) => p.id !== id));
    await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
  }

  const previewSlug = form.slug ? slugify(form.slug) : "your-post-slug";

  return (
    <div>
      <PageHeader
        title="Blog"
        description="Articles published at /blog. Drafts are hidden from the public site."
        action={
          <button
            onClick={openNew}
            className="flex items-center gap-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" /> New Post
          </button>
        }
      />

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading && <p className="p-6 text-sm text-slate-400">Loading…</p>}
        {!loading && items.length === 0 && <p className="p-6 text-sm text-slate-400">No posts yet.</p>}
        <div className="divide-y divide-slate-100">
          {items.map((post) => (
            <div key={post.id} className="flex items-center justify-between px-6 py-4 gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-slate-900 text-sm truncate">{post.title}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${post.published ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate">/blog/{post.slug} · {post.author}</p>
                {post.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {post.tags.map((t) => (
                      <span key={t} className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => togglePublish(post)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100" title={post.published ? "Unpublish" : "Publish"}>
                  {post.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button onClick={() => openEdit(post)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(post.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">{editing ? "Edit" : "New"} Post</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <Field label="Title *">
                <input required value={form.title} onChange={(e) => handleTitleChange(e.target.value)} className="input" />
              </Field>
              <Field label="Excerpt">
                <textarea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="input resize-none" placeholder="Shown on the blog listing and as the search-engine description." />
              </Field>
              <Field label="Content *">
                <RichTextEditor
                  value={form.content}
                  onChange={(html) => setForm({ ...form, content: html })}
                  placeholder="Write the post…"
                  minHeight="16rem"
                />
              </Field>
              <ImageUploadField label="Cover Image" value={form.coverImage} onChange={(url) => setForm({ ...form, coverImage: url })} />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Author">
                  <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="input" />
                </Field>
              </div>

              {/* ── SEO panel ── */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-4 bg-slate-50/50">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5" /> SEO
                </h4>

                <Field label="URL Slug">
                  <input
                    value={form.slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      setForm({ ...form, slug: e.target.value });
                    }}
                    onBlur={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                    className="input font-mono text-xs"
                    placeholder="auto-generated-from-title"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Changing this on a published post breaks any old links and search rankings for the old URL — only edit it if you know what you're doing.
                  </p>
                </Field>

                <Field label="Tags">
                  <TagInput
                    value={form.tags}
                    onChange={(tags) => setForm({ ...form, tags })}
                    suggestions={allTags}
                    placeholder="IELTS, Visa, Australia…"
                  />
                </Field>

                <div>
                  <p className="text-[11px] font-semibold text-slate-500 mb-1.5">Search preview</p>
                  <div className="bg-white border border-slate-200 rounded-lg p-3">
                    <p className="text-[13px] text-emerald-800 truncate">{SITE_URL_DISPLAY}/blog/{previewSlug}</p>
                    <p className="text-base text-blue-800 leading-tight truncate">{form.title || "Your post title"}</p>
                    <p className="text-[13px] text-slate-500 line-clamp-2">
                      {form.excerpt || "Add an excerpt above so search engines have something good to show here."}
                    </p>
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
                Publish immediately
              </label>

              {error && <p className="text-sm text-rose-600 bg-rose-50 rounded-lg px-3 py-2">{error}</p>}
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
