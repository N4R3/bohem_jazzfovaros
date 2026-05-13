/**
 * Seed script: Create/Update Privacy Policy Page in Sanity
 *
 * This script creates or updates the privacy policy page with Hungarian content.
 * The content is structured as Portable Text blocks for rich text editing.
 *
 * USAGE:
 *   npx tsx scripts/seedPrivacyPolicy.ts --dry-run
 *   npx tsx scripts/seedPrivacyPolicy.ts --apply
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
  console.error("  npx tsx scripts/seedPrivacyPolicy.ts --dry-run");
  console.error("  npx tsx scripts/seedPrivacyPolicy.ts --apply");
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
console.log("Privacy Policy Seed Script");
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

// Helper function to add _key to Portable Text blocks and fix structure
function addKeysToPortableText(blocks: any[]): any[] {
  return blocks.map((block, index) => {
    // Ensure children is always an array
    const children = Array.isArray(block.children) ? block.children : [];
    
    // Fix any malformed children (should be span objects with _type: "span" and text)
    const fixedChildren = children.map((child: any) => {
      if (typeof child === 'string') {
        return { _type: "span", text: child };
      }
      if (!child._type) {
        return { _type: "span", text: String(child.text || "") };
      }
      return child;
    });

    return {
      ...block,
      _key: block._key || `block-${index}`,
      children: fixedChildren,
    };
  });
}

// Portable Text content for privacy policy (Hungarian) - minimal version to avoid mutator errors
const privacyPolicyContentHu: any[] = [
  {
    _type: "block",
    style: "normal",
    children: [{ _type: "span", text: "Adatkezelési tájékoztató a http://jazzfovaros.hu weboldal látogatói és regisztrált felhasználói részére." }],
  },
  {
    _type: "block",
    style: "h2",
    children: [{ _type: "span", text: "Szolgáltató, adatkezelő megnevezése" }],
  },
  {
    _type: "block",
    style: "normal",
    children: [{ _type: "span", text: "Név / cégnév: Kecskeméti Jazz Alapítvány" }],
  },
  {
    _type: "block",
    style: "normal",
    children: [{ _type: "span", text: "Székhely: 6000 Kecskemét, Csabagyöngye u. 71." }],
  },
  {
    _type: "block",
    style: "normal",
    children: [{ _type: "span", text: "Adószám: 19046309-2-09" }],
  },
  {
    _type: "block",
    style: "normal",
    children: [{ _type: "span", text: "E-mail: jazzfovaros@gmail.com" }],
  },
  {
    _type: "block",
    style: "normal",
    children: [{ _type: "span", text: "Telefon: +36-20-336-4620" }],
  },
  {
    _type: "block",
    style: "h2",
    children: [{ _type: "span", text: "Kapcsolat" }],
  },
  {
    _type: "block",
    style: "normal",
    children: [{ _type: "span", text: "A személyes adatok módosítása vagy törlése kezdeményezhető e-mailben: jazzfovaros@gmail.com" }],
  },
  {
    _type: "block",
    style: "h2",
    children: [{ _type: "span", text: "Jogorvoslat" }],
  },
  {
    _type: "block",
    style: "normal",
    children: [{ _type: "span", text: "Nemzeti Adatvédelmi és Információszabadság Hatóság" }],
  },
  {
    _type: "block",
    style: "normal",
    children: [{ _type: "span", text: "Postacím: 1530 Budapest, Pf.: 5." }],
  },
  {
    _type: "block",
    style: "normal",
    children: [{ _type: "span", text: "URL: https://naih.hu" }],
  },
];

// Note: This is a simplified version to avoid Sanity Studio mutator errors.
// Editors should expand and enhance the content in Sanity Studio with the full privacy policy text.

async function main() {
  console.log("🚀 Starting Privacy Policy seed...\n");

  try {
    // Check if page already exists
    const existingPage = await client.fetch(
      `*[_type == "page" && slug.current == "adatvedelem"][0]`
    );

    const pageData = {
      _type: "page",
      titleHu: "Adatvédelmi tájékoztató",
      titleEn: "Privacy Policy",
      slug: { current: "adatvedelem", _type: "slug" },
      heroTitleHu: "Adatvédelmi tájékoztató",
      heroTitleEn: "Privacy Policy",
      pageBodyRichHu: addKeysToPortableText(privacyPolicyContentHu),
      pageBodyRichEn: [],
      isActive: true,
    };

    if (existingPage) {
      console.log("⚠️  Page document with slug='adatvedelem' already exists");
      
      if (DRY_RUN) {
        console.log("📋 DRY RUN: Would update Page document slug='adatvedelem' with rich text content (adding _key properties)");
      } else {
        await client.patch(existingPage._id).set({
          pageBodyRichHu: addKeysToPortableText(privacyPolicyContentHu),
        }).commit();
        console.log("✓ UPDATED: Page document slug='adatvedelem' with rich text content (adding _key properties)");
      }
    } else {
      if (DRY_RUN) {
        console.log("📋 DRY RUN: Would create new Page document slug='adatvedelem'");
      } else {
        await client.create(pageData);
        console.log("✓ CREATED: Page document slug='adatvedelem'");
      }
    }

    console.log("\n⚠️  IMPORTANT:");
    console.log("  - Review the page in Sanity Studio");
    console.log("  - The content is a simplified version to avoid mutator errors");
    console.log("  - Editors should expand and enhance the content in Sanity Studio");
    console.log("  - Add English translation to pageBodyRichEn when ready");
    console.log("  - Publish the page when satisfied");
  } catch (error) {
    console.error("❌ ERROR:", error);
    process.exit(1);
  }
}

main();
