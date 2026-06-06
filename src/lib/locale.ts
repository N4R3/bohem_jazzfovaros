import type { Locale, SiteContent } from "./types";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { hu } from "@/content/hu";
import { en } from "@/content/en";
import { getBuildLocale } from "./buildLocale";
import {
  resolveRuntimeLocale,
  SITE_LOCALE_COOKIE,
  SITE_LOCALE_HEADER,
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

export const getLocale = cache(async (): Promise<Locale> => {
  const buildLocale = getBuildLocale();
  if (!shouldUsePathPrefixLocale()) {
    return buildLocale;
  }
  const headerStore = await headers();
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
