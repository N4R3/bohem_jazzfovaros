"use client";

import type { SponsorSection } from "@/lib/types";
import { useInView } from "@/hooks/useInView";
import Container from "@/components/ui/Container";

interface Props {
  sponsors: SponsorSection;
  mainTitle: string;
  sponsorsTitle: string;
  partnersTitle: string;
}

function SponsorLogo({ name, logo, url }: { name: string; logo: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-center rounded-xl border border-[var(--color-cream-200)] bg-white p-4 transition-all hover:border-[var(--color-gold-300)] hover:shadow-sm"
      title={name}
    >
      <div className="flex h-10 w-full items-center justify-center">
        <span className="text-center text-xs font-semibold text-[var(--color-navy-900)]/40 transition-colors group-hover:text-[var(--color-navy-900)]/70">
          {name}
        </span>
      </div>
    </a>
  );
}

export default function SponsorsSection({ sponsors, mainTitle, sponsorsTitle, partnersTitle }: Props) {
  const { ref, inView } = useInView(0.1);

  const tiers = [
    { label: mainTitle, items: sponsors.main, cols: "grid-cols-2 sm:grid-cols-4" },
    { label: sponsorsTitle, items: sponsors.sponsors, cols: "grid-cols-2 sm:grid-cols-2" },
    { label: partnersTitle, items: sponsors.partners, cols: "grid-cols-3 sm:grid-cols-4 md:grid-cols-6" },
  ].filter(({ items }) => items.length > 0);

  return (
    <section className="bg-[var(--color-cream-50)] py-14 md:py-20">
      <Container>
        <div
          ref={ref}
          className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          {tiers.map(({ label, items, cols }) => (
            <div key={label} className="mb-10 last:mb-0">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-navy-900)]/35">
                {label}
              </p>
              <div className={`grid gap-3 ${cols}`}>
                {items.map((s) => (
                  <SponsorLogo key={s.name} {...s} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
