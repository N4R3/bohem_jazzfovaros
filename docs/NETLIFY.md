# Netlify — két nyelv, egy Git repó

| Oldal | URL | Build locale |
|-------|-----|----------------|
| Magyar | [bohemjazz.netlify.app](https://bohemjazz.netlify.app) | `hu` (alapértelmezés a kódban) |
| Angol | [buhemjazzen.netlify.app](https://buhemjazzen.netlify.app) | **`en` kötelező** |

A `netlify.toml` már tartalmazza a két canonical / nyelvváltó URL-t (`NEXT_PUBLIC_SITE_URL_*`).

## Angol site (buhemjazzen)

**Site configuration → Environment variables → Add variable**

- `NEXT_PUBLIC_LOCALE` = `en`

Enélkül a build magyar tartalmat fog készíteni.

## Magyar site (bohemjazz)

- `NEXT_PUBLIC_LOCALE` = `hu` — opcionális (a kód alapból `hu`).
- Újra deploy mindkét site-on a `netlify.toml` változás után.

## Éles domainre váltáskor

Frissítsd a `netlify.toml` `[build.environment]` blokkban a két URL-t, vagy írd felül Netlify env-ben a `NEXT_PUBLIC_SITE_URL_HU` / `EN` értékeket.
