/**
 * Tartós, aggregált használati számlálók (napi bontásban).
 *
 * Miért kell: a Netlify log retention ~24 óra, így egy költségrobbanás okát
 * utólag nem lehet visszakeresni. Ez a modul NEM naplóz kérésenként — csak
 * memóriában számlál, és példányonként legfeljebb percenként egyszer ír ki egy
 * pár száz bájtos aggregátumot a Netlify Blobs tárolóba. Nincs extra
 * függvényhívás, nincs külső szolgáltatás, nincs személyes adat.
 *
 * Adatmodell — soronként csak alacsony kardinalitású címkék:
 *   { day, route, kind, audience, ua, status } -> { hits, errors }
 *
 * Írás: `daily/<nap>/<példány-id>` kulcsra, példányonként külön shardba, így a
 * párhuzamos függvénypéldányok nem írják felül egymás számlálóit (nincs
 * read-modify-write versenyhelyzet). Az összegzés olvasáskor történik.
 *
 * Kikapcsolás: USAGE_METRICS=0
 */
import { headers } from "next/headers";
import { after } from "next/server";
import { SITE_PATHNAME_HEADER, shouldUsePathPrefixLocale } from "@/lib/localeMode";
import {
  classifyAudience,
  classifyRequestKind,
  classifyRoute,
  classifyUserAgent,
  statusClass,
  utcDay,
} from "./classify";

const STORE_NAME = "usage-metrics";
const FLUSH_INTERVAL_MS = 60_000;
/** Védelem elszabadult kardinalitás ellen — efelett nem veszünk fel új kulcsot. */
const MAX_BUCKETS_PER_DAY = 500;

export type UsageBucket = { hits: number; errors: number };
export type UsageShard = Record<string, UsageBucket>;

/** Egy függvénypéldány élettartamára szóló azonosító (nem felhasználóhoz kötött). */
const instanceId = Math.random().toString(36).slice(2, 10);

/** day -> (bucketKey -> counters) */
const counters = new Map<string, Map<string, UsageBucket>>();
const lastFlushAt = new Map<string, number>();
let flushInFlight: Promise<void> | null = null;

function enabled(): boolean {
  return process.env.USAGE_METRICS !== "0";
}

function bucketKey(parts: {
  route: string;
  kind: string;
  audience: string;
  ua: string;
  status: string;
}): string {
  return `${parts.route}|${parts.kind}|${parts.audience}|${parts.ua}|${parts.status}`;
}

type BlobStore = {
  get(key: string, opts?: { type?: "json" }): Promise<unknown>;
  setJSON(key: string, value: unknown): Promise<unknown>;
  list(opts?: { prefix?: string }): Promise<{ blobs: { key: string }[] }>;
  delete(key: string): Promise<unknown>;
};

/**
 * A Blobs store csak Netlify futásidőben érhető el. Bármilyen hiba esetén
 * `null`-t adunk vissza — a monitorozás soha nem törheti meg az oldalt.
 */
async function getStoreSafe(): Promise<BlobStore | null> {
  try {
    const { getStore } = await import("@netlify/blobs");
    return getStore({ name: STORE_NAME, consistency: "strong" }) as BlobStore;
  } catch {
    return null;
  }
}

async function flush(day: string): Promise<void> {
  const dayCounters = counters.get(day);
  if (!dayCounters || dayCounters.size === 0) return;

  const store = await getStoreSafe();
  if (!store) return;

  const shard: UsageShard = {};
  for (const [key, value] of dayCounters) shard[key] = { ...value };

  try {
    await store.setJSON(`daily/${day}/${instanceId}`, shard);
    lastFlushAt.set(day, Date.now());
  } catch {
    /* Átmeneti hiba — a memóriabeli számláló megmarad, a következő flush pótolja. */
  }
}

function scheduleFlush(day: string): void {
  const last = lastFlushAt.get(day) ?? 0;
  if (Date.now() - last < FLUSH_INTERVAL_MS) return;
  if (flushInFlight) return;

  /* Optimista időbélyeg: a párhuzamos kérések ne indítsanak több írást. */
  lastFlushAt.set(day, Date.now());
  const task = flush(day)
    .catch(() => undefined)
    .finally(() => {
      flushInFlight = null;
    });
  flushInFlight = task;

  /* A Netlify a válasz elküldése után befagyaszthatja a függvénypéldányt, ami
     egy el nem várt promise-t megölne — alacsony forgalomnál (ez a cél
     állapot) épp minden flush elveszne. Az `after()` a válasz után, de még a
     befagyasztás előtt futtatja le. Ha nincs request context (build-time
     render), marad a sima fire-and-forget. */
  try {
    after(task);
  } catch {
    /* no-op — a `task` így is fut, csak nincs rá garancia. */
  }
}

/**
 * Egy szerveroldali render (= egy Netlify Function Invocation) rögzítése.
 * Szándékosan szinkron és nem dob kivételt; az írás a háttérben történik.
 */
export function recordServerRender(input: {
  pathname: string;
  headers: { get(name: string): string | null };
  status?: number;
}): void {
  if (!enabled()) return;
  try {
    const day = utcDay();
    const key = bucketKey({
      route: classifyRoute(input.pathname),
      kind: classifyRequestKind(input.headers),
      audience: classifyAudience(input.pathname),
      ua: classifyUserAgent(input.headers.get("user-agent")),
      status: statusClass(input.status ?? 200),
    });

    let dayCounters = counters.get(day);
    if (!dayCounters) {
      dayCounters = new Map();
      counters.set(day, dayCounters);
      /* Csak a mai + tegnapi napot tartjuk memóriában. */
      for (const existing of counters.keys()) {
        if (existing < day) counters.delete(existing);
      }
    }

    const current = dayCounters.get(key);
    if (current) {
      current.hits += 1;
      if ((input.status ?? 200) >= 500) current.errors += 1;
    } else if (dayCounters.size < MAX_BUCKETS_PER_DAY) {
      dayCounters.set(key, {
        hits: 1,
        errors: (input.status ?? 200) >= 500 ? 1 : 0,
      });
    }

    scheduleFlush(day);
  } catch {
    /* A metrika soha nem befolyásolhatja a választ. */
  }
}

/**
 * A layoutból hívható egysoros belépő.
 *
 * KRITIKUS: a `headers()` olvasása dinamikussá teszi az egész route-fát. Ezért
 * csak akkor nyúlunk hozzá, ha a locale-feloldás (`getLocale`) amúgy is
 * megtette — vagyis path-prefix módban. Két-domain módban a locale a buildből
 * jön, ott a route-ok statikusan renderelhetők maradnak, és a monitoring nem
 * veheti el ezt a lehetőséget. Ilyenkor az edge log marad az adatforrás.
 */
export async function recordCurrentRequest(): Promise<void> {
  if (!enabled()) return;
  if (!shouldUsePathPrefixLocale()) return;
  try {
    const requestHeaders = await headers();
    const pathname = requestHeaders.get(SITE_PATHNAME_HEADER);
    /* Fejléc nélkül build-time prerender fut — azt nem számoljuk. */
    if (!pathname) return;
    recordServerRender({ pathname, headers: requestHeaders });
  } catch {
    /* A metrika soha nem befolyásolhatja a rendert. */
  }
}

export type UsageRow = {
  route: string;
  kind: string;
  audience: string;
  ua: string;
  status: string;
  hits: number;
  errors: number;
};

export type UsageDay = {
  day: string;
  totalHits: number;
  totalErrors: number;
  shards: number;
  rows: UsageRow[];
};

/** Egy nap összes shardjának összegzése (olvasás-oldali aggregálás). */
async function readDay(store: BlobStore, day: string): Promise<UsageDay> {
  const { blobs } = await store.list({ prefix: `daily/${day}/` });
  const merged = new Map<string, UsageBucket>();

  for (const blob of blobs) {
    const shard = (await store.get(blob.key, { type: "json" })) as UsageShard | null;
    if (!shard) continue;
    for (const [key, value] of Object.entries(shard)) {
      const current = merged.get(key);
      if (current) {
        current.hits += value.hits;
        current.errors += value.errors;
      } else {
        merged.set(key, { hits: value.hits, errors: value.errors });
      }
    }
  }

  const rows: UsageRow[] = [...merged.entries()]
    .map(([key, value]) => {
      const [route, kind, audience, ua, status] = key.split("|");
      return { route, kind, audience, ua, status, ...value };
    })
    .sort((a, b) => b.hits - a.hits);

  return {
    day,
    totalHits: rows.reduce((sum, row) => sum + row.hits, 0),
    totalErrors: rows.reduce((sum, row) => sum + row.errors, 0),
    shards: blobs.length,
    rows,
  };
}

function pastDays(count: number): string[] {
  const days: string[] = [];
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    days.push(utcDay(new Date(now - i * 86_400_000)));
  }
  return days;
}

/** Napi bontású riport a `/api/usage/` végpont számára. */
export async function readUsage(days: number): Promise<UsageDay[] | null> {
  const store = await getStoreSafe();
  if (!store) return null;
  const result: UsageDay[] = [];
  for (const day of pastDays(days)) {
    try {
      result.push(await readDay(store, day));
    } catch {
      /* Hiányzó nap kihagyása. */
    }
  }
  return result;
}

/** Megőrzési ablakon túli shardok törlése (a tároló ne nőjön korlátlanul). */
export async function pruneUsage(keepDays: number): Promise<number> {
  const store = await getStoreSafe();
  if (!store) return 0;
  const keep = new Set(pastDays(keepDays));
  let deleted = 0;
  try {
    const { blobs } = await store.list({ prefix: "daily/" });
    for (const blob of blobs) {
      const day = blob.key.split("/")[1];
      if (day && !keep.has(day)) {
        await store.delete(blob.key);
        deleted++;
      }
    }
  } catch {
    /* Legrosszabb esetben a következő futás takarít. */
  }
  return deleted;
}
