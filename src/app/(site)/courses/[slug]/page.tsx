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

          {/* mobile CTA — jumps to the form */}
          <a href="#apply" className="btn-primary mt-6 w-full lg:hidden">Register for this course →</a>
        </div>

        <div id="apply" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
          <ApplyForm courseId={course.id} courseTitle={course.title} />
        </div>
      </div>

      {/* sticky bottom registration bar on mobile */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-navy/10 bg-white/95 p-3 backdrop-blur lg:hidden">
        <div className="container-x flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-navy">{course.title}</p>
            <p className="text-xs text-navy/55">{course.price || "Free to apply"}</p>
          </div>
          <a href="#apply" className="btn-primary shrink-0 px-5 py-2.5 text-sm">Register Now</a>
        </div>
      </div>
      {/* spacer so content isn't hidden behind the sticky bar */}
      <div className="h-20 lg:hidden" />
    </div>
  );
}
