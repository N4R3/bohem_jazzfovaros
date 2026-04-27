import { defineField, defineType } from "sanity";

export const sponsorType = defineType({
  name: "sponsor",
  title: "Sponsor",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "logo", type: "image", validation: (rule) => rule.required() }),
    defineField({
      name: "logoPath",
      title: "Legacy logo path",
      type: "string",
      description:
        "Régi public/images útvonal. Akkor használja az oldal, ha nincs Sanity logo feltöltve.",
      readOnly: true,
    }),
    defineField({ name: "url", type: "url" }),
    defineField({
      name: "category",
      type: "reference",
      to: [{ type: "sponsorCategory" }],
    }),
    defineField({
      name: "order",
      type: "number",
      initialValue: 0,
      description: "Sorrend a kategórián belül",
    }),
    defineField({
      name: "isActive",
      type: "boolean",
      initialValue: true,
      description: "Megjelenik az oldalon?",
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "logo",
    },
  },
});
