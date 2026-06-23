# Jazz Főváros — Indulási Készültségi Ellenőrzőlista (Launch Readiness)

> **Audit dátuma:** 2026-06-03  
> **Fázis:** Phase 3B-5 — Final launch readiness verification  
> **Auditálta:** Claude (code audit) + Cursor (implementation)  
> **Végeredmény:** ✅ **GO** (feltételekkel — lásd 2. és 3. szakasz)

---

## 1. Kód állapot — Automatikus ellenőrzések

### 1.1 Lint és typecheck

| Ellenőrzés | Eredmény | Megjegyzés |
|---|---|---|
| `npm run lint` | ✅ PASS | Nincs figyelmeztetés, nincs hiba |
| TypeScript (next build belső ellenőrzés) | ✅ PASS | Típushibák nincsenek |

### 1.2 Build mátrix

| Build | Eredmény | Útvonalak | Megjegyzés |
|---|---|---|---|
| `build:hu` (HU locale) | ✅ PASS | 18 statikus route | 1 dinamikus `/oldal/[slug]` pre-generálva (HU tartalom) |
| `build:en` (EN locale) | ✅ PASS | 17 statikus route | 0 dinamikus `/oldal/[slug]` (csak HU-tartalmú oldalak kiszűrve) |
| `build` (default) | ✅ PASS | 18 statikus route | HU alapértelmezett locale |

> **Windows build megjegyzés:** A TypeScript type-check pass-hoz 8 GB heap szükséges Windows gépen (`NODE_OPTIONS=--max-old-space-size=8192`). A Netlify Linux build gépein ez nem szükséges. Ha egymás után futtatod a buildeket, várj 2 másodpercet közte (Windows `.next` könyvtár lock miatt). A Node.js webpack cache törölése nélkül, csak `.next` törlésével a build megbízhatóbb.

---

## 2. Sanity CMS ellenőrzési lista (manuális teendők szükségesek)

### 2.1 Studio menü — Hozzáférési útvonalak

| Tartalom | Elérési út a Studióban | Kód állapot |
|---|---|---|
| Videók | 🏠 Főoldal szerkesztés → Videók **ÉS** 🎬 Videók (top-level) | ✅ Kódban kész |
| Jegyek | 🏠 Főoldal szerkesztés → Jegyek **ÉS** 🎟️ Jegyek (top-level) | ✅ Kódban kész |
| Oldalak | 📄 Oldalak (Pages) | ✅ Kódban kész |
| Jazztábor oldal | ⚡ Jazztábor — Page (slug: tabor / jazztabor) | ✅ Mindkét slug szerkeszthető |
| Futás oldal | ⚡ Futás — Page (slug: futas) | ✅ Kódban kész |
| Program vezérlők | Oldalak → slug: program → Menetrend tábla / Program szöveg látható mezők | ✅ Kódban kész |
| noIndex | Bármely oldal / Fellépő / Programtétel → SEO beállítások → noIndex | ✅ Meta és sitemap szűrés kész |
| Navigáció | 🧭 Navigáció / Menü | ✅ Kódban kész |
| Site settings | ⚙️ Site settings | ✅ Kódban kész |
| Venue / Helyszín | 📍 Helyszín (Venue) | ✅ Kódban kész |

### 2.2 Tartalom feltöltési teendők (szerkesztői feladat)

> Ezek a honlap teljes működéséhez szükséges CMS-tartalmak. A kód kész, de a Sanity-ban üres lehetnek.

- [ ] **Főoldal videó:** Sanity → 🎬 Videók → Új videó létrehozása, `Megjelenítés oldalakon` = `home` Page referencia, `Engedélyezett` = igen
- [ ] **Főoldal jegyboxok:** Sanity → 🎟️ Jegyek → minden jegyen `Megjelenik a főoldalon` = igen, `Rövid leírás (HU)` kitöltése (box alcím), `Főoldali sorrend` beállítása
- [ ] **Program tételek:** dátum, idő, fellépők, helyszín kitöltve (Program → Programtételek)
- [ ] **Jazztábor tartalom:** ⚡ Jazztábor Page → táborkártyák, menetrend blokkok, CTA gomb
- [ ] **Fellépők:** kép, bio, egyedi jegylink (ha van), cardBackgroundVariant (kép nélküli kártyákhoz)
- [ ] **Szállás adatok:** szállodák neve, ár, kép, foglalási link
- [ ] **FAQ / GYIK:** Info oldal → GYIK blokk (ha Sanity-ból kell, nem kódból)
- [ ] **Menüpontok:** mind a HU, mind az EN label kitöltve (EN hiánya = menüpont nem látszik az EN site-on)
- [ ] **SEO mezők:** minden főoldal (home, program, lineup, info) → SEO beállítások → cím, leírás, OG kép
- [ ] **Site settings:** kapcsolati e-mail, telefon, jegylink HU/EN, social URL-ek
- [ ] **Jazztábor slug migrálása** (opcionális, nincs sietség): Oldalak → tabor Page → Slug: `jazztabor` → Publish (a `/tabor` redirect marad)

---

## 3. Netlify környezet és domain beállítások

### 3.1 Kötelező env változók — Mindkét Netlify site-on

| Változó | Magyar site | Angol site |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | [Sanity projekt ID] | [ugyanaz] |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2026-01-01` | `2026-01-01` |
| `SANITY_API_READ_TOKEN` | [read token] | [ugyanaz] |
| `NEXT_PUBLIC_SITE_URL_HU` | `https://VÉGLEGES_HU_DOMAIN` | `https://VÉGLEGES_HU_DOMAIN` |
| `NEXT_PUBLIC_SITE_URL_EN` | `https://VÉGLEGES_EN_DOMAIN` | `https://VÉGLEGES_EN_DOMAIN` |
| `NEXT_PUBLIC_LOCALE` | `hu` (ajánlott explicit) | `en` (ajánlott explicit) |

> ⚠️ **Go-live előtti állapot:** jelenleg egy Netlify site fut (`bohemjazz.netlify.app`, HU build). `NEXT_PUBLIC_SITE_URL_EN = https://bohemjazz.netlify.app` ideiglenesen ugyanerre mutat. Éles induláskor mindkét értéket a valódi production domain URL-ekre kell cserélni **mindkét site-on** a Netlify dashboardban.

### 3.2 Opcionális env változók

| Változó | Mire való |
|---|---|
| `NEXT_PUBLIC_LANGUAGE_SWITCH_URL` | Ha a nyelváltó gombot egy PR preview-ra akarod irányítani, build nélkül |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager container ID |
| `NEXT_PUBLIC_GA4_ID` | GA4 Measurement ID (ha GTM nélkül) |
| `CONTEXT` | Netlify automatikusan adja (production / deploy-preview / branch-deploy) — robots.txt-hez szükséges |

### 3.3 Domain és DNS beállítások

> **Launch model (2026-06):** Egy Netlify site. HU = `jazzfovaros.hu/`, EN = `jazzfovaros.hu/en/`. Nyelvváltó same-origin (`/en/` ↔ `/`). Teljes checklist: `PRODUCTION_LAUNCH_CHECKLIST.md`.

- [ ] `jazzfovaros.hu` → Netlify → Custom domain (Netlify által adott DNS rekordok)
- [ ] `www.jazzfovaros.hu` → Netlify vagy apex redirect (ajánlott: www → apex 301)
- [ ] **`jazzcapital.hu` + `www` → külső 301/308 → `https://jazzfovaros.hu/en/`** (domain szolgáltatónál; **NEM** Netlify custom domain)
- [ ] HTTPS: Netlify automatikusan kezeli (Let's Encrypt)
- [ ] Production Netlify env: `NEXT_PUBLIC_SITE_URL_HU` és `NEXT_PUBLIC_SITE_URL_EN` = `https://jazzfovaros.hu`
- [ ] Smoke test: `/sitemap.xml` helyes `jazzfovaros.hu` URL-eket tartalmaz (nem staging)
- [ ] Smoke test: staging → `/robots.txt` `Disallow: /` (ha preview)
- [ ] Smoke test: production → `/robots.txt` `Allow: /`
- [ ] **Ne módosítsd** az éves archív subdomain DNS-t (`2024.jazzfovaros.hu`, `2025.jazzfovaros.hu`, …)

### 3.4 Build parancsok a Netlify site-okon

| Site | Build parancs | Node verzió |
|---|---|---|
| HU | `npm run build` (locale detektálás URL alapján) **vagy** `NEXT_PUBLIC_LOCALE=hu npm run build` | 20 |
| EN | `npm run build` (locale detektálás URL alapján) **vagy** `NEXT_PUBLIC_LOCALE=en npm run build` | 20 |

> A `netlify.toml` jelenleg `npm run build` parancsot használ, ami helyes. A locale a deploy URL + `NEXT_PUBLIC_SITE_URL_*` összehasonlításával automatikusan választódik.

---

## 4. Archívum (2016–2025)

- [ ] Régi archív oldalak megmaradnak a régi tárhelyen
- [ ] Archív aldomaint beállítani: pl. `archive.jazzfovaros.hu` → régi hosting DNS A/CNAME rekordja
- [ ] Opcionális: `netlify.toml` éves redirectek hozzáadása: `/2016` → `https://archive.jazzfovaros.hu/2016` (301)
- [ ] Az új honlap linkeli az archívumot (footer / menü) ha az URL végleges
- [ ] Fő domain (`jazzfovaros.hu`) + aldomainek DNS szétválasztva (subdomain-szintű, nem path-alapú routing)

---

## 5. Kód állapot — Részletes funkció-audit

### 5.1 Sanity Studio elérési útvonalak

| Funkció | Kód állapot | Megjegyzés |
|---|---|---|
| Videók a Studióban | ✅ Kész | Két helyen: Főoldal csoport + top-level |
| Ticket `showOnHome` / `homeOrder` | ✅ Kész | Feltétel: editor kitölti |
| Program megjelenítési vezérlők (6 mező) | ✅ Kész | Csak slug=program esetén látszik |
| `isCampSlug()` predikátum | ✅ Kész | tabor ÉS jazztabor slug elfogadva |
| noIndex mező minden oldalon | ✅ Kész | SEO → noIndex emittál robots meta-t |

### 5.2 Főoldal

| Funkció | Kód állapot | Feltétel |
|---|---|---|
| Videó click-to-load | ✅ Kész | VideoLiteEmbed; iframe csak kattintás után töltődik |
| Videó Sanity-ből | ✅ Kész | `getEnabledVideosWithFallback` + displayOnPages szűrés |
| Jegyboxok Sanity-ből | ✅ Kész | `getHomeTicketsWithFallback`; statikus fallback ha nincs showOnHome jegy |
| Statikus jegybox fallback | ✅ Kész | Ha nincs showOnHome jegy, 3 hardcoded kártya mutatódik |
| Popup (Széchenyi) | ✅ Kész | `popupSettings` singleton |

### 5.3 Program oldal

| Funkció | Kód állapot | Megjegyzés |
|---|---|---|
| Desktop: mind a 4 nap egymás mellett | ✅ Kész | `lg:grid-cols-4` |
| Tablet: 2 oszlop | ✅ Kész | `md:grid-cols-2` |
| Mobil: 1 oszlop | ✅ Kész | `grid-cols-1` |
| Mobil nap-nav nyilak | ✅ Kész | `md:hidden`, anchor link `#program-day-{n}` |
| Idő tartomány en-dash-sel | ✅ Kész | `16:30–17:45` |
| Kis chevron, nincs nagy Részletek gomb | ✅ Kész | Összeomlott sorban: idő, cím, badge, chevron |
| Sanity megjelenítési vezérlők | ✅ Kész | 6 mező; backward-compat programDisplayMode fallback |
| Szabad szöveg / tábla responsive sorrend | ✅ Kész | `order-1/2 md:order-1/2` CSS |

### 5.4 Lineup / Fellépők

| Funkció | Kód állapot | Megjegyzés |
|---|---|---|
| Kártya akciók alul igazítva | ✅ Kész | `mt-auto` wrapper a social link + CTA container körül |
| Kép betöltési hiba fallback | ✅ Kész | `PerformerCardImage` error handler |
| Kép nélküli kártya gradient | ✅ Kész | `cardBackgroundVariant` alapján |
| Per-performer jegylink | ✅ Kész | Fallback: global jegylink |
| Modál viselkedés | ✅ Kész | Portal + AnimatePresence |

### 5.5 Jegyek & Infó oldal

| Funkció | Kód állapot | Megjegyzés |
|---|---|---|
| Kompakt lista/táblázat | ✅ Kész | Orange article + ul, nem nagy kártyarács |
| Sanity per-jegy link | ✅ Kész | `tier.ctaUrl → ticketUrl` |
| `isHidden` / `isAvailable` | ✅ Kész | Filterelve a query-ben |
| Leírás renderelve | ✅ Kész | Rich text vagy plain text |
| FAQ (Sanity vagy kód) | ✅ Kész | CMS GYIK prioritás, kód fallback |

### 5.6 Szállás

| Funkció | Kód állapot | Megjegyzés |
|---|---|---|
| Nincs "ártól" / "-tól" szöveg | ✅ Kész | Eltávolítva Phase 2A-ban |
| Rich body szöveg | ✅ Kész | `bodyRichHu/En` fallback `descriptionHu/En`-re |
| CTA gomb | ✅ Kész | `ctaUrl → bookingUrl`, lokalizált felirat |

### 5.7 Kapcsolat

| Funkció | Kód állapot | Megjegyzés |
|---|---|---|
| Nincs duplikált szponzor szekció | ✅ Kész | Eltávolítva Phase 3A-ban |
| Baloldali kártya: szervező + kapcsolat + önkéntes + social | ✅ Kész | |
| Jobboldali kártya: sajtó / akkreditáció | ✅ Kész | Felesleges wrapper eltávolítva Phase 3B-4-ben |
| Sanity-vezérelt tartalom | ✅ Kész | `getContactContent` a siteSettings-ből |

### 5.8 Routing és SEO

| Funkció | Kód állapot | Megjegyzés |
|---|---|---|
| `/jazztabor` route | ✅ Kész | Saját page.tsx |
| `/tabor` → `/jazztabor` 308 redirect | ✅ Kész | middleware.ts |
| `/en/*` redirect | ✅ Kész | HU build → EN domain; EN build → path stripping |
| Aktív, nav-ból rejtett oldal renderhető | ✅ Kész | `dynamicParams=true`, notFound() csak inaktív oldalnál |
| noIndex oldal renderelhető, sitemapból kizárva | ✅ Kész | `buildPageMetadataWithSanity` + sitemap szűrés |
| Inaktív oldal 404 | ✅ Kész | `getActivePageBySlugQuery` isActive==true szűrő |
| HU-only oldal nem látszik EN nav-ban | ✅ Kész | Strict locale label (`buildNavItem`) |
| EN-only oldal nem látszik HU sitemapban | ✅ Kész | `hasHu`/`hasEn` szűrés |
| Locale dinamikus oldal pre-generálás | ✅ Kész | `generateStaticParams` locale szűrővel |
| Canonical / hreflang | ✅ Kész | `metadataAlternates()` per-domain alternates |
| Staging noindex | ✅ Kész | `robots.ts` detektálja a `CONTEXT` Netlify env-et |
| Sitemap dinamikus oldalakkal | ✅ Kész | Sanity-alapú, noIndex és locale szűrve |

### 5.9 Teljesítmény

| Funkció | Kód állapot | Megjegyzés |
|---|---|---|
| Nincs eager YouTube/Vimeo iframe | ✅ Kész | VideoLiteEmbed; `VideoEmbed`/`VideoSection` nincs importálva semelyik page-ben |
| Sanity image helper (`sanityImageUrl`) | ✅ Kész | `auto=format`, quality=75, optional width/height |
| Térkép iframe loading="lazy" | ✅ Kész | info + terkep page |
| Server component hydration | ✅ Kész | Hero, LineupTeaser szerver komponens |
| ISR revalidation | ✅ Kész | `revalidate = 30` az összes Sanity-vezérelt oldalon |

---

## 6. Ismert korlátok és deferred teendők

| Téma | Állapot | Megjegyzés |
|---|---|---|
| Kontakt oldal teljes CMS konszolidáció | Halasztva | Cím / sajtó mezők még statikus kódban; nem blokkoló |
| Rich text szín dekorátorok | Halasztva (opcionális) | Predefined szín márk; nem blokkoló |
| Next.js image optimization re-engedélyezés | Halasztva | `images.unoptimized: true` marad; Netlify loader kompatibilitás nem ellenőrzött |
| bundle analyzer script | Halasztva | package.json-ban nincs analyzer script |
| `npm run typecheck` script | Nincs definiálva | Típusok a `next build` belsőleg ellenőrzik; nem blokkoló |
| Windows build memória | Nem blokkoló | 8 GB heap szükséges Windows-on; Netlify Linux gép nem érintett |
| Archive subdomain DNS | Manuális feladat | Nem kód, hanem hosting/DNS konfiguráció |

---

## 7. Végső Go / No-Go

### ✅ GO — kód oldalról

Az összes kritikus funkció kész és tesztelve:
- Sanity CMS szerkesztési útvonalak helyesek
- Videó, jegy, program, fellépő, szállás, kapcsolat, jogi oldalak működnek
- Routing (jazztabor, redirectek, hidden oldalak, noindex, locale) helyes
- Nincs eager iframe
- Lint és mind a három build pass

### ⚠️ Szükséges lépések indulás előtt

1. **Sanity tartalom feltöltése** (szerkesztői feladat) — különösen videók, főoldali jegyek, program tételek, fellépő képek
2. **Netlify env vars frissítése** mindkét site-on a valódi production domainkkel (NEXT_PUBLIC_SITE_URL_HU / _EN)
3. **DNS beállítás** — domaineket a Netlify site-okhoz kötni
4. **Sanity token** — SANITY_API_READ_TOKEN beállítva mindkét Netlify site-on
5. **Staging smoke test** — Netlify deploy preview-n ellenőrizni a robots.txt (Disallow: /) és a tartalmakat
6. **Production smoke test** — éles deploy után sitemap URL-ek, noindex meta, minden fő oldal, HU↔EN váltó gomb, videó click-to-load, mobil nézet

### 🔒 Nem szükséges induláshoz (de ajánlott later)

- Jazztábor Sanity slug migrálása (`tabor` → `jazztabor`)
- Archive subdomain DNS
- Kontakt oldal full CMS konszolidáció
- bundle analyzer setup
- Re-enable Next.js image optimization (Netlify loader verifikálás után)

---

*Utolsó frissítés: 2026-06-03 — Phase 3B-5 audit*
