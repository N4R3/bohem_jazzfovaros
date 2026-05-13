/**
 * Migrációs script: Törli a régi performer mezőket (bioEn, bioHu, shortDescriptionEn, shortDescriptionHu)
 * Ezek a mezők lecserélésre kerültek rich text verziókkal (bioRichHu, bioRichEn, shortDescriptionRichHu, shortDescriptionRichEn)
 *
 * Futtatás:
 * npx tsx scripts/cleanupOldPerformerFields.ts
 */

import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: false,
  apiVersion: "2025-01-01",
});

async function cleanupOldPerformerFields() {
  console.log("🔍 Fetching performers with old fields...");

  const performers = await client.fetch(
    `*[_type == "performer" && defined(bioEn) || defined(bioHu) || defined(shortDescriptionEn) || defined(shortDescriptionHu)]{
      _id,
      name,
      bioEn,
      bioHu,
      shortDescriptionEn,
      shortDescriptionHu
    }`
  );

  if (!performers || performers.length === 0) {
    console.log("✅ No performers with old fields found.");
    return;
  }

  console.log(`📋 Found ${performers.length} performers with old fields:`);
  performers.forEach((p: any) => {
    console.log(`   - ${p.name} (${p._id})`);
  });

  // Dry run - csak listázza, nem módosít
  console.log("\n🔍 DRY RUN - No changes will be made.");
  console.log("To apply changes, change DRY_RUN to false in the script.");

  const DRY_RUN = true; // Állítsd false-ra a tényleges törléshez

  if (!DRY_RUN) {
    console.log("\n🔄 Applying changes...");
    for (const performer of performers) {
      const patch: any = {
        unset: ["bioEn", "bioHu", "shortDescriptionEn", "shortDescriptionHu"].filter(
          (field) => performer[field] !== undefined
        ),
      };

      if (patch.unset.length === 0) {
        continue;
      }

      await client.patch(performer._id, patch).commit();
      console.log(`   ✅ Cleaned ${performer.name}`);
    }
    console.log("\n✅ Migration complete!");
  }
}

cleanupOldPerformerFields().catch(console.error);
