"use client";

import { useRouter } from "next/navigation";
import type { ContactMessage } from "@/lib/types";

export function ContactsTable({ initial }: { initial: ContactMessage[] }) {
  const router = useRouter();

  async function toggle(c: ContactMessage) {
    await fetch("/api/admin/contact_messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: c.id, handled: !c.handled }),
    });
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Delete this message?")) return;
    await fetch(`/api/admin/contact_messages?id=${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-extrabold text-navy">Contact messages</h1>
      {initial.length === 0 ? (
        <p className="text-navy/50">No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {initial.map((c) => (
            <div key={c.id} className={"card p-4 " + (c.handled ? "opacity-60" : "")}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-navy">
                    {c.name}{" "}
                    <span className="text-sm font-normal text-navy/50">
                      {c.email && `· ${c.email} `}{c.mobile && `· ${c.mobile}`}
                    </span>
                  </p>
                  {c.subject && <p className="text-sm font-medium text-navy/70">{c.subject}</p>}
                  <p className="mt-1 whitespace-pre-wrap text-sm text-navy/70">{c.message}</p>
                  <p className="mt-1 text-xs text-navy/40">{new Date(c.created_at).toLocaleString()}</p>
                </div>
                <div className="flex shrink-0 flex-col gap-2">
                  <button className="btn-ghost !py-1.5 text-sm" onClick={() => toggle(c)}>
                    {c.handled ? "Mark unread" : "Mark handled"}
                  </button>
                  <button className="text-sm font-semibold text-red-600 hover:underline" onClick={() => remove(c.id)}>
                    Delete
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
