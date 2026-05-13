/**
 * Sanity Migration Script: Migrate Static Content to CMS
 *
 * This script migrates static content from src/content files to Sanity CMS.
 *
 * MIGRATIONS:
 * 1. Accommodation introNote: src/content/hu.ts/en.ts accommodation.note → Page slug="szallas"
 * 2. Accommodation/hotel data: BASE.accommodation.hotels → accommodation documents
 * 3. Venue data: BASE.gps, BASE.mapImage, map.title/subtitle/description/directions → venue document
 * 4. Performer members: performerDetailsHu lineups → performer.members
 *
 * SAFETY:
 * - Dry-run mode by default (use --force to actually write)
 * - Never overwrites non-empty Sanity fields unless --force is passed
 * - Logs every update and skip
 * - Preserves HU/EN separation
 * - Does not delete static files or fallback code
 *
 * USAGE:
 * npx tsx scripts/migrateStaticContent.ts --dry-run
 * npx tsx scripts/migrateStaticContent.ts --apply
 * npx tsx scripts/migrateStaticContent.ts --apply --force
 */

import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { hu } from "../src/content/hu";
import { en } from "../src/content/en";
import { BASE } from "../src/content/base";

// Load environment variables from .env.local
config({ path: ".env.local" });

// CLI flag parsing
const DRY_RUN = process.argv.includes("--dry-run");
const APPLY = process.argv.includes("--apply");
const FORCE = process.argv.includes("--force");

// Validate flags
if (!DRY_RUN && !APPLY) {
  console.error("❌ ERROR: Must specify either --dry-run or --apply");
  console.error("Usage:");
  console.error("  npx tsx scripts/migrateStaticContent.ts --dry-run");
  console.error("  npx tsx scripts/migrateStaticContent.ts --apply");
  console.error("  npx tsx scripts/migrateStaticContent.ts --apply --force");
  process.exit(1);
}

if (DRY_RUN && APPLY) {
  console.error("❌ ERROR: Cannot specify both --dry-run and --apply");
  process.exit(1);
}

if (FORCE && !APPLY) {
  console.error("❌ ERROR: --force can only be used with --apply");
  console.error("Usage:");
  console.error("  npx tsx scripts/migrateStaticContent.ts --apply --force");
  process.exit(1);
}

// Hardcoded performerDetailsHu from lineup/page.tsx
const performerDetailsHu: Record<
  string,
  {
    details: string;
    lineup?: string[];
    website?: string;
    youtube?: string;
  }
> = {
  "Bérczesi Jazz Band": {
    details:
      "Bérczesi Róbert (Hiperkarma) különleges vendégprojektje. Klasszikus jazzt és bohém lendületet ötvöző formáció.",
    website: "https://jazzfovaros.hu/bg/performer-popup/190",
    youtube: "https://www.youtube.com/watch?v=zjxCe4WunMY",
    lineup: [
      "Bérczesi Róbert (Hiperkarma) (voc, g)",
      "Szalóky Béla (tp)",
      "Papp Mátyás (tb)",
      "Berkó Domonkos (cl, sax)",
      "Juhász Attila (p)",
      "Csikós Miklós (sb)",
      "Kovacsevics Gábor (dr, wb)",
    ],
  },
  "Bohém Ragtime Jazz Band": {
    details:
      "Az eMeRTon-díjas kecskeméti csapat 1985-ben alakult, repertoárjuk a ragtime-tól a New Orleans-i jazzen és dixielanden át a swingig terjed. A Nemzetközi Bohém Ragtime & Jazz Fesztivál és a JAZZFŐVÁROS házigazdái.",
    website: "http://www.bohemragtime.com",
    youtube: "https://youtu.be/WphNjExWanE?si=RFRy3lOJDkOrdc2q",
    lineup: [
      "Bolba Éva (voc)",
      "Lebanov József (tp)",
      "Bera Zsolt (tb)",
      "Berkó Domonkos (cl, sax)",
      "Ittzés Tamás (p, vl, voc, ld)",
      "Hegedüs Csaba (g, bj)",
      "Korb Attila (bs)",
      "Gulyás-Szabó Krisztián (dr)",
    ],
  },
  "Bolba Éva": {
    details:
      "Nemzetközileg is aktív jazzénekes, Európa mellett az USA-ban és Ázsiában is fellépett. A JAZZterlánc megálmodója, a JAZZFŐVÁROS jazztáborának tanára.",
    website: "https://www.facebook.com/jazzterlanc/",
    youtube: "https://www.youtube.com/watch?v=-2mzm8Fiq4w",
    lineup: ["Bolba Éva (voc)"],
  },
  "Clotile Yana": {
    details: "Amerikai jazzénekesnő, a fesztivál nemzetközi vendégelőadója.",
    lineup: ["Clotile Yana (voc)"],
  },
  "Cseh Balázs": {
    details:
      "A régi stílusú jazzdobolás specialistája, tapasztalt stúdiózenész és több formáció tagja. Fellépett több európai fesztiválon, Kenyában és Indiában is.",
    website: "https://www.facebook.com/balazs.cseh.50",
    youtube: "https://www.youtube.com/watch?v=N4lvyrNWswY",
    lineup: ["Cseh Balázs (dr)"],
  },
  "Dániel Balázs": {
    details:
      "Mr. Firehand, a boogie-woogie magyar nagykövete és az egyik legvirtuózabb hazai zongorista. Európa-szerte koncertezik, az USA-ban is turnézott.",
    website: "https://mrfirehand.com/",
    youtube: "https://www.youtube.com/watch?v=ZqMxZbwIjm0",
    lineup: ["Dániel Balázs (p)"],
  },
  "Dennert Árpád": {
    details:
      "Az Árpi Show, a Benkó Dixieland és számos más hazai jazz-zenekar meghatározó hangszerese.",
    website: "https://www.facebook.com/dennertarpi",
    youtube: "https://www.youtube.com/watch?v=j_m-5v4lxrM",
    lineup: ["Dennert Árpád (cl, sax)"],
  },
  'Emanuele Urso "King of Swing"': {
    details: "Az olasz swingélet kiemelt alakja, a fesztivál nemzetközi vendégművésze.",
    lineup: ["Emanuele Urso (dr, cl)"],
    website: "https://emanueleurso.it",
    youtube: "https://www.youtube.com/watch?v=q1Gh8TQ9e3I",
  },
  "Farkas Norbert": {
    details: "Hazai nagybőgős előadó, klasszikus jazz formációk visszatérő közreműködője.",
    lineup: ["Farkas Norbert (sb)"],
  },
  "Farkas Péter \"Bubu\"": {
    details:
      "Tradicionális jazz és swing produkciók keresett nagybőgőse, rendszeres közreműködő hazai fesztiválokon.",
    lineup: ["Farkas Péter \"Bubu\" (sb)"],
  },
  "Festival All Stars": {
    details:
      "Nemzetközi all-stars projekt magyar és külföldi vendégművészekkel, külön pénteki és szombati felállással.",
    website: "https://jazzfovaros.hu/bg/performer-popup/84",
  },
  "Gyárfás István": {
    details:
      "A mainstream jazz egyik legismertebb hazai gitárosa, több évtizedes pályafutással és nemzetközi együttműködésekkel.",
    website: "https://www.facebook.com/istvan.gyarfas.1",
    youtube: "https://www.youtube.com/watch?v=yCY9M9atxRI",
    lineup: ["Gyárfás István (g)"],
  },
  "Hungarian Jazz Embassy": {
    details: "Hazai jazz-elit formáció, kifejezetten a fesztiválra összeállított felállással.",
    website: "https://www.facebook.com/szalokygroup/",
    lineup: [
      "Szalóky Balázs (tp)",
      "Zana Zoltán (ts)",
      "Szalóky Béla (tb)",
      "Tálas Áron (p)",
      "Lutz János (sb)",
      "Richter Ambrus (dr)",
    ],
  },
  "Hunter Burgamy": {
    details: "Amerikai gitáros/bendzsós és énekes, tradicionális jazz és swing vonalon.",
    lineup: ["Hunter Burgamy (g, bj, voc)"],
    website: "https://www.hunterburgamy.com/",
  },
  "Jazz Camp All Stars": {
    details:
      "A JAZZFŐVÁROS jazztábor tanárai és zenésztársaik spontán örömzenélésre összeálló nyitónapi csapata.",
    website: "https://www.jazzfovaros.hu/jazztabor",
    lineup: [
      "Bolba Éva (voc)",
      "Lukács Eszter (voc)",
      "Szalóky Béla (tp, tb)",
      "Korb Attila (tp, tb, p)",
      "Nagy Iván (p)",
      "Gyárfás István (g)",
      "Rieger Attila (g)",
      "Farkas Péter (sb)",
      "Cseh Balázs (dr)",
    ],
  },
  "Ken Aoki": {
    details: "Világszínvonalú bendzsóművész, a fesztivál egyik közönségkedvenc nemzetközi fellépője.",
    lineup: ["Ken Aoki (bj)"],
    website: "https://www.facebook.com/vegavox",
    youtube: "https://www.youtube.com/watch?v=eXFc-JfW2r8",
  },
  "Korb Attila": {
    details:
      "Sokoldalú hangszeres (harsona, trombita, szaxofon, zongora, ének), korábban a Bohém Ragtime Jazz Band tagja, folyamatosan turnézó szabadúszó jazzmuzsikus.",
    website: "https://www.facebook.com/attila.korb.7",
    youtube: "https://www.youtube.com/watch?v=QcoDBs6_SBM",
    lineup: ["Korb Attila (tb, tp, bass-sax, p, voc)"],
  },
  "Lukács Eszter": {
    details:
      "A fesztivál visszatérő jazzénekes fellépője, a klasszikus és mainstream jazz vokális világának képviselője.",
    lineup: ["Lukács Eszter (voc)"],
  },
  "Nagy Iván": {
    details:
      "A stride-zongorázás elkötelezett képviselője, számos hazai swing- és jazzformáció közreműködője.",
    website: "https://www.facebook.com/ivan.nagy.7161",
    youtube: "https://www.youtube.com/watch?v=7Sv_XN6bK3o",
    lineup: ["Nagy Iván (p)"],
  },
  "Nanna Carling": {
    details:
      "Svédországi tradicionális jazz előadó, több hangszerrel és énekkel is rendszeresen szerepel nemzetközi fesztiválokon.",
    lineup: ["Nanna Carling"],
    website: "https://www.nannacarling.com",
    youtube: "https://www.youtube.com/@nannacarling",
  },
  "Pribojszki Mátyás": {
    details:
      "Díjazott blues-harmonika előadó és zenekarvezető, a hazai blues és jazz szcéna meghatározó alakja.",
    lineup: ["Pribojszki Mátyás (harmonika, voc)"],
  },
  "Sir Oliver Mally & Peter Schneider Duo": {
    details: "Osztrák-német blues duó, akusztikus gitárra és énekre épülő műsorral.",
    website: "https://sir-oliver.com",
    youtube: "https://www.youtube.com/watch?v=nP5MVYLVKEI",
    lineup: ["Sir Oliver Mally (g, voc)", "Peter Schneider (g)"],
  },
  "Swingtáncórák kezdőknek": {
    details:
      "Kezdő swingtáncórák több időpontban a fesztivál alatt, magyar és nemzetközi közönségnek.",
    website: "https://www.swinglight.hu",
    youtube: "https://www.youtube.com/watch?v=CZ0e0rtanGM",
  },
  "Szalóky Béla": {
    details:
      "Multiinstrumentalista, a magyar oldtimer-jazz meghatározó alakja, rendszeres nemzetközi fesztiválvendég.",
    website: "http://szaloky.com/",
    youtube: "https://www.youtube.com/watch?v=R91MRLsUi_s",
    lineup: ["Szalóky Béla (tp, tb)"],
  },
  "Tom White & the Mad Circus": {
    details: "A rockabilly magyar királyai, erős színpadi energiával és vintage hangzással.",
    website: "http://www.tomwhite.hu/",
    youtube: "https://www.youtube.com/watch?v=jVIMTO5gd48",
    lineup: [
      "Tom White (voc, harp)",
      "Schiffler Patrik (Ricky) (voc, g)",
      "Buzsik Tamás (dr)",
      "Kéri Kolos (sb)",
    ],
  },
};

// Parse member string like "Bérczesi Róbert (Hiperkarma) (voc, g)" to member object
function parseMemberString(memberStr: string) {
  // Try to extract name and instruments
  // Format: "Name (optional nickname) (instrument)" or "Name (instrument)"
  const parts = memberStr.split(" (");
  
  if (parts.length === 1) {
    // Just name, no instruments
    return {
      nameHu: memberStr.trim(),
      nameEn: memberStr.trim(),
      roleHu: "",
      roleEn: "",
      instrumentHu: "",
      instrumentEn: "",
      showAsStandalonePerformer: false,
      order: 0,
    };
  }

  // Extract name (first part before first parenthesis)
  const name = parts[0].trim();
  
  // Extract instruments (last part after last parenthesis, without closing parenthesis)
  const instruments = parts[parts.length - 1].replace(")", "").trim();
  
  // Extract nickname if present (middle parts)
  let nickname = "";
  if (parts.length === 3) {
    nickname = parts[1].replace(")", "").trim();
  }

  return {
    nameHu: name,
    nameEn: name,
    roleHu: nickname || "",
    roleEn: nickname || "",
    instrumentHu: instruments,
    instrumentEn: instruments,
    showAsStandalonePerformer: false,
    order: 0,
    _key: `${name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };
}

// Sanity client configuration
const migrationToken = process.env.SANITY_API_WRITE_TOKEN;

if (!migrationToken) {
  console.error("❌ ERROR: SANITY_API_WRITE_TOKEN environment variable is required");
  console.error("This script requires a write-enabled Sanity token to perform migrations.");
  console.error("");
  console.error("To fix this:");
  console.error("1. Go to https://www.sanity.io/manage");
  console.error("2. Select your project and navigate to API > Tokens");
  console.error("3. Create a new token with 'Editor' or 'Administrator' role");
  console.error("4. Add it to your .env.local file:");
  console.error("   SANITY_API_WRITE_TOKEN=your_token_here");
  console.error("");
  console.error("⚠️  SECURITY WARNING: Never commit SANITY_API_WRITE_TOKEN to version control.");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: migrationToken,
  useCdn: false,
});

// Secure configuration logging
console.log("=".repeat(80));
console.log("Sanity Migration Script: Migrate Static Content to CMS");
console.log("=".repeat(80));
console.log(`Mode: ${DRY_RUN ? "DRY RUN (no changes will be made)" : "APPLY (changes will be made)"}`);
console.log(`Force overwrite: ${FORCE ? "YES (will overwrite non-empty fields)" : "NO (will skip non-empty fields)"}`);
console.log("");
console.log("Configuration:");
console.log(`  Project ID: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "NOT SET"}`);
console.log(`  Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET || "NOT SET"}`);
console.log(`  API Version: 2024-01-01`);
console.log(`  Migration Token: ${migrationToken ? "✓ Present" : "✗ Missing"}`);
console.log("=".repeat(80));
console.log();

// Migration statistics
let stats = {
  updated: 0,
  skipped: 0,
  errors: 0,
  warnings: 0,
};

// Permission smoke test
async function testPermissions() {
  console.log("Testing Sanity connection and permissions...");
  console.log("-".repeat(80));
  
  try {
    // Try to fetch a single document to test read access
    const testDoc = await client.fetch(`*[_type == "page"][0]{ _id, slug }`, {}, { perspective: 'published' });
    
    if (testDoc) {
      console.log(`✓ Read permission verified (found document: ${testDoc._id})`);
    } else {
      console.log(`⚠️  No documents found, but read access appears to work`);
    }
    
    if (!DRY_RUN) {
      console.log(`✓ Write token present and ready for mutations`);
      console.log(`  Note: Actual write permissions will be verified during first mutation`);
    } else {
      console.log(`ℹ️  Dry-run mode: no mutations will be attempted`);
    }
  } catch (error: any) {
    if (error.message?.includes('permission') || error.message?.includes('403') || error.message?.includes('Forbidden')) {
      console.error(`❌ ERROR: Permission check failed`);
      console.error(`   ${error.message}`);
      console.error(``);
      console.error(`   This usually means the SANITY_MIGRATION_TOKEN is invalid or lacks write permissions.`);
      console.error(`   Please verify the token has 'Editor' or 'Administrator' role.`);
      stats.errors++;
    } else {
      console.error(`⚠️  WARNING: Permission check encountered an error`);
      console.error(`   ${error.message}`);
      console.error(`   Continuing anyway, but mutations may fail...`);
      stats.warnings++;
    }
  }
  
  console.log();
}

async function migrateAccommodationIntroNote() {
  console.log("1. Migrating Accommodation IntroNote");
  console.log("-".repeat(80));

  try {
    const page = await client.fetch(`*[_type == "page" && slug.current == "szallas"][0]`);

    if (!page) {
      console.log("⚠️  SKIP: Page document with slug='szallas' not found");
      stats.skipped++;
      stats.warnings++;
      return;
    }

    const updates: Record<string, any> = {};

    // HU
    if (hu.accommodation.note) {
      if (!page.introNoteHu || FORCE) {
        updates.introNoteHu = hu.accommodation.note;
        console.log(`✓ Will set introNoteHu: "${hu.accommodation.note.substring(0, 50)}..."`);
      } else {
        console.log(`⚠️  SKIP: introNoteHu already exists`);
        console.log(`   Document: Page (slug="szallas")`);
        console.log(`   Field: introNoteHu`);
        console.log(`   Existing value: "${page.introNoteHu.substring(0, 50)}..."`);
        console.log(`   Incoming value: "${hu.accommodation.note.substring(0, 50)}..."`);
        console.log(`   Action: skipped because non-empty (use --apply --force to overwrite)`);
        stats.skipped++;
      }
    }

    // EN
    if (en.accommodation.note) {
      if (!page.introNoteEn || FORCE) {
        updates.introNoteEn = en.accommodation.note;
        console.log(`✓ Will set introNoteEn: "${en.accommodation.note.substring(0, 50)}..."`);
      } else {
        console.log(`⚠️  SKIP: introNoteEn already exists`);
        console.log(`   Document: Page (slug="szallas")`);
        console.log(`   Field: introNoteEn`);
        console.log(`   Existing value: "${page.introNoteEn.substring(0, 50)}..."`);
        console.log(`   Incoming value: "${en.accommodation.note.substring(0, 50)}..."`);
        console.log(`   Action: skipped because non-empty (use --apply --force to overwrite)`);
        stats.skipped++;
      }
    }

    if (Object.keys(updates).length > 0) {
      if (DRY_RUN) {
        console.log(`📋 DRY RUN: Would update Page document slug="szallas" with:`, updates);
      } else {
        await client.patch(page._id).set(updates).commit();
        console.log(`✓ UPDATED: Page document slug="szallas"`);
        stats.updated++;
      }
    } else {
      console.log("ℹ️  No updates needed for Page document slug='szallas'");
    }
  } catch (error) {
    console.error("❌ ERROR migrating accommodation introNote:", error);
    stats.errors++;
  }

  console.log();
}

async function migrateAccommodationHotels() {
  console.log("2. Migrating Accommodation/Hotel Data");
  console.log("-".repeat(80));

  try {
    // Check if accommodation documents already exist
    const existingAccommodations = await client.fetch(`*[_type == "accommodation"]`);
    const existingNames = new Set(existingAccommodations.map((a: any) => a.nameHu));

    for (const hotel of BASE.accommodation.hotels) {
      try {
        const existing = existingAccommodations.find((a: any) => a.nameHu === hotel.name);

        if (existing) {
          console.log(`⚠️  SKIP: Accommodation "${hotel.name}" already exists`);
          stats.skipped++;
          continue;
        }

        // Get descriptions from hu.ts and en.ts
        const huHotel = hu.accommodation.hotels.find((h: any) => h.name === hotel.name);
        const enHotel = en.accommodation.hotels.find((h: any) => h.name === hotel.name);

        const newAccommodation = {
          _type: "accommodation",
          nameHu: hotel.name,
          nameEn: hotel.name,
          descriptionHu: huHotel?.description || "",
          descriptionEn: enHotel?.description || "",
          priceHu: hotel.price.hu,
          priceEn: hotel.price.en,
          distanceHu: hotel.distance.hu,
          distanceEn: hotel.distance.en,
          stars: hotel.stars || 0,
          bookingUrl: hotel.bookingUrl,
          bookingLabelHu: "Foglalás →",
          bookingLabelEn: "Book Now →",
          images: hotel.images || [],
          order: 0,
          isActive: true,
        };

        if (DRY_RUN) {
          console.log(`📋 DRY RUN: Would create accommodation "${hotel.name}"`);
          console.log(`   - descriptionHu: "${newAccommodation.descriptionHu.substring(0, 50)}..."`);
          console.log(`   - descriptionEn: "${newAccommodation.descriptionEn.substring(0, 50)}..."`);
          console.log(`   - priceHu: ${newAccommodation.priceHu}`);
          console.log(`   - priceEn: ${newAccommodation.priceEn}`);
          console.log(`   - distanceHu: ${newAccommodation.distanceHu}`);
          console.log(`   - distanceEn: ${newAccommodation.distanceEn}`);
          console.log(`   - stars: ${newAccommodation.stars}`);
          console.log(`   - bookingUrl: ${newAccommodation.bookingUrl}`);
        } else {
          await client.create(newAccommodation);
          console.log(`✓ CREATED: Accommodation "${hotel.name}"`);
          stats.updated++;
        }
      } catch (error) {
        console.error(`❌ ERROR creating accommodation "${hotel.name}":`, error);
        stats.errors++;
      }
    }
  } catch (error) {
    console.error("❌ ERROR migrating accommodation hotels:", error);
    stats.errors++;
  }

  console.log();
}

async function migrateVenueData() {
  console.log("3. Migrating Venue Data");
  console.log("-".repeat(80));

  try {
    const venue = await client.fetch(`*[_type == "venue"][0]`);

    if (!venue) {
      console.log("⚠️  SKIP: Venue document not found");
      stats.skipped++;
      stats.warnings++;
      return;
    }

    const updates: Record<string, any> = {};

    // Parse GPS
    const gpsParts = BASE.gps.split(", ");
    const latitude = parseFloat(gpsParts[0]);
    const longitude = parseFloat(gpsParts[1]);

    // Title
    if (hu.map.title && (!venue.titleHu || FORCE)) {
      updates.titleHu = hu.map.title;
      console.log(`✓ Will set titleHu: "${hu.map.title}"`);
    } else if (hu.map.title && venue.titleHu && !FORCE) {
      console.log(`⚠️  SKIP: titleHu already exists`);
      console.log(`   Document: Venue`);
      console.log(`   Field: titleHu`);
      console.log(`   Existing value: "${venue.titleHu}"`);
      console.log(`   Incoming value: "${hu.map.title}"`);
      console.log(`   Action: skipped because non-empty (use --apply --force to overwrite)`);
      stats.skipped++;
    }

    if (en.map.title && (!venue.titleEn || FORCE)) {
      updates.titleEn = en.map.title;
      console.log(`✓ Will set titleEn: "${en.map.title}"`);
    } else if (en.map.title && venue.titleEn && !FORCE) {
      console.log(`⚠️  SKIP: titleEn already exists`);
      console.log(`   Document: Venue`);
      console.log(`   Field: titleEn`);
      console.log(`   Existing value: "${venue.titleEn}"`);
      console.log(`   Incoming value: "${en.map.title}"`);
      console.log(`   Action: skipped because non-empty (use --apply --force to overwrite)`);
      stats.skipped++;
    }

    // Subtitle
    if (hu.map.subtitle && (!venue.subtitleHu || FORCE)) {
      updates.subtitleHu = hu.map.subtitle;
      console.log(`✓ Will set subtitleHu: "${hu.map.subtitle}"`);
    } else if (hu.map.subtitle && venue.subtitleHu && !FORCE) {
      console.log(`⚠️  SKIP: subtitleHu already exists`);
      console.log(`   Document: Venue`);
      console.log(`   Field: subtitleHu`);
      console.log(`   Existing value: "${venue.subtitleHu}"`);
      console.log(`   Incoming value: "${hu.map.subtitle}"`);
      console.log(`   Action: skipped because non-empty (use --apply --force to overwrite)`);
      stats.skipped++;
    }

    if (en.map.subtitle && (!venue.subtitleEn || FORCE)) {
      updates.subtitleEn = en.map.subtitle;
      console.log(`✓ Will set subtitleEn: "${en.map.subtitle}"`);
    } else if (en.map.subtitle && venue.subtitleEn && !FORCE) {
      console.log(`⚠️  SKIP: subtitleEn already exists`);
      console.log(`   Document: Venue`);
      console.log(`   Field: subtitleEn`);
      console.log(`   Existing value: "${venue.subtitleEn}"`);
      console.log(`   Incoming value: "${en.map.subtitle}"`);
      console.log(`   Action: skipped because non-empty (use --apply --force to overwrite)`);
      stats.skipped++;
    }

    // Description (mapNote)
    if (hu.map.mapNote && (!venue.descriptionHu || FORCE)) {
      updates.descriptionHu = hu.map.mapNote;
      console.log(`✓ Will set descriptionHu: "${hu.map.mapNote.substring(0, 50)}..."`);
    } else if (hu.map.mapNote && venue.descriptionHu && !FORCE) {
      console.log(`⚠️  SKIP: descriptionHu already exists`);
      console.log(`   Document: Venue`);
      console.log(`   Field: descriptionHu`);
      console.log(`   Existing value: "${venue.descriptionHu.substring(0, 50)}..."`);
      console.log(`   Incoming value: "${hu.map.mapNote.substring(0, 50)}..."`);
      console.log(`   Action: skipped because non-empty (use --apply --force to overwrite)`);
      stats.skipped++;
    }

    if (en.map.mapNote && (!venue.descriptionEn || FORCE)) {
      updates.descriptionEn = en.map.mapNote;
      console.log(`✓ Will set descriptionEn: "${en.map.mapNote.substring(0, 50)}..."`);
    } else if (en.map.mapNote && venue.descriptionEn && !FORCE) {
      console.log(`⚠️  SKIP: descriptionEn already exists`);
      console.log(`   Document: Venue`);
      console.log(`   Field: descriptionEn`);
      console.log(`   Existing value: "${venue.descriptionEn.substring(0, 50)}..."`);
      console.log(`   Incoming value: "${en.map.mapNote.substring(0, 50)}..."`);
      console.log(`   Action: skipped because non-empty (use --apply --force to overwrite)`);
      stats.skipped++;
    }

    // Directions heading
    const directionsHeadingHu = "Hogyan juss el?";
    const directionsHeadingEn = "How to get there?";
    if (!venue.directionsHeadingHu || FORCE) {
      updates.directionsHeadingHu = directionsHeadingHu;
      console.log(`✓ Will set directionsHeadingHu: "${directionsHeadingHu}"`);
    } else if (venue.directionsHeadingHu && !FORCE) {
      console.log(`⚠️  SKIP: directionsHeadingHu already exists`);
      console.log(`   Document: Venue`);
      console.log(`   Field: directionsHeadingHu`);
      console.log(`   Existing value: "${venue.directionsHeadingHu}"`);
      console.log(`   Incoming value: "${directionsHeadingHu}"`);
      console.log(`   Action: skipped because non-empty (use --apply --force to overwrite)`);
      stats.skipped++;
    }

    if (!venue.directionsHeadingEn || FORCE) {
      updates.directionsHeadingEn = directionsHeadingEn;
      console.log(`✓ Will set directionsHeadingEn: "${directionsHeadingEn}"`);
    } else if (venue.directionsHeadingEn && !FORCE) {
      console.log(`⚠️  SKIP: directionsHeadingEn already exists`);
      console.log(`   Document: Venue`);
      console.log(`   Field: directionsHeadingEn`);
      console.log(`   Existing value: "${venue.directionsHeadingEn}"`);
      console.log(`   Incoming value: "${directionsHeadingEn}"`);
      console.log(`   Action: skipped because non-empty (use --apply --force to overwrite)`);
      stats.skipped++;
    }

    // GPS
    if (!venue.latitude || !venue.longitude || FORCE) {
      updates.latitude = latitude;
      updates.longitude = longitude;
      console.log(`✓ Will set GPS: ${BASE.gps} (lat: ${latitude}, lon: ${longitude})`);
    } else if (venue.latitude && venue.longitude && !FORCE) {
      console.log(`⚠️  SKIP: GPS already exists`);
      console.log(`   Document: Venue`);
      console.log(`   Field: latitude/longitude`);
      console.log(`   Existing value: ${venue.latitude}, ${venue.longitude}`);
      console.log(`   Incoming value: ${latitude}, ${longitude}`);
      console.log(`   Action: skipped because non-empty (use --apply --force to overwrite)`);
      stats.skipped++;
    }

    // Map image (only if it's a public URL, not a local path)
    if (BASE.mapImage && BASE.mapImage.startsWith("http") && (!venue.mapImage || FORCE)) {
      console.log(`⚠️  SKIP: mapImage is a public URL, but Sanity expects image asset. Manual upload required.`);
      stats.skipped++;
      stats.warnings++;
    } else if (BASE.mapImage && !BASE.mapImage.startsWith("http")) {
      console.log(`⚠️  SKIP: mapImage is a local path, manual upload to Sanity required: ${BASE.mapImage}`);
      stats.skipped++;
      stats.warnings++;
    }

    // Map embed URL (generate from GPS)
    const mapEmbedUrl = `https://www.google.com/maps?q=${BASE.gps.replace(/\s/g, "")}&z=15&output=embed`;
    if (!venue.mapEmbedUrl || FORCE) {
      updates.mapEmbedUrl = mapEmbedUrl;
      console.log(`✓ Will set mapEmbedUrl: ${mapEmbedUrl}`);
    } else if (venue.mapEmbedUrl && !FORCE) {
      console.log(`⚠️  SKIP: mapEmbedUrl already exists`);
      console.log(`   Document: Venue`);
      console.log(`   Field: mapEmbedUrl`);
      console.log(`   Existing value: "${venue.mapEmbedUrl.substring(0, 50)}..."`);
      console.log(`   Incoming value: "${mapEmbedUrl.substring(0, 50)}..."`);
      console.log(`   Action: skipped because non-empty (use --apply --force to overwrite)`);
      stats.skipped++;
    }

    // Google Maps URL
    const googleMapsUrl = `https://maps.google.com/?q=${BASE.gps.replace(/\s/g, "")}`;
    if (!venue.googleMapsUrl || FORCE) {
      updates.googleMapsUrl = googleMapsUrl;
      console.log(`✓ Will set googleMapsUrl: ${googleMapsUrl}`);
    } else if (venue.googleMapsUrl && !FORCE) {
      console.log(`⚠️  SKIP: googleMapsUrl already exists`);
      console.log(`   Document: Venue`);
      console.log(`   Field: googleMapsUrl`);
      console.log(`   Existing value: "${venue.googleMapsUrl.substring(0, 50)}..."`);
      console.log(`   Incoming value: "${googleMapsUrl.substring(0, 50)}..."`);
      console.log(`   Action: skipped because non-empty (use --apply --force to overwrite)`);
      stats.skipped++;
    }

    if (Object.keys(updates).length > 0) {
      if (DRY_RUN) {
        console.log(`📋 DRY RUN: Would update Venue document with:`, updates);
      } else {
        await client.patch(venue._id).set(updates).commit();
        console.log(`✓ UPDATED: Venue document`);
        stats.updated++;
      }
    } else {
      console.log("ℹ️  No updates needed for Venue document");
    }
  } catch (error) {
    console.error("❌ ERROR migrating venue data:", error);
    stats.errors++;
  }

  console.log();
}

async function migrateTransportDirections() {
  console.log("4. Migrating Transport Directions");
  console.log("-".repeat(80));

  try {
    const existingTransport = await client.fetch(`*[_type == "transportItem"]`);

    if (existingTransport.length > 0) {
      console.log(`⚠️  SKIP: ${existingTransport.length} transportItem documents already exist`);
      console.log(`   Document type: transportItem`);
      console.log(`   Existing count: ${existingTransport.length}`);
      console.log(`   Action: skipped because documents already exist`);
      console.log(`   Recommendation: Delete existing transportItem documents or use --apply --force to overwrite`);
      stats.skipped++;
      stats.warnings++;
      return;
    }

    const iconMap: Record<string, string> = {
      car: "car",
      train: "train",
      bus: "bus",
    };

    for (const direction of hu.map.directions) {
      try {
        const icon = iconMap[direction.icon] || "bus";
        
        // Note: English translations not provided in static files
        // Script will set English fields to empty strings to require manual translation
        const newTransport = {
          _type: "transportItem",
          titleHu: direction.mode,
          titleEn: "", // Empty - requires manual English translation
          descriptionHu: direction.text,
          descriptionEn: "", // Empty - requires manual English translation
          icon: icon,
          url: "",
          order: 0,
          isActive: true,
        };

        if (DRY_RUN) {
          console.log(`📋 DRY RUN: Would create transportItem "${direction.mode}"`);
          console.log(`   - titleHu: "${direction.mode}"`);
          console.log(`   - titleEn: "" (requires manual English translation)`);
          console.log(`   - descriptionHu: "${direction.text.substring(0, 50)}..."`);
          console.log(`   - descriptionEn: "" (requires manual English translation)`);
        } else {
          await client.create(newTransport);
          console.log(`✓ CREATED: transportItem "${direction.mode}"`);
          console.log(`   ⚠️  WARNING: English fields are empty - manual translation required`);
          stats.updated++;
          stats.warnings++;
        }
      } catch (error) {
        console.error(`❌ ERROR creating transportItem "${direction.mode}":`, error);
        stats.errors++;
      }
    }
  } catch (error) {
    console.error("❌ ERROR migrating transport directions:", error);
    stats.errors++;
  }

  console.log();
}

async function migratePerformerMembers() {
  console.log("5. Migrating Performer Members");
  console.log("-".repeat(80));

  try {
    const performers = await client.fetch(`*[_type == "performer"]`);

    for (const performer of performers) {
      try {
        const performerName = performer.name;
        const performerData = performerDetailsHu[performerName];

        if (!performerData || !performerData.lineup || performerData.lineup.length === 0) {
          console.log(`⚠️  SKIP: No lineup data for "${performerName}" in performerDetailsHu`);
          console.log(`   Document: Performer (name="${performerName}")`);
          console.log(`   Field: members`);
          console.log(`   Action: skipped because no source data available - manual entry required`);
          stats.skipped++;
          stats.warnings++;
          continue;
        }

        if (performer.members && performer.members.length > 0 && !FORCE) {
          console.log(`⚠️  SKIP: "${performerName}" already has ${performer.members.length} members`);
          console.log(`   Document: Performer (name="${performerName}")`);
          console.log(`   Field: members`);
          console.log(`   Existing count: ${performer.members.length} members`);
          console.log(`   Incoming count: ${performerData.lineup.length} members`);
          console.log(`   Action: skipped because non-empty (use --apply --force to overwrite)`);
          stats.skipped++;
          continue;
        }

        const members = performerData.lineup.map((memberStr, index) => {
          const parsed = parseMemberString(memberStr);
          return {
            ...parsed,
            order: index,
          };
        });

        if (DRY_RUN) {
          console.log(`📋 DRY RUN: Would add ${members.length} members to "${performerName}"`);
          members.forEach((m) => {
            console.log(`   - ${m.nameHu} (${m.instrumentHu})`);
          });
        } else {
          await client.patch(performer._id).set({ members }).commit();
          console.log(`✓ UPDATED: "${performerName}" with ${members.length} members`);
          stats.updated++;
        }
      } catch (error) {
        console.error(`❌ ERROR migrating members for "${performer.name}":`, error);
        stats.errors++;
      }
    }
  } catch (error) {
    console.error("❌ ERROR migrating performer members:", error);
    stats.errors++;
  }

  console.log();
}

async function main() {
  await testPermissions();
  await migrateAccommodationIntroNote();
  await migrateAccommodationHotels();
  await migrateVenueData();
  await migrateTransportDirections();
  await migratePerformerMembers();

  console.log("=".repeat(80));
  console.log("Migration Summary");
  console.log("=".repeat(80));
  console.log(`Updated: ${stats.updated}`);
  console.log(`Skipped: ${stats.skipped}`);
  console.log(`Errors: ${stats.errors}`);
  console.log(`Warnings: ${stats.warnings}`);
  console.log("=".repeat(80));

  if (DRY_RUN) {
    console.log("📋 This was a DRY RUN. No changes were made to Sanity.");
    console.log("   Run with --apply to apply the changes.");
    console.log("   Run with --apply --force to overwrite existing non-empty fields.");
  } else {
    console.log("✓ Migration complete.");
    console.log();
    console.log("Post-Migration Validation Checklist:");
    console.log("-".repeat(80));
    console.log("Sanity Studio verification:");
    console.log("  [ ] Page document slug='szallas' has introNoteHu and introNoteEn");
    console.log("  [ ] 3 accommodation documents exist (Four Points, Hotel Aqua, Tó Kemping)");
    console.log("  [ ] Venue document has titleHu/titleEn, subtitleHu/subtitleEn");
    console.log("  [ ] Venue document has directionsHeadingHu/directionsHeadingEn");
    console.log("  [ ] TransportItem documents exist (or manually created)");
    console.log("  [ ] Performer documents have members arrays");
    console.log();
    console.log("Manual actions required:");
    console.log("  [ ] Upload festival map image to venue.mapImage");
    console.log("  [ ] Translate transport directions to English (titleEn, descriptionEn)");
    console.log("  [ ] Add member data for skipped performers (see MANUAL_MIGRATION_TODO.md)");
    console.log("  [ ] Review and adjust accommodation data if needed");
    console.log("  [ ] Review and adjust venue data if needed");
    console.log();
    console.log("Public website verification:");
    console.log("  [ ] Accommodation page shows intro note");
    console.log("  [ ] Accommodation page shows hotel data");
    console.log("  [ ] Map page shows title/subtitle from venue");
    console.log("  [ ] Map page shows 'Hogyan juss el?' heading");
    console.log("  [ ] Transport directions display correctly");
    console.log("  [ ] Performer detail modals show band members");
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
