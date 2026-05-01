import type { Metadata } from "next";
import { getContent, getLocale } from "@/lib/locale";
import Container from "@/components/ui/Container";
import { breadcrumbSchema } from "@/lib/structuredData";
import { buildPageMetadataWithSanity } from "@/sanity/lib/seoContent";
import { getPageContentBySlug } from "@/sanity/lib/content";

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
    <div className="min-h-screen bg-[var(--color-cream-50)] py-20">
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
            <p className="mb-6 text-base leading-relaxed text-[var(--color-navy-900)]/80">
              {page.heroDescription}
            </p>
          )}
          <div className="prose prose-neutral max-w-none rounded-2xl border border-[var(--color-cream-200)] bg-white p-8 shadow-sm">
            {bodyText.split(/\n{2,}/).map((paragraph, i) => (
              <p key={i} className="mb-4 whitespace-pre-line text-sm leading-relaxed text-[var(--color-navy-900)]/70 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
