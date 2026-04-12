/**
 * Analytics & Tag Manager Scripts
 *
 * IDs are read from environment variables — never hardcoded.
 * Set in .env.local (or your hosting environment):
 *
 *   NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
 *   NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
 *   NEXT_PUBLIC_GADS_ID=AW-XXXXXXXXXX
 *
 * Leave a variable unset to skip that script entirely.
 * Scripts only fire after the user consents (see CookieBanner).
 */

import Script from "next/script";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;
const GADS_ID = process.env.NEXT_PUBLIC_GADS_ID;

export default function Scripts() {
  return (
    <>
      {/* Google Tag Manager — used when NEXT_PUBLIC_GTM_ID is set; manages GA4 + Ads internally */}
      {GTM_ID && (
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
      )}

      {/* GA4 + Ads — only when GTM is NOT configured */}
      {!GTM_ID && (GA4_ID || GADS_ID) && (
        <>
          {GA4_ID && (
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
              strategy="afterInteractive"
            />
          )}
          <Script
            id="gtag-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments)}
gtag('js',new Date());
${GA4_ID ? `gtag('config','${GA4_ID}',{anonymize_ip:true});` : ""}
${GADS_ID ? `gtag('config','${GADS_ID}');` : ""}`,
            }}
          />
        </>
      )}
    </>
  );
}
