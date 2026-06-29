// KnowCode Academy logo — split brain (circuit + code) in brand colors.
// Drop a real logo.png into /public to swap, or keep this scalable SVG.
export function Logo({ className = "h-9 w-auto" }: { className?: string }) {
  return (
    <span className={"inline-flex items-center gap-2 " + className}>
      <svg viewBox="0 0 64 64" className="h-full w-auto" aria-hidden>
        {/* left hemisphere — navy, circuit */}
        <path
          d="M31 10c-8 0-13 5-13 11-4 1-6 4-6 8s2 6 5 7c0 5 4 9 9 9 2 0 4-1 5-2V10z"
          fill="#0A1A35"
        />
        {/* right hemisphere — bright blue, code */}
        <path
          d="M33 10c8 0 13 5 13 11 4 1 6 4 6 8s-2 6-5 7c0 5-4 9-9 9-2 0-4-1-5-2V10z"
          fill="#2F6BFF"
        />
        {/* circuit dots */}
        <g fill="#fff">
          <circle cx="24" cy="24" r="1.6" />
          <circle cx="20" cy="33" r="1.6" />
          <circle cx="26" cy="40" r="1.6" />
        </g>
        <g stroke="#fff" strokeWidth="1.4" fill="none">
          <path d="M24 24h-4M20 33h6M26 40v-4" />
        </g>
        {/* code </> */}
        <g stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M41 26l-3 6 3 6" />
          <path d="M47 26l3 6-3 6" />
        </g>
      </svg>
      <span className="text-lg font-extrabold tracking-tight">
        <span className="text-navy">Know</span>
        <span className="text-brand">Code</span>
      </span>
    </span>
  );
}
