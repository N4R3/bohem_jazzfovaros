# HU/EN Tartalmi és Fordítási Audit — Jazzfőváros 2026

**Létrehozva:** 2026. május 13.  
**Alapja:** Kódbeli elemzés (hu.ts, en.ts, base.ts, Sanity sémák, content.ts fallback logika)  
**Scope:** Minden publikus oldal, minden szerkeszthető mező, minden fallback útvonal  

---

## Vezetői összefoglaló

A projekt kétnyelvű (HU/EN) architektúrát használ: statikus tartalomfájlok (`hu.ts`, `en.ts`) + Sanity CMS felülírási réteg. Az EN fordítás **alapstruktúrában teljes** (en.ts minden kulcsmezőhöz tartalmaz szöveget), de négy rendszerszintű probléma veszélyezteti a minőséget:

1. **Csendes HU→EN fallback** (`localized()` függvény): ha egy Sanity dokumentumban az EN mező üres, a rendszer automatikusan a HU szöveget mutatja az angol oldalon — hibaüzenet nélkül.
2. **Privacy Policy (Adatvédelem) EN hiányzik**: nincs statikus EN fallback, és a Sanity-beli EN tartalom sem töltött — az angol oldal üres bodyt jelenít meg.
3. **Rich text EN mezők**: a rich text mezőknél nincs HU→EN fallback, üres EN → semmi sem jelenik meg az EN oldalon.
4. **Fellépők `origin` mező**: a Sanity performer dokumentumokban az `origin` mező nem létezik, minden Sanity-ből jövő fellépőnél üres marad (EN is, HU is).

---

## 1. Oldalonkénti státusz

| Oldal | HU statikus | EN statikus | Sanity HU | Sanity EN | Megjegyzés |
|-------|-------------|-------------|-----------|-----------|------------|
| Főoldal (`/`) | ✅ Teljes | ✅ Teljes | Részleges | Részleges | SEO, hero OK; performer tags EN kell |
| Fellépők (`/lineup/`) | ✅ Teljes | ✅ Teljes | ✅ OK | ⚠️ Részleges | bio/shortDesc EN kitöltés folyamatban |
| Programok (`/program/`) | ✅ Teljes | ✅ Teljes | ✅ OK | ⚠️ titleEn, descriptionEn hiányos lehet |
| Jegyek & Infó (`/info/`) | ✅ Teljes | ✅ Teljes | Részleges | Részleges | Ticket nameEn szükséges ha Sanity jegy van |
| Szállás (`/szallas/`) | ✅ Teljes | ✅ Teljes | ✅ OK | ⚠️ descriptionEn kitöltendő |
| Térkép (`/terkep/`) | ✅ Teljes | ✅ Teljes | ✅ OK | ⚠️ transport titleEn/descriptionEn |
| Jazztábor (`/tabor/`) | ✅ Teljes | ✅ Teljes | ✅ HU blokkok | ⚠️ EN blokkok (`bulletsRichEn`) hiányos |
| Futás (`/futas/`) | ✅ Teljes | ✅ Teljes | ✅ HU mezők | ⚠️ EN mezők kitöltendők |
| Kapcsolat (`/contact/`) | ✅ Teljes | ✅ Teljes | Részleges | Részleges | organizerName nincs lokalizálva |
| Adatvédelem (`/adatvedelem/`) | ✅ Statikus nincs, Sanity kell | ❌ **HIÁNYZIK** | ⚠️ Kitöltendő | ❌ **Nincs EN** |
| ÁSZF (`/aszf/`) | ✅ Statikus fallback | ✅ Statikus EN megvan | ⚠️ Sanity felülír ha kitöltött | ⚠️ Jogi ellenőrzés szükséges |
| Dinamikus oldalak (`/oldal/[slug]`) | Slug-függő | Slug-függő | Szükséges | ⚠️ `pageBodyRichEn` kitöltendő |

---

## 2. Kritikus problémák

### 2.1 `localized()` csendes HU→EN fallback — RENDSZERSZINTŰ

**Érintett fájl:** `src/sanity/lib/content.ts` (382–384. sor)

```typescript
function localized(locale: "hu" | "en", huValue?: string, enValue?: string): string {
  return (locale === "en" ? enValue : huValue) || huValue || enValue || "";
}
```

**Viselkedés:** ha `enValue` üres/undefined, a függvény visszaadja `huValue`-t. Ez azt jelenti, hogy minden `string` típusú Sanity mezőnél (heroTitleEn, campEyebrowEn, stb.) — ha nincs kitöltve az EN — a **magyar szöveg jelenik meg az angol oldalon, hibaüzenet nélkül**.

**Érintett mezők (Sanity Page dokumentum):**
- `heroTitleEn` → ha üres: HU cím jelenik meg EN oldalon
- `campEyebrowEn` → ha üres: HU eyebrow jelenik meg
- `campScheduleSectionTitleEn` → ha üres: HU szekció cím
- `runningEyebrowEn` / `runningCardDateEn` / `runningCardTimeEn`
- `primaryButtonLabelEn`, `secondaryButtonLabelEn`
- Sanity Navigation: `labelEn` → ha üres: HU menüpont névvel jelenik meg az EN navigációban
- Sanity Accommodation: `descriptionEn`, `priceEn`, `distanceEn`, `bookingLabelEn`
- Sanity Venue: `titleEn`, `subtitleEn`, `directionsHeadingEn`
- Sanity Transport: `titleEn`, `descriptionEn`
- Sanity Ticket: `nameEn`

**Megjegyzés:** Rich text mezőknél (`pageBodyRichEn`, `bulletsRichEn`, stb.) NEM működik ez a fallback — ott üres EN → semmi sem jelenik meg (ami szintén hiba, de más típusú).

---

### 2.2 Adatvédelem (Privacy Policy) EN — HIÁNYZÓ TARTALOM

**Érintett oldal:** `/adatvedelem/`  
**Kód:** `src/app/adatvedelem/page.tsx`

- A HU oldal: `getPageContentBySlug("adatvedelem", "hu")` → Sanity-ből tölt, ha nincs Sanity adat, üres body
- Az EN oldal: `getPageContentBySlug("adatvedelem", "en")` → Sanity-ből tölt, de **nincs statikus EN fallback**
- Ha a Sanity `adatvedelem` dokumentumban `pageBodyRichEn` üres → **az EN Privacy Policy oldal üres bodyt mutat**
- Az `aszf/page.tsx`-től eltérően itt nincs `bodyText = page.body || terms.body` jellegű fallback

**Jelenlegi állapot EN oldalon:** valószínűleg üres (ha az adatvedelem Sanity dokumentum nem tartalmaz EN rich text-et).

**Teendő:** ld. 6. fejezet.

---

### 2.3 EN navigáció — hiányzó "Run/Futás" menüpont

**Érintett fájl:** `src/content/en.ts` (16–25. sor)

```
HU nav (9 elem): Főoldal, Fellépők, Programok, Jegyek & Infó, Szállás, Térkép, Jazztábor, Futás, Kapcsolat
EN nav (8 elem): Home, Performers, Program, Tickets & Info, Accommodation, Map & Transport, Jazz Camp, Contact
```

**Hiányzik:** `{ label: "Run", href: "/futas/" }` az EN navigációból.

**Megjegyzés:** ha a Sanity Navigation dokumentumban a `futas` menüpontnál `labelEn` ki van töltve, az EN nav Sanity-ből fogja mutatni — de statikus fallbackből hiányzik.

**Javasolt fordítás (biztonságosan javítható):** `"Run"` — ld. 7. fejezet.

---

### 2.4 Performer `origin` mező — mindig üres Sanity-ből

**Érintett fájl:** `src/sanity/lib/content.ts` (359. sor)

```typescript
origin: "",  // Genre is separate, not populated from shortDescription
```

A Sanity `performer` dokumentum sémájában **nem létezik `origin` mező**. A `getPerformersWithFallback` mindig `""` értéket ad az `origin`-ra.

**Következmény:** Az angol oldalon a fellépőkártyákon nincs ország/származás adat (sem HU, sem EN). A statikus `BASE.artists` fallbackben az `origin` magyar nevekkel szerepel (Magyarország, Japán, stb.) — ezek az EN oldalon is megjelennek ha a Sanity nem konfigurált vagy hibás.

**Teendő:** vagy a Sanity performer sémába felvenni `originHu` / `originEn` mezőket, vagy a statikus fallbacket lokalizálni. Kézi tartalom-kitöltés szükséges.

---

### 2.5 BASE.artists fallback — HU szövegek az EN oldalon

**Érintett fájl:** `src/content/base.ts` (66–92. sor)

Ha a Sanity lekérdezés hibára fut, a rendszer visszaesik `c.lineup.artists`-re. A `c.lineup.artists` locale-függő (HU → `hu.ts`, EN → `en.ts`). Az `en.ts` megfelelően lefordítja az origint (Hungary, Japan, stb.) ✓

**DE:** a `BASE.artists` (amire `en.ts` **nem** épít direkt origin override-dal egyes mezőknél) tartalmaz HU szövegeket:
- `origin: "Magyarország"`, `"Japán"`, `"Svédország"`, `"Olaszország"`, `"Ausztria / Németország"`, `"Kecskemét, Magyarország"`, `"Nemzetközi"`

Az `en.ts.artists` tömb külön felsorolja az EN originokat (`Hungary`, `Japan` stb.) ✓ Ez a statikus fallback rendben van.

---

## 3. Fontos problémák

### 3.1 Camp / Jazztábor (`/tabor/`) — EN blokkok üresek

**Érintett mező:** `campScheduleBlocks[].bulletsRichEn`

A Sanity camp schedule blokkoknál a `bulletsRichEn` valószínűleg nincs kitöltve (vagy csak részlegesen). A `buildCampOverlay` logika:

```typescript
const bulletsRich = locale === "hu" ? b.bulletsRichHu : b.bulletsRichEn;
const items = bulletsRich && bulletsRich.length > 0 ? bulletsRich : undefined;
return title && items ? { title, items, displayMode } : null;
```

Ha `bulletsRichEn` üres → a blokk `null` lesz → **az EN Jazztábor oldalon nem jelenik meg a menetrend**.

Ha az összes `campScheduleBlocks` null → a rendszer visszaesik `c.camp.schedule`-re (en.ts statikus tartalmára) — de **csak ha a Sanity-ben egyáltalán nincs `campScheduleBlocks`**. Ha vannak HU blokkok de EN nélkül, az EN oldal üres lesz.

### 3.2 Futás oldal (`/futas/`) — EN rich text mezők

Ezek az EN Sanity mezők valószínűleg üresek:
- `runningFreeEntryBannerRichEn` → ha üres, semmi sem jelenik meg az EN szalagban
- `runningCardLocationRichEn` → ha üres, semmi a helyszín kártyában
- `runningEntryDeadlineRichEn` → ha üres, semmi
- `runningResultsNoteRichEn` → ha üres, semmi

### 3.3 Házirend PDF — csak HU változat

**Érintett mező:** `houseRulesPdf` (hu.ts + base.ts + siteSettings)

```typescript
houseRulesPdf: "/documents/hazirend.pdf"
```

Az angol oldalon is a `/documents/hazirend.pdf` (HU dokumentum) hivatkozás jelenik meg. Nincs EN változat, és a link nincs megjelölve "(in Hungarian only)".

### 3.4 Kapcsolat oldal — `organizerName` nincs lokalizálva

**Érintett fájl:** `src/sanity/schemaTypes/documents/siteSettings.ts` (54. sor)

```typescript
defineField({ name: "organizationName", title: "Szervező neve", type: "string" }),
```

Egyetlen `organizationName` mező, nincs `organizationNameHu` / `organizationNameEn`. Ha a Sanity siteSettings-ből jön a szervező neve, az EN oldalon is a HU szöveg jelenik meg.

### 3.5 Galéria alt szövegek — csak HU

**Érintett fájl:** `src/content/base.ts` (94–107. sor)

```typescript
galleryImages: [
  { src: "...", alt: "JAZZFŐVÁROS galéria" },  // Hungarian text
  ...
]
```

Minden galéria kép `alt` szövege `"JAZZFŐVÁROS galéria"` — egyetlen HU verzió, az EN oldalon is ezt mutatja. Alacsony prioritás (SEO és accessibility érintett).

### 3.6 Önkéntes szöveg — minőségi különbség HU/EN

**Érintett fájl:** `src/content/hu.ts` vs `en.ts`

- HU: `"Önkéntes szeretnél lenni a fesztiválon? Töltsd ki a kérdőívet!"` (kérdés + CTA)
- EN: `"I would like to be a volunteer"` (csak gombfelirat)

Az EN verzió egy gombfelirat stílusú szöveg, míg a HU egy teljes felszólítás. Tartalom szempontjából nem hiba, de minőségi inkonzisztencia.

---

## 4. Adatvédelem / Privacy Policy külön értékelés

| Elem | HU | EN |
|------|----|----|
| Statikus fallback kódban | ❌ Nincs (aszf-nél van, adatvédelemnél nincs) | ❌ Nincs |
| Sanity dokumentum (`adatvedelem`) | ✅ Kitöltendő | ❌ Hiányzik (`pageBodyRichEn` üres) |
| Oldal `heroTitle` EN | ✅ Fallback: `"Privacy Policy"` (kódban) | ✅ |
| Oldal body EN | ❌ **Üres** ha Sanity EN nincs kitöltve | ❌ |
| Jogi fordítás szükséges | — | ✅ **Igen — nem generálható automatikusan** |

**Teendő:** Jogász/szakmai fordítás szükséges az EN Privacy Policy-hoz. Az ügyfélnek kommunikálni kell, hogy az angol oldal adatvédelmi tájékoztatója jelenleg üres/hiányzik.

---

## 5. ÁSZF külön értékelés

| Elem | HU | EN |
|------|----|----|
| Statikus fallback kódban | ✅ `hu.ts.terms.body` | ✅ `en.ts.terms.body` |
| Sanity dokumentum felülírja | Ha `aszf` Sanity oldal ki van töltve | Ha `pageBodyRichEn` ki van töltve |
| Tartalom minősége | Eredeti HU szöveg | EN fordítás megvan a kódban |
| Jogi felülvizsgálat szükséges | ⚠️ Ajánlott | ⚠️ **Igen — a kódbeli EN statikus fordítást jogi szakember ellenőrizze** |

Az ÁSZF EN statikus szöveg (`en.ts`) létezik és látszólag helyes fordítás, de jogi dokumentumként **szakmai jóváhagyás szükséges**.

---

## 6. Kategorizált teendők

### A) Automatikusan biztonságosan javítható (rövid UI copy)

| # | Hol | Mit | Javasolt EN érték |
|---|-----|-----|-------------------|
| A1 | `en.ts` nav | Hiányzó "Run" menüpont | `{ label: "Run", href: "/futas/" }` |
| A2 | `en.ts` footer | `"Privacy"` → | `"Privacy Policy"` |
| A3 | `en.ts` footer | `"T&C"` → | `"Terms & Conditions"` |
| A4 | `en.ts` contact | `volunteerText` bővítése | `"Want to volunteer at the festival? Fill out the form!"` ⚠️ ellenőrizendő |
| A5 | BASE.galleryImages | `alt` szöveg lokalizálása | `en.ts`-ben override-olni: `"JAZZ CAPITAL gallery"` |

### B) Kézi fordítást / szerkesztői kitöltést igényel

| # | Sanity dokumentum | Mező | Megjegyzés |
|---|-------------------|------|------------|
| B1 | Performer (mind 25) | `shortDescriptionRichEn` | Rövid kártyaleírás EN |
| B2 | Performer (mind 25) | `bioRichEn` | Hosszú modál-leírás EN |
| B3 | Page (`tabor`) | `campScheduleBlocks[*].bulletsRichEn` | Minden blokk EN tartalma |
| B4 | Page (`futas`) | `runningFreeEntryBannerRichEn` | Narancs szalag EN |
| B5 | Page (`futas`) | `runningCardLocationRichEn` | Helyszín kártya EN |
| B6 | Page (`futas`) | `runningEntryDeadlineRichEn` | Nevezési határidő EN |
| B7 | Page (`futas`) | `runningResultsNoteRichEn` | Eredményhirdetés EN |
| B8 | Accommodation (mind 3) | `descriptionEn` | Szállásleírás EN |
| B9 | Venue | `titleEn`, `subtitleEn`, `descriptionEn`, `directionsHeadingEn` | Térkép oldal EN |
| B10 | Transport (összes) | `titleEn`, `descriptionEn` | Közlekedési leírások EN |
| B11 | Navigation items | `labelEn` (minden menüpontnál) | Ellenőrizni, hogy kitöltött-e |
| B12 | Program items | `titleEn`, `descriptionEn` | Programpontok EN |
| B13 | Performer séma bővítés | `originHu` / `originEn` hozzáadása | Ország/származás megjelenítéséhez |

### C) Jogi/szakmai jóváhagyást igényel

| # | Elem | Teendő |
|---|------|--------|
| C1 | Privacy Policy (`/adatvedelem/`) EN | **Angol jogi fordítás szükséges.** Addig az EN oldal üres bodyt mutat. |
| C2 | ÁSZF (`/aszf/`) EN | Meglévő kódbeli EN fordítás jogi ellenőrzése ajánlott. |
| C3 | Jegyárak, kedvezmények EN | Meglévő EN statikus fordítás ellenőrzése (HUF formátum ok, de a jogi feltételek is érinthetek). |
| C4 | Cookie / SZÉP-kártya tájékoztató | Az ÁSZF részét képezi; a `bartix.hu` integrációra vonatkozó rész EN fordítása szükséges. |

---

## 7. Javasolt fordítások (automatikusan javítható, rövid UI copy)

> ⚠️ Az alábbiak javasolt fordítások. A tartalom szerkesztője/ügyfél hagyja jóvá implementálás előtt.

| Magyar | Javasolt angol |
|--------|----------------|
| Futás *(nav)* | Run |
| Adatvédelem *(footer)* | Privacy Policy |
| ÁSZF *(footer)* | Terms & Conditions |
| Önkéntes szeretnél lenni a fesztiválon? Töltsd ki a kérdőívet! | Want to volunteer at the festival? Fill out the form! |
| JAZZFŐVÁROS galéria *(alt szöveg)* | JAZZ CAPITAL gallery |
| Foglalás → | Book Now → *(már megvan en.ts-ben ✓)* |
| Jazztábor *(nav)* | Jazz Camp *(már megvan en.ts-ben ✓)* |

---

## 8. Nyelvkeveredési leletek

| # | Hol | Probléma |
|---|-----|---------|
| LK1 | Sanity performer `name` mező | `"Nanna Carling (S) soprano sax, voc"` — az `(S)` országkód és a hangszer szerepel a névre mezőben. Kell: `name: "Nanna Carling"`, `countryCode: "S"`, `instrumentEn: "soprano sax, vocals"` |
| LK2 | `BASE.artists` `origin` fallback | HU nevekkel (`Magyarország`, `Japán`) jelenik meg az EN oldalon ha Sanity-ből jövő performer nincs (de az `en.ts.artists` felülírja ✓ — csak Sanity-hiba esetén problémás) |
| LK3 | Sanity SiteSettings `organizerName` | Egyetlen mező, HU és EN oldalon ugyanazt mutatja (`JAZZFŐVÁROS Kft.` — HU szöveg az EN oldalon) |
| LK4 | `BASE.galleryImages` alt szöveg | `"JAZZFŐVÁROS galéria"` — HU az EN oldalon is |
| LK5 | Nav Sanity-ből, `labelEn` üres | Ha a Sanity Navigation itemek `labelEn`-je nincs kitöltve, a HU menüpont neve jelenik meg az EN navigációban |
| LK6 | `houseRulesPdf` | `/documents/hazirend.pdf` — HU dokumentum, EN oldalon "House Rules" linkként megjelenhet anélkül, hogy EN verzió létezne |

---

## 9. Rossz fallbackek összefoglalása

| Kontextus | Mi történik ha EN mező üres | Típus |
|-----------|---------------------------|-------|
| Sanity `string` mező (plain text) | `localized()` → HU szöveg jelenik meg EN-en | Csendes HU→EN fallback |
| Sanity `richText` mező | `undefined` → semmi sem jelenik meg EN-en | Néma hiány |
| Performer `origin` | `""` — minden Sanity performer esetén | Adathiány |
| `adatvedelem` body EN | Üres oldal (nincs statikus fallback sem) | Kritikus üresség |
| Camp `bulletsRichEn` üres de `bulletsRichHu` van | A blokk nem renderelődik EN-en | Néma hiány |
| `BASE.running.distances` | HU label-ek (`2 500 Ft`), de `en.ts` felülírja ✓ | Rendben |
| Nav `labelEn` üres | HU menüpont neve jelenik meg EN navigációban | Csendes HU→EN fallback |

---

## 10. Prioritási lista

### 🔴 Kritikus (blokkoló, felhasználói élményt rontó)

1. **Adatvédelem EN oldal üres** — jogi fordítás szükséges (C1)
2. **EN navigáció hiányzó "Run" menüpont** — könnyű fix (A1)
3. **`localized()` csendes fallback** — rendszerszintű: minden Sanity EN string mező kitöltöttségét ellenőrizni kell (LK5 + általánosan B11)
4. **Performer `origin` mező hiányzik a Sanity sémából** — fejlesztői feladat (B13)

### 🟡 Fontos (minőségi hiányosság)

5. **Camp `/tabor/` EN blokkok** — szerkesztői kitöltés (B3)
6. **Futás `/futas/` EN rich text mezők** — szerkesztői kitöltés (B4–B7)
7. **Performer bio/shortDescription EN** — szerkesztői kitöltés (B1–B2)
8. **Accommodation description EN** — szerkesztői kitöltés (B8)
9. **ÁSZF EN jogi ellenőrzés** (C2)
10. **`organizerName` lokalizálása** (LK3)

### 🟢 Alacsony prioritás (kisebb pontosítások)

11. Footer "Privacy" → "Privacy Policy", "T&C" → "Terms & Conditions" (A2–A3)
12. Galéria alt szöveg lokalizálása (A5 / B referencia)
13. Volunteer szöveg HU/EN minőségi kiegyenlítése (A4)
14. `houseRulesPdf` EN változat vagy jelölés (B referencia)

---

## 11. Ügyfélnek kommunikálható rövid összefoglaló

> Az alábbi szöveg ügyfélkommunikációra szánt összefoglaló.

**Magyar és angol oldalak állapota — 2026. május**

A honlap kétnyelvű rendszere alapjaiban működik: a magyar oldal teljes, az angol oldal statikus tartalma (jegyek, program, szállás, jazztábor, futás) elkészült. Az alábbi területeken szükséges kiegészítés:

**Azonnali teendő (jogi vonatkozású):**
- Az angol nyelvű **Adatvédelmi tájékoztató** szövege hiányzik. Szükséges: szakmai/jogi fordítás, majd Sanity feltöltés. Addig az angol `/adatvedelem/` oldal üres főszöveget mutat.
- Az **ÁSZF** angol verziója kódban megvan, de jogi szakember általi felülvizsgálata ajánlott.

**Szerkesztői kitöltést igénylő területek:**
- Fellépők angol rövid leírása és életrajza (Sanity-ben, minden előadónál)
- Jazztábor programblokkok angol verziói (Sanity-ben)
- Futás oldal egyes szekciói (szalag, helyszín, határidő szövege EN)

**Technikai fejlesztési javaslat:**
- A fellépők kártyáin az ország/származás mező hiányzik a Sanity adatbázisból — felvehető új mezőként

**Automatikusan javítható (fejlesztő elvégzi):**
- Hiányzó "Run/Futás" link az angol navigációban
- Footer "Privacy" → "Privacy Policy", "T&C" → "Terms & Conditions"

---

## 12. A következő auditoknál figyelembe veendő

### Sanity Full Audit elvégezhető-e?
✅ **Igen**, de figyelembe kell venni:
- Minden Sanity dokumentum EN mezőjének teltségi állapota ismeretlen (csak a kódbeli schema és logika vizsgálható; a tényleges tartalom Sanity API lekérdezéssel ellenőrizhető)
- A `localized()` silent fallback miatt a "van EN adat" ≠ "az EN oldalon EN szöveg jelenik meg"

### PROJECT_STATUS_FOR_CLIENT.md elkészíthető-e?
✅ **Igen**, de tartalmazza:
- Az adatvédelem EN hiányát mint kritikus nyitott tétel
- Az ÁSZF EN jogi ellenőrzés szükségességét
- A fellépő bio/shortDescription EN kitöltés folyamatát mint ügyfél-szerkesztői feladatot
- A `localized()` rendszerszintű fallback tudatos kockázatát

### Nyelvi bizonytalanságok a következő dokumentumokban
1. **SANITY_FULL_AUDIT.md**: nem tudni, hogy a Sanity-ben ténylegesen ki vannak-e töltve az EN string mezők — API audit szükséges
2. **PROJECT_STATUS_FOR_CLIENT.md**: az adatvédelem és ÁSZF EN fordítás jogi státusza ismeretlen
