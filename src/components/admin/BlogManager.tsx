"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "./ImageUpload";
import { Field, Modal } from "./ui";
import type { Blog } from "@/lib/types";

const empty: Partial<Blog> = {
  title: "",
  excerpt: "",
  content: "",
  cover_url: "",
  author: "KnowCode Team",
  published: true,
};

export function BlogManager({ initial }: { initial: Blog[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Partial<Blog> | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!editing?.title) return;
    setSaving(true);
    const res = await fetch("/api/admin/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    setSaving(false);
    if (res.ok) { setEditing(null); router.refresh(); }
    else alert((await res.json()).error || "Save failed");
  }

  async function remove(id: string) {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/admin/blogs?id=${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-navy">Blogs</h1>
        <button className="btn-primary" onClick={() => setEditing({ ...empty })}>+ New post</button>
      </div>

      <div className="space-y-3">
        {initial.length === 0 && <p className="text-navy/50">No posts yet.</p>}
        {initial.map((b) => (
          <div key={b.id} className="card flex items-center gap-4 p-4">
            <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-navy-50">
              {b.cover_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={b.cover_url} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-navy">{b.title}</p>
              <p className="text-xs text-navy/50">{b.published ? "Published" : "Draft"} · /{b.slug}</p>
            </div>
            <button className="btn-ghost text-sm" onClick={() => setEditing(b)}>Edit</button>
            <button className="text-sm font-semibold text-red-600 hover:underline" onClick={() => remove(b.id)}>Delete</button>
          </div>
        ))}
      </div>

      {editing && (
        <Modal onClose={() => setEditing(null)}>
          <h2 className="text-lg font-bold text-navy">{editing.id ? "Edit" : "New"} post</h2>
          <div className="mt-4 space-y-4">
            <Field label="Title *">
              <input className="input" value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </Field>
            <Field label="Author">
              <input className="input" value={editing.author || ""} onChange={(e) => setEditing({ ...editing, author: e.target.value })} />
            </Field>
            <Field label="Excerpt">
              <input className="input" value={editing.excerpt || ""} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} />
            </Field>
            <Field label="Content">
              <textarea rows={8} className="input" value={editing.content || ""} onChange={(e) => setEditing({ ...editing, content: e.target.value })} />
            </Field>
            <ImageUpload label="Cover image" folder="blogs" value={editing.cover_url || ""} onChange={(url) => setEditing({ ...editing, cover_url: url })} />
            <label className="flex items-center gap-2 text-sm text-navy/80">
              <input type="checkbox" checked={!!editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} />
              Published
            </label>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button className="btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
            <button className="btn-primary disabled:opacity-60" disabled={saving} onClick={save}>{saving ? "Saving…" : "Save"}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
