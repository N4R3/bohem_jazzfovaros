import type { StructureResolver } from "sanity/structure";

export const SINGLETON_TYPES = [
  "siteSettings",
  "popupSettings",
  "venue",
] as const;

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title("Tartalom")
    .items([
      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings"),
        ),
      S.listItem()
        .title("Popup settings")
        .id("popupSettings")
        .child(
          S.document()
            .schemaType("popupSettings")
            .documentId("popupSettings"),
        ),
      S.documentTypeListItem("page").title("Pages"),
      S.documentTypeListItem("performer").title("Performers"),
      S.documentTypeListItem("programItem").title("Program"),
      S.documentTypeListItem("ticket").title("Tickets"),
      S.documentTypeListItem("sponsor").title("Sponsors"),
      S.documentTypeListItem("sponsorCategory").title("Sponsor categories"),
      S.documentTypeListItem("accommodation").title("Accommodation"),
      S.documentTypeListItem("transportItem").title("Transport"),
      S.listItem()
        .title("Venue")
        .id("venue")
        .child(S.document().schemaType("venue").documentId("venue")),
    ]);
