"use client";

import { useEffect } from "react";

/**
 * When the program page is opened with a `?slot=<id>` query (a deep link coming
 * from a performer card on the lineup page), this finds the matching <details>
 * row, opens it, and scrolls it into view. Renders nothing.
 */
export default function ProgramDeepLink() {
  useEffect(() => {
    const slot = new URLSearchParams(window.location.search).get("slot");
    if (!slot) return;

    const el = document.getElementById(slot);
    if (!el) return;

    if (el instanceof HTMLDetailsElement) {
      el.open = true;
    }

    // Wait a frame so the just-opened details has its final layout/height.
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, []);

  return null;
}
