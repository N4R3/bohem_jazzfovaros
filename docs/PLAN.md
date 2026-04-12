# Jazz Festival Website — Final Build Plan

**Project:** Bilingual jazz festival website rebuild
**Domains:** jazzfovaros.hu (HU) · jazzcapital.hu (EN)
**Stack:** Next.js 15 · TypeScript · Tailwind v4 · App Router · Static Export
**Updated:** 2026-04-11 (final, approved)

---

## Core Rules

| Rule | Decision |
|------|----------|
| Architecture | Static export — `output: "export"` |
| Hosting | Netlify OR traditional shared hosting (cPanel) |
| Language | Two-build strategy: `NEXT_PUBLIC_LOCALE=hu|en` |
| Content | TypeScript files only — no CMS, no DB, no admin UI |
| Complexity | Once-off delivery — simple, fast, portable |
| Overbuilding | Not permitted — keep it minimal and readable |

---

## Route Structure

```
/                   Home
/lineup/            Performers / Fellépők
/program/           Schedule / Programok
/info/              Tickets & Info / Jegyek & Infó
/gallery/           Gallery / Galéria
/contact/           Contact / Kapcsolat
/szallas/           Accommodation / Szállás
/terkep/            Map & Transport / Térkép & Közlekedés
/futas/             Jazz Capital Run / Jazzfőváros Futás
/tabor/             Jazz Camp / Jazztábor
/aszf/              Terms & Conditions / ÁSZF
```

All routes identical on both domains. Domain determines language.

---

## Content Architecture

```
src/content/
├── base.ts         ← Shared data: dates, URLs, sponsors, social links, images
├── hu.ts           ← Hungarian text only (imports + extends base)
└── en.ts           ← English text only (imports + extends base)

src/lib/
├── types.ts        ← All TypeScript interfaces
└── locale.ts       ← getContent(), getLocale()
```

**base.ts contains:**
- festival dates, year, venue, city, GPS coords
- ticketUrl, external booking links
- sponsor lists (main / sponsors / partners) with logos + URLs
- social links (FB, IG, YT)
- gallery image paths
- artist list (name, genre, image, day, stage, time, origin)
- program schedule (days, slots)
- accommodation details (name, url, prices)
- running event details (date, time, distances, entryUrl)
- common contact fields (address, email, phones)
- payment icon list

**hu.ts / en.ts contain:**
- all labels, headings, descriptions, body text
- nav labels
- FAQ questions & answers
- legal text (ÁSZF)
- section titles and subtitles
- CTA button labels
- artist bios (language-specific)
- page-specific text

---

## Sponsor Structure (3 tiers)

```ts
sponsors: {
  main:     Sponsor[]   // Főtámogatók / Main Supporters — 8 logos
  sponsors: Sponsor[]   // Szponzorok / Sponsors — 2 logos
  partners: Sponsor[]   // Partnerek / Partners — 16+ logos
}
```

---

## Pages

### Homepage

- Hero + CTA
- YouTube promo video embed
- Quick links strip (3 cards: Tickets / Map / Accommodation)
- Highlights (stats)
- Lineup teaser (6 artists)
- Accompanying programmes list
- CTA banner
- Sponsor section (3 tiers)

### All pages

- Fixed header with nav + language switch + social icons
- Footer with nav repeat, legal links, payment icons, social, copyright

---

## Interactivity Rules

**Include:**
- hover: `scale + shadow` on cards, `grayscale→color` on sponsor logos, `underline slide` on nav links
- scroll fade-in via `useInView` hook (Intersection Observer)
- stagger for artist cards and section headings (CSS transition delay, max 6 items)
- gallery lightbox: open / close / next / prev / ESC

**Exclude:**
- parallax
- flip cards
- framer-motion or heavy animation libraries
- cinematic entrance sequences

---

## Build & Deploy

```bash
# Build scripts in package.json
"build:hu": "cross-env NEXT_PUBLIC_LOCALE=hu next build"
"build:en": "cross-env NEXT_PUBLIC_LOCALE=en next build"
```

Output: static `out/` folder → upload to domain directly.

---

## Work Order

| Phase | Task | Status |
|-------|------|--------|
| 1 | Update PLAN.md | ✅ Done |
| 2 | Extend types.ts + create base.ts | ⬜ |
| 3 | Migrate full HU + EN content | ⬜ |
| 4 | Build missing pages | ⬜ |
| 5 | Enhance homepage | ⬜ |
| 6 | Update nav + footer | ⬜ |
| 7 | Add interactivity | ⬜ |
| 8 | Gallery lightbox | ⬜ |
| 9 | Responsive polish | ⬜ |
| 10 | Final cleanup | ⬜ |
