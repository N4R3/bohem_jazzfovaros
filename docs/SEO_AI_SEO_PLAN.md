# SEO + AI SEO terv (Bohém Jazzfőváros / Jazz Capital)

Ez a terv a jelenlegi Next.js oldal SEO és AI kereső-optimalizálási alapozása.  
Cél: Google indexelhetőség + AI keresők (ChatGPT, Perplexity, Gemini) jobb értelmezhetősége + Sanity előkészítés.

---

## 1. Célkulcsszavak

## Magyar
- Bohém Jazzfőváros
- Jazzfőváros Kecskemét
- jazzfesztivál Kecskemét
- jazz fesztivál 2026
- Kecskemét Domb Beach program
- jazz programok Kecskemét
- jazz tábor Kecskemét
- jazz futás Kecskemét

## Angol
- Jazz Capital Kecskemét
- jazz festival Hungary
- jazz festival Kecskemét
- Bohém Jazz Capital
- jazz events Hungary 2026
- Domb Beach Kecskemét
- jazz camp Hungary

---

## 2. Oldalanként javasolt title / description

- `/`  
  - HU title: Bohém Jazzfőváros 2026 – Kecskemét, Domb Beach  
  - EN title: Bohém Jazz Capital 2026 – Kecskemét, Domb Beach  
  - HU description: Négy napos jazzfesztivál Kecskeméten, a Domb Beach helyszínen: fellépők, programok, jegyek, szállás és térkép.  
  - EN description: Four-day jazz festival in Kecskemét at Domb Beach: lineup, schedule, tickets, accommodation and travel info.

- `/lineup/`  
  - HU title: Fellépők – Bohém Jazzfőváros 2026  
  - EN title: Lineup – Bohém Jazz Capital 2026

- `/program/`  
  - HU title: Programok – Bohém Jazzfőváros 2026  
  - EN title: Program – Bohém Jazz Capital 2026

- `/info/`  
  - HU title: Jegyek és információk – Bohém Jazzfőváros  
  - EN title: Tickets & Info – Bohém Jazz Capital

- `/szallas/`  
  - HU title: Szállás – Bohém Jazzfőváros  
  - EN title: Accommodation – Bohém Jazz Capital

- `/terkep/`  
  - HU title: Térkép és közlekedés – Bohém Jazzfőváros  
  - EN title: Map & Transport – Bohém Jazz Capital

- `/tabor/`  
  - HU title: Jazztábor – Bohém Jazzfőváros  
  - EN title: Jazz Camp – Bohém Jazz Capital

- `/futas/`  
  - HU title: Jazzfutás – Bohém Jazzfőváros  
  - EN title: Jazz Run – Bohém Jazz Capital

- `/contact/`  
  - HU title: Kapcsolat – Bohém Jazzfőváros  
  - EN title: Contact – Bohém Jazz Capital

- `/aszf/`  
  - HU title: ÁSZF – Bohém Jazzfőváros  
  - EN title: Terms – Bohém Jazz Capital

---

## 3. Canonical + hreflang logika

- HU fődomain: `https://jazzfovaros.hu`
- EN fődomain: `https://jazzcapital.hu`
- Minden oldalon:
  - canonical: aktuális nyelv/domain URL
  - alternates:
    - `hu`: HU domaines URL
    - `en`: EN domaines URL
    - `x-default`: HU URL

Megvalósítás:
- `src/lib/seo.ts` -> `metadataAlternates()`, `canonicalUrl()`, `SITE_URL_HU`, `SITE_URL_EN`
- oldalak `generateMetadata()`-ban ezt használják.

---

## 4. Open Graph / Twitter stratégia

- Alap OG/Twitter meta a gyökér layoutban.
- Oldalszintű `openGraph.title`, `openGraph.description`, `openGraph.url` minden fontos route-on.
- Egységes OG image fallback:
  - `/images/og-image.jpg`
- Később Sanity-ben oldalszintű OG image override mező.

---

## 5. Structured Data stratégia

Jelenlegi és bevezetett elemek:
- `MusicEvent` (főoldal)
- `Organization` (layout szint)
- `WebSite` (layout szint)
- `BreadcrumbList` (aloldalak és ÁSZF)

Előkészített helper fájl:
- `src/lib/structuredData.ts`
  - `websiteSchema()`
  - `organizationSchema()`
  - `musicEventSchema()`
  - `breadcrumbSchema()`
  - `faqSchema()` (jelenleg előkészítve)

Megjegyzés:
- `FAQPage` schema csak valós, szerkesztett FAQ tartalom esetén legyen kitéve.

---

## 6. AI SEO / LLM discovery ajánlások

A modelleknek jól érthető tartalmi minimum minden nyelven:
- rövid „Mi ez az esemény?” összefoglaló
- pontos dátum (2026-08-06 – 2026-08-09)
- pontos helyszín (Domb Beach / Benkó Zoltán Szabadidőközpont, Kecskemét)
- egyértelmű jegyvásárlás URL
- szervező neve és kapcsolat

Kiemelten:
- tiszta címsor-hierarchia (`h1`, `h2`)
- stabil belső linkek
- duplikált, gyenge description szövegek kerülése
- oldalszintű canonical és nyelvi alternatíva minden fontos oldalon

---

## 7. Sanity SEO mezőstruktúra javaslat (telepítés nélkül)

Közös SEO object minden fő dokumentumtípusban:
- `seoTitle` (string)
- `seoDescription` (text)
- `ogImage` (image)
- `canonicalOverride` (url, opcionális)
- `noIndex` (boolean, opcionális)
- `slug` (slug)
- lokalizáció:
  - vagy HU/EN mezők egy dokumentumban
  - vagy külön lokalizált dokumentumok

Javasolt Sanity tartalomtípusok:
- `siteSettings` (brand, domain, globális SEO)
- `page` (alap oldalak)
- `performer` (fellépők)
- `programItem` (program sorok)
- `ticketTier` (jegyek)
- `sponsor` (szponzor/partner)
- `accommodation` (szállás)
- `transportInfo` (térkép/közlekedés)
- `faqItem` (ha FAQ schema-t is szeretnénk)

---

## 8. Technikai checklist (kész / további)

Kész:
- robots route
- sitemap route
- canonical/hreflang helper
- OG/Twitter alap metadata
- schema helper + alap schema integráció
- breadcrumb schema aloldalakon

Következő kör (Sanity után):
- oldalszintű SEO mezők bekötése metadata API-ba
- OG képek oldalszintű dinamikusítása
- FAQ schema bekapcsolása valid FAQ tartalommal

---

## 9. Phase 2C állapot (megvalósítva)

Központi SEO helper:

- `src/sanity/lib/seoContent.ts`
- `getSeoMetadataForPage(...)`:
  - page slug alapján lekéri a Sanity `seo` objektumot,
  - locale szerint választ HU/EN mezőt,
  - hibánál mindig fallbacket ad.
- `buildPageMetadataWithSanity(...)`:
  - Next.js `Metadata` objektumot épít,
  - megtartja a `metadataAlternates()` nyelvi logikát,
  - canonical override-ot csak explicit Sanity értékre használ.

Bekötött oldalak:

- `/`, `/info/`, `/lineup/`, `/program/`, `/contact/`, `/szallas/`, `/terkep/`, `/futas/`, `/tabor/`, `/aszf/`

SEO mezők prioritása:

1. Sanity `page.seo` mezők (`seoTitle*`, `seoDescription*`, `ogImage`, `canonicalOverride*`, `noIndex`)
2. Oldal saját fallback metadata (a korábbi statikus title/description értékek)

Canonical + hreflang:

- alap canonical továbbra is:
  - HU domain: `jazzfovaros.hu`
  - EN domain: `jazzcapital.hu`
- `hu/en/x-default` alternates változatlan.
- `canonicalOverride` csak canonicalt ír felül, alternates nyelvi URL-eket nem.

noIndex:

- `noIndex = true` -> `robots index:false, follow:false` + `googleBot` ugyanez.
- egyéb esetben indexelhető.

OG image:

- Sanity `ogImage` esetén Sanity image URL készül és abszolút URL-re normalizálódik.
- hiányzó/hibás kép esetén fallback: `/images/og-image.jpg`.

Structured data érintettség:

- `MusicEvent` (főoldal), `WebSite` + `Organization` (layout), `BreadcrumbList` (ÁSZF) logika változatlan maradt.
