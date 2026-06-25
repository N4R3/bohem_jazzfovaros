# FINAL SAFE PERFORMANCE POLISH REPORT

**Date:** 2026-06-23  
**Scope:** Conservative launch-safe performance polish — no routing, middleware, Sanity schema, or domain changes.

---

## 1. Changed files

| File | Change |
|------|--------|
| `src/components/home/HeroBannerLoader.tsx` | **New** — conditional homepage hero background loader |
| `src/app/page.tsx` | Hero loader integration (homepage only) |
| `src/app/globals.css` | Hero loader styles, program accordion summary transition, `prefers-reduced-motion` scroll fix |
| `src/components/home/Navbar.tsx` | `useReducedMotion` for mobile menu animations |
| `src/components/layout/FlexibleSections.tsx` | `loading="lazy"`, gallery `sizes` |
| `src/components/lineup/LineupGrid.tsx` | Explicit `loading="lazy"` on performer cards |
| `src/app/szallas/page.tsx` | `loading="lazy"` on hotel images |
| `src/app/program/page.tsx` | `program-slot` class for CSS transition |
| `src/components/home/Footer.tsx` | `loading="lazy"` on sponsor logos |

---

## 2. Safe optimizations made

- Homepage hero CSS background preload + conditional overlay (no global app loader)
- Below-the-fold lazy loading on gallery, accommodation, lineup cards, footer sponsors, flexible section images
- `prefers-reduced-motion`: hero loader pulse disabled; `scroll-behavior: auto` on `html`
- Mobile menu respects reduced motion (instant open/close when preferred)
- Program accordion summary hover uses light CSS transition only

---

## 3. Loader behavior

**Component:** `HeroBannerLoader` (homepage `hero-fold` only)

| Rule | Behavior |
|------|----------|
| When shown | Only while hero CSS background image (`header_phone1` / `header_normal1` / `header_wide1`) is preloading |
| When hidden | Immediately after image `onload`, or after **2.8s** timeout (whichever first) |
| Cached load | Overlay may not appear or flashes briefly |
| Scope | Does not block rest of page; `pointer-events: none`; z-index under hero content |
| Motion | Subtle pulse bars; disabled under `prefers-reduced-motion` |
| Style | Cream / teal / orange accent; “Jazzfőváros” + “Betöltés…” |

No minimum artificial delay. No route-transition blocking.

---

## 4. Image improvements

| Area | Improvement |
|------|-------------|
| Hero logo (`Hero.tsx`) | `priority` kept (true LCP element) |
| Hero CSS backgrounds | Preloaded by `HeroBannerLoader` |
| LineupTeaser | Already had `lazy` + `sizes` |
| LineupGrid cards | `loading="lazy"` + existing `sizes` |
| FlexibleSections image/gallery | `lazy` + `sizes` on gallery |
| Szállás cards | `loading="lazy"` |
| Footer sponsors | `loading="lazy"` |
| Sanity transforms | Unchanged — `sanityImageUrl()` with width/quality already in use |

---

## 5. Smoothness improvements

- `html { scroll-behavior: smooth }` already present; now disabled for `prefers-reduced-motion`
- Navbar mobile panel: shorter/zero animation when reduced motion preferred
- Program `details.program-slot` summary: 150ms background transition

**Not changed:** Framer Motion on lineup cards (working, low risk to rewrite); native `details` open/close (no JS accordion rewrite).

---

## 6. Intentionally not changed

- `middleware.ts`, locale, language switch, redirects
- Sanity schemas, GROQ queries, CMS editability
- `netlify.toml`, env files
- VideoLiteEmbed click-to-load (verified working)
- Archive subdomain handling
- Global full-screen loader
- New dependencies
- Visual redesign / cropping / section removal

---

## 7. Sanity CORS — live domain note (manual)

**Not changed from code.** In [Sanity Manage → API → CORS origins](https://www.sanity.io/manage), ensure production includes:

- `https://jazzfovaros.hu`
- `https://www.jazzfovaros.hu`

**Keep existing origins:**

- `http://localhost:3000` (and other local ports if used)
- `https://bohemjazz.netlify.app`
- `https://*.netlify.app` (if already configured)

**Credentials:** Enable only if browser Studio / preview auth requires it; otherwise standard allowed origin is sufficient.

---

## 8. QA command results (2026-06-23)

| Command | Result |
|---------|--------|
| `npm run lint` | **PASS** |
| `npm run build` | **PASS** — homepage 159 kB First Load JS (+0.3 kB loader) |
| `npm run build:hu` | **PASS** — 19 pages |
| `npm run build:en` | **PASS** — 17 pages |

No `.next/cache` clear required.

---

## 9. Manual QA notes

Recommended post-deploy checks:

- [ ] Homepage normal load — loader brief or absent on fast connection
- [ ] Hard refresh / cache disabled — loader may appear until bg loads
- [ ] Cached reload — loader minimal
- [ ] `/en/` homepage — same loader behavior
- [ ] Mobile menu open/close
- [ ] Program accordion expand
- [ ] Video click-to-load
- [ ] Sanity content visible on staging/production
- [ ] Language switch unchanged
- [ ] No console errors

---

## 10. Optional future improvements (not done — higher risk)

- Convert hero CSS backgrounds to `next/image` `<picture>` for automatic WebP/AVIF (visual regression risk)
- Reduce Framer Motion on lineup grid for low-end devices
- `content-visibility: auto` on long below-fold sections
- Sanity image `srcSet` helper for gallery lightbox
- Service worker / offline (out of scope)

---

**Verdict:** Launch-safe polish complete. Ready to deploy.
