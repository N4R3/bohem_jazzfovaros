import { defineField, defineType } from "sanity";

export const pageType = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({ name: "slug", type: "slug", options: { source: "titleHu", maxLength: 96 } }),
    defineField({ name: "titleHu", type: "string" }),
    defineField({ name: "titleEn", type: "string" }),
    defineField({ name: "bodyHu", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "bodyEn", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "heroTitleHu", type: "string" }),
    defineField({ name: "heroTitleEn", type: "string" }),
    defineField({ name: "heroDescriptionHu", type: "text", rows: 3 }),
    defineField({ name: "heroDescriptionEn", type: "text", rows: 3 }),
    defineField({ name: "seo", type: "seo" }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
    defineField({ name: "isActive", type: "boolean", initialValue: true }),
  ],
});
