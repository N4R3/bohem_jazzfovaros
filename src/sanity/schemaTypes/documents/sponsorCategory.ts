import { defineField, defineType } from "sanity";

export const sponsorCategoryType = defineType({
  name: "sponsorCategory",
  title: "Sponsor category",
  type: "document",
  fields: [
    defineField({ name: "titleHu", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "titleEn", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "order",
      type: "number",
      initialValue: 0,
      description: "Kategóriák sorrendje a szekcióban",
    }),
  ],
  preview: {
    select: {
      title: "titleHu",
      subtitle: "titleEn",
    },
  },
});
