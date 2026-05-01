import type { StructureResolver } from "sanity/structure";

export const SINGLETON_TYPES = [
  "siteSettings",
  "popupSettings",
  "venue",
] as const;

/**
 * Bal oldali Studio menü rendezett, magyar nyelvű csoportokban.
 * A singleton dokumentumok (siteSettings, popupSettings, venue) saját menüpontként
 * jelennek meg; minden más dokumentumtípus listaként.
 */
export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title("Tartalom")
    .items([
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

      S.documentTypeListItem("navigationItem").title("🧭 Navigáció / Menü"),
      S.documentTypeListItem("page").title("📄 Oldalak (Pages)"),

      S.listItem()
        .title("⚡ Jazztábor — Page (slug: tabor)")
        .id("page-list-tabor")
        .child(
          S.documentList()
            .title("Jazztábor Page")
            .filter('_type == "page" && slug.current == "tabor"')
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

      S.documentTypeListItem("programItem").title("📅 Program tételek"),
      S.documentTypeListItem("stage").title("🎤 Színpadok / helyszínek"),

      S.divider(),

      S.documentTypeListItem("performer").title("🎷 Fellépők"),
      S.documentTypeListItem("performerTag").title("🏷️ Fellépő címkék / műfajok"),

      S.divider(),

      S.documentTypeListItem("ticket").title("🎟️ Jegyek"),
      S.documentTypeListItem("accommodation").title("🏨 Szállás"),
      S.documentTypeListItem("transportItem").title("🚗 Közlekedés"),

      S.divider(),

      S.documentTypeListItem("sponsor").title("🤝 Támogatók"),
      S.documentTypeListItem("sponsorCategory").title("🗂️ Támogatói kategóriák"),

      S.divider(),

      S.listItem()
        .title("📍 Helyszín (Venue)")
        .id("venue")
        .child(S.document().schemaType("venue").documentId("venue")),
    ]);
