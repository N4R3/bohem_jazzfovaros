import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { deskStructure } from "./src/sanity/deskStructure";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "demo";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "default",
  title: "Bohém Jazzfőváros CMS",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: deskStructure,
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
  document: {
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type !== "global") return prev;
      return prev.filter(
        (item) =>
          item.templateId !== "siteSettings" &&
          item.templateId !== "popupSettings" &&
          item.templateId !== "venue",
      );
    },
    actions: (prev, context) => {
      if (
        context.schemaType === "siteSettings" ||
        context.schemaType === "popupSettings" ||
        context.schemaType === "venue"
      ) {
        return prev.filter(
          ({ action }) => action !== "duplicate" && action !== "delete",
        );
      }
      return prev;
    },
  },
});
