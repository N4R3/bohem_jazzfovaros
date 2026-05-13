import { createClient } from "next-sanity";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// Sanity client configuration
const migrationToken = process.env.SANITY_API_WRITE_TOKEN;

if (!migrationToken) {
  console.error("❌ ERROR: SANITY_API_WRITE_TOKEN environment variable is required");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: migrationToken,
  useCdn: false,
});

async function fixMemberNameFields() {
  console.log("=".repeat(80));
  console.log("Fixing Old 'name' Field to 'nameHu/nameEn' in Performer Members");
  console.log("=".repeat(80));
  console.log();

  try {
    // Fetch all performers with members
    const performers = await client.fetch(
      `*[_type == "performer"]{ _id, name, members }`
    );

    if (!performers || performers.length === 0) {
      console.log("No performers found.");
      return;
    }

    console.log(`Found ${performers.length} performers total.`);
    console.log(`Performers with members: ${performers.filter((p: any) => p.members && p.members.length > 0).length}`);
    console.log();

    let fixedCount = 0;
    let skippedCount = 0;

    for (const performer of performers) {
      const members = performer.members || [];
      const needsUpdate = members.some((m: any) => m.name && !m.nameHu);

      if (!needsUpdate) {
        console.log(`✓ SKIP: "${performer.name}" already has nameHu/nameEn`);
        skippedCount++;
        continue;
      }

      if (members.length === 0) {
        console.log(`✓ SKIP: "${performer.name}" has no members`);
        skippedCount++;
        continue;
      }

      // Convert old 'name' field to 'nameHu' and 'nameEn'
      const updatedMembers = members.map((member: any) => {
        if (member.nameHu) {
          return member; // Already has nameHu, no change needed
        }

        const name = member.name || "";
        return {
          ...member,
          nameHu: name,
          nameEn: name,
          // Remove old 'name' field
          name: undefined,
        };
      });

      await client.patch(performer._id).set({ members: updatedMembers }).commit();
      console.log(`✓ FIXED: "${performer.name}" - converted name to nameHu/nameEn for ${updatedMembers.length} members`);
      fixedCount++;
    }

    console.log();
    console.log("=".repeat(80));
    console.log("Summary");
    console.log("=".repeat(80));
    console.log(`Fixed: ${fixedCount} performers`);
    console.log(`Skipped: ${skippedCount} performers`);
    console.log("=".repeat(80));
  } catch (error) {
    console.error("❌ ERROR:", error);
    process.exit(1);
  }
}

fixMemberNameFields();
