import { createClient } from "@/lib/supabase/server";

// Returns the logged-in admin user or null. Used to guard /api/admin/* routes.
export async function getAdminUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
