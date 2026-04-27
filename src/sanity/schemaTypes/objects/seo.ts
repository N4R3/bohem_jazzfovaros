import { defineField, defineType } from "sanity";

export const seoType = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({ name: "seoTitleHu", title: "SEO title (HU)", type: "string" }),
    defineField({ name: "seoTitleEn", title: "SEO title (EN)", type: "string" }),
    defineField({
      name: "seoDescriptionHu",
      title: "SEO description (HU)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "seoDescriptionEn",
      title: "SEO description (EN)",
      type: "text",
      rows: 3,
    }),
    defineField({ name: "ogImage", title: "Open Graph image", type: "image" }),
    defineField({
      name: "canonicalOverrideHu",
      title: "Canonical override (HU)",
      type: "url",
    }),
    defineField({
      name: "canonicalOverrideEn",
      title: "Canonical override (EN)",
      type: "url",
    }),
    defineField({
      name: "noIndex",
      title: "Noindex",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
