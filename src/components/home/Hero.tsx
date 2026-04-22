"use client";

/**
 * Hero — jazzdesign1 1:1 design clone.
 *
 * Layout:
 *  - Bal: döntött Pacifico badge ("10." narancs + "Jubileumi fesztivál" sárga),
 *    óriási Bebas Neue fehér + ink "BOHÉM JAZZFŐVÁROS" cím (FŐ ink szín),
 *    félkövér Poppins dátum/helyszín sor (narancs `AUGUSZTUS 6–9.`), narancs
 *    3D (box-shadow-drop) CTA gomb `➜` fehér körös nyilával.
 *  - Jobb: 520px sárga gumikacsa (lajos_duck.png, duckBob), 150px mentőöv
 *    (mentoov.png, floatA), 90px strandlabda (ball.png, floatB), kis SVG
 *    kagyló + dupla fehér hullám SVG a kacsa mögött (ripples).
 *
 * A külső `.hero-fold` és `.page-bg` a page.tsx-ben.
 */

import Image from "next/image";
import Link from "next/link";

type HeroProps = {
  /** Fő cím (két sorban a cím `<br/>` előtti és utáni részre vágva) */
  titleLine1?: string;
  titleLine2?: string;
  /** A cím második sorában kiemelendő középső rész (pl. "FŐ") ink színnel */
  titleInk?: string;
  /** Pacifico kurzív döntött badge a cím fölött */
  badge?: string;
  /** Alsó Poppins alcím (a `AUGUSZTUS 6–9.` narancs accent-et strong taggel jelöljük) */
  dateEmphasis?: string;
  dateSuffix?: string;
  /** CTA gomb szövege + link */
  ctaLabel?: string;
  ctaUrl?: string;
};

export default function Hero({
  titleLine1    = "BOHÉM",
  titleLine2    = "JAZZFŐVÁROS",
  titleInk      = "FŐ",
  badge         = "Jubileumi Fesztivál",
  dateEmphasis  = "2026. AUGUSZTUS 6–9.",
  dateSuffix    = "KECSKEMÉT, DOMB BEACH",
  ctaLabel      = "Jegyvásárlás",
  ctaUrl        = "#",
}: HeroProps) {
  /* A `titleLine2` → három rész: előtag + ink-kiemelt középső rész + utótag
     (pl. "JAZZ" + "FŐ" + "VÁROS"). Ha a `titleInk` nem szerepel a stringben,
     akkor az egész második sor egyszerűen fehér marad. */
  const inkIdx = titleInk ? titleLine2.indexOf(titleInk) : -1;
  const l2Prefix = inkIdx >= 0 ? titleLine2.slice(0, inkIdx) : titleLine2;
  const l2Ink    = inkIdx >= 0 ? titleInk : "";
  const l2Suffix = inkIdx >= 0 ? titleLine2.slice(inkIdx + (titleInk?.length || 0)) : "";

  return (
    <section
      aria-label="Hero"
      /*
        Reszponzív méretezés:
        - kis telefon (<sm=640): gap-2, pt-2 pb-4, kompakt tartalom
        - sm-md (640–767): átmeneti méretek
        - md+ (≥768): teljes asztali layout 2 oszlopban
      */
      className="relative z-[2] mx-auto grid w-full max-w-[1320px] grid-cols-1 items-center gap-2 px-5 pt-2 pb-4 sm:gap-4 sm:pt-6 sm:pb-12 sm:px-8 md:min-h-[620px] md:grid-cols-[1.05fr_1fr] md:gap-6 md:pb-16 md:pt-10"
    >
      {/* ====== BAL: badge + cím + alcím + CTA ======
          Mobilon a sorrend: 1) illusztrációk (order-1) 2) szöveg (order-2),
          hogy a kacsa a bg kép beach-részéhez közel legyen. Desktop-en az
          eredeti sorrend (szöveg bal, kacsa jobb) érvényesül. */}
      <div className="relative z-[3] order-2 md:order-1">
        {/* Pacifico badge — kisebb telefonon kompakt, asztalon teljes méret */}
        <div
          className="mb-2 inline-flex -rotate-3 items-center gap-1.5 rounded bg-ink-800 px-2.5 py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.18)] sm:mb-4 sm:gap-2.5 sm:px-4 sm:py-2.5"
          style={{ animation: "heroEnter 0.7s cubic-bezier(0.22,1,0.36,1) 0.08s both" }}
        >
          <span className="font-display text-[1.35rem] leading-none text-orange-500 sm:text-[2rem]">
            10.
          </span>
          <span className="font-script text-[14px] leading-none text-sun-400 sm:text-[22px]">
            {badge}
          </span>
        </div>

        {/* Óriási Bebas Neue cím — FŐ ink szín.
            clamp: 38px (kis telón) → 10vw skáláz → 132px (desktop max). */}
        <h1
          className="m-0 mb-1 font-display font-normal uppercase text-white sm:mb-2"
          style={{
            fontSize: "clamp(38px, 10vw, 132px)",
            lineHeight: 0.88,
            letterSpacing: "0.01em",
            textShadow:
              "0 4px 0 rgba(0,0,0,0.08), 0 10px 30px rgba(24,103,138,0.25)",
            animation: "heroEnter 0.75s cubic-bezier(0.22,1,0.36,1) 0.2s both",
          }}
        >
          {titleLine1}
          <br />
          {l2Prefix}
          {l2Ink && <span className="text-ink-800">{l2Ink}</span>}
          {l2Suffix}
        </h1>

        {/* Dátum / helyszín sor — 13px mobilon, 20px asztalon */}
        <p
          className="my-2 text-[13px] font-bold tracking-[0.02em] text-ink-800 sm:my-4 sm:text-[16px] md:my-5 md:text-[20px]"
          style={{ animation: "heroEnter 0.7s cubic-bezier(0.22,1,0.36,1) 0.35s both" }}
        >
          <strong className="text-orange-500">{dateEmphasis}</strong>
          <span className="px-1.5">·</span>
          <span>{dateSuffix}</span>
        </p>

        {/* Narancs 3D drop-shadow CTA — telefonra kisebb padding és font */}
        <Link
          href={ctaUrl}
          className="group inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 font-sans text-[13px] font-extrabold uppercase tracking-[0.08em] text-white shadow-[0_6px_0_var(--color-orange-700),0_10px_20px_rgba(255,98,0,0.35)] transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[0_13px_0_var(--color-orange-700),0_22px_34px_rgba(255,98,0,0.45)] active:translate-y-1 active:shadow-[0_3px_0_var(--color-orange-700),0_6px_12px_rgba(255,98,0,0.35)] sm:gap-3 sm:px-8 sm:py-[18px] sm:text-base sm:shadow-[0_10px_0_var(--color-orange-700),0_16px_30px_rgba(255,98,0,0.35)]"
          style={{ animation: "heroEnter 0.7s cubic-bezier(0.22,1,0.36,1) 0.5s both" }}
        >
          {ctaLabel}
          <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-xs font-black text-orange-500 transition-transform duration-200 group-hover:translate-x-1 sm:h-7 sm:w-7 sm:text-sm">
            ➜
          </span>
        </Link>
      </div>

      {/* ====== JOBB: kacsa + strandlabda + mentőöv + kagyló ====== */}
      <div
        className="order-1 md:order-2"
        style={{ animation: "heroEnter 0.9s cubic-bezier(0.22,1,0.36,1) 0.15s both" }}
      >
        <HeroBeachProps />
      </div>
    </section>
  );
}

/* ============================================================
   Jobb oldali props-csoport — a jazzdesign1 .hero-right
   ============================================================ */
function HeroBeachProps() {
  return (
    /*
      Konténer magasság úgy választva, hogy minden méreten legyen hely a vízre
      a kacsa alatt (ahová a labda és a mentőöv ér be félig a víz alá):
      - mobil   (<sm):   260px  → kacsa 170px, mentőöv 90px, labda 65px
      - sm-md:           360px  → kacsa 240px, mentőöv 125px, labda 90px
      - md+:             560px  → kacsa 520px, mentőöv 190px, labda 140px
      A referencia képen a mentőöv NAGYOBB mint a labda, mindkettő a kacsa
      mellett BAL oldalon a vízvonalon félig a víz alatt lebeg.
    */
    <div className="relative h-[260px] sm:h-[360px] md:h-[560px] md:max-h-[min(560px,calc(100svh-var(--navbar-height,76px)-220px))]">
      {/* Óriási sárga kacsa — duckBob animáció.
          Mobilon is jobb-oldalra igazítva (mint a referencián), hogy a
          mentőöv és a labda elférjen a bal oldalán a vízen.
          .hero-dip maszk: a kacsa alja a vízbe merül. */}
      <Image
        src="/images/design1/lajos_duck.png"
        alt="Gumikacsa kalapban"
        width={520}
        height={520}
        priority
        sizes="(max-width: 640px) 160px, (max-width: 768px) 225px, 470px"
        className="hero-dip animate-duck-bob absolute right-0 top-4 z-[3] h-auto w-[160px] sm:w-[225px] md:right-[-8px] md:top-[58px] md:w-[470px] md:max-w-full"
        style={{
          filter: "drop-shadow(0 20px 28px rgba(24,103,138,0.35))",
        }}
      />

      {/* Mentőöv (mentoov.png) — a vízvonalon a kacsa BAL oldalán, félig a
          víz alatt (.hero-half-dip mask). A referencia szerint a nagyobbik
          a két vízi kellék közül. */}
      <Image
        src="/images/design1/mentoov.png"
        alt="Mentőöv"
        width={200}
        height={200}
        className="hero-half-dip animate-float-a absolute left-[8%] top-[58%] z-[2] h-[70px] w-[70px] sm:left-[10%] sm:h-[98px] sm:w-[98px] md:left-[10%] md:top-[56%] md:h-[140px] md:w-[140px]"
      />

      {/* Strandlabda (ball.png) — a mentőöv és a kacsa KÖZÖTT a vízvonalon,
          félig a víz alatt. Kisebb, mint a mentőöv, enyhén lejjebb. */}
      <Image
        src="/images/design1/ball.png"
        alt="Strandlabda"
        width={180}
        height={180}
        className="hero-half-dip animate-float-b absolute left-[10%] top-[75%] z-[2] h-[50px] w-[50px] sm:left-[12%] sm:top-[76%] sm:h-[70px] sm:w-[70px] md:left-[-12%] md:top-[83%] md:h-[105px] md:w-[105px]"
      />

    </div>
  );
}
