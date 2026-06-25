# FINAL UI POLISH AND EN FIX REPORT

**Date:** 2026-06-23  
**Scope:** Focused UI/UX bugfix — Spotify removal, image loading, sharp sponsor logos, `/en` locale stability (including footer always Hungarian).

---

## 1. Changed files

| File | Change |
|------|--------|
| `src/lib/localeMode.ts` | `x-site-pathname` header constant |
| `src/lib/locale.ts` | Pathname-authoritative `getLocale()` |
| `src/middleware.ts` | Sets `x-site-pathname` on every path-prefix request |
| `src/components/home/Footer.tsx` | `getLocale()`, Spotify removed, `SmoothImage` sponsors |
| `src/components/common/SmoothImage.tsx` | **New** — fade-in on load |
| `src/sanity/lib/content.ts` | Sharper sponsor URLs; nav hrefs localized for EN |
| `src/app/globals.css` | Sponsor logo CSS |
| `src/app/page.tsx` + 12 page/components | `getLocale()` instead of `otherLocale.label` heuristic |
| `src/components/home/TicketBoxes.tsx` | `getLocale()` |

---

## 2. Spotify icon removal

- **Removed from:** `src/components/home/Footer.tsx` (social row)
- Facebook, Instagram, YouTube unchanged
- Lineup performer Spotify **links** (CMS URLs) kept — only the decorative footer icon removed

---

## 3. Image / background loading

- **Hero:** existing `HeroBannerLoader` (conditional, 2.8s max, `prefers-reduced-motion`)
- **Sponsors:** `SmoothImage` — neutral `#f5fbfd` placeholder + 300ms fade-in
- No global loader; no forced minimum delay

---

## 4. Supporter logo sharpness

**Root cause:** Next.js `Image` `width`/`height` props were too small (80×40, 64×32) for retina display sizes → blurry upscale.

**Fixes:**
- Sanity transform: `width: 800, quality: 90` (was 400)
- Display props: main 200×100, sponsors 160×80, partners 140×70
- `sizes` attribute for correct src selection
- `.footer-sponsor-logo` CSS helper

**Note:** Very low-res source assets in Sanity may still look soft — upload higher-res logos if needed.

---

## 5. `/en` bug — root cause and fix

**Symptom:** Footer and other sections stayed Hungarian on `/en/...` URLs.

**Root cause:** `getLocale()` relied on cookie/header that could be missing or stale during RSC renders after `/en` rewrite (internal path `/program` without `/en` prefix). Many components used `c.otherLocale.label === "HU"` as a fragile indirect check.

**Fix:**
1. Middleware sets **`x-site-pathname`** to the **original** URL path (`/en/program`, not rewritten `/program`)
2. `getLocale()` treats pathname as **authoritative** in path-prefix mode: `/en/*` → `en`, else `hu`
3. Footer, layout, and all pages use `await getLocale()` directly
4. `buildNavItem()` applies `localizePathForLocale()` so Sanity nav links include `/en` prefix server-side

**Not changed:** Language switch button logic, domain redirects, archive handling.

---

## 6. QA results (2026-06-23)

| Command | Result |
|---------|--------|
| `npm run lint` | **PASS** (0 errors) |
| `npm run build` | **PASS** |
| `npm run build:hu` | **PASS** |
| `npm run build:en` | **PASS** |

---

## 7. Remaining limitations

- Sanity footer nav items need `labelEn` set — items without EN label are hidden on EN (by design)
- Sanity sponsor source files below ~200px wide may still look soft
- Performer Spotify links in lineup modal remain if set in CMS (intentional)

---

## Manual QA checklist

- [ ] Spotify icon gone from footer
- [ ] `/en/` footer shows English section titles (Navigation, Contact, Main Supporters)
- [ ] `/en/program/` → English content after nav click
- [ ] HU `/` → Hungarian footer after language switch
- [ ] Sponsor logos sharper on retina
- [ ] Hero loader brief on slow connection only
