"use client";

import Link from "next/link";
import type { NavItem } from "@/lib/types";
import HeaderBrandMarks from "@/components/layout/HeaderBrandMarks";
import LocaleSwitchAnchor from "@/components/layout/LocaleSwitchAnchor";

interface Props {
  siteTitle: string;
  festivalDates: string;
  nav: NavItem[];
  otherLocale: { label: string; domain: string };
}

export default function HeaderD2({ siteTitle, nav, otherLocale }: Props) {
  return (
    <header
      className="sticky top-0 z-40 w-full"
      style={{ background: "rgba(8,58,72,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 font-display text-lg font-bold text-white hover:text-[#f0cc6a] transition-colors sm:gap-3 sm:text-xl"
        >
          <HeaderBrandMarks />
          <span className="truncate">{siteTitle}</span>
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          {nav.map((item) =>
            item.href.startsWith("http") ? (
              <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer"
                className="text-sm font-medium text-[#a8d0d8] transition-colors hover:text-white">
                {item.label}
              </a>
            ) : (
              <Link key={item.href} href={item.href}
                className="text-sm font-medium text-[#a8d0d8] transition-colors hover:text-white">
                {item.label}
              </Link>
            )
          )}
          <LocaleSwitchAnchor
            fallbackHref={otherLocale.domain}
            label={otherLocale.label}
            className="ml-1 rounded-full border border-[#f0cc6a]/40 px-3 py-1 text-xs font-semibold text-[#f0cc6a] hover:bg-[#f0cc6a]/10 transition-colors"
          />
        </nav>
      </div>
    </header>
  );
}
