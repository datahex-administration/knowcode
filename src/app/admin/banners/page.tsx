import { createAdminClient } from "@/lib/supabase/admin";
import { BannerManager } from "@/components/admin/BannerManager";
import type { Banner } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminBannersPage() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("banners").select("*").order("sort_order");
  return <BannerManager initial={(data as Banner[]) ?? []} />;
}
