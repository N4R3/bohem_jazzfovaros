"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import type { Artist } from "@/lib/types";
import RichText from "../common/RichText";
import type { PortableTextBlock } from "@portabletext/react";

export type LineupArtist = Artist & {
  image?: string;
  details?: string | PortableTextBlock[];
  lineup?: string[];
  /** Oldalszinten összefésült (Sanity + statikus fallback) */
  website?: string;
  youtube?: string;
  /** Related program items for this performer */
  programs?: Array<{
    date: string;
    time: string;
    stage: string;
    title?: string;
  }>;
  ticketUrl?: string;
  cardBackgroundVariant?: "navbar" | "default" | "accent";
};

function lineupWeb(a: LineupArtist) {
  return a.website ?? a.websiteUrl;
}
function lineupYoutube(a: LineupArtist) {
  return a.youtube ?? a.youtubeUrl;
}
function hasLineupLinks(a: LineupArtist) {
  return Boolean(
    lineupWeb(a) ||
      lineupYoutube(a) ||
      a.facebookUrl ||
      a.instagramUrl ||
      a.spotifyUrl
  );
}

function cardFallbackBackground(variant?: LineupArtist["cardBackgroundVariant"]) {
  if (variant === "accent") return "linear-gradient(135deg, var(--color-orange-400) 0%, var(--color-orange-600) 100%)";
  if (variant === "default") return "linear-gradient(135deg, var(--color-teal-400) 0%, var(--color-teal-600) 100%)";
  return "linear-gradient(135deg, var(--color-sky-100) 0%, var(--color-sky-200) 50%, var(--color-ocean-300) 100%)";
}

const CARD_BODY_BACKGROUND = "var(--color-cream-50)";

function PerformerCardImage({
  image,
  name,
  imageDisplayMode,
  cardBackgroundVariant,
}: {
  image?: string;
  name: string;
  imageDisplayMode?: "cover" | "contain" | "landscape" | "portrait";
  cardBackgroundVariant?: "navbar" | "default" | "accent";
}) {
  const [hasError, setHasError] = useState(false);
  const showImage = Boolean(image && !hasError);

  return (
    <div
      className="relative overflow-hidden aspect-[4/3] w-full"
      style={{
        background: showImage
          ? CARD_BODY_BACKGROUND
          : cardFallbackBackground(cardBackgroundVariant),
      }}
    >
      {image && !hasError ? (
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className={`transition-transform duration-500 group-hover:scale-[1.04] ${
            imageDisplayMode === "contain" ? "object-contain" : "object-cover"
          }`}
          style={{ objectPosition: "top center" }}
          priority={false}
          onError={() => setHasError(true)}
        />
      ) : (
        <ArtistPlaceholder />
      )}
    </div>
  );
}

type Props = {
  artists: LineupArtist[];
  ticketUrl: string;
  ticketLabel: string;
};

export default function LineupGrid({
  artists,
  ticketUrl,
  ticketLabel,
}: Props) {
  const [activeArtist, setActiveArtist] = useState<LineupArtist | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

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
          /* A fellépőhöz nem tartozik megbízható színpad/műfaj a Sanity-ben; ezért a kártyán
             nem mutatunk félrevezető badge-et. A modálban is csak akkor jelenik meg színpad-szöveg,
             ha a stageLabels-ben tényleges érték van. */
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
              <div className="relative aspect-[4/3] w-full">
                <PerformerCardImage
                  image={artist.image}
                  name={artist.name}
                  imageDisplayMode={artist.imageDisplayMode}
                  cardBackgroundVariant={artist.cardBackgroundVariant}
                />

                {/* Sanity-ből származó címkék (performer.tags). Ha nincs tag, semmi
                    nem jelenik meg — sosem mutatunk shortDescription-t tag-ként. */}
                {artist.tags && artist.tags.length > 0 && (
                  <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1.5">
                    {artist.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider shadow-lg"
                        style={{ background: "var(--color-accent-500)", color: "#fdf6e3" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col p-5">
                {/* Content — name, origin, description */}
                <h3 className="font-display text-xl font-black leading-tight">{artist.name}</h3>
                <p
                  className="mt-0.5 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--color-accent-600)" }}
                >
                  {artist.origin}
                </p>
                <div className="mt-3 line-clamp-3 text-sm leading-relaxed" style={{ color: "rgba(10,58,54,0.72)" }}>
                  {Array.isArray(artist.details) ? (
                    <RichText value={artist.details as PortableTextBlock[]} />
                  ) : Array.isArray(artist.bio) ? (
                    <RichText value={artist.bio as PortableTextBlock[]} />
                  ) : (
                    artist.details || artist.bio || "Koppints a részletes fellépő-adatokhoz."
                  )}
                </div>

                {/* Actions — always pinned to card bottom via mt-auto */}
                <div className="mt-auto">
                  {hasLineupLinks(artist) && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {lineupWeb(artist) && (
                        <a
                          href={lineupWeb(artist)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(event) => event.stopPropagation()}
                          className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider"
                          style={{ background: "#0d5f56", color: "#fff" }}
                        >
                          Weboldal
                        </a>
                      )}
                      {lineupYoutube(artist) && (
                        <a
                          href={lineupYoutube(artist)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(event) => event.stopPropagation()}
                          className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider"
                          style={{ background: "#b12020", color: "#fff" }}
                        >
                          YouTube
                        </a>
                      )}
                      {artist.facebookUrl && (
                        <a
                          href={artist.facebookUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(event) => event.stopPropagation()}
                          className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider"
                          style={{ background: "#1877f2", color: "#fff" }}
                        >
                          Facebook
                        </a>
                      )}
                      {artist.instagramUrl && (
                        <a
                          href={artist.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(event) => event.stopPropagation()}
                          className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider"
                          style={{ background: "#e4405f", color: "#fff" }}
                        >
                          Instagram
                        </a>
                      )}
                      {artist.spotifyUrl && (
                        <a
                          href={artist.spotifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(event) => event.stopPropagation()}
                          className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider"
                          style={{ background: "#1db954", color: "#fff" }}
                        >
                          Spotify
                        </a>
                      )}
                    </div>
                  )}
                  <div
                    className="mt-4 flex items-center justify-end gap-3 border-t pt-3"
                    style={{ borderColor: "rgba(10,58,54,0.12)" }}
                  >
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
              </div>
            </motion.button>
          );
        })}
      </div>

      {isMounted &&
        createPortal(
          <AnimatePresence>
            {activeArtist && (
              <motion.div
                className="fixed inset-0 z-[180] flex items-end justify-center bg-black/65 p-0 sm:items-center sm:p-6"
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
                  <div className="grid gap-0 md:grid-cols-[1.2fr_1.4fr]">
                    <div className="flex items-center justify-center overflow-hidden rounded-t-3xl md:rounded-tl-3xl md:rounded-tr-none md:rounded-bl-3xl">
                      {activeArtist.image ? (
                        <Image
                          src={activeArtist.image}
                          alt={activeArtist.name}
                          width={0}
                          height={0}
                          sizes="(max-width: 768px) 100vw, 45vw"
                          style={{ width: "100%", height: "auto" }}
                          priority={false}
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

                      {/* A modálban sem jelenítünk meg színpad-címkét, mivel a fellépőhöz
                          nem kötődik megbízható stage-érték. */}

                      <div className="mt-3 text-sm leading-7" style={{ color: "rgba(10,58,54,0.9)" }}>
                        {Array.isArray(activeArtist.bio) ? (
                          <RichText value={activeArtist.bio as PortableTextBlock[]} />
                        ) : Array.isArray(activeArtist.details) ? (
                          <RichText value={activeArtist.details as PortableTextBlock[]} />
                        ) : (
                          <p>{activeArtist.bio || activeArtist.details || "A részletes fellépő-leírás hamarosan frissül."}</p>
                        )}
                      </div>

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

                      {activeArtist.programs && activeArtist.programs.length > 0 && (
                        <div className="mt-4 border-t pt-4" style={{ borderColor: "rgba(10,58,54,0.16)" }}>
                          <p className="text-sm font-black uppercase tracking-wide" style={{ color: "#145e56" }}>
                            Program / Fellépések
                          </p>
                          <ul className="mt-2 space-y-1">
                            {activeArtist.programs.map((program, idx) => (
                              <li key={idx} className="text-sm" style={{ color: "rgba(10,58,54,0.88)" }}>
                                {program.date} · {program.time}
                                {program.stage && ` · ${program.stage}`}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="mt-6 flex flex-wrap gap-3 border-t pt-4" style={{ borderColor: "rgba(10,58,54,0.16)" }}>
                        {lineupWeb(activeArtist) && (
                          <a
                            href={lineupWeb(activeArtist)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider"
                            style={{ background: "#0d5f56", color: "#fff" }}
                          >
                            Weboldal
                          </a>
                        )}
                        {lineupYoutube(activeArtist) && (
                          <a
                            href={lineupYoutube(activeArtist)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider"
                            style={{ background: "#b12020", color: "#fff" }}
                          >
                            YouTube
                          </a>
                        )}
                        {activeArtist.facebookUrl && (
                          <a
                            href={activeArtist.facebookUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider"
                            style={{ background: "#1877f2", color: "#fff" }}
                          >
                            Facebook
                          </a>
                        )}
                        {activeArtist.instagramUrl && (
                          <a
                            href={activeArtist.instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider"
                            style={{ background: "#e4405f", color: "#fff" }}
                          >
                            Instagram
                          </a>
                        )}
                        {activeArtist.spotifyUrl && (
                          <a
                            href={activeArtist.spotifyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider"
                            style={{ background: "#1db954", color: "#fff" }}
                          >
                            Spotify
                          </a>
                        )}
                        <a
                          href={activeArtist.ticketUrl || ticketUrl}
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
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

function ArtistPlaceholder() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm border border-white/20 shadow-inner mb-2 animate-pulse">
        <svg viewBox="0 0 24 24" className="h-7 w-7 text-white/95" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider text-white/80 select-none">Bohém Jazz</span>
    </div>
  );
}
