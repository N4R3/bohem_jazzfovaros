import { defineField, defineType } from "sanity";

export const transportItemType = defineType({
  name: "transportItem",
  title: "Transport item",
  type: "document",
  preview: {
    select: { title: "titleHu", subtitle: "icon" },
  },
  fields: [
    defineField({ name: "titleHu", type: "string", title: "Cím (HU)" }),
    defineField({ name: "titleEn", type: "string", title: "Cím (EN)" }),
    defineField({ name: "descriptionHu", type: "text", rows: 3, title: "Leírás (HU)" }),
    defineField({ name: "descriptionEn", type: "text", rows: 3, title: "Leírás (EN)" }),
    defineField({
      name: "icon",
      type: "string",
      title: "Ikon",
      description: "Közlekedési mód ikonja: car, train, bus",
      options: {
        list: [
          { title: "Autó", value: "car" },
          { title: "Vonat", value: "train" },
          { title: "Busz", value: "bus" },
        ],
      },
    }),
    defineField({ name: "url", type: "url", title: "Kapcsolódó URL (opcionális)" }),
    defineField({ name: "order", type: "number", initialValue: 0, description: "Sorrend a listában" }),
    defineField({ name: "isActive", type: "boolean", initialValue: true, description: "Megjelenik az oldalon?" }),
  ],
});
