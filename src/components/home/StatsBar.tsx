"use client";

/**
 * StatsBar — narancs sáv 4 statisztikával (4 / 10+ / 120+ / 40+),
 * jazzdesign1 1:1: felül/alul szaggatott perforáció, emoji-körök,
 * óriási Bebas Neue számok, IntersectionObserver-re induló easeOutCubic
 * számláló-animáció, függőleges elválasztó a statok közt.
 */

import { useEffect, useRef, useState } from "react";
import type { Highlight } from "@/lib/types";

type Stat = {
  emoji: string;
  target: number;
  suffix?: string;
  label: string;
};

const ICON_TO_EMOJI: Record<string, string> = {
  calendar: "📅",
  globe: "🌍",
  music: "🎷",
  mic: "🎶",
};

function mapHighlightsToStats(items: Highlight[]): Stat[] {
  return items.map((item) => {
    const numeric = Number.parseInt(item.value.replace(/[^\d]/g, ""), 10);
    const suffix = item.value.includes("+") ? "+" : "";

    return {
      emoji: ICON_TO_EMOJI[item.icon] ?? "⭐",
      target: Number.isNaN(numeric) ? 0 : numeric,
      suffix,
      label: item.label,
    };
  });
}

type Props = {
  items: Highlight[];
  ariaLabel?: string;
};

export default function StatsBar({ items, ariaLabel = "Festival statistics" }: Props) {
  const stats = mapHighlightsToStats(items);

  return (
    <section
      aria-label={ariaLabel}
      className="relative z-[2] mt-8 bg-orange-500 px-5 py-9 text-white sm:px-8"
      style={{ boxShadow: "0 10px 30px rgba(255,98,0,0.25)" }}
    >
      {/* Szaggatott felül + alul */}
      <span aria-hidden="true" className="perf-line pointer-events-none absolute inset-x-0 top-0 h-1.5" />
      <span aria-hidden="true" className="perf-line pointer-events-none absolute inset-x-0 bottom-0 h-1.5" />

      <div className="mx-auto grid max-w-[1160px] grid-cols-2 gap-7 text-center sm:grid-cols-4 sm:gap-5">
        {stats.map((s, i) => (
          <StatItem
            key={i}
            emoji={s.emoji}
            target={s.target}
            suffix={s.suffix}
            label={s.label}
            isLast={i === stats.length - 1}
          />
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   Egy statisztikai oszlop — 0-tól `target`-ig easeOutCubic
   ============================================================ */
function StatItem({
  emoji,
  target,
  suffix = "",
  label,
  isLast,
}: Stat & { isLast: boolean }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [value, setValue] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || done) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            setDone(true);
            const dur = 1200;
            const t0 = performance.now();
            const tick = (t: number) => {
              const p = Math.min(1, (t - t0) / dur);
              const v = Math.round(target * (1 - Math.pow(1 - p, 3)));
              setValue(v);
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, done]);

  return (
    <div
      ref={ref}
      className="relative flex flex-col items-center gap-1.5"
    >
      {/* Függőleges elválasztó — sm+ csak akkor, ha NEM utolsó */}
      {!isLast && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-2.5 top-[10%] bottom-[10%] hidden w-0.5 bg-white/30 sm:block"
        />
      )}

      {/* Kis emoji kör */}
      <span
        aria-hidden="true"
        className="mb-1 grid h-10 w-10 place-items-center rounded-full bg-white/20"
      >
        {emoji}
      </span>

      {/* Szám */}
      <span
        className="font-display text-[64px] leading-none text-white"
      >
        {value}
        {suffix && value >= target ? <span>{suffix}</span> : null}
      </span>

      {/* Kis felirat */}
      <span className="text-[13px] font-extrabold uppercase tracking-[0.1em] opacity-95">
        {label}
      </span>
    </div>
  );
}
