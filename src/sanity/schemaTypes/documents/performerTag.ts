import { defineField, defineType } from "sanity";

/**
 * Fellépő címke / műfaj.
 * A performerhez `tags` reference array-en keresztül kapcsolódik. Ha egy fellépőhöz
 * nincs tag, a frontenden semmilyen műfaj-badge nem jelenik meg (a régi shortDescription
 * SOHA nem jelenik meg tag-ként, csak rendes leírásként).
 */
export const performerTagType = defineType({
  name: "performerTag",
  title: "Fellépő címke / műfaj",
  type: "document",
  description:
    "Fellépőkre rakható címkék (pl. swing, ragtime, blues, vendég). Egy fellépőhöz több címke is rendelhető. Ha nincs címke, a kártyán nem jelenik meg műfaj-badge.",
  fields: [
    defineField({
      name: "titleHu",
      title: "Név (HU)",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "titleEn",
      title: "Név (EN)",
      type: "string",
      description: "Ha üres, a magyart használjuk.",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "titleHu", maxLength: 64 },
    }),
    defineField({
      name: "order",
      title: "Sorrend",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "isActive",
      title: "Aktív",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: "titleHu", subtitle: "titleEn" },
  },
});
