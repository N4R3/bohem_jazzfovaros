import type { Metadata } from "next";
import Image from "next/image";
import { getContent } from "@/lib/locale";
import { canonicalUrl } from "@/lib/seo";
import { BASE } from "@/content/base";
import BeachPageShell from "@/components/layout/BeachPageShell";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent();
  return {
    title: c.map.title,
    description: c.map.subtitle,
    alternates: { canonical: canonicalUrl("/terkep/") },
    openGraph: {
      title: `${c.map.title} · ${c.meta.siteTitle}`,
      description: c.map.subtitle,
      url: canonicalUrl("/terkep/"),
    },
  };
}

const iconPaths: Record<string, string> = {
  car: "M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h14a2 2 0 012 2v6a2 2 0 01-2 2h-2m-4 0a2 2 0 11-4 0m4 0a2 2 0 10-4 0M9 7V4l6 3-6 3",
  train:
    "M12 2c-4 0-8 .5-8 4v9.5A2.5 2.5 0 006.5 18l-1 1v.5h13V19l-1-1a2.5 2.5 0 002.5-2.5V6c0-3.5-4-4-8-4zM9 17a1 1 0 110-2 1 1 0 010 2zm6 0a1 1 0 110-2 1 1 0 010 2zM4 11V7h16v4H4z",
  bus: "M8 6v6m8-6v6M4 16h16M6 20h2m8 0h2M4 6h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z",
};

export default async function MapPage() {
  const c = await getContent();
  const { map } = c;
  const gps = map.gps.replace(/\s/g, "");
  const mapsUrl = `https://www.google.com/maps?q=${gps}&z=15&output=embed`;

  return (
    <BeachPageShell
      eyebrow={BASE.venue.hu}
      title={map.title}
      subtitle={map.subtitle}
    >
      {/* Google Maps */}
      <div
        className="mx-auto mb-8 overflow-hidden rounded-3xl border-4 shadow-2xl"
        style={{
          borderColor: "var(--color-accent-500)",
          boxShadow: "0 18px 50px rgba(0,0,0,0.4)",
        }}
      >
        <div className="aspect-video w-full bg-[#0a3a36]">
          <iframe
            src={mapsUrl}
            title={`${map.title} — ${BASE.venue.hu}`}
            loading="lazy"
            allowFullScreen
            className="h-full w-full border-0"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div
          className="px-5 py-3 text-xs leading-relaxed sm:text-sm"
          style={{
            background: "var(--color-cream-50)",
            color: "var(--color-teal-800)",
          }}
        >
          <strong className="font-extrabold uppercase tracking-wider">
            Info:
          </strong>{" "}
          {map.mapNote}
        </div>
      </div>

      {/* Akciógombok */}
      <div className="mb-12 flex flex-wrap justify-center gap-3">
        <a
          href={`https://maps.google.com/?q=${gps}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-extrabold uppercase tracking-wider shadow-lg transition-transform hover:scale-[1.04]"
          style={{
            background: "var(--color-accent-500)",
            color: "#fdf6e3",
            boxShadow: "0 8px 20px rgba(212,98,26,0.4)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          Google Maps
        </a>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${gps}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border-2 px-6 py-3 text-sm font-extrabold uppercase tracking-wider transition-colors"
          style={{
            borderColor: "#f6d98b",
            color: "#f6d98b",
            background: "rgba(10,42,37,0.55)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M3 11l18-8-8 18-2-8-8-2z" />
          </svg>
          Útvonaltervező
        </a>
        <span
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-wider"
          style={{
            background: "rgba(10,42,37,0.55)",
            color: "rgba(253,246,227,0.7)",
            border: "1px solid rgba(253,246,227,0.18)",
          }}
        >
          GPS: {map.gps}
        </span>
      </div>

      {/* Interaktív fesztiváltérkép kép */}
      <div
        className="mx-auto mb-10 max-w-3xl overflow-hidden rounded-3xl border-4 shadow-2xl"
        style={{
          borderColor: "rgba(246,217,139,0.85)",
          boxShadow: "0 18px 50px rgba(0,0,0,0.4)",
          background: "rgba(10,58,54,0.65)",
        }}
      >
        <div className="relative">
          <Image
            src={map.mapImage}
            alt="JAZZFŐVÁROS fesztiváltérkép"
            width={1400}
            height={900}
            className="h-auto w-full"
            sizes="100vw"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 sm:p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-white/90">
              Interaktív térkép tippek
            </p>
            <p className="mt-1 text-xs text-white/80 sm:text-sm">
              Nagyíts rá a képre mobilon két ujjal, vagy nyisd meg teljes méretben az alábbi gombbal.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-white/20 px-4 py-4 sm:px-5">
          <a
            href={map.mapImage}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-wider"
            style={{ background: "var(--color-accent-500)", color: "#fff" }}
          >
            Térkép megnyitása nagyban
          </a>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${gps}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-extrabold uppercase tracking-wider"
            style={{ borderColor: "rgba(255,255,255,0.5)", color: "#fff" }}
          >
            Útvonal a helyszínhez
          </a>
        </div>
      </div>

      <h2
        className="mb-8 text-center font-display font-black uppercase"
        style={{
          fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
          color: "var(--color-accent-500)",
          letterSpacing: "0.04em",
          textShadow: "0 2px 10px rgba(0,0,0,0.3)",
        }}
      >
        Hogyan juss el?
      </h2>

      <div className="grid gap-5 sm:grid-cols-2">
        {map.directions.map((dir, i) => (
          <DirectionCard key={`${dir.mode}-${i}`} dir={dir} index={i} />
        ))}
      </div>
    </BeachPageShell>
  );
}

function DirectionCard({
  dir,
  index,
}: {
  dir: { mode: string; icon: string; text: string };
  index: number;
}) {
  const iconPath = iconPaths[dir.icon] ?? iconPaths.car;
  return (
    <article
      className="relative overflow-hidden rounded-2xl p-6 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl sm:p-7"
      style={{
        background: "var(--color-cream-50)",
        animation: "card-fade-in 0.6s ease-out backwards",
        animationDelay: `${index * 80}ms`,
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-1.5"
        style={{ background: "var(--color-accent-500)" }}
        aria-hidden="true"
      />

      <div className="flex items-start gap-4">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
          style={{
            background: "var(--color-accent-500)",
            color: "#fdf6e3",
            boxShadow: "0 6px 16px rgba(212,98,26,0.35)",
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={iconPath} />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <h3
            className="font-display text-xl font-black uppercase leading-tight sm:text-2xl"
            style={{ color: "var(--color-teal-900)" }}
          >
            {dir.mode}
          </h3>
          <p
            className="mt-2 text-sm leading-relaxed"
            style={{ color: "rgba(10,58,54,0.78)" }}
          >
            {dir.text}
          </p>
        </div>
      </div>
    </article>
  );
}
