import type { Locale, SiteContent } from "./types";
import { getBuildLocale } from "./buildLocale";
import { hu } from "@/content/hu";
import { en } from "@/content/en";

export function getLocale(): Locale {
  return getBuildLocale();
}

export function getContent(): SiteContent {
  const locale = getLocale();
  return locale === "en" ? en : hu;
}
