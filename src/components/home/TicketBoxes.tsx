/**
 * TicketBoxes — narancs jegyvásárlási kártyák a főoldalon.
 *
 * Ha a Sanityben van legalább egy jegy `showOnHome = true` beállítással,
 * azokat jeleníti meg (Sanity-vezérelt mód).
 * Ha nincs ilyen jegy, a statikus fallback 3 kártyát mutatja (korábbi állapot).
 *
 * Megjelenés mindkét esetben azonos: jazzdesign1 1:1 dizájn —
 * jegyszelvény-forma bal oldali szaggatott elválasztóval,
 * ikon-négyzet, Bebas Neue cím, alatta pici uppercase alcím, jobb szélen → kör.
 */

import Link from "next/link";
import { getLocale } from "@/lib/locale";
import { getHomeTicketsWithFallback, getTicketUrlWithFallback } from "@/sanity/lib/content";

type Box = {
  emoji: string;
  title: string;
  sub: string;
  href: string;
};

type TicketBoxesProps = {
  /** Főoldali blokkban: nincs saját külső padding, a szülő ad térközt. */
  embedded?: boolean;
};

export default async function TicketBoxes({ embedded = false }: TicketBoxesProps) {
  const locale = await getLocale();
  const isEn = locale === "en";
  const ticketUrl = await getTicketUrlWithFallback(locale);

  // Try Sanity-driven home tickets first
  const sanityBoxes = await getHomeTicketsWithFallback(locale, ticketUrl);

  // Static fallback (used when no Sanity tickets have showOnHome=true)
  const passUrl =
    "https://jazzfovaros.jegy.hu/program/x-bohem-jazzfovaros-fesztival-berletek/6a097896-ee32-47ce-bb15-438d58bff51d";
  const fallbackBoxes: Box[] = isEn
    ? [
        { emoji: "🎟️", title: "Day Ticket", sub: "Choose your day", href: ticketUrl },
        { emoji: "🎫", title: "Pass", sub: "4 days · unlimited entry", href: passUrl },
        { emoji: "⭐", title: "VIP Ticket", sub: "Premium experience · catering", href: ticketUrl },
      ]
    : [
        { emoji: "🎟️", title: "Napijegy", sub: "Válaszd ki a napod", href: ticketUrl },
        { emoji: "🎫", title: "Bérlet", sub: "4 nap · korlátlan belépés", href: passUrl },
        { emoji: "⭐", title: "VIP jegy", sub: "Kiemelt élmény · catering", href: ticketUrl },
      ];

  const boxes: Box[] = sanityBoxes.length > 0 ? sanityBoxes : fallbackBoxes;
  if (boxes.length === 0) return null;

  return (
    <section
      aria-label={isEn ? "Ticket options" : "Jegyvásárlási lehetőségek"}
      className={
        embedded
          ? "relative z-[2]"
          : "relative z-[2] px-5 pb-10 pt-12 sm:px-8 sm:pt-14"
      }
    >
      <div className="mx-auto grid max-w-[1160px] gap-5 sm:gap-6 md:grid-cols-3 md:gap-6 lg:gap-8">
        {boxes.map((b, i) => (
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
      prefetch={false}
      href={href}
      className="group reveal-on-scroll-fast relative flex min-h-[88px] items-center gap-3 overflow-hidden rounded-[14px] bg-orange-500 px-4 py-5 text-white shadow-[0_8px_0_var(--color-orange-700),0_14px_30px_rgba(255,98,0,0.35)] transition-all duration-[250ms] hover:-translate-y-[5px] hover:shadow-[0_13px_0_var(--color-orange-700),0_22px_40px_rgba(255,98,0,0.5)] sm:gap-4 sm:px-5 sm:py-[22px] md:px-6"
    >
      {/* Ikon négyzet */}
      <span
        aria-hidden="true"
        className="relative z-[1] grid h-11 w-11 shrink-0 place-items-center rounded-[10px] bg-white/20 text-[22px]"
      >
        {emoji}
      </span>

      {/* Szöveg — a szaggatott vonal az ikon vége és a szöveg kezdete között, félig */}
      <span className="relative z-[1] flex flex-col border-l-2 border-dashed border-white/25 pl-4">
        <span className="font-display text-[20px] uppercase leading-none tracking-[0.05em] sm:text-[22px] md:text-[24px]">
          {title}
        </span>
        {sub && (
          <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.05em] opacity-95 sm:text-[12px]">
            {sub}
          </span>
        )}
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
