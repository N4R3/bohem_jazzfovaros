# Sanity CMS setup (Phase 1)

Ez a leírás a meglévő Bohém Jazzfőváros / Jazz Capital Next.js oldal Sanity Phase 1 alapbeállítását írja le.

## 1) Környezeti változók

Állítsd be a projekt gyökerében az `.env.local` fájlban:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET` (általában: `production`)
- `NEXT_PUBLIC_SANITY_API_VERSION` (jelenleg: `2026-01-01`)
- opcionális: `SANITY_API_READ_TOKEN` (ha privát lekérdezések kellenek)

Minta: `.env.example`

## 2) Studio indítása és elérése

- Lokális dev: `npm run dev`
- Studio URL: `http://localhost:3000/studio`
- Studio route fájl: `src/app/studio/[[...tool]]/page.tsx`
- Studio config: `sanity.config.ts`
- CLI config: `sanity.cli.ts`

## 3) Létrehozott schema-k

Schema index: `src/sanity/schemaTypes/index.ts`

Dokumentumok:

1. `siteSettings`
2. `popupSettings`
3. `page`
4. `performer`
5. `programItem`
6. `ticket`
7. `sponsor`
8. `sponsorCategory`
9. `accommodation`
10. `transportItem`
11. `venue`

Közös objektum:

- `seo` (`src/sanity/schemaTypes/objects/seo.ts`)

## 4) Singleton dokumentumok

Ezekből csak egy példány lehet:

- `siteSettings`
- `popupSettings`
- `venue`

Desk struktúra: `src/sanity/deskStructure.ts`

## 5) HU/EN mezőlogika

Ebben a fázisban dokumentumszintű i18n plugin nincs.
Egy dokumentumon belül külön mezők vannak:

- pl. `titleHu`, `titleEn`
- pl. `descriptionHu`, `descriptionEn`

Ez egyszerű és stabil induló megoldás a két domaines (HU/EN) logikához.

## 6) Query-k

Fájl: `src/sanity/lib/queries.ts`

Elkészült query-k:

- `getSiteSettingsQuery`
- `getPopupSettingsQuery`
- `getVenueQuery`
- `getPerformersQuery`
- `getFeaturedPerformersQuery`
- `getProgramItemsQuery`
- `getTicketsQuery`
- `getVisibleTicketsQuery`
- `getSponsorsGroupedByCategoryQuery`
- `getAccommodationItemsQuery`
- `getTransportItemsQuery`
- `getPageBySlugQuery`

## 7) Fallback működés (Sanity üres dataset esetén)

Fájl: `src/sanity/lib/content.ts`

A következő részek Sanity-ről próbálnak olvasni, és hiba/üres adat esetén visszaesnek a jelenlegi statikus contentre:

- támogatók footer
- Széchenyi popup
- jegyek (`/info`)
- fellépők (`/lineup`)

Ezért a build Sanity adatok nélkül is működőképes marad.

## 8) Támogatók szerkesztése

Schema-k:

- `sponsorCategory` (kategória HU/EN cím + sorrend)
- `sponsor` (név, logó, URL, kategória referencia, sorrend, aktív)

Lekérdezés kategóriacsoportosan:

- `getSponsorsGroupedByCategoryQuery`

Megjegyzés: Phase 2-ben érdemes seed/import scriptet készíteni a régi `jazzfovaros.hu` aljáról összegyűjtött lista automatikus feltöltésére.

## 9) Popup kép cseréje

Sanity-ben: `popupSettings.image`

Fallback (ha nincs Sanity adat):

- `src/content/hu.ts` → `szechenyiImage`
- `src/content/en.ts` → `szechenyiImage`

UI komponens:

- `src/components/home/SzechenyiPopup.tsx`

## 10) Házirend PDF link

Sanity-ben:

- `siteSettings.houseRulesPdf`

Jelenlegi fallback:

- `src/content/hu.ts` → `houseRulesPdf`
- `src/content/en.ts` → `houseRulesPdf`

## 11) Kezdő adatok seed/import (Phase 2A)

Seed fájl:

- `src/sanity/seed/initialData.ts`

Import script:

- `scripts/importSanityInitialData.ts`
- parancs: `npm run sanity:seed`

Szükséges plusz env:

- `SANITY_API_WRITE_TOKEN`

Részletes leírás:

- `docs/SANITY_INITIAL_CONTENT.md`

## 12) Mit kell először létrehozni Studio-ban?

Ajánlott sorrend:

1. `siteSettings` (singleton)
2. `popupSettings` (singleton)
3. `venue` (singleton)
4. `sponsorCategory`
5. `sponsor`
6. `ticket`
7. `performer`

## 13) Támogatók felvitele kategóriával

- Előbb kategóriák (`sponsorCategory`)
- Utána támogatók (`sponsor`) a `category` reference mezővel
- Minden külső link új lapon nyíljon (frontend már így kezeli)

Ellenőrző lista:

- `docs/SPONSORS_IMPORT_TODO.md`

## 14) Popup kép beállítása

- `popupSettings.image` mezőbe töltsd fel a képet
- fallback továbbra is: `/images/43e3a57583f727d87fb1271bb22963ef.jpg`

## 15) Jegyek rejtése (`isHidden`)

Üzleti szabály:

- HOT Super Early Bird / Early Bird → `isHidden: true`, `isAvailable: false`
- látható jegyek → `isHidden: false`, `isAvailable: true`

## 16) Mi marad a következő fázisra?

- Több page teljes átállítása Sanity adatra (program, szállás, térkép, contact, stb.)
- SEO mezők aktív bekötése page szinten (`seo` objektumból metadata)
- Studio input validációk finomítása (kötelező mezők, URL validáció, stb.)
- Opcionális preview workflow bevezetése

## 17) Phase 2B: átkötött oldalak

Sanity adatra kötve (fallbackkel):

- `program` oldal (`programItem` + opcionális `page` slug=program)
- `szállás` oldal (`accommodation`)
- `térkép/közlekedés` oldal (`venue` + `transportItem`)
- `kapcsolat` oldal (`siteSettings` kontakt mezők)

Fallback akkor lép életbe, ha:

- nincs Sanity config,
- üres a dataset,
- query hiba történik,
- hiányzik a releváns dokumentum.

## 18) Kötelező / ajánlott mezők

- `programItem`: `titleHu/titleEn`, `date`, `startTime`, `stage`, `isActive`, `order`
- `accommodation`: `name`, `descriptionHu/descriptionEn`, `distanceHu/distanceEn`, `isActive`, `order`
- `venue`: `nameHu/nameEn`, `mapEmbedUrl` vagy `latitude+longitude`
- `transportItem`: `titleHu/titleEn`, `descriptionHu/descriptionEn`, `isActive`, `order`
- `siteSettings` (kapcsolat): `contactEmail`, `contactPhone`, `facebookUrl`, `instagramUrl`

## 19) Sorrend és elrejtés

- Program rendezés: `date`, `startTime`, `order`
- Program elrejtés: `isActive = false`
- Szállás rendezés: `order`
- Szállás elrejtés: `isActive = false`
- Közlekedés rendezés: `order`
- Közlekedés elrejtés: `isActive = false`

## 20) Phase 2C: SEO metadata Sanity bekötés

Központi helper:

- `src/sanity/lib/seoContent.ts`
- fő függvények:
  - `getSeoMetadataForPage(...)`
  - `buildPageMetadataWithSanity(...)`

Használt Sanity forrás:

- `page` dokumentum `seo` objektuma (`src/sanity/schemaTypes/objects/seo.ts`)
- lekérdezés slug alapján: `getPageBySlugQuery`

Bekötött oldalak:

- `/` (slug: `home`)
- `/info/` (slug: `info`)
- `/lineup/` (slug: `lineup`)
- `/program/` (slug: `program`)
- `/contact/` (slug: `contact`)
- `/szallas/` (slug: `szallas`)
- `/terkep/` (slug: `terkep`)
- `/futas/` (slug: `futas`)
- `/tabor/` (slug: `tabor`)
- `/aszf/` (slug: `aszf`)

SEO mezők szerkesztése Sanity-ben:

1. Nyisd meg a megfelelő `page` dokumentumot (slug szerint).
2. A `SEO` blokkban állítsd:
   - `seoTitleHu`, `seoTitleEn`
   - `seoDescriptionHu`, `seoDescriptionEn`
   - `canonicalOverrideHu`, `canonicalOverrideEn` (opcionális)
   - `ogImage` (opcionális)
   - `noIndex` (opcionális)

Fallback működés:

- ha nincs Sanity konfiguráció,
- ha nincs ilyen `page` dokumentum,
- ha a `seo` objektum üres/hiányos,
- vagy Sanity fetch hiba történik,

akkor automatikusan marad a meglévő statikus fallback title/description/OG.

Canonical + hreflang:

- alap canonical továbbra is a kétdomaines helperből jön:
  - HU: `https://jazzfovaros.hu/...`
  - EN: `https://jazzcapital.hu/...`
- alternates (`hu`, `en`, `x-default`) változatlanul megmarad.
- `canonicalOverrideHu/En` csak a canonical mezőt írja felül, ha explicit meg van adva.

noIndex működés:

- `noIndex: true` esetén:
  - `robots.index = false`
  - `robots.follow = false`
  - `robots.googleBot.index = false`
  - `robots.googleBot.follow = false`
- ha `noIndex` nincs vagy `false`, az oldal indexelhető marad.

OG image működés:

- ha van `seo.ogImage`, a helper a Sanity image builderrel URL-t generál,
- a kimenet abszolút URL-re normalizálódik,
- ha nincs image vagy hibás, fallback marad: `/images/og-image.jpg`.

## 21) Kliens / szerkesztői gyors útmutató

Ez a rövid útmutató a napi tartalomszerkesztéshez készült.

### Hol mit szerkessz?

- **Fellépők**: `Performer`
  - Név, rövid leírás, bio, linkek, sorrend (`order`), láthatóság (`isActive`), kiemelés (`isFeatured`)
- **Program**: `Program item`
  - Cím (HU/EN), dátum, kezdési idő, színpad, sorrend, láthatóság
- **Jegyek**: `Ticket`
  - Jegynév (HU/EN), ár, jegylink, badge, sorrend, elérhetőség (`isAvailable`), elrejtés (`isHidden`)
- **Támogatók**:
  - kategóriák: `Sponsor category`
  - elemek: `Sponsor` (név, logó, link, kategória, sorrend, aktív állapot)
- **SEO mezők**: `Page` dokumentumok `SEO` blokkja
  - `seoTitleHu/En`, `seoDescriptionHu/En`, opcionálisan `ogImage`, `canonicalOverrideHu/En`, `noIndex`

### Mit ne piszkáljon a szerkesztő?

- Ne módosítsa a technikai azonosítókat (`_id`, slug-ok rendszerlogikája).
- Ne törölje a legacy mezőket (`imagePath`, `logoPath`) képfeltöltés előtt.
- Ne kapcsolja be a `noIndex` mezőt indok nélkül.
- Ne módosítsa a singleton dokumentumok szerepét (`siteSettings`, `popupSettings`, `venue`).
- Ne írja át a domain/canonical logikát kézi URL-ekkel, csak ha erre külön kérés van.
