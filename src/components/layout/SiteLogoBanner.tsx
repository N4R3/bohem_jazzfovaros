import Link from "next/link";
import Image from "next/image";

/**
 * Lógó banner — a bal-felső sarokból "hanging" módon átnyúl a
 * nav-sávon és a hero tetejére. Abszolút pozícióban van, nincs
 * hatással a layout flow-ra.
 *
 * A 10. jubileumi kerek "10." badge a pajzs tetején ül, finoman
 * bal felé eltolva.
 */
export default function SiteLogoBanner() {
  return (
    <Link
      href="/"
      aria-label="Bohém Jazzfőváros"
      className="absolute left-3 top-0 z-50 block sm:left-5 md:left-7"
    >
      <div className="relative">
        {/* sárga "10." jubileumi kör */}
        <div
          className="absolute -left-2 top-1 z-[2] flex h-10 w-10 items-center justify-center rounded-full text-[11px] font-black sm:-left-3 sm:top-2 sm:h-12 sm:w-12 sm:text-xs"
          style={{
            background: "#f2c94c",
            color: "#0e4844",
            border: "3px solid #fdf6e3",
            boxShadow: "0 4px 10px rgba(0,0,0,0.35)",
          }}
        >
          10.
        </div>
        <Image
          src="/images/bjf-logo.png"
          alt="Bohém Jazzfőváros"
          width={110}
          height={170}
          priority
          className="h-[88px] w-auto drop-shadow-2xl sm:h-[104px] md:h-[120px]"
        />
      </div>
    </Link>
  );
}
