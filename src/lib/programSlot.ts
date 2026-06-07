/**
 * Deterministic, page-agnostic anchor id for a single program time slot.
 *
 * The program page and the lineup modal both build this id from the same
 * (date, time, stage) triple that originates from one Sanity programItem,
 * so the two-way deep links (lineup -> program slot, program -> lineup) always
 * resolve to the same anchor. Both call sites feed identical input, so the id
 * stays in sync; non-alphanumeric characters (incl. accents) collapse to "-".
 */
export function programSlotId(date?: string, time?: string, stage?: string): string {
  const raw = [date, time, stage]
    .map((part) => (part || "").trim())
    .filter(Boolean)
    .join("-");

  const normalized = raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized ? `slot-${normalized}` : "";
}
