# Tartalomszerkesztési útmutató

Ez a dokumentum megmutatja, hol és hogyan szerkesztheted az oldal szövegeit, képeit és adatait, programozói tudás nélkül.

---

## Magyar szövegek

**Fájl:** `src/content/hu.ts`

**Angol szövegek:** `src/content/en.ts`

### Főoldal hero szövege

A hero szövegei közvetlenül a `src/components/home/Hero.tsx` fájlban szerkeszthetők (statikus design):

```tsx
// src/components/home/Hero.tsx
<h1>BOHÉM<br/>JAZZFŐVÁROS</h1>

<span>Kecskemét, Domb Beach</span>
<span>2026. AUGUSZTUS 6–9.</span>

<Link href={ctaUrl}>{ctaLabel}</Link>
```

A CTA gomb felirata a `src/content/hu.ts` → `home.heroCta` mezőből jön.
A cím és dátum jelenleg fix szöveg a Hero.tsx-ben.

---

### Navigációs menü

```ts
nav: [
  { label: "Főoldal",       href: "/" },
  { label: "Fellépők",      href: "/lineup/" },
  { label: "Programok",     href: "/program/" },
  { label: "Jegyek & Infó", href: "/info/" },
  { label: "Szállás",       href: "/szallas/" },
  { label: "Térkép",        href: "/terkep/" },
  { label: "Jazztábor",     href: "/tabor/" },
  { label: "Futás",         href: "/futas/" },
  { label: "Kapcsolat",     href: "/contact/" },
],
```

Új menüpont hozzáadásához add be a `{ label: "Felirat", href: "/url/" }` sort a listába.

---

### Jegyárak

```ts
// src/content/hu.ts → info.ticketTiers
ticketTiers: [
  { label: "HOT Super Early Bird bérlet (első 200 vásárlónak ajándék fesztiválszékkel)", price: "19 900 Ft", highlight: true },
],
```

- `highlight: true` → narancssárga „HOT" badge jelenik meg mellette
- Jelenleg csak ez az egy jegytípus jelenik meg az oldalon.

---

### Szponzorok és partnerek

**Fájl:** `src/content/base.ts` (HU és EN közös)

```ts
sponsors: {
  main: [
    { name: "Kecskemét MJV", logo: "/images/sponsors/kecskemet.png", url: "https://kecskemet.hu" },
    // ...
  ],
  sponsors: [
    { name: "Tesco", logo: "/images/sponsors/tesco.png", url: "#" },
    // ...
  ],
  partners: [
    { name: "Bartók Rádió", logo: "/images/sponsors/bartok.png", url: "#" },
    // ...
  ],
},
```

- Logo képek helye: `public/images/sponsors/`
- Az `url` mező a kattintható linkre mutat (`"#"` = nincs link)
- Logó hozzáadása: tedd a képet a `public/images/sponsors/` mappába, majd add hozzá a listához

---

### Fellépők listája

**Fájl:** `src/content/base.ts` → `artists` tömb (HU és EN közös alap),  
HU fordítás: `src/content/hu.ts` → `lineup.artists`

```ts
// src/content/base.ts
{ name: "Bérczesi Jazz Band", genre: "Classic Jazz", bio: "", day: "friday",
  stage: "main", time: "18:00", origin: "Magyarország",
  image: "/images/gallery/bands/7087.jpg" },
```

- `day`: `"thursday"` / `"friday"` / `"saturday"` / `"sunday"`
- `stage`: `"main"` / `"club"`
- `image`: portré kép útvonala a `public/` mappától (pl. `/images/gallery/bands/xxx.jpg`)

---

## Képek cseréje

### Hero háttérképek

| Fájl neve | Mikor látszik |
|-----------|---------------|
| `public/images/header_phone1.png` | Mobilon (max. 959px) |
| `public/images/header_normal1.png` | Tableten és asztali képernyőn |
| `public/images/header_wide1.png` | Ultra-széles monitoron (2:1 arány felett) |

A képet egyszerűen felülírhatod a megfelelő fájlnévvel.

### Hero logo badge

**Fájl:** `public/images/header_logo.png`

Ez a kép jelenik meg a hero bal oldalán, a szöveg felett.  
Felülírható bármikor — az oldal automatikusan az új képet tölti be.

### Széchenyi Terv popup

**Fájl:** `public/images/szechenyi-terv.png`

Csak az első látogatáskor jelenik meg a főoldalon. A popup logikája:
- `localStorage`-ban tárolja, hogy a látogató már látta-e
- Ha törlöd a `szechenyi_popup_seen` kulcsot a böngészőből, újra megjelenik

A popup képének útvonala a `src/content/hu.ts` és `src/content/en.ts` fájlban állítható:

```ts
szechenyiImage: "/images/szechenyi-terv.png",
```

---

## Házirend PDF

**Fájl:** `public/documents/hazirend.pdf`

A "Házirend" link a footerben erre a fájlra mutat.

A PDF útvonala a `src/content/hu.ts` és `src/content/en.ts` fájlban állítható:

```ts
houseRulesPdf: "/documents/hazirend.pdf",
```

Ha módosul, cseréld le a fájlt a `public/documents/` mappában.

---

## Domain és nyelv

- `jazzfovaros.hu` → magyar oldal (alapértelmezett: `src/content/hu.ts`)
- `jazzcapital.hu` → angol oldal (alapértelmezett: `src/content/en.ts`)

A nyelv domain alapján automatikusan detektálódik (szerver oldalon).  
A látogató a nyelvváltó gombbal kézzel is választhat, ez cookie-ba kerül és felülbírálja a domain alapú detektálást.

---

## Hol találom a komponenseket?

| Oldal/komponens | Fájl |
|-----------------|------|
| Főoldal | `src/app/page.tsx` |
| Hero szekció | `src/components/home/Hero.tsx` |
| Info / Jegyek oldal | `src/app/info/page.tsx` |
| Fellépők oldal | `src/app/lineup/page.tsx` |
| Programok oldal | `src/app/program/page.tsx` |
| Footer | `src/components/home/Footer.tsx` |
| Széchenyi popup | `src/components/home/SzechenyiPopup.tsx` |
| Aloldalak kerete | `src/components/layout/BeachPageShell.tsx` |
