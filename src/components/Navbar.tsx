"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "./Logo";

const links = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-navy/10 bg-white/85 backdrop-blur">
      <nav className="container-x flex h-16 items-center justify-between">
        <Link href="/" aria-label="KnowCode Academy home">
          <Logo />
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-navy/70 transition hover:text-brand"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/courses" className="btn-primary">
            Apply Now
          </Link>
        </div>

        <button
          className="md:hidden rounded-lg p-2 text-navy"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-navy/10 bg-white md:hidden">
          <div className="container-x flex flex-col gap-1 py-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2 text-navy/80 hover:bg-navy/5"
              >
                {l.label}
              </Link>
            ))}
            <Link href="/courses" className="btn-primary mt-2" onClick={() => setOpen(false)}>
              Apply Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
