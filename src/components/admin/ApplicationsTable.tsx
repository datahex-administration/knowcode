"use client";

import { useRouter } from "next/navigation";
import type { Application } from "@/lib/types";

const STATUSES = ["new", "contacted", "enrolled", "rejected"];

export function ApplicationsTable({ initial }: { initial: Application[] }) {
  const router = useRouter();

  async function setStatus(a: Application, status: string) {
    await fetch("/api/admin/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: a.id, status }),
    });
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Delete this application?")) return;
    await fetch(`/api/admin/applications?id=${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-extrabold text-navy">Applications</h1>
      {initial.length === 0 ? (
        <p className="text-navy/50">No applications yet.</p>
      ) : (
        <div className="space-y-3">
          {initial.map((a) => (
            <div key={a.id} className="card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-navy">
                    {a.name}{" "}
                    <span className="text-sm font-normal text-navy/50">· {a.mobile}</span>
                  </p>
                  <p className="text-sm text-navy/60">
                    {a.course_title || "—"} · {a.gender || "?"}{a.age ? `, ${a.age}` : ""}
                  </p>
                  {a.address && <p className="text-xs text-navy/40">{a.address}</p>}
                  <p className="mt-1 text-xs text-navy/40">
                    {new Date(a.created_at).toLocaleString()} ·{" "}
                    {a.notified ? "✓ WhatsApp sent" : "✗ not notified"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    className="input !w-auto !py-1.5 text-sm"
                    value={a.status}
                    onChange={(e) => setStatus(a, e.target.value)}
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <a
                    className="btn-ghost !py-1.5 text-sm"
                    href={`https://wa.me/${a.mobile}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Chat
                  </a>
                  <button className="text-sm font-semibold text-red-600 hover:underline" onClick={() => remove(a.id)}>
                    Del
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
