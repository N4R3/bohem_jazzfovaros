import type { NextConfig } from "next";
import { getBuildLocale } from "./src/lib/buildLocale";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_LOCALE: getBuildLocale(),
  },
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: true,
  /**
   * Netlify Durable CDN cache a dinamikusan renderelt oldalakra.
   *
   * Ezt az ORIGIN válaszán kell beállítani, nem a middleware-ben. Élesben
   * mérve: a `/studio/` (force-static, a middleware matcherből kizárva, tehát
   * edge-fejlécet egyáltalán nem kap) `"Netlify Durable"; hit`-et ad, míg a
   * dinamikus oldalak `fwd=bypass`-t — pedig ott fut a middleware (a `/tabor/`
   * 308 redirect bizonyítja). A cache-döntés tehát az origin válasz
   * fejlécéből születik, és az edge function válasz-mutációja ehhez képest
   * későn érkezik. A middleware `Netlify-CDN-Cache-Control` fejléce ott marad,
   * mert a tisztán edge-en keletkező válaszoknál (308 redirect) az az egyetlen
   * cache-jelzés.
   *
   * A `Netlify-CDN-Cache-Control` csak a Netlify CDN-re vonatkozik — a böngésző
   * továbbra is a Next saját `no-store` fejlécét kapja, így a kliensnél nem
   * ragad be elavult HTML.
   *
   * A minta ugyanazt zárja ki, mint a middleware matcher, hogy a két réteg ne
   * mondjon ellent egymásnak: az `/api/*` saját `no-store`-t küld, a
   * `_next/static` immutable, a `/images/*` pedig a netlify.toml hosszú
   * cache-ét kapja.
   */
  async headers() {
    return [
      {
        source: "/:path((?!api/|_next/|images/|documents/|studio).*)",
        headers: [
          {
            key: "Netlify-CDN-Cache-Control",
            value: "public, s-maxage=60, stale-while-revalidate=240, durable",
          },
        ],
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    /**
     * Szűkített srcset-készlet (alapból 8 + 8 = 16 méret képenként).
     *
     * A főoldal ~70 képet tartalmaz; a teljes alapértelmezett készlettel ez
     * ~800 srcset URL, ami önmagában ~240 KB-ot tett ki a 288 KB-os HTML-ből —
     * és minden generált méret külön Netlify Image CDN kérés (= extra
     * edge execution + rosszabb cache-találati arány). A 4 + 4 méret lefedi a
     * valós eszközsávokat (a böngésző mindig a következő nagyobbat választja),
     * vizuális különbség nélkül.
     *
     * 2560 azért maradt bent, mert a `sizes="100vw"` képek (pl. a
     * fesztiváltérkép) retina laptopon 2x DPR-rel ~2600 px-t kérnének — 1920
     * felső korláttal ott látható lágyulás lenne. A 3840 kimaradt: 4K + 2x
     * DPR ritka, és a forrásképek úgysem érik el azt a méretet (a Next és a
     * Netlify Image CDN sosem nagyít a forrás fölé).
     */
    deviceSizes: [640, 828, 1200, 1920, 2560],
    imageSizes: [64, 128, 256, 384],
    /** Netlify Image CDN-nél is segít: hosszabb élettartamú optimalizált variánsok. */
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/**" },
    ],
  },
  /** Windows-on a webpack pack cache néha ENOENT / hiányzó chunk hibát okoz dev módban */
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
