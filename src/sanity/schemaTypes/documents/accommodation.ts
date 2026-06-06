import { defineField, defineType } from "sanity";
import { richText } from "../objects/richText";

export const accommodationType = defineType({
  name: "accommodation",
  title: "Szállás",
  type: "document",
  description: "Szállodák / kemping a Szállás oldalon. A sorrendet az `order` mező vezérli.",
  fields: [
    defineField({ name: "name", title: "Szállás neve", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "descriptionRichHu",
      title: "Rövid leírás (HU) — Rich Text",
      ...richText,
      description: "Kártya fölötti rövid szöveg, ha nincs részletes body.",
    }),
    defineField({
      name: "descriptionRichEn",
      title: "Rövid leírás (EN) — Rich Text",
      ...richText,
    }),
    defineField({
      name: "descriptionHu",
      title: "Rövid leírás (HU) — régi sima szöveg",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "descriptionEn",
      title: "Rövid leírás (EN) — régi sima szöveg",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "bodyRichHu",
      title: "Részletes leírás (HU)",
      ...richText,
      description:
        "Új rich text mező a részletes szállásleíráshoz. A régi plain text mezők kompatibilitás miatt megmaradnak.",
    }),
    defineField({
      name: "bodyRichEn",
      title: "Részletes leírás (EN)",
      ...richText,
      description:
        "Új rich text mező a részletes szállásleíráshoz. A régi plain text mezők kompatibilitás miatt megmaradnak.",
    }),
    defineField({ name: "priceHu", title: "Ár (HU)", type: "string", description: "Pl. \"19 950 Ft/fő/éjtől\" vagy \"Kemping árak regisztráció alapján\"" }),
    defineField({ name: "priceEn", title: "Price (EN)", type: "string" }),
    defineField({ name: "stars", title: "Csillagos besorolás", type: "number", description: "0-4 csillag, üres = nincs csillag" }),
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
    defineField({
      name: "ctaTextHu",
      title: "CTA felirat (HU)",
      type: "string",
      description: "Opcionális gombfelirat (pl. Foglalás).",
    }),
    defineField({
      name: "ctaTextEn",
      title: "CTA felirat (EN)",
      type: "string",
      description: "Opcionális gombfelirat (pl. Book now).",
    }),
    defineField({
      name: "ctaUrl",
      title: "CTA URL",
      type: "url",
      description: "Opcionális dedikált CTA link.",
    }),
    defineField({
      name: "bookingLabelHu",
      title: "Foglalás gomb felirat (HU)",
      type: "string",
      initialValue: "Foglalás",
      description: "A gombon egy nyíl ikon jelenik meg — ne írj → jelet a szöveg végére.",
    }),
    defineField({
      name: "bookingLabelEn",
      title: "Booking button label (EN)",
      type: "string",
      initialValue: "Book",
      description: "One arrow icon is shown on the button — do not add → at the end.",
    }),
    defineField({ name: "distanceHu", title: "Távolság (HU)", type: "string", description: "Pl. \"5 perc sétára a fesztiváltól\"" }),
    defineField({ name: "distanceEn", title: "Distance (EN)", type: "string" }),
    defineField({ name: "order", title: "Sorrend", type: "number", initialValue: 0 }),
    defineField({ name: "isActive", title: "Aktív (megjelenik?)", type: "boolean", initialValue: true }),
  ],
  preview: { select: { title: "name", subtitle: "distanceHu", media: "image" } },
});
