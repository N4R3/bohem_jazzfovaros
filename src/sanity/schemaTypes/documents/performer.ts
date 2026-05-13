import { defineArrayMember, defineField, defineType } from "sanity";
import { richText } from "../objects/richText";

export const performerType = defineType({
  name: "performer",
  title: "Performer",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "name", maxLength: 96 } }),
    defineField({
      name: "image",
      title: "Fellépő képe",
      type: "image",
      description:
        "Sanity asset (ajánlott). Ha üres, az alábbi legacy útvonal érvényesül. A frontenden mindig egy kép jelenik meg.",
    }),
    defineField({
      name: "imageDisplayMode",
      title: "Kép megjelenítési módja",
      type: "string",
      initialValue: "cover",
      options: {
        list: [
          { title: "Kitöltés (cover)", value: "cover" },
          { title: "Teljes kép (contain)", value: "contain" },
          { title: "Fekvő (landscape)", value: "landscape" },
          { title: "Álló (portrait)", value: "portrait" },
        ],
      },
      description:
        "cover = kitölti a keretet (alapértelmezett). contain = teljes kép látható. landscape = fekvő mód (csoportképekhez). portrait = álló mód (szólóképekhez).",
    }),
    defineField({
      name: "imagePath",
      title: "Legacy képútvonal",
      type: "string",
      description:
        "Régi public/images útvonal — csak technikai fallback, ha még nincs Sanity image feltöltve. Új tartalomnál a fenti kép-mezőt használd.",
      readOnly: true,
    }),
    defineField({
      name: "shortDescriptionRichHu",
      title: "Rövid leírás (HU)",
      ...richText,
      description:
        "Rövid mondat a fellépőről. A kártyán szöveges leírásként jelenik meg. NEM műfaj-címke!",
    }),
    defineField({
      name: "shortDescriptionRichEn",
      title: "Rövid leírás (EN)",
      ...richText,
    }),
    defineField({
      name: "tags",
      title: "Címkék / műfajok",
      type: "array",
      of: [{ type: "reference", to: [{ type: "performerTag" }] }],
      description:
        "Egy fellépőhöz több címke is rendelhető (pl. swing, blues, vendég). Ha üres, semmilyen műfaj-badge nem jelenik meg a kártyán.",
    }),
    defineField({
      name: "members",
      title: "Zenekari tagok / Közreműködők",
      type: "array",
      description:
        "Zenekari tagok listája. Ha üres, nem jelenik meg a „Közreműködők” szekció. A tagok nem automatikusan önálló fellépőként jelennek meg.",
      of: [
        defineArrayMember({
          type: "object",
          name: "member",
          fields: [
            defineField({
              name: "nameHu",
              title: "Név (HU)",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "nameEn",
              title: "Név (EN)",
              type: "string",
            }),
            defineField({
              name: "roleHu",
              title: "Szerep (HU)",
              type: "string",
              description: "Pl. énekes, zenekarvezető, vendégművész",
            }),
            defineField({ name: "roleEn", title: "Szerep (EN)", type: "string" }),
            defineField({
              name: "instrumentHu",
              title: "Hangszer (HU)",
              type: "string",
              description: "Pl. zongora, trombita, ének",
            }),
            defineField({ name: "instrumentEn", title: "Hangszer (EN)", type: "string" }),
            defineField({
              name: "countryCode",
              title: "Országkód",
              type: "string",
              description: "Pl. H, USA, S, I. Kétbetűs országkód.",
            }),
            defineField({ name: "countryNameHu", title: "Ország neve (HU)", type: "string" }),
            defineField({ name: "countryNameEn", title: "Ország neve (EN)", type: "string" }),
            defineField({
              name: "showAsStandalonePerformer",
              title: "Megjelenik önálló fellépőként?",
              type: "boolean",
              initialValue: false,
              description:
                "Ha be van kapcsolva, ez a tag megjelenik a fellépők listáján is külön fellépőként. Alapértelmezetten kikapcsolva.",
            }),
            defineField({
              name: "order",
              title: "Sorrend",
              type: "number",
              initialValue: 0,
              description: "Kisebb szám = előrébb a listában.",
            }),
          ],
          preview: {
            select: { name: "nameHu", role: "roleHu", instrument: "instrumentHu" },
            prepare({ name, role, instrument }: { name?: string; role?: string; instrument?: string }) {
              return {
                title: name || "(névtelen)",
                subtitle: [role, instrument].filter(Boolean).join(" · "),
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "bioRichHu",
      title: "Hosszú leírás (HU)",
      ...richText,
      description:
        "A fellépő részletes leírása, a modálban jelenik meg. Támogatja: félkövér, dőlt, link, h2, h3, lista, blockquote.",
    }),
    defineField({
      name: "bioRichEn",
      title: "Hosszú leírás (EN)",
      ...richText,
    }),
    defineField({ name: "websiteUrl", type: "url" }),
    defineField({ name: "facebookUrl", type: "url" }),
    defineField({ name: "instagramUrl", type: "url" }),
    defineField({ name: "youtubeUrl", type: "url" }),
    defineField({ name: "spotifyUrl", type: "url" }),
    defineField({
      name: "order",
      type: "number",
      initialValue: 0,
      description: "Kisebb szám = előrébb a lineupban",
    }),
    defineField({
      name: "isFeatured",
      type: "boolean",
      initialValue: false,
      description: "Ha be van kapcsolva, kiemelt helyen szerepel",
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
      title: "name",
      media: "image",
    },
  },
});
