import { NextResponse } from "next/server";
import { pruneUsage, readUsage } from "@/lib/usage/serverMetrics";

/**
 * Aggregált használati riport — kizárólag üzemeltetői célra.
 *
 *   GET /api/usage/?days=14            → napi bontás
 *   GET /api/usage/?days=30&prune=1    → riport + a 30 napnál régebbi shardok törlése
 *
 * Hitelesítés: `Authorization: Bearer <USAGE_STATS_TOKEN>` vagy `?token=`.
 * Ha a `USAGE_STATS_TOKEN` nincs beállítva, a végpont 503-mal zárva marad —
 * így soha nem lehet véletlenül publikusan elérhető.
 *
 * A végpontot a middleware matcher kihagyja (nincs edge execution), a
 * robots.txt pedig tiltja, így botok nem hívogatják.
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_DAYS = 60;
const RATE_LIMIT_WINDOW_MS = 60_000;
/** Hitelesített kérés: drága (Blobs olvasás), ezért szűk korlát. */
const RATE_LIMIT_AUTHORIZED = 10;
/**
 * Bármilyen kérés: tág korlát a flood ellen. Külön számláló kell, mert ha a
 * hitelesítetlen kérések ugyanabból a keretből fogyasztanának, egy bot ki
 * tudná zárni a jogosult üzemeltetőt a saját végpontjáról.
 */
const RATE_LIMIT_TOTAL = 60;

/** Egyszerű, példányonkénti csúszóablak — ez egy manuálisan hívott admin végpont. */
function makeLimiter(max: number) {
  const hits: number[] = [];
  return function limited(): boolean {
    const now = Date.now();
    while (hits.length > 0 && now - hits[0] > RATE_LIMIT_WINDOW_MS) hits.shift();
    if (hits.length >= max) return true;
    hits.push(now);
    return false;
  };
}

const totalLimiter = makeLimiter(RATE_LIMIT_TOTAL);
const authorizedLimiter = makeLimiter(RATE_LIMIT_AUTHORIZED);

/** Konstans idejű összehasonlítás — a token ne legyen kitalálható időzítésből. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function authorize(request: Request): boolean {
  const expected = process.env.USAGE_STATS_TOKEN?.trim();
  if (!expected) return false;
  const header = request.headers.get("authorization") ?? "";
  const bearer = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  const query = new URL(request.url).searchParams.get("token")?.trim() ?? "";
  const provided = bearer || query;
  return provided.length > 0 && safeEqual(provided, expected);
}

const NO_STORE = {
  "Cache-Control": "private, no-store",
  "Netlify-CDN-Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow",
};

export async function GET(request: Request) {
  if (!process.env.USAGE_STATS_TOKEN?.trim()) {
    return NextResponse.json(
      { error: "USAGE_STATS_TOKEN is not configured" },
      { status: 503, headers: NO_STORE },
    );
  }

  const tooMany = NextResponse.json(
    { error: "Too many requests" },
    { status: 429, headers: { ...NO_STORE, "Retry-After": "60" } },
  );

  /* Tág korlát mindenre — a 401 maga olcsó, de a flood így sem tud
     korlátlan függvényhívást generálni. */
  if (totalLimiter()) return tooMany;

  if (!authorize(request)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: NO_STORE },
    );
  }

  /* Szűk korlát a tényleges, Blobs-olvasással járó lekérdezésre. */
  if (authorizedLimiter()) return tooMany;

  const params = new URL(request.url).searchParams;
  const requestedDays = Number.parseInt(params.get("days") ?? "14", 10);
  const days = Number.isFinite(requestedDays)
    ? Math.min(Math.max(requestedDays, 1), MAX_DAYS)
    : 14;

  const report = await readUsage(days);
  if (!report) {
    return NextResponse.json(
      { error: "Blobs store unavailable (Netlify runtime only)" },
      { status: 503, headers: NO_STORE },
    );
  }

  const pruned = params.get("prune") === "1" ? await pruneUsage(days) : 0;

  return NextResponse.json(
    {
      generatedAt: new Date().toISOString(),
      days,
      pruned,
      totals: {
        hits: report.reduce((sum, day) => sum + day.totalHits, 0),
        errors: report.reduce((sum, day) => sum + day.totalErrors, 0),
      },
      daily: report,
    },
    { headers: NO_STORE },
  );
}
