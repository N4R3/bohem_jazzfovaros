import { defineArrayMember, defineField, defineType } from "sanity";

export const sectionGalleryType = defineType({
  name: "sectionGallery",
  title: "Szekció: Galéria",
  type: "object",
  fields: [
    defineField({ name: "enabled", title: "Engedélyezett", type: "boolean", initialValue: true }),
    defineField({ name: "titleHu", title: "Cím (HU)", type: "string" }),
    defineField({ name: "titleEn", title: "Cím (EN)", type: "string" }),
    defineField({
      name: "images",
      title: "Képek",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "altHu", title: "Alt (HU)", type: "string" },
            { name: "altEn", title: "Alt (EN)", type: "string" },
          ],
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: { title: "titleHu", enabled: "enabled", images: "images" },
    prepare({ title, enabled, images }) {
      const count = Array.isArray(images) ? images.length : 0;
      return {
        title: title || "Galéria szekció",
        subtitle: `${enabled === false ? "inaktív" : "aktív"} · ${count} kép`,
      };
    },
  },
});
