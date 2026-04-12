"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    /** Netlify demó: Site settings → Snippet injection → before </body>:
     * <script>window.__PEER_LOCALE_URL__='https://a-masik-nyelv-deploy.netlify.app';</script>
     * Így nem kell újra buildelni, ha csak a másik deploy URL változik. */
    __PEER_LOCALE_URL__?: string;
  }
}

interface Props {
  /** Szerver/build: getLanguageSwitchUrl() — ha nincs env, lehet jazzcapital.hu */
  fallbackHref: string;
  label: string;
  className?: string;
  style?: React.CSSProperties;
  rel?: string;
  onClick?: () => void;
}

/**
 * HU ↔ EN gomb: build időben kapott href, de böngészőben felülírható
 * `window.__PEER_LOCALE_URL__`-lel (Netlify snippet, újra deploy nélkül).
 */
export default function LocaleSwitchAnchor({ fallbackHref, label, className, style, rel, onClick }: Props) {
  const [href, setHref] = useState(fallbackHref);

  useEffect(() => {
    const peer = typeof window !== "undefined" ? window.__PEER_LOCALE_URL__?.trim() : "";
    if (peer) {
      const u = peer.replace(/\/$/, "");
      setHref(u.startsWith("http") ? u : `https://${u}`);
      return;
    }
    setHref(fallbackHref);
  }, [fallbackHref]);

  return (
    <a
      href={href}
      className={className}
      style={style}
      rel={rel}
      suppressHydrationWarning
      onClick={onClick}
    >
      {label}
    </a>
  );
}
