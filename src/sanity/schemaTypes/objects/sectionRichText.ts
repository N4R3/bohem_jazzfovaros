import { defineField, defineType } from "sanity";
import { richText } from "./richText";

export const sectionRichTextType = defineType({
  name: "sectionRichText",
  title: "Szekció: Rich text",
  type: "object",
  fields: [
    defineField({
      name: "enabled",
      title: "Engedélyezett",
      type: "boolean",
      initialValue: true,
    }),
    defineField({ name: "titleHu", title: "Cím (HU)", type: "string" }),
    defineField({ name: "titleEn", title: "Cím (EN)", type: "string" }),
    defineField({ name: "bodyRichHu", title: "Tartalom (HU)", ...richText }),
    defineField({ name: "bodyRichEn", title: "Tartalom (EN)", ...richText }),
  ],
  preview: {
    select: { title: "titleHu", enabled: "enabled" },
    prepare({ title, enabled }) {
      return { title: title || "Rich text szekció", subtitle: enabled === false ? "inaktív" : "aktív" };
    },
  },
});
