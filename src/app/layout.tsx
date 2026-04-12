import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { getContent } from "@/lib/locale";
import { BASE_URL, ALT_URL, canonicalUrl } from "@/lib/seo";
import Footer from "@/components/layout/Footer";
import Scripts from "@/components/analytics/Scripts";
import CookieBanner from "@/components/analytics/CookieBanner";
import ThemeInit from "@/components/theme/ThemeInit";
import ThemeSwitcher from "@/components/theme/ThemeSwitcher";
import { ThemeProvider } from "@/components/theme/ThemeContext";
import ThemedHeader from "@/components/layout/ThemedHeader";
import ThemeBackground from "@/components/theme/ThemeBackground";
import MainContent from "@/components/layout/MainContent";
import { getBuildLocale } from "@/lib/buildLocale";

const isEn = getBuildLocale() === "en";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export function generateMetadata(): Metadata {
  const c = getContent();
  const ogImage = `${BASE_URL}/images/og-image.jpg`;

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: c.meta.siteTitle,
      template: `%s · ${c.meta.siteTitle}`,
    },
    description: c.meta.siteDescription,
    alternates: {
      canonical: canonicalUrl("/"),
      languages: {
        [isEn ? "hu" : "en"]: ALT_URL,
      },
    },
    openGraph: {
      title: c.meta.siteTitle,
      description: c.meta.siteDescription,
      url: canonicalUrl("/"),
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
  themeColor: "#0f1b2d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const c = getContent();
  return (
    <html lang={isEn ? "en" : "hu"} suppressHydrationWarning>
      <head>
        <ThemeInit />
      </head>
      <body className={`${inter.variable} ${playfair.variable}`}>
        <Scripts />
        <ThemeProvider>
          <ThemeBackground />
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[var(--color-gold-500)] focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-[var(--color-navy-900)]"
          >
            {isEn ? "Skip to content" : "Ugrás a tartalomhoz"}
          </a>
          <ThemedHeader
            siteTitle={c.meta.siteTitle}
            festivalDates={c.meta.festivalDates}
            nav={c.nav}
            otherLocale={c.otherLocale}
          />
          <MainContent>{children}</MainContent>
          <Footer />
          <CookieBanner />
          <ThemeSwitcher />
        </ThemeProvider>
      </body>
    </html>
  );
}
