import type { Metadata } from "next";
import { getContent } from "@/lib/locale";
import { canonicalUrl } from "@/lib/seo";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

export function generateMetadata(): Metadata {
  const c = getContent();
  return {
    title: c.program.title,
    description: c.program.subtitle,
    alternates: { canonical: canonicalUrl("/program/") },
    openGraph: {
      title: `${c.program.title} · ${c.meta.siteTitle}`,
      description: c.program.subtitle,
      url: canonicalUrl("/program/"),
    },
  };
}

export default function ProgramPage() {
  const c = getContent();
  const { program } = c;

  const stageColors: Record<string, string> = {
    main: "bg-[var(--color-gold-100)] text-[var(--color-gold-700)] border-[var(--color-gold-200)]",
    club: "bg-[var(--color-navy-900)]/5 text-[var(--color-navy-800)] border-[var(--color-navy-900)]/10",
  };

  return (
    <div className="d3-page-wrapper min-h-screen bg-[var(--color-cream-50)] py-20">
      <Container>
        <SectionHeading title={program.title} subtitle={program.subtitle} />

        <div className="d3-program-grid grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {program.days.map((day) => (
            <div
              key={day.date}
              className="d3-day-card overflow-hidden rounded-xl border border-[var(--color-cream-200)] bg-white shadow-sm"
            >
              {/* Card header — color set by CSS nth-child for theme 3 */}
              <div className="d3-day-header bg-[var(--color-navy-900)] px-5 py-4">
                <h3 className="font-display text-lg font-bold text-white">
                  {day.label}
                </h3>
                <p className="d3-day-date mt-0.5 text-xs font-medium text-[var(--color-gold-400)]">
                  {new Date(day.date).toLocaleDateString("hu-HU", {
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="flex flex-col divide-y divide-[var(--color-cream-200)]">
                {day.slots.map((slot, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 px-4 py-3.5"
                  >
                    <span className="mt-0.5 w-10 shrink-0 font-mono text-sm font-bold text-[var(--color-gold-600)]">
                      {slot.time}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold leading-snug text-[var(--color-navy-900)]">
                        {slot.artist}
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold ${stageColors[slot.stage]}`}
                        >
                          {slot.stage === "main" ? program.stageMain : program.stageClub}
                        </span>
                        <span className="text-xs text-[var(--color-navy-700)]/35">
                          {slot.duration}&apos;
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
