/**
 * TicketBoxes — 3 narancs "Jegyvásárlás" kártya (Napijegy / Bérlet / VIP),
 * a jazzdesign1 1:1 másolata: jegyszelvény-forma bal oldali szaggatott
 * elválasztóval, ikon-négyzet, Bebas Neue cím, alatta pici uppercase alcím,
 * jobb szélen → kör.
 */

import Link from "next/link";
import type { ReactNode } from "react";
import { getContent } from "@/lib/locale";

type Box = {
  emoji: string;
  title: string;
  sub: string;
  href: string;
};

export default async function TicketBoxes() {
  const c = await getContent();
  const isEn = c.otherLocale.label === "HU";
  const ticketUrl = c.info.ticketUrl || "#";
  const BOXES: Box[] = isEn
    ? [
        { emoji: "🎟️", title: "Day Ticket", sub: "Choose your day", href: ticketUrl },
        { emoji: "🎫", title: "Pass", sub: "4 days · unlimited entry", href: ticketUrl },
        { emoji: "⭐", title: "VIP Ticket", sub: "Premium experience · catering", href: ticketUrl },
      ]
    : [
        { emoji: "🎟️", title: "Napijegy", sub: "Válaszd ki a napod", href: ticketUrl },
        { emoji: "🎫", title: "Bérlet", sub: "4 nap · korlátlan belépés", href: ticketUrl },
        { emoji: "⭐", title: "VIP jegy", sub: "Kiemelt élmény · catering", href: ticketUrl },
      ];

  return (
    <section
      aria-label={isEn ? "Ticket options" : "Jegyvásárlási lehetőségek"}
      className="relative z-[2] px-5 pb-8 pt-10 sm:px-8"
    >
      <div className="mx-auto grid max-w-[1160px] gap-4 md:grid-cols-3 md:gap-[18px]">
        {BOXES.map((b, i) => (
          <TicketBox key={i} {...b} />
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   Egy narancs jegyszelvény
   ============================================================ */
function TicketBox({ emoji, title, sub, href }: Box) {
  return (
    <Link
      href={href}
      className="group relative flex items-center gap-4 overflow-hidden rounded-[14px] bg-orange-500 px-6 py-[22px] text-white shadow-[0_8px_0_var(--color-orange-700),0_14px_30px_rgba(255,98,0,0.35)] transition-all duration-[250ms] hover:-translate-y-[5px] hover:shadow-[0_13px_0_var(--color-orange-700),0_22px_40px_rgba(255,98,0,0.5)]"
    >
      {/* Szaggatott ticket-stub vonal bal oldalt */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-[60px] bg-white/10"
        style={{ borderRight: "2px dashed rgba(255,255,255,0.3)" }}
      />

      {/* Ikon négyzet */}
      <span
        aria-hidden="true"
        className="relative z-[1] grid h-11 w-11 shrink-0 place-items-center rounded-[10px] bg-white/20 text-[22px]"
      >
        {emoji}
      </span>

      {/* Szöveg */}
      <span className="relative z-[1] flex flex-col">
        <span className="font-display text-[24px] uppercase leading-none tracking-[0.05em]">
          {title}
        </span>
        <span className="mt-1 text-[12px] font-semibold uppercase tracking-[0.05em] opacity-95">
          {sub}
        </span>
      </span>

      {/* Jobb szélen → kör */}
      <span
        aria-hidden="true"
        className="relative z-[1] ml-auto grid h-[30px] w-[30px] place-items-center rounded-full bg-white font-black text-orange-500 transition-transform duration-200 group-hover:translate-x-1"
      >
        →
      </span>
    </Link>
  );
}

/* Explicit import marker a ReactNode-ra, hogy a lehetséges kibővítésekre
   (pl. custom ikon-komponens a props-ban) fel legyünk készülve. */
export type { ReactNode };
