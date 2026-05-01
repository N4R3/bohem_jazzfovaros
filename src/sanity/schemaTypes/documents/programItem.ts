import { defineField, defineType } from "sanity";

export const programItemType = defineType({
  name: "programItem",
  title: "Program tétel",
  type: "document",
  description:
    "Egy programpont (időpont + színpad + cím / fellépők). Egy fellépő több programItemhez is rendelhető – egyszerűen vedd fel ugyanazt a Performer-t több időpontnál.",
  fields: [
    defineField({
      name: "titleHu",
      title: "Cím (HU)",
      type: "string",
      description:
        "Pl. Bohém Ragtime Jazz Band. Ha vannak fellépők hozzárendelve, ők jelennek meg a kártyán; a cím ekkor opcionális kísérőszöveg.",
    }),
    defineField({
      name: "titleEn",
      title: "Cím (EN)",
      type: "string",
    }),
    defineField({
      name: "descriptionHu",
      title: "Leírás (HU)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "descriptionEn",
      title: "Leírás (EN)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "date",
      title: "Dátum",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "startTime",
      title: "Kezdés (HH:MM)",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "endTime",
      title: "Vége (opcionális)",
      type: "string",
    }),
    defineField({
      name: "stageRef",
      title: "Színpad / helyszín — ajánlott",
      type: "reference",
      to: [{ type: "stage" }],
      description:
        "Itt válassz a Stages alatt felvett színpadokból. Ezt a nevet jeleníti meg a frontend (pl. Nagysátor); nincs hardcode-olt átírás. Ha üresen hagyod, a régi szöveges stage érték érvényesül.",
    }),
    defineField({
      name: "stage",
      title: "Színpad – legacy szöveg",
      type: "string",
      description:
        "LEGACY / fallback. Új tartalomnál a fenti stageRef mezőt használd. Ha a stageRef ki van töltve, ez nem jelenik meg.",
    }),
    defineField({
      name: "category",
      title: "Kategória",
      type: "string",
      description: "Opcionális szöveges címke (pl. workshop, koncert).",
    }),
    defineField({
      name: "performers",
      title: "Fellépők",
      type: "array",
      of: [{ type: "reference", to: [{ type: "performer" }] }],
      description:
        "Egy programItemhez több fellépő rendelhető. Egy fellépő több programItemhez is rendelhető (több időpont) – ugyanazt a Performer-t többször is felveheted különböző programItemekbe.",
    }),
    defineField({
      name: "order",
      type: "number",
      initialValue: 0,
      description: "Programon belüli sorrend",
    }),
    defineField({
      name: "isActive",
      type: "boolean",
      initialValue: true,
      description: "Megjelenik az oldalon?",
    }),
    defineField({ name: "seo", type: "seo" }),
  ],
  preview: {
    select: {
      title: "titleHu",
      date: "date",
      time: "startTime",
      stageRef: "stageRef.nameHu",
      stage: "stage",
    },
    prepare({ title, date, time, stageRef, stage }) {
      const stageLabel = stageRef || stage || "—";
      return {
        title: title || "(névtelen)",
        subtitle: `${date || "?"} · ${time || "?"} · ${stageLabel}`,
      };
    },
  },
  orderings: [
    {
      title: "Dátum, idő szerint",
      name: "dateTimeAsc",
      by: [
        { field: "date", direction: "asc" },
        { field: "startTime", direction: "asc" },
      ],
    },
  ],
});
