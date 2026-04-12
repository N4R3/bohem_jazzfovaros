import type { Metadata } from "next";
import { getContent } from "@/lib/locale";
import { canonicalUrl } from "@/lib/seo";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import GalleryClient from "@/components/gallery/GalleryClient";

export function generateMetadata(): Metadata {
  const c = getContent();
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

export default function GalleryPage() {
  const c = getContent();
  const { gallery } = c;

  return (
    <div className="min-h-screen bg-[var(--color-cream-50)] py-16">
      <Container>
        <SectionHeading title={gallery.title} subtitle={gallery.subtitle} />
        <GalleryClient images={gallery.images} />
      </Container>
    </div>
  );
}
