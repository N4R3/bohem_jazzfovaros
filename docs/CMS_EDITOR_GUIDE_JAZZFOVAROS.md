# CMS szerkesztői útmutató — Bohém Jazzfőváros / Jazz Capital

Ez a dokumentum végigvezet a **Sanity Studio** használatán: oldalak, menü, program, fellépők és kapcsolódó tartalmak szerkesztése. A cél, hogy a honlap szövegeit és listáit biztonságosan, előnézet nélkül is következetesen lehessen karbantartani.

| | |
|---|---|
| **Verzió** | 1.1 · 2026-05-01 |
| **Célcsoport** | Tartalomszerkesztők, ügyfél-adminisztrátorok |
| **Technikai háttér** | `docs/SANITY_CMS_SETUP.md`, fejlesztői részletek: `docs/SANITY_FIELD_BINDING_AUDIT.md` |

**Studio:** https://bohemjazz.netlify.app/studio  
**Élő honlap:** https://bohemjazz.netlify.app/

---

## Tartalomjegyzék

1. [Gyors összefoglaló](#1-gyors-összefoglaló)
2. [A Studio felépítése](#2-a-studio-felépítése)
3. [Oldalak (Pages)](#3-oldalak-pages)
4. [Új információs oldal](#4-új-információs-oldal)
5. [Menü (Navigáció)](#5-menü-navigáció)
6. [Program](#6-program)
7. [Fellépők](#7-fellépők)
8. [Színpadok / helyszínek](#8-színpadok--helyszínek)
9. [Mit ne módosíts?](#9-mit-ne-módosíts)
10. [Felhasználók és jogok](#10-felhasználók-és-jogok)
11. [Mentés, publikálás, megjelenés](#11-mentés-publikálás-megjelenés)
12. [Seed import és tartalom-ellenőrzés (fejlesztő)](#12-seed-import-és-tartalom-ellenőrzés-fejlesztő)
13. [Hibaelhárítás](#13-hibaelhárítás)

---

## 1. Gyors összefoglaló

- **Publish kötelező:** amíg **Publish**-olsz, a látogatók **nem** látják a változást — csak a piszkozat létezik.
- **Aktív dokumentum:** a Page dokumentumnál az **Aktív** kapcsolónak be kell lennie kapcsolva (`isActive`), különben az adott slug Sanity-tartalma **nem** töltődik be az új dinamikus oldalakra; fix útvonalak ettől még elérhetők lehetnek fallback tartalommal.
- **HU és EN:** ahol külön mező van (HU / EN), mindkettőt érdemes kitölteni — az angol oldal (`/en/`…) az EN mezőket használja, hiány esetén visszaesik a HU szövegre (ahol a kód így van bekötve).
- **„Honlap tele, Studio üres”:** sok lista és szöveg **fallback**: üres Sanity mező esetén a honlap a **forráskódban tárolt** magyar/angol szöveget mutatja. Ez nem összekötési hiba. Kitöltés + **Publish**, vagy egyszeri **seed import** (lásd §12).
- **Gyors megnyitás tábor / futás:** bal menü → **⚡ Jazztábor — Page** vagy **⚡ Futás — Page** (szűrt lista, csak a megfelelő slug dokumentumai).

---

## 2. A Studio felépítése

A bal oldali menüben fentről lefelé:

1. **⚙️ Site settings** — globális beállítások (jegylink, social, házirend, kapcsolat)
2. **🔔 Popup settings** — főoldali Széchenyi popup
3. **🧭 Navigáció / Menü** — fejléc + footer menüpontok
4. **📄 Oldalak (Pages)** — a 10 fix + tetszőleges új oldal tartalma  
   - **⚡ Jazztábor — Page (slug: tabor)** — csak `tabor` slugú Page dokumentumok listája  
   - **⚡ Futás — Page (slug: futas)** — csak `futas` slugú Page dokumentumok listája
5. **📅 Program tételek** — strukturált program lista
6. **🎤 Színpadok / helyszínek** — Main Stage, Club Stage stb.
7. **🎷 Fellépők** — performer adatok
8. **🏷️ Fellépő címkék / műfajok** — műfaj-badge-ek
9. **🎟️ Jegyek**
10. **🏨 Szállás**, **🚗 Közlekedés**, **🤝 Támogatók**, **🗂️ Támogatói kategóriák**, **📍 Helyszín (Venue)**

---

## 3. Oldalak (Pages)

**Hol:** Bal menü → 📄 **Oldalak (Pages)** (vagy a fenti ⚡ gyors linkek).

A 10 fix oldal mindegyikéhez tartozik egy Page dokumentum (slug: `home`, `info`, `lineup`, `program`, `contact`, `szallas`, `terkep`, `futas`, `tabor`, `aszf`).

### 3.1 Slug-hoz igazodó mezők

A Studio **nem minden oldalon mutatja az összes mezőt**. A **Slug** értékétől függ, mely blokkok látszanak (pl. program-mód csak `program` esetén; tábor-program blokkok csak `tabor` esetén).

Ha egy várt mező hiányzik: ellenőrizd, hogy a dokumentum **Slug** mezője pontosan a kívánt érték (`tabor`, `futas`, stb.).

**„A honlap tele van, a Studio meg üres”** — gyakran **nem hiba:** listák és táblázatok esetén az **üres Sanity** azt jelenti, hogy az oldal a **kódbeli alapszöveget** mutatja. Ugyanaz a tartalom a Studioban akkor jelenik meg, ha kitöltöd és **Publish**-olsz, vagy lefut az inicializáló import (**§12**).

### 3.2 Közös mezők

| Mező | Hatás |
|---|---|
| **Cím (HU/EN)** | Belső lista + admin; a **Program** oldal nagy fejléce a **Cím (HU/EN)** mezőből jön (nem a „Hero cím” mezőből). |
| **Slug (URL)** | A 10 fix oldalon **ne változtasd** — eltörhetnek a linkek. |
| **Hero cím (HU/EN)** | Nagy cím (kivéve: `home`, `program`, `lineup` — ott más szabály vonatkozik a látható címre). |
| **Hero leírás (HU/EN)** | Alcím / bevezető (kivéve: `home`, `lineup`). |
| **Oldal tartalom – HU/EN** | Hero alatti első szabad szöveg (kivéve: `home`, `program`, `lineup`). Üres = ez a blokk nem jelenik meg. |
| **SEO beállítások** | Meta cím, leírás, OG kép. |

**Program** oldal további mezői (csak `program` slug mellett): **Program megjelenítési mód**, **Program – szabad szöveg (HU/EN)** — lásd [§ Program](#6-program).

> **Tipp:** Üres sor új bekezdést jelez. A `https://…` URL-ek a honlapon kattinthatóvá válnak.

### 3.3 Jazztábor (`tabor`)

Csak **slug = `tabor`** mellett látszanak ezek a mezők. Kitöltés → tartalom **Sanity-ből**; üres lista / üres mező → **fallback** a kódbeli magyar/angol szövegre.

| Mezőcsoport | Mit állítasz? |
|---|---|
| **Tábor — szürke sor felett (HU/EN)** | „Eyebrow” a legtetején (pl. *Swing · Lindy Hop …*). Üres = alapértelmezés. |
| **Tábor — szekció főcím (HU/EN)** | Cím a programkártyák fölött (pl. *Tanárok és program (2026)*). Üres = kódbeli cím. |
| **Tábor — program blokkok (kártyák)** | Minden elem egy kártya: **cím** + **lista** (HU és EN: soronként egy pont, Enter). Tanárok, díjak, napi menetrend, záró nap stb. **Üres tömb** = statikus menetrend marad. |
| **Tábor — támogatók blokk címe (HU/EN)** | Kis cím a támogatók felett. Üres = „Támogatók” / „Supporters”. |
| **Tábor — támogatók (linkek)** | Név + URL. Legalább egy elem → **felülírja** a statikus listát. Üres → statikus lista. |
| **Második szöveg doboz megjelenítése** + **Második szöveg – HU/EN** | Videó alatti hosszú szöveg: csak akkor írja felül a kódbeli tábor-leírást, ha a kapcsoló **BE** van kapcsolva **és** van szöveg a második dobozban. |
| **Elsődleges / másodlagos gomb** | Narancs CTA + opcionális második gomb (HU/EN felirat és URL). Üres → statikus jelentkezési link. |

**Megjelenési sorrend a `/tabor/` oldalon:** Hero → opcionális **Oldal tartalom** → videó → **második doboz** vagy **statikus leírás** → **Jelentkezés** gomb → programkártyák → támogatók.

### 3.4 Futás (`futas`)

Csak **slug = `futas`** mellett látszanak. **Fallback** szabály ugyanúgy érvényes.

| Mezőcsoport | Mit állítasz? |
|---|---|
| **Futás — eyebrow (HU/EN)** | Fejléc feletti sor (pl. dátum · idő). Üres = statikus. |
| **Futás — narancs szalag (HU/EN)** | Ingyenes belépő kiemelés. Üres = statikus. |
| **Futás — kártyák (Dátum / Időpont / Helyszín)** | Három infókártya; az idő egy közös mező (nyelvfüggetlen). Üres = statikus. |
| **Futás — táblázat fejléc (HU/EN)** | A távok táblázat címe. Üres = „Távok & Díjak” / „Distances & fees”. |
| **Futás — távok sorai** | Soronként kategória, táv, díj (HU + EN). Van sor → **felülírja** a statikus táblázatot. |
| **Futás — nevezési határidő / eredmény szöveg** | Alsó szövegdobozok. Üres = statikus. |
| **Második szöveg doboz – HU/EN** | Hosszú futás-leírás. **Ha ki van töltve**, megjelenik (**nem** szükséges hozzá a „második doboz megjelenítése” kapcsoló — az elsősorban a táborhoz tartozik). Üres = statikus `running.description`. |
| **Elsődleges / másodlagos gomb** | Nevezés + opcionális második link. |

### 3.5 Példa: Jazztábor

1. Nyisd meg a **slug: tabor** dokumentumot (**⚡ Jazztábor — Page** vagy Pages lista).
2. **Hero cím / Hero leírás** — nagy cím és alcím.
3. **Oldal tartalom** — opcionális szöveg a videó **felett**.
4. **Tábor — program blokkok** — blokk = kártya; listák Enterrel soronként.
5. **Tábor — támogatók** — név és link.
6. **Második szöveg doboz** — kapcsoló BE + szöveg, ha a videó alatti leírást innen adnád.
7. **Publish**.

### 3.6 Példa: Futás

1. Nyisd meg a **slug: futas** dokumentumot (**⚡ Futás — Page**).
2. **Hero**, szükség szerint **Oldal tartalom** (rövid bevezető).
3. **Narancs szalag**, **kártyák**, **távok sorai**, **határidő**, **eredmény** szövegek — igény szerint.
4. **Második szöveg doboz** — hosszú leírás (nevezés, díjak, póló stb.).
5. **Publish**.

---

## 4. Új információs oldal

**Hol:** 📄 **Oldalak (Pages)** → **Create**.

1. **Cím (HU)** — pl. „Sajtószoba”
2. **Slug** — kisbetű, kötőjel: pl. `sajto`
3. **Hero cím / leírás**
4. **Oldal tartalom (HU/EN)**
5. **Aktív** bekapcsolva
6. **Publish**

Az új oldal útvonala: **`/oldal/<slug>/`** (pl. `/oldal/sajto/`), illetve angol nézetben az oldal nyelvi útvonal-prefixével.

### Menübe tétel

Lásd [§ Menü](#5-menü-navigáció).

> A 10 fix slug **saját React oldalt** kap. Az új slugok az **egyszerű** `/oldal/[slug]` sablont használják (Hero + szöveg). Összetettebb dobozok / táblázat ehhez a sablonhoz csak fejlesztéssel bővíthető.

---

## 5. Menü (Navigáció)

**Hol:** 🧭 **Navigáció / Menü**.

| Mező | Mire való |
|---|---|
| **Felirat (HU/EN)** | Amit a látogató lát |
| **Belső oldal (Page)** | Ajánlott: innen képződik az útvonal |
| **Saját URL** | Ha nem Page-re mutat (pl. `/info/#gyik`) |
| **Külső link** | Teljes `https://…` URL; új ablakban nyílik |
| **Új ablakban nyíljon** | Belső linknél opcionális |
| **Sorrend** | Kisebb szám = előrébb |
| **Aktív** | Kikapcsolva sehol sem látszik |
| **Megjelenik a fejlécben / footerben** | Elhelyezkedés |

**Új menüpont:** Create → felirat → Page kiválasztása → sorrend → header/footer → Publish.

> **Fallback:** Ha minden menü el van rejtve, a honlap egy **kódbeli alapértelmezett** menüt mutat, hogy üres header ne maradjon.

---

## 6. Program

### Strukturált lista

**Hol:** 📅 **Program tételek**.

Mezők: cím vagy fellépő, dátum, kezdés, **Színpad (stageRef)**, opcionálisan vég, kategória, leírás, fellépők.

### Szabad szöveg

**Pages → Program (`program`):**

- **Program – szabad szöveg (HU/EN)**
- **Program megjelenítési mód:** adatbázis lista / csak szöveg / mindkettő

### Egy fellépő több időponton

Külön Program tétel minden időpontra; mindegyikben ugyanaz a Performer hivatkozás.

---

## 7. Fellépők

**Hol:** 🎷 **Fellépők**.

| Mező | Hatás |
|---|---|
| **Név** | Kártyacím |
| **Kép** | Kártyakép |
| **Rövid leírás (HU/EN)** | Nem műfaj-címke |
| **Címkék / műfajok** | Badge-ek (max. ~3 látható a kártyán) |
| **Bio (HU/EN)** | Részletes szöveg |
| **Linkek** | Web, közösségi |
| **Sorrend** | Kisebb szám = előrébb |

**Új címke:** 🏷️ **Fellépő címkék** → Create → Publish → Performer dokumentumban hozzárendelés.

---

## 8. Színpadok / helyszínek

**Hol:** 🎤 **Színpadok / helyszínek**.

A honlap **pontosan** azt a nevet jeleníti meg, amit ide írsz — Program tételeknél ez látszik a színpadnévként.

---

## 9. Mit ne módosíts?

| Elem | Miért? |
|---|---|
| **Slug a 10 fix oldalon** | Linkek törnek |
| **Több Page ugyanazzal a sluggal** (pl. két `tabor`) | A frontend egyik dokumentumát választja — kerüld |
| **Performer `imagePath`** | Legacy; új kép → **`image`** mező |
| **Sponsor `logoPath`** | Legacy; új logó → **`logo`** |
| **Page `bodyHu/bodyEn` (Portable Text)** | Nem használt a honlapon; helyette **`pageBodyHu/En`** |
| **siteSettings dokumentum törlése / klónozása** | Globális törés |

---

## 10. Felhasználók és jogok

- **Viewer (read-only):** látható a Studio, **Publish / szerkesztés** nem.
- **Editor / Admin:** meghívás a https://www.sanity.io/manage → **Members** → **Invite member**.

Átadáskor: Sanity tulajdonjog, Netlify, GitHub, domain dokumentáció — egyeztetés szerint.

---

## 11. Mentés, publikálás, megjelenés

- **Save** = piszkozat gépen / Sanity-ban tárolva.
- **Publish** = változás **élő API-n** — a honlap ezt olvassa be következő lekéréskor.
- Tipikus késleltetés: **~30 másodperc** (Netlify ISR). Frissítés: **Ctrl+F5**.

---

## 12. Seed import és tartalom-ellenőrzés (fejlesztő)

**Mikor kell:** új Sanity projekt, vagy amikor a Page dokumentumokban hiányoznak a tábor/futás listák, de a honlap fallback miatt „teljesnek” tűnik.

**Parancs:** `npm run sanity:seed`

**Környezet (`.env.local`):**

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET` (általában `production`)
- `SANITY_API_WRITE_TOKEN` (írási jog)

A script a seedben lévő dokumentumokat **`createOrReplace`**-tel írja — egyező `_id` esetén **felülírja** a tartalmat. Csak megbízható gépen, biztonságos tokennel futtasd.

**Ellenőrzés:** `npm run sanity:check-content` — többek között jelzi, ha `tabor`/`futas` Page-en üres a programblokk vagy a futás táblázat (**Sanity üres, fallback megy**).

---

## 13. Hibaelhárítás

| Jelenség | Mit nézz |
|---|---|
| Változás nem látszik a honlapon | **Publish** megtörtént-e; **~30 mp** várakozás; **Ctrl+F5** |
| Studio üres, honlap nem | **Fallback** — töltsd ki a mezőket **vagy** futtasd **§12** seedet |
| Hiányzó mező a szerkesztőben | **Slug** helyes-e (`tabor` / `futas`); nem más dokumentumtípus |
| Angol oldal rossz szöveg | **EN mezők** kitöltése |
| Menü nem mutat új oldalt | Navigációban **Page** hivatkozás, **Aktív**, **Publish** |
| Vision / lekérdezés | Studio **Vision** (ha engedélyezett) — GROQ teszt |

További technikai hiba: fejlesztő / `SANITY_FIELD_BINDING_AUDIT.md`.
