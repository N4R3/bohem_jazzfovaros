#!/usr/bin/env tsx
/**
 * Sanity Content QA Script
 * Ellenőrzi, hogy a minimálisan szükséges adatok megvannak-e a Sanity-ben.
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

let sanityClient: any;
let isSanityConfigured: () => boolean;

// ANSI color codes
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

async function checkSiteSettings() {
  const data = await sanityClient.fetch(`*[_type == "siteSettings"][0]`);
  if (data) {
    log("ok", "Site Settings", "Megvan");
  } else {
    log("error", "Site Settings", "HIÁNYZIK");
  }
}

async function checkPopupSettings() {
  const data = await sanityClient.fetch(`*[_type == "popupSettings"][0]{ _id, image, imagePath }`);
  if (!data) {
    log("error", "Popup Settings", "HIÁNYZIK");
    return;
  }
  
  const warnings: string[] = [];
  if (!data.image && !data.imagePath) {
    warnings.push("nincs image és nincs imagePath");
  }
  
  if (warnings.length > 0) {
    log("warning", "Popup Settings", `Megvan, de ${warnings.join(", ")}`);
  } else {
    log("ok", "Popup Settings", "Megvan");
  }
}

async function checkVenue() {
  const data = await sanityClient.fetch(`*[_type == "venue"][0]`);
  if (data) {
    log("ok", "Venue", "Megvan");
  } else {
    log("error", "Venue", "HIÁNYZIK");
  }
}

async function checkPages() {
  const requiredSlugs = [
    "home", "info", "lineup", "program", "contact",
    "szallas", "terkep", "futas", "tabor", "aszf"
  ];
  
  const pages = await sanityClient.fetch(`*[_type == "page"]{ slug, seo, noIndex }`);
  const existingSlugs = new Set(pages.map((p: any) => p.slug?.current).filter(Boolean));
  
  const missing = requiredSlugs.filter(s => !existingSlugs.has(s));
  
  if (missing.length > 0) {
    log("error", "Pages", `Hiányzó slugok: ${missing.join(", ")}`);
  } else {
    log("ok", "Pages", "Mind a 10 szükséges page megvan");
  }
  
  // SEO check
  const seoWarnings: string[] = [];
  for (const page of pages) {
    const slug = page.slug?.current || "unknown";
    const seo = page.seo || {};
    
    if (!seo.seoTitleHu || !seo.seoTitleEn || !seo.seoDescriptionHu || !seo.seoDescriptionEn) {
      const missingFields = [];
      if (!seo.seoTitleHu) missingFields.push("seoTitleHu");
      if (!seo.seoTitleEn) missingFields.push("seoTitleEn");
      if (!seo.seoDescriptionHu) missingFields.push("seoDescriptionHu");
      if (!seo.seoDescriptionEn) missingFields.push("seoDescriptionEn");
      log("warning", `Page SEO (${slug})`, `Hiányzó: ${missingFields.join(", ")}`);
    }
    
    if (page.noIndex) {
      log("warning", `Page noIndex (${slug})`, "noIndex be van kapcsolva");
    }
  }
}

async function checkPerformers() {
  const performers = await sanityClient.fetch(`*[_type == "performer"]{ _id, name, image, imagePath }`);
  
  if (performers.length === 0) {
    log("error", "Performers", "Egy sincs");
    return;
  }
  
  const imageWarnings = performers.filter((p: any) => !p.image && !p.imagePath);
  
  if (imageWarnings.length > 0) {
    log("warning", "Performers", `${performers.length} db van, ${imageWarnings.length} db-nak nincs image/imagePath`);
  } else {
    log("ok", "Performers", `${performers.length} db`);
  }
}

async function checkSponsors() {
  const sponsors = await sanityClient.fetch(`*[_type == "sponsor"]{ _id, name, logo, logoPath }`);
  
  if (sponsors.length === 0) {
    log("error", "Sponsors", "Egy sincs");
    return;
  }
  
  const logoWarnings = sponsors.filter((s: any) => !s.logo && !s.logoPath);
  
  if (logoWarnings.length > 0) {
    log("warning", "Sponsors", `${sponsors.length} db van, ${logoWarnings.length} db-nak nincs logo/logoPath`);
  } else {
    log("ok", "Sponsors", `${sponsors.length} db`);
  }
}

async function checkSponsorCategories() {
  const count = await sanityClient.fetch(`count(*[_type == "sponsorCategory"])`);
  if (count === 0) {
    log("error", "Sponsor Categories", "Egy sincs");
  } else {
    log("ok", "Sponsor Categories", `${count} db`);
  }
}

async function checkTickets() {
  const count = await sanityClient.fetch(`count(*[_type == "ticket"])`);
  if (count === 0) {
    log("error", "Tickets", "Egy sincs");
  } else {
    log("ok", "Tickets", `${count} db`);
  }
}

async function checkProgramItems() {
  const count = await sanityClient.fetch(`count(*[_type == "programItem"])`);
  if (count === 0) {
    log("error", "Program Items", "Egy sincs");
  } else {
    log("ok", "Program Items", `${count} db`);
  }
}

async function checkAccommodation() {
  const count = await sanityClient.fetch(`count(*[_type == "accommodation"])`);
  if (count === 0) {
    log("error", "Accommodation", "Egy sincs");
  } else {
    log("ok", "Accommodation", `${count} db`);
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
    
    // Summary
    console.log("\n" + "=".repeat(30));
    const errors = results.filter(r => r.status === "error").length;
    const warnings = results.filter(r => r.status === "warning").length;
    const ok = results.filter(r => r.status === "ok").length;
    
    console.log(`Összesítés: ${GREEN}${ok} OK${RESET}, ${YELLOW}${warnings} figyelmeztetés${RESET}, ${RED}${errors} hiba${RESET}`);
    
    if (errors > 0) {
      console.log(`\n${RED}Hibák száma: ${errors}${RESET}`);
      process.exit(1);
    } else if (warnings > 0) {
      console.log(`\n${YELLOW}Figyelmeztetések száma: ${warnings}${RESET}`);
      process.exit(0);
    } else {
      console.log(`\n${GREEN}Minden rendben!${RESET}`);
      process.exit(0);
    }
  } catch (error) {
    console.error(`${RED}✗ Hiba történt:${RESET}`, error);
    process.exit(1);
  }
}

main();
