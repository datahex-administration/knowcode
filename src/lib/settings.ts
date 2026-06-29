import { createAdminClient } from "@/lib/supabase/admin";

// App-wide settings stored as a single row (id=1) in public.app_settings.
// SERVER ONLY — read/written with the service-role client.
export type AppSettings = {
  id: number;
  msghex_base_url: string | null;
  msghex_api_secret: string | null;
  msghex_session_id: string | null;
  whatsapp_number: string | null;
  apply_message: string | null;
  qr_value: string | null;
  extra: Record<string, unknown>;
  updated_at: string;
};

export async function getSettings(): Promise<AppSettings | null> {
  const supabase = createAdminClient();
  const { data } = await supabase.from("app_settings").select("*").eq("id", 1).single();
  return (data as AppSettings) ?? null;
}

export async function saveSettings(patch: Partial<AppSettings>) {
  const supabase = createAdminClient();
  const row = { ...patch, id: 1, updated_at: new Date().toISOString() };
  const { data, error } = await supabase
    .from("app_settings")
    .upsert(row, { onConflict: "id" })
    .select()
    .single();
  return { data: data as AppSettings | null, error };
}
