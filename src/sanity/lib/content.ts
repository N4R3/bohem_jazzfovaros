import type { PortableTextBlock } from "@portabletext/react";
import { cache } from "react";
import { getContent, getLocale } from "@/lib/locale";
import type { Artist, Highlight, HomePageVisibleContent, Hotel, ScheduleDay, TicketTier } from "@/lib/types";
import { BASE } from "@/content/base";
import { sanityClient, isSanityConfigured } from "./client";
import {
  getAccommodationItemsQuery,
  getActivePageBySlugQuery,
  getEnabledVideosQuery,
  getHomeTicketsQuery,
  getNavigationItemsQuery,
  getPerformerTicketUrlsQuery,
  getPerformersQuery,
  getProgramItemsQuery,
  getProgramItemsLightQuery,
  getPopupSettingsQuery,
  getSiteSettingsQuery,
  getSponsorsGroupedByCategoryQuery,
  getTransportItemsQuery,
  getVenueQuery,
  getVisibleTicketsQuery,
} from "./queries";
import { sanityImageUrl } from "./image";
import { resolveVideoThumbnailUrl } from "@/lib/videoThumbnail";
import { portableTextToPlain, resolveLocalizedRichOrPlain } from "./portableText";
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
  SanityVideo,
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
              (sponsor.logo ? sanityImageUrl(sponsor.logo, { width: 400 }) : null) ||
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
        (settings.image ? sanityImageUrl(settings.image, { width: 1400 }) : null) ||
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
        id: ticket._id,
        label:
          (locale === "en" ? ticket.nameEn : ticket.nameHu) ||
          ticket.nameHu ||
          ticket.nameEn ||
          "",
        price: [ticket.price, ticket.currency].filter(Boolean).join(" ").trim(),
        highlight: Boolean(locale === "en" ? ticket.badgeEn : ticket.badgeHu),
        descriptionRich:
          resolveLocalizedRichOrPlain(
            locale,
            ticket.descriptionRichHu,
            ticket.descriptionRichEn,
            ticket.descriptionHu,
            ticket.descriptionEn,
          ) || undefined,
        description:
          portableTextToPlain(
            resolveLocalizedRichOrPlain(
              locale,
              ticket.descriptionRichHu,
              ticket.descriptionRichEn,
              ticket.descriptionHu,
              ticket.descriptionEn,
            ),
          ) || undefined,
        ctaUrl:
          ticket.ctaUrl ||
          localized(locale, ticket.ticketUrlHu, ticket.ticketUrlEn) ||
          undefined,
        ctaText:
          localized(locale, ticket.ctaTextHu, ticket.ctaTextEn) ||
          undefined,
        isFeatured: ticket.isFeatured === true,
        isAvailable: ticket.isAvailable !== false,
      }))
      .filter((ticket) => ticket.label);
  } catch {
    return c.info.ticketTiers || [];
  }
});

/** Shape returned for each homepage ticket box. */
export type HomeTicketBox = {
  emoji: string;
  title: string;
  sub: string;
  href: string;
};

/** Emoji cycling for homepage ticket boxes — index-based, keeps the familiar look. */
const HOME_TICKET_EMOJI = ["🎟️", "🎫", "⭐"];

/**
 * Returns homepage ticket boxes driven by Sanity tickets with `showOnHome=true`.
 * Caller should provide a `globalFallbackUrl` (from getTicketUrlWithFallback).
 * Returns an empty array when Sanity is unconfigured or no showOnHome tickets exist,
 * so TicketBoxes can fall back to the static hardcoded boxes.
 */
export const getHomeTicketsWithFallback = cache(
  async (locale: "hu" | "en", globalFallbackUrl: string): Promise<HomeTicketBox[]> => {
    if (!isSanityConfigured()) return [];
    try {
      const tickets = await sanityClient.fetch<SanityTicket[]>(
        getHomeTicketsQuery,
        {},
        SANITY_FETCH_NEXT,
      );
      if (!tickets?.length) return [];
      return tickets
        .map((t, i) => {
          const title = localized(locale, t.nameHu, t.nameEn);
          if (!title) return null;
          const sub =
            localized(locale, t.descriptionHu, t.descriptionEn) ||
            [t.price, t.currency].filter(Boolean).join(" ") ||
            "";
          const href =
            t.ctaUrl ||
            localized(locale, t.ticketUrlHu, t.ticketUrlEn) ||
            globalFallbackUrl;
          return {
            emoji: HOME_TICKET_EMOJI[i % HOME_TICKET_EMOJI.length],
            title,
            sub,
            href,
          };
        })
        .filter((b): b is HomeTicketBox => b !== null);
    } catch {
      return [];
    }
  },
);

export const getEnabledVideosWithFallback = cache(
  async (locale: "hu" | "en"): Promise<
    Array<{
      id: string;
      title: string;
      description?: PortableTextBlock[];
      videoUrl: string;
      thumbnailUrl?: string;
      size: "small" | "medium" | "large" | "full";
      ctaUrl?: string;
      ctaText?: string;
      order: number;
      displayOnPages?: string[];
    }>
  > => {
    if (!isSanityConfigured()) return [];
    try {
      const videos = await sanityClient.fetch<SanityVideo[]>(
        getEnabledVideosQuery,
        {},
        SANITY_FETCH_NEXT,
      );
      return (videos || [])
        .filter((video) => video.enabled !== false && !!video.videoUrl)
        .map((video) => ({
          id: video._id,
          title: localized(locale, video.titleHu, video.titleEn) || "",
          description:
            locale === "en"
              ? video.descriptionEn || video.descriptionHu
              : video.descriptionHu || video.descriptionEn,
          videoUrl: video.videoUrl || "",
          thumbnailUrl: resolveVideoThumbnailUrl(video.thumbnail, video.videoUrl),
          size: video.size || "medium",
          ctaUrl: video.ctaUrl || undefined,
          ctaText: localized(locale, video.ctaTextHu, video.ctaTextEn) || undefined,
          order: video.order || 0,
          displayOnPages: video.displayOnPages || [],
        }))
        .filter((video) => video.videoUrl)
        .sort((a, b) => a.order - b.order);
    } catch {
      return [];
    }
  },
);

function trimOrUndef(s?: string | null): string | undefined {
  const t = typeof s === "string" ? s.trim() : "";
  return t || undefined;
}


export interface CampPageCmsOverlay {
  eyebrow?: string;
  scheduleSectionTitle?: string;
  scheduleBlocks?: Array<{
    title: string;
    items: PortableTextBlock[];
    displayMode: "list" | "paragraphs";
  }>;
  supportersSectionTitle?: string;
  supporters?: Array<{ name: string; url: string }>;
};

export type RunningPageCmsOverlay = {
  eyebrow?: string;
  freeEntryBanner?: PortableTextBlock[];
  cardDate?: string;
  cardTime?: string;
  cardLocation?: PortableTextBlock[];
  distancesSectionTitle?: string;
  distanceRows?: Array<{ category: string; distance: string; fee: string }>;
  entryDeadline?: PortableTextBlock[];
  resultsNote?: PortableTextBlock[];
};

function buildCampOverlay(page: SanityPage, locale: "hu" | "en"): CampPageCmsOverlay {
  const blocksRaw = page.campScheduleBlocks;
  let scheduleBlocks: CampPageCmsOverlay["scheduleBlocks"];
  if (blocksRaw?.length) {
    const mapped = blocksRaw
      .map((b) => {
        const title = localized(locale, b.titleHu, b.titleEn).trim();
        const bulletsRich = locale === "hu" ? b.bulletsRichHu : b.bulletsRichEn;
        const displayMode = b.displayMode || "list";
        const items: PortableTextBlock[] | undefined =
          bulletsRich && bulletsRich.length > 0 ? bulletsRich : undefined;
        return title && items ? { title, items, displayMode } : null;
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
    scheduleBlocks = mapped.length ? mapped : undefined;
  }

  const supporters = (page.campSupporters || []).map((s) => ({
    name: localized(locale, s.nameHu, s.nameEn) || "",
    url: s.url || "",
  }));

  return {
    eyebrow: localized(locale, page.campEyebrowHu, page.campEyebrowEn),
    scheduleSectionTitle: localized(locale, page.campScheduleSectionTitleHu, page.campScheduleSectionTitleEn),
    scheduleBlocks,
    supportersSectionTitle: localized(locale, page.campSupportersSectionTitleHu, page.campSupportersSectionTitleEn),
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

  const pickRich = (hu?: PortableTextBlock[], en?: PortableTextBlock[]): PortableTextBlock[] | undefined => {
    const value = locale === "hu" ? hu : en;
    return value && value.length > 0 ? value : undefined;
  };

  return {
    eyebrow: trimOrUndef(localized(locale, page.runningEyebrowHu, page.runningEyebrowEn)),
    freeEntryBanner: pickRich(page.runningFreeEntryBannerRichHu, page.runningFreeEntryBannerRichEn),
    cardDate: trimOrUndef(localized(locale, page.runningCardDateHu, page.runningCardDateEn)),
    cardTime: trimOrUndef(page.runningCardTime),
    cardLocation: pickRich(page.runningCardLocationRichHu, page.runningCardLocationRichEn),
    distancesSectionTitle: trimOrUndef(
      localized(locale, page.runningDistancesSectionTitleHu, page.runningDistancesSectionTitleEn),
    ),
    distanceRows,
    entryDeadline: pickRich(page.runningEntryDeadlineRichHu, page.runningEntryDeadlineRichEn),
    resultsNote: pickRich(page.runningResultsNoteRichHu, page.runningResultsNoteRichEn),
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
    const [performers, programItems] = await Promise.all([
      sanityClient.fetch<SanityPerformer[]>(getPerformersQuery, {}, SANITY_FETCH_NEXT),
      sanityClient.fetch<SanityProgramItem[]>(getProgramItemsLightQuery, {}, SANITY_FETCH_NEXT),
    ]);
    
    if (!performers?.length) return c.lineup.artists;

    const sortedPerformers = sortPerformersForDisplay(
      performers.filter((performer) => performer.isActive !== false),
      locale,
    );

    // Create a map of performer IDs to their programs
    const performerPrograms = new Map<string, Array<{ date: string; time: string; stage: string; title?: string }>>();
    if (programItems?.length) {
      for (const item of programItems) {
        if (item.performers?.length) {
          for (const perfRef of item.performers) {
            if (perfRef._id) {
              if (!performerPrograms.has(perfRef._id)) {
                performerPrograms.set(perfRef._id, []);
              }
              const stageLabel = item.stageRef
                ? localized(locale, item.stageRef.nameHu, item.stageRef.nameEn)
                : (item.stage || "");
              performerPrograms.get(perfRef._id)!.push({
                date: item.date || "",
                time: item.startTime || "",
                stage: stageLabel,
                title: localized(locale, item.titleHu, item.titleEn) || undefined,
              });
            }
          }
        }
      }
    }

    return sortedPerformers.map((performer) => {
      const tags = (performer.tags || [])
        .filter((tag) => tag?.isActive !== false)
        .map((tag) => localized(locale, tag.titleHu, tag.titleEn))
        .filter((s) => s.length > 0);

      const bioRich = locale === "hu" ? performer.bioRichHu : performer.bioRichEn;
      const bio = bioRich && bioRich.length > 0 ? bioRich : undefined;

      const shortDescriptionRich = locale === "hu" ? performer.shortDescriptionRichHu : performer.shortDescriptionRichEn;
      const shortDescription = shortDescriptionRich && shortDescriptionRich.length > 0 ? shortDescriptionRich : undefined;

      // Convert CMS members to lineup format for display
      const members = (performer.members || [])
        .filter((m) => m?.nameHu)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((m) => {
          const parts: string[] = [];
          if (locale === "hu") {
            parts.push(m.nameHu || "");
          } else {
            parts.push(m.nameEn || m.nameHu || "");
          }
          if (m.instrumentHu && locale === "hu") parts.push(`(${m.instrumentHu})`);
          if (m.instrumentEn && locale === "en") parts.push(`(${m.instrumentEn})`);
          return parts.join(" ");
        });

      return {
        name: performer.name,
        genre: "", // Genre is separate, not populated from shortDescription
        shortDescription,
        bio,
        image:
          (performer.image ? sanityImageUrl(performer.image, { width: 800, height: 800 }) : null) ||
          performer.imagePath ||
          undefined,
        imageDisplayMode: performer.imageDisplayMode || "cover",
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
        lineup: members.length ? members : undefined,
        programs: performerPrograms.get(performer._id),
        ticketUrl:
          localized(locale, performer.ticketUrlHu, performer.ticketUrlEn) || undefined,
        cardBackgroundVariant: performer.cardBackgroundVariant || "navbar",
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

function sortPerformersForDisplay(performers: SanityPerformer[], locale: "hu" | "en"): SanityPerformer[] {
  const collator = locale === "hu" ? "hu" : "en";
  return [...performers].sort((a, b) => {
    const featuredA = a.isFeatured === true;
    const featuredB = b.isFeatured === true;
    if (featuredA !== featuredB) return featuredA ? -1 : 1;

    const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
    if (orderA !== orderB) return orderA - orderB;

    return (a.name || "").localeCompare(b.name || "", collator, { sensitivity: "base" });
  });
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
    const [programItems, programPage, performers] = await Promise.all([
      sanityClient.fetch<SanityProgramItem[]>(getProgramItemsQuery, {}, SANITY_FETCH_NEXT),
      sanityClient.fetch<SanityPage | null>(
        getActivePageBySlugQuery,
        { slug: "program" },
        SANITY_FETCH_NEXT,
      ),
      sanityClient.fetch<Pick<SanityPerformer, "_id" | "ticketUrlHu" | "ticketUrlEn">[]>(
        getPerformerTicketUrlsQuery,
        {},
        SANITY_FETCH_NEXT,
      ),
    ]);

    /* Szabad szöveges program-leírás + megjelenítési mód a Page (slug=program) dokumentumból. */
    const programBodyRich = locale === "hu" ? programPage?.programBodyRichHu : programPage?.programBodyRichEn;
    const freeText = programBodyRich && programBodyRich.length > 0 ? programBodyRich : undefined;
    const rawMode = programPage?.programDisplayMode;
    const displayMode: "structured" | "freeText" | "both" =
      rawMode === "freeText" || rawMode === "both" ? rawMode : "structured";

    if (!programItems?.length && !freeText) return c.program;

    const dayMap = new Map<string, ScheduleDay>();
    const globalTicketUrl = await getTicketUrlWithFallback(locale);
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
      const eventTitle = localized(locale, item.eventTitleHu, item.eventTitleEn).trim();
      const itemTitle = localized(locale, item.titleHu, item.titleEn);
      const primaryTitle =
        eventTitle || itemTitle || performerNames.join(", ");
      const secondaryPerformerNames =
        performerNames.length > 0 && primaryTitle !== performerNames.join(", ")
          ? performerNames
          : undefined;
      const eventTicketUrl = localized(locale, item.ticketUrlHu, item.ticketUrlEn).trim() || undefined;
      let performerTicketUrl: string | undefined;
      if (!eventTicketUrl && item.performers?.length) {
        for (const performer of item.performers) {
          const matched = performers.find((p) => p._id === performer._id);
          const url = localized(locale, matched?.ticketUrlHu, matched?.ticketUrlEn).trim();
          if (url) {
            performerTicketUrl = url;
            break;
          }
        }
      }
      dayMap.get(date)?.slots.push({
        time: item.startTime || "",
        endTime: item.endTime || undefined,
        artist: primaryTitle || "",
        eventTitle: primaryTitle || undefined,
        performerNames: secondaryPerformerNames,
        performers: performerNames.length ? performerNames : undefined,
        stage: stageLabel,
        duration: calculateDuration(item.startTime, item.endTime),
        note:
          resolveLocalizedRichOrPlain(
            locale,
            item.descriptionRichHu,
            item.descriptionRichEn,
            item.descriptionHu,
            item.descriptionEn,
          ) || undefined,
        details:
          (locale === "en"
            ? item.detailsRichEn || item.detailsRichHu
            : item.detailsRichHu || item.detailsRichEn) || undefined,
        ticketUrl: eventTicketUrl || performerTicketUrl || globalTicketUrl || undefined,
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
        portableTextToPlain(
          locale === "hu" ? programPage?.heroDescriptionRichHu : programPage?.heroDescriptionRichEn,
        ) || c.program.subtitle,
      stageMain: c.program.stageMain,
      stageClub: c.program.stageClub,
      days: days.length ? days : c.program.days,
      freeText: freeText || undefined,
      displayMode,
      // Per-device display controls (undefined when not set → frontend falls back to displayMode logic)
      showProgramTableDesktop: programPage?.showProgramTableDesktop,
      showProgramTableMobile: programPage?.showProgramTableMobile,
      showProgramTextDesktop: programPage?.showProgramTextDesktop,
      showProgramTextMobile: programPage?.showProgramTextMobile,
      desktopProgramOrder: (programPage?.desktopProgramOrder === "textFirst" ? "textFirst" : undefined) as "tableFirst" | "textFirst" | undefined,
      mobileProgramOrder: (programPage?.mobileProgramOrder === "textFirst" ? "textFirst" : undefined) as "tableFirst" | "textFirst" | undefined,
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
        descriptionRich:
          resolveLocalizedRichOrPlain(
            locale,
            item.descriptionRichHu,
            item.descriptionRichEn,
            item.descriptionHu,
            item.descriptionEn,
          ),
        description: portableTextToPlain(
          resolveLocalizedRichOrPlain(
            locale,
            item.descriptionRichHu,
            item.descriptionRichEn,
            item.descriptionHu,
            item.descriptionEn,
          ),
        ),
        richBody:
          locale === "en"
            ? item.bodyRichEn || item.bodyRichHu
            : item.bodyRichHu || item.bodyRichEn,
        price: localized(locale, item.priceHu, item.priceEn) || "",
        distance: localized(locale, item.distanceHu, item.distanceEn),
        bookingUrl: item.bookingUrl || item.websiteUrl || "#",
        bookingLabel: localized(locale, item.bookingLabelHu, item.bookingLabelEn) || (locale === "en" ? "Book" : "Foglalás"),
        ctaUrl: item.ctaUrl || undefined,
        ctaText:
          localized(locale, item.ctaTextHu, item.ctaTextEn) ||
          undefined,
        images: item.image
          ? [sanityImageUrl(item.image, { width: 1400 }) || ""]
          : item.imagePath
            ? [item.imagePath]
            : [],
        stars: item.stars,
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
      descriptionRich: undefined,
      mapImage: c.map.mapImage,
      title: c.map.title,
      subtitle: c.map.subtitle,
      directionsHeading: locale === "hu" ? "Hogyan juss el?" : "How to get there?",
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
    const mapImageUrl = venue.mapImage ? (sanityImageUrl(venue.mapImage, { width: 1600 }) ?? c.map.mapImage) : c.map.mapImage;

    return {
      eyebrow: localized(locale, venue.nameHu, venue.nameEn) || BASE.venue.hu,
      mapEmbedUrl: venue.mapEmbedUrl || `https://www.google.com/maps?q=${compactGps}&z=15&output=embed`,
      googleMapsUrl: venue.googleMapsUrl || `https://maps.google.com/?q=${compactGps}`,
      directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${compactGps}`,
      gps,
      descriptionRich:
        resolveLocalizedRichOrPlain(
          locale,
          venue.descriptionRichHu,
          venue.descriptionRichEn,
          venue.descriptionHu,
          venue.descriptionEn,
        ),
      description:
        portableTextToPlain(
          resolveLocalizedRichOrPlain(
            locale,
            venue.descriptionRichHu,
            venue.descriptionRichEn,
            venue.descriptionHu,
            venue.descriptionEn,
          ),
        ) || c.map.mapNote,
      mapImage: mapImageUrl,
      title: localized(locale, venue.titleHu, venue.titleEn) || c.map.title,
      subtitle: localized(locale, venue.subtitleHu, venue.subtitleEn) || c.map.subtitle,
      directionsHeading:
        localized(locale, venue.directionsHeadingHu, venue.directionsHeadingEn) ||
        (locale === "hu" ? "Hogyan juss el?" : "How to get there?"),
    };
  } catch {
    return {
      eyebrow: BASE.venue.hu,
      mapEmbedUrl: `https://www.google.com/maps?q=${c.map.gps.replace(/\s/g, "")}&z=15&output=embed`,
      googleMapsUrl: `https://maps.google.com/?q=${c.map.gps.replace(/\s/g, "")}`,
      directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${c.map.gps.replace(/\s/g, "")}`,
      gps: c.map.gps,
      description: c.map.mapNote,
      descriptionRich: undefined,
      mapImage: c.map.mapImage,
      title: c.map.title,
      subtitle: c.map.subtitle,
      directionsHeading: locale === "hu" ? "Hogyan juss el?" : "How to get there?",
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
        textRich: resolveLocalizedRichOrPlain(
          locale,
          item.descriptionRichHu,
          item.descriptionRichEn,
          item.descriptionHu,
          item.descriptionEn,
        ),
        text:
          portableTextToPlain(
            resolveLocalizedRichOrPlain(
              locale,
              item.descriptionRichHu,
              item.descriptionRichEn,
              item.descriptionHu,
              item.descriptionEn,
            ),
          ) || "",
        url: item.url || "",
      }))
      .filter((item) => item.mode && (item.text || item.textRich?.length));

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
/**
 * Strict locale availability for a Sanity page (R1).
 * A page counts as "available" in a locale when it has a title, hero title, or body
 * in that locale. Used by the root /[slug] and /oldal/[slug] dynamic routes to 404
 * pages that have no content for the current build locale (no silent HU→EN fallback).
 * Fixed routes (program, contact, …) have their own static content and do NOT use this.
 */
export function isPageAvailableInLocale(page: SanityPage, locale: "hu" | "en"): boolean {
  const title = (locale === "en" ? page.titleEn : page.titleHu)?.trim();
  const heroTitle = (locale === "en" ? page.heroTitleEn : page.heroTitleHu)?.trim();
  const body = locale === "en" ? page.pageBodyRichEn : page.pageBodyRichHu;
  return Boolean(title || heroTitle || (body && body.length > 0));
}

const VALID_STAT_ICONS = new Set(["calendar", "globe", "music", "mic"]);

function parseHomeHeroTitle(title: string): [string, string] {
  const trimmed = title.trim();
  if (!trimmed) return ["BOHÉM", "JAZZFŐVÁROS"];

  if (trimmed.includes("\n")) {
    const parts = trimmed.split("\n").map((p) => p.trim()).filter(Boolean);
    if (parts.length >= 2) {
      return [parts[0].toUpperCase(), parts.slice(1).join(" ").toUpperCase()];
    }
  }
  if (trimmed.includes("|")) {
    const parts = trimmed.split("|").map((p) => p.trim()).filter(Boolean);
    if (parts.length >= 2) {
      return [parts[0].toUpperCase(), parts.slice(1).join(" ").toUpperCase()];
    }
  }

  const upper = trimmed.toUpperCase();
  if (/JAZZF[ŐO]V[ÁA]ROS|JAZZ\s*CAPITAL/i.test(upper)) {
    const line1 = /BOH[ÉE]M/i.test(upper) ? "BOHÉM" : "BOHÉM";
    const line2 = upper.includes("JAZZFŐVÁROS")
      ? "JAZZFŐVÁROS"
      : upper.includes("JAZZ CAPITAL")
        ? "JAZZ CAPITAL"
        : upper;
    return [line1, line2];
  }

  return ["BOHÉM", upper];
}

function stripTrailingArrow(label: string): string {
  return label.replace(/\s*[→➔]\s*$/u, "").trim();
}

/**
 * Főoldal látható szövegei — Sanity `home` Page első, hu.ts/en.ts fallback.
 */
export const getHomePageVisibleContent = cache(async (locale: "hu" | "en"): Promise<HomePageVisibleContent> => {
  const c = await getContent();
  const { home } = c;
  const ticketUrl = (await getTicketUrlWithFallback(locale)) || "#";

  const fallbackLocation =
    locale === "en" ? "Kecskemét, Domb Beach" : "Kecskemét, Domb Beach";
  const fallbackDate =
    locale === "en"
      ? (c.meta.festivalDates || "AUG 6–9, 2026").toUpperCase()
      : (c.meta.festivalDates || "2026. AUGUSZTUS 6–9.").toUpperCase();

  let page: SanityPage | null = null;
  if (isSanityConfigured()) {
    try {
      page = await sanityClient.fetch<SanityPage | null>(
        getActivePageBySlugQuery,
        { slug: "home" },
        SANITY_FETCH_NEXT,
      );
    } catch {
      page = null;
    }
  }

  const heroTitleRaw =
    localized(locale, page?.homeHeroTitleHu, page?.homeHeroTitleEn) || home.heroTitle;
  const [heroLine1, heroLine2] = parseHomeHeroTitle(heroTitleRaw);

  const statsFromSanity: Highlight[] = (page?.homeStats || [])
    .map((stat) => {
      const value = stat.value?.trim();
      const label = localized(locale, stat.labelHu, stat.labelEn) || stat.labelHu?.trim() || "";
      const icon = stat.icon && VALID_STAT_ICONS.has(stat.icon) ? stat.icon : "calendar";
      if (!value || !label) return null;
      return { value, label, icon };
    })
    .filter((s): s is Highlight => s !== null);

  const primaryCtaLabel =
    localized(locale, page?.homePrimaryCtaTextHu, page?.homePrimaryCtaTextEn) || home.heroCta;
  const ctaBannerButtonLabel = stripTrailingArrow(
    localized(locale, page?.homeCtaBannerButtonTextHu, page?.homeCtaBannerButtonTextEn) ||
      home.ctaBannerButton ||
      primaryCtaLabel,
  );

  return {
    heroLine1,
    heroLine2,
    heroLocationBadge:
      localized(locale, page?.homeHeroSubtitleHu, page?.homeHeroSubtitleEn) ||
      fallbackLocation,
    heroDateBadge:
      localized(locale, page?.homeHeroLeadHu, page?.homeHeroLeadEn) || fallbackDate,
    primaryCtaLabel,
    primaryCtaUrl: page?.homePrimaryCtaUrl?.trim() || ticketUrl,
    ctaBannerTitle:
      localized(locale, page?.homeCtaBannerTitleHu, page?.homeCtaBannerTitleEn) ||
      home.ctaBannerTitle,
    ctaBannerSubtitle:
      localized(locale, page?.homeCtaBannerTextHu, page?.homeCtaBannerTextEn) ||
      home.ctaBannerSubtitle,
    ctaBannerButtonLabel,
    ctaBannerButtonUrl: page?.homeCtaBannerButtonUrl?.trim() || ticketUrl,
    stats: statsFromSanity.length >= 2 ? statsFromSanity : home.highlights,
  };
});

export const getPageContentBySlug = cache(
  async (
    slug: string,
    locale: "hu" | "en",
  ): Promise<{
    heroTitle?: string;
    heroDescription?: PortableTextBlock[];
    introNote?: PortableTextBlock[];
    body?: PortableTextBlock[];
    showSecondBody?: boolean;
    body2?: PortableTextBlock[];
    videoUrl?: string;
    videoTitle?: string;
    primaryButton?: { label: string; url: string };
    secondaryButton?: { label: string; url: string };
    sections?: SanityPage["sections"];
    infoFaq?: Array<{ question: string; answer: PortableTextBlock[] }>;
    campCms?: CampPageCmsOverlay;
    runningCms?: RunningPageCmsOverlay;
    seo?: SanityPage["seo"];
    found: boolean;
    /** Strict locale availability (R1). Only meaningful when found === true. */
    availableInLocale?: boolean;
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

      const bodyRich = locale === "hu" ? page.pageBodyRichHu : page.pageBodyRichEn;
      const body = bodyRich && bodyRich.length > 0 ? bodyRich : undefined;

      const body2Rich = locale === "hu" ? page.pageBody2RichHu : page.pageBody2RichEn;
      const body2 = body2Rich && body2Rich.length > 0 ? body2Rich : undefined;

      const heroDescriptionRich = locale === "hu" ? page.heroDescriptionRichHu : page.heroDescriptionRichEn;
      const heroDescription = heroDescriptionRich && heroDescriptionRich.length > 0 ? heroDescriptionRich : undefined;

      const introNoteRich = locale === "hu" ? page.introNoteRichHu : page.introNoteRichEn;
      const introNote = introNoteRich && introNoteRich.length > 0 ? introNoteRich : undefined;

      return {
        heroTitle: localized(locale, page.heroTitleHu, page.heroTitleEn) || undefined,
        heroDescription,
        introNote,
        body,
        showSecondBody: page.showSecondBody || false,
        body2,
        videoUrl: page.videoUrl?.trim() || undefined,
        videoTitle: localized(locale, page.videoTitleHu, page.videoTitleEn) || undefined,
        primaryButton:
          primaryLabel && primaryUrl ? { label: primaryLabel, url: primaryUrl } : undefined,
        secondaryButton:
          secondaryLabel && secondaryUrl ? { label: secondaryLabel, url: secondaryUrl } : undefined,
        sections: page.sections,
        infoFaq: (page.infoFaqItems || [])
          .map((item) => {
            const question = localized(locale, item.questionHu, item.questionEn);
            const answer = resolveLocalizedRichOrPlain(
              locale,
              item.answerRichHu,
              item.answerRichEn,
            );
            if (!question || !answer?.length) return null;
            return { question, answer };
          })
          .filter((item): item is { question: string; answer: PortableTextBlock[] } => item !== null),
        campCms: slug === "tabor" || slug === "jazztabor" ? buildCampOverlay(page, locale) : undefined,
        runningCms: slug === "futas" ? buildRunningOverlay(page, locale) : undefined,
        seo: page.seo,
        found: true,
        availableInLocale: isPageAvailableInLocale(page, locale),
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
  "jazztabor",
  "aszf",
  "adatvedelem",
]);

function navHrefFromPageSlug(slug: string | undefined): string | null {
  if (!slug) return null;
  if (slug === "home") return "/";
  if (slug === "tabor") return "/jazztabor/";
  if (FIX_PAGE_SLUGS.has(slug)) return `/${slug}/`;
  /* Új információs oldal — kanonikus /[slug]/ (middleware /oldal/* → redirect). */
  return `/${slug}/`;
}

function buildNavItem(
  item: SanityNavigationItem,
  locale: "hu" | "en",
): NavItem | null {
  // Strict locale label: no cross-locale fallback for nav visibility.
  // An item missing labelEn is hidden from the EN nav (not silently shown in HU).
  const label = (locale === "en"
    ? (item.labelEn || "").trim()
    : (item.labelHu || "").trim());
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
