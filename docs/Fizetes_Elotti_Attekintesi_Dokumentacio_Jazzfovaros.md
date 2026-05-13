# Fizetés előtti áttekintési dokumentáció

**Projekt:** Bohém Jazzfőváros / Jazz Capital weboldal  
**Dátum:** 2026. április 28.  
**Készítette:** Besenyei Zalán György e.v.

---

## Bevezető

Kedves Partnerünk!

A Bohém Jazzfőváros / Jazz Capital fesztivál weboldala elkészült ellenőrzésre. Ez a dokumentum azt a célt szolgálja, hogy átláthatóan, nyugodtan át tudják nézni a munkát még a pénzügyi rendezés előtt, és jelezhessék az esetleges utolsó kisebb észrevételeket.

> ⚠️ **Fontos megjegyzés:** Ez a dokumentum **nem végleges átadás**, hanem **fizetés előtti ellenőrzési állapot**. A végleges átadási dokumentáció, forráskód-átadás, számla és hozzáférések rendezése a pénzügyi rendezés után történik meg.

---

## Ellenőrzési linkek

| | Link |
|---|---|
| **Ideiglenes weboldal (staging)** | https://bohemjazz.netlify.app/ |
| **Tartalomkezelő (Sanity Studio)** | https://bohemjazz.netlify.app/studio |

A végleges domainek (`jazzfovaros.hu`, `jazzcapital.hu`) beállítása és átirányítása a pénzügyi rendezés után, közös egyeztetéssel történik.

---

## 1. Mi készült el?

### Weboldal alapok
- Modern, reszponzív, mobilbarát weboldal
- Kétnyelvű működés előkészítve (magyar és angol)
- Gyors betöltés, optimalizált képek
- SEO alapok: meta címek, leírások, sitemap.xml, robots.txt, strukturált adatok (Schema.org)

### Oldalak
| Oldal | Leírás |
|---|---|
| Főoldal | Hero, videó, jegyek, fellépők kiemelés, statisztikák, CTA sáv |
| Fellépők | Teljes lineup oldal kártyákkal |
| Program | Napi bontású programtábla |
| Infó | GyIK, házirend, helyszín |
| Jegyek | Jegyek megjelenítése (rejtés/kiemelés szabályozható) |
| Szállás | Szálláshelyek képekkel, leírással, linkkel |
| Térkép / Közlekedés | Helyszín, GPS, megközelítés |
| Futás | Jazz Capital Run verseny oldala |
| Tábor | Jazztábor információk |
| Kapcsolat | Elérhetőségek, sajtó, önkéntes-jelentkezés |
| ÁSZF | Általános Szerződési Feltételek |

### Tartalomkezelő (Sanity CMS)
- Saját admin felület a `/studio` útvonalon
- Módosítható: fellépők, program, jegyek, támogatók, szállások, közlekedés, helyszín, oldalak SEO adatai, popup, alapbeállítások
- Mentés után 1–2 percen belül megjelenik az élő oldalon

### Extra elemek
- Széchenyi Terv promóciós popup a főoldalon (kép, szöveg, csak főoldalon jelenik meg)
- Támogatói szekció kategóriákkal
- Staging deploy Netlify platformon

---

## 2. Mit tud most átnézni?

Kérjük, az alábbi pontokat nézzék végig nyugodtan:

- [ ] Főoldal megjelenése (dizájn, színek, elrendezés)
- [ ] Főmenü menüpontjai és működése
- [ ] Mobil nézet (telefonon is nyissák meg)
- [ ] Fellépők oldal (nevek, képek, sorrend)
- [ ] Program oldal (dátumok, időpontok, színpadok)
- [ ] Jegyek (nevek, árak, elérhetőség, láthatóság)
- [ ] Támogatók szekció (logók, linkek, kategóriák)
- [ ] Kapcsolat oldal (e-mail, telefon, cím)
- [ ] Szállás oldal (partnerek, képek, linkek)
- [ ] Térkép / közlekedés oldal
- [ ] Széchenyi popup megjelenése a főoldalon
- [ ] Sanity CMS felületén szerkeszthető tartalmak

---

## 3. Mire figyeljenek az átnézéskor?

| Terület | Amire érdemes figyelni |
|---|---|
| **Szövegek** | Helyesírás, pontos nevek, elírások |
| **Képek / logók** | Megfelelő minőség, pontos támogatói logók |
| **Linkek** | Jegyvásárlás, közösségi média, külső linkek működése |
| **Jegyek** | Jegyárak, jegytípusok, mit lássanak a látogatók |
| **Program** | Időpontok, színpad-hozzárendelések, pontosság |
| **Támogatók** | Teljes lista, kategóriák, sorrend |
| **Nyelvi tartalom** | Magyar és angol szövegek egyezése |
| **Mobilos megjelenés** | Olvashatóság telefonon, gombok elérhetősége |

Minden észrevételt egyben is elküldhetnek – így egyszerre tudom átvezetni őket.

---

## 4. Mi történik a pénzügyi rendezés után?

A fizetést követően az alábbiakat fogja megkapni:

1. **Végleges átadási dokumentáció** – részletes, PDF formátumban
2. **Hozzáférések rendezése** – Sanity CMS tulajdonjog, Netlify projekt, egyéb platformok
3. **Forráskód átadása** – GitHub repository vagy Google Drive csomag
4. **Számla** – hivatalos számla külön küldve
5. **Végleges domain beállítás támogatása** – `jazzfovaros.hu` és `jazzcapital.hu` átirányítás / kapcsolás
6. **Támogatási időszak** – az átadást követő időszakban a kisebb korrekciók / észrevételek egyeztetése külön megbeszélés alapján
7. **Opcionális karbantartási lehetőség** – ha szeretnék, közösen kialakítható egy folyamatos karbantartási konstrukció

---

## 5. Mi NEM része ennek az ellenőrzési dokumentumnak?

A félreértések elkerülése érdekében érdemes rögzíteni:

- ❌ Ez **nem** végleges szerződéses dokumentum
- ❌ Ez **nem** számla
- ❌ A teljes forráskód átadása **még nem** történt meg
- ❌ Ez **nem** a fizetés utáni végleges átadás (handover)
- ❌ A végleges domain (`jazzfovaros.hu` / `jazzcapital.hu`) átállítása **még nem** történt meg

Ezek mind a pénzügyi rendezés után, közös egyeztetéssel zajlanak.

---

## 6. Kapcsolat

Bármilyen kérdés, észrevétel esetén keressen bátran!

**Besenyei Zalán György** – egyéni vállalkozó  
1133 Budapest, Visegrádi utca 105. 1. em. 17. ajtó  
Adószám: 91998925-1-41  
Nyilvántartási szám: 62223777  
[E-mail cím] · [Telefonszám]

---

Köszönöm a bizalmat és a közös munkát – várom az észrevételeket!
