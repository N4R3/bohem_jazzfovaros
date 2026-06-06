import type { MetadataRoute } from "next";
import { getBuildLocale } from "@/lib/buildLocale";
import { siteUrlForLocale } from "@/lib/seo";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const context = process.env.CONTEXT?.toLowerCase();
  const isPreviewDeploy =
    context === "deploy-preview" || context === "branch-deploy" || context === "dev";
  const isProduction =
    context === "production" ||
    (!isPreviewDeploy && !context && process.env.NODE_ENV === "production");
  const locale = getBuildLocale();
  const siteUrl = siteUrlForLocale(locale);

  return {
    rules: {
      userAgent: "*",
      allow: isProduction ? "/" : "",
      disallow: isProduction ? "" : "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
