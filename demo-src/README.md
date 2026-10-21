# ffex demo reels — source & renderer

Reproducible, deterministic **demo asset pipeline** for the ffex marketing site.
It renders five animated product-demo loops (1440×900, 14 s, 30 fps, seamless)
and two 1200×630 social cards from self-contained HTML/CSS/JS scenes.

This folder is a **dev-only tool**. The Hugo site never depends on Node, npm or
this directory — only on the produced files under `static/demo/` and `static/og/`.

## Outputs

| File | Spec |
|---|---|
| `../static/demo/{terminal,matching,trace,admin,notify}.webm` | VP9, 1440×900, 30 fps, 14 s, no audio |
| `../static/demo/{terminal,matching,trace,admin,notify}.mp4` | H.264 (High), 1440×900, 30 fps, 14 s, `+faststart` |
| `../static/demo/{terminal,matching,trace,admin,notify}.jpg` | poster frame, 1440×900 |
| `../static/og/ffex-og-en.png`, `ffex-og-zh.png` | 1200×630 social card |

Every scene carries a visible `DEMO · 界面示意` watermark and uses generated demo
data only: no benchmark/throughput/latency figures, no client names, no internal
RPC/topic/config identifiers.

## Prerequisites (macOS, this workstation)

- **Node.js** ≥ 20 (used only by the renderer).
- **Playwright** with a Chromium build. The team machine has Playwright 1.57
  installed globally and the browser under the Playwright cache:
  - module: `/Users/chunyunluo/.nvm/versions/node/v25.2.1/lib/node_modules/playwright`
  - browser: `~/Library/Caches/ms-playwright/chromium-1217/chrome-mac-arm64/Google Chrome for Testing.app/contents/MacOS/Google Chrome for Testing`
  - Override with `PLAYWRIGHT_PATH` / `CHROME_PATH` when they live elsewhere.
  - Alternatively `npm install` inside `demo-src/` (a local `playwright` wins
    over the global fallback). `node_modules/` is git-ignored.
- **ffmpeg + ffprobe** on `PATH` (or set `FFMPEG` / `FFPROBE`). Defaults point at
  `/opt/homebrew/bin/ffmpeg` and `/opt/homebrew/bin/ffprobe`.

No network access is needed at render time: fonts are loaded from
`../static/fonts/*.woff2` and all scenes are local files served from a
throw-away loopback HTTP server started by the renderer.

## Render commands

Run from the **ffex repo root** (`ffex/`):

```bash
# everything: 5 reels (webm + mp4 + poster) and both OG images
node demo-src/render.mjs --all

# a single reel (re-captures frames, encodes webm + mp4 + poster)
node demo-src/render.mjs --scene terminal

# several reels
node demo-src/render.mjs --scene trace,admin

# social cards only
node demo-src/render.mjs --og

# quick visual review: write stills to $TMPDIR/ffex-demo-render/review/
node demo-src/render.mjs --scene matching --stills 0,3.5,7,10.5,13.9

# re-capture only a poster frame
node demo-src/render.mjs --scene admin --poster-only

# capture frames without encoding (frames stay in $TMPDIR/ffex-demo-render/)
node demo-src/render.mjs --scene notify --skip-encode
```

Useful flags: `--fps 30` (default), `--duration 14` (keep 12–16 s),
`--quality 95` (JPEG frame quality), `--crf-vp9 34`, `--crf-h264 21`.

The renderer prints a **loop seam PSNR** per scene (`t=0` vs `t=duration`);
higher is better (identical state ⇒ `inf`). It also probes every `.mp4` and
`.jpg` at the end and warns about missing files, wrong resolution or page
overflow.

## How the scenes work

```
scenes/base.css      design system: palette, fonts, panels, chips, watermark
scenes/lib.js        deterministic clock + math/DOM helpers + app chrome
scenes/<name>.html   per-scene layout CSS, loads lib.js and <name>.js
scenes/<name>.js     data generation + draw(t)
og/og.css            social-card styles
og/og-en.html        English card
og/og-zh.html        Chinese card
render.mjs           static server + Playwright frame capture + ffmpeg encode
```

- `render.mjs` serves the repo over `http://127.0.0.1:<port>` so the woff2 fonts
  and scenes share one origin (no `file://` CORS issues).
- Each scene registers `window.__setFrame(t)`. The renderer calls it for every
  frame at `t = i / fps` and screenshots the 1440×900 viewport as JPEG. Nothing
  in a scene reads `Date`, `requestAnimationFrame` or CSS animations, so every
  frame is reproducible.
- **Loop model.** All scenes use `duration = 14 s`. Movement is driven by
  periodic functions whose frequency is an integer number of cycles per loop
  (`Demo.wave(t, k, phase)`) or by event lists whose ages are taken modulo the
  loop length (`Demo.age(t, eventTime)`). One-shot UI cycles (logs, order flow,
  deliveries, TOTP modal) repeat every `duration / n` seconds so they are
  identical at `t=0` and `t=14`. That is what makes the loops seamless.
- Frames are encoded with ffmpeg: VP9 (`-crf 34`, row-mt, two tile columns) and
  H.264 (`-crf 21`, high profile, `+faststart`). Posters are captured directly
  from the page (never recompressed from video).

## Adding or editing a scene

1. Copy an existing pair `scenes/x.html` + `scenes/x.js`; adjust layout CSS and
   the `draw(t)` body. Reuse `Demo.shell()` for the top bar + watermark.
2. Keep every animated value periodic over 14 s (or `14 / n`). Use
   `Demo.wave`, `Demo.loop`, `Demo.age`; never seed randomness from the clock.
3. Add the id + poster time to the `SCENES` array in `render.mjs`.
4. `node demo-src/render.mjs --scene x --stills 0,7,13.9` and inspect the stills.

## Content rules (hard)

- Generated demo data only. Prices, quantities, ids and timestamps are fictional
  and plausible (e.g. `BTC/USDT 68,4xx`, ids like `0x9f3a…c21`).
- No measured performance numbers, throughput, latency or capacity claims; no
  server counts/topology; no client names, logos or testimonials.
- No internal RPC names, topic names, schema/config dumps or source snippets.
  Protocol labels (`HTTP`, `WebSocket`, `gRPC`, `MySQL`, `Kafka`, `worker`) are
  fine; business event names stay generic.
- Keep the `DEMO · 界面示意` watermark and the "generated demo data" subtitle
  visible in every scene.

## Housekeeping

- `render.mjs` writes frames and review stills to `$TMPDIR/ffex-demo-render/`,
  never into the repo.
- `node_modules/` is git-ignored (see `.gitignore` in this folder); it is only
  needed if you install Playwright locally.
- Do not commit `demo-src/node_modules/`. Do not edit `static/` outside
  `static/demo/` and `static/og/` from this tool.
