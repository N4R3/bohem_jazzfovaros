# FINAL PRELAUNCH GLM AUDIT — Jazzfőváros / Bohem Jazz

**Dátum:** 2026-06-23  
**Verdict:** **READY AFTER FIXES** (implementálva ebben a commitban)  
**Stack:** Next.js 15 · Sanity v4 · Netlify · GitHub  

---

## 1. Executive summary

A site stagingen (`bohemjazz.netlify.app`) és localon (`localhost:3000`) path-prefix `/en` modellben működik. Production go-live előtt Netlify env és DNS feladatok maradnak (lásd `PRODUCTION_LAUNCH_CHECKLIST.md`). Kritikus kódhibák (EN belső linkek, jazzcapital redirect, sitemap `/oldal/` URL-ek) javítva.

---

## 2. Language switch & locale

| Környezet | HU | EN | Váltás |
|-----------|----|----|--------|
| Local | `/` | `/en/` | HU→`/en/`, EN→`/` |
| Staging | `bohemjazz.netlify.app/` | `.../en/` | same-origin |
| Production | `jazzfovaros.hu/` | `.../en/` | same-origin |

**Fájlok:** `src/middleware.ts`, `src/lib/localeMode.ts`, `src/lib/languageSwitch.ts`, `src/components/layout/LocaleSwitchAnchor.tsx`, `src/components/home/Navbar.tsx`

**Megjegyzés:** `buhemjazzen.netlify.app` — csak régi dokumentációban; kódban nincs. `__PEER_LOCALE_URL__` — eltávolítva / deprecated.

---

## 3. jazzcapital.hu

**Elsődleges:** Külső DNS/provider 301/308 → `https://jazzfovaros.hu/en/`  
**Nem** Netlify custom domain (user requirement).

**Defenzív app:** `middleware.ts` — ha `jazzcapital.hu` / `www.jazzcapital.hu` eléri az appot → 308 → `https://jazzfovaros.hu/en/` (vagy `NEXT_PUBLIC_SITE_URL_HU` + `/en/`).

**Nem érintett:** localhost, bohemjazz.netlify.app, jazzfovaros.hu, year subdomains.

---

## 4. Archives (éves subdomainek)

`2024.jazzfovaros.hu`, `2025.jazzfovaros.hu` stb. — **régi hostingon maradnak**. Middleware `isYearArchiveHost()` → `NextResponse.next()` (nincs locale rewrite). Ne adj hozzá wildcard redirectet.

Későbbi migráció előtt kérj: statikus export, CMS dump, subdomain lista, méret, URL lista.

---

## 5. SEO / sitemap / canonical

- `src/lib/seo.ts` — staging fallback `bohemjazz.netlify.app`; go-live: env `jazzfovaros.hu`
- `canonicalUrl()` — path-prefix módban `/en` prefix EN buildhez
- `sitemap.ts` — `canonicalUrl()` használat; dinamikus oldalak `/${slug}/` (nem `/oldal/`)
- `robots.ts` — változatlan, ésszerű

---

## 6. Sanity editability

Nincs schema rewrite. Nav href generálás: `navHrefFromPageSlug` → kanonikus `/${slug}/`. Fallback tartalom megmarad.

---

## 7. Performance (biztonságos)

Már korábban: dynamic import homepage, VideoLiteEmbed click-to-load, Sanity image transforms (`next.config.ts`), Poppins weight csökkentés.

---

## 8. Javított blokkolók (pre-implementation)

| Issue | Fix |
|-------|-----|
| Program EN lineup linkek `/lineup/` prefix nélkül | `localizePathForLocale` |
| Footer Sanity nav EN prefix | `footerHref` / `localizePathForLocale` |
| Sitemap `/oldal/slug` | `/${slug}/` + `canonicalUrl` |
| jazzcapital.hu redirect hiány | middleware 308 |
| Year subdomain védelem | `isYearArchiveHost` bypass |
| `.env.example` elavult EN domain | frissítve |

---

## 9. Maradó manuális feladatok

1. Netlify dashboard: `NEXT_PUBLIC_SITE_URL_HU=https://jazzfovaros.hu`, `NEXT_PUBLIC_SITE_URL_EN=https://jazzfovaros.hu`
2. DNS: `jazzfovaros.hu` → Netlify (Netlify által adott rekordok)
3. **jazzcapital.hu** → külső 301 → `https://jazzfovaros.hu/en/` (domain szolgáltatónál)
4. Archív subdomain DNS — ne módosítsd go-live-kor
5. Launch QA checklist (`PRODUCTION_LAUNCH_CHECKLIST.md`)

---

## 10. QA parancsok

```bash
npm run lint
npx cross-env NODE_OPTIONS="--max-old-space-size=8192" npm run build
npx cross-env NODE_OPTIONS="--max-old-space-size=8192" npm run build:hu
npx cross-env NODE_OPTIONS="--max-old-space-size=8192" npm run build:en
```

Windows cache hiba esetén: töröld `.next/cache`-t, futtasd újra.
