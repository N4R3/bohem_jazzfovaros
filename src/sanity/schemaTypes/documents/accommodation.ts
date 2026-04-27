import { defineField, defineType } from "sanity";

export const accommodationType = defineType({
  name: "accommodation",
  title: "Accommodation",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string" }),
    defineField({ name: "descriptionHu", type: "text", rows: 3 }),
    defineField({ name: "descriptionEn", type: "text", rows: 3 }),
    defineField({ name: "image", type: "image" }),
    defineField({
      name: "imagePath",
      title: "Legacy image path",
      type: "string",
      description: "Régi public/images útvonal fallbackként, ha nincs Sanity image asset.",
      readOnly: true,
    }),
    defineField({ name: "websiteUrl", type: "url" }),
    defineField({ name: "bookingUrl", type: "url" }),
    defineField({ name: "distanceHu", type: "string" }),
    defineField({ name: "distanceEn", type: "string" }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
    defineField({ name: "isActive", type: "boolean", initialValue: true }),
  ],
});
