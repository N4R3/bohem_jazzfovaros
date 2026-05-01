import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContent, getLocale } from "@/lib/locale";
import BeachPageShell from "@/components/layout/BeachPageShell";
import PageBody from "@/components/layout/PageBody";
import { getPageContentBySlug } from "@/sanity/lib/content";
import { sanityClient, isSanityConfigured } from "@/sanity/lib/client";
import { getAllActivePageSlugsQuery } from "@/sanity/lib/queries";
import { buildPageMetadataWithSanity } from "@/sanity/lib/seoContent";

/**
 * Dinamikus oldal — új információs oldalak létrehozható a Sanity Pages alól.
 * A 10 fix slug saját route-on van, így ezeket KIZÁRJUK ide:
 *  home, info, lineup, program, contact, szallas, terkep, futas, tabor, aszf
 *
 * Bármilyen más slug (pl. `gyik`, `sajto`) automatikusan elérhető lesz a
 * /oldal/[slug] URL-en, ha a Page dokumentum aktív.
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
  "aszf",
]);

export const revalidate = 30;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  if (!isSanityConfigured()) return [];
  try {
    const slugs = await sanityClient.fetch<string[]>(getAllActivePageSlugsQuery, {}, {
      next: { revalidate: 30 },
    });
    return (slugs || [])
      .filter((s) => typeof s === "string" && s.length > 0 && !FIX_SLUGS.has(s))
      .map((slug) => ({ slug }));
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
  return buildPageMetadataWithSanity({
    slug,
    path: `/oldal/${slug}/`,
    locale,
    fallbackTitle: page.heroTitle || c.meta.siteTitle,
    fallbackDescription: page.heroDescription || c.meta.siteDescription,
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
  const isEn = c.otherLocale.label === "HU";

  return (
    <BeachPageShell
      eyebrow={c.meta.festivalDates}
      title={page.heroTitle || ""}
      subtitle={page.heroDescription || ""}
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
    </BeachPageShell>
  );
}
