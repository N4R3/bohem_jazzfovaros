"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import Image from "next/image";

const STORAGE_KEY = "szechenyiPopupShown";
const IMAGE_SRC = "/images/43e3a57583f727d87fb1271bb22963ef.jpg";

/**
 * Főoldali Széchenyi Terv – egyszer session-enként, stabil, fix megjelenés.
 * sessionStorage: csak a kliens useEffect-ében.
 * onlyOnHomepage: ha true, csak / és /en/ útvonalon jelenik meg.
 */
type SzechenyiPopupProps = {
  enabled?: boolean;
  imageSrc?: string;
  altText?: string;
  storageKey?: string;
  onlyOnHomepage?: boolean;
};

export default function SzechenyiPopup({
  enabled = true,
  imageSrc = IMAGE_SRC,
  altText = "Széchenyi Terv támogatási információ",
  storageKey = STORAGE_KEY,
  onlyOnHomepage = true,
}: SzechenyiPopupProps) {
  const pathname = usePathname() || "";
  const isHomepage = pathname === "/" || pathname === "/en" || pathname === "/en/";
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    if (onlyOnHomepage && !isHomepage) return;
    setMounted(true);
    try {
      const alreadyShown = window.sessionStorage.getItem(storageKey);
      if (!alreadyShown) {
        setIsOpen(true);
        window.sessionStorage.setItem(storageKey, "true");
      }
    } catch {
      setIsOpen(true);
    }
  }, [enabled, storageKey, onlyOnHomepage, isHomepage]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[9998] bg-black/60"
        aria-hidden="true"
      />

      <div
        className="
          fixed z-[9999]
          right-4 bottom-4
          w-[calc(100vw-2rem)]
          max-w-[760px]
          max-h-[calc(100dvh-2rem)]
          rounded-xl
          bg-white
          shadow-2xl
          overflow-hidden
        "
        role="dialog"
        aria-modal="true"
        aria-label="Széchenyi Terv támogatási információ"
      >
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="
            absolute right-3 top-3 z-[10000]
            flex h-10 w-10 items-center justify-center
            rounded-full
            bg-black/80
            text-white
            text-2xl
            leading-none
            shadow-lg
          "
          aria-label="Popup bezárása"
        >
          ×
        </button>

        <Image
          src={imageSrc}
          alt={altText}
          width={1520}
          height={860}
          className="
            block
            h-auto
            w-full
            max-h-[calc(100dvh-2rem)]
            object-contain
          "
          priority
        />
      </div>
    </>
  , document.body);
}
