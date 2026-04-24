"use client";

/**
 * Hero — statikus, referencia alapján 1:1.
 *
 * - Háttér: header_phone1.png (mobil), header_normal1.png (tablet), header_wide1.png (desktop)
 * - Logo: header_logo.png (bal oldalon, nagy méretben)
 * - Cím: BOHÉM (meleg narancs) + JAZZFŐVÁROS (fehér)
 * - Alcím: Kecskemét, Domb Beach (meleg narancs alapon fehér) + 2026. AUGUSZTUS 6-9. (kék alapon meleg narancs)
 * - CTA: JEGYVÁSÁRLÁS (kék alapon fehér, lejjebb)
 */

import Image from "next/image";
import Link from "next/link";

const ORANGE_TEXT = "#FCCB89";
const ORANGE_STRONG = "#EEA228";
const BLUE = "#17345F";
const BADGE_ORANGE = "#F54614";

type HeroProps = {
  ctaLabel?: string;
  ctaUrl?: string;
};

export default function Hero({
  ctaLabel = "Jegyvásárlás",
  ctaUrl = "#",
}: HeroProps) {
  return (
    <section
      aria-label="Hero"
      className="relative z-[2] mx-auto flex w-full max-w-[1320px] flex-col items-center gap-6 px-5 pt-4 pb-6 sm:gap-8 sm:pt-8 sm:pb-12 sm:px-8 md:min-h-[580px] md:flex-row md:items-center md:gap-12 md:pb-16 md:pt-10"
    >
      {/* BAL: Logo — nagyobb, a szövegblokk magasságához igazítva */}
      <div className="relative z-[3] flex-shrink-0">
        <Image
          src="/images/header_logo.png"
          alt="10. Bohém Jazzfőváros 2026"
          width={320}
          height={320}
          priority
          className="h-[240px] w-auto sm:h-[270px] md:h-[380px] lg:h-[420px]"
        />
      </div>

      {/* JOBB: Szöveges tartalom */}
      <div className="relative z-[3] flex w-full max-w-md flex-col items-center text-center sm:max-w-none sm:items-start sm:text-left md:mt-0">
        <h1
          className="m-0 mb-1 max-w-[20ch] font-display font-normal uppercase [font-size:clamp(64px,13.5vw,96px)] [line-height:0.95] [letter-spacing:0.02em] [text-shadow:0_4px_12px_rgba(0,0,0,0.4)] sm:max-w-none md:[font-size:clamp(36px,7vw,92px)]"
        >
          <span style={{ color: ORANGE_TEXT }}>BOHÉM</span>
          <br />
          <span className="text-white">JAZZFŐVÁROS</span>
        </h1>

        {/* Alcím sorok */}
        <div className="mb-8 mt-2 flex w-full max-w-sm flex-col items-center gap-2 sm:mb-10 sm:max-w-none sm:items-start md:mb-12">
          {/* Narancs alapon fehér szöveg */}
          <span
            className="rounded px-3 py-1.5 font-sans text-[13px] font-bold uppercase tracking-wide shadow sm:text-[15px]"
            style={{ background: BADGE_ORANGE, color: "#fff" }}
          >
            Kecskemét, Domb Beach
          </span>
          {/* Kék alapon narancs szöveg */}
          <span
            className="rounded px-3 py-1.5 font-sans text-[13px] font-bold uppercase tracking-wide shadow sm:text-[15px]"
            style={{ background: BLUE, color: ORANGE_STRONG }}
          >
            2026. AUGUSZTUS 6–9.
          </span>
        </div>

        {/* CTA gomb — lejjebb, kék alapon fehér */}
        <Link
          href={ctaUrl}
          className="inline-flex max-sm:mt-24 max-sm:self-center max-sm:items-center items-center gap-2 self-start rounded-full px-6 py-3 font-sans text-[14px] font-bold uppercase tracking-wide shadow-lg transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 sm:mt-0 sm:gap-3 sm:px-8 sm:py-4 sm:text-[16px]"
          style={{ background: BLUE, color: ORANGE_TEXT }}
        >
          {ctaLabel}
          <span style={{ color: ORANGE_TEXT }}>→</span>
        </Link>
      </div>
    </section>
  );
}
