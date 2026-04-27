import { getBuildLocale } from "./buildLocale";
import type { Locale } from "./types";

function normalizeSiteUrl(url: string): string {
  return url.replace(/\/$/, "");
}

export const SITE_URL_HU = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL_HU ?? "https://jazzfovaros.hu",
);
export const SITE_URL_EN = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL_EN ?? "https://jazzcapital.hu",
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
 * HU/EN gomb cél URL-je (build időben égetve).
 *
 * EGY DOMAIN alatt szolgáljuk a két nyelvet:
 *   HU  →  /         (root)
 *   EN  →  /en/      (alkönyvtár)
 *
 * Ezért alapból relatív, azonos-domain útvonalat adunk vissza, hogy az EN
 * gomb NE külső `jazzcapital.hu` URL-re vigyen, hanem az oldal angol
 * fordítására ugyanazon domain-en belül.
 *
 * Felülbírálhatóság (pl. ha valaki mégis külön domain-eket használna):
 *   1) NEXT_PUBLIC_LANGUAGE_SWITCH_URL — explicit cél URL
 *   2) HU build: NEXT_PUBLIC_SITE_URL_EN  |  EN build: NEXT_PUBLIC_SITE_URL_HU
 *
 * Demón újraépítés nélkül: LocaleSwitchAnchor + window.__PEER_LOCALE_URL__.
 */
export function getLanguageSwitchUrl(): string {
  const raw = process.env.NEXT_PUBLIC_LANGUAGE_SWITCH_URL?.trim();
  if (raw) {
    const noSlash = raw.replace(/\/$/, "");
    return noSlash.startsWith("http") ? noSlash : noSlash.startsWith("/") ? noSlash || "/" : `https://${noSlash}`;
  }
  const loc = buildLocale();
  if (loc === "hu") {
    const en = process.env.NEXT_PUBLIC_SITE_URL_EN?.trim();
    if (en) return en.replace(/\/$/, "");
    return "/en/";
  } else {
    const hu = process.env.NEXT_PUBLIC_SITE_URL_HU?.trim();
    if (hu) return hu.replace(/\/$/, "");
    return "/";
  }
}

export function canonicalUrl(path: string = "/", locale?: Locale): string {
  return `${siteUrlForLocale(locale ?? buildLocale())}${path}`;
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
