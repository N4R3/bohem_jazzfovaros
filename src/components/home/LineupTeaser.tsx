"use client";

/**
 * LineupTeaser — jazzdesign1 1:1 "FELLÉPŐK" szekció.
 *
 *  - Bebas Neue óriás cím narancs aláhúzással, kis alcím.
 *  - Szűrő chip-ek (MIND / CSÜT / PÉN / SZO / VAS).
 *  - 15 fellépő kártya: cream→sárga gradient, feje sziluett SVG
 *    (mixin színekkel), név (Bebas Neue), műfaj (narancs uppercase),
 *    nap pill (ink bg + yellow text). Hover: -8px, enyhe döntés.
 */

import Image from "next/image";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";

type DayKey = "all" | "cs" | "pe" | "sz" | "va";

export type LineupArtist = {
  name: string;
  genre: string;
  /** Nap rövidítés a chip-hez */
  day: "CSÜT" | "PÉN" | "SZO" | "VAS";
  /** Szűrő-kulcs */
  key: Exclude<DayKey, "all">;
  /** Háttérszín a sziluett mögé — a jazzdesign1 minden kártyához eltérő szín */
  color: string;
  /** Opcionális portré URL — ha megadjuk, azt rakjuk be placeholder helyett */
  image?: string;
};

type LineupTeaserProps = {
  title?: string;
  lede?: string;
  /** Ha nem adsz meg fellépőket, a jazzdesign1 ARTISTS listát használjuk. */
  artists?: LineupArtist[];
};

/* A X. Bohém JAZZFŐVÁROS 2026 valós fellépői (jazzfovaros.hu/fellepok).
   A színek egy 8-elemű palettából ciklikusan választódnak, hogy a kártyák
   változatosak maradjanak a vizuális design-ban. */
const DEFAULT_ARTISTS: LineupArtist[] = [
  { name: "Jazz Camp All Stars",               genre: "Klasszikus Jazz",             day: "CSÜT", key: "cs", color: "#6BA4BF" },
  { name: "Tom White & the Mad Circus",        genre: "Vintage Jazz",                day: "CSÜT", key: "cs", color: "#C7A27B" },
  { name: "Bérczesi Jazz Band",                genre: "Klasszikus Jazz",             day: "PÉN",  key: "pe", color: "#7A9E7E" },
  { name: "Bolba Éva",                         genre: "Jazz ének",                   day: "PÉN",  key: "pe", color: "#B06A6A" },
  { name: "Pribojszki Mátyás",                 genre: "Blues / Szájharmónika",       day: "PÉN",  key: "pe", color: "#8E7AAD" },
  { name: "Ken Aoki",                          genre: "Banjo",                       day: "PÉN",  key: "pe", color: "#6B8FBF" },
  { name: "Farkas Norbert Trio",               genre: "Nagybőgő",                    day: "PÉN",  key: "pe", color: "#C29144" },
  { name: "Sir Oliver Mally & P. Schneider",   genre: "Blues Duo",                   day: "PÉN",  key: "pe", color: "#9E6B6B" },
  { name: "Festival All Stars",                genre: "Nemzetközi All-Stars",        day: "PÉN",  key: "pe", color: "#4E8E9E" },
  { name: "Korb Attila Ensemble",              genre: "Harsona / Trombita",          day: "PÉN",  key: "pe", color: "#A98B4C" },
  { name: "Bohém Ragtime Jazz Band",           genre: "Ragtime / Klasszikus",        day: "SZO",  key: "sz", color: "#6E8256" },
  { name: "Emanuele Urso „King of Swing\"",    genre: "Swing / Klasszikus",          day: "SZO",  key: "sz", color: "#8B5A7A" },
  { name: "Clotile Yana",                      genre: "Jazz ének",                   day: "SZO",  key: "sz", color: "#5F8DA0" },
  { name: "Lukács Eszter & Gyárfás István",    genre: "Jazz duó",                    day: "SZO",  key: "sz", color: "#8A6F50" },
  { name: "Hunter Burgamy",                    genre: "Banjo / Gitár",               day: "SZO",  key: "sz", color: "#7A6AA8" },
  { name: "Cseh Balázs Trio",                  genre: "Jazz Dob",                    day: "SZO",  key: "sz", color: "#6BA4BF" },
  { name: "Nagy Iván Solo",                    genre: "Jazz Zongora",                day: "SZO",  key: "sz", color: "#C7A27B" },
  { name: "Farkas Péter „Bubu\" Quartet",      genre: "Nagybőgő",                    day: "SZO",  key: "sz", color: "#7A9E7E" },
  { name: "Dániel Balázs Trio",                genre: "Jazz Zongora",                day: "VAS",  key: "va", color: "#B06A6A" },
  { name: "Hungarian Jazz Embassy",            genre: "Klasszikus Jazz",             day: "VAS",  key: "va", color: "#8E7AAD" },
  { name: "Nanna Carling",                     genre: "Klasszikus / Swing",          day: "VAS",  key: "va", color: "#6B8FBF" },
  { name: "Best of Jazz Camp",                 genre: "Jazztábori produkciók",       day: "VAS",  key: "va", color: "#C29144" },
];

const FILTERS: { key: DayKey; label: string }[] = [
  { key: "all", label: "MIND" },
  { key: "cs",  label: "CSÜT" },
  { key: "pe",  label: "PÉN" },
  { key: "sz",  label: "SZO" },
  { key: "va",  label: "VAS" },
];

export default function LineupTeaser({
  title    = "Fellépők",
  lede     = "Több mint 120 zenész, 10+ országból — négy napon keresztül a kecskeméti strandon.",
  artists  = DEFAULT_ARTISTS,
}: LineupTeaserProps) {
  const [filter, setFilter] = useState<DayKey>("all");
  const list = useMemo(
    () => artists.filter((a) => filter === "all" || a.key === filter),
    [artists, filter],
  );

  return (
    <section
      id="fellepok"
      aria-label="Fellépők"
      className="relative z-[2] px-5 py-20 sm:px-8"
    >
      <div className="mx-auto max-w-[1160px]">
        {/* Cím + aláhúzás */}
        <h2
          className="relative m-0 mb-3 text-center font-display font-normal uppercase text-white"
          style={{
            fontSize: "clamp(52px, 7vw, 92px)",
            letterSpacing: "0.06em",
            textShadow: "0 4px 20px rgba(0,0,0,0.15)",
          }}
        >
          {title}
          <span
            aria-hidden="true"
            className="mx-auto mt-2.5 block h-[5px] w-20 rounded-full bg-orange-500"
          />
        </h2>

        {/* Alcím */}
        <p className="mx-auto mb-10 max-w-[600px] text-center text-[15px] font-medium tracking-[0.03em] text-white/90">
          {lede}
        </p>

        {/* Szűrő chip-ek */}
        <div className="mb-9 flex flex-wrap justify-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={cn(
                "rounded-full border-[1.5px] px-[18px] py-2 text-[13px] font-bold uppercase tracking-[0.06em] text-white transition-all duration-200",
                filter === f.key
                  ? "border-orange-500 bg-orange-500 shadow-[0_6px_16px_rgba(255,98,0,0.4)]"
                  : "border-white/30 bg-white/15 hover:bg-white/25",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Kártyarács */}
        <div className="grid grid-cols-2 gap-3 sm:gap-[18px] md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {list.map((a, i) => (
            <ArtistCard key={`${a.name}-${i}`} artist={a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Egy fellépő kártya — cream gradient, sziluett portré, nap pill
   ============================================================ */
function ArtistCard({
  artist,
  index,
}: {
  artist: LineupArtist;
  index: number;
}) {
  /* A páros kártyák enyhén balra, a páratlanok jobbra dőlnek hover-kor.
     A Tailwind JIT-nek statikus class-stringek kellenek — ezért két
     különálló class-string szerepel, és index szerint választunk. */
  const tiltClass =
    index % 2 === 0
      ? "hover:-rotate-[0.5deg]"
      : "hover:rotate-[0.8deg]";

  return (
    <article
      className={cn(
        "group flex cursor-pointer flex-col overflow-hidden rounded-[14px] bg-cream-50 shadow-[0_8px_22px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_18px_40px_rgba(0,0,0,0.25)]",
        tiltClass,
      )}
      style={{
        backgroundImage:
          "linear-gradient(180deg, #FFF6D6 0%, #FFECB3 100%)",
      }}
    >
      {/* Portré 1:1 */}
      <div className="relative aspect-square overflow-hidden">
        {artist.image ? (
          <Image
            src={artist.image}
            alt={artist.name}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 28vw, 18vw"
            className="object-cover"
          />
        ) : (
          <ArtistSilhouette color={artist.color} />
        )}
      </div>

      {/* Meta csík */}
      <div className="border-t-2 border-black/5 p-3.5 pt-3">
        <div
          className="font-display text-[20px] uppercase leading-[1.08] tracking-[0.04em] text-ink-800"
          style={{ marginBottom: 8 }}
        >
          {artist.name.toUpperCase()}
        </div>
        <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-orange-500">
          {artist.genre}
        </div>
        <span className="mt-1.5 inline-block rounded-full bg-ink-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-sun-400">
          {artist.day}
        </span>
      </div>
    </article>
  );
}

/* ============================================================
   Fej + váll sziluett SVG — egyedi színnel per-fellépő
   ============================================================ */
function ArtistSilhouette({ color }: { color: string }) {
  /* A SVG defs-be egyedi id kell, hogy több kártya ne ütközzön. */
  const id = color.replace("#", "");
  return (
    <svg
      viewBox="0 0 200 200"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    >
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor="#2A4A5A" />
        </linearGradient>
        <radialGradient id={`sp${id}`} cx="35%" cy="30%">
          <stop offset="0%" stopColor="rgba(255,230,160,0.6)" />
          <stop offset="100%" stopColor="rgba(255,230,160,0)" />
        </radialGradient>
      </defs>
      <rect width="200" height="200" fill={`url(#g${id})`} />
      <rect width="200" height="200" fill={`url(#sp${id})`} />

      {/* fej + vállak + kalap */}
      <g fill="rgba(0,0,0,0.45)">
        <ellipse cx="100" cy="90" rx="32" ry="38" />
        <path d="M50 200 L50 170 Q50 130 100 130 Q150 130 150 170 L150 200 Z" />
        <path d="M65 70 L135 70 L125 50 L75 50 Z" fill="rgba(0,0,0,0.7)" />
        <rect x="58" y="68" width="84" height="8" rx="3" fill="rgba(0,0,0,0.7)" />
      </g>

      {/* halvány szaxofon utalás */}
      <g fill="rgba(255,200,60,0.35)">
        <ellipse cx="155" cy="165" rx="16" ry="20" />
        <rect
          x="140"
          y="120"
          width="6"
          height="50"
          rx="3"
          transform="rotate(12 143 145)"
        />
      </g>
    </svg>
  );
}
