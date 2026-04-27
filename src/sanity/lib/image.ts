import { createImageUrlBuilder } from "@sanity/image-url";
import { sanityClient, isSanityConfigured } from "./client";

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: unknown) {
  if (!isSanityConfigured() || !source) return null;
  return builder.image(source);
}
