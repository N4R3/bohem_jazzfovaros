"use client";

import Link from "next/link";
import type { QuickLink } from "@/lib/types";
import { useInView } from "@/hooks/useInView";
import Container from "@/components/ui/Container";

const iconPaths: Record<string, string> = {
  ticket:
    "M15 5v2m0 4v2m0 4v2M5 5a2 2 0 0 0-2 2v3a2 2 0 0 1 0 4v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a2 2 0 0 1 0-4V7a2 2 0 0 0-2-2H5z",
  map: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
  hotel: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
};

interface Props {
  items: QuickLink[];
}

/**
 * 3 narancs pill-kártya a videó alatt — gyors link jegyvásárláshoz,
 * térképhez, szálláshoz.
 */
export default function QuickLinks({ items }: Props) {
  const { ref, inView } = useInView(0.1);

  return (
    <section className="py-8 md:py-10" style={{ background: "var(--color-teal-800)" }}>
      <Container>
        <div ref={ref} className="grid gap-4 sm:grid-cols-3">
          {items.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-4 rounded-full px-5 py-4 transition-all hover:brightness-110"
              style={{
                background: "var(--color-accent-500)",
                color: "#fdf6e3",
                boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(16px)",
                transitionDelay: `${i * 80}ms`,
                transitionProperty: "opacity, transform, filter",
                transitionDuration: "0.5s",
              }}
            >
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                style={{ background: "rgba(0,0,0,0.15)" }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={iconPaths[item.icon] ?? iconPaths.ticket} />
                </svg>
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-sm font-extrabold uppercase tracking-wider">
                  {item.label}
                </span>
                <span className="block text-[11px] font-medium opacity-85">
                  {item.description}
                </span>
              </span>

              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="shrink-0 transition-transform group-hover:translate-x-1"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
