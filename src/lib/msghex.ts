// MsgHex WhatsApp API helper. SERVER ONLY (uses secret key).
// Config comes from the DB (app_settings, editable in /admin/messaging),
// falling back to env vars. Docs: https://api.msghex.com
import { getSettings } from "@/lib/settings";

type SendResult = { ok: boolean; messageId?: string; error?: string };

async function resolveConfig() {
  const s = await getSettings().catch(() => null);
  return {
    base: s?.msghex_base_url || process.env.MSGHEX_BASE_URL || "https://api.msghex.com",
    secret: s?.msghex_api_secret || process.env.MSGHEX_API_SECRET || "",
    account: s?.msghex_session_id || process.env.MSGHEX_SESSION_ID || "",
    template:
      s?.apply_message ||
      process.env.MSGHEX_APPLY_MESSAGE ||
      "Hi {{name}}, your KnowCode Academy application is received. Our team will contact you shortly.",
  };
}

/** Send a single WhatsApp text message. */
export async function sendWhatsApp(recipient: string, message: string): Promise<SendResult> {
  const { base, secret, account } = await resolveConfig();

  // Degrade gracefully when not configured (e.g. before the device is linked).
  if (!secret || !account) {
    console.warn("[msghex] not configured — skipping send to", recipient);
    return { ok: false, error: "MsgHex not configured" };
  }

  try {
    const res = await fetch(`${base}/api/send/whatsapp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        account,
        recipient: normalizeNumber(recipient),
        type: "text",
        message,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data?.status >= 400) {
      return { ok: false, error: data?.message || `HTTP ${res.status}` };
    }
    return { ok: true, messageId: data?.data?.messageId };
  } catch (e: any) {
    return { ok: false, error: e?.message || "network error" };
  }
}

/** Build the applicant confirmation message from the configured template. */
export async function applyConfirmationMessage(name: string): Promise<string> {
  const { template } = await resolveConfig();
  return template.replace(/\{\{name\}\}/g, name || "there");
}

// Strip +, spaces, dashes — MsgHex wants digits with country code only.
function normalizeNumber(n: string): string {
  return (n || "").replace(/[^\d]/g, "");
}
