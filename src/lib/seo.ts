const locale = process.env.NEXT_PUBLIC_LOCALE ?? "hu";

export const BASE_URL: string =
  locale === "en"
    ? (process.env.NEXT_PUBLIC_SITE_URL_EN ?? "https://jazzcapital.hu")
    : (process.env.NEXT_PUBLIC_SITE_URL_HU ?? "https://jazzfovaros.hu");

export const ALT_URL: string =
  locale === "en"
    ? (process.env.NEXT_PUBLIC_SITE_URL_HU ?? "https://jazzfovaros.hu")
    : (process.env.NEXT_PUBLIC_SITE_URL_EN ?? "https://jazzcapital.hu");

/**
 * HU/EN gomb cél URL-je (build időben égetve).
 * 1) NEXT_PUBLIC_LANGUAGE_SWITCH_URL
 * 2) HU build: NEXT_PUBLIC_SITE_URL_EN | EN build: NEXT_PUBLIC_SITE_URL_HU (üres string nem számít)
 * 3) ALT_URL (alapértelmezés: jazzfovaros.hu / jazzcapital.hu)
 *
 * Demón újraépítés nélkül: LocaleSwitchAnchor + window.__PEER_LOCALE_URL__ (Netlify snippet).
 */
export function getLanguageSwitchUrl(): string {
  const raw = process.env.NEXT_PUBLIC_LANGUAGE_SWITCH_URL?.trim();
  if (raw) {
    const noSlash = raw.replace(/\/$/, "");
    return noSlash.startsWith("http") ? noSlash : `https://${noSlash}`;
  }
  if (locale === "hu") {
    const en = process.env.NEXT_PUBLIC_SITE_URL_EN?.trim();
    if (en) return en.replace(/\/$/, "");
  } else {
    const hu = process.env.NEXT_PUBLIC_SITE_URL_HU?.trim();
    if (hu) return hu.replace(/\/$/, "");
  }
  return ALT_URL;
}

export function canonicalUrl(path: string = "/"): string {
  return `${BASE_URL}${path}`;
}
