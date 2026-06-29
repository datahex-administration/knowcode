"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "./ImageUpload";
import { Field, Modal } from "./ui";
import type { Banner } from "@/lib/types";

const empty: Partial<Banner> = {
  title: "",
  subtitle: "",
  image_url: "",
  link_url: "",
  sort_order: 0,
  active: true,
};

export function BannerManager({ initial }: { initial: Banner[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Partial<Banner> | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!editing?.image_url) { alert("Image is required"); return; }
    setSaving(true);
    const res = await fetch("/api/admin/banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    setSaving(false);
    if (res.ok) { setEditing(null); router.refresh(); }
    else alert((await res.json()).error || "Save failed");
  }

  async function remove(id: string) {
    if (!confirm("Delete this banner?")) return;
    await fetch(`/api/admin/banners?id=${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-navy">Banners</h1>
        <button className="btn-primary" onClick={() => setEditing({ ...empty })}>+ New banner</button>
      </div>
      <p className="-mt-3 mb-5 text-sm text-navy/50">The first active banner (lowest sort order) shows on the homepage hero.</p>

      <div className="grid gap-4 sm:grid-cols-2">
        {initial.length === 0 && <p className="text-navy/50">No banners yet.</p>}
        {initial.map((b) => (
          <div key={b.id} className="card overflow-hidden">
            <div className="aspect-[16/7] bg-navy-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.image_url} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="min-w-0">
                <p className="truncate font-semibold text-navy">{b.title || "(no title)"}</p>
                <p className="text-xs text-navy/50">order {b.sort_order} · {b.active ? "active" : "hidden"}</p>
              </div>
              <div className="flex gap-2">
                <button className="btn-ghost text-sm" onClick={() => setEditing(b)}>Edit</button>
                <button className="text-sm font-semibold text-red-600 hover:underline" onClick={() => remove(b.id)}>Del</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <Modal onClose={() => setEditing(null)}>
          <h2 className="text-lg font-bold text-navy">{editing.id ? "Edit" : "New"} banner</h2>
          <div className="mt-4 space-y-4">
            <ImageUpload label="Banner image *" folder="banners" value={editing.image_url || ""} onChange={(url) => setEditing({ ...editing, image_url: url })} />
            <Field label="Title">
              <input className="input" value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </Field>
            <Field label="Subtitle">
              <input className="input" value={editing.subtitle || ""} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Link URL">
                <input className="input" value={editing.link_url || ""} onChange={(e) => setEditing({ ...editing, link_url: e.target.value })} />
              </Field>
              <Field label="Sort order">
                <input type="number" className="input" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} />
              </Field>
            </div>
            <label className="flex items-center gap-2 text-sm text-navy/80">
              <input type="checkbox" checked={!!editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} />
              Active
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
