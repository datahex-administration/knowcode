import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CourseCard } from "@/components/CourseCard";
import { CATEGORIES, type Course } from "@/lib/types";

export const revalidate = 60;

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const supabase = createClient();
  const active = searchParams.category;

  let query = supabase
    .from("courses")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });
  if (active) query = query.eq("category", active);

  const { data } = await query;
  const courses = (data as Course[] | null) ?? [];

  return (
    <div className="container-x py-14">
      <h1 className="text-3xl font-extrabold text-navy">Courses</h1>
      <p className="mt-2 text-navy/60">Pick a skill and apply — coding, design, gaming and more.</p>

      <div className="mt-7 flex flex-wrap gap-2">
        <Link
          href="/courses"
          className={!active ? "chip bg-brand text-white" : "chip"}
        >
          All
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c.key}
            href={`/courses?category=${c.key}`}
            className={active === c.key ? "chip bg-brand text-white" : "chip"}
          >
            {c.label}
          </Link>
        ))}
      </div>

      {courses.length === 0 ? (
        <p className="mt-10 text-navy/50">No courses found in this category.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      )}
    </div>
  );
}
