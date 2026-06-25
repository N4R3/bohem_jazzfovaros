import type { Metadata } from "next";
import { getContent, getLocale } from "@/lib/locale";
import BeachPageShell from "@/components/layout/BeachPageShell";
import { getProgramContent } from "@/sanity/lib/content";
import { buildPageMetadataWithSanity } from "@/sanity/lib/seoContent";
import RichText from "@/components/common/RichText";
import { localizePathForLocale } from "@/lib/languageSwitch";
import ProgramDeepLink from "@/components/program/ProgramDeepLink";
import { programSlotId } from "@/lib/programSlot";
import type { PortableTextBlock } from "@portabletext/react";
import type { ScheduleDay } from "@/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const c = await getContent();
  return buildPageMetadataWithSanity({
    slug: "program",
    path: "/program/",
    locale,
    fallbackTitle: c.program.title,
    fallbackDescription: c.program.subtitle,
    fallbackOgImage: "/images/og-image.jpg",
    siteTitle: c.meta.siteTitle,
  });
}

const dayAccents = [
  { bg: "#f2c94c", text: "#3d2e12", label: "#5a451a" },
  { bg: "#2f80ed", text: "#f5f9ff", label: "#d6e7ff" },
  { bg: "#1f7e73", text: "#f3fbf9", label: "#b7e4dd" },
  { bg: "#e84a5f", text: "#fff6f4", label: "#ffd9d2" },
];

function isMainStage(stage: string) {
  const v = (stage || "").toLowerCase();
  return v.includes("main") || v.includes("nagys") || v.includes("fő") || v.includes("fo");
}


function FreeTextProgram({ text }: { text: string | PortableTextBlock[] }) {
  if (Array.isArray(text)) {
    return (
      <article
        className="w-full rounded-2xl px-4 py-7 shadow-xl sm:px-6 sm:py-10"
        style={{ background: "var(--color-cream-50)", color: "var(--color-teal-900)" }}
      >
        <RichText value={text} />
      </article>
    );
  }
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  return (
    <article
      className="w-full rounded-2xl px-4 py-7 shadow-xl sm:px-6 sm:py-10"
      style={{ background: "var(--color-cream-50)", color: "var(--color-teal-900)" }}
    >
      {paragraphs.map((para, i) => (
        <p
          key={i}
          className="whitespace-pre-line text-base leading-relaxed sm:text-lg"
          style={{ marginTop: i === 0 ? 0 : "1.1em" }}
        >
          {para}
        </p>
      ))}
    </article>
  );
}

function StructuredProgram({
  days,
  locale,
}: {
  days: ScheduleDay[];
  locale: "hu" | "en";
}) {
  const total = days.length;
  return (
    /*
      Mobile (< md): 1 column — full-width panels, day-nav arrows visible.
      Tablet (md): 2 columns.
      Desktop (lg+): all days side by side in one row.
    */
    <div className="grid w-full grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
      {days.map((day, idx) => {
        const accent = dayAccents[idx % dayAccents.length];
        const isFirst = idx === 0;
        const isLast = idx === total - 1;
        return (
          <section
            key={day.date}
            id={`program-day-${idx}`}
            className="flex min-w-0 flex-col overflow-hidden rounded-2xl shadow-xl"
            style={{
              background: "var(--color-cream-50)",
              boxShadow: "0 12px 30px rgba(0,0,0,0.3)",
            }}
          >
            {/* Day header — coloured band with title + mobile day-nav arrows */}
            <div
              className="px-3 py-3 sm:px-4 sm:py-4"
              style={{ background: accent.bg, color: accent.text }}
            >
              <div className="flex items-start justify-between gap-2">
                {/* Day label + date */}
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-base font-black uppercase leading-tight sm:text-lg">
                    {day.label}
                  </h3>
                  <p
                    className="mt-0.5 text-[10px] font-bold uppercase tracking-widest sm:text-[11px]"
                    style={{ color: accent.label }}
                  >
                    {new Date(day.date).toLocaleDateString(
                      locale === "en" ? "en-GB" : "hu-HU",
                      { year: "numeric", month: "long", day: "numeric" },
                    )}
                  </p>
                </div>

                {/*
                  Mobile-only day navigation arrows (hidden on md+).
                  First day: next only.  Last day: prev only.  Middle: both.
                  Anchor links scroll to the target day section.
                */}
                <div className="flex shrink-0 items-center gap-1 md:hidden">
                  {!isFirst && (
                    <a
                      href={`#program-day-${idx - 1}`}
                      aria-label={locale === "en" ? "Previous day" : "Előző nap"}
                      className="flex h-7 w-7 items-center justify-center rounded-full transition-opacity hover:opacity-100"
                      style={{ background: "rgba(0,0,0,0.18)", color: accent.text, opacity: 0.85 }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </a>
                  )}
                  {!isLast && (
                    <a
                      href={`#program-day-${idx + 1}`}
                      aria-label={locale === "en" ? "Next day" : "Következő nap"}
                      className="flex h-7 w-7 items-center justify-center rounded-full transition-opacity hover:opacity-100"
                      style={{ background: "rgba(0,0,0,0.18)", color: accent.text, opacity: 0.85 }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Event slots */}
            <ul
              className="flex min-h-0 flex-1 flex-col divide-y"
              style={{ borderColor: "rgba(10,58,54,0.08)" }}
            >
              {day.slots.map((slot, i) => {
                const slotTitle = slot.eventTitle || slot.artist;
                const slotId = programSlotId(day.date, slot.time, slot.stage);
                /* Ha a sor címe pontosan egyetlen fellépő neve, a cím is a fellépő
                   kártyájára visz (a többszereplős/eseménycímes sorokat a lenyíló
                   rész fellépő-linkjei kezelik). */
                const titlePerformer =
                  slot.performers && slot.performers.length === 1 && slot.performers[0] === slotTitle
                    ? slot.performers[0]
                    : undefined;
                return (
                <li key={i}>
                  <details id={slotId || undefined} className="group program-slot overflow-hidden">
                    {/*
                      Collapsed row: time range · title · stage badge · chevron only.
                      No performer names, no large "Részletek" button.
                    */}
                    <summary className="grid cursor-pointer list-none [grid-template-columns:auto_minmax(0,1fr)_1.25rem] items-center gap-x-2 px-3 py-2 hover:bg-[rgba(10,58,54,0.03)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-500)] sm:px-3.5 sm:py-2.5">
                      {/* Time column — start time on top, end time below */}
                      <div
                        className="flex shrink-0 flex-col items-end font-mono text-xs font-black sm:text-sm"
                        style={{ color: "var(--color-accent-600)" }}
                      >
                        <span className="whitespace-nowrap leading-tight">{slot.time ?? ""}</span>
                        {slot.endTime && (
                          <span className="whitespace-nowrap leading-tight">{slot.endTime}</span>
                        )}
                      </div>

                      {/* Content column — title, stage badge below */}
                      <div className="min-w-0 flex flex-col gap-0.5">
                        <h4 className="min-w-0 text-xs font-extrabold leading-snug text-[var(--color-teal-900)] sm:text-sm">
                          {titlePerformer ? (
                            <a
                              href={localizePathForLocale(
                                `/lineup/?artist=${encodeURIComponent(titlePerformer)}`,
                                locale,
                              )}
                              className="underline-offset-2 transition-colors hover:text-[var(--color-accent-600)] hover:underline"
                            >
                              {slotTitle}
                            </a>
                          ) : (
                            slotTitle
                          )}
                        </h4>
                        {slot.stage && (
                          <span
                            className="w-fit whitespace-nowrap rounded-full px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider sm:text-[9px]"
                            style={{
                              background: isMainStage(slot.stage)
                                ? "rgba(239,122,31,0.14)"
                                : "rgba(31,126,115,0.14)",
                              color: isMainStage(slot.stage)
                                ? "var(--color-accent-700)"
                                : "var(--color-teal-800)",
                            }}
                          >
                            {slot.stage}
                          </span>
                        )}
                      </div>

                      {/* Chevron */}
                      <svg
                        className="h-3.5 w-3.5 justify-self-end self-center text-[var(--color-teal-900)]/50 transition-transform duration-200 group-open:rotate-180"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                      </svg>
                    </summary>

                    {/* Expanded details */}
                    <div className="border-t border-[var(--color-teal-500)]/10 bg-[var(--color-teal-500)]/[0.03] px-4 py-3 text-xs leading-relaxed text-[var(--color-teal-950)]/90">
                      {/* Performers — clickable, deep-link to the lineup modal */}
                      {slot.performers && slot.performers.length > 0 && (
                        <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-teal-900)]/55">
                            {locale === "en" ? "Performers" : "Fellépők"}:
                          </span>
                          {slot.performers.map((name) => (
                            <a
                              key={name}
                              href={localizePathForLocale(
                                `/lineup/?artist=${encodeURIComponent(name)}`,
                                locale,
                              )}
                              className="rounded-full bg-[rgba(31,126,115,0.12)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--color-teal-800)] transition-colors hover:bg-[rgba(239,122,31,0.18)] hover:text-[var(--color-accent-700)]"
                            >
                              {name}
                            </a>
                          ))}
                        </div>
                      )}

                      {/* Note / short description */}
                      {slot.note &&
                        (Array.isArray(slot.note)
                          ? slot.note.length > 0
                          : String(slot.note).trim()) && (
                          <div className="rich-text-xs mb-2 italic text-[var(--color-teal-900)]/70">
                            {Array.isArray(slot.note) ? (
                              <RichText value={slot.note} />
                            ) : (
                              <p>{slot.note}</p>
                            )}
                          </div>
                        )}

                      {/* Rich details */}
                      {slot.details && slot.details.length > 0 && (
                        <div className="rich-text-xs">
                          <RichText value={slot.details} />
                        </div>
                      )}

                      {/* Ticket purchase link */}
                      {slot.ticketUrl && (
                        <a
                          href={slot.ticketUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider transition-all hover:scale-[1.02]"
                          style={{ background: "var(--color-accent-500)", color: "#fdf6e3" }}
                        >
                          {locale === "en" ? "Tickets" : "Jegyek"}
                        </a>
                      )}
                    </div>
                  </details>
                </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

export default async function ProgramPage() {
  const c = await getContent();
  const locale = await getLocale();
  const program = await getProgramContent(locale);
  const isEn = c.otherLocale.label === "HU";

  const hasFree = Boolean(program.freeText);
  const hasStructured = (program.days || []).length > 0;

  /*
    Backward-compat: derive defaults from legacy programDisplayMode when the new
    per-device fields are not yet set in Sanity (undefined).
    - "structured"  → table shown, text hidden
    - "freeText"    → text shown, table hidden
    - "both"        → both shown
    - default       → table shown, text shown if content exists
  */
  const mode = program.displayMode ?? "structured";
  const defaultShowTable = mode !== "freeText";
  const defaultShowText = mode !== "structured";

  const showTableDesktop = program.showProgramTableDesktop ?? defaultShowTable;
  const showTableMobile = program.showProgramTableMobile ?? defaultShowTable;
  const showTextDesktop = program.showProgramTextDesktop ?? defaultShowText;
  const showTextMobile = program.showProgramTextMobile ?? defaultShowText;

  const desktopTableFirst = program.desktopProgramOrder !== "textFirst";
  const mobileTableFirst = program.mobileProgramOrder !== "textFirst";

  /* Whether each block has content to render (independent of visibility settings) */
  const tableVisible = hasStructured && (showTableDesktop || showTableMobile);
  const textVisible = hasFree && (showTextDesktop || showTextMobile);

  /*
    Responsive visibility classes — full Tailwind class-name strings so JIT includes them.
    The wrapper uses flex-col; CSS order properties control stacking sequence.
  */
  let tableVisClass = "";
  if (!showTableMobile && showTableDesktop) tableVisClass = "hidden md:block";
  else if (showTableMobile && !showTableDesktop) tableVisClass = "md:hidden";
  else if (!showTableMobile && !showTableDesktop) tableVisClass = "hidden";

  let textVisClass = "";
  if (!showTextMobile && showTextDesktop) textVisClass = "hidden md:block";
  else if (showTextMobile && !showTextDesktop) textVisClass = "md:hidden";
  else if (!showTextMobile && !showTextDesktop) textVisClass = "hidden";

  /* Order classes — full names present as literals for Tailwind JIT */
  const mobileTableOrderClass = mobileTableFirst ? "order-1" : "order-2";
  const mobileTextOrderClass  = mobileTableFirst ? "order-2" : "order-1";
  const desktopTableOrderClass = desktopTableFirst ? "md:order-1" : "md:order-2";
  const desktopTextOrderClass  = desktopTableFirst ? "md:order-2" : "md:order-1";

  return (
    <BeachPageShell
      eyebrow={`${c.meta.festivalDates} · ${c.meta.city}`}
      title={program.title}
      subtitle={program.subtitle}
      compact
      canonicalPath="/program/"
      locale={isEn ? "en" : "hu"}
    >
      {/* Opens & scrolls to a specific slot when arriving via /program/?slot=… */}
      <ProgramDeepLink />
      {/* flex-col wrapper lets CSS order properties control table/text sequencing */}
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        {textVisible && program.freeText && (
          <div
            className={[textVisClass, mobileTextOrderClass, desktopTextOrderClass]
              .filter(Boolean)
              .join(" ")}
          >
            <FreeTextProgram text={program.freeText} />
          </div>
        )}
        {tableVisible && (
          <div
            className={[tableVisClass, mobileTableOrderClass, desktopTableOrderClass]
              .filter(Boolean)
              .join(" ")}
          >
            <StructuredProgram days={program.days} locale={locale} />
          </div>
        )}
      </div>
    </BeachPageShell>
  );
}
