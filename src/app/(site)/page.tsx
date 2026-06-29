import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CourseCard } from "@/components/CourseCard";
import { CATEGORIES, type Banner, type Course } from "@/lib/types";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = createClient();

  const [{ data: banners }, { data: courses }] = await Promise.all([
    supabase.from("banners").select("*").eq("active", true).order("sort_order"),
    supabase.from("courses").select("*").eq("published", true).order("created_at", { ascending: false }).limit(6),
  ]);

  const hero = (banners as Banner[] | null)?.[0];
  const list = (courses as Course[] | null) ?? [];

  return (
    <>
      {/* HERO */}
      <section className="hero-bg">
        <div className="container-x grid items-center gap-10 py-20 md:grid-cols-2 md:py-28">
          <div>
            <span className="chip mb-4">Skill Development Academy</span>
            <h1 className="text-4xl font-extrabold leading-tight text-navy md:text-5xl">
              {hero?.title || (
                <>
                  Learn to build.{" "}
                  <span className="text-brand">Code the vibe.</span>
                </>
              )}
            </h1>
            <p className="mt-5 max-w-md text-lg text-navy/65">
              {hero?.subtitle ||
                "Hands-on courses in coding, design, gaming and AI-powered vibe-coding. Build real products from day one."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/courses" className="btn-primary">Browse Courses</Link>
              <Link href="/contact" className="btn-ghost">Talk to us</Link>
            </div>
          </div>

          <div className="relative">
            {hero?.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={hero.image_url} alt={hero.title || "KnowCode"} className="w-full rounded-3xl shadow-card" />
            ) : (
              <div className="card flex aspect-[4/3] items-center justify-center bg-white">
                <span className="text-7xl font-black text-brand/30">&lt;/&gt;</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container-x py-16">
        <h2 className="text-2xl font-bold text-navy">Explore by skill</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.key}
              href={`/courses?category=${c.key}`}
              className="card flex items-center justify-between p-5 transition hover:border-brand hover:shadow-lg"
            >
              <span className="font-semibold text-navy">{c.label}</span>
              <span className="text-brand">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section className="container-x py-8">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold text-navy">Featured courses</h2>
          <Link href="/courses" className="text-sm font-semibold text-brand">View all →</Link>
        </div>
        {list.length === 0 ? (
          <p className="text-navy/50">No courses published yet. Add some from the admin panel.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="container-x py-16">
        <div className="rounded-3xl bg-navy px-8 py-12 text-center text-white md:py-16">
          <h2 className="text-3xl font-bold">Ready to start your journey?</h2>
          <p className="mx-auto mt-3 max-w-lg text-white/70">
            Apply in minutes. Get a WhatsApp confirmation instantly — our team reaches out personally.
          </p>
          <Link href="/courses" className="btn-primary mt-7">Apply Now</Link>
        </div>
      </section>
    </>
  );
}
