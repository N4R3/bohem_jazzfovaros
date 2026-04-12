import Link from "next/link";
import { getContent } from "@/lib/locale";
import Container from "@/components/ui/Container";
import MobileMenu from "@/components/layout/MobileMenu";
import LocaleSwitchAnchor from "@/components/layout/LocaleSwitchAnchor";

export default function Header() {
  const c = getContent();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--color-cream-200)] bg-[var(--color-cream-50)]/95 backdrop-blur-md shadow-sm">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-[var(--color-navy-900)] hover:text-[var(--color-gold-600)]"
          >
            <span className="font-display text-xl font-bold leading-none">
              {c.meta.siteTitle}
            </span>
            <span className="hidden text-xs font-medium text-[var(--color-gold-500)] xl:block">
              {c.meta.festivalDates}
            </span>
          </Link>

          <nav className="hidden items-center gap-3 lg:gap-5 md:flex">
            {c.nav.map((item) =>
              item.href.startsWith("http") ? (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-[var(--color-navy-900)] transition-colors hover:text-[var(--color-gold-500)] lg:text-sm"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-xs font-medium text-[var(--color-navy-900)] transition-colors hover:text-[var(--color-gold-500)] lg:text-sm"
                >
                  {item.label}
                </Link>
              )
            )}
            <LocaleSwitchAnchor
              fallbackHref={c.otherLocale.domain}
              label={c.otherLocale.label}
              className="ml-2 rounded border border-[var(--color-gold-500)] px-3 py-1 text-xs font-semibold text-[var(--color-gold-600)] hover:bg-[var(--color-gold-500)] hover:text-[var(--color-navy-900)] transition-colors"
            />
          </nav>

          <MobileMenu
            nav={c.nav}
            otherLocaleLabel={c.otherLocale.label}
            otherLocaleDomain={c.otherLocale.domain}
          />
        </div>
      </Container>
    </header>
  );
}
