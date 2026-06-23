import { getBuildLocale } from "./buildLocale";
import {
  isTwoDomainProductionMode,
  shouldUsePathPrefixLocale,
  withEnPathPrefix,
} from "./localeMode";
import type { Locale } from "./types";

function normalizeSiteUrl(url: string): string {
  return url.replace(/\/$/, "");
}

// Staging default: bohemjazz.netlify.app (egy site, /en path-prefix).
// GO-LIVE (Netlify dashboard): NEXT_PUBLIC_SITE_URL_HU=https://jazzfovaros.hu
//   NEXT_PUBLIC_SITE_URL_EN=https://jazzfovaros.hu  (ugyanaz az origin — EN = /en/)
// jazzcapital.hu: külső DNS 301 → https://jazzfovaros.hu/en/ (nem Netlify custom domain).
export const SITE_URL_HU = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL_HU ?? "https://bohemjazz.netlify.app",
);
export const SITE_URL_EN = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL_EN ??
    process.env.NEXT_PUBLIC_SITE_URL_HU ??
    "https://bohemjazz.netlify.app",
);

function buildLocale(): Locale {
  return getBuildLocale();
}

export function siteUrlForLocale(locale: Locale): string {
  return locale === "en" ? SITE_URL_EN : SITE_URL_HU;
}

export const BASE_URL: string = siteUrlForLocale(buildLocale());
export const ALT_URL: string = siteUrlForLocale(buildLocale() === "en" ? "hu" : "en");

/**
 * HU/EN gomb alap href (build-time, hu.ts/en.ts otherLocale.domain).
 * Path-prefix módban relatív /en vagy / ; két domainnél abszolút URL.
 */
export function getLanguageSwitchUrl(): string {
  /* Path-prefix: relatív /en — ne írjuk felül abszolút URL-lel (local/staging teszt). */
  if (shouldUsePathPrefixLocale()) {
    return buildLocale() === "hu" ? "/en" : "/";
  }

  const raw = process.env.NEXT_PUBLIC_LANGUAGE_SWITCH_URL?.trim();
  if (raw) {
    const noSlash = raw.replace(/\/$/, "");
    return noSlash.startsWith("http") ? noSlash : noSlash.startsWith("/") ? noSlash || "/" : `https://${noSlash}`;
  }

  const loc = buildLocale();
  if (loc === "hu") {
    return SITE_URL_EN;
  }
  return SITE_URL_HU;
}

function pathForLocale(path: string, locale: Locale): string {
  if (!shouldUsePathPrefixLocale() || locale !== "en") return path;
  return withEnPathPrefix(path);
}

export function canonicalUrl(path: string = "/", locale?: Locale): string {
  const loc = locale ?? buildLocale();
  const localizedPath = pathForLocale(path, loc);
  const base = shouldUsePathPrefixLocale() ? SITE_URL_HU : siteUrlForLocale(loc);
  return `${base}${localizedPath}`;
}

export function metadataAlternates(path: string, locale: Locale) {
  return {
    canonical: canonicalUrl(path, locale),
    languages: {
      hu: canonicalUrl(path, "hu"),
      en: canonicalUrl(path, "en"),
      "x-default": canonicalUrl(path, "hu"),
    },
  };
}

/** Segéd: dokumentáció / debug — két domain mód aktív-e. */
export function isProductionTwoDomainMode(): boolean {
  return isTwoDomainProductionMode();
}
