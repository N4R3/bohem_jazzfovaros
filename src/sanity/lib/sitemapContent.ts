import { cache } from "react";
import { isSanityConfigured, sanityClient } from "./client";
import { getSitemapPagesQuery } from "./queries";

/** Fix oldal útvonal → Sanity Page slug (sitemap noIndex szűréshez). */
export const CORE_PATH_TO_SLUG: Record<string, string> = {
  "/": "home",
  "/lineup/": "lineup",
  "/program/": "program",
  "/info/": "info",
  "/szallas/": "szallas",
  "/terkep/": "terkep",
  "/jazztabor/": "jazztabor",
  "/futas/": "futas",
  "/contact/": "contact",
  "/aszf/": "aszf",
  "/adatvedelem/": "adatvedelem",
};

export const getNoIndexSlugsFromSanity = cache(async (): Promise<Set<string>> => {
  if (!isSanityConfigured()) return new Set();
  try {
    const pages = await sanityClient.fetch<Array<{ slug?: string; noIndex?: boolean }>>(
      getSitemapPagesQuery,
      {},
      { next: { revalidate: 30 } },
    );
    return new Set(
      (pages || [])
        .filter((p) => p.noIndex === true && typeof p.slug === "string")
        .map((p) => p.slug as string),
    );
  } catch {
    return new Set();
  }
});
