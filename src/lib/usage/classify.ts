/**
 * Kérés-osztályozás a használati statisztikához.
 *
 * Cél: alacsony kardinalitású címkék (route / kind / audience / ua), hogy az
 * aggregált napi számlálók mérete korlátos maradjon, és NE tároljunk
 * személyes adatot (se IP, se teljes user-agent, se query string).
 *
 * Edge- és Node-runtime alatt egyaránt fut — csak natív JS, nincs import.
 */

/** Ismert, fix útvonalak — minden más `/:slug` vagy `/other` gyűjtőbe kerül. */
const KNOWN_ROUTES = new Set([
  "/",
  "/lineup",
  "/program",
  "/info",
  "/szallas",
  "/terkep",
  "/jazztabor",
  "/futas",
  "/contact",
  "/aszf",
  "/adatvedelem",
  "/tabor",
]);

export type RequestKind = "html" | "rsc" | "prefetch" | "redirect" | "asset";
export type Audience = "public" | "admin";
export type UaCategory = "bot" | "browser" | "other";

/**
 * Útvonal normalizálása statisztikai kulccsá.
 * `/en/lineup/` → `en:/lineup`, `/valami-oldal/` → `/:slug`
 */
export function classifyRoute(pathname: string): string {
  let path = pathname.replace(/\/+$/, "") || "/";

  let prefix = "";
  if (path === "/en" || path.startsWith("/en/")) {
    prefix = "en:";
    path = path.slice(3) || "/";
  }

  if (path.startsWith("/studio")) return `${prefix}/studio`;
  if (path.startsWith("/api")) return `${prefix}/api`;
  if (path.startsWith("/_next")) return `${prefix}/_next`;
  if (KNOWN_ROUTES.has(path)) return `${prefix}${path}`;
  if (path.startsWith("/oldal/")) return `${prefix}/oldal/:slug`;
  return `${prefix}/:slug`;
}

/**
 * A kérés típusa (nem tartalmaz PII-t).
 *
 * A Next.js a middleware elől kiszűri a belső router-jeleket — sem az `RSC` /
 * `Next-Router-Prefetch` fejléc, sem a `?_rsc=` query paraméter nem látszik ott.
 * Edge oldalon ezért a szabványos `Sec-Fetch-Dest` dönt: teljes oldalletöltésnél
 * `document`, a router fetch-jénél `empty`. Szerver oldalon a fejlécek is
 * elérhetők, ott azok pontosabbak.
 */
export function classifyRequestKind(
  headers: { get(name: string): string | null },
  search?: URLSearchParams | null,
): RequestKind {
  if (headers.get("next-router-prefetch")) return "prefetch";
  if (headers.get("rsc")) return "rsc";
  if (search?.has("_rsc")) return "rsc";
  return headers.get("sec-fetch-dest") === "empty" ? "rsc" : "html";
}

export function classifyAudience(pathname: string): Audience {
  return pathname.startsWith("/studio") ? "admin" : "public";
}

const BOT_PATTERN =
  /bot|crawler|spider|crawling|slurp|bingpreview|facebookexternalhit|embedly|quora link preview|whatsapp|telegram|discord|preview|monitor|uptime|headless|lighthouse|pagespeed|gtmetrix|python-requests|curl|wget|axios|go-http-client|java\/|okhttp|scrapy|semrush|ahrefs|mj12|dotbot|petalbot|bytespider|gptbot|claudebot|ccbot|perplexity/i;

/** Csak kategória kerül naplóba — a teljes user-agent string soha. */
export function classifyUserAgent(userAgent: string | null): UaCategory {
  if (!userAgent) return "other";
  if (BOT_PATTERN.test(userAgent)) return "bot";
  if (/mozilla|chrome|safari|firefox|edge|opera/i.test(userAgent)) return "browser";
  return "other";
}

export function statusClass(status: number): string {
  if (status >= 500) return "5xx";
  if (status >= 400) return "4xx";
  if (status >= 300) return "3xx";
  return "2xx";
}

/** UTC nap — a napi bontású aggregálás kulcsa. */
export function utcDay(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}
