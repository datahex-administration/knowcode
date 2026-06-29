import type { Course } from "@/lib/types";

// Deterministic, distinct poster art per course — no two look identical.
// Picks a gradient + SVG pattern + category icon from the course slug.

const GRADIENTS = [
  ["#2F6BFF", "#5b9bff"],
  ["#1c45ab", "#2F6BFF"],
  ["#2356d6", "#0A1A35"],
  ["#5b9bff", "#2356d6"],
  ["#0A1A35", "#2F6BFF"],
  ["#2F6BFF", "#1c45ab"],
];

const ICONS: Record<string, JSX.Element> = {
  coding: <path d="M9 8l-5 5 5 5M15 8l5 5-5 5" />,
  design: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4v16M4 12h16" />
    </>
  ),
  gaming: (
    <>
      <rect x="2" y="7" width="20" height="10" rx="5" />
      <path d="M7 11v2M6 12h2M16 12h.01M18 11h.01" />
    </>
  ),
  other: <path d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 21l-4.9 2.6.9-5.5-4-3.9 5.5-.8z" />,
};

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function CoursePoster({ course, className = "" }: { course: Course; className?: string }) {
  const h = hash(course.slug || course.title || "x");
  const [c1, c2] = GRADIENTS[h % GRADIENTS.length];
  const pattern = h % 4; // 0 dots, 1 grid, 2 diagonal, 3 rings
  const icon = ICONS[course.category] ?? ICONS.coding;
  const pid = `pat-${h % 997}`;

  return (
    <svg viewBox="0 0 400 225" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${pid}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>

        {pattern === 0 && (
          <pattern id={pid} width="26" height="26" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="4" r="2.2" fill="#ffffff" opacity="0.18" />
          </pattern>
        )}
        {pattern === 1 && (
          <pattern id={pid} width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M30 0H0V30" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.16" />
          </pattern>
        )}
        {pattern === 2 && (
          <pattern id={pid} width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="22" stroke="#ffffff" strokeWidth="3" opacity="0.14" />
          </pattern>
        )}
        {pattern === 3 && (
          <pattern id={pid} width="50" height="50" patternUnits="userSpaceOnUse">
            <circle cx="25" cy="25" r="14" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.14" />
          </pattern>
        )}
      </defs>

      <rect width="400" height="225" fill={`url(#${pid}-g)`} />
      <rect width="400" height="225" fill={`url(#${pid})`} />

      {/* category icon, centered */}
      <g
        transform="translate(200 112) scale(4.2) translate(-12 -12)"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.92"
      >
        {icon}
      </g>
    </svg>
  );
}
