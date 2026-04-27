import type { MetadataRoute } from "next";
import { SITE_URL_EN, SITE_URL_HU } from "@/lib/seo";

export const dynamic = "force-static";

const pages = [
  { path: "/",          priority: 1.0,  changeFrequency: "weekly"   as const },
  { path: "/lineup/",   priority: 0.9,  changeFrequency: "weekly"   as const },
  { path: "/program/",  priority: 0.9,  changeFrequency: "weekly"   as const },
  { path: "/info/",     priority: 0.85, changeFrequency: "weekly"   as const },
  { path: "/szallas/",  priority: 0.8,  changeFrequency: "weekly"   as const },
  { path: "/terkep/",   priority: 0.8,  changeFrequency: "monthly"  as const },
  { path: "/tabor/",    priority: 0.75, changeFrequency: "monthly"  as const },
  { path: "/futas/",    priority: 0.75, changeFrequency: "monthly"  as const },
  { path: "/contact/",  priority: 0.7,  changeFrequency: "yearly"   as const },
  { path: "/aszf/",     priority: 0.3,  changeFrequency: "yearly"   as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const { path, priority, changeFrequency } of pages) {
    entries.push({
      url: `${SITE_URL_HU}${path}`,
      lastModified,
      changeFrequency,
      priority,
      alternates: {
        languages: {
          hu: `${SITE_URL_HU}${path}`,
          en: `${SITE_URL_EN}${path}`,
        },
      },
    });
    entries.push({
      url: `${SITE_URL_EN}${path}`,
      lastModified,
      changeFrequency,
      priority,
      alternates: {
        languages: {
          hu: `${SITE_URL_HU}${path}`,
          en: `${SITE_URL_EN}${path}`,
        },
      },
    });
  }

  return entries;
}
