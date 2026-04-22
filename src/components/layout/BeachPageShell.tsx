import type { ReactNode } from "react";

/**
 * BeachPageShell — egységes aloldal-szerkezet a főoldal design-nyelvén.
 *
 * Struktúra:
 *  1. Rövid `.hero-sky` gradiens FEJLÉC sáv (eyebrow + title + subtitle)
 *     — lebegő buborékokkal, a főoldal hero hangulatához illeszkedően,
 *     de nem full-screen: csak egy keskeny csík ~280px magas.
 *  2. Sötét teal (`bg-ink-800`) CONTENT szekció, ahol a gyermek kártyák
 *     renderelődnek. Ez konzisztens a főoldal nem-hero szekcióival.
 *  3. Letisztult átmenet hullám-elválasztó nélkül.
 *
 * Ez egyben frissíti mind a 9 aloldalt (lineup, program, info, szállás,
 * térkép, galéria, tábor, futás, kontakt) anélkül, hogy mindegyiket
 * külön kellene szerkeszteni.
 */
interface BeachPageShellProps {
  /** Fő cím (Oswald bold, krém) */
  title: string;
  /** Opcionális alcím (sárga, uppercase, tracking-wide) */
  subtitle?: string;
  /** Kis előszöveg (narancs, még a cím felett) */
  eyebrow?: string;
  /** Lap tartalma — ez a sötét teal content szekcióba kerül */
  children: ReactNode;
  /**
   * Ha igaz, a content szekció padding-je kisebb (pl. galéria esetén
   * a kártyarács a szekció szélességével együtt nyílik).
   */
  tight?: boolean;
}

export default function BeachPageShell({
  title,
  subtitle,
  eyebrow,
  children,
  tight = false,
}: BeachPageShellProps) {
  return (
    <>
      {/* ============================================================
          Rövid fejléc sáv — átlátszó, hogy a body gradient látszik
          ============================================================ */}
      <section
        aria-label="Oldal fejléc"
        className="relative overflow-hidden"
      >
        {/* Lebegő buborékok a főoldal Hero-jából átemelve */}
        <HeaderBubbles />

        <div className="relative z-10 mx-auto max-w-[1400px] px-5 py-14 text-center sm:px-8 sm:py-20">
          {eyebrow && (
            <p className="mb-3 font-display text-xs font-bold uppercase tracking-[0.28em] text-cream-50/95 drop-shadow">
              {eyebrow}
            </p>
          )}
          <h1
            className="font-display font-bold uppercase leading-[0.95] text-cream-50"
            style={{
              fontSize: "clamp(2rem, 5.5vw, 4.25rem)",
              textShadow: "0 4px 18px rgba(0,0,0,.4)",
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-sm font-semibold text-cream-50/90 sm:text-base">
              {subtitle}
            </p>
          )}
        </div>

      </section>

      {/* ============================================================
          Content szekció — átlátszó háttér, a body óceán gradient látszik
          ============================================================ */}
      <section className={tight ? "py-10 sm:py-14" : "py-14 sm:py-20"}>
        <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-10">
          {children}
        </div>
      </section>
    </>
  );
}

/* ============================================================
   HeaderBubbles — enyhe animált buborékok a fejléc hátterében.
   ============================================================ */
function HeaderBubbles() {
  const bubbles = [
    { cx: 80,   cy: 60,  r: 12, o: 0.35, d: 0 },
    { cx: 220,  cy: 130, r: 8,  o: 0.4,  d: 0.8 },
    { cx: 480,  cy: 50,  r: 18, o: 0.25, d: 1.4 },
    { cx: 760,  cy: 100, r: 11, o: 0.45, d: 2.1 },
    { cx: 1080, cy: 160, r: 14, o: 0.3,  d: 0.5 },
    { cx: 1280, cy: 70,  r: 9,  o: 0.5,  d: 2.6 },
    { cx: 340,  cy: 210, r: 7,  o: 0.5,  d: 3.2 },
  ];

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1400 280"
      preserveAspectRatio="xMidYMin slice"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <g fill="#fff">
        {bubbles.map((b, i) => (
          <circle
            key={i}
            cx={b.cx}
            cy={b.cy}
            r={b.r}
            opacity={b.o}
            className="animate-bubble"
            style={{ animationDelay: `${b.d}s` }}
          />
        ))}
      </g>
    </svg>
  );
}

/**
 * BeachCard — narancs-keretes krém kártya az aloldalakon.
 * Visszafelé kompatibilis a meglévő importokkal.
 */
export function BeachCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-cream-50 shadow-[0_14px_36px_rgba(0,0,0,0.35)] ${className}`}
    >
      <div
        className="absolute inset-x-0 top-0 h-1.5 bg-orange-500"
        aria-hidden="true"
      />
      {children}
    </div>
  );
}
