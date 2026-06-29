import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Reveal } from "@/components/Reveal";
import type { Blog } from "@/lib/types";

export const revalidate = 60;

export default async function BlogPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("blogs")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });
  const blogs = (data as Blog[] | null) ?? [];

  return (
    <div className="container-x py-14">
      <h1 className="text-3xl font-extrabold text-navy">Blog</h1>
      <p className="mt-2 text-navy/60">Guides, news and ideas from KnowCode Academy.</p>

      {blogs.length === 0 ? (
        <p className="mt-10 text-navy/50">No posts yet.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((b, i) => (
            <Reveal key={b.id} delay={i * 80}>
              <Link href={`/blog/${b.slug}`} className="card group h-full overflow-hidden transition duration-300 hover:-translate-y-1.5 hover:shadow-lg">
                <div className="aspect-[16/9] overflow-hidden">
                  {b.cover_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={b.cover_url} alt={b.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand to-brand-400 text-3xl font-black text-white/90">
                      ✎
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-navy transition group-hover:text-brand">{b.title}</h3>
                  {b.excerpt && <p className="mt-1 line-clamp-2 text-sm text-navy/60">{b.excerpt}</p>}
                  <p className="mt-3 text-xs text-navy/40">
                    {b.author} · {new Date(b.created_at).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
