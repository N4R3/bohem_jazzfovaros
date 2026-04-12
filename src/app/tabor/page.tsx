import type { Metadata } from "next";
import { getContent } from "@/lib/locale";
import { canonicalUrl } from "@/lib/seo";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

export function generateMetadata(): Metadata {
  const c = getContent();
  return {
    title: c.camp.title,
    description: c.camp.subtitle,
    alternates: { canonical: canonicalUrl("/tabor/") },
    openGraph: {
      title: `${c.camp.title} · ${c.meta.siteTitle}`,
      description: c.camp.subtitle,
      url: canonicalUrl("/tabor/"),
    },
  };
}

export default function CampPage() {
  const c = getContent();
  const { camp } = c;

  return (
    <div className="min-h-screen bg-[var(--color-cream-50)] py-20">
      <Container>
        <SectionHeading title={camp.title} subtitle={camp.subtitle} />

        <div className="mx-auto max-w-3xl">
          {camp.videoUrl && (
            <div className="mb-10 overflow-hidden rounded-2xl shadow-lg">
              <div className="relative aspect-video">
                <iframe
                  src={camp.videoUrl}
                  title={camp.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
              </div>
            </div>
          )}

          <p className="mb-10 text-base leading-relaxed text-[var(--color-navy-900)]/70">
            {camp.description}
          </p>

          {camp.entryUrl && (
            <div className="mb-10 text-center">
              <a
                href={camp.entryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-[var(--color-gold-500)] px-8 py-4 text-base font-bold text-[var(--color-navy-900)] shadow-lg transition-all hover:bg-[var(--color-gold-600)] hover:scale-[1.02]"
              >
                {camp.entryLabel}
              </a>
            </div>
          )}

          <h2 className="mb-5 font-display text-xl font-bold text-[var(--color-navy-900)]">
            {camp.scheduleTitle}
          </h2>
          <div className="flex flex-col gap-4">
            {camp.schedule.map((block) => (
              <div
                key={block.day}
                className="rounded-xl border border-[var(--color-cream-200)] bg-white p-5 shadow-sm"
              >
                <h3 className="mb-3 font-display text-sm font-bold text-[var(--color-gold-600)]">
                  {block.day}
                </h3>
                <ul className="flex flex-col gap-1.5">
                  {block.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-navy-900)]/70">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-gold-400)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {camp.supporters.length > 0 && (
            <div className="mt-10">
              <p className="mb-4 text-sm font-bold uppercase tracking-widest text-[var(--color-navy-900)]/40">
                Támogatók / Supporters
              </p>
              <div className="flex flex-wrap gap-4">
                {camp.supporters.map((s) => (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 rounded-lg border border-[var(--color-cream-200)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--color-navy-900)]/70 shadow-sm transition-all hover:border-[var(--color-gold-300)] hover:text-[var(--color-navy-900)]"
                  >
                    {s.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
