"use client";

import Link from "next/link";
import type { NavItem } from "@/lib/types";
import { useTheme } from "@/components/theme/ThemeContext";
import Container from "@/components/ui/Container";
import MobileMenu from "@/components/layout/MobileMenu";
import HeaderD2 from "@/components/layout/HeaderD2";
import HeaderD3 from "@/components/layout/HeaderD3";
import HeaderBrandMarks from "@/components/layout/HeaderBrandMarks";

interface Props {
  siteTitle: string;
  festivalDates: string;
  nav: NavItem[];
  otherLocale: { label: string; domain: string };
}

function HeaderD1({ siteTitle, festivalDates, nav, otherLocale }: Props) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--color-cream-200)] bg-[var(--color-cream-50)]/95 backdrop-blur-md shadow-sm">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2 text-[var(--color-navy-900)] hover:text-[var(--color-gold-600)] sm:gap-3"
          >
            <HeaderBrandMarks />
            <span className="font-display text-lg font-bold leading-none sm:text-xl">{siteTitle}</span>
            <span className="hidden text-xs font-medium text-[var(--color-gold-500)] xl:block">
              {festivalDates}
            </span>
          </Link>
          <nav className="hidden items-center gap-3 lg:gap-5 md:flex">
            {nav.map((item) =>
              item.href.startsWith("http") ? (
                <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-medium text-[var(--color-navy-900)] transition-colors hover:text-[var(--color-gold-500)] lg:text-sm">
                  {item.label}
                </a>
              ) : (
                <Link key={item.href} href={item.href}
                  className="text-xs font-medium text-[var(--color-navy-900)] transition-colors hover:text-[var(--color-gold-500)] lg:text-sm">
                  {item.label}
                </Link>
              )
            )}
            <a
              href={otherLocale.domain}
              className="ml-2 rounded border border-[var(--color-gold-500)] px-3 py-1 text-xs font-semibold text-[var(--color-gold-600)] hover:bg-[var(--color-gold-500)] hover:text-[var(--color-navy-900)] transition-colors"
            >
              {otherLocale.label}
            </a>
          </nav>
          <MobileMenu nav={nav} otherLocaleLabel={otherLocale.label} otherLocaleDomain={otherLocale.domain} />
        </div>
      </Container>
    </header>
  );
}

export default function ThemedHeader(props: Props) {
  const { theme } = useTheme();
  if (theme === "2") return <HeaderD2 {...props} />;
  if (theme === "3") return <HeaderD3 {...props} />;
  return <HeaderD1 {...props} />;
}
