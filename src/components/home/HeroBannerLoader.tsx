"use client";

import { useEffect, useState } from "react";

const MOBILE_SRC = "/images/header_phone1.png";
const DESKTOP_SRC = "/images/header_normal1.png";
const WIDE_SRC = "/images/header_wide1.png";
const FALLBACK_TIMEOUT_MS = 2800;

function heroBannerSrc(): string {
  if (typeof window === "undefined") return MOBILE_SRC;
  if (window.matchMedia("(max-width: 959px)").matches) return MOBILE_SRC;
  if (window.matchMedia("(min-width: 960px) and (min-aspect-ratio: 2/1)").matches) {
    return WIDE_SRC;
  }
  return DESKTOP_SRC;
}

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new window.Image();
    const done = () => resolve();
    img.onload = done;
    img.onerror = done;
    img.src = src;
  });
}

/**
 * Feltételes hero háttér loader — csak a főoldalon, csak amíg a CSS háttérkép tölt.
 * Nem blokkolja az oldal többi részét; max ~2.8s után mindenképp eltűnik.
 */
export default function HeroBannerLoader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const src = heroBannerSrc();

    const timeoutId = window.setTimeout(() => {
      if (!cancelled) setShow(false);
    }, FALLBACK_TIMEOUT_MS);

    void preloadImage(src).then(() => {
      if (!cancelled) setShow(false);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, []);

  if (!show) return null;

  return (
    <div className="hero-banner-loader" aria-hidden="true">
      <div className="hero-banner-loader__inner">
        <span className="hero-banner-loader__brand">Jazzfőváros</span>
        <span className="hero-banner-loader__text">Betöltés…</span>
        <div className="hero-banner-loader__lines">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
