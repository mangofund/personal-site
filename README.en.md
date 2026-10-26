[中文](./README.md) · [English](./README.en.md)

# Pro's MangoFund

Personal site at [promangofund.com](https://promangofund.com) (Chinese title: PRO的茶里芒果). Chinese lives at the site root. English lives at [`/en/`](https://promangofund.com/en/). Content is Markdown, built into a static site with VitePress.

Repository: <https://github.com/mangofund/personal-site>

## Stack

- [VitePress](https://vitepress.dev/) 1.6 (`vitepress` `^1.6.4` in `package.json`)
- Theme, nav, and sidebars: `docs/.vitepress/` (entry `theme/index.ts`, styles `theme/custom.css`)
- Two VitePress locales: default `root` (Chinese) and `en` (`/en/`)
- Node: `.github/workflows/deploy.yml` uses 20, `.github/workflows/validate-site-build.yml` uses 22. Use 20 or 22 locally. The repo has no `engines` field

## Local

```bash
npm ci
npm run docs:dev
```

`docs:dev` runs `scripts/patch-vitepress-locale.mjs` (VitePress treats the English home page as the wrong locale unless patched) and `scripts/pack-skills.mjs` (skill ZIPs), then `vitepress dev docs`.

## Build and preview

To match the production hostname:

```bash
SITE_URL=https://promangofund.com npm run docs:build
npm run docs:preview
```

`npm run docs:build` runs, in order:

1. `scripts/patch-vitepress-locale.mjs`
2. `scripts/pack-skills.mjs`
3. `scripts/gen-seo.mjs` — sitemap, robots, feed, llms.txt, `_headers`, `articles.json`, and the generated blocks on the home page, archive, and section indexes
4. `vitepress build docs`
5. `scripts/fix-logo-alt.mjs` — alt text on the nav logo
6. `scripts/fix-img-dims.mjs` — width / height on local images
7. `scripts/check-seo.mjs` — checks `docs/.vitepress/dist` and fails the build on errors

Output is `docs/.vitepress/dist`. `docs:preview` is `vitepress preview docs` (port 4173 by default). Restart the preview after a rebuild, or new hashed assets 404.

Without `SITE_URL`, the canonical host defaults to `https://mangofund.github.io` (`docs/.vitepress/config.ts`, `scripts/gen-seo.mjs`). Set `SITE_URL=https://promangofund.com` when you want a production-like build. Production `base` is `/`. Do not set `BASE_PATH` for that build.

These blocks are rewritten by the build. Do not edit them by hand:

- `LATEST-START` … `LATEST-END` in `docs/index.md`
- `ARCHIVE-START` … `ARCHIVE-END` in `docs/archive.md`
- `*-FEED` blocks in `docs/ai/index.md`, `docs/thinking/index.md`, and `docs/investment/index.md`

`scripts/content-dates.json` and `docs/public/articles.json` change with git timestamp formatting. If you did not mean to change content, restore them before committing:

```bash
git checkout -- scripts/content-dates.json docs/public/articles.json
```

## Content layout

Everything published is under `docs/`. An English page belongs at the same relative path under `docs/en/`. hreflang is emitted only when both files exist. English pages are left out of the Chinese RSS feed, the home-page Latest block, the archive, and `articles.json`.

| Path | What it is |
|---|---|
| `docs/index.md` | Chinese home |
| `docs/en/index.md` | English home |
| `docs/ai/` | AI. Subdirectories: `trends`, `agents`, `coding`, `workflows`, `products`, `thinking`. The section index filters by subdirectory; labels are `AI_TABS` in `scripts/gen-seo.mjs` |
| `docs/investment/` | Investing |
| `docs/thinking/` | Thinking |
| `docs/skills/` | Skill pages. Entries live in `docs/.vitepress/theme/homeSkills.ts`. Sources live in `docs/public/skills/sources/` and are zipped at build time |
| `docs/projects/` | Projects |
| `docs/about/` | About |
| `docs/archive.md` | Archive |
| `docs/friends.md`, `subscribe.md`, `guestbook.md`, `sponsor.md`, `privacy.md`, `utm.md` | Friends, subscribe, guestbook, sponsor, privacy, UTM link builder |

`docs/public/skills/**/*.md` is in `srcExclude` and is not turned into a site page. Put images in `docs/public/images/`. Keep each file under 200KB and no wider than 1600px.

`docs/en/` currently has the home page, some AI and investing posts, skills, projects, about, and the friends page. There is no English thinking section yet.

## Add an article

1. Add a Markdown file in the matching directory, for example `docs/ai/coding/my-post.md`. For an English version, add `docs/en/ai/coding/my-post.md`.
2. Frontmatter needs `title`, `description`, `date`, and `category`. Common category values are `AI`, `投资`, and `思考`. Optional: `image` (cover and share image), `tags`, `updated`. `draft: true` or `noindex: true` keeps the page out of the sitemap and the section lists.
3. To show it in a sidebar, edit `sidebar` in `docs/.vitepress/config.ts` (English: `locales.en.themeConfig.sidebar`). Section lists are generated from frontmatter by `gen-seo.mjs`. Do not edit the `*-FEED` blocks.
4. Build once and check the list, the sitemap, and the SEO check.

## Deploy

Production is **Cloudflare Pages**, not GitHub Pages.

There is no Wrangler config in the repo. The Pages project is connected in the Cloudflare dashboard. What is in the repo: `functions/` (Pages Functions), `docs/public/_redirects`, the generated `_headers`, and the hosts allowed by `scripts/check-seo.mjs` (`promangofund.com`, `mangofund.github.io`, `mangofund.pages.dev`).

- Primary host: <https://promangofund.com>
- <https://mangofund.pages.dev> stays up. No 301 between them (`docs/public/_redirects`)
- A push to `main` is built and published by Pages. Branch previews: `https://<branch-name-with-slashes-replaced-by-dashes>.mangofund.pages.dev`
- Production `base` is `/`. Pages clones shallow; `gen-seo.mjs` tries to deepen git history and otherwise falls back to frontmatter and `scripts/content-dates.json` for lastmod
- `functions/api/hit.ts`, `stats.ts`, and `skill-rank.ts` run only on Pages. Without a KV binding the stats endpoints return quietly and pages still render

### GitHub Pages mirror

`.github/workflows/deploy.yml` also builds on push to `main` (and on `workflow_dispatch`) and publishes with `actions/deploy-pages` to **this repo's** GitHub Pages. That build sets:

- `BASE_PATH` = `/${repository name}/`. This repo is `personal-site`, so `/personal-site/`
- `CANONICAL_URL` = `https://promangofund.com` (mirror pages canonicalize back to production)
- `SITE_URL` = `https://tsla2000.github.io`

That `SITE_URL` does not match the current owner `mangofund`, and it is not the `https://mangofund.github.io` host allowed in `check-seo.mjs`. Production does not use it. The old README note — change `BASE_PATH` to `/` after attaching a custom domain — is stale. The custom domain is already on Cloudflare, and that build's `base` is already `/`.

### Workflows that do not run on every push

| File | What it does |
|---|---|
| `.github/workflows/validate-site-build.yml` | On pull requests to `main`, and on pushes to `main`: Node 22, `npm ci`, `npm run docs:build` |
| `.github/workflows/deploy-cos.yml` | Tencent COS mirror. Automatic runs stopped on 2026-10-06. `workflow_dispatch` only |
| `.github/workflows/publish-mp.yml` | Sends one Markdown file to the WeChat official account as a draft or a publish. Manual |

## Scripts

| Script | Role |
|---|---|
| `scripts/patch-vitepress-locale.mjs` | Patch VitePress so the English home page uses the `en` locale |
| `scripts/pack-skills.mjs` | Zip `docs/public/skills/sources/` and write the package manifest |
| `scripts/gen-seo.mjs` | SEO files, plus the home / archive / section lists |
| `scripts/fix-logo-alt.mjs` | Logo alt text after the VitePress build |
| `scripts/fix-img-dims.mjs` | Image dimensions after the VitePress build |
| `scripts/check-seo.mjs` | Post-build gate |
| `scripts/sync-cos.py` | COS sync, manual workflow only |
| `scripts/mp-publish.py` | WeChat publish, manual workflow only |

Analytics and skill-event definitions are in [ANALYTICS_SETUP.md](./ANALYTICS_SETUP.md).

## Links

- Site: <https://promangofund.com>
- English: <https://promangofund.com/en/>
- RSS: <https://promangofund.com/feed.xml>
- Pages hostname: <https://mangofund.pages.dev>
