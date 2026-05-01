import type { Metadata } from "next";
import Image from "next/image";
import { getContent, getLocale } from "@/lib/locale";
import BeachPageShell from "@/components/layout/BeachPageShell";
import PageBody from "@/components/layout/PageBody";
import { buildPageMetadataWithSanity } from "@/sanity/lib/seoContent";
import { getPageContentBySlug } from "@/sanity/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const c = await getContent();
  return buildPageMetadataWithSanity({
    slug: "futas",
    path: "/futas/",
    locale,
    fallbackTitle: c.running.title,
    fallbackDescription: c.running.subtitle,
    fallbackOgImage: "/images/og-image.jpg",
    siteTitle: c.meta.siteTitle,
  });
}

function RunningCTAButtons({ entryUrl, entryLabel, secondaryUrl, secondaryLabel }: {
  entryUrl: string;
  entryLabel: string;
  secondaryUrl?: string;
  secondaryLabel?: string;
}) {
  return (
    <>
      <a
        href={entryUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-extrabold uppercase tracking-wider shadow-xl transition-transform hover:scale-[1.04]"
        style={{
          background: "var(--color-accent-500)",
          color: "#fdf6e3",
          boxShadow: "0 14px 32px rgba(212,98,26,0.45)",
        }}
      >
        {entryLabel}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </a>
      {secondaryUrl && (
        <a
          href={secondaryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full border-2 px-6 py-3.5 text-sm font-extrabold uppercase tracking-wider transition-transform hover:scale-[1.04]"
          style={{
            borderColor: "var(--color-accent-500)",
            color: "var(--color-accent-500)",
          }}
        >
          {secondaryLabel}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      )}
    </>
  );
}

export default async function RunningPage() {
  const c = await getContent();
  const locale = await getLocale();
  const { running } = c;
  const isEn = c.otherLocale.label === "HU";
  const page = await getPageContentBySlug("futas", locale);

  const entryUrl = page.primaryButton?.url || running.entryUrl;
  const entryLabel = page.primaryButton?.label || running.entryLabel;
  const secondaryUrl = page.secondaryButton?.url;
  const secondaryLabel = page.secondaryButton?.label ||
    (isEn ? "Download registration form" : "Nevezési lap letöltése");

  const rc = page.runningCms;
  const eyebrow = rc?.eyebrow ?? `${running.date} · ${running.time}`;
  const freeEntryBanner = rc?.freeEntryBanner ?? running.freeTicketNote;
  const cardDate = rc?.cardDate ?? running.date;
  const cardTime = rc?.cardTime ?? running.time;
  const cardLocation = rc?.cardLocation ?? running.location;
  const distancesSectionTitle =
    rc?.distancesSectionTitle ?? (locale === "en" ? "Distances & fees" : "Távok & Díjak");
  const distanceRows =
    rc?.distanceRows ??
    running.distances.map((d) => ({
      category: d.label,
      distance: d.distance,
      fee: d.fee,
    }));
  const entryDeadline = rc?.entryDeadline ?? running.entryDeadline;
  const resultsNote = rc?.resultsNote ?? running.resultsNote;
  const mainBody =
    page.body2 && page.body2.trim().length > 0 ? page.body2 : running.description;

  const ui =
    locale === "en"
      ? {
          cardDate: "Date",
          cardTime: "Time",
          cardVenue: "Venue",
          tableCategory: "Category",
          tableDistance: "Distance",
          tableFee: "Fee",
          deadlineLead: "Entry deadline:",
          contact: "Contact",
        }
      : {
          cardDate: "Dátum",
          cardTime: "Időpont",
          cardVenue: "Helyszín",
          tableCategory: "Kategória",
          tableDistance: "Táv",
          tableFee: "Díj",
          deadlineLead: "Nevezési határidő:",
          contact: "Kapcsolat",
        };

  return (
    <BeachPageShell
      eyebrow={eyebrow}
      title={page.heroTitle || running.title}
      subtitle={page.heroDescription || running.subtitle}
      canonicalPath="/futas/"
      locale={isEn ? "en" : "hu"}
    >
      {page.body && <PageBody text={page.body} />}
      <div className="mx-auto mb-8 max-w-4xl flex flex-wrap items-center justify-center gap-4">
        <RunningCTAButtons entryUrl={entryUrl} entryLabel={entryLabel} secondaryUrl={secondaryUrl} secondaryLabel={secondaryLabel} />
      </div>
      <div className="mx-auto max-w-4xl">
        {/* Futás hero kép */}
        <div
          className="mb-8 overflow-hidden rounded-3xl shadow-xl"
          style={{
            minHeight: 220,
          }}
        >
          <div className="relative aspect-[16/7] min-h-[220px] w-full">
            <Image
              src={running.image}
              alt={running.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 900px"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mb-8 flex justify-center">
          <Image
            src="/images/branding/43e3a57583f727d87fb1271bb22963ef.jpg"
            alt="Széchenyi Terv embléma"
            width={360}
            height={86}
            className="h-auto w-full max-w-[360px] rounded-xl border border-white/30 bg-white/95 p-2"
          />
        </div>

        {/* INGYENES szalag */}
        {freeEntryBanner && (
          <div
            className="mb-8 rounded-2xl px-6 py-5 text-center shadow-xl"
            style={{
              background: "var(--color-accent-500)",
              color: "#fdf6e3",
              boxShadow: "0 10px 26px rgba(212,98,26,0.4)",
            }}
          >
            <p className="text-sm font-black uppercase tracking-wider sm:text-base">
              {freeEntryBanner}
            </p>
          </div>
        )}

        {/* Kulcs info kártyák */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {[
            { label: ui.cardDate, value: cardDate },
            { label: ui.cardTime, value: cardTime, big: true },
            { label: ui.cardVenue, value: cardLocation },
          ].map((card, i) => (
            <div
              key={card.label}
              className="relative overflow-hidden rounded-2xl p-5 text-center shadow-lg"
              style={{
                background: "var(--color-cream-50)",
                animation: "card-fade-in 0.55s ease-out backwards",
                animationDelay: `${i * 70}ms`,
              }}
            >
              <div
                className="absolute inset-x-0 top-0 h-1.5"
                style={{ background: "var(--color-accent-500)" }}
              />
              <p
                className="text-[10px] font-black uppercase tracking-[0.22em]"
                style={{ color: "var(--color-accent-600)" }}
              >
                {card.label}
              </p>
              <p
                className={`mt-2 font-display font-black leading-tight ${card.big ? "text-3xl" : "text-base"}`}
                style={{ color: "var(--color-teal-900)" }}
              >
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* Leírás — Sanity „Második szövegblokk” kitöltve felülírja a statikus futás leírást */}
        <PageBody text={mainBody} />

        {/* Távok */}
        <div
          className="mb-8 overflow-hidden rounded-2xl shadow-xl"
          style={{ background: "var(--color-cream-50)" }}
        >
          <div
            className="px-5 py-3 text-center"
            style={{ background: "var(--color-accent-500)", color: "#fdf6e3" }}
          >
            <h3 className="font-display text-lg font-black uppercase tracking-wider">
              {distancesSectionTitle}
            </h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr
                className="border-b"
                style={{
                  borderColor: "rgba(10,58,54,0.12)",
                  background: "rgba(239,122,31,0.08)",
                }}
              >
                <th
                  className="px-5 py-3 text-left text-[11px] font-black uppercase tracking-wider"
                  style={{ color: "var(--color-accent-700)" }}
                >
                  {ui.tableCategory}
                </th>
                <th
                  className="px-5 py-3 text-left text-[11px] font-black uppercase tracking-wider"
                  style={{ color: "var(--color-accent-700)" }}
                >
                  {ui.tableDistance}
                </th>
                <th
                  className="px-5 py-3 text-right text-[11px] font-black uppercase tracking-wider"
                  style={{ color: "var(--color-accent-700)" }}
                >
                  {ui.tableFee}
                </th>
              </tr>
            </thead>
            <tbody>
              {distanceRows.map((d, i) => (
                <tr
                  key={i}
                  className="border-b last:border-0"
                  style={{ borderColor: "rgba(10,58,54,0.08)" }}
                >
                  <td
                    className="px-5 py-3 font-bold"
                    style={{ color: "var(--color-teal-900)" }}
                  >
                    {d.category}
                  </td>
                  <td
                    className="px-5 py-3"
                    style={{ color: "rgba(10,58,54,0.7)" }}
                  >
                    {d.distance}
                  </td>
                  <td
                    className="px-5 py-3 text-right font-mono font-black"
                    style={{ color: "var(--color-accent-600)" }}
                  >
                    {d.fee}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Nevezés info */}
        <div
          className="mb-8 rounded-2xl p-5 shadow-lg"
          style={{ background: "rgba(253,246,227,0.92)" }}
        >
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--color-teal-900)" }}
          >
            <strong className="font-black uppercase tracking-wider">
              {ui.deadlineLead}
            </strong>{" "}
            {entryDeadline}
          </p>
        </div>

        <p
          className="mb-8 text-sm leading-relaxed"
          style={{ color: "rgba(253,246,227,0.88)" }}
        >
          {resultsNote}
        </p>

        <div className="mb-10 flex flex-wrap items-center justify-center gap-4">
          <RunningCTAButtons entryUrl={entryUrl} entryLabel={entryLabel} secondaryUrl={secondaryUrl} secondaryLabel={secondaryLabel} />
        </div>

        <div
          className="rounded-2xl p-5 text-sm shadow-lg sm:p-6"
          style={{ background: "var(--color-cream-50)" }}
        >
          <p
            className="text-xs font-black uppercase tracking-[0.22em]"
            style={{ color: "var(--color-accent-600)" }}
          >
            {ui.contact}
          </p>
          <p className="mt-2" style={{ color: "var(--color-teal-900)" }}>
            <a
              href={`mailto:${running.contactEmail}`}
              className="font-bold hover:underline"
            >
              {running.contactEmail}
            </a>
            <span className="mx-2" style={{ color: "rgba(10,58,54,0.35)" }}>
              ·
            </span>
            <a
              href={`tel:${running.contactPhone}`}
              className="font-bold hover:underline"
            >
              {running.contactPhone}
            </a>
          </p>
        </div>
      </div>
    </BeachPageShell>
  );
}
