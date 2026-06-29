import Link from "next/link";
import type { Course } from "@/lib/types";

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/courses/${course.slug}`} className="card group overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
      <div className="aspect-[16/9] w-full overflow-hidden bg-brand-50">
        {course.poster_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.poster_url}
            alt={course.title}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-brand/40">
            <span className="text-4xl font-black">&lt;/&gt;</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="mb-2 flex items-center gap-2">
          <span className="chip capitalize">{course.category}</span>
          {course.duration && (
            <span className="text-xs text-navy/50">{course.duration}</span>
          )}
        </div>
        <h3 className="text-lg font-bold text-navy group-hover:text-brand">
          {course.title}
        </h3>
        {course.summary && (
          <p className="mt-1 line-clamp-2 text-sm text-navy/60">{course.summary}</p>
        )}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-brand">
            {course.price || "Enroll"}
          </span>
          <span className="text-sm font-semibold text-navy/70 group-hover:text-brand">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}
