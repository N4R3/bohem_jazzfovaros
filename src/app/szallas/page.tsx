import type { Metadata } from "next";
import { getContent } from "@/lib/locale";
import { canonicalUrl } from "@/lib/seo";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

export function generateMetadata(): Metadata {
  const c = getContent();
  return {
    title: c.accommodation.title,
    description: c.accommodation.subtitle,
    alternates: { canonical: canonicalUrl("/szallas/") },
    openGraph: {
      title: `${c.accommodation.title} · ${c.meta.siteTitle}`,
      description: c.accommodation.subtitle,
      url: canonicalUrl("/szallas/"),
    },
  };
}

function Stars({ count }: { count: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`${count} stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-[var(--color-gold-500)]">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

export default function AccommodationPage() {
  const c = getContent();
  const { accommodation } = c;

  return (
    <div className="min-h-screen bg-[var(--color-cream-50)] py-20">
      <Container>
        <SectionHeading title={accommodation.title} subtitle={accommodation.subtitle} />

        {accommodation.note && (
          <p className="mx-auto mb-10 max-w-2xl rounded-xl border border-[var(--color-gold-200)] bg-[var(--color-gold-50)] px-6 py-4 text-center text-sm leading-relaxed text-[var(--color-navy-900)]/70">
            {accommodation.note}
          </p>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {accommodation.hotels.map((hotel) => (
            <div
              key={hotel.name}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--color-cream-200)] bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="aspect-video bg-gradient-to-br from-[var(--color-navy-700)] to-[var(--color-navy-900)] flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--color-gold-500)]/30">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="mb-1 flex items-start justify-between gap-3">
                  <h3 className="font-display text-lg font-bold leading-snug text-[var(--color-navy-900)]">
                    {hotel.name}
                  </h3>
                  {hotel.stars && <Stars count={hotel.stars} />}
                </div>

                <p className="mt-1 text-xs font-medium text-[var(--color-gold-600)]">
                  {hotel.distance}
                </p>

                <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-navy-900)]/65">
                  {hotel.description}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-[var(--color-cream-200)] pt-4">
                  <div>
                    <p className="text-xs text-[var(--color-navy-900)]/50">ártól / from</p>
                    <p className="font-display text-base font-bold text-[var(--color-navy-900)]">
                      {hotel.price}
                    </p>
                  </div>
                  <a
                    href={hotel.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-lg bg-[var(--color-gold-500)] px-4 py-2 text-sm font-bold text-[var(--color-navy-900)] transition-all hover:bg-[var(--color-gold-600)] hover:scale-[1.02]"
                  >
                    {hotel.bookingLabel}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
