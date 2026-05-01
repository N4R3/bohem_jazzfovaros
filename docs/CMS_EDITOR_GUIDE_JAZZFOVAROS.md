# CMS szerkesztői útmutató — Bohém Jazzfőváros / Jazz Capital

Ez a dokumentum végigvezet a Sanity Studio fő funkcióin: oldalak szerkesztése, új oldal létrehozása, menü módosítása, program kezelése, fellépők és színpadok kezelése.

**Studio elérése:** https://bohemjazz.netlify.app/studio
**Élő oldal:** https://bohemjazz.netlify.app/

---

## 1. A Studio felépítése

A bal oldali menüben fentről lefelé:

1. **⚙️ Site settings** — globális beállítások (jegylink, social, házirend, kapcsolat)
2. **🔔 Popup settings** — főoldali Széchenyi popup
3. **🧭 Navigáció / Menü** — fejléc + footer menüpontok
4. **📄 Oldalak (Pages)** — a 10 fix + tetszőleges új oldal tartalma
5. **📅 Program tételek** — strukturált program lista
6. **🎤 Színpadok / helyszínek** — Main Stage, Club Stage, Beach stb.
7. **🎷 Fellépők** — performer adatok
8. **🏷️ Fellépő címkék / műfajok** — műfaj-badge-ek
9. **🎟️ Jegyek**
10. **🏨 Szállás**, **🚗 Közlekedés**, **🤝 Támogatók**, **🗂️ Támogatói kategóriák**, **📍 Helyszín (Venue)**

---

## 2. Oldalak szerkesztése (Pages)

**Hol:** Bal menü → 📄 **Oldalak (Pages)**

A 10 fix oldal mindegyikéhez van egy Page dokumentum (slug = home, info, lineup, program, contact, szallas, terkep, futas, tabor, aszf). Nyisd meg azt, amelyiket szerkeszteni szeretnéd.

### Slug-hoz igazodó mezők (fontos)

A Studio **nem minden oldalon mutatja az összes mezőt**. A **Slug** mező értékétől függően csak azok a blokkok jelennek meg, amelyek az adott útvonalon ténylegesen megjelennek a honlapon (pl. program-mód csak `program` slug esetén; tábor-program blokkok csak `tabor` esetén).

Ha egy mezőt nem látsz: ellenőrizd, hogy a dokumentum **slug** mezője pontosan a kívánt érték (pl. `tabor`, `futas`).

**„A honlap tele van, a Studio meg üres” — ez gyakran nem hiba:** sok mezőnél (pl. tábor programkártyák, futás táblázat) **üres Sanity = a honlap a kódban tárolt magyar/angol alapszöveget mutatja**. A Studio-ban akkor látod ugyanazt, ha kitöltöd a mezőket **és** rányomsz a **Publish**-ra, vagy egyszer lefuttatod a **`npm run sanity:seed`** importot (fejlesztői gépen, írási tokennel). Gyors megnyitás a Studioban: bal menü → **⚡ Jazztábor — Page** / **⚡ Futás — Page**.

### Közös mezők (több fix és új oldal esetén)

| Mező | Hatás |
|---|---|
| **Cím (HU/EN)** | Belső lista + admin; **Program** oldalon a nagy fejléc szöveg innen jön (nem a „Hero cím” mezőből). |
| **Slug (URL)** | **Ne módosítsd** a 10 fix oldalon — különben eltörhetnek a linkek. |
| **Hero cím (HU/EN)** | Nagy cím a megfelelő aloldalon (kivéve: `home`, `program`, `lineup` — ott nem ez a mező vezérli a látható címet). |
| **Hero leírás (HU/EN)** | Alcím / bevezető (kivéve: `home`, `lineup`). |
| **Oldal tartalom – HU/EN** | Hero alatti első szabad szöveg (kivéve: `home`, `program`, `lineup`). Üres = ez a blokk nem renderelődik. |
| **SEO beállítások** | Meta cím, leírás, OG kép. |

**Program** oldal külön mezői (csak `program` slug mellett látszanak): **Program megjelenítési mód**, **Program – szabad szöveg (HU/EN)** — részletek: [§ Program kezelése](#5-program-kezelése).

> **Tipp:** Az `Oldal tartalom` mezőben üres sor új bekezdést jelez. A `https://...` URL-ek automatikusan kattinthatóvá válnak.

### Jazztábor (`tabor`) — szerkeszthető részek

Ezek a mezők **csak** a slug `tabor` mellett jelennek meg. Ha kitöltöd őket, a honlap **Sanity-ből** veszi a tartalmat; ha egy lista üres marad, a rendszer a **kódbeli magyar/angol alapszöveget** (`hu.ts` / `en.ts`) mutatja helyette (**fallback**).

| Mezőcsoport | Mit állítasz? |
|---|---|
| **Tábor — szürke sor felett (HU/EN)** | Az oldal legteteje feletti vékony „eyebrow” sor (pl. *Swing · Lindy Hop …*). Üres = fix alapértelmezés. |
| **Tábor — szekció főcím (HU/EN)** | A programkártyák fölötti nagy cím (pl. *Tanárok és program (2026)*). Üres = fix `scheduleTitle`. |
| **Tábor — program blokkok (kártyák)** | Lista: minden elem egy kártya **cím + bullet lista**. A listák **HU és EN** oszlopában soronként egy pont (Enter = új sor). Ide kerülnek például a tanárok névsora, kurzusdíjak, napi menetrend, záró nap programja. **Üres tömb** = a honlap a meglévő statikus menetrendet használja. |
| **Tábor — támogatók blokk címe (HU/EN)** | A támogató linkek fölötti kis cím. Üres = „Támogatók” / „Supporters”. |
| **Tábor — támogatók (linkek)** | Név + URL soronként. Ha van legalább egy elem, **felülírja** a statikus támogató listát. Üres = statikus lista marad. |
| **Második szöveg doboz megjelenítése** + **Második szöveg doboz – HU/EN** | A videó alatti **hosszabb** szöveg: csak akkor cseréli le a kódbeli tábor-leírást, ha a kapcsoló **bekapcsolt** és van szöveg a második dobozban. Kikapcsolva mindig a statikus leírás megy ki. |
| **Elsődleges / másodlagos gomb** | Felirat + URL (HU/EN). Üresen a honlap a régi nevezési/jelentkezési linket és feliratot használja. |

**Megjelenési sorrend a `/tabor/` oldalon (fontosabb elemek):** Hero → opcionális **Oldal tartalom** → videó → (második doboz **vagy** statikus leírás) → narancs **Jelentkezés** gomb → program kártyák → támogatók.

### Futás (`futas`) — szerkeszthető részek

Csak `futas` slug mellett látszanak. Ugyanaz a **fallback** logika: üres Sanity mező → honlap a statikus `running` szöveget és táblázatot használja.

| Mezőcsoport | Mit állítasz? |
|---|---|
| **Futás — eyebrow sor (HU/EN)** | Fejléc feletti sor (pl. dátum · idő). Üres = statikus dátum + idő. |
| **Futás — narancs szalag szöveg (HU/EN)** | Az „INGYENES belépő…” típusú kiemelt sáv. Üres = statikus szöveg. |
| **Futás — kártya „Dátum” / „Időpont” / „Helyszín”** | A három középen lévő infókártya tartalma (`Időpont` egy mező, nyelvfüggetlen). Üres = statikus értékek. |
| **Futás — táblázat fejléc (HU/EN)** | A távok táblázat narancs fejlécében lévő cím. Üres = „Távok & Díjak” / „Distances & fees”. |
| **Futás — távok sorai** | Táblázat soronként: kategória, táv, díj (HU és EN oszlop). Van sor = **felülírja** a statikus táblázatot. |
| **Futás — nevezési határidő / eredményhirdetés szöveg** | Az oldal alsóbb részén lévő szövegdobozok. Üres = statikus szöveg. |
| **Második szöveg doboz – HU/EN** | A **hosszú** futás-leírás (nevezés, öltöző, póló stb.). Ha **van kitöltve**, ez mindig megjelenik a megfelelő helyen — **nem kell** hozzá külön a „Második szöveg doboz megjelenítése” kapcsoló (az elsősorban a tábor oldalhoz kell). Üres = statikus `running.description`. |
| **Elsődleges / másodlagos gomb** | Online nevezés + opcionális második link (pl. nevezési lap). |

### Kezdő tartalom (seed) és üres Studio

A **`npm run sanity:seed`** (kezdeti import script) a **Page** dokumentumokhoz (köztük `tabor` és `futas`) betölti azokat a szövegeket és listákat, amelyek a honlapon eredetileg is szerepeltek (tanárok listája, kurzusdíjak, futás távok, ingyenes belépő szalag, stb.). Ha egy **új** Sanity projektben minden üres, először futtasd a projekt README / fejlesztői útmutató szerint az importot, majd a Studio-ban ellenőrizd a **Pages** dokumentumokat.

### Példa: Jazztábor oldal szerkesztése

1. Nyisd meg **Pages →** a **slug: tabor** dokumentumot (pl. „Jazztábor”).
2. **Hero cím / Hero leírás**: a nagy cím és alcím (opcionálisan felülírja a statikus címeket).
3. **Oldal tartalom**: ha kell, plusz bevezető a videó **felett**.
4. **Tábor — program blokkok**: egy blokk = egy kártya; a lista sorait Enterrel válaszd (tanárok, díjak, napi menetrend külön blokkban).
5. **Tábor — támogatók**: új sorban név + link; így teljesen CMS-ből vezérelhető a lábléc blokk.
6. **Második szöveg doboz**: kapcsoló BE + szöveg, ha a videó alatti hosszú leírást innen akarod adni.
7. **Publish** → ~30 mp ISR után frissül a `/tabor/` oldal.

---

## 3. Új információs oldal létrehozása

**Hol:** Bal menü → 📄 **Oldalak (Pages)** → jobb felül „Create"

### Lépések

1. **Cím (HU)**: pl. „Sajtószoba"
2. **Slug**: kisbetű+kötőjel — pl. `sajto`
3. Töltsd ki a **Hero cím / leírás** mezőket
4. Az **Oldal tartalom** mezőbe írd a fő szöveget
5. **Aktív** legyen bekapcsolva
6. **Publish**

Az új oldal automatikusan elérhető lesz: **https://oldal.hu/oldal/sajto/**

### Az új oldal megjelenítése a menüben

→ Lásd a **Menü módosítása** szekciót.

> **Megjegyzés:** A 10 fix slug saját oldalsablont használ. Az ezen kívüli új oldalak az egyszerű, általános `/oldal/[slug]` sablonon jelennek meg (Hero cím + leírás + szöveges body). Bonyolultabb dizájn (kártyák, táblázat) ezen a sablonon nem építhető — ha kell, fejlesztői támogatásra van szükség.

---

## 4. Menü módosítása

**Hol:** Bal menü → 🧭 **Navigáció / Menü**

A főmenü és a footer linkjei innen vezérelhetők.

### Egy menüpont mezői

| Mező | Mire való |
|---|---|
| **Felirat (HU/EN)** | Amit a látogató lát |
| **Belső oldal (Page)** | Ajánlott: a Pages alól választasz dokumentumot, a link ebből képződik |
| **Saját URL** | Csak akkor töltsd ki, ha NEM Page-re mutat (pl. `/info/#gyik`) |
| **Külső link** | Teljes URL-t ide tegyél (pl. https://jegyek.hu/...). Új ablakban nyílik. |
| **Új ablakban nyíljon** | Belső linknél opcionális; külsőnél automatikus |
| **Sorrend** | Kisebb szám = előrébb |
| **Aktív** | Ha kikapcsolod, sehol nem jelenik meg |
| **Megjelenik a fejlécben** | Header menübe kerül-e |
| **Megjelenik a footerben** | Footer linklistába kerül-e |

### Tipikus feladatok

**Új menüpont felvétele:**
1. „Create" gomb a Navigáció listában
2. Felirat: pl. „Sajtó"
3. Belső oldal: válaszd a `Sajtószoba` Page-et
4. Sorrend: a kívánt pozíció
5. Megjelenik a fejlécben: be / Footer: be (ha kell)
6. Publish

**Menüpont sorrend átrendezése:**
A sorszám módosításával. Kisebb = előrébb.

**Menüpont elrejtése:**
Az **Aktív** kapcsolóval (vagy a header/footer kapcsolóval, ha csak az egyik felületről akarod elrejteni).

**Menüpont átnevezése:**
Felirat (HU/EN) módosítása.

> **Fallback:** Ha minden menüpontot elrejtesz vagy törölsz, a frontend a kódba égetett alapértelmezett menüt mutatja, hogy az oldal sose maradjon menü nélkül.

---

## 5. Program kezelése

A program kétféle módon jeleníthető meg:

### A) Strukturált (adatbázisos) lista

**Hol:** Bal menü → 📅 **Program tételek**

Minden tételhez:
- Cím vagy fellépő-referencia (egyik kell)
- Dátum + Kezdés
- **Színpad (stageRef)** — válassz a Stages alól
- Opcionális: Vége, kategória, leírás, fellépők

Ez jelenik meg napokra bontva, kártyákkal.

### B) Szabad szöveges program

Ha gyakran változik a program, vagy egyszerűbben akarod kezelni:

1. **Pages → Program (slug: program)**
2. **Program – szabad szöveg (HU/EN)** — írd ide az egész programot
3. **Program megjelenítési mód** — válaszd:
   - **Adatbázisos lista (alapértelmezett):** csak a Program tételek látszanak
   - **Szabad szöveges program:** csak a programBody látszik (nem mutatja a tételeket)
   - **Mindkettő:** előbb a szöveg, alatta a lista

### Egy fellépő több időpontban

Ha valaki több koncerten fellép:
1. Hozz létre egy Program tételt minden időponthoz külön
2. Mindegyikben válaszd ki ugyanazt a Performer dokumentumot a `Fellépők` listában

A frontend mindegyik kártyán meg fogja mutatni a nevet.

---

## 6. Fellépők (Performers)

**Hol:** Bal menü → 🎷 **Fellépők**

| Mező | Hatás |
|---|---|
| **Név** | A kártyán nagybetűs cím |
| **Kép** | A kártya képe |
| **Rövid leírás (HU/EN)** | A kártyán megjelenő szöveg. **NEM műfaj-címke!** |
| **Címkék / műfajok (tags)** | A kártyán kis badge-ekként jelennek meg. Üres = nincs badge. |
| **Bio (HU/EN)** | A részletes (modal) leírás |
| **Linkek** | Web, YouTube, Facebook, Instagram, Spotify |
| **Sorrend** | Kisebb szám = előrébb a lineupban |

### Műfaj / címke kezelése

**Új címke felvétele:**
1. Bal menü → 🏷️ **Fellépő címkék / műfajok** → Create
2. Név (HU): pl. „swing"
3. Publish

**Címke hozzárendelése fellépőhöz:**
1. Nyisd meg a Performer dokumentumot
2. **Címkék / műfajok** mezőben: Add → válaszd ki a tagot
3. Publish

> A fellépő-kártyán max. 3 tag jelenik meg vizuálisan; a többi a Studio-ban marad.

---

## 7. Színpadok / helyszínek (Stages)

**Hol:** Bal menü → 🎤 **Színpadok / helyszínek**

Minden színpad:
- **Név (HU/EN)** — ami megjelenik a frontenden, pl. „Nagysátor"
- **Slug** — belső azonosító (auto-generálódik)
- **Sorrend, Aktív**

**Új színpad felvétele:**
1. „Create" → Név megadása
2. Publish
3. Most a Program tételek `Színpad` legördülőjében választható

> **Fontos:** A frontend **pontosan** azt a nevet jeleníti meg, amit ide beírsz — nincs hardcode-olt „Főszínpad" / „Nagysátor" átírás. A program és a fellépő-adatok így mindig egyezni fognak.

---

## 8. Mit ne módosíts?

| Mező | Miért? |
|---|---|
| **Slug a 10 fix oldalon** | Linkek törhetnek (home, info, lineup, program, contact, szallas, terkep, futas, tabor, aszf) |
| **Performer `imagePath`** | Legacy / readonly; az új képeket az `image` mezőbe töltsd |
| **Sponsor `logoPath`** | Ugyanaz; az új logókat az `logo` mezőbe töltsd |
| **Page `bodyHu/bodyEn`** | Régi Portable Text mezők. Helyettük a `pageBodyHu/En` használandó (rejtett mezők) |
| **siteSettings ID** | Ne klónozd, ne töröld |

---

## 9. Olvasói (read-only) hozzáférés és felhasználói meghívás

### Mit lát az olvasó?

- Olvasói (read-only) joggal **megnyithatod a Studio-t és látod a tartalmakat**, de **nem tudsz publikálni / módosítani**.
- A „Save" / „Publish" gombok inaktívak / nem jelennek meg.

### Hogyan kapsz szerkesztési jogot?

1. A projekt tulajdonosa (Sanity-ben) meghív téged felhasználóként
2. Megnyitod a meghívót e-mailben
3. Bejelentkezel a Sanity-be (Google / GitHub / e-mail)
4. Ezután a Studio-ban szerkesztőként látsz mindent

### Felhasználó meghívása (admin oldal)

1. https://www.sanity.io/manage → projekt kiválasztása
2. **Members** → **Invite member**
3. Email cím + szerepkör (Editor / Administrator / Viewer)
4. Küldd el a meghívót

> **Free csomagban a szerepkörök korlátozottabbak lehetnek.** A végleges átadás során a teljes szerkesztési jog rendezésre kerül.

### Mit kapsz a végleges átadáskor?

- **Tulajdonjog átadása** a Sanity projekten
- **Netlify projekt** hozzáférés
- **GitHub repository** csomag (forráskód)
- **Domain átállítás** támogatása (`jazzfovaros.hu`, `jazzcapital.hu`)
- **Részletes átadási dokumentáció**

---

## 10. Mentés és publikálás

A Studio-ban minden módosítás **draft (piszkozat)** állapotban van, amíg nem nyomod meg a **Publish** gombot (jobb alsó sarok).

A publikálás után **~30 másodpercen belül** megjelenik az élő oldalon (Netlify ISR).

> Ha azonnal szeretnéd látni: a böngészőben Ctrl+F5 a hard-refresh.

---

## 11. Hibajelentés / segítség

Ha valamit nem találsz vagy elakadsz:
- Ellenőrizd, hogy a dokumentum **Aktív (isActive: true)** állapotban van-e
- Ellenőrizd a **Publish** gomb állapotát (kék = van publikálatlan változás)
- A `/studio` Vision panelből (felül) lekérdezhetsz GROQ-kal

Bármilyen technikai kérdés esetén keress bátran.
