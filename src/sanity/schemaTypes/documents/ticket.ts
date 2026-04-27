import { defineField, defineType } from "sanity";

export const ticketType = defineType({
  name: "ticket",
  title: "Ticket",
  type: "document",
  fields: [
    defineField({ name: "nameHu", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "nameEn", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "descriptionHu", type: "text", rows: 2 }),
    defineField({ name: "descriptionEn", type: "text", rows: 2 }),
    defineField({ name: "price", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "currency", type: "string", initialValue: "HUF" }),
    defineField({ name: "ticketUrlHu", type: "url" }),
    defineField({ name: "ticketUrlEn", type: "url" }),
    defineField({ name: "badgeHu", type: "string" }),
    defineField({ name: "badgeEn", type: "string" }),
    defineField({
      name: "isAvailable",
      type: "boolean",
      initialValue: true,
      description: "Ha ki van kapcsolva, nem vásárolható",
    }),
    defineField({
      name: "isHidden",
      type: "boolean",
      initialValue: false,
      description: "Ha be van kapcsolva, el van rejtve",
    }),
    defineField({
      name: "order",
      type: "number",
      initialValue: 0,
      description: "Jegyek megjelenési sorrendje",
    }),
  ],
  preview: {
    select: {
      title: "nameHu",
      subtitle: "nameEn",
    },
  },
});
