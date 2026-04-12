"use client";

import Link from "next/link";
import type { QuickLink } from "@/lib/types";
import { useInView } from "@/hooks/useInView";
import Container from "@/components/ui/Container";

const iconPaths: Record<string, string> = {
  ticket: "M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z",
  map: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
  hotel: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
};

interface Props {
  items: QuickLink[];
}

export default function QuickLinks({ items }: Props) {
  const { ref, inView } = useInView(0.1);

  return (
    <section className="bg-[var(--color-cream-50)] py-10 md:py-14">
      <Container>
        <div
          ref={ref}
          className="grid gap-4 sm:grid-cols-3"
        >
          {items.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-4 rounded-2xl border border-[var(--color-cream-200)] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-gold-300)] hover:shadow-md"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(16px)",
                transitionDelay: `${i * 80}ms`,
                transition: "opacity 0.5s ease, transform 0.5s ease, border-color 0.2s, box-shadow 0.2s, translate 0.2s",
              }}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-gold-100)] transition-colors group-hover:bg-[var(--color-gold-200)]">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[var(--color-gold-600)]"
                >
                  <path d={iconPaths[item.icon] ?? iconPaths.ticket} />
                </svg>
              </div>
              <div>
                <p className="font-display text-base font-bold text-[var(--color-navy-900)] group-hover:text-[var(--color-gold-600)] transition-colors">
                  {item.label}
                </p>
                <p className="text-xs text-[var(--color-navy-900)]/55">
                  {item.description}
                </p>
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="ml-auto shrink-0 text-[var(--color-navy-900)]/25 transition-transform group-hover:translate-x-1 group-hover:text-[var(--color-gold-500)]"
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
