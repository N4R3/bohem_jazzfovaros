# Sanity CMS gyors bejáró

**Projekt:** Bohém Jazzfőváros / Jazz Capital weboldal  
**CMS link:** https://bohemjazz.netlify.app/studio

---

## Bevezető

Ez egy rövid, praktikus útmutató, hogy a fizetés előtt is nyugodtan körülnézhessen a tartalomkezelő felületen. A Sanity CMS egy modern, felhasználóbarát admin felület, amelyen keresztül a weboldal szinte teljes tartalma szerkeszthető – programozói tudás nélkül.

---

## Bejelentkezés

1. Nyissa meg: **https://bohemjazz.netlify.app/studio**
2. Válassza ki a bejelentkezési módot (Google / GitHub / e-mail)
3. Első belépéskor a meghívott e-mail címet használja (amit külön egyeztetünk)
4. A sikeres belépés után a bal oldali menüben látja az elérhető tartalomtípusokat

---

## Mit lát a bal oldali menüben?

A bal oldali menü tartalomtípusok szerint csoportosítva listázza a szerkeszthető elemeket. Az alábbiakban röviden bemutatom mindegyiket.

---

### Site settings (Alapbeállítások)

Globális beállítások az egész weboldalhoz.

| Mező | Mire való |
|---|---|
| Fesztivál dátumok | Kezdő- és zárónap |
| Jegyvásárlási link | HU és EN külön |
| Közösségi média linkek | Facebook, Instagram, YouTube |
| Házirend PDF | Letölthető dokumentum |
| Kapcsolati adatok | E-mail, telefon |

---

### Popup settings (Popup beállítások)

A főoldalon megjelenő promóciós ablak (pl. Széchenyi Terv).

- Kép (asset feltöltés) vagy kép útvonal
- Szövegek (HU / EN)
- Csak főoldalon megjelenés opció
- Be/ki kapcsolható

---

### Pages (Oldalak)

Az egyes oldalak SEO adatai és beállításai.

- SEO cím (HU / EN)
- SEO leírás (HU / EN)
- Page-szintű hero / tartalom mezők, ahol használatban van

---

### Performers (Fellépők)

A fesztivál fellépőinek adatai.

| Mező | Leírás |
|---|---|
| Név | Fellépő / zenekar neve |
| Kép | Fellépő fotó |
| Rövid leírás | HU / EN (teaserhez) |
| Hosszú leírás | HU / EN (lineup oldalra) |
| Sorrend | Kisebb szám = előrébb |
| Aktív | Megjelenjen-e az oldalon |

---

### Program (Programpontok)

A fesztivál napi programja.

| Mező | Leírás |
|---|---|
| Cím | HU / EN |
| Dátum | Év-hó-nap |
| Kezdési idő | HH:MM |
| Színpad | Pl. Main, Club, Beach |
| Sorrend | Azonos időponton belül |
| Aktív | Megjelenjen-e |

---

### Tickets (Jegyek)

A jegytípusok és árak kezelése.

| Mező | Leírás |
|---|---|
| Név | HU / EN |
| Ár | Szöveges mező (pl. „19 900 Ft") |
| Elérhető | Vásárolható-e |
| Elrejtve | Rejtett a weboldalon (pl. Early Bird lejárt) |
| Sorrend | Megjelenési sorrend |

---

### Sponsors (Támogatók)

Egyedi támogató rekordok.

| Mező | Leírás |
|---|---|
| Név | Támogató neve |
| Logó | Kép (asset) |
| Link | Weboldal URL |
| Kategória | Főtámogató / támogató / partner |
| Sorrend | Kategórián belül |

---

### Sponsor categories (Támogatói kategóriák)

A támogatók csoportosítása.

- Cím (HU / EN)
- Sorrend

---

### Accommodation (Szállások)

Partner szálláshelyek.

- Név
- Leírás (HU / EN)
- Kép
- Booking / website link
- Távolság a fesztiváltól (HU / EN)

---

### Transport (Közlekedés)

Közlekedési módok a térkép oldalon.

- Cím (HU / EN)
- Leírás (HU / EN)
- Ikon
- Link (opcionális)

---

### Venue (Helyszín)

A fesztivál helyszínének adatai.

- Név (HU / EN)
- Cím (HU / EN)
- Térkép embed URL / Google Maps link
- GPS koordináták (lat / lng)

---

## Mit NE módosítsanak egyelőre?

Ezek technikai / rendszerbeállítások, amelyekhez kérem, ne nyúljanak az egyeztetés előtt:

- ❌ **Technikai azonosítók** (`_id`, `_ref`, `_type`)
- ❌ **Slugok** (oldalak webcímei) – ezek megváltoztatása linkeket törhet
- ❌ **noIndex** kapcsoló – keresőmotor-indexelést érinti
- ❌ **Legacy mezők:** `imagePath`, `logoPath` – ezek fallback adatok
- ❌ **Sanity rendszerbeállítások** (Project / Dataset / API)
- ❌ **CORS / API tokenek** – biztonsági beállítások

Ha ezek valamelyikét módosítani kellene, szóljanak – közösen megoldjuk.

---

## Hogyan teszteljék biztonságosan?

1. **Válasszanak ki egy nem kritikus szöveget** – pl. egy fellépő rövid leírása
2. **Módosítsák** a szerkesztőben
3. **Kattintsanak a „Publish" gombra** (jobb alsó sarok)
4. **Várjanak 1–2 percet**, majd nézzék meg a weboldalon
5. **Ha nem biztosak valamiben**, inkább jelezzék – szívesen segítek

---

## Javasolt átnézési sorrend

| # | Rész | Miért érdemes elsőként? |
|---|---|---|
| 1 | **Site settings** | Globális adatok, mindenre hatással |
| 2 | **Pages** | SEO címek, leírások, fontos az első találatok miatt |
| 3 | **Tickets** | Jegyárak pontossága mindenkinek számít |
| 4 | **Program** | Időpontok, színpadok |
| 5 | **Performers** | Fellépők listája, képek |
| 6 | **Sponsors** | Támogatók teljes listája |
| 7 | **Accommodation** | Szállás partnerek |
| 8 | **Transport / Venue** | Közlekedés és helyszín |
| 9 | **Frontend ellenőrzés mobilon** | Végső élmény teszt |

---

## Kérdés esetén

Ha bármi nem világos a Sanity felületen, ne habozzon szólni – örömmel átveszem személyesen / telefonon / képernyőmegosztáson keresztül.

**Besenyei Zalán György** – egyéni vállalkozó  
[E-mail cím] · [Telefonszám]
