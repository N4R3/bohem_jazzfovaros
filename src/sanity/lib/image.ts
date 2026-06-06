import { createImageUrlBuilder } from "@sanity/image-url";
import { sanityClient, isSanityConfigured } from "./client";

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: unknown) {
  if (!isSanityConfigured() || !source) return null;
  return builder.image(source);
}

type SanityImageOptions = {
  width?: number;
  height?: number;
  quality?: number;
};

export function sanityImageUrl(source: unknown, options: SanityImageOptions = {}): string | undefined {
  const image = urlFor(source);
  if (!image) return undefined;

  const { width, height, quality = 75 } = options;
  let transformed = image.auto("format").quality(quality);
  if (width) transformed = transformed.width(width);
  if (height) transformed = transformed.height(height);
  return transformed.url();
}
