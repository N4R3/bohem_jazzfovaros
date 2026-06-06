# Jazz Főváros — Tartalomszerkesztői és indulási ellenőrzőlista

Gyakorlati útmutató a Sanity Studio tartalomkezelőknek és a technikai indulásért felelősöknek.

**Nyelv / domain modell:**
- **Local + staging (egy site):** `/` = magyar, `/en/` = angol (ugyanazon a hoston).
- **Production go-live:** két külön domain (HU + EN Netlify site), ha `NEXT_PUBLIC_SITE_URL_HU` és `NEXT_PUBLIC_SITE_URL_EN` **különböző** originre mutat.

---

## 0. Nyelv tesztelés (fejlesztőknek)

| Környezet | Magyar | Angol | Nyelvváltó |
|-----------|--------|-------|------------|
| Local | `http://localhost:3000/` | `http://localhost:3000/en/` | HU → `/en/`, EN → `/` |
| Staging | `https://bohemjazz.netlify.app/` | `https://bohemjazz.netlify.app/en/` | ugyanígy |
| Production | `NEXT_PUBLIC_SITE_URL_HU` | `NEXT_PUBLIC_SITE_URL_EN` | abszolút domainek |

**Fontos:** `.env.local`-ban go-live előtt **ne** állíts különböző production domaineket, ha `/en/` local tesztet akarsz — különben két-domain mód aktiválódik.

**Go-live:** mindkét Netlify site-on: `NEXT_PUBLIC_SITE_URL_HU`, `NEXT_PUBLIC_SITE_URL_EN`, EN site-on `NEXT_PUBLIC_LOCALE=en`.

---

## 1. Tartalomkezelés — gyors útmutatók

### 1.1 Videók — EGYSZERŰ, oldalankénti YouTube link (R2)

> **ÚJ, EGYSZERŰSÍTETT MÓD.** Minden oldalnak SAJÁT videó mezője van a saját Page szerkesztőjén. **Nem kell** a külön „Videók" gyűjteményt használni a normál oldalvideókhoz.

**Hol:** Sanity Studio → **📄 Oldalak (Pages)** → nyisd meg az oldalt → **„Videó (YouTube link)"** mező

| Mező | Mit csinálj |
|------|-------------|
| Videó (YouTube link) | Illeszd be a YouTube linket. Üresen: nincs videó (főoldal/jazztábor: a kódbeli alap marad). |
| Videó cím (HU/EN) | Opcionális felirat. Üresen az oldal címe használatos. |

**Megjelenítés:** előnézetkép → a látogató **rákattint**, utána töltődik be (nem indul el magától).

**Főoldali videó:** Studio → **🏠 Főoldal szerkesztés → Főoldal Page** → „Videó (YouTube link)" → Publish.

**Jazztábor videó:** Studio → **⚡ Jazztábor — Page** → „Videó (YouTube link)" → Publish. (Üresen a kódbeli alap videó marad.)

**Bármely új oldal videója:** ugyanígy, az adott Page „Videó (YouTube link)" mezőjében.

#### Másodlagos: globális „🎬 Videók" gyűjtemény (deprecated a normál használathoz)
A külön **🎬 Videók** dokumentumtípus megmaradt, de **csak akkor kell**, ha egy oldalon a **Rugalmas szekciók** közé „Szekció: Videó" blokkot teszel (haladó eset). Normál oldalvideóhoz **ne** ezt használd — használd az oldal saját „Videó (YouTube link)" mezőjét.

---

### 1.1b Főoldal — szerkesztési helyek összefoglalója

A főoldal tartalom **több forrásból** épül fel. Ezért van a Studio-ban a **🏠 Főoldal szerkesztés** gyorselérési csoport.

| Tartalom | Hol szerkeszthető | Megjegyzés |
|----------|-------------------|------------|
| **Főoldal videó** | Studio → **🏠 Főoldal szerkesztés → Főoldal Page → „Videó (YouTube link)"** | ✅ R2: már a Page-en, nem a globális Videók közt |
| Főoldal jegyboxok | Studio → **🎟️ Jegyek** → `showOnHome = true` | Ha nincs ilyen jegy, statikus fallback látszik |
| Főoldal SEO (meta cím/leírás/OG) | Studio → **Főoldal Page → SEO beállítások** | |
| Popup (Széchenyi-kép) | Studio → **Popup settings** | Singleton |
| Fesztivál alapadatok (email, telefon, jegylink) | Studio → **Site settings** | Globális singleton |
| Főoldal hero szöveg / stat-sáv (4·10+·120+·40+) / CTA banner szöveg | `src/content/hu.ts` / `en.ts` (kód) | ⏳ **Még statikus** — R3-ban lesz szerkeszthető a Sanity-ben |

> **Állapot (R2 után):** a főoldal **videója** és a **jegyboxai** már a Studióból szerkeszthetők. A főoldal **szöveges részei** (hero felirat, statisztika sáv, CTA banner) **még a kódban** vannak — ezeket az **R3** fázis fogja a Főoldal Page-re hozni. Addig fejlesztői módosítás kell hozzájuk.

---

### 1.1c Jazztábor — slug átnevezés (manuális teendő)

Az élő URL: `/jazztabor/`. A Sanity dokumentum slug-ja jelenleg: `tabor` (legacy).

**A dokumentum már most is teljes egészében szerkeszthető** — a Studio a `tabor` VAGY `jazztabor` slug esetén egyaránt mutatja a tábor-specifikus mezőket.

**Ha át akarod nevezni a Sanity slug-ot `jazztabor`-ra:**
1. Studio → **Oldalak (Pages)** → keresd meg a Jazztábor Page-t (slug: `tabor`)
2. Szerkeszd a **Slug** mezőt: `jazztabor`
3. Publish
4. A frontend automatikusan az új slugot találja meg (a `tabor` → `/jazztabor/` redirect érintetlen marad)

> **Nincs sietség** — a honlap a `tabor` és `jazztabor` slug-ot egyaránt kezeli.

---

### 1.1d Program oldal — megjelenítési vezérlők

**Hol:** Sanity Studio → **Oldalak (Pages)** → slug: `program`

A program oldal két tartalom-blokkot tud megjeleníteni:
- **Tábla** = a Sanity program tételekből épített strukturált menetrend (kártyák, napok)
- **Szöveg** = a szabad szöveges / rich text programleírás (programBodyRich HU/EN mezők)

**Megjelenítési vezérlők** (mind opcionális; ha üresen hagyod, az alapértelmezés érvényes):

| Mező | Alapértelmezett | Mit csinál |
|------|-----------------|------------|
| Menetrend tábla látható – asztali | igen | Asztali nézetben megjelenik-e a strukturált lista |
| Menetrend tábla látható – mobil | igen | Mobil nézetben megjelenik-e a strukturált lista |
| Program szöveg látható – asztali | igen | Asztali nézetben megjelenik-e a szöveges leírás |
| Program szöveg látható – mobil | igen | Mobil nézetben megjelenik-e a szöveges leírás |
| Sorrend asztali nézetben | Tábla elöl | Melyik blokk legyen fent asztali nézetben |
| Sorrend mobil nézetben | Tábla elöl | Melyik blokk legyen fent mobil nézetben |

> **Megjegyzés:** a szöveg-blokk csak akkor jelenik meg, ha a `programBodyRich (HU/EN)` is ki van töltve. Ha nincs szabad szöveg, a szöveg-blokk üres marad — a láthatósági kapcsoló nem kényszeríti ki tartalmat.

**Mobil nap-navigáció:** a program oldal mobilon egymás alatt mutatja a napokat (1 oszlop). Minden nap-fejlécen megjelennek a **◀ Előző nap / Következő nap ▶** nyilak — az első napnál csak a jobb nyíl, az utolsónál csak a bal. Ezeket a nap-nyilakat nem kell szerkeszteni — automatikusan jelennek meg.

**Időtartam megjelenítés:** ha van kezdés ÉS befejezés idő, az oldalon `16:30–17:45` formátumban jelenik meg (en-dash). Ha csak kezdés van, csak az jelenik meg.

---

### 1.2 Fellépők — kép, jegy, sorrend, kártya háttér

**Hol:** Sanity Studio → **Fellépő**

| Mező | Mit csinálj |
|------|-------------|
| Név | Kötelező |
| Fellépő képe | Ajánlott (Sanity feltöltés) |
| Kép megjelenítési módja | Alap: **Kitöltés (cover)**. „Teljes kép” = látszik a teljes kép, krém háttér a széleken |
| Kártya háttér variáns | **Csak kép nélkül** — színes placeholder (navbar / alap / kiemelt) |
| Egyedi jegy URL (HU/EN) | Opcionális; üresen a globális jegylink |
| Sorrend | Kisebb szám = előrébb; azonos számnál ABC |
| Kiemelt | Igen = a kiemeltek elejére kerül (ott is sorrend + ABC) |
| Aktív | Ki = nem jelenik meg a Lineup oldalon |
| Címkék / műfajok | Opcionális badge a kártyán (max. 3) |
| Rövid / hosszú leírás | Kártya + modál szövege |

---

### 1.3 Program — eseménycím, részletek, jegy

**Hol:** Sanity Studio → **Program tétel**

| Mező | Mit csinálj |
|------|-------------|
| Dátum + kezdés | Kötelező |
| Színpad (stageRef) | **Ajánlott** — Stages dokumentumból válassz |
| Eseménycím (HU/EN) | Opcionális elsődleges cím a kártyán |
| Cím (HU/EN) | Kísérő / zenekarnév; fellépők mellett opcionális |
| Leírás | Rövid szöveg |
| Részletes leírás (rich) | Lenyitható „Részletek” blokk |
| Fellépők | Több is rendelhető; egy fellépő több időponthoz is |
| Esemény jegy URL | Opcionális; üresen globális jegylink |
| Aktív | Ki = nem listázódik |

**Publish után** ellenőrizd a `/program/` oldalt.

---

### 1.4 Szállás

**Hol:** Sanity Studio → **Szállás**

| Mező | Mit csinálj |
|------|-------------|
| Név, leírás, ár | Alapadatok a kártyán |
| Részletes leírás (rich) | Hosszabb szöveg, ha kell |
| Kép | Ajánlott |
| Foglalási link / CTA URL / CTA felirat | Gomb a kártya alján |
| Sorrend + Aktív | Lista sorrend és láthatóság |

---

### 1.5 Jegyek

**Hol:** Sanity Studio → **🎟️ Jegyek**  
*(Gyors elérés: Studio → 🏠 Főoldal szerkesztés → Jegyek)*

| Mező | Mit csinálj |
|------|-------------|
| Név HU | Kötelező |
| Név EN | Opcionális (draftnál lehet üres) |
| Rövid leírás HU/EN | **Info oldalon fallback + főoldal box alcíme** (pl. „Válaszd ki a napod") — 1 sor ideális |
| Leírás Rich Text HU/EN | Részletesebb szöveg a Jegyek & Infó oldalon |
| Ár + pénznem | Kötelező ár szöveg |
| Jegy link HU/EN | Vásárlási URL |
| CTA szöveg / URL | Opcionális egyedi gomb |
| Kiemelt jegy | Kiemelt keret a kártyán |
| Elérhető / Rejtett | Rejtett = nem listázódik (Info oldal + főoldal sem mutatja) |
| **Megjelenik a főoldalon** | `showOnHome = true` → ez a jegy bekerül a főoldal narancs jegyboxaiba |
| **Főoldali sorrend** | `homeOrder` — kisebb szám = bal oldali box |

**Főoldali jegyboxok beállítása:**
1. Nyisd meg az adott jegyet (pl. Napijegy)
2. Töltsd ki a **Rövid leírás (HU)** mezőt (ez lesz a box alcíme)
3. Kapcsold be: **Megjelenik a főoldalon** = igen
4. Állítsd be a **Főoldali sorrend** értékét (0, 1, 2...)
5. Ellenőrizd a **Jegy link** / **CTA URL** mezőt
6. Publish → 30 másodpercen belül megjelenik a főoldalon

**Viselkedés:** ha egy jegynek sincs `showOnHome = true`, a főoldal a kódba égetett 3 statikus boxot mutatja (Napijegy / Bérlet / VIP — fallback). Ha legalább egy jegy `showOnHome = true`, kizárólag a Sanity-alapú boxok látszanak.

---

### 1.6 Oldalak — FAQ, ÁSZF, Adatvédelem, új információs oldal

**Hol:** Sanity Studio → **Oldal (Page)**

- **Fix slugok** (ne változtasd): `home`, `info`, `lineup`, `program`, `contact`, `szallas`, `terkep`, `futas`, `tabor` / `jazztabor`, `aszf`, `adatvedelem`
- **Új oldal (R1):** adj egy slugot (pl. `sajto`) → az oldal a **`/sajto`** címen lesz elérhető (közvetlen linkkel!). A régi `/oldal/sajto` is működik, de **átirányít** a `/sajto`-ra.
- Menübe: **Menüpont** + Page referencia (ha nem teszed menübe, az oldal akkor is elérhető közvetlen linkkel — nem ad 404-et).
- A Studio **csak a slughoz illő mezőket** mutatja (pl. program = program mód, tábor = tábor blokkok)
- **Videó:** minden oldalnak van „Videó (YouTube link)" mezője (lásd 1.1)
- **Rugalmas szekciók:** extra blokkok (szöveg, videó, kép, gomb, galéria, térköz)
- **SEO beállítások** minden oldalon: cím, leírás, OG kép, **noindex**

**Renderelési szabály (R1) — mikor látszik egy oldal:**

| Helyzet | Eredmény |
|---------|----------|
| Aktív + van tartalom az adott nyelven | ✅ Renderel (`/slug`) |
| Aktív, de **nincs a menüben** | ✅ Renderel (rejtett ≠ 404) |
| Aktív + **noindex** | ✅ Renderel (a noindex csak a Google-elől rejti, sitemapból kihagyja) |
| **Inaktív / nem publikált** | ❌ 404 |
| Az **adott nyelvi** verzióban nincs tartalom | ❌ 404 abban a buildben (lásd lent) |

**Nyelvi elérhetőség (R1, szigorú):**
- Csak **HU** cím/tartalom → az oldal **csak a magyar** oldalon jelenik meg.
- Csak **EN** cím/tartalom → az oldal **csak az angol** oldalon jelenik meg.
- **Mindkét** nyelv kitöltve → mindkét oldalon megjelenik.
- **Nincs néma fallback:** az angol build **nem** mutatja a csak magyar tartalmat (és fordítva). Ha egy oldalt mindkét nyelven akarsz, töltsd ki az **(EN)** mezőket is.

**Ha a honlap „régi" szöveget mutat:** lehet, hogy a kódbeli alapérték látszik — töltsd ki a Sanity mezőt és **Publish**. (Megjegyzés: a `/` jelet tartalmazó slug nem működik a `/slug` gyökér-úton — használj egyszerű, egyszavas slugot.)

---

### 1.7 Rugalmas szekciók (rövid összefoglaló)

| Szekció típus | Használat |
|---------------|-----------|
| Szöveg (rich) | Bekezdések, címsorok |
| Szövegdoboz | Kiemelt doboz bal szegéllyel |
| Videó | Videó dokumentum + opcionális felülíró cím |
| Gomb | Egy CTA link |
| Kép / Galéria | Kép(ek) felirattal |
| Térköz | Üres hely két blokk között |

Minden szekciónál: **Engedélyezett** ki = nem renderelődik.

---

### 1.8 noIndex (ne indexelje a Google)

**Hol:** Oldal / Fellépő / Program tétel → **SEO beállítások** → **Ne indexelje a Google (noindex)**

- Bekapcsolva: nincs a sitemapben, `noindex` meta
- Használd: draft, teszt, belső oldal
- **Ne** kapcsold be az élő főoldalakon (home, program, lineup, jegyek)

**Staging Netlify:** a `robots.txt` és meta alapból noindex lehet — ellenőrizd deploy után.

---

### 1.9 Menü — láthatóság, sorrend

**Hol:** Sanity Studio → **Menüpont**

| Mező | Mit csinálj |
|------|-------------|
| Felirat HU / EN | **EN üresen = a menüpont NEM látszik az angol oldalon** (szándékos viselkedés) |
| Belső oldal (Page) | Ajánlott — automatikus `/slug/` link |
| Saját URL / Külső link | Ha nem Page-ből linkelsz |
| Sorrend | Kisebb = balra / feljebb |
| Aktív | Ki = sehol nem jelenik meg |
| Fejléc / Footer | Hol látszódjon |

---

### 1.10 Ha hiányzik az angol tartalom

A honlap **két külön build** (HU site / EN site). Minden dokumentumnál töltsd ki az **(EN)** mezőket, ahol van.

| Helyzet | Mi történik |
|---------|-------------|
| EN mező üres | A rendszer gyakran a **magyar** szöveget vagy kódbeli alapértéket mutatja |
| Jegy név EN üres | Magyar név vagy rövidített fallback |
| Videó / program / oldal | Prioritás: EN mező → HU mező → statikus fallback |

**Teendő:** Publish előtt nézd át az EN site preview-t; hiányzó EN = nem „hiba”, de érdemes pótolni.

---

## 2. Domain és Netlify indulás

### 2.1 Két Netlify site modell

| Site | Build locale | Példa domain (állítsd be) |
|------|--------------|---------------------------|
| Magyar | `hu` | `HU_PRODUCTION_DOMAIN` |
| Angol | `en` | `EN_PRODUCTION_DOMAIN` |

Mindkét site **ugyanabból a GitHub repóból** épül, külön Netlify projekttel.

### 2.2 Kötelező / ajánlott környezeti változók

**Mindkét Netlify site-on:**

| Változó | Magyar site | Angol site |
|---------|-------------|------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ugyanaz | ugyanaz |
| `NEXT_PUBLIC_SANITY_DATASET` | pl. `production` | ugyanaz |
| `NEXT_PUBLIC_SANITY_API_VERSION` | pl. `2026-01-01` | ugyanaz |
| `NEXT_PUBLIC_SITE_URL_HU` | `https://HU_PRODUCTION_DOMAIN` | **ugyanaz** (mindkettőn!) |
| `NEXT_PUBLIC_SITE_URL_EN` | `https://EN_PRODUCTION_DOMAIN` | **ugyanaz** |
| `NEXT_PUBLIC_LOCALE` | `hu` (ajánlott explicit) | `en` (ajánlott explicit) |
| `SANITY_API_READ_TOKEN` | read token (build/ISR) | ugyanaz |

**Opcionális:**

| Változó | Cél |
|---------|-----|
| `NEXT_PUBLIC_LANGUAGE_SWITCH_URL` | Preview / branch deploy nyelvváltó felülírás |
| `NEXT_PUBLIC_GTM_ID` / `GA4_ID` / `GADS_ID` | Analitika |
| `NETLIFY_*` / `URL` | Netlify automatikusan adja — locale felismeréshez |

**Fontos:** `NEXT_PUBLIC_SITE_URL_HU` és `NEXT_PUBLIC_SITE_URL_EN` **mindkét** site-on legyen kitöltve a **végleges** production URL-ekkel (nyelvváltó és SEO).

### 2.3 Custom domain, HTTPS, redirect

- [ ] Custom domain hozzárendelve mindkét Netlify site-hoz
- [ ] HTTPS automatikus (Netlify Let’s Encrypt)
- [ ] Apex ↔ `www` canonical egyeztetve (egy változat legyen a kanonikus)
- [ ] `netlify.toml` / Netlify UI redirectek: HTTP → HTTPS
- [ ] Legacy `/en` és `/en/*` → megfelelő EN domain (middleware / redirect — már a kódban)
- [ ] Publish után: `https://HU_PRODUCTION_DOMAIN/sitemap.xml` és `robots.txt`
- [ ] Publish után: `https://EN_PRODUCTION_DOMAIN/sitemap.xml` és `robots.txt`
- [ ] Staging / preview deploy: robots noindex + meta ellenőrzés

### 2.4 Build parancsok (Netlify)

| Site | Ajánlott build |
|------|----------------|
| HU | `npm run build:hu` vagy `NEXT_PUBLIC_LOCALE=hu npm run build` |
| EN | `npm run build:en` |

Node verzió: egyezzen a repo `.nvmrc` / `package.json` engines mezőjével.

---

## 3. Archívum (2016–2025)

- A **2016–2025** évi régi oldalak **nem** részei az új Sanity CMS-nek és **nem** kerülnek importálásra.
- Ajánlott: külön **archív aldomain**, pl. `archive.HU_PRODUCTION_DOMAIN` (pl. `archive.jazzfovaros.hu`).
- A régi tartalom továbbra is a **régi tárhelyen** marad — az archív DNS oda mutasson.
- Az **új** honlap később linkelhet az archívumra (lábléc / menü), de nem hostolja újra.
- **DNS figyelmeztetés:** egy domain alatt **nem** lehet útvonal szerint két különböző tárhelyre irányítani. Ezért aldomain vagy **301 redirect** (pl. `/2016` → `https://archive.../2016`).
- Év-szintű redirectek: Netlify `[[redirects]]` vagy `_redirects` — technikai beállítás, nem CMS.

---

## 4. Végleges indulási QA (release checklist)

### 4.1 Automatikus (fejlesztő / CI)

```bash
npm run lint
npx cross-env NODE_OPTIONS="--max-old-space-size=4096" npm run build
npx cross-env NODE_OPTIONS="--max-old-space-size=4096" npm run build:hu
npx cross-env NODE_OPTIONS="--max-old-space-size=4096" npm run build:en
```

Windows hiba esetén: töröld a `.next` mappát, majd futtasd újra 4 GB heap-pel.

`npm run typecheck` — jelenleg nincs külön script (típusok a `next build`-ben).

### 4.2 Magyar site — kézi smoke teszt

- [ ] Főoldal: hero, videó **kattintásra** indul, jegydobozok, spacing rendben
- [ ] Lineup: kártyák, kép krém háttér, modál, jegylink
- [ ] Program: eseménykártyák, lenyitható részletek
- [ ] Jegyek & Infó: jegykártyák, CTA-k
- [ ] Szállás, Térkép, Tábor, Futás, Kapcsolat
- [ ] ÁSZF, Adatvédelem, legalább egy `/oldal/...` (ha van)
- [ ] Nyelvváltó → EN domain, ugyanaz az útvonal
- [ ] Mobil nézet (navbar, kártyák, modál)
- [ ] Nincs „undefined” szöveg az oldalon

### 4.3 Angol site — kézi smoke teszt

- [ ] Ugyanazok az oldalak angol szöveggel (ahol kitöltötték EN mezőket)
- [ ] Hiányzó EN: elfogadható fallback, de jelöld CMS-ben pótlásra
- [ ] Nyelvváltó → HU domain

### 4.4 Sanity tartalom smoke

- [ ] Új videó: enabled + URL + Publish → megjelenik
- [ ] Videó disabled → eltűnik
- [ ] Új program tétel + fellépő kapcsolat
- [ ] Jegy rejtett / nem elérhető → nem listázódik
- [ ] Menüpont inaktív → nem látszik
- [ ] noindex oldal: `robots` meta `noindex` + **nincs** a `/sitemap.xml`-ben (fix oldalaknál is: Page → SEO → „Ne indexelje”)

### 4.5 SEO / technikai

- [ ] `/sitemap.xml` — csak indexelhető oldalak, helyes domain
- [ ] `/robots.txt` — production: indexelhető; staging: noindex
- [ ] noindex tesztoldal meta: `noindex`
- [ ] Jegylinkek élnek (globális + egyedi fellépő / esemény URL)
- [ ] Archív link (ha már be van kötve): megnyílik a régi hoston

---

## 5. Gyakori hibák

| Tünet | Ellenőrizd |
|-------|------------|
| Változás nem látszik | Publish + Netlify deploy lefutott? |
| Rossz nyelvű site | `NEXT_PUBLIC_LOCALE` és site URL env-ek |
| Videó nem tölt | `enabled` + `videoUrl` |
| Kék csík a fellépő képen | Kép `cover` mód — üres sáv krém háttér (javítva); nincs kép → háttér variáns |
| Program üres | `programItem` aktív + dátum |
| Menü dupla / hiányzik | Navigation + `isActive` + sorrend |

---

## 6. Főoldal szerkesztés (R3 — 2026-06-05)

**Hol:** Studio → **🏠 Főoldal szerkesztés** → **📄 Főoldal Page (hero, stat, CTA, videó, SEO)**

Előfeltétel: legyen egy aktív Page dokumentum **slug = `home`**. Ha nincs, hozd létre, töltsd ki, Publish.

| Mit szerkesztesz | Mező a `home` Page-en |
|------------------|------------------------|
| Hero cím (2 sor) | Főoldal — Hero cím — formátum: `BOHÉM\|JAZZFŐVÁROS` vagy két sor |
| Hero helyszín badge | Főoldal — Hero helyszín badge |
| Hero dátum badge | Főoldal — Hero dátum badge |
| Hero + info-sáv CTA | Főoldal — Elsődleges CTA szöveg + URL |
| Narancs stat sáv (4/10+/…) | Főoldal — Statisztika sáv (`homeStats`) |
| Alsó nagy CTA banner | Főoldal — Alsó CTA banner cím / alcím / gomb |
| Videó | **Videó (YouTube link)** + opcionális videó cím |
| SEO | SEO beállítások |
| Főoldali jegyboxok | **🎟️ Jegyek** → `showOnHome` + `homeOrder` (nem a Page-en) |

Üres Sanity mezőknél a honlap a kódbeli `hu.ts` / `en.ts` alapszöveget mutatja.

---

## 7. Jegyek & Infó — Sanity-first (2026-06-02)

| Tartalom | Hol szerkeszd |
|----------|----------------|
| Jegysorok leírása | **Jegy** → Leírás Rich Text (legacy sima szöveg is működik) |
| Jogi szöveg a narancs kártyán | **Oldal (Page)** `info` → `pageBody` Rich Text |
| Bal oldali info blokkok | **Oldal** `info` → **Rugalmas szekciók** → Szövegdoboz / Rich Text |
| GYIK | **Oldal** `info` → **GYIK / FAQ** (Rich Text válaszok, linkekkel) |
| Helyszín térkép | **Helyszín** → embed URL + leírás Rich Text |

**Rich Text linkek:** jelöld ki a szöveget → Link → URL (külső link új lapon nyílik).

---

*Utolsó frissítés: R3 főoldal szerkesztő + R4 program sor layout — 2026-06-05*
