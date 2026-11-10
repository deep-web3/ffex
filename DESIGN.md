# ffex site — design & content brief

Status: **implemented** (2026-10-21). This file is the single source of truth for
the marketing site: information architecture, block schema, visual language,
content rules and asset conventions. Update it when the structure changes.

## 1. Goal

Turn the previous Hugo + PaperMod blog into a **Web3-native buyer-facing site** for
people evaluating, buying or partnering on the ffex exchange platform.

The site must make three things obvious within one screen:

1. **What ffex is** — a complete digital-asset exchange platform implemented twice,
   in Java and in Go, on one contract-first blueprint.
2. **What it can do** — trading, custody, risk & clearing, market data, admin/H5/App
   frontends, common platform capabilities and full-link observability.
3. **How to acquire it** — source-code licensing, direct/turnkey delivery, joint
   build, custom modules, long-term support — plus real contact channels.

Audience: exchange operators, brokers, white-label buyers, fintech/Web3 teams,
infrastructure partners. They are technical, risk-aware and time-poor.

## 2. Positioning & messages

Primary line: **The exchange platform you can own.**

Supporting messages (use consistently):

| # | Message | Proof on site |
|---|---|---|
| 1 | Two production implementations, one blueprint | Java + Go sections, shared proto contracts |
| 2 | Complete business surface | Capability map: spot, derivatives, options, OTC, custody, risk, clearing, market data, admin |
| 3 | Engineering discipline | Single writer, idempotency, UNKNOWN semantics, reconciliation, audit |
| 4 | Observability as a product | Full-link trace across HTTP/WS/gRPC/Kafka/MySQL/Redis/Mongo/async |
| 5 | You own the source | Source-code delivery, no black box, extend with your team |
| 6 | Delivered with you | Direct delivery, joint build, custom modules, long-term support |

Voice: confident, specific, engineering-honest. Short sentences. No hype words like
"revolutionary", "world-class", "best-in-class". No invented numbers.

## 3. Site map & navigation

```
/                     Home (long landing, all pillars summarised)
/capabilities/        Capability map (business domains, frontends, common platform)
/stack/               Java vs Go, shared contract blueprint, deployment
/observability/       Full-link observability (traces, metrics, logs, async links)
/cooperation/         Cooperation models, deliverables, process, FAQ
/about/               Who we are / what we publish and what stays under NDA
/contact/             Contact channels + what to include in a first message
/posts/               Insights (existing 6 bilingual articles, restyled)
/404.html             Not found
```

Chinese mirror at `/zh/` with identical structure and `translationKey`s.
Nav (desktop): Capabilities · Dual stack · Observability · Cooperation · Insights.
Right side: GitHub icon, language switch, primary CTA "Talk to us" → `/contact/`.
Footer: Platform / Cooperate / Resources columns + contact + legal notes.

## 4. Page composition

Home blocks (in order):
`hero(home, console, chips)` → `marquee` → `capwall(12 live scenes, filters)` →
`showcase(stage)` → `stack(band)` → `trace(summary)` → `common` → `principles` →
`models(condensed)` → `process` → `insights` → `cta`.

Capabilities: `hero(compact, orbit)` → `bento(business domains)` →
`bento(frontends & interfaces, variant surfaces)` → `common` → `principles` →
`trace(summary)` → `cta`.

Stack: `hero(compact, stack)` → `stack` → `bento(architecture building blocks)` →
`principles` → `cta`.

Observability: `hero(compact, trace)` → `trace(full, with video)` →
`bento(signals & operations)` → `principles` → `cta`.

Cooperation: `hero(compact, none)` → `bento(pricing factors)` → `models(full)` →
`deliverables` → `process` → `faq` → `cta(contacts)`.

About: `hero(compact, none)` → `prose` → `principles` → `cta`.

Contact: `hero(compact, none)` → `contact` → `faq(short)` → `cta(contacts)`.

## 5. Hugo block system

Every page except home/posts is `layout: "blocks"` and stores copy in YAML front
matter under `blocks:`. Home uses the same structure in `content/<lang>/_index.md`
rendered by `layouts/_default/home.html`. `layouts/_default/blocks.html` iterates the
blocks and dispatches to `layouts/partials/blocks/<type>.html`.

### Page front matter

```yaml
---
title: "Capabilities"                 # nav / <title> base
description: "One platform for spot, derivatives, OTC, custody, risk, market data, frontends and full-link observability."   # meta description, 110–160 chars
translationKey: "capabilities"        # must match across en/zh
layout: "blocks"
aliases: ["/platform/"]               # only where old URLs must keep working
blocks: []
---
```

### Block reference

Common fields: `type` (required), `kicker`, `title`, `lede`, `note`, `id`.
Titles/ledes may contain inline HTML limited to `<em>` and `<br>`; `<em>` is styled as
a gradient highlight. Use YAML double quotes and escape inner double quotes.

**hero**
```yaml
- type: hero
  variant: home            # home | compact
  kicker: "DUAL-STACK EXCHANGE ENGINE · JAVA × GO"
  title: "The exchange platform<br>you can <em>own</em>."
  lede: "Two production implementations, one contract-first blueprint. …"
  media: console           # console | orbit | trace | stack | none
  actions:
    - { label: "Explore capabilities", href: "capabilities/", style: "primary" }
    - { label: "Get source & terms", href: "cooperation/", style: "ghost" }
  chips:                   # home only; capability pills, never counts
    - { label: "Spot · Perpetuals · Options", tone: "cyan" }
    - { label: "Java + Go, one blueprint", tone: "violet" }
    - { label: "Source licence available", tone: "lime" }
    - { label: "Full-link trace built in" }
  footnote: "Interface shown is an illustrative demo. No live market data."
```

`chips` replaces the old `stats` list: the public site must not present service
counts (`02 stacks`, `01 contract source`, …). `stats` remains in the partial as a
legacy fallback but must not be used again.

**marquee** — `items: ["SPOT", "PERPETUALS", …]` (10–16 short labels, no punctuation).

**bento** — `variant`: `cards` (default) | `compact` | `surfaces`; `items` fields:
`tag`, `title`, `desc`, `icon` (see icon list), `accent` (`violet|cyan|amber|lime|rose`),
`span` (`normal|wide`), `href`, `linkLabel`.
`surfaces` items may add `points: []` and render as product surfaces with device art.

**capwall** — live capability wall; the visual centrepiece of the home page.
Each card runs a procedural canvas scene, so the block is a **live** capability
map rather than a static bento.

```yaml
- type: capwall
  kicker: "CAPABILITY MAP"
  title: "Every market, every desk, <em>one system</em>."
  lede: "Not a feature list. … each one running here as a live scene."
  filterLabel: "Filter capability domains"      # aria-label for the button group
  hint: "Live synthetic scenes · illustrative, not live data"
  filters:
    - { id: "all", label: "All systems" }
    - { id: "trading", label: "Trading" }
  items:
    - group: trading          # all | trading | platform | operations
      scene: spot             # see scene list below
      tag: "SPOT"
      title: "Spot market core"
      desc: "Order lifecycle, price-time priority matching and settlement …"
      state: "ONLINE"         # optional, defaults to ONLINE
      href: "capabilities/"
      linkLabel: "Spot domain"
```

Scenes rendered by `assets/js/cap-viz.js`: `match`, `custody`, `risk`, `clearing`,
`marketdata`, `api`, `admin`, `notify`, `spot`, `perp`, `options`, `otc`. The script
reads the CSS custom properties, caps DPR at 2, pauses off-screen canvases via
`IntersectionObserver`, and draws a single static frame under
`prefers-reduced-motion`. Filter buttons are wired through `[data-cap-filter]`;
cards carry `data-cap-group` and are hidden by the filter. The budget is 12 cards
(3 columns × 4 rows at desktop, 2 columns at 1100, 1 column at 680).

**showcase** — guided demo stage (rail of previews + one large player).
`railLabel`: heading above the rail (no counts, e.g. "Guided previews").
`hint`: small mono line under the rail. `items`: `id`, `tag`, `tab` (rail title),
`title`, `desc`, `video` (`demo/<name>.webm`), `mp4` (`demo/<name>.mp4`),
`poster` (`demo/<name>.jpg`), `bullets: []`, `chip` (bottom-left overlay label),
`chrome` (window chrome label, e.g. "ffex · trading terminal").
Common `note`: "Illustrative interfaces, generated demo data. Not live market data."

The rail buttons keep the `main.js` contract: `[data-showcase-tab]` /
`[data-showcase-panel]`, `role="tab"`, `aria-selected`, roving `tabindex`, and the
`data-video-toggle` button inside every `.demo__frame`.
**stack** — dual Java/Go section.
`band`: `{ left: { title, meta }, core: { title, meta }, right: { title, meta } }` —
optional converging diagram (`Java ⟷ One contract source ⟷ Go`) above the cards.
`items`: `name`, `tag`, `badge`, `desc`, `bullets: []`, `accent`.
`shared`: `{ title, desc, points: [ … ] }`.
`matrix`: `{ columns: ["", "Java", "Go"], rows: [{ label, values: [ … ] }] }`.
`cta`: `{ label, href, linkLabel }`.

**trace** — observability section.
`media`: `{ video, mp4, poster }` (optional on home summary).
`coverage`: `[{ name, desc, icon }]` (6–12 items).
`principles`: `[{ title, desc }]` (3–5 items).
`link`: `{ label, href }`.

**common** — common platform capabilities. `items`: `tag`, `title`, `desc`, `icon`,
`bullets: []`, `href`, `linkLabel`.

**principles** — engineering discipline rows. `items`: `index` (e.g. "01"), `title`,
`desc`. Max 6.

**models** — cooperation models. `items`: `id`, `badge`, `name`, `subtitle`, `desc`,
`deliverables: []`, `fit`, `accent`, `featured` (bool), `cta: { label, href }`.

**deliverables** — `groups: [{ title, items: [] }]` (3–4 groups).

**process** — `steps: [{ title, desc, meta }]` (4–6 steps).

**faq** — `items: [{ q, a }]` (a may contain inline HTML; no markdown).

**insights** — `limit: 3` (pull latest posts automatically).

**cta** — `actions: []` (same shape as hero), `contacts: [{ label, value, href, icon }]`,
`note`. Contacts must be Telegram `@bitdevops` → `https://t.me/bitdevops` and email
`horizonvideo@gmail.com` → `mailto:horizonvideo@gmail.com`.

**contact** — `channels: []` (same shape as `contacts`), `checklist: []` (what to include
in a first message), `note`.

**prose** — renders the page's markdown body inside styled article layout.

Icon names supported by `layouts/partials/icon.html`:
`bolt, shield, chart, wallet, scale, pulse, bell, server, layers, cpu, globe, lock,
blocks, database, activity, gauge, network, sparkles, code, check, telegram, mail,
github, arrow, play, pause, menu, close`.

### Demo asset naming (owned by demo-lab)

```
static/demo/terminal.{webm,mp4,jpg}
static/demo/matching.{webm,mp4,jpg}
static/demo/trace.{webm,mp4,jpg}
static/demo/admin.{webm,mp4,jpg}
static/demo/notify.{webm,mp4,jpg}
static/og/ffex-og-en.png        1200×630
static/og/ffex-og-zh.png        1200×630
```

## 6. Visual language

Web3-native, dark-first, premium infrastructure aesthetic. Not a generic SaaS page.

- Background `#05060c` with layered aurora radial gradients, 1px grid (masked),
  fine noise, one slow light beam and a faint orbit ring; panels are glass
  (`rgba(11,15,26,.72)` + 1px hairline + inner highlight).
- Accents: violet `#8168ff`, cyan `#2ff0c8`, lime `#d2ff62`, amber `#ffb45c`,
  rose `#ff6f91`. Brand gradient: violet → cyan → lime (used for highlight words,
  marks, 1px borders, small glows; never as large flat fills). The v2 layer
  (`assets/css/v2.css`, loaded after `pages.css`) carries these overrides.
- Type: **Space Grotesk** (display, tight tracking, 300–700), **Inter** (body),
  **JetBrains Mono** (labels, data, numerals; uppercase letterspaced 0.14em).
  Self-hosted woff2 in `static/fonts/`; CJK falls back to system (`PingFang SC`,
  `Noto Sans SC`, `Microsoft YaHei`).
- Layout: container 1240px, section rhythm 96–140px, asymmetric two-column heroes,
  bento grids, numbered sections ("01 / CAPABILITY MAP" style eyebrows).
- Signature elements: a hero console with a thin elliptical halo ring, a
  ticker-style marquee, the `capwall` live-scene cards (corner brackets + scanline),
  the showcase stage (window chrome, rail with progress bar), and the `stack-band`
  converged-source diagram.
- Cards: 20–28px radius, hairline border, gradient glow on hover, no heavy shadows.
- Buttons: pill primary = brand gradient text-on-dark or light fill; ghost = hairline.
- Motion: scroll reveal (opacity + 18px rise), marquee, tab transitions, video loops,
  animated SVGs (dash flow, node pulses), hero live canvas. All motion disabled under
  `prefers-reduced-motion: reduce`. No animation may block reading.
- Every demo surface must be visibly labelled as illustrative.

## 7. Content rules (hard)

This site is public and permanent. Never include:

1. Source code, internal interface/RPC names, schema or config dumps.
2. Real benchmark figures, measured throughput, capacity or latency claims. Design
   intent only ("built for", "designed to") and no numbers that look measured.
3. Server topology, host counts, IPs, internal hostnames, credentials, topic names.
4. Client names, logos, testimonials or case studies (we have none to publish).
5. Regulatory claims — operating an exchange requires the operator's own licences;
   say so in the footer note instead.
6. Service counts as a selling point (`02 stacks`, `12 domains`, `five ways`).
   Describe scope in words; the numbered eyebrows are section indices, not counts.

Demo videos use generated data and generic identifiers; keep numbers plausible but
obviously demo (e.g. BTC/USDT 68,4xx; order ids `0x…`). Add a "DEMO" watermark.

Cooperation copy may state that **source code is part of delivery**; it must not
publish or link to the exchange source. Public GitHub link is only the site repo:
`https://github.com/deep-web3/ffex`.

Contact channels (use everywhere):
- Telegram: `@bitdevops` → https://t.me/bitdevops
- Email: `horizonvideo@gmail.com` → mailto:horizonvideo@gmail.com

## 8. Assets, build & verification

Hugo is pinned to **0.168.0 extended** (matches GitHub Actions). Local binary used by
the team (outside the repo): `~/Library/Caches/ffex-tools/pkg/Payload/hugo`.

```bash
cd /Users/chunyunluo/developer/java/projects/jys/ffex
HUGO=~/Library/Caches/ffex-tools/pkg/Payload/hugo
"$HUGO" --gc --minify --destination /tmp/ffex-build      # production build
"$HUGO" server --port 1314 --bind 127.0.0.1              # local preview
```

The GitHub workflow stays unchanged (build + deploy to Pages on push to `main`).
Scripts are concatenated per page: `main.js` + `hero-viz.js` → `js/site.js`; a page
whose blocks include `capwall` also appends `cap-viz.js` and switches the target to
`js/site-cap.js`, so the cached shared bundle can never be served without the scene
code. No Node runtime dependency for the site build; `demo-src/` is a dev-only tool.

## 9. File ownership (team)

| Scope | Owner |
|---|---|
| `hugo.toml`, `layouts/`, `assets/`, `i18n/`, `static/{css,js,fonts,brand,*.svg}`, `content/<lang>/_index.md`, `README.md`, `DESIGN.md`, `.gitignore` | Lead |
| `demo-src/`, `scripts/`, `static/demo/`, `static/og/` | demo-lab |
| `content/<lang>/{cooperation,about,contact}.md` | copy-conversion |
| `content/<lang>/{capabilities,stack,observability}.md`, `content/<lang>/posts/**` | copy-capability |

Never edit files outside your scope. Never run `git add/commit/push`. Never touch
`easy_exchange/` or any other project in the workspace.

## 10. Acceptance

- `hugo --gc --minify` builds with zero errors/warnings; no broken internal links.
- EN/ZH parity: every page has a translation; language switch lands on the same page.
- Responsive: 1440 / 1024 / 768 / 390 widths, no horizontal scroll, nav usable.
- Accessibility: keyboard nav, visible focus, landmark structure, video pause control,
  reduced-motion honoured, contrast AA, labelled form/links.
- Performance: fonts preloaded, images sized, videos lazy, CSS/JS fingerprinted.
- SEO: unique title/description, canonical, hreflang, OG/Twitter cards, sitemap,
  robots, JSON-LD, 404.
- No content-rule violations; demo labels visible; contact channels correct.

## 11. Implementation record (2026-10-21)

Shipped in this repository:

- Custom Hugo layouts in `layouts/` (no external theme), 17 block partials (the
  2026-11-10 v2 redesign added `capwall`), custom design system in `assets/css/`,
  motion/canvas/video behaviour in `assets/js/`.
- Bilingual EN/ZH pages: home, capabilities, dual stack, observability,
  cooperation, contact, about, insights and 404; `/platform/` → `/capabilities/`
  aliases; language switch and `hreflang` pairs on every page.
- Five 14 s demo reels (terminal, matching, trace, admin, notify) plus two
  1200×630 OG cards, with a reproducible Playwright + ffmpeg pipeline documented
  in `demo-src/README.md`. Reels are H.264 + VP9, muted, looped, lazy and
  pauseable, with in-frame `DEMO · 界面示意` watermarks.
- Verification on the final build with Hugo 0.168.0: production build passes with
  no warnings; internal link crawl 0 broken; axe (WCAG 2.1 A/AA + best practice)
  0 violations across EN/ZH pages; HTML nesting valid; no horizontal overflow at
  1440/1280/1100/768/390; reduced-motion and no-JS fallbacks checked; demo videos
  verified at 1440×900 / 30 fps / 14.00 s with a seamless loop.

### 2026-11-10 v2 redesign (Web3 buyer-facing)

Second pass, requested as a visual redesign plus a capability story:

- New `assets/css/v2.css` layer (loaded last in `head.html`) recolours the site to
  `#05060c` / `#8168ff` / `#2ff0c8` / `#d2ff62` and restyles hero, ticker, capwall,
  showcase, stack band, trace, principles, models, process, CTA and footer.
- New `capwall` block + `assets/js/cap-viz.js`: 12 procedural canvas scenes driven by
  `data-cap-scene`, with group filters, intersection-based pausing and a
  reduced-motion static frame. The home capability section is now literally moving,
  not a static bento.
- `showcase` rebuilt as an editorial stage: rail of guided previews on the left with
  an active progress bar, one large player on the right, window chrome and a
  generated-demo chip. Existing tab/video JS hooks were preserved unchanged.
- `hero` home variant switched from numeric stats to capability `chips`; every
  count-framed headline was removed ("Twelve domains" → "Every domain", "four ways to
  operate" → "every way to operate", "Five ways" → "Ways", "Price follows three
  things" → "Price follows scope, licence and support"). No service counts anywhere.
- `stack` gained the `band` diagram (Java ⟷ one contract source ⟷ Go); process steps
  lost their duplicated `STEP 01` eyebrows; models cards align their CTA rows.
- Robustness: `scripts.html` bundles `cap-viz.js` under a separate concat target so
  the content-cached `js/site.js` cannot serve a bundle without it; `main.js` and
  `cap-viz.js` sweep on scroll so fast scrolling can never leave elements hidden or
  canvases undrawn.
- Verified: production build clean; no page errors; no horizontal overflow at
  1440/1024/768/390; all 12 scenes draw; EN/ZH parity kept; demo reels unchanged.
- Post-audit fixes after the four-way QA pass (19 routes × 4 widths): `.matrix`
  scrolls sideways again on phones (v2 `overflow:hidden` was clipping the Go
  column); hero y labels no longer clip (`hero-viz.js` padRight 52); console
  floats are hidden at ≤1024 so they stop covering the order book head; the
  showcase rail fades both edges as it scrolls; reduced motion also covers the
  hero, console and orbit dots; the violet model badge clears AA (6.44:1); all
  footer targets are at least 24px tall at 390. Deliberately unchanged: demo
  autoplay, the 1440 float overlap, and the closed-FAQ "overlap" false positive.

### 2026-11-10 content refresh

This pass pre-dates the v2 redesign above; its home-page numbers (hero stats, bento
card counts) were superseded there by the hero chips and the capwall. Kept as the
record of the copy change:

The platform gained market making, institutional API access and a shared frontend
platform after the first launch; the site now reflects them without widening the
production claims:

- Capability map: 10 → 12 domains (added `MARKET MAKING`, `API PROGRAM`), all
  cards `span: normal` to tile a clean 4 × 3 grid. Options copy stays at
  specification, order and position tracking — settlement payout rules are still
  gated, so they are not claimed.
- New `04 / VERIFIABLE DELIVERY` principles block (fault injection, replay and
  golden fixtures, containerized dependencies, simulated network faults);
  trace coverage renumbered to `05`.
- Surfaces: four surfaces kept, lede now states the shared design system; the
  common platform list gained `FRONTEND` (design system, typed clients, native UI).
- Home: hero stats unchanged (`02 stacks`, `01 contract source`, `03 frontends`,
  `E2E trace`); marquee expanded to 16
  items; capability grid 8 → 10 cards (six normal, four wide — four complete rows);
  common list gained the frontend platform.
- Dual stack: building blocks 8 → 9 (added `QUALITY / TEST`), fifth principle on
  failure drills, matrix rows for frontend platform and programmatic access.
- Custody integration adapters and the notification platform remain described as
  capabilities, not as accepted production deliveries.
