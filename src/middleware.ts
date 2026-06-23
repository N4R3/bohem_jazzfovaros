import { NextRequest, NextResponse } from "next/server";
import { getBuildLocale } from "@/lib/buildLocale";
import { SITE_URL_HU, siteUrlForLocale } from "@/lib/seo";
import {
  isEnPathname,
  isJazzCapitalHost,
  isYearArchiveHost,
  normalizeSiteUrl,
  SITE_LOCALE_COOKIE,
  SITE_LOCALE_HEADER,
  shouldUsePathPrefixLocale,
  stripEnPathPrefix,
} from "@/lib/localeMode";

const BUILD_LOCALE = getBuildLocale();

/** Defensive redirect ha jazzcapital.hu eléri a Netlify appot (elsődleges: DNS/provider szintű 301). */
function jazzCapitalRedirectTarget(): string {
  const hu = process.env.NEXT_PUBLIC_SITE_URL_HU?.trim();
  const base = hu ? normalizeSiteUrl(hu) : normalizeSiteUrl(SITE_URL_HU);
  return `${base}/en/`;
}

function isBypassedPath(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  );
}

function setLocaleCookie(response: NextResponse, locale: "hu" | "en") {
  response.cookies.set(SITE_LOCALE_COOKIE, locale, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.nextUrl.hostname;

  if (isBypassedPath(pathname)) {
    return NextResponse.next();
  }

  /* Archív éves subdomain — ne módosítsuk (2024.jazzfovaros.hu stb. régi hostingon marad). */
  if (isYearArchiveHost(hostname)) {
    return NextResponse.next();
  }

  /* jazzcapital.hu → jazzfovaros.hu/en/ (ha egyáltalán eléri az appot). */
  if (isJazzCapitalHost(hostname)) {
    return NextResponse.redirect(jazzCapitalRedirectTarget(), 308);
  }

  if (isEnPathname(pathname)) {
    const targetPath = stripEnPathPrefix(pathname);

    if (BUILD_LOCALE === "en") {
      const nextUrl = request.nextUrl.clone();
      nextUrl.pathname = targetPath;
      return NextResponse.redirect(nextUrl, 308);
    }

    if (!shouldUsePathPrefixLocale(hostname)) {
      const enSite = siteUrlForLocale("en");
      const redirectUrl = new URL(targetPath, enSite);
      return NextResponse.redirect(redirectUrl, 308);
    }

    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = targetPath;
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(SITE_LOCALE_HEADER, "en");
    const response = NextResponse.rewrite(rewriteUrl, {
      request: { headers: requestHeaders },
    });
    setLocaleCookie(response, "en");
    return response;
  }

  if (pathname === "/tabor" || pathname === "/tabor/") {
    const nextUrl = request.nextUrl.clone();
    nextUrl.pathname = "/jazztabor";
    return NextResponse.redirect(nextUrl, 308);
  }

  if (pathname === "/oldal" || pathname === "/oldal/" || pathname.startsWith("/oldal/")) {
    const stripped = pathname.replace(/^\/oldal/, "") || "/";
    const nextUrl = request.nextUrl.clone();
    nextUrl.pathname = stripped === "" ? "/" : stripped;
    return NextResponse.redirect(nextUrl, 308);
  }

  if (shouldUsePathPrefixLocale(hostname)) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(SITE_LOCALE_HEADER, "hu");
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    setLocaleCookie(response, "hu");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\.).*)"],
};
