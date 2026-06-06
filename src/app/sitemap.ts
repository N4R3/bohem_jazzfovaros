import type { MetadataRoute } from "next";
import { getBuildLocale } from "@/lib/buildLocale";
import { siteUrlForLocale } from "@/lib/seo";
import { isSanityConfigured, sanityClient } from "@/sanity/lib/client";
import { getSitemapPagesQuery } from "@/sanity/lib/queries";
import { CORE_PATH_TO_SLUG, getNoIndexSlugsFromSanity } from "@/sanity/lib/sitemapContent";

export const dynamic = "force-static";

const corePages = [
  { path: "/",          priority: 1.0,  changeFrequency: "weekly"   as const },
  { path: "/lineup/",   priority: 0.9,  changeFrequency: "weekly"   as const },
  { path: "/program/",  priority: 0.9,  changeFrequency: "weekly"   as const },
  { path: "/info/",     priority: 0.85, changeFrequency: "weekly"   as const },
  { path: "/szallas/",  priority: 0.8,  changeFrequency: "weekly"   as const },
  { path: "/terkep/",   priority: 0.8,  changeFrequency: "monthly"  as const },
  { path: "/jazztabor/", priority: 0.75, changeFrequency: "monthly"  as const },
  { path: "/futas/",    priority: 0.75, changeFrequency: "monthly"  as const },
  { path: "/contact/",  priority: 0.7,  changeFrequency: "yearly"   as const },
  { path: "/aszf/",     priority: 0.3,  changeFrequency: "yearly"   as const },
  { path: "/adatvedelem/", priority: 0.3, changeFrequency: "yearly" as const },
];

const FIX_SLUGS = new Set([
  "home",
  "info",
  "lineup",
  "program",
  "contact",
  "szallas",
  "terkep",
  "futas",
  "jazztabor",
  "tabor",
  "aszf",
  "adatvedelem",
]);

type SitemapPageDoc = {
  slug?: string;
  _updatedAt?: string;
  noIndex?: boolean;
  hasHu?: boolean;
  hasEn?: boolean;
};

function pathFromSlug(slug?: string): string | null {
  if (!slug) return null;
  if (slug === "home") return "/";
  if (slug === "tabor") return "/jazztabor/";
  if (FIX_SLUGS.has(slug)) return `/${slug}/`;
  return `/oldal/${slug}/`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locale = getBuildLocale();
  const baseUrl = siteUrlForLocale(locale);
  const entries: MetadataRoute.Sitemap = [];
  const noIndexSlugs = await getNoIndexSlugsFromSanity();

  for (const { path, priority, changeFrequency } of corePages) {
    const slug = CORE_PATH_TO_SLUG[path];
    if (slug && noIndexSlugs.has(slug)) continue;
    entries.push({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    });
  }

  if (isSanityConfigured()) {
    try {
      const pages = await sanityClient.fetch<SitemapPageDoc[]>(
        getSitemapPagesQuery,
        {},
        { next: { revalidate: 30 } },
      );
      for (const page of pages || []) {
        if (page.noIndex === true) continue;
        // Exclude dynamic pages that have no content for the current build locale.
        if (locale === "en" && !page.hasEn) continue;
        if (locale === "hu" && !page.hasHu) continue;
        const path = pathFromSlug(page.slug);
        if (!path || corePages.some((corePage) => corePage.path === path)) continue;

        entries.push({
          url: `${baseUrl}${path}`,
          lastModified: page._updatedAt ? new Date(page._updatedAt) : new Date(),
          changeFrequency: "weekly",
          priority: path.startsWith("/oldal/") ? 0.65 : 0.7,
        });
      }
    } catch {
      // Sanity hiba esetén marad a core route sitemap.
    }
  }

  return entries;
}
