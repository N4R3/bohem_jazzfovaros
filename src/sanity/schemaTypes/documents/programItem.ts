import { defineField, defineType } from "sanity";

export const programItemType = defineType({
  name: "programItem",
  title: "Program item",
  type: "document",
  fields: [
    defineField({ name: "titleHu", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "titleEn", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "descriptionHu", type: "text", rows: 3 }),
    defineField({ name: "descriptionEn", type: "text", rows: 3 }),
    defineField({ name: "date", type: "date", validation: (rule) => rule.required() }),
    defineField({ name: "startTime", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "endTime", type: "string" }),
    defineField({
      name: "stage",
      type: "string",
      validation: (rule) => rule.required(),
      description: "Pl. main, club, beach",
    }),
    defineField({ name: "category", type: "string" }),
    defineField({
      name: "performers",
      type: "array",
      of: [{ type: "reference", to: [{ type: "performer" }] }],
    }),
    defineField({
      name: "order",
      type: "number",
      initialValue: 0,
      description: "Programon belüli sorrend",
    }),
    defineField({
      name: "isActive",
      type: "boolean",
      initialValue: true,
      description: "Megjelenik az oldalon?",
    }),
    defineField({ name: "seo", type: "seo" }),
  ],
  preview: {
    select: {
      title: "titleHu",
      subtitle: "titleEn",
    },
  },
});
