import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CourseCard } from "@/components/CourseCard";
import { SkillBlocks } from "@/components/SkillBlocks";
import { Reveal } from "@/components/Reveal";
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
        {/* floating decorative shapes */}
        <div className="pointer-events-none absolute -left-16 top-10 h-56 w-56 animate-blob bg-brand/10 blur-2xl" aria-hidden />
        <div className="pointer-events-none absolute -right-10 bottom-0 h-64 w-64 animate-blob bg-brand-400/10 blur-2xl [animation-delay:3s]" aria-hidden />

        <div className="container-x relative grid items-center gap-10 py-20 md:grid-cols-2 md:py-28">
          <div className="[animation:fade-up_0.7s_ease-out]">
            <span className="chip mb-4">Skill Development Academy</span>
            <h1 className="text-4xl font-extrabold leading-tight text-navy md:text-5xl">
              {hero?.title || (
                <>
                  Learn to build.{" "}
                  <span className="text-gradient">Code the vibe.</span>
                </>
              )}
            </h1>
            <p className="mt-5 max-w-md text-lg text-navy/65">
              {hero?.subtitle ||
                "Hands-on courses in coding, design, gaming and AI-powered vibe-coding. Start at the basics, go all the way to advanced."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/courses" className="btn-primary">Browse Courses</Link>
              <Link href="/contact" className="btn-ghost">Talk to us</Link>
            </div>
          </div>

          <div className="relative [animation:pop_0.7s_ease-out_0.15s_both]">
            {hero?.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={hero.image_url} alt={hero.title || "KnowCode"} className="w-full rounded-3xl shadow-card" />
            ) : (
              <div className="relative mx-auto aspect-square w-full max-w-sm">
                {/* animated blob graphic with code mark */}
                <div className="absolute inset-0 animate-blob bg-gradient-to-br from-brand to-brand-400 shadow-card" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="animate-float text-7xl font-black text-white">&lt;/&gt;</span>
                </div>
                {/* floating chips */}
                <span className="card absolute -left-4 top-8 animate-float-slow px-3 py-1.5 text-xs font-semibold text-navy">React</span>
                <span className="card absolute -right-2 top-24 animate-float px-3 py-1.5 text-xs font-semibold text-brand [animation-delay:1s]">Figma</span>
                <span className="card absolute bottom-10 left-2 animate-float-slow px-3 py-1.5 text-xs font-semibold text-navy [animation-delay:2s]">Unity</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SKILL BLOCKS */}
      <SkillBlocks />

      {/* CATEGORIES */}
      <section className="container-x py-8">
        <Reveal>
          <h2 className="text-2xl font-bold text-navy">Explore by skill</h2>
        </Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.key} delay={i * 70}>
              <Link
                href={`/courses?category=${c.key}`}
                className="card group flex items-center justify-between p-5 transition hover:-translate-y-0.5 hover:border-brand hover:shadow-lg"
              >
                <span className="font-semibold text-navy">{c.label}</span>
                <span className="text-brand transition group-hover:translate-x-1">→</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section className="container-x py-12">
        <Reveal>
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-bold text-navy">Featured courses</h2>
            <Link href="/courses" className="text-sm font-semibold text-brand">View all →</Link>
          </div>
        </Reveal>
        {list.length === 0 ? (
          <p className="text-navy/50">No courses published yet. Add some from the admin panel.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((c, i) => (
              <Reveal key={c.id} delay={i * 80}>
                <CourseCard course={c} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="container-x py-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-navy px-8 py-12 text-center text-white md:py-16">
            <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 animate-blob bg-brand/30 blur-2xl" aria-hidden />
            <h2 className="relative text-3xl font-bold">Ready to start your journey?</h2>
            <p className="relative mx-auto mt-3 max-w-lg text-white/70">
              Apply in minutes. Get a WhatsApp confirmation instantly — our team reaches out personally.
            </p>
            <Link href="/courses" className="btn-primary relative mt-7">Apply Now</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
