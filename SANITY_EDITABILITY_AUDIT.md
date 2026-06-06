# SANITY EDITABILITY AUDIT
## Jazz / Jazzfőváros Festival Website — Szerkesztési auditálás

> **Cél:** Pontosan meghatározni mi szerkeszthető Sanity-ben, hol szerkeszthető, mire vonatkozik, mi marad hardcoded/fallback, és mi zavaró/duplikált. Ez az audit alapja a végső kliens-útmutatónak.
>
> **Módszer:** A valódi repo kód alapján (schemas, queries, content helpers, page components) — nem feltételezés.
>
> **Dátum:** 2026-06-05

---

## Jelölések

| Jel | Jelentés |
|-----|----------|
| 🟢 | **Primary editor** — normál használat |
| 🔵 | **Global collection** — több helyen jelenik meg |
| 🟡 | **Advanced / ritka** — csak ha indokolt |
| 🟠 | **Másodlagos / deprecated** — általában ne használd |
| 🔴 | **Kockázatos** — megváltoztatása routingot/layoutot törhet |
| ✅ | Sanity-ből jön, szerkeszthető |
| ⚠️ | Sanity + statikus fallback (ha Sanity üres, a kód tölti ki) |
| ❌ | Hardcoded — csak kóddal változtatható |
| 🔒 | Read-only / deprecated mező (ne szerkeszd) |

---

## 1. SANITY SIDEBAR / MENÜ AUDIT

Az összes látható Studio menüpont magyarázata.

| # | Menüpont | Schema típus | Kategória | Mit vezérel? | Hol jelenik meg a site-on? | Figyelmeztetés |
|---|----------|-------------|-----------|-------------|--------------------------|----------------|
| 1 | **Főoldal szerkesztés** | `page` (slug=home) | 🟢 Primary | Főoldal hero szövegek, statisztikák, CTA gomb, CTA banner, videó URL, popup beállítások. | `/` főoldal | Ez a fő helye a főoldal szerkesztésének. Ide nem az „Oldalak" lista alá kell menni. |
| 2 | **Jegyek** (Főoldal alatt) | `ticket` | 🔵 Global | Jegytípusok listája (ár, leírás, CTA gomb, elérhetőség). A `showOnHome=true` jegyek a főoldalon, az összes a /info/ oldalon jelenik meg. | Főoldal jegy-boxok + `/info/` oldal | Ugyanaz a lista, mint a „Jegyek" önálló menüben. Ide van téve kényelmi szempontból. |
| 3 | **Site settings / alapadatok** | `siteSettings` | 🟡 Advanced | Globális jegy URL, kapcsolat adatok, social linkek, festival dátumok, önkéntes gomb URL, házirendpdf link. | Több oldal (contact, footer, home CTA fallback, stb.) | Singleton — csak egy dokumentum. Óvatosan, ezek az adatok minden oldalon hathatnak. |
| 4 | **Pop up settings** | `popupSettings` | 🟡 Advanced | A főoldalon megjelenő popup képe, szövege, be/ki kapcsoló. | Főoldal popup | Singleton. Az `isEnabled=false` teljesen kikapcsolja a popupot. |
| 5 | **Navigáció / Menü** | `navigationItem` | 🔴 Kockázatos | A fejléc navigációs linkek sorrendje, felirata (HU/EN), célpontja, aktív/inaktív állapota. | Fejléc (navbar) | A sorrend (`order`) szám szerint rendezi a menüpontokat. Ha egy menüpont `labelEn` mezője üres, az EN oldalon nem jelenik meg. Ha `isActive=false`, sehol nem jelenik meg. |
| 6 | **Oldalak (Pages)** | `page` | 🟢 Primary | Az összes szerkeszthető oldal listája: program, lineup, info, szállás, térkép, kapcsolat, ÁSZF, adatvédelem, jazztábor, futás, és bármilyen saját oldal. | Minden `/slug` és `/oldal/slug` útvonal | **IDE NE** szerkeszd a főoldalt — ahhoz a „Főoldal szerkesztés" menü van. |
| 7 | **Jazztábor — Page** | `page` (slug=tabor/jazztabor) | 🟢 Primary | A jazztábor oldal tartalma: program blokkok, szervezők, gombok, szöveg. | `/jazztabor/` | Ez ugyanaz a dokumentum, ami az „Oldalak" listában is megtalálható (tabor/jazztabor slug). Kényelmi gyorslinkek. |
| 8 | **Futás — Page** | `page` (slug=futas) | 🟢 Primary | A futás oldal: dátum, időpont, helyszín, távolságok táblázata, nevezési határidő, gombok. | `/futas/` | Ez ugyanaz a dokumentum, ami az „Oldalak" listában is szerepel. |
| 9 | **Program tételek** | `programItem` | 🟢 Primary | Az egyes programesemények: dátum, kezdés/vég, színpad, fellépők, leírás, jegy URL. | `/program/` táblázat | Minden sor egy programtétel. Dátum + startTime kötelező. A stage hivatkozáshoz a „Színpadok" menüben kell előbb rögzíteni a helyszínt. |
| 10 | **Színpadok / helyszínek** | `stage` | 🔵 Global | A rendezvény helyszíneinek/színpadainak neve (pl. „Nagyszínpad", „Jazzkert"). | `/program/` és programtételek | Ezeket a programtételek hivatkozzák. Ha törlöd, az arra hivatkozó programtételek elveszítik a stage adatot. |
| 11 | **Fellépők** | `performer` | 🟢 Primary | Összes fellépő: név, kép, leírás, social linkek, egyedi jegy URL, tagok, műfajcímkék, sorend. | `/lineup/` oldal, programtételek linkelve | `isActive=false` → nem jelenik meg sehol. `isFeatured=true` → kiemelten jelenik meg. |
| 12 | **Fellépő címkék / műfajok** | `performerTag` | 🔵 Global | Műfaj/stílus badge-ek (pl. „Swing", „Ragtime", „Blues"). | Lineup kártyákon | Ezeket a fellépők hivatkozzák. Sorrendjük (`order`) meghatározza a badge sorrendet a kártyán. |
| 13 | **Jegyek** | `ticket` | 🔵 Global | Jegytípusok: ár, leírás, CTA, elérhetőség, főoldalon megjelenjen-e. | `/info/` oldal + főoldal boxok | Azonos a „Főoldal szerkesztés" alatti „Jegyek" listával — **ugyanaz** a dokumentumtípus. |
| 14 | **Videók (másodlagos…)** | `video` | 🟠 Másodlagos | Újrafelhasználható videó blokkok, amelyeket rugalmas szekciókon (`sectionVideo`) keresztül lehet oldalakhoz rendelni. | Rugalmas szekciókban, ahol `sectionVideo` blokk van | **Normál esetben nem kell ide menni.** Az oldalak videóját a `Page.videoUrl` mező kezeli. Ez a lista csak a rugalmas szekció videókhoz kell. Lásd: „Videó szerkesztés" szekció. |
| 15 | **Szállás** | `accommodation` | 🟢 Primary | Szálláshelyek: név, kép, ár, leírás, foglalási link, távolság, sorend. | `/szallas/` oldal | `isActive=false` → nem jelenik meg. A sorend az `order` mezőn múlik. |
| 16 | **Közlekedés** | `transportItem` | 🟢 Primary | Közlekedési módok leírása (vonat, autó, busz, stb.) és linkje. | `/terkep/` oldal | `isActive=false` → nem jelenik meg. |
| 17 | **Támogatók** | `sponsor` | 🔵 Global | Szponzorok logói, URL-jei, kategória-besorolásuk. | Footer szponzor sor | Kategória (`sponsorCategory`) szabályozza a csoportosítást és a megjelenési sorrendet. |
| 18 | **Támogatói kategóriák** | `sponsorCategory` | 🟡 Advanced | Szponzor szekciók nevei (pl. „Főtámogatók", „Partnerek"). | Footer szponzor fejléce | Ha egy kategóriát törlöd, az oda tartozó szponzorok elveszítik a kategória-hivatkozásukat. |
| 19 | **Helyszín (Venue)** | `venue` | 🟡 Advanced | A fesztiválhelyszín neve, cipme, GPS, térkép embed URL, Google Maps link, leírás, irányok felirata. | `/terkep/` oldal | Singleton — csak egy dokumentum. |

---

## 2. OLDAL-SZINTŰ SZERKESZTÉSI AUDIT

| Oldal | URL | Elsődleges Sanity szerkesztési hely | Fő szerkeszthető mezők | Kapcsolt gyűjtemények | Statikus fallback? | Megjegyzés |
|-------|-----|-------------------------------------|------------------------|----------------------|-------------------|------------|
| **Főoldal** | `/` | Főoldal szerkesztés (slug=home) | Hero cím (HU/EN), hero alcím, dátum badge, helyszín badge, statisztikák, CTA gomb szöveg/URL, CTA banner szöveg/gomb, videó URL | Fellépők (teaser), Jegyek (showOnHome), Popup | ⚠️ Igen — ha a Sanity mezők üresek, a `hu.ts`/`en.ts` kód tölti ki | A home videó URL a Page.videoUrl mezőben van, nem a „Videók" menüben |
| **Program** | `/program/` | Oldalak → program | Főcím (HU/EN), alcím, programszöveg (rich text), táblázat láthatósága (desktop/mobil), szövegláthatóság, sorrend | Program tételek, Színpadok, Fellépők | ⚠️ Igen — `c.program.*` statikus fallback | A programtételek a `Program tételek` menüben szerkesztendők, nem itt |
| **Lineup / Fellépők** | `/lineup/` | Fellépők | Név, kép, leírás, social linkek, jegy URL, tagok, műfaj, sorend, kiemelés | Fellépő címkék | ⚠️ Igen — `c.lineup.artists` fallback | Az oldalnak nincs saját `Page` dokumentuma aktívan szerkesztve |
| **Jegyek & Info** | `/info/` | Oldalak → info | FAQ elemek (jobb oszlop), intro szöveg, szekciók | Jegyek (bal oszlop listája) | ⚠️ Igen — `c.info.ticketTiers` és `c.info.faqItems` fallback | A jegyek nem az info page-en, hanem a „Jegyek" menüben szerkesztendők |
| **Szállás** | `/szallas/` | Oldalak → szallas + Szállás | Oldal hero (oldalak), szálláshelyek (szállás lista) | Szállás gyűjtemény | ⚠️ Igen — `c.accommodation` fallback | Két helyen szerkesztendő: a hero az „Oldalak" → szallas-ban, a szálláshelyek a „Szállás" menüben |
| **Térkép / Közlekedés** | `/terkep/` | Oldalak → terkep + Helyszín + Közlekedés | Oldal hero (oldalak), térkép adat (helyszín), közlekedési módok (közlekedés) | Venue singleton, TransportItem gyűjtemény | ⚠️ Igen | Három helyen szerkesztendő: oldal szöveg + venue + transport |
| **Jazztábor** | `/jazztabor/` | Jazztábor — Page (slug=jazztabor) | Eyebrow szöveg, program blokkok (lista/szöveg), szervezők, gombok (HU/EN URL), fő szöveg, második szöveg | — | ⚠️ Igen — `hu.ts` camp schedule fallback | Hozzáférhető az „Oldalak" listában is — ugyanaz a dokumentum |
| **Futás** | `/futas/` | Futás — Page (slug=futas) | Eyebrow, kártya dátum/idő/helyszín, távolságok táblázata, nevezési határidő, eredmények, gombok | — | ⚠️ Igen — `hu.ts` distance table fallback | Hozzáférhető az „Oldalak" listában is |
| **Kapcsolat** | `/contact/` | Site settings + Oldalak → contact | Kapcsolat oldal hero (oldalak), email, telefon, social linkek, önkéntes gomb URL (site settings) | Site settings | ⚠️ Igen — `c.contact` fallback | A valódi kontaktadatok a Site settings-ben vannak, nem az Oldalak-ban |
| **ÁSZF** | `/aszf/` | Oldalak → aszf | Cím, fő szöveg (rich text), rugalmas szekciók | — | ⚠️ Igen — `c.legal.terms` fallback | A jogi szöveg rich text-ben szerkeszthető |
| **Adatvédelem** | `/adatvedelem/` | Oldalak → adatvedelem | Cím, fő szöveg (rich text), rugalmas szekciók | — | ⚠️ Igen — `c.legal.privacy` fallback | |
| **Saját link-only oldal** | `/[slug]` vagy `/oldal/[slug]` | Oldalak → új oldal létrehozása | Cím (HU/EN), slug, szöveg, szekciók, SEO, noIndex, isActive | — | ❌ Nincs fallback — ha nem aktív, 404 | Ha nincs benne a navigációban, nincs linkje. Csak közvetlen URL-lel érhető el. |
| **Footer** | (minden oldal) | Navigáció (showInFooter=true) + Támogatók + Site settings | Footer navigációs linkek, szponzor logók, kontakt adatok | NavigationItem (showInFooter), Sponsor, SiteSettings | ⚠️ Statikus fallback van | A footer menü külön `showInFooter=true` navigációs elemekből áll |

---

## 3. MEZŐSZINTŰ AUDIT — FONTOS SZERKESZTŐK

### 3.1 Főoldal szerkesztő (Page, slug=home)

| Mező neve (Studio) | Hatás | Kötelező? | HU/EN? | Megjegyzés |
|--------------------|-------|-----------|--------|------------|
| **Hero főcím** (`homeHeroTitleHu/En`) | Nagy fehér főcím a hero sávban | — | ✓ | Soremelés: `\n` vagy `\|` karakter | 
| **Hero alcím / helyszín** (`homeHeroSubtitleHu/En`) | Narancs badge a hero-ban (helyszín) | — | ✓ | |
| **Hero dátum** (`homeHeroLeadHu/En`) | Kék badge a hero-ban (dátum) | — | ✓ | |
| **Elsődleges CTA szöveg** (`homePrimaryCtaTextHu/En`) | Hero gomb felirata | — | ✓ | Ha üres: kódfallback felirat |
| **Elsődleges CTA URL** (`homePrimaryCtaUrl`) | Hero gomb linkje | — | — | Ha üres: globális jegy URL (Site settings) |
| **Statisztikák** (`homeStats[]`) | A hero alatt lévő stat sor (pl. „4 Nap", „120+ Zenész") | — (min. 2 ajánlott) | ✓ | Ha < 2 elem: kódfallback stats jelenik meg |
| **CTA banner főcím** (`homeCtaBannerTitleHu/En`) | A narancs CTA banner sávban a nagy szöveg | — | ✓ | |
| **CTA banner szöveg** (`homeCtaBannerTextHu/En`) | CTA banner alcím szöveg | — | ✓ | |
| **CTA banner gomb szöveg** (`homeCtaBannerButtonTextHu/En`) | CTA banner gomb felirata | — | ✓ | |
| **CTA banner gomb URL** (`homeCtaBannerButtonUrl`) | CTA banner gomb linkje | — | — | Ha üres: globális jegy URL |
| **Videó URL** (`videoUrl`) | A főoldalon beágyazott videó linkje (YouTube/Vimeo) | — | — | Ha üres: kódfallback videó URL-t tölt be |
| **Videó cím HU/EN** (`videoTitleHu/En`) | Videó fölötti felirat | — | ✓ | Opcionális |
| **SEO** (`seo.*`) | Keresőoptimalizálás: cím, leírás, OG kép, noIndex | — | ✓ | Ha üres: kódfallback SEO adatok |

---

### 3.2 Program oldal szerkesztő (Page, slug=program)

| Mező neve | Hatás | Kötelező? | HU/EN? | Megjegyzés |
|-----------|-------|-----------|--------|------------|
| **Oldal főcím** (`titleHu/En`) | Program oldal nagy főcíme | — | ✓ | Ha üres: kódfallback cím |
| **Alcím** (`heroDescriptionRichHu/En`) | Program oldal alcíme (rich text) | — | ✓ | |
| **Programszöveg** (`programBodyRichHu/En`) | Szöveges programleírás (ha `programDisplayMode` = freeText/both) | — | ✓ | Csak akkor látszik, ha a displayMode tartalmaz szöveget |
| **Megjelenési mód** (`programDisplayMode`) | `structured` = táblázat, `freeText` = szöveg, `both` = mindkettő | — | — | Alapértelmezett: `structured` |
| **Táblázat — desktop látható** (`showProgramTableDesktop`) | Be/ki: a program-táblázat desktopon | — | — | Alapértelmezett: `true` |
| **Táblázat — mobil látható** (`showProgramTableMobile`) | Be/ki: a program-táblázat mobilon | — | — | |
| **Szöveg — desktop látható** (`showProgramTextDesktop`) | Be/ki: a szöveges leírás desktopon | — | — | |
| **Szöveg — mobil látható** (`showProgramTextMobile`) | Be/ki: a szöveges leírás mobilon | — | — | |
| **Desktop sorrend** (`desktopProgramOrder`) | Desktopon: táblázat vagy szöveg legyen-e fent? | — | — | `tableFirst` vagy `textFirst` |
| **Mobil sorrend** (`mobileProgramOrder`) | Mobilon: táblázat vagy szöveg legyen-e fent? | — | — | |
| **SEO** (`seo.*`) | Keresőoptimalizálás | — | ✓ | |

---

### 3.3 Program tétel szerkesztő (programItem)

| Mező neve | Hatás | Kötelező? | HU/EN? | Megjegyzés |
|-----------|-------|-----------|--------|------------|
| **Esemény cím** (`eventTitleHu/En`) | A főcím a program sorban | — | ✓ | Ha üres: `titleHu/En` jelenik meg, ha az is üres: fellépő neve |
| **Alternatív cím** (`titleHu/En`) | Másodlagos cím / esemény típusa | — | ✓ | Csak ha `eventTitle` üres |
| **Rövid leírás** (`descriptionRichHu/En`) | A lenyíló sorban megjelenik az esemény alatti rövid szöveg | — | ✓ | Rich text |
| **Részletes leírás** (`detailsRichHu/En`) | Az „expand" gombra megnyíló részletes szöveg | — | ✓ | Rich text |
| **Dátum** (`date`) | Az esemény napja (YYYY-MM-DD) | ✓ | — | Ezzel kerül a helyes napra |
| **Kezdési időpont** (`startTime`) | HH:MM formátum | ✓ | — | |
| **Befejezési időpont** (`endTime`) | HH:MM | — | — | Ha üres: csak a kezdési idő jelenik meg |
| **Színpad / helyszín** (`stageRef`) | Legördülő → Színpadok listából | — | — | Preferált a `stage` szöveges mezőnél |
| **Fellépők** (`performers[]`) | Melyik fellépők lépnek fel (hivatkozás a Fellépők listára) | — | — | Több is megadható |
| **Jegy URL (HU/EN)** (`ticketUrlHu/En`) | Eseményspecifikus jegyvásárlás gomb | — | ✓ | Ha üres: a fellépő egyedi URL-je, ha az is üres: globális jegy URL |
| **Aktív** (`isActive`) | `false` → nem jelenik meg a programban | — | — | Alapértelmezett: `true` |

---

### 3.4 Fellépő szerkesztő (performer)

| Mező neve | Hatás | Kötelező? | HU/EN? | Megjegyzés |
|-----------|-------|-----------|--------|------------|
| **Név** (`name`) | Fellépő/zenekar neve (nincs lokalizáció) | ✓ | — | A lineup kártyán és a programban is ez jelenik meg |
| **Kép** (`image`) | Sanity asset — a lineup kártyán | — | — | Ha üres: `imagePath` legacy fallback; ha az is üres: `cardBackgroundVariant` szín |
| **Rövid leírás** (`shortDescriptionRichHu/En`) | Kártya alcím szöveg (nem műfaj badge!) | — | ✓ | Rich text |
| **Bio** (`bioRichHu/En`) | Részletes bemutató (modálban/kibontva) | — | ✓ | Rich text |
| **Tagok** (`members[]`) | Zenekari tagok nevei, szerepei, hangszerei, országa | — | ✓ | Több sor |
| **Műfaj/stílus** (`tags[]`) | Hivatkozás a Fellépő címkékre → badge a kártyán | — | — | |
| **Website URL** (`websiteUrl`) | Link a kártyán | — | — | |
| **Facebook / Instagram / YouTube / Spotify** | Social ikonok a kártyán | — | — | |
| **Egyedi jegy URL (HU/EN)** (`ticketUrlHu/En`) | Ha van: ez a gomb URL; ha nincs: globális URL | — | ✓ | |
| **Kártya háttér variáns** (`cardBackgroundVariant`) | Ha nincs kép: milyen szín legyen? (`navbar`/`default`/`accent`) | — | — | |
| **Sorend** (`order`) | A lineup oldalon megjelenési sorrend | — | — | Kisebb szám = előrébb |
| **Kiemelt** (`isFeatured`) | `true` → kiemelten jelenik meg | — | — | |
| **Aktív** (`isActive`) | `false` → nem jelenik meg sehol | — | — | |

---

### 3.5 Jegy szerkesztő (ticket)

| Mező neve | Hatás | Kötelező? | HU/EN? | Megjegyzés |
|-----------|-------|-----------|--------|------------|
| **Jegy neve** (`nameHu` / `nameEn`) | A kártyán megjelenő jegy neve | ✓ (HU) | ✓ | EN üres → HU fallback |
| **Leírás (rich text)** (`descriptionRichHu/En`) | /info/ oldalon a részletes leírás | — | ✓ | Preferált a plain text mezőnél |
| **Ár** (`price`) | A kártyán megjelenő ár (pl. „24 900") | ✓ | — | Pénznem: `currency` (alapérték: HUF) |
| **Jegy vásárlás URL (HU/EN)** (`ticketUrlHu/En`) | Vásárlás gomb linkje | — | ✓ | |
| **CTA gomb szöveg (HU/EN)** (`ctaTextHu/En`) | Gomb szöveg; ha üres: default felirat | — | ✓ | |
| **CTA URL** (`ctaUrl`) | Ha meg van adva: ez felülírja a jegy URL-t | — | — | |
| **Badge (HU/EN)** (`badgeHu/En`) | Kiemelő badge (pl. „FAVORIT", „LIMITED") | — | ✓ | |
| **Elérhető** (`isAvailable`) | `false` → „nem elérhető" jelölés | — | — | Alapértelmezett: `true` |
| **Rejtett** (`isHidden`) | `true` → sem /info/, sem főoldalon nem jelenik meg | — | — | |
| **Főoldalon megjelenik** (`showOnHome`) | `true` → főoldal narancs jegy-boxaiban jelenik meg | — | — | |
| **Főoldali sorrend** (`homeOrder`) | A főoldalon hányadik helyen jelenik meg | — | — | Kisebb szám = előrébb |
| **Info oldal sorrend** (`order`) | Az /info/ oldalon megjelenési sorrend | — | — | |

---

### 3.6 Szállás szerkesztő (accommodation)

| Mező neve | Hatás | Kötelező? | HU/EN? | Megjegyzés |
|-----------|-------|-----------|--------|------------|
| **Név** (`name`) | Szálláshely neve | ✓ | — | |
| **Kép** (`image`) | Sanity asset | — | — | Ha üres: `imagePath` fallback |
| **Rövid leírás** (`descriptionRichHu/En`) | Kártya szöveg | — | ✓ | |
| **Részletes leírás** (`bodyRichHu/En`) | Kibontott/részletes leírás | — | ✓ | |
| **Ár** (`priceHu/En`) | Pl. „19 950 Ft/fő/éjtől" | — | ✓ | |
| **Csillagok** (`stars`) | 0–4 értékelés | — | — | |
| **Foglalás URL** (`bookingUrl`) / **Website URL** (`websiteUrl`) | Linkek | — | — | |
| **Foglalás gomb szöveg** (`bookingLabelHu/En`) | Alapértelmezett: „Foglalás" / „Book" | — | ✓ | |
| **Távolság** (`distanceHu/En`) | Pl. „5 perc sétára" | — | ✓ | |
| **Sorend** (`order`) | Megjelenési sorrend | — | — | |
| **Aktív** (`isActive`) | `false` → nem jelenik meg | — | — | |

---

### 3.7 Oldal szerkesztő — általános (page)

| Mező neve | Hatás | Érintett oldalak | HU/EN? | Megjegyzés |
|-----------|-------|-----------------|--------|------------|
| **Főcím** (`titleHu/En`) | Az oldal nagy fejléc szövege | Minden oldal | ✓ | Program oldalon ez a „Program" cím |
| **Alcím** (`heroDescriptionRichHu/En`) | Fejléc alatti szöveg | Minden oldal | ✓ | Rich text |
| **Intro szöveg** (`introNoteRichHu/En`) | Kiemelt doboz a tartalom elején | szállás, térkép | ✓ | Csak bizonyos oldalakon jelenik meg |
| **Fő szöveg** (`pageBodyRichHu/En`) | Az oldal fő tartalma | Minden nem-speciális oldal | ✓ | Rich text |
| **Második szöveg** (`pageBody2RichHu/En`) | Opcionális második szövegblokk | futás, jazztábor | ✓ | Csak ha `showSecondBody=true` |
| **Videó URL** (`videoUrl`) | Oldal-specifikus beágyazott videó | Minden oldal | — | Ha üres: nem jelenik meg videó (kivétel: főoldal, jazztábor, ahol kódfallback van) |
| **Videó cím** (`videoTitleHu/En`) | Videó fölötti felirat | — | ✓ | Opcionális |
| **Elsődleges gomb** (`primaryButtonLabelHu/En`, `primaryButtonUrlHu/En`) | Nagy narancs gomb | futás, jazztábor | ✓ | Ha üres: nem jelenik meg gomb |
| **Másodlagos gomb** (`secondaryButtonLabelHu/En`, `secondaryButtonUrlHu/En`) | Opcionális második gomb | futás, jazztábor | ✓ | |
| **FAQ elemek** (`infoFaqItems[]`) | Kérdés-válasz lista | info oldal | ✓ | |
| **Rugalmas szekciók** (`sections[]`) | Tetszőleges tartalomblokkok (szöveg, videó, kép, gomb, galéria, spacer) | Minden oldal | ✓ | Részletek: 3.11 szekció |
| **SEO** (`seo.*`) | Cím, leírás, OG kép, canonical, noIndex | Minden oldal | ✓ | |
| **Aktív** (`isActive`) | `false` → 404 a `/slug` és `/oldal/slug` útvonalakon | Saját oldalak | — | A fix útvonalakat (program, lineup, stb.) NEM érinti |
| **Slug** (`slug`) | Az URL útvonal neve | Minden oldal | — | ⚠️ Megváltoztatása az URL-t is megváltoztatja → törhet linkeket |

---

### 3.8 Navigáció szerkesztő (navigationItem)

| Mező neve | Hatás | Kötelező? | HU/EN? | Megjegyzés |
|-----------|-------|-----------|--------|------------|
| **Felirat (HU)** (`labelHu`) | Menüpont szövege magyarul | ✓ | — | |
| **Felirat (EN)** (`labelEn`) | Menüpont szövege angolul | — | — | Ha üres: az EN menüben NEM jelenik meg ez a pont |
| **Oldal hivatkozás** (`page`) | Belső oldal linkje (Sanity `page` dokument) | — | — | Ha meg van adva: URL automatikusan épül |
| **Kézi útvonal** (`href`) | Pl. `/lineup/` — ha nincs oldal-hivatkozás | — | — | Csak ha `page` üres |
| **Külső URL** (`externalUrl`) | Pl. `https://jegyek.hu/...` | — | — | Új lapon nyílik meg |
| **Sorend** (`order`) | A menüben hányadik helyen van | ✓ | — | Kisebb szám = előrébb |
| **Aktív** (`isActive`) | `false` → nem jelenik meg | — | — | |
| **Fejlécben látható** (`showInHeader`) | `true` → desktop/mobil fejléc menüben | — | — | Alapértelmezett: `true` |
| **Footerben látható** (`showInFooter`) | `true` → footer navigációban | — | — | Alapértelmezett: `false` |

---

### 3.9 Site settings szerkesztő (siteSettings, singleton)

| Mező neve | Hatás | Megjelenik hol? | Megjegyzés |
|-----------|-------|-----------------|------------|
| **Globális jegy URL (HU/EN)** (`ticketUrlHu/En`) | Ha egy oldal/gomb/fellépő nem ad meg saját URL-t, ez a fallback | Minden jegyvásárlás gomb | Legfontosabb mező |
| **Szervező neve** (`organizationName`) | Kontakt oldal, footer, schema.org | | |
| **Email** (`contactEmail`) | Kontakt oldal | | |
| **Telefon** (`contactPhone`) | Kontakt oldal | | |
| **Facebook / Instagram / YouTube URL** | Kontakt oldal, social ikonok | | |
| **Festival dátumok** (`festivalStartDate/End`) | Schema.org, SEO | | Nincs közvetlen megjelenítés a hero-ban; azt a `homeHeroLeadHu/En` mező kezeli |
| **Önkéntes gomb szöveg** (`volunteerButtonLabelHu/En`) | Kontakt oldal gombja | | |
| **Önkéntes URL** (`volunteerUrl`) | Kontakt oldal gombja | | |
| **Házirendpdf link** (`houseRulesPdf`) | Kontakt oldal link | | Pl. `/docs/hazirend.pdf` |
| **SEO** (`seo.*`) | Globális SEO fallback | Ha egy oldalnak nincs saját SEO-ja | |

---

### 3.10 Rugalmas szekciók (sections[]) — Oldalakban

Minden `Page` dokumentumhoz hozzáadhatók rugalmas szekciók. Ezek az oldal törzse után jelennek meg.

| Szekció típus | Mit ad hozzá? | Mezők | Megjegyzés |
|---------------|--------------|-------|------------|
| **Szöveges szekció** (`sectionRichText`) | Szabad szöveges tartalom | Cím (HU/EN), szövegtörzs (rich text, HU/EN), `enabled` | |
| **Szövegdoboz** (`sectionTextBox`) | Stilizált szövegdoboz | Cím, szövegtörzs (HU/EN), variáns (`default`/`highlight`/`muted`), `enabled` | |
| **Videó** (`sectionVideo`) | Beágyazott videó egy videó-hivatkozáson keresztül | Cím override (HU/EN), videó hivatkozás (`videoRef` → Videók lista), `enabled` | ⚠️ Ehhez először a „Videók" menüben kell létrehozni a videót |
| **Gomb** (`sectionButton`) | Önálló CTA gomb | Felirat (HU/EN), URL, stílus (`primary`/`secondary`/`link`), `enabled` | |
| **Kép** (`sectionImage`) | Egyetlen kép | Kép (Sanity asset), cím (HU/EN), képaláírás (HU/EN), `enabled` | |
| **Galéria** (`sectionGallery`) | Több képes galéria | Cím (HU/EN), képek (min. 1, alt szöveg per kép, HU/EN), `enabled` | |
| **Spacer / elválasztó** (`sectionSpacer`) | Üres szóköz vagy vonal | Méret (`sm`/`md`/`lg`/`xl`), `showDivider`, `enabled` | |

---

### 3.11 Videók szerkesztő (video) — Másodlagos

> ⚠️ **Normál esetben nem kell ide menni.** Lásd „Videó szerkesztés" szekció.

| Mező neve | Hatás | HU/EN? | Megjegyzés |
|-----------|-------|--------|------------|
| **Cím** (`titleHu/En`) | A videó blokk felirata | ✓ | |
| **Videó URL** (`videoUrl`) | YouTube / Vimeo / közvetlen link | — | A videó forráscím |
| **Beágyazva van** (`enabled`) | `false` → nem jelenik meg sehol | — | |
| **Méret** (`size`) | `small`/`medium`/`large`/`full` | — | |
| **Thumbnaillkép** (`thumbnail`) | Előnézeti kép; ha üres: YouTube automatikusan | — | |
| **CTA szöveg/URL** (`ctaTextHu/En`, `ctaUrl`) | Opcionális gomb a videón | ✓ | |
| **Oldalak hivatkozás** (`displayOnPages[]`) | Infó mező — nem vezérel megjelenítést | — | Csak belső adminisztrációs célokra |

---

## 4. REUSED CONTENT — EGYSZER SZERKESZD, TÖBB HELYEN JELENIK MEG

| Gyűjtemény | Hol szerkeszd | Hol jelenik meg | Főoldali láthatóság | Sorend |
|-----------|---------------|-----------------|---------------------|--------|
| **Jegyek** | Jegyek menü | `/info/` oldal (összes látható jegy) + főoldal narancs boxok (`showOnHome=true`) | `showOnHome=true` + `isHidden=false` + `isAvailable=true` | Főoldalon: `homeOrder`; info oldalon: `order` |
| **Fellépők** | Fellépők menü | `/lineup/` oldal, programtételek nevei | `isActive=true`, sorrend: `isFeatured` → `order` → névsor | `order` mező |
| **Szponzorok** | Támogatók menü | Footer szponzor sáv | `isActive=true` | `order` mező kategórián belül |
| **Navigáció** | Navigáció / Menü | Fejléc + footer (külön `showInHeader`/`showInFooter` jelzők) | `isActive=true` + megfelelő jelző | `order` mező |
| **Site settings** | Site settings menü | Kontakt oldal, footer, globális jegy URL fallback, schema.org | — | Singleton, nincs sorrend |
| **Fellépő címkék** | Fellépő címkék menü | Lineup kártyákon műfaj badge | `isActive=true` | `order` mező |
| **Szálláshelyek** | Szállás menü | `/szallas/` oldal | `isActive=true` | `order` mező |
| **Programtételek** | Program tételek menü | `/program/` táblázat | `isActive=true` | `date` + `order` kombináció |
| **Színpadok** | Színpadok menü | Programtételek legördülőjében + program táblázatban | `isActive=true` | `order` mező |
| **Venue** | Helyszín menü | `/terkep/` oldal | — | Singleton |
| **Transport** | Közlekedés menü | `/terkep/` oldal | `isActive=true` | `order` mező |

---

## 5. POTENCIÁLISAN ZAVARÓ VAGY DUPLIKÁLT SZERKESZTÉSI ÚTVONALAK

### 5.1 Videók — Globális vs. oldal-specifikus

**Probléma:** Két helyen van videó beállítás:
- `Page.videoUrl` — az oldal saját videó URL mezője (minden `Page` dokumentumban)
- `Videók` menü (`video` schema) — egy külön videó-gyűjtemény

**Melyik a helyes?**

| Eset | Helyes szerkesztési hely |
|------|--------------------------|
| Főoldal videó cserélése | Főoldal szerkesztés → `videoUrl` mező |
| Jazztábor oldal videó cserélése | Jazztábor — Page → `videoUrl` mező |
| Bármely `Page` videójának cserélése | Oldalak → adott slug → `videoUrl` mező |
| Rugalmas szekció videó hozzáadása | ELŐSZÖR: Videók menü → új videó dokument; AZTÁN: az oldalon → Szekciók → `sectionVideo` → hivatkozz rá |

**A „Videók" menü** egy másodlagos eszköz, amelyet csak a `sectionVideo` típusú rugalmas szekciók használnak. **Normál oldal-videó cseréhez ne használd.**

---

### 5.2 Főoldal Page dokument vs. Jegyek gyűjtemény

**Probléma:** A főoldal jegyek nem az Oldalak → home dokumentumban, hanem a Jegyek gyűjteményben szerkeszthetők.

| Mit akarok csinálni? | Helyes szerkesztési hely |
|---------------------|--------------------------|
| Főoldal CTA gomb szövegét/URL-jét cserélni | Főoldal szerkesztés → `homePrimaryCtaText*` / `homePrimaryCtaUrl` |
| Főoldalon megjelenő jegydoboz tartalmát módosítani | Jegyek menü → az adott jegy → `showOnHome`, `homeOrder`, ár, leírás módosítása |
| Egy jegyet eltüntetni a főoldalról | Jegyek → jegy → `showOnHome=false` VAGY `isHidden=true` |

---

### 5.3 Jazztábor — Két belépési pont

**Probléma:** A jazztábor tartalma elérhető:
- „Jazztábor — Page" menüponton keresztül
- „Oldalak" listán belül is (jazz tabor slug)

**Ez szándékos kényelmi megoldás** — mindkét helyen ugyanazt a dokumentumot szerkesztjük. Nincs duplikáció.

---

### 5.4 Futás — Két belépési pont

**Ugyanaz mint 5.3** — a „Futás — Page" és az „Oldalak → futas" ugyanaz a dokumentum. Szándékos kényelmi megoldás.

---

### 5.5 Navigáció vs. Page dokumentum

**Probléma:** Ha valaki azt hiszi, hogy a menüben megjelenő linket az Oldalak szerkesztésével lehet módosítani.

**Helyes megértés:**
- Az **oldal tartalma** (szöveg, kép, szekciók) → Oldalak menüben szerkeszthető
- Az **oldal felirata a menüben és a sorrend** → Navigáció / Menü menüben szerkeszthető
- Ha egy oldalt nem akarsz a menüben mutatni: Navigáció → adott menüpont → `isActive=false` VAGY töröld a menüpontot
- Ha egy oldalt teljesen le akarsz tiltani: Oldalak → adott oldal → `isActive=false`

---

### 5.6 Jegyek az info oldalon vs. a főoldalon

**Egy jegy kétfelé nézhet ki különbözően:**
- `/info/` oldalon: összes látható jegy, az `order` mező alapján rendezve, részletes leírással
- Főoldalon: csak a `showOnHome=true` jegyek, a `homeOrder` alapján rendezve, rövidített megjelenítéssel

**Hibalehetőség:** Ha módosítasz egy jegy árát, az automatikusan frissül mindkét helyen — ez szándékos és helyes.

---

### 5.7 Program oldal beállítások vs. Programtételek

**Program oldal beállítások** (Oldalak → program):
- Főcím, alcím, megjelenési mód (`structured`/`freeText`/`both`), szöveges tartalom, láthatósági kapcsolók — ezek az oldal **keretét** befolyásolják

**Program tételek** (Program tételek menü):
- Az egyes események: dátum, idő, fellépők, leírás — ezek az oldal **tartalmát** töltik ki

Ha a program tábla üres, ellenőrizd mindkét helyet: van-e aktív programtétel, és a Page `programDisplayMode` nem `freeText`-re van-e állítva.

---

## 6. HARDCODED / FALLBACK AUDIT

| Látható tartalom | Aktuális forrás | Sanity elsődleges? | Statikus fallback | Szerkesztheti az ügyfél? | Javítás szükséges? |
|-----------------|-----------------|-------------------|-------------------|--------------------------|-------------------|
| **Főoldal hero cím** | Sanity `homeHeroTitleHu/En` | ✅ SANITY PRIMARY | ⚠️ + STATIC FALLBACK (`hu.ts home.heroTitle`) | ✅ Igen | Nem |
| **Főoldal statisztikák** | Sanity `homeStats[]` | ✅ SANITY PRIMARY | ⚠️ + STATIC FALLBACK (ha < 2 elem) | ✅ Igen | Nem |
| **Főoldal CTA gomb** | Sanity `homePrimaryCtaText*` + `homePrimaryCtaUrl` | ✅ SANITY PRIMARY | ⚠️ + STATIC FALLBACK (site settings jegy URL) | ✅ Igen | Nem |
| **Főoldal CTA banner** | Sanity `homeCtaBanner*` | ✅ SANITY PRIMARY | ⚠️ + STATIC FALLBACK (`hu.ts home.ctaBanner`) | ✅ Igen | Nem |
| **Főoldal videó** | Sanity `Page.videoUrl` (slug=home) | ✅ SANITY PRIMARY | ⚠️ + STATIC FALLBACK (`hu.ts home.videoUrl`) | ✅ Igen | Nem |
| **Főoldal jegyboxok** | Sanity `ticket` (showOnHome=true) | ✅ SANITY PRIMARY | ⚠️ Statikus fallback boxok ha Sanity üres | ✅ Igen | Nem |
| **Navigáció** | Sanity `navigationItem` | ✅ SANITY PRIMARY | ⚠️ + STATIC FALLBACK (`hu.ts nav`) | ✅ Igen | Nem |
| **Footer szponzorok** | Sanity `sponsor` + `sponsorCategory` | ✅ SANITY PRIMARY | ⚠️ + STATIC FALLBACK | ✅ Igen | Nem |
| **Program szöveg** | Sanity `Page.programBodyRich*` | ✅ SANITY PRIMARY | ⚠️ + STATIC FALLBACK | ✅ Igen | Nem |
| **Program táblázat** | Sanity `programItem` | ✅ SANITY PRIMARY | ⚠️ + STATIC FALLBACK (`hu.ts program.days`) | ✅ Igen | Nem |
| **Fellépő kártyák** | Sanity `performer` | ✅ SANITY PRIMARY | ⚠️ + STATIC FALLBACK (`hu.ts lineup.artists`) | ✅ Igen | Nem |
| **Jegyek oldal** | Sanity `ticket` | ✅ SANITY PRIMARY | ⚠️ + STATIC FALLBACK (`hu.ts info.ticketTiers`) | ✅ Igen | Nem |
| **Szálláshelyek** | Sanity `accommodation` | ✅ SANITY PRIMARY | ⚠️ + STATIC FALLBACK (`hu.ts accommodation`) | ✅ Igen | Nem |
| **Térkép / helyszín** | Sanity `venue` | ✅ SANITY PRIMARY | ⚠️ + STATIC FALLBACK (hardcoded GPS) | ✅ Igen | Nem |
| **Közlekedés** | Sanity `transportItem` | ✅ SANITY PRIMARY | ⚠️ + STATIC FALLBACK (`hu.ts map.directions`) | ✅ Igen | Nem |
| **Kapcsolat adatok** | Sanity `siteSettings` | ✅ SANITY PRIMARY | ⚠️ + STATIC FALLBACK (`hu.ts contact`) | ✅ Igen | Nem |
| **Jazztábor program** | Sanity `Page` camp* mezők | ✅ SANITY PRIMARY | ⚠️ + STATIC FALLBACK (`hu.ts BASE.schedules`) | ✅ Igen | Nem |
| **Futás oldal adatok** | Sanity `Page` running* mezők | ✅ SANITY PRIMARY | ⚠️ + STATIC FALLBACK (`hu.ts` distance table) | ✅ Igen | Nem |
| **ÁSZF szöveg** | Sanity `Page.pageBodyRich*` | ✅ SANITY PRIMARY | ⚠️ + STATIC FALLBACK (`hu.ts legal.terms`) | ✅ Igen | Nem |
| **Adatvédelem szöveg** | Sanity `Page.pageBodyRich*` | ✅ SANITY PRIMARY | ⚠️ + STATIC FALLBACK (`hu.ts legal.privacy`) | ✅ Igen | Nem |
| **Rugalmas szekciók** | Sanity `Page.sections[]` | ✅ SANITY PRIMARY | ❌ Nincs fallback (ha üres: nem jelenik meg) | ✅ Igen | Nem |
| **FAQ elemek (info)** | Sanity `Page.infoFaqItems[]` | ✅ SANITY PRIMARY | ⚠️ + STATIC FALLBACK (`hu.ts info.faqItems`) | ✅ Igen | Nem |
| **Popup** | Sanity `popupSettings` | ✅ SANITY PRIMARY | ⚠️ + STATIC FALLBACK (legacy kód kép) | ✅ Igen | Nem |
| **Day accent colors** (program kártyák fejléc-színei) | ❌ Hardcoded (sárga, kék, zöld, piros) | ❌ HARDCODED | ❌ Hardcoded | ❌ Nem | Elfogadható |
| **Stage badge szín logika** (`isMainStage`) | ❌ Hardcoded heurisztika (nagys/main/fő) | ❌ HARDCODED | — | ❌ Nem | Elfogadható (stage típus mező fejlesztéssel javítható) |
| **Schema.org MusicEvent** | ❌ Hardcoded strukturált adat | ❌ HARDCODED | — | ❌ Nem | Elfogadható |

---

## 7. REJTETT OLDALAK / NOINDEX / NYELVVISELKEDÉS

### 7.1 Mi történik, ha egy oldal aktív, de nincs a navigációban?

- Az oldal **elérhető a közvetlen URL-en** (`/slug` vagy `/oldal/slug`)
- Nincs automatikusan linkje a site-on — a látogató csak a közvetlen linket megkapva találja meg
- SEO indexálás történik (hacsak `noIndex=true` nincs beállítva)
- **Hasznos eset:** Link-only privát oldalak (pl. zárt regisztrációs lap, sajtósarok)

### 7.2 Melyik URL helyes: `/slug` vagy `/oldal/slug`?

- **`/slug` a kanonikus (helyes) URL** — ez jelenik meg a sitemapban és a Google-ban
- `/oldal/slug` → a middleware **automatikusan 308 átirányít** `/slug`-ra
- Régi linkekben `oldal/slug` formátum is működik, de az újakat mindig `/slug` formában adj meg

### 7.3 Mi történik, ha `noIndex=true`?

- Az oldal `<meta name="robots" content="noindex,nofollow">` meta taget kap
- Kikerül a sitemapból → Google nem indexálja
- Az oldal **ettől még látható** a közvetlen URL-en — csak a keresőkből van kizárva

### 7.4 Mi történik, ha `isActive=false`?

- A `/slug` és `/oldal/slug` útvonalakon **404-et ad** vissza
- A **fix útvonalakat NEM érinti** (program, lineup, info, szallas, terkep, contact, futas, jazztabor, aszf, adatvedelem) — azok soha nem 404-olnak isActive-tól
- Hasznos: egy saját oldalt ideiglenesen le lehet venni anélkül, hogy törlöd

### 7.5 Mi történik, ha csak HU mezők vannak kitöltve?

- HU builden: megjelenik a HU tartalom ✅
- EN builden: az oldal `availableInLocale=false` → **404-et ad** vissza EN-en
- **Következmény:** Ha egy saját oldalt csak HU-ra töltesz ki, angol látogató 404-ot lát

### 7.6 Mi történik, ha csak EN mezők vannak kitöltve?

- EN builden: megjelenik az EN tartalom ✅
- HU builden: az oldal `availableInLocale=false` → **404-et ad** vissza HU-n
- **Következmény:** Fordítva ugyanaz — csak EN oldalt csak angolok érnek el

### 7.7 Mi történik, ha mind HU, mind EN mezők ki vannak töltve?

- HU builden: HU tartalom jelenik meg ✅
- EN builden: EN tartalom jelenik meg ✅
- Ez az ideális kétnyelvű állapot

### 7.8 Hogyan hozz létre link-only / privát oldalt?

1. Oldalak → „+ Új dokumentum" → `page` típus
2. Add meg a slug-ot (pl. `sajto`, `sajtosarok`, `regisztracio`)
3. Töltsd ki a szükséges tartalmat
4. **NE add hozzá a Navigáció menühöz** → nem jelenik meg a főmenüben
5. Ha nem kell keresőkbe: `seo.noIndex = true`
6. Az oldal elérhető: `https://bohemjazz.netlify.app/sajto` (vagy az éles domainről)
7. Ezt a linket megoszthatod sajtósokkal, partnerekkel stb.

**Fontos:** A `/oldal/slug` forma is működik, de a kanonikus URL `/slug`.

---

## 8. VIDEÓ SZERKESZTÉS — RÉSZLETES MAGYARÁZAT

### 8.1 A két videó-szerkesztési út

**1. út — Oldal-specifikus videó (normál eset):**
- Minden `Page` dokumentumnak van `videoUrl` mezője
- Ide a YouTube/Vimeo videó közvetlen linkje kerül
- Ez az egyszerű, ajánlott módszer

**2. út — Globális Videók gyűjtemény (másodlagos):**
- A „Videók (másodlagos...)" menüpontban külön videó-dokumentumok hozhatók létre
- Ezek **kizárólag** a rugalmas szekciók `sectionVideo` típusú blokkjaiban használhatók
- Normál oldal-videóhoz **NEM szükséges** ide menni

### 8.2 Melyik oldalon van oldal-specifikus `videoUrl`?

| Oldal | Van `Page.videoUrl`? | Statikus fallback? | Megjegyzés |
|-------|---------------------|-------------------|------------|
| Főoldal (slug=home) | ✅ Igen | ⚠️ Igen (`hu.ts home.videoUrl`) | Ha üres: kódfallback videót tölt be |
| Jazztábor (slug=jazztabor) | ✅ Igen | ⚠️ Igen (kódfallback) | Ha üres: kódfallback videót tölt be |
| Program (slug=program) | ✅ Igen | ❌ Nem | Ha üres: nincs videó a program oldalon |
| Lineup (slug=lineup) | ✅ Igen | ❌ Nem | Ha üres: nincs videó |
| Info (slug=info) | ✅ Igen | ❌ Nem | Ha üres: nincs videó |
| Szállás (slug=szallas) | ✅ Igen | ❌ Nem | Ha üres: nincs videó |
| Terkep (slug=terkep) | ✅ Igen | ❌ Nem | Ha üres: nincs videó |
| Futás (slug=futas) | ✅ Igen | ❌ Nem | Ha üres: nincs videó |
| Kontakt (slug=contact) | ✅ Igen | ❌ Nem | Ha üres: nincs videó |
| ÁSZF, Adatvédelem | ✅ Igen | ❌ Nem | Ha üres: nincs videó |
| Saját oldalak (`/slug`) | ✅ Igen | ❌ Nem | Ha üres: nincs videó |

### 8.3 Hogyan csináld normál esetben?

**Videó cseréje a főoldalon:**
1. Studio → Főoldal szerkesztés
2. `videoUrl` mező → bemásolod az új YouTube linket
3. Publikálod → a főoldalon automatikusan frissül

**Videó eltüntetése:**
1. Az adott Page dokumentum → `videoUrl` mező törlése
2. Ha van statikus fallback (főoldal, jazztábor): a kód egy hardcoded videót tölt be (ezt csak fejlesztő tudja megváltoztatni)

**Videó egy saját oldalon (rugalmas szekció):**
1. Studio → Videók menü → Új dokumentum → URL, cím, méret megadása → Publikálás
2. Studio → Oldalak → az adott oldal → Szekciók → + hozzáadás → `sectionVideo` → hivatkozz az imént létrehozott videóra
3. Publikálás

### 8.4 Összefoglalás — videó döntési fa

```
Cserélni akarom egy oldal videóját?
  → Az oldal Page dokumentumban `videoUrl` mezőt írd felül. KÉSZ.

Egy saját oldalon videó szekciót akarok hozzáadni?
  → 1. Videók menü → új videó dokumentum → URL + beállítások → Publikálás
  → 2. Oldalak → adott oldal → Szekciók → sectionVideo → hivatkozd be. KÉSZ.

A "Videók (másodlagos)" menü egyéb esetben NEM szükséges.
```

---

## 9. TECHNIKAI MEGJEGYZÉSEK A VÉGLEGES ÚTMUTATÓHOZ

### 9.1 Mező-szintű kiegészítések, amelyek az útmutatóban szerepeljenek

- **`enabled` jelzők** a szekciókon: ha ki van kapcsolva, az adott blokk nem jelenik meg az oldalon — de az adatok megmaradnak
- **`isActive` vs `isHidden`:** A performer/programtétel `isActive=false` → eltűnik a site-ról de megmarad az adatbázisban. A jegy `isHidden=true` → szintén eltűnik de az ár és adat megmarad.
- **Locale availability:** Az összes HU/EN mező esetén: ha az EN mező üres, **nem jelenik meg az EN builden**. Ez szándékos, strict viselkedés — nincs automatikus HU→EN fallback az oldal tartalomra.
- **Slug-ok:** A `program`, `lineup`, `info`, `szallas`, `terkep`, `contact`, `futas`, `jazztabor`, `aszf`, `adatvedelem` slugokat **NE módosítsd** — ezek fix útvonalak, megváltoztatásuk 404-ot okoz.

### 9.2 Mi van a `hu.ts`/`en.ts` fájlokban? (Statikus fallback réteg)

Ezeket az ügyfél **nem szerkesztheti Sanity-ből** — kizárólag fejlesztő módosíthatja:

- `meta.siteTitle`, `meta.siteDescription` (ha Sanity siteSettings üres)
- `home.heroTitle`, `home.videoUrl` (ha Sanity Page home mezők üresek)
- `lineup.artists` (ha nincs Sanity performer)
- `program.days[]` (ha nincs Sanity programtétel)
- `info.ticketTiers` (ha nincs Sanity jegy)
- `accommodation` (ha nincs Sanity szállás)
- `map.gps`, `map.directions` (ha nincs Sanity venue/transport)
- `legal.terms`, `legal.privacy` (ha nincs Sanity page aszf/adatvedelem)

**Praktikus tanács az útmutatóban:** Ha valami nem változik Sanity-ben, és az ügyfél szerkesztett valamit, de a változás nem jelent meg — valószínűleg üres Sanity mező + statikus fallback a probléma. A fallback felülírásához ki kell tölteni a megfelelő Sanity mezőt.

---

## 10. AJÁNLÁS A VÉGLEGES HTML ÚTMUTATÓ FELÉPÍTÉSÉHEZ

A következő szekciókkal javasolt az útmutató elkészítése:

```
1. Gyors kezdés (Quick start)
   — A 3 leggyakrabban használt szerkesztési pont
   — A legfontosabb rule: minden más pont részletezi

2. Színkód-jelmagyarázat
   — 🟢 Normál szerkesztés
   — 🔵 Több helyen jelenik meg
   — 🟡 Ritkán szükséges
   — 🟠 Általában ne nyúlj hozzá
   — 🔴 Kockázatos — kérd fejlesztői segítséget

3. A Sanity oldalsáv magyarázata
   — Minden menüpont egyszerű leírása (mit csinál, mire vigyázz)
   — Screenshot-alapú, vizuális

4. Mit szerkessz hol
   — Egy kártyás összefoglaló: "Főoldal hero cím változtatása" → Főoldal szerkesztés → X mező
   — "Jegy ár módosítása" → Jegyek → adott jegy → ár mező
   — "Új szállás hozzáadása" stb.

5. Főoldal szerkesztése
   — Hero, statisztikák, CTA banner, videó, popup

6. Program szerkesztése
   — Programtételek (dátum, idő, fellépő, helyszín)
   — Program oldal beállítások (táblázat/szöveg kapcsolók)

7. Jegyek szerkesztése
   — Ár, leírás, elérhetőség, főoldalon megjelenjen-e

8. Fellépők szerkesztése
   — Kép, leírás, social linkek, sorend, kiemelés

9. Szállás szerkesztése
   — Kártyák, ár, foglalás link

10. Kapcsolat
    — Site settings: email, telefon, social, önkéntes gomb

11. Jogi oldalak (ÁSZF, Adatvédelem)
    — Rich text szerkesztés, rugalmas szekciók

12. Link-only / rejtett oldalak
    — Hogyan hozz létre és tedd el a navigációtól

13. Nyelvi viselkedés
    — HU/EN mezők, mi jelenik meg, ha valamelyik üres
    — 404 viselkedés EN builden HU-only tartalomra

14. Videók
    — Döntési fa: mikor melyik mezőt kell használni

15. SEO és noIndex
    — Mikor és mire való

16. Tipikus hibák és megoldásaik
    — „Módosítottam, de nem változott" → statikus fallback magyarázata
    — „Angol oldalon 404" → locale availability
    — „Nem látom a menüben" → navigationItem isActive
    — „A program táblázat üres" → programDisplayMode beállítás
    — „A jegy nem jelenik meg a főoldalon" → showOnHome jelző

17. Publikálás előtti ellenőrzőlista
    — Kötelező mezők kitöltve?
    — Locale-specific mezők (HU/EN) mindkét nyelven?
    — isActive=true?
    — noIndex ki van-e kapcsolva?
    — Slug nem ütközik fix útvonallal?
```

---

## 11. QA

```
npm run lint       → ✅ (audit-only, nem változott kód)
npm run build      → ✅ (előző build sikeres volt, audit nem érintett kódfájlt)
```

Ez az audit csak a `SANITY_EDITABILITY_AUDIT.md` fájlt hozta létre, kódmódosítás nem történt.

---

*Audit elkészítve: 2026-06-05 | Forrás: valódi repo kód (schemas, queries, content helpers, page components) | Verzió: 1.0*
