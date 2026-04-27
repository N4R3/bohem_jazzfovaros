#!/usr/bin/env tsx
/**
 * Sanity Content QA Script
 * Dokumentumok megléte + mező-szintű minimumok (lásd: docs/SANITY_FIELD_BINDING_AUDIT.md)
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

let sanityClient: any;
let isSanityConfigured: () => boolean;

const RESET = "\x1b[0m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";

interface CheckResult {
  name: string;
  status: "ok" | "error" | "warning";
  message: string;
}

const results: CheckResult[] = [];

function log(status: "ok" | "error" | "warning", name: string, message: string) {
  results.push({ name, status, message });
  const icon = status === "ok" ? "✓" : status === "error" ? "✗" : "⚠";
  const color = status === "ok" ? GREEN : status === "error" ? RED : YELLOW;
  console.log(`${color}${icon}${RESET} ${name}: ${message}`);
}

function nonEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  return true;
}

async function checkSiteSettings() {
  const s = await sanityClient.fetch(`*[_type == "siteSettings"][0]{
    _id, ticketUrlHu, ticketUrlEn, facebookUrl, instagramUrl, houseRulesPdf, youtubeUrl
  }`);
  if (!s) {
    log("error", "Site settings (dokumentum)", "HIÁNYZIK");
    return;
  }

  log("ok", "Site settings (dokumentum)", "Megvan");

  const rec: { key: string; val: unknown }[] = [
    { key: "ticketUrlHu", val: s.ticketUrlHu },
    { key: "ticketUrlEn", val: s.ticketUrlEn },
    { key: "facebookUrl", val: s.facebookUrl },
    { key: "instagramUrl", val: s.instagramUrl },
    { key: "houseRulesPdf", val: s.houseRulesPdf },
  ];
  for (const { key, val } of rec) {
    if (!nonEmpty(val)) {
      log("warning", `Site settings — ${key}`, "Üres (ajánlott kitölteni)");
    } else {
      log("ok", `Site settings — ${key}`, "Beállítva");
    }
  }
}

async function checkPopupSettings() {
  const data = await sanityClient.fetch(`*[_type == "popupSettings"][0]{ _id, image, imagePath }`);
  if (!data) {
    log("error", "Popup settings", "HIÁNYZIK");
    return;
  }
  if (!data.image && !data.imagePath) {
    log("error", "Popup settings — kép", "Nincs se image (asset), se imagePath (kritikus a főoldali pop-uphoz)");
  } else {
    log("ok", "Popup settings — kép", "Van image vagy imagePath");
  }
}

async function checkVenue() {
  const v = await sanityClient.fetch(`*[_type == "venue"][0]{
    _id, nameHu, nameEn, addressHu, addressEn, mapEmbedUrl, googleMapsUrl, latitude, longitude
  }`);
  if (!v) {
    log("error", "Venue (dokumentum)", "HIÁNYZIK");
    return;
  }

  if (!nonEmpty(v.nameHu) && !nonEmpty(v.nameEn)) {
    log("warning", "Venue — nameHu/nameEn", "Legalább egy helyszín-név ajánlott");
  } else {
    log("ok", "Venue — név (HU/EN)", "Rendben");
  }

  if (!nonEmpty(v.addressHu) && !nonEmpty(v.addressEn)) {
    log("warning", "Venue — address Hu/En", "Üres (ajánlott a Studio-ban kitölteni)");
  } else {
    log("ok", "Venue — cím", "Van érték");
  }

  const hasCoords =
    typeof v.latitude === "number" && !Number.isNaN(v.latitude) &&
    typeof v.longitude === "number" && !Number.isNaN(v.longitude);
  const hasMap = nonEmpty(v.mapEmbedUrl) || nonEmpty(v.googleMapsUrl);
  if (!hasMap && !hasCoords) {
    log("error", "Venue — térkép / GPS", "Nincs mapEmbedUrl, googleMapsUrl, és nincs latitude+longitude (a térkép blokk nem tud működni)");
  } else {
    log("ok", "Venue — térkép vagy koordináta", "Rendben");
  }
}

async function checkPages() {
  const requiredSlugs = [
    "home", "info", "lineup", "program", "contact",
    "szallas", "terkep", "futas", "tabor", "aszf"
  ];

  const pages = await sanityClient.fetch(`*[_type == "page"]{ "slug": slug.current, seo }`);
  const existingSlugs = new Set(pages.map((p: { slug?: string }) => p.slug).filter(Boolean));

  const missing = requiredSlugs.filter((s) => !existingSlugs.has(s));
  if (missing.length > 0) {
    log("error", "Pages — szükséges slugok", `Hiányzik: ${missing.join(", ")}`);
  } else {
    log("ok", "Pages — szükséges slugok", "Mind a 10 megvan");
  }

  for (const page of pages as { slug?: string; seo?: Record<string, unknown> }[]) {
    const slug = page.slug || "unknown";
    const seo = page.seo || {};
    const need = ["seoTitleHu", "seoTitleEn", "seoDescriptionHu", "seoDescriptionEn"] as const;
    const missingSeo: string[] = [];
    for (const k of need) {
      if (!nonEmpty(seo[k])) missingSeo.push(k);
    }
    if (missingSeo.length > 0) {
      log("warning", `Page SEO (${slug})`, `Hiányzó: ${missingSeo.join(", ")}`);
    } else {
      log("ok", `Page SEO (${slug})`, "4 SEO alap mező kitöltve");
    }
    if (seo.noIndex === true) {
      log("warning", `Page noIndex (${slug})`, "seo.noIndex = true (nem indexel a build alapján a meta)");
    }
  }
}

async function checkPerformers() {
  const performers = await sanityClient.fetch(
    `*[_type == "performer"]{ _id, name, isActive, image, imagePath, shortDescriptionHu, shortDescriptionEn }`,
  );
  if (performers.length === 0) {
    log("error", "Performers (darab)", "Egy sincs");
    return;
  }
  log("ok", "Performers (darab)", `${performers.length} db`);

  const noImage = performers.filter((p: { image?: unknown; imagePath?: string }) => !p.image && !p.imagePath);
  if (noImage.length > 0) {
    log("error", "Performers — kép (image vagy imagePath)", `${noImage.length} db-nak nincs: kritikus a lineuphoz/főoldalhoz`);
  } else {
    log("ok", "Performers — kép", "Minden dokihoz van image vagy imagePath");
  }

  const noShort = performers.filter(
    (p: { isActive?: boolean; shortDescriptionHu?: string; shortDescriptionEn?: string }) =>
      p.isActive !== false && !nonEmpty(p.shortDescriptionHu) && !nonEmpty(p.shortDescriptionEn),
  );
  if (noShort.length > 0) {
    log("warning", "Performers — rövid leírás (HU/EN)", `${noShort.length} aktívnak üres a short description (a teaser műfajhoz jó lenne)`);
  } else {
    log("ok", "Performers — rövid leírás", "Aktívak: van HU vagy EN short");
  }
}

async function checkSponsors() {
  const sponsors = await sanityClient.fetch(
    `*[_type == "sponsor"]{ _id, name, logo, logoPath, url, isActive, "catId": category._ref }`,
  );
  if (sponsors.length === 0) {
    log("error", "Sponsors (darab)", "Egy sincs");
    return;
  }
  const noLogo = sponsors.filter((s: { logo?: unknown; logoPath?: string }) => !s.logo && !s.logoPath);
  if (noLogo.length > 0) {
    log("error", "Sponsors — logo / logoPath", `${noLogo.length} db-nak nincs: footer nem tud képet`);
  } else {
    log("ok", "Sponsors — logo", "Rendben");
  }

  const noCat = sponsors.filter((s: { catId?: string }) => !s.catId);
  if (noCat.length > 0) {
    log("warning", "Sponsors — kategória ref", `${noCat.length} db-nak nincs kategóriája`);
  } else {
    log("ok", "Sponsors — kategória", "Rendben");
  }

  const noName = sponsors.filter((s: { name?: string }) => !nonEmpty(s.name));
  if (noName.length > 0) {
    log("error", "Sponsors — name", `${noName.length} db név nélkül`);
  }
}

async function checkSponsorCategories() {
  const cats = await sanityClient.fetch(
    `*[_type == "sponsorCategory"] | order(order asc) { _id, titleHu, titleEn, order }`,
  );
  if (cats.length === 0) {
    log("error", "Sponsor kategóriák", "Egy sincs");
    return;
  }
  let titleErr = 0;
  for (const c of cats) {
    const id = c._id || "";
    if (!nonEmpty(c.titleHu) || !nonEmpty(c.titleEn)) {
      titleErr += 1;
      log("error", `Sponsor category (${id})`, "titleHu vagy titleEn üres");
    }
  }
  if (titleErr === 0) {
    log("ok", "Sponsor kategóriák", `${cats.length} db, címek HU+EN rendben`);
  }
}

async function checkTickets() {
  const tickets = await sanityClient.fetch(
    `*[_type == "ticket"] | order(order asc) { _id, nameHu, nameEn, price, isAvailable, isHidden, order }`,
  );
  if (tickets.length === 0) {
    log("error", "Tickets (darab)", "Egy sincs");
    return;
  }
  let nameErrors = 0;
  for (const t of tickets) {
    const id = t._id || "unknown";
    if (!nonEmpty(t.nameHu) || !nonEmpty(t.nameEn)) {
      nameErrors += 1;
      log("error", `Ticket (${id}) — név`, "nameHu vagy nameEn üres");
    }
    if (t.isHidden === true) continue;
    if (t.isAvailable === true && !nonEmpty(t.price)) {
      log("warning", `Ticket (${id}) — price`, "Látható és elérhető, de ár üres");
    }
  }
  if (nameErrors === 0) {
    log("ok", "Tickets — név", `${tickets.length} db, minden jegynek van HU+EN neve`);
  }
}

async function checkProgramItems() {
  const items = await sanityClient.fetch(
    `*[_type == "programItem" && isActive == true] | order(date asc, startTime asc) {
      _id, titleHu, titleEn, date, startTime, stage, isActive
    }`,
  );
  if (items.length === 0) {
    log("warning", "Program items (aktív)", "Nincs aktív tétel (program oldal fallback a statikra mehet)");
    return;
  }
  let err = 0;
  for (const it of items) {
    const id = it._id || "unknown";
    if (!nonEmpty(it.titleHu) || !nonEmpty(it.titleEn)) {
      err += 1;
      log("error", `ProgramItem (${id}) — cím`, "titleHu vagy titleEn üres");
    }
    if (!nonEmpty(it.date)) {
      err += 1;
      log("error", `ProgramItem (${id}) — date`, "Dátum kötelező");
    }
    if (!nonEmpty(it.startTime)) {
      err += 1;
      log("error", `ProgramItem (${id}) — startTime`, "Időpont üres");
    }
    if (!nonEmpty(it.stage)) {
      err += 1;
      log("error", `ProgramItem (${id}) — stage`, "Színpad üres");
    }
  }
  if (err === 0) {
    log("ok", "Program items (aktív)", `${items.length} tétel, kötelező mezők kitöltve`);
  }
}

async function checkAccommodation() {
  const items = await sanityClient.fetch(
    `*[_type == "accommodation" && isActive == true] | order(order asc) {
      _id, name, descriptionHu, descriptionEn, image, imagePath, distanceHu, distanceEn, isActive
    }`,
  );
  if (items.length === 0) {
    log("warning", "Accommodation (aktív)", "Nincs aktív tétel");
    return;
  }
  let nameErr = 0;
  for (const it of items) {
    const id = it._id || "unknown";
    if (!nonEmpty(it.name)) {
      nameErr += 1;
      log("error", `Accommodation (${id}) — name`, "Név üres");
    }
    if (!nonEmpty(it.descriptionHu) && !nonEmpty(it.descriptionEn)) {
      log("warning", `Accommodation (${id}) — leírás`, "descriptionHu és descriptionEn is üres");
    }
    if (!it.image && !it.imagePath) {
      log("warning", `Accommodation (${id}) — kép`, "Nincs image vagy imagePath");
    }
    if (!nonEmpty(it.distanceHu) && !nonEmpty(it.distanceEn)) {
      log("warning", `Accommodation (${id}) — távolság`, "distance üres (HU/EN)");
    }
  }
  if (nameErr === 0) {
    log("ok", "Accommodation (aktív)", `${items.length} db, minden szállásnak van neve`);
  }
}

async function checkTransportItems() {
  const items = await sanityClient.fetch(
    `*[_type == "transportItem" && isActive == true] | order(order asc) { _id, titleHu, titleEn, descriptionHu, descriptionEn, icon, order, isActive, url }`,
  );
  if (items.length === 0) {
    log("warning", "Transport items (aktív)", "Nincs aktív tétel (térkép / közlekedés fallback)");
    return;
  }
  let err = 0;
  for (const it of items) {
    const id = it._id || "unknown";
    if (!nonEmpty(it.titleHu) && !nonEmpty(it.titleEn)) {
      err += 1;
      log("error", `TransportItem (${id}) — cím`, "title üres (HU/EN)");
    }
    if (!nonEmpty(it.descriptionHu) && !nonEmpty(it.descriptionEn)) {
      err += 1;
      log("error", `TransportItem (${id}) — leírás`, "leírás üres (HU/EN)");
    }
    if (!nonEmpty(it.icon)) {
      log("warning", `TransportItem (${id}) — icon`, "Üres (a kódban van heurisztika, de a Studio-ból célszerű)");
    }
  }
  if (err === 0) {
    log("ok", "Transport items (aktív)", `${items.length} db, cím és leírás min. egyik nyelven kitöltve`);
  }
}

async function main() {
  console.log(`${CYAN}=== Sanity Content QA ===${RESET}\n`);

  const clientModule = await import("../src/sanity/lib/client");
  sanityClient = clientModule.sanityClient;
  isSanityConfigured = clientModule.isSanityConfigured;

  if (!isSanityConfigured()) {
    console.error(`${RED}✗ Sanity nincs konfigurálva${RESET}`);
    console.error("Ellenőrizd a .env.local fájlt: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET");
    process.exit(1);
  }

  try {
    await checkSiteSettings();
    await checkPopupSettings();
    await checkVenue();
    await checkPages();
    await checkPerformers();
    await checkSponsors();
    await checkSponsorCategories();
    await checkTickets();
    await checkProgramItems();
    await checkAccommodation();
    await checkTransportItems();

    console.log("\n" + "=".repeat(30));
    const errCount = results.filter((r) => r.status === "error").length;
    const warnCount = results.filter((r) => r.status === "warning").length;
    const okCount = results.filter((r) => r.status === "ok").length;
    console.log(
      `Összesítés: ${GREEN}${okCount} OK${RESET}, ${YELLOW}${warnCount} figyelmeztetés${RESET}, ${RED}${errCount} hiba${RESET}`,
    );

    if (errCount > 0) {
      console.log(`\n${RED}Hibák: ${errCount}${RESET}`);
      process.exit(1);
    }
    if (warnCount > 0) {
      console.log(`\n${YELLOW}Figyelmeztetések: ${warnCount}${RESET}`);
    } else {
      console.log(`\n${GREEN}Nincs figyelmeztetés.${RESET}`);
    }
    process.exit(0);
  } catch (error) {
    console.error(`${RED}✗ Hiba történt:${RESET}`, error);
    process.exit(1);
  }
}

main();
