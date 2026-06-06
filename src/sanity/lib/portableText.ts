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

/** Egy bekezdésű Portable Text blokk sima szövegből (legacy text mezőkhöz). */
export function plainTextToPortableBlocks(text: string): PortableTextBlock[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  return [
    {
      _type: "block",
      _key: "plain",
      style: "normal",
      markDefs: [],
      children: [{ _type: "span", _key: "plain-span", text: trimmed, marks: [] }],
    },
  ];
}

/**
 * Rich Text elsőbbség, majd legacy sima szöveg (egy blokkban).
 * Szerkeszthető linkekkel a CMS-ben; a régi text mezők továbbra is működnek.
 */
export function resolveLocalizedRichOrPlain(
  locale: "hu" | "en",
  richHu?: PortableTextBlock[],
  richEn?: PortableTextBlock[],
  plainHu?: string,
  plainEn?: string,
): PortableTextBlock[] | undefined {
  const rich = locale === "en" ? richEn || richHu : richHu || richEn;
  if (rich && !isPortableTextEmpty(rich)) return rich;
  const plain = (locale === "en" ? plainEn || plainHu : plainHu || plainEn)?.trim();
  if (!plain) return undefined;
  return plainTextToPortableBlocks(plain);
}
