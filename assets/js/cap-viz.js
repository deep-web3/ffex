/* Live capability wall: procedural, decorative canvas scenes.
   Each card renders one abstract system behaviour (matching, custody, risk …).
   Paused off-screen, static under prefers-reduced-motion, never reads the DOM. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canvases = Array.prototype.slice.call(document.querySelectorAll("[data-cap-scene]"));
  if (!canvases.length) return;

  var rootStyle = getComputedStyle(document.documentElement);
  function token(name, fallback) {
    var v = rootStyle.getPropertyValue(name).trim();
    return v || fallback;
  }
  var C = {
    violet: token("--violet", "#8168ff"),
    cyan: token("--cyan", "#2ff0c8"),
    lime: token("--lime", "#d2ff62"),
    amber: token("--amber", "#ffbe6b"),
    rose: token("--rose", "#ff7d9c"),
    ink: token("--ink-2", "#ccd2ea"),
    faint: token("--faint", "#7b83a6"),
    line: "rgba(158,168,212,0.16)",
    lineSoft: "rgba(158,168,212,0.08)",
    panel: "rgba(255,255,255,0.035)"
  };
  if (C.violet.charAt(0) !== "#") C.violet = "#8168ff";
  if (C.cyan.charAt(0) !== "#") C.cyan = "#2ff0c8";
  if (C.lime.charAt(0) !== "#") C.lime = "#d2ff62";

  function rgba(hex, a) {
    var h = hex.replace("#", "");
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
  }

  function rng(seed) {
    var s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return function () {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }

  function roundRect(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function label(ctx, text, x, y, color, size, align) {
    ctx.fillStyle = color || C.faint;
    ctx.font = "500 " + (size || 7) + "px 'JetBrains Mono', ui-monospace, monospace";
    ctx.textAlign = align || "left";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y);
  }

  function dot(ctx, x, y, r, color) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }

  function grid(ctx, w, h, step) {
    ctx.strokeStyle = C.lineSoft;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    for (var x = step; x < w; x += step) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
    }
    for (var y = step; y < h; y += step) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    ctx.stroke();
  }

  /* ---------------- scenes ---------------- */

  function match(ctx, w, h, t, st) {
    var cx = w * 0.5;
    var rows = 7;
    var rowH = (h * 0.62) / rows;
    var top = h * 0.16;
    for (var i = 0; i < rows; i++) {
      var wobble = 0.55 + 0.45 * Math.sin(t * 0.9 + i * 0.82 + st.seed);
      var wAsk = (w * 0.3) * wobble;
      var wBid = (w * 0.3) * (0.6 + 0.4 * Math.cos(t * 0.8 + i * 0.6));
      var y = top + i * rowH;
      ctx.fillStyle = rgba(C.rose, 0.14);
      ctx.fillRect(cx + 8, y, wAsk, rowH * 0.62);
      ctx.fillStyle = rgba(C.cyan, 0.14);
      ctx.fillRect(cx - 8 - wBid, y, wBid, rowH * 0.62);
      ctx.fillStyle = rgba(C.rose, 0.5);
      ctx.fillRect(cx + 8, y, 2, rowH * 0.62);
      ctx.fillStyle = rgba(C.cyan, 0.5);
      ctx.fillRect(cx - 10, y, 2, rowH * 0.62);
    }
    ctx.strokeStyle = C.line;
    ctx.beginPath();
    ctx.moveTo(cx, h * 0.1);
    ctx.lineTo(cx, h * 0.86);
    ctx.stroke();

    var phase = (t * 0.45) % 1;
    var py = h * 0.16 + phase * h * 0.62;
    ctx.strokeStyle = rgba(C.lime, 0.65 - phase * 0.5);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 34, py);
    ctx.lineTo(cx + 34, py);
    ctx.stroke();
    if (phase < 0.16) {
      dot(ctx, cx, py, 2.5 + (0.16 - phase) * 20, rgba(C.lime, 0.55));
    }
    label(ctx, "ASK", w * 0.72, h * 0.1, rgba(C.rose, 0.8));
    label(ctx, "BID", w * 0.24, h * 0.1, rgba(C.cyan, 0.8));
  }

  function custody(ctx, w, h, t, st) {
    var y = h * 0.55;
    var xs = [w * 0.16, w * 0.5, w * 0.84];
    var names = ["DEPOSIT", "HOT", "COLD"];
    grid(ctx, w, h, 22);
    ctx.strokeStyle = C.line;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(xs[0], y);
    ctx.lineTo(xs[2], y);
    ctx.stroke();
    for (var i = 0; i < 3; i++) {
      var r = i === 2 ? 13 : 9;
      ctx.beginPath();
      ctx.arc(xs[i], y, r + 5, 0, Math.PI * 2);
      ctx.strokeStyle = i === 2 ? rgba(C.lime, 0.4) : rgba(C.cyan, 0.28);
      ctx.stroke();
      dot(ctx, xs[i], y, r * 0.5, i === 2 ? C.lime : C.cyan);
      label(ctx, names[i], xs[i], y + r + 16, C.faint, 6.5, "center");
    }
    for (var k = 0; k < 5; k++) {
      var p = (t * (0.22 + k * 0.03) + k * 0.2 + st.seed * 0.13) % 1;
      var seg = p < 0.5 ? 0 : 1;
      var local = p < 0.5 ? p * 2 : (p - 0.5) * 2;
      var x0 = seg === 0 ? xs[0] : xs[1];
      var x1 = seg === 0 ? xs[1] : xs[2];
      var px = x0 + (x1 - x0) * local;
      dot(ctx, px, y, 1.8, seg === 0 ? C.cyan : rgba(C.lime, 0.85));
    }
  }

  function risk(ctx, w, h, t, st) {
    var cx = w * 0.52;
    var cy = h * 0.62;
    var r = Math.min(w, h) * 0.34;
    ctx.lineWidth = 5;
    ctx.strokeStyle = C.lineSoft;
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI, Math.PI * 2);
    ctx.stroke();
    var grad = ctx.createLinearGradient(cx - r, cy, cx + r, cy);
    grad.addColorStop(0, C.cyan);
    grad.addColorStop(0.62, C.amber);
    grad.addColorStop(1, C.rose);
    ctx.strokeStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI, Math.PI * 1.62);
    ctx.stroke();
    var ticks = 18;
    for (var i = 0; i <= ticks; i++) {
      var a = Math.PI + (i / ticks) * Math.PI;
      var r0 = r - 11;
      var r1 = r - (i % 3 === 0 ? 17 : 14);
      ctx.strokeStyle = C.line;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
      ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
      ctx.stroke();
    }
    var angle = Math.PI + Math.PI * (0.42 + 0.24 * Math.sin(t * 0.7 + st.seed));
    ctx.strokeStyle = C.ink;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * (r - 20), cy + Math.sin(angle) * (r - 20));
    ctx.stroke();
    dot(ctx, cx, cy, 3, C.ink);
    label(ctx, "EXPOSURE", cx, cy + 16, C.faint, 6.5, "center");
    var bars = [0.42, 0.66, 0.31];
    for (var b = 0; b < 3; b++) {
      var bx = w * 0.78;
      var by = h * 0.24 + b * 16;
      ctx.fillStyle = C.lineSoft;
      ctx.fillRect(bx, by, w * 0.16, 4);
      ctx.fillStyle = b === 2 ? C.rose : C.cyan;
      ctx.fillRect(bx, by, w * 0.16 * (bars[b] + 0.05 * Math.sin(t + b)), 4);
    }
  }

  function clearing(ctx, w, h, t, st) {
    var n = 5;
    var gap = 8;
    var bw = (w - 32 - gap * (n - 1)) / n;
    var y = h * 0.32;
    var bh = h * 0.34;
    var pulse = (t * 0.35) % 1;
    for (var i = 0; i < n; i++) {
      var x = 16 + i * (bw + gap);
      var active = Math.abs(pulse * (n + 1) - i) < 0.8;
      ctx.fillStyle = active ? rgba(C.cyan, 0.1) : "rgba(255,255,255,0.025)";
      roundRect(ctx, x, y, bw, bh, 5);
      ctx.fill();
      ctx.strokeStyle = active ? rgba(C.cyan, 0.55) : C.line;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = active ? rgba(C.cyan, 0.75) : C.line;
      for (var l = 0; l < 3; l++) {
        ctx.fillRect(x + 7, y + 9 + l * 8, bw * (0.4 + ((i + l) % 3) * 0.14), 1.6);
      }
      label(ctx, "0x" + ((i * 37 + 11) % 255).toString(16).toUpperCase(), x + 7, y + bh - 8, active ? C.cyan : C.faint, 5.5);
      if (i < n - 1) {
        ctx.strokeStyle = C.line;
        ctx.beginPath();
        ctx.moveTo(x + bw + 1, y + bh / 2);
        ctx.lineTo(x + bw + gap - 1, y + bh / 2);
        ctx.stroke();
      }
    }
    label(ctx, "JOURNAL / APPEND ONLY", 16, h * 0.82, C.faint, 6.5);
    ctx.strokeStyle = rgba(C.lime, 0.5);
    ctx.beginPath();
    ctx.moveTo(w - 84, h * 0.82);
    ctx.lineTo(w - 16, h * 0.82);
    ctx.stroke();
    label(ctx, "BALANCED", w - 16, h * 0.82 - 10, rgba(C.lime, 0.8), 6.5, "right");
  }

  function marketdata(ctx, w, h, t, st) {
    var n = 26;
    var step = (w - 24) / n;
    var base = h * 0.6;
    var rand = rng(st.seed * 97 + 3);
    var pts = [];
    var price = 0;
    for (var i = 0; i < n; i++) {
      price += (rand() - 0.47) * 9;
      pts.push(price);
    }
    var offset = (t * 14) % step;
    ctx.save();
    ctx.beginPath();
    ctx.rect(10, h * 0.12, w - 20, h * 0.78);
    ctx.clip();
    ctx.strokeStyle = rgba(C.violet, 0.55);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (var p = 0; p < pts.length; p++) {
      var px = 12 + p * step - offset;
      var py = base + pts[p];
      if (p === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    for (var c = 0; c < n; c++) {
      var x = 12 + c * step - offset;
      var open = base + pts[c] + 6;
      var close = base + pts[c] - 6 - (st.seed % 5);
      var up = close < open;
      var col = up ? C.cyan : C.rose;
      ctx.strokeStyle = rgba(col, 0.75);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + step / 2, Math.min(open, close) - 5);
      ctx.lineTo(x + step / 2, Math.max(open, close) + 5);
      ctx.stroke();
      ctx.fillStyle = rgba(col, up ? 0.55 : 0.5);
      ctx.fillRect(x + step * 0.25, Math.min(open, close), step * 0.5, Math.abs(close - open) || 2);
    }
    ctx.restore();
    label(ctx, "SNAPSHOT + DELTA", 12, h * 0.12, C.faint, 6.5);
    label(ctx, "STREAM", w - 12, h * 0.12, rgba(C.cyan, 0.8), 6.5, "right");
  }

  function apiFlow(ctx, w, h, t, st) {
    var x0 = w * 0.16;
    var x1 = w * 0.84;
    var rows = 4;
    for (var i = 0; i < rows; i++) {
      var y = h * 0.2 + i * (h * 0.18);
      ctx.strokeStyle = C.lineSoft;
      ctx.beginPath();
      ctx.moveTo(x0, y);
      ctx.lineTo(x1, y);
      ctx.stroke();
      var p = (t * 0.4 + i * 0.23) % 1;
      var dir = i % 2 === 0 ? 1 : -1;
      var px = dir === 1 ? x0 + (x1 - x0) * p : x1 - (x1 - x0) * p;
      dot(ctx, px, y, 2.4, dir === 1 ? C.violet : C.cyan);
      ctx.strokeStyle = rgba(dir === 1 ? C.violet : C.cyan, 0.4);
      ctx.beginPath();
      ctx.moveTo(px - dir * 14, y);
      ctx.lineTo(px, y);
      ctx.stroke();
      label(ctx, i % 2 === 0 ? "SIGNED" : "200 OK", x1 + 8, y, i % 2 === 0 ? C.faint : rgba(C.lime, 0.7), 5.5);
    }
    label(ctx, "CLIENT", x0, h * 0.86, C.faint, 6.5, "center");
    label(ctx, "GATEWAY", x1, h * 0.86, C.faint, 6.5, "center");
    ctx.strokeStyle = C.line;
    ctx.beginPath();
    ctx.moveTo(x0, h * 0.1);
    ctx.lineTo(x0, h * 0.9);
    ctx.moveTo(x1, h * 0.1);
    ctx.lineTo(x1, h * 0.9);
    ctx.stroke();
  }

  function admin(ctx, w, h, t, st) {
    var code = ["4", "8", "1", "5", "0", "2"];
    var bw = 18;
    var gap = 7;
    var total = code.length * bw + (code.length - 1) * gap;
    var x0 = (w - total) / 2;
    var y0 = h * 0.34;
    for (var i = 0; i < code.length; i++) {
      var slot = Math.floor(t / 6 + st.seed) % code.length;
      var ch = i === slot ? String((Math.floor(t * 2) + i) % 10) : code[i];
      roundRect(ctx, x0 + i * (bw + gap), y0, bw, h * 0.24, 4);
      ctx.fillStyle = "rgba(255,255,255,0.03)";
      ctx.fill();
      ctx.strokeStyle = i === slot ? rgba(C.cyan, 0.6) : C.line;
      ctx.stroke();
      label(ctx, ch, x0 + i * (bw + gap) + bw / 2, y0 + h * 0.12, i === slot ? C.cyan : C.ink, 10, "center");
    }
    label(ctx, "TOTP / MFA", w / 2, h * 0.2, C.faint, 6.5, "center");
    var p = 1 - ((t * 0.3 + st.seed) % 1);
    ctx.strokeStyle = C.lineSoft;
    ctx.beginPath();
    ctx.moveTo(w * 0.18, h * 0.76);
    ctx.lineTo(w * 0.82, h * 0.76);
    ctx.stroke();
    ctx.strokeStyle = p > 0.5 ? rgba(C.lime, 0.6) : rgba(C.amber, 0.6);
    ctx.beginPath();
    ctx.moveTo(w * 0.18, h * 0.76);
    ctx.lineTo(w * 0.18 + (w * 0.64) * p, h * 0.76);
    ctx.stroke();
    label(ctx, "AUDIT TRAIL", w * 0.18, h * 0.86, C.faint, 6);
    label(ctx, "VERIFIED", w * 0.82, h * 0.86, rgba(C.lime, 0.8), 6, "right");
  }

  function notify(ctx, w, h, t, st) {
    var hx = w * 0.18;
    var hy = h * 0.5;
    var targets = [
      { x: w * 0.78, y: h * 0.24, c: C.violet, n: "EMAIL" },
      { x: w * 0.84, y: h * 0.5, c: C.cyan, n: "SMS" },
      { x: w * 0.78, y: h * 0.76, c: C.lime, n: "WEBHOOK" }
    ];
    ctx.strokeStyle = C.line;
    ctx.beginPath();
    ctx.arc(hx, hy, 11, 0, Math.PI * 2);
    ctx.stroke();
    dot(ctx, hx, hy, 4, C.ink);
    for (var i = 0; i < targets.length; i++) {
      var tg = targets[i];
      ctx.strokeStyle = C.lineSoft;
      ctx.beginPath();
      ctx.moveTo(hx + 12, hy);
      ctx.quadraticCurveTo((hx + tg.x) / 2, hy, tg.x - 16, tg.y);
      ctx.stroke();
      for (var k = 0; k < 2; k++) {
        var p = (t * 0.35 + i * 0.21 + k * 0.5) % 1;
        var mx = hx + (tg.x - hx) * p;
        var my = hy + (tg.y - hy) * (p * p);
        dot(ctx, mx, my, 1.8, tg.c);
      }
      dot(ctx, tg.x, tg.y, 3, tg.c);
      label(ctx, tg.n, tg.x + 8, tg.y, C.faint, 5.5);
    }
    label(ctx, "FAN-OUT", hx, hy + 24, C.faint, 6, "center");
    label(ctx, "RECEIPTS", w * 0.78, h * 0.92, rgba(C.lime, 0.7), 6, "center");
  }

  function spot(ctx, w, h, t, st) {
    var cols = 12;
    var rows = 3;
    var cw = (w - 24) / cols;
    var ch = (h - 40) / rows;
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var v = 0.5 + 0.5 * Math.sin(t * 1.6 + c * 0.7 + r * 1.3 + st.seed);
        var up = (c + r) % 2 === 0;
        ctx.fillStyle = rgba(up ? C.cyan : C.rose, 0.05 + v * 0.22);
        ctx.fillRect(12 + c * cw, 8 + r * ch, cw - 3, ch - 4);
      }
    }
    label(ctx, "PRICE-TIME PRIORITY", 12, h - 8, C.faint, 6);
    var p = (t * 0.25) % 1;
    ctx.fillStyle = rgba(C.lime, 0.65);
    ctx.fillRect(12 + p * (w - 24), h - 14, 22, 2);
  }

  function perp(ctx, w, h, t, st) {
    var cx = w * 0.5;
    var maxH = h * 0.5;
    var n = 9;
    for (var i = 0; i < n; i++) {
      var v = 0.35 + 0.65 * Math.abs(Math.sin(t * 0.7 + i * 0.8 + st.seed));
      var bh = maxH * v;
      var x = 16 + i * ((w - 32) / n);
      var bw = (w - 32) / n - 5;
      if (i < n / 2) {
        ctx.fillStyle = rgba(C.cyan, 0.18 + v * 0.22);
        ctx.fillRect(x, cx - bh, bw, bh);
      } else {
        ctx.fillStyle = rgba(C.rose, 0.16 + v * 0.2);
        ctx.fillRect(x, cx, bw, bh);
      }
    }
    ctx.strokeStyle = C.line;
    ctx.beginPath();
    ctx.moveTo(12, cx);
    ctx.lineTo(w - 12, cx);
    ctx.stroke();
    ctx.strokeStyle = rgba(C.amber, 0.5);
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (var p = 0; p <= 40; p++) {
      var px = 12 + (p / 40) * (w - 24);
      var py = h * 0.18 + Math.sin(p * 0.3 + t * 0.9) * 6;
      if (p === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    label(ctx, "LONG", 14, cx - 8, rgba(C.cyan, 0.7), 6);
    label(ctx, "SHORT", w - 14, cx + 8, rgba(C.rose, 0.7), 6, "right");
    label(ctx, "FUNDING", w - 14, h * 0.14, rgba(C.amber, 0.7), 6, "right");
  }

  function options(ctx, w, h, t, st) {
    var k = w * 0.52;
    var base = h * 0.72;
    ctx.strokeStyle = C.line;
    ctx.beginPath();
    ctx.moveTo(14, h * 0.86);
    ctx.lineTo(w - 14, h * 0.86);
    ctx.stroke();
    ctx.strokeStyle = rgba(C.amber, 0.4);
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(k, h * 0.16);
    ctx.lineTo(k, h * 0.86);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle = C.violet;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    var prog = 0.35 + 0.65 * ((t * 0.12) % 1);
    for (var p = 0; p <= 40 * prog; p++) {
      var x = 14 + (p / 40) * (w - 28);
      var y = x < k ? base : base - (x - k) * 0.62;
      if (p === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    label(ctx, "STRIKE", k + 4, h * 0.2, rgba(C.amber, 0.8), 6);
    label(ctx, "PAYOFF", w - 14, h * 0.28, rgba(C.violet, 0.8), 6, "right");
    for (var i = 0; i < 4; i++) {
      ctx.fillStyle = rgba(C.violet, 0.12 + i * 0.04);
      ctx.fillRect(14 + i * 20, h * 0.12, 14, 5);
    }
  }

  function otc(ctx, w, h, t, st) {
    var p = (t * 0.2) % 1;
    for (var i = 0; i < 2; i++) {
      var x = w * 0.14 + i * (w * 0.38) + Math.sin(t * 0.6 + i) * 3;
      var y = h * 0.24 + i * h * 0.22;
      roundRect(ctx, x, y, w * 0.3, h * 0.3, 5);
      ctx.fillStyle = "rgba(255,255,255,0.03)";
      ctx.fill();
      ctx.strokeStyle = i === 0 ? rgba(C.cyan, 0.3) : rgba(C.violet, 0.3);
      ctx.stroke();
      label(ctx, i === 0 ? "BID" : "ASK", x + 8, y + 10, i === 0 ? C.cyan : C.violet, 6);
      label(ctx, i === 0 ? "BLOCK 250" : "BLOCK 250", x + 8, y + h * 0.22, C.faint, 6);
    }
    var mid = w * 0.52;
    ctx.strokeStyle = rgba(C.lime, 0.55 - Math.abs(0.5 - p));
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w * 0.46, h * 0.5);
    ctx.lineTo(w * 0.54, h * 0.5);
    ctx.stroke();
    label(ctx, "SETTLED", w / 2, h * 0.9, rgba(C.lime, 0.75), 6, "center");
    dot(ctx, mid, h * 0.5, 2, C.lime);
    label(ctx, "RFQ", w / 2, h * 0.12, C.faint, 6.5, "center");
  }

  var SCENES = {
    match: match,
    custody: custody,
    risk: risk,
    clearing: clearing,
    marketdata: marketdata,
    api: apiFlow,
    admin: admin,
    notify: notify,
    spot: spot,
    perp: perp,
    options: options,
    otc: otc
  };

  function draw(canvas, t) {
    var ctx = canvas.getContext("2d");
    var w = canvas.clientWidth;
    var h = canvas.clientHeight;
    if (!w || !h) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    var fn = SCENES[canvas.getAttribute("data-cap-scene")];
    if (!fn) return;
    var st = canvas.__state;
    if (!st) {
      st = canvas.__state = { seed: (parseInt(canvas.getAttribute("data-seed"), 10) || 1) * 1.7 };
    }
    fn(ctx, w, h, t * 0.001, st);
    canvas.__drawn = true;
  }

  var active = new Set();
  var running = false;
  var start = 0;

  function frame(ts) {
    if (!start) start = ts;
    active.forEach(function (canvas) {
      draw(canvas, reduceMotion ? 4200 : ts);
    });
    if (active.size && !reduceMotion) {
      requestAnimationFrame(frame);
    } else {
      running = false;
    }
  }

  function kick() {
    if (running || reduceMotion || !active.size) return;
    running = true;
    requestAnimationFrame(frame);
  }

  if (!("IntersectionObserver" in window) || reduceMotion) {
    canvases.forEach(function (c) {
      draw(c, 4200);
    });
    return;
  }

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          active.add(entry.target);
          draw(entry.target, 4000);
        } else {
          active.delete(entry.target);
        }
      });
      kick();
    },
    { rootMargin: "120px 0px", threshold: 0.05 }
  );

  canvases.forEach(function (c) {
    c.__state = { seed: (parseInt(c.getAttribute("data-seed"), 10) || 1) * 1.7 };
    io.observe(c);
  });

  /* Fast scrolling or layout shifts can skip the observer band; paint any
     undrawn scene that has come within a viewport of the fold. */
  var sweepQueued = false;
  function sweep() {
    if (sweepQueued) return;
    sweepQueued = true;
    requestAnimationFrame(function () {
      sweepQueued = false;
      canvases.forEach(function (c) {
        if (c.__drawn) return;
        var r = c.getBoundingClientRect();
        if (r.top < window.innerHeight + 160) {
          active.add(c);
          draw(c, 4000);
        }
      });
    });
  }
  window.addEventListener("scroll", sweep, { passive: true });
  if ("ResizeObserver" in window) {
    var ro = new ResizeObserver(sweep);
    canvases.forEach(function (c) { ro.observe(c); });
  }

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      active.forEach(function (c) {
        draw(c, 4200);
      });
    }, 160);
  });

  /* ---------- capability filters ---------- */
  var wall = document.querySelector("[data-capwall]");
  if (!wall) return;
  var filters = Array.prototype.slice.call(wall.querySelectorAll("[data-cap-filter]"));
  var cards = Array.prototype.slice.call(wall.querySelectorAll("[data-cap-group]"));
  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var group = btn.getAttribute("data-cap-filter");
      filters.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
      cards.forEach(function (card) {
        var show = group === "all" || card.getAttribute("data-cap-group") === group;
        card.classList.toggle("is-filtered", !show);
        if (show) card.removeAttribute("hidden");
        else card.setAttribute("hidden", "");
      });
      active.clear();
      canvases.forEach(function (c) {
        if (c.offsetParent !== null && c.closest("[data-cap-group]")) draw(c, 4200);
      });
    });
  });
})();
