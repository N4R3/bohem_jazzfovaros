import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContent, getLocale } from "@/lib/locale";
import BeachPageShell from "@/components/layout/BeachPageShell";
import PageBody from "@/components/layout/PageBody";
import FlexibleSections from "@/components/layout/FlexibleSections";
import VideoLiteEmbed from "@/components/common/VideoLiteEmbed";
import { getPageContentBySlug } from "@/sanity/lib/content";
import { sanityClient, isSanityConfigured } from "@/sanity/lib/client";
import { getAllActivePageSlugsWithLocaleQuery } from "@/sanity/lib/queries";
import { getBuildLocale } from "@/lib/buildLocale";
import { buildPageMetadataWithSanity } from "@/sanity/lib/seoContent";
import { portableTextToPlain } from "@/sanity/lib/portableText";

/**
 * Root-level dinamikus oldal (R1) — aktív Sanity Page-ek a /<slug> URL-en.
 *
 * Pl. egy `sajto` slugú aktív oldal a /sajto címen érhető el (és kompatibilitásból
 * a /oldal/sajto is ide irányít — lásd middleware).
 *
 * A fix slugoknak saját route-juk van; ezeket KIZÁRJUK, hogy a Next a fix
 * route-ot szolgálja ki (a statikus szegmens amúgy is elsőbbséget élvez a
 * dinamikus [slug] felett, de a notFound() biztosítja a tiszta viselkedést).
 *
 * Renderelési szabály:
 *   aktív + locale-ben elérhető + létező slug  → render
 *   aktív + noIndex                            → render (csak az indexelés tiltott)
 *   aktív + nincs a menüben                     → render
 *   inaktív / nem publikált                     → 404
 *   az adott locale-ben nincs tartalom          → 404 (nincs néma HU→EN fallback)
 */

const FIX_SLUGS = new Set([
  "home",
  "info",
  "lineup",
  "program",
  "contact",
  "szallas",
  "terkep",
  "futas",
  "tabor",
  "jazztabor",
  "aszf",
  "adatvedelem",
  "oldal",
  "studio",
]);

export const revalidate = 30;
/** Active pages render on demand even when not pre-generated (hidden-from-nav must not 404). */
export const dynamicParams = true;

type PageLocaleInfo = { slug: string; hasHu: boolean; hasEn: boolean };

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  if (!isSanityConfigured()) return [];
  try {
    const buildLocale = getBuildLocale();
    const pages = await sanityClient.fetch<PageLocaleInfo[]>(
      getAllActivePageSlugsWithLocaleQuery,
      {},
      { next: { revalidate: 30 } },
    );
    return (pages || [])
      .filter((p) => {
        if (!p.slug || typeof p.slug !== "string" || p.slug.length === 0) return false;
        if (FIX_SLUGS.has(p.slug)) return false;
        // Strict locale availability: only pre-generate pages that have current-locale content.
        if (buildLocale === "en" && !p.hasEn) return false;
        if (buildLocale === "hu" && !p.hasHu) return false;
        return true;
      })
      .map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const c = await getContent();
  const page = await getPageContentBySlug(slug, locale);
  const fallbackDescription =
    typeof page.heroDescription === "string"
      ? page.heroDescription
      : portableTextToPlain(page.heroDescription) || c.meta.siteDescription;
  return buildPageMetadataWithSanity({
    slug,
    path: `/${slug}/`,
    locale,
    fallbackTitle: page.heroTitle || c.meta.siteTitle,
    fallbackDescription,
    fallbackOgImage: "/images/og-image.jpg",
    siteTitle: c.meta.siteTitle,
  });
}

export default async function RootDynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (FIX_SLUGS.has(slug)) {
    /* Fix slugok saját route-on; itt nem rendereljük. */
    notFound();
  }
  const c = await getContent();
  const locale = await getLocale();
  const page = await getPageContentBySlug(slug, locale);
  if (!page.found) {
    notFound();
  }
  /* Strict locale: ha az adott nyelvi buildben nincs tartalom, 404 (nincs HU→EN fallback). */
  if (page.availableInLocale === false) {
    notFound();
  }
  const isEn = c.otherLocale.label === "HU";
  const subtitle =
    typeof page.heroDescription === "string"
      ? page.heroDescription
      : portableTextToPlain(page.heroDescription);

  return (
    <BeachPageShell
      eyebrow={c.meta.festivalDates}
      title={page.heroTitle || ""}
      subtitle={subtitle || ""}
      canonicalPath={`/${slug}/`}
      locale={isEn ? "en" : "hu"}
    >
      {page.videoUrl && (
        <div className="mx-auto mb-8 max-w-4xl">
          <VideoLiteEmbed
            title={page.videoTitle || page.heroTitle || c.meta.siteTitle}
            videoUrl={page.videoUrl}
            size="large"
          />
        </div>
      )}
      {page.body ? (
        <PageBody text={page.body} />
      ) : (
        !page.videoUrl && (
          <p className="mx-auto max-w-3xl text-center text-base" style={{ color: "var(--color-cream-50)" }}>
            {isEn
              ? "This page has no content yet. Editor: please fill in the Page body in Sanity."
              : "Ennek az oldalnak még nincs tartalma. Szerkesztő: töltsd ki a Page body mezőt a Sanityben."}
          </p>
        )
      )}
      <FlexibleSections locale={locale} sections={page.sections} />
    </BeachPageShell>
  );
}
