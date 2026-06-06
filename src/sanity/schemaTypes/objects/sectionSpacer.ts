import { defineField, defineType } from "sanity";

export const sectionSpacerType = defineType({
  name: "sectionSpacer",
  title: "Szekció: Térköz / elválasztó",
  type: "object",
  fields: [
    defineField({ name: "enabled", title: "Engedélyezett", type: "boolean", initialValue: true }),
    defineField({
      name: "size",
      title: "Méret",
      type: "string",
      initialValue: "md",
      options: {
        list: [
          { title: "Kicsi", value: "sm" },
          { title: "Közepes", value: "md" },
          { title: "Nagy", value: "lg" },
          { title: "Extra nagy", value: "xl" },
        ],
      },
    }),
    defineField({
      name: "showDivider",
      title: "Elválasztó vonal",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { size: "size", enabled: "enabled", divider: "showDivider" },
    prepare({ size, enabled, divider }) {
      return {
        title: "Térköz / elválasztó szekció",
        subtitle: `${enabled === false ? "inaktív" : "aktív"} · ${size || "md"}${divider ? " · divider" : ""}`,
      };
    },
  },
});
