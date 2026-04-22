/**
 * VideoSection — jazzdesign1 1:1: meleg piros→narancs gradient keret,
 * színpad-sziluett SVG (énekesnő + trombitás), középen pulzáló narancs
 * play-gomb, bal alul "AFTERMOVIE · BOHÉM 2025" Bebas Neue felirat.
 */

import Link from "next/link";

type VideoSectionProps = {
  videoUrl?: string;
  title?: string;
  caption?: string;
};

export default function VideoSection({
  videoUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  title    = "Bohém Jazzfőváros — Fesztivál videó",
  caption  = "AFTERMOVIE · BOHÉM 2025",
}: VideoSectionProps) {
  return (
    <section
      id="video"
      aria-label="Fesztivál videó"
      className="relative z-[2] px-5 py-20 sm:px-8"
    >
      <div className="mx-auto max-w-[1160px]">
        <Link
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={title}
          className="group relative block aspect-video overflow-hidden rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.25)]"
          style={{
            background:
              "linear-gradient(135deg, #8B2E2E, #C74A4A, #E07B4A)",
          }}
        >
          {/* Színpad illusztráció SVG */}
          <div
            className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03]"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.45)), radial-gradient(ellipse at 35% 40%, rgba(255,180,120,0.6), transparent 50%), linear-gradient(135deg, #4a2020 0%, #8a3030 35%, #c95b3a 70%, #e89550 100%)",
            }}
          >
            <svg
              viewBox="0 0 800 450"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full"
            >
              <defs>
                <radialGradient id="vidSpot1" cx="30%" cy="30%">
                  <stop offset="0%" stopColor="rgba(255,220,140,0.8)" />
                  <stop offset="100%" stopColor="rgba(255,220,140,0)" />
                </radialGradient>
                <radialGradient id="vidSpot2" cx="70%" cy="20%">
                  <stop offset="0%" stopColor="rgba(255,170,100,0.6)" />
                  <stop offset="100%" stopColor="rgba(255,170,100,0)" />
                </radialGradient>
              </defs>
              <rect width="800" height="450" fill="url(#vidSpot1)" />
              <rect width="800" height="450" fill="url(#vidSpot2)" />

              {/* Közönség sziluett */}
              <g fill="rgba(0,0,0,0.55)">
                <rect x="0" y="380" width="800" height="70" />
                <circle cx="60"  cy="380" r="22" />
                <circle cx="110" cy="378" r="20" />
                <circle cx="160" cy="382" r="24" />
                <circle cx="220" cy="376" r="20" />
                <circle cx="280" cy="380" r="22" />
                <circle cx="340" cy="378" r="20" />
                <circle cx="400" cy="380" r="24" />
                <circle cx="460" cy="376" r="20" />
                <circle cx="520" cy="380" r="22" />
                <circle cx="580" cy="378" r="20" />
                <circle cx="640" cy="380" r="24" />
                <circle cx="700" cy="376" r="20" />
                <circle cx="760" cy="380" r="22" />
              </g>

              {/* Énekesnő sziluett */}
              <g fill="rgba(20,8,8,0.85)">
                <ellipse cx="340" cy="180" rx="34" ry="40" />
                <rect x="310" y="210" width="60" height="130" rx="18" />
                <rect
                  x="280"
                  y="220"
                  width="40"
                  height="14"
                  rx="4"
                  transform="rotate(-15 300 230)"
                />
              </g>

              {/* Trombitás sziluett */}
              <g fill="rgba(20,8,8,0.85)">
                <ellipse cx="520" cy="200" rx="28" ry="34" />
                <rect x="490" y="225" width="60" height="120" rx="16" />
                <path
                  d="M548 230 L610 210 L620 205 L625 218 L615 225 L550 245 Z"
                  fill="#E6C474"
                />
                <circle cx="625" cy="212" r="14" fill="#FFC93C" />
              </g>
            </svg>
          </div>

          {/* Pulzáló narancs play gomb középen */}
          <span className="absolute inset-0 m-auto grid h-[110px] w-[110px] place-items-center rounded-full bg-orange-500 animate-pulse-ring transition-transform duration-[250ms] group-hover:scale-[1.08]">
            <span
              aria-hidden="true"
              className="ml-1.5 h-0 w-0 border-y-[18px] border-l-[28px] border-y-transparent border-l-white"
            />
          </span>

          {/* Bal alsó Bebas Neue felirat */}
          <span
            aria-hidden="true"
            className="absolute bottom-5 left-6 font-display text-[32px] uppercase tracking-[0.05em] text-white"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
          >
            {caption}
          </span>
        </Link>
      </div>
    </section>
  );
}
