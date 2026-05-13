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

async function fixMemberKeys() {
  console.log("=".repeat(80));
  console.log("Fixing Missing _key Properties in Performer Members");
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
      const needsUpdate = members.some((m: any) => !m._key);

      if (!needsUpdate) {
        console.log(`✓ SKIP: "${performer.name}" already has keys`);
        skippedCount++;
        continue;
      }

      if (members.length === 0) {
        console.log(`✓ SKIP: "${performer.name}" has no members`);
        skippedCount++;
        continue;
      }

      // Add _key to members that don't have it
      const updatedMembers = members.map((member: any, index: number) => {
        if (member._key) {
          return member;
        }

        return {
          ...member,
          _key: `${member.nameHu || member.name || 'member'}-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
        };
      });

      await client.patch(performer._id).set({ members: updatedMembers }).commit();
      console.log(`✓ FIXED: "${performer.name}" - added keys to ${updatedMembers.length} members`);
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

fixMemberKeys();
