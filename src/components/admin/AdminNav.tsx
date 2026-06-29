"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/Logo";

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/courses", label: "Courses" },
  { href: "/admin/blogs", label: "Blogs" },
  { href: "/admin/banners", label: "Banners" },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/contacts", label: "Contacts" },
  { href: "/admin/messaging", label: "Messaging" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await createClient().auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-navy/10 bg-white p-4">
      <div className="mb-6 px-2"><Logo className="h-8" /></div>
      <nav className="flex-1 space-y-1">
        {items.map((it) => {
          const active = pathname === it.href || (it.href !== "/admin" && pathname.startsWith(it.href));
          return (
            <Link
              key={it.href}
              href={it.href}
              className={
                "block rounded-lg px-3 py-2 text-sm font-medium transition " +
                (active ? "bg-brand text-white" : "text-navy/70 hover:bg-navy/5")
              }
            >
              {it.label}
            </Link>
          );
        })}
      </nav>
      <button onClick={signOut} className="btn-ghost mt-4 w-full text-sm">
        Sign out
      </button>
      <Link href="/" className="mt-2 text-center text-xs text-navy/50 hover:text-brand">
        View site →
      </Link>
    </aside>
  );
}
