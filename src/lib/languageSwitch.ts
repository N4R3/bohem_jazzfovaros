import { getBuildLocale } from "@/lib/buildLocale";
import { SITE_URL_EN, SITE_URL_HU } from "@/lib/seo";
import {
  isEnPathname,
  shouldUsePathPrefixLocale,
  stripEnPathPrefix,
  withEnPathPrefix,
} from "@/lib/localeMode";

/** Nyelvváltó gomb felirata — pathname / build locale alapján (kliens-navigációhoz). */
export function languageSwitchLabel(pathname: string): "EN" | "HU" {
  if (shouldUsePathPrefixLocale()) {
    return isEnPathname(pathname) ? "HU" : "EN";
  }
  return getBuildLocale() === "hu" ? "EN" : "HU";
}

/**
 * Belső navigációs link /en prefixszel path-prefix módban (local/staging).
 */
export function localizeInternalHref(href: string, pathname: string): string {
  if (!shouldUsePathPrefixLocale() || !isEnPathname(pathname)) return href;
  if (/^https?:\/\//i.test(href)) return href;
  const normalized = href.startsWith("/") ? href : `/${href}`;
  if (normalized.startsWith("/en")) return normalized;
  return withEnPathPrefix(normalized);
}

/**
 * Nyelvváltó href — alapértelmezés: same-origin /en ↔ / (local + staging).
 * Abszolút cross-domain URL csak két éles production domainnél.
 */
export function languageSwitchHref(pathname: string, targetLocaleLabel: string): string {
  const normalizedPath = stripEnPathPrefix(pathname);

  if (shouldUsePathPrefixLocale()) {
    if (targetLocaleLabel === "EN") {
      return withEnPathPrefix(normalizedPath);
    }
    return normalizedPath;
  }

  if (targetLocaleLabel === "EN") {
    try {
      return new URL(normalizedPath, `${SITE_URL_EN.replace(/\/$/, "")}/`).toString();
    } catch {
      return SITE_URL_EN;
    }
  }

  try {
    return new URL(normalizedPath, `${SITE_URL_HU.replace(/\/$/, "")}/`).toString();
  } catch {
    return SITE_URL_HU;
  }
}
