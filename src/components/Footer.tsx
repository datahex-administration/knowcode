import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-navy/10 bg-navy text-white/80">
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <span className="inline-flex rounded-xl bg-white p-2 shadow-card">
            <Logo className="h-12 w-auto max-w-[160px] object-contain" />
          </span>
          <p className="mt-4 max-w-sm text-sm text-white/60">
            KnowCode Academy — skill development in coding, design, gaming and
            modern vibe-coding. Learn by building real products.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/courses" className="hover:text-white">Courses</Link></li>
            <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link href="/admin" className="hover:text-white">Admin</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Get in touch</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li>hello@knowcode.academy</li>
            <li>WhatsApp enabled support</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} KnowCode Academy. All rights reserved.
      </div>
    </footer>
  );
}
