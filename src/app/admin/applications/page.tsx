import { createAdminClient } from "@/lib/supabase/admin";
import { ApplicationsTable } from "@/components/admin/ApplicationsTable";
import type { Application } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminApplicationsPage() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("applications").select("*").order("created_at", { ascending: false });
  return <ApplicationsTable initial={(data as Application[]) ?? []} />;
}
