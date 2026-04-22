/**
 * CtaSection — nagy középre igazított CTA ("VEDD MEG A JEGYED MOST!"),
 * a jazzdesign1 1:1 változata.
 *
 * Bebas Neue fehér cím + narancs em-kiemelés ("JEGYED"), kis alcím,
 * narancs 3D drop-shadow-os CTA gomb fehér kör-nyíllal. A hátteret az
 * apai `.content-photo-bg` adja, itt csak átlátszó wrapper.
 */

import Link from "next/link";

type CtaSectionProps = {
  /** Cím — az `emphasis` stringet a narancs em-szakasz helyére illeszti */
  title?: string;
  /** A címben narancsra cserélt kulcsszó (default: "jegyed") */
  emphasis?: string;
  subtitle?: string;
  buttonLabel?: string;
  buttonUrl?: string;
};

export default function CtaSection({
  title       = "Vedd meg a jegyed most!",
  emphasis    = "jegyed",
  subtitle    = "2026. augusztus 6–9. · Domb Beach, Kecskemét",
  buttonLabel = "Jegyvásárlás",
  buttonUrl   = "#",
}: CtaSectionProps) {
  /* A cím szövegét három részre vágjuk: előtag + em-kiemelt kulcsszó +
     utótag. Case-insensitive-t keresünk, de megtartjuk az eredeti
     szöveg casingját. */
  const idx = title.toLowerCase().indexOf(emphasis.toLowerCase());
  const hasEm = idx >= 0;
  const pre  = hasEm ? title.slice(0, idx) : title;
  const em   = hasEm ? title.slice(idx, idx + emphasis.length) : "";
  const post = hasEm ? title.slice(idx + emphasis.length) : "";

  return (
    <section
      aria-label="Jegyvásárlás CTA"
      className="relative z-[2] px-5 pb-14 pt-20 text-center text-white sm:px-8"
    >
      <h2
        className="m-0 mb-3 font-display font-normal uppercase leading-none"
        style={{
          fontSize: "clamp(48px, 7vw, 96px)",
          letterSpacing: "0.04em",
          textShadow: "0 6px 30px rgba(0,0,0,0.2)",
        }}
      >
        {pre}
        {hasEm && (
          <em className="not-italic text-orange-500">{em}</em>
        )}
        {post}
      </h2>

      <p className="mb-8 font-semibold tracking-[0.04em] text-white/90">
        {subtitle}
      </p>

      {/* 3D narancs CTA — ugyanaz, mint a Hero-ban */}
      <Link
        href={buttonUrl}
        className="group inline-flex items-center gap-3 rounded-full bg-orange-500 px-[42px] py-[22px] font-sans text-[18px] font-extrabold uppercase tracking-[0.08em] text-white shadow-[0_10px_0_var(--color-orange-700),0_16px_30px_rgba(255,98,0,0.35)] transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[0_13px_0_var(--color-orange-700),0_22px_34px_rgba(255,98,0,0.45)] active:translate-y-1 active:shadow-[0_3px_0_var(--color-orange-700),0_6px_12px_rgba(255,98,0,0.35)]"
      >
        {buttonLabel}
        <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-sm font-black text-orange-500">
          ➜
        </span>
      </Link>
    </section>
  );
}
