/**
 * Publish Privacy Policy Page in Sanity
 *
 * This script publishes the privacy policy page document so it becomes visible on the website.
 *
 * USAGE:
 *   npx tsx scripts/publishPrivacyPolicy.ts
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
  console.error("Check .env.local and env variable names (NEXT_PUBLIC_SANITY_PROJECT_ID)");
  process.exit(1);
}

if (!dataset) {
  console.error("❌ ERROR: Missing Sanity dataset");
  console.error("Check .env.local and env variable names (NEXT_PUBLIC_SANITY_DATASET)");
  process.exit(1);
}

if (!migrationToken) {
  console.error("❌ ERROR: Missing SANITY_API_WRITE_TOKEN");
  console.error("Required for publishing");
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
  console.log("🚀 Publishing Privacy Policy page...\n");

  try {
    // Fetch the privacy policy page document
    const page = await client.fetch(
      `*[_type == "page" && slug.current == "adatvedelem"][0]{ _id, _rev }`
    );

    if (!page) {
      console.error("❌ ERROR: Privacy policy page document not found");
      console.error("Run the seed script first: npx tsx scripts/seedPrivacyPolicy.ts --apply");
      process.exit(1);
    }

    console.log(`Found document: ${page._id}`);
    console.log(`Current revision: ${page._rev}`);

    // Publish the document
    const published = await client
      .patch(page._id)
      .set({ _type: "page" }) // Force update to trigger publish
      .commit();

    console.log("\n✅ Privacy policy page published successfully!");
    console.log(`Document ID: ${published._id}`);
    console.log("\nThe page should now be visible on the website at /adatvedelem");
  } catch (error) {
    console.error("❌ ERROR during publish:", error);
    process.exit(1);
  }
}

main();
