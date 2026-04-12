"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type ThemeId = "1" | "2" | "3";
const STORAGE_KEY = "bjf-theme";

interface ThemeContextValue {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue>({ theme: "3", setTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>("3");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
      if (saved === "1" || saved === "2" || saved === "3") setThemeState(saved);
      // no saved value → keep default "3"
    } catch {}
  }, []);

  function setTheme(t: ThemeId) {
    setThemeState(t);
    try { localStorage.setItem(STORAGE_KEY, t); } catch {}
    if (t === "1") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", t);
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
