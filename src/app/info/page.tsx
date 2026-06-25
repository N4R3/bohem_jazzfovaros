import type { Metadata } from "next";
import { getContent, getLocale } from "@/lib/locale";
import { buildPageMetadataWithSanity } from "@/sanity/lib/seoContent";
import BeachPageShell from "@/components/layout/BeachPageShell";
import RichText from "@/components/common/RichText";
import {
  getVisibleTicketsWithFallback,
  getTicketUrlWithFallback,
  getPageContentBySlug,
  getVenueContent,
} from "@/sanity/lib/content";
import type { PortableTextBlock } from "@portabletext/react";
import { portableTextToPlain } from "@/sanity/lib/portableText";
import InfoCmsSections from "@/components/info/InfoCmsSections";

export const revalidate = 30;

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
  const [c, locale] = await Promise.all([getContent(), getLocale()]);
  const isEn = locale === "en";
  const [sanityTickets, ticketUrl, page, venue] = await Promise.all([
    getVisibleTicketsWithFallback(),
    getTicketUrlWithFallback(locale),
    getPageContentBySlug("info", locale),
    getVenueContent(locale),
  ]);
  const { info } = c;
  const cmsFaq = page.infoFaq && page.infoFaq.length > 0 ? page.infoFaq : null;
  const cmsMainSections =
    page.sections?.some(
      (s) =>
        s &&
        s.enabled !== false &&
        (s._type === "sectionTextBox" || s._type === "sectionRichText"),
    ) ?? false;
  const ticketTiers = sanityTickets.length ? sanityTickets : info.ticketTiers || [];
  const subtitle = typeof page.heroDescription === "string" ? page.heroDescription : portableTextToPlain(page.heroDescription);
  const ticketFooterRich =
    page.body && Array.isArray(page.body) && page.body.length > 0 ? (page.body as PortableTextBlock[]) : null;
  const ticketFooterPlain = info.ticketNote?.trim() || "";
  const globalBuyLabel = isEn ? "Buy tickets" : "Jegyvásárlás";

  return (
    <BeachPageShell
      eyebrow={`${c.meta.festivalDates}`}
      title={page.heroTitle || info.title}
      subtitle={subtitle || info.subtitle}
      canonicalPath="/info/"
      locale={isEn ? "en" : "hu"}
    >
      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-8">
          {/* Ticket tiers */}
          {ticketTiers.length > 0 && (
            <section>
              <article
                className="overflow-hidden rounded-2xl shadow-[0_14px_36px_rgba(0,0,0,0.35)]"
                style={{ background: "var(--color-accent-500)", color: "#fdf6e3" }}
              >
                <header className="flex flex-col gap-3 border-b border-white/35 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
                  <h2 className="font-display text-lg font-black uppercase leading-tight tracking-wide sm:text-xl">
                    {info.ticketCta}
                  </h2>
                  {ticketUrl && (
                    <a
                      href={ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider transition-transform hover:scale-[1.03] sm:text-sm"
                      style={{
                        background: "rgba(0,0,0,0.18)",
                        color: "#fdf6e3",
                        boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
                      }}
                    >
                      {globalBuyLabel}
                      <span aria-hidden="true">→</span>
                    </a>
                  )}
                </header>

                <ul>
                  {ticketTiers.map((tier, index) => {
                    const rowUrl = tier.ctaUrl || ticketUrl;
                    const canBuy = Boolean(rowUrl) && tier.isAvailable !== false;
                    const rowClassName = `group relative flex items-center gap-3 px-5 py-3.5 transition-all duration-300 sm:px-6 sm:py-4 ${
                      index > 0 ? "border-t border-white/35" : ""
                    } ${canBuy ? "cursor-pointer hover:bg-white/14 hover:pl-7 hover:shadow-[inset_5px_0_0_rgba(255,255,255,0.55)]" : "opacity-70"}`;

                    const rowContent = (
                      <>
                        <div className="min-w-0 flex-1 pr-1">
                          <p className="text-sm font-semibold leading-snug sm:text-[15px]">{tier.label}</p>
                          {(tier.descriptionRich?.length || tier.description) && (
                            <div className="mt-0.5 text-[11px] leading-snug text-white/80 sm:text-xs [&_a]:text-white [&_a]:underline [&_p]:mb-0">
                              {tier.descriptionRich?.length ? (
                                <RichText value={tier.descriptionRich} />
                              ) : (
                                <p>{tier.description}</p>
                              )}
                            </div>
                          )}
                        </div>
                        <p className="shrink-0 text-right text-sm font-bold tabular-nums sm:text-base">
                          {tier.price}
                        </p>
                        {canBuy && (
                          <span
                            className="flex h-7 w-7 shrink-0 items-center justify-center text-xl font-black transition-all duration-300 group-hover:translate-x-1.5 group-hover:scale-110 sm:h-8 sm:w-8"
                            aria-hidden="true"
                          >
                            ›
                          </span>
                        )}
                      </>
                    );

                    if (canBuy) {
                      return (
                        <li key={tier.id || tier.label}>
                          <a
                            href={rowUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={rowClassName}
                            aria-label={tier.label}
                          >
                            {rowContent}
                          </a>
                        </li>
                      );
                    }

                    return (
                      <li key={tier.id || tier.label} className={rowClassName}>
                        {rowContent}
                      </li>
                    );
                  })}
                </ul>

                {(ticketFooterRich || ticketFooterPlain) && (
                  <footer className="border-t border-white/35 px-5 py-4 text-xs leading-relaxed text-white/92 sm:px-6 sm:py-5 sm:text-sm">
                    {ticketFooterRich ? (
                      <RichText
                        value={ticketFooterRich}
                        className="[&_a]:text-white [&_a]:underline [&_blockquote]:border-white/50 [&_blockquote]:text-white/90 [&_p]:mb-2.5 [&_p:last-child]:mb-0 [&_strong]:text-white"
                      />
                    ) : (
                      <p>{ticketFooterPlain}</p>
                    )}
                  </footer>
                )}
              </article>
            </section>
          )}

          {cmsMainSections ? (
            <InfoCmsSections locale={locale} sections={page.sections} />
          ) : (
            info.sections.map((section) => (
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
            ))
          )}
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
              {cmsFaq
                ? cmsFaq.map((item) => (
                    <div key={item.question}>
                      <p
                        className="text-sm font-extrabold"
                        style={{ color: "var(--color-teal-900)" }}
                      >
                        {item.question}
                      </p>
                      <div
                        className="mt-1 text-sm leading-relaxed [&_a]:font-semibold [&_a]:text-[var(--color-accent-600)]"
                        style={{ color: "rgba(10,58,54,0.72)" }}
                      >
                        <RichText value={item.answer} />
                      </div>
                    </div>
                  ))
                : info.faq.map((item) => (
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
            href={ticketUrl || info.ticketUrl}
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
                {venue.eyebrow || "Domb Beach, Kecskemét"}
              </p>
              <div className="overflow-hidden rounded-xl border border-black/10">
                <iframe
                  title={isEn ? "Domb Beach venue map" : "Domb Beach helyszín térkép"}
                  src={venue.mapEmbedUrl}
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
