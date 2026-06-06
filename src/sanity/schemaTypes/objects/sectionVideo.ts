import { defineField, defineType } from "sanity";

export const sectionVideoType = defineType({
  name: "sectionVideo",
  title: "Szekció: Videó",
  type: "object",
  description:
    "Videó referenciával. A honlapon előnézet + kattintásra töltődik be (nem indul el automatikusan).",
  fields: [
    defineField({ name: "enabled", title: "Engedélyezett", type: "boolean", initialValue: true }),
    defineField({ name: "titleHu", title: "Felülíró cím (HU)", type: "string" }),
    defineField({ name: "titleEn", title: "Felülíró cím (EN)", type: "string" }),
    defineField({
      name: "videoRef",
      title: "Videó",
      type: "reference",
      to: [{ type: "video" }],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "titleHu", enabled: "enabled", refTitle: "videoRef.titleHu" },
    prepare({ title, enabled, refTitle }) {
      return {
        title: title || refTitle || "Videó szekció",
        subtitle: enabled === false ? "inaktív" : "aktív",
      };
    },
  },
});
