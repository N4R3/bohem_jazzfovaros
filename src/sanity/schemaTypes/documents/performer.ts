import { defineField, defineType } from "sanity";

export const performerType = defineType({
  name: "performer",
  title: "Performer",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "name", maxLength: 96 } }),
    defineField({
      name: "image",
      title: "Fellépő képe",
      type: "image",
      description:
        "Sanity asset (ajánlott). Ha üres, az alábbi legacy útvonal érvényesül. A frontenden mindig egy kép jelenik meg.",
    }),
    defineField({
      name: "imagePath",
      title: "Legacy képútvonal",
      type: "string",
      description:
        "Régi public/images útvonal — csak technikai fallback, ha még nincs Sanity image feltöltve. Új tartalomnál a fenti kép-mezőt használd.",
      readOnly: true,
    }),
    defineField({
      name: "shortDescriptionHu",
      title: "Rövid leírás (HU)",
      type: "text",
      rows: 2,
      description:
        "Rövid mondat a fellépőről. A kártyán szöveges leírásként jelenik meg. NEM műfaj-címke!",
    }),
    defineField({
      name: "shortDescriptionEn",
      title: "Rövid leírás (EN)",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "tags",
      title: "Címkék / műfajok",
      type: "array",
      of: [{ type: "reference", to: [{ type: "performerTag" }] }],
      description:
        "Egy fellépőhöz több címke is rendelhető (pl. swing, blues, vendég). Ha üres, semmilyen műfaj-badge nem jelenik meg a kártyán.",
    }),
    defineField({ name: "bioHu", type: "text", rows: 5 }),
    defineField({ name: "bioEn", type: "text", rows: 5 }),
    defineField({ name: "websiteUrl", type: "url" }),
    defineField({ name: "facebookUrl", type: "url" }),
    defineField({ name: "instagramUrl", type: "url" }),
    defineField({ name: "youtubeUrl", type: "url" }),
    defineField({ name: "spotifyUrl", type: "url" }),
    defineField({
      name: "order",
      type: "number",
      initialValue: 0,
      description: "Kisebb szám = előrébb a lineupban",
    }),
    defineField({
      name: "isFeatured",
      type: "boolean",
      initialValue: false,
      description: "Ha be van kapcsolva, kiemelt helyen szerepel",
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
      title: "name",
      media: "image",
    },
  },
});
