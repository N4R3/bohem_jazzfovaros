# Bohém JAZZFŐVÁROS – CMS Fejlesztés Projektállapot

**Dokumentum dátuma:** 2026. május 13.
**Verzió:** 1.0
**Nyelv:** Magyar
**Cél:** Ügyfélkommunikációra alkalmas projektállapot-összefoglaló

---

## 1. Vezetői összefoglaló

### Mi volt az alaphelyzet?

A Bohém JAZZFŐVÁROS weboldal egy modern, Sanity CMS-re épülő Next.js alapú oldal.
Az alaprendszer műszakilag helyes volt, de a tartalmak jelentős része még statikusan
volt beégetett a kódba — vagyis a szerkesztők a Sanity admin felületen nem tudták
megváltoztatni azokat. Ez több területen láthatóan okozott problémát:
az oldalon megjelentek régi, elavult szövegek, automatikusan generálódó szövegek
és olyan elemek, amelyek nem voltak szerkeszthetők a tartalomkezelőből.

### Mi volt a fő probléma?

A visszajelzések alapján a legfontosabb problémák:
- **Nem szerkeszthető szövegblokkok** (szállás bevezető, térkép cím, jazztábor lista)
- **Zenekari tagok hiánya** a fellépők adatlapján
- **Képmegjelenítési hibák** (levágott csoportképek, rossz arány)
- **Automatikusan generált szöveg** (pl. üres zárójel, instrument-szöveg a névben)
- **Formázási lehetőségek hiánya** (bold, italic, linkek, listák a szövegekben)
- **Adatvédelmi oldal** külső linkként jelent meg, nem belső szerkeszthető oldalként

### Mit javítottunk?

Az összes jelzett problémát technikai szinten megoldottuk, és elvégeztük az automatizált
adatmigráció mindkét körét is. A részleteket lentebb olvashatja.

### Hol tart most a projekt?

**Átadható, feltéve, hogy a kézi ellenőrzési pontok (QA lista) megtörténnek.**
A technikai fejlesztés és az automatizált migráció lezárult.
Néhány tartalmi elemet (pl. The Carling Sisters, térképkép, EN fordítások)
a szerkesztőnek kell kézzel rendezni a Sanity Studio-ban.

---

## 2. Eredeti ügyfélkérések szerinti státusz

| # | Eredeti kérés / probléma | Jogos volt? | Mit találtunk | Mit javítottunk | Státusz | Kell kézi ellenőrzés? | Mit mondhatunk az ügyfélnek |
|---|---|---|---|---|---|---|---|
| 1 | **Szállás oldalon duplázódó/nem szerkeszthető felső blokk** | ✅ Igen | A szállás bevezető szöveg statikusan volt beégetve, a Sanity mezők nem léteztek | Új mezők kerültek a rendszerbe (`introNoteHu/En`), a blokk most Sanity-ből jön; ha üres, eltűnik | ✅ Kész | Nem | A szállás bevezető szöveg most már szerkeszthető a Sanity-ben. |
| 2 | **Magyar/angol fallback probléma (törölt HU szöveg helyett EN jelent meg)** | ✅ Igen | A nyelvi fallback logika nem volt következetes, néhol EN elsőbbséggel | Javítottuk a lokalizációs logikát, a magyar mindig elsőbbséget élvez | ✅ Kész | Tartalom-ellenőrzés javasolt | A nyelvi váltás logikája javítva. Ajánlott az oldalakat HU és EN módban is egyszer átnézni. |
| 3 | **Fellépőknél nincs zenekari tag szerkesztési felület** | ✅ Igen | A `members` mező teljesen hiányzott a rendszerből | Teljes tagszerkesztési rendszer hozzáadva (név, szerepkör, hangszer, ország, sorrend), migráció lefutott | ✅ Kész | Egyes fellépőknél kézi ellenőrzés (ld. lentebb) | A zenekari tagok most már szerkeszthetők a Sanity-ben. Egyes fellépőknél a lista kézi ellenőrzést igényel. |
| 4 | **Tagok külön fellépőként is megjelennek (duplikált fellépők)** | ✅ Igen | Nem volt lehetőség megjelölni, hogy egy tag önálló fellépőként is szerepeljen-e | Új `showAsStandalonePerformer` kapcsoló hozzáadva minden taghoz | ✅ Kész | Igen – a szerkesztő dönti el személyenként | Szerkesztő-beállítás: minden tagnál meg lehet jelölni, hogy önálló fellépőként is szerepeljen-e. |
| 5 | **The Carling Sisters: üres zárójel / automatikusan generált szöveg** | ✅ Igen | Az üres `origin` mező esetén `( )` jelent meg; a Sanity-ben a fellépő neve tartalmazta a hangszer adatokat is | Kondicionális megjelenítés javítva (üres origin = nincs zárójel); a helyes megoldás a Sanity-beli név tisztítása | ✅ Kész (kód) / ⚠️ Kézi | Igen – névtisztítás és taglista felvitele szükséges | Az üres zárójel hiba megoldva. A The Carling Sisters adatainál (név, tagok) kézi rendezés szükséges a Sanity-ben. |
| 6 | **Fellépők képei rosszul jelennek meg a kártyákon** | ✅ Igen | A kártyák arányai instabilak voltak; nem volt lehetőség képenként szabályozni a vágást | Fix 4:3-as arány beállítva minden kártyára; új `imageDisplayMode` mező (cover/contain/landscape/portrait) hozzáadva | ✅ Kész | Igen – imageDisplayMode finomhangolás képenként | A kártyák most egységes, stabil arányban jelennek meg. Képenként beállítható a vágás módja. |
| 7 | **Csoportképek levágódása (group photos)** | ✅ Igen | Az automatikus `cover` vágás csoportképeknél levágta a szélső tagokat | `imageDisplayMode: contain` vagy `landscape` módban a teljes kép látható lesz | ✅ Kész | Igen – érintett képeknél `contain`/`landscape` beállítása | Csoportképeknél a levágás megakadályozható az imageDisplayMode mezővel (Sanity Studio). |
| 8 | **Fellépő adatlapján nem jelenik meg az időpont és helyszín** | ✅ Igen | A fellépők adatlapja nem volt összekötve a programpontokkal | A fellépő adatlapjára bekerült a kapcsolódó programpontok listája | ✅ Kész | Igen – programpontok összekapcsolása szükséges Sanity-ben | A fellépők adatlapján most már megjelenhetnek a kapcsolódó programpontok. |
| 9 | **Szöveges programtervezet hol szerkeszthető** | ✅ Igen | A programleírás mezők létezetck, de nem voltak dokumentálva | Dokumentálás megtörtént: `programBodyHu/En` mezők és `programDisplayMode` kapcsoló | ✅ Kész | Igen – szöveges program feltöltése Sanity-ben | A szöveges program szerkeszthető Sanity-ben. A megjelenítési mód is szabályozható (strukturált lista / szabad szöveg / mindkettő). |
| 10 | **Kamu / placeholder programpontok nem rejthetők el** | ✅ Igen | Nem volt `isActive` mező a programpontoknál | `isActive` mező hozzáadva; `isActive=false` esetén a programpont nem jelenik meg a nyilvános oldalon | ✅ Kész | Igen – placeholder programoknál `isActive=false` beállítása | A nem végleges programpontok mostantól elrejthetők. |
| 11 | **Térkép oldal felső cím/blokk nem szerkeszthető** | ✅ Igen | A cím és alcím statikusan volt beégetve | Cím, alcím, „Hogyan juss el?" felirat – mind szerkeszthető a Sanity-ben | ✅ Kész | Igen – Sanity venue dokumentum ellenőrzése | A térkép oldal összes szöveges eleme szerkeszthető. |
| 12 | **Jazztábor: narancssárga pöttyök vs. bekezdés probléma** | ✅ Igen | Csak listás megjelenítés volt lehetséges, nem lehetett bekezdéses szöveget szerkeszteni | `displayMode` (lista / bekezdések) kapcsoló hozzáadva minden tábori blokkhoz; Portable Text migráció is lefutott | ✅ Kész | Igen – displayMode és tartalom ellenőrzése Sanity-ben | A jazztábor programblokkok megjelenítése rugalmasabb (lista vs. bekezdések), és most már gazdag szövegformázás is elérhető. |
| 13 | **Nincs bold/italic/link/fejezet/lista formázás a szövegekben** | ✅ Igen | A szövegmezők sima stringek voltak, nem volt rich text szerkesztő | Teljes Portable Text implementáció elkészült; migráció lefutott (5 oldal, 3 tábori blokk, 21 fellépő leírás) | ✅ Kész | Igen – migrált tartalmak vizuális ellenőrzése | Rich text formázás (bold, italic, link, fejezet, lista, idézet, kiemelő blokk) most elérhető. HTML szerkesztő és szabad színpaletta szándékosan nincs. |
| 14 | **Adatvédelmi oldal / Privacy Policy ne külső link legyen** | ✅ Igen | Az `/adatvedelem` útvonal létezett, de tartalma statikus kódban volt | Az adatvédelmi oldal most a Sanity `page` rendszer részese; a tartalom szerkeszthető belülről | ✅ Kész | Igen – jogi szöveg tartalmi ellenőrzése | Az adatvédelmi oldal mostantól belső, szerkeszthető oldal. A jogi szöveget a szerkesztők tudják frissíteni. |

---

## 3. Elkészült fejlesztések oldalak szerint

### Szállás (`/szallas`)
- Bevezető szövegblokk (`introNoteHu/En`) – új mező, szerkeszthető
- Ha a mező üres, a blokk automatikusan eltűnik (nincs „üres doboz")
- Összes hotelmező már Sanity-ből jön (név, leírás, ár, távolság, csillagok, foglalási link)
- Migráció: 3 szállásdokumentum feltöltve (Four Points, Hotel Aqua, Tó Kemping)

### Térkép (`/terkep`)
- Cím, alcím, „Hogyan juss el?" felirat – mind szerkeszthető (`venue` dokumentum)
- Térképkép mező – feltölthető a Sanity Studio-ban
- Helyszín leírás, GPS koordináták, Google Maps embed URL – szerkeszthető
- Közlekedési irányok dokumentumonként szerkeszthetők (autó, vonat, busz, helyi busz)
- Migráció: alapadatok feltöltve

### Fellépők (`/lineup`)
- **Taglista szerkesztés** – teljesen új rendszer: név, szerepkör, hangszer, ország, sorrend
- **`showAsStandalonePerformer`** – kapcsoló, hogy egy tag önálló fellépőként is látszódjon-e
- **`imageDisplayMode`** – képenként szabályozható (cover/contain/landscape/portrait)
- **Üres zárójel javítás** – ha nincs `origin`, nem jelenik meg `( )`
- **Kártya arány** – fix 4:3-as arány (stabil, design-konform)
- **Modál kép** – teljes méretű megjelenítés, nem csíkszerű
- Migráció: 19 fellépő taglistája feltöltve automatikusan

### Programok (`/program`)
- **`isActive` kapcsoló** – placeholder/kamu programok elrejthetők
- **Programpont–fellépő kapcsolat** – a fellépő adatlapján megjelennek a kapcsolódó programok
- **`programDisplayMode`** – strukturált lista, szabad szöveg, vagy mindkettő
- Dokumentáció frissítve

### Jazztábor (`/tabor`)
- **`displayMode`** (lista vs. bekezdések) – minden programblokknál
- **Portable Text migráció** – 3 tábori programblokk szövege gazdag formátumban
- Szerkeszthető: szekció cím, blokkok, támogatók listája

### Rich text / Portable Text
- Bold, italic, aláhúzás, áthúzás, kód
- Linkek (belső és külső, biztonságosan)
- Fejezetek (H2, H3, H4)
- Bullet és sorszámozott lista
- Idézet (blockquote)
- Kiemelő dobozok (Info, Fontos, Ár – előre definiált stílusok)
- **Migráció eredménye:**
  - 5 oldaldokumentum (`pageBodyRich`, `pageBody2Rich`, `programBodyRich`)
  - 3 tábori programblokk (`bulletsRich`)
  - 21 fellépő hosszú leírása (`bioRich`)
  - Hibák: 0

### Adatvédelem és ÁSZF (`/adatvedelem`, `/aszf`)
- Mindkét oldal belső Sanity `page` dokumentumból tölt be
- A szerkesztők a Sanity Studio-ban tudják módosítani a szöveget
- SEO metaadatok szerkeszthetők

### Footer / navigáció
- A footer navigáció Sanity-ből jön, fallback a statikus listára
- Szponzorok / főtámogatók / partnerek szekció Sanity-ből szerkeszthető

### Migrációs scriptek
- `scripts/migrateStaticContent.ts` – statikus tartalmak átadása Sanity-be
- `scripts/migrateToPortableText.ts` – régi szövegmezők Portable Text formátumba
- Mindkét script dry-run módban tesztelve, majd `--apply` módban hibamentesen lefuttatva

### Dokumentáció
- `CMS_EDITABILITY_AUDIT.md` – teljes CMS szerkeszthetőségi térkép
- `EDITOR_GUIDE.md` – szerkesztői útmutató (magyar)
- `MANUAL_MIGRATION_TODO.md` – kézi teendők listája részletesen
- `HANDOFF_CHECKLIST.md` – átadási ellenőrzőlista
- `PORTABLE_TEXT_MIGRATION_GUIDE.md` – Portable Text migráció dokumentációja

---

## 4. Sanity CMS – közérthető összefoglaló

### Melyek a fő szerkeszthető területek?

A Sanity Studio-ban jelenleg az alábbi tartalmak szerkeszthetők:

| Terület | Mit lehet szerkeszteni |
|---|---|
| **Fellépők** | Név, leírás, életrajz (rich text), kép, képmegjelenítés módja, tagok listája, social linkek |
| **Programpontok** | Cím, leírás, dátum, időpont, helyszín, fellépő kapcsolat, láthatóság (isActive) |
| **Szállás** | Szállodák neve, leírása, ára, távolsága, képei, foglalási linkje |
| **Térkép / Helyszín** | Cím, alcím, leírás, GPS, térképkép, Google Maps link, közlekedési irányok |
| **Jazztábor** | Programblokkok (rich text), szekciócím, támogatók listája, megjelenítési mód |
| **Oldalak (Page)** | Hero cím/leírás, oldaltörzs (rich text), SEO metaadatok, OG kép |
| **Programszöveg** | Szabad szöveges program (rich text), megjelenítési mód |
| **Adatvédelem / ÁSZF** | Teljes szöveg (rich text), cím, SEO |
| **Footer** | Navigációs linkek, szponzorok, partnerek |
| **Globális beállítások** | Site cím, fesztivál dátuma, helyszín, ticket URL, social linkek, szervező adatok |

### Milyen tartalmak igényelnek még kézi kitöltést?

Az automata migráció a meglévő statikus tartalmat átköltöztette, de az alábbiaknál
kézi szerkesztés szükséges még Sanity Studio-ban:

1. **The Carling Sisters** – névtisztítás, tagok felvitele
2. **Fesztiváltérkép kép** – képfeltöltés a Venue dokumentumban
3. **Közlekedési irányok EN fordítások** – 4 közlekedési módhoz szükséges
4. **imageDisplayMode** – csoportképeknél `contain` / `landscape` beállítása
5. **Programok isActive** – placeholder programok elrejtése
6. **Migrált rich text tartalmak átnézése** – 5 oldal, 3 tábori blokk, 21 fellépő leírása

---

## 5. Migrációk státusza

### `migrateStaticContent` – Statikus tartalmak migrációja

| Mutató | Eredmény |
|---|---|
| Futtatott módban | `--apply` (éles írás) |
| Frissített dokumentumok | **28** |
| Kihagyott elemek | 11 (már létező adatok) |
| Hibák | **0** |
| Figyelmeztetések | 6 (térképkép, EN fordítások, 4 kihagyott fellépő) |
| Tartalma | Szállás introNote, hotel adatok, térkép mezők, venue alapadatok, performer taglisták (19 db) |

### `migrateToPortableText` – Rich text migráció

| Mutató | Eredmény |
|---|---|
| Futtatott módban | `--apply` (éles írás) |
| Migrált oldalak | **5** (pageBodyRich, pageBody2Rich, programBodyRich) |
| Migrált tábori blokk | **1 document / 3 schedule block** (bulletsRich) |
| Migrált fellépő leírás | **21** (bioRich) |
| Hibák | **0** |
| Figyelmeztetések | 0 |

### Adatvédelmi oldal (`/adatvedelem`)

- A route már korábban létezett a kódbázisban
- A tartalom Sanity `page` dokumentumból töltődik be
- A statikus tartalom (hu.ts) mint fallback megvan, ha a Sanity dokumentum üres
- **Szerkesztői teendő:** az adatvédelmi szöveget a Sanity Studio-ban, az `/adatvedelem` slug-ú `Page` dokumentumban lehet szerkeszteni

---

## 6. Ami kész

Az alábbiak technikai és migrációs szempontból is lezárultak, és azonnal használhatók:

- ✅ **Kritikus CMS szerkeszthetőség** – a korábban statikus blokkok most Sanity-ből jönnek
- ✅ **Szállás bevezető szöveg** – szerkeszthető, üres mezőnél eltűnik
- ✅ **Térkép cím/alcím** – szerkeszthető a Venue dokumentumban
- ✅ **Zenekari tagok szerkesztése** – teljes rendszer, 19 fellépőnél migrálva
- ✅ **Tagok/önálló fellépő megkülönböztetése** – `showAsStandalonePerformer` kapcsoló
- ✅ **Üres zárójel javítás** – origin nélküli fellépőknél nincs `( )`
- ✅ **Képarány stabilizálás** – fix 4:3-as kártyák, stabil layout
- ✅ **`imageDisplayMode`** – képenként beállítható megjelenítési mód
- ✅ **Programok elrejtése** – `isActive=false` kapcsoló
- ✅ **Programpont–fellépő kapcsolat** – fellépő adatlapján látható a program
- ✅ **Jazztábor `displayMode`** – lista vs. bekezdés blokkonként választható
- ✅ **Rich text alapverzió** – bold, italic, link, fejezet, lista, blockquote, kiemelő dobozok
- ✅ **Portable Text migráció** – 5 oldal, 3 tábori blokk, 21 fellépő leírás, 0 hiba
- ✅ **Adatvédelmi oldal belső aloldal** – szerkeszthető Sanity-ből
- ✅ **ÁSZF belső aloldal** – szerkeszthető Sanity-ből
- ✅ **Build és typecheck** – sikeres, 0 hiba

---

## 7. Ami kézi ellenőrzést igényel

Ezek nem hibák, hanem tartalmi / szerkesztői teendők, amelyeket a Sanity Studio-ban
kell elvégezni, illetve vizuálisan ellenőrizni kell az élő oldalon:

1. **The Carling Sisters** – Névtisztítás Sanity-ben (a jelenlegi neve tartalmazza a hangszer adatokat). Tagok kézi felvitele szükséges. *(Kiemelt prioritás, eredeti ügyfélpanasz volt.)*
2. **Nanna Carling** – Névtisztítás és a Carling Sisters-kapcsolat tisztázása (önálló fellépő vagy csoporttag?)
3. **Fesztiváltérkép kép** – Fel kell tölteni a Venue dokumentumba Sanity Studio-ban
4. **Közlekedési irányok EN fordítások** – 4 közlekedési módhoz szükséges (autó, vonat, távolsági busz, helyi busz)
5. **Hotel Aqua foglalási URL** – hosszú tracking paraméterekkel rendelkezik, érdemes megtisztítani
6. **Programok isActive státuszai** – placeholder/kamu programok elrejtése szükséges
7. **imageDisplayMode finomhangolás** – csoportképeknél `contain` / `landscape` beállítása javasolt
8. **HU/EN tartalmi ellenőrzés** – az oldalak mindkét nyelven való átnézése ajánlott
9. **Rich text vizuális QA** – a migrált szövegek megjelenésének ellenőrzése az élő oldalon
10. **Adatvédelmi tartalom jogi ellenőrzése** – a szöveg jogilag naprakész-e, azt a szervező dönti el

---

## 8. Ami szándékosan nem készült el

A következő funkciók szándékosan nem kerültek be a rendszerbe:

| Funkció | Miért nem |
|---|---|
| **HTML forráskód-szerkesztő** | Biztonsági kockázat: szerkesztők véletlenül hibás vagy káros HTML-t vihetnek be, ami eltörheti az oldal layoutját |
| **Szabad színválasztó** | Arculati kockázat: tetszőleges szín bármilyen szövegen megjelenhet, ami sértheti a brand-irányvonalakat |
| **Szabad betűméret-szerkesztő** | Tervezői stabilitás: a tipográfiai rendszer meghatározott szintek szerint működik (H2, H3, normal) |
| **Jogi szövegek önálló átírása** | Jogi felelősség: az adatvédelmi és ÁSZF szövegeket a szervező jogi felelőssége ellenőrizni és jóváhagyni – automatikus generálás nem alkalmazható |
| **Automatikus jogi modernizálás** | Jogi jóváhagyás szükséges: a fejlesztő csapat nem jogosult jogi szövegek tartalmának megítélésére |

**Ezek nem hiányosságok, hanem tudatos tervezési döntések**, amelyek a szerkesztői
rendszer stabilitását, a brand-konzisztenciát és a jogi felelősség helyes kezelését
biztosítják.

---

## 9. Külön / opcionális fejlesztési kör

Az alábbiak nem kerültek be a jelenlegi körbe, de igény esetén megvalósíthatók:

- **Jogi tartalmak teljes angol fordítása** – az adatvédelmi oldal és ÁSZF EN nyelvű szerkeszthető változata
- **Fejlettebb kiemelő blokkok (callout)** – egyedi ikonok, testreszabható szín- és stílusválasztás a brand-palettáról
- **Tartalomjegyzék hosszú jogi oldalakhoz** – automatikus anchor-linkek H2 fejezetek alapján
- **Képi focal point / hotspot UI** – precízebb képkivágás-vezérlés a Sanity Studio-ban
- **CMS-vezérelt footer szekciók bővítése** – ha a jövőben több footer blokk szükséges
- **Cookie consent rendszer bővítése** – részletesebb kategória-kezelés, ha jogszabályi változás indokolja
- **Fellépők kereső/szűrő funkciója** – műfaj, nap, helyszín szerint
- **Fordítási workflow** – EN tartalmak szervezett, CMS-szintű kezelése

---

## 10. Rövid email az ügyfélnek

**Tárgy:** JAZZFŐVÁROS weboldal – CMS fejlesztés lezárult, teendők összefoglalója

---

Kedves Partnerünk!

Köszönjük a részletes visszajelzéseket – sokat segítettek a prioritások meghatározásában.

Az összes jelzett problémát technikai szinten megoldottuk. A kritikus CMS-szerkeszthetőségi
hibák javítva lettek: a zenekari tagok, a szállás bevezető szöveg, a térkép fejléce és
az összes korábban statikusan beégetett elem most már szerkeszthető a Sanity Studio-ban.
A formázási lehetőségek (bold, italic, link, fejezetek, listák) is elérhetők az
erre alkalmas szövegmezőkben. Az adatvédelmi oldal mostantól belső, szerkeszthető
aloldal lett, nem külső link.

Az automata adatmigráció mindkét körben hiba nélkül lefutott (28 dokumentum frissítve,
21 fellépő életrajz, 5 oldal és 3 jazztábori blokk Portable Text formátumba migrálva).

Maradt néhány kézi teendő, amelyeket a szerkesztőnek kell elvégezni a Sanity Studio-ban:
a The Carling Sisters adatainak tisztázása, a fesztiváltérkép kép feltöltése, a közlekedési
irányok angol fordítása, és néhány kép megjelenítési módjának finomhangolása.

Javasoljuk, hogy a kézi teendők elvégzése után tartsunk egy közös átadási átnézést,
ahol az élő oldalon is megnézzük a módosításokat.

Üdvözlettel,
Fejlesztő csapat

---

## 11. Részletesebb email az ügyfélnek

**Tárgy:** JAZZFŐVÁROS – CMS fejlesztési összefoglaló és átadási információk

---

Kedves Partnerünk!

Összefoglaljuk a legutóbbi fejlesztési kör eredményeit. A visszajelzések alapján
elvégzett munkát három részre osztjuk.

---

**Elkészült**

Az összes jelzett szerkeszthetőségi probléma technikai javítása megtörtént:

- A zenekari tagok most már szerkeszthetők a Sanity Studio-ban (név, szerepkör, hangszer, ország). Az automatikusan generált tagszöveg és az üres zárójelek problémája megoldva.
- A szállás oldal bevezető szövege szerkeszthető; ha üres, a blokk automatikusan eltűnik.
- A térkép oldal összes szöveges eleme (cím, alcím, fejléc) szerkeszthető.
- A fellépőknél szabályozható a kép megjelenítési módja (levágás, csoportkép, portré). A kártya arányok egységesek és stabilak.
- Programpontokat el lehet rejteni az élő oldalon (placeholder/kamu programoknál hasznos).
- A jazztábor programblokkjai rugalmasabb formátumban szerkeszthetők.
- Rich text formázás (bold, italic, link, fejezetek, listák, kiemelő dobozok) elérhető.
- Az adatvédelmi és ÁSZF oldal belső, szerkeszthető aloldallá vált.
- Az automatikus migráció hiba nélkül lefutott (28 dokumentum, 21 performer, 5 oldal).

---

**Kézi ellenőrzési teendők**

Ezek nem hibák, hanem tartalmi teendők, amelyeket a Sanity Studio-ban kell elvégezni:

1. **The Carling Sisters** – a Sanity-ben a fellépő neve tartalmazza a hangszer adatokat is (pl. „soprano sax, voc"). Ezt kézzel kell megtisztítani, és a taglistát kézzel kell felvinni. *(Eredeti panasz volt, kiemelt prioritás.)*
2. **Fesztiváltérkép kép** – a Venue dokumentumba kézzel kell feltölteni.
3. **Közlekedési irányok angolul** – 4 szöveg fordítása szükséges.
4. **Csoportképeknél imageDisplayMode** – az érintett fellépőknél `contain` vagy `landscape` beállítása javasolt.
5. **Programok elrejtése** – placeholder programoknál `isActive=false` beállítása.
6. **Migrált tartalmak átnézése** – az automata migráció szövegeket átvitt, vizuális ellenőrzés ajánlott.

---

**Szándékosan nem valósult meg**

Néhány igény az alábbi indokok miatt nem kerülhetett be:

- **HTML szerkesztő:** biztonsági okok (hibás HTML eltörheti az oldalt)
- **Szabad színválasztó:** arculati stabilitás megőrzése érdekében
- **Jogi szövegek automatikus frissítése:** a jogi felelősség a szervező oldalán van

---

**Javasolt következő lépés**

Javasoljuk a fenti kézi teendők elvégzését, majd egy közös online vagy személyes
átadási átnézést, ahol az élő oldalt együtt végignézzük HU és EN módban is.

Ha bármilyen kérdés merül fel, szívesen segítünk.

Üdvözlettel,
Fejlesztő csapat

---

## 12. Végső státuszminősítés

### Minősítés: ⚠️ Feltételesen átadható – manuális QA után teljesen átadható

**Indoklás:**

| Terület | Státusz |
|---|---|
| Technikai fejlesztések | ✅ Teljes, 0 build hiba |
| Automatizált migráció | ✅ Teljes, 0 migrációs hiba |
| CMS szerkeszthetőség | ✅ Minden kritikus elem szerkeszthető |
| Rich text | ✅ Implementálva és migrálva |
| Adatvédelmi oldal | ✅ Belső szerkeszthető oldal |
| The Carling Sisters kézi rendezés | ⚠️ Kézi teendő |
| Fesztiváltérkép feltöltése | ⚠️ Kézi teendő |
| Transport EN fordítások | ⚠️ Kézi teendő |
| imageDisplayMode finomhangolás | ⚠️ Szerkesztői döntés kell |
| Jogi tartalom jogi felülvizsgálata | ⚠️ Szervező felelőssége |
| Vizuális QA (rich text, képek) | ⚠️ Kézi ellenőrzés szükséges |

**Nem állítható:**
- Nem állítható, hogy minden kép vizuálisan tökéletes, amíg imageDisplayMode QA nem történt meg
- Nem állítható, hogy minden EN fordítás teljes (transport directions hiányzik)
- Nem állítható, hogy a jogi szövegek jogilag felülvizsgáltak
- Nem állítható, hogy a The Carling Sisters adatai véglegesek kézi rendezés nélkül

**Az átadás ajánlott folyamata:**
1. Kézi teendők elvégzése a Sanity Studio-ban (ld. 7. fejezet)
2. Vizuális ellenőrzés HU és EN módban
3. Közös átadási QA
4. Végleges átadás

---

*Dokumentum: PROJECT_STATUS_FOR_CLIENT.md · Verzió 1.0 · 2026. május 13.*
