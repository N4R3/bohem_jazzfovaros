import type { Metadata } from "next";
import Image from "next/image";
import { getContent } from "@/lib/locale";
import { canonicalUrl } from "@/lib/seo";
import { BASE } from "@/content/base";
import BeachPageShell from "@/components/layout/BeachPageShell";
import type { Artist } from "@/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent();
  return {
    title: c.lineup.title,
    description: c.lineup.subtitle,
    alternates: { canonical: canonicalUrl("/lineup/") },
    openGraph: {
      title: `${c.lineup.title} · ${c.meta.siteTitle}`,
      description: c.lineup.subtitle,
      url: canonicalUrl("/lineup/"),
    },
  };
}

export default async function LineupPage() {
  const c = await getContent();
  const { lineup } = c;

  const dayLabels: Record<string, string> = {
    thursday: lineup.filterThursday,
    friday: lineup.filterFriday,
    saturday: lineup.filterSaturday,
    sunday: lineup.filterSunday,
  };

  return (
    <BeachPageShell
      eyebrow={`${c.meta.festivalDates} · ${c.meta.city}`}
      title={lineup.title}
      subtitle={lineup.subtitle}
    >
      <div className="grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {lineup.artists.map((artist, i) => (
          <ArtistCard
            key={artist.name}
            artist={artist}
            index={i}
            dayLabel={dayLabels[artist.day] ?? ""}
            stageLabel={
              artist.stage === "main" ? lineup.stageMain : lineup.stageClub
            }
            ticketUrl={BASE.ticketUrl}
            ticketLabel="Jegyvásárlás"
          />
        ))}
      </div>
    </BeachPageShell>
  );
}

function ArtistCard({
  artist,
  index,
  dayLabel,
  stageLabel,
  ticketUrl,
  ticketLabel,
}: {
  artist: Artist;
  index: number;
  dayLabel: string;
  stageLabel: string;
  ticketUrl: string;
  ticketLabel: string;
}) {
  return (
    <article
      className="group flex flex-col overflow-hidden rounded-2xl transition-all hover:-translate-y-1 hover:shadow-2xl"
      style={{
        background: "var(--color-cream-50)",
        boxShadow: "0 10px 28px rgba(0,0,0,0.28)",
        animation: "card-fade-in 0.6s ease-out backwards",
        animationDelay: `${Math.min(index * 60, 600)}ms`,
      }}
    >
      <div
        className="relative aspect-[4/3] overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #87c9e6 0%, #5fb6e0 40%, #3e89a3 100%)",
        }}
      >
        {artist.image ? (
          <Image
            src={artist.image}
            alt={artist.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <ArtistPlaceholder />
        )}

        <span
          className="absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider shadow-lg"
          style={{
            background: "var(--color-accent-500)",
            color: "#fdf6e3",
          }}
        >
          {artist.genre}
        </span>

        <span
          className="absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-lg"
          style={{
            background: "rgba(10,42,37,0.88)",
            color: "#f6d98b",
          }}
        >
          {dayLabel} · {artist.time}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3
          className="font-display text-xl font-black leading-tight"
          style={{ color: "var(--color-teal-900)" }}
        >
          {artist.name}
        </h3>
        <p
          className="mt-0.5 text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--color-accent-600)" }}
        >
          {artist.origin}
        </p>

        {artist.bio && (
          <p
            className="mt-3 line-clamp-3 text-sm leading-relaxed"
            style={{ color: "rgba(10,58,54,0.72)" }}
          >
            {artist.bio}
          </p>
        )}

        <div
          className="mt-4 flex items-center justify-between gap-3 border-t pt-3"
          style={{ borderColor: "rgba(10,58,54,0.12)" }}
        >
          <span
            className="text-[10px] font-extrabold uppercase tracking-wider"
            style={{ color: "var(--color-teal-800)" }}
          >
            {stageLabel}
          </span>
          <a
            href={ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-wider transition-all hover:scale-[1.05]"
            style={{
              background: "var(--color-accent-500)",
              color: "#fdf6e3",
              boxShadow: "0 4px 12px rgba(212,98,26,0.35)",
            }}
          >
            {ticketLabel}
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
}

/** Illusztrált placeholder — mikrofon + jegy + kotta + hullámok */
function ArtistPlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg viewBox="0 0 200 150" className="h-full w-full" aria-hidden="true">
        {/* Hullámok alul */}
        <path
          d="M0 120 Q25 110 50 120 T100 120 T150 120 T200 120 L200 150 L0 150 Z"
          fill="rgba(255,255,255,0.2)"
        />
        <path
          d="M0 130 Q25 122 50 130 T100 130 T150 130 T200 130 L200 150 L0 150 Z"
          fill="rgba(255,255,255,0.3)"
        />
        {/* Mikrofon közepen */}
        <g transform="translate(85 40)">
          <rect
            x="8"
            y="0"
            width="14"
            height="26"
            rx="7"
            fill="#fdf6e3"
            stroke="#0a3a36"
            strokeWidth="1.5"
          />
          <path
            d="M4 22 A11 11 0 0 0 26 22"
            fill="none"
            stroke="#fdf6e3"
            strokeWidth="2.5"
          />
          <line x1="15" y1="33" x2="15" y2="46" stroke="#fdf6e3" strokeWidth="2.5" />
          <line x1="9" y1="46" x2="21" y2="46" stroke="#fdf6e3" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        {/* Jegy bal fent */}
        <g transform="translate(30 25)" opacity="0.75">
          <rect x="0" y="0" width="20" height="14" rx="2" fill="#f9a03f" />
          <line x1="0" y1="7" x2="20" y2="7" stroke="#fff" strokeDasharray="1 1" />
        </g>
        {/* Hangjegy jobb fent */}
        <g transform="translate(145 30)" opacity="0.75">
          <circle cx="4" cy="18" r="4" fill="#fdf6e3" />
          <line x1="8" y1="18" x2="8" y2="2" stroke="#fdf6e3" strokeWidth="2" />
          <path d="M8 2 Q16 4 16 10" fill="none" stroke="#fdf6e3" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}
