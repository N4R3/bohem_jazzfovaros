"use client";

/**
 * Minimal cookie consent banner.
 *
 * - Shows once; stores choice in localStorage under "cookie_consent"
 * - Values: "accepted" | "declined"
 * - When accepted, fires window.dataLayer push so GTM/GA4 can activate
 * - No external dependencies
 * - Replace this with a full CMP (Cookiebot, Axeptio, etc.) before launch
 */

import { useEffect, useState } from "react";

const STORAGE_KEY = "cookie_consent";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
    if (typeof window !== "undefined" && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: "cookie_consent_accepted" });
    }
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[var(--color-navy-950)]/95 px-4 py-4 backdrop-blur-md sm:px-6"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <p className="text-sm leading-relaxed text-[var(--color-cream-200)]/70">
          We use cookies to analyse traffic and improve your experience.{" "}
          <a
            href={
              process.env.NEXT_PUBLIC_BUILD_LOCALE === "en"
                ? "https://jazzcapital.hu/privacy"
                : "https://jazzfovaros.hu/adatvedelem"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[var(--color-gold-400)] transition-colors"
          >
            Privacy policy
          </a>
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            onClick={decline}
            className="flex-1 rounded-full border border-white/20 px-5 py-2.5 text-xs font-semibold text-[var(--color-cream-200)]/60 hover:border-white/40 hover:text-white transition-colors sm:flex-none sm:py-2"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="flex-1 rounded-full bg-[var(--color-gold-500)] px-5 py-2.5 text-xs font-bold text-[var(--color-navy-950)] hover:bg-[var(--color-gold-400)] transition-colors sm:flex-none sm:py-2"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
