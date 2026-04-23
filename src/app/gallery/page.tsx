import type { Metadata } from "next";
import { getContent } from "@/lib/locale";
import { canonicalUrl } from "@/lib/seo";
import BeachPageShell from "@/components/layout/BeachPageShell";
import GalleryClient from "@/components/gallery/GalleryClient";
import { getGalleryImagesFromPublic } from "@/lib/gallery";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent();
  return {
    title: c.gallery.title,
    description: c.gallery.subtitle,
    alternates: { canonical: canonicalUrl("/gallery/") },
    openGraph: {
      title: `${c.gallery.title} · ${c.meta.siteTitle}`,
      description: c.gallery.subtitle,
      url: canonicalUrl("/gallery/"),
    },
  };
}

export default async function GalleryPage() {
  const c = await getContent();
  const { gallery } = c;
  const autoImages = await getGalleryImagesFromPublic();
  const images = autoImages.length > 0 ? autoImages : gallery.images;

  return (
    <BeachPageShell
      eyebrow="Pillanatok a fesztiválról"
      title={gallery.title}
      subtitle={gallery.subtitle}
    >
      <GalleryClient images={images} />
    </BeachPageShell>
  );
}
