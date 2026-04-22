/**
 * InfoBar — narancs sáv a Hero alján, jazzdesign1 1:1.
 *
 *  - Felül + alul szaggatott perforált csík (`.perf-line`)
 *  - 📅 dátum-pill + 📍 helyszín-pill (kis áttetsző fehér körben emoji)
 *  - jobbra kis fehér "Jegyvásárlás →" CTA pill
 *
 *  A jegyvásárlás kerül hover-re jobbra
 */

import Link from "next/link";

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
      className="info-bar relative z-[2] bg-orange-500 px-5 py-[22px] text-white sm:px-8"
      style={{ boxShadow: "0 10px 24px rgba(255,98,0,0.25)" }}
    >
      {/* Felső szaggatott sáv */}
      <span
        aria-hidden="true"
        className="perf-line pointer-events-none absolute inset-x-0 top-0 h-1.5"
      />

      <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-start gap-x-10 gap-y-3 sm:justify-center">
        {/* 📅 Dátum pill */}
        <span className="inline-flex items-center gap-3 text-[16px] font-bold uppercase tracking-[0.05em]">
          <span
            aria-hidden="true"
            className="grid h-[22px] w-[22px] place-items-center rounded-full bg-white/20 text-[12px] leading-none"
          >
            📅
          </span>
          {date}
        </span>

        {/* 📍 Helyszín pill */}
        <span className="inline-flex items-center gap-3 text-[16px] font-bold uppercase tracking-[0.05em]">
          <span
            aria-hidden="true"
            className="grid h-[22px] w-[22px] place-items-center rounded-full bg-white/20 text-[12px] leading-none"
          >
            📍
          </span>
          {venue}
        </span>

        {/* Fehér Jegyvásárlás CTA — jobbra tolva asztalon */}
        <Link
          href={ticketUrl}
          className="group ml-auto inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-extrabold uppercase tracking-[0.08em] text-orange-500 transition-transform duration-200 hover:translate-x-1"
        >
          {ticketLabel}
          <span aria-hidden="true">→</span>
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
