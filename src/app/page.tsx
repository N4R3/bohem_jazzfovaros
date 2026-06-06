/**
 * Home (főoldal) — jazzdesign1 "Bohem Jazzfovaros 2026.html" 1:1 dizájn-klónja.
 */

import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getContent, getLocale } from "@/lib/locale";
import { buildPageMetadataWithSanity } from "@/sanity/lib/seoContent";
import { musicEventSchema } from "@/lib/structuredData";

import Hero from "@/components/home/Hero";
import InfoBar from "@/components/home/InfoBar";
import VideoLiteEmbed from "@/components/common/VideoLiteEmbed";
import { BASE } from "@/content/base";
import {
  getEnabledVideosWithFallback,
  getHomePageVisibleContent,
  getPageContentBySlug,
  getPopupSettingsWithFallback,
  getPerformersWithFallback,
  getTicketUrlWithFallback,
} from "@/sanity/lib/content";

const TicketBoxes = dynamic(() => import("@/components/home/TicketBoxes"));
const StatsBar = dynamic(() => import("@/components/home/StatsBar"));
const LineupTeaser = dynamic(() => import("@/components/home/LineupTeaser"));
const CtaSection = dynamic(() => import("@/components/home/CtaSection"));
const SzechenyiPopup = dynamic(() => import("@/components/home/SzechenyiPopup"));

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
  const [popupSettings, performers, ticketUrl, homePage, homeVisible] = await Promise.all([
    getPopupSettingsWithFallback(),
    getPerformersWithFallback(),
    getTicketUrlWithFallback(locale),
    getPageContentBySlug("home", locale),
    getHomePageVisibleContent(locale),
  ]);
  const heroCtaUrl = homeVisible.primaryCtaUrl || ticketUrl || "#";
  const bannerCtaUrl = homeVisible.ctaBannerButtonUrl || ticketUrl || "#";
  const homeLocalVideoUrl = homePage.videoUrl;

  let homeVideos: Awaited<ReturnType<typeof getEnabledVideosWithFallback>> = [];
  if (!homeLocalVideoUrl && !c.home.videoUrl) {
    homeVideos = await getEnabledVideosWithFallback(locale);
  }
  const filteredHomeVideos = homeVideos.filter((video) => {
    if (!video.displayOnPages || video.displayOnPages.length === 0) return true;
    return video.displayOnPages.includes("home");
  });

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

  const festivalDatesEmphasis = (c.meta.festivalDates || "2026. AUGUSZTUS 6–9.").toUpperCase();
  const venueLine = `${(c.meta.venue || "Domb Beach").toUpperCase()}, ${(c.meta.city || "Kecskemét").toUpperCase()}`;
  const teaserPalette = ["#6BA4BF", "#C7A27B", "#7A9E7E", "#B06A6A", "#8E7AAD", "#6B8FBF", "#C29144", "#9E6B6B"];
  const imageByName = new Map(BASE.artists.map((artist) => [artist.name, artist.image]));
  const lineupTeaserArtists = performers.map((artist, index) => ({
    name: artist.name,
    genre: artist.tags?.[0] || artist.genre,
    color: teaserPalette[index % teaserPalette.length],
    image: artist.image || imageByName.get(artist.name),
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="page-bg">
        <div className="hero-fold">
          <Hero
            line1={homeVisible.heroLine1}
            line2={homeVisible.heroLine2}
            locationBadge={homeVisible.heroLocationBadge}
            dateBadge={homeVisible.heroDateBadge}
            ctaLabel={homeVisible.primaryCtaLabel}
            ctaUrl={heroCtaUrl}
          />
          <InfoBar
            date={festivalDatesEmphasis}
            venue={venueLine}
            ticketLabel={homeVisible.primaryCtaLabel}
            ticketUrl={heroCtaUrl}
          />
        </div>

        <div className="content-photo-bg relative z-[1]">
          <div className="mx-auto max-w-[1160px] space-y-10 px-5 pt-14 pb-4 sm:space-y-14 sm:px-8 sm:pt-16 md:space-y-16">
            {homeLocalVideoUrl ? (
              <VideoLiteEmbed
                title={homePage.videoTitle || c.home.videoTitle || c.meta.siteTitle}
                videoUrl={homeLocalVideoUrl}
                size="large"
                showDetailsBelow={false}
              />
            ) : filteredHomeVideos.length > 0 ? (
              <VideoLiteEmbed
                title={filteredHomeVideos[0].title || c.home.videoTitle || c.meta.siteTitle}
                videoUrl={filteredHomeVideos[0].videoUrl}
                description={filteredHomeVideos[0].description}
                thumbnailUrl={filteredHomeVideos[0].thumbnailUrl}
                size={filteredHomeVideos[0].size || "large"}
                ctaUrl={filteredHomeVideos[0].ctaUrl}
                ctaText={filteredHomeVideos[0].ctaText}
                showDetailsBelow={Boolean(
                  filteredHomeVideos[0].description?.length || filteredHomeVideos[0].ctaUrl,
                )}
              />
            ) : (
              c.home.videoUrl && (
                <VideoLiteEmbed
                  title={c.home.videoTitle || c.meta.siteTitle}
                  videoUrl={c.home.videoUrl}
                  size="large"
                  showDetailsBelow={false}
                />
              )
            )}

            <TicketBoxes embedded />
          </div>

          <StatsBar
            items={homeVisible.stats}
            ariaLabel={c.otherLocale.label === "HU" ? "Festival statistics" : "Fesztivál statisztikák"}
          />

          <LineupTeaser title={c.home.lineupTeaserTitle} artists={lineupTeaserArtists} />

          <CtaSection
            title={homeVisible.ctaBannerTitle}
            subtitle={homeVisible.ctaBannerSubtitle}
            buttonLabel={homeVisible.ctaBannerButtonLabel}
            buttonUrl={bannerCtaUrl}
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
