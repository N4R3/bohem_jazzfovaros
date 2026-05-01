import { defineField, defineType } from "sanity";

/**
 * Navigation Item — fejléc / footer menüpontok.
 * Az ügyfél innen tudja:
 *  - menüpontot átnevezni,
 *  - sorrendet állítani,
 *  - menüpontot el-/megjeleníteni (header/footer külön),
 *  - meglévő oldalt menübe tenni vagy kivenni,
 *  - külső linket beilleszteni.
 *
 * Ha sem ez a Navigation, sem a kódban szereplő statikus nav-fallback nem ad eredményt,
 * a frontend a kódban rögzített statikus listát mutatja.
 */
export const navigationItemType = defineType({
  name: "navigationItem",
  title: "Menüpont",
  type: "document",
  description:
    "Egy menüpont a fejlécben és/vagy a footerben. Sorrendet az `order`, megjelenést a `showInHeader` / `showInFooter` szabályozza.",
  fields: [
    defineField({
      name: "labelHu",
      title: "Felirat (HU)",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "labelEn",
      title: "Felirat (EN)",
      type: "string",
      description: "Angol nyelvű felirat. Ha üres, a magyart használjuk.",
    }),
    defineField({
      name: "page",
      title: "Belső oldal (Page) — ajánlott",
      type: "reference",
      to: [{ type: "page" }],
      description:
        "Ha választasz egy Pages alól dokumentumot, a link automatikusan annak slugjára mutat (pl. tabor → /tabor/, vagy új információs oldal → /oldal/[slug]).",
    }),
    defineField({
      name: "href",
      title: "Saját URL (opcionális)",
      type: "string",
      description:
        "Ha NEM Page referenciából szeretnéd a linket képezni: ide írhatsz egy belső útvonalat, pl. `/lineup/`. Hagyd üresen, ha Page-et választottál.",
    }),
    defineField({
      name: "externalUrl",
      title: "Külső link (opcionális)",
      type: "url",
      description:
        "Külső weboldal teljes URL-je (https://...). Ha kitöltöd, a link új ablakban nyílik.",
    }),
    defineField({
      name: "openInNewTab",
      title: "Új ablakban nyíljon",
      type: "boolean",
      initialValue: false,
      description: "Külső linknél automatikusan igaz; belső linkekhez opcionális.",
    }),
    defineField({
      name: "order",
      title: "Sorrend",
      type: "number",
      initialValue: 0,
      description: "Kisebb szám = előrébb a menüben.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "isActive",
      title: "Aktív",
      type: "boolean",
      initialValue: true,
      description: "Ha kikapcsolod, sehol nem jelenik meg.",
    }),
    defineField({
      name: "showInHeader",
      title: "Megjelenik a fejlécben",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "showInFooter",
      title: "Megjelenik a footerben",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "parent",
      title: "Szülő menüpont (egyszerű almenühöz)",
      type: "reference",
      to: [{ type: "navigationItem" }],
      description:
        "Opcionális. Ha a frontend támogatja az almenüt, ide hivatkozhatsz másik menüpontra. Jelenleg lapos szerkezet jelenik meg.",
    }),
    defineField({
      name: "description",
      title: "Belső megjegyzés",
      type: "text",
      rows: 2,
      description: "Csak a Studio-ban látszik. A frontenden nem jelenik meg.",
    }),
  ],
  preview: {
    select: {
      title: "labelHu",
      subtitle: "page.slug.current",
      external: "externalUrl",
      href: "href",
      active: "isActive",
    },
    prepare({ title, subtitle, external, href, active }) {
      const target =
        external || (subtitle ? `/${subtitle}/` : null) || href || "(nincs cél)";
      return {
        title: `${title}${active === false ? " (inaktív)" : ""}`,
        subtitle: target as string,
      };
    },
  },
  orderings: [
    {
      title: "Sorrend",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
