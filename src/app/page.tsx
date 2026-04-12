import { getContent } from "@/lib/locale";
import { BASE_URL, canonicalUrl } from "@/lib/seo";
import ThemedHero from "@/components/home/ThemedHero";
import InfoStrip from "@/components/home/InfoStrip";
import VideoEmbed from "@/components/home/VideoEmbed";
import QuickLinks from "@/components/home/QuickLinks";
import Highlights from "@/components/home/Highlights";
import LineupTeaser from "@/components/home/LineupTeaser";
import CtaBanner from "@/components/home/CtaBanner";
import SponsorsSection from "@/components/home/SponsorsSection";

export default function HomePage() {
  const c = getContent();

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ThemedHero
        title={c.home.heroTitle}
        subtitle={c.home.heroSubtitle}
        ctaLabel={c.home.heroCta}
        ctaUrl={c.info.ticketUrl}
        dateLine={c.home.heroDateLine}
      />
      <InfoStrip
        date={c.meta.festivalDates}
        venue={c.meta.venue}
        city={c.meta.city}
        ticketLabel={c.home.heroCta}
        ticketUrl={c.info.ticketUrl}
      />
      {c.home.videoUrl && (
        <VideoEmbed videoUrl={c.home.videoUrl} title={c.home.videoTitle ?? c.meta.siteTitle} />
      )}
      {c.home.quickLinks && c.home.quickLinks.length > 0 && (
        <QuickLinks items={c.home.quickLinks} />
      )}
      <Highlights items={c.home.highlights} />
      <LineupTeaser
        title={c.home.lineupTeaserTitle}
        ctaLabel={c.home.lineupTeaserCta}
        ctaHref="/lineup/"
        artists={c.lineup.artists}
      />
      <CtaBanner
        title={c.home.ctaBannerTitle}
        subtitle={c.home.ctaBannerSubtitle}
        buttonLabel={c.home.ctaBannerButton}
        buttonUrl={c.info.ticketUrl}
      />
      <SponsorsSection
        sponsors={c.sponsors}
        mainTitle="Főtámogatók"
        sponsorsTitle="Szponzorok"
        partnersTitle="Partnerek"
      />
    </>
  );
}
