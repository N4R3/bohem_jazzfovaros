"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { GalleryImage } from "@/lib/types";
import { useInView } from "@/hooks/useInView";

interface Props {
  images: GalleryImage[];
}

export default function GalleryClient({ images }: Props) {
  const [open, setOpen] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const { ref, inView } = useInView(0.05);

  useEffect(() => setMounted(true), []);

  const close = useCallback(() => setOpen(null), []);
  const prev = useCallback(
    () => setOpen((i) => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length],
  );
  const next = useCallback(
    () => setOpen((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length],
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

  return (
    <>
      {/* Galéria rács */}
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
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                className="drop-shadow"
              >
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox — portálon át renderelve document.body alá, hogy a fixed
          pozícionálás mindig a viewport-hoz igazodjon, függetlenül attól,
          hol tartunk a scrollon, és elkerülve a szülő overflow/transform
          stacking context hatásait. */}
      {mounted &&
        open !== null &&
        createPortal(
          <Lightbox
            images={images}
            open={open}
            onClose={close}
            onPrev={prev}
            onNext={next}
          />,
          document.body,
        )}
    </>
  );
}

/* ============================================================
   Lightbox — full-screen overlay minden felett.
   A teljes modal a viewporton belül marad (kép + alsó sáv).
   ============================================================ */
function Lightbox({
  images,
  open,
  onClose,
  onPrev,
  onNext,
}: {
  images: GalleryImage[];
  open: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const label = images[open].alt || `Galéria kép ${open + 1}`;

  return (
    /* Sötét teljes képernyős overlay — kívül kattintva bezárja a modált */
    <div
      className="fixed inset-0 z-[9999]"
      style={{ background: "rgba(0,0,0,0.82)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Kép megtekintése: ${label}`}
    >
      {/* Kép + kontroll panel teljes viewportban; kattintás a sötét részre zár. */}
      <div className="absolute inset-0 flex flex-col p-2 sm:p-4">

        {/* ─── Kép terület ─── */}
        <div className="relative flex min-h-0 flex-1 items-center justify-center p-1 sm:p-3">
          {/* X bezárás gomb */}
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/65 text-white transition-colors hover:border-orange-400/60 hover:bg-orange-500 sm:right-3 sm:top-3 sm:h-10 sm:w-10"
            aria-label="Bezárás (Esc)"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* A kép: max szélesség/magasság = az elérhető terület 100%-a.
              Kattintásra NEM zárul be (stopPropagation). */}
          <img
            src={images[open].src}
            alt={label}
            className="max-h-full max-w-full rounded-lg object-contain shadow-[0_8px_40px_rgba(0,0,0,0.7)]"
            loading="eager"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* ─── Alsó sáv: felirat + léptető ─── */}
        <div className="shrink-0 px-1 pb-[max(8px,env(safe-area-inset-bottom))] pt-1 sm:px-2" onClick={(e) => e.stopPropagation()}>
          {/* Felirat + számláló */}
          <div className="mb-2 flex items-center justify-between gap-3 rounded-xl bg-black/55 px-3 py-2 sm:mb-3 sm:px-4">
            <p className="min-w-0 truncate text-[12px] font-semibold text-white/90 sm:text-sm">
              {label}
            </p>
            <span className="shrink-0 text-[11px] font-bold uppercase tracking-wider text-orange-400">
              {open + 1} / {images.length}
            </span>
          </div>

          {/* Előző / Következő */}
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={(e) => { e.stopPropagation(); onPrev(); }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/60 text-white transition-colors hover:border-orange-400/60 hover:bg-orange-500 sm:h-12 sm:w-12"
              aria-label="Előző kép"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/60 text-white transition-colors hover:border-orange-400/60 hover:bg-orange-500 sm:h-12 sm:w-12"
              aria-label="Következő kép"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
