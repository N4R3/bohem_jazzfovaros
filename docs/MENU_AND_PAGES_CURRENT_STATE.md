# Menü és oldalak — jelenlegi állapot

Ez a dokumentum az **új CMS-bővítés utáni állapotot** írja le.

## Mit tud most az ügyfél a Sanity Studio-ból?

### Oldal-tartalom

- ✅ Az **összes oldal** (home, info, lineup, program, contact, szallas, terkep, futas, tabor, aszf) Hero címét és leírását szerkeszteni
- ✅ Az **összes oldalra** szabad szöveges fő tartalmat írni (`Oldal tartalom – HU/EN` mező a Page dokumentumon) — ez a Hero alatt, a kártyás tartalom FÖLÖTT jelenik meg
- ✅ Új információs oldalt létrehozni tetszőleges sluggal, amely a `/oldal/[slug]` URL-en jelenik meg

### Menü

- ✅ Menüpontot átnevezni
- ✅ Menüpont sorrendet állítani (`order` mező)
- ✅ Menüpontot el-/megjeleníteni külön header-ben és footerben
- ✅ Külső / belső linkkel menüpontot beilleszteni
- ✅ Új információs oldalt menübe rakni

### Program

- ✅ **Strukturált programot** kezelni (Program tételek listája)
- ✅ **Szabad szöveges programot** írni (Pages → Program → Program – szabad szöveg)
- ✅ Megjelenítési módot választani: csak strukturált / csak szabad szöveg / mindkettő
- ✅ Egy fellépőt több időponthoz kapcsolni (több Program tétel ugyanazzal a Performer ref-fel)

### Színpadok / helyszínek

- ✅ Saját Stage dokumentumokat felvenni (Nagysátor, Beach stb.)
- ✅ Program tételeknél listából választani (`stageRef`)
- ✅ A frontend pontosan a választott nevet jeleníti meg — **nincs** hardcode-olt átírás

### Fellépők és címkék

- ✅ Fellépő-címkéket (műfajokat) felvenni
- ✅ Egy fellépőhöz több címkét rendelni
- ✅ A kártyán a címkék jelennek meg (max. 3); ha nincs, semmi
- ✅ A `shortDescription` immár szövegként jelenik meg, **nem** tag-ként

## Mit NEM tud még?

- ❌ Új fix domainoldal (külön route) saját dizájnnal — csak a `/oldal/[slug]` általános sablonon megy
- ❌ Komplex page builder (kártyák, táblázatok, képgaléria) — kizárólag szabad szöveggel + Hero-val
- ❌ Almenü-lenyíló (a `parent` mező a schemán létezik, a frontend most lapos szerkezetet rajzol)
- ❌ Saját Sanity szerepkörök (a Free csomag korlátaitól függ)

## Új schema típusok

| Schema | Cél |
|---|---|
| `navigationItem` | Header / footer menüpontok |
| `stage` | Színpadok / helyszínek |
| `performerTag` | Fellépő címkék / műfajok |

## Bővített schema típusok

| Schema | Új / módosított mezők |
|---|---|
| `page` | `pageBodyHu`, `pageBodyEn`, `programDisplayMode`, `programBodyHu`, `programBodyEn`, body mezők elrejtve |
| `performer` | `tags` array reference |
| `programItem` | `stageRef` reference (legacy `stage` szöveges mező megmaradt fallback-ként) |

## Hogyan működik a fallback?

Minden CMS-bővítés úgy lett megírva, hogy ha a Sanity nem ad adatot:
1. A frontend **a kódbeli statikus adatokra** esik vissza (`hu.ts` / `en.ts`)
2. **Soha nem üres**, soha nem 404 az ismert oldalakon
3. Az új `/oldal/[slug]` route 404-et ad, ha nincs Sanity-ben aktív Page az adott sluggal

## Részletes útmutató

**Lásd: [docs/CMS_EDITOR_GUIDE_JAZZFOVAROS.md](./CMS_EDITOR_GUIDE_JAZZFOVAROS.md)**
