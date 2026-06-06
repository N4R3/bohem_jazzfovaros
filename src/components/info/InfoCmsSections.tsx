import type { Locale } from "@/lib/types";
import type { SanityPage } from "@/sanity/types";
import RichText from "@/components/common/RichText";
import type { PortableTextBlock } from "@portabletext/react";

function localize(locale: Locale, hu?: string, en?: string): string {
  return (locale === "en" ? en : hu) || hu || en || "";
}

type Props = {
  locale: Locale;
  sections?: SanityPage["sections"];
};

/** Jegyek & Infó bal oszlop: Sanity Szövegdoboz / Rich Text szekciók (cream kártya stílus). */
export default function InfoCmsSections({ locale, sections }: Props) {
  if (!sections?.length) return null;

  const blocks = sections
    .map((section, index) => {
      if (!section || section.enabled === false) return null;
      if (section._type !== "sectionTextBox" && section._type !== "sectionRichText") return null;

      const title = localize(locale, section.titleHu, section.titleEn);
      const body =
        locale === "en"
          ? section.bodyRichEn || section.bodyRichHu
          : section.bodyRichHu || section.bodyRichEn;
      if (!title && (!body || body.length === 0)) return null;

      return (
        <section
          key={`info-cms-${index}`}
          className="relative overflow-hidden rounded-2xl p-6 shadow-xl sm:p-7"
          style={{ background: "var(--color-cream-50)" }}
        >
          <div
            className="absolute inset-x-0 top-0 h-1.5"
            style={{ background: "var(--color-accent-500)" }}
            aria-hidden="true"
          />
          {title && (
            <h3
              className="mb-3 font-display text-xl font-black uppercase"
              style={{ color: "var(--color-teal-900)" }}
            >
              {title}
            </h3>
          )}
          {body && body.length > 0 && (
            <div className="text-sm leading-relaxed" style={{ color: "rgba(10,58,54,0.78)" }}>
              <RichText value={body as PortableTextBlock[]} />
            </div>
          )}
        </section>
      );
    })
    .filter(Boolean);

  if (!blocks.length) return null;
  return <>{blocks}</>;
}
