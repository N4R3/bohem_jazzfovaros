import type { Locale, SiteContent } from "./types";
import { cookies } from "next/headers";
import { hu } from "@/content/hu";
import { en } from "@/content/en";

const LOCALE_COOKIE = "NEXT_LOCALE";

function isInternalPath(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

function localizePath(href: string, locale: Locale): string {
  if (!isInternalPath(href)) return href;

  const hasEnPrefix = href === "/en" || href.startsWith("/en/");
  if (locale === "en") {
    if (hasEnPrefix) return href;
    return href === "/" ? "/en/" : `/en${href}`;
  }

  if (!hasEnPrefix) return href;
  const withoutPrefix = href.replace(/^\/en(?=\/|$)/, "");
  return withoutPrefix || "/";
}

function localizeContent(content: SiteContent, locale: Locale): SiteContent {
  return {
    ...content,
    nav: content.nav.map((item) => ({
      ...item,
      href: localizePath(item.href, locale),
    })),
    otherLocale: {
      ...content.otherLocale,
      domain: locale === "en" ? "/" : "/en/",
    },
    home: {
      ...content.home,
      quickLinks: content.home.quickLinks?.map((item) => ({
        ...item,
        href: localizePath(item.href, locale),
      })),
      accompanyingProgrammes: content.home.accompanyingProgrammes?.map((item) => ({
        ...item,
        url: item.url ? localizePath(item.url, locale) : item.url,
      })),
    },
    footer: {
      ...content.footer,
      legalLinks: content.footer.legalLinks.map((item) => ({
        ...item,
        href: localizePath(item.href, locale),
      })),
    },
  };
}

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get(LOCALE_COOKIE)?.value;
  return locale === "en" ? "en" : "hu";
}

export async function getContent(): Promise<SiteContent> {
  const locale = await getLocale();
  const source = locale === "en" ? en : hu;
  return localizeContent(source, locale);
}
