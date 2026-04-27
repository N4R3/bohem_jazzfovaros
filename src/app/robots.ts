import type { MetadataRoute } from "next";
import { SITE_URL_EN, SITE_URL_HU } from "@/lib/seo";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: [`${SITE_URL_HU}/sitemap.xml`, `${SITE_URL_EN}/sitemap.xml`],
  };
}
