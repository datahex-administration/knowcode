"use client";

import { useState } from "react";
import { Field } from "./ui";
import type { AppSettings } from "@/lib/settings";

type FormState = {
  whatsapp_number: string;
  msghex_base_url: string;
  msghex_api_secret: string;
  msghex_session_id: string;
  apply_message: string;
  qr_value: string;
};

function toForm(s: AppSettings | null): FormState {
  return {
    whatsapp_number: s?.whatsapp_number ?? "",
    msghex_base_url: s?.msghex_base_url ?? "https://api.msghex.com",
    msghex_api_secret: s?.msghex_api_secret ?? "",
    msghex_session_id: s?.msghex_session_id ?? "",
    apply_message: s?.apply_message ?? "",
    qr_value: s?.qr_value ?? "",
  };
}

export function MessagingManager({ initial }: { initial: AppSettings | null }) {
  const [form, setForm] = useState<FormState>(toForm(initial));
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState("");

  const connected = Boolean(form.msghex_api_secret && form.msghex_session_id);

  function set<K extends keyof FormState>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function save() {
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setMsg(res.ok ? "Saved." : "Save failed — check the values and try again.");
  }

  async function fetchQr() {
    setQrLoading(true);
    setQrError("");
    const res = await fetch("/api/admin/messaging/qr", { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setQrLoading(false);
    if (res.ok && data.qr) {
      set("qr_value", data.qr);
    } else {
      setQrError(data.error || "Could not fetch a QR from MsgHex. Paste the link code manually below.");
    }
  }

  // Render any QR value: a data-image URL directly, otherwise encode via a QR image service.
  const qrSrc = form.qr_value
    ? form.qr_value.startsWith("data:image")
      ? form.qr_value
      : `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(form.qr_value)}`
    : "";

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">Messaging (WhatsApp)</h1>
          <p className="mt-1 text-navy/60">
            Connect your WhatsApp number via MsgHex. Applicants get an automatic confirmation.
          </p>
        </div>
        <span
          className={
            "rounded-full px-3 py-1 text-xs font-bold " +
            (connected ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700")
          }
        >
          {connected ? "Configured" : "Not connected"}
        </span>
      </div>

      {/* QR connect */}
      <div className="card mt-6 p-6">
        <h2 className="font-bold text-navy">Connect device</h2>
        <p className="mt-1 text-sm text-navy/60">
          Scan this QR from WhatsApp → Linked devices. Fetch it from MsgHex, or paste the link
          code/URL from your MsgHex dashboard below.
        </p>
        <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row">
          <div className="flex h-60 w-60 shrink-0 items-center justify-center rounded-xl border border-navy/10 bg-white">
            {qrSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrSrc} alt="WhatsApp link QR" className="h-56 w-56 object-contain" />
            ) : (
              <span className="px-6 text-center text-sm text-navy/40">
                No QR yet. Fetch from MsgHex or paste a link code.
              </span>
            )}
          </div>
          <div className="flex-1">
            <button onClick={fetchQr} disabled={qrLoading} className="btn-primary disabled:opacity-60">
              {qrLoading ? "Fetching…" : "Fetch QR from MsgHex"}
            </button>
            {qrError && <p className="mt-2 text-sm text-red-600">{qrError}</p>}
            <Field label="Or paste link code / URL">
              <textarea
                className="input min-h-[80px]"
                value={form.qr_value}
                onChange={(e) => set("qr_value", e.target.value)}
                placeholder="Paste the device-link code or URL from MsgHex"
              />
            </Field>
          </div>
        </div>
      </div>

      {/* Credentials */}
      <div className="card mt-6 space-y-4 p-6">
        <h2 className="font-bold text-navy">MsgHex credentials</h2>
        <Field label="WhatsApp sender number (with country code)">
          <input className="input" value={form.whatsapp_number} onChange={(e) => set("whatsapp_number", e.target.value)} placeholder="919656550933" />
        </Field>
        <Field label="API base URL">
          <input className="input" value={form.msghex_base_url} onChange={(e) => set("msghex_base_url", e.target.value)} />
        </Field>
        <Field label="API secret">
          <input className="input" type="password" value={form.msghex_api_secret} onChange={(e) => set("msghex_api_secret", e.target.value)} placeholder="dh_live_…" />
        </Field>
        <Field label="Session / device ID">
          <input className="input" value={form.msghex_session_id} onChange={(e) => set("msghex_session_id", e.target.value)} />
        </Field>
        <Field label="Confirmation message ({{name}} is replaced)">
          <textarea className="input min-h-[80px]" value={form.apply_message} onChange={(e) => set("apply_message", e.target.value)} />
        </Field>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? "Saving…" : "Save settings"}
        </button>
        {msg && <span className="text-sm text-navy/70">{msg}</span>}
      </div>
    </div>
  );
}
