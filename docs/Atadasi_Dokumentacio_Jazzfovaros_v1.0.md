# WEBOLDAL ÁTADÁSI DOKUMENTÁCIÓ

**Projekt:** Bohém Jazzfőváros / Jazz Capital – Fesztivál weboldal  
**Verzió:** 1.0  
**Készítette:** [Saját neved] – 2026. április  
**Ügyfél:** JAZZFŐVÁROS Kft.

---

## 🎉 Gratulálunk – A weboldalad éles!

Ez a dokumentáció segít eligazodni a weboldalad kezelésében és a további lépésekben.

---

## 1. Mi készült el?

### 🎵 Teljes weboldal-csomag
- **Modern, reszponzív dizájn** – mobilon, tableten és asztali gépen is tökéletes
- **Kétnyelvű felület** – magyar és angol nyelven is elérhető minden tartalom
- **Villámgyors betöltés** – statikus oldalak, CDN-en keresztül szolgálva

### 📄 Oldalak
| Oldal | URL | Leírás |
|-------|-----|----------|
| Kezdőlap | `/` | Hero szekció, fellépők teaser, jegyek, statisztikák |
| Fellépők | `/lineup/` | Teljes fellépő lista kártyákkal |
| Program | `/program/` | Napi bontású programtábla |
| Infó | `/info/` | GyIK, házirend, helyszín térképpel |
| Kapcsolat | `/contact/` | Elérhetőségek, sajtó, önkéntesség |
| Szállás | `/szallas/` | Szálláshely ajánlók képekkel |
| Térkép | `/terkep/` | Megközelítés, parkolás, tömegközlekedés |
| Futás | `/futas/` | Jazz Capital Run verseny oldala |
| Tábor | `/tabor/` | Jazztábor információk |
| ÁSZF | `/aszf/` | Általános Szerződési Feltételek |

### 🔧 Technikai különlegességek
- **Sanity CMS** – Könnyű tartalomszerkesztés admin felületen
- **SEO optimalizálás** – Google-barát meta tag-ek, sitemap.xml, robots.txt
- **Keresőmotoroknak strukturált adatok** – Schema.org MusicEvent markup
- **Analytics-ready** – Google Tag Manager / GA4 csatlakoztatási lehetőség
- **Széchenyi Terv popup** – Promóciós ablak a főoldalon

---

## 2. Hogyan éred el most?

### 🌐 Élő weboldal
**Link:** [Vercel/Netlify URL ide]  
*Példa: `https://jazzfovaros-2026.vercel.app/`*

**Jelszóvédelem:** Nincs (nyilvános oldal)

### 🎛️ Tartalomkezelő (Sanity Studio)
**Link:** `[project-id].sanity.studio`  
**Bejelentkezés:** E-mail cím és jelszó (külön küldve)

### 📁 Forráskód és dokumentáció
**Google Drive mappa:** [Link ide]  
**Jogosultság:** „Szerkesztés" hozzáférés biztosítva

---

## 3. Hogyan szerkesztheted később?

### Opció A: Sanity CMS (ajánlott) ⭐
A legegyszerűbb mód – nincs szükség programozási tudásra!

1. Nyisd meg a Studio-t: `[project-id].sanity.studio`
2. Jelentkezz be a kapott hitelesítő adatokkal
3. Böngéssz a dokumentumtípusok között:
   - **Pages** – Oldalak tartalma és SEO beállítások
   - **Performers** – Fellépők adatai, képek, leírások
   - **Program** – Programpontok időponttal, színpaddal
   - **Tickets** – Jegytípusok és árak
   - **Sponsors** – Támogatók logói és linkjei
   - **Site Settings** – Fesztivál dátum, helyszín, elérhetőségek

4. Kattints szerkeszteni kívánt elemre, változtass, majd kattints **Publish**-ra
5. A változások 1-2 percen belül megjelennek az élő oldalon!

### Opció B: Forráskód szerkesztése (haladó)
Ha programozói hozzáférést szeretnél:

1. Töltsd le a forráskódot a GitHub-ról vagy Drive-ról
2. Telepítsd a VS Code-ot (ingyenes)
3. Futtasd: `npm install` majd `npm run dev`
4. A változtatások után: `npm run build`

**Mappaszerkezet röviden:**
```
/src
  /app           → Oldalak (Next.js routing)
  /components    → Újrafelhasználható elemek
  /content       → Nyelvi fájlok (HU/EN)
  /sanity        → CMS integráció
/public
  /images        → Képek
```

---

## 4. Mit tegyél, ha bármit szeretnél változtatni?

### 📞 Kapcsolatfelvétel
- **E-mail:** [Saját e-mail címed]
- **Telefon:** [Telefonszámod]
- **Válaszidő:** 24 órán belül

### 🆓 Garanciális időszak (30 nap)
Az első 30 napban **bármilyen kisebb módosítás ingyenes**:
- Szövegek cseréje
- Képek lecserélése
- Színek finomhangolása
- Új fellépő hozzáadása a CMS-ben

### 💼 Hosszú távú támogatás (opcionális)
A garancia lejárta után is számíthatsz rám:
- **Havi karbantartás:** 15 000 Ft/hó  
  (Tartalom frissítés, kisebb javítások, biztonsági frissítések)
- **Óradíj:** 8 000 Ft/óra  
  (Nagyobb fejlesztések, új funkciók)

---

## 5. Gyorsindító – Teendők listája

- [ ] Nyisd meg az élő weboldalt és böngészd végig az oldalakat
- [ ] Jelentkezz be a Sanity Studio-ba és ismerd meg a felületet
- [ ] Töltsd le a forráskódot biztonsági mentésként
- [ ] Ellenőrizd, hogy minden fellépő képe megjelenik
- [ ] Fizessd be a számlát a megadott határidőig
- [ ] Kérdezz bátran, ha bármi nem világos! 😊

---

## 6. Linkek és elérhetőségek gyorskereső

| Erőforrás | Link | Megjegyzés |
|-----------|------|------------|
| Élő weboldal | [URL] | Publikus |
| Sanity Studio | [studio.sanity.io] | Admin felület |
| Forráskód | [GitHub/Drive] | Letölthető |
| Szerződés | [PDF link] | Archivált |
| Számla | [PDF link] | Fizetendő |
| Fejlesztő elérhetősége | [email/telefon] | 24h válaszidő |

---

## 📸 Screenshotok az oldalról

*[Itt lesznek 2-3 képernyőkép a legfontosabb oldalakról]*

### Kezdőlap (Hero szekció)
*[Kép helye]*

### Fellépők oldal
*[Kép helye]*

### Program oldal
*[Kép helye]*

---

**Köszönöm, hogy velem dolgoztál a Jazzfőváros weboldalán!** 🎷

Ha bármi kérdésed van, írj nyugodtan – örömmel segítek!

---

*Készült: 2026. április 27.*  
*Készítette: [Saját neved]*
