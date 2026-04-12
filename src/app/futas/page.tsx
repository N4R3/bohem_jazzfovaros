import type { Metadata } from "next";
import { getContent } from "@/lib/locale";
import { canonicalUrl } from "@/lib/seo";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

export function generateMetadata(): Metadata {
  const c = getContent();
  return {
    title: c.running.title,
    description: c.running.subtitle,
    alternates: { canonical: canonicalUrl("/futas/") },
    openGraph: {
      title: `${c.running.title} · ${c.meta.siteTitle}`,
      description: c.running.subtitle,
      url: canonicalUrl("/futas/"),
    },
  };
}

export default function RunningPage() {
  const c = getContent();
  const { running } = c;

  return (
    <div className="min-h-screen bg-[var(--color-cream-50)] py-20">
      <Container>
        <SectionHeading title={running.title} subtitle={running.subtitle} />

        <div className="mx-auto max-w-3xl">
          <div className="mb-8 overflow-hidden rounded-2xl border border-[var(--color-cream-200)] bg-white shadow-sm">
            <div className="aspect-video bg-gradient-to-br from-[var(--color-navy-700)] to-[var(--color-navy-900)] flex items-center justify-center">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--color-gold-500)]/40">
                <path d="M13 4a1 1 0 11-2 0 1 1 0 012 0zm-2 3l-3 3 2 2 1-1 3 5H8l-1 4h2l.5-2h5l.5 2h2l-1-4h-3l-2-4 1-1 2 1 1-2-3-3z" />
              </svg>
            </div>
          </div>

          <div className="mb-6 rounded-2xl border border-[var(--color-gold-200)] bg-[var(--color-gold-50)] p-6">
            <p className="text-center text-sm font-bold text-[var(--color-gold-700)]">
              {running.freeTicketNote}
            </p>
          </div>

          <div className="mb-6 grid gap-4 sm:grid-cols-3 text-center">
            <div className="rounded-xl border border-[var(--color-cream-200)] bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-widest text-[var(--color-navy-900)]/40">Dátum / Date</p>
              <p className="mt-1 font-display text-sm font-bold text-[var(--color-navy-900)]">{running.date}</p>
            </div>
            <div className="rounded-xl border border-[var(--color-cream-200)] bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-widest text-[var(--color-navy-900)]/40">Időpont / Time</p>
              <p className="mt-1 font-display text-2xl font-bold text-[var(--color-gold-500)]">{running.time}</p>
            </div>
            <div className="rounded-xl border border-[var(--color-cream-200)] bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-widest text-[var(--color-navy-900)]/40">Helyszín / Location</p>
              <p className="mt-1 font-display text-sm font-bold text-[var(--color-navy-900)]">{running.location}</p>
            </div>
          </div>

          <p className="mb-8 text-base leading-relaxed text-[var(--color-navy-900)]/70">
            {running.description}
          </p>

          <div className="mb-8 overflow-hidden rounded-2xl border border-[var(--color-cream-200)] bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-cream-200)] bg-[var(--color-cream-50)]">
                  <th className="px-5 py-3 text-left font-semibold text-[var(--color-navy-900)]/60">Kategória</th>
                  <th className="px-5 py-3 text-left font-semibold text-[var(--color-navy-900)]/60">Táv</th>
                  <th className="px-5 py-3 text-right font-semibold text-[var(--color-navy-900)]/60">Díj</th>
                </tr>
              </thead>
              <tbody>
                {running.distances.map((d, i) => (
                  <tr key={i} className="border-b border-[var(--color-cream-100)] last:border-0">
                    <td className="px-5 py-3 font-medium text-[var(--color-navy-900)]">{d.label}</td>
                    <td className="px-5 py-3 text-[var(--color-navy-900)]/60">{d.distance}</td>
                    <td className="px-5 py-3 text-right font-bold text-[var(--color-gold-600)]">{d.fee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mb-6 text-sm leading-relaxed text-[var(--color-navy-900)]/65">
            <p><strong>Nevezési határidő / Deadline:</strong> {running.entryDeadline}</p>
          </div>
          <p className="mb-8 text-sm leading-relaxed text-[var(--color-navy-900)]/65">
            {running.resultsNote}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={running.entryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-[var(--color-gold-500)] px-8 py-4 text-base font-bold text-[var(--color-navy-900)] shadow-lg transition-all hover:bg-[var(--color-gold-600)] hover:scale-[1.02]"
            >
              {running.entryLabel}
            </a>
          </div>

          <div className="mt-8 rounded-xl border border-[var(--color-cream-200)] bg-white p-5 text-sm text-[var(--color-navy-900)]/60">
            <p className="font-semibold text-[var(--color-navy-900)]">Kapcsolat / Contact</p>
            <p className="mt-1">
              <a href={`mailto:${running.contactEmail}`} className="hover:text-[var(--color-gold-600)] transition-colors">{running.contactEmail}</a>
              {" · "}
              <a href={`tel:${running.contactPhone}`} className="hover:text-[var(--color-gold-600)] transition-colors">{running.contactPhone}</a>
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
