"use client";

import { useTheme } from "@/components/theme/ThemeContext";

/* ── D3 dísz SVG-k (korábban külön fájl — egy modulban stabilabb az RSC manifest) ── */

function Sailboat({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 80 54" fill="none" style={{ display: "block", ...style }} aria-hidden="true">
      <path d="M8 38 Q40 46 72 38 L66 48 Q40 54 14 48 Z" fill="rgba(253,246,227,0.80)" />
      <line x1="40" y1="6" x2="40" y2="40" stroke="rgba(253,246,227,0.85)" strokeWidth="1.5" />
      <path d="M40 8 L40 38 L12 36 Z" fill="rgba(232,130,58,0.75)" />
      <path d="M40 14 L40 37 L62 34 Z" fill="rgba(249,178,51,0.70)" />
    </svg>
  );
}

function SmallBoat({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 50 28" fill="none" style={{ display: "block", ...style }} aria-hidden="true">
      <path d="M4 16 Q25 22 46 16 L42 24 Q25 28 8 24 Z" fill="rgba(253,246,227,0.70)" />
      <rect x="18" y="6" width="14" height="10" rx="2" fill="rgba(249,178,51,0.65)" />
      <line x1="25" y1="3" x2="25" y2="6" stroke="rgba(253,246,227,0.75)" strokeWidth="1.5" />
    </svg>
  );
}

function LifeRing({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 60 60" fill="none" style={{ display: "block", ...style }} aria-hidden="true">
      <circle cx="30" cy="30" r="27" stroke="rgba(253,246,227,0.75)" strokeWidth="3" fill="none" />
      <circle cx="30" cy="30" r="17" stroke="rgba(253,246,227,0.75)" strokeWidth="3" fill="none" />
      <path d="M30 3 A27 27 0 0 1 56.4 16.5 L47.4 21.3 A17 17 0 0 0 30 13 Z" fill="rgba(220,60,60,0.75)" />
      <path d="M30 57 A27 27 0 0 1 3.6 43.5 L12.6 38.7 A17 17 0 0 0 30 47 Z" fill="rgba(220,60,60,0.75)" />
      <path d="M3 30 A27 27 0 0 1 16.5 3.6 L21.3 12.6 A17 17 0 0 0 13 30 Z" fill="rgba(220,60,60,0.75)" />
      <path d="M57 30 A27 27 0 0 1 43.5 56.4 L38.7 47.4 A17 17 0 0 0 47 30 Z" fill="rgba(220,60,60,0.75)" />
    </svg>
  );
}

function Lighthouse({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 36 80" fill="none" style={{ display: "block", ...style }} aria-hidden="true">
      <path d="M12 70 L10 28 L26 28 L24 70 Z" fill="rgba(253,246,227,0.72)" />
      <rect x="10.5" y="37" width="15" height="7" fill="rgba(220,60,60,0.65)" />
      <rect x="10.5" y="54" width="14" height="7" fill="rgba(220,60,60,0.65)" />
      <rect x="8" y="20" width="20" height="9" rx="2" fill="rgba(249,178,51,0.80)" />
      <circle cx="18" cy="24" r="4" fill="rgba(255,240,140,0.90)"
        style={{ animation: "d3-lighthouse-blink 4s ease-in-out infinite" }} />
      <path d="M18 16 L15 4 M18 16 L22 3 M18 16 L27 9 M18 16 L9 9"
        stroke="rgba(255,240,140,0.45)" strokeWidth="1.2" strokeLinecap="round"
        style={{ animation: "d3-lighthouse-blink 4s ease-in-out infinite" }} />
      <rect x="8" y="68" width="20" height="8" rx="1" fill="rgba(180,180,160,0.55)" />
    </svg>
  );
}

function Birds({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 140 30" fill="none" style={{ display: "block", ...style }} aria-hidden="true">
      <path d="M0 15 Q7 7 14 15" stroke="rgba(253,246,227,0.60)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M22 12 Q29 4 36 12" stroke="rgba(253,246,227,0.60)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M48 17 Q55 9 62 17" stroke="rgba(253,246,227,0.45)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

type BoatItem = {
  type: "sailboat" | "small" | "lifering" | "lighthouse" | "birds";
  width: number;
  duration: string;
  delay: string;
  flip?: boolean;
  opacity?: number;
};

const D3_ELEMENTS: BoatItem[] = [
  { type: "birds", width: 130, duration: "30s", delay: "0s" },
  { type: "birds", width: 90, duration: "44s", delay: "-18s" },
  { type: "birds", width: 100, duration: "52s", delay: "-30s" },
  { type: "birds", width: 80, duration: "38s", delay: "-8s" },
  { type: "sailboat", width: 110, duration: "50s", delay: "-15s" },
  { type: "sailboat", width: 80, duration: "66s", delay: "-35s", flip: true },
  { type: "small", width: 65, duration: "34s", delay: "-6s" },
  { type: "small", width: 50, duration: "42s", delay: "-22s", flip: true },
  { type: "sailboat", width: 90, duration: "58s", delay: "-45s" },
  { type: "lifering", width: 48, duration: "5.5s", delay: "-2s", opacity: 0.85 },
  { type: "lifering", width: 38, duration: "7s", delay: "-4s", opacity: 0.65 },
  { type: "lighthouse", width: 44, duration: "0s", delay: "0s" },
];

function d3RenderInSlot(el: BoatItem, index: number) {
  const isSailing = el.type === "sailboat" || el.type === "small";
  const isBird = el.type === "birds";
  const isRing = el.type === "lifering";
  const isLight = el.type === "lighthouse";

  const sailAnim = el.flip ? "d3-sail-right" : "d3-sail-left";
  const birdAnim = el.flip ? "d3-bird-right" : "d3-bird";

  const style: React.CSSProperties = {
    position: "absolute",
    opacity: el.opacity ?? 1,
  };

  if (isSailing) {
    style.left = 0;
    style.bottom = "8%";
    style.width = el.width;
    style.animation = `${sailAnim} ${el.duration} linear infinite`;
    style.animationDelay = el.delay;
  } else if (isBird) {
    style.right = "-10vw";
    style.top = "38%";
    style.width = el.width;
    style.animation = `${birdAnim} ${el.duration} linear infinite`;
    style.animationDelay = el.delay;
  } else if (isRing) {
    const positions = ["18%", "45%", "70%"];
    style.left = positions[index % positions.length];
    style.bottom = "12%";
    style.width = el.width;
    style.animation = `d3-life-float ${el.duration} ease-in-out infinite`;
    style.animationDelay = el.delay;
  } else if (isLight) {
    style.right = "5%";
    style.bottom = "0";
    style.width = el.width;
  }

  switch (el.type) {
    case "sailboat":
      return <Sailboat style={style} />;
    case "small":
      return <SmallBoat style={style} />;
    case "lifering":
      return <LifeRing style={style} />;
    case "lighthouse":
      return <Lighthouse style={style} />;
    case "birds":
      return <Birds style={style} />;
    default:
      return null;
  }
}

function D3AnimatedLayer() {
  const { theme } = useTheme();
  if (theme !== "3") return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-x-hidden overflow-y-visible"
    >
      <div className="flex h-full min-h-full flex-col">
        {D3_ELEMENTS.map((el, i) => (
          <div
            key={`d3-slot-${el.type}-${i}`}
            className="relative min-h-[52px] flex-1 basis-0 overflow-hidden sm:min-h-[60px]"
          >
            {d3RenderInSlot(el, i)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <main id="main-content" className="relative">
      <D3AnimatedLayer />
      <div className="relative z-[1]">{children}</div>
    </main>
  );
}
