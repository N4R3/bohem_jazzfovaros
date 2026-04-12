"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import type { NavItem } from "@/lib/types";
import MobileMenu from "@/components/layout/MobileMenu";
import HeaderBrandMarks from "@/components/layout/HeaderBrandMarks";

interface Props {
  siteTitle: string;
  festivalDates: string;
  nav: NavItem[];
  otherLocale: { label: string; domain: string };
}

/** Görgetés: ne pattogjon a határon (kis rángás / dupla trigger) */
const SCROLL_ON = 72;
const SCROLL_OFF = 32;

const EASE = "cubic-bezier(0.33, 1, 0.32, 1)";
const DURATION = "1.35s";

export default function HeaderD3({ siteTitle, festivalDates, nav, otherLocale }: Props) {
  const [scrolled, setScrolled] = useState(false);

  const onScroll = useCallback(() => {
    const y = window.scrollY;
    setScrolled((prev) => {
      if (prev) return y > SCROLL_OFF;
      return y > SCROLL_ON;
    });
  }, []);

  useEffect(() => {
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const transition = [
    `margin ${DURATION} ${EASE}`,
    `width ${DURATION} ${EASE}`,
    `border-radius ${DURATION} ${EASE}`,
    `border-color 1.15s ${EASE}`,
    `box-shadow 1.2s ${EASE}`,
  ].join(", ");

  const borderSideColors = scrolled
    ? { borderColor: "rgba(249,178,51,0.42)" as const }
    : {
        borderTopColor: "transparent",
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: "rgba(249,178,51,0.32)",
      };

  return (
    <header className="sticky top-0 z-40 w-full">
      <div
        className="[backface-visibility:hidden]"
        style={{
          margin: scrolled ? "12px 24px" : "0",
          width: scrolled ? "calc(100% - 48px)" : "100%",
          borderRadius: scrolled ? "9999px" : "0",
          background: "rgba(12,48,42,0.94)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "2px solid",
          ...borderSideColors,
          boxShadow: scrolled
            ? "0 12px 40px rgba(0,0,0,0.38), 0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)"
            : "0 2px 20px rgba(0,0,0,0.40)",
          transition,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="flex h-16 w-full items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2 transition-opacity hover:opacity-85 sm:gap-3">
            <HeaderBrandMarks showDuck={false} />
            <div className="min-w-0">
              <div
                className="font-display text-sm font-bold leading-tight"
                style={{ color: "#fdf6e3" }}
              >
                {siteTitle}
              </div>
              <div className="text-[10px] font-semibold" style={{ color: "#a0d8d0" }}>
                {festivalDates}
              </div>
            </div>
          </Link>

          <nav className="hidden shrink-0 items-center gap-1 md:flex lg:gap-2">
            {nav.map((item) =>
              item.href.startsWith("http") ? (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors hover:bg-white/10 lg:text-[13px]"
                  style={{ color: "#c8e8e0" }}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors hover:bg-white/10 lg:text-[13px]"
                  style={{ color: "#c8e8e0" }}
                >
                  {item.label}
                </Link>
              )
            )}

            <a
              href={otherLocale.domain}
              className="ml-2 shrink-0 whitespace-nowrap rounded-full border-2 px-3 py-1 text-xs font-bold transition-colors hover:bg-[#f9b233]/20"
              style={{ borderColor: "rgba(249,178,51,0.55)", color: "#f9b233" }}
            >
              {otherLocale.label}
            </a>
          </nav>

          <MobileMenu
            nav={nav}
            otherLocaleLabel={otherLocale.label}
            otherLocaleDomain={otherLocale.domain}
          />
        </div>

        {!scrolled && (
          <div
            className="absolute bottom-0 left-0 right-0 h-[3px]"
            style={{
              background: "radial-gradient(circle, #f9b233 1.2px, transparent 1.2px)",
              backgroundSize: "7px 3px",
              backgroundPosition: "0 50%",
            }}
            aria-hidden="true"
          />
        )}
      </div>
    </header>
  );
}
