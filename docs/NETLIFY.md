# Netlify — két nyelv, egy Git repó

| Oldal | URL | Build locale |
|-------|-----|----------------|
| Magyar | [bohemjazz.netlify.app](https://bohemjazz.netlify.app) | `hu` |
| Angol | [buhemjazzen.netlify.app](https://buhemjazzen.netlify.app) | `en` |

A `netlify.toml` tartalmazza a két URL-t (`NEXT_PUBLIC_SITE_URL_*`).

## Automatikus nyelvfelismerés buildkor

A `src/lib/buildLocale.ts` a Netlify által beállított **`URL`** / **`DEPLOY_PRIME_URL`** változót összeveti a `NEXT_PUBLIC_SITE_URL_EN` / `HU` hostnevével. Ha a deploy az angol Netlify URL-en fut, **angol** statikus oldal készül (nyelvváltó: **HU** → magyar site), a magyar URL-en **magyar** (nyelvváltó: **EN**).

Így **nem kötelező** külön `NEXT_PUBLIC_LOCALE=en` az angol site-on — de beállíthatod, ha egyedi domainról deployolsz és az URL nem egyezik a táblázatban lévővel.

## Opcionális felülírás

**Site configuration → Environment variables**

- `NEXT_PUBLIC_LOCALE` = `en` vagy `hu` — ha be van állítva, felülírja az automatikát.

## Éles domainre váltáskor

Frissítsd a `netlify.toml` `[build.environment]` blokkban a két URL-t, vagy írd felül Netlify env-ben a `NEXT_PUBLIC_SITE_URL_HU` / `EN` értékeket, különben az automatikus felismerés rossz nyelvet választhat.
