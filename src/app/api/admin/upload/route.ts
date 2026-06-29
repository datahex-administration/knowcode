import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

// Accepts a multipart file, stores it in the 'media' bucket, returns public URL.
export async function POST(req: Request) {
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const ext = (file.name.split(".").pop() || "bin").toLowerCase();
  const folder = (form.get("folder") as string) || "uploads";
  const key = `${folder}/${crypto.randomUUID()}.${ext}`;

  const supabase = createAdminClient();
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from("media")
    .upload(key, buffer, { contentType: file.type, upsert: false });

  if (error) {
    console.error("[upload]", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabase.storage.from("media").getPublicUrl(key);
  return NextResponse.json({ url: data.publicUrl });
}
