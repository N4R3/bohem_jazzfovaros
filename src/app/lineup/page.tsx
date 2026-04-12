import type { Metadata } from "next";
import { getContent } from "@/lib/locale";
import { canonicalUrl } from "@/lib/seo";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

export function generateMetadata(): Metadata {
  const c = getContent();
  return {
    title: c.lineup.title,
    description: c.lineup.subtitle,
    alternates: { canonical: canonicalUrl("/lineup/") },
    openGraph: {
      title: `${c.lineup.title} · ${c.meta.siteTitle}`,
      description: c.lineup.subtitle,
      url: canonicalUrl("/lineup/"),
    },
  };
}

export default function LineupPage() {
  const c = getContent();
  const { lineup } = c;

  const dayLabels: Record<string, string> = {
    thursday: lineup.filterThursday,
    friday: lineup.filterFriday,
    saturday: lineup.filterSaturday,
    sunday: lineup.filterSunday,
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream-50)] py-20">
      <Container>
        <SectionHeading title={lineup.title} subtitle={lineup.subtitle} />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {lineup.artists.map((artist) => (
            <div
              key={artist.name}
              className="group overflow-hidden rounded-xl bg-white border border-[var(--color-cream-200)] shadow-sm hover:border-[var(--color-gold-300)] hover:shadow-md transition-all"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-[var(--color-navy-700)] via-[var(--color-navy-800)] to-[var(--color-navy-950)] flex items-center justify-center">
                <span className="text-[var(--color-gold-500)]/15 group-hover:text-[var(--color-gold-500)]/25 transition-colors">
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                  </svg>
                </span>
              </div>
              <div className="p-5">
                <span className="mb-3 inline-block rounded-full bg-[var(--color-gold-50)] border border-[var(--color-gold-200)] px-2.5 py-0.5 text-xs font-semibold text-[var(--color-gold-700)]">
                  {artist.genre}
                </span>
                <h3 className="font-display text-lg font-bold leading-snug text-[var(--color-navy-900)]">
                  {artist.name}
                </h3>
                <p className="mt-0.5 text-xs font-medium text-[var(--color-navy-700)]/50">{artist.origin}</p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-navy-900)]/60">
                  {artist.bio}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[var(--color-cream-200)] pt-3 text-xs text-[var(--color-navy-700)]/55">
                  <span>{dayLabels[artist.day]} · {artist.time}</span>
                  <span className="rounded-full bg-[var(--color-navy-900)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--color-gold-400)]">
                    {artist.stage === "main" ? lineup.stageMain : lineup.stageClub}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
