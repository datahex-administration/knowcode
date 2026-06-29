"use client";

import { useState } from "react";

export function ApplyForm({
  courseId,
  courseTitle,
}: {
  courseId: string;
  courseTitle: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      course_id: courseId,
      course_title: courseTitle,
      name: String(fd.get("name") || ""),
      mobile: String(fd.get("mobile") || ""),
      address: String(fd.get("address") || ""),
      gender: String(fd.get("gender") || ""),
      age: fd.get("age") ? Number(fd.get("age")) : null,
    };

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Submission failed");
      setStatus("ok");
      form.reset();
    } catch (err: any) {
      setError(err.message);
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <div className="card p-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand">
          ✓
        </div>
        <h3 className="text-lg font-bold text-navy">Application received!</h3>
        <p className="mt-1 text-sm text-navy/60">
          We&apos;ve sent a WhatsApp confirmation. Our team will contact you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6">
      <h3 className="text-lg font-bold text-navy">Register for this course</h3>
      <p className="-mt-2 text-sm text-navy/55">Free to apply · instant WhatsApp confirmation.</p>

      <div>
        <label className="label" htmlFor="mobile">WhatsApp number *</label>
        <input
          id="mobile"
          name="mobile"
          required
          className="input text-base"
          placeholder="919895123456"
          inputMode="numeric"
          autoComplete="tel"
        />
        <p className="mt-1 text-xs text-navy/50">Include country code, digits only.</p>
      </div>

      <div>
        <label className="label" htmlFor="name">Full name *</label>
        <input id="name" name="name" required className="input text-base" placeholder="Your name" autoComplete="name" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="age">Age</label>
          <input id="age" name="age" type="number" min={5} max={100} className="input" placeholder="18" />
        </div>
        <div>
          <label className="label" htmlFor="gender">Gender</label>
          <select id="gender" name="gender" className="input">
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="address">Address</label>
        <textarea id="address" name="address" rows={2} className="input" placeholder="City, State" />
      </div>

      {status === "error" && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={status === "loading"} className="btn-primary w-full disabled:opacity-60">
        {status === "loading" ? "Submitting…" : "Register Now →"}
      </button>
    </form>
  );
}
