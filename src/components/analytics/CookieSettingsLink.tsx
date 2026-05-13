"use client";

/**
 * Egy kis kliens-side link, ami törli a `cookie_consent` választást a localStorage-ból
 * és újratölti az oldalt, így a CookieBanner ismét megjelenik.
 * A footer használja a "Süti beállítások" / "Cookie settings" felirathoz.
 */
export default function CookieSettingsLink({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    try {
      localStorage.removeItem("cookie_consent");
    } catch {
      /* noop — ha a böngésző tiltja, akkor reload-dal próbáljuk */
    }
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }

  return (
    <a href="#cookie-settings" onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
