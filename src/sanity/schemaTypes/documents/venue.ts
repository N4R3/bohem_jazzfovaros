import { defineField, defineType } from "sanity";

export const venueType = defineType({
  name: "venue",
  title: "Venue",
  type: "document",
  fields: [
    defineField({ name: "nameHu", type: "string" }),
    defineField({ name: "nameEn", type: "string" }),
    defineField({ name: "addressHu", type: "string" }),
    defineField({ name: "addressEn", type: "string" }),
    defineField({ name: "mapEmbedUrl", type: "url" }),
    defineField({ name: "googleMapsUrl", type: "url" }),
    defineField({ name: "latitude", type: "number" }),
    defineField({ name: "longitude", type: "number" }),
    defineField({ name: "descriptionHu", type: "text", rows: 3 }),
    defineField({ name: "descriptionEn", type: "text", rows: 3 }),
  ],
});
