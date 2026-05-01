import { defineField, defineType } from "sanity";

export const sponsorType = defineType({
  name: "sponsor",
  title: "Támogató / partner",
  type: "document",
  description: "Egy támogató/partner. A kategória dönti el, hogy fő-, simán szponzor- vagy partner-blokkban jelenjen meg.",
  fields: [
    defineField({ name: "name", title: "Név", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "logo",
      title: "Logó",
      type: "image",
      description:
        "Sanity asset (ajánlott). Ha üres, a legacy útvonal érvényesül. A frontenden mindig egy logó jelenik meg.",
    }),
    defineField({
      name: "logoPath",
      title: "Legacy logó útvonal",
      type: "string",
      description:
        "Régi public/images útvonal — csak technikai fallback. Új támogatónál a Logó mezőt használd.",
      readOnly: true,
    }),
    defineField({ name: "url", title: "Weboldal URL", type: "url" }),
    defineField({
      name: "category",
      title: "Kategória",
      type: "reference",
      to: [{ type: "sponsorCategory" }],
      description: "Főtámogató, szponzor vagy partner. Ha hiányzik, a támogató nem jelenik meg.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Sorrend a kategórián belül",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "isActive",
      title: "Aktív (megjelenik?)",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "logo",
    },
  },
});
