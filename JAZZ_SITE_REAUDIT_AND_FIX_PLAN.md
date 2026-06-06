# JAZZ_SITE_REAUDIT_AND_FIX_PLAN

> **Date:** 2026-06-03
> **Author:** Claude (strict code re-audit — previous PASS/READY conclusions treated as unproven)
> **Method:** Every claim below is traced to actual source files. Nothing is marked DONE unless verified in code. "Sanity-driven" is only stated where the frontend reads Sanity *as primary*; "hardcoded fallback" is called out explicitly.

> ### ⏩ Implementation status (updated 2026-06-03 after coding)
> - ✅ **R1 IMPLEMENTED** — root-level `/<slug>` route added; `/oldal/<slug>` now 308-redirects to `/<slug>`; strict locale availability (`isPageAvailableInLocale`) applied to both dynamic routes → HU-only pages 404 in EN and vice-versa; noIndex still renders. Verified by build output (`/[slug]` pre-generates `/tanarok` in HU/default, none in EN).
> - ✅ **R2 IMPLEMENTED** — page-local `videoUrl` (+ optional `videoTitleHu/En`) field added to the `page` document; homepage reads it from the `home` Page doc, jazztábor reads it from its Page doc, generic `/<slug>` pages render it; all fall back to existing behavior; global `video` document marked secondary in deskStructure (not deleted).
> - ✅ **R3 IMPLEMENTED** — `home` Page doc: hero, stats (`homeStats`), CTA banner, primary CTA; `getHomePageVisibleContent` + `app/page.tsx` wiring; hu.ts/en.ts fallback retained.
> - ✅ **R4 IMPLEMENTED** — program row desktop grid: time | title | stage badge | chevron; `formatTimeRange`; day-card placement unchanged.
> - ⏳ **R5 STILL PENDING** — contact address/press → siteSettings; optional global video cleanup.
> - Lint ✅ · build ✅ · build:hu ✅ · build:en ✅ (8 GB heap, Windows).
>
> The audit text below is preserved as the original verified findings.

---

## 1. Executive verdict

### ❌ NOT READY — ADMIN/CMS ISSUES

The build passes and the public site renders, but the **owner's editing experience is genuinely broken or misleading** in several verified ways:

- **Jazztábor video is impossible to edit** — it is hardcoded in `src/content/base.ts` (`camp.videoUrl`). No Sanity field exists for it anywhere.
- **Homepage hero text, stats, and CTA banner are hardcoded** in `src/content/hu.ts` / `en.ts`. The "🏠 Főoldal szerkesztés" Studio group only exposes SEO + global videos + tickets — it does **not** edit the visible homepage text, so it is misleading.
- **Video model is split across 3–4 mechanisms** (global `video` document, `sectionVideo` flexible block, hardcoded `base.ts` fallbacks, `displayOnPages` references). Editing one page's video requires hunting through a global collection.
- **Hidden "active" pages can still 404** — but *not* for the reason previously assumed. The `/oldal/[slug]` route renders correctly; the real cause is a **URL-structure mismatch** (custom pages live only at `/oldal/<slug>`, so a direct link to `/<slug>` 404s) plus draft/isActive conditions.
- **Program desktop layout** is cramped: `lg:grid-cols-4` inside a `max-w-7xl` container forces ~290 px columns, so event titles wrap into "stacked" rows.

A secondary honesty correction: the earlier claim that "HU-only pages do not render in EN" is **only partly true** — it holds for nav and sitemap, but the dynamic page *render* query has **no locale filter**, so a HU-only page still renders (with HU fallback) at `/oldal/<slug>` in the EN build.

These are not cosmetic; they block the owner from actually running the site. Hence **NOT READY — ADMIN/CMS ISSUES**.

---

## 2. Owner-reported issue verification

| # | Owner issue | Verified? | Evidence / files | Root cause | Fix required |
|---|---|---|---|---|---|
| 1 | Video editing still wrong | ✅ YES | `video.ts` (global doc), `sectionVideo.ts`, `page.ts:632` (sectionVideo in sections), `app/page.tsx:52-61,122-144` (home reads global video via `displayOnPages`), `jazztabor/page.tsx:68-76` (`camp.videoUrl` **hardcoded**), `base.ts:34,172` (static URLs), `VideoEmbed.tsx`/`VideoSection.tsx` (dead, unused) | 3–4 parallel video mechanisms; jazztábor video has **no Sanity field at all**; home video requires editing a separate global doc + setting `displayOnPages` | Replace with **page-local YouTube URL field** per page; deprecate global video doc from main editor |
| 2 | Homepage editor not normal | ✅ YES | `app/page.tsx` (hero/stats/CTA from `c.home.*` static), `hu.ts:36-92` (`home` block hardcoded), `page.ts:72-84,132-135` (home Page doc hides hero/body → SEO only), `deskStructure.ts:25-46` (Főoldal group = SEO + Videók + Jegyek only) | Homepage visible text is static; the Studio "Főoldal" group cannot edit it → misleading | Add home content fields (video URL, hero/CTA text, stats) to the `home` Page doc and wire frontend with fallback |
| 3 | Hidden active pages 404 | ⚠️ PARTIAL | `app/oldal/[slug]/page.tsx` (only dynamic route), `next.config.ts` (no `output:export` → ISR works), `content.ts:getActivePageBySlugQuery` (isActive filter, no locale filter) | Route logic for `/oldal/<slug>` is **correct**. Real cause: no root-level `/<slug>` route, so direct links to `/<slug>` 404; plus draft/`isActive:false` | Add root-level `[slug]` catch-all (guarded by FIX_SLUGS) **or** document `/oldal/` URL + ensure links use it |
| 4 | Program desktop still bad | ✅ YES | `program/page.tsx:90` (`lg:grid-cols-4`), container `max-w-7xl` (1280 px) | 4 columns × 1280 px ≈ 290 px each → time+title+badge wrap into stacked lines | Reduce to 2 wide desktop columns (`md:grid-cols-2`, drop `lg:grid-cols-4`), widen container, tighten row |
| 5 | Much still hardcoded | ✅ YES | See §7 full matrix | Hero, stats, CTA banner, accompanying programmes, jazztábor description/video, legal pages partly static | Per §7: move owner-relevant text into Sanity; accept truly static items |
| 6 | Editor duplication | ✅ YES | `deskStructure.ts` (video listed twice; tickets twice; home in 2 paths; jazztábor 2 paths), contact split 3 ways | Multiple paths to same/overlapping content | Consolidate to one editor per page; page-local video; document shortcuts |
| 7 | Locale availability | ⚠️ PARTIAL | nav strict (`content.ts buildNavItem`), sitemap filter (`sitemap.ts:82-83`), **render not filtered** (`getActivePageBySlugQuery`) | Nav + sitemap enforce locale; dynamic render does **not** | Decide: enforce locale at render (404/empty-state) or document fallback behavior |
| 8 | jazztabor/tabor | ✅ MOSTLY OK | route + redirect + slug predicates + sitemap all correct; only the **video** is hardcoded | Routing fine; video uneditable (see #1) | Add page-local video field for jazztábor |

---

## 3. Video model audit

### 3.1 Every video-related location (verified)

| Location | File | What it is | Editable by owner? |
|---|---|---|---|
| Global `video` document | `schemaTypes/documents/video.ts` | Full doc: titleHu/En, descriptionHu/En, `videoUrl`, thumbnail, size, enabled, order, ctaText*, ctaUrl, `displayOnPages` (refs to pages) | Yes, but in a separate collection |
| `sectionVideo` object | `schemaTypes/objects/sectionVideo.ts` | References a `video` doc; used inside `page.sections` | Yes, but indirect (must create video doc first, then reference it) |
| `page.sections` → sectionVideo | `page.ts:625-633` | Flexible-section path to embed a referenced video | Indirect |
| Home video render | `app/page.tsx:52-61, 122-144` | `getEnabledVideosWithFallback` fetches **all** enabled videos, filters by `displayOnPages` containing `"home"`; falls back to `c.home.videoUrl` | Indirect (must set displayOnPages → home) |
| Jazztábor video render | `jazztabor/page.tsx:68-76` | Uses `camp.videoUrl` = `BASE.camp.videoUrl` — **hardcoded** | ❌ NO |
| Static fallbacks | `base.ts:34` (`videoUrl`), `base.ts:172` (`camp.videoUrl`) | Hardcoded YouTube URLs | ❌ NO |
| `c.home.videoUrl` | `hu.ts:41`, `en.ts` | = `BASE.videoUrl` static | ❌ NO |
| Dead components | `home/VideoEmbed.tsx`, `home/VideoSection.tsx` | Defined, **imported nowhere** (verified) | N/A — should be deleted |
| `displayOnPages` query | `queries.ts:getEnabledVideosQuery` | Resolves refs to `slug.current[]` | — |

### 3.2 Why editing is confusing (verified facts)

1. **To change the home video**, the owner must: open "🎬 Videók" → create/edit a video doc → paste URL → set `enabled` → add a `displayOnPages` reference pointing at the `home` page → publish. That is 5 steps in a place separate from "the homepage."
2. **To change the jazztábor video**, there is **no path at all** — it is `BASE.camp.videoUrl` in code.
3. The same concept exists in **three schemas** (`video` doc, `sectionVideo`, hardcoded), so the owner cannot form a single mental model.
4. `size`, `displayOnPages`, `order`, `ctaText` add complexity the owner explicitly does not want.

### 3.3 Proposed simplified final model

**Page-local YouTube URL field.** Each page that needs a video gets a simple `videoUrl` (url) field on its own document, edited on that page's editor.

- Add `videoUrl` (url, optional) to the **`page` document**, shown for `home`, `jazztabor`, and any page that wants a video (or shown for all pages — low risk, empty = no video).
  - Label: "Videó (YouTube link)" with help text "Illeszd be a YouTube linket. A honlapon előnézet + kattintásra indul."
- **Home:** read `homePage.videoUrl` (the `home` Page doc), render via `VideoLiteEmbed`. Fallback to `BASE.videoUrl` only if empty.
- **Jazztábor:** read the camp Page doc's `videoUrl`, render via `VideoLiteEmbed`. Fallback to `BASE.camp.videoUrl`.
- Keep `VideoLiteEmbed` (click-to-load) — performance requirement preserved.
- **Global `video` document + `sectionVideo`:** keep the schema for backward-compatibility, but **remove `video` from the main deskStructure menu** (or move under a clearly-labelled "Haladó / Deprecated" group). `sectionVideo` may remain available only inside flexible sections for advanced pages. Document as deprecated.
- **Delete** the unused `VideoEmbed.tsx` and `VideoSection.tsx` (dead code).

Risk: low. Additive schema field; frontend switches source with fallback; no data deleted.

---

## 4. Homepage editability audit

Every visible homepage section and its **actual** source (verified in `app/page.tsx` + components + `hu.ts`):

| Section | Component | Source NOW | Editor location | Fix needed |
|---|---|---|---|---|
| Hero title / subtitle / CTA label | `Hero` (`page.tsx:109`) | **Hardcoded** `c.home.heroCta`, `c.home.heroTitle` (`hu.ts:37-39`) | none (static) | Add `home` Page fields OR accept static + document |
| Hero CTA url | `Hero` | Sanity `siteSettings.ticketUrl*` + fallback | Site settings | OK |
| Info bar (date / venue) | `InfoBar` (`page.tsx:110`) | **Hardcoded** `c.meta.festivalDates`, `c.meta.venue/city` | none (static) | Optionally Site settings (festival dates already exist there but unused here) |
| Homepage video | `VideoLiteEmbed` (`page.tsx:122`) | Sanity **global `video` doc** via `displayOnPages` + static fallback | "Videók" (separate) | **Move to page-local `videoUrl` on home doc** (§3) |
| Ticket boxes | `TicketBoxes` (`page.tsx:147`) | Sanity tickets `showOnHome` + static 3-box fallback | "Jegyek" | OK (works), keep |
| Stats bar (4/10+/120+/40+) | `StatsBar` (`page.tsx:151`) | **Hardcoded** `c.home.highlights` (`hu.ts:67-72`) | none (static) | Add `home` Page repeatable stats field if owner wants editable |
| Lineup teaser title | `LineupTeaser` (`page.tsx:157`) | **Hardcoded** `c.home.lineupTeaserTitle` | none | Optional |
| Lineup teaser cards | `LineupTeaser` | Sanity performers + static fallback | Fellépők | OK |
| CTA banner (title/subtitle/button) | `CtaSection` (`page.tsx:160`) | **Hardcoded** `c.home.ctaBanner*` (`hu.ts:77-79`) | none | Add `home` Page fields if owner wants editable |
| Széchenyi popup | `SzechenyiPopup` | Sanity `popupSettings` | Popup settings | OK |
| SEO meta | — | Sanity `home` Page `seo` | Főoldal Page (SEO) | OK |

**Conclusion:** The "🏠 Főoldal szerkesztés" group is misleading because the **most visible homepage text (hero, stats, CTA banner) is hardcoded** and cannot be edited there. The owner is right.

**Fix:** extend the `home` Page document (shown only for slug `home`) with: `videoUrl`, hero CTA label, CTA-banner title/subtitle/button, and (optional) editable stats array. Wire `app/page.tsx` to read these with static fallback. Then the Studio "Főoldal" group genuinely edits the homepage.

Exact files to change (Phase R3): `schemaTypes/documents/page.ts`, `sanity/lib/queries.ts`, `sanity/types.ts`, `sanity/lib/content.ts` (new `getHomePageContent` or extend), `app/page.tsx`, `deskStructure.ts`.

---

## 5. Hidden page 404 audit

### 5.1 Route logic trace (verified)

- **Only dynamic route:** `app/oldal/[slug]/page.tsx`. There is **no** root-level `[slug]` route (verified by file listing).
- `next.config.ts`: **no** `output: "export"` → Netlify plugin serves ISR/on-demand. So non-pre-rendered slugs are **not** forced to 404.
- `export const dynamicParams = true` (line 40).
- `generateStaticParams` (lines 44-67): returns active slugs **filtered by build locale** (`hasHu`/`hasEn`) and excluding `FIX_SLUGS`. This only affects *pre-rendering*.
- `DynamicPage` (lines 92-130): `notFound()` only if slug ∈ FIX_SLUGS, or `!page.found`.
- `getPageContentBySlug` → `getActivePageBySlugQuery` = `*[_type=="page" && slug.current==$slug && isActive==true][0]`. **No locale filter.**

### 5.2 Does an active hidden page render at `/oldal/<slug>`? — YES (proven)

Given a page with `isActive:true`, a slug, not in navigation, `noIndex` true or false:
- It is **not** in nav (irrelevant to the route).
- `noIndex` only affects metadata + sitemap (verified `seoContent.ts:139-149`, `sitemap.ts:80`) — **not** rendering.
- `getActivePageBySlugQuery` returns it (isActive true) → `found:true` → renders.
- Even if not pre-rendered (e.g. EN build, HU-only), `dynamicParams:true` + ISR renders it on demand with HU fallback.

**So the `/oldal/<slug>` route is correct.** The previous "works" claim is true *for that URL*.

### 5.3 Why the owner still sees 404 (real causes, strict)

1. **URL-structure mismatch (most likely).** The owner creates a page "sajto" and visits `https://domain/sajto`. There is no root `/sajto` route → **404**. The page only exists at `/oldal/sajto/`. The owner's mental model ("I made a page, it should be at /sajto") does not match the implementation.
2. **Unpublished draft.** Sanity Studio shows drafts; the published dataset (used by the query) does not contain unpublished drafts → `found:false` → 404. Easy to hit if the owner forgets **Publish**.
3. **`isActive:false`.** Returns 404 by design.
4. **ISR window.** A brand-new active page may 404 for up to ~30 s until first on-demand generation / revalidation.

### 5.4 Exact fix

**Primary fix (matches owner expectation):** add a **root-level catch-all** `src/app/[slug]/page.tsx` that:
- excludes `FIX_SLUGS` (so it never shadows `/program`, `/info`, etc.),
- resolves the Sanity page exactly like `/oldal/[slug]`,
- renders it, or `notFound()` only if inactive/missing.
- `dynamicParams = true`, `generateStaticParams` for active non-fixed slugs.

Then both `/sajto` **and** `/oldal/sajto` resolve. Optionally 301 `/oldal/<slug>` → `/<slug>` for canonical cleanliness, or keep both.

**Risk:** medium — a root catch-all can collide with future top-level routes; the `FIX_SLUGS` guard mitigates this, and Next.js gives static segment routes priority over the dynamic `[slug]`. Must verify build + that fixed routes still win.

**Secondary (doc) fix:** in the admin checklist, state clearly that custom pages are reachable at `/oldal/<slug>` (until/unless the root route is added), and that **Publish + Aktív** are required.

---

## 6. Program desktop layout audit

### 6.1 Why desktop rows still stack poorly (verified)

`program/page.tsx`:
- Day grid: `grid-cols-1 ... md:grid-cols-2 lg:grid-cols-4` (line 90), inside `max-w-7xl` (1280 px) wrapper (line 373).
- At `lg`, 4 columns × ~1280 px − gaps ≈ **~290 px per day card**.
- Each event row (lines 193-235): time span `w-20` (80 px) + title `flex-1` + stage badge + chevron.
- In a ~290 px card with padding, the title's flexible space is ~150 px → long festival titles ("Emanuele Urso 'King of Swing'") **wrap to 3–4 lines**, and the badge drops under, producing the "stacked / elongated" look the owner reports.

So the **`lg:grid-cols-4` change is the direct cause** — 4 narrow columns cannot give rows horizontal room.

### 6.2 Exact layout fix

1. **Grid:** change `md:grid-cols-2 lg:grid-cols-4` → **`md:grid-cols-2`** (two wide columns on desktop). Each column ≈ 600 px → rows fit on one line.
   - If the owner insists on all 4 days visible at once, the alternative is `xl:grid-cols-4` **only above ~1536 px** with a wider container (`max-w-[1600px]`), but 2 columns is the readable default. Recommend 2 columns; let owner choose.
2. **Container:** keep `max-w-7xl`, or widen to `max-w-[1400px]` for 2-column breathing room.
3. **Row:** make the collapsed `summary` a clean horizontal line:
   - time: `whitespace-nowrap` (already mono, fixed width) ✓
   - title: `flex-1 min-w-0 truncate` on desktop (or `line-clamp-2`) so it stays one/two lines and aligns,
   - stage badge: `shrink-0` (already), keep visible `sm:inline`,
   - chevron: `shrink-0` (already).
4. **Padding:** current `px-3 py-2 sm:px-3.5 sm:py-2.5` is fine once columns are wider; no excessive vertical padding.
5. **Mobile:** unchanged — `grid-cols-1`, one day per row, prev/next arrows (`md:hidden`) — already correct.

**Files:** `app/program/page.tsx` only. **Risk:** low (pure CSS/className).

---

## 7. Full Sanity usage matrix

Status legend: **SANITY OK** = Sanity primary; **HARDCODED ACCEPTABLE** = static, fine to leave; **HARDCODED SHOULD FIX** = owner-relevant, should be editable; **MIXED/CONFUSING** = works but split sources; **BROKEN** = not editable / wrong.

| Visible section | Source NOW | Intended source | Status | Fix file(s) |
|---|---|---|---|---|
| Homepage hero text/CTA label | static `c.home`/`c.meta` | home Page doc | HARDCODED SHOULD FIX | `page.ts`, `app/page.tsx`, `content.ts` |
| Homepage info bar (date/venue) | static `c.meta` | siteSettings/home doc | HARDCODED SHOULD FIX (minor) | `app/page.tsx`, `content.ts` |
| Homepage video | global `video` doc + `displayOnPages` + static fallback | **page-local `videoUrl`** on home doc | MIXED/CONFUSING | `page.ts`, `app/page.tsx`, `content.ts`, `queries.ts` |
| Homepage ticket boxes | tickets `showOnHome` + static fallback | tickets `showOnHome` | SANITY OK | — |
| Homepage stats (4/10+/…) | static `c.home.highlights` | home Page doc (optional) | HARDCODED SHOULD FIX | `page.ts`, `app/page.tsx` |
| Homepage lineup teaser title | static `c.home.lineupTeaserTitle` | optional | HARDCODED ACCEPTABLE | — |
| Homepage lineup teaser cards | Sanity performers + fallback | performers | SANITY OK | — |
| Homepage CTA banner | static `c.home.ctaBanner*` | home Page doc | HARDCODED SHOULD FIX | `page.ts`, `app/page.tsx` |
| Navigation (header/footer) | Sanity `navigationItem` + static `c.nav` fallback | navigationItem | SANITY OK | — |
| Footer copyright / legal links | static `c.footer` | optional | HARDCODED ACCEPTABLE | — |
| Footer sponsors | Sanity `sponsorCategory`/`sponsor` + fallback | sponsors | SANITY OK | — |
| Performers (lineup page) | Sanity performers + static fallback | performers | SANITY OK | — |
| Performer links / ticket URL | Sanity performer fields + global fallback | performer | SANITY OK | — |
| Program table (structured) | Sanity `programItem` + static fallback | programItem | SANITY OK | — |
| Program free text | Sanity program Page `programBodyRich*` | page | SANITY OK | — |
| Program display controls | Sanity program Page (6 fields) | page | SANITY OK | — |
| Accommodations | Sanity `accommodation` + static fallback; no "ártól" | accommodation | SANITY OK | — |
| Ticket / Info page rows | Sanity `ticket` + static fallback | ticket | SANITY OK | — |
| Info FAQ | Sanity page `infoFaqItems` + static fallback | page | SANITY OK | — |
| Contact page (email/phone/social/volunteer) | Sanity `siteSettings` + static fallback | siteSettings | SANITY OK | — |
| Contact address / press title / press text | **static `c.contact`** (`base.ts`) | siteSettings | HARDCODED SHOULD FIX | `siteSettings.ts`, `content.ts`, `contact/page.tsx` |
| Contact hero/body | Sanity contact Page | page | SANITY OK | — |
| Legal (ÁSZF / Adatvédelem) | Sanity page body + flexible sections | page | SANITY OK | — |
| Jazztábor hero/body2/schedule/supporters | Sanity camp Page (`campCms`) + static fallback | page | MIXED (works) | — |
| Jazztábor main description | static `camp.description` when no body2 | page body | HARDCODED SHOULD FIX | `jazztabor/page.tsx` (already supports body2) |
| **Jazztábor video** | **static `camp.videoUrl`** | **page-local `videoUrl`** | **BROKEN** | `page.ts`, `jazztabor/page.tsx`, `content.ts`, `queries.ts` |
| Venue / map | Sanity `venue` + static fallback | venue | SANITY OK | — |
| Transport | Sanity `transportItem` + fallback | transportItem | SANITY OK | — |
| Generic pages / flexible sections | Sanity page `sections` | page | SANITY OK | — |

---

## 8. Duplicate editor audit

| Content | Duplicate/confusing paths (verified `deskStructure.ts`) | Recommendation |
|---|---|---|
| **Videos** | Global `video` doc appears at **line 41** (Főoldal group) **and line 111** (standalone "🎬 Videók"); plus `sectionVideo`; plus hardcoded | Move to **page-local `videoUrl`**; remove global `video` from menu (keep schema deprecated) |
| **Homepage** | "🏠 Főoldal szerkesztés → Főoldal Page (SEO)" (line 32) **and** the same doc inside "📄 Oldalak (Pages)" (line 73) | One path; the Főoldal group becomes the real editor once home fields are added |
| **Jazztábor** | "⚡ Jazztábor — Page" shortcut (line 76) **and** in "Oldalak (Pages)" list; video hardcoded elsewhere | Keep one shortcut; add page-local video field |
| **Tickets** | "🎟️ Jegyek" standalone (line 112) **and** Főoldal group "Jegyek" (line 43) | Acceptable (same docs, convenience); document it |
| **Contact** | Sanity contact Page (hero/body) + `siteSettings` (email/phone/social/volunteer) + static `c.contact` (address/press) | Move address/press into `siteSettings`; one editor for contact data |

**Target model (owner's intent):**
- **Page-specific content edited on that page's own editor** (home video, jazztábor video, hero text → page doc fields).
- **Global collections only for genuinely repeated objects:** performers, tickets, accommodations, programItems, sponsors, stages, transport.
- **Videos should NOT be a global collection** when each page needs only one YouTube URL.

---

## 9. Recommended implementation plan

> Phases are ordered to fix the most blocking admin/routing issues first, lowest-risk-first within reason. Each phase is independently shippable.

### Phase R1 — Hidden active pages + locale/render clarity
- **Files:** new `src/app/[slug]/page.tsx` (root catch-all, FIX_SLUGS-guarded, mirrors `/oldal/[slug]`); optionally `middleware.ts` (301 `/oldal/<slug>`→`/<slug>`); `JAZZ_SITE_CONTENT_ADMIN_CHECKLIST.md`.
- **Decision needed from owner:** enforce locale at render (404 / empty-state for missing-locale pages) **or** keep render fallback and only filter nav/sitemap (current behavior). Document whichever is chosen.
- **Risk:** medium (root catch-all collision; must verify fixed routes still win and build passes).
- **Expected result:** a created, active, published page renders by **direct link at `/<slug>`** even if hidden from nav and `noIndex`; inactive/unpublished → 404.
- **QA:** `npm run lint`; `build`/`build:hu`/`build:en`; manually hit a non-nav active slug at `/<slug>` and `/oldal/<slug>`; confirm `/program` etc. still resolve to their fixed routes.

### Phase R2 — Simplify video model to page-local YouTube fields
- **Files:** `schemaTypes/documents/page.ts` (add `videoUrl` shown for home/jazztabor/all), `sanity/types.ts`, `sanity/lib/queries.ts` (add `videoUrl` to page query), `sanity/lib/content.ts` (expose page `videoUrl`), `app/page.tsx` (read home doc `videoUrl`), `app/jazztabor/page.tsx` (read camp doc `videoUrl`), `deskStructure.ts` (remove global `video` from menu / mark deprecated), delete `home/VideoEmbed.tsx` + `home/VideoSection.tsx`.
- **Risk:** low–medium (additive field; keep static fallback; keep `video` schema for back-compat).
- **Expected result:** owner pastes a YouTube link on the home and jazztábor page editors; `VideoLiteEmbed` renders click-to-load; no global video hunting.
- **QA:** lint + 3 builds; verify home + jazztábor videos render from page fields, fallback to static when empty.

### Phase R3 — Real homepage editor (connect homepage to Sanity)
- **Files:** `page.ts` (home-only fields: hero CTA label, CTA-banner title/subtitle/button, optional editable stats array; plus the `videoUrl` from R2), `queries.ts`, `sanity/types.ts`, `content.ts` (new `getHomePageContent` with static fallback), `app/page.tsx`, `deskStructure.ts` (Főoldal group now meaningfully edits home).
- **Risk:** medium (more home fields; must keep static fallback so nothing blanks).
- **Expected result:** the "Főoldal szerkesztés" group actually edits visible homepage text + video + tickets.
- **QA:** lint + 3 builds; empty fields fall back to current static text (no blank homepage).

### Phase R4 — Program desktop layout fix
- **Files:** `app/program/page.tsx`.
- **Change:** `md:grid-cols-2` (drop `lg:grid-cols-4`); optional `max-w-[1400px]`; tighten row (title `min-w-0` + `line-clamp-2`, badge/chevron `shrink-0`).
- **Risk:** low (CSS only).
- **Expected result:** clean wide desktop rows (time · title · stage · chevron on one line); mobile unchanged.
- **QA:** lint + 3 builds; visual check desktop + mobile.

### Phase R5 — Remaining hardcoded → Sanity (owner-relevant)
- **Files:** `siteSettings.ts` (add address, press title/text), `content.ts` `getContactContent`, `contact/page.tsx`; optionally jazztábor main description already supported via `body2` — document it.
- **Risk:** low (additive + fallback).
- **Expected result:** contact address/press editable; fewer "why can't I change this" gaps.
- **QA:** lint + 3 builds.

### Phase R6 — QA + admin checklist + launch docs
- **Files:** `JAZZ_SITE_CONTENT_ADMIN_CHECKLIST.md`, `JAZZ_SITE_LAUNCH_READINESS_CHECKLIST.md`, `JAZZ_SITE_DEVELOPMENT_PLAN.md`.
- Update: where to edit each video (page-local), homepage editor reality, `/slug` vs `/oldal/slug`, locale rule decision, program layout note.
- **QA commands (every phase):**
  - `npm run lint`
  - `npx cross-env NODE_OPTIONS="--max-old-space-size=8192" npm run build`
  - `npx cross-env NODE_OPTIONS="--max-old-space-size=8192" npm run build:hu`
  - `npx cross-env NODE_OPTIONS="--max-old-space-size=8192" npm run build:en`
  - (Windows: clear `.next` between locale builds; 8 GB heap required; Netlify Linux unaffected.)

---

## 10. Do not implement yet

**No code changes should be made until the owner approves this plan.**

Two decisions require explicit owner input before coding:
1. **Hidden pages URL (R1):** add a root-level `/<slug>` route (so direct links work at the bare slug), or keep `/oldal/<slug>` and only fix documentation/links? And: should a page with **no current-locale content** 404 in that locale, or render with the other language's content as fallback?
2. **Homepage editability scope (R3):** which homepage texts should become Sanity-editable (video only? + CTA banner? + hero + stats?), versus left as static.

Everything in §9 is additive and fallback-protected, but R1 (root catch-all) and R3 (home fields) change editor/URL behavior, so they must be confirmed first.

> **Honesty note:** This re-audit corrects two earlier overstatements — (a) "homepage is Sanity-driven" (its visible text is hardcoded), and (b) "HU-only pages don't render in EN" (true for nav/sitemap, **false** for the dynamic page render, which has no locale filter). Treat prior PASS/READY conclusions as historical.
