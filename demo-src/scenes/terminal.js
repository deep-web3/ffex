/* ==========================================================================
   ffex demo · terminal
   Spot / derivatives trading terminal. All numbers are generated demo data
   from a deterministic, 14 s periodic price function — no real market data.
   ========================================================================== */
(function () {
  "use strict";
  var Demo = window.Demo, TAU = Demo.TAU, D = 14;

  /* ------------------------------------------------------------- market data */
  var R = 1.5;            // candles per second (demo time-lapse)
  var PERIOD = 21;        // candles per loop = R * D
  var VISIBLE = 20;
  var P0 = 68420;
  var CANDLE_SAMPLES = 20;

  function price(t) {
    var u = t / D;
    return P0
      + 60 * Math.sin(TAU * 2 * u + 0.9)
      + 26 * Math.sin(TAU * 5 * u + 2.4)
      + 11 * Math.sin(TAU * 11 * u + 4.7)
      + 5 * Math.sin(TAU * 19 * u + 1.3);
  }
  function ethPrice(t) {
    var u = t / D;
    return 3842.1 + 26 * Math.sin(TAU * 3 * u + 1.1) + 9.5 * Math.sin(TAU * 8 * u + 0.4);
  }

  var candles = [];
  (function () {
    for (var k = 0; k < PERIOD; k++) {
      var t0 = k / R, dt = 1 / R, samples = [], hi = -1e9, lo = 1e9;
      for (var j = 0; j < CANDLE_SAMPLES; j++) {
        var v = price(t0 + dt * (j / (CANDLE_SAMPLES - 1)));
        samples.push(v); hi = Math.max(hi, v); lo = Math.min(lo, v);
      }
      var rnd = Demo.rng(9100 + k * 37);
      candles.push({
        o: samples[0], c: samples[CANDLE_SAMPLES - 1], hi: hi, lo: lo,
        samples: samples, vol: 2.2 + (hi - lo) * 0.11 + rnd() * 5.4
      });
    }
  })();
  function candleAt(j) { return candles[((j % PERIOD) + PERIOD) % PERIOD]; }
  function liveCandle(t) {
    var idx = Math.floor(t * R) % PERIOD;
    var f = t * R - Math.floor(t * R);
    var base = candles[idx];
    var n = Math.max(1, Math.round(f * (CANDLE_SAMPLES - 1)));
    var c = price(t), hi = base.o, lo = base.o;
    for (var j = 0; j <= n; j++) { hi = Math.max(hi, base.samples[j]); lo = Math.min(lo, base.samples[j]); }
    hi = Math.max(hi, c); lo = Math.min(lo, c);
    return { o: base.o, c: c, hi: hi, lo: lo, vol: base.vol * (0.3 + 0.7 * Math.max(f, 0.04)) };
  }

  var FILL_AT = 7.2;
  var FILL_PRICE = Math.round(price(FILL_AT) * 10) / 10;
  var POS_ENTRY = Math.round((price(0) - 22) * 10) / 10;
  var ETH_ENTRY = 3842.10;

  /* ------------------------------------------------------------------- DOM */
  var stage = Demo.shell({
    product: "TERMINAL",
    nav: ["Trade", "Markets", "Portfolio", "Earn"],
    active: 0,
    clock: "UTC+8 · DEMO"
  });

  stage.innerHTML = [
    '<div class="scene-head">',
    '  <div class="left">',
    '    <span class="kicker">SPOT · DERIVATIVES</span>',
    '    <span class="scene-title">Trading terminal</span>',
    '    <span class="scene-sub">Live order book, tape and positions · generated demo data</span>',
    '  </div>',
    '  <div class="right">',
    '    <span class="chip ghost">TICK 0.10</span>',
    '    <span class="chip cyan"><i></i>GENERATED FEED</span>',
    '  </div>',
    '</div>',
    '<div class="grid terminal-grid">',
    /* ---------------- left column ---------------- */
    '  <div class="col-left">',
    '    <div class="panel chart-panel">',
    '      <div class="panel-hd">',
    '        <span class="sym-badge">₿</span>',
    '        <span class="sym-name">BTC/USDT</span>',
    '        <span class="tag">SPOT</span>',
    '        <span class="seg" style="margin-left:6px">',
    '          <span class="on">1m</span><span>5m</span><span>15m</span><span>1H</span>',
    '        </span>',
    '        <div class="panel-aux">',
    '          <span class="tag violet">MA 7</span>',
    '          <span class="tag">VOL</span>',
    '          <span class="feed-chip"><i></i>STREAMING</span>',
    '        </div>',
    '      </div>',
    '      <div class="panel-bd">',
    '        <div class="chart-wrap"><canvas id="chart"></canvas></div>',
    '        <div class="chart-overlay">',
    '          <div class="px-block">',
    '            <div class="px-sym">BTC / USDT <em>· PERPETUAL</em></div>',
    '            <div class="px-big"><span class="val" id="bigPrice">68,420.0</span><span class="px-delta pos" id="bigDelta">+0.00%</span></div>',
    '            <div class="ohlc" id="ohlc"></div>',
    '          </div>',
    '          <div class="chart-aux"><span class="tag">DEMO FEED</span><span class="tag cyan">STREAM</span></div>',
    '          <div class="fill-toast" id="fillToast">',
    '            <div class="ft-icon">✓</div>',
    '            <div><div class="ft-title">Order filled</div><div class="ft-sub" id="fillSub">MARKET BUY 0.0420 BTC · spot</div></div>',
    '            <div class="ft-bar"><i id="fillBar"></i></div>',
    '          </div>',
    '        </div>',
    '      </div>',
    '    </div>',
    '    <div class="row-bottom">',
    /* order entry */
    '      <div class="panel order-panel">',
    '        <div class="panel-hd"><span class="panel-name">Order entry</span><span class="panel-aux"><span class="tag">LIMIT</span></span></div>',
    '        <div class="panel-bd"><div class="order-form">',
    '          <div class="buy-sell"><span class="buy">Buy</span><span class="sell">Sell</span></div>',
    '          <div class="ofields">',
    '            <div class="ofield"><label>Price</label><div class="field price"><span id="ordPrice">68,412.0</span><span class="suffix">USDT</span></div></div>',
    '            <div class="ofield"><label>Amount</label><div class="field"><span>0.0420</span><span class="suffix">BTC</span></div></div>',
    '          </div>',
    '          <div class="between" style="font:9px var(--mono);color:var(--faint)"><span>Avail 12.4820 BTC</span><span>Total <b style="color:#d8dbe8;font-weight:500" id="ordTotal">2,876.00 USDT</b></span></div>',
    '          <div class="pct-row"><span class="pct-lbl">25%</span>',
    '            <div class="pct-track"><div class="fill" style="width:62%"></div><div class="knob" style="left:62%"></div></div>',
    '            <span class="pct-lbl">50%</span><span class="pct-lbl">75%</span><span class="pct-lbl">MAX</span>',
    '          </div>',
    '          <div class="btn grad" id="buyBtn" style="height:31px;background:linear-gradient(100deg,#dcff9a,#c8ff62);color:#0d1405;box-shadow:0 8px 24px rgba(200,255,98,.22)">Buy BTC · 0.0420</div>',
    '          <div class="mini-note">Demo order · not submitted</div>',
    '        </div></div>',
    '      </div>',
    /* positions + open orders */
    '      <div class="panel pos-panel">',
    '        <div class="panel-hd"><span class="panel-name">Positions &amp; open orders</span><span class="panel-aux"><span class="tag">USDT-MARGINED</span><span class="tag cyan">CROSS</span></span></div>',
    '        <div class="panel-bd">',
    '          <div class="pos-table">',
    '            <div class="pos-row thead"><span>Symbol</span><span>Side</span><span>Size</span><span>Entry</span><span>Mark</span><span class="r">Unrealized PnL</span></div>',
    '            <div class="pos-row"><span style="color:#e6e8f2">BTC/USDT <span style="color:var(--faint);font-size:8px">PERP</span></span><span><span class="side-pill long">LONG</span></span><span>0.4200</span><span id="pos1Entry">68,382.4</span><span id="pos1Mark">68,420.0</span><span class="r" id="pos1Pnl">+15.79</span></div>',
    '            <div class="pos-row"><span style="color:#e6e8f2">ETH/USDT <span style="color:var(--faint);font-size:8px">PERP</span></span><span><span class="side-pill short">SHORT</span></span><span>2.8000</span><span>3,842.10</span><span id="pos2Mark">3,844.2</span><span class="r" id="pos2Pnl">-5.88</span></div>',
    '          </div>',
    '          <div class="ord-block">',
    '            <div class="ord-row thead"><span>Order</span><span>Side</span><span>Limit price</span><span>Amount</span><span>Filled</span><span class="st">Status</span></div>',
    '            <div class="ord-row"><span style="color:#c9cddd" id="ord1Id"></span><span style="color:var(--lime)">BUY</span><span>68,300.0</span><span>0.0420</span><span>0%</span><span class="st"><span class="tag">OPEN</span></span></div>',
    '            <div class="ord-row"><span style="color:#c9cddd">0x41d8…9b0</span><span style="color:var(--rose)">SELL</span><span>68,520.0</span><span>0.1200</span><span>0%</span><span class="st"><span class="tag">OPEN</span></span></div>',
    '            <div class="ord-row"><span style="color:#c9cddd">0x7c2e…4f7</span><span style="color:var(--lime)">BUY</span><span>68,310.0</span><span>0.3100</span><span>0%</span><span class="st"><span class="tag">OPEN</span></span></div>',
    '          </div>',
    '        </div>',
    '      </div>',
    '    </div>',
    '  </div>',
    /* ---------------- right column ---------------- */
    '  <div class="col-right" style="display:flex;flex-direction:column;gap:14px;min-height:0">',
    '    <div class="panel book-panel" style="height:366px;flex:none">',
    '      <div class="panel-hd"><span class="panel-name">Order book</span><span class="panel-aux"><span class="tag">AGG 0.10</span><span class="tag violet">PRICE-TIME</span></span></div>',
    '      <div class="panel-bd">',
    '        <div class="book-head"><span>Price (USDT)</span><span class="r">Size (BTC)</span></div>',
    '        <div id="askRows"></div>',
    '        <div class="spread">',
    '          <div><div class="sp-lbl">BEST BID</div><div class="sp-v up" id="bestBid">68,420.0</div></div>',
    '          <div class="mid"><span>MARK</span><span id="midPrice">68,420.0</span></div>',
    '          <div class="right"><div class="sp-lbl">BEST ASK</div><div class="sp-v down" id="bestAsk">68,420.2</div></div>',
    '        </div>',
    '        <div id="bidRows"></div>',
    '      </div>',
    '    </div>',
    '    <div class="panel tape-panel" style="height:196px;flex:none">',
    '      <div class="panel-hd"><span class="panel-name">Trade tape</span><span class="panel-aux"><span class="tag">BTC/USDT</span><span class="tag lime">LIVE</span></span></div>',
    '      <div class="panel-bd">',
    '        <div class="book-head" style="position:absolute;top:4px;left:0;right:0"><span>TIME · PRICE</span><span class="r">SIZE</span></div>',
    '        <div class="tape-body" id="tapeBody" style="top:20px"></div>',
    '      </div>',
    '    </div>',
    '    <div class="panel" style="height:166px;flex:none">',
    '      <div class="panel-hd"><span class="panel-name">Balances</span><span class="panel-aux"><span class="tag">DEMO ACCOUNT</span></span></div>',
    '      <div class="panel-bd" style="padding-top:8px">',
    '        <div class="bal-row"><span>Total equity</span><span class="v num" id="balEquity">129,486.20</span></div>',
    '        <div class="bal-row"><span>Unrealized PnL</span><span class="v lime num" id="balPnl">+9.91</span></div>',
    '        <div class="bal-row"><span>Available</span><span class="v num" id="balAvail">91,066.10</span></div>',
    '        <div class="margin-row">',
    '          <div class="lbl"><span>MARGIN USED</span><span id="marginPct">29.7%</span></div>',
    '          <div class="bar-track"><div class="bar-fill" id="marginBar" style="width:30%"></div></div>',
    '        </div>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</div>'
  ].join("\n");

  /* ------------------------------------------------------------------ refs */
  function $(id) { return document.getElementById(id); }
  var cvs = $("chart"), ctx = cvs.getContext("2d");
  var CW = 0, CH = 0;
  var PL, PR, PT, PB, VOL_T, VOL_B, STEP;
  function fit() {
    var r = cvs.parentElement.getBoundingClientRect();
    CW = Math.round(r.width); CH = Math.round(r.height);
    cvs.width = CW * 2; cvs.height = CH * 2;
    ctx.setTransform(2, 0, 0, 2, 0, 0);
    PL = 14; PR = CW - 56; PT = 84; PB = 326;
    VOL_T = 336; VOL_B = 388;
    STEP = (PR - PL) / VISIBLE;
  }
  fit();

  var MINP = 68310, MAXP = 68540;
  function py(v) { return PB - (v - MINP) / (MAXP - MINP) * (PB - PT); }

  /* order book rows */
  var askRows = [], bidRows = [];
  (function () {
    var html = "";
    for (var i = 0; i < 7; i++) html += '<div class="book-row ask"><span class="dep"></span><span class="p"></span><span class="s"></span></div>';
    $("askRows").innerHTML = html;
    html = "";
    for (var j = 0; j < 7; j++) html += '<div class="book-row bid"><span class="dep"></span><span class="p"></span><span class="s"></span></div>';
    $("bidRows").innerHTML = html;
    askRows = Array.prototype.slice.call($("askRows").children);
    bidRows = Array.prototype.slice.call($("bidRows").children);
  })();

  /* trade tape rows */
  var TAPE_EVENTS = 17, TAPE_INTERVAL = D / TAPE_EVENTS, TAPE_ROWS = 8;
  var tapeEvents = [];
  (function () {
    for (var n = 0; n < TAPE_EVENTS; n++) {
      var s = n * TAPE_INTERVAL;
      var rnd = Demo.rng(7300 + n * 13);
      var buy = rnd() > 0.44;
      tapeEvents.push({
        s: s, buy: buy,
        price: 0,
        jitter: (rnd() - 0.5) * 0.5,
        size: (0.02 + rnd() * 0.46).toFixed(4)
      });
    }
    var html = "";
    for (var i = 0; i < TAPE_ROWS; i++) html += '<div class="tape-row"><span class="tt"></span><span class="tp"><i></i><span class="tv"></span></span><span class="ts"></span></div>';
    $("tapeBody").innerHTML = html;
  })();
  var tapeRows = Array.prototype.slice.call($("tapeBody").children);
  var TAPE_BASE = 21 * 3600 + 42 * 60 + 10;

  function fmtPx(v) { return Demo.num(v, 1); }
  function fmtSize(v) {
    if (v >= 1000) return Demo.compact(v);
    if (v >= 100) return Demo.num(v, 1);
    return Demo.num(v, 2);
  }

  /* ------------------------------------------------------------------ draw */
  function draw(t) {
    /* ---------------- chart canvas ---------------- */
    ctx.clearRect(0, 0, CW, CH);
    var p = price(t);
    var scroll = t * R;
    var i = Math.floor(scroll);
    var live = liveCandle(t);

    /* grid */
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(255,255,255,0.045)";
    ctx.font = '9px "JetBrains Mono"';
    ctx.textBaseline = "middle";
    for (var v = 68320; v <= 68520; v += 40) {
      var gy = py(v);
      ctx.beginPath(); ctx.moveTo(PL, gy); ctx.lineTo(PR, gy); ctx.stroke();
      ctx.fillStyle = "rgba(120,126,150,0.65)";
      ctx.textAlign = "left";
      ctx.fillText(Demo.num(v, 0), PR + 9, gy);
    }
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    for (var gk = 0; gk <= 4; gk++) {
      var gx = PL + gk * (PR - PL) / 4;
      ctx.beginPath(); ctx.moveTo(gx, PT); ctx.lineTo(gx, PB); ctx.stroke();
    }
    var tl = ["−20m", "−15m", "−10m", "−5m", "NOW"];
    ctx.fillStyle = "rgba(110,116,140,0.6)";
    for (var tk = 0; tk < 5; tk++) {
      ctx.textAlign = tk === 0 ? "left" : tk === 4 ? "right" : "center";
      ctx.fillText(tl[tk], PL + tk * (PR - PL) / 4, 404);
    }

    /* volume */
    var volMax = 20;
    for (var jv = i - VISIBLE + 1; jv <= i; jv++) {
      var xv = PR - (scroll - jv + 0.5) * STEP;
      if (xv < PL - STEP || xv > PR + STEP) continue;
      var cv = jv === i ? live : candleAt(jv);
      var bh = Math.max(2, Math.min(1, cv.vol / volMax) * (VOL_B - VOL_T));
      var upv = cv.c >= cv.o;
      ctx.fillStyle = upv ? "rgba(200,255,98,0.26)" : "rgba(255,111,145,0.24)";
      ctx.fillRect(xv - STEP * 0.27, VOL_B - bh, STEP * 0.54, bh);
    }
    ctx.fillStyle = "rgba(110,116,140,0.55)";
    ctx.textAlign = "left";
    ctx.fillText("VOL  " + Demo.num(live.vol, 1) + " BTC", PL + 2, VOL_T - 8);

    /* candles */
    var curUp = live.c >= live.o;
    for (var j = i - VISIBLE + 1; j <= i; j++) {
      var x = PR - (scroll - j + 0.5) * STEP;
      if (x < PL - STEP || x > PR + STEP) continue;
      var c = j === i ? live : candleAt(j);
      var up = c.c >= c.o;
      var wick = up ? "rgba(200,255,98,0.55)" : "rgba(255,111,145,0.55)";
      var body = up ? "rgba(200,255,98,0.92)" : "rgba(255,111,145,0.9)";
      var bw = Math.max(6, STEP * 0.56);
      ctx.strokeStyle = wick;
      ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(x, py(c.hi)); ctx.lineTo(x, py(c.lo)); ctx.stroke();
      var yo = py(c.o), yc = py(c.c);
      var top = Math.min(yo, yc), hgt = Math.max(1.5, Math.abs(yc - yo));
      if (j === i) {
        ctx.shadowColor = up ? "rgba(200,255,98,0.45)" : "rgba(255,111,145,0.4)";
        ctx.shadowBlur = 10;
      }
      ctx.fillStyle = body;
      ctx.fillRect(x - bw / 2, top, bw, hgt);
      ctx.shadowBlur = 0;
    }

    /* MA 7 */
    var pts = [];
    for (var jm = i - VISIBLE; jm <= i; jm++) {
      var sum = 0;
      for (var q = 0; q < 7; q++) {
        sum += jm - q === i ? live.c : candleAt(jm - q).c;
      }
      pts.push([PR - (scroll - jm + 0.5) * STEP, py(sum / 7)]);
    }
    ctx.beginPath();
    for (var kp = 0; kp < pts.length; kp++) {
      if (kp === 0) ctx.moveTo(pts[kp][0], pts[kp][1]);
      else ctx.lineTo(pts[kp][0], pts[kp][1]);
    }
    ctx.strokeStyle = "rgba(139,108,255,0.85)";
    ctx.lineWidth = 1.7;
    ctx.shadowColor = "rgba(139,108,255,0.5)";
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.shadowBlur = 0;

    /* average entry line */
    ctx.setLineDash([3, 4]);
    ctx.strokeStyle = "rgba(139,108,255,0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(PL, py(POS_ENTRY)); ctx.lineTo(PR, py(POS_ENTRY)); ctx.stroke();
    ctx.fillStyle = "rgba(170,150,255,0.8)";
    ctx.textAlign = "left";
    ctx.font = '8.5px "JetBrains Mono"';
    ctx.fillText("AVG ENTRY " + Demo.num(POS_ENTRY, 1), PL + 3, py(POS_ENTRY) - 8);

    /* current price line */
    var pyNow = py(p);
    ctx.setLineDash([4, 5]);
    ctx.strokeStyle = curUp ? "rgba(200,255,98,0.5)" : "rgba(255,111,145,0.45)";
    ctx.beginPath(); ctx.moveTo(PL, pyNow); ctx.lineTo(PR + 4, pyNow); ctx.stroke();
    ctx.setLineDash([]);
    var tagTxt = fmtPx(p);
    ctx.font = '600 9.5px "JetBrains Mono"';
    var tw = ctx.measureText(tagTxt).width + 14;
    ctx.fillStyle = curUp ? "rgba(200,255,98,0.92)" : "rgba(255,111,145,0.92)";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(PR + 5, pyNow - 9, tw, 18, 4);
    else ctx.rect(PR + 5, pyNow - 9, tw, 18);
    ctx.fill();
    ctx.fillStyle = "#0a0c08";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(tagTxt, PR + 12, pyNow + 0.5);

    /* fill marker */
    var fa = Demo.age(t, FILL_AT);
    if (fa < 5.4) {
      var alpha = fa < 0.35 ? Demo.smooth(fa / 0.35) : fa > 4.6 ? 1 - Demo.smooth((fa - 4.6) / 0.8) : 1;
      ctx.globalAlpha = alpha;
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = "rgba(200,255,98,0.6)";
      ctx.beginPath(); ctx.moveTo(PL, py(FILL_PRICE)); ctx.lineTo(PR, py(FILL_PRICE)); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(220,255,160,0.9)";
      ctx.font = '8.5px "JetBrains Mono"';
      ctx.textAlign = "right";
      ctx.fillText("FILL " + Demo.num(FILL_PRICE, 1) + " · 0.0420 BTC", PR - 4, py(FILL_PRICE) - 8);
      ctx.globalAlpha = 1;
    }

    /* ---------------- overlay numbers ---------------- */
    Demo.setText($("bigPrice"), fmtPx(p));
    var chg = 1.4 + 2.1 * Math.sin(TAU * 2 * t / D + 2.0) + 0.7 * Math.sin(TAU * 5 * t / D + 0.4);
    var dEl = $("bigDelta");
    Demo.setText(dEl, (chg >= 0 ? "+" : "") + Demo.num(chg, 2) + "%");
    dEl.className = "px-delta " + (chg >= 0 ? "pos" : "neg");
    var lc = live;
    Demo.setHTML($("ohlc"),
      '<span>O <b>' + fmtPx(lc.o) + "</b></span><span>H <b>" + fmtPx(lc.hi) + "</b></span><span>L <b>" + fmtPx(lc.lo) + "</b></span><span>C <b>" + fmtPx(lc.c) + "</b></span>");

    /* ---------------- order book ---------------- */
    var mid = p;
    var bestBid = Math.floor((mid - 0.06) * 10) / 10;
    var bestAsk = bestBid + 0.2;
    var ASK_N = 7, BID_N = 7;
    var asks = [], bids = [];
    for (var a = 0; a < ASK_N; a++) {
      var sz = 0.22 + 2.6 * Math.abs(Math.sin(TAU * ((3 + a * 2) * t / D) + a * 1.7 + 0.6)) + 0.5 * Math.sin(TAU * ((5 + a) * t / D) + a * 0.5);
      asks.push({ price: bestAsk + a * 0.1, size: Math.max(0.06, sz) });
    }
    for (var b = 0; b < BID_N; b++) {
      var sz2 = 0.22 + 2.6 * Math.abs(Math.sin(TAU * ((4 + b * 2) * t / D) + b * 2.1 + 1.9)) + 0.5 * Math.sin(TAU * ((6 + b) * t / D) + b * 0.7);
      bids.push({ price: bestBid - b * 0.1, size: Math.max(0.06, sz2) });
    }
    var totA = 0, cumA = [];
    for (var aa = 0; aa < ASK_N; aa++) { totA += asks[aa].size; cumA.push(totA); }
    var totB = 0, cumB = [];
    for (var bb = 0; bb < BID_N; bb++) { totB += bids[bb].size; cumB.push(totB); }
    for (var ar = 0; ar < ASK_N; ar++) {
      var rowA = askRows[ar];
      var lvl = asks[ASK_N - 1 - ar];
      var cum = cumA[ASK_N - 1 - ar];
      var pEl = rowA.children[1], sEl = rowA.children[2], dep = rowA.children[0];
      Demo.setText(pEl, fmtPx(lvl.price));
      Demo.setText(sEl, Demo.num(lvl.size, 3));
      dep.style.width = (10 + (cum / totA) * 78).toFixed(1) + "%";
      rowA.classList.toggle("near", ar === ASK_N - 1);
    }
    for (var br = 0; br < BID_N; br++) {
      var rowB = bidRows[br];
      var lvlB = bids[br];
      var pElB = rowB.children[1], sElB = rowB.children[2], depB = rowB.children[0];
      Demo.setText(pElB, fmtPx(lvlB.price));
      Demo.setText(sElB, Demo.num(lvlB.size, 3));
      depB.style.width = (10 + (cumB[br] / totB) * 78).toFixed(1) + "%";
      rowB.classList.toggle("near", br === 0);
    }
    Demo.setText($("bestBid"), fmtPx(bestBid));
    Demo.setText($("bestAsk"), fmtPx(bestAsk));
    Demo.setText($("midPrice"), fmtPx(mid));
    Demo.setText($("ordPrice"), fmtPx(p));
    Demo.setText($("ordTotal"), Demo.num(p * 0.042, 2) + " USDT");

    /* ---------------- trade tape ---------------- */
    var visible = [];
    for (var e = 0; e < tapeEvents.length; e++) {
      var ag = Demo.age(t, tapeEvents[e].s);
      if (ag < TAPE_ROWS * TAPE_INTERVAL) visible.push({ ev: tapeEvents[e], age: ag });
    }
    visible.sort(function (x, y) { return x.age - y.age; });
    for (var tr = 0; tr < tapeRows.length; tr++) {
      var row = tapeRows[tr], item = visible[tr];
      if (!item) { row.style.opacity = "0"; continue; }
      var fadeIn = item.age < 0.12 ? Demo.smooth(item.age / 0.12) : 1;
      var fadeOut = item.age > (TAPE_ROWS - 2.9) * TAPE_INTERVAL
        ? Math.max(0, 1 - (item.age - (TAPE_ROWS - 2.9) * TAPE_INTERVAL) / (2.0 * TAPE_INTERVAL)) : 1;
      row.style.opacity = (fadeIn * fadeOut).toFixed(3);
      row.style.transform = "translate3d(0," + ((item.age / TAPE_INTERVAL) * 21 - 21).toFixed(2) + "px,0)";
      row.className = "tape-row " + (item.ev.buy ? "buy" : "sell");
      Demo.setText(row.children[0], Demo.hhmmss(TAPE_BASE + (t - item.age)));
      var tp = p + (item.ev.buy ? 0.15 : -0.15) + item.ev.jitter;
      Demo.setText(row.children[1].children[1], fmtPx(tp));
      Demo.setText(row.children[2], item.ev.size);
    }

    /* ---------------- positions & balances ---------------- */
    var eth = ethPrice(t);
    var pnl1 = (p - POS_ENTRY) * 0.42;
    var pnl2 = (ETH_ENTRY - eth) * 2.8;
    Demo.setText($("pos1Entry"), Demo.num(POS_ENTRY, 1));
    Demo.setText($("pos1Mark"), fmtPx(p));
    Demo.setText($("pos1Pnl"), (pnl1 >= 0 ? "+" : "") + Demo.num(pnl1, 2));
    $("pos1Pnl").style.color = pnl1 >= 0 ? "var(--lime)" : "var(--rose)";
    Demo.setText($("pos2Mark"), Demo.num(eth, 1));
    Demo.setText($("pos2Pnl"), (pnl2 >= 0 ? "+" : "") + Demo.num(pnl2, 2));
    $("pos2Pnl").style.color = pnl2 >= 0 ? "var(--lime)" : "var(--rose)";

    var equity = 129486.2 + pnl1 + pnl2;
    var marginUsed = 38420.5;
    var avail = equity - marginUsed;
    Demo.setText($("balEquity"), Demo.num(equity, 2));
    Demo.setText($("balPnl"), (pnl1 + pnl2 >= 0 ? "+" : "") + Demo.num(pnl1 + pnl2, 2));
    $("balPnl").style.color = pnl1 + pnl2 >= 0 ? "var(--lime)" : "var(--rose)";
    Demo.setText($("balAvail"), Demo.num(avail, 2));
    var mPct = marginUsed / equity * 100;
    Demo.setText($("marginPct"), Demo.num(mPct, 1) + "%");
    $("marginBar").style.width = mPct.toFixed(1) + "%";

    /* ---------------- order fill state ---------------- */
    var fillAge = Demo.age(t, FILL_AT);
    var toast = $("fillToast");
    var alpha = 0, ty = -8;
    if (fillAge < 2.8) {
      var inP = Demo.smooth(fillAge / 0.3);
      alpha = inP; ty = -8 * (1 - inP);
    } else if (fillAge < 3.6) {
      alpha = 1 - Demo.smooth((fillAge - 2.8) / 0.8);
    }
    toast.style.opacity = alpha.toFixed(3);
    toast.style.transform = "translate3d(0," + ty.toFixed(2) + "px,0)";
    $("fillBar").style.transform = "scaleX(" + Math.max(0, 1 - fillAge / 3.6).toFixed(3) + ")";

    var btn = $("buyBtn");
    if (fillAge < 1.6) {
      Demo.setText(btn, "Market buy filled ✓");
      btn.style.background = "linear-gradient(100deg,#f0ffcf,#d6ff8a)";
      btn.style.boxShadow = "0 0 34px rgba(200,255,98,.45)";
    } else {
      Demo.setText(btn, "Buy BTC · 0.0420");
      btn.style.background = "linear-gradient(100deg,#dcff9a,#c8ff62)";
      btn.style.boxShadow = "0 8px 24px rgba(200,255,98,.22)";
    }

  }

  /* --------------------------------------------------------------- bootstrap */
  $("ord1Id").textContent = "0x" + Demo.hex(4101, 4) + "…" + Demo.hex(4102, 3);
  $("fillSub").textContent = "MARKET BUY 0.0420 BTC @ " + Demo.num(FILL_PRICE, 1) + " · spot";
  Demo.mount(draw, { duration: D });
})();
