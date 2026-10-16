# ffex blog

Promotional blog for the **ffex** exchange platform solution. English-first
site (`/`) with a Chinese edition under `/zh/`. Built with
[Hugo](https://gohugo.io/) + the vendored [PaperMod](https://github.com/adityatelange/hugo-PaperMod)
theme, deployed to **GitHub Pages** by GitHub Actions on every push to
`main`.

## First publish (one-time setup)

```bash
cd ffex
git init -b main
git add .
git commit -m "ffex blog: initial site"
```

1. Create a **public** repository named `ffex` under your GitHub account or
   organization (public is required for free-plan GitHub Pages), then:
   ```bash
   git remote add origin git@github.com:deep-web3/ffex.git
   git push -u origin main
   ```
2. In the repo: **Settings → Pages → Build and deployment → Source**,
   select **GitHub Actions** before the first push. GitHub does not allow the
   default `GITHUB_TOKEN` to create a Pages site, so this one-time setting is
   required. The `deploy.yml` workflow then builds and publishes on every
   push to `main`.
3. The site URL will be `https://deep-web3.github.io/ffex/`. The workflow
   derives the correct `baseURL` automatically (this also covers a custom
   domain if you add one later).

**Before the first push, review every article against the red line** (see
"Content red line" below). Publishing is a one-way door — cached copies of
anything pushed publicly may persist even after deletion.

## Enable comments (giscus)

Comments ship wired for [giscus](https://giscus.app/) (GitHub
Discussions-based) but stay hidden until configured:

1. Repo **Settings → General → Features** → check **Discussions**.
2. Create a discussion category for comments (e.g. `Announcements`, type:
   Announcement).
3. Install the [giscus app](https://github.com/apps/giscus) on the repo.
4. Go to <https://giscus.app>, enter `deep-web3/ffex` and the category, and
   copy `data-repo-id` and `data-category-id`.
5. Fill in `hugo.toml`:
   ```toml
   comments = true
   giscusRepo = "deep-web3/ffex"
   giscusRepoId = "<repo-id>"
   giscusCategory = "Announcements"
   giscusCategoryId = "<category-id>"
   ```
6. Commit to `main` — done.

## Writing posts

- English posts: `content/en/posts/YYYY-MM-DD-slug.md` (ASCII slugs).
- Chinese posts: mirror the same file under `content/zh/posts/` with the
  same date so the editions line up.
- Front matter requires `title`, `date`, `description` (used for SEO meta
  description and listing summaries). Tags are optional.
- Local preview (needs a local Hugo binary):
  ```bash
  hugo server -D
  ```

## Content red line (read before publishing anything)

This site markets the platform by showing **capabilities and reasoning**.
It must never contain: source code, real benchmark reports or measured
peak figures, server topology/counts/IPs, internal interface names,
configuration or credentials, client information, or third-party
confidential details. Performance statements use design-target magnitudes
only. When in doubt, cut it.

## Dependency manifest (verified 2026-10-16)

All versions are pinned exactly; upgrades are deliberate edits.

| Dependency | Pinned version | Verified from | Notes |
|---|---|---|---|
| Hugo | 0.168.0 | [releases/latest](https://github.com/gohugoio/hugo/releases/latest) (2026-10-13) | CI also verifies the official SHA-256 `787f1000…17e53` before install |
| PaperMod | v8.0 (2024-11-03) | [releases/latest](https://github.com/adityatelange/hugo-PaperMod/releases/latest) | Vendored under `themes/PaperMod` (MIT license, see its LICENSE) — no submodule |
| actions/checkout | v7.0.1 | [releases](https://github.com/actions/checkout/releases/latest) | |
| actions/configure-pages | v6.0.0 | [releases](https://github.com/actions/configure-pages/releases/latest) | |
| actions/upload-pages-artifact | v5.0.0 | [releases](https://github.com/actions/upload-pages-artifact/releases/latest) | |
| actions/deploy-pages | v5.0.1 | [releases](https://github.com/actions/deploy-pages/releases/latest) | |

Upgrade procedure: check each upstream release for breaking changes, bump
the pin (for Hugo also update the checksum in `.github/workflows/deploy.yml`),
re-verify locally with `hugo --gc --minify`, push, and update this table
with the new verification date.

### Patches applied to the vendored theme

The vendored PaperMod copy carries three small compatibility patches for
Hugo 0.168 (upstream v8.0 targets older Hugo). If you ever re-vendor a
newer PaperMod release, drop these if upstream fixed them:

- `layouts/partials/templates/{opengraph,twitter_cards,schema_json}.html`
  removed the superfluous `partials/` prefix in `partial` calls (hard error
  in current Hugo).
- `layouts/partials/templates/{opengraph,twitter_cards}.html` removed the
  deprecated `site.Social` fallback branches (field no longer exists).
- `layouts/{_default/baseof.html,_default/rss.xml,partials/translation_list.html,partials/header.html}`
  renamed `.Language.LanguageDirection/LanguageName/LanguageCode` to
  `.Language.Direction/Label/Locale`.

## Layout

```
ffex/
├── .github/workflows/deploy.yml   # build + deploy on push to main
├── content/en/  content/zh/       # bilingual content (en = site root)
├── layouts/partials/              # SEO JSON-LD, favicon, giscus comments
├── static/favicon.svg
├── themes/PaperMod/               # vendored theme, exact release
└── hugo.toml                      # site config (menus, params, languages)
```
