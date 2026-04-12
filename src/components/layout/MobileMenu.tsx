"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { NavItem } from "@/lib/types";
import LocaleSwitchAnchor from "@/components/layout/LocaleSwitchAnchor";

interface MobileMenuProps {
  nav: NavItem[];
  otherLocaleLabel: string;
  otherLocaleDomain: string;
  currentPath?: string;
}

const PANEL_MS = 880;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

export default function MobileMenu({
  nav,
  otherLocaleLabel,
  otherLocaleDomain,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [menuGen, setMenuGen] = useState(0);

  useEffect(() => {
    if (open) setMenuGen((g) => g + 1);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Menü bezárása" : "Menü megnyitása"}
        aria-expanded={open}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-white/10 md:hidden"
        style={{ color: "var(--color-navy-900)" }}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4l12 12M16 4L4 16" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h14M3 10h14M3 14h14" />
          </svg>
        )}
      </button>

      {/* Háttér — lassú elhalványulás */}
      <div
        className="fixed inset-0 top-16 z-40 md:hidden"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: `opacity ${open ? 520 : 680}ms ${EASE}`,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 100%)",
        }}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />


      {/* Panel — grid 0fr → 1fr: lassú, „összecsukódó” magasság */}
      <div
        className="fixed left-0 right-0 top-16 z-50 md:hidden"
        style={{
          display: "grid",
          gridTemplateRows: open ? "minmax(0, 1fr)" : "0fr",
          transition: `grid-template-rows ${PANEL_MS}ms ${EASE}`,
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className="max-h-[min(85dvh,720px)] overflow-x-hidden overflow-y-auto overscroll-contain rounded-b-3xl border-b-2 shadow-[0_28px_56px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.07)]"
            style={{
              background:
                "linear-gradient(168deg, rgba(22,88,78,0.99) 0%, rgba(10,42,38,0.98) 42%, rgba(5,22,20,1) 100%), radial-gradient(120% 80% at 50% -20%, rgba(249,178,51,0.14), transparent 55%)",
              borderColor: "rgba(249,178,51,0.38)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          >
            <nav
              key={menuGen}
              className="flex min-w-0 max-w-full flex-col gap-0.5 px-3 py-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-4"
            >
              {nav.map((item, i) =>
                item.href.startsWith("http") ? (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className={`min-w-0 max-w-full break-words rounded-xl px-4 py-3.5 text-base font-medium leading-snug transition-colors hover:bg-white/10 ${
                      open ? "mobile-nav-link-in" : ""
                    }`}
                    style={{
                      color: "#e8f4f0",
                      animationDelay: open ? `${90 + i * 62}ms` : undefined,
                    }}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`min-w-0 max-w-full break-words rounded-xl px-4 py-3.5 text-base font-medium leading-snug transition-colors hover:bg-white/10 ${
                      open ? "mobile-nav-link-in" : ""
                    }`}
                    style={{
                      color: "#e8f4f0",
                      animationDelay: open ? `${90 + i * 62}ms` : undefined,
                    }}
                  >
                    {item.label}
                  </Link>
                )
              )}
              <div
                className={`mt-2 min-w-0 max-w-full border-t pt-2 ${open ? "mobile-nav-link-in" : ""}`}
                style={{
                  borderColor: "rgba(249,178,51,0.28)",
                  animationDelay: open ? `${90 + nav.length * 62 + 40}ms` : undefined,
                }}
              >
                <LocaleSwitchAnchor
                  fallbackHref={otherLocaleDomain}
                  label={otherLocaleLabel}
                  className="block min-w-0 max-w-full break-words rounded-xl px-4 py-3.5 text-sm font-bold transition-colors hover:bg-white/10"
                  style={{ color: "#f9d47a" }}
                  onClick={() => setOpen(false)}
                />
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
