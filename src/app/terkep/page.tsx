import type { Metadata } from "next";
import { getContent } from "@/lib/locale";
import { canonicalUrl } from "@/lib/seo";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

export function generateMetadata(): Metadata {
  const c = getContent();
  return {
    title: c.map.title,
    description: c.map.subtitle,
    alternates: { canonical: canonicalUrl("/terkep/") },
    openGraph: {
      title: `${c.map.title} · ${c.meta.siteTitle}`,
      description: c.map.subtitle,
      url: canonicalUrl("/terkep/"),
    },
  };
}

const iconPaths: Record<string, string> = {
  car: "M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h14a2 2 0 012 2v6a2 2 0 01-2 2h-2m-4 0a2 2 0 11-4 0m4 0a2 2 0 10-4 0M9 7V4l6 3-6 3",
  train: "M12 2c-4 0-8 .5-8 4v9.5A2.5 2.5 0 006.5 18l-1 1v.5h13V19l-1-1a2.5 2.5 0 002.5-2.5V6c0-3.5-4-4-8-4zM9 17a1 1 0 110-2 1 1 0 010 2zm6 0a1 1 0 110-2 1 1 0 010 2zM4 11V7h16v4H4z",
  bus: "M8 6v6m8-6v6M4 16h16M6 20h2m8 0h2M4 6h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z",
};

export default function MapPage() {
  const c = getContent();
  const { map } = c;

  return (
    <div className="min-h-screen bg-[var(--color-cream-50)] py-20">
      <Container>
        <SectionHeading title={map.title} subtitle={map.subtitle} />

        <div className="mb-8 overflow-hidden rounded-2xl border border-[var(--color-cream-200)] bg-[var(--color-navy-900)] shadow-lg">
          <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-[var(--color-navy-800)] to-[var(--color-navy-950)]">
            <div className="text-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto text-[var(--color-gold-500)]/50">
                <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              <p className="mt-3 text-sm text-white/40">GPS: {map.gps}</p>
            </div>
          </div>
          <div className="border-t border-white/10 px-5 py-3">
            <p className="text-xs leading-relaxed text-white/50">{map.mapNote}</p>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          <a
            href={`https://maps.google.com/?q=${map.gps}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-gold-500)] px-5 py-2.5 text-sm font-bold text-[var(--color-navy-900)] transition-all hover:bg-[var(--color-gold-600)] hover:scale-[1.02]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            Google Maps
          </a>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${map.gps}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-gold-400)] px-5 py-2.5 text-sm font-bold text-[var(--color-gold-600)] transition-all hover:bg-[var(--color-gold-50)]"
          >
            Útvonaltervező / Directions
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {map.directions.map((dir) => (
            <div
              key={dir.mode}
              className="rounded-xl border border-[var(--color-cream-200)] bg-white p-6 shadow-sm"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-gold-100)]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--color-gold-600)]">
                    <path d={iconPaths[dir.icon] ?? iconPaths.car} />
                  </svg>
                </div>
                <h3 className="font-display text-base font-bold text-[var(--color-navy-900)]">
                  {dir.mode}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-[var(--color-navy-900)]/65">
                {dir.text}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
