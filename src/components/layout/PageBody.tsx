import Link from "next/link";
import RichText from "../common/RichText";
import type { PortableTextBlock } from "@portabletext/react";

/**
 * PageBody — egyszerű, dizájn-illesztett szövegblokk a Sanity-ből szerkeszthető
 * `pageBody` mezőhöz. Támogatja mind sima szöveget, mind Rich Text (Portable Text) formátumot.
 *
 * Használat (fix oldalakon, a Hero alatt és a kártyás tartalom FÖLÖTT):
 *   const page = await getPageContentBySlug("tabor", locale);
 *   {page.body && <PageBody text={page.body} />}
 */
export default function PageBody({
  text,
  variant = "card",
}: {
  text: string | PortableTextBlock[] | null | undefined;
  /** "card": cream háttér + árnyék (alapértelmezett), "plain": csak szöveg */
  variant?: "card" | "plain";
}) {
  if (!text) return null;

  const wrapperClass =
    variant === "card"
      ? "mx-auto mb-10 max-w-4xl rounded-2xl px-6 py-7 shadow-xl sm:px-9 sm:py-9"
      : "mx-auto mb-10 max-w-4xl";
  const wrapperStyle =
    variant === "card"
      ? { background: "var(--color-cream-50)", color: "var(--color-teal-900)" }
      : { color: "var(--color-teal-900)" };

  // If text is Portable Text array, use RichText component
  if (Array.isArray(text)) {
    return (
      <section className={wrapperClass} style={wrapperStyle}>
        <RichText value={text} />
      </section>
    );
  }

  // Otherwise treat as plain string (legacy behavior)
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) return null;

  return (
    <section className={wrapperClass} style={wrapperStyle}>
      {paragraphs.map((para, i) => (
        <p
          key={i}
          className="whitespace-pre-line text-base leading-relaxed sm:text-lg"
          style={{ marginTop: i === 0 ? 0 : "1em" }}
        >
          {linkify(para)}
        </p>
      ))}
    </section>
  );
}

/* Egyszerű URL-felismerés és kattinthatóvá alakítás. */
const URL_REGEX = /(https?:\/\/[^\s)]+)/g;
function linkify(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  URL_REGEX.lastIndex = 0;
  while ((m = URL_REGEX.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const url = m[1];
    out.push(
      <Link
        key={`${m.index}-${url}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold underline decoration-2 underline-offset-2"
        style={{ color: "var(--color-accent-600)" }}
      >
        {url}
      </Link>,
    );
    last = m.index + url.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
