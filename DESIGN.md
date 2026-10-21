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
`hero(home, console)` → `marquee` → `bento(capabilities)` → `showcase(demos)` →
`stack` → `trace(summary)` → `common` → `principles` → `models(condensed)` →
`process` → `insights` → `cta`.

Capabilities: `hero(compact, orbit)` → `bento(business domains)` →
`bento(frontends & interfaces, variant surfaces)` → `common` → `trace(summary)` → `cta`.

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
    - { label: "Get source & pricing", href: "cooperation/", style: "ghost" }
  stats:                   # home only, max 4
    - { value: "02", label: "CEX STACKS · JAVA + GO" }
  footnote: "Illustrative interface · demo data"
```

**marquee** — `items: ["SPOT", "PERPETUALS", …]` (10–16 short labels, no punctuation).

**bento** — `variant`: `cards` (default) | `compact` | `surfaces`; `items` fields:
`tag`, `title`, `desc`, `icon` (see icon list), `accent` (`violet|cyan|amber|lime|rose`),
`span` (`normal|wide`), `href`, `linkLabel`.
`surfaces` items may add `points: []` and render as product surfaces with device art.

**showcase** — demo reel tabs. `items`: `id`, `tab` (short tab label), `title`, `desc`,
`video` (`demo/<name>.webm`), `mp4` (`demo/<name>.mp4`), `poster` (`demo/<name>.jpg`),
`bullets: []`, `badge` (optional).
Common `note`: "Illustrative interfaces, generated demo data. Not live market data."

**stack** — dual Java/Go section.
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
github, arrow, play, pause`.

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

- Background `#04050b` with layered aurora radial gradients, 1px grid (masked),
  fine noise; panels are glass (`rgba(12,15,26,.72)` + 1px hairline + inner highlight).
- Accents: violet `#8b6cff`, cyan `#2ee6c5`, lime `#c8ff62`, amber `#ffb45c`,
  rose `#ff6f91`. Brand gradient: violet → cyan → lime (used for highlight words,
  marks, 1px borders, small glows; never as large flat fills).
- Type: **Space Grotesk** (display, tight tracking, 300–700), **Inter** (body),
  **JetBrains Mono** (labels, data, numerals; uppercase letterspaced 0.14em).
  Self-hosted woff2 in `static/fonts/`; CJK falls back to system (`PingFang SC`,
  `Noto Sans SC`, `Microsoft YaHei`).
- Layout: container 1240px, section rhythm 96–140px, asymmetric two-column heroes,
  bento grids, numbered sections ("01 / CAPABILITY MAP" style eyebrows).
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
No Node runtime dependency for the site build; `demo-src/` is a dev-only tool.

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

- Custom Hugo layouts in `layouts/` (no external theme), 16 block partials, custom
  design system in `assets/css/`, motion/canvas/video behaviour in `assets/js/`.
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
