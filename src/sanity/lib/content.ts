import { cache } from "react";
import { getContent, getLocale } from "@/lib/locale";
import type { Artist, Hotel, ScheduleDay, TicketTier } from "@/lib/types";
import { BASE } from "@/content/base";
import { sanityClient, isSanityConfigured } from "./client";
import {
  getAccommodationItemsQuery,
  getActivePageBySlugQuery,
  getNavigationItemsQuery,
  getPerformersQuery,
  getProgramItemsQuery,
  getPopupSettingsQuery,
  getSiteSettingsQuery,
  getSponsorsGroupedByCategoryQuery,
  getTransportItemsQuery,
  getVenueQuery,
  getVisibleTicketsQuery,
} from "./queries";
import { urlFor } from "./image";
import type {
  PopupSettings,
  SanityAccommodation,
  SanityNavigationItem,
  SanityPage,
  SanityProgramItem,
  SanityPerformer,
  SanityTicket,
  SanityTransportItem,
  SanityVenue,
  SiteSettings,
  SponsorCategoryWithSponsors,
} from "../types";
import type { NavItem } from "@/lib/types";

/** Egységes ISR a Sanity hívásokhoz (kevesebb API terhelés, friss tartalom ~30 mp-en belül). */
const SANITY_FETCH_NEXT = { next: { revalidate: 30 } } as const;

/** Egy HTTP kérésen belül egyetlen siteSettings lekérés (contact + jegy URL + hasonló). */
const getSiteSettingsCached = cache(async (): Promise<SiteSettings | null> => {
  if (!isSanityConfigured()) return null;
  try {
    return await sanityClient.fetch<SiteSettings | null>(getSiteSettingsQuery, {}, SANITY_FETCH_NEXT);
  } catch {
    return null;
  }
});

export const getFooterSponsorsWithFallback = cache(async () => {
  const c = await getContent();
  const locale = await getLocale();

  if (!isSanityConfigured()) return c.sponsors;

  try {
    const groups = await sanityClient.fetch<SponsorCategoryWithSponsors[]>(
      getSponsorsGroupedByCategoryQuery,
      {},
      SANITY_FETCH_NEXT,
    );
    if (!groups?.length) return c.sponsors;

    const byTitle = new Map(
      groups.map((group) => [
        (locale === "en" ? group.titleEn : group.titleHu)?.toLowerCase() ?? "",
        group.sponsors
          .map((sponsor) => ({
            name: sponsor.name || "",
            logo:
              (sponsor.logo ? urlFor(sponsor.logo)?.width(400).url() : null) ||
              sponsor.logoPath ||
              "",
            url: sponsor.url || "",
          }))
          .filter((sponsor) => sponsor.name && sponsor.logo),
      ]),
    );

    const resolveCategory = (huTitle: string, enTitle: string, fallback: typeof c.sponsors.main) => {
      const fromHu = byTitle.get(huTitle);
      if (fromHu && fromHu.length > 0) return fromHu;
      const fromEn = byTitle.get(enTitle);
      if (fromEn && fromEn.length > 0) return fromEn;
      return fallback;
    };

    return {
      main: resolveCategory("főtámogatók", "main supporters", c.sponsors.main),
      sponsors: resolveCategory("szponzorok", "sponsors", c.sponsors.sponsors),
      partners: resolveCategory("partnerek", "partners", c.sponsors.partners),
    };
  } catch {
    return c.sponsors;
  }
});

export const getPopupSettingsWithFallback = cache(async () => {
  const c = await getContent();
  const locale = await getLocale();

  if (!isSanityConfigured()) {
    return {
      isEnabled: true,
      imageSrc: c.szechenyiImage || "/images/43e3a57583f727d87fb1271bb22963ef.jpg",
      altText:
        locale === "en"
          ? "Széchenyi Plan support information"
          : "Széchenyi Terv támogatási információ",
      sessionStorageKey: "szechenyiPopupShown",
      showOnlyOnHomepage: true,
    };
  }

  try {
    const settings = await sanityClient.fetch<PopupSettings>(getPopupSettingsQuery, {}, SANITY_FETCH_NEXT);
    if (!settings) throw new Error("No popup settings");
    const baseKey = settings.sessionStorageKey || "szechenyiPopupShown";
    /* Minden publikáláskor változik a _rev: új kulcs = a „már láttam” session nem gátol
       re-enable után, és kép/szöveg módosításnál is érthető viselkedés. */
    const sessionStorageKey = settings._rev
      ? `${baseKey}__${settings._rev.replace(/:/g, "_")}`
      : baseKey;
    return {
      isEnabled: settings.isEnabled ?? true,
      imageSrc:
        (settings.image ? urlFor(settings.image)?.width(1400).url() : null) ||
        settings.imagePath ||
        c.szechenyiImage ||
        "/images/43e3a57583f727d87fb1271bb22963ef.jpg",
      altText:
        (locale === "en" ? settings.altEn : settings.altHu) ||
        (locale === "en"
          ? "Széchenyi Plan support information"
          : "Széchenyi Terv támogatási információ"),
      sessionStorageKey,
      showOnlyOnHomepage: settings.showOnlyOnHomepage ?? true,
    };
  } catch {
    return {
      isEnabled: true,
      imageSrc: c.szechenyiImage || "/images/43e3a57583f727d87fb1271bb22963ef.jpg",
      altText:
        locale === "en"
          ? "Széchenyi Plan support information"
          : "Széchenyi Terv támogatási információ",
      sessionStorageKey: "szechenyiPopupShown",
      showOnlyOnHomepage: true,
    };
  }
});

export const getVisibleTicketsWithFallback = cache(async (): Promise<TicketTier[]> => {
  const c = await getContent();
  const locale = await getLocale();
  if (!isSanityConfigured()) return c.info.ticketTiers || [];

  try {
    const tickets = await sanityClient.fetch<SanityTicket[]>(getVisibleTicketsQuery, {}, SANITY_FETCH_NEXT);
    if (!tickets?.length) return c.info.ticketTiers || [];

    return tickets
      .filter((ticket) => ticket.isHidden !== true)
      .map((ticket) => ({
        label:
          (locale === "en" ? ticket.nameEn : ticket.nameHu) ||
          ticket.nameHu ||
          ticket.nameEn ||
          "",
        price: [ticket.price, ticket.currency].filter(Boolean).join(" ").trim(),
        highlight: Boolean(locale === "en" ? ticket.badgeEn : ticket.badgeHu),
      }))
      .filter((ticket) => ticket.label);
  } catch {
    return c.info.ticketTiers || [];
  }
});

function trimOrUndef(s?: string | null): string | undefined {
  const t = typeof s === "string" ? s.trim() : "";
  return t || undefined;
}

function splitBulletLines(raw?: string | null): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Támogató link: # és üres megmarad, egyébként protocol pótlás. */
function supporterHref(raw?: string | null): string {
  const t = typeof raw === "string" ? raw.trim() : "";
  if (!t || t === "#") return "#";
  if (/^https?:\/\//i.test(t)) return t;
  return `https://${t}`;
}

export type CampPageCmsOverlay = {
  eyebrow?: string;
  scheduleSectionTitle?: string;
  scheduleBlocks?: Array<{ title: string; items: string[] }>;
  supportersSectionTitle?: string;
  supporters?: Array<{ name: string; url: string }>;
};

export type RunningPageCmsOverlay = {
  eyebrow?: string;
  freeEntryBanner?: string;
  cardDate?: string;
  cardTime?: string;
  cardLocation?: string;
  distancesSectionTitle?: string;
  distanceRows?: Array<{ category: string; distance: string; fee: string }>;
  entryDeadline?: string;
  resultsNote?: string;
};

function buildCampOverlay(page: SanityPage, locale: "hu" | "en"): CampPageCmsOverlay {
  const blocksRaw = page.campScheduleBlocks;
  let scheduleBlocks: CampPageCmsOverlay["scheduleBlocks"];
  if (blocksRaw?.length) {
    const mapped = blocksRaw
      .map((b) => {
        const title = localized(locale, b.titleHu, b.titleEn).trim();
        const items = splitBulletLines(localized(locale, b.bulletsHu, b.bulletsEn));
        return title ? { title, items } : null;
      })
      .filter((x): x is { title: string; items: string[] } => x !== null);
    scheduleBlocks = mapped.length > 0 ? mapped : undefined;
  }

  let supporters: CampPageCmsOverlay["supporters"];
  const supportersRaw = page.campSupporters;
  if (supportersRaw?.length) {
    const mapped = supportersRaw
      .map((s) => {
        const name = localized(locale, s.nameHu, s.nameEn).trim();
        return name ? { name, url: supporterHref(s.url) } : null;
      })
      .filter((x): x is { name: string; url: string } => x !== null);
    supporters = mapped.length > 0 ? mapped : undefined;
  }

  return {
    eyebrow: trimOrUndef(localized(locale, page.campEyebrowHu, page.campEyebrowEn)),
    scheduleSectionTitle: trimOrUndef(
      localized(locale, page.campScheduleSectionTitleHu, page.campScheduleSectionTitleEn),
    ),
    scheduleBlocks,
    supportersSectionTitle: trimOrUndef(
      localized(locale, page.campSupportersSectionTitleHu, page.campSupportersSectionTitleEn),
    ),
    supporters,
  };
}

function buildRunningOverlay(page: SanityPage, locale: "hu" | "en"): RunningPageCmsOverlay {
  let distanceRows: RunningPageCmsOverlay["distanceRows"];
  const rowsRaw = page.runningDistanceRows;
  if (rowsRaw?.length) {
    const mapped = rowsRaw.map((r) => ({
      category: localized(locale, r.categoryHu, r.categoryEn).trim(),
      distance: localized(locale, r.distanceHu, r.distanceEn).trim(),
      fee: localized(locale, r.feeHu, r.feeEn).trim(),
    }));
    distanceRows = mapped.some((r) => r.category || r.distance || r.fee) ? mapped : undefined;
  }

  return {
    eyebrow: trimOrUndef(localized(locale, page.runningEyebrowHu, page.runningEyebrowEn)),
    freeEntryBanner: trimOrUndef(
      localized(locale, page.runningFreeEntryBannerHu, page.runningFreeEntryBannerEn),
    ),
    cardDate: trimOrUndef(localized(locale, page.runningCardDateHu, page.runningCardDateEn)),
    cardTime: trimOrUndef(page.runningCardTime),
    cardLocation: trimOrUndef(
      localized(locale, page.runningCardLocationHu, page.runningCardLocationEn),
    ),
    distancesSectionTitle: trimOrUndef(
      localized(locale, page.runningDistancesSectionTitleHu, page.runningDistancesSectionTitleEn),
    ),
    distanceRows,
    entryDeadline: trimOrUndef(
      localized(locale, page.runningEntryDeadlineHu, page.runningEntryDeadlineEn),
    ),
    resultsNote: trimOrUndef(localized(locale, page.runningResultsNoteHu, page.runningResultsNoteEn)),
  };
}

/** URL mezők: üres string / whitespace nem gátolja a Sanityből jövő értéket; ha hiányzik a protocol, pótoljuk. */
function externalLink(s?: string | null): string | undefined {
  const t = trimOrUndef(s);
  if (!t) return undefined;
  if (/^https?:\/\//i.test(t)) return t;
  return `https://${t}`;
}

export const getPerformersWithFallback = cache(async (): Promise<Artist[]> => {
  const c = await getContent();
  const locale = await getLocale();
  if (!isSanityConfigured()) return c.lineup.artists;

  try {
    const performers = await sanityClient.fetch<SanityPerformer[]>(getPerformersQuery, {}, SANITY_FETCH_NEXT);
    if (!performers?.length) return c.lineup.artists;

    return performers.map((performer) => {
      const tags = (performer.tags || [])
        .filter((tag) => tag?.isActive !== false)
        .map((tag) => localized(locale, tag.titleHu, tag.titleEn))
        .filter((s) => s.length > 0);
      return {
        name: performer.name,
        genre: performer.shortDescriptionHu || performer.shortDescriptionEn || "",
        bio:
          (locale === "en" ? performer.bioEn : performer.bioHu) ||
          performer.bioHu ||
          performer.bioEn ||
          "",
        image:
          (performer.image ? urlFor(performer.image)?.width(800).height(800).url() : null) ||
          performer.imagePath ||
          undefined,
        day: "friday" as const,
        stage: "",
        time: "",
        origin: "",
        websiteUrl: externalLink(performer.websiteUrl),
        youtubeUrl: externalLink(performer.youtubeUrl),
        facebookUrl: externalLink(performer.facebookUrl),
        instagramUrl: externalLink(performer.instagramUrl),
        spotifyUrl: externalLink(performer.spotifyUrl),
        tags: tags.length ? tags : undefined,
      };
    });
  } catch {
    return c.lineup.artists;
  }
});

function guessTransportIcon(mode: string): string {
  const lower = mode.toLowerCase();
  if (lower.includes("vonat") || lower.includes("train") || lower.includes("rail")) return "train";
  if (lower.includes("autó") || lower.includes("car") || lower.includes("auto")) return "car";
  return "bus";
}

function localized(locale: "hu" | "en", huValue?: string, enValue?: string): string {
  return (locale === "en" ? enValue : huValue) || huValue || enValue || "";
}

function parseMinutes(time?: string): number | null {
  if (!time) return null;
  const [hoursRaw, minsRaw] = time.split(":");
  const hours = Number(hoursRaw);
  const mins = Number(minsRaw);
  if (Number.isNaN(hours) || Number.isNaN(mins)) return null;
  return hours * 60 + mins;
}

function calculateDuration(startTime?: string, endTime?: string): number {
  const start = parseMinutes(startTime);
  const end = parseMinutes(endTime);
  if (start === null || end === null || end <= start) return 0;
  return end - start;
}

/**
 * A programItem.stage értéket a megjelenítésnél nyersen átengedjük (egyetlen forrás = a Sanity mező).
 * A korábbi `normalizeStage` heurisztika átírta volna a címkét „main"/„club"-ra, az UI-on viszont
 * ez félrevezető volt. A frontend most a nyers stage szöveget jeleníti meg, a kétszínes
 * háttér pedig egyszerű név-egyezés alapján dől el.
 */

export const getProgramContent = cache(async (locale: "hu" | "en") => {
  const c = await getContent();

  if (!isSanityConfigured()) return c.program;

  try {
    const [programItems, programPage] = await Promise.all([
      sanityClient.fetch<SanityProgramItem[]>(getProgramItemsQuery, {}, SANITY_FETCH_NEXT),
      sanityClient.fetch<SanityPage | null>(
        getActivePageBySlugQuery,
        { slug: "program" },
        SANITY_FETCH_NEXT,
      ),
    ]);

    /* Szabad szöveges program-leírás + megjelenítési mód a Page (slug=program) dokumentumból. */
    const freeText = localized(
      locale,
      programPage?.programBodyHu,
      programPage?.programBodyEn,
    ).trim();
    const rawMode = programPage?.programDisplayMode;
    const displayMode: "structured" | "freeText" | "both" =
      rawMode === "freeText" || rawMode === "both" ? rawMode : "structured";

    if (!programItems?.length && !freeText) return c.program;

    const dayMap = new Map<string, ScheduleDay>();
    for (const item of programItems) {
      const date = item.date;
      if (!date) continue;
      if (!dayMap.has(date)) {
        const dateObj = new Date(`${date}T00:00:00`);
        const dayName = dateObj.toLocaleDateString(locale === "en" ? "en-GB" : "hu-HU", {
          weekday: "long",
        });
        const dayLabel =
          locale === "en"
            ? `${dayName.charAt(0).toUpperCase()}${dayName.slice(1)}`
            : `${dayName.charAt(0).toUpperCase()}${dayName.slice(1)}`;
        dayMap.set(date, { label: dayLabel, date, slots: [] });
      }

      /* Stage: elsőbbség a stageRef-en (új CMS megoldás), fallback a legacy `stage` szöveg.
         A frontend nyersen mutatja, nincs heurisztikus átírás. */
      const stageFromRef = item.stageRef
        ? localized(locale, item.stageRef.nameHu, item.stageRef.nameEn).trim()
        : "";
      const stageLabel = stageFromRef || (item.stage || "").trim();

      /* Cím: ha vannak fellépők, az ő neveiket fűzzük össze; egyébként a programItem cím. */
      const performerNames = (item.performers || [])
        .map((p) => p?.name || "")
        .filter((n) => n.length > 0);
      const itemTitle = localized(locale, item.titleHu, item.titleEn);
      const artistLabel =
        performerNames.length > 0 ? performerNames.join(", ") : itemTitle;

      dayMap.get(date)?.slots.push({
        time: item.startTime || "",
        artist: artistLabel,
        stage: stageLabel,
        duration: calculateDuration(item.startTime, item.endTime),
        note: localized(locale, item.descriptionHu, item.descriptionEn) || undefined,
      });
    }

    const days = Array.from(dayMap.values())
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((day) => ({
        ...day,
        slots: day.slots.sort((a, b) => (a.time || "").localeCompare(b.time || "")),
      }));

    return {
      title: localized(locale, programPage?.titleHu, programPage?.titleEn) || c.program.title,
      subtitle:
        localized(
          locale,
          programPage?.heroDescriptionHu,
          programPage?.heroDescriptionEn,
        ) || c.program.subtitle,
      stageMain: c.program.stageMain,
      stageClub: c.program.stageClub,
      days: days.length ? days : c.program.days,
      freeText: freeText || undefined,
      displayMode,
    };
  } catch {
    return c.program;
  }
});

export const getAccommodationContent = cache(async (locale: "hu" | "en") => {
  const c = await getContent();

  if (!isSanityConfigured()) return c.accommodation;

  try {
    const items = await sanityClient.fetch<SanityAccommodation[]>(getAccommodationItemsQuery, {}, SANITY_FETCH_NEXT);
    if (!items?.length) return c.accommodation;

    const hotels: Hotel[] = items
      .filter((item) => item.isActive !== false && item.name)
      .map((item) => ({
        name: item.name || "",
        description: localized(locale, item.descriptionHu, item.descriptionEn),
        price: "",
        distance: localized(locale, item.distanceHu, item.distanceEn),
        bookingUrl: item.bookingUrl || item.websiteUrl || "#",
        bookingLabel: locale === "en" ? "Book now →" : "Foglalás →",
        images: item.image
          ? [urlFor(item.image)?.width(1400).url() || ""]
          : item.imagePath
            ? [item.imagePath]
            : [],
        stars: undefined,
      }))
      .map((hotel) => ({
        ...hotel,
        images: hotel.images.filter(Boolean),
      }));

    if (!hotels.length) return c.accommodation;
    return {
      ...c.accommodation,
      hotels,
    };
  } catch {
    return c.accommodation;
  }
});

export const getVenueContent = cache(async (locale: "hu" | "en") => {
  const c = await getContent();
  if (!isSanityConfigured()) {
    return {
      eyebrow: BASE.venue.hu,
      mapEmbedUrl: `https://www.google.com/maps?q=${c.map.gps.replace(/\s/g, "")}&z=15&output=embed`,
      googleMapsUrl: `https://maps.google.com/?q=${c.map.gps.replace(/\s/g, "")}`,
      directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${c.map.gps.replace(/\s/g, "")}`,
      gps: c.map.gps,
      description: c.map.mapNote,
      mapImage: c.map.mapImage,
      title: c.map.title,
      subtitle: c.map.subtitle,
    };
  }

  try {
    const venue = await sanityClient.fetch<SanityVenue | null>(getVenueQuery, {}, SANITY_FETCH_NEXT);
    if (!venue) throw new Error("No venue");
    const gps =
      venue.latitude !== undefined && venue.longitude !== undefined
        ? `${venue.latitude}, ${venue.longitude}`
        : c.map.gps;
    const compactGps = gps.replace(/\s/g, "");

    return {
      eyebrow: localized(locale, venue.nameHu, venue.nameEn) || BASE.venue.hu,
      mapEmbedUrl: venue.mapEmbedUrl || `https://www.google.com/maps?q=${compactGps}&z=15&output=embed`,
      googleMapsUrl: venue.googleMapsUrl || `https://maps.google.com/?q=${compactGps}`,
      directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${compactGps}`,
      gps,
      description: localized(locale, venue.descriptionHu, venue.descriptionEn) || c.map.mapNote,
      mapImage: c.map.mapImage,
      title: c.map.title,
      subtitle: c.map.subtitle,
    };
  } catch {
    return {
      eyebrow: BASE.venue.hu,
      mapEmbedUrl: `https://www.google.com/maps?q=${c.map.gps.replace(/\s/g, "")}&z=15&output=embed`,
      googleMapsUrl: `https://maps.google.com/?q=${c.map.gps.replace(/\s/g, "")}`,
      directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${c.map.gps.replace(/\s/g, "")}`,
      gps: c.map.gps,
      description: c.map.mapNote,
      mapImage: c.map.mapImage,
      title: c.map.title,
      subtitle: c.map.subtitle,
    };
  }
});

export const getTransportContent = cache(async (locale: "hu" | "en") => {
  const c = await getContent();
  if (!isSanityConfigured()) return c.map.directions;

  try {
    const items = await sanityClient.fetch<SanityTransportItem[]>(getTransportItemsQuery, {}, SANITY_FETCH_NEXT);
    if (!items?.length) return c.map.directions;

    const directions = items
      .filter((item) => item.isActive !== false)
      .map((item) => ({
        mode: localized(locale, item.titleHu, item.titleEn),
        icon: item.icon || guessTransportIcon(localized(locale, item.titleHu, item.titleEn)),
        text: localized(locale, item.descriptionHu, item.descriptionEn),
        url: item.url || "",
      }))
      .filter((item) => item.mode && item.text);

    return directions.length ? directions : c.map.directions;
  } catch {
    return c.map.directions;
  }
});

export const getContactContent = cache(async (locale: "hu" | "en") => {
  const c = await getContent();
  if (!isSanityConfigured()) return c.contact;

  try {
    const siteSettings = await getSiteSettingsCached();
    if (!siteSettings) return c.contact;

    return {
      ...c.contact,
      organizer: siteSettings.organizationName || c.contact.organizer,
      email: siteSettings.contactEmail || c.contact.email,
      phone: siteSettings.contactPhone || c.contact.phone,
      volunteerText:
        localized(locale, siteSettings.volunteerButtonLabelHu, siteSettings.volunteerButtonLabelEn) ||
        c.contact.volunteerText,
      volunteerUrl: siteSettings.volunteerUrl || c.contact.volunteerUrl,
      houseRulesPdf: siteSettings.houseRulesPdf || c.houseRulesPdf,
      socials: {
        facebook: siteSettings.facebookUrl || c.contact.socials.facebook,
        instagram: siteSettings.instagramUrl || c.contact.socials.instagram,
        youtube: siteSettings.youtubeUrl || c.contact.socials.youtube,
      },
    };
  } catch {
    return c.contact;
  }
});

/**
 * Sanity-ből szerkeszthető oldal-tartalom. A fix oldalakon (tabor, futas, contact, …) a hero
 * cím / leírás és a `pageBody` szöveges tartalom hozzáadható a meglévő dizájn fölé. Ha nincs
 * Sanity adat (vagy az isActive=false), a fix oldal saját kódbeli tartalma változatlan marad.
 */
export const getPageContentBySlug = cache(
  async (
    slug: string,
    locale: "hu" | "en",
  ): Promise<{
    heroTitle?: string;
    heroDescription?: string;
    body?: string;
    showSecondBody?: boolean;
    body2?: string;
    primaryButton?: { label: string; url: string };
    secondaryButton?: { label: string; url: string };
    campCms?: CampPageCmsOverlay;
    runningCms?: RunningPageCmsOverlay;
    seo?: SanityPage["seo"];
    found: boolean;
  }> => {
    if (!isSanityConfigured()) return { found: false };
    try {
      const page = await sanityClient.fetch<SanityPage | null>(
        getActivePageBySlugQuery,
        { slug },
        SANITY_FETCH_NEXT,
      );
      if (!page) return { found: false };

      const primaryLabel = localized(locale, page.primaryButtonLabelHu, page.primaryButtonLabelEn);
      const primaryUrl = localized(locale, page.primaryButtonUrlHu, page.primaryButtonUrlEn);
      const secondaryLabel = localized(locale, page.secondaryButtonLabelHu, page.secondaryButtonLabelEn);
      const secondaryUrl = localized(locale, page.secondaryButtonUrlHu, page.secondaryButtonUrlEn);

      return {
        heroTitle: localized(locale, page.heroTitleHu, page.heroTitleEn) || undefined,
        heroDescription:
          localized(locale, page.heroDescriptionHu, page.heroDescriptionEn) || undefined,
        body: localized(locale, page.pageBodyHu, page.pageBodyEn).trim() || undefined,
        showSecondBody: page.showSecondBody || false,
        body2: localized(locale, page.pageBody2Hu, page.pageBody2En).trim() || undefined,
        primaryButton:
          primaryLabel && primaryUrl ? { label: primaryLabel, url: primaryUrl } : undefined,
        secondaryButton:
          secondaryLabel && secondaryUrl ? { label: secondaryLabel, url: secondaryUrl } : undefined,
        campCms: slug === "tabor" ? buildCampOverlay(page, locale) : undefined,
        runningCms: slug === "futas" ? buildRunningOverlay(page, locale) : undefined,
        seo: page.seo,
        found: true,
      };
    } catch {
      return { found: false };
    }
  },
);

/**
 * Navigation menü (header / footer) Sanity-ből, fallback a kódban rögzített `c.nav` tömbre.
 * A linket az alábbi prioritás alapján képezzük:
 *   externalUrl  >  href  >  page.slug → fix oldal route vagy /oldal/[slug]
 */
const FIX_PAGE_SLUGS = new Set([
  "home",
  "info",
  "lineup",
  "program",
  "contact",
  "szallas",
  "terkep",
  "futas",
  "tabor",
  "aszf",
]);

function navHrefFromPageSlug(slug: string | undefined): string | null {
  if (!slug) return null;
  if (slug === "home") return "/";
  if (FIX_PAGE_SLUGS.has(slug)) return `/${slug}/`;
  /* Új információs oldal a dinamikus /oldal/[slug] route-on érhető el. */
  return `/oldal/${slug}/`;
}

function buildNavItem(
  item: SanityNavigationItem,
  locale: "hu" | "en",
): NavItem | null {
  const label = localized(locale, item.labelHu, item.labelEn);
  if (!label) return null;
  const ext = (item.externalUrl || "").trim();
  if (ext) {
    return { label, href: ext, external: true, openInNewTab: true };
  }
  const href = (item.href || "").trim();
  if (href) {
    return {
      label,
      href,
      external: /^https?:\/\//i.test(href),
      openInNewTab: item.openInNewTab === true,
    };
  }
  const slug = item.page?.slug?.current;
  const fromPage = navHrefFromPageSlug(slug);
  if (fromPage && item.page?.isActive !== false) {
    return {
      label,
      href: fromPage,
      external: false,
      openInNewTab: item.openInNewTab === true,
    };
  }
  return null;
}

export const getNavigationWithFallback = cache(
  async (
    placement: "header" | "footer" = "header",
  ): Promise<NavItem[]> => {
    const c = await getContent();
    const locale = await getLocale();
    if (!isSanityConfigured()) return c.nav;
    try {
      const items = await sanityClient.fetch<SanityNavigationItem[]>(
        getNavigationItemsQuery,
        {},
        SANITY_FETCH_NEXT,
      );
      if (!items?.length) return c.nav;
      const filtered = items.filter((item) =>
        placement === "header"
          ? item.showInHeader !== false
          : item.showInFooter === true,
      );
      const built = filtered
        .map((item) => buildNavItem(item, locale))
        .filter((n): n is NavItem => n !== null);
      return built.length > 0
        ? built
        : placement === "footer"
          ? c.nav.slice(0, 5)
          : c.nav;
    } catch {
      return placement === "footer" ? c.nav.slice(0, 5) : c.nav;
    }
  },
);

export const getTicketUrlWithFallback = cache(async (locale: "hu" | "en"): Promise<string> => {
  const c = await getContent();
  const fallback = c.info.ticketUrl || "#";
  if (!isSanityConfigured()) return fallback;

  try {
    const siteSettings = await getSiteSettingsCached();
    if (!siteSettings) return fallback;
    const url = locale === "en" ? siteSettings.ticketUrlEn : siteSettings.ticketUrlHu;
    return url || fallback;
  } catch {
    return fallback;
  }
});
