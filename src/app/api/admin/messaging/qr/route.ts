import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { getSettings, saveSettings } from "@/lib/settings";

export const runtime = "nodejs";

// Best-effort: ask MsgHex for a device-link QR using the stored secret.
// The exact path can vary by MsgHex plan; override it by saving
// extra.msghex_qr_path in settings. Falls back to a common default.
export async function POST() {
  if (!(await getAdminUser())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const s = await getSettings();
  const base = s?.msghex_base_url || "https://api.msghex.com";
  const secret = s?.msghex_api_secret;
  if (!secret) return NextResponse.json({ error: "Save your MsgHex API secret first." }, { status: 400 });

  const path = (s?.extra as any)?.msghex_qr_path || "/api/get/wa.qr";
  const url = `${base}${path}?secret=${encodeURIComponent(secret)}`;

  try {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    const text = await res.text();
    let json: any = null;
    try { json = JSON.parse(text); } catch { /* not json */ }

    // Pull a QR string/url out of common response shapes.
    const qr =
      json?.data?.qr || json?.qr || json?.data?.qrcode || json?.qrcode ||
      (typeof json?.data === "string" ? json.data : null) ||
      (text.startsWith("data:image") || text.startsWith("http") ? text.trim() : null);

    if (!res.ok) {
      return NextResponse.json({ error: json?.message || `MsgHex HTTP ${res.status}`, raw: json ?? text.slice(0, 500) }, { status: 502 });
    }
    if (qr) await saveSettings({ qr_value: qr });
    return NextResponse.json({ ok: true, qr, raw: json ?? text.slice(0, 500) });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Network error reaching MsgHex" }, { status: 502 });
  }
}
