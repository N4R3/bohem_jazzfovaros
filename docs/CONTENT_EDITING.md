# Tartalomszerkesztési útmutató (nem programozóknak)

Ez az útmutató azt mutatja meg, **pontosan hol** tudod szerkeszteni az oldal tartalmát.
Ha csak szöveget, linket, képet vagy logót cserélnél, ezt a fájlt kövesd.

---

## 1) Nyelvi tartalmak (HU / EN)

- Magyar szövegek: `src/content/hu.ts`
- Angol szövegek: `src/content/en.ts`

Itt tudod átírni például:
- menüpontok (`nav`)
- jegyek (`info.ticketTiers`)
- főoldali gombfeliratok (`home.heroCta`, stb.)
- footer jogi linkek (`footer.legalLinks`)
- Házirend PDF útvonal (`houseRulesPdf`)

---

## 2) Főoldali Hero (cím, badge-ek, gomb, logó)

- Komponens: `src/components/home/Hero.tsx`
- Hero logó fájl: `public/images/header_logo.png`

Itt van fixen:
- `BOHÉM / JAZZFŐVÁROS` cím
- `Kecskemét, Domb Beach`
- `2026. AUGUSZTUS 6–9.`

A **Jegyvásárlás gomb felirata** a tartalomfájlból jön (`home.heroCta`), a gomb kinézete a `Hero.tsx`-ben van.

---

## 3) Hero háttérképek (mobil / normál / wide)

Háttérképek helye:
- `public/images/header_phone1.png`
- `public/images/header_normal1.png`
- `public/images/header_wide1.png`

CSS beállítás:
- `src/app/globals.css`

Megjelenés logika:
- mobil: `header_phone1.png`
- normál desktop/tablet: `header_normal1.png`
- ultra-wide: `header_wide1.png`

Ha képet cserélsz, ugyanazzal a fájlnévvel írd felül.

---

## 4) Navigációs menü

- HU: `src/content/hu.ts` -> `nav: [...]`
- EN: `src/content/en.ts` -> `nav: [...]`

Egy menüpont formátuma:

```ts
{ label: "Kapcsolat", href: "/contact/" }
```

---

## 5) Jegyek szerkesztése

- HU: `src/content/hu.ts` -> `info.ticketTiers`
- EN: `src/content/en.ts` -> `info.ticketTiers`

Egy jegysor formátuma:

```ts
{ label: "HOT Super Early Bird bérlet (első 200 vásárlónak ajándék fesztiválszékkel)", price: "19 900 Ft", highlight: true }
```

---

## 6) Támogatók / szponzorok / partnerek

- Adatforrás: `src/content/base.ts` -> `sponsors`
- Megjelenítés: `src/components/home/Footer.tsx`

Kategóriák:
- `main`
- `sponsors`
- `partners`

Egy elem formátuma:

```ts
{ name: "Bartók Rádió", logo: "/images/gallery/menu/1416-5177.png", url: "https://mediaklikk.hu/bartok/" }
```

Fontos:
- A `logo` mező mindig **`/images/...`** formátum legyen.
- A `url` a kattintás célja.
- Ha nincs jó URL, ideiglenesen saját belső oldal is megadható, de ne hagyj törött linket.

Jelenlegi logók mappája:
- `public/images/gallery/menu/`

---

## 7) Fellépők adatai

- Alap lista: `src/content/base.ts` -> `artists`
- Lokalizált lista: `src/content/hu.ts` és `src/content/en.ts` -> `lineup.artists`
- Fellépő oldal komponens: `src/app/lineup/page.tsx`

Egy alap artist példa:

```ts
{ name: "Bérczesi Jazz Band", image: "/images/gallery/bands/7087.jpg", genre: "Classic Jazz" }
```

---

## 8) Házirend PDF

- Fájl helye: `public/documents/hazirend.pdf`
- Tartalomfájl hivatkozás:
  - `src/content/hu.ts` -> `houseRulesPdf`
  - `src/content/en.ts` -> `houseRulesPdf`

Példa:

```ts
houseRulesPdf: "/documents/hazirend.pdf"
```

A link új lapon nyílik.

---

## 9) Széchenyi Terv popup

- Komponens: `src/components/home/SzechenyiPopup.tsx`
- Kép útvonala (fix):
  - `/images/43e3a57583f727d87fb1271bb22963ef.jpg`
- Fizikai fájl:
  - `public/images/43e3a57583f727d87fb1271bb22963ef.jpg`

Működés:
- csak főoldalon jelenik meg
- sessionönként egyszer
- kulcs: `szechenyiPopupShown` (`sessionStorage`)

---

## 10) Domain és nyelv

- `jazzfovaros.hu` -> alapértelmezett HU
- `jazzcapital.hu` -> alapértelmezett EN

Logika helye:
- `src/lib/locale.ts`

---

## 11) Gyors "mit hol" lista

- Főoldal: `src/app/page.tsx`
- Hero: `src/components/home/Hero.tsx`
- Info/Jegyek oldal: `src/app/info/page.tsx`
- Fellépők oldal: `src/app/lineup/page.tsx`
- Programok: `src/app/program/page.tsx`
- Footer + támogatók: `src/components/home/Footer.tsx`
- Széchenyi popup: `src/components/home/SzechenyiPopup.tsx`
- Globális stílusok: `src/app/globals.css`

---

## 12) Biztonsági tipp szerkesztéshez

Mielőtt mentesz:
- figyelj az idézőjelekre (`"..."`)
- vessző ne maradjon le
- útvonal mindig `/`-sel kezdődjön (`/images/...`)

Ha csak képet cserélsz ugyanazzal a fájlnévvel, kódot általában nem kell módosítani.
