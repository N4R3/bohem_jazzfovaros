import { defineField, defineType } from "sanity";

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
      name: "mapEmbedUrl",
      title: "Google Maps embed URL",
      type: "url",
      description: "A Térkép oldalon iframe-ben jelenik meg.",
    }),
    defineField({ name: "googleMapsUrl", title: "Google Maps link", type: "url" }),
    defineField({ name: "latitude", title: "Szélesség (lat)", type: "number" }),
    defineField({ name: "longitude", title: "Hosszúság (lon)", type: "number" }),
    defineField({ name: "descriptionHu", title: "Leírás (HU)", type: "text", rows: 3 }),
    defineField({ name: "descriptionEn", title: "Leírás (EN)", type: "text", rows: 3 }),
  ],
});
