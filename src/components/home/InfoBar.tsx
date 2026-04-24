/**
 * InfoBar — narancs sáv a Hero alján, jazzdesign1 1:1.
 *
 *  - Felül + alul szaggatott perforált csík (`.perf-line`)
 *  - 📅 dátum-pill + 📍 helyszín-pill
 *  - jobbra "Jegyvásárlás →" CTA pill
 */

import Link from "next/link";

const ORANGE_BAR = "#FC7F3C";
const ORANGE_TEXT = "#FCCB89";
const BLUE = "#17345F";

type InfoBarProps = {
  date?: string;
  venue?: string;
  ticketLabel?: string;
  ticketUrl?: string;
};

export default function InfoBar({
  date        = "2026. AUGUSZTUS 6–9.",
  venue       = "DOMB BEACH & JAZZ SZABADTÉRI SZÍNPAD · KECSKEMÉT",
  ticketLabel = "Jegyvásárlás",
  ticketUrl   = "#",
}: InfoBarProps) {
  return (
    <section
      aria-label="Dátum és helyszín"
      className="info-bar relative z-[2] px-5 py-[22px] sm:px-8"
      style={{ background: ORANGE_BAR, boxShadow: "0 10px 24px rgba(0,0,0,0.2)" }}
    >
      {/* Felső szaggatott sáv */}
      <span
        aria-hidden="true"
        className="perf-line pointer-events-none absolute inset-x-0 top-0 h-1.5"
      />

      <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-start gap-x-10 gap-y-3 sm:justify-center">
        {/* Dátum - kék szöveg narancs alapon */}
        <span
          className="inline-flex items-center gap-3 text-[16px] font-bold uppercase tracking-[0.05em]"
          style={{ color: BLUE }}
        >
          <span
            className="grid h-[22px] w-[22px] place-items-center rounded-full text-[12px]"
            style={{ background: "rgba(12,60,85,0.2)" }}
          >
            📅
          </span>
          {date}
        </span>

        {/* Helyszín - kék szöveg narancs alapon */}
        <span
          className="inline-flex items-center gap-3 text-[16px] font-bold uppercase tracking-[0.05em]"
          style={{ color: BLUE }}
        >
          <span
            className="grid h-[22px] w-[22px] place-items-center rounded-full text-[12px]"
            style={{ background: "rgba(12,60,85,0.2)" }}
          >
            📍
          </span>
          {venue}
        </span>

        {/* Jegyvásárlás gomb - kék alapon narancs szöveg */}
        <Link
          href={ticketUrl}
          className="ml-auto inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-extrabold uppercase tracking-[0.08em] transition-transform duration-200 hover:translate-x-1"
          style={{ background: BLUE, color: ORANGE_TEXT }}
        >
          {ticketLabel}
          <span>→</span>
        </Link>
      </div>

      {/* Alsó szaggatott sáv */}
      <span
        aria-hidden="true"
        className="perf-line pointer-events-none absolute inset-x-0 bottom-0 h-1.5"
      />
    </section>
  );
}
