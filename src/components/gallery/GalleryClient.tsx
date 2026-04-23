"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/lib/types";
import { useInView } from "@/hooks/useInView";

interface Props {
  images: GalleryImage[];
}

export default function GalleryClient({ images }: Props) {
  const [open, setOpen] = useState<number | null>(null);
  const { ref, inView } = useInView(0.05);

  const close = useCallback(() => setOpen(null), []);
  const prev = useCallback(() =>
    setOpen((i) => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length]
  );
  const next = useCallback(() =>
    setOpen((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (open === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, close, prev, next]);

  const currentLabel =
    open !== null ? images[open].alt || `Galéria kép ${open + 1}` : "";

  return (
    <>
      <div
        ref={ref}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
      >
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setOpen(i)}
            className="group relative block w-full overflow-hidden rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-400)]"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "scale(1)" : "scale(0.96)",
              transitionDelay: `${(i % 8) * 40}ms`,
              transition: "opacity 0.5s ease, transform 0.5s ease",
            }}
            aria-label={img.alt || `Photo ${i + 1}`}
          >
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={img.src}
                alt={img.alt || `Fotó ${i + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="absolute inset-0 flex items-end bg-black/0 transition-colors group-hover:bg-black/50">
              <span
                className="translate-y-full p-3 text-xs font-semibold transition-transform group-hover:translate-y-0"
                style={{ color: "#fdf6e3" }}
              >
                {img.alt}
              </span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="drop-shadow">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          className="fixed inset-0 z-[160] flex items-center justify-center bg-[#03181a]/80 p-3 backdrop-blur-[3px] sm:p-5"
          onClick={close}
        >
          <div
            className="relative flex w-full max-w-6xl flex-col rounded-2xl border border-white/15 bg-[#0e4844]/65 p-2 shadow-[0_24px_64px_rgba(0,0,0,0.45)] sm:p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#03181a] shadow-2xl">
              <Image
                src={images[open].src}
                alt={images[open].alt || `Fotó ${open + 1}`}
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-contain"
                loading="eager"
              />
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#083a44]/80 px-3 py-2 sm:px-4">
              <p className="text-sm font-semibold tracking-wide text-cream-50">{currentLabel}</p>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                {open + 1} / {images.length}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-center gap-4 pb-1">
              <button
                onClick={prev}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-400/55 bg-[#052a33] text-cream-50 transition-colors hover:bg-orange-500 hover:text-white"
                aria-label="Previous"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={next}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-400/55 bg-[#052a33] text-cream-50 transition-colors hover:bg-orange-500 hover:text-white"
                aria-label="Next"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>

            <button
              onClick={close}
              className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full border border-orange-400/60 bg-[#052a33] text-cream-50 transition-colors hover:bg-orange-500 hover:text-white"
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
