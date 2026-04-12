import type { Metadata } from "next";
import { getContent } from "@/lib/locale";
import { canonicalUrl } from "@/lib/seo";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

export function generateMetadata(): Metadata {
  const c = getContent();
  return {
    title: c.info.title,
    description: c.info.subtitle,
    alternates: { canonical: canonicalUrl("/info/") },
    openGraph: {
      title: `${c.info.title} · ${c.meta.siteTitle}`,
      description: c.info.subtitle,
      url: canonicalUrl("/info/"),
    },
  };
}

export default function InfoPage() {
  const c = getContent();
  const { info } = c;

  return (
    <div className="min-h-screen bg-[var(--color-cream-50)] py-20">
      <Container>
        <SectionHeading title={info.title} subtitle={info.subtitle} />

        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex flex-col gap-6">

              {info.ticketTiers && info.ticketTiers.length > 0 && (
                <div className="rounded-xl border border-[var(--color-gold-300)] bg-[var(--color-navy-900)] p-6 shadow-sm">
                  <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="font-display text-lg font-bold text-white">
                      {info.ticketCta}
                    </h3>
                    <a
                      href={info.ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full rounded-lg bg-[var(--color-gold-500)] px-5 py-2 text-center text-sm font-bold text-[var(--color-navy-900)] hover:bg-[var(--color-gold-400)] transition-colors sm:w-auto"
                    >
                      ↗ {info.ticketCta}
                    </a>
                  </div>
                  <div className="flex flex-col divide-y divide-white/10">
                    {info.ticketTiers.map((tier) => (
                      <div key={tier.label} className="flex items-baseline justify-between gap-4 py-2.5">
                        <span className="text-sm text-[var(--color-cream-200)]/80">{tier.label}</span>
                        <span className="shrink-0 font-mono text-sm font-bold text-[var(--color-gold-400)]">{tier.price}</span>
                      </div>
                    ))}
                  </div>
                  {info.ticketNote && (
                    <p className="mt-5 text-xs leading-relaxed text-[var(--color-cream-200)]/50">
                      {info.ticketNote}
                    </p>
                  )}
                </div>
              )}

              {info.sections.map((section) => (
                <div
                  key={section.title}
                  className="rounded-xl border border-[var(--color-cream-200)] bg-white p-6 shadow-sm"
                >
                  <h3 className="mb-3 font-display text-lg font-bold text-[var(--color-navy-900)]">
                    {section.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--color-navy-900)]/70">
                    {section.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-xl border border-[var(--color-gold-200)] bg-[var(--color-gold-50)] p-6">
              <h3 className="mb-4 font-display text-lg font-bold text-[var(--color-navy-900)]">
                FAQ
              </h3>
              <div className="flex flex-col gap-4">
                {info.faq.map((item) => (
                  <div key={item.question}>
                    <p className="font-semibold text-sm text-[var(--color-navy-900)]">
                      {item.question}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--color-navy-900)]/65">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <a
              href={info.ticketUrl}
              className="flex items-center justify-center rounded-xl bg-[var(--color-gold-500)] px-6 py-5 text-center font-bold text-[var(--color-navy-900)] hover:bg-[var(--color-gold-600)] transition-colors"
            >
              {info.ticketCta}
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
