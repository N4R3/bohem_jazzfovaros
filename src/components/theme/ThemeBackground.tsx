"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/theme/ThemeContext";

/**
 * Applies Design 3 background illustrations to <body> (scroll, not fixed).
 * Home page → background_home.png (city skyline + sea)
 * All other pages → background_other.png (open sea)
 * Other themes → bg image removed.
 */
export default function ThemeBackground() {
  const { theme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    const body = document.body;
    if (theme !== "3") {
      body.style.backgroundImage = "";
      body.style.backgroundSize = "";
      body.style.backgroundPosition = "";
      body.style.backgroundAttachment = "";
      body.style.backgroundRepeat = "";
      return;
    }
    const isHome = pathname === "/" || pathname === "/en" || pathname === "/en/";
    body.style.backgroundImage = isHome
      ? "url('/images/d3/background_home.png')"
      : "url('/images/d3/background_other.png')";
    body.style.backgroundSize = "cover";
    body.style.backgroundPosition = "top center";
    body.style.backgroundAttachment = "scroll";
    body.style.backgroundRepeat = "no-repeat";
  }, [theme, pathname]);

  return null;
}
