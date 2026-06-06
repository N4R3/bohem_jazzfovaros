import { defineField, defineType } from "sanity";
import { richText } from "../objects/richText";

export const venueType = defineType({
  name: "venue",
  title: "Helyszín",
  type: "document",
  description: "A fesztivál helyszínének adatai (Domb Beach). EGY példány lehet belőle. A térkép és cím ezen alapul.",
  fields: [
    defineField({ name: "nameHu", title: "Helyszín neve (HU)", type: "string" }),
    defineField({ name: "nameEn", title: "Helyszín neve (EN)", type: "string" }),
    defineField({ name: "addressHu", title: "Cím (HU)", type: "string" }),
    defineField({ name: "addressEn", title: "Cím (EN)", type: "string" }),
    defineField({
      name: "titleHu",
      title: "Térkép oldalcím (HU)",
      type: "string",
      description: "A Térkép oldal főcíme, ha a Page heroTitle üres.",
    }),
    defineField({
      name: "titleEn",
      title: "Térkép oldalcím (EN)",
      type: "string",
      description: "Map page title, if Page heroTitle is empty.",
    }),
    defineField({
      name: "subtitleHu",
      title: "Térkép oldal alcíme (HU)",
      type: "string",
      description: "A Térkép oldal alcíme, ha a Page heroDescription üres.",
    }),
    defineField({
      name: "subtitleEn",
      title: "Térkép oldal alcíme (EN)",
      type: "string",
      description: "Map page subtitle, if Page heroDescription is empty.",
    }),
    defineField({
      name: "mapEmbedUrl",
      title: "Google Maps embed URL",
      type: "url",
      description: "A Térkép oldalon iframe-ben jelenik meg.",
    }),
    defineField({ name: "googleMapsUrl", title: "Google Maps link", type: "url" }),
    defineField({ name: "latitude", title: "Szélesség (lat)", type: "number" }),
    defineField({ name: "longitude", title: "Hosszúság (lon)", type: "number" }),
    defineField({ name: "descriptionRichHu", title: "Leírás (HU) — Rich Text", ...richText }),
    defineField({ name: "descriptionRichEn", title: "Leírás (EN) — Rich Text", ...richText }),
    defineField({
      name: "descriptionHu",
      title: "Leírás (HU) — régi sima szöveg",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "descriptionEn",
      title: "Leírás (EN) — régi sima szöveg",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "mapImage",
      title: "Fesztiváltérkép kép",
      type: "image",
      description: "A fesztiváltérkép képe, amely megjelenik a Térkép oldalon.",
      options: { hotspot: true },
    }),
    defineField({
      name: "directionsHeadingHu",
      title: "Útvonalirányítás fejléc (HU)",
      type: "string",
      description: "A 'Hogyan juss el?' szöveg helyett.",
    }),
    defineField({
      name: "directionsHeadingEn",
      title: "Útvonalirányítás fejléc (EN)",
      type: "string",
      description: "The 'How to get there?' heading text.",
    }),
  ],
});
