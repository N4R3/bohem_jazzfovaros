import { defineField, defineType } from "sanity";

export const transportItemType = defineType({
  name: "transportItem",
  title: "Transport item",
  type: "document",
  fields: [
    defineField({ name: "titleHu", type: "string" }),
    defineField({ name: "titleEn", type: "string" }),
    defineField({ name: "descriptionHu", type: "text", rows: 3 }),
    defineField({ name: "descriptionEn", type: "text", rows: 3 }),
    defineField({ name: "url", type: "url" }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
    defineField({ name: "isActive", type: "boolean", initialValue: true }),
  ],
});
