"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { Artist } from "@/lib/types";

export type LineupArtist = Artist & {
  image?: string;
  details?: string;
  lineup?: string[];
  website?: string;
  youtube?: string;
};

type Props = {
  artists: LineupArtist[];
  stageLabels: {
    main: string;
    club: string;
  };
  ticketUrl: string;
  ticketLabel: string;
};

export default function LineupGrid({
  artists,
  stageLabels,
  ticketUrl,
  ticketLabel,
}: Props) {
  const [activeArtist, setActiveArtist] = useState<LineupArtist | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const artistParam = params.get("artist");
    if (!artistParam) return;

    const target = artists.find(
      (artist) => artist.name.toLowerCase() === artistParam.toLowerCase()
    );

    if (target) {
      setActiveArtist(target);
    }
  }, [artists]);

  useEffect(() => {
    if (!activeArtist) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveArtist(null);
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeArtist]);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (activeArtist) {
      url.searchParams.set("artist", activeArtist.name);
    } else {
      url.searchParams.delete("artist");
    }
    window.history.replaceState({}, "", url.toString());
  }, [activeArtist]);

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {artists.map((artist, i) => {
          const stageLabel = stageLabels[artist.stage];

          return (
            <motion.button
              type="button"
              key={`${artist.name}-${artist.time}-${artist.day}`}
              onClick={() => setActiveArtist(artist)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.36, delay: Math.min(i * 0.03, 0.35) }}
              className="group flex w-full flex-col overflow-hidden rounded-2xl text-left transition-all hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus-visible:ring-4"
              style={{
                background: "var(--color-cream-50)",
                boxShadow: "0 10px 28px rgba(0,0,0,0.28)",
                color: "var(--color-teal-900)",
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
                  style={{ background: "var(--color-accent-500)", color: "#fdf6e3" }}
                >
                  {artist.genre}
                </span>

              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-xl font-black leading-tight">{artist.name}</h3>
                <p
                  className="mt-0.5 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--color-accent-600)" }}
                >
                  {artist.origin}
                </p>

                <p className="mt-3 line-clamp-3 text-sm leading-relaxed" style={{ color: "rgba(10,58,54,0.72)" }}>
                  {artist.details || artist.bio || "Koppints a részletes fellépő-adatokhoz."}
                </p>

                {(artist.website || artist.youtube) && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {artist.website && (
                      <a
                        href={artist.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(event) => event.stopPropagation()}
                        className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider"
                        style={{ background: "#0d5f56", color: "#fff" }}
                      >
                        Weboldal
                      </a>
                    )}
                    {artist.youtube && (
                      <a
                        href={artist.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(event) => event.stopPropagation()}
                        className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider"
                        style={{ background: "#b12020", color: "#fff" }}
                      >
                        YouTube
                      </a>
                    )}
                  </div>
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
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-wider"
                    style={{
                      background: "var(--color-accent-500)",
                      color: "#fdf6e3",
                      boxShadow: "0 4px 12px rgba(212,98,26,0.35)",
                    }}
                  >
                    Részletek
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8">
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {activeArtist && (
          <motion.div
            className="fixed inset-0 z-[120] flex items-end justify-center bg-black/65 p-0 sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveArtist(null)}
          >
            <motion.article
              className="max-h-[95dvh] w-full max-w-5xl overflow-auto rounded-t-3xl bg-[#ececec] shadow-2xl sm:rounded-3xl"
              initial={{ y: 40, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 24, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.24 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="grid gap-0 md:grid-cols-[1.05fr_1.4fr]">
                <div className="relative min-h-[260px] md:min-h-full">
                  {activeArtist.image ? (
                    <Image
                      src={activeArtist.image}
                      alt={activeArtist.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-cover"
                    />
                  ) : (
                    <ArtistPlaceholder />
                  )}
                </div>

                <div className="flex flex-col p-5 sm:p-7">
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <h2
                      className="inline-block px-2 py-1 text-lg font-black uppercase sm:text-2xl"
                      style={{ background: "#147a6d", color: "#ffffff" }}
                    >
                      {activeArtist.name}
                    </h2>
                    <button
                      type="button"
                      onClick={() => setActiveArtist(null)}
                      className="rounded-full border px-2.5 py-1 text-xs font-bold uppercase"
                      style={{ borderColor: "rgba(10,58,54,0.35)", color: "rgba(10,58,54,0.8)" }}
                    >
                      Bezár
                    </button>
                  </div>

                  <p className="text-sm uppercase tracking-wide" style={{ color: "rgba(10,58,54,0.8)" }}>
                    {stageLabels[activeArtist.stage]}
                  </p>

                  <p className="mt-3 text-sm leading-7" style={{ color: "rgba(10,58,54,0.9)" }}>
                    {activeArtist.details || activeArtist.bio || "A részletes fellépő-leírás hamarosan frissül."}
                  </p>

                  {activeArtist.lineup && activeArtist.lineup.length > 0 && (
                    <div className="mt-4 border-t pt-4" style={{ borderColor: "rgba(10,58,54,0.16)" }}>
                      <p className="text-sm font-black uppercase tracking-wide" style={{ color: "#145e56" }}>
                        Közreműködők
                      </p>
                      <ul className="mt-2 space-y-1">
                        {activeArtist.lineup.map((member) => (
                          <li key={member} className="text-sm" style={{ color: "rgba(10,58,54,0.88)" }}>
                            {member}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-6 flex flex-wrap gap-3 border-t pt-4" style={{ borderColor: "rgba(10,58,54,0.16)" }}>
                    {activeArtist.website && (
                      <a
                        href={activeArtist.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider"
                        style={{ background: "#0d5f56", color: "#fff" }}
                      >
                        Weboldal
                      </a>
                    )}
                    {activeArtist.youtube && (
                      <a
                        href={activeArtist.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider"
                        style={{ background: "#b12020", color: "#fff" }}
                      >
                        YouTube
                      </a>
                    )}
                    <a
                      href={ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider"
                      style={{ background: "var(--color-accent-500)", color: "#fff" }}
                    >
                      {ticketLabel}
                    </a>
                  </div>
                </div>
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ArtistPlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg viewBox="0 0 200 150" className="h-full w-full" aria-hidden="true">
        <path
          d="M0 120 Q25 110 50 120 T100 120 T150 120 T200 120 L200 150 L0 150 Z"
          fill="rgba(255,255,255,0.2)"
        />
        <path
          d="M0 130 Q25 122 50 130 T100 130 T150 130 T200 130 L200 150 L0 150 Z"
          fill="rgba(255,255,255,0.3)"
        />
        <g transform="translate(85 40)">
          <rect x="8" y="0" width="14" height="26" rx="7" fill="#fdf6e3" stroke="#0a3a36" strokeWidth="1.5" />
          <path d="M4 22 A11 11 0 0 0 26 22" fill="none" stroke="#fdf6e3" strokeWidth="2.5" />
          <line x1="15" y1="33" x2="15" y2="46" stroke="#fdf6e3" strokeWidth="2.5" />
          <line x1="9" y1="46" x2="21" y2="46" stroke="#fdf6e3" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}
