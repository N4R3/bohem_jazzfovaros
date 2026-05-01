import { defineField, defineType } from "sanity";

/**
 * Page — egy Sanity-ből szerkeszthető oldal.
 * Tartalmazza:
 *  - SEO + hero szöveg-mezőket (cím, leírás)
 *  - szerkeszthető pageBody (több bekezdéses szabad szöveg) — ez megjelenik a fix
 *    oldalakon (tabor, futas, contact, aszf, szallas, terkep, info, lineup) a saját
 *    statikus tartalom FÖLÖTT, a kártyák megőrzésével
 *  - Program oldal-specifikus mezőket (programDisplayMode + programBody)
 *  - új információs oldalakat is leírhat: ha a slug nem a 10 fix slug egyike
 *    (home/info/lineup/program/contact/szallas/terkep/futas/tabor/aszf), akkor a
 *    tartalom a `/oldal/[slug]` dinamikus oldalon jelenik meg.
 */
export const pageType = defineType({
  name: "page",
  title: "Oldal (Page)",
  type: "document",
  description:
    "Egy szerkeszthető oldal. A 10 fix oldal a saját route-on jelenik meg, és a hero / pageBody mezők ott szövegként rendereljük. Új információs oldal is létrehozható: tetszőleges slug-gal, ami a /oldal/[slug] útvonalon mutat.",
  fields: [
    defineField({
      name: "titleHu",
      title: "Cím (HU)",
      type: "string",
      description: "Belső + admin cím. A Studio listájában is ez jelenik meg.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "titleEn",
      title: "Cím (EN)",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "titleHu", maxLength: 96 },
      description:
        "FIX OLDALAKNÁL ne módosítsd: home, info, lineup, program, contact, szallas, terkep, futas, tabor, aszf. ÚJ információs oldalnál tetszőleges, kisbetű+kötőjel formátumban (pl. `gyik`, `sajto`); az új oldal a /oldal/[slug] URL-en lesz elérhető. Menübe a Navigation menüpontnál tehető.",
    }),
    defineField({
      name: "heroTitleHu",
      title: "Hero cím (HU)",
      type: "string",
      description: "A megfelelő oldal tetején nagybetűs címként jelenik meg.",
    }),
    defineField({
      name: "heroTitleEn",
      title: "Hero cím (EN)",
      type: "string",
    }),
    defineField({
      name: "heroDescriptionHu",
      title: "Hero leírás (HU)",
      type: "text",
      rows: 3,
      description: "Rövid bevezető (1-3 sor) az oldal tetején. SEO leíráshoz fallback-ként is használjuk.",
    }),
    defineField({
      name: "heroDescriptionEn",
      title: "Hero leírás (EN)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "pageBodyHu",
      title: "Oldal tartalom – HU (szabad szöveg)",
      type: "text",
      rows: 14,
      description:
        "Itt írható az oldal fő szöveges tartalma. Megjelenik a fix oldalak tetején (a Hero alatt, a kártyás tartalom fölött), illetve teljes oldalként az új /oldal/[slug] útvonalon. Soremelés = új sor; üres sor = új bekezdés. URL-ek automatikusan kattinthatók.",
    }),
    defineField({
      name: "pageBodyEn",
      title: "Oldal tartalom – EN",
      type: "text",
      rows: 14,
    }),
    defineField({
      name: "programDisplayMode",
      title: "Program megjelenítési mód",
      type: "string",
      description:
        "CSAK a `program` slug-ú oldalon érvényes. Eldönti, hogyan jelenjen meg a Program oldal.",
      options: {
        list: [
          { title: "Adatbázisos programlista (alapértelmezett)", value: "structured" },
          { title: "Szabad szöveges program (csak a programBody)", value: "freeText" },
          { title: "Mindkettő (előbb szöveg, alatta lista)", value: "both" },
        ],
        layout: "radio",
      },
      initialValue: "structured",
    }),
    defineField({
      name: "programBodyHu",
      title: "Program – szabad szöveg (HU)",
      type: "text",
      rows: 14,
      description:
        "CSAK a `program` slug-ú oldalon. Akkor érvényesül, ha a Program megjelenítési mód `freeText` vagy `both`.",
    }),
    defineField({
      name: "programBodyEn",
      title: "Program – szabad szöveg (EN)",
      type: "text",
      rows: 14,
    }),
    /* ── CTA gombok (Futás / Tábor oldalhoz ajánlott) ─────────────────── */
    defineField({
      name: "primaryButtonLabelHu",
      title: "Elsődleges gomb felirata (HU)",
      type: "string",
      description:
        "Főleg Futás / Tábor oldalhoz. A fő, narancs CTA gomb felirata (pl. 'Online nevezés →', 'Jelentkezés a táborba →'). Ha üres, az oldal statikus fallback szöveget használ.",
    }),
    defineField({
      name: "primaryButtonLabelEn",
      title: "Elsődleges gomb felirata (EN)",
      type: "string",
    }),
    defineField({
      name: "primaryButtonUrlHu",
      title: "Elsődleges gomb URL (HU)",
      type: "url",
      description:
        "A fő gomb linkje (HU). Ha kitöltöd, ez jelenik meg a Futás / Tábor oldal elsődleges CTA gombjánál. Ha üres, az oldal statikus fallback URL-t használ.",
    }),
    defineField({
      name: "primaryButtonUrlEn",
      title: "Elsődleges gomb URL (EN)",
      type: "url",
      description: "A fő gomb linkje (EN). Ha üres, a HU URL-t használja fallbackként.",
    }),
    defineField({
      name: "secondaryButtonLabelHu",
      title: "Másodlagos gomb felirata (HU)",
      type: "string",
      description:
        "Opcionális második gomb (pl. 'Nevezési lap letöltése', 'Kapcsolat'). Főleg Futás / Tábor oldalhoz.",
    }),
    defineField({
      name: "secondaryButtonLabelEn",
      title: "Másodlagos gomb felirata (EN)",
      type: "string",
    }),
    defineField({
      name: "secondaryButtonUrlHu",
      title: "Másodlagos gomb URL (HU)",
      type: "url",
      description: "A másodlagos gomb linkje (HU). Ha üres, a másodlagos gomb nem jelenik meg.",
    }),
    defineField({
      name: "secondaryButtonUrlEn",
      title: "Másodlagos gomb URL (EN)",
      type: "url",
    }),
    /* ─────────────────────────────────────────────────────────────────── */
    defineField({
      name: "bodyHu",
      title: "Body (HU) – LEGACY",
      type: "array",
      of: [{ type: "block" }],
      description: "Régi Portable Text mező. Helyette a `pageBodyHu`-t használjuk.",
      hidden: true,
    }),
    defineField({
      name: "bodyEn",
      title: "Body (EN) – LEGACY",
      type: "array",
      of: [{ type: "block" }],
      hidden: true,
    }),
    defineField({
      name: "seo",
      title: "SEO beállítások",
      type: "seo",
      description: "Cím / leírás / OG kép a keresőkhöz és közösségi megosztáshoz.",
    }),
    defineField({
      name: "order",
      title: "Sorrend (admin)",
      type: "number",
      initialValue: 0,
      description: "Csak a Studio listához. A menü sorrendje a Navigation menüpontból jön.",
    }),
    defineField({
      name: "isActive",
      title: "Aktív",
      type: "boolean",
      initialValue: true,
      description:
        "Ha kikapcsolod: az új információs oldal /oldal/[slug] 404-et ad. A fix oldalak megmaradnak, de a Sanity tartalom nem érvényesül.",
    }),
  ],
  preview: {
    select: { title: "titleHu", subtitle: "slug.current", active: "isActive" },
    prepare({ title, subtitle, active }) {
      return {
        title: `${title || "(névtelen oldal)"}${active === false ? " (inaktív)" : ""}`,
        subtitle: subtitle ? `/${subtitle}` : "(nincs slug)",
      };
    },
  },
});
