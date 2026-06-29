import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ApplyForm } from "@/components/ApplyForm";
import { CoursePoster } from "@/components/CoursePoster";
import type { Course } from "@/lib/types";

export const revalidate = 60;

export default async function CourseDetail({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createClient();
  const { data } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", params.slug)
    .eq("published", true)
    .maybeSingle();

  const course = data as Course | null;
  if (!course) notFound();

  return (
    <div className="container-x py-12">
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {course.poster_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={course.poster_url}
              alt={course.title}
              className="mb-6 w-full rounded-2xl object-cover shadow-card"
            />
          ) : (
            <CoursePoster course={course} className="mb-6 aspect-[16/7] w-full rounded-2xl shadow-card" />
          )}
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip capitalize">{course.category}</span>
            {course.level && <span className="chip">{course.level}</span>}
            {course.duration && <span className="text-sm text-navy/50">{course.duration}</span>}
          </div>
          <h1 className="mt-3 text-3xl font-extrabold text-navy">{course.title}</h1>
          {course.summary && <p className="mt-3 text-lg text-navy/65">{course.summary}</p>}

          {course.description && (
            <div className="prose mt-8 max-w-none whitespace-pre-wrap text-navy/80">
              {course.description}
            </div>
          )}

          {course.price && (
            <p className="mt-8 text-xl font-bold text-brand">{course.price}</p>
          )}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <ApplyForm courseId={course.id} courseTitle={course.title} />
        </div>
      </div>
    </div>
  );
}
