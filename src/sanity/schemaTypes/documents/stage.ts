import { defineField, defineType } from "sanity";

/**
 * Színpad / helyszín dokumentum.
 * A programItem mezőről hivatkozunk rá (`stageRef`), így az ügyfél egyszerű listából
 * tud választani. A nevet pontosan úgy jeleníti meg a frontend, ahogy itt rögzítve van.
 */
export const stageType = defineType({
  name: "stage",
  title: "Színpad / Helyszín",
  type: "document",
  description:
    "A fesztivál színpadai és helyszínei. A program tételeknél innen lehet választani – a kódban nincs hardcode-olt 'Főszínpad'/'Nagysátor' átírás, a frontend ezt a nevet mutatja.",
  fields: [
    defineField({
      name: "nameHu",
      title: "Név (HU)",
      type: "string",
      description: "Pl. Nagysátor, Főszínpad, Klub, Beach.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "nameEn",
      title: "Név (EN)",
      type: "string",
      description: "Angol nyelvű név. Ha üres, a magyart használjuk.",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "nameHu", maxLength: 64 },
      description: "Belső azonosító. Ha nem adsz meg, magától generálódik.",
    }),
    defineField({
      name: "descriptionHu",
      title: "Leírás (HU)",
      type: "text",
      rows: 2,
      description: "Opcionális rövid bemutatkozás (jelenleg nem mindenhol jelenik meg).",
    }),
    defineField({
      name: "descriptionEn",
      title: "Leírás (EN)",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "order",
      title: "Sorrend",
      type: "number",
      initialValue: 0,
      description: "Kisebb szám = előrébb a Studio listában.",
    }),
    defineField({
      name: "isActive",
      title: "Aktív",
      type: "boolean",
      initialValue: true,
      description: "Ha ki van kapcsolva, a Studio listájában elérhető marad, de új Program tételhez ne válaszd ki.",
    }),
  ],
  preview: {
    select: { title: "nameHu", subtitle: "nameEn" },
  },
});
