/**
 * Migration script: Convert plain text fields to Portable Text (Rich Text)
 * 
 * This script helps migrate existing plain text content to the new Portable Text format.
 * It's designed to be run manually after the schema changes are deployed.
 * 
 * USAGE:
 *   npx tsx scripts/migrateToPortableText.ts --dry-run
 *   npx tsx scripts/migrateToPortableText.ts --apply
 * 
 * The script:
 * - Converts plain text to Portable Text blocks
 * - Preserves paragraph breaks (double newlines = new paragraph)
 * - Does NOT auto-convert bullet lists or other formatting (too risky)
 * - Skips documents that already have rich text content
 * - Creates a dry-run mode to preview changes
 */

import { createClient } from "@sanity/client";
import { config } from "dotenv";

// Load environment variables from .env.local
config({ path: ".env.local" });

// CLI flag parsing
const DRY_RUN = process.argv.includes("--dry-run");
const APPLY = process.argv.includes("--apply");

// Validate flags
if (!DRY_RUN && !APPLY) {
  console.error("❌ ERROR: Must specify either --dry-run or --apply");
  console.error("Usage:");
  console.error("  npx tsx scripts/migrateToPortableText.ts --dry-run");
  console.error("  npx tsx scripts/migrateToPortableText.ts --apply");
  process.exit(1);
}

if (DRY_RUN && APPLY) {
  console.error("❌ ERROR: Cannot specify both --dry-run and --apply");
  process.exit(1);
}

// Sanity client configuration
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const migrationToken = process.env.SANITY_API_WRITE_TOKEN;

// Explicit config validation
if (!projectId) {
  console.error("❌ ERROR: Missing Sanity projectId");
  console.error("Check .env.local and env variable names (NEXT_PUBLIC_SANITY_PROJECT_ID)");
  process.exit(1);
}

if (!dataset) {
  console.error("❌ ERROR: Missing Sanity dataset");
  console.error("Check .env.local and env variable names (NEXT_PUBLIC_SANITY_DATASET)");
  process.exit(1);
}

if (!DRY_RUN && !migrationToken) {
  console.error("❌ ERROR: Missing SANITY_API_WRITE_TOKEN");
  console.error("Required for apply mode");
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
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token: migrationToken,
  useCdn: false,
});

// Secure configuration logging
console.log("=".repeat(80));
console.log("Portable Text Migration Script");
console.log("=".repeat(80));
console.log(`Mode: ${DRY_RUN ? "DRY RUN (no changes will be made)" : "APPLY (changes will be made)"}`);
console.log("");
console.log("Configuration:");
console.log(`  Project ID: ${projectId}`);
console.log(`  Dataset: ${dataset}`);
console.log(`  API Version: 2024-01-01`);
console.log(`  Migration Token: ${migrationToken ? "✓ Present" : "✗ Missing (dry-run mode)"}`);
console.log("=".repeat(80));
console.log();

/**
 * Convert plain text to Portable Text blocks
 * - Double newline = new paragraph
 * - Single newline = preserved within paragraph
 */
function plainTextToPortableText(text: string): any[] {
  if (!text || typeof text !== "string") return [];
  
  // Split by double newlines to get paragraphs
  const paragraphs = text.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
  
  return paragraphs.map(paragraph => ({
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        text: paragraph,
        marks: [],
      },
    ],
  }));
}

/**
 * Migrate page documents
 */
async function migratePages() {
  console.log("📄 Migrating pages...");
  
  const pages = await client.fetch(`
    *[_type == "page" && isActive != false]{
      _id,
      pageBodyHu,
      pageBodyEn,
      programBodyHu,
      programBodyEn,
      pageBody2Hu,
      pageBody2En,
      pageBodyRichHu,
      pageBodyRichEn,
      programBodyRichHu,
      programBodyRichEn,
      pageBody2RichHu,
      pageBody2RichEn,
    }
  `);
  
  let migrated = 0;
  
  for (const page of pages) {
    const updates: Record<string, any> = {};
    
    // pageBodyHu -> pageBodyRichHu
    if (page.pageBodyHu && !page.pageBodyRichHu) {
      updates.pageBodyRichHu = plainTextToPortableText(page.pageBodyHu);
      console.log(`  - ${page._id}: pageBodyHu -> pageBodyRichHu`);
    }
    
    // pageBodyEn -> pageBodyRichEn
    if (page.pageBodyEn && !page.pageBodyRichEn) {
      updates.pageBodyRichEn = plainTextToPortableText(page.pageBodyEn);
      console.log(`  - ${page._id}: pageBodyEn -> pageBodyRichEn`);
    }
    
    // programBodyHu -> programBodyRichHu
    if (page.programBodyHu && !page.programBodyRichHu) {
      updates.programBodyRichHu = plainTextToPortableText(page.programBodyHu);
      console.log(`  - ${page._id}: programBodyHu -> programBodyRichHu`);
    }
    
    // programBodyEn -> programBodyRichEn
    if (page.programBodyEn && !page.programBodyRichEn) {
      updates.programBodyRichEn = plainTextToPortableText(page.programBodyEn);
      console.log(`  - ${page._id}: programBodyEn -> programBodyRichEn`);
    }
    
    // pageBody2Hu -> pageBody2RichHu
    if (page.pageBody2Hu && !page.pageBody2RichHu) {
      updates.pageBody2RichHu = plainTextToPortableText(page.pageBody2Hu);
      console.log(`  - ${page._id}: pageBody2Hu -> pageBody2RichHu`);
    }
    
    // pageBody2En -> pageBody2RichEn
    if (page.pageBody2En && !page.pageBody2RichEn) {
      updates.pageBody2RichEn = plainTextToPortableText(page.pageBody2En);
      console.log(`  - ${page._id}: pageBody2En -> pageBody2RichEn`);
    }
    
    if (Object.keys(updates).length > 0) {
      if (!DRY_RUN) {
        await client.patch(page._id).set(updates).commit();
        console.log(`    ✓ Applied ${Object.keys(updates).length} updates`);
      }
      migrated++;
    }
  }
  
  console.log(`  Migrated ${migrated} pages\n`);
}

/**
 * Migrate camp schedule blocks
 */
async function migrateCampBlocks() {
  console.log("🏕️  Migrating camp schedule blocks...");
  
  const pages = await client.fetch(`
    *[_type == "page" && slug.current == "tabor"]{
      _id,
      campScheduleBlocks[]{
        _key,
        bulletsHu,
        bulletsEn,
        bulletsRichHu,
        bulletsRichEn,
      },
    }
  `);
  
  if (!pages || pages.length === 0) {
    console.log("  No camp page found\n");
    return;
  }
  
  const page = pages[0];
  let migrated = 0;
  
  if (page.campScheduleBlocks) {
    const updates = page.campScheduleBlocks.map((block: any) => {
      const blockUpdates: Record<string, any> = {};
      
      // bulletsHu -> bulletsRichHu
      if (block.bulletsHu && !block.bulletsRichHu) {
        // For camp blocks, each line becomes a paragraph
        const lines = block.bulletsHu.split(/\n/).map((l: string) => l.trim()).filter(Boolean);
        blockUpdates.bulletsRichHu = lines.map((line: string) => ({
          _type: "block",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              text: line,
              marks: [],
            },
          ],
        }));
        console.log(`  - Block ${block._key}: bulletsHu -> bulletsRichHu (${lines.length} lines)`);
      }
      
      // bulletsEn -> bulletsRichEn
      if (block.bulletsEn && !block.bulletsRichEn) {
        const lines = block.bulletsEn.split(/\n/).map((l: string) => l.trim()).filter(Boolean);
        blockUpdates.bulletsRichEn = lines.map((line: string) => ({
          _type: "block",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              text: line,
              marks: [],
            },
          ],
        }));
        console.log(`  - Block ${block._key}: bulletsEn -> bulletsRichEn (${lines.length} lines)`);
      }
      
      return { _key: block._key, ...blockUpdates };
    });
    
    const hasUpdates = updates.some((u: any) => Object.keys(u).length > 1);
    
    if (hasUpdates) {
      if (!DRY_RUN) {
        await client.patch(page._id).set({ campScheduleBlocks: updates }).commit();
        console.log(`    ✓ Applied camp schedule block updates`);
      }
      migrated++;
    }
  }
  
  console.log(`  Migrated ${migrated} camp blocks\n`);
}

/**
 * Migrate performer documents
 */
async function migratePerformers() {
  console.log("🎤 Migrating performers...");
  
  const performers = await client.fetch(`
    *[_type == "performer" && isActive != false]{
      _id,
      name,
      bioHu,
      bioEn,
      bioRichHu,
      bioRichEn,
    }
  `);
  
  let migrated = 0;
  
  for (const performer of performers) {
    const updates: Record<string, any> = {};
    
    // bioHu -> bioRichHu
    if (performer.bioHu && !performer.bioRichHu) {
      updates.bioRichHu = plainTextToPortableText(performer.bioHu);
      console.log(`  - ${performer.name} (${performer._id}): bioHu -> bioRichHu`);
    }
    
    // bioEn -> bioRichEn
    if (performer.bioEn && !performer.bioRichEn) {
      updates.bioRichEn = plainTextToPortableText(performer.bioEn);
      console.log(`  - ${performer.name} (${performer._id}): bioEn -> bioRichEn`);
    }
    
    if (Object.keys(updates).length > 0) {
      if (!DRY_RUN) {
        await client.patch(performer._id).set(updates).commit();
        console.log(`    ✓ Applied ${Object.keys(updates).length} updates`);
      }
      migrated++;
    }
  }
  
  console.log(`  Migrated ${migrated} performers\n`);
}

/**
 * Main migration function
 */
async function main() {
  console.log("🚀 Starting Portable Text migration...\n");
  console.log(`Project: ${projectId}`);
  console.log(`Dataset: ${dataset}`);
  console.log(`Mode: ${DRY_RUN ? "DRY RUN (no changes)" : "LIVE (will apply changes)"}`);
  
  try {
    await migratePages();
    await migrateCampBlocks();
    await migratePerformers();
    
    console.log("✅ Migration completed!\n");
    console.log("⚠️  IMPORTANT:");
    console.log("  1. Review the changes in Sanity Studio");
    console.log("  2. Test the rich text rendering on the frontend");
    console.log("  3. If everything looks good, publish the changes");
    console.log("  4. After publishing, you can remove the old plain text fields (optional)\n");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

main();
