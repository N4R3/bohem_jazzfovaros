# Sanity Full Audit — Bohém JAZZFŐVÁROS

> Generated after complete read of all page components, schemas, content files,
> and shared library modules.

---

## 1. Architecture Overview

| Layer | Implementation |
|---|---|
| Framework | Next.js App Router (server components, `async`/`await`) |
| CMS | Sanity v3 with ISR (`revalidate: 30`) |
| Locale | HU default domain / EN sub-domain; detected via `getLocale()` from headers |
| Static fallback | `src/content/hu.ts` + `src/content/en.ts` (always in bundle) |
| Styling | TailwindCSS + CSS variables (`--color-*`) + inline `style={}` for brand colours |
| Fonts | Bebas Neue (display), Poppins (body), Pacifico (accent) via `next/font/google` |

---

## 2. Content Flow (per request)

```
Request hits Next.js route
  └─ getLocale()              → "hu" | "en"  (from request headers / domain)
  └─ getContent()             → SiteContent  (hu.ts or en.ts static bundle)
  └─ Sanity fetch (ISR 30s)   → overrides specific fields if document exists
  └─ Component renders        → Sanity data first, static fallback second
```

**Key rule:** Every Sanity field has a hard-coded fallback in `src/content/{hu|en}.ts`.
If Sanity is not configured (`isSanityConfigured() === false`) the full static bundle
is used with no runtime penalty.

---

## 3. Route → Page Mapping

| Route | File | Sanity slug | Sanity query function |
|---|---|---|---|
| `/` | `src/app/page.tsx` | `home` | `getPageContentBySlug("home")` + ticket/performers |
| `/lineup/` | `src/app/lineup/page.tsx` | `lineup` | `getPerformers()` + `getPageContentBySlug("lineup")` |
| `/program/` | `src/app/program/page.tsx` | `program` | `getPageContentBySlug("program")` |
| `/info/` | `src/app/info/page.tsx` | `info` | `getPageContentBySlug("info")` + ticket URL |
| `/szallas/` | `src/app/szallas/page.tsx` | `szallas` | `getAccommodationContent()` + `getPageContentBySlug("szallas")` |
| `/terkep/` | `src/app/terkep/page.tsx` | `terkep` | `getVenueContent()` + `getPageContentBySlug("terkep")` |
| `/futas/` | `src/app/futas/page.tsx` | `futas` | `getRunningContent()` + `getPageContentBySlug("futas")` |
| `/tabor/` | `src/app/tabor/page.tsx` | `tabor` | `getCampContent()` + `getPageContentBySlug("tabor")` |
| `/contact/` | `src/app/contact/page.tsx` | `contact` | `getContactContent()` + `getPageContentBySlug("contact")` |
| `/adatvedelem/` | `src/app/adatvedelem/page.tsx` | `adatvedelem` | `getPageContentBySlug("adatvedelem")` |
| `/aszf/` | `src/app/aszf/page.tsx` | `aszf` | `getPageContentBySlug("aszf")` |
| `/oldal/[slug]/` | `src/app/oldal/[slug]/page.tsx` | `*` (dynamic) | `getPageContentBySlug(slug)` |

> **Note:** `adatvedelem` does NOT have a Sanity Page document seeded by default.
> Both routes render their static fallback (`c.terms.*` / `c.privacy.*`) when no Sanity
> document exists.

---

## 4. Sanity Document Types

### 4.1 `page` — Monolithic Page Document

Single document type covering all routes. Fields are conditionally hidden in Studio
based on `slug.current` via `hidden: ({ document }) => ...` callbacks.

**Always-visible fields:**
- `titleHu` / `titleEn` — internal/Studio label
- `slug` — route identifier (fixed for built-in routes, arbitrary for `/oldal/*`)
- `seo` — SEO object (title, description, OG image, canonical override, noIndex)
- `order`, `isActive`

**Conditional field groups by slug:**

| Slug(s) | Fields |
|---|---|
| All except `home`, `lineup` | `heroTitleHu/En`, `heroDescriptionRichHu/En`, `pageBodyRichHu/En` |
| `szallas`, `terkep` | `introNoteRichHu/En` |
| `program` | `programDisplayMode`, `programBodyRichHu/En` |
| `futas`, `tabor` | `showSecondBody`, `pageBody2RichHu/En`, `primaryButton*`, `secondaryButton*` |
| `tabor` only | `campEyebrowHu/En`, `campScheduleSectionTitleHu/En`, `campScheduleBlocks[]`, `campSupportersSectionTitleHu/En`, `campSupporters[]` |
| `futas` only | `runningEyebrowHu/En`, `runningFreeEntryBannerRichHu/En`, `runningCardDate/Time/Location*`, `runningDistancesSectionTitle*`, `runningDistanceRows[]`, `runningEntryDeadlineRich*`, `runningResultsNoteRich*` |

**Total schema fields:** ~55 (many locale-paired).

### 4.2 `performer` — Artist Document

| Field | Type | Notes |
|---|---|---|
| `name` | string | Required |
| `slug` | slug | Auto from `name` |
| `image` | image | Sanity CDN asset (preferred) |
| `imageDisplayMode` | string enum | `cover` / `contain` / `landscape` / `portrait` |
| `imagePath` | string | **Legacy read-only fallback** — public/images path |
| `shortDescriptionRichHu/En` | richText | Card description (not genre tag) |
| `tags` | reference[] | `→ performerTag` documents |
| `members` | object[] | Complex: name, role, instrument, country, `showAsStandalonePerformer`, order |
| `bioRichHu/En` | richText | Modal long bio |
| `websiteUrl`, `facebookUrl`, `instagramUrl`, `youtubeUrl`, `spotifyUrl` | url | Social links |
| `order`, `isFeatured`, `isActive` | number/bool | Lineup ordering and visibility |
| `seo` | seo | Per-performer SEO |

### 4.3 `siteSettings` — Global Singleton

One document. Provides: site title/description, festival dates, venue, ticket URLs,
social URLs, contact email/phone, volunteer CTA, house rules PDF, organizer name/URL,
global SEO fallback.

**Usage:** Consumed via `getContent()` → merges with static `hu.ts`/`en.ts`.

### 4.4 `seo` — Object Type (reusable)

Fields: `seoTitleHu/En`, `seoDescriptionHu/En`, `ogImage` (image), `canonicalOverrideHu/En`,
`noIndex` (boolean).

Used by: `page`, `performer`, `siteSettings`.

### 4.5 `richText` — Portable Text Array (reusable)

Block types: `normal`, `h1`–`h4`, `blockquote`.
Lists: `bullet`, `number`.
Decorators: `strong`, `em`, `underline`, `strike-through`, `code`.
Annotations: `link` (url), `fontSize` (small/medium/large/xl), `fontFamily` (sans/serif/mono).
Custom block type: `callout` (with `calloutType`: info/important/price + `content` richtext).

---

## 5. Shared Components

### 5.1 Layout Components

| Component | Path | Purpose |
|---|---|---|
| `RootLayout` | `src/app/layout.tsx` | HTML shell, font vars, org/website JSON-LD, skip link, Navbar + Footer |
| `AppShell` | `src/components/layout/AppShell.tsx` | Splits Studio route from public shell |
| `BackgroundWrapper` | `src/components/layout/BackgroundWrapper.tsx` | Gradient/beach background |
| `BeachPageShell` | `src/components/layout/BeachPageShell.tsx` | Page hero wrapper (eyebrow + title + subtitle + canonical) |
| `PageBody` | `src/components/layout/PageBody.tsx` | Renders `pageBodyRich*` (RichText or plain string) |
| `Header` (legacy?) | `src/components/layout/Header.tsx` | Thin nav bar — **not imported in layout.tsx** |
| `MobileMenu` | `src/components/layout/MobileMenu.tsx` | Hamburger nav |
| `LocaleSwitchAnchor` | `src/components/layout/LocaleSwitchAnchor.tsx` | HU/EN toggle |

### 5.2 Home Components (also used as global)

| Component | Path | Notes |
|---|---|---|
| `Navbar` | `src/components/home/Navbar.tsx` | **Primary nav** (used in `layout.tsx`) |
| `Footer` | `src/components/home/Footer.tsx` | **Primary footer** (used in `layout.tsx`), 402 lines, sponsors + 4-col layout |

### 5.3 Common Components

| Component | Path | Purpose |
|---|---|---|
| `RichText` | `src/components/common/RichText.tsx` | Renders `PortableTextBlock[]` with full component map |

### 5.4 Analytics Components

`Scripts`, `CookieBanner`, `CookieSettingsLink` under `src/components/analytics/`.

---

## 6. SEO Infrastructure

### Metadata Generation

All page routes call `buildPageMetadataWithSanity()` from `src/sanity/lib/seoContent.ts`.

**Flow:**
1. Fetches Sanity `page` document by slug → reads `seo.*` fields
2. Falls back to `fallbackTitle` / `fallbackDescription` / `fallbackOgImage` passed by caller
3. Builds full Next.js `Metadata` object (title, description, OG, Twitter, canonical, robots)

### Structured Data (JSON-LD)

| Schema | Where injected | Builder function |
|---|---|---|
| `WebSite` | `layout.tsx` | `websiteSchema()` |
| `Organization` | `layout.tsx` | `organizationSchema()` |
| `BreadcrumbList` | `adatvedelem/page.tsx`, `aszf/page.tsx` | `breadcrumbSchema()` |
| `Event` | `page.tsx` (home), `futas/page.tsx`, others | `eventSchema()` |

---

## 7. RichText / Portable Text Rendering

### RichText Component (`src/components/common/RichText.tsx`)

Wraps `@portabletext/react` with a full component map:
- Blocks: normal → `<p>`, h1–h4, blockquote
- Marks: strong, em, underline, strikeThrough, code, link (external/internal), fontSize, fontFamily
- Lists: bullet → `<ul>`, number → `<ol>`
- Custom type: `callout` (renders coloured box with nested PortableText)

### ⚠️ Known Bug — Callout Type Field Name Mismatch

In `RichText.tsx` the callout renderer accesses `value.type`:
```tsx
// RichText.tsx line 111
const style = calloutStyles[value.type] || calloutStyles.info;
```

But the Sanity schema (`richText.ts`) names the field `calloutType`, not `type`.
The `type` property on a Sanity block always equals the block's schema name (i.e. `"callout"`),
not the variant. **Result: all callout blocks always render with the `info` style.**

**Fix:** Change `value.type` → `value.calloutType` in `RichText.tsx`.

### PageBody Component (`src/components/layout/PageBody.tsx`)

Wrapper around `RichText` with two variants:
- `"card"` (default): cream background card with shadow
- `"plain"`: unstyled wrapper

Also handles legacy plain-string content with URL auto-linking via `linkify()`.

---

## 8. Dead Code

### ~~`src/components/layout/Footer.tsx`~~ — ✅ DELETED (2026-05-13)

This file (225 lines) was never imported anywhere.
Confirmed via `grep` across all `.ts`/`.tsx`/`.js` files: 0 results.
The active footer is `src/components/home/Footer.tsx` (402 lines), imported in `layout.tsx`.

**Resolved:** File deleted. Build, lint, and typecheck all pass after deletion.

---

## 9. Content Fallback Completeness

| Page | Sanity document expected | Static fallback exists | Notes |
|---|---|---|---|
| home | `page` slug=`home` | ✅ `c.home.*` | Hero/meta only; visual layout is code-driven |
| lineup | `page` slug=`lineup` + `performer` docs | ✅ `c.lineup.artists[]` | Artists merged: Sanity overrides static list |
| program | `page` slug=`program` | ✅ `c.program.days[]` | Structured OR freeText OR both (toggle) |
| info | `page` slug=`info` | ✅ `c.info.ticketTiers[]`, `c.info.faq[]` | |
| szallas | `page` slug=`szallas` + accommodation content | ✅ `c.accommodation.hotels[]` | |
| terkep | `page` slug=`terkep` + venue content | ✅ `c.map.*` | |
| futas | `page` slug=`futas` + running content | ✅ `c.running.*` | Rich fields overlay static running data |
| tabor | `page` slug=`tabor` + camp content | ✅ `c.camp.*` | Rich schedule blocks overlay static schedule |
| contact | `page` slug=`contact` + contact content | ✅ `c.contact.*` | |
| adatvedelem | `page` slug=`adatvedelem` | ✅ `c.privacy.*` | Static long-form text |
| aszf | `page` slug=`aszf` | ✅ `c.terms.body` | Static long-form text |
| /oldal/[slug] | any non-fixed `page` slug | ❌ none | Returns 404 if `page.found === false` |

---

## 10. Known Issues / Action Items

### Critical

| # | Issue | File | Status |
|---|---|---|---|
| C1 | **Callout type bug** — `value.type` → `value.calloutType` | `src/components/common/RichText.tsx:111` | ✅ **Fixed 2026-05-13** — `info`/`important`/`price` callouts now render with correct styles |
| C2 | **Dead footer component** — `layout/Footer.tsx` never imported | `src/components/layout/Footer.tsx` | ✅ **Deleted 2026-05-13** — confirmed 0 imports before deletion |

### Medium

| # | Issue | File | Notes |
|---|---|---|---|
| M1 | `adatvedelem` breadcrumb links to `c.privacy` — no Sanity document seeded by default | `src/app/adatvedelem/page.tsx` | Add seed or document in Sanity |
| M2 | `performer.imagePath` is `readOnly` legacy field — code still falls back to it | `lineup/page.tsx` | Acceptable, but note for future cleanup |
| M3 | Hardcoded Google Maps embed URL in `terkep/page.tsx` and `info/page.tsx` | both files | Move to `siteSettings.mapsEmbedUrl` |
| M4 | `Header.tsx` in `components/layout/` is not connected to the layout | `src/components/layout/Header.tsx` | Confirm if used anywhere, else delete |

### Low

| # | Issue | File | Notes |
|---|---|---|---|
| L1 | `running.distances` array is duplicated in static data AND Sanity `runningDistanceRows` | `futas/page.tsx` | Sanity overrides static if non-empty |
| L2 | `performerDetailsHu` hardcoded object in `lineup/page.tsx` (~100 lines) | `src/app/lineup/page.tsx` | Should migrate to Sanity `performer.bioRichHu` |
| L3 | `info/page.tsx` ticket tiers are in static content only; no Sanity ticket tier document | `src/app/info/page.tsx` | Consider adding to `siteSettings` or `page` schema |
| L4 | Spotify `SocialIcon` in `Footer.tsx` links to `href="#"` (dead link) | `src/components/home/Footer.tsx:232` | Wire to `siteSettings.spotifyUrl` or remove icon |

---

## 11. Refactoring Opportunities (original task context)

Most shared patterns have **already been extracted**:

| Pattern | Status | Component |
|---|---|---|
| Metadata generation | ✅ Centralized | `buildPageMetadataWithSanity()` |
| Page hero shell | ✅ Component | `BeachPageShell` |
| Page body rendering | ✅ Component | `PageBody` |
| Rich text rendering | ✅ Component | `RichText` |
| Footer | ✅ Single source | `components/home/Footer.tsx` |
| Nav | ✅ Single source | `components/home/Navbar.tsx` |

**Remaining refactor candidates:**

1. **Breadcrumb JSON-LD** — `adatvedelem` and `aszf` both inline the same `breadcrumbSchema()` call.
   Could be moved into `BeachPageShell` as an optional prop.

2. **Info-card pattern** (icon + label + value) — used in `futas/page.tsx` (date/time/location cards)
   and `tabor/page.tsx`. Could be a `<InfoCard>` component.

3. **Section title pattern** — many pages render `<h2>` with identical Bebas Neue / orange styling.
   Could be a `<SectionHeading>` component.

4. **CTA button pattern** — futas and tabor both render primary+secondary button pairs from the
   same Sanity fields. A shared `<CtaButtonPair>` component would de-duplicate ~30 lines each.

---

## 12. Build / Lint Status

**Last run: 2026-05-13** (after C1 fix + C2 deletion)

| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` (`next lint`) | ✅ No ESLint warnings or errors |
| TypeScript | `npx tsc --noEmit` | ✅ 0 type errors |
| Build | `npx next build` | ✅ 17/17 pages generated, exit code 0 |

**Build route table (relevant excerpt):**
```
ƒ /adatvedelem   ƒ /aszf         ƒ /contact
ƒ /futas         ƒ /info         ƒ /lineup
ƒ /program       ƒ /szallas      ƒ /tabor
ƒ /terkep        ● /oldal/[slug]  ƒ /studio/[[...tool]]
```

> Note: During build, PowerShell 2>&1 piping mixed dev-server stderr into the output
> on earlier attempts. Clean `npx next build` with `$LASTEXITCODE` confirms exit code = 0.

---

*Last updated: 2026-05-13 — C1 callout bug fixed, C2 dead Footer deleted, build/lint/typecheck all passing.*
