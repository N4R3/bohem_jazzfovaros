import { defineField, defineType } from "sanity";
import { richText } from "../objects/richText";

export const ticketType = defineType({
  name: "ticket",
  title: "Jegy",
  type: "document",
  description:
    "Egy jegykategória. `order` = sorrend a Jegyek & Infó oldalon. `showOnHome` = megjelenik-e a főoldal jegyboxaiban. Aktív + nem rejtett jegyek látszanak.",
  fields: [
    defineField({ name: "nameHu", title: "Név (HU)", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "nameEn",
      title: "Név (EN)",
      type: "string",
      description: "Opcionális draft esetén; ha üres, az angol build a magyar nevet használhatja.",
    }),
    defineField({
      name: "descriptionRichHu",
      title: "Leírás (HU) — Rich Text",
      ...richText,
      description: "Ajánlott: rövid leírás szerkeszthető linkekkel a jegysor alatt.",
    }),
    defineField({
      name: "descriptionRichEn",
      title: "Leírás (EN) — Rich Text",
      ...richText,
    }),
    defineField({
      name: "descriptionHu",
      title: "Rövid leírás (HU) — info oldal fallback + főoldal alcím",
      type: "text",
      rows: 2,
      description:
        "Ha a Rich Text üres, az Info oldalon ez jelenik meg. Ha showOnHome be van kapcsolva, ez lesz a fooldali jegybox alcime (pl. Valaszd ki a napod). Legyen rovid, 1 sor idealis.",
    }),
    defineField({
      name: "descriptionEn",
      title: "Rövid leírás (EN) — info oldal fallback + főoldal alcím",
      type: "text",
      rows: 2,
      description: "Angol valtozat. Ha ures, a HU szoveg jelenik meg.",
    }),
    defineField({ name: "price", title: "Ár (szöveg, pl. „24 900”)", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "currency", title: "Pénznem", type: "string", initialValue: "HUF" }),
    defineField({ name: "ticketUrlHu", title: "Jegy link (HU)", type: "url" }),
    defineField({ name: "ticketUrlEn", title: "Jegy link (EN)", type: "url" }),
    defineField({ name: "badgeHu", title: "Kiemelő badge (HU)", type: "string", description: "Pl. „HOT”, „Korlátozott”. Ha üres, nincs kiemelés." }),
    defineField({ name: "badgeEn", title: "Highlight badge (EN)", type: "string" }),
    defineField({
      name: "ctaTextHu",
      title: "CTA szöveg (HU)",
      type: "string",
      description: "Opcionális gombfelirat a jegykártyához.",
    }),
    defineField({
      name: "ctaTextEn",
      title: "CTA szöveg (EN)",
      type: "string",
      description: "Opcionális gombfelirat a jegykártyához.",
    }),
    defineField({
      name: "ctaUrl",
      title: "CTA URL",
      type: "url",
      description: "Opcionális dedikált CTA link (ticketUrlHu/En mellett).",
    }),
    defineField({
      name: "isFeatured",
      title: "Kiemelt jegy",
      type: "boolean",
      initialValue: false,
      description: "Opcionális kiemelési jelölő a későbbi frontend logikához.",
    }),
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
      description: "Ha be van kapcsolva, el van rejtve (Info oldal és Főoldal sem mutatja)",
    }),
    defineField({
      name: "showOnHome",
      title: "Megjelenik a főoldalon",
      type: "boolean",
      initialValue: false,
      description:
        "Ha be van kapcsolva, ez a jegy megjelenik a fooldal narancs jegyboxaiban. A doboz alcime a 'Rovid leiras' mezobol jon. Allitsd be a homeOrder-t is, ha tobb fooldali jegy van.",
    }),
    defineField({
      name: "homeOrder",
      title: "Főoldali sorrend",
      type: "number",
      initialValue: 0,
      description:
        "Fooldali jegyboxok sorrendje (kisebb szam = bal oldal). Csak showOnHome = true eseten hat.",
    }),
    defineField({
      name: "order",
      type: "number",
      initialValue: 0,
      description: "Jegyek & Infó oldal megjelenési sorrendje",
    }),
  ],
  preview: {
    select: {
      title: "nameHu",
      subtitle: "nameEn",
      showOnHome: "showOnHome",
      available: "isAvailable",
      hidden: "isHidden",
    },
    prepare({ title, subtitle, showOnHome, available, hidden }) {
      const flags: string[] = [];
      if (showOnHome) flags.push("🏠 főoldal");
      if (hidden) flags.push("rejtett");
      if (available === false) flags.push("nem elérhető");
      return {
        title: title || "(névtelen jegy)",
        subtitle: [subtitle, flags.join(" · ")].filter(Boolean).join(" — "),
      };
    },
  },
});
