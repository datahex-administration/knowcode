import { createAdminClient } from "@/lib/supabase/admin";
import { CourseManager } from "@/components/admin/CourseManager";
import type { Course } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("courses").select("*").order("created_at", { ascending: false });
  return <CourseManager initial={(data as Course[]) ?? []} />;
}
