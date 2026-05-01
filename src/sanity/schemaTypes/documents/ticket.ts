import { defineField, defineType } from "sanity";

export const ticketType = defineType({
  name: "ticket",
  title: "Jegy",
  type: "document",
  description: "Egy jegykategória a Jegyek & Infó oldalon. Sorrend = `order`. Aktív + nem rejtett jegyek látszanak.",
  fields: [
    defineField({ name: "nameHu", title: "Név (HU)", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "nameEn", title: "Név (EN)", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "descriptionHu", title: "Leírás (HU)", type: "text", rows: 2, description: "Csak a Studio listájához használjuk; az oldalon nem renderelődik (jelenleg)." }),
    defineField({ name: "descriptionEn", title: "Leírás (EN)", type: "text", rows: 2 }),
    defineField({ name: "price", title: "Ár (szöveg, pl. „24 900”)", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "currency", title: "Pénznem", type: "string", initialValue: "HUF" }),
    defineField({ name: "ticketUrlHu", title: "Jegy link (HU)", type: "url" }),
    defineField({ name: "ticketUrlEn", title: "Jegy link (EN)", type: "url" }),
    defineField({ name: "badgeHu", title: "Kiemelő badge (HU)", type: "string", description: "Pl. „HOT”, „Korlátozott”. Ha üres, nincs kiemelés." }),
    defineField({ name: "badgeEn", title: "Highlight badge (EN)", type: "string" }),
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
