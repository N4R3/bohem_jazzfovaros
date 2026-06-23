# Jazz / Jazzfőváros Festival Website — Development & Workflow Plan

> **⚠️ PLANNING / HISTORICAL DOC.** Much of the body and Status Log describe earlier two-site / two-domain experiments.  
> **For production launch and DNS, use only:** [`PRODUCTION_LAUNCH_CHECKLIST.md`](PRODUCTION_LAUNCH_CHECKLIST.md) · [`FINAL_LAUNCH_REVIEW.md`](FINAL_LAUNCH_REVIEW.md).  
> **Current model:** Netlify + GitHub + Sanity · `jazzfovaros.hu/` = HU · `jazzfovaros.hu/en/` = EN · `jazzcapital.hu` = external 301 → `jazzfovaros.hu/en/` (not Netlify custom domain) · staging `bohemjazz.netlify.app`.

> **Status:** Planning (no code written yet)
> **Date:** 2026-06-02 _(update on each revision)_
> **Owner:** besenyeizalan@gmail.com
> **Repo:** `client-projects/jazz` (branch `main`)
> **Document purpose:** This is the shared context file for all future AI tools (Claude, Cursor, Antigravity, SWE/SVA, ChatGPT/GPT-5.5) and human developers. Read this **first**, before touching the code. Keep it updated (see §11 and the Status Log at the bottom).

---

## AI Context Summary (read this first — 60-second brief)

- **Stack (verified from repo):** Next.js `15.3` App Router, React `19`, TypeScript `5`, Tailwind CSS `v4`, Framer Motion `12`, Sanity `v4` (`next-sanity` 11), `@portabletext/react`, `@sanity/image-url`.
- **Deployment (verified):** Netlify using `@netlify/plugin-nextjs`. **Two separate Netlify sites built from the same repo**; the locale is decided **at build time** by `src/lib/buildLocale.ts` based on the Netlify-injected deploy URL (`URL`/`DEPLOY_PRIME_URL`) matched against `NEXT_PUBLIC_SITE_URL_HU` / `NEXT_PUBLIC_SITE_URL_EN`, or an explicit `NEXT_PUBLIC_LOCALE`.
- **⚠️ Architectural tension (must resolve in Phase 0):** There are currently **two parallel locale models**:
  1. **Two-site / two-domain, build-time locale** (`buildLocale.ts`, `netlify.toml`, separate sites).
  2. **Single-domain runtime locale** with host detection + `NEXT_LOCALE` cookie + `/en/` path prefix (`src/lib/locale.ts`, `src/lib/seo.ts` comments). 
  These overlap and partially contradict. The strategic decision (§2) is **two domains, one frontend, one CMS, domain only sets default locale** — so the build-time/two-site model is the target; the `/en/` prefix logic must be reconciled (kept as in-domain switch, or removed) during the audit. **Do not "fix" one without understanding the other.**
- **Content model (verified):** Hybrid. Static fallback content lives in `src/content/hu.ts` and `src/content/en.ts`; Sanity documents override/extend it. Many pages **fall back to hardcoded text when Sanity fields are empty** — this is intentional today but causes "Studio looks empty but site shows text" confusion.
- **Sanity schemas present (verified):** `page`, `performer`, `programItem` (= events), `accommodation`, `ticket`, `navigationItem`, `stage`, `sponsor`, `sponsorCategory`, `performerTag`, `transportItem`, `siteSettings`, `popupSettings`, `venue`; objects `seo`, `richText`. **No `video` schema** and **no flexible/section block system** exist yet.
- **Localization in schemas (verified):** Field-pair pattern (`titleHu`/`titleEn`, `*RichHu`/`*RichEn`). No `@sanity/document-internationalization` plugin — HU/EN coexist in one document. **Keep this pattern.**
- **Routing (verified):** Fixed slugs have dedicated App Router folders (`/program`, `/lineup`, `/szallas`, `/terkep`, `/futas`, `/tabor`, `/info`, `/contact`, `/aszf`, `/adatvedelem`). New pages are served by `src/app/oldal/[slug]/page.tsx` with `generateStaticParams` + `revalidate = 30`. A hardcoded `FIX_SLUGS` set excludes fixed pages from the dynamic route.
- **SEO (verified):** `seo` object already has `noIndex`, `canonicalOverrideHu/En`, `ogImage`, HU/EN title+description. `sitemap.ts` is a **hardcoded page list** that does **not** include dynamic `/oldal/[slug]` pages or all legal pages and does **not** respect `noIndex`. `robots.ts` currently allows everything. **Verify** that `seo.noIndex` actually emits `<meta name="robots" content="noindex,nofollow">` via `buildPageMetadataWithSanity`.
- **Images (verified):** `next.config.ts` sets `images: { unoptimized: true }` → **Next.js image optimization is OFF**; responsive sizing must come from Sanity image transforms (`@sanity/image-url`). `trailingSlash: true`.
- **Biggest opportunities:** (1) introduce a `video` schema + click-to-load embeds; (2) add a flexible section/block system so editors stop depending on hardcoded per-slug fields; (3) make accommodation/contact/ticket fully CMS-driven with rich text; (4) sitemap + noindex correctness; (5) performance (images, video embeds, GROQ projections, bundle).
- **Golden rules:** Never delete existing fields/content until migration is proven safe. Add fields backward-compatibly. Every empty field must degrade gracefully (no broken layout). Test HU and EN separately. Branch before major changes.

---

## 1. Project Goal and Current Assumptions

### 1.1 Goal of this development phase
Make the existing festival site significantly **more CMS-driven, faster, and more maintainable**, without breaking existing content or URLs. Concretely:

- Make far more content editable from **Sanity** (videos, contact, accommodations, ticket info, legal/FAQ, flexible sections).
- Improve **multilingual (HU/EN)** behavior so navigation and content follow explicit, predictable fallback rules.
- Improve **ticket / event / performer logic** (event title priority, per-performer ticket URLs with global fallback, card visual robustness).
- **Redesign the ticket info page** to be more premium, useful, and mobile-friendly.
- **Improve performance substantially** (images, video embeds, query shapes, bundle, fonts, animations).
- **Prepare clean two-domain behavior** (Hungarian default domain + English default domain, one frontend, one CMS).
- **Keep 2016–2025 archive pages accessible** without integrating them into the new CMS.
- **Avoid breaking existing content and URLs.**

### 1.2 Assumptions confirmed from the repo
The following are **verified** (see AI Context Summary): Next.js 15 App Router; Netlify + `@netlify/plugin-nextjs`; two-site build-time locale via `buildLocale.ts`; Sanity v4 with the listed schemas; field-pair HU/EN localization; hybrid static-fallback + Sanity content; `images.unoptimized: true`; existing `seo` object with `noIndex`.

### 1.3 Assumptions that MUST be verified during the Phase 0 audit
Mark each as **to verify during audit**:

1. **Locale model reconciliation** — is the live site actually two domains (two Netlify sites), or one domain with `/en/` prefix, or both? Which is canonical going forward? (See architectural tension above.)
2. **noindex emission** — confirm `buildPageMetadataWithSanity` reads `seo.noIndex` and outputs `robots: { index:false, follow:false }` in Next metadata. _(to verify)_
3. **Existing GROQ queries** in `src/sanity/lib/queries.ts` + `content.ts` — what do list vs detail pages fetch? Over-fetching? _(to verify)_
4. **Image rendering path** — how `@sanity/image-url` is used; whether `width`/`height`/`sizes` are set; whether `loading="lazy"` is applied. _(to verify)_
5. **Video usage today** — are there any hardcoded YouTube/Vimeo iframes anywhere? Where? _(to verify)_
6. **Page generation** — which pages are static (`generateStaticParams`), which use ISR (`revalidate`), which are dynamic. _(to verify)_
7. **Netlify config completeness** — redirects, headers, env vars across both sites; whether `_redirects`/`_headers` or `netlify.toml` `[[redirects]]` exist. _(to verify)_
8. **Current font loading** (next/font? self-hosted? Google Fonts link?). _(to verify)_
9. **Framer Motion footprint** — how much animation runs on initial load / above the fold. _(to verify)_
10. **Existing fallback behavior** — exact rules for "Sanity empty → show code fallback" per page, so we do not silently remove a fallback the client relies on. _(to verify)_

---

## 2. Deployment, Domain and Hosting Strategy

### 2.1 Strategic decision (locked)
- **Keep Netlify** as the deployment platform, **connected to GitHub** (Git-based continuous deploy). This is the preferred, lowest-risk workflow for this Next.js + Sanity project.
- The **domain may be purchased/managed elsewhere**; that is fine — Netlify supports **external DNS / custom domains**. Point the registrar's DNS (or delegate the zone) to Netlify per Netlify's custom-domain instructions.
- **Non-Git Netlify deploys** (CLI drag-and-drop / `netlify deploy`) are technically possible but **discouraged** for this project: they lose PR previews, history, and reproducibility.
- **Traditional shared/cPanel hosting is NOT recommended** as the main deployment target for a Next.js SSR/ISR + Sanity frontend. It is fine only for the static **archive** (§9).

### 2.2 Recommended architecture (target)
**One repo → one frontend → one Sanity dataset → two Netlify sites (or one site with two domains).** Domain only chooses the **default locale**. No duplicated websites, no duplicated CMS content.

```
                ┌─────────────────────────┐
   GitHub repo  │  Next.js + Sanity Studio │
   (main)  ───► │  src/app, src/sanity     │
                └───────────┬──────────────┘
                            │ Git deploy (Netlify build)
              ┌─────────────┴─────────────┐
              ▼                           ▼
   Netlify Site HU                Netlify Site EN
   default locale = hu            default locale = en
   domain: jazzfovaros.hu (TBD)   domain: jazzcapital.hu (TBD)
              \                          /
               \                        /
                ▼                      ▼
            ┌───────────────────────────────┐
            │  Same Sanity dataset (one CMS) │
            └───────────────────────────────┘
```

> **Note (verified):** `netlify.toml` currently uses placeholder hosts `bohemjazz.netlify.app` / `buhemjazzen.netlify.app`, while `src/lib/seo.ts` defaults to `jazzfovaros.hu` / `jazzcapital.hu`. The real production domains must be confirmed and set consistently in env vars on **both** sites. _(to verify / decide)_

### 2.3 Primary Hungarian domain
- Opens the **Hungarian** version by default.
- `NEXT_PUBLIC_SITE_URL_HU` = the HU domain; that site builds with `getBuildLocale() → "hu"`.

### 2.4 Secondary English domain
- Opens the **English** version by default.
- `NEXT_PUBLIC_SITE_URL_EN` = the EN domain; that site builds with `getBuildLocale() → "en"`.

### 2.5 Implementation approaches (choose during audit)
The repo currently mixes two of these. Decide one canonical model:

- **Option A — Two Netlify sites, build-time locale (current direction, recommended).** Each domain is its own site/build; `buildLocale.ts` already supports this. Simplest mental model; matches "domain only sets default locale." Language switch links cross-domain (or stay in-domain if `/en/` kept).
- **Option B — One Netlify site, host-based runtime locale.** Both domains point to one site; `src/lib/locale.ts`'s `getLocaleFromHost` chooses locale at request time; `NEXT_LOCALE` cookie overrides. Requires both domains attached to one Netlify site and SSR/edge logic. More moving parts.
- **`/hu` and `/en` paths** — currently HU is root and EN is `/en/` (`localizePath` in `locale.ts`). If we keep two domains, the `/en/` prefix is redundant for default locale but useful as the in-domain "switch to other language" target. **Decide whether to keep `/en/` at all** to avoid duplicate-content/canonical confusion.
- **Netlify redirects/rewrites** — use `netlify.toml [[redirects]]` or `_redirects` for: forcing HTTPS + apex/www canonicalization; archive year redirects (§9); any legacy path moves. Avoid path-based proxying between hosts unless strictly necessary.

### 2.6 Archive hosting (summary; full detail in §9)
Old 2016–2025 pages should stay on **separate hosting under an `archive.` subdomain** (e.g. `archive.jazzfovaros.hu`). They are **not** imported into Sanity. The new site may link to them.

---

## 3. Sanity CMS Development Requirements

General rules for all schema work:
- **Additive & backward-compatible.** New fields default to safe values (`isActive: true`, toggles default to the current behavior). Never remove a field in the same change that adds its replacement.
- Keep the **HU/EN field-pair pattern** (`*Hu` / `*En`) already used across the repo.
- Use **rich text** via the existing `objects/richText.ts` object (`...richText` spread) wherever formatted text is needed.
- Every schema gets sensible **`preview`** labels and (where relevant) `orderings`.
- Frontend rule: **empty field → render nothing** (no empty wrappers, no broken layout).

### 3.1 Videos — **new schema** `video`
There is no video schema today; create one.

| Field | Type | Notes |
|---|---|---|
| `titleHu` / `titleEn` | string | EN optional → falls back per §4 rules |
| `descriptionHu` / `descriptionEn` | richText (or text) | optional |
| `url` | url | YouTube/Vimeo/MP4; required |
| `provider` | string (list: youtube/vimeo/file) | optional; can be derived from URL |
| `thumbnail` | image | optional; if empty, derive provider thumbnail or use fallback bg |
| `size` | string (list: small/medium/large/full) | layout width |
| `isActive` | boolean (default true) | disabled → not rendered |
| `order` | number | sort |
| `ctaLabelHu` / `ctaLabelEn` | string | optional CTA button text |
| `ctaUrl` | url | optional CTA link |
| `placement` | string or reference | optional: which page/section it belongs to |

**Frontend behavior (critical for performance):**
- Disabled (`isActive:false`) videos do **not** render.
- **Do not load the iframe/embed on page load.** Render a **thumbnail (poster) with a play button first**; load the real iframe/`<iframe>`/player **only on click** (lite-embed pattern). This is a hard requirement (§8).
- Thumbnail uses Sanity transform / provider poster; fall back to brand background if missing.

### 3.2 Performers / Artists — extend `performer`
Existing fields (verified): `name`, `slug`, `image`, `imageDisplayMode`, `imagePath` (legacy), `shortDescriptionRichHu/En`, `tags`, `members`, `bioRichHu/En`, social URLs, `order`, `isFeatured`, `isActive`, `seo`.

**Add:**
- `ticketUrlHu` / `ticketUrlEn` (url, optional) — **individual ticket URL**; if empty, fall back to the **global ticket URL** (from `siteSettings` or a designated `ticket` doc). _(verify where the global ticket URL should live)_
- (Optional) `eventRefs` / day / category — only if not already represented via `programItem.performers` (it is; performers are linked from events). Prefer **not** to duplicate the relation.

**Card behavior (frontend):**
- If **no image**, use the **navbar/brand background color** as the card background (CSS var, e.g. `var(--color-...)`).
- If the image fails to load or does not fill the card, **fall back to brand background**.
- Image uses `object-fit: cover` (respect existing `imageDisplayMode` cover/contain/landscape/portrait).
- Card stays **visually consistent** regardless of content presence (fixed aspect ratio, no layout jump).

### 3.3 Events — extend `programItem`
Existing (verified): `titleHu/En`, `descriptionHu/En` (plain text), `date`, `startTime`, `endTime`, `stageRef` + legacy `stage`, `category`, `performers[]`, `order`, `isActive`, `seo`.

**Add / change:**
- `eventTitleHu` / `eventTitleEn` — **explicit event title** (or reuse existing `titleHu/En` as the event title; decide during audit to avoid churn).
- `detailsRichHu` / `detailsRichEn` — **rich text** event details (current `descriptionHu/En` is plain `text`; keep them, add rich text alongside, migrate later).
- `ticketUrlHu` / `ticketUrlEn` (optional) — event-level ticket link, fallback to global.
- (Optional) `tags` / categories reference if filtering is wanted.

**Display logic (frontend):**
- **Show event title first.** If no event title, **show performer name(s)**.
- Performers appear as **secondary** info.
- Details (performers, time, location/stage, rich text) shown on **hover/click (desktop)** and **tap → accordion/modal (mobile)**. No hover-only on touch.
- Empty fields never produce broken layout.

### 3.4 Accommodations — change `accommodation`
Existing (verified): `name`, `descriptionHu/En` (plain text), `priceHu`/`priceEn` (string, currently includes "…tól" wording per example), `stars`, `image`, `imagePath` (legacy), `websiteUrl`, `bookingUrl`, `bookingLabelHu/En`, `distanceHu/En`, `order`, `isActive`.

**Changes:**
- **Remove "from price" / "ártól" wording.** Price becomes a plain **optional** string with **no implied "from"** prefix/suffix added by the frontend. Editors type exactly what shows. (Keep the field; just stop the frontend from prepending/appending "-tól/from".)
- Add `bodyRichHu` / `bodyRichEn` (rich text) — replaces/augments plain `descriptionHu/En`; keep old fields for backward compat, migrate later.
- `bookingUrl` / `websiteUrl` already provide the optional button/link — keep.
- (Optional) `gallery` (array of images) in addition to single `image`.
- `isActive`, `order` already present — keep.

**Rich text:** must support normal formatting (already supported by `richText` object: bold, italic, link, h2/h3, list, blockquote). If technically simple, optionally add a small set of **predefined text styles/classes** (e.g. "muted", "highlight") as Portable Text marks — only if low-risk.

### 3.5 Contact Page — make fully CMS-editable
Today contact content is partly static/code. Make **every visible element editable** — either via a dedicated `contactPage` singleton or by extending the `page` doc for slug `contact`.

**Fields:**
- `titleHu` / `titleEn`
- `introRichHu` / `introRichEn` (body rich text)
- `email`, `phone`, `address`
- `mapLink` (url)
- `socialLinks` (array: platform + url) — or reuse `siteSettings` social links
- `availabilityTextHu` / `availabilityTextEn` (opening/availability) — optional
- `extraBlocks` (optional flexible sections, see §3.7)

**Important:** **Remove the extra sponsors/supporters section from the contact page** — sponsors/supporters already live in the footer (`sponsor` / `sponsorCategory`). Do not render them twice.

### 3.6 FAQ, Terms, Privacy / Legal — `page`-based simple rich pages
A simple editable rich-text page is enough. Use the existing `page` doc (already powers `/aszf`, `/adatvedelem`, and `/oldal/[slug]`). Ensure these fields exist/are used:

- `titleHu` / `titleEn`
- `slug`
- `pageBodyRichHu` / `pageBodyRichEn` (already exists)
- `seo.seoTitleHu/En`, `seo.seoDescriptionHu/En` (already exists)
- `seo.noIndex` (already exists)
- **`showInNavHu` / `showInNavEn`** toggles — _navigation visibility is currently driven by `navigationItem` docs, not by the page._ Decide: keep nav driven by `navigationItem` (recommended, already built) **or** add per-page nav toggles. If kept on `navigationItem`, "show in nav HU/EN" is expressed by creating/omitting a nav item with a label in that locale (§4).
- `isActive` (already exists)

**Rule:** These pages must be **accessible by URL even if not in navigation** (see §5). Hidden-from-nav ≠ unpublished.

### 3.7 Generic Pages / Flexible Sections — **new system**
This is the most important structural improvement. Today, `page.ts` has **dozens of slug-specific conditional fields** (`camp*`, `running*`, `programBody*`, etc.) hidden/shown by slug — fragile and hard to extend. Introduce a **flexible section/block array** so editors can add/remove/reorder sections without code changes.

**Approach:**
- Add a `sections` array (Portable-Text-style block array) to `page` (additive; existing slug-specific fields remain until migrated).
- Each section has its own `isActive` toggle; **empty/disabled sections render nothing**.
- Frontend renders sections via a single `<SectionRenderer>` switch.

**Minimum section types (object schemas):**
1. `videoSection` — references/embeds a `video` (click-to-load).
2. `richTextSection` — plain rich text, no background.
3. `richTextBoxSection` — rich text **with background** (boxed/card).
4. `ctaSection` — button(s): labelHu/En, url, style.
5. `imageSection` — single image + optional caption.
6. `gallerySection` — array of images.
7. `spacerSection` — spacer/divider (height/variant).
8. (Optional) `cardGridSection` — grid of cards (title, text, image, link).

**Rules:**
- Existing/core sections must **not break if empty** (guard every render).
- Editors can add new sections freely.
- Avoid fragile hardcoded layouts; prefer data-driven rendering.
- **Migration path:** new pages use `sections`; existing fixed pages keep working on current fields. Migrate fixed pages to `sections` only when each is proven safe (later phase, optional).

---

## 4. Multilingual Logic

Keep the **single-document, field-pair** model (`*Hu`/`*En`). No duplicate EN/HU documents.

### 4.1 Navigation rules
- Show only **enabled** nav items (`isActive`, and `showInHeader`/`showInFooter` as relevant).
- Show an item **only if it has a valid label in the current locale.** For `navigationItem`: HU uses `labelHu`; EN uses `labelEn`. **If `labelEn` is missing, the item does NOT appear in EN nav** (do not silently fall back to HU for nav). _(Note: current `navigationItem.ts` says "if EN empty, use HU." This conflicts with the new requirement — change the EN nav rule to hide instead of fall back. **Decision needed**; recommended: hide.)_
- **Never render empty labels.**
- Fallback logic must be **explicit**, never accidental.

### 4.2 Content fallback rules (explicit)
- **Page body:** if EN body missing → **policy choice**: either hide the EN version of that block, or show a controlled fallback. **Recommended:** for full pages, if EN body is entirely missing but the page exists, render the HU body with a small "available in Hungarian" note **only if** the client wants content visible; otherwise show an empty-state message (as `/oldal/[slug]` already does). Decide per-client and document here.
- **Nav:** hide item if current-locale label missing (see 4.1).
- **Event title:** event title first → else performer name(s) (§3.3).
- **Performer card:** name is shared; descriptions fall back EN→(hide or HU) per policy.

### 4.3 URL accessibility vs navigation
- A page that exists and is **active** in Sanity is **accessible by URL** even if hidden from navigation. Hidden-from-nav ≠ 404 (§5).

---

## 5. Routing and Dynamic Pages

### 5.1 Requirements
- A page that exists in Sanity (active) is **accessible even if not in the navbar**.
- **Hidden-from-nav ≠ unpublished.** Active-but-hidden pages render.
- **Unpublished / `isActive:false`** pages may return **404**.
- Legal pages render as normal pages.
- Dynamic slugs handled consistently via `src/app/oldal/[slug]/page.tsx` (verified pattern: `generateStaticParams` excludes `FIX_SLUGS`, `revalidate = 30`, `notFound()` when `!page.found` or slug is fixed).
- **404 behavior intentional** (active+found → render; missing/inactive → 404).

### 5.2 Audit checklist (Phase 0)
- [ ] Inspect route generation — all fixed-slug folders + `oldal/[slug]`.
- [ ] Inspect static generation / build behavior — which routes are SSG vs ISR (`revalidate`) vs dynamic.
- [ ] Inspect dynamic fallback — does a new active page appear without redeploy (ISR `revalidate=30` suggests yes after 30s)?
- [ ] Inspect slug model — slug uniqueness, fixed-slug collisions, `FIX_SLUGS` correctness.
- [ ] Inspect locale routing — `/en/` prefix logic in `localizePath`; reconcile with two-domain model (§2.5).
- [ ] Inspect Netlify redirects — any existing `[[redirects]]` / `_redirects` / `_headers`.

---

## 6. SEO and Noindex

### 6.1 Requirements
- **Per-page `noIndex`** field exists in Sanity (`seo.noIndex`, verified). When true, page must render `<meta name="robots" content="noindex,nofollow">` (Next: `robots: { index:false, follow:false }`). **Verify this is actually emitted** by `buildPageMetadataWithSanity` _(to verify)_; if not, implement it.
- Where feasible, also support **`X-Robots-Tag` header** for selected routes or an entire staging environment (via `netlify.toml [[headers]]` or Next `headers()`).
- **Staging / deploy-preview builds should be globally noindex.** Detect Netlify `CONTEXT !== "production"` (or `DEPLOY_PRIME_URL`/branch) and emit global noindex (robots.txt `disallow: /` + meta + `X-Robots-Tag`). **Currently `robots.ts` allows all unconditionally** — fix to be context-aware.
- **Production** noindexes only pages where `seo.noIndex` is set.
- **Navigation visibility must NOT control indexing.** Hidden-from-nav pages remain indexable unless `noIndex` is set.

### 6.2 Canonical / hreflang / duplicate content
- Canonical strategy exists (`metadataAlternates` in `seo.ts` emits `canonical` + `hu`/`en`/`x-default` alternates). **Verify** it's applied on all pages.
- **hreflang:** keep `hu` / `en` / `x-default` alternates pointing to the correct per-domain URLs (§2). With two domains, hreflang across domains is the correct way to avoid duplicate-content penalties.
- **Two-domain duplicate-content risk:** mitigate with correct canonicals (each locale's canonical points to its own domain) + hreflang. Do **not** let HU and EN canonicalize to the same URL.
- **Sitemap:** `sitemap.ts` is currently a **hardcoded list** and **ignores `noIndex` and dynamic/legal pages**. Rework to: (a) include dynamic `/oldal/[slug]` + legal pages, (b) **exclude `isActive:false` and `noIndex:true` pages**, (c) keep per-locale alternates.
- **robots.txt:** review but it must **not** be the only noindex mechanism — rely on per-page meta + staging `X-Robots-Tag`.

---

## 7. Ticket Info Page Redesign

> **Best handled by Antigravity** (visual design implementation). Claude designs the content model + structure; Antigravity implements the premium visual layout; Cursor wires CMS data.

### 7.1 Requirements
- Visually better, more **premium**, more useful; **mobile-first**; clear ticket cards; CTA buttons; important-info blocks; optional FAQ; optional rich-text intro; optional warnings/notices. **No broken layout when fields are empty.**

### 7.2 CMS backing
- Reuse/extend `ticket` (verified: `nameHu/En`, `price`, `currency`, `ticketUrlHu/En`, `badgeHu/En`, `isAvailable`, `isHidden`, `order`). **Add** `descriptionHu/En` rendering (currently stored but **not rendered** per schema note) and optional `featuresHu/En` (array of bullet strings).
- Add a `ticketInfoPage` singleton **or** use `page` (slug `info`) for: hero intro (rich text), practical-info blocks, discount/eligibility, FAQ items (reuse FAQ pattern), warnings/notices, final CTA. All fields optional + locale-paired.

### 7.3 Suggested structure (top → bottom)
1. Hero / intro (optional rich text).
2. Ticket category cards (from `ticket` docs; price, badge, features, CTA).
3. Primary purchase CTA.
4. Practical info blocks.
5. Discount / eligibility info (optional).
6. FAQ / extra notes (optional).
7. Final CTA.

Each section guards against empty data.

---

## 8. Performance Optimization Plan (major priority)

### 8.1 Method
1. **Audit before changing.** Run a production build (`npm run build`), inspect bundle, run Lighthouse on key pages (home, lineup, program, info, a `/oldal/[slug]`), record baseline (LCP, CLS, TBT, total JS, image weight).
2. Identify the **biggest bottlenecks** first (likely: unoptimized images, eager video iframes, Framer Motion JS, over-fetched GROQ).
3. Optimize in priority order; re-measure after each change.

### 8.2 Images (note: `images.unoptimized: true`)
- Because Next image optimization is **off**, rely on **Sanity image transforms** (`@sanity/image-url`): request width-appropriate images, use `auto=format` for **modern formats** (WebP/AVIF), `q` tuning.
- Provide responsive `srcset`/`sizes`; set explicit `width`/`height` (or aspect-ratio box) to **prevent CLS**.
- **Lazy-load** offscreen images (`loading="lazy"`, `decoding="async"`).
- **Preload only the true hero** (LCP) image; everything else lazy.
- _(Consider, with care: re-enabling Next image optimization via a Sanity loader — but verify Netlify plugin support and cost before changing the current `unoptimized` setting.)_

### 8.3 Video embeds (hard requirement)
- **Do not load YouTube/Vimeo/iframe embeds on page load.** Render thumbnail/poster + play button; mount the iframe/player **only on click** (lite-embed). Applies to the new `video` schema (§3.1) and any existing hardcoded embeds found in audit.

### 8.4 Sanity / GROQ
- **List pages request only list data** (id, slug, title, thumbnail, order, isActive) — never full rich text.
- **Detail pages** request full rich text + nested data.
- Avoid fetching huge nested objects everywhere; use **tight GROQ projections**.
- Audit `src/sanity/lib/queries.ts` for `*`-style over-fetching and split into list vs detail queries.

### 8.5 JS / bundle / fonts / animations
- Review **bundle size**; identify large deps. **Framer Motion** is heavy — limit to where needed, lazy-load/`dynamic()` non-critical animated components, prefer CSS transitions for simple effects.
- **Lazy-load non-critical components** (`next/dynamic`, `ssr:false` where safe).
- Review **hydration / client JS** — keep server components server-side; only make interactive leaves client components.
- **Fonts:** use `next/font` (self-host, `display: swap`, subset to needed glyphs incl. Hungarian accents). _(verify current font loading)_
- Review **unused dependencies** and remove.
- Review **caching/CDN** — ISR `revalidate` values, Netlify cache headers, static asset caching.

### 8.6 Verification
- Re-run production build + Lighthouse/WebPageTest-style checks; compare against baseline; record in Status Log.

---

## 9. Archive Pages 2016–2025

### 9.1 Requirements
- **Do not integrate** archive pages into the new site/CMS for now.
- **Do not break** existing public archive URLs.
- Provide a clean archive strategy.

### 9.2 Preferred strategy
- Host archive on an **`archive.` subdomain** (e.g. `archive.jazzfovaros.hu`) served by the **old hosting**. DNS: an `A`/`CNAME` record for `archive` → old host; the apex/`www` → Netlify.
- New site **may link** to the archive (footer/menu) but does **not** display or re-host it.

### 9.3 Alternative
- **Redirects** from year-based paths (`/2016`, `/2017`, …) → `https://archive.domain.hu/2016`, etc., via `netlify.toml [[redirects]]` (301).

### 9.4 Warning (DNS/routing reality)
- Serving **some paths from Netlify and some from old hosting under the exact same root domain** is complicated: **DNS cannot route by path** (DNS resolves a hostname to an IP, not per-path). Path-splitting requires a **reverse proxy / Netlify rewrites/proxy**, which adds latency and failure modes.
- Prefer **subdomain separation** (clean) or **301 redirects** (simple). Use proxy/rewrite **only if absolutely required**.

---

## 10. Safety, Backward Compatibility and QA

### 10.1 Safety rules
- **Create a branch** before major changes (e.g. `feat/cms-phase-1`); never commit straight to `main` for large work.
- **Do not remove** existing content fields until migration is proven safe (parallel-add, migrate, then deprecate).
- Add fields **backward-compatibly** (safe defaults).
- **Keep fallback behavior** until replacement is verified.

### 10.2 QA test matrix
- [ ] Pages with **missing data** (no body, no image, no EN) render without broken layout.
- [ ] **HU and EN** tested **separately** (both domains / both builds).
- [ ] **Hidden-from-nav** pages still reachable by URL (not 404).
- [ ] **noindex** pages emit correct meta (+ header where configured).
- [ ] **Disabled (`isActive:false`)** pages return 404 as intended.
- [ ] **Performer cards** with **and without** images (fallback bg works).
- [ ] **Event cards** with **and without** event titles (title→performer fallback).
- [ ] **Custom ticket URLs** and **global fallback** URL both resolve correctly.
- [ ] **Video blocks** enabled/disabled; thumbnail-first, click-to-load works.
- [ ] **Mobile** behavior (event accordion/modal, ticket cards, nav).
- [ ] **Production build** passes (`npm run build`) + `npm run lint` + typecheck.
- [ ] **Netlify deploy preview** verified before merge (both sites).

---

## 11. AI Tool Execution Strategy

### 11.1 Tool assignment

| Tool | Use for | Avoid for |
|---|---|---|
| **Claude** | Architecture & content-model design; tricky multilingual/routing decisions; UX logic; writing developer prompts; reviewing complex plans. | Large repetitive file edits; blindly applying many mechanical changes. |
| **Cursor** | Normal code implementation; editing components; Sanity GROQ queries; route logic; SEO/noindex logic; debugging build errors; iterative local dev. | Big architectural decisions (use Claude first). |
| **Antigravity** | Design implementation & visual polish; **ticket info page redesign**; performer/event card visual states; responsive layout; making UI look less generic/AI-generated. | Data modeling / query logic. |
| **SWE/SVA** | Monotonous multi-file updates; schema field additions **after the exact plan is approved**; repetitive refactors; structured audits; cleanup; pattern-consistency checks. | Creative/ambiguous design or architecture decisions. |
| **ChatGPT / GPT-5.5** | Second-opinion audit; prompt refinement; risk review; splitting work into tool-specific tasks; checking plan completeness. | Being the single source of truth (cross-check with this doc). |

### 11.2 Credit-saving principles
- **One AI should not rediscover context repeatedly** — this Markdown file is the shared memory; every tool reads it first.
- **Keep this plan updated.** After each phase, append to the **Status Log** (bottom).
- **Avoid broad/vague prompts** once implementation begins — use **small, specific, per-phase prompts** that reference the relevant section number here.
- Prefer the **cheapest capable tool** per task (table above) without sacrificing quality on architecture/UX decisions.

---

## 12. Recommended Implementation Phases

### Phase 0 — Full project audit
Inspect: framework specifics, Sanity schemas, routing, Netlify config, current performance baseline, content structure, fallback rules, the **locale-model tension** (§2.5), `noIndex` emission, GROQ shapes, image/font/video usage.
**Output:** audit notes; files-to-change list; risky areas; recommended order; locale-model decision.

### Phase 1 — CMS schema & content model
Add `video` schema; add flexible `sections` system + section objects; extend `performer` (ticket URLs), `programItem` (rich details, ticket URL, event-title decision), `accommodation` (rich text, drop "from" wording), contact/ticket fields; define validation + Studio previews. **Backward-compatible.**

### Phase 2 — Routing, navigation & multilingual logic
Hidden-nav pages accessible; locale-aware nav (EN hides when `labelEn` missing); explicit fallback rules; finalize domain-based default-locale model; reconcile `/en/` prefix.

### Phase 3 — SEO / noindex
Verify/implement per-page noindex meta; staging global noindex (context-aware `robots.ts` + `X-Robots-Tag`); rework sitemap to respect `isActive`/`noIndex` and include dynamic+legal pages; verify canonical/hreflang.

### Phase 4 — Core frontend feature updates
Videos (click-to-load), performers (card fallback bg + ticket URL), events (title-first, mobile accordion/modal), accommodations (rich text, no "from"), contact page (CMS + remove sponsors), legal/FAQ, flexible sections renderer.

### Phase 5 — Ticket info page redesign
Design + implement improved premium layout (**Antigravity**), CMS-backed, mobile-first, empty-safe.

### Phase 6 — Performance optimization
Image transforms + responsive + CLS fixes; video lazy-load; GROQ list/detail split; bundle + Framer Motion reduction; font + animation optimization; re-measure.

### Phase 7 — Domain / archive preparation
Confirm production domains + env vars on both Netlify sites; custom-domain DNS notes; secondary EN domain; archive subdomain + year redirects.

### Phase 8 — QA & final report
`npm run build` / `lint` / typecheck; manual test matrix (§10.2); performance comparison vs baseline; final changed-files report; list remaining manual Sanity content tasks for the editor.

---

## 13. AI Tool Assignment Table (quick reference)

| Phase | Primary tool | Support |
|---|---|---|
| 0 Audit | Claude / SWE/SVA (structured audit) | ChatGPT (risk review) |
| 1 Schemas | SWE/SVA (after Claude designs) | Cursor |
| 2 Routing/i18n | Claude (decisions) → Cursor | — |
| 3 SEO/noindex | Cursor | Claude (review) |
| 4 Features | Cursor | Antigravity (card visuals) |
| 5 Ticket page | **Antigravity** | Cursor (data wiring) |
| 6 Performance | Cursor | Claude (strategy), SWE/SVA (repetitive) |
| 7 Domain/archive | Cursor / human (DNS) | Claude (notes) |
| 8 QA | SWE/SVA | Claude (final report) |

---

## 14. Risk Register

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | Locale model conflict (two-site vs `/en/` prefix) causes wrong-language builds or duplicate content | High | High | Resolve in Phase 0; document one canonical model; correct canonicals/hreflang |
| R2 | Removing a code fallback the client relies on → page goes blank | Medium | High | Keep fallbacks until Sanity content verified; empty-state messaging |
| R3 | `noIndex` not actually emitted → staging/private pages indexed | Medium | High | Verify + implement in Phase 3; staging global noindex |
| R4 | Image weight / no Next optimization → poor LCP | High | Medium | Sanity transforms, responsive, lazy, hero preload (§8.2) |
| R5 | Eager video iframes tank performance | High | High | Click-to-load lite-embed (§8.3) — hard requirement |
| R6 | Breaking existing URLs / fixed slugs | Medium | High | `FIX_SLUGS` discipline; redirects; QA matrix |
| R7 | Flexible-section migration breaks fixed pages | Medium | Medium | Additive; keep old fields; migrate page-by-page later |
| R8 | Archive path-splitting under one domain | Low | Medium | Use subdomain or 301 redirects, not proxy (§9.4) |
| R9 | Sitemap exposes disabled/noindex pages | Medium | Low | Rework sitemap to filter (§6.2) |
| R10 | EN nav fallback to HU vs hide — inconsistent rule | Medium | Medium | Decide (recommend hide); update `navigationItem` behavior |

---

## 15. Open Questions to Verify During Audit

1. Which locale model is live/canonical — two domains (build-time) or single-domain `/en/` (runtime)? (R1)
2. Does `buildPageMetadataWithSanity` emit `noindex` from `seo.noIndex`? (R3)
3. What are the **real production domains** (jazzfovaros.hu/jazzcapital.hu vs the netlify.app placeholders)?
4. Where should the **global/default ticket URL** live (siteSettings? a ticket doc?)?
5. Are there any **hardcoded video embeds** today, and where?
6. Exact **GROQ shapes** — list vs detail over-fetching in `queries.ts`/`content.ts`.
7. Current **font loading** mechanism.
8. Should EN nav **hide** (recommended) or **fall back to HU** when `labelEn` is empty? (R10)
9. EN content fallback policy when EN body is missing (hide vs show HU vs empty-state)?
10. Should the `/en/` prefix be **kept** (in-domain switch) or **removed** under the two-domain model?
11. Is it safe/beneficial to re-enable Next image optimization (Netlify plugin support, cost)?

---

## 16. Final Recommended Next Action

**Start with Phase 0 (full audit) — do not change code yet.**
Concretely, the immediate next step: run the Phase 0 audit (Claude or SWE/SVA) to (a) resolve the locale-model question (R1/Q1), (b) verify `noIndex` emission (R3/Q2), (c) map current GROQ queries (Q6), and (d) confirm production domains (Q3). Record findings in the Status Log below, then proceed to Phase 1 schema work behind a feature branch.

---

## Phase 0 Audit Findings and Architecture Decision

### Locale Architecture — Critical Issue Identified

**Current State:**
- The repo has **two parallel locale models** that partially contradict each other:
  1. **Build-time locale model** (`buildLocale.ts`): Determines locale at build time based on Netlify deploy URL (`URL`/`DEPLOY_PRIME_URL`) matched against `NEXT_PUBLIC_SITE_URL_HU`/`NEXT_PUBLIC_SITE_URL_EN`, or explicit `NEXT_PUBLIC_LOCALE`. Used by `next.config.ts` to set `NEXT_PUBLIC_BUILD_LOCALE` env var.
  2. **Runtime locale model** (`locale.ts`, `middleware.ts`): Determines locale at request time via host detection (`jazzcapital.hu` → `en`, `jazzfovaros.hu` → `hu`), `NEXT_LOCALE` cookie, and `/en/` path prefix with rewrite logic.

**Where buildLocale.ts is used:**
- `next.config.ts` line 6: Sets `NEXT_PUBLIC_BUILD_LOCALE` env var at build time
- `seo.ts` line 16: Calls `getBuildLocale()` to determine `BASE_URL` and `ALT_URL` for canonical URLs
- Used by `seo.ts` functions: `siteUrlForLocale()`, `canonicalUrl()`, `metadataAlternates()`, `getLanguageSwitchUrl()`

**Where locale.ts is used:**
- Used by **every page component** (16+ files): `page.tsx`, `program/page.tsx`, `lineup/page.tsx`, `szallas/page.tsx`, `terkep/page.tsx`, `tabor/page.tsx`, `futas/page.tsx`, `contact/page.tsx`, `info/page.tsx`, `aszf/page.tsx`, `adatvedelem/page.tsx`, `oldal/[slug]/page.tsx`, `layout.tsx`
- Used by `src/sanity/lib/content.ts` (8+ functions): `getFooterSponsorsWithFallback`, `getPopupSettingsWithFallback`, `getVisibleTicketsWithFallback`, `getPerformersWithFallback`, `getProgramContent`, `getAccommodationContent`, `getVenueContent`, `getTransportContent`, `getContactContent`, `getPageContentBySlug`, `getNavigationWithFallback`, `getTicketUrlWithFallback`
- Used by `middleware.ts`: Sets `NEXT_LOCALE` cookie based on host and `/en/` path

**Netlify configuration:**
- `netlify.toml` sets `NEXT_PUBLIC_SITE_URL_HU = "https://bohemjazz.netlify.app"` and `NEXT_PUBLIC_SITE_URL_EN = "https://buhemjazzen.netlify.app"` in build environment
- No separate build commands or env vars per site — both sites use the same `npm run build`
- The locale is determined **solely by the deploy URL** matching the site URL env vars

**How each Netlify site sets locale:**
- HU site (`bohemjazz.netlify.app`): `buildLocale.ts` detects deploy URL matches `NEXT_PUBLIC_SITE_URL_HU` → returns `"hu"` → build emits Hungarian version
- EN site (`buhemjazzen.netlify.app`): `buildLocale.ts` detects deploy URL matches `NEXT_PUBLIC_SITE_URL_EN` → returns `"en"` → build emits English version
- Both sites can be overridden by `NEXT_PUBLIC_LOCALE=en|hu` env var

**How /en/ prefix currently works:**
- `middleware.ts` line 29-40: If path is `/en` or starts with `/en/`, it **rewrites** to the stripped path (e.g., `/en/program` → `/program`) and sets `NEXT_LOCALE=en` cookie
- `locale.ts` line 19-31: `localizePath()` adds `/en/` prefix for EN locale, removes it for HU locale
- `seo.ts` line 27-35: Comments describe single-domain model with `/en/` prefix, but `getLanguageSwitchUrl()` falls back to cross-domain URLs if `NEXT_PUBLIC_SITE_URL_EN`/`HU` are set
- `/en/` prefix **does not generate actual pages** — it's a rewrite mechanism that serves the same route with a different locale cookie

**Could runtime locale model cause issues?**
- **YES — canonical URL risk**: `seo.ts` uses `buildLocale()` (build-time) for canonical URLs, but pages use `getLocale()` (runtime) for content. If a user visits `jazzfovaros.hu/en/program`, the canonical URL will be `jazzfovaros.hu/program/` (HU) but content is EN. This creates language mismatch.
- **YES — sitemap risk**: `sitemap.ts` uses `SITE_URL_HU` and `SITE_URL_EN` from `seo.ts` (build-time) to generate sitemaps. It doesn't know about `/en/` prefix paths, so EN content on HU domain via `/en/` won't be in sitemap.
- **YES — navigation risk**: `locale.ts` `localizeContent()` adds `/en/` prefix to nav links for EN locale, but `seo.ts` `getLanguageSwitchUrl()` may return cross-domain URLs. This creates inconsistent language switch behavior.
- **YES — duplicate content risk**: Same content accessible at both `jazzfovaros.hu/program/` (HU build) and `jazzfovaros.hu/en/program/` (EN via rewrite) if both builds are deployed to same domain.

**Strategic Decision (Recommended):**
- **Adopt the two-site/two-domain build-time locale model as the canonical architecture.**
- **Remove or deprecate the runtime `/en/` prefix model** to avoid conflicts.
- HU Netlify site (`jazzfovaros.hu`) builds and serves only Hungarian content.
- EN Netlify site (`jazzcapital.hu`) builds and serves only English content.
- Language switch links should be **cross-domain** (HU ↔ EN domain), not in-domain `/en/` paths.
- This eliminates canonical URL conflicts, sitemap issues, and duplicate content risks.

**Safest Simplification Path:**
1. **Keep `buildLocale.ts` and build-time model** — this is working correctly.
2. **Remove `/en/` prefix rewrite logic** from `middleware.ts` — delete lines 29-40.
3. **Remove `localizePath()` function** from `locale.ts` — delete lines 19-31, update all call sites to use direct paths.
4. **Update `seo.ts` `getLanguageSwitchUrl()`** — always return cross-domain URL, remove `/en/` fallback.
5. **Update all page components** — remove `localizePath()` calls from nav/content generation.
6. **Update `sitemap.ts`** — ensure it only generates URLs for the current build locale (remove duplicate HU/EN entries).
7. **Update `robots.ts`** — ensure it only references the current build locale's sitemap.

**Files to Modify Later:**
| File | Change | Risk |
|---|---|---|
| `src/middleware.ts` | Remove `/en/` rewrite logic (lines 29-40) | Medium — affects routing |
| `src/lib/locale.ts` | Remove `localizePath()` and `localizeContent()` | Medium — affects all pages |
| `src/lib/seo.ts` | Remove `/en/` fallback from `getLanguageSwitchUrl()` | Low — only affects language switch |
| `src/app/sitemap.ts` | Generate only current locale URLs, remove duplicates | Low — SEO only |
| `src/app/robots.ts` | Reference only current locale sitemap | Low — SEO only |
| All page components (16+ files) | Remove `localizePath()` calls | Medium — widespread change |
| `src/sanity/lib/content.ts` | Remove `localizePath()` calls from nav/content | Medium — affects navigation |

**Do Not Touch Yet / Risky Areas:**
- `next.config.ts` — build-time locale logic is correct, keep as-is
- `netlify.toml` — env vars are correct, keep as-is
- `buildLocale.ts` — build-time logic is correct, keep as-is
- Sanity schemas — no locale-related changes needed
- `src/app/oldal/[slug]/page.tsx` — dynamic routing is working correctly

**Implementation Order After Audit:**
1. Update `middleware.ts` to remove `/en/` rewrite
2. Update `seo.ts` to remove `/en/` fallback
3. Update `sitemap.ts` and `robots.ts` for single-locale generation
4. Update `locale.ts` to remove `localizePath()` and `localizeContent()`
5. Update all page components to remove `localizePath()` calls
6. Update `content.ts` to remove `localizePath()` calls
7. Test both HU and EN builds locally with `NEXT_PUBLIC_LOCALE=hu|en`
8. Deploy to Netlify preview branches to verify
9. Update production domains in Netlify env vars

**Decision Needed from Owner:**
- Confirm the two-domain model is the intended architecture (HU domain = Hungarian, EN domain = English)
- Confirm whether `/en/` prefix should be completely removed or kept as a redirect-only legacy path
- Confirm production domains: `jazzfovaros.hu` for HU, `jazzcapital.hu` for EN (or different?)

---

### SEO / Indexing Audit

**noIndex Field Emission:**
- **VERIFIED**: `seo.ts` object has `noIndex` field (line 34-38 in `seo.ts` schema)
- **VERIFIED**: `buildPageMetadataWithSanity()` in `seoContent.ts` line 138-148 **does emit** `robots: { index: false, follow: false }` when `seo.noIndex === true`
- **Status**: ✅ Working correctly

**robots.ts Behavior:**
- `robots.ts` currently **allows all** unconditionally (`allow: "/"`)
- It references both HU and EN sitemaps (`sitemap: [SITE_URL_HU, SITE_URL_EN]`)
- **Issue**: No staging/preview detection — staging builds are indexable
- **Recommendation**: Add `CONTEXT` or `DEPLOY_PRIME_URL` check to emit `disallow: /` for non-production

**sitemap.ts Issues:**
- **Hardcoded page list**: Only includes 11 fixed pages (/, /lineup/, /program/, /info/, /szallas/, /terkep/, /tabor/, /futas/, /contact/, /aszf/)
- **Missing**: `/adatvedelem/` (privacy), all dynamic `/oldal/[slug]` pages
- **Ignores `noIndex`**: Does not filter out pages with `seo.noIndex === true`
- **Ignores `isActive`**: Does not filter out pages with `isActive === false`
- **Duplicate entries**: Generates both HU and EN URLs for every page, even under two-domain model
- **Recommendation**: Rewrite to fetch from Sanity `getAllActivePageSlugsQuery`, filter by `isActive` and `noIndex`, generate only current locale URLs

**Production vs Staging noindex Handling:**
- Current: No staging detection
- Recommended: Detect Netlify `CONTEXT !== "production"` and emit global noindex via:
  - `robots.ts`: `disallow: /`
  - `X-Robots-Tag` header via `netlify.toml [[headers]]` or Next `headers()`
  - Meta tag in layout for staging builds

---

### Sanity Queries and Schemas Audit

**Real Schema Mapping:**
- ✅ `page` — 571 lines, extensive slug-conditional fields (camp*, running*, programBody*, etc.)
- ✅ `performer` — 178 lines, has `name`, `slug`, `image`, `imageDisplayMode`, `shortDescriptionRichHu/En`, `bioRichHu/En`, `tags`, `members`, social URLs, `order`, `isFeatured`, `isActive`, `seo`
- ✅ `programItem` — 121 lines, has `titleHu/En`, `descriptionHu/En` (plain text), `date`, `startTime`, `endTime`, `stageRef` + legacy `stage`, `category`, `performers[]`, `order`, `isActive`, `seo`
- ✅ `accommodation` — 39 lines, has `name`, `descriptionHu/En` (plain text), `priceHu/En`, `stars`, `image`, `imagePath`, `websiteUrl`, `bookingUrl`, `bookingLabelHu/En`, `distanceHu/En`, `order`, `isActive`
- ✅ `ticket` — 45 lines, has `nameHu/En`, `descriptionHu/En` (plain text, **not rendered**), `price`, `currency`, `ticketUrlHu/En`, `badgeHu/En`, `isAvailable`, `isHidden`, `order`
- ✅ `navigationItem` — 131 lines, has `labelHu/En`, `page` reference, `href`, `externalUrl`, `openInNewTab`, `order`, `isActive`, `showInHeader`, `showInFooter`, `parent`
- ✅ `seo` object — 41 lines, has `seoTitleHu/En`, `seoDescriptionHu/En`, `ogImage`, `canonicalOverrideHu/En`, `noIndex`
- ❌ No `video` schema
- ❌ No flexible section/block system
- ✅ `stage`, `sponsor`, `sponsorCategory`, `performerTag`, `transportItem`, `siteSettings`, `popupSettings`, `venue` exist

**Missing Fields Required by Development Plan:**
- `performer`: Missing `ticketUrlHu/En` (individual ticket URLs)
- `programItem`: Missing `eventTitleHu/En` (explicit event title), `detailsRichHu/En` (rich text details), `ticketUrlHu/En` (event-level ticket URLs)
- `accommodation`: Missing `bodyRichHu/En` (rich text body to replace plain `descriptionHu/En`)
- `ticket`: `descriptionHu/En` exists but **not rendered** (schema comment confirms)
- `page`: Missing `sections` array for flexible block system
- No dedicated `contactPage` or `faq` schema (would use `page` with specific slugs)

**Fields That Exist But Are Not Rendered:**
- `ticket.descriptionHu/En` — stored but not used (line 11-12 in ticket.ts comment: "Csak a Studio listájához használjuk; az oldalon nem renderelődik")
- `programItem.descriptionHu/En` — plain text, used in program card notes but not as rich details
- `page` has many slug-conditional fields that only render on specific slugs (fragile pattern)

**Fragile Slug-Conditional Fields in page.ts:**
- Lines 70-102: `heroTitleHu/En`, `heroDescriptionRichHu/En` hidden for `home`, `program`, `lineup`
- Lines 110-122: `introNoteRichHu/En` only for `szallas`, `terkep`
- Lines 124-142: `pageBodyRichHu/En` hidden for `home`, `program`, `lineup`
- Lines 145-174: `programBodyRichHu/En` only for `program`
- Lines 209-331: `camp*` fields only for `tabor`
- Lines 333-458: `running*` fields only for `futas`
- Lines 460-537: CTA button fields only for `futas`, `tabor`
- **Risk**: Adding new slugs requires code changes; editors can't add sections without developer intervention

**Recommended Schema Additions (Backward-Compatible):**
1. Add `video` schema with click-to-load fields
2. Add `sections` array to `page` with section object types
3. Add `ticketUrlHu/En` to `performer`
4. Add `eventTitleHu/En`, `detailsRichHu/En`, `ticketUrlHu/En` to `programItem`
5. Add `bodyRichHu/En` to `accommodation` (keep old `descriptionHu/En` for migration)
6. Render `ticket.descriptionHu/En` in ticket cards
7. Create section object schemas: `videoSection`, `richTextSection`, `richTextBoxSection`, `ctaSection`, `imageSection`, `gallerySection`, `spacerSection`

---

### Performance Audit

**Image Handling:**
- ✅ `next.config.ts` line 12: `images: { unoptimized: true }` — Next.js image optimization is OFF
- ✅ Sanity image transforms used via `@sanity/image-url` in `urlFor()` (e.g., `width(800).height(800)`, `width(1200).height(630)`, `width(1400)`)
- ❌ **No Next/Image usage found** — all images use plain `<img>` tags or Sanity URLs
- ✅ `loading="lazy"` set on iframes (VideoEmbed.tsx line 26, VideoSection.tsx line 38)
- ⚠️ **No responsive `srcset`/`sizes`** — fixed widths in Sanity transforms
- ⚠️ **No aspect-ratio boxes** — potential CLS risk
- ⚠️ **No hero image preloading** — LCP risk

**Video Embeds:**
- ❌ **Eager iframe loading**: `VideoEmbed.tsx` and `VideoSection.tsx` load YouTube iframes on page load (even with `loading="lazy"`, the iframe element is created immediately)
- ⚠️ **No click-to-load pattern** — violates performance requirement
- Locations: `VideoEmbed.tsx` (used by home), `VideoSection.tsx` (used by tabor), `terkep/page.tsx` line 79 (map iframe), `tabor/page.tsx` line 70 (map iframe), `info/page.tsx` line 220 (video iframe)
- **Risk**: Heavy JS/CSS from YouTube, poor LCP, high TBT

**Framer Motion Usage:**
- Used in 2 components: `LineupGrid.tsx` (motion button, motion div, motion article), `Navbar.tsx` (motion nav, motion li)
- ⚠️ **Moderate footprint** — not excessive but could be optimized
- All components with Framer Motion are client components (`"use client"`)

**Client Components:**
- 20+ files use `"use client"`: entire layout shell, all interactive components
- ⚠️ **Large hydration footprint** — most of the UI is client-side
- Server components: mostly page.tsx files that fetch data

**GROQ Query Over-Fetching:**
- `queries.ts`:
  - `PERFORMER_PROJECTION` (lines 36-70): Fetches full rich text, members, tags, social URLs — **over-fetching for list views**
  - `getProgramItemsQuery` (lines 76-96): Fetches full performers array with nested data — **over-fetching for list**
  - `getActivePageBySlugQuery` (lines 117-170): Fetches ALL slug-conditional fields regardless of slug — **massive over-fetch**
  - `getPageQuery` (lines 172-241): Same over-fetch pattern
- ⚠️ **No list vs detail query separation** — same projection for cards and modals

**Fonts:**
- Not audited in this phase — need to check `layout.tsx` and font loading strategy

**Performance Risks Summary:**
1. **Eager video iframes** — highest priority
2. **No Next.js image optimization** — rely on Sanity transforms only
3. **No responsive images** — fixed widths
4. **GROQ over-fetching** — especially page queries
5. **Large client component footprint** — most UI is client-side
6. **Framer Motion on initial load** — could be lazy-loaded

**Quick Wins:**
1. Implement click-to-load for all video iframes
2. Add `srcset`/`sizes` to Sanity image transforms
3. Add aspect-ratio boxes to prevent CLS
4. Split GROQ queries into list vs detail projections
5. Lazy-load non-critical client components with `next/dynamic`

**Deeper Fixes:**
1. Re-enable Next.js image optimization with Sanity loader (verify Netlify plugin support)
2. Reduce client component footprint by moving non-interactive parts to server components
3. Bundle analysis and Framer Motion optimization
4. Font optimization (next/font, subsetting)

---

### Dynamic Pages and Routing Audit

**Hidden Sanity Pages 404 Behavior:**
- `oldal/[slug]/page.tsx` line 86-88: If `!page.found`, returns `notFound()` → 404
- `getPageContentBySlug()` in `content.ts` line 672-677: Fetches with `isActive == true` filter
- **Status**: ✅ Hidden/inactive pages correctly return 404

**Slug Generation:**
- `page.ts` schema: Slug generated from `titleHu` with maxLength 96
- `FIX_SLUGS` set in `oldal/[slug]/page.tsx` (lines 21-32): home, info, lineup, program, contact, szallas, terkep, futas, tabor, aszf
- `FIX_PAGE_SLUGS` set in `content.ts` (lines 723-734): same list plus `adatvedelem` is missing
- **Issue**: `adatvedelem` (privacy) is in `FIX_SLUGS` but not in `FIX_PAGE_SLUGS` — inconsistency
- **Status**: ✅ Generally correct, minor inconsistency to fix

**Static Generation / Build Behavior:**
- `oldal/[slug]/page.tsx` line 34: `export const revalidate = 30` — ISR with 30s revalidation
- `generateStaticParams()` (lines 36-48): Fetches all active page slugs from Sanity, filters out `FIX_SLUGS`
- **Status**: ✅ New active pages appear within 30s without redeploy

**Hidden-from-Nav Pages in Build:**
- `generateStaticParams()` uses `getAllActivePageSlugsQuery` which filters `isActive == true`
- Does NOT check navigation visibility (`showInHeader`/`showInFooter`)
- **Status**: ✅ Hidden-from-nav pages are still included in static params/build (correct per requirements)

**Legal Pages, FAQ, Generic Pages:**
- Legal pages (`aszf`, `adatvedelem`) are fixed routes, not dynamic
- FAQ would use `page` schema with custom slug (e.g., `gyik`) → `/oldal/gyik/`
- Generic pages use `page` schema with custom slug → `/oldal/[slug]/`
- **Status**: ✅ Correct pattern

**Locale Routing:**
- `/en/` prefix handled by middleware rewrite (see locale architecture section)
- Under two-domain model, this should be removed
- **Status**: ⚠️ Conflicts with two-domain model (see above)

**Netlify Redirects:**
- `netlify.toml` has no `[[redirects]]` or `[[headers]]` sections
- No `_redirects` or `_headers` files found
- **Status**: ⚠️ No HTTPS/www canonicalization, no archive redirects

---

## Phase 1A Implementation Summary (Locale + SEO foundation)

### Scope completed
- Runtime `/en/` prefix behavior has been neutralized from primary locale architecture and reduced to **legacy redirect-only** behavior in middleware.
- Build-time locale model (`getBuildLocale`) is now the source of truth for page locale/content selection.
- Canonical generation remains per-locale domain based (`siteUrlForLocale(locale)`), without `/en/` canonical fallback.
- Sitemap has been rewritten to include core routes + Sanity pages (`isActive == true`, `seo.noIndex != true`) for the **current build locale/domain only**.
- Robots now supports production-vs-staging behavior (`CONTEXT` / `NODE_ENV` / `DEPLOY_PRIME_URL`) and emits a single sitemap URL for the current build locale site.
- Fixed slug inconsistency: `adatvedelem` added to `FIX_PAGE_SLUGS`.

### Files changed in Phase 1A
- `src/lib/locale.ts`
- `src/middleware.ts`
- `src/lib/seo.ts`
- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `src/sanity/lib/queries.ts`
- `src/sanity/lib/content.ts`
- `src/app/oldal/[slug]/page.tsx`
- `JAZZ_SITE_DEVELOPMENT_PLAN.md`

### Old behavior → new behavior
- **Locale selection**
  - Old: runtime cookie/host + optional `/en/` rewrite could override route-language behavior.
  - New: locale is build-time driven via `getBuildLocale()`; runtime `/en/` no longer serves content via rewrite.
- **Legacy `/en/` handling**
  - Old: `/en/*` rewrote internally to `/*` and set cookie.
  - New: `/en/*` redirects (`308`):
    - EN build: `/en/*` → `/*` on same domain.
    - HU build: `/en/*` → EN domain equivalent path.
- **Canonical**
  - Old risk: mixed runtime locale and build canonical could conflict.
  - New: canonical remains locale-domain aligned for current page locale/domain setup.
- **Sitemap**
  - Old: hardcoded list, dual HU+EN entries, no Sanity dynamic pages, no noIndex filtering.
  - New: single-locale sitemap per build; includes active Sanity pages; excludes `seo.noIndex`; keeps static core routes.
- **Robots**
  - Old: always allow indexing and listed two sitemap domains unconditionally.
  - New: production allows, non-production disallows; sitemap points only to current build locale domain.

### Env vars required / expected
- Locale/domain:
  - `NEXT_PUBLIC_SITE_URL_HU`
  - `NEXT_PUBLIC_SITE_URL_EN`
  - Optional override: `NEXT_PUBLIC_LOCALE` (`hu` / `en`)
  - Optional language switch override: `NEXT_PUBLIC_LANGUAGE_SWITCH_URL`
- Robots/staging behavior:
  - `CONTEXT` (Netlify: `production`, `deploy-preview`, `branch-deploy`)
  - `DEPLOY_PRIME_URL` (Netlify preview detection fallback)
  - `NODE_ENV` (fallback only)

### Manual Netlify/domain tasks still needed
- Confirm final production domains and set `NEXT_PUBLIC_SITE_URL_HU` / `NEXT_PUBLIC_SITE_URL_EN` consistently on both Netlify sites.
- Ensure each Netlify site points to its correct custom domain (HU site ↔ HU domain, EN site ↔ EN domain).
- Optionally set explicit `NEXT_PUBLIC_LOCALE` per site if deterministic override is desired.
- Optionally add `X-Robots-Tag` headers in `netlify.toml` for non-production if stricter crawler blocking is required.

### Remaining risks / gaps
- `buildPageMetadataWithSanity` noIndex behavior is verified working for pages using that helper; if any future route bypasses it, noIndex must be enforced there separately.
- `metadataAlternates()` still emits HU/EN hreflang alternates cross-domain. This is intended for two-domain architecture, but final domains must be confirmed to avoid wrong alternates.

---

## Phase 1B Implementation Summary (Sanity schema foundation + content model prep)

### Scope completed
- Added a new `video` document schema with HU/EN title+description, URL, thumbnail, size, enabled/order, optional CTA fields, and optional page relation.
- Added validation so `videoUrl` is required when `enabled == true`.
- Extended `performer`, `programItem`, `accommodation`, and `ticket` schemas with backward-compatible new fields.
- Added reusable flexible section object schema foundation and connected it to `page.sections`.
- Kept all existing fields and slug-specific page model intact (no migration, no removal).
- Kept locale/deployment architecture from Phase 1A unchanged (no `/en/` runtime model reintroduced).

### Files changed in Phase 1B
- `src/sanity/schemaTypes/documents/video.ts` (new)
- `src/sanity/schemaTypes/objects/sectionRichText.ts` (new)
- `src/sanity/schemaTypes/objects/sectionTextBox.ts` (new)
- `src/sanity/schemaTypes/objects/sectionVideo.ts` (new)
- `src/sanity/schemaTypes/objects/sectionButton.ts` (new)
- `src/sanity/schemaTypes/objects/sectionImage.ts` (new)
- `src/sanity/schemaTypes/objects/sectionGallery.ts` (new)
- `src/sanity/schemaTypes/objects/sectionSpacer.ts` (new)
- `src/sanity/schemaTypes/documents/performer.ts`
- `src/sanity/schemaTypes/documents/programItem.ts`
- `src/sanity/schemaTypes/documents/accommodation.ts`
- `src/sanity/schemaTypes/documents/ticket.ts`
- `src/sanity/schemaTypes/documents/page.ts`
- `src/sanity/schemaTypes/index.ts`
- `src/sanity/lib/queries.ts`
- `src/sanity/types.ts`
- `JAZZ_SITE_DEVELOPMENT_PLAN.md`

### Schemas added
- New document schema:
  - `video`
- New reusable section object schemas:
  - `sectionRichText`
  - `sectionTextBox`
  - `sectionVideo`
  - `sectionButton`
  - `sectionImage`
  - `sectionGallery`
  - `sectionSpacer`

### Fields added
- `video`:
  - `titleHu`, `titleEn`
  - `descriptionHu`, `descriptionEn`
  - `videoUrl` (enabled-state aware validation)
  - `thumbnail`
  - `size` (`small|medium|large|full`, default: `medium`)
  - `enabled` (default: `true`)
  - `order`
  - `ctaTextHu`, `ctaTextEn`, `ctaUrl`
  - `displayOnPages` (optional relation to `page`)
- `performer`:
  - `ticketUrlHu`, `ticketUrlEn`
  - `cardBackgroundVariant`
- `programItem`:
  - `eventTitleHu`, `eventTitleEn`
  - `detailsRichHu`, `detailsRichEn`
  - `ticketUrlHu`, `ticketUrlEn`
- `accommodation`:
  - `bodyRichHu`, `bodyRichEn`
  - `ctaTextHu`, `ctaTextEn`, `ctaUrl`
- `ticket`:
  - `ctaTextHu`, `ctaTextEn`, `ctaUrl`
  - `isFeatured`
  - Updated descriptions for existing `descriptionHu/En` to mark intended later rendering use
- `page`:
  - `sections` array with flexible section object types

### Existing legal/FAQ/generic page support audit result
- Existing `page` model already supports:
  - `titleHu/titleEn`
  - `slug`
  - rich text bodies (`pageBodyRichHu/En`)
  - SEO object with `noIndex`
  - `isActive`
- `showInNavHu/showInNavEn` was intentionally **not added** in Phase 1B, because navigation is currently `navigationItem`-driven and duplicating visibility logic now would increase inconsistency risk.

### Query preparation (minimal, no broad over-fetching)
- Added scalar-level preparation fields in existing list queries where low risk:
  - `performer`: ticket URLs + `cardBackgroundVariant`
  - `programItem`: event titles + ticket URLs
  - `accommodation`: CTA scalar fields
- Added `getEnabledVideosQuery` for future safe video integration.
- Rich text heavy fields were intentionally **not** broadly injected into list queries; later Phase 2/3 should split list/detail query responsibilities more cleanly.

### Compatibility notes
- Additive-only schema work; no existing field removed or renamed.
- Existing frontend rendering paths remain intact.
- Existing Sanity documents remain valid without immediate editor migration.

### Intentionally not added in Phase 1B
- No frontend redesign.
- No full flexible section renderer implementation yet.
- No broad refactor of slug-conditional `page` logic yet.
- No locale/deployment architecture changes beyond Phase 1A.

### Frontend work still pending (later phases)
- Video thumbnail-first click-to-load rendering based on `video` / `sectionVideo`.
- Performer ticket URL fallback logic and card background fallback behavior wiring.
- Program event title priority + rich detail interaction UI (desktop/mobile patterns).
- Accommodation rich text rendering and old “ártól/from” wording removal from UI logic.
- Ticket description/CTA/featured rendering enhancements on ticket-related pages.
- Generic section renderer (`page.sections`) and guarded empty-section rendering.

### Sanity content entry pending
- Editors need to populate new fields (video docs, event titles/details, richer accommodation bodies, optional ticket CTA fields, flexible sections) before frontend can fully use them.

### Risks / migration follow-up
- Until section rendering lands, `page.sections` is foundation only.
- Existing `page` slug-conditional field model remains complex; Phase 2+ should progressively migrate fixed pages toward section-driven rendering while preserving fallback behavior.

---

## Phase 2A Implementation Summary (frontend content behavior wiring)

### Files changed
- `src/sanity/lib/queries.ts`
- `src/sanity/lib/content.ts`
- `src/sanity/types.ts`
- `src/lib/types.ts`
- `src/app/program/page.tsx`
- `src/app/lineup/page.tsx`
- `src/components/lineup/LineupGrid.tsx`
- `src/app/szallas/page.tsx`
- `src/app/info/page.tsx`
- `src/app/page.tsx`
- `src/app/tabor/page.tsx`
- `src/app/oldal/[slug]/page.tsx`
- `src/app/aszf/page.tsx`
- `src/app/adatvedelem/page.tsx`
- `src/components/common/VideoLiteEmbed.tsx` (new)
- `src/components/layout/FlexibleSections.tsx` (new)
- `JAZZ_SITE_DEVELOPMENT_PLAN.md`

### Frontend behaviors implemented
- **Program/event title priority**
  - Uses locale-specific `eventTitleHu/En` first.
  - Falls back to existing `titleHu/En`.
  - Falls back to performer names if titles are empty.
  - Performer names are rendered as secondary line when event title differs.
- **Program details behavior**
  - Introduced accessible `<details>/<summary>` expansion in program slots for notes + rich details + ticket link.
  - No hover-only interaction dependency.
- **Program ticket URL fallback**
  - Priority: `programItem.ticketUrlHu/En` → first linked performer ticket URL → global ticket URL.
- **Performer ticket URL + card fallback**
  - Performer modal ticket CTA uses performer-specific ticket URL first, then global fallback.
  - Card background now respects `cardBackgroundVariant` (`navbar/default/accent`).
  - Image error path now keeps a safe visual fallback (gradient background remains visible).
- **Accommodation rendering**
  - Removed visible “ártól/from” label from price display.
  - Supports `bodyRichHu/En` render, with fallback to legacy plain description.
  - Supports CTA rendering via `ctaUrl` + locale CTA text fallback.
  - Prevents empty CTA buttons.
- **Ticket rendering in info page**
  - Ticket description (`descriptionHu/En`) now appears under each ticket row when present.
  - Supports `ctaTextHu/En` + `ctaUrl` per ticket.
  - `isFeatured` gets minimal badge-level highlight treatment (no redesign).
  - Existing visibility/ordering behavior remains (`isHidden`, `isAvailable`, `order` via query).
- **Video behavior (thumbnail-first, click-to-load)**
  - New reusable `VideoLiteEmbed` component added.
  - No iframe load before user click.
  - Thumbnail-first (with styled placeholder fallback when missing thumbnail).
  - Supports video `size` variants (`small/medium/large/full`).
  - Locale-aware title/description/CTA rendering.
  - Accessible play button semantics + aria label.
  - Home page now consumes enabled videos from Sanity (`getEnabledVideosQuery`) with optional `displayOnPages` filtering.
  - Camp page switched from eager iframe to click-to-load video embed component.
- **Flexible sections minimal renderer**
  - New additive renderer: `FlexibleSections`.
  - Supports: `sectionRichText`, `sectionTextBox`, `sectionVideo`, `sectionButton`, `sectionImage`, `sectionGallery`, `sectionSpacer`.
  - Skips disabled/empty sections.
  - Wired into dynamic `/oldal/[slug]` pages and legal pages (`/aszf`, `/adatvedelem`) as additive behavior.
- **Generic/legal rich text**
  - Existing page body rendering preserved.
  - Active pages remain accessible by slug route behavior unchanged.

### Fields now rendered in frontend
- `programItem`: `eventTitleHu/En`, `detailsRichHu/En`, `ticketUrlHu/En`
- `performer`: `ticketUrlHu/En`, `cardBackgroundVariant`
- `accommodation`: `bodyRichHu/En`, `ctaTextHu/En`, `ctaUrl`
- `ticket`: `descriptionHu/En`, `ctaTextHu/En`, `ctaUrl`, `isFeatured`
- `video`: `titleHu/En`, `descriptionHu/En`, `videoUrl`, `thumbnail`, `size`, `ctaTextHu/En`, `ctaUrl`, `enabled`, `order`, `displayOnPages`
- `page.sections`: all Phase 1B section object foundations listed above

### Fallback rules (implemented)
- Event label: `eventTitle` → `title` → performer names.
- Program ticket URL: event URL → first performer URL → global ticket URL.
- Performer ticket URL: performer URL → global ticket URL.
- Accommodation body: rich body → plain description.
- Accommodation CTA text: `ctaText` → bookingLabel → locale default label.
- Video display: thumbnail → styled placeholder; iframe only after click.

### Intentionally deferred to Phase 2B/3
- No broad layout redesign.
- No full migration away from slug-conditional page fields.
- No broad list/detail GROQ refactor.
- No global replacement of all legacy iframe/video usages across every page block.
- No major performance sweep beyond requested click-to-load video behavior.

### Risks / follow-up
- Program details now rely on compact details disclosure in cards; if richer desktop/mobile interaction is desired, this should be refined in later phase.
- Flexible sections are additive and currently attached where low-risk; full rollout to all fixed pages needs page-by-page validation.
- `displayOnPages` handling currently used on home; broader page-level placement rules can be expanded later.

### Manual Sanity content tasks
- Editors should populate:
  - `eventTitle*`, `detailsRich*`, `ticketUrl*` on `programItem`,
  - performer-level ticket URLs/background variants,
  - accommodation rich body + CTA fields,
  - ticket descriptions and CTA fields,
  - `video` documents including thumbnails and optional `displayOnPages`,
  - `page.sections` content where additive blocks are desired.

### QA results
- `npm run build` ✅
- `npm run lint` ✅
- `npm run typecheck` ❌ (script still missing)

---

## Phase 2B Performance Audit

### Biggest bottlenecks (current state)
- `next.config.ts` still uses `images.unoptimized: true`, so no Next.js optimizer pipeline; image quality/format/size control depends entirely on Sanity URL transforms.
- Several Sanity image paths were using fixed-size URLs without consistent `auto=format` + quality tuning, increasing transfer size on mobile.
- GROQ over-fetching remained in key paths:
  - `getProgramContent` fetched full performer documents only to resolve ticket fallback.
  - `getPerformersWithFallback` fetched full program documents just to build performer program meta.
  - `getPageBySlugQuery` fetched full page document where SEO metadata only was needed.
- Hydration overhead from unnecessary client components (`Hero`, `LineupTeaser`) that can render as server components.
- Legacy video components (`VideoEmbed`, `VideoSection`) still contained eager iframe code paths (not actively used, but risky if reused).
- Remaining iframe embeds are map embeds on `info` and `terkep`; these are not video and remain `loading="lazy"` for now.

### Low-risk quick wins implemented
- Introduced reusable `sanityImageUrl()` helper with standardized transform defaults:
  - `auto("format")`
  - `quality(75)`
  - optional `width`/`height`
- Switched major Sanity image URL generation sites to `sanityImageUrl()`:
  - performer card images
  - accommodation images
  - popup image
  - sponsor logos
  - video thumbnails
  - flexible section image/gallery renders
- Reduced GROQ payloads with low-risk query splits:
  - Added `getProgramItemsLightQuery` for performer listing context.
  - Added `getPerformerTicketUrlsQuery` for program ticket fallback resolution.
  - Narrowed `getPageBySlugQuery` to SEO-relevant fields only (`titleHu/titleEn`, `seo`).
- Converted non-interactive home components to server components by removing unnecessary `"use client"`:
  - `Hero`
  - `LineupTeaser`
- Removed eager iframe behavior from legacy video components by delegating to `VideoLiteEmbed`.

### Risky / deferred optimizations (documented, not forced)
- Enabling Next.js built-in image optimization (`images.unoptimized: false`) is deferred until Netlify + Sanity loader compatibility is verified end-to-end in this deployment setup.
- Full list/detail query architecture split for dynamic page content (`getActivePageBySlugQuery`) is deferred due slug-conditional field complexity and regression risk.
- Map iframe click-to-load replacement is deferred (functionality and UX risk; currently lazy-loaded).
- Broader Framer Motion reduction and dynamic import strategy is deferred to avoid interaction regressions before dedicated UX/perf pass.

### Files/components affected in Phase 2B
- `src/sanity/lib/image.ts`
- `src/sanity/lib/content.ts`
- `src/sanity/lib/queries.ts`
- `src/components/layout/FlexibleSections.tsx`
- `src/components/home/Hero.tsx`
- `src/components/home/LineupTeaser.tsx`
- `src/components/home/VideoEmbed.tsx`
- `src/components/home/VideoSection.tsx`
- `src/components/home/Navbar.tsx`

---

## Phase 2B Implementation Summary

### Performance audit findings
- Primary wins are from tighter image transform handling, leaner GROQ projections in hot paths, and reduced unnecessary hydration on the home page.
- No locale/deployment architecture was changed; no `/en/` runtime prefix model was reintroduced.

### Image improvements
- Added centralized `sanityImageUrl()` helper and applied it in content mapping and flexible section rendering.
- Standardized Sanity image responses toward modern formats + tuned quality.
- Preserved existing alt-text and fallback behavior.

### Video improvements
- Legacy `VideoEmbed` and `VideoSection` no longer contain eager iframe rendering; they now use click-to-load behavior through `VideoLiteEmbed`.
- Remaining eager iframe usage is limited to Google Maps embeds, left intentionally for now.

### Query improvements
- Added lightweight query variants for performer/program cross-linking use-cases.
- Reduced SEO query payload for slug-based metadata fetch.
- Avoided risky broad refactor of full dynamic page query shape.

### Hydration/client component findings
- Converted `Hero` and `LineupTeaser` to server components (no client hooks required).
- Major client-heavy interactive surfaces (e.g. animated nav/modal areas) kept unchanged due behavior risk.

### Animation/font findings
- Framer Motion footprint remains focused in interactive components; no broad animation removal done in this phase.
- Font loading remains via `next/font` (`display: swap`, subsets configured); no risky font pipeline changes were needed.

### Deferred work
- Next image optimizer re-enable verification on Netlify/Sanity.
- Full list/detail split for page-level slug-conditional GROQ projections.
- Optional map embed click-to-load strategy.
- Bundle analyzer script setup (if desired in a later phase).

### QA results
- `npm run lint`: ✅
- `npm run build`: ❌ failed in this Windows environment (`Next.js build worker exited with code 3221226505` / occasional `/_document` worker failure during page data collection)
- `npm run build:hu`: ❌ same worker crash (`3221226505`)
- `npm run typecheck`: ❌ script missing (`Missing script: "typecheck"`)
- bundle/analyze script: not available (`package.json` has no analyzer script)

### Manual checks still needed
- Verify image quality/size behavior on real HU/EN Netlify deploy previews.
- Verify cross-domain language switch behavior from navigation on both domains.
- Verify map embeds and video click-to-load behavior on mobile Safari/Chrome.

---

## Phase 2B-FIX Build Stabilization Summary

### Root cause assessment
- **No code-level router/page corruption was found.**
- `/_document` reference was investigated and no `pages/_document`, `next/document`, or `_document` import was found in source.
- The earlier failure pattern (`3221226505`, occasional `Cannot find module for page: /_document`) is consistent with **Windows/Next build-worker cache instability** in this workspace.
- After clean cache removal, builds completed successfully, which indicates the issue was most likely **environment/cache related**, not a deterministic Phase 2B regression.

### Clean build environment actions run
- Removed `.next`
- Removed `node_modules/.cache` (if present)
- Checked `.netlify` cleanup path (not present)
- No forced reinstall was needed

### Routing/page integrity checks
- Checked App Router core files:
  - `src/app/layout.tsx`
  - `src/app/page.tsx`
  - `src/app/oldal/[slug]/page.tsx`
  - `src/app/sitemap.ts`
  - `src/app/robots.ts`
- Checked special Next file usage:
  - No `pages/_document.*`
  - No `next/document` usage
- Conclusion: App Router structure is valid; no stale Pages Router artifact found.

### Phase 2B file isolation audit result
- Audited Phase 2B-modified files:
  - `src/sanity/lib/image.ts`
  - `src/sanity/lib/queries.ts`
  - `src/sanity/lib/content.ts`
  - `src/components/layout/FlexibleSections.tsx`
  - `src/components/home/Hero.tsx`
  - `src/components/home/LineupTeaser.tsx`
  - `src/components/home/VideoEmbed.tsx`
  - `src/components/home/VideoSection.tsx`
  - `src/components/home/Navbar.tsx`
- No server/client boundary violation found that would deterministically fail build.
- `Hero` and `LineupTeaser` server conversion remains valid (no hooks, no browser API, no client-only dependency requirement).
- `VideoLiteEmbed` client boundary usage from server components remains valid in App Router.
- `sanityImageUrl()` handles missing source safely (`undefined` guard path present).
- GROQ syntax in added lightweight queries is valid.

### QA commands and final results
- `npm run lint` ✅ pass
- `npm run build` ✅ pass (after cleanup)
  - note: webpack cache warnings still appeared (`PackFileCacheStrategy` ENOENT/UNKNOWN), but build completed
- `npm run build:hu` ✅ pass
- `npm run build:en` ✅ pass (re-run after one transient failure)
- `npm run typecheck` ❌ missing script (`Missing script: "typecheck"`)

### Remaining risks
- Windows-specific transient Next/webpack worker/cache instability may still reappear intermittently.
- Recommended verification remains:
  - one clean Linux/Netlify build confirmation,
  - optional WSL build check if local reproducibility is needed.

### Phase 3A readiness
- **Go** for Phase 3A from build-stability perspective.
- Continue with normal caution; if worker crash reappears, retry with clean `.next` before suspecting code regression.

## Phase 3A UI Polish Implementation Summary

### Files changed
- `src/app/info/page.tsx`
- `src/app/program/page.tsx`
- `src/components/lineup/LineupGrid.tsx`
- `src/app/szallas/page.tsx`
- `src/app/contact/page.tsx`
- `src/components/layout/PageBody.tsx`
- `src/components/common/RichText.tsx`
- `src/app/aszf/page.tsx`
- `src/app/adatvedelem/page.tsx`
- `src/components/layout/FlexibleSections.tsx`

### Visual areas improved
- **Ticket Info Page Redesign:** Converted the simple list of tickets inside a monolithic orange card into a premium, responsive card grid. Highlighted featured tickets with elegant accent borders. Wired each card with a purchase CTA button (falling back to the global ticket URL if no custom URL is defined).
- **Program / Event Cards:** Styled slot titles as visually primary and performer names as secondary. Redesigned the `<details>` / `<summary>` accordion dropdown block to look much cleaner, incorporating micro-animations and appropriate color highlights.
- **Performer Cards:** Wrapped the card image in a stateful `PerformerCardImage` component that handles load failures cleanly. Upgraded the no-image placeholder to a premium, glassmorphic musical-themed visual on the card's variant background gradient. Adjusted the background gradients using theme color tokens.
- **Accommodation Cards:** Standardized price font styling with a bold monospace look, cleaned up card description typography, and aligned the CTA purchase buttons neatly at the bottom.
- **Contact Page Cleanup:** Removed the duplicate partners/sponsors sections from the contact page (which are already present in the footer) to improve vertical flow, padding, and spacing.
- **Legal & Generic Rich Text Pages:** Adjusted the reading width container to `max-w-3xl` for optimal line length and comfortable long-form scanning. Aligned link colors to match the brand accents, and polished spacing in lists and blockquotes.
- **Flexible Sections Renderer:** Improved baseline visual styles for text boxes (using left border accent indicators and clean background tints), centered button segments, adjusted spacers, and standardized aspect ratios for images and gallery grids.

### Behavior preserved
- Locale build-time and domain architecture are kept exactly as chosen in Phase 1A.
- Fallback structures from Sanity content to code default values are preserved on all fields.
- Performance optimization features (lazy-loading, unoptimized image sizing transforms, click-to-load videos) remain active.
- Collapsible elements remain touch-friendly and accessible without hover-only dependency.

### Anything intentionally deferred
- Detailed layout refactoring of dynamic pages that could disrupt schema compatibility.
- Re-enabling Next.js built-in image optimization on Netlify build containers until end-to-end preview environments confirm loader compatibility.

### QA results (verified 2026-06-02, Cursor)
- `npm run lint` ✅ pass (no warnings/errors)
- `npx cross-env NODE_OPTIONS="--max-old-space-size=4096" npm run build` ✅ pass (~101s, 17 static routes)
- `npx cross-env NODE_OPTIONS="--max-old-space-size=4096" npm run build:hu` ✅ pass (~63s; transient Sanity `ConnectTimeoutError` logged during SSG but build completed with fallbacks)
- `npx cross-env NODE_OPTIONS="--max-old-space-size=4096" npm run build:en` ✅ pass (~63s)
- `npm run typecheck` ❌ script not defined in `package.json` (types still checked inside `next build`)

### Regression fix during verification
- `src/app/szallas/page.tsx`: invalid Tailwind class `px-4.5` replaced with `px-[18px]` on accommodation CTA buttons.

### Windows build note
- Prior failures (`3221226505`, `Array buffer allocation failed`, paging file errors) reproduced only with stale `.next` / low memory. After deleting `.next` and `node_modules/.cache`, full build matrix passed locally with `NODE_OPTIONS=--max-old-space-size=4096`. Treat worker crashes as environment/cache first; re-run clean before suspecting Phase 3A UI code.

### Phase 3A status
- **Complete** — UI polish delivered; performance guardrails from Phase 2B unchanged (`VideoLiteEmbed`, `sanityImageUrl`, no eager homepage iframes in reviewed paths).

### Remaining Phase 3B items
- ~~Phase 3B~~ → **Complete** (see summary below).

---

## Phase 3B Implementation Summary

**Scope:** Sanity Studio editor QA, content-admin checklist, domain/archive readiness, final release checklist, lineup card image-area background fix. No UI redesign, no locale architecture changes, no eager video iframes.

### Deliverables
| Deliverable | Location |
|-------------|----------|
| Content admin + release checklists | `JAZZ_SITE_CONTENT_ADMIN_CHECKLIST.md` |
| Development plan update | this file |
| Lineup image strip fix | `src/components/lineup/LineupGrid.tsx` |
| Sanity Studio UX (labels, descriptions, previews) | `src/sanity/schemaTypes/documents/*.ts`, `objects/seo.ts`, `objects/sectionVideo.ts` |

### Sanity Studio improvements (low-risk)
- **video:** Updated descriptions (click-to-load live); clearer thumbnail/enabled help text.
- **performer:** Hungarian document title; `cardBackgroundVariant` clarifies no-image-only use; richer list preview (active/featured/order); orderings.
- **programItem:** `detailsRich*` descriptions reflect accordion UI (no longer “future only”).
- **ticket:** `nameEn` optional for drafts; description fields document live jegykártya rendering.
- **seo:** Hungarian `noIndex` label + when-to-use description.
- **page:** Flexible sections description — renders on `/oldal/[slug]`, ÁSZF, Adatvédelem.
- **sectionVideo:** Click-to-load description aligned with frontend.

### Lineup card visual fix
- When a performer **has** a loadable image, the image wrapper background is `var(--color-cream-50)` (matches card body). Gradient `cardBackgroundVariant` applies only when there is **no** image or load error (placeholder unchanged).

### Content admin checklist highlights
- Practical HU instructions for videos, performers, program, accommodation, tickets, pages, flexible sections, noIndex, navigation, missing EN content.
- Netlify two-site env table (`HU_PRODUCTION_DOMAIN` / `EN_PRODUCTION_DOMAIN` placeholders).
- Archive subdomain strategy (2016–2025 outside CMS).
- Final release smoke-test checklist (HU/EN, Sanity, SEO, tickets, video click-to-load, mobile).

### QA results (Phase 3B)
- `npm run lint` ✅ pass
- `npx cross-env NODE_OPTIONS="--max-old-space-size=4096" npm run build` ✅ pass
- `npx cross-env NODE_OPTIONS="--max-old-space-size=4096" npm run build:hu` ✅ pass
- `npx cross-env NODE_OPTIONS="--max-old-space-size=4096" npm run build:en` ✅ pass
- `npm run typecheck` ❌ script not defined (types checked in `next build`)

### Post-launch enhancements (deferred)
- Full EN content migration / copy review across all documents.
- Netlify production domain cutover + Search Console / analytics verification.
- Archive subdomain DNS + year-path 301 redirects in `netlify.toml`.
- Re-enable Next.js image optimization on Netlify when loader verified end-to-end.
- Optional `npm run typecheck` script in `package.json`.
- Bundle analyze script / CI gate if bundle size becomes a concern.
- Deeper GROQ split for detail pages (Phase 2B deferred items).
- Footer/menu link to archive when URL confirmed.

### Phase 3B status
- **Complete**

---

## Correction Note — Ticket / Program / Camp Slug

- Ticket info section on `src/app/info/page.tsx` changed from large card grid back to compact list/table-style rows.
- Removed the large ticket-section heading treatment and the large top CTA from the ticket list block.
- Sanity per-ticket behavior preserved in compact rows:
  - row title/price/description from Sanity,
  - `isHidden` respected (hidden items not rendered),
  - `isAvailable` respected (no misleading buy action when unavailable),
  - sort/order preserved from query,
  - per-row link chain uses `ctaUrl` first, then ticket-level locale URL, then global fallback URL.
- Program schedule on `src/app/program/page.tsx` compacted:
  - wider 2-column desktop layout (instead of 4 narrow day columns),
  - collapsed row shows only time range + title + stage badge + small chevron,
  - large “Részletek” label/button removed,
  - performers/details/description/ticket link moved to expanded content.
- End time display corrected to time range in the same position as start time (`16:30-17:45`), no duration label.
- Jazz Camp route correction implemented:
  - canonical/live route is `/jazztabor/`,
  - legacy `/tabor` redirects to `/jazztabor` (308/permanent behavior),
  - internal fallback links updated to `/jazztabor/`,
  - sitemap core route updated to `/jazztabor/`.
- CMS note: for full editorial consistency, the Sanity camp `page.slug` should be migrated from `tabor` to `jazztabor`; frontend currently keeps backward-compatible fallback to legacy slug.

### QA results (correction)
- `npm run lint` ✅ pass
- `npx cross-env NODE_OPTIONS="--max-old-space-size=4096" npm run build` ✅ pass
- `npx cross-env NODE_OPTIONS="--max-old-space-size=4096" npm run build:hu` ✅ pass
- `npx cross-env NODE_OPTIONS="--max-old-space-size=4096" npm run build:en` ✅ pass

---

## Phase 3B — CMS consolidation, routing fixes, and responsive program controls

> **Status:** AUDIT + PLAN ONLY — no code written. Authored 2026-06-03 (Claude).
> **Scope:** the owner's 14 reported issues after Phase 3A (CMS/editor confusion, jazztabor slug, program layout & controls, performer/contact layout, hidden-page 404s, locale availability, EN language-switch target, rich-text color).
> **Naming clash note:** an earlier "## Phase 3B Implementation Summary" (release prep + CMS QA) already exists above. That was a *different* 3B (Cursor's release-prep pass). **This** section supersedes it as the active Phase 3B plan. Do not treat the earlier summary as the spec for the work below.

### 0. How to read this section
- §A = master issue→fix table.
- §B = proposed Sanity consolidation model (one editor per logical page).
- §C = routing rules (hidden/noindex/inactive/locale).
- §D = program page controls (table/text show-hide, ordering, mobile day nav, wider layout, time range).
- §E = per-issue audit detail (sources verified in code, with file:line anchors).
- §F = **Do not implement yet** warning.
- §G = recommended implementation order (3B-1 … 3B-5).

---

### A) Issue → source → files → fix → risk → phase

| # | Issue | Current suspected source (verified) | Files / schemas to inspect or change | Recommended fix | Risk | Phase |
|---|---|---|---|---|---|---|
| 1 | Home editing confusing | Home text = static `c.home.*`/`c.meta.*` ([content/hu.ts](src/content/hu.ts)); home video = `video` docs filtered by `displayOnPages includes "home"` ([content.ts:212-257](src/sanity/lib/content.ts#L212), [page.tsx:52-144](src/app/page.tsx#L52)); **`video` has no Studio menu entry** ([deskStructure.ts](src/sanity/deskStructure.ts)); `page` doc slug `home` only feeds SEO (hero/body hidden for home) | [deskStructure.ts](src/sanity/deskStructure.ts), [page.tsx](src/app/page.tsx), [video.ts](src/sanity/schemaTypes/documents/video.ts), new `homePage` singleton | Define ONE "Főoldal" editor (singleton or repurposed `home` page doc) holding: home video ref, ticket-teaser selection, hero/CTA overrides. Add **🎬 Videók** to deskStructure so the home video is findable. | Med | 3B-2 |
| 2 | Duplicate editors for same page | `page` docs reachable BOTH via "📄 Oldalak (Pages)" AND via dedicated "⚡ Jazztábor"/"⚡ Futás" filtered shortcuts → same doc, two entry points ([deskStructure.ts:38-59](src/sanity/deskStructure.ts#L38)). Contact split across 3 sources (see #9). No true duplicate *documents* found. | [deskStructure.ts](src/sanity/deskStructure.ts), [content.ts](src/sanity/lib/content.ts) | Group fixed pages under one "Fix oldalak" folder, **one labelled entry per logical page**; keep generic Pages list only for new dynamic pages. Mark shortcuts clearly or remove. No data merge needed (same docs). | Low | 3B-2 |
| 3 | Jazz Camp slug | Route `/jazztabor` live; `/tabor`→`/jazztabor` redirect in BOTH [middleware.ts:39-43](src/middleware.ts#L39) and [tabor/page.tsx](src/app/tabor/page.tsx); nav/sitemap map `tabor`→`/jazztabor/`; frontend reads jazztabor-then-tabor ([jazztabor/page.tsx:12-16](src/app/jazztabor/page.tsx#L12)). **Sanity doc slug still `tabor`**; ALL `camp*` fields `hidden` unless `slug==="tabor"` ([page.ts:21,216…](src/sanity/schemaTypes/documents/page.ts#L21)) → renaming slug today HIDES the camp fields. | [page.ts](src/sanity/schemaTypes/documents/page.ts), [deskStructure.ts:42-49](src/sanity/deskStructure.ts#L42), [content.ts:921](src/sanity/lib/content.ts#L921), [queries.ts](src/sanity/lib/queries.ts) | Make schema accept slug `tabor` **or** `jazztabor` for all `camp*` `hidden`/overlay checks FIRST; then migrate doc slug; keep `/tabor` redirect. | Med | 3B-2 |
| 4 | Program too narrow/long | `grid grid-cols-2 … xl:grid-cols-4` ([program/page.tsx:86](src/app/program/page.tsx#L86)) → 2 cols on mobile, 4 narrow cols desktop | [program/page.tsx](src/app/program/page.tsx) | `grid-cols-1 md:grid-cols-2 xl:grid-cols-3` (wider cards; 1/day on mobile). Keep accordion. | Low | 3B-3 |
| 5 | Two program formats, no per-device control | Single `programDisplayMode` (structured/freeText/both) on `page` slug=program ([page.ts:146-176](src/sanity/schemaTypes/documents/page.ts#L146)); frontend [program/page.tsx:211-227](src/app/program/page.tsx#L211) | [page.ts](src/sanity/schemaTypes/documents/page.ts), [content.ts:512-635](src/sanity/lib/content.ts#L512), [program/page.tsx](src/app/program/page.tsx), [queries.ts:163](src/sanity/lib/queries.ts#L163) | Add 6 fields (see §D); render both blocks always, toggle/ order via responsive CSS. Keep `programDisplayMode` as backward-compat fallback. | Med | 3B-3 |
| 6 | Mobile day navigation | None today (static grid) | [program/page.tsx](src/app/program/page.tsx) (new small client/anchor helper) | Per-day prev/next anchor links (`#day-<n>`), mobile-only, first=next-only, last=prev-only, `aria-label`, CSS `scroll-behavior:smooth`. No new dep. | Low | 3B-3 |
| 7 | Time display | **Already mostly done** — `formatTimeRange` shows `start-end` ([program/page.tsx:36-40,122](src/app/program/page.tsx#L36)); `duration` still computed ([content.ts:498-503,596](src/sanity/lib/content.ts#L498)) but not displayed | [program/page.tsx](src/app/program/page.tsx), [content.ts](src/sanity/lib/content.ts) | Switch hyphen `-` → en-dash `–` to match `16:30–17:45`; later drop unused `duration` from type. | Low | 3B-3 |
| 8 | Performer card actions | Card is `flex flex-col`, body `flex-1 flex-col` but links row + "Részletek" use `mt-4` (not `mt-auto`) → sit under short text ([LineupGrid.tsx:203-307](src/components/lineup/LineupGrid.tsx#L203)) | [LineupGrid.tsx](src/components/lineup/LineupGrid.tsx) | Wrap links+actions in a `mt-auto` footer block so they pin to card bottom. Preserve ticket URL, fallback, no-image bg, `cardBackgroundVariant`, modal. | Low | 3B-4 |
| 9 | Contact layout messy | 3 sources: `siteSettings` (email/phone/volunteer/socials/org) + static `c.contact` (address, press*, subtitle) + `page` slug=contact (heroTitle/body) ([content.ts:817-844](src/sanity/lib/content.ts#L817), [contact/page.tsx](src/app/contact/page.tsx)). Right column header says "Sajtó + támogatók" but supporters already removed. | [contact/page.tsx](src/app/contact/page.tsx), [siteSettings.ts](src/sanity/schemaTypes/documents/siteSettings.ts), [content.ts:817](src/sanity/lib/content.ts#L817) | Consolidate editable fields into `siteSettings` (add address, press title/text/email); restructure into: main contact card, press/accreditation card, volunteer CTA, socials. No sponsors block. | Med | 3B-4 |
| 10 | Hidden pages 404 | Dynamic route renders any active page; `dynamicParams` defaults true; `getActivePageBySlugQuery` requires `isActive==true` ([oldal/[slug]/page.tsx](src/app/oldal/[slug]/page.tsx), [queries.ts:147](src/sanity/lib/queries.ts#L147)). Hidden-from-nav already renders. Likely real causes: slug in `FIX_SLUGS` collision, `isActive` unchecked, or build-time-only static list. | [oldal/[slug]/page.tsx](src/app/oldal/[slug]/page.tsx), [content.ts:937-959](src/sanity/lib/content.ts#L937) | Add explicit `export const dynamicParams = true`; confirm `notFound()` only on `!found`/inactive; document the rule (§C). Repro with a concrete hidden slug before changing logic. | Low | 3B-1 |
| 11 | Locale-specific availability | **No locale filter anywhere.** `localized()` falls back EN→HU ([content.ts:470-472](src/sanity/lib/content.ts#L470)); nav shows HU label in EN build; HU-only pages render in EN build; `generateStaticParams`/sitemap are locale-agnostic | [content.ts](src/sanity/lib/content.ts) (nav/page/slugs), [queries.ts](src/sanity/lib/queries.ts), [sitemap.ts](src/app/sitemap.ts), [oldal/[slug]/page.tsx](src/app/oldal/[slug]/page.tsx) | Define `availableInLocale` rule (§C); apply to nav (hide if no EN label), sitemap, dynamic render, static params. Strict for nav, lenient-with-flag for body. | Med-High | 3B-1 |
| 12 | EN link before final domains | `SITE_URL_EN` defaults to `https://jazzcapital.hu` (not live) ([seo.ts:11-13](src/lib/seo.ts#L11)); `languageSwitchHref`/`getLanguageSwitchUrl` use it ([languageSwitch.ts](src/lib/languageSwitch.ts), [seo.ts:32-48](src/lib/seo.ts#L32)). `.env.local.example` points at netlify URLs; `__PEER_LOCALE_URL__` runtime override exists ([LocaleSwitchAnchor.tsx](src/components/layout/LocaleSwitchAnchor.tsx)) | [seo.ts](src/lib/seo.ts), Netlify env, [.env.local.example](.env.local.example) | Set `NEXT_PUBLIC_SITE_URL_EN` to the **EN Netlify URL** now (not the dead domain); document required go-live vars. Optionally make default fallback the EN netlify site. | Low | 3B-1 |
| 13 | Home ticket section not editable | `TicketBoxes` = 3 hardcoded cards (labels/subs in code), href=`getTicketUrlWithFallback` (siteSettings) + one hardcoded `passUrl` ([TicketBoxes.tsx:30-42](src/components/home/TicketBoxes.tsx#L30)). `ticket` docs only used on /info. | [TicketBoxes.tsx](src/components/home/TicketBoxes.tsx), [ticket.ts](src/sanity/schemaTypes/documents/ticket.ts), [page.tsx:147](src/app/page.tsx#L147) | Drive teaser from `ticket` docs; add `showOnHome`/`orderOnHome` to `ticket`; keep per-ticket URLs. Static labels become fallback. | Med | 3B-2 |
| 14 | Rich-text color | `richText` already has `fontSize`, `fontFamily`, `callout` (info/important/price) marks — **no text-color mark** ([richText.ts](src/sanity/schemaTypes/objects/richText.ts), [RichText.tsx:73-118](src/components/common/RichText.tsx#L73)) | [richText.ts](src/sanity/schemaTypes/objects/richText.ts), [RichText.tsx](src/components/common/RichText.tsx) | Add **predefined** color decorators (e.g. `accent`,`teal`,`muted`) mapped to brand tokens — NOT a free color picker. Optional, non-blocking. | Low | 3B-5 (opt) |

---

### B) Proposed Sanity consolidation model — one editor per logical page

**Principle:** every logical page has exactly **one** primary editor; global documents (tickets, videos, performers, program items, sponsors) are *referenced/queried*, never re-edited per page. The Studio left menu should read like the site map.

**Per-logical-page editors:**

| Logical page | Single editor | Holds (page-specific) | Pulls from global docs |
|---|---|---|---|
| Főoldal (home) | **`homePage` singleton** (or repurposed `page` slug=home) | hero/CTA text overrides, home video ref, ticket-teaser selection, SEO | `video`, `ticket`, `performer`, `siteSettings` |
| Program | `page` slug=program | title, hero desc, free-text body, **6 new show/order controls**, `programDisplayMode` (compat) | `programItem`, `stage` |
| Fellépők (lineup) | `page` slug=lineup (SEO/title) | SEO only | `performer` |
| Jegyek & Infó (info) | `page` slug=info | hero, FAQ, footer note, flexible sections | `ticket`, `venue` |
| Jazztábor | `page` slug=**jazztabor** (migrated from `tabor`) | eyebrow, schedule blocks, supporters, CTA, body | — |
| Futás | `page` slug=futas | banner, cards, distance rows, CTA, body | — |
| Szállás | `page` slug=szallas | intro note, SEO | `accommodation` |
| Térkép | `page` slug=terkep | intro note, SEO | `venue`, `transportItem` |
| Kapcsolat | **`siteSettings`** (consolidated) + `page` slug=contact (hero/body only) | address, email, phone, press*, volunteer, socials, org | — |
| ÁSZF / Adatvédelem | `page` slug=aszf / adatvedelem | body, SEO, flexible sections | — |
| New info pages | `page` slug=<x> → `/oldal/<x>` | hero, body, flexible sections, SEO | — |

**How globals connect (no duplicate editors):**
- **Tickets:** one `ticket` doc list. /info renders all visible; home renders `showOnHome` subset (new). Per-ticket URLs stay on the ticket doc.
- **Videos:** one `video` doc list (add to deskStructure). `displayOnPages` reference decides placement (home already filters on it).
- **Performers / Program / Sponsors:** already single-list globals; pages only reference.

**Avoiding duplicate editors:**
- Collapse the "⚡ Jazztábor"/"⚡ Futás" shortcuts into a single **"Fix oldalak"** folder with one labelled child per logical page (filtered single-doc views), so each page has exactly one obvious door.
- Keep "📄 Oldalak (Pages)" for *new* dynamic pages only (or rename "Új információs oldalak").
- Contact: stop splitting across static code + siteSettings + page — move all editable contact values to `siteSettings`.

---

### C) Routing rules (target behaviour)

1. **Active + has content → always renders**, even if hidden from navbar. Hidden-from-nav is purely a `navigationItem` concern; it must never cause 404. (Today this already holds for the dynamic route — formalise with `export const dynamicParams = true` and a doc comment.)
2. **noindex pages render normally** but are excluded from indexing/sitemap: `seo.noIndex` already emits robots meta and already filters the sitemap ([sitemap.ts:78](src/app/sitemap.ts#L78), `getSitemapPagesQuery`). noIndex must NOT 404.
3. **Inactive/unpublished pages may 404** — `getActivePageBySlugQuery` requires `isActive==true`; dynamic route `notFound()` when `!found`. Keep.
4. **Locale availability rule (new, issue #11).** Define a page/nav-item as *available in a locale* when:
   - **EN available** iff `titleEn` non-empty **OR** `pageBodyRichEn`/locale-EN sections have content.
   - **HU available** iff `titleHu` non-empty **OR** `pageBodyRichHu`/HU sections have content.
   - **Both present → appears in both builds.**
   Apply consistently to: **navigation** (hide nav item if no current-locale label — change the EN-falls-back-to-HU behaviour in `localized()`/`buildNavItem` for nav only), **sitemap** (skip slugs lacking current-locale content), **dynamic render** (optionally `notFound()` if the page has no current-locale content, or render an explicit empty-state), and **`generateStaticParams`** (filter per build locale). Keep it simple: a single `hasLocaleContent(page, locale)` helper used everywhere. Preserve the build-time two-domain architecture (no runtime `/en`).

---

### D) Program page controls

**New Sanity fields on `page` slug=program** (additive; keep `programDisplayMode` as fallback). Names follow existing camelCase + HU/EN-pair style:

- `showProgramTableDesktop` (boolean, default true)
- `showProgramTableMobile` (boolean, default true)
- `showProgramTextDesktop` (boolean, default false)
- `showProgramTextMobile` (boolean, default false)
- `desktopProgramOrder` (string list: `tableFirst` | `textFirst`, default `tableFirst`)
- `mobileProgramOrder` (string list: `tableFirst` | `textFirst`, default `tableFirst`)

**Frontend behaviour:**
- Render **both** the structured table and the free-text block when their data exists; control visibility per breakpoint with Tailwind (`hidden`/`md:block`/`md:hidden`) instead of removing from the DOM, so SSR stays deterministic.
- Ordering via fl/grid `order-*` utilities switched at `md`.
- Backward compat: if the new booleans are all unset, fall back to current `programDisplayMode` logic so existing content is unaffected.

**Wider desktop layout (issue #4):** change the day grid from `grid-cols-2 … xl:grid-cols-4` to **`grid-cols-1 md:grid-cols-2 xl:grid-cols-3`** — one day per row on mobile, roomier cards on desktop. Keep the compact `<details>` accordion.

**Mobile day navigation (issue #6):**
- Give each `<section>` an `id="program-day-<idx>"`.
- Add a mobile-only footer in each day panel with prev/next **anchor links** (`<a href="#program-day-N">`): first day → next only, last day → prev only.
- `aria-label` like "Ugrás a következő naphoz: <label>"; rely on CSS `scroll-behavior:smooth` (guarded by `prefers-reduced-motion`). No JS library.

**Time range (issue #7):** display `16:30–17:45` (en-dash) when `endTime` present, else start only; never a duration label. Mostly implemented — just swap the separator and stop computing `duration` for display.

---

### E) Per-issue audit detail (verified)

**1 & 13 — Home sources.** Hero/InfoBar/Stats/CTA text come from static `c.home.*`/`c.meta.*`; `siteSettings` is NOT consulted on the home page. The home **video** comes from `video` documents (`getEnabledVideosWithFallback`, filtered by `displayOnPages` containing `"home"`), falling back to `BASE.videoUrl`. Critically, **`video` is absent from `deskStructure`**, so the owner has no menu to reach it — this is the single biggest cause of "can't find where to edit the home video." The home **ticket section** (`TicketBoxes`) is fully hardcoded (3 cards, labels + one `passUrl` in code; only the day/VIP href is dynamic via `siteSettings.ticketUrl*`). The `page` doc with slug `home` exists but hides hero/body (only SEO), so opening it looks empty/confusing.

**2 — Duplicate editors.** No duplicate *documents*. The confusion is two Studio doors to the same `page` doc (generic Pages list + the ⚡ shortcuts) and the 3-way contact split. Consolidation is menu-level + contact-fields-level, so **no data migration/merge is required for #2 itself** (except contact, see #9).

**3 — jazztabor.** Redirect is doubly safe (middleware + page). The trap: schema `hidden` predicates and the deskStructure filter are pinned to `slug=="tabor"`; the content overlay accepts `"tabor"||"jazztabor"` ([content.ts:921](src/sanity/lib/content.ts#L921)) but the *schema* does not, so a premature slug rename would blank the camp editor UI. Fix schema predicates first, then migrate the slug value, preserving content and the static `c.camp.videoUrl` video behaviour.

**4-7 — Program.** Layout grid, single display mode, no mobile day nav, time-range already implemented (hyphen vs en-dash only). See §D.

**8 — Performer card.** `flex flex-col` card with `flex-1` body is correct scaffolding; only the actions lack `mt-auto`. Minimal change, no behavioural risk to ticket URL/fallback/modal.

**9 — Contact.** Editable today: organizer, email, phone, volunteer label/url, socials (siteSettings). **Not editable:** address, press title/text/email, subtitle (static `c.contact`). Layout is a 2-col grid; right column has only the press card. Recommend moving address + press into `siteSettings` and tightening the layout.

**10 — Hidden 404.** Mechanically, active hidden pages already render (dynamic route + `dynamicParams` default true + ISR 30s). Before changing code, reproduce with one concrete hidden slug; the most probable real causes are (a) `isActive` unchecked, (b) a slug accidentally inside `FIX_SLUGS`, or (c) expecting it during a stale static export. Formalise the rule and add `dynamicParams = true` explicitly.

**11 — Locale availability.** Currently nothing filters by locale; `localized()` silently falls back EN→HU, so EN builds surface HU-only nav labels and pages. Needs the `hasLocaleContent` rule in §C.

**12 — EN switch.** Two code paths (`Navbar` via `languageSwitchHref`, `Header` via `c.otherLocale.domain` = `getLanguageSwitchUrl()`), both ultimately resolving to `SITE_URL_EN`, which **defaults to the not-yet-live `jazzcapital.hu`**. Until go-live, set `NEXT_PUBLIC_SITE_URL_EN` to the EN Netlify URL (or use the `__PEER_LOCALE_URL__` snippet). Document go-live vars: `NEXT_PUBLIC_SITE_URL_HU`, `NEXT_PUBLIC_SITE_URL_EN`, optional `NEXT_PUBLIC_LOCALE`, optional `NEXT_PUBLIC_LANGUAGE_SWITCH_URL`.

**14 — Rich-text color.** `fontSize`/`fontFamily`/`callout` already exist and render. Recommend predefined color decorators tied to brand tokens over an arbitrary picker (consistency + safety). Optional.

---

### F) ⚠️ Do not implement yet

**Do not start coding until the owner approves this consolidation plan.** Several items require schema migration or careful data merging where a wrong order loses editor access to existing content:
- **#3 jazztabor slug** — schema predicates must be widened BEFORE the doc slug is renamed, or the camp fields vanish from Studio.
- **#9 contact** — moving address/press into `siteSettings` is a field migration; current static values must be copied first, frontend kept reading the fallback until verified.
- **#1/#13 home + tickets** — adding `homePage`/`showOnHome` changes where content is authored; keep static fallbacks until Sanity is populated.
- **#11 locale availability** — changing nav/sitemap/render filtering can hide currently-visible pages if the rule is mis-scoped.
Every existing editable field and every existing data value must be preserved (additive-only, fallback-until-verified), per the project golden rules (§3, §10).

---

### G) Recommended implementation order

- **Phase 3B-1 — Audit-safe routing / availability / env (lowest risk, no migration):** formalise hidden-page rendering (`dynamicParams=true` + docs), locale-availability `hasLocaleContent` helper wired into nav/sitemap/render, and set the EN language-switch env so the EN button targets the EN site (issues #10, #11, #12).
- **Phase 3B-2 — Sanity editor consolidation + home editability:** add `video` (and ticket teaser) to deskStructure, one-editor-per-page menu, `homePage`/home fields, `showOnHome` tickets, and the jazztabor slug migration (schema-first) (issues #1, #2, #3, #13).
- **Phase 3B-3 — Program responsive controls & layout:** 6 show/order fields, wider grid, mobile day-nav arrows, en-dash time range (issues #4, #5, #6, #7).
- **Phase 3B-4 — Performer & contact layout:** card actions to bottom; consolidated, cleaner contact (issues #8, #9).
- **Phase 3B-5 — QA + content-admin checklist update (+ optional rich-text colors):** run lint/build/build:hu/build:en, manual matrix (hidden page reachable, noindex meta, EN-only/HU-only pages, EN switch target, program toggles on mobile/desktop, performer card bottom-aligned, contact editable), update [JAZZ_SITE_CONTENT_ADMIN_CHECKLIST.md](JAZZ_SITE_CONTENT_ADMIN_CHECKLIST.md); optionally add predefined text-color marks (issue #14).

---

## Phase 3B-4 Implementation Summary

### Scope
Performer card bottom-alignment, contact page layout cleanup, ticket page compactness verification, and program page desktop grid fix (days side by side on desktop). No schema changes, no broad refactors, no locale changes.

### Files changed
- `src/components/lineup/LineupGrid.tsx`
- `src/app/contact/page.tsx`
- `src/app/program/page.tsx` (desktop grid fix added to 3B-3 work)
- `JAZZ_SITE_DEVELOPMENT_PLAN.md`

### Performer card action alignment fix (LineupGrid.tsx)
**Problem:** social links and the "Részletek" CTA sat directly under the description text via `mt-4` margins, making cards with short descriptions look misaligned vs cards with longer text.

**Fix:** wrapped both the social links row and the bottom CTA bar inside a single `<div className="mt-auto">` container. `mt-auto` in a `flex flex-col` card body consumes all available remaining space and pushes the actions to the card's bottom edge. Cards in the same grid row (equal height via CSS grid stretch) now always have their links and CTA at a consistent baseline. All existing behaviour preserved: `cardBackgroundVariant`, no-image fallback, image error fallback, per-performer ticket URL, modal trigger.

### Contact page layout cleanup (contact/page.tsx)
**Problem:** the right column had a redundant `<section className="flex flex-col gap-6">` wrapper (originally intended for press + supporters, supporters were removed in Phase 3A). The wrapper added unnecessary nesting with no visual benefit.

**Fix:** removed the outer section wrapper; the press/accreditation card is now a direct `<section>` matching the structure of the left contact card. Added a thin accent stripe (`h-1.5`) at the top of the press card for visual consistency with the left card's treatment. Updated stale comment from "Sajtó + támogatók" to "Sajtó / Akkreditáció".

### Ticket page (info/page.tsx)
Already correct — compact orange list/table format with per-row Sanity links, `isAvailable`/`isHidden` respected, proper fallback chain (`tier.ctaUrl → ticketUrl`). No changes needed.

### Program page desktop grid fix (program/page.tsx)
**User feedback after 3B-3:** on desktop, days should appear side by side in one unified row, not in a 2-column grid.

**Change:** grid updated from `grid-cols-1 md:grid-cols-2` to `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`.

Behaviour per breakpoint:
- `xs/sm` (mobile): `grid-cols-1` — one day per row, mobile day-nav arrows visible
- `md` (tablet): `grid-cols-2` — two days per row, arrows hidden
- `lg+` (desktop): `grid-cols-4` — all days side by side in one row, arrows hidden

The mobile day-nav arrows remain `md:hidden`, so they only appear when days are stacked (single column).

### Windows build note
Default build failed once with `MODULE_NOT_FOUND` for contact page — this was a Windows build artifact cache race condition, not a code error. Clearing `.next` and `node_modules/.cache` resolved it. All three builds pass cleanly after full cache clear.

### Items deferred
- Contact full CMS consolidation (address/press fields to `siteSettings`) → post-launch
- Rich-text colour decorators → 3B-5 (optional)

### QA results (2026-06-03, Cursor)
- `npm run lint` ✅ pass
- `build:hu` (8 GB heap) ✅ pass — 18 routes
- `build:en` (8 GB heap) ✅ pass — 17 routes
- `build` default (8 GB heap, clean cache) ✅ pass — 18 routes
- Windows artifact cache issue documented; Netlify builds unaffected.

---

## Re-audit R1 + R2 Implementation Summary

> Implements the first two phases of `JAZZ_SITE_REAUDIT_AND_FIX_PLAN.md` after the strict re-audit found the earlier "READY" status overstated. R3/R4/R5 remain pending.

### Scope
- **R1:** root-level dynamic pages (`/<slug>`), `/oldal/<slug>` compatibility redirect, and **strict locale availability** at render.
- **R2:** page-local YouTube video field, replacing the confusing global-video editing flow for the homepage and jazztábor.
- Explicitly **not** done: R3 full homepage editor, R4 program desktop layout, R5 contact consolidation, deleting the global `video` document.

### Files changed
- `src/app/[slug]/page.tsx` (new — root dynamic route)
- `src/app/oldal/[slug]/page.tsx` (compat note + strict-locale parity check)
- `src/middleware.ts` (`/oldal/<slug>` → `/<slug>` 308 redirect)
- `src/sanity/schemaTypes/documents/page.ts` (`videoUrl`, `videoTitleHu/En`; slug help text)
- `src/sanity/lib/queries.ts` (`videoUrl`/`videoTitle*` in page query)
- `src/sanity/types.ts` (`SanityPage` video fields)
- `src/sanity/lib/content.ts` (`isPageAvailableInLocale` helper; `getPageContentBySlug` returns `videoUrl`, `videoTitle`, `availableInLocale`)
- `src/app/page.tsx` (homepage reads page-local `videoUrl` first)
- `src/app/jazztabor/page.tsx` (reads page-local `videoUrl`, falls back to `camp.videoUrl`)
- `src/sanity/deskStructure.ts` (home Page = SEO + video; global `video` marked secondary)
- `src/components/analytics/CookieBanner.tsx` (`<a>`→`<Link>` — required once a root `[slug]` route exists)

### R1 — routing behavior (verified by build)
- **Root-level pages:** an active page with slug `example` now renders at **`/example`**. `app/[slug]/page.tsx` resolves active Sanity pages; `FIX_SLUGS` (incl. `oldal`, `studio`) are excluded so fixed routes win (Next gives static segments priority over `[slug]`).
- **Compatibility:** `/oldal/<slug>` 308-redirects to `/<slug>` in middleware. The `/oldal/[slug]` route is kept as a safety net with the same rules.
- **Rendering rule (enforced):** active + locale-available + slug exists → render; active + `noIndex` → render (noIndex only affects metadata + sitemap); active + hidden-from-nav → render; inactive/unpublished → 404; **no current-locale content → 404 in that locale build**.
- **Strict locale:** new `isPageAvailableInLocale(page, locale)` = has `title`/`heroTitle`/`pageBody` in that locale. Applied to both dynamic routes and to `generateStaticParams`. **No silent HU→EN fallback** on dynamic page render. Build proof: `/[slug]` pre-generates `/tanarok` in HU/default but **nothing** in EN (the page has no `titleEn`).
- Fixed routes (`/program`, `/contact`, …) are unaffected — they keep their own static content and do **not** use the strict-locale gate.

### R2 — page-local video (verified)
- New `page.videoUrl` (url) + optional `videoTitleHu/En`. Help text: "Illeszd be ennek az oldalnak a YouTube videó linkjét."
- **Homepage:** reads `home` Page doc `videoUrl` first → falls back to legacy global `video` (displayOnPages=home) → static `c.home.videoUrl`. Rendered via `VideoLiteEmbed` (click-to-load).
- **Jazztábor:** reads its Page doc `videoUrl` first → falls back to hardcoded `camp.videoUrl`. (Previously **only** hardcoded — now editable.)
- **Generic `/<slug>` pages:** render their own `videoUrl` above the body.
- **Global `video` document + `sectionVideo`:** kept (not deleted), but relabeled secondary in deskStructure — only needed for flexible-section videos. The homepage video no longer requires the global collection.

### R3 + R4 implemented (2026-06-05)
- **R3** — Homepage editor on `home` Page: `homeHeroTitle*`, `homeHeroSubtitle*`, `homeHeroLead*`, `homePrimaryCta*`, `homeStats[]`, `homeCtaBanner*`; `getHomePageVisibleContent()`; Hero/StatsBar/CtaSection wired in `app/page.tsx`; static `hu.ts`/`en.ts` fallback when Sanity empty.
- **R4** — Program collapsed row: 4-column grid on `sm+` (`time | title | stage | chevron`), `formatTimeRange` (`16:30–17:45`); mobile stacking preserved; day panels unchanged (`lg:grid-cols-4`).

### Still pending (R5)
- **R5** — contact address/press into `siteSettings`; optional deletion of dead `VideoEmbed.tsx`/`VideoSection.tsx` and full deprecation of the global `video` doc.

### Known limitation
- The root `[slug]` route is a single URL segment, so a Sanity page slug containing a `/` cannot be served at root (it stays reachable via the encoded form / `/oldal/`). Recommend simple one-word slugs.

### QA results (2026-06-03)
- `npm run lint` ✅ pass
- `build:hu` (8 GB heap) ✅ pass — 19 routes (`/[slug]` → `/tanarok`)
- `build:en` (8 GB heap) ✅ pass — 17 routes (`/[slug]` → none; strict locale)
- `build` default (8 GB heap, clean cache) ✅ pass — 19 routes

---

## Phase 3B-3 Implementation Summary

### Scope
Program page responsive controls, layout improvements, mobile day navigation, and time-range display refinement. No UI redesign on other pages. No locale architecture changes. No field deletions.

### Files changed
- `src/sanity/schemaTypes/documents/page.ts`
- `src/sanity/lib/queries.ts`
- `src/sanity/types.ts`
- `src/lib/types.ts`
- `src/sanity/lib/content.ts`
- `src/app/program/page.tsx`
- `JAZZ_SITE_CONTENT_ADMIN_CHECKLIST.md`
- `JAZZ_SITE_DEVELOPMENT_PLAN.md`

### Sanity fields added (page.ts, slug=program only)
Six new boolean/string fields, all hidden unless `slug === "program"`:

| Field | Type | Default | Purpose |
|---|---|---|---|
| `showProgramTableDesktop` | boolean | `true` | Show structured schedule on desktop |
| `showProgramTableMobile` | boolean | `true` | Show structured schedule on mobile |
| `showProgramTextDesktop` | boolean | `true` | Show free-text program block on desktop |
| `showProgramTextMobile` | boolean | `true` | Show free-text program block on mobile |
| `desktopProgramOrder` | string (tableFirst/textFirst) | `tableFirst` | Block order on desktop |
| `mobileProgramOrder` | string (tableFirst/textFirst) | `tableFirst` | Block order on mobile |

Existing `programDisplayMode` and `programBodyRich*` fields are preserved and used as fallbacks.

### Backward-compatibility / fallback behaviour
When the new fields are not yet set (`undefined`), the program page falls back to the legacy `programDisplayMode` value:
- `"structured"` → table visible, text hidden
- `"freeText"` → text visible, table hidden
- `"both"` → both visible
- default → table visible, text visible if content exists

This means no existing Sanity documents change behaviour after this deploy.

### Responsive visibility and ordering (program/page.tsx)
The outer content wrapper uses `flex flex-col`. Each block (table, text) receives independent Tailwind classes computed server-side from the Sanity settings:

**Visibility classes** (full class-name literals for Tailwind JIT):
- Both visible on this breakpoint → no class (default block)
- Mobile hidden, desktop visible → `hidden md:block`
- Mobile visible, desktop hidden → `md:hidden`
- Hidden on both → `hidden`

**Order classes** (mobile + desktop responsive pair):
- `order-1` / `order-2` for mobile stacking
- `md:order-1` / `md:order-2` for desktop stacking
- All four class names appear as string literals in source so Tailwind JIT includes them

### Program grid / layout width
- **Before**: `grid-cols-2 gap-2 sm:gap-3 xl:grid-cols-4` — four narrow vertical columns on desktop
- **After**: `grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2` — one day per row on mobile, two wider columns on desktop

### Collapsed / expanded row behaviour
Collapsed row shows only: time range · event title · stage badge (hidden on smallest mobile, shown on sm+) · small chevron. The chevron rotates 180° when open. No performer names, no large "Részletek" label — already removed in the Phase 3A correction; this phase locks in the compact design.

Expanded details: stage badge (mobile-only repeat for context) · performer names · note/description · rich details · ticket purchase link.

### Time range display
- `formatTimeRange` renamed to `timeRange` for clarity
- Now uses en-dash `–` (U+2013): `16:30–17:45`
- If only start time exists: shows start time only
- End time never shown as a duration label

### Mobile day navigation arrows
Each day section gets `id="program-day-{idx}"`. A mobile-only (`md:hidden`) arrow group is placed inside the day header:
- First day: next arrow only → `#program-day-1`
- Middle days: prev + next arrows
- Last day: prev arrow only → `#program-day-{n-2}`
- Arrows are `<a href="#...">` anchor links — no JS, no dependency
- `aria-label`: HU = "Előző nap" / "Következő nap"; EN = "Previous day" / "Next day"
- Arrow colour inherits from the day accent; semi-transparent background circle

### Build notes
- TypeScript type checker requires ≥ 8 GB heap on this Windows machine (`NODE_OPTIONS=--max-old-space-size=8192`). The 4 GB limit triggers OOM during type checking.
- Netlify Linux builds are unaffected — they have sufficient memory by default.
- Changed `StructuredProgram` prop type from the complex `Awaited<ReturnType<typeof getProgramContent>>["days"]` inferred form to the concrete `ScheduleDay[]` from `@/lib/types` to reduce type-checker pressure.

### Items deferred
- Performer card bottom-aligned actions → 3B-4
- Contact layout cleanup → 3B-4
- Rich-text colour decorators → 3B-5 (optional)

### QA results (2026-06-03, Cursor)
- `npm run lint` ✅ pass (no warnings or errors)
- `build:hu` (8 GB heap) ✅ pass — 18 routes
- `build:en` (8 GB heap) ✅ pass — 17 routes
- `build` default (8 GB heap) ✅ pass — 18 routes
- Note: 4 GB heap insufficient on this Windows machine for the type-check pass; Netlify builds are unaffected.

---

## Phase 3B-2 Implementation Summary

### Scope
Sanity Studio editor consolidation and homepage editability. No UI redesign, no locale architecture changes, no data deletion.

### Files changed
- `src/sanity/deskStructure.ts`
- `src/sanity/schemaTypes/documents/ticket.ts`
- `src/sanity/lib/queries.ts`
- `src/sanity/types.ts`
- `src/sanity/lib/content.ts`
- `src/components/home/TicketBoxes.tsx`
- `JAZZ_SITE_CONTENT_ADMIN_CHECKLIST.md`
- `JAZZ_SITE_DEVELOPMENT_PLAN.md`

### Sanity Studio menu changes (deskStructure.ts)

**Before:** `video` document type was absent from the menu entirely — editors could not find or create video documents. Jazztábor shortcut only filtered `slug == "tabor"`.

**After:**
- New **🏠 Főoldal szerkesztés** group at the top: gives editors one clear place for homepage-related editing. Contains sub-items: Főoldal Page (SEO), Videók, Jegyek.
- **🎬 Videók** added as a top-level menu item in the content section.
- **🎟️ Jegyek** already existed; now also accessible from the homepage group.
- Jazztábor shortcut filter widened to `slug == "tabor" || slug == "jazztabor"` — works whether the doc has been renamed or not.
- Video and ticket appear in two places (homepage group + main list) — same documents, multiple access paths, no data duplication.

### How to edit videos now
1. Studio → **🎬 Videók** (or Főoldal szerkesztés → Videók)
2. Create/edit a video document with URL, thumbnail, size, enabled flag
3. To show on homepage: set `displayOnPages` reference to the `home` page document
4. Publish → appears within 30 seconds

### How homepage video editing works
Home page query filters `video` docs where `enabled == true` and `displayOnPages` contains a reference to the page with slug `"home"`. If no matching videos, falls back to `c.home.videoUrl` from static content. Multiple videos → only the first is shown on home.

### New ticket fields (ticket schema)
- **`showOnHome`** (boolean, default `false`): controls whether this ticket appears in the homepage orange ticket boxes.
- **`homeOrder`** (number, default `0`): sort order within the homepage boxes. Lower = left.
- `descriptionHu/En` (plain text) descriptions updated to clarify dual use: Info page fallback + homepage box subtitle.
- Preview updated to show `showOnHome` and availability status in the Studio list.

### How homepage ticket editing works
- `getHomeTicketsQuery`: fetches tickets with `showOnHome == true`, `isHidden != true`, `isAvailable == true`, ordered by `homeOrder` then `order`.
- `getHomeTicketsWithFallback(locale, globalFallbackUrl)` in `content.ts`: returns shaped `HomeTicketBox[]` (emoji, title, sub, href) mapped from Sanity tickets. Returns empty array if none configured.
- `TicketBoxes.tsx` rewritten: calls `getHomeTicketsWithFallback` first; if it returns boxes → uses them. If it returns empty → falls back to the original static 3 hardcoded boxes (Napijegy / Bérlet / VIP). Static fallback `passUrl` remains unchanged.
- Box `title` = `nameHu/En`; `sub` = `descriptionHu/En` plain text (or `price + currency` if description absent); `href` = `ctaUrl || ticketUrlHu/En || globalFallbackUrl`.
- Emoji cycles `["🎟️", "🎫", "⭐"]` by index — same visual as before.

### Duplicate editor findings and consolidation
- No true duplicate documents found — the ⚡ shortcuts and the generic Pages list open the same documents from different menu paths. This is intentional convenience, not a data issue.
- Contact content split (siteSettings + static code + page doc) remains. Full consolidation requires adding address/press fields to `siteSettings`, deferred to 3B-4.
- The Sanity Studio menu now has clear grouping; the homepage group reduces the most common confusion (where is the video / where are the tickets).

### Jazz Camp slug follow-up
- Phase 3B-1 widened all schema predicates to accept `tabor` OR `jazztabor`.
- Jazztabor shortcut in deskStructure now also matches `jazztabor` slug.
- Manual Sanity action (owner can do when ready): open the Jazztábor Page doc → change Slug field from `tabor` to `jazztabor` → Publish. The `/tabor` → `/jazztabor` redirect stays intact regardless.

### Items intentionally deferred
- Contact page full consolidation (address/press into siteSettings) → 3B-4.
- Locale-gated `notFound()` for dynamic pages with no current-locale content → 3B-2B/later.
- Program responsive controls → 3B-3.
- Performer card layout → 3B-4.
- Rich-text color decorators → 3B-5 (optional).

### Manual Sanity steps needed after this deploy
1. **Homepage videos:** create or edit a `video` document, set `displayOnPages` to the `home` page. → Homepage video section becomes CMS-driven.
2. **Homepage ticket boxes:** open existing ticket docs (Napijegy, Bérlet, VIP), set `showOnHome = true`, set `homeOrder`, fill in `descriptionHu` (short tagline). → Homepage boxes become Sanity-driven.
3. **Jazz Camp slug (optional, no urgency):** open the Jazztábor Page doc, change slug to `jazztabor`, Publish.

### QA results (2026-06-03, Cursor)
- `npm run lint` ✅ pass (no warnings or errors)
- `npx cross-env NODE_OPTIONS="--max-old-space-size=4096" npm run build` ✅ pass (18 static routes)
- `npx cross-env NODE_OPTIONS="--max-old-space-size=4096" npm run build:hu` ✅ pass (18 routes)
- `npx cross-env NODE_OPTIONS="--max-old-space-size=4096" npm run build:en` ✅ pass (17 routes)
- `npm run typecheck` ❌ script not defined (types checked inside `next build`)

---

## Phase 3B-1 Implementation Summary

### Files changed
- `src/sanity/schemaTypes/documents/page.ts`
- `src/app/oldal/[slug]/page.tsx`
- `src/sanity/lib/queries.ts`
- `src/sanity/lib/content.ts`
- `src/app/sitemap.ts`
- `src/lib/seo.ts`
- `JAZZ_SITE_DEVELOPMENT_PLAN.md`

### /jazztabor route behaviour
- Canonical route remains `/jazztabor/` (unchanged from Correction Note).
- `/tabor` still redirects permanently to `/jazztabor` via `middleware.ts` (unchanged).
- Internal links (`navHrefFromPageSlug`, sitemap `CORE_PATH_TO_SLUG`, `FIX_PAGE_SLUGS`) already map `tabor`→`/jazztabor/` (unchanged).
- `jazztabor/page.tsx` still attempts `getPageContentBySlug("jazztabor")` first, then falls back to `"tabor"` (unchanged).

### Sanity camp predicate fix
- Added `SLUG_CAMP_LEGACY = "tabor"`, `SLUG_JAZZTABOR = "jazztabor"`, and an `isCampSlug(s)` helper to `page.ts`.
- Replaced all 14 `hidden` predicate expressions that previously tested `=== SLUG_TABOR` or `!== SLUG_TABOR` with `isCampSlug()` / `!isCampSlug()`.
- Effect: whether the Sanity document slug is `"tabor"` (current) or `"jazztabor"` (future), all camp fields (`campEyebrow*`, `campScheduleBlocks`, `campSupporters`, `showSecondBody`, CTA buttons) remain visible in Studio. No data migration required.
- Removed unused `SLUG_TABOR` alias to keep lint clean.

### Hidden / noIndex page rendering rule
- Verified: `oldal/[slug]/page.tsx` calls `notFound()` only when `!page.found` (inactive or missing in Sanity). Nav visibility (`showInHeader`/`showInFooter`) never causes 404.
- Verified: `noIndex` only suppresses sitemap inclusion and robots meta — it never causes a page render to 404.
- Added `export const dynamicParams = true;` with explanatory comment to make this behaviour explicit and intentional.

### Locale availability filtering
- **Navigation (content.ts `buildNavItem`):** Changed from `localized()` fallback (which returned HU label in EN build when `labelEn` was absent) to **strict locale label**: EN build hides nav items without a `labelEn`; HU build hides items without a `labelHu`. This prevents HU-only nav items from silently appearing in the EN site.
- **Sitemap (sitemap.ts + getSitemapPagesQuery):** Added `hasHu`/`hasEn` boolean fields to the GROQ query (checking `defined(titleHu) && titleHu != ""` / same for EN). Dynamic pages without current-locale title are now excluded from the sitemap of the corresponding build.
- **Static params (oldal/[slug]/page.tsx):** Replaced `getAllActivePageSlugsQuery` (returned plain string array) with `getAllActivePageSlugsWithLocaleQuery` (returns `{slug, hasHu, hasEn}`). The EN build no longer pre-generates `/oldal/[slug]` pages that have no `titleEn`. The HU build no longer pre-generates pages with no `titleHu`. Build evidence: EN build generates 17 routes (0 dynamic `/oldal/` slugs); HU build generates 18 routes (1 dynamic `/oldal/` slug — the `tabor/tanarok` page that has `titleHu`).
- **Dynamic rendering (page-level):** Deliberately NOT changed in 3B-1 — pages remain accessible by direct URL even without current-locale content, showing the existing "no content yet" empty-state message. This avoids a `notFound()` that could affect pages currently relied on. Full locale-gating at render time is deferred to 3B-2.

### English language switch safety
- Changed hardcoded fallback values in `src/lib/seo.ts`:
  - `SITE_URL_HU`: `https://jazzfovaros.hu` → `https://bohemjazz.netlify.app`
  - `SITE_URL_EN`: `https://jazzcapital.hu` → `https://buhemjazzen.netlify.app`
- These defaults now match `.env.local.example` and the real Netlify staging URLs. Without any env vars, the language switch points to the live staging builds rather than the not-yet-live production domains.
- When `NEXT_PUBLIC_SITE_URL_EN` / `NEXT_PUBLIC_SITE_URL_HU` env vars ARE set (Netlify production builds, or local dev with `.env.local`), they override the defaults as before.
- The `NEXT_PUBLIC_LANGUAGE_SWITCH_URL` override and `window.__PEER_LOCALE_URL__` runtime override (LocaleSwitchAnchor) remain available for fine-grained control without a redeploy.
- Go-live action required: set both env vars to the final production domains on both Netlify sites.

### Items intentionally deferred
- Sanity Studio editor consolidation (one editor per logical page, new `homePage` singleton, video added to deskStructure) → 3B-2.
- jazztabor Sanity document slug rename (`tabor` → `jazztabor`) → 3B-2, after owner approves.
- Homepage ticket/video editability improvements (home page editor model) → 3B-2.
- Locale-gated `notFound()` for dynamic pages with no current-locale content → 3B-2.
- Program page layout/responsive controls → 3B-3.
- Performer card and contact layout improvements → 3B-4.
- Optional rich-text color decorators → 3B-5.

### QA results (2026-06-03, Cursor/Claude)
- `npm run lint` ✅ pass (no warnings or errors)
- `npx cross-env NODE_OPTIONS="--max-old-space-size=4096" npm run build` ✅ pass (18 static routes)
- `npx cross-env NODE_OPTIONS="--max-old-space-size=4096" npm run build:hu` ✅ pass (18 routes; 1 dynamic `/oldal/` slug pre-generated with HU content)
- `npx cross-env NODE_OPTIONS="--max-old-space-size=4096" npm run build:en` ✅ pass (17 routes; 0 dynamic `/oldal/` slugs pre-generated — locale filter working correctly)
- `npm run typecheck` ❌ script not defined (types checked inside `next build`)

---

## Status Log (append after each phase — keep newest on top)

| Date | Phase | Tool | Summary | Files touched |
|---|---|---|---|---|
| 2026-06-05 | /en local+staging locale mode | Cursor | Path-prefix locale for single-host testing: middleware rewrites `/en/*` (no Netlify redirect) when HU/EN SITE_URL share same origin; `getLocale()` reads `x-site-locale` header + `site-locale` cookie; `languageSwitchHref` returns `/en` ↔ `/` locally; two-domain mode when SITE_URL_HU/EN origins differ (production). Navbar internal links prefixed with `/en` on EN path. Removed `buhemjazzen` from `.env.example`. Lint ✅ build ✅ build:hu ✅ build:en ✅. | `src/lib/localeMode.ts`, `src/middleware.ts`, `src/lib/locale.ts`, `src/lib/languageSwitch.ts`, `src/lib/seo.ts`, `src/components/home/Navbar.tsx`, `.env.example`, `JAZZ_SITE_CONTENT_ADMIN_CHECKLIST.md`, `JAZZ_SITE_DEVELOPMENT_PLAN.md` |
| 2026-06-05 | Language switch URL fix (buhemjazzen → bohemjazz) | Claude | Corrected EN language switch: `buhemjazzen.netlify.app` does not exist; only `bohemjazz.netlify.app` (HU build) is live. (1) `seo.ts` EN fallback → `bohemjazz.netlify.app`; (2) `languageSwitch.ts` rewritten — when `NEXT_PUBLIC_SITE_URL_EN` is not set, returns same-origin `/en/path` (middleware redirects to staging on HU build); (3) `netlify.toml` — EN URL → `bohemjazz.netlify.app`, added `NEXT_PUBLIC_LOCALE=hu` (required since both SITE_URL_* are now identical; EN Netlify site must set `NEXT_PUBLIC_LOCALE=en` in its dashboard); (4) `.env.local` — EN URL commented out; (5) `.env.local.example`, `docs/NETLIFY.md`, `LocaleSwitchAnchor.tsx` comment, `JAZZ_SITE_LAUNCH_READINESS_CHECKLIST.md` updated. **Go-live:** create EN Netlify site; set `NEXT_PUBLIC_LOCALE=en` + real production domains in each site's Netlify dashboard. Lint ✅ build:default ✅ build:hu ✅ build:en ✅. | `src/lib/seo.ts`, `src/lib/languageSwitch.ts`, `netlify.toml`, `.env.local`, `.env.local.example`, `src/components/layout/LocaleSwitchAnchor.tsx`, `docs/NETLIFY.md`, `JAZZ_SITE_LAUNCH_READINESS_CHECKLIST.md`, `JAZZ_SITE_DEVELOPMENT_PLAN.md` |
| 2026-06-05 | Language switch staging fix | Claude | Fixed EN language switch pointing to `jazzcapital.hu` (not live) in local dev. Root cause: `.env.local` had `NEXT_PUBLIC_SITE_URL_EN=https://jazzcapital.hu`; `.env.example` had HU URL for EN. **Code logic was already correct** (`seo.ts` fallback → `buhemjazzen.netlify.app`; `netlify.toml` already sets correct staging URLs). Changes: `.env.local` EN URL → `https://buhemjazzen.netlify.app`; `.env.example` EN URL fixed; `seo.ts` comment rewritten with explicit GO-LIVE Netlify dashboard checklist. **Netlify staging note:** if the Netlify dashboard overrides `NEXT_PUBLIC_SITE_URL_EN` to a production domain on staging sites, remove/reset it — let `netlify.toml` value stand. **Go-live:** set both `NEXT_PUBLIC_SITE_URL_HU` + `NEXT_PUBLIC_SITE_URL_EN` to production domains in the Netlify dashboard on both sites. Lint ✅ build:default ✅ build:hu ✅ build:en ✅. | `.env.local`, `.env.example`, `src/lib/seo.ts`, `JAZZ_SITE_DEVELOPMENT_PLAN.md` |
| 2026-06-04 | Program desktop row layout fix | Claude | Fixed ugly text wrapping inside program schedule rows on desktop. Switched summary row from pure flex to a hybrid: flex on mobile (unchanged), CSS grid (`grid-template-columns: 5rem minmax(0,1fr) auto 1.25rem`) on sm+. Time column: `whitespace-nowrap`, no fixed flex width on sm+. Title: retains `min-w-0 flex-1` (flex-1 ignored in grid, min-w-0 respected). Stage badge: `whitespace-nowrap`, always renders an empty `<span>` placeholder when no stage so chevron stays in column 4. Chevron: `justify-self-end`. Overall day panels, mobile nav arrows, details toggle, and day card grid (lg:grid-cols-4) unchanged. Lint ✅ build:default ✅ build:hu ✅ build:en ✅ (8GB heap). | `src/app/program/page.tsx`, `JAZZ_SITE_DEVELOPMENT_PLAN.md` |
| 2026-06-03 | Re-audit R1+R2 Root pages + page-local video | Claude | R1: new root `/[slug]` route renders active Sanity pages by bare slug; `/oldal/<slug>` 308-redirects to `/<slug>`; strict locale availability (`isPageAvailableInLocale`) on both dynamic routes (HU-only 404 in EN, no silent fallback); noIndex still renders. R2: page-local `videoUrl`+`videoTitle*` on page doc; homepage + jazztábor read it (fallback to old behavior); global `video` doc marked secondary in deskStructure. Fixed CookieBanner `<a>`→`<Link>`. Lint + build/hu/en pass (8GB heap). | `src/app/[slug]/page.tsx`, `src/app/oldal/[slug]/page.tsx`, `src/middleware.ts`, `src/sanity/schemaTypes/documents/page.ts`, `src/sanity/lib/queries.ts`, `src/sanity/types.ts`, `src/sanity/lib/content.ts`, `src/app/page.tsx`, `src/app/jazztabor/page.tsx`, `src/sanity/deskStructure.ts`, `src/components/analytics/CookieBanner.tsx`, `JAZZ_SITE_REAUDIT_AND_FIX_PLAN.md`, `JAZZ_SITE_DEVELOPMENT_PLAN.md`, `JAZZ_SITE_CONTENT_ADMIN_CHECKLIST.md` |
| 2026-06-03 | 3B-5 Final launch readiness audit | Claude | Full code audit across all 3B phases: Sanity studio paths, frontend behavior (video/tickets/program/lineup/contact/legal), routing/SEO (jazztabor/redirects/sitemap/locale/noindex), performance (no eager iframes verified, sanityImageUrl in use). Lint ✅ build:hu ✅ build:en ✅ build:default ✅ (all 8GB heap). Created JAZZ_SITE_LAUNCH_READINESS_CHECKLIST.md with GO verdict + manual action items. | `JAZZ_SITE_LAUNCH_READINESS_CHECKLIST.md`, `JAZZ_SITE_DEVELOPMENT_PLAN.md` |
| 2026-06-03 | 3B-4 Performer card alignment + contact cleanup + program desktop grid | Cursor | Performer card actions (social links + CTA) pinned to card bottom via mt-auto wrapper; contact page right-column redundant wrapper removed, press card matches left card treatment; ticket page verified compact (no changes needed); program grid updated to lg:grid-cols-4 so all days appear side by side on desktop. Lint + all builds pass (8GB heap). | `src/components/lineup/LineupGrid.tsx`, `src/app/contact/page.tsx`, `src/app/program/page.tsx`, `JAZZ_SITE_DEVELOPMENT_PLAN.md` |
| 2026-06-03 | 3B-3 Program responsive controls + layout | Cursor | 6 new per-device show/order fields in page schema (slug=program); wired through GROQ query, SanityPage type, SiteContent type, getProgramContent; program/page.tsx rewritten: grid-cols-1/md:grid-cols-2 (wider, no 4-col), flex-col order+visibility responsive blocks, mobile-only prev/next day anchor arrows, en-dash time range (16:30–17:45), concrete ScheduleDay[] prop type. Build requires 8 GB heap on Windows; Netlify unaffected. | `src/sanity/schemaTypes/documents/page.ts`, `src/sanity/lib/queries.ts`, `src/sanity/types.ts`, `src/lib/types.ts`, `src/sanity/lib/content.ts`, `src/app/program/page.tsx`, `JAZZ_SITE_CONTENT_ADMIN_CHECKLIST.md`, `JAZZ_SITE_DEVELOPMENT_PLAN.md` |
| 2026-06-03 | 3B-2 CMS consolidation + homepage editability | Cursor | Added 🏠 Főoldal group + 🎬 Videók to deskStructure; fixed Jazztábor shortcut filter (tabor OR jazztabor); added `showOnHome`/`homeOrder` to ticket schema; `getHomeTicketsQuery`+`getHomeTicketsWithFallback` in content layer; `TicketBoxes` rewritten Sanity-driven with static fallback; admin checklist updated. Lint + build:default/hu/en all pass. | `src/sanity/deskStructure.ts`, `src/sanity/schemaTypes/documents/ticket.ts`, `src/sanity/lib/queries.ts`, `src/sanity/types.ts`, `src/sanity/lib/content.ts`, `src/components/home/TicketBoxes.tsx`, `JAZZ_SITE_CONTENT_ADMIN_CHECKLIST.md`, `JAZZ_SITE_DEVELOPMENT_PLAN.md` |
| 2026-06-03 | 3B-1 Routing / locale / EN switch | Cursor | Camp* schema predicates widened to accept `tabor` OR `jazztabor` via `isCampSlug()`; explicit `dynamicParams=true` on dynamic route; strict locale nav label (no EN→HU fallback in nav); sitemap and static params filtered by locale availability (`hasHu`/`hasEn` from Sanity titles); EN language switch defaults changed from dead production domains to live Netlify staging URLs. Lint + build:default/hu/en all pass. | `src/sanity/schemaTypes/documents/page.ts`, `src/app/oldal/[slug]/page.tsx`, `src/sanity/lib/queries.ts`, `src/sanity/lib/content.ts`, `src/app/sitemap.ts`, `src/lib/seo.ts`, `JAZZ_SITE_DEVELOPMENT_PLAN.md` |
| 2026-06-03 | 3B (new) Audit + plan | Claude | Deep audit of the owner's 14 post-3A issues (home/ticket editability, duplicate editors, jazztabor slug trap, program layout/controls/mobile day-nav/time-range, performer card actions, contact split, hidden-page 404 rule, locale availability, EN switch target, rich-text color). Added "Phase 3B — CMS consolidation, routing fixes, and responsive program controls" with issue→fix table, Sanity consolidation model, routing rules, program controls spec, do-not-implement warning, and 3B-1…3B-5 order. **No code changed.** | `JAZZ_SITE_DEVELOPMENT_PLAN.md` (this section) |
| 2026-06-02 | 3A correction + camp slug fix | Cursor | Reverted ticket cards to compact row list/table layout with per-row Sanity links and availability handling; compacted program rows with chevron-only details and start-end time range; switched camp route to `/jazztabor/` with legacy `/tabor` redirect and sitemap/internal link updates. | `src/app/info/page.tsx`, `src/app/program/page.tsx`, `src/lib/types.ts`, `src/sanity/lib/content.ts`, `src/app/jazztabor/page.tsx`, `src/app/tabor/page.tsx`, `src/middleware.ts`, `src/app/sitemap.ts`, `src/app/oldal/[slug]/page.tsx`, `src/content/hu.ts`, `src/content/en.ts`, `JAZZ_SITE_DEVELOPMENT_PLAN.md` |
| 2026-06-02 | 3B Release prep + CMS QA | Cursor | Content admin checklist (CMS, Netlify env, archive, release QA); Sanity Studio label/description/preview tweaks; lineup card image area uses cream-50 when image present (gradient only for no-image fallback). Lint + build matrix pass. | `JAZZ_SITE_CONTENT_ADMIN_CHECKLIST.md`, `JAZZ_SITE_DEVELOPMENT_PLAN.md`, `src/components/lineup/LineupGrid.tsx`, `src/sanity/schemaTypes/documents/video.ts`, `performer.ts`, `programItem.ts`, `ticket.ts`, `page.ts`, `objects/seo.ts`, `objects/sectionVideo.ts` |
| 2026-06-02 | 3A verification | Cursor | Re-ran full QA after clean cache: lint + build + build:hu + build:en all pass with 4GB heap; fixed invalid `px-4.5` on szállás CTA; documented Windows cache/memory retry guidance and transient Sanity timeout during HU build. Phase 3A marked complete. | `src/app/szallas/page.tsx`, `JAZZ_SITE_DEVELOPMENT_PLAN.md` |
| 2026-06-02 | 3A UI Polish | Antigravity | Redesigned the ticket info page to a responsive card grid, polished program and performer card visual hierarchies, integrated stateful image load fallbacks, cleaned up contact page layout, aligned legal page readable widths, and refined flexible section baseline components. | `src/app/info/page.tsx`, `src/app/program/page.tsx`, `src/components/lineup/LineupGrid.tsx`, `src/app/szallas/page.tsx`, `src/app/contact/page.tsx`, `src/components/layout/PageBody.tsx`, `src/components/common/RichText.tsx`, `src/app/aszf/page.tsx`, `src/app/adatvedelem/page.tsx`, `src/components/layout/FlexibleSections.tsx`, `JAZZ_SITE_DEVELOPMENT_PLAN.md` |
| 2026-06-02 | 2B-FIX Build stabilization | Cursor | Isolated previous Windows build-worker crash as likely cache/environment instability: no `_document` or App Router corruption found, Phase 2B files audited for server/client boundary issues, and full build matrix (`build`, `build:hu`, `build:en`) passed after clean cache removal. | `JAZZ_SITE_DEVELOPMENT_PLAN.md` |
| 2026-06-02 | 2B Performance optimization + cleanup | Cursor | Completed low-risk Phase 2B improvements: standardized Sanity image transforms (`auto=format`, quality tuning), reduced selected GROQ over-fetching via lightweight queries, converted non-interactive home components to server components, removed eager iframe code paths from legacy video components, and aligned nav language switch behavior with domain-based locale model. Documented deferred/risky optimizations and QA outcomes. | `src/sanity/lib/image.ts`, `src/sanity/lib/queries.ts`, `src/sanity/lib/content.ts`, `src/components/layout/FlexibleSections.tsx`, `src/components/home/Hero.tsx`, `src/components/home/LineupTeaser.tsx`, `src/components/home/VideoEmbed.tsx`, `src/components/home/VideoSection.tsx`, `src/components/home/Navbar.tsx`, `JAZZ_SITE_DEVELOPMENT_PLAN.md` |
| 2026-06-02 | 2A Frontend content wiring | Cursor | Wired Phase 1B CMS fields into frontend behavior with backward-compatible fallbacks: program title/details/ticket fallback chain, performer ticket URL + card background variants, accommodation rich body + CTA + clean price label, ticket descriptions/CTAs/featured hints, click-to-load video implementation, and additive flexible section renderer on dynamic/legal pages. Locale/deployment architecture unchanged. | `src/sanity/lib/queries.ts`, `src/sanity/lib/content.ts`, `src/sanity/types.ts`, `src/lib/types.ts`, `src/app/program/page.tsx`, `src/app/lineup/page.tsx`, `src/components/lineup/LineupGrid.tsx`, `src/app/szallas/page.tsx`, `src/app/info/page.tsx`, `src/app/page.tsx`, `src/app/tabor/page.tsx`, `src/app/oldal/[slug]/page.tsx`, `src/app/aszf/page.tsx`, `src/app/adatvedelem/page.tsx`, `src/components/common/VideoLiteEmbed.tsx`, `src/components/layout/FlexibleSections.tsx`, `JAZZ_SITE_DEVELOPMENT_PLAN.md` |
| 2026-06-02 | 1B Sanity schema foundation | Cursor | Added new `video` schema, flexible section object schema foundation, and backward-compatible field extensions for performer/programItem/accommodation/ticket/page; updated schema registry and minimal query/type preparation for future frontend rollout; no UI redesign or locale-architecture changes. | `src/sanity/schemaTypes/documents/video.ts`, `src/sanity/schemaTypes/objects/sectionRichText.ts`, `src/sanity/schemaTypes/objects/sectionTextBox.ts`, `src/sanity/schemaTypes/objects/sectionVideo.ts`, `src/sanity/schemaTypes/objects/sectionButton.ts`, `src/sanity/schemaTypes/objects/sectionImage.ts`, `src/sanity/schemaTypes/objects/sectionGallery.ts`, `src/sanity/schemaTypes/objects/sectionSpacer.ts`, `src/sanity/schemaTypes/documents/performer.ts`, `src/sanity/schemaTypes/documents/programItem.ts`, `src/sanity/schemaTypes/documents/accommodation.ts`, `src/sanity/schemaTypes/documents/ticket.ts`, `src/sanity/schemaTypes/documents/page.ts`, `src/sanity/schemaTypes/index.ts`, `src/sanity/lib/queries.ts`, `src/sanity/types.ts`, `JAZZ_SITE_DEVELOPMENT_PLAN.md` |
| 2026-06-02 | 1A Locale + SEO foundation | Cursor | Implemented two-domain build-time locale cleanup: removed runtime `/en` rewrite model from primary logic, added redirect-only legacy `/en` handling, switched locale resolution to build-time, rewrote sitemap to Sanity-driven single-locale generation with `noIndex` filtering, made robots environment-aware for staging noindex, fixed `adatvedelem` fixed-slug inconsistencies in both nav/content and dynamic-route exclusion sets. | `src/lib/locale.ts`, `src/middleware.ts`, `src/lib/seo.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/sanity/lib/queries.ts`, `src/sanity/lib/content.ts`, `src/app/oldal/[slug]/page.tsx`, `JAZZ_SITE_DEVELOPMENT_PLAN.md` |
| 2026-06-02 | 0 Audit | Claude | Phase 0 audit complete. Identified critical locale architecture conflict (build-time vs runtime), verified noIndex emission works, found sitemap/robots issues, mapped all Sanity schemas, identified missing fields, found performance risks (eager video iframes, no Next/Image, GROQ over-fetching), verified dynamic routing works correctly. No code changed. | `JAZZ_SITE_DEVELOPMENT_PLAN.md` (updated) |
| 2026-06-02 | — | Claude | Plan created from repo audit. Verified stack (Next 15 App Router, Sanity v4, Netlify two-site build-time locale), schemas, SEO object, hardcoded sitemap, `images.unoptimized`, locale-model tension. No code changed. | `JAZZ_SITE_DEVELOPMENT_PLAN.md` (new) |
