import { defineField, defineType } from "sanity";

export const popupSettingsType = defineType({
  name: "popupSettings",
  title: "Popup settings",
  type: "document",
  fields: [
    defineField({ name: "isEnabled", type: "boolean", initialValue: true }),
    defineField({ name: "image", type: "image" }),
    defineField({
      name: "imagePath",
      title: "Legacy popup image path",
      type: "string",
      description: "Fallback képútvonal, ha nincs Sanity image asset feltöltve.",
    }),
    defineField({ name: "altHu", type: "string" }),
    defineField({ name: "altEn", type: "string" }),
    defineField({
      name: "sessionStorageKey",
      type: "string",
      initialValue: "szechenyiPopupShown",
    }),
    defineField({ name: "showOnlyOnHomepage", type: "boolean", initialValue: true }),
  ],
});
