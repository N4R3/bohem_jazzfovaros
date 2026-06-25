import type { Locale, SiteContent } from "./types";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { hu } from "@/content/hu";
import { en } from "@/content/en";
import { getBuildLocale } from "./buildLocale";
import {
  isEnPathname,
  resolveRuntimeLocale,
  SITE_LOCALE_COOKIE,
  SITE_LOCALE_HEADER,
  SITE_PATHNAME_HEADER,
  shouldUsePathPrefixLocale,
} from "./localeMode";

function localizeContent(content: SiteContent): SiteContent {
  return {
    ...content,
    nav: content.nav,
    otherLocale: content.otherLocale,
    home: {
      ...content.home,
      quickLinks: content.home.quickLinks,
      accompanyingProgrammes: content.home.accompanyingProgrammes,
    },
    footer: {
      ...content.footer,
      legalLinks: content.footer.legalLinks,
    },
  };
}

/**
 * Aktív locale — path-prefix módban a middleware által küldött
 * x-site-pathname a legmegbízhatóbb forrás (/en/... → en).
 */
export const getLocale = cache(async (): Promise<Locale> => {
  const buildLocale = getBuildLocale();
  if (!shouldUsePathPrefixLocale()) {
    return buildLocale;
  }

  const headerStore = await headers();
  const pathname = headerStore.get(SITE_PATHNAME_HEADER);
  if (pathname) {
    return isEnPathname(pathname) ? "en" : "hu";
  }

  const cookieStore = await cookies();
  return resolveRuntimeLocale(buildLocale, {
    header: headerStore.get(SITE_LOCALE_HEADER),
    cookie: cookieStore.get(SITE_LOCALE_COOKIE)?.value ?? null,
  });
});

export const getContent = cache(async (): Promise<SiteContent> => {
  const locale = await getLocale();
  const source = locale === "en" ? en : hu;
  return localizeContent(source);
});
