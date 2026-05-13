/**
 * Reset Privacy Policy Page in Sanity
 *
 * This script deletes the privacy policy page document so it can be recreated.
 *
 * USAGE:
 *   npx tsx scripts/resetPrivacyPolicy.ts
 */

import { createClient } from "@sanity/client";
import { config } from "dotenv";

// Load environment variables from .env.local
config({ path: ".env.local" });

// Sanity client configuration
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const migrationToken = process.env.SANITY_API_WRITE_TOKEN;

// Explicit config validation
if (!projectId) {
  console.error("❌ ERROR: Missing Sanity projectId");
  process.exit(1);
}

if (!dataset) {
  console.error("❌ ERROR: Missing Sanity dataset");
  process.exit(1);
}

if (!migrationToken) {
  console.error("❌ ERROR: Missing SANITY_API_WRITE_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token: migrationToken,
  useCdn: false,
});

async function main() {
  console.log("🗑️  Resetting Privacy Policy page...\n");

  try {
    // Fetch the privacy policy page document
    const page = await client.fetch(
      `*[_type == "page" && slug.current == "adatvedelem"][0]{ _id, _rev }`
    );

    if (!page) {
      console.log("ℹ️  Privacy policy page document not found. Nothing to delete.");
      return;
    }

    console.log(`Found document: ${page._id}`);
    console.log(`Current revision: ${page._rev}`);

    // Delete the document
    await client.delete(page._id);

    console.log("\n✅ Privacy policy page deleted successfully!");
    console.log("\nRun the seed script to recreate it:");
    console.log("  npx tsx scripts/seedPrivacyPolicy.ts --apply");
  } catch (error) {
    console.error("❌ ERROR during reset:", error);
    process.exit(1);
  }
}

main();
