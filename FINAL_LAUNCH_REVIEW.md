# FINAL LAUNCH REVIEW — Jazzfőváros / Bohem Jazz

**Reviewer:** Independent launch audit + final verification pass  
**Date:** 2026-06-23  
**Scope of evidence:** `git` HEAD `d57a88b` and follow-up doc/build verification commit, middleware, locale/seo helpers, netlify.toml, env examples, sitemap/robots, launch docs.  
**Hosting model confirmed:** Netlify + GitHub + Sanity. No Mediacenter migration for the new site. Year-archive subdomains stay on old hosting.

> **Authoritative launch docs (use these for DNS/go-live):**  
> [`PRODUCTION_LAUNCH_CHECKLIST.md`](PRODUCTION_LAUNCH_CHECKLIST.md) · [`FINAL_PRELAUNCH_GLM_AUDIT.md`](FINAL_PRELAUNCH_GLM_AUDIT.md)

---

## 1. Executive verdict

### READY

The application code, redirect logic, locale model, SEO and secret hygiene are sound. **No launch blockers remain.** Build evidence is recorded below (Section 8). Stale references in older audit/plan docs are marked historical (Section 3).

The site can go live as soon as the manual Netlify/DNS steps (Section 4) are executed.

---

## 2. Blockers

**None.**

Each strict-check item passed:

- **localhost / staging do NOT redirect to production.** `isStagingOrLocalHost()` forces same-origin `/en` path-prefix mode. `/en` on localhost/staging is **rewritten**, not redirected away.
- **Year-archive subdomains cannot be wildcard-captured.** `isYearArchiveHost()` bypasses locale middleware. No wildcard redirects in `netlify.toml`.
- **jazzcapital.hu is documented honestly.** External DNS 301/308 → `https://jazzfovaros.hu/en/` is primary. App middleware redirect is **defensive only** — fires only if the request reaches the Netlify app. `jazzcapital.hu` is **not** a Netlify custom domain.

---

## 3. Minor issues — CLOSED (2026-06-23)

| # | Issue | Status |
|---|-------|--------|
| 1 | Build & QA evidence missing | **CLOSED** — see Section 8 |
| 2 | Stale docs (`buhemjazzen`, `__PEER_LOCALE_URL__`, jazzcapital as Netlify domain) | **CLOSED** — historical banners added to older audit/plan docs; launch checklist updated |
| 3 | `www.jazzfovaros.hu` ambiguous | **Manual at go-live** — recommend `www` → apex 301 in Netlify |
| 4 | `jazzcapital.hu` redirect untestable pre-DNS | **Expected** — verify post-switch (checklist §8) |

**Historical docs** (do not use for DNS): `JAZZ_SITE_DEVELOPMENT_PLAN.md`, `JAZZ_SITE_FINAL_AUDIT.md`, `JAZZ_SITE_FINAL_REAUDIT_AFTER_FIXES.md` — contain outdated two-domain / `buhemjazzen` references in body/changelog; superseded by `PRODUCTION_LAUNCH_CHECKLIST.md`.

---

## 4. Domain tasks still manual (Zalán / Robi / client)

1. **Netlify env vars** (production site dashboard):
   - `NEXT_PUBLIC_SITE_URL_HU = https://jazzfovaros.hu`
   - `NEXT_PUBLIC_SITE_URL_EN = https://jazzfovaros.hu` (same origin → EN at `/en/`)
   - `NEXT_PUBLIC_LOCALE = hu`
   - Sanity + optional analytics vars
2. **Connect `jazzfovaros.hu` to Netlify** — use records from Netlify custom-domain UI only.
3. **`www.jazzfovaros.hu`** — configure in Netlify (recommended: `www` → apex 301).
4. **`jazzcapital.hu` at domain provider** (NOT Netlify): external **301/308 → `https://jazzfovaros.hu/en/`**. Middleware is defensive backstop only.
5. **Do NOT touch year-archive DNS** (`2024.jazzfovaros.hu`, `2025.jazzfovaros.hu`, …).

**Final domain model:**

| URL | Role |
|-----|------|
| `jazzfovaros.hu/` | HU |
| `jazzfovaros.hu/en/` | EN |
| `bohemjazz.netlify.app` | Staging |
| `localhost:3000` | Local |
| `jazzcapital.hu` | External redirect → `jazzfovaros.hu/en/` |

Language switch (same-origin): HU → `/en/` · EN → `/`

---

## 5. Archive recommendation

Keep year subdomains on old hosting. Do not migrate or wildcard-redirect in this launch pass.

---

## 6. Final go-live checklist

See [`PRODUCTION_LAUNCH_CHECKLIST.md`](PRODUCTION_LAUNCH_CHECKLIST.md) §6–8.

---

## 7. Final risk statement

- **Highest risk:** production Netlify env vars not set → canonicals point at staging. Verify immediately after deploy.
- **jazzcapital.hu:** external 301 is the real fix; middleware only if request reaches app.
- **Rollback:** Netlify deploy rollback; DNS revert if needed; archives untouched.

---

## 8. Build verification evidence (2026-06-23)

Environment: Windows, Node 20, Next.js 15.5.18, repo `client-projects/jazz`.  
No `.next/cache` clear needed — all commands passed on first run.

| Command | Result | Summary |
|---------|--------|---------|
| `npm run lint` | **PASS** | No ESLint warnings or errors |
| `npm run build` | **PASS** | 19 static pages; homepage First Load JS **159 kB**; middleware **34.8 kB** |
| `npm run build:hu` | **PASS** | `NEXT_PUBLIC_LOCALE=hu`; 19 pages; same bundle sizes |
| `npm run build:en` | **PASS** | `NEXT_PUBLIC_LOCALE=en`; 17 pages; same bundle sizes |

---

### Verdict: **READY** — execute manual Netlify/DNS go-live steps.
