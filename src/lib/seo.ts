import { getBuildLocale } from "./buildLocale";

function locale(): ReturnType<typeof getBuildLocale> {
  return getBuildLocale();
}

export const BASE_URL: string =
  locale() === "en"
    ? (process.env.NEXT_PUBLIC_SITE_URL_EN ?? "https://jazzcapital.hu").replace(/\/$/, "")
    : (process.env.NEXT_PUBLIC_SITE_URL_HU ?? "https://jazzfovaros.hu").replace(/\/$/, "");

export const ALT_URL: string =
  locale() === "en"
    ? (process.env.NEXT_PUBLIC_SITE_URL_HU ?? "https://jazzfovaros.hu").replace(/\/$/, "")
    : (process.env.NEXT_PUBLIC_SITE_URL_EN ?? "https://jazzcapital.hu").replace(/\/$/, "");

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
  const loc = locale();
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

export function canonicalUrl(path: string = "/"): string {
  return `${BASE_URL}${path}`;
}
