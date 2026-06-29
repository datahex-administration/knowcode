import type { Blog } from "@/lib/types";

// Deterministic, distinct cover art per blog post — no two look identical.
// Falls back gracefully when a post has no cover_url.
// Picks a gradient angle+colors and a themed SVG composition from the slug/title.

// Brand palette only
const STOPS: [string, string][] = [
  ["#2F6BFF", "#0A1A35"],
  ["#1c45ab", "#5b9bff"],
  ["#0A1A35", "#2356d6"],
  ["#5b9bff", "#1c45ab"],
  ["#2356d6", "#0A1A35"],
  ["#2F6BFF", "#2356d6"],
  ["#0A1A35", "#5b9bff"],
  ["#1c45ab", "#2F6BFF"],
];

// Gradient directions (x1,y1 → x2,y2) to vary angle by hash
const DIRS: [string, string, string, string][] = [
  ["0", "0", "1", "1"],
  ["1", "0", "0", "1"],
  ["0", "0", "1", "0"],
  ["0", "1", "1", "0"],
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

// ── Theme glyph groups ────────────────────────────────────────────────────────

// "vibe" → sparkles + flowing wave
function GlyphVibe({ h }: { h: number }) {
  const oy = (h % 20) - 10; // vertical offset variety
  return (
    <g fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.88">
      {/* wave */}
      <path
        d={`M20 ${112 + oy} q45-38 90 0 q45 38 90 0 q45-38 90 0 q45 38 90 0`}
        strokeWidth="3"
        opacity="0.55"
      />
      <path
        d={`M20 ${130 + oy} q45-30 90 0 q45 30 90 0 q45-30 90 0 q45 30 90 0`}
        strokeWidth="2"
        opacity="0.35"
      />
      {/* sparkles */}
      <g transform="translate(110 70)">
        <line x1="0" y1="-14" x2="0" y2="14" strokeWidth="2.5" />
        <line x1="-14" y1="0" x2="14" y2="0" strokeWidth="2.5" />
        <line x1="-9" y1="-9" x2="9" y2="9" strokeWidth="1.5" />
        <line x1="9" y1="-9" x2="-9" y2="9" strokeWidth="1.5" />
      </g>
      <g transform="translate(280 58)" opacity="0.7">
        <line x1="0" y1="-10" x2="0" y2="10" strokeWidth="2" />
        <line x1="-10" y1="0" x2="10" y2="0" strokeWidth="2" />
        <line x1="-6" y1="-6" x2="6" y2="6" strokeWidth="1.2" />
        <line x1="6" y1="-6" x2="-6" y2="6" strokeWidth="1.2" />
      </g>
      <g transform="translate(200 165)" opacity="0.6">
        <line x1="0" y1="-8" x2="0" y2="8" strokeWidth="1.8" />
        <line x1="-8" y1="0" x2="8" y2="0" strokeWidth="1.8" />
      </g>
    </g>
  );
}

// "ai" → node/network graph
function GlyphAI({ h }: { h: number }) {
  const nodes = [
    [200, 113], [120, 68], [280, 68], [90, 155], [310, 155], [200, 175],
  ] as [number, number][];
  const edges: [number, number][] = [[0,1],[0,2],[0,3],[0,4],[0,5],[1,2],[3,5],[4,5]];
  const r = 6 + (h % 3);
  return (
    <g fill="none" stroke="#ffffff" opacity="0.85">
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a][0]} y1={nodes[a][1]}
          x2={nodes[b][0]} y2={nodes[b][1]}
          stroke="#ffffff" strokeWidth="1.4" opacity="0.45"
        />
      ))}
      {nodes.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={i === 0 ? r + 2 : r} fill="#5b9bff" fillOpacity="0.7" stroke="#ffffff" strokeWidth="1.8" />
      ))}
    </g>
  );
}

// "design" → overlapping circles + grid accent
function GlyphDesign({ h }: { h: number }) {
  const r = 54 + (h % 18);
  return (
    <g fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.82">
      <circle cx="170" cy="113" r={r} strokeOpacity="0.7" />
      <circle cx="230" cy="113" r={r} strokeOpacity="0.7" />
      <circle cx="200" cy="88" r={r * 0.72} strokeOpacity="0.5" />
      {/* crosshair center */}
      <line x1="200" y1="80" x2="200" y2="145" strokeWidth="1.2" opacity="0.4" />
      <line x1="145" y1="113" x2="255" y2="113" strokeWidth="1.2" opacity="0.4" />
    </g>
  );
}

// "game" → pixel controller
function GlyphGame({ h: _h }: { h: number }) {
  return (
    <g fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.88">
      {/* body */}
      <rect x="130" y="90" width="140" height="70" rx="30" fill="#2F6BFF" fillOpacity="0.35" />
      {/* d-pad left stick */}
      <line x1="164" y1="118" x2="164" y2="132" />
      <line x1="157" y1="125" x2="171" y2="125" />
      {/* buttons */}
      <circle cx="236" cy="118" r="5" fill="#5b9bff" fillOpacity="0.6" />
      <circle cx="250" cy="125" r="5" fill="#2F6BFF" fillOpacity="0.6" />
      <circle cx="236" cy="132" r="5" fill="#2356d6" fillOpacity="0.6" />
      <circle cx="222" cy="125" r="5" fill="#1c45ab" fillOpacity="0.6" />
      {/* center buttons */}
      <rect x="189" y="119" width="10" height="7" rx="2" fill="#ffffff" fillOpacity="0.3" />
      <rect x="202" y="119" width="10" height="7" rx="2" fill="#ffffff" fillOpacity="0.3" />
    </g>
  );
}

// "web" / "code" → </> + window chrome
function GlyphWeb({ h: _h }: { h: number }) {
  return (
    <g fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.88">
      {/* window chrome */}
      <rect x="100" y="68" width="200" height="130" rx="8" fill="#0A1A35" fillOpacity="0.45" />
      <line x1="100" y1="88" x2="300" y2="88" strokeWidth="1.5" opacity="0.5" />
      <circle cx="116" cy="78" r="4" fill="#ffffff" fillOpacity="0.4" />
      <circle cx="131" cy="78" r="4" fill="#ffffff" fillOpacity="0.3" />
      <circle cx="146" cy="78" r="4" fill="#ffffff" fillOpacity="0.2" />
      {/* </> glyph */}
      <path d="M163 133 l-22-20 22-20" strokeWidth="3" />
      <path d="M237 133 l22-20-22-20" strokeWidth="3" />
      <line x1="208" y1="100" x2="192" y2="146" strokeWidth="2.5" />
    </g>
  );
}

// default → abstract circuit
function GlyphCircuit({ h }: { h: number }) {
  const ox = (h % 30) - 15;
  return (
    <g fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" opacity="0.82">
      {/* traces */}
      <path d={`M${80 + ox} 113 h40 v-30 h60 v30 h40`} opacity="0.55" />
      <path d={`M${80 + ox} 113 h40 v30 h60 v-30 h40`} opacity="0.4" />
      <path d="M200 83 v-20" opacity="0.5" />
      <path d="M200 143 v20" opacity="0.5" />
      {/* pads */}
      {([
        [200, 113], [140, 113], [260, 113], [200, 83], [200, 143],
      ] as [number, number][]).map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={i === 0 ? 10 : 6}
          fill="#2F6BFF" fillOpacity="0.65" stroke="#ffffff" strokeWidth="1.8" />
      ))}
    </g>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function BlogPoster({ blog, className = "" }: { blog: Blog; className?: string }) {
  const seed = blog.slug || blog.title || "x";
  const h = hash(seed);
  const key = `${blog.title} ${blog.slug}`.toLowerCase();

  // Pick gradient stops + direction
  const [c1, c2] = STOPS[h % STOPS.length];
  const [x1, y1, x2, y2] = DIRS[(h >> 4) % DIRS.length];

  // Pick background pattern (0=dots, 1=grid, 2=diagonal, 3=rings)
  const pat = h % 4;

  // Pick theme by keyword
  const theme =
    key.includes("vibe")                          ? "vibe"    :
    key.includes("ai") || key.includes("gpt") ||
    key.includes("llm") || key.includes("model")  ? "ai"      :
    key.includes("design") || key.includes("ui") ||
    key.includes("ux")                            ? "design"  :
    key.includes("game") || key.includes("pixel") ? "game"    :
    key.includes("web") || key.includes("website")||
    key.includes("code") || key.includes("dev")   ? "web"     :
                                                    "circuit";

  // Unique id prefix so multiple posters on one page never collide
  const pid = `bp-${h % 997}`;

  return (
    <svg
      viewBox="0 0 400 225"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id={`${pid}-g`} x1={x1} y1={y1} x2={x2} y2={y2}>
          <stop offset="0" stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>

        {/* Background texture patterns */}
        {pat === 0 && (
          <pattern id={`${pid}-p`} width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="4" r="2" fill="#ffffff" opacity="0.14" />
          </pattern>
        )}
        {pat === 1 && (
          <pattern id={`${pid}-p`} width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.14" />
          </pattern>
        )}
        {pat === 2 && (
          <pattern id={`${pid}-p`} width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="20" stroke="#ffffff" strokeWidth="2.5" opacity="0.11" />
          </pattern>
        )}
        {pat === 3 && (
          <pattern id={`${pid}-p`} width="48" height="48" patternUnits="userSpaceOnUse">
            <circle cx="24" cy="24" r="13" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.12" />
          </pattern>
        )}
      </defs>

      {/* Gradient background */}
      <rect width="400" height="225" fill={`url(#${pid}-g)`} />
      {/* Texture overlay */}
      <rect width="400" height="225" fill={`url(#${pid}-p)`} />

      {/* Theme illustration */}
      {theme === "vibe"    && <GlyphVibe    h={h} />}
      {theme === "ai"      && <GlyphAI      h={h} />}
      {theme === "design"  && <GlyphDesign  h={h} />}
      {theme === "game"    && <GlyphGame    h={h} />}
      {theme === "web"     && <GlyphWeb     h={h} />}
      {theme === "circuit" && <GlyphCircuit h={h} />}
    </svg>
  );
}
