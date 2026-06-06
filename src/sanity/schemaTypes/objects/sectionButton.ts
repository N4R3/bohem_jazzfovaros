import { defineField, defineType } from "sanity";

export const sectionButtonType = defineType({
  name: "sectionButton",
  title: "Szekció: CTA gomb",
  type: "object",
  fields: [
    defineField({ name: "enabled", title: "Engedélyezett", type: "boolean", initialValue: true }),
    defineField({ name: "labelHu", title: "Felirat (HU)", type: "string" }),
    defineField({ name: "labelEn", title: "Felirat (EN)", type: "string" }),
    defineField({ name: "url", title: "URL", type: "url" }),
    defineField({
      name: "style",
      title: "Stílus",
      type: "string",
      initialValue: "primary",
      options: {
        list: [
          { title: "Elsődleges", value: "primary" },
          { title: "Másodlagos", value: "secondary" },
          { title: "Link", value: "link" },
        ],
      },
    }),
    defineField({
      name: "openInNewTab",
      title: "Új lapon nyíljon",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "labelHu", url: "url", enabled: "enabled" },
    prepare({ title, url, enabled }) {
      return {
        title: title || "CTA gomb szekció",
        subtitle: `${enabled === false ? "inaktív" : "aktív"}${url ? ` · ${url}` : ""}`,
      };
    },
  },
});
