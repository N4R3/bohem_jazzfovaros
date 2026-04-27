import type { Locale } from "./types";
import { canonicalUrl } from "./seo";

type JsonLd = Record<string, unknown>;

export function websiteSchema(locale: Locale, siteName: string, description: string): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    description,
    url: canonicalUrl("/", locale),
    inLanguage: locale === "en" ? "en" : "hu",
  };
}

export function organizationSchema(locale: Locale, options: {
  name: string;
  url?: string;
  logo?: string;
  sameAs?: string[];
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: options.name,
    url: options.url ?? canonicalUrl("/", locale),
    logo: options.logo ? canonicalUrl(options.logo, locale) : undefined,
    sameAs: options.sameAs,
  };
}

export function breadcrumbSchema(
  locale: Locale,
  items: Array<{ name: string; path: string }>,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: canonicalUrl(item.path, locale),
    })),
  };
}

export function musicEventSchema(options: {
  name: string;
  description: string;
  locale: Locale;
  startDate: string;
  endDate: string;
  venueName: string;
  city: string;
  countryCode?: string;
  organizerName: string;
  imagePath?: string;
  ticketUrl?: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: options.name,
    description: options.description,
    startDate: options.startDate,
    endDate: options.endDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: options.venueName,
      address: {
        "@type": "PostalAddress",
        addressLocality: options.city,
        addressCountry: options.countryCode ?? "HU",
      },
    },
    organizer: {
      "@type": "Organization",
      name: options.organizerName,
      url: canonicalUrl("/", options.locale),
    },
    url: canonicalUrl("/", options.locale),
    image: options.imagePath ? canonicalUrl(options.imagePath, options.locale) : undefined,
    offers: options.ticketUrl
      ? {
          "@type": "Offer",
          url: options.ticketUrl,
          availability: "https://schema.org/InStock",
          priceCurrency: "HUF",
        }
      : undefined,
  };
}

export function faqSchema(items: Array<{ question: string; answer: string }>): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

