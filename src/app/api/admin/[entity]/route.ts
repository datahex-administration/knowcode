import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const TABLES = ["courses", "blogs", "banners", "applications", "contact_messages"] as const;
type Table = (typeof TABLES)[number];

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function guard(entity: string): entity is Table {
  return (TABLES as readonly string[]).includes(entity);
}

// Create or update a row (upsert by id when present).
export async function POST(req: Request, { params }: { params: { entity: string } }) {
  if (!(await getAdminUser())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const entity = params.entity;
  if (!guard(entity)) return NextResponse.json({ error: "Unknown entity" }, { status: 404 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  // Auto-slug for content tables
  if ((entity === "courses" || entity === "blogs") && !body.slug && body.title) {
    body.slug = slugify(body.title) + "-" + Math.random().toString(36).slice(2, 6);
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from(entity)
    .upsert(body, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    console.error(`[admin:${entity}] upsert`, error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, data });
}

// Delete a row by id (?id=...).
export async function DELETE(req: Request, { params }: { params: { entity: string } }) {
  if (!(await getAdminUser())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const entity = params.entity;
  if (!guard(entity)) return NextResponse.json({ error: "Unknown entity" }, { status: 404 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const supabase = createAdminClient();
  const { error } = await supabase.from(entity).delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
