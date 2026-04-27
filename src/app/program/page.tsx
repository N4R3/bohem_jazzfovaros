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
  { bg: "#e84a5f", text: "#fdf6e3", label: "#fde0d0" },
  { bg: "#ef7a1f", text: "#fdf6e3", label: "#fde2c8" },
  { bg: "#f2c94c", text: "#0e4844", label: "#4a3a20" },
  { bg: "#1f7e73", text: "#fdf6e3", label: "#a0d8d0" },
];

export default async function ProgramPage() {
  const c = await getContent();
  const locale = await getLocale();
  const program = await getProgramContent(locale);
  const isEn = c.otherLocale.label === "HU";

  return (
    <BeachPageShell
      eyebrow={`${c.meta.festivalDates} · ${c.meta.city}`}
      title={program.title}
      subtitle={program.subtitle}
      compact
      canonicalPath="/program/"
      locale={isEn ? "en" : "hu"}
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {program.days.map((day, idx) => {
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
              {/* nap fejléce — színkódolva */}
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
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider"
                          style={{
                            background:
                              slot.stage === "main"
                                ? "rgba(239,122,31,0.18)"
                                : "rgba(31,126,115,0.18)",
                            color:
                              slot.stage === "main"
                                ? "var(--color-accent-700)"
                                : "var(--color-teal-800)",
                          }}
                        >
                          {slot.stage === "main"
                            ? program.stageMain
                            : program.stageClub}
                        </span>
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
    </BeachPageShell>
  );
}
