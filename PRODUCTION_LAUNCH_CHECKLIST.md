# PRODUCTION LAUNCH CHECKLIST — Jazzfőváros

## 1. Hosting modell

- **Next.js** app Netlify-on (`@netlify/plugin-nextjs`)
- **CMS:** Sanity (szerkesztés folytatódhat launch előtt rövid freeze ablakig)
- **Forráskód:** GitHub (`bohem_jazzfovaros`)
- **NEM** Mediacenter FTP / statikus manuális feltöltés az új site-hoz

---

## 2. Domain modell

| Domain / URL | Szerep |
|--------------|--------|
| `jazzfovaros.hu` | Magyar főoldal (Netlify) |
| `www.jazzfovaros.hu` | Netlify vagy apex redirect |
| `jazzfovaros.hu/en/` | Angol verzió (path-prefix) |
| `bohemjazz.netlify.app` | Staging |
| `jazzcapital.hu` | **Külső** 301/308 → `https://jazzfovaros.hu/en/` |
| `www.jazzcapital.hu` | Ugyanaz |

**jazzcapital.hu:** Ne add hozzá Netlify custom domainként. Ha véletlenül eléri az appot, a middleware defenzív redirectet küld.

**Nyelvváltó:** HU → `/en/` · EN → `/` (same-origin production és staging).

---

## 3. Netlify DNS

- Kövesd a [Netlify custom domain](https://docs.netlify.com/domains-https/custom-domains/) útmutatót
- Alkalmazd a Netlify által megadott DNS rekordokat (`jazzfovaros.hu`, `www`)
- **Ne módosítsd** az éves archív subdomain rekordokat (`2024.jazzfovaros.hu`, `2025.jazzfovaros.hu` stb.) — régi hostingon maradnak
- **jazzcapital.hu** redirect: domain szolgáltatónál (nem Netlify), cél: `https://jazzfovaros.hu/en/`

---

## 4. Kötelező / ajánlott env változók

**Netlify build environment (production go-live):**

| Változó | Production érték |
|---------|------------------|
| `NEXT_PUBLIC_SITE_URL_HU` | `https://jazzfovaros.hu` |
| `NEXT_PUBLIC_SITE_URL_EN` | `https://jazzfovaros.hu` |
| `NEXT_PUBLIC_LOCALE` | `hu` |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | (Sanity project) |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | pl. `2026-01-01` |
| `SANITY_API_READ_TOKEN` | (ha draft/preview kell) |

**Opcionális:** `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_GADS_ID`

**Staging (`netlify.toml`):** `bohemjazz.netlify.app` mindkét SITE_URL-hez.

**Soha ne commitolj:** `.env.local`, `SANITY_API_WRITE_TOKEN`, egyéb titkok.

---

## 5. Content freeze

1. Sanity szerkesztés mehet launch előtt
2. **DNS váltás előtt** rövid content freeze (1–2 óra)
3. Final build + deploy + QA
4. Sikeres launch után szerkesztés folytatható

---

## 6. Rollback

- **Netlify:** Deploys → előző sikeres deploy → Publish
- **DNS:** visszaállítás előző rekordokra (ha szükséges)
- **Archívumok:** érintetlenek maradnak a régi hostingon

---

## 7. Archívumok (nem migráljuk most)

- `2025.jazzfovaros.hu`, `2024.jazzfovaros.hu` → régi hosting
- Ne wildcard redirect, ne year subdomain capture
- Későbbi migráció előtt kérj:
  - teljes statikus export / CMS export
  - adatbázis dump (ha van)
  - archív subdomain lista
  - teljes méret
  - szerver követelmények
  - megőrizendő URL lista

---

## 8. Manual launch QA

- [ ] Homepage HU (`/`)
- [ ] Homepage EN (`/en/`)
- [ ] Nyelvváltó HU↔EN (F5 nélkül is)
- [ ] Program + accordion + deep link (`?slot=`)
- [ ] Lineup + artist deep link (`?artist=`)
- [ ] Jegy linkek
- [ ] Szállás, térkép, futás, jazztábor
- [ ] Kapcsolat
- [ ] ÁSZF, adatvédelem
- [ ] Rejtett / noIndex oldal nem indexelődik
- [ ] Mobil menü
- [ ] Homepage videó click-to-load
- [ ] Console: nincs kritikus hiba
- [ ] `jazzcapital.hu` → `jazzfovaros.hu/en/` (DNS szinten)

---

## 9. Build parancsok (CI / local)

```bash
npm run lint
npx cross-env NODE_OPTIONS="--max-old-space-size=8192" npm run build
npx cross-env NODE_OPTIONS="--max-old-space-size=8192" npm run build:hu
npx cross-env NODE_OPTIONS="--max-old-space-size=8192" npm run build:en
```

Windows: `.next/cache` törlés cache hiba esetén.

### 9.1 Utolsó build evidence (2026-06-23)

| Parancs | Eredmény | Összefoglaló |
|---------|----------|--------------|
| `npm run lint` | **PASS** | Nincs ESLint hiba |
| `npm run build` | **PASS** | 19 oldal; főoldal First Load JS 159 kB |
| `npm run build:hu` | **PASS** | 19 oldal, `NEXT_PUBLIC_LOCALE=hu` |
| `npm run build:en` | **PASS** | 17 oldal, `NEXT_PUBLIC_LOCALE=en` |

Cache törlés nem volt szükséges (első futás sikeres). Részletek: `FINAL_LAUNCH_REVIEW.md` §8.

---

## 10. Local QA útvonalak

- `http://localhost:3000/`
- `http://localhost:3000/en/`
- `http://localhost:3000/program/`
- `http://localhost:3000/en/program/`
- `http://localhost:3000/jazztabor/`
- `http://localhost:3000/futas/`
