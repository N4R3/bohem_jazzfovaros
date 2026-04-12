"use client";

import { useState } from "react";
import { useTheme, type ThemeId } from "@/components/theme/ThemeContext";

const THEMES = [
  { id: "1" as ThemeId, title: "Design 1 — Retro Gold", dot: "#d4a843" },
  { id: "2" as ThemeId, title: "Design 2 — Teal Water", dot: "#0a4858" },
  { id: "3" as ThemeId, title: "Design 3 — Folk Illustration", dot: "#e8823a" },
];

export default function ThemeSwitcher() {
  const { theme: active, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  function apply(id: ThemeId) {
    setTheme(id);
  }

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col items-end gap-2">
      {open && (
        <div className="flex flex-col gap-1.5 rounded-xl border border-white/15 bg-[#0f1b2d]/95 p-3 shadow-xl backdrop-blur-sm">
          <p className="mb-1 px-1 text-[10px] font-bold uppercase tracking-widest text-white/40">
            Dizájn teszt
          </p>
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => apply(t.id)}
              title={t.title}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold transition-all ${
                active === t.id
                  ? "bg-[var(--color-gold-500)] text-[#0f1b2d]"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span
                className="h-3.5 w-3.5 shrink-0 rounded-full border border-white/20"
                style={{ background: t.dot }}
              />
              {t.title}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        title="Dizájn váltó"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0f1b2d]/90 shadow-lg backdrop-blur-sm border border-white/15 text-white/60 transition-all hover:border-[var(--color-gold-500)]/50 hover:text-[var(--color-gold-400)]"
        aria-label="Dizájn váltó"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
        </svg>
      </button>
    </div>
  );
}
