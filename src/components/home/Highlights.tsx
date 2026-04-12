"use client";

import type { ReactElement } from "react";
import type { Highlight } from "@/lib/types";
import { useInView } from "@/hooks/useInView";

const icons: Record<string, ReactElement> = {
  mic: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
    </svg>
  ),
  calendar: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  music: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),
  globe: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
};

interface HighlightsProps {
  items: Highlight[];
}

export default function Highlights({ items }: HighlightsProps) {
  const { ref, inView } = useInView(0.15);

  return (
    <section aria-label="Festival highlights" className="bg-[var(--color-navy-900)] py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="grid grid-cols-2 gap-px bg-white/5 md:grid-cols-4">
          {items.map((item, i) => (
            <div
              key={item.label}
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(20px)",
                transitionDelay: `${i * 80}ms`,
                transition: "opacity 0.6s ease, transform 0.6s ease",
              }}
              className="flex flex-col items-center gap-3 bg-[var(--color-navy-900)] px-4 py-8 text-center sm:gap-4 sm:px-6 sm:py-10"
            >
              <span className="text-[var(--color-gold-500)]/70">
                {icons[item.icon] ?? icons.music}
              </span>
              <span className="font-display text-5xl font-bold leading-none text-white">
                {item.value}
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-gold-400)]">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
