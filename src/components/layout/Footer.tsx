import { Fragment } from "react";
import Link from "next/link";
import { getContent } from "@/lib/locale";
import Container from "@/components/ui/Container";

export default function Footer() {
  const c = getContent();

  return (
    <footer className="relative bg-[var(--color-navy-950)] text-[var(--color-cream-100)]">
      <div
        className="absolute left-0 right-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, var(--color-gold-600), transparent)" }}
        aria-hidden="true"
      />
      <Container>
        <div className="grid gap-8 py-12 md:gap-10 md:grid-cols-3 md:py-16">

          <div>
            <div className="mb-1 font-display text-2xl font-bold text-white">
              {c.meta.siteTitle}
            </div>
            <div className="mb-4 text-xs font-semibold text-[var(--color-gold-500)]">
              {c.meta.festivalDates} · {c.meta.city}
            </div>
            <p className="text-sm leading-relaxed text-[var(--color-cream-200)]/50">
              {c.footer.tagline}
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={c.contact.socials.facebook}
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-[var(--color-cream-200)]/50 hover:border-[var(--color-gold-500)]/50 hover:text-[var(--color-gold-400)] transition-colors"
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H8.078V12h2.36V9.797c0-2.33 1.387-3.616 3.51-3.616 1.017 0 2.08.182 2.08.182v2.286h-1.172c-1.155 0-1.515.717-1.515 1.452V12h2.578l-.412 2.891h-2.166v6.987C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a
                href={c.contact.socials.instagram}
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-[var(--color-cream-200)]/50 hover:border-[var(--color-gold-500)]/50 hover:text-[var(--color-gold-400)] transition-colors"
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href={c.contact.socials.youtube}
                aria-label="YouTube"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-[var(--color-cream-200)]/50 hover:border-[var(--color-gold-500)]/50 hover:text-[var(--color-gold-400)] transition-colors"
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <div className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-gold-500)]">
              {c.footer.navLabel}
            </div>
            <nav className="flex flex-col gap-2.5">
              {c.nav.map((item) =>
                item.href.startsWith("http") ? (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--color-cream-200)]/55 hover:text-[var(--color-gold-400)] transition-colors"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm text-[var(--color-cream-200)]/55 hover:text-[var(--color-gold-400)] transition-colors"
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>
          </div>

          <div>
            <div className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-gold-500)]">
              Venue
            </div>
            <p className="text-sm leading-7 text-[var(--color-cream-200)]/55">
              {c.meta.venue}
              <br />
              {c.meta.city}
              <br />
              <a
                href={`mailto:${c.contact.email}`}
                className="mt-1 inline-block hover:text-[var(--color-gold-400)] transition-colors"
              >
                {c.contact.email}
              </a>
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <span className="text-xs text-[var(--color-cream-200)]/35">{c.footer.copyright}</span>
            <div className="flex flex-wrap items-center gap-x-1 gap-y-1">
              {c.footer.legalLinks.map((link, i) => (
                <Fragment key={link.href}>
                  {i > 0 && <span className="text-white/15 text-xs">·</span>}
                  {link.href.startsWith("http") ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[var(--color-cream-200)]/35 hover:text-[var(--color-gold-400)] transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-xs text-[var(--color-cream-200)]/35 hover:text-[var(--color-gold-400)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </Fragment>
              ))}
              {c.footer.builtBy && (
                <Fragment key="builtby">
                  <span className="text-white/15 text-xs">·</span>
                  <a
                    href={c.footer.builtByUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[var(--color-cream-200)]/25 hover:text-[var(--color-gold-400)] transition-colors"
                  >
                    {c.footer.builtBy}
                  </a>
                </Fragment>
              )}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
