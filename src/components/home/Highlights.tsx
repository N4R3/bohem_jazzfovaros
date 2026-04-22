"use client";

import type { ReactElement } from "react";
import type { Highlight } from "@/lib/types";
import { useInView } from "@/hooks/useInView";

/**
 * Kör alakú ikonok a narancs statisztika-sávhoz.
 */
const icons: Record<string, ReactElement> = {
  calendar: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  globe: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  mic: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
    </svg>
  ),
  music: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),
};

interface HighlightsProps {
  items: Highlight[];
}

export default function Highlights({ items }: HighlightsProps) {
  const { ref, inView } = useInView(0.15);

  return (
    <section
      aria-label="Festival highlights"
      className="py-10 md:py-12"
      style={{ background: "var(--color-accent-500)" }}
    >
      <div ref={ref} className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <ul className="grid grid-cols-2 gap-y-8 md:grid-cols-4 md:gap-y-0">
          {items.map((item, i) => (
            <li
              key={item.label}
              className="flex flex-col items-center gap-2 text-center"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(16px)",
                transitionDelay: `${i * 80}ms`,
                transition: "opacity 0.55s ease, transform 0.55s ease",
              }}
            >
              <span
                className="flex h-14 w-14 items-center justify-center rounded-full"
                style={{
                  background: "rgba(0,0,0,0.18)",
                  color: "#fdf6e3",
                }}
              >
                {icons[item.icon] ?? icons.music}
              </span>
              <span
                className="font-display text-4xl font-black leading-none sm:text-5xl"
                style={{ color: "#fdf6e3" }}
              >
                {item.value}
              </span>
              <span
                className="text-xs font-extrabold uppercase tracking-[0.22em]"
                style={{ color: "rgba(253,246,227,0.9)" }}
              >
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
