import type { Locale, SiteContent } from "./types";
import { hu } from "@/content/hu";
import { en } from "@/content/en";

export function getLocale(): Locale {
  const env = process.env.NEXT_PUBLIC_LOCALE;
  if (env === "en") return "en";
  return "hu";
}

export function getContent(): SiteContent {
  const locale = getLocale();
  return locale === "en" ? en : hu;
}
