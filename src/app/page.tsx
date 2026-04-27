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
import { getContent, getLocale } from "@/lib/locale";
import { buildPageMetadataWithSanity } from "@/sanity/lib/seoContent";
import { musicEventSchema } from "@/lib/structuredData";

import Hero from "@/components/home/Hero";
import InfoBar from "@/components/home/InfoBar";
import VideoSection from "@/components/home/VideoSection";
import TicketBoxes from "@/components/home/TicketBoxes";
import StatsBar from "@/components/home/StatsBar";
import LineupTeaser from "@/components/home/LineupTeaser";
import CtaSection from "@/components/home/CtaSection";
import SzechenyiPopup from "@/components/home/SzechenyiPopup";
import { BASE } from "@/content/base";
import {
  getPopupSettingsWithFallback,
  getPerformersWithFallback,
  getTicketUrlWithFallback,
} from "@/sanity/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const c = await getContent();
  return buildPageMetadataWithSanity({
    slug: "home",
    path: "/",
    locale,
    fallbackTitle: c.meta.siteTitle,
    fallbackDescription: c.meta.siteDescription,
    fallbackOgImage: "/images/og-image.jpg",
    siteTitle: c.meta.siteTitle,
  });
}

export default async function HomePage() {
  const c = await getContent();
  const locale = c.otherLocale.label === "HU" ? "en" : "hu";
  const [popupSettings, performers, ticketUrl] = await Promise.all([
    getPopupSettingsWithFallback(),
    getPerformersWithFallback(),
    getTicketUrlWithFallback(locale),
  ]);

  /* JSON-LD schema.org MusicEvent — kereső és LLM-értelmezés */
  const jsonLd = musicEventSchema({
    name: c.meta.siteTitle,
    description: c.meta.siteDescription,
    locale,
    startDate: "2026-08-06",
    endDate: "2026-08-09",
    venueName: c.meta.venue,
    city: "Kecskemét",
    organizerName: "JAZZFŐVÁROS Kft.",
    imagePath: "/images/og-image.jpg",
      ticketUrl: ticketUrl,
  });

  /* A jazzdesign1 hero dátum/helyszín sora a narancs em-kiemelt dátum + ·
     + helyszín formát használja. A lokalizált `festivalDates` stringet em-
     kiemeltnek, a város/helyszín stringet simának küldjük. */
  const festivalDatesEmphasis = (c.meta.festivalDates || "2026. AUGUSZTUS 6–9.").toUpperCase();
  const venueLine = `${(c.meta.venue || "Domb Beach").toUpperCase()}, ${(c.meta.city || "Kecskemét").toUpperCase()}`;
  const teaserPalette = ["#6BA4BF", "#C7A27B", "#7A9E7E", "#B06A6A", "#8E7AAD", "#6B8FBF", "#C29144", "#9E6B6B"];
  const imageByName = new Map(BASE.artists.map((artist) => [artist.name, artist.image]));
  const lineupTeaserArtists = performers.map((artist, index) => ({
    name: artist.name,
    genre: artist.genre,
    color: teaserPalette[index % teaserPalette.length],
    image: artist.image || imageByName.get(artist.name),
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
          <Hero ctaLabel={c.home.heroCta} ctaUrl={ticketUrl} />
          <InfoBar
            date={festivalDatesEmphasis}
            venue={venueLine}
            ticketLabel={c.home.heroCta}
            ticketUrl={ticketUrl}
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
            buttonUrl={ticketUrl}
          />

        </div>
      </div>
      <SzechenyiPopup
        enabled={popupSettings.isEnabled}
        imageSrc={popupSettings.imageSrc}
        altText={popupSettings.altText}
        storageKey={popupSettings.sessionStorageKey}
        onlyOnHomepage={popupSettings.showOnlyOnHomepage}
      />
    </>
  );
}
