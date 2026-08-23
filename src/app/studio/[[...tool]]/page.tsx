import type { Metadata } from "next";
import { metadata as studioMetadata } from "next-sanity/studio";
import StudioClient from "./StudioClient";

export { viewport } from "next-sanity/studio";

/**
 * A Sanity Studio tisztán kliensoldali SPA — a szerver csak egy üres shellt ad
 * vissza. `force-static` nélkül a Studio saját routere minden dokumentum-
 * váltáskor új RSC kérést indított erre a `[[...tool]]` catch-all route-ra, és
 * mivel a root layout `headers()`-t használ, mindegyik külön Netlify Function
 * Invocation volt (`Cache-Control: no-store`). A `force-static` a shellt
 * build-időben rendereli és CDN-ből szolgálja ki — ezt javasolja a next-sanity
 * dokumentáció is.
 */
export const dynamic = "force-static";

/** A Studio soha ne kerüljön keresőindexbe. */
export const metadata: Metadata = {
  ...studioMetadata,
  robots: { index: false, follow: false, nocache: true },
};

export default function StudioPage() {
  return (
    <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
      <StudioClient />
    </div>
  );
}
