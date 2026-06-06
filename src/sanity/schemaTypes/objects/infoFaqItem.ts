import { defineField, defineType } from "sanity";
import { richText } from "./richText";

export const infoFaqItemType = defineType({
  name: "infoFaqItem",
  title: "GYIK elem",
  type: "object",
  fields: [
    defineField({
      name: "questionHu",
      title: "Kérdés (HU)",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "questionEn",
      title: "Kérdés (EN)",
      type: "string",
    }),
    defineField({
      name: "answerRichHu",
      title: "Válasz (HU)",
      ...richText,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "answerRichEn",
      title: "Válasz (EN)",
      ...richText,
    }),
  ],
  preview: {
    select: { title: "questionHu" },
    prepare({ title }) {
      return { title: title || "GYIK elem" };
    },
  },
});
