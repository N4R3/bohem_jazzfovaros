# Sanity mező–binding audit (kódbázis alapján, 2026-04-27)

**Cél:** Végigkövetni, hogy a Studio `schema` mezői hol jelennek meg: `queries.ts` → `content.ts` / `seoContent.ts` → `src/app` / `components`.

**Magyarázat a státuszokhoz**

| Státusz | Jelentés |
|--------|----------|
| **OK** | A mező a queryben van, a réteg használja (vagy SEO/metadata úton), a UI-ban értelmesen megjelenik / hat. |
| **HIÁNYZIK QUERYBŐL** | A séma + seed lehet, de a GROQ nem kéri (vagy nincs dedikált lekérés). |
| **HIÁNYZIK MAPPINGBŐL** | A query adja, de `content.ts` / típus nem viszi tovább a UI felé. |
| **NINCS FRONTEND HASZNÁLAT** | Nincs bekötve oldalra / komponensre (csak Studio + dataset). |
| **ÜRES ADAT** | Seed lehet üres; a script / manuális ellenőrzés jelzi. |
| **CSAK FALLBACK** | Sanity üres vagy hiba esetén a statikus `hu.ts` / `en.ts` / `base.ts` érték látszik. |

**Közös megjegyzések**

- A `getSiteSettingsQuery` a teljes `siteSettings` dokumentumot adja; explicit mezőprojekció nincs.
- A `getPageBySlugQuery` a teljes `page` dokumentumot adja (SEO is); a `buildPageMetadataWithSanity` csak a `seo` objektumot használja.
- A **Footer** és a legtöbb **globális** elem csak `getContent()`-et hív (statikus tartalom) — a `getContactContent()`-ben összefújt `siteSettings` mezők **nem** jelennek meg automatikusan a footerekben, ha a komponens nem a merge-elt `contact` objektumot kapja.
- A **főoldal** `SzechenyiPopup` a `showOnlyOnHomepage` értéket a `getPopupSettingsWithFallback()` visszaadja, de a prop **nincs átadva** a komponensnek (a komponens API-ja sem tartalmazza).

---

## siteSettings

| Sanity típus | mezőnév | Studio szerkeszthető? | seedben? | query lekéri? | content layer? | frontend használ? | várható hely | státusz | javasolt javítás |
|--------------|---------|------------------------|----------|---------------|----------------|-------------------|--------------|---------|------------------|
| siteSettings | titleHu, titleEn, descriptionHu, descriptionEn | igen | igen | igen* | `getContactContent` **nem** (nem merge-elt) | NINCS (globális cím) — főként statikus `c.meta` | Főcím szövegek | NINCS FRONTEND / CSAK statikus | Opció: `layout` metadata vagy hero injektálás, ha kell. |
| siteSettings | festivalStartDate, festivalEndDate | igen | igen | igen* | nem | Részben: JSON-LD a `page.tsx` hardcode dátumokkal | Főoldal `musicEventSchema` | NINCS FRONTEND (Sanity) | Dátumok húzása siteSettingsből, ha kell. |
| siteSettings | venueNameHu, venueNameEn | igen | igen | igen* | `getContactContent` **nem** (merge nélkül) | Footer szervező szöveg: `c.contact.organizer` (statikus merge contactnál: `organizationName`) | Footer, kapcsolat | **CSAK FALLBACK** a footerben | Footer: `getContactContent` vagy siteSettings hívás. |
| siteSettings | **ticketUrlHu, ticketUrlEn** | igen | igen | igen* | `getContactContent` **nem**; külön helper nincs | **Nem** — `info` oldal, Hero, CTA, TicketBoxes: `c.info.ticketUrl` / `BASE` | Info jegy CTA, főoldal gombok | **NINCS BINDING (globális)** | Jegy URL siteSettings → `c.info` helyettesítés vagy dedikált hook. |
| siteSettings | **facebookUrl, instagramUrl, youtubeUrl** | igen | igen | igen* | `getContactContent` merge → `contact.socials` | **Részben:** `contact` oldal; **Footer** továbbra is **statikus** `c.contact.socials` (nem Sanity) | `Footer` social ikonok, kapcsolat | **CSAK FALLBACK a Footerben** | Footer: `getContactContent` adat, vagy siteSettings fetch. |
| siteSettings | contactEmail, contactPhone | igen | igen | igen* | `getContactContent` → merge | Kapcsolat + footer: footer **getContent** | `contact/`, `Footer` | **Részben OK** (contact), **CSAK statikus a footer** | Lásd fent. |
| siteSettings | volunteerTitleHu/En, volunteerDescriptionHu/En | igen | igen (seed) | igen* | `getContactContent` **NEM** merge-eli a leírást/címet, csak gombcímkéket + URL | Kapcsolat: részben statikus szövegek | `contact` | **HIÁNYZIK MAPPINGBŐL** (free text) | `getContactContent` bővítés (ha kell). |
| siteSettings | volunteerButtonLabelHu/En, volunteerUrl | igen | igen | igen* | `getContactContent` igen (gomba + url) | Kapcsolat | `contact` | **OK (részben)** | — |
| siteSettings | **houseRulesPdf** | igen | igen | igen* | `getContactContent` **nem** | Footer: `c.houseRulesPdf` (statikus), **nem** siteSettings | Footer „Házirend” | **NINCS SANITY A FOOTERBEN** | `getContent` merge vagy külön fetch. |
| siteSettings | organizationName, organizationUrl | igen | igen | igen* | név: merge, URL: **nincs** mapping a típusban/merge-ben | Név: contact; org URL: nincs a UI-n | `contact` | org URL: **NINCS FRONTEND** | Hivatkozás, ha kell. |
| siteSettings | **seo** (egész objektum) | igen | igen (seed) | igen* | Nincs olvasás a layout/page SEO-hoz; oldalak a **`page` dokumentum** `seo` mezőjét használják | Nem globális SEO override | — | **NINCS FRONTEND (globális siteSettings SEO)** | Döntés: globális SEO a layoutban vagy töröljük/merge. |

\*`getSiteSettingsQuery` = teljes dokumentum, minden mező a válaszban, explicit projekció nélkül a `queries.ts`-ben külön sorban.

---

## popupSettings

| Sanity típus | mezőnév | Studio | seed | query | content | frontend | várható hely | státusz | javasolt |
|-------------|---------|--------|------|-------|---------|----------|-------------|---------|----------|
| popupSettings | isEnabled | igen | igen | igen | `getPopupSettingsWithFallback` | `page.tsx` → `enabled` | Főoldal popup | OK | — |
| popupSettings | **image, imagePath** | igen | nincs asset / van path | igen | `getPopupSettingsWithFallback` (asset → urlFor, különben path) | `SzechenyiPopup` `imageSrc` | Főoldal | OK (path) | Kép asset, ha kell. |
| popupSettings | altHu, altEn | igen | igen | igen | merge + locale | `altText` | Főoldal | OK | — |
| popupSettings | sessionStorageKey | igen | igen | igen | igen | `storageKey` | Főoldal | OK | — |
| popupSettings | **showOnlyOnHomepage** | igen | igen | igen | igen a return objektumban | **Nem** (nincs prop a `SzechenyiPopup`-on) | — | **HIÁNYZIK MAPPINGBŐL / NINCS FRONTEND** | `SzechenyiPopup` bővítés + `page` feltétel (később). |

---

## page

| Sanity típus | mezőnév | Studio | seed | query | content | frontend | státusz | javasolt |
|-------------|---------|--------|------|-------|---------|----------|---------|----------|
| page | slug, titleHu/En | igen | igen | `getPageBySlug` (metadata) + inline GROQ programnál | Program: külön inline query csak program hero mezőkhöz | Részben (program) | Részben OK / egyéb oldalak statikus cím | Page-driven hero minden aloldalra, ha kell. |
| page | bodyHu, bodyEn (block) | igen | seed: tipikusan üres / nincs | igen* | nincs portable text render | NINCS | NINCS FRONTEND | Portable Text, ha kell. |
| page | heroTitle*, heroDescription* | igen | igen (seed) | igen* | `getProgramContent` csak **program** slugra | `program` oldal | Részben OK; többi oldal: statikus | Használat bővítés (Opció). |
| page | **seo** (összes) | igen | igen | `getPageBySlug` | `getSeoMetadataForPage` | `generateMetadata` a listázott `page.tsx` fájlokban | **OK (metadata)** | `seoContent.ts` ellenőrizze az OG képet. |
| page | order, isActive | igen | igen | igen* | nincs listázó UI a „page” dokumentumokhoz | nincs | NINCS FRONTEND (editor only) | — |

---

## performer

| mezőnév | Studio | seed | query | content | frontend (lineup, home) | státusz | javasolt |
|--------|--------|------|-------|---------|------------------------|---------|----------|
| name | igen | igen | igen | `getPerformersWithFallback` | LineupGrid, LineupTeaser (név) | OK | — |
| slug | igen | igen? | igen | nem használt a mappingben | nincs URL /deep link | NINCS | slug-alapú route, ha kell. |
| image, **imagePath** | igen | path | igen | igen (logo imagePath mint URL) | lineup + főoldal: **Igen** | OK | — |
| shortDescriptionHu/En | igen | lehet üres | igen | genre mezőként | teaser genre | OK / üres = üres | Seed kitöltés. |
| bioHu/En | igen | igen (részben) | igen | igen | lineup részletek: statikus `performerDetailsHu` dominál | Részben duplikáció | Döntés: Sanity vagy static. |
| websiteUrl, soc. URL-ek | igen | igen (seed) | igen | **NEM a mappingben** (Artist type) | LineUp: továbbra is **statikus** map | **HIÁNYZIK MAPPINGBŐL** (Sanity link) | Típus + LineUp merge. |
| order | igen | igen | igen (order asc) | igen |— | OK | — |
| isFeatured | igen | ? | igen; `getFeaturedPerformersQuery` külön | **nem használt** | főoldal: minden aktív | NINCS | featured szekció, ha kell. |
| isActive | igen | igen | szűrő a queryben | igen | — | OK | — |
| seo | igen | — | igen | **nem** (nincs performer oldal) | nincs | NINCS FRONTEND | jövő: /lineup/ slug SEO. |

---

## programItem

| mezőnév | Studio | seed | query | content (getProgramContent) | program oldal | státusz | javasolt |
|--------|--------|------|-------|---------------------------|---------------|---------|----------|
| titleHu/En | igen | igen | igen | → `slot.artist` label | igen (szöveg) | OK | — |
| descriptionHu/En | igen | igen | igen | → `note` | igen (ha meg van adva) | OK | — |
| date, startTime, endTime | igen | igen | igen | dátum + idő + időtartam | igen (idő, dátum fejlécben) | OK | — |
| stage | igen | igen | igen | `normalizeStage` | színezés main/club (nem a nyers string) | Részben OK (nem a nyers "stage" szöveg) | Exponálni, ha kell. |
| **category** | igen | lehet | igen | **nem** | nincs | **HIÁNYZIK MAPPINGBŐL** | UI, ha kell. |
| **performers** (ref) | igen | tipikusan üres | igen (expand) | **nem** (slot cím a program cím) | nincs előadó ref név a slotban | **HIÁNYZIK MAPPINGBŐL** | Slot.artist = ref név, ha nincs title. |
| order, isActive | igen | igen | igen / szűrés | igen (sort) | igen | OK | — |
| seo | igen | — | igen | nem | nincs | NINCS | — |

---

## ticket

| mezőnév | Studio | seed | query | content | frontend (info) | státusz | javasolt |
|--------|--------|------|-------|---------|-----------------|---------|----------|
| nameHu, nameEn, price, currency, badge* | igen | igen | `getVisibleTickets` | címke, ár, highlight | igen (lista) | **OK a megjelenítéshez**; URL-k nem | — |
| descriptionHu/En | igen | lehet | igen | **nem** | nincs | **HIÁNYZIK MAPPINGBŐL** | Opció. |
| ticketUrlHu, ticketUrlEn | igen | igen (seed) | igen | **nem**; info a globális `c.info.ticketUrl`-t használja | „Jegyvásárlás” = globális URL | **NINCS (ticket-szintű jegylink a UI-n)** | Tier-link vagy mező merge. |
| isAvailable, isHidden | igen | igen | GROQ + dupla `filter` kódban | elrejt / nem jelenik a listában | Rejtés működik | **OK** | Dupla filter egységesíthető. |
| order | igen | igen | igen | igen (sorrend) | rendezett lista | OK | — |

---

## sponsor

| mezőnév | Studio | seed | query | content (footer) | státusz | javasolt |
|--------|--------|------|-------|------------------|---------|----------|
| name, logo, **logoPath** | igen | logoPath főként | igen | igen (URL vagy path) | OK | — |
| url | igen | igen | igen | igen | OK | — |
| category (ref) | igen | igen | igen (GROQ) | igen (csoportosítás) | OK | — |
| order, isActive | igen | igen | igen (sort) | igen (szűrés) | OK | — |

---

## sponsorCategory

| mezőnév | Studio | seed | query | content | státusz |
|--------|--------|------|-------|---------|--------|
| titleHu, titleEn | igen | igen (3 db) | igen | igen (case-insensitive egyeztetés) | **OK** (a resolve kulcs: magyar/angol) |
| order | igen | igen | igen | igen (kategóriasorrend) | OK |

---

## accommodation

| mezőnév | Studio | seed | query | getAccommodationContent | szállás oldal | státusz |
|--------|--------|------|-------|--------------------------|---------------|--------|
| name | igen | igen | igen | igen | igen | OK |
| descriptionHu/En | igen | igen | igen | igen | igen | OK |
| image, **imagePath** | igen | igen (path) | igen | igen | igen (Image) | OK |
| websiteUrl, bookingUrl | igen | igen? | igen | booking merge | igen (foglalás) | OK |
| distanceHu/En | igen | igen | igen | igen | igen | OK |
| order, isActive | igen | igen | igen | igen (szűr/sort) | igen | OK |

---

## transportItem

| mezőnév | Studio | seed | query | getTransportContent | térkép `DirectionCard` | státusz | javasolt |
|--------|--------|------|-------|--------------------|--------------------|---------|----------|
| titleHu, titleEn | igen | igen | igen* | igen (mode) | igen (címsor) | OK | — |
| descriptionHu/En | igen | igen | igen* | igen (text) | igen (szöveg) | OK | — |
| **icon** | igen | igen (re-seed) | igen* | igen (vagy guess) | igen (SVG) | **OK** (vagy heurisztika) | Seed újra, ha nincs mező. |
| **url** | igen | lehet "" | igen* | **nem a mappingben** (nem kerül UI-ra) | nincs link a kártyán | **HIÁNYZIK MAPPINGBŐL** | Kártyához `href` opció. |
| order, isActive | igen | igen | igen (GROQ sort) | igen (szűrés) | igen (sorrend) | OK | — |

\*`getTransportItemsQuery` = `*` (minden mező a dokumentumon).

---

## venue

| mezőnév | Studio | seed | query | getVenueContent | térkép / embed | státusz | javasolt |
|--------|--------|------|-------|-----------------|------------------|--------|----------|
| nameHu, nameEn | igen | igen | igen (teljes) | igen (eyebrow) | igen (BeachPageShell) | **OK (eyebrow)** | Cím: map.title továbbra is statikus (lent). |
| addressHu/En | igen | lehet? | igen | **NEM a `venueContent` visszatérésében fő címként**; contact cím: statikus a shellben? | térkép: nem külön address blokk a venue-ból | **HIÁNYZIK MAPPINGBŐL (UI)** | Címke megjelenítés. |
| **mapEmbedUrl, googleMapsUrl** | igen | seed? | igen | igen (vagy GPS fallback) | igen (iframe) | **OK (ha be van seedelve)** | Env-specifikus. |
| latitude, longitude | igen | igen? | igen | igen (GPS) | igen (GPS címke) | **OK (GPS-ből string)** | — |
| descriptionHu/En | igen | igen? | igen | igen (térkép alatti info) | igen | OK | — |
| **mapImage, title, subtitle (térkép blokk hero)** | — (nincs a venue sémában) | N/A | N/A | `getVenueContent`: **mindig** `c.map.mapImage` / `c.map.title` / `c.map.subtitle` | igen, statikusból | **CSAK FALLBACK (CMS nem tudja a „térkép hero” képet cserélni.)** | Opció: kiterjeszteni a `venue` sémát, ha kell. |

---

# Feladat 2 – Kiemelt kérdések (Igen / Nem / Részben)

| Kérdés | Eredmény (kód alapján) |
|--------|-------------------------|
| `siteSettings.ticketUrlHu/En` **befolyásolja** a fő/infó jegy gombokat? | **Nem.** A gombok a statikus `c.info.ticketUrl` / `BASE` URL-t használják (`info/page`, `page.tsx` CTA, `TicketBoxes` is fix URL). |
| `siteSettings.facebookUrl/instagramUrl` a social gombokat? | **Közvetlenül a Footerben nem** — a Footer a statikus `c.contact.socials`-ból húz. A `contact` oldal **merge-elt** `getContactContent()` adatból: **Igen, ott**. |
| `houseRulesPdf` a Házirend linket? | **A Footer a statikus `c.houseRulesPdf`-t használja, nem a siteSettings merge-et.** (Seed egyezhet.) |
| `popupSettings` image vagy imagePath a popupot? | **Igen** — `getPopupSettingsWithFallback` → `imageSrc`; client `<img>`. |
| `page` SEO a metadata-ban? | **Igen** — `buildPageMetadataWithSanity` + `getSeoMetadataForPage`. |
| performer kép: image vagy imagePath? | **Igen** a lineupnál + főoldal teaser: `getPerformersWithFallback` (url vagy path). A lineup továbbra is kever statikus biót a komponensben. |
| programItem: dátum/idő/színpad/kategória/performers a programon? | Dátum, idő, (színpad normalizált) **Igen**; kategória és `performers` ref **Nem a UI-on**. |
| `ticket` isHidden/isAvailable elrejt? | **Igen** (GROQ: `!isHidden && isAvailable`; plusz kódban `isHidden` még filter). A rejtett tier nem esik a „látható” listába. |
| sponsor logo/többi a footerben? | **Igen** (kategóriákkal, URL-lel, logo vagy `logoPath`). |
| accommodation mezők a szálláson? | **Igen** a `getAccommodationContent` mappingon keresztül. |
| transport: icon, cím, leírás, sorrend; URL? | Cím, leírás, ikon, **sorrend**: **Igen**; **url: Nem jelenik meg a kártya UI-n.** |
| venue: embed, név, leírás, cím, GPS? | **Embed + név (eyebrow) + leírás + lat/long**: **Igen, ha a dokumentumban vannak**; **térkép hero cím, alcím, nagy térképkép: statikus `c.map`**, venue nem cseréli. |

---

# Összefoglaló: legfontosabb hiányzó / félreértéses binding

1. **Globális jegy-URL (siteSettings.ticketUrl*)** nincs bekötve a fő/infó/gombokhoz; marad a statikus `info.ticketUrl`.
2. **Footer** socialok és **houseRulesPdf** **nem** a `getContactContent` / `siteSettings` merge-ből, hanem a nyers `getContent()`.
3. **popup `showOnlyOnHomepage`**: visszaadott érték **nem** vezérli a komponenst.
4. **programItem `performers` ref** és **category** lekérve, de **nem** jelenik meg; a slot a program item *címet* mutatja műsorként.
5. **ticket** tier-specifikus `ticketUrl*`: **nincs** a UI listában.
6. **transport `url`**: nincs a térkép kártyán.
7. **performer** social/website: Sanity query-ben van, **de** a `Artist` + LineUp még a statikus biót/linkeket használja sok helyen.
8. **siteSettings.seo (globális)**: nincs felhasználva a `layout` metadata helyett; az oldalankénti SEO a **`page`** dokumentumokból jön.

---

# Következő lépések (nem része ennek a PR-nak, csak jegyzet)

- Döntés: globális gombok → siteSettings, vagy csak a statikus fájlok.
- Footer → egy közös `contact merge` a layout szintjén, vagy Footer fetch `getContactContent` / siteSettings.
- `SzechenyiPopup` + `showOnlyOnHomepage` prop.
- `programItem` + előadó ref megjelenítés (opcionális).

*Dokumentum: statikus kódaudit + `initialData.ts` (seed) áttekintés; a live Sanity dataset nincs helyileg ebben a fájlban lekérve.*
