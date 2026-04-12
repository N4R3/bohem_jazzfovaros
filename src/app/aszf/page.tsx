import type { Metadata } from "next";
import { getContent } from "@/lib/locale";
import { canonicalUrl } from "@/lib/seo";
import Container from "@/components/ui/Container";

export function generateMetadata(): Metadata {
  const c = getContent();
  return {
    title: c.terms.title,
    description: c.meta.siteTitle,
    alternates: { canonical: canonicalUrl("/aszf/") },
    openGraph: {
      title: `${c.terms.title} · ${c.meta.siteTitle}`,
      description: c.meta.siteDescription,
      url: canonicalUrl("/aszf/"),
    },
  };
}

export default function TermsPage() {
  const c = getContent();
  const { terms } = c;

  return (
    <div className="min-h-screen bg-[var(--color-cream-50)] py-20">
      <Container>
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-8 font-display text-3xl font-bold text-[var(--color-navy-900)] sm:text-4xl">
            {terms.title}
          </h1>
          <div className="prose prose-neutral max-w-none rounded-2xl border border-[var(--color-cream-200)] bg-white p-8 shadow-sm">
            {terms.body.split("\n\n").map((paragraph, i) => (
              <p key={i} className="mb-4 text-sm leading-relaxed text-[var(--color-navy-900)]/70 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
