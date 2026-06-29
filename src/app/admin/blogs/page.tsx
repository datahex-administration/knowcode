import { createAdminClient } from "@/lib/supabase/admin";
import { BlogManager } from "@/components/admin/BlogManager";
import type { Blog } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminBlogsPage() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("blogs").select("*").order("created_at", { ascending: false });
  return <BlogManager initial={(data as Blog[]) ?? []} />;
}
