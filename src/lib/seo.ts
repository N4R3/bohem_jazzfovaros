const locale = process.env.NEXT_PUBLIC_LOCALE ?? "hu";

export const BASE_URL: string =
  locale === "en"
    ? (process.env.NEXT_PUBLIC_SITE_URL_EN ?? "https://jazzcapital.hu")
    : (process.env.NEXT_PUBLIC_SITE_URL_HU ?? "https://jazzfovaros.hu");

export const ALT_URL: string =
  locale === "en"
    ? (process.env.NEXT_PUBLIC_SITE_URL_HU ?? "https://jazzfovaros.hu")
    : (process.env.NEXT_PUBLIC_SITE_URL_EN ?? "https://jazzcapital.hu");

export function canonicalUrl(path: string = "/"): string {
  return `${BASE_URL}${path}`;
}
