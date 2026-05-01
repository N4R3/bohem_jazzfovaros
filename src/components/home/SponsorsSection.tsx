"use client";

import type { SponsorSection } from "@/lib/types";
import { useInView } from "@/hooks/useInView";

interface Props {
  sponsors: SponsorSection;
  mainTitle: string;
  sponsorsTitle: string;
  partnersTitle: string;
}

/**
 * Támogatók / Szponzorok / Partnerek — három egyszerű rétegként, a
 * sötét teal alapon, narancs címekkel és sima szöveg-logókkal.
 */
export default function SponsorsSection({ sponsors, mainTitle, sponsorsTitle, partnersTitle }: Props) {
  const { ref, inView } = useInView(0.1);

  const tiers = [
    { label: mainTitle, items: sponsors.main },
    { label: sponsorsTitle, items: sponsors.sponsors },
    { label: partnersTitle, items: sponsors.partners },
  ].filter(({ items }) => items.length > 0);

  return (
    <section
      className="py-14 md:py-20"
      style={{ background: "var(--color-teal-800)" }}
    >
      <div
        ref={ref}
        className={`mx-auto w-full max-w-[1400px] px-4 text-center sm:px-6 lg:px-10 transition-all duration-700 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {tiers.map(({ label, items }) => (
          <div key={label} className="mb-10 last:mb-0">
            <h3
              className="mb-5 font-display text-2xl font-black uppercase tracking-wider sm:text-3xl"
              style={{ color: "var(--color-accent-500)" }}
            >
              {label}
            </h3>
            <ul className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-10 gap-y-2">
              {items.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold uppercase tracking-wider transition-colors hover:brightness-125 sm:text-sm"
                    style={{ color: "#f6d98b" }}
                    title={s.name}
                  >
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
