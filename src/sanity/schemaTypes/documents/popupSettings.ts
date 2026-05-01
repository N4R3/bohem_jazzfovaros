import { defineField, defineType } from "sanity";

export const popupSettingsType = defineType({
  name: "popupSettings",
  title: "Popup beállítások",
  type: "document",
  description:
    "A Főoldalon megjelenő felugró ablak beállításai (pl. Széchenyi Terv támogatási kép). EGY példány lehet belőle.",
  fields: [
    defineField({
      name: "isEnabled",
      title: "Popup aktív?",
      type: "boolean",
      initialValue: true,
      description: "Ha kikapcsolod, a látogatók nem fogják látni a popup ablakot.",
    }),
    defineField({
      name: "image",
      title: "Popup kép",
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
    defineField({ name: "altHu", title: "Alt szöveg (HU)", type: "string" }),
    defineField({ name: "altEn", title: "Alt szöveg (EN)", type: "string" }),
    defineField({
      name: "sessionStorageKey",
      title: "Session storage kulcs",
      type: "string",
      initialValue: "szechenyiPopupShown",
      description:
        "Technikai mező — minden publikálásnál automatikusan változik a kulcs, hogy az ügyfelek újra lássák a frissített popupot.",
      readOnly: true,
    }),
    defineField({
      name: "showOnlyOnHomepage",
      title: "Csak a Főoldalon jelenjen meg?",
      type: "boolean",
      initialValue: true,
    }),
  ],
});
