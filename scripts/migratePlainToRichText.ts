/**
 * Migration script: Plain Text → Rich Text (Portable Text)
 *
 * Konvertálja az összes Page és Performer dokumentumban a sima text mezőket
 * Rich Text Portable Text formátumba. Csak akkor írja át, ha a Rich Text mező üres.
 *
 * USAGE:
 *   npx tsx scripts/migratePlainToRichText.ts --dry-run
 *   npx tsx scripts/migratePlainToRichText.ts --apply
 */

import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { randomUUID } from "crypto";

config({ path: ".env.local" });

const DRY_RUN = process.argv.includes("--dry-run");
const APPLY = process.argv.includes("--apply");

if (!DRY_RUN && !APPLY) {
  console.error("❌ ERROR: Must specify either --dry-run or --apply");
  process.exit(1);
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset) {
  console.error("❌ ERROR: Missing Sanity config (NEXT_PUBLIC_SANITY_PROJECT_ID/DATASET)");
  process.exit(1);
}
if (!DRY_RUN && !token) {
  console.error("❌ ERROR: Missing SANITY_API_WRITE_TOKEN for apply mode");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

/** Konvertálja a sima szöveget Portable Text blokkokká (kettős sortörés = új bekezdés). */
function plainToPortableText(text: string | undefined | null): Array<Record<string, unknown>> {
  if (!text || typeof text !== "string") return [];
  const trimmed = text.trim();
  if (!trimmed) return [];
  // Bekezdések kettős sortörés mentén; egyszeri sortörést megőrizzük a span-en belül.
  const paragraphs = trimmed.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  return paragraphs.map((p) => ({
    _type: "block",
    _key: randomUUID().replace(/-/g, "").slice(0, 12),
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: randomUUID().replace(/-/g, "").slice(0, 12),
        text: p,
        marks: [],
      },
    ],
  }));
}

/** Ellenőrzi, hogy egy Rich Text mező üres-e (vagy nincs). */
function isRichEmpty(value: unknown): boolean {
  if (!Array.isArray(value) || value.length === 0) return true;
  return !value.some((block) => {
    if (!block || typeof block !== "object") return false;
    const b = block as { _type?: string; children?: Array<{ text?: string }> };
    if (b._type !== "block" || !Array.isArray(b.children)) return false;
    return b.children.some((c) => typeof c?.text === "string" && c.text.trim().length > 0);
  });
}

// Page mezők, amelyekhez van Rich Text párja
const PAGE_FIELD_PAIRS: Array<[plain: string, rich: string]> = [
  ["heroDescriptionHu", "heroDescriptionRichHu"],
  ["heroDescriptionEn", "heroDescriptionRichEn"],
  ["introNoteHu", "introNoteRichHu"],
  ["introNoteEn", "introNoteRichEn"],
  ["pageBodyHu", "pageBodyRichHu"],
  ["pageBodyEn", "pageBodyRichEn"],
  ["pageBody2Hu", "pageBody2RichHu"],
  ["pageBody2En", "pageBody2RichEn"],
  ["programBodyHu", "programBodyRichHu"],
  ["programBodyEn", "programBodyRichEn"],
  ["runningFreeEntryBannerHu", "runningFreeEntryBannerRichHu"],
  ["runningFreeEntryBannerEn", "runningFreeEntryBannerRichEn"],
  ["runningCardLocationHu", "runningCardLocationRichHu"],
  ["runningCardLocationEn", "runningCardLocationRichEn"],
  ["runningEntryDeadlineHu", "runningEntryDeadlineRichHu"],
  ["runningEntryDeadlineEn", "runningEntryDeadlineRichEn"],
  ["runningResultsNoteHu", "runningResultsNoteRichHu"],
  ["runningResultsNoteEn", "runningResultsNoteRichEn"],
];

// Camp schedule block mezők (a Page-en belüli campScheduleBlocks tömbben)
const CAMP_BLOCK_FIELD_PAIRS: Array<[plain: string, rich: string]> = [
  ["bulletsHu", "bulletsRichHu"],
  ["bulletsEn", "bulletsRichEn"],
];

// Performer mezők
const PERFORMER_FIELD_PAIRS: Array<[plain: string, rich: string]> = [
  ["shortDescriptionHu", "shortDescriptionRichHu"],
  ["shortDescriptionEn", "shortDescriptionRichEn"],
  ["bioHu", "bioRichHu"],
  ["bioEn", "bioRichEn"],
];

type SanityDoc = Record<string, unknown> & { _id: string; _type: string };

async function migrateDocs(type: "page" | "performer") {
  const docs = await client.fetch<SanityDoc[]>(`*[_type == "${type}"]`);
  console.log(`\n📋 ${type}: ${docs.length} document(s)`);

  for (const doc of docs) {
    const slug = (doc.slug as { current?: string } | undefined)?.current || doc.name || doc._id;
    const patch: Record<string, unknown> = {};
    let changeCount = 0;

    const pairs = type === "page" ? PAGE_FIELD_PAIRS : PERFORMER_FIELD_PAIRS;
    for (const [plainKey, richKey] of pairs) {
      const plain = doc[plainKey];
      const rich = doc[richKey];
      if (typeof plain === "string" && plain.trim() && isRichEmpty(rich)) {
        patch[richKey] = plainToPortableText(plain);
        changeCount++;
        console.log(`  • ${slug}: ${plainKey} → ${richKey} (${plain.length} chars)`);
      }
    }

    // Camp schedule blocks (csak page-eken)
    if (type === "page" && Array.isArray(doc.campScheduleBlocks)) {
      const blocks = doc.campScheduleBlocks as Array<Record<string, unknown>>;
      let blocksChanged = false;
      const newBlocks = blocks.map((block) => {
        const updated = { ...block };
        for (const [plainKey, richKey] of CAMP_BLOCK_FIELD_PAIRS) {
          const plain = block[plainKey];
          const rich = block[richKey];
          if (typeof plain === "string" && plain.trim() && isRichEmpty(rich)) {
            updated[richKey] = plainToPortableText(plain);
            blocksChanged = true;
            console.log(`  • ${slug}: campScheduleBlocks[].${plainKey} → ${richKey}`);
          }
        }
        return updated;
      });
      if (blocksChanged) {
        patch.campScheduleBlocks = newBlocks;
        changeCount++;
      }
    }

    if (changeCount === 0) continue;

    if (DRY_RUN) {
      console.log(`  📋 DRY RUN: Would patch ${slug} (${changeCount} field group(s))`);
    } else {
      await client.patch(doc._id).set(patch).commit();
      console.log(`  ✓ PATCHED ${slug}`);
    }
  }
}

async function main() {
  console.log("=".repeat(80));
  console.log(`Plain Text → Rich Text Migration (${DRY_RUN ? "DRY RUN" : "APPLY"})`);
  console.log("=".repeat(80));

  await migrateDocs("page");
  await migrateDocs("performer");

  console.log("\n✓ Migration complete.");
  if (DRY_RUN) console.log("Run with --apply to commit changes.");
}

main().catch((err) => {
  console.error("❌ ERROR:", err);
  process.exit(1);
});
