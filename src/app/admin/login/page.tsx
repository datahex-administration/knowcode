"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/Logo";

export default function AdminLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const raw = String(fd.get("username")).trim();
    // Accept a mobile number (digits) or a full email. Mobile maps to a
    // synthetic email so it works with Supabase email/password auth.
    const email = raw.includes("@") ? raw : `${raw.replace(/[^\d]/g, "")}@knowcode.academy`;
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: String(fd.get("password")),
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-50 px-5">
      <div className="card w-full max-w-sm p-8">
        <div className="mb-6 flex justify-center"><Logo className="h-10" /></div>
        <h1 className="text-center text-xl font-bold text-navy">Admin Login</h1>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="username">Mobile number</label>
            <input id="username" name="username" type="text" inputMode="text" autoComplete="username" placeholder="9656550933" required className="input" />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required className="input" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-navy/50">
          Sign in with your registered mobile number.
        </p>
      </div>
    </div>
  );
}
