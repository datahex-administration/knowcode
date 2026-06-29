import Link from "next/link";
import type { Course } from "@/lib/types";

// soft brand gradient per category for the placeholder poster
const CAT_GRADIENT: Record<string, string> = {
  coding: "from-brand to-brand-400",
  design: "from-brand-400 to-brand-600",
  gaming: "from-brand-600 to-navy",
  other: "from-brand-400 to-brand",
};

export function CourseCard({ course }: { course: Course }) {
  const grad = CAT_GRADIENT[course.category] ?? CAT_GRADIENT.coding;
  const isAdvanced = (course.level || "").toLowerCase().includes("advanc");

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="card group h-full overflow-hidden transition duration-300 hover:-translate-y-1.5 hover:shadow-lg"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        {course.poster_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.poster_url}
            alt={course.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className={`flex h-full items-center justify-center bg-gradient-to-br ${grad}`}>
            <span className="text-4xl font-black text-white/90 transition duration-500 group-hover:scale-110">
              &lt;/&gt;
            </span>
          </div>
        )}
        {course.level && (
          <span
            className={
              "absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-card " +
              (isAdvanced ? "bg-navy text-white" : "bg-white text-brand")
            }
          >
            {course.level}
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="mb-2 flex items-center gap-2">
          <span className="chip capitalize">{course.category}</span>
          {course.duration && (
            <span className="text-xs text-navy/50">{course.duration}</span>
          )}
        </div>
        <h3 className="text-lg font-bold text-navy transition group-hover:text-brand">
          {course.title}
        </h3>
        {course.summary && (
          <p className="mt-1 line-clamp-2 text-sm text-navy/60">{course.summary}</p>
        )}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-brand">
            {course.price || "Enroll"}
          </span>
          <span className="text-sm font-semibold text-navy/70 transition group-hover:translate-x-1 group-hover:text-brand">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}
