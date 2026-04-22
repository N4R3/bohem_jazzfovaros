import type { Metadata } from "next";
import { getContent } from "@/lib/locale";
import { canonicalUrl } from "@/lib/seo";
import BeachPageShell from "@/components/layout/BeachPageShell";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent();
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

export default async function CampPage() {
  const c = await getContent();
  const { camp } = c;

  return (
    <BeachPageShell
      eyebrow="Swing · Lindy Hop · Jazz Improvizáció"
      title={camp.title}
      subtitle={camp.subtitle}
    >
      <div className="mx-auto max-w-4xl">
        {camp.videoUrl && (
          <div
            className="mb-10 overflow-hidden rounded-3xl border-4"
            style={{
              borderColor: "var(--color-accent-500)",
              boxShadow: "0 18px 50px rgba(0,0,0,0.4)",
            }}
          >
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

        <div
          className="mb-10 rounded-2xl p-6 shadow-xl sm:p-8"
          style={{ background: "var(--color-cream-50)" }}
        >
          <p
            className="text-base leading-relaxed"
            style={{ color: "rgba(10,58,54,0.78)" }}
          >
            {camp.description}
          </p>
        </div>

        {camp.entryUrl && (
          <div className="mb-12 text-center">
            <a
              href={camp.entryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-extrabold uppercase tracking-wider shadow-xl transition-transform hover:scale-[1.04]"
              style={{
                background: "var(--color-accent-500)",
                color: "#fdf6e3",
                boxShadow: "0 14px 32px rgba(212,98,26,0.45)",
              }}
            >
              {camp.entryLabel}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        )}

        <h2
          className="mb-6 text-center font-display font-black uppercase"
          style={{
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            color: "var(--color-accent-500)",
            letterSpacing: "0.04em",
            textShadow: "0 2px 10px rgba(0,0,0,0.3)",
          }}
        >
          {camp.scheduleTitle}
        </h2>

        <div className="flex flex-col gap-5">
          {camp.schedule.map((block, i) => (
            <article
              key={block.day}
              className="relative overflow-hidden rounded-2xl p-6 shadow-xl sm:p-7"
              style={{
                background: "var(--color-cream-50)",
                animation: "card-fade-in 0.55s ease-out backwards",
                animationDelay: `${i * 80}ms`,
              }}
            >
              <div
                className="absolute inset-x-0 top-0 h-1.5"
                style={{ background: "var(--color-accent-500)" }}
                aria-hidden="true"
              />
              <h3
                className="mb-4 font-display text-lg font-black uppercase leading-tight"
                style={{ color: "var(--color-teal-900)" }}
              >
                {block.day}
              </h3>
              <ul className="flex flex-col gap-2">
                {block.items.map((item, k) => (
                  <li
                    key={k}
                    className="flex items-start gap-3 text-sm leading-relaxed"
                    style={{ color: "rgba(10,58,54,0.78)" }}
                  >
                    <span
                      className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                      style={{ background: "var(--color-accent-500)" }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {camp.supporters.length > 0 && (
          <div className="mt-12">
            <p
              className="mb-4 text-center text-xs font-black uppercase tracking-[0.22em]"
              style={{ color: "var(--color-accent-500)" }}
            >
              Támogatók
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {camp.supporters.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all hover:scale-[1.04]"
                  style={{
                    background: "rgba(253,246,227,0.95)",
                    color: "var(--color-teal-900)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  }}
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </BeachPageShell>
  );
}
