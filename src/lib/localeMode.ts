import type { Locale } from "./types";

const SITE_LOCALE_HEADER = "x-site-locale";
const SITE_LOCALE_COOKIE = "site-locale";

export { SITE_LOCALE_HEADER, SITE_LOCALE_COOKIE };

export function normalizeSiteUrl(url: string): string {
  const trimmed = url.trim().replace(/\/$/, "");
  return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
}

function siteOrigin(url: string): string | null {
  try {
    return new URL(normalizeSiteUrl(url)).origin;
  } catch {
    return null;
  }
}

function hostnameFromSiteUrl(url: string): string | null {
  try {
    return new URL(normalizeSiteUrl(url)).hostname;
  } catch {
    return null;
  }
}

/** Local dev / Netlify staging — /en path-prefix, nem cross-domain váltás. */
export function isStagingOrLocalHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  return (
    h === "localhost" ||
    h === "127.0.0.1" ||
    h.endsWith(".netlify.app") ||
    h.endsWith(".localhost")
  );
}

/**
 * Két külön production domain (különböző origin, mindkettő éles host).
 * Localhost / netlify.app staging → mindig false.
 */
export function isTwoDomainProductionMode(): boolean {
  const hu = process.env.NEXT_PUBLIC_SITE_URL_HU?.trim();
  const en = process.env.NEXT_PUBLIC_SITE_URL_EN?.trim();
  if (!hu || !en) return false;

  const huOrigin = siteOrigin(hu);
  const enOrigin = siteOrigin(en);
  if (!huOrigin || !enOrigin || huOrigin === enOrigin) return false;

  const huHost = hostnameFromSiteUrl(hu);
  const enHost = hostnameFromSiteUrl(en);
  if (!huHost || !enHost) return false;

  if (isStagingOrLocalHost(huHost) || isStagingOrLocalHost(enHost)) {
    return false;
  }

  return true;
}

/**
 * Nyelvváltó és /en middleware: relatív /en path használata.
 * Böngészőben a jelenlegi host elsőbbséget élvez (staging/local mindig /en).
 */
export function shouldUsePathPrefixLocale(runtimeHostname?: string): boolean {
  if (runtimeHostname && isStagingOrLocalHost(runtimeHostname)) {
    return true;
  }
  if (typeof window !== "undefined" && isStagingOrLocalHost(window.location.hostname)) {
    return true;
  }
  const hu = process.env.NEXT_PUBLIC_SITE_URL_HU?.trim();
  const en = process.env.NEXT_PUBLIC_SITE_URL_EN?.trim();
  if (hu && en) {
    const huOrigin = siteOrigin(hu);
    const enOrigin = siteOrigin(en);
    if (huOrigin && enOrigin && huOrigin === enOrigin) {
      return true;
    }
  }
  return !isTwoDomainProductionMode();
}

/** @deprecated use shouldUsePathPrefixLocale */
export function usesPathPrefixLocale(): boolean {
  return shouldUsePathPrefixLocale();
}

export function isEnPathname(pathname: string): boolean {
  return pathname === "/en" || pathname.startsWith("/en/");
}

export function stripEnPathPrefix(pathname: string): string {
  const stripped = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  return stripped;
}

export function withEnPathPrefix(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") return "/en";
  if (normalized.startsWith("/en")) return normalized;
  return `/en${normalized}`;
}

export function resolveRuntimeLocale(
  buildLocale: Locale,
  hints: { header?: string | null; cookie?: string | null },
): Locale {
  if (!shouldUsePathPrefixLocale()) {
    return buildLocale;
  }
  if (hints.header === "en" || hints.header === "hu") return hints.header;
  if (hints.cookie === "en" || hints.cookie === "hu") return hints.cookie;
  return buildLocale;
}
