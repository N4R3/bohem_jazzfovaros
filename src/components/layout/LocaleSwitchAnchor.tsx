"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { languageSwitchHref, languageSwitchLabel } from "@/lib/languageSwitch";

interface Props {
  className?: string;
  style?: React.CSSProperties;
  rel?: string;
  onClick?: () => void;
  "aria-label"?: string;
}

/**
 * HU ↔ EN gomb. A felirat és href a pathname-ből számolódik —
 * kliensoldali navigációnál is azonnal frissül (F5 nélkül).
 */
export default function LocaleSwitchAnchor({
  className,
  style,
  rel,
  onClick,
  "aria-label": ariaLabelProp,
}: Props) {
  const pathname = usePathname() || "/";
  const label = languageSwitchLabel(pathname);
  const href = languageSwitchHref(pathname, label);
  const ariaLabel =
    ariaLabelProp ?? (label === "EN" ? "Switch to English" : "Váltás magyarra");
  const isInternal = href.startsWith("/");

  if (isInternal) {
    return (
      <Link
        href={href}
        prefetch={false}
        className={className}
        style={style}
        onClick={onClick}
        aria-label={ariaLabel}
      >
        {label}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={className}
      style={style}
      rel={rel}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {label}
    </a>
  );
}
