import type { Metadata } from "next";
import { metadataAlternates, siteUrlForLocale } from "@/lib/seo";
import type { Locale } from "@/lib/types";
import { isSanityConfigured, sanityClient } from "./client";
import { urlFor } from "./image";
import { getPageBySlugQuery } from "./queries";
import type { SanityImageRef, SeoFields } from "../types";

type GetSeoMetadataForPageInput = {
  slug: string;
  locale: Locale;
  fallbackTitle: string;
  fallbackDescription: string;
  fallbackOgImage: string;
};

type BuildPageMetadataWithSanityInput = {
  slug: string;
  path: string;
  locale: Locale;
  fallbackTitle: string;
  fallbackDescription: string;
  fallbackOgImage: string;
  siteTitle: string;
};

type SanitySeoResolution = {
  title: string;
  description: string;
  ogImage: string;
  canonicalOverride?: string;
  noIndex: boolean;
};

function localized(locale: Locale, huValue?: string, enValue?: string): string {
  return (locale === "en" ? enValue : huValue) || huValue || enValue || "";
}

function toAbsoluteUrl(inputUrl: string, locale: Locale): string {
  const trimmed = inputUrl.trim();
  if (!trimmed) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const base = siteUrlForLocale(locale);
  return `${base}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`;
}

function resolveSanityOgImage(image?: SanityImageRef, locale?: Locale): string | null {
  if (!image || !locale) return null;
  const built = urlFor(image)?.width(1200).height(630).url();
  if (!built) return null;
  return toAbsoluteUrl(built, locale);
}

export async function getSeoMetadataForPage(
  input: GetSeoMetadataForPageInput,
): Promise<SanitySeoResolution> {
  const fallbackOgImageAbsolute = toAbsoluteUrl(input.fallbackOgImage, input.locale);

  if (!isSanityConfigured()) {
    return {
      title: input.fallbackTitle,
      description: input.fallbackDescription,
      ogImage: fallbackOgImageAbsolute,
      noIndex: false,
    };
  }

  try {
    const page = await sanityClient.fetch<{ seo?: SeoFields } | null>(getPageBySlugQuery, {
      slug: input.slug,
    });
    const seo = page?.seo;

    const title = localized(input.locale, seo?.seoTitleHu, seo?.seoTitleEn) || input.fallbackTitle;
    const description =
      localized(input.locale, seo?.seoDescriptionHu, seo?.seoDescriptionEn) ||
      input.fallbackDescription;
    const canonicalOverrideRaw = localized(
      input.locale,
      seo?.canonicalOverrideHu,
      seo?.canonicalOverrideEn,
    );
    const canonicalOverride = canonicalOverrideRaw
      ? toAbsoluteUrl(canonicalOverrideRaw, input.locale)
      : undefined;
    const ogImage = resolveSanityOgImage(seo?.ogImage, input.locale) || fallbackOgImageAbsolute;

    return {
      title,
      description,
      ogImage,
      canonicalOverride,
      noIndex: seo?.noIndex === true,
    };
  } catch {
    return {
      title: input.fallbackTitle,
      description: input.fallbackDescription,
      ogImage: fallbackOgImageAbsolute,
      noIndex: false,
    };
  }
}

export async function buildPageMetadataWithSanity(
  input: BuildPageMetadataWithSanityInput,
): Promise<Metadata> {
  const seo = await getSeoMetadataForPage({
    slug: input.slug,
    locale: input.locale,
    fallbackTitle: input.fallbackTitle,
    fallbackDescription: input.fallbackDescription,
    fallbackOgImage: input.fallbackOgImage,
  });
  const alternates = metadataAlternates(input.path, input.locale);

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      ...alternates,
      canonical: seo.canonicalOverride || alternates.canonical,
    },
    openGraph: {
      title: `${seo.title} · ${input.siteTitle}`,
      description: seo.description,
      url: seo.canonicalOverride || alternates.canonical,
      images: [{ url: seo.ogImage, width: 1200, height: 630, alt: seo.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${seo.title} · ${input.siteTitle}`,
      description: seo.description,
      images: [seo.ogImage],
    },
    robots: seo.noIndex
      ? {
          index: false,
          follow: false,
          googleBot: { index: false, follow: false },
        }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true },
        },
  };
}
