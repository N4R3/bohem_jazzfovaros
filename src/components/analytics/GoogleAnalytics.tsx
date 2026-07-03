/**
 * Google tag (gtag.js) — megrendelői specifikáció szerint.
 * Egyszer, globálisan a <head>-ben (src/app/layout.tsx).
 * Measurement ID: G-Y9BMR7XZK6
 */

import Script from "next/script";

const GA_ID = "G-Y9BMR7XZK6";

export default function GoogleAnalytics() {
  return (
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `,
        }}
      />
    </>
  );
}
