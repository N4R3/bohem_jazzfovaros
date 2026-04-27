import type { Metadata } from "next";
import { getContent, getLocale } from "@/lib/locale";
import { buildPageMetadataWithSanity } from "@/sanity/lib/seoContent";
import BeachPageShell from "@/components/layout/BeachPageShell";
import { getVisibleTicketsWithFallback, getTicketUrlWithFallback } from "@/sanity/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const c = await getContent();
  return buildPageMetadataWithSanity({
    slug: "info",
    path: "/info/",
    locale,
    fallbackTitle: c.info.title,
    fallbackDescription: c.info.subtitle,
    fallbackOgImage: "/images/og-image.jpg",
    siteTitle: c.meta.siteTitle,
  });
}

export default async function InfoPage() {
  const c = await getContent();
  const isEn = c.otherLocale.label === "HU";
  const locale = isEn ? "en" : "hu";
  const [sanityTickets, ticketUrl] = await Promise.all([
    getVisibleTicketsWithFallback(),
    getTicketUrlWithFallback(locale),
  ]);
  const { info } = c;
  const ticketTiers = sanityTickets.length ? sanityTickets : info.ticketTiers || [];

  return (
    <BeachPageShell
      eyebrow={`${c.meta.festivalDates}`}
      title={info.title}
      subtitle={info.subtitle}
      canonicalPath="/info/"
      locale={isEn ? "en" : "hu"}
    >
      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-6">
          {/* Ticket tiers */}
          {ticketTiers.length > 0 && (
            <section
              className="relative overflow-hidden rounded-2xl p-6 sm:p-8"
              style={{
                background: "var(--color-accent-500)",
                color: "#fdf6e3",
                boxShadow: "0 14px 36px rgba(0,0,0,0.35)",
              }}
            >
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="font-display text-2xl font-black uppercase sm:text-3xl">
                  {info.ticketCta}
                </h2>
                <a
                  href={ticketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider"
                  style={{
                    background: "var(--color-accent-700)",
                    color: "#fdf6e3",
                  }}
                >
                  Jegyvásárlás
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </a>
              </div>

              <ul className="flex flex-col divide-y" style={{ borderColor: "rgba(255,255,255,0.18)" }}>
                {ticketTiers.map((tier) => (
                  <li
                    key={tier.label}
                    className="flex items-baseline justify-between gap-4 py-3"
                    style={{ borderTopColor: "rgba(255,255,255,0.18)" }}
                  >
                    <span
                      className={`text-sm ${tier.highlight ? "font-bold" : "font-medium"}`}
                      style={{ color: "rgba(253,246,227,0.95)" }}
                    >
                      {tier.highlight && (
                        <span
                          className="mr-2 inline-block rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider"
                          style={{ background: "#fdf6e3", color: "var(--color-accent-700)" }}
                        >
                          HOT
                        </span>
                      )}
                      {tier.label}
                    </span>
                    <span className="shrink-0 font-mono text-sm font-black" style={{ color: "#fde4c0" }}>
                      {tier.price}
                    </span>
                  </li>
                ))}
              </ul>

              {info.ticketNote && (
                <p className="mt-5 text-xs leading-relaxed" style={{ color: "rgba(253,246,227,0.85)" }}>
                  {info.ticketNote}
                </p>
              )}
            </section>
          )}

          {/* Information sections */}
          {info.sections.map((section, i) => (
            <section
              key={section.title}
              className="relative overflow-hidden rounded-2xl p-6 shadow-xl sm:p-7"
              style={{ background: "var(--color-cream-50)" }}
            >
              <div
                className="absolute inset-x-0 top-0 h-1.5"
                style={{ background: "var(--color-accent-500)" }}
                aria-hidden="true"
              />
              <h3
                className="mb-3 font-display text-xl font-black uppercase"
                style={{ color: "var(--color-teal-900)" }}
              >
                {section.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "rgba(10,58,54,0.78)" }}
              >
                {section.body}
              </p>
            </section>
          ))}
        </div>

        {/* Right column: FAQ + CTA */}
        <aside className="flex flex-col gap-6">
          <section
            className="relative overflow-hidden rounded-2xl p-6 shadow-xl sm:p-7"
            style={{ background: "var(--color-cream-50)" }}
          >
            <div
              className="absolute inset-x-0 top-0 h-1.5"
              style={{ background: "var(--color-accent-500)" }}
              aria-hidden="true"
            />
            <h3
              className="mb-5 font-display text-xl font-black uppercase"
              style={{ color: "var(--color-accent-600)" }}
            >
              GYIK · FAQ
            </h3>
            <div className="flex flex-col gap-4">
              {info.faq.map((item) => (
                <div key={item.question}>
                  <p
                    className="text-sm font-extrabold"
                    style={{ color: "var(--color-teal-900)" }}
                  >
                    {item.question}
                  </p>
                  <p
                    className="mt-1 text-sm leading-relaxed"
                    style={{ color: "rgba(10,58,54,0.72)" }}
                  >
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <a
            href={info.ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-2xl px-6 py-6 text-center font-display text-lg font-black uppercase tracking-wide"
            style={{
              background: "var(--color-accent-500)",
              color: "#fdf6e3",
              boxShadow: "0 12px 28px rgba(212,98,26,0.5)",
            }}
          >
            {info.ticketCta}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>

          {/* Helyszín / térkép blokk */}
          <section
            className="relative overflow-hidden rounded-2xl shadow-xl"
            style={{ background: "var(--color-cream-50)" }}
          >
            <div
              className="absolute inset-x-0 top-0 h-1.5"
              style={{ background: "var(--color-accent-500)" }}
              aria-hidden="true"
            />
            <div className="p-5 sm:p-6">
              <h3
                className="mb-3 font-display text-xl font-black uppercase"
                style={{ color: "var(--color-teal-900)" }}
              >
                {isEn ? "Venue & Map" : "Helyszín"}
              </h3>
              <p
                className="mb-3 text-sm leading-relaxed"
                style={{ color: "rgba(10,58,54,0.78)" }}
              >
                Domb Beach, Kecskemét
              </p>
              <div className="overflow-hidden rounded-xl border border-black/10">
                <iframe
                  title={isEn ? "Domb Beach venue map" : "Domb Beach helyszín térkép"}
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2726.5!2d19.666032!3d46.903819!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDbCsDU0JzEzLjgiTiAxOcKwMzknNTcuNyJF!5e0!3m2!1shu!2shu!4v1700000000000!5m2!1shu!2shu"
                  width="100%"
                  height="260"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </section>
        </aside>
      </div>
    </BeachPageShell>
  );
}
