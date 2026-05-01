import type { Metadata } from "next";
import { getContent, getLocale } from "@/lib/locale";
import BeachPageShell from "@/components/layout/BeachPageShell";
import { getProgramContent } from "@/sanity/lib/content";
import { buildPageMetadataWithSanity } from "@/sanity/lib/seoContent";

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

/* Heurisztika: csak a kártya színéhez. A megjelenített címke MINDIG a stage nyers értéke. */
function isMainStage(stage: string) {
  const v = (stage || "").toLowerCase();
  return v.includes("main") || v.includes("nagys") || v.includes("fő") || v.includes("fo");
}

function FreeTextProgram({ text }: { text: string }) {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  return (
    <article
      className="mx-auto max-w-3xl rounded-2xl px-6 py-8 shadow-xl sm:px-10 sm:py-12"
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
}: {
  days: Awaited<ReturnType<typeof getProgramContent>>["days"];
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {days.map((day, idx) => {
        const accent = dayAccents[idx % dayAccents.length];
        return (
          <article
            key={day.date}
            className="flex flex-col overflow-hidden rounded-2xl shadow-xl"
            style={{
              background: "var(--color-cream-50)",
              boxShadow: "0 12px 30px rgba(0,0,0,0.3)",
            }}
          >
            <div
              className="px-5 py-4"
              style={{ background: accent.bg, color: accent.text }}
            >
              <h3 className="font-display text-xl font-black uppercase leading-tight">
                {day.label}
              </h3>
              <p
                className="mt-0.5 text-[11px] font-bold uppercase tracking-widest"
                style={{ color: accent.label }}
              >
                {new Date(day.date).toLocaleDateString("hu-HU", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <ul className="flex flex-col divide-y" style={{ borderColor: "rgba(10,58,54,0.1)" }}>
              {day.slots.map((slot, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 px-4 py-3.5"
                  style={{ borderTopColor: "rgba(10,58,54,0.1)" }}
                >
                  <span
                    className="mt-0.5 w-12 shrink-0 font-mono text-sm font-black"
                    style={{ color: "var(--color-accent-600)" }}
                  >
                    {slot.time}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div
                      className="text-sm font-bold leading-snug"
                      style={{ color: "var(--color-teal-900)" }}
                    >
                      {slot.artist}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      {slot.stage && (
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider"
                          style={{
                            background: isMainStage(slot.stage)
                              ? "rgba(239,122,31,0.18)"
                              : "rgba(31,126,115,0.18)",
                            color: isMainStage(slot.stage)
                              ? "var(--color-accent-700)"
                              : "var(--color-teal-800)",
                          }}
                        >
                          {slot.stage}
                        </span>
                      )}
                      {slot.duration > 0 && (
                        <span
                          className="text-[10px] font-semibold"
                          style={{ color: "rgba(10,58,54,0.45)" }}
                        >
                          {slot.duration}&apos;
                        </span>
                      )}
                    </div>
                    {slot.note && (
                      <p
                        className="mt-1 text-[11px] italic"
                        style={{ color: "rgba(10,58,54,0.55)" }}
                      >
                        {slot.note}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </article>
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

  /* Megjelenítési mód a Sanity Page (slug=program) `programDisplayMode` mezőből.
     - structured (default): adatbázisos lista
     - freeText           : csak a programBody
     - both               : szöveg, alatta lista
     Ha freeText / both van választva, de a programBody üres, biztonsági ráterítésként
     visszaesünk a strukturált listára. */
  const mode = program.displayMode ?? "structured";
  const hasFree = Boolean(program.freeText);
  const hasStructured = (program.days || []).length > 0;

  let showFree = false;
  let showStructured = true;
  if (mode === "freeText") {
    showFree = hasFree;
    showStructured = !hasFree;
  } else if (mode === "both") {
    showFree = hasFree;
    showStructured = hasStructured;
  } else {
    showFree = false;
    showStructured = hasStructured || !hasFree;
    if (!showStructured && hasFree) showFree = true;
  }

  return (
    <BeachPageShell
      eyebrow={`${c.meta.festivalDates} · ${c.meta.city}`}
      title={program.title}
      subtitle={program.subtitle}
      compact
      canonicalPath="/program/"
      locale={isEn ? "en" : "hu"}
    >
      {showFree && program.freeText && (
        <div className={showStructured ? "mb-10" : undefined}>
          <FreeTextProgram text={program.freeText} />
        </div>
      )}
      {showStructured && <StructuredProgram days={program.days} />}
    </BeachPageShell>
  );
}
