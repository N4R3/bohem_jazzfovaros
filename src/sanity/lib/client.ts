import { createClient } from "next-sanity";

function normalizeProjectId(raw?: string): string {
  const value = raw?.trim() || "";
  return /^[a-z0-9-]+$/.test(value) ? value : "";
}

export const sanityProjectId = normalizeProjectId(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
export const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const sanityApiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-01-01";
export const sanityReadToken = process.env.SANITY_API_READ_TOKEN;

if (!sanityProjectId) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
}

export const sanityClient = createClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion: sanityApiVersion,
  useCdn: true,
  token: sanityReadToken,
});

export function isSanityConfigured(): boolean {
  return Boolean(sanityProjectId && sanityDataset && sanityApiVersion);
}
