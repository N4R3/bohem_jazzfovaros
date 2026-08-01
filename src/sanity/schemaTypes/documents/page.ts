import { defineArrayMember, defineField, defineType } from "sanity";
import { richText } from "../objects/richText";

/** Slug a dokumentumból – a Studio `hidden` feltételekhez. */
function slugCurrent(doc: unknown): string | undefined {
  if (!doc || typeof doc !== "object") return undefined;
  const slug = (doc as { slug?: { current?: string } }).slug;
  return slug?.current?.trim() || undefined;
}

/** Program oldal: cím a titleHu/En-ből jön, subtitle a heroDescription-ből; programBody + mód. */
const SLUG_PROGRAM = "program";
const SLUG_INFO = "info";
/** Főoldal Page doksi: látható hero / stat / CTA + SEO + videó + jegyek. */
const SLUG_HOME = "home";
const isHomeSlug = (doc: unknown) => slugCurrent(doc) === SLUG_HOME;
/** Fellépők oldal jelenleg nem hívja a getPageContentBySlug-ot – csak SEO + admin cím. */
const SLUG_LINEUP = "lineup";
const SLUG_SZALLAS = "szallas";
const SLUG_TERKEP = "terkep";
const SLUG_FUTAS = "futas";
const SLUG_CAMP_LEGACY = "tabor";
const SLUG_JAZZTABOR = "jazztabor";
/** Returns true for both "tabor" (legacy Sanity doc slug) and "jazztabor" (canonical live route). */
function isCampSlug(s?: string): boolean {
  return s === SLUG_CAMP_LEGACY || s === SLUG_JAZZTABOR;
}

/**
 * Page — egy Sanity-ből szerkeszthető oldal.
 * A Studio-ban a mezők láthatósága a slug-hoz igazodik: csak azok jelennek meg,
 * amelyek az adott útvonalon ténylegesen hatnak (lásd frontend `getPageContentBySlug` / `getProgramContent`).
 *
 * Összefoglaló:
 *  - Általános fix + dinamikus oldalak: hero cím/leírás, pageBody, SEO
 *  - `program`: titleHu/En = nagy cím; heroDescription = alcím; programDisplayMode + programBody
 *  - `jazztabor` (és legacy `tabor`): eyebrow, program blokkok (névsor + menetrend), támogatók lista; + második szöveg, CTA
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
        "FIX OLDALAKNÁL ne módosítsd: home, info, lineup, program, contact, szallas, terkep, futas, tabor, aszf. UJ informacios oldalnal tetszoleges, kisbetu+kotojel formatumban (pl. gyik, sajto); az uj oldal a /slug es a /oldal/slug URL-en is elerheto lesz. Menube a Navigation menupontnal teheto.",
    }),
    /* ── Page-local videó (R2): egyszerű YouTube link minden oldalhoz ──── */
    defineField({
      name: "videoUrl",
      title: "Videó (YouTube link)",
      type: "url",
      description:
        "Illeszd be ennek az oldalnak a YouTube videó linkjet. A honlapon elonezet jelenik meg, es csak kattintasra indul el (nem tolt be automatikusan). Uresen: a fooldalon es a jazztabor oldalon a kodbeli alapertelmezett video marad, mas oldalon nincs video.",
    }),
    defineField({
      name: "videoTitleHu",
      title: "Videó cím (HU) — opcionális",
      type: "string",
      description: "Opcionalis felirat a video felett/alatt. Uresen az oldal cime hasznalhato.",
    }),
    defineField({
      name: "videoTitleEn",
      title: "Videó cím (EN) — opcionális",
      type: "string",
    }),
    /* ── Főoldal látható tartalom (R3) — csak slug=home ─────────────── */
    defineField({
      name: "homeHeroTitleHu",
      title: "Főoldal — Hero cím (HU)",
      type: "string",
      description:
        'A nagy cím két sora. Használható formátum: "BOHÉM|JAZZFŐVÁROS" vagy két sor (Enter). Ha üres: kódbeli alapértelmezés.',
      hidden: ({ document }) => !isHomeSlug(document),
    }),
    defineField({
      name: "homeHeroTitleEn",
      title: "Főoldal — Hero cím (EN)",
      type: "string",
      hidden: ({ document }) => !isHomeSlug(document),
    }),
    defineField({
      name: "homeHeroSubtitleHu",
      title: "Főoldal — Hero helyszín badge (HU)",
      type: "string",
      description: 'Pl. "Kecskemét, Domb Beach" — narancs badge a hero alatt.',
      hidden: ({ document }) => !isHomeSlug(document),
    }),
    defineField({
      name: "homeHeroSubtitleEn",
      title: "Főoldal — Hero helyszín badge (EN)",
      type: "string",
      hidden: ({ document }) => !isHomeSlug(document),
    }),
    defineField({
      name: "homeHeroLeadHu",
      title: "Főoldal — Hero dátum badge (HU)",
      type: "string",
      description: 'Pl. "2026. AUGUSZTUS 6–9." — kék badge.',
      hidden: ({ document }) => !isHomeSlug(document),
    }),
    defineField({
      name: "homeHeroLeadEn",
      title: "Főoldal — Hero dátum badge (EN)",
      type: "string",
      hidden: ({ document }) => !isHomeSlug(document),
    }),
    defineField({
      name: "homePrimaryCtaTextHu",
      title: "Főoldal — Elsődleges CTA szöveg (HU)",
      type: "string",
      description: "Hero és info-sáv jegygomb felirata. Üresen: kódbeli fallback.",
      hidden: ({ document }) => !isHomeSlug(document),
    }),
    defineField({
      name: "homePrimaryCtaTextEn",
      title: "Főoldal — Elsődleges CTA szöveg (EN)",
      type: "string",
      hidden: ({ document }) => !isHomeSlug(document),
    }),
    defineField({
      name: "homePrimaryCtaUrl",
      title: "Főoldal — Elsődleges CTA URL",
      type: "url",
      description: "Üresen: globális jegylink (Site settings).",
      hidden: ({ document }) => !isHomeSlug(document),
    }),
    defineField({
      name: "homeSecondaryCtaTextHu",
      title: "Főoldal — Másodlagos CTA szöveg (HU) — opcionális",
      type: "string",
      description: "Jelenleg nincs külön másodlagos gomb a hero-ban; későbbi használatra.",
      hidden: ({ document }) => !isHomeSlug(document),
    }),
    defineField({
      name: "homeSecondaryCtaTextEn",
      title: "Főoldal — Másodlagos CTA szöveg (EN) — opcionális",
      type: "string",
      hidden: ({ document }) => !isHomeSlug(document),
    }),
    defineField({
      name: "homeSecondaryCtaUrl",
      title: "Főoldal — Másodlagos CTA URL — opcionális",
      type: "url",
      hidden: ({ document }) => !isHomeSlug(document),
    }),
    defineField({
      name: "homeStats",
      title: "Főoldal — Statisztika sáv (4 / 10+ / …)",
      type: "array",
      description: "Narancs stats sáv. Legalább 2 elem ajánlott. Üresen: kódbeli alap statok.",
      of: [defineArrayMember({ type: "homeStatItem" })],
      hidden: ({ document }) => !isHomeSlug(document),
    }),
    defineField({
      name: "homeCtaBannerTitleHu",
      title: "Főoldal — Alsó CTA banner cím (HU)",
      type: "string",
      description: 'Pl. "Vedd meg a jegyed most!" — a "jegyed" szó narancs kiemelést kap.',
      hidden: ({ document }) => !isHomeSlug(document),
    }),
    defineField({
      name: "homeCtaBannerTitleEn",
      title: "Főoldal — Alsó CTA banner cím (EN)",
      type: "string",
      hidden: ({ document }) => !isHomeSlug(document),
    }),
    defineField({
      name: "homeCtaBannerTextHu",
      title: "Főoldal — Alsó CTA banner alcím (HU)",
      type: "string",
      hidden: ({ document }) => !isHomeSlug(document),
    }),
    defineField({
      name: "homeCtaBannerTextEn",
      title: "Főoldal — Alsó CTA banner alcím (EN)",
      type: "string",
      hidden: ({ document }) => !isHomeSlug(document),
    }),
    defineField({
      name: "homeCtaBannerButtonTextHu",
      title: "Főoldal — Alsó CTA gomb szöveg (HU)",
      type: "string",
      hidden: ({ document }) => !isHomeSlug(document),
    }),
    defineField({
      name: "homeCtaBannerButtonTextEn",
      title: "Főoldal — Alsó CTA gomb szöveg (EN)",
      type: "string",
      hidden: ({ document }) => !isHomeSlug(document),
    }),
    defineField({
      name: "homeCtaBannerButtonUrl",
      title: "Főoldal — Alsó CTA gomb URL",
      type: "url",
      description: "Üresen: globális jegylink.",
      hidden: ({ document }) => !isHomeSlug(document),
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
      name: "heroDescriptionRichHu",
      title: "Hero leírás (HU)",
      ...richText,
      description:
        "Rövid bevezető az oldal tetején. Program oldalon ez az alcím; SEO meta leíráshoz is fallback. Támogatja: félkövér, dőlt, link, h2, h3, lista, blockquote.",
      hidden: ({ document }) => {
        const s = slugCurrent(document);
        return s === SLUG_HOME || s === SLUG_LINEUP;
      },
    }),
    defineField({
      name: "heroDescriptionRichEn",
      title: "Hero leírás (EN)",
      ...richText,
      hidden: ({ document }) => {
        const s = slugCurrent(document);
        return s === SLUG_HOME || s === SLUG_LINEUP;
      },
    }),
    defineField({
      name: "introNoteRichHu",
      title: "Kiemelt megjegyzés – HU",
      ...richText,
      description:
        "Kiemelt szöveges blokk az oldal tetején (pl. szállási információk). Csak a szallas és terkep slug-ú dokumentumoknál jelenik meg. Ha üres, a blokk nem renderelődik.",
      hidden: ({ document }) => {
        const s = slugCurrent(document);
        return s !== SLUG_SZALLAS && s !== SLUG_TERKEP;
      },
    }),
    defineField({
      name: "introNoteRichEn",
      title: "Kiemelt megjegyzés – EN",
      ...richText,
      hidden: ({ document }) => {
        const s = slugCurrent(document);
        return s !== SLUG_SZALLAS && s !== SLUG_TERKEP;
      },
    }),
    defineField({
      name: "ticketNoteRichHu",
      title: "🎟️ Narancs jegyblokk — lábjegyzet (HU)",
      ...richText,
      description:
        "A Jegyek & Infó oldal bal oldali narancs blokkjában, a jegyárak ALATT megjelenő szöveg (pl. karszalag, kapuk, SZÉP-kártya). Üresen: a kódbeli alap szöveg jelenik meg. Ezt szerkeszd, ha hibás jegy-/kapu-infót kell javítani.",
      hidden: ({ document }) => slugCurrent(document) !== SLUG_INFO,
    }),
    defineField({
      name: "ticketNoteRichEn",
      title: "🎟️ Orange ticket block — footnote (EN)",
      ...richText,
      description:
        "Same orange ticket-box footnote on Tickets & Info (below prices). Empty = code fallback.",
      hidden: ({ document }) => slugCurrent(document) !== SLUG_INFO,
    }),
    defineField({
      name: "pageBodyRichHu",
      title: "Oldal tartalom – HU",
      ...richText,
      description:
        "Fix aloldalakon és új /oldal/[slug] oldalakon jelenik meg (Hero alatt). A Program oldal szabad szövegét a „Program – szabad szöveg” mezők adják — ez a mező ott nem használatos. Jegyek & Infó (slug: info): a narancs blokk lábjegyzetét a „Narancs jegyblokk — lábjegyzet” mezőben szerkeszd (nem itt). Támogatja: félkövér, dőlt, link, h2, h3, lista, blockquote.",
      hidden: ({ document }) => {
        const s = slugCurrent(document);
        return s === SLUG_HOME || s === SLUG_PROGRAM || s === SLUG_LINEUP;
      },
    }),
    defineField({
      name: "pageBodyRichEn",
      title: "Oldal tartalom – EN",
      ...richText,
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
      name: "programBodyRichHu",
      title: "Program – szabad szöveg (HU)",
      ...richText,
      description:
        "Csak „program” slug esetén. Akkor látszik az oldalon, ha a megjelenítési mód „Szabad szöveg” vagy „Mindkettő”. Támogatja: félkövér, dőlt, link, h2, h3, lista, blockquote.",
      hidden: ({ document }) => slugCurrent(document) !== SLUG_PROGRAM,
    }),
    defineField({
      name: "programBodyRichEn",
      title: "Program – szabad szöveg (EN)",
      ...richText,
      hidden: ({ document }) => slugCurrent(document) !== SLUG_PROGRAM,
    }),
    /* ── Program oldal megjelenítési vezérlők (desktop / mobil) ─────────── */
    defineField({
      name: "showProgramTableDesktop",
      title: "Menetrend tábla látható – asztali",
      type: "boolean",
      initialValue: true,
      description: "Asztali nézeten latszik-e a strukturalt menetrend lista (tábla). Alapertelmezett: igen.",
      hidden: ({ document }) => slugCurrent(document) !== SLUG_PROGRAM,
    }),
    defineField({
      name: "showProgramTableMobile",
      title: "Menetrend tábla látható – mobil",
      type: "boolean",
      initialValue: true,
      description: "Mobil nezeten latszik-e a strukturalt menetrend lista (tábla). Alapertelmezett: igen.",
      hidden: ({ document }) => slugCurrent(document) !== SLUG_PROGRAM,
    }),
    defineField({
      name: "showProgramTextDesktop",
      title: "Program szöveg látható – asztali",
      type: "boolean",
      initialValue: true,
      description: "Asztali nezeten latszik-e a szabad szoveges programleiras. Csak akkor hat, ha van kitoltve program szabad szoveg is. Alapertelmezett: igen.",
      hidden: ({ document }) => slugCurrent(document) !== SLUG_PROGRAM,
    }),
    defineField({
      name: "showProgramTextMobile",
      title: "Program szöveg látható – mobil",
      type: "boolean",
      initialValue: true,
      description: "Mobil nezeten latszik-e a szabad szoveges programleiras. Alapertelmezett: igen.",
      hidden: ({ document }) => slugCurrent(document) !== SLUG_PROGRAM,
    }),
    defineField({
      name: "desktopProgramOrder",
      title: "Sorrend asztali nézetben",
      type: "string",
      initialValue: "tableFirst",
      description: "Asztali nezeten mi legyen elol: a menetrend tábla vagy a szoveges leiras.",
      options: {
        list: [
          { title: "Tabla elol, szoveg utan", value: "tableFirst" },
          { title: "Szoveg elol, tabla utan", value: "textFirst" },
        ],
        layout: "radio",
      },
      hidden: ({ document }) => slugCurrent(document) !== SLUG_PROGRAM,
    }),
    defineField({
      name: "mobileProgramOrder",
      title: "Sorrend mobil nézetben",
      type: "string",
      initialValue: "tableFirst",
      description: "Mobil nezeten mi legyen elol: a menetrend tábla vagy a szoveges leiras.",
      options: {
        list: [
          { title: "Tabla elol, szoveg utan", value: "tableFirst" },
          { title: "Szoveg elol, tabla utan", value: "textFirst" },
        ],
        layout: "radio",
      },
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
        return s !== SLUG_FUTAS && !isCampSlug(s);
      },
    }),
    defineField({
      name: "pageBody2RichHu",
      title: "Második szöveg doboz – HU",
      ...richText,
      description:
        "Tábor: csak ha a kapcsoló be van kapcsolva, cseréli le az alap leírást. Futás: ha ki van töltve, mindig ez a hosszú szöveg jelenik meg a kártyák feletti rész után (kapcsoló nem szükséges).",
      hidden: ({ document }) => {
        const s = slugCurrent(document);
        return s !== SLUG_FUTAS && !isCampSlug(s);
      },
    }),
    defineField({
      name: "pageBody2RichEn",
      title: "Második szöveg doboz – EN",
      ...richText,
      hidden: ({ document }) => {
        const s = slugCurrent(document);
        return s !== SLUG_FUTAS && !isCampSlug(s);
      },
    }),
    /* ── Jazztábor (`tabor` / `jazztabor`) — részletes program + támogatók ─ */
    defineField({
      name: "campEyebrowHu",
      title: "Tábor — szürke sor felett (HU)",
      type: "string",
      description: 'Pl. „Swing · Lindy Hop · Jazz Improvizáció”. Üresen a statikus fallback.',
      hidden: ({ document }) => !isCampSlug(slugCurrent(document)),
    }),
    defineField({
      name: "campEyebrowEn",
      title: "Tábor — szürke sor felett (EN)",
      type: "string",
      hidden: ({ document }) => !isCampSlug(slugCurrent(document)),
    }),
    defineField({
      name: "campScheduleSectionTitleHu",
      title: "Tábor — szekció főcím a kártyák fölött (HU)",
      type: "string",
      description: 'Pl. „Tanárok és program (2026)”. Üresen a statikus scheduleTitle.',
      hidden: ({ document }) => !isCampSlug(slugCurrent(document)),
    }),
    defineField({
      name: "campScheduleSectionTitleEn",
      title: "Tábor — szekció főcím (EN)",
      type: "string",
      hidden: ({ document }) => !isCampSlug(slugCurrent(document)),
    }),
    defineField({
      name: "campScheduleBlocks",
      title: "Tábor — program blokkok (kártyák)",
      type: "array",
      description:
        "Minden blokk egy kártya: cím + bullet lista (Enterrel soronként). Üres lista = a honlap a repo-ban lévő alap menetrendet mutatja (hu.ts/en.ts), ezért a Studio és az élő oldal eltérhet. Kezdő töltés: npm run sanity:seed.",
      hidden: ({ document }) => !isCampSlug(slugCurrent(document)),
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
              name: "displayMode",
              title: "Megjelenítés módja",
              type: "string",
              initialValue: "list",
              options: {
                list: [
                  { title: "Felsorolás (bullets)", value: "list" },
                  { title: "Bekezdések (no bullets)", value: "paragraphs" },
                ],
              },
              description:
                "List = narancs golyócskák (pl. tanárok). Paragraphs = sorkizárt szöveg bekezdések (pl. részvételi díj, program leírás).",
            }),
            defineField({
              name: "bulletsRichHu",
              title: "Tartalom (HU)",
              ...richText,
              description:
                "List módban: minden bekezdés egy golyócska. Paragraphs módban: bekezdések. Bullet list-et a Rich Text editor toolbar-on találod.",
            }),
            defineField({
              name: "bulletsRichEn",
              title: "Tartalom (EN)",
              ...richText,
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
      hidden: ({ document }) => !isCampSlug(slugCurrent(document)),
    }),
    defineField({
      name: "campSupportersSectionTitleEn",
      title: "Tábor — támogatók blokk címe (EN)",
      type: "string",
      hidden: ({ document }) => !isCampSlug(slugCurrent(document)),
    }),
    defineField({
      name: "campSupporters",
      title: "Tábor — támogatók (linkek)",
      type: "array",
      description: "Ha van elem, ez felülírja a statikus támogató listát.",
      hidden: ({ document }) => !isCampSlug(slugCurrent(document)),
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
      name: "runningFreeEntryBannerRichHu",
      title: "Futás — narancs szalag szöveg (HU)",
      ...richText,
      hidden: ({ document }) => slugCurrent(document) !== SLUG_FUTAS,
    }),
    defineField({
      name: "runningFreeEntryBannerRichEn",
      title: "Futás — narancs szalag szöveg (EN)",
      ...richText,
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
      name: "runningCardLocationRichHu",
      title: "Futás — kártya \"Helyszín\" (HU)",
      ...richText,
      hidden: ({ document }) => slugCurrent(document) !== SLUG_FUTAS,
    }),
    defineField({
      name: "runningCardLocationRichEn",
      title: "Futás — kártya \"Helyszín\" (EN)",
      ...richText,
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
      name: "runningEntryDeadlineRichHu",
      title: "Futás — nevezési határidő szöveg (HU)",
      ...richText,
      hidden: ({ document }) => slugCurrent(document) !== SLUG_FUTAS,
    }),
    defineField({
      name: "runningEntryDeadlineRichEn",
      title: "Futás — nevezési határidő szöveg (EN)",
      ...richText,
      hidden: ({ document }) => slugCurrent(document) !== SLUG_FUTAS,
    }),
    defineField({
      name: "runningResultsNoteRichHu",
      title: "Futás — eredményhirdetés / díjak szöveg (HU)",
      ...richText,
      hidden: ({ document }) => slugCurrent(document) !== SLUG_FUTAS,
    }),
    defineField({
      name: "runningResultsNoteRichEn",
      title: "Futás — eredményhirdetés / díjak szöveg (EN)",
      ...richText,
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
        return s !== SLUG_FUTAS && !isCampSlug(s);
      },
    }),
    defineField({
      name: "primaryButtonLabelEn",
      title: "Elsődleges gomb felirata (EN)",
      type: "string",
      hidden: ({ document }) => {
        const s = slugCurrent(document);
        return s !== SLUG_FUTAS && !isCampSlug(s);
      },
    }),
    defineField({
      name: "primaryButtonUrlHu",
      title: "Elsődleges gomb URL (HU)",
      type: "url",
      description: "Csak Futás / Tábor. Üresen a statikus nevezési URL.",
      hidden: ({ document }) => {
        const s = slugCurrent(document);
        return s !== SLUG_FUTAS && !isCampSlug(s);
      },
    }),
    defineField({
      name: "primaryButtonUrlEn",
      title: "Elsődleges gomb URL (EN)",
      type: "url",
      description: "Üresen a HU URL fallback.",
      hidden: ({ document }) => {
        const s = slugCurrent(document);
        return s !== SLUG_FUTAS && !isCampSlug(s);
      },
    }),
    defineField({
      name: "secondaryButtonLabelHu",
      title: "Másodlagos gomb felirata (HU)",
      type: "string",
      description: "Csak Futás / Tábor. Opcionális második gomb.",
      hidden: ({ document }) => {
        const s = slugCurrent(document);
        return s !== SLUG_FUTAS && !isCampSlug(s);
      },
    }),
    defineField({
      name: "secondaryButtonLabelEn",
      title: "Másodlagos gomb felirata (EN)",
      type: "string",
      hidden: ({ document }) => {
        const s = slugCurrent(document);
        return s !== SLUG_FUTAS && !isCampSlug(s);
      },
    }),
    defineField({
      name: "secondaryButtonUrlHu",
      title: "Másodlagos gomb URL (HU)",
      type: "url",
      description: "Üresen nincs másodlagos gomb.",
      hidden: ({ document }) => {
        const s = slugCurrent(document);
        return s !== SLUG_FUTAS && !isCampSlug(s);
      },
    }),
    defineField({
      name: "secondaryButtonUrlEn",
      title: "Másodlagos gomb URL (EN)",
      type: "url",
      hidden: ({ document }) => {
        const s = slugCurrent(document);
        return s !== SLUG_FUTAS && !isCampSlug(s);
      },
    }),
    /* ─────────────────────────────────────────────────────────────────── */
    defineField({
      name: "seo",
      title: "SEO beállítások",
      type: "seo",
      description: "Cím / leírás / OG kép a keresőkhöz és közösségi megosztáshoz.",
    }),
    defineField({
      name: "infoFaqItems",
      title: "GYIK / FAQ (Jegyek & Infó)",
      type: "array",
      description:
        "A jobb oldali GYIK blokk. Ha üres, a kódbeli alap GYIK marad. Rich Text válaszokkal, szerkeszthető linkekkel.",
      of: [defineArrayMember({ type: "infoFaqItem" })],
      hidden: ({ document }) => slugCurrent(document) !== SLUG_INFO,
    }),
    defineField({
      name: "sections",
      title: "Rugalmas szekciók (Phase 1B alap)",
      type: "array",
      description:
        "Opcionális extra blokkok (szöveg, videó, kép, gomb, galéria, térköz). Megjelennek a /oldal/[slug], ÁSZF, Adatvédelem és a Jegyek & Infó bal oszlopában (Szövegdoboz / Rich Text) — a slug-specifikus mezők mellett.",
      of: [
        defineArrayMember({ type: "sectionRichText" }),
        defineArrayMember({ type: "sectionTextBox" }),
        defineArrayMember({ type: "sectionVideo" }),
        defineArrayMember({ type: "sectionButton" }),
        defineArrayMember({ type: "sectionImage" }),
        defineArrayMember({ type: "sectionGallery" }),
        defineArrayMember({ type: "sectionSpacer" }),
      ],
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
