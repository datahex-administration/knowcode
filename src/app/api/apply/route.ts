import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendWhatsApp, applyConfirmationMessage } from "@/lib/msghex";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const mobile = (body.mobile || "").replace(/[^\d]/g, "");

  if (!name || !mobile) {
    return NextResponse.json({ error: "Name and mobile are required" }, { status: 400 });
  }
  if (mobile.length < 10) {
    return NextResponse.json({ error: "Enter a valid number with country code" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // 1) Store the application
  const { data, error } = await supabase
    .from("applications")
    .insert({
      course_id: body.course_id || null,
      course_title: body.course_title || null,
      name,
      mobile,
      address: body.address || null,
      gender: body.gender || null,
      age: body.age ?? null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[apply] insert failed:", error.message);
    return NextResponse.json({ error: "Could not save application" }, { status: 500 });
  }

  // 2) Fire WhatsApp confirmation (best-effort — never block the applicant)
  const send = await sendWhatsApp(mobile, applyConfirmationMessage(name));
  if (send.ok) {
    await supabase.from("applications").update({ notified: true }).eq("id", data.id);
  }

  return NextResponse.json({ ok: true, id: data.id, notified: send.ok });
}
