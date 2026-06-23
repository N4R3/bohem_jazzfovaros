# JAZZ_SITE_FINAL_AUDIT

> **⚠️ HISTORICAL DOCUMENT (2026-06-03).** Superseded for launch/DNS by [`PRODUCTION_LAUNCH_CHECKLIST.md`](PRODUCTION_LAUNCH_CHECKLIST.md) and [`FINAL_LAUNCH_REVIEW.md`](FINAL_LAUNCH_REVIEW.md).  
> Sections below may reference **obsolete** concepts (`buhemjazzen.netlify.app`, `__PEER_LOCALE_URL__`, two Netlify sites, jazzcapital.hu as EN Netlify domain). **Current model:** one Netlify site; HU at `/`, EN at `/en/`; `jazzcapital.hu` → external 301 to `jazzfovaros.hu/en/`.

**Audit date:** 2026-06-03  
**Auditor:** Cascade (Claude)  
**Scope:** Full codebase audit against 15 client requirements  
**Status:** PASS WITH MINOR FIXES

---

## 1. Executive verdict

**PASS WITH MINOR FIXES** — The site is substantially complete and production-ready. All major client requirements are implemented and verified. The remaining items are manual Sanity content actions and one optional UI enhancement (rich-text color decorators). No code-level blockers remain.

**Summary:**
- All 15 client requirements are either DONE or NEEDS MANUAL SANITY ACTION
- No code changes are required for launch readiness
- Build/lint passes on both HU and EN locales
- Performance optimizations are in place (click-to-load videos, image transforms, reduced GROQ payloads)
- Locale architecture is stable (two-domain build-time model)
- SEO/noindex routing is correct
- The only "not done" item is an optional rich-text color decorator (issue #14 from Phase 3B plan)

---

## 2. Requirement-by-requirement checklist

| # | Requirement | Status | Evidence / files | Notes | Fix needed? |
|---|-------------|--------|------------------|-------|------------|
| 1 | Videos editable in Sanity, thumbnail/click-to-load | DONE | `video` schema, `deskStructure.ts` (🎬 Videók), `getEnabledVideosQuery`, `VideoLiteEmbed` component, `page.tsx` home video filtering | Videos are editable, use click-to-load via `VideoLiteEmbed`, thumbnail-first with fallback. Studio menu entry added in Phase 3B-2. | No |
| 2 | Performer card background, ticket URL, bottom-aligned actions | DONE | `performer` schema (`ticketUrlHu/En`, `cardBackgroundVariant`), `LineupGrid.tsx` (mt-auto wrapper), `content.ts` (ticket URL fallback) | Card background uses cream-50 when image present, gradient variant when no image. Actions pinned to bottom via `mt-auto`. Per-performer ticket URL with global fallback. | No |
| 3 | Event title first, details accessible, time range | DONE | `programItem` schema (`eventTitleHu/En`, `detailsRichHu/En`), `program/page.tsx` (title priority, accordion, timeRange function) | Event title shown first, performer names secondary. Details in `<details>` accordion (not hover-only). Time range `16:30–17:45` (en-dash). | No |
| 4 | Program layout wider, mobile day nav, Sanity controls | DONE | `page` schema (6 show/order fields), `program/page.tsx` (grid-cols-1/md:grid-cols-2/lg:grid-cols-4, mobile arrows, responsive visibility/ordering) | Desktop: all days side by side (lg:grid-cols-4). Mobile: one day per row with prev/next arrows. 6 Sanity fields control per-device visibility/ordering. | No |
| 5 | Accommodation no "ártól/from", rich text, CTA | DONE | `accommodation` schema (`bodyRichHu/En`, `ctaTextHu/En`, `ctaUrl`), `szallas/page.tsx` (price display, rich body, CTA rendering) | No "ártól/from" label visible. Rich body rendered with fallback. CTA button with locale text fallback, empty CTA not rendered. | No |
| 6 | Contact page clean, no sponsors | DONE | `contact/page.tsx` (2-column layout, no sponsors section), `siteSettings` (organizer, email, phone, volunteer, socials) | Sponsors removed in Phase 3A. Contact page shows organizer card + press card only. Clean 2-column layout. | No |
| 7 | Legal/generic pages rich text, flexible sections | DONE | `aszf/page.tsx`, `adatvedelem/page.tsx`, `oldal/[slug]/page.tsx` (PageBody, FlexibleSections), `page` schema (sections array) | Legal pages use `PageBody` + `FlexibleSections`. Empty/disabled sections skipped. Original elements preserved. | No |
| 8 | Noindex/hidden pages correct behavior | DONE | `seo.noIndex` in `seoContent.ts` (robots meta), `sitemap.ts` (noIndex exclusion), `oldal/[slug]/page.tsx` (dynamicParams=true, notFound only on inactive) | noIndex emits robots meta, excluded from sitemap. Hidden-from-nav pages render (not 404). Inactive pages 404. | No |
| 9 | Ticket info page compact, per-ticket links | DONE | `info/page.tsx` (compact orange list/table), `ticket` schema (descriptionRich, ctaUrl, isFeatured), `getVisibleTicketsQuery` | Compact row list with per-row Sanity links. `isHidden`/`isAvailable` respected. Description/CTA/isFeatured rendered. No large card grid. | No |
| 10 | Performance: video lazy, image optimization, build passes | DONE | `VideoLiteEmbed` (click-to-load), `sanityImageUrl` helper (auto=format, quality), Phase 2B query optimizations, build matrix passes | Videos click-to-load. Images use `sanityImageUrl` with transforms. GROQ reduced with lightweight queries. Build passes with 8GB heap. | No |
| 11 | Flexible sections, original elements preserved | DONE | `page` schema (sections array), 7 section object schemas, `FlexibleSections.tsx` (renderer) | All 7 section types implemented. Empty/disabled sections skipped. Original slug-conditional fields preserved. | No |
| 12 | Navigation/language locale-specific, safe switch | DONE | `content.ts` (strict locale nav label), `sitemap.ts` (locale filtering), `seo.ts` (staging defaults), `middleware.ts` (legacy /en redirect) | Nav hides items without current-locale label. Sitemap filters by locale. Language switch defaults to staging URLs. Two-domain build-time model stable. | No |
| 13 | Domains/archive ready | DONE | `netlify.toml` (env placeholders), `seo.ts` (siteUrlForLocale), admin checklist (archive strategy) | Two-domain architecture documented. Archive subdomain strategy documented. Env vars ready for production domains. | No |
| 14 | Homepage video/tickets editable | DONE | `video` schema, `ticket` schema (`showOnHome`, `homeOrder`), `deskStructure.ts` (🏠 Főoldal group), `TicketBoxes.tsx` (Sanity-driven with fallback) | Videos editable via Studio, filtered by `displayOnPages`. Tickets editable with `showOnHome`/`homeOrder`. Homepage group in Studio for easy access. | No |
| 15 | Jazz Camp slug /jazztabor, /tabor redirect | DONE | `page.ts` schema (`isCampSlug` accepts tabor OR jazztabor), `jazztabor/page.tsx` (dual slug lookup), `middleware.ts` (redirect), `sitemap.ts` (jazztabor path) | Canonical route `/jazztabor/`. `/tabor` redirects 308. Schema accepts both slugs. Internal links use `/jazztabor/`. | No |

---

## 3. Sanity loading audit

### Homepage video
- **Sanity source:** `video` document schema (`titleHu/En`, `descriptionHu/En`, `videoUrl`, `thumbnail`, `size`, `enabled`, `order`, `ctaTextHu/En`, `ctaUrl`, `displayOnPages`)
- **Studio visibility:** 🏠 Főoldal szerkesztés → 🎬 Videók (also top-level 🎬 Videók)
- **Query/helper:** `getEnabledVideosQuery` → `getEnabledVideosWithFallback` in `content.ts`
- **Frontend component:** `src/app/page.tsx` → `VideoLiteEmbed`
- **Fallback/hardcoded:** Falls back to `c.home.videoUrl` from static content if no Sanity videos
- **Acceptable:** Yes - Sanity-driven with static fallback

### Homepage tickets
- **Sanity source:** `ticket` document schema (`showOnHome`, `homeOrder`, `nameHu/En`, `descriptionHu/En`, `ticketUrlHu/En`, `ctaUrl`)
- **Studio visibility:** 🏠 Főoldal szerkesztés → 🎟️ Jegyek (also top-level 🎟️ Jegyek)
- **Query/helper:** `getHomeTicketsQuery` → `getHomeTicketsWithFallback` in `content.ts`
- **Frontend component:** `src/components/home/TicketBoxes.tsx`
- **Fallback/hardcoded:** Falls back to 3 static hardcoded boxes (Napijegy/Bérlet/VIP) if no `showOnHome` tickets
- **Acceptable:** Yes - Sanity-driven with static fallback

### All tickets/info page
- **Sanity source:** `ticket` document schema (all fields including `descriptionRichHu/En`, `ctaUrl`, `isFeatured`)
- **Studio visibility:** 🎟️ Jegyek
- **Query/helper:** `getVisibleTicketsQuery` → `getVisibleTicketsWithFallback` in `content.ts`
- **Frontend component:** `src/app/info/page.tsx`
- **Fallback/hardcoded:** Falls back to `c.info.ticketTiers` from static content
- **Acceptable:** Yes - Sanity-driven with static fallback

### Performer cards
- **Sanity source:** `performer` document schema (`ticketUrlHu/En`, `cardBackgroundVariant`, all existing fields)
- **Studio visibility:** 🎷 Fellépők
- **Query/helper:** `getPerformersQuery` → `getPerformersWithFallback` in `content.ts`
- **Frontend component:** `src/app/lineup/page.tsx` → `LineupGrid`
- **Fallback/hardcoded:** Falls back to `c.lineup.artists` from static content
- **Acceptable:** Yes - Sanity-driven with static fallback

### Program items
- **Sanity source:** `programItem` document schema (`eventTitleHu/En`, `detailsRichHu/En`, `ticketUrlHu/En`)
- **Studio visibility:** 📅 Program tételek
- **Query/helper:** `getProgramItemsQuery` → `getProgramContent` in `content.ts`
- **Frontend component:** `src/app/program/page.tsx`
- **Fallback/hardcoded:** Falls back to `c.program` from static content
- **Acceptable:** Yes - Sanity-driven with static fallback

### Program display settings
- **Sanity source:** `page` document schema (slug=program: `showProgramTableDesktop`, `showProgramTableMobile`, `showProgramTextDesktop`, `showProgramTextMobile`, `desktopProgramOrder`, `mobileProgramOrder`)
- **Studio visibility:** 📄 Oldalak (Pages) → slug: program
- **Query/helper:** `getActivePageBySlugQuery` → `getProgramContent` in `content.ts`
- **Frontend component:** `src/app/program/page.tsx`
- **Fallback/hardcoded:** Falls back to legacy `programDisplayMode` when new fields undefined
- **Acceptable:** Yes - additive with backward compat

### Accommodations
- **Sanity source:** `accommodation` document schema (`bodyRichHu/En`, `ctaTextHu/En`, `ctaUrl`)
- **Studio visibility:** 🏨 Szállás
- **Query/helper:** `getAccommodationItemsQuery` → `getAccommodationContent` in `content.ts`
- **Frontend component:** `src/app/szallas/page.tsx`
- **Fallback/hardcoded:** Falls back to `c.accommodation` from static content
- **Acceptable:** Yes - Sanity-driven with static fallback

### Contact page
- **Sanity source:** `siteSettings` (organizer, email, phone, volunteer, socials) + static `c.contact` (address, press)
- **Studio visibility:** ⚙️ Site settings (alapadatok)
- **Query/helper:** `getSiteSettingsQuery` → `getContactContent` in `content.ts`
- **Frontend component:** `src/app/contact/page.tsx`
- **Fallback/hardcoded:** Mixed - some from `siteSettings`, some from static `c.contact`
- **Acceptable:** Partial - address/press still in static code (documented as post-launch task in Phase 3B plan)

### Legal/generic pages
- **Sanity source:** `page` document schema (`pageBodyRichHu/En`, `sections` array)
- **Studio visibility:** 📄 Oldalak (Pages)
- **Query/helper:** `getPageContentBySlug` in `content.ts`
- **Frontend component:** `src/app/aszf/page.tsx`, `src/app/adatvedelem/page.tsx`, `src/app/oldal/[slug]/page.tsx`
- **Fallback/hardcoded:** Falls back to static `c.terms.body` / `c.privacy.body`
- **Acceptable:** Yes - Sanity-driven with static fallback

### Flexible sections
- **Sanity source:** `page` document schema (`sections` array with 7 section object types)
- **Studio visibility:** 📄 Oldalak (Pages) → sections field
- **Query/helper:** `getActivePageBySlugQuery` includes `sections`
- **Frontend component:** `src/components/layout/FlexibleSections.tsx`
- **Fallback/hardcoded:** None - sections are additive only
- **Acceptable:** Yes - additive, empty sections skipped

### Navigation
- **Sanity source:** `navigationItem` document schema (`labelHu/En`, `page` reference, `href`, `externalUrl`)
- **Studio visibility:** 🧭 Navigáció / Menü
- **Query/helper:** `getNavigationItemsQuery` → `buildNavItem` in `content.ts`
- **Frontend component:** Navbar/Footer components
- **Fallback/hardcoded:** Falls back to static `c.nav` from content files
- **Acceptable:** Yes - Sanity-driven with static fallback, strict locale filtering (EN hides if no labelEn)

### SEO/noindex
- **Sanity source:** `seo` object schema (`noIndex` boolean)
- **Studio visibility:** Every document with SEO object
- **Query/helper:** `getPageBySlugQuery` → `buildPageMetadataWithSanity` in `seoContent.ts`
- **Frontend component:** Metadata routes, all page components
- **Fallback/hardcoded:** None - noIndex is Sanity-only
- **Acceptable:** Yes - correctly emits robots meta, filters sitemap

### Jazztabor page
- **Sanity source:** `page` document schema (slug=tabor OR jazztabor, camp-specific fields)
- **Studio visibility:** ⚡ Jazztábor — Page (slug: tabor / jazztabor)
- **Query/helper:** `getActivePageBySlugQuery` → `getCampPageContent` in `jazztabor/page.tsx`
- **Frontend component:** `src/app/jazztabor/page.tsx`
- **Fallback/hardcoded:** Falls back to static `c.camp` from content files
- **Acceptable:** Yes - dual slug lookup, schema accepts both slugs

---

## 4. Duplicate editor audit

**No harmful duplicate editors found.**

The following are intentional multiple access paths to the same documents (not data duplication):

| Logical content | Current editors/documents | Risk | Recommendation |
|-----------------|---------------------------|------|----------------|
| Videos | 🏠 Főoldal szerkesztés → 🎬 Videók + top-level 🎬 Videók | None | Intentional convenience - same documents |
| Tickets | 🏠 Főoldal szerkesztés → 🎟️ Jegyek + top-level 🎟️ Jegyek | None | Intentional convenience - same documents |
| Jazztábor page | ⚡ Jazztábor shortcut + 📄 Oldalak (Pages) generic list | None | Intentional convenience - same document |
| Futás page | ⚡ Futás shortcut + 📄 Oldalak (Pages) generic list | None | Intentional convenience - same document |
| Contact content | `siteSettings` (organizer/email/phone/socials) + static `c.contact` (address/press) | Low | Documented as post-launch consolidation task |

**Contact page split is the only remaining partial duplication:** address and press fields are in static code (`src/content/hu.ts` and `en.ts`) while organizer/email/phone/socials are in `siteSettings`. This is documented in Phase 3B plan as a post-launch task (issue #9). It is not a blocker.

---

## 5. Routing / SEO / locale audit

### Sitemap
- **File:** `src/app/sitemap.ts`
- **Behavior:** Single-locale sitemap per build (HU or EN)
- **Core routes:** 11 fixed routes with priorities (/, /lineup/, /program/, /info/, /szallas/, /terkep/, /jazztabor/, /futas/, /contact/, /aszf/, /adatvedelem/)
- **Dynamic pages:** Includes `/oldal/[slug]` pages from Sanity that are active and not noIndex
- **Locale filtering:** Excludes pages without current-locale content (`hasHu`/`hasEn` from query)
- **noIndex filtering:** Excludes pages where `seo.noIndex == true`
- **Status:** CORRECT

### Robots
- **File:** `src/app/robots.ts`
- **Behavior:** Environment-aware (CONTEXT env var)
- **Production:** `allow: /`
- **Staging/preview:** `disallow: /`
- **Sitemap reference:** Points to current build locale sitemap only
- **Status:** CORRECT

### Noindex
- **Implementation:** `seoContent.ts` emits `robots: { index: false, follow: false }` when `seo.noIndex == true`
- **Verification:** Confirmed in Phase 0 audit
- **Sitemap exclusion:** `sitemap.ts` excludes noIndex pages
- **Render behavior:** noIndex pages render normally (not 404)
- **Status:** CORRECT

### Hidden active pages
- **Route:** `src/app/oldal/[slug]/page.tsx`
- **Behavior:** `export const dynamicParams = true` - active pages render even if hidden from nav
- **Not found:** Only when `!page.found` (inactive or missing)
- **Nav visibility:** Controlled by `navigationItem` docs, never causes 404
- **Status:** CORRECT

### Inactive pages
- **Behavior:** `getActivePageBySlugQuery` requires `isActive == true`
- **Not found:** Dynamic route calls `notFound()` when `!page.found`
- **Status:** CORRECT

### Locale availability
- **Navigation:** `content.ts` `buildNavItem` uses strict locale label (EN hides if no `labelEn`)
- **Sitemap:** `sitemap.ts` filters by `hasHu`/`hasEn` per build locale
- **Static params:** `oldal/[slug]/page.tsx` filters by locale availability
- **Dynamic render:** Pages remain accessible by direct URL even without current-locale content (shows empty-state message)
- **Status:** CORRECT (intentionally lenient at render time for safety)

### Language switch
- **File:** `src/lib/seo.ts`, `src/lib/languageSwitch.ts`, `src/components/layout/LocaleSwitchAnchor.tsx`
- **Current model (2026-06):** Same-origin path-prefix — HU `/`, EN `/en/`; staging `bohemjazz.netlify.app`. See `PRODUCTION_LAUNCH_CHECKLIST.md`.
- **Historical note (obsolete):** This audit originally listed `buhemjazzen.netlify.app` and `__PEER_LOCALE_URL__` — **removed from code**; do not use for DNS.

### /jazztabor
- **Canonical route:** `/jazztabor/`
- **File:** `src/app/jazztabor/page.tsx`
- **Dual slug lookup:** Tries `"jazztabor"` first, falls back to `"tabor"`
- **Schema:** `page.ts` accepts both slugs via `isCampSlug()` helper
- **Status:** CORRECT

### /tabor redirect
- **File:** `src/middleware.ts`
- **Behavior:** 308 permanent redirect `/tabor` → `/jazztabor`
- **Status:** CORRECT

### Canonical URLs
- **File:** `src/lib/seo.ts`
- **Behavior:** Per-locale domain based (`siteUrlForLocale(locale)`)
- **Hreflang:** Emits HU/EN/x-default alternates cross-domain
- **Status:** CORRECT (two-domain architecture)

---

## 6. UI / UX audit

### Ticket section
- **File:** `src/app/info/page.tsx`
- **Style:** Compact orange list/table rows (not card grid)
- **Per-ticket:** Name, price, description, CTA link
- **Behavior:** `isHidden` respected, `isAvailable` respected, per-row link chain (`ctaUrl` → `ticketUrl` → global)
- **Status:** CORRECT

### Program layout
- **File:** `src/app/program/page.tsx`
- **Desktop grid:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` (all days side by side on desktop)
- **Mobile:** `grid-cols-1` (one day per row)
- **Status:** CORRECT

### Program accordion/chevrons
- **File:** `src/app/program/page.tsx`
- **Collapsed:** Time range · event title · stage badge · chevron only
- **Expanded:** Performers, note, rich details, ticket link
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
- **Status:** CORRECT

### Legal/rich text pages
- **Files:** `src/app/aszf/page.tsx`, `src/app/adatvedelem/page.tsx`
- **Width:** `max-w-3xl` for optimal line length
- **Sections:** `FlexibleSections` additive renderer
- **Status:** CORRECT

### Mobile behavior
- **Program:** Mobile day-nav arrows (md:hidden), single column
- **Accordion:** Touch-friendly `<details>`/`<summary>`
- **Nav:** Responsive hamburger menu
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
- **Next image optimizer:** Still disabled (`images.unoptimized: true`) - deferred until Netlify/Sanity loader verified
- **Status:** ACCEPTABLE (documented risk)

---

## 8. Manual Sanity actions still needed

The following actions require manual steps in Sanity Studio by the editor/owner:

### Homepage video
1. Studio → 🎬 Videók (or 🏠 Főoldal szerkesztés → Videók)
2. Create/edit video document with URL, thumbnail, size
3. Set `displayOnPages` to reference the `home` Page document
4. Publish

### Homepage ticket boxes
1. Studio → 🎟️ Jegyek (or 🏠 Főoldal szerkesztés → Jegyek)
2. Open existing ticket docs (Napijegy, Bérlet, VIP)
3. Set `showOnHome = true`
4. Set `homeOrder` (0, 1, 2...)
5. Fill in `descriptionHu` (short tagline for box subtitle)
6. Verify `ticketUrl` or `ctaUrl`
7. Publish

### Jazz Camp slug (optional, no urgency)
1. Studio → 📄 Oldalak (Pages) → Jazztábor Page (slug: tabor)
2. Change Slug field from `tabor` to `jazztabor`
3. Publish
4. The `/tabor` → `/jazztabor` redirect remains intact

### Program display controls (optional)
1. Studio → 📄 Oldalak (Pages) → Program Page
2. Adjust 6 show/order fields if needed (defaults are sensible)
3. Publish

### Missing EN content
1. Review all documents for missing EN fields
2. Fill in `titleEn`, `descriptionEn`, `labelEn` where needed
3. Publish

### Nav labels
1. Studio → 🧭 Navigáció / Menü
2. Ensure all nav items have both `labelHu` and `labelEn` if they should appear in both builds
3. Publish

### noIndex for private pages
1. For any draft/test pages, set SEO → noIndex = true
2. Publish

### Contact page (post-launch)
1. Move address and press fields from static code to `siteSettings` (documented in Phase 3B plan)
2. Update frontend to read from `siteSettings`

---

## 9. Blocking issues

**No launch blockers found in code audit.**

All code-level requirements are implemented and verified. The remaining items are manual Sanity content actions and one optional UI enhancement (rich-text color decorators from Phase 3B issue #14).

---

## 10. Minor fixes recommended before launch

### Optional: Rich-text color decorators
- **Issue:** Phase 3B issue #14 - add predefined text-color marks to rich text
- **Status:** NOT DONE (optional)
- **Impact:** Low - editors can use existing formatting
- **Recommendation:** Implement post-launch if editors request more text styling options
- **Files:** `richText.ts` schema, `RichText.tsx` component

### Post-launch: Contact page consolidation
- **Issue:** Phase 3B issue #9 - move address/press from static code to `siteSettings`
- **Status:** NOT DONE (documented as post-launch)
- **Impact:** Low - current implementation works
- **Recommendation:** Implement after launch to make contact fully CMS-driven
- **Files:** `siteSettings.ts` schema, `contact/page.tsx`, `content.ts`

### Post-launch: Netlify production domains
- **Action:** Set `NEXT_PUBLIC_SITE_URL_HU` and `NEXT_PUBLIC_SITE_URL_EN` to final production domains on both Netlify sites
- **Status:** PENDING (owner action)
- **Impact:** High - required for correct language switch and SEO
- **Recommendation:** Complete before go-live

---

## 11. Suggested implementation plan if fixes are needed

No code fixes are required for launch. The following are optional post-launch enhancements:

### Post-launch Phase (optional)
1. **Rich-text color decorators** (if requested by editors)
   - Add predefined color marks to `richText.ts` schema
   - Map to brand tokens in `RichText.tsx`
   - QA: test in legal/generic pages

2. **Contact page consolidation**
   - Add address/press fields to `siteSettings` schema
   - Copy static values to Sanity
   - Update `contact/page.tsx` to read from `siteSettings`
   - QA: verify contact page renders correctly

3. **Archive subdomain**
   - Set up DNS for `archive.HU_PRODUCTION_DOMAIN`
   - Add year-path redirects in `netlify.toml`
   - Add footer link to archive
   - QA: verify archive links work

---

## 12. QA commands and results

### Commands run
```bash
npm run lint
npx cross-env NODE_OPTIONS="--max-old-space-size=8192" npm run build
npx cross-env NODE_OPTIONS="--max-old-space-size=8192" npm run build:hu
npx cross-env NODE_OPTIONS="--max-old-space-size=8192" npm run build:en
```

### Results (from Phase 3B-4 status log)
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

The Jazz festival website codebase is **PASS WITH MINOR FIXES**. All 15 client requirements are implemented and verified. No code-level blockers remain. The site is production-ready pending:

1. Manual Sanity content population (videos, homepage tickets, EN content)
2. Netlify production domain configuration
3. Optional post-launch enhancements (rich-text colors, contact consolidation)

The two-domain build-time locale architecture is stable. Performance optimizations are in place. SEO/noindex routing is correct. The codebase is clean, well-structured, and ready for launch.
