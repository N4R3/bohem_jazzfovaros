import type { StructureResolver } from "sanity/structure";

export const SINGLETON_TYPES = [
  "siteSettings",
  "popupSettings",
  "venue",
] as const;

/**
 * Bal oldali Studio menü — rendezett, magyar nyelvű csoportokban.
 *
 * VIDEÓ (R2): A fooldal es a jazztabor videoja MOST a sajat Page dokumentumukon
 * szerkesztheto (Page -> "Video (YouTube link)" mezo), NEM a globalis Video
 * gyujtemenyben. A globalis "Video" dokumentum masodlagos/deprecated: csak akkor
 * kell, ha egy oldal a rugalmas szekciok kozott "Szekcio: Video" blokkot hasznal.
 *
 * Fooldal szerkesztes (R3): a Fooldal Page dokumentum — hero, stat sáv, CTA banner,
 * video link (videoUrl), SEO. A fooldali jegyboxok a Jegy dokumentumoknal
 * (showOnHome + homeOrder).
 *
 * Singleton dokumentumok sajat menupontkent; minden mas dokumentumtipus listakent.
 */
export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title("Tartalom")
    .items([
      // ── Főoldal szerkesztés ────────────────────────────────────────────
      S.listItem()
        .title("🏠 Főoldal szerkesztés")
        .id("homepage-editing")
        .child(
          S.list()
            .title("Főoldal szerkesztés")
            .items([
              S.listItem()
                .title("📄 Főoldal Page (hero, stat, CTA, videó, SEO)")
                .id("page-home-editor")
                .child(
                  S.documentList()
                    .title("Főoldal Page — slug: home")
                    .filter('_type == "page" && slug.current == "home"')
                    .defaultOrdering([{ field: "_updatedAt", direction: "desc" }]),
                ),
              S.documentTypeListItem("ticket")
                .title("🎟️ Jegyek (showOnHome + homeOrder = főoldali jegyboxok)"),
            ]),
        ),

      S.divider(),

      // ── Globális beállítások ───────────────────────────────────────────
      S.listItem()
        .title("⚙️ Site settings (alapadatok)")
        .id("siteSettings")
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings"),
        ),

      S.listItem()
        .title("🔔 Popup settings")
        .id("popupSettings")
        .child(
          S.document()
            .schemaType("popupSettings")
            .documentId("popupSettings"),
        ),

      S.divider(),

      // ── Oldalak ───────────────────────────────────────────────────────
      S.documentTypeListItem("navigationItem").title("🧭 Navigáció / Menü"),
      S.documentTypeListItem("page").title("📄 Oldalak (Pages)"),

      // Gyors elérés a slug-specifikus fix oldalakhoz
      S.listItem()
        .title("⚡ Jazztábor — Page (slug: tabor / jazztabor)")
        .id("page-list-jazztabor")
        .child(
          S.documentList()
            .title("Jazztábor Page")
            .filter('_type == "page" && (slug.current == "tabor" || slug.current == "jazztabor")')
            .defaultOrdering([{ field: "_updatedAt", direction: "desc" }]),
        ),

      S.listItem()
        .title("⚡ Futás — Page (slug: futas)")
        .id("page-list-futas")
        .child(
          S.documentList()
            .title("Futás Page")
            .filter('_type == "page" && slug.current == "futas"')
            .defaultOrdering([{ field: "_updatedAt", direction: "desc" }]),
        ),

      S.divider(),

      // ── Program ───────────────────────────────────────────────────────
      S.documentTypeListItem("programItem").title("📅 Program tételek"),
      S.documentTypeListItem("stage").title("🎤 Színpadok / helyszínek"),

      S.divider(),

      // ── Fellépők ──────────────────────────────────────────────────────
      S.documentTypeListItem("performer").title("🎷 Fellépők"),
      S.documentTypeListItem("performerTag").title("🏷️ Fellépő címkék / műfajok"),

      S.divider(),

      // ── Jegyek + Szállás + (másodlagos) Videók ────────────────────────
      S.documentTypeListItem("ticket").title("🎟️ Jegyek"),
      S.documentTypeListItem("video").title("🎬 Videók (másodlagos — csak rugalmas szekcióhoz)"),
      S.documentTypeListItem("accommodation").title("🏨 Szállás"),
      S.documentTypeListItem("transportItem").title("🚗 Közlekedés"),

      S.divider(),

      // ── Szponzorok ────────────────────────────────────────────────────
      S.documentTypeListItem("sponsor").title("🤝 Támogatók"),
      S.documentTypeListItem("sponsorCategory").title("🗂️ Támogatói kategóriák"),

      S.divider(),

      // ── Helyszín ──────────────────────────────────────────────────────
      S.listItem()
        .title("📍 Helyszín (Venue)")
        .id("venue")
        .child(S.document().schemaType("venue").documentId("venue")),
    ]);
