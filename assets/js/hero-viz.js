/* Hero console visual: a deterministic-ish demo market + trace + invariant stream.
   Decorative only (aria-hidden); pauses offscreen and under prefers-reduced-motion. */
(function () {
  "use strict";

  var root = document.querySelector("[data-hero-viz]");
  if (!root) return;

  var canvas = root.querySelector("[data-chart]");
  var priceEl = root.querySelector("[data-price]");
  var deltaEl = root.querySelector("[data-delta]");
  var bookEl = root.querySelector("[data-book]");
  var midEl = root.querySelector("[data-book-mid]");
  var tapeEl = root.querySelector("[data-tape]");
  var eventsEl = root.querySelector("[data-events]");
  var spansEl = root.querySelector("[data-trace-spans]");
  if (!canvas || !bookEl) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ctx = canvas.getContext("2d");
  var css = getComputedStyle(document.documentElement);
  var COLORS = {
    cyan: css.getPropertyValue("--cyan").trim() || "#2ee6c5",
    rose: css.getPropertyValue("--rose").trim() || "#ff6f91",
    violet: css.getPropertyValue("--violet").trim() || "#8b6cff",
    amber: css.getPropertyValue("--amber").trim() || "#ffb45c",
    lime: css.getPropertyValue("--lime").trim() || "#c8ff62",
    faint: css.getPropertyValue("--faint").trim() || "#7b83a6",
    grid: "rgba(158,168,212,0.08)"
  };

  var basePrice = 68420.5;
  var price = basePrice;
  var candles = [];
  var candleCount = 52;
  var tickCount = 0;
  var visible = true;
  var pageVisible = !document.hidden;
  var lastFrame = 0;
  var lastTick = 0;

  function randomWalk() {
    return (Math.random() - 0.48) * 42;
  }

  function seedCandles() {
    var p = 66200;
    for (var i = 0; i < candleCount; i += 1) {
      var open = p;
      p += randomWalk() * 3 + 26;
      var close = p;
      var high = Math.max(open, close) + Math.random() * 60;
      var low = Math.min(open, close) - Math.random() * 60;
      candles.push({ o: open, h: high, l: low, c: close });
    }
    var last = candles[candles.length - 1];
    price = last.c;
    basePrice = candles[0].o;
  }

  function money(value) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function formatSigned(value) {
    var sign = value >= 0 ? "+" : "";
    return sign + value.toFixed(2) + "%";
  }

  function drawChart(now) {
    var rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = Math.round(rect.width * dpr);
    var h = Math.round(rect.height * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var width = rect.width;
    var height = rect.height;
    ctx.clearRect(0, 0, width, height);

    var padTop = 10;
    var padBottom = 18;
    var padRight = 46;
    var chartW = width - padRight;
    var chartH = height - padTop - padBottom;

    var highs = candles.map(function (c) { return c.h; });
    var lows = candles.map(function (c) { return c.l; });
    var max = Math.max.apply(null, highs);
    var min = Math.min.apply(null, lows);
    var pad = (max - min) * 0.08 || 10;
    max += pad;
    min -= pad;
    var range = max - min || 1;
    var y = function (value) {
      return padTop + chartH - ((value - min) / range) * chartH;
    };

    // grid
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 1;
    for (var g = 0; g <= 4; g += 1) {
      var gy = padTop + (chartH / 4) * g;
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(chartW, gy);
      ctx.stroke();
    }
    for (var v = 0; v <= 5; v += 1) {
      var gx = (chartW / 5) * v;
      ctx.beginPath();
      ctx.moveTo(gx, padTop);
      ctx.lineTo(gx, padTop + chartH);
      ctx.stroke();
    }

    // axis labels
    ctx.fillStyle = COLORS.faint;
    ctx.font = '8px "JetBrains Mono", monospace';
    ctx.textAlign = "left";
    for (var a = 0; a <= 4; a += 1) {
      var level = max - (range / 4) * a;
      ctx.fillText(money(level), chartW + 6, padTop + (chartH / 4) * a + 3);
    }

    // volume
    var step = chartW / candles.length;
    var bodyW = Math.max(step * 0.52, 1.5);
    ctx.fillStyle = "rgba(158,168,212,0.15)";
    for (var i = 0; i < candles.length; i += 1) {
      var vol = 3 + Math.abs(candles[i].c - candles[i].o) * 0.12 + (i % 5);
      var vh = Math.min(vol, padBottom - 4);
      ctx.fillRect(i * step + step * 0.24, height - vh, bodyW, vh);
    }

    // candles
    for (var k = 0; k < candles.length; k += 1) {
      var cd = candles[k];
      var x = k * step + step / 2;
      var up = cd.c >= cd.o;
      var color = up ? COLORS.cyan : COLORS.rose;
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.moveTo(x, y(cd.h));
      ctx.lineTo(x, y(cd.l));
      ctx.stroke();
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = color;
      var top = y(Math.max(cd.o, cd.c));
      var bottom = y(Math.min(cd.o, cd.c));
      ctx.fillRect(x - bodyW / 2, top, bodyW, Math.max(bottom - top, 1.4));
      ctx.globalAlpha = 1;
    }

    // moving average
    ctx.beginPath();
    ctx.strokeStyle = COLORS.violet;
    ctx.lineWidth = 1.4;
    ctx.globalAlpha = 0.9;
    var windowSize = 7;
    for (var m = 0; m < candles.length; m += 1) {
      var start = Math.max(0, m - windowSize + 1);
      var sum = 0;
      for (var n = start; n <= m; n += 1) sum += candles[n].c;
      var avg = sum / (m - start + 1);
      var mx = m * step + step / 2;
      if (m === 0) ctx.moveTo(mx, y(avg));
      else ctx.lineTo(mx, y(avg));
    }
    ctx.stroke();
    ctx.globalAlpha = 1;

    // live price
    var lastX = chartW;
    var lastY = y(price);
    ctx.strokeStyle = "rgba(46,230,197,0.4)";
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.moveTo(0, lastY);
    ctx.lineTo(lastX, lastY);
    ctx.stroke();
    ctx.setLineDash([]);

    var pulse = reduceMotion ? 0 : (Math.sin(now / 420) + 1) / 2;
    ctx.fillStyle = "rgba(46,230,197," + (0.28 + pulse * 0.4) + ")";
    ctx.beginPath();
    ctx.arc(lastX - 2, lastY, 5 + pulse * 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLORS.cyan;
    ctx.beginPath();
    ctx.arc(lastX - 2, lastY, 2.4, 0, Math.PI * 2);
    ctx.fill();
  }

  function renderBook() {
    var spread = 0.9 + Math.random() * 1.4;
    var rows = [];
    for (var a = 4; a >= 1; a -= 1) {
      var ask = price + spread + a * (0.6 + Math.random() * 0.8);
      rows.push(
        '<div class="console__book-row"><span>' + money(ask) +
          "</span><span>" + (0.2 + Math.random() * 2).toFixed(3) +
          '</span><i style="--w:' + (18 + Math.random() * 74).toFixed(0) + '%"></i></div>'
      );
    }
    rows.push(
      '<div class="console__book-row console__book-row--mid"><span>' + money(price) +
        "</span><span>SPREAD</span><i></i></div>"
    );
    for (var b = 1; b <= 4; b += 1) {
      var bid = price - spread - b * (0.6 + Math.random() * 0.8);
      rows.push(
        '<div class="console__book-row console__book-row--bid"><span>' + money(bid) +
          "</span><span>" + (0.2 + Math.random() * 2).toFixed(3) +
          '</span><i style="--w:' + (18 + Math.random() * 74).toFixed(0) + '%"></i></div>'
      );
    }
    bookEl.innerHTML = rows.join("");
    if (midEl) midEl.textContent = money(price);
  }

  function renderTape() {
    var html = "";
    for (var i = 0; i < 4; i += 1) {
      var side = Math.random() > 0.5 ? "BUY" : "SELL";
      var tradePrice = price + (Math.random() - 0.5) * 6;
      html +=
        '<div class="console__tape-row"><b>' + money(tradePrice) +
        "</b><span>" + (0.004 + Math.random() * 0.8).toFixed(3) + " BTC</span>" +
        '<span class="' + (side === "BUY" ? "up" : "down") + '">' + side + "</span></div>";
    }
    tapeEl.innerHTML = html;
  }

  var eventIndex = 0;
  var eventTemplates = [
    ['dot--cyan', "ORDER ACCEPTED", "0x8f2a"],
    ['dot--violet', "RISK PASS", "0x8f2a"],
    ['dot--lime', "MATCHED", "0.842 BTC"],
    ['dot--amber', "LEDGER POSTED", "OK"],
    ['dot--cyan', "EVENT PUBLISHED", "KAFKA"],
    ['dot--lime', "CHECK PASSED", "IDEMPOTENT"]
  ];

  function rotateEvents() {
    var html = "";
    for (var i = 0; i < 4; i += 1) {
      var t = eventTemplates[(eventIndex + i) % eventTemplates.length];
      html +=
        '<div class="console__event' + (i === 0 ? " is-fresh" : "") +
        '"><i class="dot ' + t[0] + '"></i><span>' + t[1] + "</span><b>" + t[2] + "</b></div>";
    }
    eventsEl.innerHTML = html;
    eventIndex = (eventIndex + 1) % eventTemplates.length;
  }

  function updateSpans() {
    if (!spansEl) return;
    Array.prototype.slice.call(spansEl.querySelectorAll("i")).forEach(function (bar) {
      bar.style.setProperty("--w", (24 + Math.random() * 74).toFixed(0) + "%");
    });
  }

  function updatePriceLabels() {
    var delta = ((price - basePrice) / basePrice) * 100;
    if (priceEl) priceEl.textContent = money(price);
    if (deltaEl) {
      deltaEl.textContent = formatSigned(delta);
      deltaEl.style.color = delta >= 0 ? COLORS.cyan : COLORS.rose;
    }
  }

  function tick() {
    tickCount += 1;
    price += randomWalk() * 0.32;
    var last = candles[candles.length - 1];
    last.c = price;
    last.h = Math.max(last.h, price);
    last.l = Math.min(last.l, price);
    if (tickCount % 9 === 0) {
      candles.push({ o: price, h: price, l: price, c: price });
      candles.shift();
    }
    updatePriceLabels();
    if (tickCount % 2 === 0) renderBook();
    if (tickCount % 3 === 0) renderTape();
    if (tickCount % 7 === 0) rotateEvents();
    if (tickCount % 11 === 0) updateSpans();
  }

  function frame(now) {
    requestAnimationFrame(frame);
    if (!visible || !pageVisible) return;
    if (!lastTick) lastTick = now;
    if (now - lastTick > 280) {
      tick();
      lastTick = now;
    }
    if (now - lastFrame > 32) {
      drawChart(now);
      lastFrame = now;
    }
  }

  seedCandles();
  updatePriceLabels();
  renderBook();
  renderTape();
  rotateEvents();
  updateSpans();
  drawChart(0);

  if (reduceMotion) {
    return;
  }

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      function (entries) {
        visible = entries[0].isIntersecting;
      },
      { threshold: 0.05 }
    ).observe(root);
  }
  document.addEventListener("visibilitychange", function () {
    pageVisible = !document.hidden;
  });
  if ("ResizeObserver" in window) {
    new ResizeObserver(function () {
      drawChart(performance.now());
    }).observe(canvas);
  }
  requestAnimationFrame(frame);
})();
