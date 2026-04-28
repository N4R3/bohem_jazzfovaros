import { cache } from "react";
import { getContent, getLocale } from "@/lib/locale";
import type { Artist, Hotel, ScheduleDay, TicketTier } from "@/lib/types";
import { BASE } from "@/content/base";
import { sanityClient, isSanityConfigured } from "./client";
import {
  getAccommodationItemsQuery,
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
  SanityProgramItem,
  SanityPerformer,
  SanityTicket,
  SanityTransportItem,
  SanityVenue,
  SiteSettings,
  SponsorCategoryWithSponsors,
} from "../types";

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

    return performers.map((performer) => ({
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
      day: "friday",
      stage: "main",
      time: "",
      origin: "",
      websiteUrl: externalLink(performer.websiteUrl),
      youtubeUrl: externalLink(performer.youtubeUrl),
      facebookUrl: externalLink(performer.facebookUrl),
      instagramUrl: externalLink(performer.instagramUrl),
      spotifyUrl: externalLink(performer.spotifyUrl),
    }));
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

function normalizeStage(stage?: string): "main" | "club" {
  const value = (stage || "").toLowerCase();
  if (
    value.includes("main") ||
    value.includes("nagys") ||
    value.includes("fő") ||
    value.includes("fo")
  ) {
    return "main";
  }
  return "club";
}

export const getProgramContent = cache(async (locale: "hu" | "en") => {
  const c = await getContent();

  if (!isSanityConfigured()) return c.program;

  try {
    const [programItems, programPage] = await Promise.all([
      sanityClient.fetch<SanityProgramItem[]>(getProgramItemsQuery, {}, SANITY_FETCH_NEXT),
      sanityClient.fetch<{
        titleHu?: string;
        titleEn?: string;
        heroDescriptionHu?: string;
        heroDescriptionEn?: string;
      } | null>(
        `*[_type == "page" && slug.current == "program" && isActive == true][0]{
          titleHu,titleEn,heroDescriptionHu,heroDescriptionEn
        }`,
        {},
        SANITY_FETCH_NEXT,
      ),
    ]);

    if (!programItems?.length) return c.program;

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

      dayMap.get(date)?.slots.push({
        time: item.startTime || "",
        artist: localized(locale, item.titleHu, item.titleEn),
        stage: normalizeStage(item.stage),
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
