import { defineArrayMember, defineField, defineType } from "sanity";

/** Slug a dokumentumból – a Studio `hidden` feltételekhez. */
function slugCurrent(doc: unknown): string | undefined {
  if (!doc || typeof doc !== "object") return undefined;
  const slug = (doc as { slug?: { current?: string } }).slug;
  return slug?.current?.trim() || undefined;
}

/** Program oldal: cím a titleHu/En-ből jön, subtitle a heroDescription-ből; programBody + mód. */
const SLUG_PROGRAM = "program";
/** Főoldal Page doksi: csak SEO (meta), a hero/pageBody nem renderelődik a főoldalon. */
const SLUG_HOME = "home";
/** Fellépők oldal jelenleg nem hívja a getPageContentBySlug-ot – csak SEO + admin cím. */
const SLUG_LINEUP = "lineup";
const SLUG_FUTAS = "futas";
const SLUG_TABOR = "tabor";

/**
 * Page — egy Sanity-ből szerkeszthető oldal.
 * A Studio-ban a mezők láthatósága a slug-hoz igazodik: csak azok jelennek meg,
 * amelyek az adott útvonalon ténylegesen hatnak (lásd frontend `getPageContentBySlug` / `getProgramContent`).
 *
 * Összefoglaló:
 *  - Általános fix + dinamikus oldalak: hero cím/leírás, pageBody, SEO
 *  - `program`: titleHu/En = nagy cím; heroDescription = alcím; programDisplayMode + programBody
 *  - `tabor`: eyebrow, program blokkok (névsor + menetrend), támogatók lista; + második szöveg, CTA
 *  - `futas`: ingyenes belépő szalag, kártyák (dátum/idő/hely), távok táblázat, határidő, eredmény — + pageBody2 mint fő leírás
 *  - `home` / `lineup`: főleg SEO (+ belső címek); vizuális hero/pageBody nem erre az útvonalra megy
 *  - Új slug → `/oldal/[slug]` : hero + pageBody + SEO
 */
export const pageType = defineType({
  name: "page",
  title: "Oldal (Page)",
  type: "document",
  description:
    "Egy szerkeszthető oldal. A Studio csak azokat a mezőket mutatja az adott slug mellett, amelyek az adott útvonalon ténylegesen megjelennek. Új oldal: állítsd be a slugot — ez alapján bővülnek/szűkülnek a mezők. FONTOS: ha a honlap tele van szöveggel, de itt pl. a tábor „program blokkok” üresek, a honlap valószínűleg a kódbeli alapszöveget mutatja (nem biztos, hogy hiba). Szinkron: lokálisan futtasd a „npm run sanity:seed” importot írási tokennel, vagy másold be a szöveget ide — ezután Publish.",
  fields: [
    defineField({
      name: "titleHu",
      title: "Cím (HU)",
      type: "string",
      description:
        "Belső / lista cím a Studio-ban. A „program” slug esetén ez a Program oldalon a nagy fejléc szöveg (nem a „Hero cím” mező).",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "titleEn",
      title: "Cím (EN)",
      type: "string",
      description: "Program oldalon: nagy fejléc EN változata.",
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
      description:
        "A megfelelő oldal tetején nagybetűs címként jelenik meg. (A Program oldal nagy címét a „Cím (HU)” mező adja; főoldal és Lineup esetén ez a mező nem használatos.)",
      hidden: ({ document }) => {
        const s = slugCurrent(document);
        return s === SLUG_HOME || s === SLUG_PROGRAM || s === SLUG_LINEUP;
      },
    }),
    defineField({
      name: "heroTitleEn",
      title: "Hero cím (EN)",
      type: "string",
      hidden: ({ document }) => {
        const s = slugCurrent(document);
        return s === SLUG_HOME || s === SLUG_PROGRAM || s === SLUG_LINEUP;
      },
    }),
    defineField({
      name: "heroDescriptionHu",
      title: "Hero leírás (HU)",
      type: "text",
      rows: 3,
      description:
        "Rövid bevezető az oldal tetején. Program oldalon ez az alcím; SEO meta leíráshoz is fallback. (Főoldal és Lineup szöveges része nem innen jön.)",
      hidden: ({ document }) => {
        const s = slugCurrent(document);
        return s === SLUG_HOME || s === SLUG_LINEUP;
      },
    }),
    defineField({
      name: "heroDescriptionEn",
      title: "Hero leírás (EN)",
      type: "text",
      rows: 3,
      hidden: ({ document }) => {
        const s = slugCurrent(document);
        return s === SLUG_HOME || s === SLUG_LINEUP;
      },
    }),
    defineField({
      name: "pageBodyHu",
      title: "Oldal tartalom – HU (szabad szöveg)",
      type: "text",
      rows: 14,
      description:
        "Fix aloldalakon és új /oldal/[slug] oldalakon jelenik meg (Hero alatt). A Program oldal szabad szövegét a „Program – szabad szöveg” mezők adják — ez a mező ott nem használatos.",
      hidden: ({ document }) => {
        const s = slugCurrent(document);
        return s === SLUG_HOME || s === SLUG_PROGRAM || s === SLUG_LINEUP;
      },
    }),
    defineField({
      name: "pageBodyEn",
      title: "Oldal tartalom – EN",
      type: "text",
      rows: 14,
      hidden: ({ document }) => {
        const s = slugCurrent(document);
        return s === SLUG_HOME || s === SLUG_PROGRAM || s === SLUG_LINEUP;
      },
    }),
    defineField({
      name: "programDisplayMode",
      title: "Program megjelenítési mód",
      type: "string",
      description:
        "Csak a „program” slug-ú dokumentumnál érvényes. Eldönti a lista vs. szabad szöveg megjelenítést.",
      hidden: ({ document }) => slugCurrent(document) !== SLUG_PROGRAM,
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
        "Csak „program” slug esetén. Akkor látszik az oldalon, ha a megjelenítési mód „Szabad szöveg” vagy „Mindkettő”.",
      hidden: ({ document }) => slugCurrent(document) !== SLUG_PROGRAM,
    }),
    defineField({
      name: "programBodyEn",
      title: "Program – szabad szöveg (EN)",
      type: "text",
      rows: 14,
      hidden: ({ document }) => slugCurrent(document) !== SLUG_PROGRAM,
    }),
    /* ── Második szöveg doboz (Futás / Tábor oldalhoz) ─────────────────── */
    defineField({
      name: "showSecondBody",
      title: "Második szöveg doboz megjelenítése",
      type: "boolean",
      initialValue: false,
      description:
        "Csak „futas” és „tabor” slug esetén hat: a második szöveg doboz a kártyák közti nagy szövegblokk helyett / mellett.",
      hidden: ({ document }) => {
        const s = slugCurrent(document);
        return s !== SLUG_FUTAS && s !== SLUG_TABOR;
      },
    }),
    defineField({
      name: "pageBody2Hu",
      title: "Második szöveg doboz – HU",
      type: "text",
      rows: 14,
      description:
        "Tábor: csak ha a kapcsoló be van kapcsolva, cseréli le az alap leírást. Futás: ha ki van töltve, mindig ez a hosszú szöveg jelenik meg a kártyák feletti rész után (kapcsoló nem szükséges).",
      hidden: ({ document }) => {
        const s = slugCurrent(document);
        return s !== SLUG_FUTAS && s !== SLUG_TABOR;
      },
    }),
    defineField({
      name: "pageBody2En",
      title: "Második szöveg doboz – EN",
      type: "text",
      rows: 14,
      hidden: ({ document }) => {
        const s = slugCurrent(document);
        return s !== SLUG_FUTAS && s !== SLUG_TABOR;
      },
    }),
    /* ── Jazztábor (`tabor`) — részletes program + támogatók ───────────── */
    defineField({
      name: "campEyebrowHu",
      title: "Tábor — szürke sor felett (HU)",
      type: "string",
      description: 'Pl. „Swing · Lindy Hop · Jazz Improvizáció”. Üresen a statikus fallback.',
      hidden: ({ document }) => slugCurrent(document) !== SLUG_TABOR,
    }),
    defineField({
      name: "campEyebrowEn",
      title: "Tábor — szürke sor felett (EN)",
      type: "string",
      hidden: ({ document }) => slugCurrent(document) !== SLUG_TABOR,
    }),
    defineField({
      name: "campScheduleSectionTitleHu",
      title: "Tábor — szekció főcím a kártyák fölött (HU)",
      type: "string",
      description: 'Pl. „Tanárok és program (2026)”. Üresen a statikus scheduleTitle.',
      hidden: ({ document }) => slugCurrent(document) !== SLUG_TABOR,
    }),
    defineField({
      name: "campScheduleSectionTitleEn",
      title: "Tábor — szekció főcím (EN)",
      type: "string",
      hidden: ({ document }) => slugCurrent(document) !== SLUG_TABOR,
    }),
    defineField({
      name: "campScheduleBlocks",
      title: "Tábor — program blokkok (kártyák)",
      type: "array",
      description:
        "Minden blokk egy kártya: cím + bullet lista (Enterrel soronként). Üres lista = a honlap a repo-ban lévő alap menetrendet mutatja (hu.ts/en.ts), ezért a Studio és az élő oldal eltérhet. Kezdő töltés: npm run sanity:seed.",
      hidden: ({ document }) => slugCurrent(document) !== SLUG_TABOR,
      of: [
        defineArrayMember({
          type: "object",
          name: "campScheduleBlock",
          fields: [
            defineField({
              name: "titleHu",
              title: "Kártya címe (HU)",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "titleEn", title: "Kártya címe (EN)", type: "string" }),
            defineField({
              name: "bulletsHu",
              title: "Lista (HU) — soronként egy pont",
              type: "text",
              rows: 10,
            }),
            defineField({
              name: "bulletsEn",
              title: "Lista (EN) — soronként egy pont",
              type: "text",
              rows: 10,
            }),
          ],
          preview: {
            select: { title: "titleHu" },
            prepare({ title }) {
              return { title: title || "Blokk" };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "campSupportersSectionTitleHu",
      title: "Tábor — támogatók blokk címe (HU)",
      type: "string",
      description: 'Üresen: „Támogatók”.',
      hidden: ({ document }) => slugCurrent(document) !== SLUG_TABOR,
    }),
    defineField({
      name: "campSupportersSectionTitleEn",
      title: "Tábor — támogatók blokk címe (EN)",
      type: "string",
      hidden: ({ document }) => slugCurrent(document) !== SLUG_TABOR,
    }),
    defineField({
      name: "campSupporters",
      title: "Tábor — támogatók (linkek)",
      type: "array",
      description: "Ha van elem, ez felülírja a statikus támogató listát.",
      hidden: ({ document }) => slugCurrent(document) !== SLUG_TABOR,
      of: [
        defineArrayMember({
          type: "object",
          name: "campSupporter",
          fields: [
            defineField({
              name: "nameHu",
              title: "Név (HU)",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "nameEn", title: "Név (EN)", type: "string" }),
            defineField({ name: "url", title: "Link", type: "url" }),
          ],
          preview: {
            select: { n: "nameHu", u: "url" },
            prepare({ n, u }) {
              return { title: n || "Támogató", subtitle: u || "" };
            },
          },
        }),
      ],
    }),
    /* ── Futás (`futas`) — szalag, kártyák, táblázat, szövegek ─────────── */
    defineField({
      name: "runningEyebrowHu",
      title: "Futás — eyebrow sor (HU)",
      type: "string",
      description: "Teljes sor (pl. dátum · idő). Üresen: statikus dátum · idő.",
      hidden: ({ document }) => slugCurrent(document) !== SLUG_FUTAS,
    }),
    defineField({
      name: "runningEyebrowEn",
      title: "Futás — eyebrow sor (EN)",
      type: "string",
      hidden: ({ document }) => slugCurrent(document) !== SLUG_FUTAS,
    }),
    defineField({
      name: "runningFreeEntryBannerHu",
      title: "Futás — narancs szalag szöveg (HU)",
      type: "text",
      rows: 3,
      hidden: ({ document }) => slugCurrent(document) !== SLUG_FUTAS,
    }),
    defineField({
      name: "runningFreeEntryBannerEn",
      title: "Futás — narancs szalag szöveg (EN)",
      type: "text",
      rows: 3,
      hidden: ({ document }) => slugCurrent(document) !== SLUG_FUTAS,
    }),
    defineField({
      name: "runningCardDateHu",
      title: "Futás — kártya „Dátum” (HU)",
      type: "string",
      hidden: ({ document }) => slugCurrent(document) !== SLUG_FUTAS,
    }),
    defineField({
      name: "runningCardDateEn",
      title: "Futás — kártya „Dátum” (EN)",
      type: "string",
      hidden: ({ document }) => slugCurrent(document) !== SLUG_FUTAS,
    }),
    defineField({
      name: "runningCardTime",
      title: "Futás — kártya „Időpont”",
      type: "string",
      description: "Nyelvfüggetlen (pl. 10:00). Üresen statikus.",
      hidden: ({ document }) => slugCurrent(document) !== SLUG_FUTAS,
    }),
    defineField({
      name: "runningCardLocationHu",
      title: "Futás — kártya „Helyszín” (HU)",
      type: "text",
      rows: 2,
      hidden: ({ document }) => slugCurrent(document) !== SLUG_FUTAS,
    }),
    defineField({
      name: "runningCardLocationEn",
      title: "Futás — kártya „Helyszín” (EN)",
      type: "text",
      rows: 2,
      hidden: ({ document }) => slugCurrent(document) !== SLUG_FUTAS,
    }),
    defineField({
      name: "runningDistancesSectionTitleHu",
      title: "Futás — táblázat fejléc (HU)",
      type: "string",
      description: 'Üresen: „Távok & Díjak”.',
      hidden: ({ document }) => slugCurrent(document) !== SLUG_FUTAS,
    }),
    defineField({
      name: "runningDistancesSectionTitleEn",
      title: "Futás — táblázat fejléc (EN)",
      type: "string",
      hidden: ({ document }) => slugCurrent(document) !== SLUG_FUTAS,
    }),
    defineField({
      name: "runningDistanceRows",
      title: "Futás — távok sorai",
      type: "array",
      description:
        "Ha van sor, ez adja a táblázatot. Üres = honlap a kódbeli táblázatot mutatja (Studio és oldal eltérhet). Kezdő töltés: npm run sanity:seed.",
      hidden: ({ document }) => slugCurrent(document) !== SLUG_FUTAS,
      of: [
        defineArrayMember({
          type: "object",
          name: "runningDistanceRow",
          fields: [
            defineField({
              name: "categoryHu",
              title: "Kategória (HU)",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "categoryEn", title: "Kategória (EN)", type: "string" }),
            defineField({ name: "distanceHu", title: "Táv (HU)", type: "string" }),
            defineField({ name: "distanceEn", title: "Táv (EN)", type: "string" }),
            defineField({ name: "feeHu", title: "Díj (HU)", type: "string" }),
            defineField({ name: "feeEn", title: "Díj (EN)", type: "string" }),
          ],
          preview: {
            select: { c: "categoryHu", f: "feeHu" },
            prepare({ c, f }) {
              return { title: c || "Sor", subtitle: f || "" };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "runningEntryDeadlineHu",
      title: "Futás — nevezési határidő szöveg (HU)",
      type: "text",
      rows: 3,
      hidden: ({ document }) => slugCurrent(document) !== SLUG_FUTAS,
    }),
    defineField({
      name: "runningEntryDeadlineEn",
      title: "Futás — nevezési határidő szöveg (EN)",
      type: "text",
      rows: 3,
      hidden: ({ document }) => slugCurrent(document) !== SLUG_FUTAS,
    }),
    defineField({
      name: "runningResultsNoteHu",
      title: "Futás — eredményhirdetés / díjak szöveg (HU)",
      type: "text",
      rows: 5,
      hidden: ({ document }) => slugCurrent(document) !== SLUG_FUTAS,
    }),
    defineField({
      name: "runningResultsNoteEn",
      title: "Futás — eredményhirdetés / díjak szöveg (EN)",
      type: "text",
      rows: 5,
      hidden: ({ document }) => slugCurrent(document) !== SLUG_FUTAS,
    }),
    /* ── CTA gombok (Futás / Tábor oldalhoz ajánlott) ─────────────────── */
    defineField({
      name: "primaryButtonLabelHu",
      title: "Elsődleges gomb felirata (HU)",
      type: "string",
      description:
        "Csak Futás / Tábor. A narancs CTA felirata. Üresen a kódbeli fallback szöveg.",
      hidden: ({ document }) => {
        const s = slugCurrent(document);
        return s !== SLUG_FUTAS && s !== SLUG_TABOR;
      },
    }),
    defineField({
      name: "primaryButtonLabelEn",
      title: "Elsődleges gomb felirata (EN)",
      type: "string",
      hidden: ({ document }) => {
        const s = slugCurrent(document);
        return s !== SLUG_FUTAS && s !== SLUG_TABOR;
      },
    }),
    defineField({
      name: "primaryButtonUrlHu",
      title: "Elsődleges gomb URL (HU)",
      type: "url",
      description: "Csak Futás / Tábor. Üresen a statikus nevezési URL.",
      hidden: ({ document }) => {
        const s = slugCurrent(document);
        return s !== SLUG_FUTAS && s !== SLUG_TABOR;
      },
    }),
    defineField({
      name: "primaryButtonUrlEn",
      title: "Elsődleges gomb URL (EN)",
      type: "url",
      description: "Üresen a HU URL fallback.",
      hidden: ({ document }) => {
        const s = slugCurrent(document);
        return s !== SLUG_FUTAS && s !== SLUG_TABOR;
      },
    }),
    defineField({
      name: "secondaryButtonLabelHu",
      title: "Másodlagos gomb felirata (HU)",
      type: "string",
      description: "Csak Futás / Tábor. Opcionális második gomb.",
      hidden: ({ document }) => {
        const s = slugCurrent(document);
        return s !== SLUG_FUTAS && s !== SLUG_TABOR;
      },
    }),
    defineField({
      name: "secondaryButtonLabelEn",
      title: "Másodlagos gomb felirata (EN)",
      type: "string",
      hidden: ({ document }) => {
        const s = slugCurrent(document);
        return s !== SLUG_FUTAS && s !== SLUG_TABOR;
      },
    }),
    defineField({
      name: "secondaryButtonUrlHu",
      title: "Másodlagos gomb URL (HU)",
      type: "url",
      description: "Üresen nincs másodlagos gomb.",
      hidden: ({ document }) => {
        const s = slugCurrent(document);
        return s !== SLUG_FUTAS && s !== SLUG_TABOR;
      },
    }),
    defineField({
      name: "secondaryButtonUrlEn",
      title: "Másodlagos gomb URL (EN)",
      type: "url",
      hidden: ({ document }) => {
        const s = slugCurrent(document);
        return s !== SLUG_FUTAS && s !== SLUG_TABOR;
      },
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
