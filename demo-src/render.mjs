#!/usr/bin/env node
/* ==========================================================================
   ffex demo reel renderer
   --------------------------------------------------------------------------
   Captures the deterministic HTML scenes in demo-src/scenes/ frame-by-frame
   with headless Chromium (Playwright), then encodes:
     static/demo/<name>.webm   VP9, 30fps
     static/demo/<name>.mp4    H.264, 30fps
     static/demo/<name>.jpg    poster (representative frame)
   and the social cards:
     static/og/ffex-og-en.png  1200x630
     static/og/ffex-og-zh.png  1200x630

   Usage (from the ffex repo root):
     node demo-src/render.mjs                     # all reels + OG images
     node demo-src/render.mjs --scene terminal    # one reel (webm+mp4+jpg)
     node demo-src/render.mjs --scene trace --stills 0,4,8,12
     node demo-src/render.mjs --og                # only the OG images
     node demo-src/render.mjs --poster-only --scene admin

   Requirements: ffmpeg/ffprobe on PATH (or FFMPEG/FFPROBE env vars) and the
   Playwright package + a Chromium build (see README.md).
   ========================================================================== */

import { createRequire } from "node:module";
import { createServer } from "node:http";
import { mkdir, readFile, rm, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import os from "node:os";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, ".."); // ffex repo root
const STATIC_DEMO = path.join(ROOT, "static", "demo");
const STATIC_OG = path.join(ROOT, "static", "og");
const TMP = path.join(os.tmpdir(), "ffex-demo-render");
const FFMPEG = process.env.FFMPEG || "/opt/homebrew/bin/ffmpeg";
const FFPROBE = process.env.FFPROBE || "/opt/homebrew/bin/ffprobe";

/* local Chromium used by the team (Playwright's registry browser is missing) */
const DEFAULT_CHROME =
  path.join(os.homedir(), "Library/Caches/ms-playwright/chromium-1217/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing");
const DEFAULT_PLAYWRIGHT =
  "/Users/chunyunluo/.nvm/versions/node/v25.2.1/lib/node_modules/playwright";

const WIDTH = 1440;
const HEIGHT = 900;
const OG_W = 1200;
const OG_H = 630;

/* poster: frame time (seconds) that best sells each scene */
const SCENES = [
  { id: "terminal", poster: 7.6 },
  { id: "matching", poster: 6.2 },
  { id: "trace", poster: 2.8, vp9crf: 32 },
  { id: "admin", poster: 6.4, vp9crf: 32 },
  { id: "notify", poster: 6.0 }
];

/* ------------------------------------------------------------------- args */
const argv = process.argv.slice(2);
function flag(name) { return argv.includes("--" + name); }
function opt(name, dflt) {
  const i = argv.indexOf("--" + name);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : dflt;
}
function optList(name) {
  const v = opt(name, "");
  return v ? v.split(",").map((s) => s.trim()).filter(Boolean) : [];
}
function die(msg) { console.error("\n[ffex-render] " + msg + "\n"); process.exit(1); }
function log(msg) { console.log("[ffex-render] " + msg); }
function fmtSize(bytes) { return (bytes / (1024 * 1024)).toFixed(2) + " MB"; }

const RUN = {
  all: argv.length === 0 || argv.includes("--all"),
  scenes: optList("scene"),
  ogOnly: flag("og"),
  stills: optList("stills"),
  posterOnly: flag("poster-only"),
  skipEncode: flag("skip-encode"),
  skipOg: flag("skip-og"),
  fps: Number(opt("fps", 30)),
  duration: Number(opt("duration", 14)),
  quality: Number(opt("quality", 95)),
  crfVp9: Number(opt("crf-vp9", 34)),
  crfH264: Number(opt("crf-h264", 21)),
  chrome: process.env.CHROME_PATH || DEFAULT_CHROME,
  playwright: process.env.PLAYWRIGHT_PATH || DEFAULT_PLAYWRIGHT
};
if (RUN.all) RUN.scenes = SCENES.map((s) => s.id);
if (!RUN.ogOnly && RUN.scenes.length === 0) die("no scenes selected");
const UNKNOWN = RUN.scenes.filter((s) => !SCENES.some((x) => x.id === s));
if (UNKNOWN.length) die("unknown scene(s): " + UNKNOWN.join(", ") + " (available: " + SCENES.map((s) => s.id).join(", ") + ")");
if (!existsSync(RUN.chrome)) die("Chromium not found at:\n  " + RUN.chrome + "\nSet CHROME_PATH to the Chrome-for-Testing binary.");

const require = createRequire(import.meta.url);
let playwright;
try {
  playwright = await import("playwright");
} catch {
  try {
    playwright = require(RUN.playwright);
  } catch (err) {
    die("Playwright not resolvable. Tried `import('playwright')` and `" + RUN.playwright + "`.\n" + err.message);
  }
}
const { chromium } = playwright;

/* --------------------------------------------------------------- web server */
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};
function startServer() {
  return new Promise((resolve, reject) => {
    const server = createServer(async (req, res) => {
      try {
        const url = new URL(req.url, "http://127.0.0.1");
        let rel = decodeURIComponent(url.pathname);
        if (rel.endsWith("/")) rel += "index.html";
        const abs = path.normalize(path.join(ROOT, rel));
        if (!abs.startsWith(ROOT + path.sep)) { res.writeHead(403); res.end(); return; }
        const body = await readFile(abs);
        res.writeHead(200, {
          "content-type": MIME[path.extname(abs).toLowerCase()] || "application/octet-stream",
          "cache-control": "no-store"
        });
        res.end(body);
      } catch {
        res.writeHead(404); res.end("not found");
      }
    });
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}
function baseURL(server) { return "http://127.0.0.1:" + server.address().port; }

/* ------------------------------------------------------------------- utils */
function ffmpeg(args, label) {
  log((label || "ffmpeg") + " …");
  const r = spawnSync(FFMPEG, args, { stdio: ["ignore", "pipe", "pipe"] });
  if (r.status !== 0) {
    console.error(String(r.stderr || ""));
    die("ffmpeg failed: " + label);
  }
  return r;
}
function psnr(a, b) {
  const r = spawnSync(FFMPEG, ["-hide_banner", "-i", a, "-i", b, "-lavfi", "psnr", "-f", "null", "-"], { encoding: "utf8" });
  const out = String(r.stderr || "");
  const m = out.match(/average:([^\s]+)/);
  return m ? m[1] : "n/a";
}
async function sizeOf(p) { return (await stat(p)).size; }
function encodeScene(scene, framesDir) {
  const base = path.join(STATIC_DEMO, scene.id);
  const input = ["-y", "-framerate", String(RUN.fps), "-i", path.join(framesDir, "%04d.jpg")];
  const color = ["-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709", "-color_range", "tv"];
  const fmt = ["-vf", "scale=in_range=full:out_range=limited:out_color_matrix=bt709:flags=lanczos,format=yuv420p"];

  ffmpeg(
    [...input, ...fmt, "-an", "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", String(scene.vp9crf || RUN.crfVp9),
     "-row-mt", "1", "-tile-columns", "2", "-threads", "8", "-auto-alt-ref", "1",
     "-lag-in-frames", "25", "-deadline", "good", "-cpu-used", "2",
     "-pix_fmt", "yuv420p", "-g", String(RUN.fps * 2), ...color, base + ".webm"],
    scene.id + " → webm"
  );
  ffmpeg(
    [...input, ...fmt, "-an", "-c:v", "libx264", "-preset", "slow", "-crf", String(scene.h264crf || RUN.crfH264),
     "-pix_fmt", "yuv420p", "-profile:v", "high", "-level", "4.0", "-g", String(RUN.fps * 2),
     "-movflags", "+faststart", ...color, base + ".mp4"],
    scene.id + " → mp4"
  );
}

/* ------------------------------------------------------------------- scenes */
async function captureScene(browser, url, scene) {
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
    reducedMotion: "reduce"
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });

  await page.goto(url, { waitUntil: "load" });
  await page.waitForFunction("window.__ready === true", null, { timeout: 60000 });
  const layout = await page.evaluate(() => {
    const de = document.documentElement;
    return { sw: de.scrollWidth, sh: de.scrollHeight, fw: window.innerWidth, fh: window.innerHeight };
  });
  if (layout.sw > layout.fw || layout.sh > layout.fh) {
    console.warn("[ffex-render] WARN " + scene.id + " overflow: " + JSON.stringify(layout));
  }
  if (errors.length) console.warn("[ffex-render] WARN " + scene.id + " page errors:\n  " + errors.slice(0, 8).join("\n  "));

  const framesDir = path.join(TMP, "frames-" + scene.id);
  await rm(framesDir, { recursive: true, force: true });
  await mkdir(framesDir, { recursive: true });

  const total = Math.round(RUN.fps * RUN.duration);
  const t0 = Date.now();
  for (let i = 0; i < total; i++) {
    const t = i / RUN.fps;
    await page.evaluate((tt) => window.__setFrame(tt), t);
    await page.screenshot({
      path: path.join(framesDir, String(i).padStart(4, "0") + ".jpg"),
      type: "jpeg",
      quality: RUN.quality
    });
    if (i > 0 && i % 60 === 0) log("  " + scene.id + " frame " + i + "/" + total);
  }
  log("  " + scene.id + " captured " + total + " frames in " + ((Date.now() - t0) / 1000).toFixed(1) + "s");

  /* poster frame (direct capture, no recompression) */
  const posterPath = path.join(STATIC_DEMO, scene.id + ".jpg");
  if (!RUN.skipEncode || RUN.posterOnly) {
    await page.evaluate((tt) => window.__setFrame(tt), scene.poster % RUN.duration);
    await page.screenshot({ path: posterPath, type: "jpeg", quality: 92 });
  }

  /* loop seam check: state at t=0 vs t=duration must match */
  let seam = "skipped";
  if (RUN.duration === 14) {
    await page.evaluate(() => window.__setFrame(0));
    const a = path.join(TMP, "seam-" + scene.id + "-a.png");
    await page.screenshot({ path: a, type: "png" });
    await page.evaluate((tt) => window.__setFrame(tt), RUN.duration);
    const b = path.join(TMP, "seam-" + scene.id + "-b.png");
    await page.screenshot({ path: b, type: "png" });
    seam = psnr(a, b);
  }
  await page.close();
  return { framesDir, total, seam };
}

/* ------------------------------------------------------------------ review */
async function reviewStills(browser, url, scene) {
  const pageUrl = url + "/demo-src/scenes/" + scene.id + ".html";
  const times = RUN.stills.map(Number).filter((n) => !Number.isNaN(n));
  const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1, reducedMotion: "reduce" });
  await page.goto(pageUrl, { waitUntil: "load" });
  await page.waitForFunction("window.__ready === true", null, { timeout: 60000 });
  const dir = path.join(TMP, "review");
  await mkdir(dir, { recursive: true });
  for (const t of times) {
    await page.evaluate((tt) => window.__setFrame(tt), t % RUN.duration === 0 && t !== 0 ? t : t);
    const out = path.join(dir, scene.id + "_t" + String(t).replace(".", "_") + ".jpg");
    await page.screenshot({ path: out, type: "jpeg", quality: 92 });
    log("still → " + out);
  }
  await page.close();
}

/* ---------------------------------------------------------------------- og */
async function captureOG(browser, url) {
  const items = [
    { id: "en", out: "ffex-og-en.png" },
    { id: "zh", out: "ffex-og-zh.png" }
  ];
  await mkdir(STATIC_OG, { recursive: true });
  for (const it of items) {
    const page = await browser.newPage({ viewport: { width: OG_W, height: OG_H }, deviceScaleFactor: 2 });
    const errors = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.goto(url + "/demo-src/og/og-" + it.id + ".html", { waitUntil: "load" });
    await page.waitForFunction("window.__ready === true", null, { timeout: 30000 });
    if (errors.length) console.warn("[ffex-render] WARN og " + it.id + " errors: " + errors.join("; "));
    const raw = path.join(TMP, "og-" + it.id + "-2x.png");
    await page.screenshot({ path: raw, type: "png" });
    await page.close();
    const out = path.join(STATIC_OG, it.out);
    ffmpeg(["-y", "-i", raw, "-vf", "scale=" + OG_W + ":" + OG_H + ":flags=lanczos", "-frames:v", "1", "-pix_fmt", "rgb24", out], "og " + it.id);
    log("OG " + it.out + " · " + fmtSize(await sizeOf(out)));
  }
}

/* ------------------------------------------------------------------- verify */
function verify() {
  log("verifying deliverables …");
  const demoFiles = [];
  for (const scene of SCENES) {
    for (const ext of ["webm", "mp4", "jpg"]) demoFiles.push(path.join(STATIC_DEMO, scene.id + "." + ext));
  }
  for (const f of demoFiles) if (!existsSync(f)) console.warn("  MISSING " + path.relative(ROOT, f));
  for (const f of demoFiles) {
    if (!(f.endsWith(".mp4") || f.endsWith(".webm"))) continue;
    const r = spawnSync(FFPROBE, ["-v", "error", "-select_streams", "v:0", "-show_entries",
      "stream=codec_name,width,height,avg_frame_rate,pix_fmt,color_range:format=duration,size", "-of", "json", f], { encoding: "utf8" });
    try {
      const j = JSON.parse(r.stdout);
      const s = j.streams[0], fm = j.format;
      const okRes = s.width === WIDTH && s.height === HEIGHT;
      const okFps = s.avg_frame_rate === RUN.fps + "/1";
      const mb = Number(fm.size / 1048576);
      const limit = f.endsWith(".mp4") ? 5 : 3;
      console.log("  " + path.relative(ROOT, f) + "  " + s.codec_name + " " + s.width + "x" + s.height +
        " " + s.avg_frame_rate + "fps " + s.pix_fmt + "/" + (s.color_range || "?") +
        " " + Number(fm.duration).toFixed(2) + "s " + mb.toFixed(2) + "MB" +
        (okRes ? "" : "  ⚠ resolution") + (okFps ? "" : "  ⚠ fps") + (mb > limit ? "  ⚠ size" : ""));
    } catch {
      console.warn("  could not probe " + f);
    }
  }
  for (const f of demoFiles.filter((x) => x.endsWith(".jpg"))) {
    const s = spawnSync(FFPROBE, ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height:format=size", "-of", "json", f], { encoding: "utf8" });
    try {
      const j = JSON.parse(s.stdout);
      console.log("  " + path.relative(ROOT, f) + "  " + j.streams[0].width + "x" + j.streams[0].height + "  " + fmtSize(j.format.size));
    } catch { /* ignore */ }
  }
}

/* --------------------------------------------------------------------- main */
const wall = Date.now();
await mkdir(TMP, { recursive: true });
await mkdir(STATIC_DEMO, { recursive: true });
const server = await startServer();
const url = baseURL(server);
const browser = await chromium.launch({
  executablePath: RUN.chrome,
  headless: true,
  args: ["--hide-scrollbars", "--force-color-profile=srgb", "--font-render-hinting=none"]
});
log("Chromium ready; serving " + ROOT + " at " + url);

try {
  if (RUN.ogOnly) {
    await captureOG(browser, url);
  } else {
    const selected = SCENES.filter((s) => RUN.scenes.includes(s.id));
    if (RUN.stills.length) {
      for (const scene of selected) await reviewStills(browser, url, scene);
    } else if (RUN.posterOnly) {
      for (const scene of selected) {
        const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1, reducedMotion: "reduce" });
        await page.goto(url + "/demo-src/scenes/" + scene.id + ".html", { waitUntil: "load" });
        await page.waitForFunction("window.__ready === true", null, { timeout: 60000 });
        await page.evaluate((tt) => window.__setFrame(tt), scene.poster);
        await page.screenshot({ path: path.join(STATIC_DEMO, scene.id + ".jpg"), type: "jpeg", quality: 92 });
        await page.close();
        log("poster → static/demo/" + scene.id + ".jpg");
      }
    } else {
      const seams = [];
      for (const scene of selected) {
        const t0 = Date.now();
        const res = await captureScene(browser, url + "/demo-src/scenes/" + scene.id + ".html", scene);
        seams.push([scene.id, res.seam]);
        if (!RUN.skipEncode) encodeScene(scene, res.framesDir);
        log(scene.id + " done in " + ((Date.now() - t0) / 1000).toFixed(1) + "s");
      }
      if (RUN.all && !RUN.skipOg) await captureOG(browser, url);
      log("loop seam PSNR (t=0 vs t=duration, higher = better): " + seams.map(([id, p]) => id + " " + p).join(" · "));
    }
  }
} finally {
  await browser.close();
  server.close();
}
verify();
log("finished in " + ((Date.now() - wall) / 1000).toFixed(1) + "s");
