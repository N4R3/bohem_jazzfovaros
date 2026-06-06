import { defineField, defineType } from "sanity";
import { richText } from "./richText";

export const sectionTextBoxType = defineType({
  name: "sectionTextBox",
  title: "Szekció: Szövegdoboz",
  type: "object",
  fields: [
    defineField({ name: "enabled", title: "Engedélyezett", type: "boolean", initialValue: true }),
    defineField({ name: "titleHu", title: "Cím (HU)", type: "string" }),
    defineField({ name: "titleEn", title: "Cím (EN)", type: "string" }),
    defineField({ name: "bodyRichHu", title: "Doboz tartalma (HU)", ...richText }),
    defineField({ name: "bodyRichEn", title: "Doboz tartalma (EN)", ...richText }),
    defineField({
      name: "variant",
      title: "Doboz stílus",
      type: "string",
      initialValue: "default",
      options: {
        list: [
          { title: "Alap", value: "default" },
          { title: "Kiemelt", value: "highlight" },
          { title: "Visszafogott", value: "muted" },
        ],
      },
    }),
  ],
  preview: {
    select: { title: "titleHu", variant: "variant", enabled: "enabled" },
    prepare({ title, variant, enabled }) {
      return {
        title: title || "Szövegdoboz szekció",
        subtitle: `${enabled === false ? "inaktív" : "aktív"} · ${variant || "default"}`,
      };
    },
  },
});
