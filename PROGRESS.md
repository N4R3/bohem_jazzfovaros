# Jazz Festival — Progress Log

## Phase 1 — Completed

**Date:** 2026-04-11

### Status: Implementation Complete · Pending `npm install` + first build

---

## Files Created

### Config
| File | Purpose |
|------|---------|
| `package.json` | Next.js 15, React 19, Tailwind v4, cross-env, TypeScript |
| `next.config.ts` | Static export, trailingSlash, unoptimized images |
| `tsconfig.json` | Strict TypeScript, `@/*` path alias |
| `postcss.config.mjs` | `@tailwindcss/postcss` plugin |

### Content & Types
| File | Purpose |
|------|---------|
| `src/lib/types.ts` | All shared TypeScript types |
| `src/lib/locale.ts` | `getLocale()` and `getContent()` helpers |
| `src/content/hu.ts` | Full Hungarian site content (all 6 pages) |
| `src/content/en.ts` | Full English site content (all 6 pages) |

### Styles & Layout Shell
| File | Purpose |
|------|---------|
| `src/app/globals.css` | Tailwind v4 import + `@theme` design tokens |
| `src/app/layout.tsx` | Root layout: Playfair Display + Inter fonts, Header, Footer |

### UI Primitives
| File | Purpose |
|------|---------|
| `src/components/ui/Container.tsx` | Max-width centered wrapper |
| `src/components/ui/Button.tsx` | primary / secondary / outline variants |
| `src/components/ui/SectionHeading.tsx` | Consistent h2 + gold accent bar |

### Layout Components
| File | Purpose |
|------|---------|
| `src/components/layout/Header.tsx` | Logo, desktop nav, locale switch |
| `src/components/layout/Footer.tsx` | 3-column: brand, nav, contact + socials |
| `src/components/layout/MobileMenu.tsx` | Client component, hamburger drawer |

### Home Page Sections
| File | Purpose |
|------|---------|
| `src/components/home/Hero.tsx` | Full-bleed dark hero, title, subtitle, 2 CTAs |
| `src/components/home/InfoStrip.tsx` | Gold bar: date · venue · ticket button |
| `src/components/home/Highlights.tsx` | 4-stat grid on cream background |
| `src/components/home/LineupTeaser.tsx` | Dark section, 6 artist cards |
| `src/components/home/CtaBanner.tsx` | Gold-to-coral gradient CTA section |

### Pages
| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Home — all sections assembled |
| `src/app/lineup/page.tsx` | Artist grid with genre, bio, day/stage/time |
| `src/app/program/page.tsx` | 3-column schedule grid by day |
| `src/app/info/page.tsx` | Info sections + FAQ sidebar + ticket CTA |
| `src/app/gallery/page.tsx` | 4-col photo grid with hover overlay |
| `src/app/contact/page.tsx` | Contact details, social links, press, sponsors |

---

## Design System Applied
- **Palette:** gold-500 (#D4A843) · navy-900 (#0F1B2D) · cream-50 (#FFFDF7) · coral-500 (#E07A5F)
- **Fonts:** Playfair Display (headings) + Inter (body) via `next/font/google`
- **Locale strategy:** `NEXT_PUBLIC_LOCALE=hu|en` at build time → two static exports

---

---

## Phase 2 — Real Content Migration (2026-04-11)

**Status: Complete**

### Sources scraped
- `https://jazzfovaros.hu` (all chunks + subpages: /jegyvasarlas, /kozlekedes, /kapcsolat, /impresszum)
- `https://jazzcapital.hu` (homepage + /tickets-2026, /contact)

### Changes made

| File | Change |
|------|--------|
| `src/lib/types.ts` | Added `TicketTier`, `LegalLink`, `AccompanyingProgramme` types; extended `SiteContent` with `ticketTiers`, `ticketNote`, `legalLinks`, `navLabel`, `builtBy`, `phone2`, `volunteerText/Url`, `accompanyingProgrammes` |
| `src/content/hu.ts` | Full rewrite: Kecskemét/Domb Beach, Aug 6–9, real ticket tiers (12 tiers), real contact (Ittzés Tamás, Adrienn), real press email, legal links, volunteer link, accompanying programmes |
| `src/content/en.ts` | Full rewrite: shorter EN structure, real ticket URL (?lang=en), real contact (Tamás/Mariann), real legal links (jazzcapital.hu), accompanying programmes |
| `src/components/layout/Footer.tsx` | Uses `legalLinks` from content, `navLabel`, `builtBy` credit (Mayoka); external nav links open in new tab |
| `src/components/layout/Header.tsx` | External nav links (jazztábor, futás, lindy hop) open in new tab |
| `src/components/layout/MobileMenu.tsx` | Same external link fix |
| `src/app/info/page.tsx` | Renders ticket tiers table + ticket note when present |
| `src/app/contact/page.tsx` | Renders second phone number and volunteer CTA when present |

### Key real data now in place
- **Venue:** Domb Beach, Kecskemét (not Budapest)
- **Dates:** 2026. augusztus 6–9. / Aug 6–9, 2026
- **HU ticket URL:** https://jazzfovaros.jegy.hu/program/x-bohem-jazzfovaros-fesztival-berletek/
- **EN ticket URL:** https://jazzfovaros.jegy.hu/?lang=en
- **Organizer:** JAZZFŐVÁROS Kft. / Dr. Ittzés Tamás
- **Email:** jazzfovaros@gmail.com
- **Press:** sajt@bohemragtime.com
- **HU legal:** adatvedelem, jogi-nyilatkozat, impresszum, ászf
- **EN legal:** privacy, legal-notice, impressum
- **Built by:** Mayoka (mayoka.hu)

---

---

## Phase 3 — SEO & Technical Preparation

**Status: Complete**

### New files

| File | Purpose |
|------|---------|
| `src/lib/seo.ts` | `BASE_URL`, `ALT_URL`, `canonicalUrl()` helper — reads from env vars |
| `src/app/sitemap.ts` | Next.js native sitemap (6 pages, per-locale base URL) |
| `src/app/robots.ts` | Next.js native robots.txt with sitemap pointer |
| `src/components/analytics/Scripts.tsx` | GTM / GA4 / Google Ads placeholder scripts — IDs from env only |
| `src/components/analytics/CookieBanner.tsx` | Minimal cookie consent banner (localStorage, dataLayer push) |
| `public/site.webmanifest` | PWA manifest (theme navy-950, icon placeholders) |
| `.env.local.example` | Documents all env vars — copy to `.env.local`, never commit IDs |

### Changes to existing files

| File | Change |
|------|--------|
| `src/app/layout.tsx` | Full metadata: canonical, OG image, Twitter card, locale alternates, manifest; separate `viewport` export (themeColor); skip-to-content link; `<main id="main-content">` |
| `src/app/page.tsx` | JSON-LD `MusicEvent` structured data |
| `src/app/lineup/page.tsx` | `generateMetadata` with canonical + OG |
| `src/app/program/page.tsx` | `generateMetadata` with canonical + OG |
| `src/app/info/page.tsx` | `generateMetadata` with canonical + OG |
| `src/app/gallery/page.tsx` | `generateMetadata` with canonical + OG |
| `src/app/contact/page.tsx` | `generateMetadata` with canonical + OG |
| `src/components/home/Hero.tsx` | `aria-label="Hero"` on `<section>` |
| `src/components/home/Highlights.tsx` | `aria-label="Festival highlights"` |
| `src/components/home/LineupTeaser.tsx` | `aria-label="Lineup preview"` |
| `src/components/home/CtaBanner.tsx` | `aria-label="Ticket call to action"` |

### Env vars required before launch

```
NEXT_PUBLIC_LOCALE=hu|en
NEXT_PUBLIC_SITE_URL_HU=https://jazzfovaros.hu
NEXT_PUBLIC_SITE_URL_EN=https://jazzcapital.hu
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX        # set this → GA4+Ads via GTM
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX       # only if no GTM
NEXT_PUBLIC_GADS_ID=AW-XXXXXXXXXX     # only if no GTM
```

### Still needed before launch

- `public/images/og-image.jpg` — 1200×630 OG social share image
- `public/icons/icon-192.png` + `icon-512.png` — PWA icons
- Replace `CookieBanner` with a full CMP (Cookiebot / Axeptio) if legally required
- Set actual GTM/GA4/Ads IDs in hosting environment

---

## Next Steps

1. **Add hero background image** to `public/images/hero-bg.jpg`
2. **Add OG image** to `public/images/og-image.jpg` (1200×630)
3. **Add artist photos** to `public/images/artists/`
4. **Add gallery photos** to `public/images/gallery/`
5. **Add PWA icons** to `public/icons/`
6. **Set env vars** on hosting platform (Vercel / Netlify)
7. **Run `npm run build:hu` and `npm run build:en`** for deploy test

---

## Known Pre-Install Lint Noise (resolves after `npm install`)
All IDE lint errors before install are expected — `next`, `react`, `@types/node` are not yet installed.
