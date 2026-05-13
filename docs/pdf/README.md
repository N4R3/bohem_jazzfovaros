# PDF-ek generálása

Ebben a mappában 3 szépen formázott, **színes, márkázott** HTML dokumentum található, amelyeket PDF-be tudsz exportálni.

## Fájlok

| Fájl | Tartalom |
|------|----------|
| `1_Fizetes_Elotti_Attekintes.html` | Fizetés előtti áttekintési dokumentáció |
| `2_Sanity_CMS_Gyors_Bejaro.html` | Sanity CMS gyors bejáró útmutató |
| `3_Ellenorzesi_Email_Sablon.html` | Ellenőrzési email sablon |
| `_styles.css` | Közös stíluslap (narancs + kék márkaszínek) |

## A legegyszerűbb módszer (böngésző)

1. **Dupla kattintás** bármelyik `.html` fájlra → megnyílik a böngészőben
2. **Ctrl + P** (Nyomtatás)
3. Célhely: **„Mentés PDF-ként"**
4. ⚠️ **Fontos:** „További beállítások" → **Háttérgrafika** bekapcsolva (különben elvesznek a színek!)
5. Margó: **Nincs** vagy **Minimális**
6. **Mentés**

## Automatikus generálás (PowerShell)

Ha van Chrome vagy Edge a gépeden, egy parancs minden PDF-et legenerál:

```powershell
cd e:\villa\web\jazz\docs\pdf
.\generate-pdfs.ps1
```

Ez létrehozza:
- `1_Fizetes_Elotti_Attekintes.pdf`
- `2_Sanity_CMS_Gyors_Bejaro.pdf`
- `3_Ellenorzesi_Email_Sablon.pdf`

## DOCX-be konvertálás (ha szükséges)

Ha Word dokumentumra van szükség:

1. Nyisd meg a HTML-t Chrome-ban
2. Ctrl + A (mindent kijelöl) → Ctrl + C (másol)
3. Nyiss egy új Word dokumentumot
4. Ctrl + V → „Formázás megtartása" opció

Alternatív: **Pandoc** (ha telepítve van):
```powershell
pandoc 1_Fizetes_Elotti_Attekintes.html -o 1_Fizetes_Elotti_Attekintes.docx
```

## Kézi kitöltendők a HTML-ekben

Mielőtt PDF-be exportálsz, cseréld le a placeholder-eket:

- `[E-mail cím]` → saját e-mail címed
- `[Telefonszám]` → saját telefonszámod
- `[Ügyintéző keresztneve]` (3. fájlban) → ügyfél kapcsolattartó neve

Keresés / csere: Nyisd meg a fájlt VS Code-ban → Ctrl + H.
