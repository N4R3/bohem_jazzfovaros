import { defineField, defineType } from "sanity";
import { richText } from "../objects/richText";

export const videoType = defineType({
  name: "video",
  title: "Videó",
  type: "document",
  description:
    "Újrafelhasználható videóelem. A honlapon előnézet + kattintásra töltődik be (nem indul el automatikusan).",
  fields: [
    defineField({
      name: "titleHu",
      title: "Cím (HU)",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "titleEn",
      title: "Cím (EN)",
      type: "string",
      description: "Opcionális; ha üres, frontend fallback kezelheti.",
    }),
    defineField({
      name: "descriptionHu",
      title: "Leírás (HU)",
      ...richText,
    }),
    defineField({
      name: "descriptionEn",
      title: "Leírás (EN)",
      ...richText,
    }),
    defineField({
      name: "videoUrl",
      title: "Videó URL",
      type: "url",
      description: "YouTube / Vimeo / közvetlen videó URL.",
      validation: (rule) =>
        rule.custom((value, context) => {
          const enabled = ((context.document as { enabled?: boolean } | undefined)?.enabled ?? true) === true;
          if (enabled && !value) return "Ha a videó engedélyezett, a Videó URL kötelező.";
          return true;
        }),
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail kép",
      type: "image",
      description:
        "Ajánlott előnézetkép. Ha üres, YouTube esetén automatikus miniatűr készül; egyébként szöveges cím jelenik meg.",
      options: { hotspot: true },
    }),
    defineField({
      name: "size",
      title: "Méret",
      type: "string",
      initialValue: "medium",
      options: {
        list: [
          { title: "Kicsi", value: "small" },
          { title: "Közepes", value: "medium" },
          { title: "Nagy", value: "large" },
          { title: "Teljes szélesség", value: "full" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "enabled",
      title: "Engedélyezett",
      type: "boolean",
      initialValue: true,
      description: "Ha kikapcsolod, a videó nem jelenik meg a honlapon (draftként megtarthatod).",
    }),
    defineField({
      name: "order",
      title: "Sorrend",
      type: "number",
      initialValue: 0,
      description: "Opcionális rendezéshez. Kisebb szám = előrébb.",
    }),
    defineField({
      name: "ctaTextHu",
      title: "CTA szöveg (HU)",
      type: "string",
    }),
    defineField({
      name: "ctaTextEn",
      title: "CTA szöveg (EN)",
      type: "string",
    }),
    defineField({
      name: "ctaUrl",
      title: "CTA URL",
      type: "url",
    }),
    defineField({
      name: "displayOnPages",
      title: "Megjelenítés oldalakon (opcionális)",
      type: "array",
      of: [{ type: "reference", to: [{ type: "page" }] }],
      description:
        "Opcionális belső jegyzet: mely oldalakhoz kapcsolódik. A megjelenítést a Page → Rugalmas szekciók vagy a főoldali videó beállítás adja.",
    }),
  ],
  preview: {
    select: {
      title: "titleHu",
      subtitleEn: "titleEn",
      enabled: "enabled",
      media: "thumbnail",
    },
    prepare({ title, subtitleEn, enabled, media }) {
      return {
        title: title || "(névtelen videó)",
        subtitle: `${enabled === false ? "inaktív" : "aktív"}${subtitleEn ? ` · EN: ${subtitleEn}` : ""}`,
        media,
      };
    },
  },
  orderings: [
    {
      title: "Sorrend szerint",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
