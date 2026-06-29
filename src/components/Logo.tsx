"use client";

import { useState } from "react";

// KnowCode Academy logo.
// Drop your real logo at /public/logo.png (or .svg) and it is used automatically.
// Until then, a clean built-in SVG mark + wordmark is shown as a fallback.
export function Logo({ className = "h-10 w-auto" }: { className?: string }) {
  const [useFallback, setUseFallback] = useState(false);

  if (!useFallback) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/logo.png"
        alt="KnowCode Academy"
        className={className}
        onError={() => setUseFallback(true)}
      />
    );
  }

  return (
    <span className={"inline-flex items-center gap-2 " + className}>
      <svg viewBox="0 0 48 48" className="h-full w-auto" aria-hidden>
        <rect x="3" y="3" width="42" height="42" rx="12" fill="#0A1A35" />
        <g
          stroke="#5b9bff"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 17l-7 7 7 7" />
          <path d="M29 17l7 7-7 7" stroke="#2F6BFF" />
        </g>
      </svg>
      <span className="text-lg font-extrabold tracking-tight">
        <span className="text-navy">Know</span>
        <span className="text-brand">Code</span>
      </span>
    </span>
  );
}
