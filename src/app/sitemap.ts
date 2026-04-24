import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/seo";

export const dynamic = "force-static";

const pages = [
  { path: "/",          priority: 1.0,  changeFrequency: "monthly"  as const },
  { path: "/lineup/",   priority: 0.9,  changeFrequency: "monthly"  as const },
  { path: "/program/",  priority: 0.9,  changeFrequency: "monthly"  as const },
  { path: "/info/",     priority: 0.8,  changeFrequency: "monthly"  as const },
  { path: "/contact/",  priority: 0.7,  changeFrequency: "yearly"   as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return pages.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
