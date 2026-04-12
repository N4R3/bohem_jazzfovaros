# PROGRESS

## Phase 7 — Content architecture refactor + missing pages + interactivity ✅

### Completed

#### Content Architecture
- Created `src/content/base.ts` — shared bilingual data (dates, venue, GPS, video, contacts, hotels, running, camp, sponsors, gallery)
- Rewrote `src/lib/types.ts` — added `SponsorSection`, `QuickLink`, `Hotel`, `RunningDistance`, `CampScheduleItem`; extended `SiteContent` with `accommodation`, `map`, `running`, `camp`, `terms`, `sponsors` top-level; removed `sponsors` from `contact`
- Rewrote `src/content/hu.ts` — full HU content with all new sections, importing from base
- Rewrote `src/content/en.ts` — full EN content with all new sections, importing from base

#### New Pages
- `src/app/szallas/page.tsx` — hotel cards with stars, price, distance, booking CTA
- `src/app/terkep/page.tsx` — map image placeholder, GPS link, Google Maps button, directions cards
- `src/app/futas/page.tsx` — distances table, entry deadline, results note, free ticket callout
- `src/app/tabor/page.tsx` — YouTube embed, schedule accordion, supporters list
- `src/app/aszf/page.tsx` — terms text, paragraph split

#### Homepage Enhancements
- Added `src/components/home/VideoEmbed.tsx` — YouTube iframe with lazy load + scroll fade-in
- Added `src/components/home/QuickLinks.tsx` — 3-card strip (Tickets, Map, Accommodation) with staggered fade-in
- Added `src/components/home/SponsorsSection.tsx` — 3-tier sponsor logos (main/sponsors/partners)
- Wired all into `src/app/page.tsx`

#### Navigation & Footer
- Updated HU nav to 10 items (all new pages internal)
- Updated EN nav to 9 items (running omitted)
- Footer: added YouTube social icon, fixed legal links to use `Link` for internal paths
- Header: desktop nav gap reduced, date label hidden below xl to prevent overflow

#### Interactivity
- Created `src/hooks/useInView.ts` — Intersection Observer, fires once, auto-disconnects
- `Highlights` — staggered scroll fade-in (80ms delay per item)
- `QuickLinks` — staggered fade-in + lift hover
- `VideoEmbed` — scroll fade-in
- `SponsorsSection` — scroll fade-in
- Gallery: `GalleryClient` lightbox (open/close/prev/next/ESC, keyboard, body-scroll-lock)

### TypeScript
- Zero TS errors (`npx tsc --noEmit` clean)

### Still Needed Before Launch
- Real images: `/images/gallery/01-12.jpg`, artist photos, hotel photos, map image, running photo
- Sponsor logos: `/images/sponsors/*.png`
- `public/images/og-image.jpg` (1200×630)
- `public/images/hero-bg.jpg`
- Real GTM/GA4/Ads IDs in hosting env
- SponsorsSection: render actual `<img>` tags once logo files are placed
- Map page: embed real Google Maps iframe once confirmed
