import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Blog } from "@/lib/types";

export const revalidate = 60;

export default async function BlogDetail({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createClient();
  const { data } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", params.slug)
    .eq("published", true)
    .maybeSingle();

  const blog = data as Blog | null;
  if (!blog) notFound();

  return (
    <article className="container-x max-w-3xl py-12">
      <Link href="/blog" className="text-sm font-semibold text-brand">← Back to blog</Link>
      {blog.cover_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={blog.cover_url} alt={blog.title} className="mt-5 w-full rounded-2xl shadow-card" />
      )}
      <h1 className="mt-6 text-3xl font-extrabold text-navy">{blog.title}</h1>
      <p className="mt-2 text-sm text-navy/40">
        {blog.author} · {new Date(blog.created_at).toLocaleDateString()}
      </p>
      <div className="prose mt-8 max-w-none whitespace-pre-wrap text-navy/80">
        {blog.content}
      </div>
    </article>
  );
}
