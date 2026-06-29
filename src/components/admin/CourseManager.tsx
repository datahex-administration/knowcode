"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "./ImageUpload";
import { CATEGORIES, type Course } from "@/lib/types";

const empty: Partial<Course> = {
  title: "",
  category: "coding",
  summary: "",
  description: "",
  duration: "",
  level: "Foundation",
  price: "",
  poster_url: "",
  published: true,
};

export function CourseManager({ initial }: { initial: Course[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Partial<Course> | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!editing?.title) return;
    setSaving(true);
    const res = await fetch("/api/admin/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    setSaving(false);
    if (res.ok) {
      setEditing(null);
      router.refresh();
    } else {
      alert((await res.json()).error || "Save failed");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this course?")) return;
    await fetch(`/api/admin/courses?id=${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-navy">Courses</h1>
        <button className="btn-primary" onClick={() => setEditing({ ...empty })}>
          + New course
        </button>
      </div>

      <div className="space-y-3">
        {initial.length === 0 && <p className="text-navy/50">No courses yet.</p>}
        {initial.map((c) => (
          <div key={c.id} className="card flex items-center gap-4 p-4">
            <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-navy-50">
              {c.poster_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.poster_url} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-navy">{c.title}</p>
              <p className="text-xs text-navy/50">
                <span className="capitalize">{c.category}</span> ·{" "}
                {c.published ? "Published" : "Draft"} · /{c.slug}
              </p>
            </div>
            <button className="btn-ghost text-sm" onClick={() => setEditing(c)}>Edit</button>
            <button className="text-sm font-semibold text-red-600 hover:underline" onClick={() => remove(c.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>

      {editing && (
        <Modal onClose={() => setEditing(null)}>
          <h2 className="text-lg font-bold text-navy">{editing.id ? "Edit" : "New"} course</h2>
          <div className="mt-4 space-y-4">
            <Field label="Title *">
              <input className="input" value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Category">
                <select className="input" value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
                </select>
              </Field>
              <Field label="Duration">
                <input className="input" value={editing.duration || ""} onChange={(e) => setEditing({ ...editing, duration: e.target.value })} placeholder="2 Months" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Level">
                <input className="input" value={editing.level || ""} onChange={(e) => setEditing({ ...editing, level: e.target.value })} />
              </Field>
              <Field label="Price">
                <input className="input" value={editing.price || ""} onChange={(e) => setEditing({ ...editing, price: e.target.value })} placeholder="Free / ₹4999" />
              </Field>
            </div>
            <Field label="Summary">
              <input className="input" value={editing.summary || ""} onChange={(e) => setEditing({ ...editing, summary: e.target.value })} />
            </Field>
            <Field label="Description">
              <textarea rows={5} className="input" value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            </Field>
            <ImageUpload label="Poster" folder="courses" value={editing.poster_url || ""} onChange={(url) => setEditing({ ...editing, poster_url: url })} />
            <label className="flex items-center gap-2 text-sm text-navy/80">
              <input type="checkbox" checked={!!editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} />
              Published
            </label>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button className="btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
            <button className="btn-primary disabled:opacity-60" disabled={saving} onClick={save}>
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy/40 p-4 py-10" onClick={onClose}>
      <div className="card w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
