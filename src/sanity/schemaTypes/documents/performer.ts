import { defineField, defineType } from "sanity";

export const performerType = defineType({
  name: "performer",
  title: "Performer",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "name", maxLength: 96 } }),
    defineField({ name: "image", type: "image", validation: (rule) => rule.required() }),
    defineField({
      name: "imagePath",
      title: "Legacy image path",
      type: "string",
      description:
        "Régi public/images útvonal. Akkor használja az oldal, ha nincs Sanity image feltöltve.",
      readOnly: true,
    }),
    defineField({ name: "shortDescriptionHu", type: "text", rows: 2 }),
    defineField({ name: "shortDescriptionEn", type: "text", rows: 2 }),
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
