import Link from "next/link";
import type { Artist } from "@/lib/types";
import Container from "@/components/ui/Container";

interface LineupTeaserProps {
  title: string;
  ctaLabel: string;
  ctaHref: string;
  artists: Artist[];
}

export default function LineupTeaser({ title, ctaLabel, ctaHref, artists }: LineupTeaserProps) {
  const featured = artists.slice(0, 6);

  return (
    <section aria-label="Lineup preview" className="bg-[var(--color-navy-950)] py-16 sm:py-24">
      <Container>
        <div className="mb-8 flex flex-col gap-3 border-b border-white/10 pb-6 sm:mb-12 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
            {title}
          </h2>
          <Link
            href={ctaHref}
            className="self-start rounded-full border border-[var(--color-gold-500)]/40 px-4 py-1.5 text-xs font-semibold tracking-wide text-[var(--color-gold-400)] hover:border-[var(--color-gold-400)] hover:text-[var(--color-gold-300)] transition-colors sm:self-auto"
          >
            {ctaLabel} →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {featured.map((artist) => (
            <div
              key={artist.name}
              className="group overflow-hidden rounded-xl bg-[var(--color-navy-800)] ring-1 ring-white/5 hover:ring-[var(--color-gold-500)]/30 transition-all"
            >
              <div className="aspect-square bg-gradient-to-br from-[var(--color-navy-700)] via-[var(--color-navy-800)] to-[var(--color-navy-950)]">
                <div className="flex h-full items-center justify-center text-[var(--color-gold-500)]/20 group-hover:text-[var(--color-gold-500)]/40 transition-colors">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                  </svg>
                </div>
              </div>
              <div className="p-3 pt-2.5">
                <div className="text-sm font-semibold leading-snug text-white">
                  {artist.name}
                </div>
                <div className="mt-1 text-xs font-medium text-[var(--color-gold-500)]/70">
                  {artist.genre}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-7 py-3 text-sm font-semibold text-white/70 hover:border-[var(--color-gold-500)]/50 hover:text-[var(--color-gold-400)] transition-colors"
          >
            {ctaLabel}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </Container>
    </section>
  );
}
