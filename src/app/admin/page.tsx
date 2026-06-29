import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

async function count(table: string) {
  const supabase = createAdminClient();
  const { count } = await supabase.from(table).select("*", { count: "exact", head: true });
  return count ?? 0;
}

export default async function AdminDashboard() {
  const [courses, blogs, applications, contacts, banners] = await Promise.all([
    count("courses"),
    count("blogs"),
    count("applications"),
    count("contact_messages"),
    count("banners"),
  ]);

  const cards = [
    { label: "Courses", value: courses, href: "/admin/courses" },
    { label: "Blogs", value: blogs, href: "/admin/blogs" },
    { label: "Applications", value: applications, href: "/admin/applications" },
    { label: "Contacts", value: contacts, href: "/admin/contacts" },
    { label: "Banners", value: banners, href: "/admin/banners" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-navy">Dashboard</h1>
      <p className="mt-1 text-navy/60">Manage everything on your KnowCode site.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="card p-6 transition hover:border-brand hover:shadow-lg">
            <p className="text-sm font-medium text-navy/60">{c.label}</p>
            <p className="mt-2 text-3xl font-extrabold text-brand">{c.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
