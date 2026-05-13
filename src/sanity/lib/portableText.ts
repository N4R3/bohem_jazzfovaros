import type { PortableTextBlock } from "@portabletext/react";

/**
 * Konvertálja a Portable Text (Rich Text) tartalmat sima szöveggé.
 * Hasznos inline mezőknél (pl. card.value, deadline szöveg), ahol nem
 * szabad block-szintű HTML-t (div, p) megjeleníteni, vagy ahol meta-adatként
 * használjuk a szöveget (pl. SEO description, alt text, slug).
 *
 * Megőrzi a span szövegeket, a blokkok közé szóközt tesz.
 */
export function portableTextToPlain(
  value: string | PortableTextBlock[] | null | undefined,
): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (!Array.isArray(value)) return "";
  return value
    .map((block) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const b = block as any;
      if (b?._type === "block" && Array.isArray(b.children)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return b.children.map((c: any) => (typeof c?.text === "string" ? c.text : "")).join("");
      }
      return "";
    })
    .filter(Boolean)
    .join(" ");
}

/**
 * Visszaadja, hogy az adott Rich Text tartalom üres-e (nincs szöveg).
 */
export function isPortableTextEmpty(
  value: string | PortableTextBlock[] | null | undefined,
): boolean {
  if (!value) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (!Array.isArray(value) || value.length === 0) return true;
  return portableTextToPlain(value).trim().length === 0;
}
