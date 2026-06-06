"use client";

import { useMemo, useState } from "react";
import RichText from "./RichText";
import { youtubeThumbnailFromUrl } from "@/lib/videoThumbnail";
import type { PortableTextBlock } from "@portabletext/react";

type Props = {
  title: string;
  videoUrl: string;
  description?: PortableTextBlock[];
  thumbnailUrl?: string;
  size?: "small" | "medium" | "large" | "full";
  ctaUrl?: string;
  ctaText?: string;
  /** Ha false, nincs krém szövegblokk a videó alatt (pl. főoldal). */
  showDetailsBelow?: boolean;
};

function normalizeEmbedUrl(url: string): string {
  if (!url) return "";
  if (url.includes("youtube.com/embed/") || url.includes("player.vimeo.com/video/")) return url;

  const ytShort = url.match(/youtu\.be\/([^?&/]+)/);
  if (ytShort?.[1]) return `https://www.youtube.com/embed/${ytShort[1]}`;
  const ytLong = url.match(/[?&]v=([^?&/]+)/);
  if (ytLong?.[1]) return `https://www.youtube.com/embed/${ytLong[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo?.[1]) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return url;
}

const widthBySize: Record<NonNullable<Props["size"]>, string> = {
  small: "max-w-xl",
  medium: "max-w-3xl",
  large: "max-w-5xl",
  full: "max-w-none",
};

export default function VideoLiteEmbed({
  title,
  videoUrl,
  description,
  thumbnailUrl,
  size = "medium",
  ctaUrl,
  ctaText,
  showDetailsBelow = true,
}: Props) {
  const [started, setStarted] = useState(false);
  const embedUrl = useMemo(() => normalizeEmbedUrl(videoUrl), [videoUrl]);
  const posterUrl = thumbnailUrl || youtubeThumbnailFromUrl(videoUrl);
  if (!videoUrl || !embedUrl) return null;

  return (
    <section className={`mx-auto w-full ${widthBySize[size]}`}>
      <div
        className="overflow-hidden rounded-2xl shadow-xl"
        style={{ background: "var(--color-cream-50)" }}
      >
        <div className="relative aspect-video">
          {started ? (
            <iframe
              src={embedUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : (
            <button
              type="button"
              onClick={() => setStarted(true)}
              aria-label={`Videó lejátszása: ${title}`}
              className="absolute inset-0 flex h-full w-full items-center justify-center overflow-hidden"
              style={{
                background: posterUrl
                  ? undefined
                  : "linear-gradient(135deg, #5fb6e0 0%, #147a6d 60%, #0a3a36 100%)",
              }}
            >
              {posterUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={posterUrl}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <span
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(rgba(10,58,54,0.25), rgba(10,58,54,0.45))" }}
                    aria-hidden="true"
                  />
                </>
              ) : (
                title && (
                  <span
                    className="absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider"
                    style={{ background: "rgba(253,246,227,0.9)", color: "var(--color-teal-900)" }}
                  >
                    {title}
                  </span>
                )
              )}
              <span
                className="relative z-[1] inline-flex h-16 w-16 items-center justify-center rounded-full"
                style={{ background: "var(--color-accent-500)", color: "#fdf6e3" }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>
          )}
        </div>
        {showDetailsBelow &&
          (title || (description && description.length > 0) || ctaUrl) && (
            <div className="p-5 sm:p-6">
              {title && (
                <h3 className="font-display text-xl font-black uppercase" style={{ color: "var(--color-teal-900)" }}>
                  {title}
                </h3>
              )}
              {description && description.length > 0 && (
                <div className="mt-3 text-sm" style={{ color: "rgba(10,58,54,0.82)" }}>
                  <RichText value={description} />
                </div>
              )}
              {ctaUrl && (
                <a
                  href={ctaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-wider"
                  style={{ background: "var(--color-accent-500)", color: "#fdf6e3" }}
                >
                  {ctaText || "További információ"}
                </a>
              )}
            </div>
          )}
      </div>
    </section>
  );
}
