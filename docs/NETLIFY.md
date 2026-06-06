# Netlify — két nyelv, egy Git repó

## Jelenlegi (staging) állapot

| Oldal | URL | Build locale |
|-------|-----|----------------|
| Magyar | [bohemjazz.netlify.app](https://bohemjazz.netlify.app) | `hu` |
| Angol | _(még nem létezik külön site)_ | `en` (tervezett) |

Jelenleg **egy Netlify site** fut (`bohemjazz.netlify.app`, HU build). A nyelvváltó ideiglenesen visszamutat erre a site-ra; helyi devben `same-origin /en` path-t használ (a middleware kezeli az átirányítást).

## Nyelvfelismerés buildkor

A `netlify.toml` beállítja `NEXT_PUBLIC_LOCALE=hu`-t explicit módon — a `buildLocale.ts` URL-detekciója így nem szükséges a staging-en. A jövőbeli EN Netlify site-on a Netlify dashboardban kell `NEXT_PUBLIC_LOCALE=en`-t beállítani (felülírja a toml értékét).

## Opcionális felülírás

**Site configuration → Environment variables**

- `NEXT_PUBLIC_LOCALE` = `en` — az EN site-on kötelező beállítani go-live előtt
- `NEXT_PUBLIC_SITE_URL_HU` = `https://<hu-production-domain>` — go-live-kor mindkét site-on
- `NEXT_PUBLIC_SITE_URL_EN` = `https://<en-production-domain>` — go-live-kor mindkét site-on

## Go-live teendők

1. EN Netlify site létrehozása ugyanabból a repóból
2. EN site dashboardon: `NEXT_PUBLIC_LOCALE=en`, `NEXT_PUBLIC_SITE_URL_HU=<hu-domain>`, `NEXT_PUBLIC_SITE_URL_EN=<en-domain>`
3. HU site dashboardon: `NEXT_PUBLIC_LOCALE=hu` (vagy hagyja a toml értékét), `NEXT_PUBLIC_SITE_URL_HU=<hu-domain>`, `NEXT_PUBLIC_SITE_URL_EN=<en-domain>`
4. Mindkét site-on custom domain beállítása Netlify-ban

A dashboardon beállított értékek felülírják a `netlify.toml` értékeit.
