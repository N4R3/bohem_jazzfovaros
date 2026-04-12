/**
 * Build-time locale: két Netlify site ugyanabból a repóból — ha nincs
 * NEXT_PUBLIC_LOCALE, a Netlify által injektált URL / DEPLOY_PRIME_URL alapján
 * döntünk (így az angol site-on nem marad véletlenül magyar build).
 */
export type BuildLocale = "hu" | "en";

function normalizeSiteUrl(raw: string): string {
  const t = raw.trim().replace(/\/$/, "");
  return t.startsWith("http") ? t : `https://${t}`;
}

/** Netlify: production vagy deploy-preview-123--subdomain.netlify.app */
function deployHostMatchesSite(deployUrl: string, siteUrl: string): boolean {
  if (!deployUrl || !siteUrl) return false;
  try {
    const dHost = new URL(deployUrl.trim()).hostname;
    const siteHost = new URL(normalizeSiteUrl(siteUrl)).hostname;
    return dHost === siteHost || dHost.endsWith(siteHost);
  } catch {
    return false;
  }
}

export function getBuildLocale(): BuildLocale {
  const explicit = process.env.NEXT_PUBLIC_LOCALE?.trim();
  if (explicit === "en") return "en";
  if (explicit === "hu") return "hu";

  const deployUrl = (process.env.URL || process.env.DEPLOY_PRIME_URL || "").trim();
  const enSite = process.env.NEXT_PUBLIC_SITE_URL_EN?.trim() || "";
  const huSite = process.env.NEXT_PUBLIC_SITE_URL_HU?.trim() || "";

  // Először EN (ha mindkét env be van állítva, és valamiért mindkettő illeszkedne)
  if (deployUrl && enSite && deployHostMatchesSite(deployUrl, enSite)) {
    return "en";
  }
  if (deployUrl && huSite && deployHostMatchesSite(deployUrl, huSite)) {
    return "hu";
  }

  return "hu";
}
