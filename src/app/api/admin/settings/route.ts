import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { getSettings, saveSettings, type AppSettings } from "@/lib/settings";

export const runtime = "nodejs";

const FIELDS: (keyof AppSettings)[] = [
  "msghex_base_url",
  "msghex_api_secret",
  "msghex_session_id",
  "whatsapp_number",
  "apply_message",
  "qr_value",
];

export async function GET() {
  if (!(await getAdminUser())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await getSettings();
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  if (!(await getAdminUser())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const patch: Partial<AppSettings> = {};
  for (const f of FIELDS) {
    if (f in body) (patch as any)[f] = body[f];
  }
  if (body.extra && typeof body.extra === "object") patch.extra = body.extra;

  const { data, error } = await saveSettings(patch);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, data });
}
