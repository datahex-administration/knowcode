// MsgHex WhatsApp API helper. SERVER ONLY (uses secret key).
// Docs: https://api.msghex.com

const BASE = "https://api.msghex.com";

type SendResult = { ok: boolean; messageId?: string; error?: string };

/** Send a single WhatsApp text message. */
export async function sendWhatsApp(
  recipient: string,
  message: string
): Promise<SendResult> {
  const secret = process.env.MSGHEX_API_SECRET;
  const account = process.env.MSGHEX_SESSION_ID;

  // Degrade gracefully when not configured (e.g. local dev / mock).
  if (!secret || !account) {
    console.warn("[msghex] not configured — skipping send to", recipient);
    return { ok: false, error: "MsgHex not configured" };
  }

  try {
    const res = await fetch(`${BASE}/api/send/whatsapp`, {
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

/** Build the applicant confirmation message from the env template. */
export function applyConfirmationMessage(name: string): string {
  const tpl =
    process.env.MSGHEX_APPLY_MESSAGE ||
    "Hi {{name}}, your KnowCode Academy application is received. Our team will contact you shortly.";
  return tpl.replace(/\{\{name\}\}/g, name || "there");
}

// Strip +, spaces, dashes — MsgHex wants digits with country code only.
function normalizeNumber(n: string): string {
  return (n || "").replace(/[^\d]/g, "");
}
