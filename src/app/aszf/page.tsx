import type { Metadata } from "next";
import { getContent, getLocale } from "@/lib/locale";
import PageBody from "@/components/layout/PageBody";
import RichText from "@/components/common/RichText";
import { getPageContentBySlug } from "@/sanity/lib/content";
import { breadcrumbSchema } from "@/lib/structuredData";
import { buildPageMetadataWithSanity } from "@/sanity/lib/seoContent";
import Container from "@/components/ui/Container";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const c = await getContent();
  return buildPageMetadataWithSanity({
    slug: "aszf",
    path: "/aszf/",
    locale,
    fallbackTitle: c.terms.title,
    fallbackDescription: c.meta.siteTitle,
    fallbackOgImage: "/images/og-image.jpg",
    siteTitle: c.meta.siteTitle,
  });
}

export default async function TermsPage() {
  const c = await getContent();
  const { terms } = c;
  const locale = c.otherLocale.label === "HU" ? "en" : "hu";
  const page = await getPageContentBySlug("aszf", locale);
  const title = page.heroTitle || terms.title;
  const breadcrumbJsonLd = breadcrumbSchema(locale, [
    { name: locale === "en" ? "Home" : "Főoldal", path: "/" },
    { name: title, path: "/aszf/" },
  ]);

  /* A Sanity-ben írt pageBody felülírja a kódbeli `terms.body`-t (ha kitöltött).
     Ez lehetővé teszi az ÁSZF teljes szerkesztését a Studio-ban. */
  const bodyText = page.body || terms.body;

  return (
    <div className="bg-[var(--color-cream-50)] pb-8 pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Container>
        <div className="mx-auto max-w-2xl">
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
            <PageBody text={bodyText} variant="plain" />
          </div>
        </div>
      </Container>
    </div>
  );
}
