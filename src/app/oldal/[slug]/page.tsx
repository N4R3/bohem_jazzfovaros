import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContent, getLocale } from "@/lib/locale";
import BeachPageShell from "@/components/layout/BeachPageShell";
import PageBody from "@/components/layout/PageBody";
import FlexibleSections from "@/components/layout/FlexibleSections";
import { getPageContentBySlug } from "@/sanity/lib/content";
import { sanityClient, isSanityConfigured } from "@/sanity/lib/client";
import { getAllActivePageSlugsWithLocaleQuery } from "@/sanity/lib/queries";
import { getBuildLocale } from "@/lib/buildLocale";
import { buildPageMetadataWithSanity } from "@/sanity/lib/seoContent";
import { portableTextToPlain } from "@/sanity/lib/portableText";

/**
 * Legacy /oldal/[slug] route (R1: kompatibilitási réteg).
 *
 * A kanonikus URL most a root-level /<slug>. A middleware a /oldal/<slug> kéréseket
 * 308-cal a /<slug>-re irányítja, így ez a komponens normál esetben nem renderel.
 * Megtartjuk biztonsági hálóként (ha a middleware-t megkerülnék): ugyanazokat a
 * renderelési + locale szabályokat alkalmazza, mint a root route.
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
]);

export const revalidate = 30;
/** Active pages always render even if hidden from nav. noIndex only suppresses indexing, never rendering. */
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
        // Only pre-generate pages that have content for the current build locale.
        // Pages without current-locale content remain accessible via ISR on direct URL.
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
  const fallbackDescription = typeof page.heroDescription === "string"
    ? page.heroDescription
    : (portableTextToPlain(page.heroDescription) || c.meta.siteDescription);
  return buildPageMetadataWithSanity({
    slug,
    path: `/oldal/${slug}/`,
    locale,
    fallbackTitle: page.heroTitle || c.meta.siteTitle,
    fallbackDescription: fallbackDescription,
    fallbackOgImage: "/images/og-image.jpg",
    siteTitle: c.meta.siteTitle,
  });
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (FIX_SLUGS.has(slug)) {
    /* A fix slug-okat NE rendereljük itt; a saját route-juk dolga. */
    notFound();
  }
  const c = await getContent();
  const locale = await getLocale();
  const page = await getPageContentBySlug(slug, locale);
  if (!page.found) {
    notFound();
  }
  /* Strict locale parity with the root /<slug> route. */
  if (page.availableInLocale === false) {
    notFound();
  }
  const isEn = c.otherLocale.label === "HU";
  const subtitle = typeof page.heroDescription === "string" ? page.heroDescription : portableTextToPlain(page.heroDescription);

  return (
    <BeachPageShell
      eyebrow={c.meta.festivalDates}
      title={page.heroTitle || ""}
      subtitle={subtitle || ""}
      canonicalPath={`/oldal/${slug}/`}
      locale={isEn ? "en" : "hu"}
    >
      {page.body ? (
        <PageBody text={page.body} />
      ) : (
        <p className="mx-auto max-w-3xl text-center text-base" style={{ color: "var(--color-cream-50)" }}>
          {isEn
            ? "This page has no content yet. Editor: please fill in the Page body in Sanity."
            : "Ennek az oldalnak még nincs tartalma. Szerkesztő: töltsd ki a Page body mezőt a Sanityben."}
        </p>
      )}
      <FlexibleSections locale={locale} sections={page.sections} />
    </BeachPageShell>
  );
}
