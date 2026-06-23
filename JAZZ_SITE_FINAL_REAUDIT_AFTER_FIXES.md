# JAZZ_SITE_FINAL_REAUDIT_AFTER_FIXES

> **⚠️ HISTORICAL DOCUMENT (2026-06-05).** CMS/admin findings may still be useful; **domain/locale sections are obsolete.** Use [`PRODUCTION_LAUNCH_CHECKLIST.md`](PRODUCTION_LAUNCH_CHECKLIST.md) for go-live.  
> Do not use `buhemjazzen.netlify.app`, `__PEER_LOCALE_URL__`, or jazzcapital.hu-as-Netlify-domain from this file.

**Audit date:** 2026-06-05  
**Auditor:** Cascade (Claude)  
**Scope:** Full codebase audit against 16 client requirements after R1/R2 fixes  
**Status:** NOT READY — ADMIN/CMS ISSUES

---

## 1. Executive verdict

### ❌ NOT READY — ADMIN/CMS ISSUES

**R1 and R2 are implemented correctly.** However, the site remains **NOT READY** because:

- **Homepage hero text, stats, and CTA banner are still hardcoded** in `src/content/hu.ts` / `en.ts`. The "🏠 Főoldal szerkesztés" Studio group is misleading — it only exposes SEO + video link + tickets, not the visible homepage text.
- **Program desktop layout is still cramped** — `lg:grid-cols-4` forces ~290 px columns, causing event titles to wrap into stacked rows.
- **Contact page address/press are still hardcoded** in `src/content/base.ts` (address, pressTitle, pressText), not in `siteSettings`.
- **Video model remains confusing** — page-local `videoUrl` exists (R2 fix), but the global `video` document is still visible in the Studio menu as "másodlagos" (secondary), which may still confuse editors.

These are not cosmetic; they block the owner from actually running the site effectively. The reaudit plan correctly identified R3/R4/R5 as "STILL PENDING."

---

## 2. Requirement-by-requirement table

| # | Requirement | Status | Evidence/files | Notes | Fix needed? |
|---|-------------|--------|----------------|-------|------------|
| 1 | Videos editable in Sanity, page-local YouTube link | DONE | `page.ts` schema (lines 71-88: `videoUrl`, `videoTitleHu/En`), `page.tsx` home (lines 66-156: reads `homePage.videoUrl` first), `jazztabor/page.tsx` (lines 50-52: reads `page.videoUrl`), `[slug]/page.tsx` (lines 138-146: renders page-local video) | R2 implemented. Page-local video URL field added to all pages. Homepage and jazztabor read from page doc first, fallback to static/global. | No |
| 2 | Homepage editor normal, visible content editable | PARTIAL | `app/page.tsx` (lines 114-120: hero from `c.home.heroCta`, info bar from `c.meta.festivalDates/venue`), `page.ts` schema (no home-specific hero/stats/CTA fields), `deskStructure.ts` (lines 27-46: "Főoldal szerkesztés" only has SEO + video + tickets) | Homepage visible text (hero CTA, info bar, stats, CTA banner) is hardcoded in `src/content/hu.ts`/`en.ts`. Studio "Főoldal" group cannot edit it → misleading. | Yes (R3) |
| 3 | Performer card background, ticket URL, bottom-aligned actions | DONE | `performer` schema (`ticketUrlHu/En`, `cardBackgroundVariant`), `lineup/page.tsx` (lines 263: ticket URL), `LineupGrid.tsx` (mt-auto wrapper) | Card background uses cream-50 when image present, gradient variant when no image. Actions pinned to bottom via `mt-auto`. Per-performer ticket URL with global fallback. | No |
| 4 | Program event title first, details on click/tap, time range format | DONE | `programItem` schema (`eventTitleHu/En`, `detailsRichHu/En`), `program/page.tsx` (lines 202: `slot.eventTitle || slot.artist`, lines 187-232: `<details>`/`<summary>` accordion, lines 193-196: time range display) | Event title shown first, performer names secondary. Details in `<details>` accordion (not hover-only). Time range `16:30–17:45` (en-dash). | No |
| 5 | Program layout wider, mobile day nav, Sanity controls | PARTIAL | `page.ts` schema (lines 201-262: 6 show/order fields), `program/page.tsx` (lines 309-339: responsive visibility/order, lines 126-171: mobile arrows), line 84: `lg:grid-cols-4` | Mobile day-nav arrows work. 6 Sanity controls exist. **Desktop layout still cramped** — `lg:grid-cols-4` in 1280 px container = ~290 px columns → titles wrap. | Yes (R4) |
| 6 | Accommodation no "ártól/from", rich text, CTA | DONE | `accommodation` schema (`bodyRichHu/En`, `ctaTextHu/En`, `ctaUrl`), `szallas/page.tsx` (lines 135-141: rich body, lines 157-174: CTA with empty check) | No "ártól/from" label visible. Rich body rendered with fallback. CTA button with locale text fallback, empty CTA not rendered. | No |
| 7 | Contact page clean, no sponsors, editable | PARTIAL | `contact/page.tsx` (lines 56-67: address from `contact.address`, lines 167-173: pressTitle/pressText from `contact.pressTitle/pressText`), `siteSettings` (email/phone/social/volunteer) | Sponsors removed (correct). Layout is clean 2-column. **Address and press are still hardcoded** in `src/content/base.ts` / `hu.ts` / `en.ts`, not in `siteSettings`. | Yes (R5) |
| 8 | Legal/generic pages rich text, flexible sections | DONE | `aszf/page.tsx`, `adatvedelem/page.tsx`, `[slug]/page.tsx` (PageBody, FlexibleSections), `page.ts` schema (sections array) | Legal pages use `PageBody` + `FlexibleSections`. Empty/disabled sections skipped. | No |
| 9 | Noindex/hidden pages routing | DONE | `[slug]/page.tsx` (lines 120-123: strict locale 404), `middleware.ts` (lines 45-51: `/oldal/<slug>` → `/<slug>` 308 redirect), `seoContent.ts` (robots meta), `sitemap.ts` (noIndex exclusion) | Root-level `/<slug>` route added (R1). `/oldal/<slug>` redirects 308. Strict locale availability (404 if no current-locale content). noIndex renders but excluded from sitemap. | No |
| 10 | Locale/language behavior | DONE | `content.ts` (strict nav filtering), `sitemap.ts` (locale filtering), `[slug]/page.tsx` (strict locale 404), `seo.ts` (staging defaults) | HU-only pages 404 in EN and vice-versa (strict). Nav hides items without current-locale label. Language switch defaults to staging URLs. Two-domain build-time model stable. | No |
| 11 | Ticket/info page compact, per-ticket links | DONE | `ticket` schema (descriptionRich, ctaUrl, isFeatured), `info/page.tsx` (compact orange list/table, per-row links) | Compact row list with per-row Sanity links. `isHidden`/`isAvailable` respected. No large card grid. | No |
| 12 | Performance: video lazy, image optimization, build passes | DONE | `VideoLiteEmbed` (click-to-load), `sanityImageUrl` helper, Phase 2B query optimizations, build matrix passes | Videos click-to-load. Images use `sanityImageUrl` with transforms. GROQ reduced with lightweight queries. Build passes with 8GB heap. | No |
| 13 | Flexible sections, original elements preserved | DONE | `page.ts` schema (7 section object types), `FlexibleSections.tsx` (renderer) | All 7 section types implemented. Empty/disabled sections skipped. Original slug-conditional fields preserved. | No |
| 14 | Two domains, EN domain opens EN build | DONE | `buildLocale.ts`, `netlify.toml`, `seo.ts` (siteUrlForLocale), nav language switch | Two-domain build-time model verified. Env vars ready for production domains. | No |
| 15 | Archive pages not in new site | DONE | No code tries to own archive paths. Documented in admin checklist for manual domain/archive setup. | Archive subdomain strategy documented. | No |
| 16 | Jazztabor slug /jazztabor, /tabor redirect | DONE | `jazztabor/page.tsx` (lines 12-16: dual slug lookup), `middleware.ts` (lines 39-43: /tabor → /jazztabor 308), `page.ts` schema (isCampSlug accepts both slugs), `sitemap.ts` (line 50: tabor → /jazztabor/) | Canonical route `/jazztabor/`. `/tabor` redirects 308. Schema accepts both slugs. Internal links use `/jazztabor/`. | No |

---

## 3. Sanity source matrix

| Visible section | Current source | Studio location | Frontend file/component | Status | Notes |
|---|---|---|---|---|---|
| Homepage hero text/CTA label | **HARDCODED** `c.home.heroCta` (`hu.ts:37-39`) | none (static) | `app/page.tsx:114` | HARDCODED SHOULD FIX | R3 needed |
| Homepage info bar (date/venue) | **HARDCODED** `c.meta.festivalDates/venue` | none (static) | `app/page.tsx:115-120` | HARDCODED SHOULD FIX (minor) | R3 optional |
| Homepage video | **SANITY PRIMARY** page-local `videoUrl` + global video fallback + static fallback | 🏠 Főoldal szerkesztés → Főoldal Page → "Videó (YouTube link)" | `app/page.tsx:66-156` | SANITY OK | R2 fixed |
| Homepage ticket boxes | **SANITY PRIMARY** tickets `showOnHome` + static fallback | 🎟️ Jegyek (showOnHome toggle) | `app/page.tsx:159` | SANITY OK | Works |
| Homepage stats (4/10+/120+/40+) | **HARDCODED** `c.home.highlights` (`hu.ts:67-72`) | none (static) | `app/page.tsx:163-166` | HARDCODED SHOULD FIX | R3 optional |
| Homepage lineup teaser title | **HARDCODED** `c.home.lineupTeaserTitle` | none (static) | `app/page.tsx:169` | HARDCODED ACCEPTABLE | Optional |
| Homepage lineup teaser cards | **SANITY PRIMARY** performers + static fallback | 🎷 Fellépők | `app/page.tsx:169` | SANITY OK | Works |
| Homepage CTA banner | **HARDCODED** `c.home.ctaBanner*` (`hu.ts:77-79`) | none (static) | `app/page.tsx:172-177` | HARDCODED SHOULD FIX | R3 needed |
| Navigation (header/footer) | **SANITY PRIMARY** navigationItem + static fallback | 🧭 Navigáció / Menü | Navbar/Footer | SANITY OK | Works |
| Footer copyright/legal links | **HARDCODED** `c.footer` | none (static) | Footer | HARDCODED ACCEPTABLE | Static is fine |
| Footer sponsors | **SANITY PRIMARY** sponsorCategory/sponsor + fallback | 🤝 Támogatók | Footer | SANITY OK | Works |
| Performers (lineup page) | **SANITY PRIMARY** performers + static fallback | 🎷 Fellépők | `app/lineup/page.tsx` | SANITY OK | Works |
| Performer links/ticket URL | **SANITY PRIMARY** performer fields + global fallback | 🎷 Fellépők | `app/lineup/page.tsx:263` | SANITY OK | Works |
| Program table (structured) | **SANITY PRIMARY** programItem + static fallback | 📅 Program tételek | `app/program/page.tsx` | SANITY OK | Works |
| Program free text | **SANITY PRIMARY** program Page `programBodyRich*` | 📄 Oldalak (Pages) → program | `app/program/page.tsx` | SANITY OK | Works |
| Program display controls | **SANITY PRIMARY** program Page (6 fields) | 📄 Oldalak (Pages) → program | `app/program/page.tsx:309-339` | SANITY OK | Works |
| Accommodations | **SANITY PRIMARY** accommodation + static fallback | 🏨 Szállás | `app/szallas/page.tsx` | SANITY OK | Works |
| Ticket/info page rows | **SANITY PRIMARY** ticket + static fallback | 🎟️ Jegyek | `app/info/page.tsx` | SANITY OK | Works |
| Info FAQ | **SANITY PRIMARY** page `infoFaqItems` + static fallback | 📄 Oldalak (Pages) → info | `app/info/page.tsx:43-54` | SANITY OK | Works |
| Contact email/phone/social/volunteer | **SANITY PRIMARY** `siteSettings` + static fallback | ⚙️ Site settings | `app/contact/page.tsx:78-111` | SANITY OK | Works |
| Contact address | **HARDCODED** `c.contact.address` (`base.ts`) | none (static) | `app/contact/page.tsx:67` | HARDCODED SHOULD FIX | R5 needed |
| Contact press title/text | **HARDCODED** `c.contact.pressTitle/pressText` (`base.ts`) | none (static) | `app/contact/page.tsx:167-173` | HARDCODED SHOULD FIX | R5 needed |
| Contact hero/body | **SANITY PRIMARY** contact Page | 📄 Oldalak (Pages) → contact | `app/contact/page.tsx:29-39` | SANITY OK | Works |
| Legal (ÁSZF/Adatvédelem) | **SANITY PRIMARY** page body + flexible sections | 📄 Oldalak (Pages) | `aszf/page.tsx`, `adatvedelem/page.tsx` | SANITY OK | Works |
| Jazztabor hero/body2/schedule/supporters | **SANITY PRIMARY** camp Page (`campCms`) + static fallback | ⚡ Jazztábor — Page | `app/jazztabor/page.tsx:39-60` | SANITY OK | Works |
| Jazztabor main description | **MIXED** `camp.description` when no body2 | ⚡ Jazztábor — Page + static | `app/jazztabor/page.tsx:82-83` | MIXED (works) | body2 exists, can replace static |
| Jazztabor video | **SANITY PRIMARY** page-local `videoUrl` + static fallback | ⚡ Jazztábor — Page → "Videó (YouTube link)" | `app/jazztabor/page.tsx:50-52` | SANITY OK | R2 fixed |
| Venue/map | **SANITY PRIMARY** venue + static fallback | 📍 Helyszín (Venue) | `app/info/page.tsx:275-311` | SANITY OK | Works |
| Transport | **SANITY PRIMARY** transportItem + fallback | 🚗 Közlekedés | Various | SANITY OK | Works |
| Generic pages/flexible sections | **SANITY PRIMARY** page `sections` | 📄 Oldalak (Pages) | `[slug]/page.tsx` | SANITY OK | Works |

---

## 4. Admin/editability audit

**Can the owner find and edit the following in Sanity Studio?**

| Content | Editable? | Studio path | Notes |
|---------|----------|-------------|-------|
| Homepage video | ✅ YES | 🏠 Főoldal szerkesztés → Főoldal Page → "Videó (YouTube link)" | R2 fixed. Simple YouTube link field. |
| Homepage tickets | ✅ YES | 🎟️ Jegyek (showOnHome toggle) | Works. |
| Homepage hero text/CTA label | ❌ NO | — | Still hardcoded in `src/content/hu.ts`/`en.ts`. Studio "Főoldal" group misleading. |
| Homepage stats (4/10+/120+/40+) | ❌ NO | — | Still hardcoded in `src/content/hu.ts`/`en.ts`. |
| Homepage CTA banner | ❌ NO | — | Still hardcoded in `src/content/hu.ts`/`en.ts`. |
| Jazztabor video | ✅ YES | ⚡ Jazztábor — Page → "Videó (YouTube link)" | R2 fixed. |
| Program display controls | ✅ YES | 📄 Oldalak (Pages) → program → 6 show/order fields | Works. |
| Performers/ticket links | ✅ YES | 🎷 Fellépők (per-performer ticket URL) | Works. |
| Accommodations | ✅ YES | 🏨 Szállás | Works. |
| Contact email/phone/social/volunteer | ✅ YES | ⚙️ Site settings | Works. |
| Contact address | ❌ NO | — | Still hardcoded in `src/content/base.ts`. |
| Contact press title/text | ❌ NO | — | Still hardcoded in `src/content/base.ts`. |
| Legal pages (ÁSZF/Adatvédelem) | ✅ YES | 📄 Oldalak (Pages) → aszf/adatvedelem | Works. |
| Hidden direct-link pages | ✅ YES | 📄 Oldalak (Pages) → any slug | Works. Root-level `/<slug>` route added (R1). |

**Verdict:** The owner can edit most content, but **homepage visible text and contact address/press remain hardcoded**, which blocks full CMS-driven operation.

---

## 5. Routing/SEO/locale audit

### Root-level `/<slug>` route (R1)
- **File:** `src/app/[slug]/page.tsx`
- **Behavior:** Active Sanity pages render at `/<slug>` (e.g., `/sajto`)
- **Redirect:** `middleware.ts` lines 45-51 redirect `/oldal/<slug>` → `/<slug>` (308)
- **FIX_SLUGS:** Excludes fixed routes (home, info, lineup, program, etc.)
- **Status:** CORRECT

### `/oldal/<slug>` compatibility
- **Middleware:** 308 redirect to `/<slug>`
- **Status:** CORRECT

### `/jazztabor` and `/tabor`
- **Route:** `src/app/jazztabor/page.tsx`
- **Dual slug lookup:** Tries `"jazztabor"` first, falls back to `"tabor"`
- **Redirect:** `middleware.ts` lines 39-43: `/tabor` → `/jazztabor` (308)
- **Schema:** `page.ts` `isCampSlug()` accepts both slugs
- **Sitemap:** `sitemap.ts` line 50: `tabor` → `/jazztabor/`
- **Status:** CORRECT

### noIndex
- **Implementation:** `seoContent.ts` emits `robots: { index: false, follow: false }` when `seo.noIndex == true`
- **Verification:** Confirmed in code
- **Sitemap exclusion:** `sitemap.ts` excludes noIndex pages
- **Render behavior:** noIndex pages render normally (not 404)
- **Status:** CORRECT

### Hidden active pages
- **Route:** `[slug]/page.tsx` with `dynamicParams = true`
- **Behavior:** Active pages render even if hidden from nav
- **Not found:** Only when `!page.found` (inactive/missing)
- **Status:** CORRECT

### Inactive pages
- **Behavior:** `getActivePageBySlugQuery` requires `isActive == true`
- **Not found:** Dynamic route calls `notFound()` when `!page.found`
- **Status:** CORRECT

### Locale availability (strict, R1)
- **Nav filtering:** `content.ts` `buildNavItem` uses strict locale label (EN hides if no `labelEn`)
- **Sitemap filtering:** `sitemap.ts` lines 82-83 filters by `hasHu`/`hasEn` per build locale
- **Dynamic render filtering:** `[slug]/page.tsx` lines 120-123: `availableInLocale === false` → 404
- **Static params filtering:** `[slug]/page.tsx` lines 69-72: pre-generates only pages with current-locale content
- **Status:** CORRECT (strict locale enforcement, no HU→EN fallback at render time)

### Language switch
- **File:** `src/lib/seo.ts`, `src/lib/languageSwitch.ts`
- **Current model (2026-06):** Same-origin `/en` path-prefix; production `jazzfovaros.hu` + `/en/`. See `PRODUCTION_LAUNCH_CHECKLIST.md`.
- **Historical note (obsolete):** `buhemjazzen.netlify.app` references below this reaudit are **out of date**.

### Canonical URLs
- **File:** `src/lib/seo.ts`
- **Behavior:** Per-locale domain based (`siteUrlForLocale(locale)`)
- **Hreflang:** Emits HU/EN/x-default alternates cross-domain
- **Status:** CORRECT (two-domain architecture)

---

## 6. UI/UX audit

### Ticket/info page
- **File:** `src/app/info/page.tsx`
- **Style:** Compact orange list/table rows (not card grid)
- **Per-ticket:** Name, price, description, CTA link
- **Behavior:** `isHidden` respected, `isAvailable` respected, per-row link chain (`ctaUrl` → `ticketUrl` → global)
- **Status:** CORRECT

### Program desktop row layout
- **File:** `src/app/program/page.tsx`
- **Grid:** Line 84: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- **Container:** Line 351: `max-w-7xl` (1280 px)
- **Issue:** At `lg`, 4 columns × ~1280 px − gaps ≈ **~290 px per day card**. Each event row has time span `w-20` (80 px) + title `flex-1` + stage badge + chevron. In a ~290 px card with padding, the title's flexible space is ~150 px → long festival titles wrap into 3–4 lines, and the badge drops under.
- **Status:** NOT CORRECT (R4 still pending)

### Program mobile layout
- **Grid:** `grid-cols-1` (one day per row)
- **Nav arrows:** Lines 126-171, mobile-only (`md:hidden`)
- **Behavior:** First day: next only. Last day: prev only. Middle: both.
- **Status:** CORRECT

### Program accordion/chevrons
- **Collapsed:** Time range · title · stage badge · chevron only (lines 187-232)
- **Expanded:** Performers, note, rich details, ticket link (lines 235-276)
- **Interaction:** `<details>`/`<summary>` (not hover-only)
- **Status:** CORRECT

### Performer cards
- **File:** `src/components/lineup/LineupGrid.tsx`
- **Actions:** Wrapped in `mt-auto` container (pinned to card bottom)
- **Background:** Cream-50 when image present, gradient variant when no image
- **Ticket URL:** Per-performer URL with global fallback
- **Status:** CORRECT

### Accommodation cards
- **File:** `src/app/szallas/page.tsx`
- **Price:** Bold monospace, no "ártól/from" label
- **Body:** Rich text with fallback to plain description
- **CTA:** Button with locale text fallback, empty CTA not rendered
- **Status:** CORRECT

### Contact page
- **File:** `src/app/contact/page.tsx`
- **Layout:** 2-column grid (organizer card + press card)
- **Sponsors:** Removed (not duplicated from footer)
- **Hardcoded:** Address (line 67), pressTitle (line 167), pressText (line 173) from static `c.contact`
- **Status:** PARTIAL (layout correct, but address/press still hardcoded)

### Legal/rich text pages
- **Files:** `src/app/aszf/page.tsx`, `src/app/adatvedelem/page.tsx`
- **Width:** `max-w-3xl` for optimal line length
- **Sections:** `FlexibleSections` additive renderer
- **Status:** CORRECT

---

## 7. Performance audit

### Video iframe loading
- **Component:** `VideoLiteEmbed`
- **Behavior:** Thumbnail-first, click-to-load (no iframe before user click)
- **Fallback:** Styled placeholder when thumbnail missing
- **Status:** CORRECT

### Image optimization helper
- **File:** `src/sanity/lib/image.ts`
- **Helper:** `sanityImageUrl()`
- **Defaults:** `auto=format`, `quality(75)`, optional width/height
- **Usage:** Applied to performer cards, accommodations, sponsors, video thumbnails, flexible sections
- **Status:** CORRECT

### Remaining eager iframes
- **Map embeds:** Google Maps on `info` and `terkep` pages use `loading="lazy"` (not video, acceptable)
- **Status:** ACCEPTABLE

### Hydration/client components
- **Converted to server:** `Hero`, `LineupTeaser` (Phase 2B)
- **Remaining client:** Interactive components (Navbar, modals, animations)
- **Status:** CORRECT

### Build memory note
- **Windows:** Requires 8GB heap (`NODE_OPTIONS=--max-old-space-size=8192`)
- **Netlify:** Unaffected (Linux builds have sufficient memory)
- **Status:** DOCUMENTED

### Risky regressions
- **Next image optimizer:** Still disabled (`images.unoptimized: true`) — deferred until Netlify/Sanity loader verified
- **Status:** ACCEPTABLE (documented risk)

---

## 8. Remaining issues

### Blockers (must fix before launch)
- **Homepage visible text hardcoded** — hero CTA, stats, CTA banner cannot be edited in Sanity. Studio "Főoldal" group is misleading.
- **Program desktop layout cramped** — `lg:grid-cols-4` causes stacked event titles on desktop.

### Minor fixes (non-blocking but should fix)
- **Contact address/press hardcoded** — address, pressTitle, pressText in static code, not in `siteSettings`.
- **Video model confusing** — global `video` document still visible in Studio menu as "másodlagos" (secondary), may confuse editors despite R2 fix.

### Manual Sanity actions (owner must do)
- Homepage video: Set `videoUrl` on Főoldal Page (R2).
- Homepage tickets: Set `showOnHome = true` on ticket docs.
- Jazztabor slug rename (optional): Change slug from `tabor` to `jazztabor` in Studio.
- EN content: Fill in missing EN fields across all documents.
- Nav labels: Ensure all nav items have both `labelHu` and `labelEn` for both builds.
- noIndex: Set `seo.noIndex = true` for draft/test pages.

### Launch setup actions (owner must do)
- Set `NEXT_PUBLIC_SITE_URL_HU` and `NEXT_PUBLIC_SITE_URL_EN` to final production domains on both Netlify sites.
- Configure custom domains on both Netlify sites.
- Set up archive subdomain DNS (separate hosting).
- Verify sitemap and robots after production deploy.

---

## 9. Recommended next fixes

### Phase R3 — Real homepage editor (connect homepage to Sanity)
- **Files:** `schemaTypes/documents/page.ts` (add home-only fields: hero CTA label, CTA-banner title/subtitle/button, optional editable stats array), `sanity/lib/queries.ts`, `sanity/types.ts`, `sanity/lib/content.ts` (new `getHomePageContent` or extend), `app/page.tsx`, `deskStructure.ts` (Főoldal group now meaningfully edits home).
- **Risk:** medium (more home fields; must keep static fallback so nothing blanks).
- **Expected result:** The "Főoldal szerkesztés" group actually edits visible homepage text + video + tickets.

### Phase R4 — Program desktop layout fix
- **Files:** `app/program/page.tsx`
- **Change:** Line 84: `md:grid-cols-2` (drop `lg:grid-cols-4`); optional `max-w-[1400px]`; tighten row (title `min-w-0` + `line-clamp-2`, badge/chevron `shrink-0`).
- **Risk:** low (CSS only).
- **Expected result:** Clean wide desktop rows (time · title · stage · chevron on one line); mobile unchanged.

### Phase R5 — Remaining hardcoded → Sanity (owner-relevant)
- **Files:** `siteSettings.ts` (add address, press title/text), `content.ts` `getContactContent`, `contact/page.tsx`.
- **Risk:** low (additive + fallback).
- **Expected result:** Contact address/press editable; fewer "why can't I change this" gaps.

### Optional post-launch
- **Deprecate global video document** — Remove from main deskStructure menu or move under clearly-labelled "Haladó / Deprecated" group.
- **Rich-text color decorators** — Add predefined text-color marks to rich text if editors request more styling options.

---

## 10. QA commands and results

### Commands to run
```bash
npm run lint
npx cross-env NODE_OPTIONS="--max-old-space-size=8192" npm run build
npx cross-env NODE_OPTIONS="--max-old-space-size=8192" npm run build:hu
npx cross-env NODE_OPTIONS="--max-old-space-size=8192" npm run build:en
```

### Expected results (from R1/R2 implementation)
- `npm run lint`: ✅ pass
- `build:hu` (8 GB heap): ✅ pass — 18 routes
- `build:en` (8 GB heap): ✅ pass — 17 routes
- `build` default (8 GB heap, clean cache): ✅ pass — 18 routes

### Note on typecheck
- `npm run typecheck`: ❌ script not defined in `package.json`
- Types are checked inside `next build` (all builds passed)

### Windows build note
- Prior failures with stale `.next` cache resolved after cleanup
- Netlify Linux builds unaffected
- 8GB heap required on this Windows machine for type-check pass

---

## Conclusion

The Jazz festival website codebase is **NOT READY — ADMIN/CMS ISSUES**. R1 (root-level slug route) and R2 (page-local video URL) are correctly implemented. However, **R3 (homepage editor), R4 (program desktop layout), and R5 (contact address/press consolidation) remain pending**.

The most critical blockers are:
1. Homepage visible text (hero, stats, CTA banner) is hardcoded and cannot be edited in Sanity, making the "Főoldal szerkesztés" Studio group misleading.
2. Program desktop layout is cramped due to `lg:grid-cols-4`, causing event titles to wrap into stacked rows.

These are not cosmetic; they block the owner from actually running the site effectively. Implementing R3, R4, and R5 as outlined in the reaudit plan will make the site production-ready.
