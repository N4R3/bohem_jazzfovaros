import { PortableText, PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/react";

interface RichTextProps {
  value: PortableTextBlock[];
  className?: string;
}

/**
 * RichText component for rendering Portable Text content
 * Supports: normal paragraph, h2, h3, bold, italic, link, bullet list, numbered list, blockquote
 * Links are safely rendered with target="_blank" and rel="noopener noreferrer" for external links
 */
export default function RichText({ value, className = "" }: RichTextProps) {
  if (!value || !Array.isArray(value) || value.length === 0) {
    return null;
  }

  const components: PortableTextComponents = {
    block: {
      normal: ({ children }) => (
        <p className="mb-4 leading-7">{children}</p>
      ),
      h1: ({ children }) => (
        <h1 className="mb-4 mt-8 text-3xl font-black tracking-tight">{children}</h1>
      ),
      h2: ({ children }) => (
        <h2 className="mb-4 mt-8 text-2xl font-bold tracking-tight">{children}</h2>
      ),
      h3: ({ children }) => (
        <h3 className="mb-4 mt-6 text-xl font-semibold tracking-tight">{children}</h3>
      ),
      h4: ({ children }) => (
        <h4 className="mb-4 mt-6 text-lg font-semibold tracking-tight">{children}</h4>
      ),
      blockquote: ({ children }) => (
        <blockquote className="mb-6 border-l-4 border-[var(--color-teal-500)] pl-4 italic text-[var(--color-teal-900)]/80">
          {children}
        </blockquote>
      ),
    },
    marks: {
      strong: ({ children }) => (
        <strong className="font-semibold">{children}</strong>
      ),
      em: ({ children }) => (
        <em className="italic">{children}</em>
      ),
      underline: ({ children }) => (
        <u className="underline">{children}</u>
      ),
      strikeThrough: ({ children }) => (
        <s className="line-through">{children}</s>
      ),
      code: ({ children }) => (
        <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-gray-800">
          {children}
        </code>
      ),
      link: ({ value, children }) => {
        const isExternal = value?.href?.startsWith("http");
        return (
          <a
            href={value?.href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="text-[var(--color-accent-600)] font-semibold underline underline-offset-2 hover:text-[var(--color-accent-700)] transition-colors"
          >
            {children}
          </a>
        );
      },
      fontSize: ({ value, children }) => {
        const sizeStyles: Record<string, string> = {
          small: "text-xs",
          medium: "text-sm",
          large: "text-lg",
          xl: "text-xl",
        };
        const style = sizeStyles[value.size] || sizeStyles.medium;
        return <span className={style}>{children}</span>;
      },
      fontFamily: ({ value, children }) => {
        const familyStyles: Record<string, string> = {
          sans: "font-sans",
          serif: "font-serif",
          mono: "font-mono",
        };
        const style = familyStyles[value.family] || familyStyles.sans;
        return <span className={style}>{children}</span>;
      },
    },
    list: {
      bullet: ({ children }) => (
        <ul className="mb-4 ml-6 list-disc space-y-2">{children}</ul>
      ),
      number: ({ children }) => (
        <ol className="mb-4 ml-6 list-decimal space-y-2">{children}</ol>
      ),
    },
    listItem: ({ children }) => (
      <li className="leading-7">{children}</li>
    ),
    types: {
      callout: ({ value }) => {
        const calloutStyles: Record<string, string> = {
          info: "bg-blue-50 border-blue-200 text-blue-900",
          important: "bg-amber-50 border-amber-200 text-amber-900",
          price: "bg-green-50 border-green-200 text-green-900",
        };
        const style = calloutStyles[value.calloutType] || calloutStyles.info;

        return (
          <div className={`mb-4 rounded-lg border p-4 ${style}`}>
            <PortableText value={value.content} components={components} />
          </div>
        );
      },
    },
  };

  return (
    <div className={`prose prose-teal max-w-none ${className}`}>
      <PortableText value={value} components={components} />
    </div>
  );
}
