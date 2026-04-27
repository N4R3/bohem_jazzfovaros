import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Bebas_Neue, Poppins, Pacifico } from "next/font/google";
import { getContent, getLocale } from "@/lib/locale";
import { BASE_URL, canonicalUrl, metadataAlternates } from "@/lib/seo";
import Scripts from "@/components/analytics/Scripts";
import CookieBanner from "@/components/analytics/CookieBanner";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import BackgroundWrapper from "@/components/layout/BackgroundWrapper";
import AppShell from "@/components/layout/AppShell";
import { organizationSchema, websiteSchema } from "@/lib/structuredData";

export const dynamic = "force-dynamic";

/* Fontok next/font/google segítségével töltődnek be — azonos originről
   szolgáltatva, render-blocking nélkül, automatikus preload-dal. */
const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-poppins",
  display: "swap",
});

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-pacifico",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const isEn = locale === "en";
  const c = await getContent();
  const ogImage = `${BASE_URL}/images/og-image.jpg`;
  const localizedPath = "/";

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: c.meta.siteTitle,
      template: `%s · ${c.meta.siteTitle}`,
    },
    description: c.meta.siteDescription,
    alternates: metadataAlternates(localizedPath, locale),
    openGraph: {
      title: c.meta.siteTitle,
      description: c.meta.siteDescription,
      url: canonicalUrl(localizedPath, locale),
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
    icons: {
      icon: "/favicon.png",
      shortcut: "/favicon.png",
      apple: "/favicon.png",
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
    <html
      lang={isEn ? "en" : "hu"}
      className={`${bebasNeue.variable} ${poppins.variable} ${pacifico.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased text-ink-800">
        <AppShell
          publicShell={
            <>
              <Scripts />
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify(
                    websiteSchema(locale, c.meta.siteTitle, c.meta.siteDescription),
                  ),
                }}
              />
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify(
                    organizationSchema(locale, {
                      name: c.contact.organizer,
                      logo: "/images/header_logo.png",
                      sameAs: [
                        c.contact.socials.facebook,
                        c.contact.socials.instagram,
                        c.contact.socials.youtube,
                      ],
                    }),
                  ),
                }}
              />
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-orange-500 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
              >
                {isEn ? "Skip to content" : "Ugrás a tartalomhoz"}
              </a>
              <Navbar content={c} />
              <BackgroundWrapper>
                <main id="main-content" className="pt-[76px]">
                  {children}
                </main>
                <Footer />
              </BackgroundWrapper>
              <CookieBanner />
            </>
          }
        >
          {children}
        </AppShell>
      </body>
    </html>
  );
}
