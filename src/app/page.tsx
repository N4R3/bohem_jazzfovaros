/**
 * Home (főoldal) — jazzdesign1 "Bohem Jazzfovaros 2026.html" 1:1 dizájn-klónja.
 *
 * A jazzdesign1 DOM-struktúrája 2 rétegű wrapper-t használ:
 *
 *   .page-bg
 *   ├── .hero-fold          (hero + info-bar — ez tölti ki az első képernyőt)
 *   └── .content-photo-bg   (videó + jegyek + stats + fellépők + CTA + szponzorok)
 *
 * A Navbar és a Footer a `layout.tsx`-ben ül. A lokalizált szövegek a
 * `getContent()`-ből jönnek — ez megőrzi a meglévő HU/EN build működését.
 */

import type { Metadata } from "next";
import { getContent } from "@/lib/locale";
import { BASE_URL, canonicalUrl } from "@/lib/seo";

import Hero from "@/components/home/Hero";
import InfoBar from "@/components/home/InfoBar";
import VideoSection from "@/components/home/VideoSection";
import TicketBoxes from "@/components/home/TicketBoxes";
import StatsBar from "@/components/home/StatsBar";
import LineupTeaser from "@/components/home/LineupTeaser";
import CtaSection from "@/components/home/CtaSection";
import SzechenyiPopup from "@/components/home/SzechenyiPopup";
import { BASE } from "@/content/base";

export const metadata: Metadata = {
  alternates: { canonical: canonicalUrl("/") },
};

export default async function HomePage() {
  const c = await getContent();

  /* JSON-LD schema.org MusicEvent — kereső optimalizáció */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: c.meta.siteTitle,
    description: c.meta.siteDescription,
    startDate: "2026-08-06",
    endDate: "2026-08-09",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: c.meta.venue,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kecskemét",
        addressCountry: "HU",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "JAZZFŐVÁROS Kft.",
      url: BASE_URL,
    },
    url: canonicalUrl("/"),
    image: `${BASE_URL}/images/og-image.jpg`,
    offers: {
      "@type": "Offer",
      url: c.info.ticketUrl,
      availability: "https://schema.org/InStock",
      priceCurrency: "HUF",
    },
  };

  /* A jazzdesign1 hero dátum/helyszín sora a narancs em-kiemelt dátum + ·
     + helyszín formát használja. A lokalizált `festivalDates` stringet em-
     kiemeltnek, a város/helyszín stringet simának küldjük. */
  const festivalDatesEmphasis = (c.meta.festivalDates || "2026. AUGUSZTUS 6–9.").toUpperCase();
  const venueLine = `${(c.meta.venue || "Domb Beach").toUpperCase()}, ${(c.meta.city || "Kecskemét").toUpperCase()}`;
  const teaserPalette = ["#6BA4BF", "#C7A27B", "#7A9E7E", "#B06A6A", "#8E7AAD", "#6B8FBF", "#C29144", "#9E6B6B"];
  const imageByName = new Map(BASE.artists.map((artist) => [artist.name, artist.image]));
  const lineupTeaserArtists = c.lineup.artists.map((artist, index) => ({
    name: artist.name,
    genre: artist.genre,
    color: teaserPalette[index % teaserPalette.length],
    image: imageByName.get(artist.name),
  }));

  return (
    <>
      {/* Keresőbarát structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* =============================================================
          1. .page-bg — a globals.css felel a rétegekért:
            - mobil:  hero szekciónak saját bg (header_mobile.png)
            - tablet+ .hero-fold::before = header_simple/_wide.png
            - tablet+ .hero-fold::after  = sun.png overlay jobb felső
          ============================================================= */}
      <div className="page-bg">
        {/* ===== Felső kép-rész: Hero + Info-bar (flex column asztalon) ===== */}
        <div className="hero-fold">
          <Hero ctaLabel={c.home.heroCta} ctaUrl={c.info.ticketUrl} />
          <InfoBar
            date={festivalDatesEmphasis}
            venue={venueLine}
            ticketLabel={c.home.heroCta}
            ticketUrl={c.info.ticketUrl}
          />
        </div>

        {/* ===== Alsó fotó-rész: a többi szekció a bg_home.png fölött ===== */}
        <div className="content-photo-bg relative z-[1]">
          {/* 3. Video */}
          <VideoSection
            videoUrl={c.home.videoUrl || "#"}
            title={c.home.videoTitle || c.meta.siteTitle}
          />

          {/* 4. 3 narancs jegyvásárlás box */}
          <TicketBoxes />

          {/* 5. Narancs stats sáv (4 / 10+ / 120+ / 40+) */}
          <StatsBar
            items={c.home.highlights}
            ariaLabel={c.otherLocale.label === "HU" ? "Festival statistics" : "Fesztivál statisztikák"}
          />

          {/* 6. FELLÉPŐK — 15 kártya + szűrő chip-ek */}
          <LineupTeaser title={c.home.lineupTeaserTitle} artists={lineupTeaserArtists} />

          {/* 7. Nagy narancs "Vedd meg a jegyed most!" CTA */}
          <CtaSection
            title={c.home.ctaBannerTitle}
            subtitle={c.home.ctaBannerSubtitle}
            buttonLabel={c.home.ctaBannerButton}
            buttonUrl={c.info.ticketUrl}
          />

        </div>
      </div>
      <SzechenyiPopup />
    </>
  );
}
