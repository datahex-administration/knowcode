import { createAdminClient } from "@/lib/supabase/admin";
import { ContactsTable } from "@/components/admin/ContactsTable";
import type { ContactMessage } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminContactsPage() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
  return <ContactsTable initial={(data as ContactMessage[]) ?? []} />;
}
