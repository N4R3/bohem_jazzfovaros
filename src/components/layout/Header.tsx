"use client";

import Link from "next/link";
import type { NavItem } from "@/lib/types";
import MobileMenu from "@/components/layout/MobileMenu";
import LocaleSwitchAnchor from "@/components/layout/LocaleSwitchAnchor";

interface Props {
  siteTitle: string;
  festivalDates: string;
  nav: NavItem[];
  otherLocale: { label: string; domain: string };
}

/**
 * Vékony, sötét-teal navigációs szalag. A mockup szerint a header
 * minimál — logo nincs benne, csak nav-pontok + nyelvváltó.
 */
export default function Header({ nav, otherLocale }: Props) {
  return (
    <header
      className="sticky top-0 z-40 w-full"
      style={{
        background: "var(--color-teal-950)",
        borderBottom: "1px solid rgba(249,160,63,0.18)",
      }}
    >
      <div className="mx-auto flex h-11 w-full max-w-[1400px] items-center justify-between gap-2 pl-[110px] pr-4 sm:pl-[130px] sm:pr-6 lg:pl-[160px] lg:pr-10">
        {/* Bal oldali hely a lógó bannernek (SiteLogoBanner átlóg rajta) */}

        <nav className="hidden w-full items-center justify-center gap-4 md:flex lg:gap-7">
          {nav.map((item) =>
            item.href.startsWith("http") ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.14em] transition-colors lg:text-[11px]"
                style={{ color: "#f6d98b" }}
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.14em] transition-colors lg:text-[11px]"
                style={{ color: "#f6d98b" }}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden shrink-0 md:block">
          <LocaleSwitchAnchor
            fallbackHref={otherLocale.domain}
            label={otherLocale.label}
            className="whitespace-nowrap rounded-sm border px-2 py-0.5 text-[10px] font-bold tracking-wider transition-colors hover:bg-[var(--color-accent-500)]/20"
            style={{
              borderColor: "rgba(249,160,63,0.55)",
              color: "var(--color-accent-300)",
            }}
          />
        </div>

        <MobileMenu
          nav={nav}
          otherLocaleLabel={otherLocale.label}
          otherLocaleDomain={otherLocale.domain}
        />
      </div>
    </header>
  );
}
