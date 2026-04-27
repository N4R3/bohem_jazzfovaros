import { createClient } from "@sanity/client";
import dotenv from "dotenv";
import { initialData } from "../src/sanity/seed/initialData";

dotenv.config({ path: ".env.local" });
dotenv.config();

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Hiányzó env változó: ${name}`);
  }
  return value;
}

async function run() {
  const projectId = requiredEnv("NEXT_PUBLIC_SANITY_PROJECT_ID");
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-01-01";
  const token = requiredEnv("SANITY_API_WRITE_TOKEN");

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });

  const docs = [
    initialData.siteSettings,
    initialData.popupSettings,
    initialData.venue,
    ...initialData.sponsorCategories,
    ...initialData.sponsors,
    ...initialData.tickets,
    ...initialData.performers,
    ...initialData.pages,
    ...initialData.programItems,
    ...initialData.accommodationItems,
  ];

  for (const doc of docs) {
    await client.createOrReplace(doc);
    // eslint-disable-next-line no-console
    console.log(`OK: ${doc._type} (${doc._id})`);
  }

  // eslint-disable-next-line no-console
  console.log("Sanity kezdő adatok feltöltése kész.");
}

run().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Hiba a Sanity import közben:", error);
  process.exit(1);
});

