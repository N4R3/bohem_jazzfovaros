import { defineArrayMember } from "sanity";
import type { PortableTextBlock } from "@portabletext/react";

/**
 * Reusable Portable Text schema for rich text content
 * Supports safe, brand-compatible formatting without HTML source editor or free color picker
 */
export const richText = {
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H1", value: "h1" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "H4", value: "h4" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Underline", value: "underline" },
          { title: "Strike", value: "strike-through" },
          { title: "Code", value: "code" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              {
                name: "href",
                type: "url",
                title: "URL",
                validation: (rule) => rule.required(),
              },
            ],
          },
          {
            name: "fontSize",
            type: "object",
            title: "Font Size",
            fields: [
              {
                name: "size",
                type: "string",
                title: "Size",
                options: {
                  list: [
                    { title: "Small", value: "small" },
                    { title: "Medium", value: "medium" },
                    { title: "Large", value: "large" },
                    { title: "XL", value: "xl" },
                  ],
                },
                initialValue: "medium",
              },
            ],
          },
          {
            name: "fontFamily",
            type: "object",
            title: "Font Family",
            fields: [
              {
                name: "family",
                type: "string",
                title: "Family",
                options: {
                  list: [
                    { title: "Sans Serif", value: "sans" },
                    { title: "Serif", value: "serif" },
                    { title: "Monospace", value: "mono" },
                  ],
                },
                initialValue: "sans",
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: "object",
      name: "callout",
      title: "Callout",
      fields: [
        {
          name: "calloutType",
          type: "string",
          title: "Callout Type",
          options: {
            list: [
              { title: "Info", value: "info" },
              { title: "Important", value: "important" },
              { title: "Price", value: "price" },
            ],
          },
          initialValue: "info",
          validation: (rule) => rule.required(),
        },
        {
          name: "content",
          type: "array",
          of: [
            {
              type: "block",
              styles: [{ title: "Normal", value: "normal" }],
              marks: {
                decorators: [
                  { title: "Strong", value: "strong" },
                  { title: "Emphasis", value: "em" },
                ],
                annotations: [
                  {
                    name: "link",
                    type: "object",
                    title: "Link",
                    fields: [
                      {
                        name: "href",
                        type: "url",
                        title: "URL",
                        validation: (rule) => rule.required(),
                      },
                    ],
                  },
                ],
              },
            },
          ],
          title: "Content",
          validation: (rule) => rule.required(),
        },
      ],
      preview: {
        select: {
          calloutType: "calloutType",
          content: "content",
        },
        prepare({ calloutType, content }) {
          const title = calloutType.charAt(0).toUpperCase() + calloutType.slice(1);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const previewText = content
            ? content.map((block: PortableTextBlock) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const text = block.children?.map((child: any) => child.text || "").join("") || "";
              return text;
            }).join(" ")
            : "";
          return {
            title: `${title} Callout`,
            subtitle: previewText.slice(0, 60),
          };
        },
      },
    }),
  ],
};
