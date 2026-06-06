import { defineField, defineType } from "sanity";

export const homeStatItemType = defineType({
  name: "homeStatItem",
  title: "Főoldal statisztika",
  type: "object",
  fields: [
    defineField({
      name: "value",
      title: "Érték",
      type: "string",
      description: 'Pl. "4", "10+", "120+"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "labelHu",
      title: "Felirat (HU)",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "labelEn",
      title: "Felirat (EN)",
      type: "string",
    }),
    defineField({
      name: "icon",
      title: "Ikon",
      type: "string",
      initialValue: "calendar",
      options: {
        list: [
          { title: "Naptár", value: "calendar" },
          { title: "Globusz", value: "globe" },
          { title: "Zene", value: "music" },
          { title: "Mikrofon", value: "mic" },
        ],
      },
    }),
  ],
  preview: {
    select: { value: "value", label: "labelHu" },
    prepare({ value, label }) {
      return { title: `${value || "?"} — ${label || ""}` };
    },
  },
});
