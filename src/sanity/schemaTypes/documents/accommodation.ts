import { defineField, defineType } from "sanity";

export const accommodationType = defineType({
  name: "accommodation",
  title: "Szállás",
  type: "document",
  description: "Szállodák / kemping a Szállás oldalon. A sorrendet az `order` mező vezérli.",
  fields: [
    defineField({ name: "name", title: "Szállás neve", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "descriptionHu", title: "Leírás (HU)", type: "text", rows: 3 }),
    defineField({ name: "descriptionEn", title: "Leírás (EN)", type: "text", rows: 3 }),
    defineField({
      name: "image",
      title: "Kép",
      type: "image",
      description: "Sanity asset (ajánlott). Ha üres, a legacy útvonal érvényesül.",
    }),
    defineField({
      name: "imagePath",
      title: "Legacy kép útvonal",
      type: "string",
      description: "Régi public/images útvonal — csak technikai fallback.",
      readOnly: true,
    }),
    defineField({ name: "websiteUrl", title: "Hivatalos weboldal", type: "url" }),
    defineField({ name: "bookingUrl", title: "Foglalási link", type: "url" }),
    defineField({ name: "distanceHu", title: "Távolság (HU)", type: "string", description: "Pl. „5 perc sétára a fesztiváltól”." }),
    defineField({ name: "distanceEn", title: "Distance (EN)", type: "string" }),
    defineField({ name: "order", title: "Sorrend", type: "number", initialValue: 0 }),
    defineField({ name: "isActive", title: "Aktív (megjelenik?)", type: "boolean", initialValue: true }),
  ],
  preview: { select: { title: "name", subtitle: "distanceHu", media: "image" } },
});
