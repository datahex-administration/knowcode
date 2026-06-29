import { Reveal } from "./Reveal";

// Six simple "what you'll learn" blocks with inline SVG icons + brand gradients.
const BLOCKS = [
  {
    title: "Coding",
    desc: "HTML, CSS, JavaScript and real logic — from zero to your first site.",
    icon: (
      <path d="M9 8l-5 5 5 5M15 8l5 5-5 5" />
    ),
  },
  {
    title: "Web Development",
    desc: "React, Next.js and databases to build & ship full web apps.",
    icon: (
      <>
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path d="M3 9h18M8 21h8" />
      </>
    ),
  },
  {
    title: "UI / UX Design",
    desc: "Figma, color, type and design systems for clean interfaces.",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3v18M3 12h18" />
      </>
    ),
  },
  {
    title: "Game Development",
    desc: "Build playable 2D & 3D games with Unity and game logic.",
    icon: (
      <>
        <rect x="2" y="7" width="20" height="10" rx="5" />
        <path d="M7 11v2M6 12h2M16 12h.01M18 11h.01" />
      </>
    ),
  },
  {
    title: "AI & Vibe Coding",
    desc: "Build faster with AI tools — prompt, generate and ship products.",
    icon: (
      <>
        <path d="M12 3l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4z" />
      </>
    ),
  },
  {
    title: "Career Mentoring",
    desc: "Portfolio, projects and guidance to get you job-ready.",
    icon: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
      </>
    ),
  },
];

export function SkillBlocks() {
  return (
    <section className="container-x py-16">
      <Reveal>
        <h2 className="text-2xl font-bold text-navy md:text-3xl">What you&apos;ll learn</h2>
        <p className="mt-2 max-w-lg text-navy/60">
          Simple, hands-on skills — start at the basics, go all the way to advanced.
        </p>
      </Reveal>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {BLOCKS.map((b, i) => (
          <Reveal key={b.title} delay={i * 80}>
            <div className="card group h-full p-6 transition hover:-translate-y-1 hover:border-brand hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand transition group-hover:bg-brand group-hover:text-white">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {b.icon}
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-bold text-navy">{b.title}</h3>
              <p className="mt-1 text-sm text-navy/60">{b.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
