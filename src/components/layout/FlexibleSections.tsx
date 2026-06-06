import Image from "next/image";
import type { Locale } from "@/lib/types";
import type { SanityPage } from "@/sanity/types";
import RichText from "@/components/common/RichText";
import VideoLiteEmbed from "@/components/common/VideoLiteEmbed";
import { sanityImageUrl } from "@/sanity/lib/image";
import { resolveVideoThumbnailUrl } from "@/lib/videoThumbnail";

type Props = {
  locale: Locale;
  sections?: SanityPage["sections"];
};

function localize(locale: Locale, hu?: string, en?: string): string {
  return (locale === "en" ? en : hu) || hu || en || "";
}

export default function FlexibleSections({ locale, sections }: Props) {
  if (!sections || sections.length === 0) return null;

  return (
    <div className="mx-auto mb-10 flex max-w-3xl flex-col gap-8 px-4 sm:px-0">
      {sections.map((section, index) => {
        if (!section || section.enabled === false) return null;
        switch (section._type) {
          case "sectionRichText": {
            const title = localize(locale, section.titleHu, section.titleEn);
            const body = locale === "en" ? section.bodyRichEn || section.bodyRichHu : section.bodyRichHu || section.bodyRichEn;
            if (!title && (!body || body.length === 0)) return null;
            return (
              <section key={`section-${index}`} className="w-full py-2">
                {title && <h3 className="mb-4 font-display text-2xl font-black uppercase text-[var(--color-teal-900)]">{title}</h3>}
                {body && body.length > 0 && <RichText value={body} />}
              </section>
            );
          }
          case "sectionTextBox": {
            const title = localize(locale, section.titleHu, section.titleEn);
            const body = locale === "en" ? section.bodyRichEn || section.bodyRichHu : section.bodyRichHu || section.bodyRichEn;
            if (!title && (!body || body.length === 0)) return null;
            
            let bg = "var(--color-cream-50)";
            let borderStyle = "border border-[#e8d8b8]";
            if (section.variant === "highlight") {
              bg = "rgba(239,122,31,0.06)";
              borderStyle = "border border-[var(--color-accent-500)]/20 border-l-4 border-l-[var(--color-accent-500)]";
            } else if (section.variant === "muted") {
              bg = "rgba(10,58,54,0.03)";
              borderStyle = "border border-[var(--color-teal-500)]/15 border-l-4 border-l-[var(--color-teal-500)]";
            }

            return (
              <section
                key={`section-${index}`}
                className={`rounded-2xl p-6 shadow-md w-full ${borderStyle}`}
                style={{ background: bg }}
              >
                {title && <h3 className="mb-4 font-display text-xl font-black uppercase text-[var(--color-teal-900)]">{title}</h3>}
                {body && body.length > 0 && <RichText value={body} />}
              </section>
            );
          }
          case "sectionVideo": {
            const video = section.videoRef;
            if (!video || video.enabled === false || !video.videoUrl) return null;
            return (
              <VideoLiteEmbed
                key={`section-${index}`}
                title={localize(locale, section.titleHu, section.titleEn) || localize(locale, video.titleHu, video.titleEn)}
                videoUrl={video.videoUrl}
                description={locale === "en" ? video.descriptionEn || video.descriptionHu : video.descriptionHu || video.descriptionEn}
                thumbnailUrl={resolveVideoThumbnailUrl(video.thumbnail, video.videoUrl)}
                size={video.size}
                ctaUrl={video.ctaUrl}
                ctaText={localize(locale, video.ctaTextHu, video.ctaTextEn)}
              />
            );
          }
          case "sectionButton": {
            const label = localize(locale, section.labelHu, section.labelEn);
            if (!label || !section.url) return null;
            return (
              <div key={`section-${index}`} className="flex justify-center py-2 w-full">
                <a
                  href={section.url}
                  target={section.openInNewTab ? "_blank" : undefined}
                  rel={section.openInNewTab ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-extrabold uppercase tracking-wider transition-all hover:scale-[1.03] shadow-md hover:shadow-lg focus:outline-none"
                  style={{
                    background: section.style === "secondary" ? "transparent" : "var(--color-accent-500)",
                    color: section.style === "secondary" ? "var(--color-accent-600)" : "#fdf6e3",
                    border: section.style === "secondary" ? "2px solid var(--color-accent-500)" : undefined,
                  }}
                >
                  {label}
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            );
          }
          case "sectionImage": {
            if (!section.image) return null;
            const title = localize(locale, section.titleHu, section.titleEn);
            const caption = localize(locale, section.captionHu, section.captionEn);
            const src = sanityImageUrl(section.image, { width: 1600 });
            if (!src) return null;
            return (
              <section key={`section-${index}`} className="overflow-hidden rounded-2xl border border-[#e8d8b8] bg-[var(--color-cream-50)] shadow-lg w-full">
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={src}
                    alt={title || caption || "Section image"}
                    fill
                    sizes="(max-width: 768px) 100vw, 960px"
                    className="object-cover"
                  />
                </div>
                {(title || caption) && (
                  <div className="p-5 border-t border-[#e8d8b8]/55">
                    {title && <h3 className="font-display text-lg font-black uppercase text-[var(--color-teal-900)]">{title}</h3>}
                    {caption && <p className="mt-1 text-xs text-[var(--color-teal-900)]/75 italic leading-relaxed">{caption}</p>}
                  </div>
                )}
              </section>
            );
          }
          case "sectionGallery": {
            if (!section.images || section.images.length === 0) return null;
            const title = localize(locale, section.titleHu, section.titleEn);
            return (
              <section key={`section-${index}`} className="rounded-2xl border border-[#e8d8b8] bg-[var(--color-cream-50)] p-6 shadow-lg w-full">
                {title && <h3 className="mb-5 font-display text-xl font-black uppercase text-[var(--color-teal-900)]">{title}</h3>}
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {section.images.map((img, imgIndex) => {
                    const src = sanityImageUrl(img, { width: 1000, height: 750 });
                    if (!src) return null;
                    const alt = localize(locale, img.altHu, img.altEn) || "Gallery image";
                    return (
                      <div key={imgIndex} className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[#e8d8b8]/40 shadow-sm transition-transform hover:scale-[1.02] hover:shadow-md">
                        <Image src={src} alt={alt} fill className="object-cover" />
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          }
          case "sectionSpacer": {
            const height = section.size === "sm" ? 16 : section.size === "lg" ? 48 : section.size === "xl" ? 80 : 32;
            return (
              <div
                key={`section-${index}`}
                style={{ height }}
                className={section.showDivider ? "border-t border-[rgba(10,58,54,0.08)] my-2" : ""}
                aria-hidden="true"
              />
            );
          }
          default:
            return null;
        }
      })}
    </div>
  );
}
