import { defineField, defineType } from "sanity";

export const sectionImageType = defineType({
  name: "sectionImage",
  title: "Szekció: Kép",
  type: "object",
  fields: [
    defineField({ name: "enabled", title: "Engedélyezett", type: "boolean", initialValue: true }),
    defineField({ name: "titleHu", title: "Cím (HU)", type: "string" }),
    defineField({ name: "titleEn", title: "Cím (EN)", type: "string" }),
    defineField({
      name: "image",
      title: "Kép",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "captionHu", title: "Képaláírás (HU)", type: "string" }),
    defineField({ name: "captionEn", title: "Képaláírás (EN)", type: "string" }),
  ],
  preview: {
    select: { title: "titleHu", media: "image", enabled: "enabled" },
    prepare({ title, media, enabled }) {
      return { title: title || "Kép szekció", subtitle: enabled === false ? "inaktív" : "aktív", media };
    },
  },
});
