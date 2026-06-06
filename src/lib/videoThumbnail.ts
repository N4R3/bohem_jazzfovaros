import { sanityImageUrl } from "@/sanity/lib/image";

export function youtubeThumbnailFromUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  const short = url.match(/youtu\.be\/([^?&/]+)/);
  const long = url.match(/[?&]v=([^?&/]+)/);
  const embed = url.match(/youtube\.com\/embed\/([^?&/]+)/);
  const id = short?.[1] || long?.[1] || embed?.[1];
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : undefined;
}

export function resolveVideoThumbnailUrl(
  thumbnail: unknown,
  videoUrl?: string | null,
): string | undefined {
  if (thumbnail) {
    const fromSanity = sanityImageUrl(thumbnail, { width: 1280 });
    if (fromSanity) return fromSanity;
  }
  return youtubeThumbnailFromUrl(videoUrl);
}
