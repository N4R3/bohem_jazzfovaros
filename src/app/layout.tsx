import type { Metadata, Viewport } from "next";
import "./globals.css";
import { getContent, getLocale } from "@/lib/locale";
import { BASE_URL, canonicalUrl } from "@/lib/seo";
import Scripts from "@/components/analytics/Scripts";
import CookieBanner from "@/components/analytics/CookieBanner";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import BackgroundWrapper from "@/components/layout/BackgroundWrapper";

export const dynamic = "force-dynamic";

/* Fontok (Poppins body, Bebas Neue display, Pacifico script) a
   globals.css-ben @import-olódnak a Google Fonts CDN-ről — pontosan
   úgy, ahogy a jazzdesign1/Bohem Jazzfovaros 2026.html csinálja. */

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const isEn = locale === "en";
  const c = await getContent();
  const ogImage = `${BASE_URL}/images/og-image.jpg`;
  const localizedPath = isEn ? "/en/" : "/";
  const alternatePath = isEn ? "/" : "/en/";

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: c.meta.siteTitle,
      template: `%s · ${c.meta.siteTitle}`,
    },
    description: c.meta.siteDescription,
    alternates: {
      canonical: canonicalUrl(localizedPath),
      languages: {
        [isEn ? "hu" : "en"]: canonicalUrl(alternatePath),
      },
    },
    openGraph: {
      title: c.meta.siteTitle,
      description: c.meta.siteDescription,
      url: canonicalUrl(localizedPath),
      siteName: c.meta.siteTitle,
      locale: isEn ? "en_GB" : "hu_HU",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: c.meta.siteTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: c.meta.siteTitle,
      description: c.meta.siteDescription,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    manifest: "/site.webmanifest",
  };
}

export const viewport: Viewport = {
  /* Világos ég-kék #bfe6f5 — a jazzdesign1 header háttere */
  themeColor: "#bfe6f5",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const isEn = locale === "en";
  const c = await getContent();

  return (
    <html lang={isEn ? "en" : "hu"} suppressHydrationWarning>
      <body className="font-sans antialiased text-ink-800">
        <Scripts />

        {/* Akadálymentes skip-to-content link — billentyűzet navigációhoz */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-orange-500 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
        >
          {isEn ? "Skip to content" : "Ugrás a tartalomhoz"}
        </a>

        {/* Globális fixed fehér navigáció (jazzdesign1) */}
        <Navbar content={c} />

        <BackgroundWrapper>
          {/* Oldal-tartalom — a page.tsx-ek itt renderelődnek.
              A Navbar `fixed` (76px magas), ezért a main a
              jazzdesign1 `.page-bg { margin-top: var(--navbar-height) }`
              megoldásához hasonlóan pt-[76px] kap. */}
          <main id="main-content" className="pt-[76px]">
            {children}
          </main>

          {/* Globális footer (minden oldalon) */}
          <Footer />
        </BackgroundWrapper>

        <CookieBanner />
      </body>
    </html>
  );
}
