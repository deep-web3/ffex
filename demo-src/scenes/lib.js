/* ==========================================================================
   ffex demo reels — shared scene runtime.
   Deterministic clock: the render script calls window.__setFrame(t) for every
   frame; nothing in a scene may depend on real time, Date, rAF or CSS animation.
   Every helper returns a function of t only; loops are engineered so that the
   state at t = duration is identical to t = 0.
   ========================================================================== */
(function () {
  "use strict";

  var TAU = Math.PI * 2;
  var D = 14; // loop duration (seconds) — overwritten by Demo.mount({duration})

  /* ------------------------------------------------------------------ math */
  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function mix(a, b, x) { return a + (b - a) * x; }
  function smooth(x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); }
  function smoothstep(a, b, x) { return smooth((x - a) / (b - a)); }
  function easeOut(x) { x = clamp(x, 0, 1); return 1 - Math.pow(1 - x, 3); }
  function easeIn(x) { x = clamp(x, 0, 1); return x * x * x; }

  /* periodic within the loop: k must be an integer number of cycles / loop */
  function wave(t, k, phase) { return Math.sin(TAU * (k * t / D + (phase || 0))); }
  function coswave(t, k, phase) { return Math.cos(TAU * (k * t / D + (phase || 0))); }

  /* local time inside a repeating event cycle starting at `at` */
  function loop(t, at, dur) {
    var x = (t - at) % dur;
    return x < 0 ? x + dur : x;
  }
  /* age of a single event inside the loop window; use for one-shot events that
     carry over the loop seam (event near the end is still young at t=0) */
  function age(t, at) {
    var x = (t - at) % D;
    return x < 0 ? x + D : x;
  }
  /* fade helper on an age */
  function fadeAge(a, inDur, outStart) {
    if (a > outStart) return 0;
    var i = inDur <= 0 ? 1 : smooth(a / inDur);
    return i;
  }

  /* deterministic PRNG */
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ------------------------------------------------------------ formatting */
  function nf(min, max) {
    return new Intl.NumberFormat("en-US", { minimumFractionDigits: min, maximumFractionDigits: max });
  }
  var NF2 = nf(2, 2), NF1 = nf(1, 1), NF0 = nf(0, 0);
  function pad(n, w) { var s = String(n); while (s.length < (w || 2)) s = "0" + s; return s; }
  function num(n, dp) { return dp === 0 ? NF0.format(n) : dp === 1 ? NF1.format(n) : NF2.format(n); }
  function compact(n) {
    if (Math.abs(n) >= 1e9) return (n / 1e9).toFixed(2) + "B";
    if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(2) + "M";
    if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(1) + "K";
    return num(n, 1);
  }
  function hhmmss(sec) {
    var s = Math.floor(sec);
    return pad(Math.floor(s / 3600) % 24) + ":" + pad(Math.floor(s / 60) % 60) + ":" + pad(s % 60);
  }
  function signed(n, dp) { return (n >= 0 ? "+" : "") + num(Math.abs(n), dp === undefined ? 2 : dp); }
  function hex(seed, len) {
    var h = "", r = rng(seed), chars = "0123456789abcdef";
    for (var i = 0; i < (len || 8); i++) h += chars[Math.floor(r() * 16)];
    return h;
  }

  /* ---------------------------------------------------------------- DOM */
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function qs(sel, root) { return (root || document).querySelector(sel); }
  function setText(el, txt) {
    if (!el) return;
    if (el.__txt !== txt) { el.textContent = txt; el.__txt = txt; }
  }
  function setHTML(el, html) {
    if (!el) return;
    if (el.__html !== html) { el.innerHTML = html; el.__html = html; }
  }
  function create(tag, cls, html) {
    var el = document.createElement(tag);
    if (cls) el.className = cls;
    if (html != null) el.innerHTML = html;
    return el;
  }

  /* --------------------------------------------------------- shared shell */
  function shell(opt) {
    opt = opt || {};
    var product = opt.product || "TERMINAL";
    var nav = opt.nav || [];
    var active = opt.active || 0;
    var clock = opt.clock || "SESSION · DEMO";
    var brand = [
      '<div class="bg"><div class="aurora" id="aurora"></div><div class="grid"></div>',
      '<div class="noise"></div><div class="vignette"></div></div>',
      '<header class="topbar">',
      '<div class="brand"><span class="brand-dot"></span><span class="brand-word">ffex</span>',
      '<span class="brand-div"></span><span class="brand-product">' + esc(product) + "</span></div>",
      '<nav class="topnav">' +
      nav.map(function (n, i) { return '<span class="' + (i === active ? "on" : "") + '">' + esc(n) + "</span>"; }).join("") +
      "</nav>",
      '<div class="topright"><span class="env-chip"><i></i>DEMO ENV</span>',
      '<span class="clock-chip">' + esc(clock) + "</span>",
      '<span class="avatar">FF</span></div>',
      "</header>",
      '<div class="demo-mark"><span class="demo-dot"></span>DEMO · 界面示意',
      '<span class="demo-sub">GENERATED DATA</span></div>',
      '<main class="stage" id="stage"></main>'
    ].join("");
    document.body.insertAdjacentHTML("afterbegin", brand);
    return qs("#stage");
  }

  /* ---------------------------------------------------------------- mount */
  function mount(draw, opt) {
    opt = opt || {};
    D = opt.duration || 14;
    var first = true;
    window.__D = D;
    window.__setFrame = function (t) {
      // clamp to loop so t = D renders the same state as t = 0
      if (t >= D - 1e-6) t = 0;
      draw(t);
      if (first) { first = false; document.documentElement.dataset.painted = "1"; }
    };
    function boot() {
      Promise.all([
        document.fonts.load('700 20px "Space Grotesk"'),
        document.fonts.load('500 16px "Space Grotesk"'),
        document.fonts.load('400 12px "Inter"'),
        document.fonts.load('500 12px "JetBrains Mono"'),
        document.fonts.load('600 12px "JetBrains Mono"')
      ]).catch(function () {}).then(function () {
        return document.fonts.ready;
      }).then(function () {
        draw(0);
        window.__ready = true;
      });
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
    else boot();
  }

  /* small utility: animate an element's opacity/transform from a 0..1 progress */
  function reveal(el, p, dy) {
    p = clamp(p, 0, 1);
    el.style.opacity = p.toFixed(3);
    el.style.transform = "translate3d(0," + ((1 - p) * (dy || 10)).toFixed(2) + "px,0)";
  }

  window.Demo = {
    TAU: TAU, get D() { return D; },
    clamp: clamp, mix: mix, smooth: smooth, smoothstep: smoothstep, easeOut: easeOut, easeIn: easeIn,
    wave: wave, coswave: coswave, loop: loop, age: age, fadeAge: fadeAge, rng: rng,
    pad: pad, num: num, compact: compact, hhmmss: hhmmss, signed: signed, hex: hex,
    esc: esc, qs: qs, setText: setText, setHTML: setHTML, create: create,
    shell: shell, mount: mount, reveal: reveal
  };
})();
