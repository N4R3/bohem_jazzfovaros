import type { Metadata } from "next";
import { getContent, getLocale } from "@/lib/locale";
import PageBody from "@/components/layout/PageBody";
import RichText from "@/components/common/RichText";
import FlexibleSections from "@/components/layout/FlexibleSections";
import { getPageContentBySlug } from "@/sanity/lib/content";
import { buildPageMetadataWithSanity } from "@/sanity/lib/seoContent";
import { breadcrumbSchema } from "@/lib/structuredData";
import Container from "@/components/ui/Container";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const c = await getContent();
  return buildPageMetadataWithSanity({
    slug: "adatvedelem",
    path: "/adatvedelem/",
    locale,
    fallbackTitle: locale === "hu" ? "Adatvédelmi tájékoztató" : "Privacy Policy",
    fallbackDescription: c.meta.siteTitle,
    fallbackOgImage: "/images/og-image.jpg",
    siteTitle: c.meta.siteTitle,
  });
}

export default async function PrivacyPolicyPage() {
  const locale = await getLocale();
  const page = await getPageContentBySlug("adatvedelem", locale as "hu" | "en");
  const title = page.heroTitle || (locale === "hu" ? "Adatvédelmi tájékoztató" : "Privacy Policy");
  const breadcrumbJsonLd = breadcrumbSchema(locale, [
    { name: locale === "en" ? "Home" : "Főoldal", path: "/" },
    { name: title, path: "/adatvedelem/" },
  ]);

  return (
    <div className="bg-[var(--color-cream-50)] pb-8 pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-8 font-display text-3xl font-bold text-[var(--color-navy-900)] sm:text-4xl">
            {title}
          </h1>
          {page.heroDescription && (
            <div className="mb-6 text-base leading-relaxed text-[var(--color-navy-900)]/80">
              {typeof page.heroDescription === "string" ? (
                <p>{page.heroDescription}</p>
              ) : (
                <RichText value={page.heroDescription} />
              )}
            </div>
          )}
          <div className="overflow-hidden break-words rounded-2xl border border-[var(--color-cream-200)] bg-white p-8 shadow-sm [&_a]:break-all">
            <PageBody text={page.body} variant="plain" />
          </div>
          <div className="mt-6">
            <FlexibleSections locale={locale} sections={page.sections} />
          </div>
        </div>
      </Container>
    </div>
  );
}
