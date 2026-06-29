"use client";

import { usePathname } from "next/navigation";
import { AdminNav } from "./AdminNav";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Login page is full-screen, no sidebar.
  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-navy-50">
      <AdminNav />
      <div className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-5xl p-6 md:p-10">{children}</div>
      </div>
    </div>
  );
}
