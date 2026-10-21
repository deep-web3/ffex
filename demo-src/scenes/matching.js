/* ==========================================================================
   ffex demo · matching
   Order flow gateway → risk → matching core → ledger, price-time queue
   conveyor and structured event log. Generated demo events only.
   ========================================================================== */
(function () {
  "use strict";
  var Demo = window.Demo, TAU = Demo.TAU, D = 14;
  var STAGE_DT = 0.56;              // 25 events per loop
  var CYCLE = STAGE_DT * 5;         // 2.8 s → 5 order cycles per loop
  var EVENTS = Math.round(D / STAGE_DT); // 25
  var LOG_ROWS = 12;
  var BASE_SEC = 21 * 3600 + 42 * 60 + 10;

  var CYCLE_PRICES = [0.4, -0.6, 0.8, -0.2, 0.6];
  function orderFor(c) {
    var r = Demo.rng(3300 + c * 41);
    var price = 68480.4 + CYCLE_PRICES[c];
    return {
      side: c % 2 === 0 ? "BUY" : "SELL",
      price: Math.round(price * 10) / 10,
      qty: (0.02 + r() * 0.34).toFixed(4),
      id: "0x" + Demo.hex(3300 + c * 7, 4) + "…" + Demo.hex(3302 + c * 7, 3),
      maker: "0x" + Demo.hex(3400 + c * 5, 4) + "…" + Demo.hex(3402 + c * 5, 3),
      debit: "0x" + Demo.hex(3500 + c * 3, 4) + "…" + Demo.hex(3502 + c * 3, 2),
      credit: "0x" + Demo.hex(3600 + c * 3, 4) + "…" + Demo.hex(3602 + c * 3, 2)
    };
  }
  var ORDERS = [];
  for (var cc = 0; cc < 5; cc++) ORDERS.push(orderFor(cc));

  var STAGES = [
    { key: "gw", node: "GATEWAY", name: "ORDER ACCEPTED", detail: function (o) { return o.side + " " + o.qty + " BTC @ " + Demo.num(o.price, 1); } },
    { key: "rk", node: "RISK", name: "RISK PASS", detail: function () { return "margin · exposure · limits ok"; } },
    { key: "mt", node: "MATCHING CORE", name: "MATCH EXECUTED", detail: function (o) { return "maker " + o.maker + " · " + o.qty + " BTC"; } },
    { key: "lg", node: "LEDGER", name: "LEDGER POSTED", detail: function (o) { return "debit " + o.debit + " · credit " + o.credit; } },
    { key: "pb", node: "EVENT BUS", name: "EVENT PUBLISHED", detail: function () { return "event stream → async workers"; } }
  ];

  var stageIcons = [
    '<svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8h9M8 4l4 4-4 4"/></svg>',
    '<svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2l5 2v3.4c0 3.1-2.1 5.3-5 6.6-2.9-1.3-5-3.5-5-6.6V4z"/><path d="M5.8 7.9l1.5 1.5 3-3.1"/></svg>',
    '<svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5h10M3 8h10M3 11h6"/><circle cx="12" cy="11" r="1.6"/></svg>',
    '<svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="8" cy="4" rx="5" ry="2"/><path d="M3 4v8c0 1.1 2.2 2 5 2s5-.9 5-2V4M3 8c0 1.1 2.2 2 5 2s5-.9 5-2"/></svg>'
  ];
  var checkSvg = '<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5l3.2 3.2L13 4.8"/></svg>';

  /* ------------------------------------------------------------------- DOM */
  var stage = Demo.shell({
    product: "MATCHING",
    nav: ["Overview", "Order flow", "Order book", "Ledger"],
    active: 1,
    clock: "UTC+8 · DEMO"
  });

  var nodeHtml = "";
  for (var n = 0; n < 4; n++) {
    nodeHtml += '<div class="node" id="node' + n + '">' +
      '<div class="ntop"><span class="node-ico">' + stageIcons[n] + '</span><span class="node-state" id="ns' + n + '">READY</span></div>' +
      '<div class="node-name">' + ["GATEWAY", "RISK", "MATCHING CORE", "LEDGER"][n] + "</div>" +
      '<div class="node-sub">' + ["accept · validate", "pre-trade checks", "price-time match", "double-entry post"][n] + "</div>" +
      '<div class="node-q"><i id="nq' + n + '0"></i><i id="nq' + n + '1"></i><i id="nq' + n + '2"></i><span id="nqc' + n + '">QUEUE 2</span></div>' +
      "</div>";
  }

  var logRowsHtml = "";
  for (var lr = 0; lr < LOG_ROWS; lr++) {
    logRowsHtml += '<div class="log-row"><span class="lt"></span><span class="ln"><i></i><span class="lnl"></span></span><span class="le"></span><span class="ld"></span></div>';
  }

  var stepHtml = "";
  for (var s = 0; s < 5; s++) {
    stepHtml += '<div class="step" id="step' + s + '"><span class="sd"><i></i></span>' +
      '<div><div class="sn">' + STAGES[s].name + '</div><div class="ss">' + STAGES[s].node + '</div></div>' +
      '<span class="sp"></span><div class="sbar"><i id="sbar' + s + '" style="width:0%"></i></div></div>';
  }

  stage.innerHTML = [
    '<div class="scene-head">',
    '  <div class="left">',
    '    <span class="kicker">ORDER FLOW · LEDGER</span>',
    '    <span class="scene-title">Deterministic matching core</span>',
    '    <span class="scene-sub">Gateway → risk → matching → ledger · generated demo events</span>',
    '  </div>',
    '  <div class="right">',
    '    <span class="chip violet"><i></i>PRICE-TIME PRIORITY</span>',
    '    <span class="chip cyan"><i></i>SINGLE WRITER</span>',
    '  </div>',
    '</div>',
    '<div class="grid match-grid">',
    /* -------- left -------- */
    '  <div class="col left-col">',
    '    <div class="panel pipeline-panel">',
    '      <div class="panel-hd"><span class="panel-name">Order pipeline</span><span class="panel-aux"><span class="tag">SEQUENTIAL</span><span class="tag violet">DETERMINISTIC</span></span></div>',
    '      <div class="panel-bd"><div class="pipe-body">',
    '        <div class="nodes">' + nodeHtml + '</div>',
    '        <div class="rail"><div class="rail-line"></div><i class="dot v" id="pulse0"></i><i class="dot" id="pulse1"></i><i class="dot l" id="pulse2"></i><div class="rail-labels"><span>ACCEPT</span><span>RISK</span><span>MATCH</span><span>POST</span><span>PUBLISH</span></div></div>',
    '        <div class="pipe-foot"><span class="chip ghost">IN-MEMORY BOOK</span><span class="chip ghost">ATOMIC POST</span><span class="chip lime"><i></i>EVENT BUS</span></div>',
    '      </div></div>',
    '    </div>',
    '    <div class="panel log-panel">',
    '      <div class="panel-hd"><span class="panel-name">Event log</span><span class="panel-aux"><span class="tag lime">LIVE TAIL</span><span class="tag">STRUCTURED</span></span></div>',
    '      <div class="panel-bd"><div class="log-head"><span>Time</span><span>Component</span><span>Event</span><span>Detail</span></div>',
    '        <div class="log-body" id="logBody">' + logRowsHtml + '</div>',
    '      </div>',
    '    </div>',
    '  </div>',
    /* -------- middle -------- */
    '  <div class="col mid-col">',
    '    <div class="panel queue-panel">',
    '      <div class="panel-hd"><span class="panel-name">Price-time queue</span><span class="panel-aux"><span class="tag">AGG 0.10</span><span class="tag violet">FIFO</span></span></div>',
    '      <div class="panel-bd"><div class="queue-body">',
    '        <div class="q-head"><span>Price</span><span>Queue position · oldest first</span><span class="r">Seq</span></div>',
    '        <div id="askRows"></div>',
    '        <div class="q-spread"><span class="lbl">MID</span><span class="mid" id="qMid">68,480.4</span><span class="spr" id="qSpr">spread 0.20</span></div>',
    '        <div id="bidRows"></div>',
    '      </div></div>',
    '    </div>',
    '    <div class="panel match-panel">',
    '      <div class="panel-hd"><span class="panel-name">Match · ledger</span><span class="panel-aux"><span class="tag lime">ATOMIC POST</span></span></div>',
    '      <div class="panel-bd"><div class="match-body">',
    '        <div class="match-tiles">',
    '          <div class="m-tile buy" id="mBuy"><div class="m-side">TAKER · BUY</div><div class="m-id" id="mBuyId">0x9f3a…c21</div><div class="m-qty" id="mBuyQty">0.0420 BTC</div></div>',
    '          <div class="m-link"><svg viewBox="0 0 40 10" width="52" height="12" fill="none" stroke="currentColor" stroke-width="1.1"><path d="M2 5h30" stroke-dasharray="3 3"/><path d="M32 1.5L37 5l-5 3.5"/></svg><span class="lnk">MATCH</span><span class="px" id="mPrice">68,480.4</span></div>',
    '          <div class="m-tile sell" id="mSell"><div class="m-side">MAKER · SELL</div><div class="m-id" id="mSellId">0x41d8…9b0</div><div class="m-qty" id="mSellQty">0.0420 BTC</div></div>',
    '        </div>',
    '        <div class="m-summary"><span class="tag">PRICE-TIME PRIORITY</span><span>oldest resting order matched first</span></div>',
    '        <div class="ledger" id="ledgerBox">',
    '          <div class="lh"><span class="t">LEDGER POST · DOUBLE ENTRY</span><span style="margin-left:auto" class="tag amber">IDEMPOTENT</span></div>',
    '          <div class="le-row"><span class="tag2 d">DEBIT</span><span id="leDebit" style="color:#d8dbe8">0x7f3a…2c · USDT</span><span class="amt" id="leAmt1">2,876.01</span><span class="sym">USDT</span></div>',
    '          <div class="le-row"><span class="tag2 c">CREDIT</span><span id="leCredit" style="color:#d8dbe8">0x9b0e…41 · BTC</span><span class="amt" id="leAmt2">0.0420</span><span class="sym">BTC</span></div>',
    '          <div class="inv-row"><span class="chk" id="balChk">✓</span><span style="font:8.5px var(--mono);letter-spacing:.06em;color:#c9cddd">BALANCE CONSERVED</span><span style="margin-left:auto" class="tag lime">VERIFIED</span></div>',
    '        </div>',
    '      </div></div>',
    '    </div>',
    '  </div>',
    /* -------- right -------- */
    '  <div class="col right-col">',
    '    <div class="panel inv-panel">',
    '      <div class="panel-hd"><span class="panel-name">Invariants</span><span class="panel-aux"><span class="tag cyan">CHECKED</span></span></div>',
    '      <div class="panel-bd"><div class="inv-body">',
    '        <div class="inv-card" id="inv0"><span class="ic">' + checkSvg + '</span><div><div class="it">BALANCE CONSERVED</div><div class="is">Every ledger post keeps debit = credit.</div></div><span class="st" id="invSt0">HOLD</span></div>',
    '        <div class="inv-card" id="inv1"><span class="ic cy">' + checkSvg + '</span><div><div class="it">SINGLE WRITER</div><div class="is">One writer owns each order book.</div></div><span class="st" id="invSt1">HELD</span></div>',
    '        <div class="inv-card" id="inv2"><span class="ic vi">' + checkSvg + '</span><div><div class="it">IDEMPOTENT WRITE</div><div class="is">Replayed events never double-post.</div></div><span class="st" id="invSt2">SAFE</span></div>',
    '      </div></div>',
    '    </div>',
    '    <div class="panel life-panel">',
    '      <div class="panel-hd"><span class="panel-name">Order lifecycle</span><span class="panel-aux"><span class="tag">CYCLE 0042</span></span></div>',
    '      <div class="panel-bd"><div class="life-body">',
    '        <div class="life-order"><span class="k">ORDER</span><span class="v" id="lifeOrder">0x9f3a…c21</span></div>',
    '        <div class="steps">' + stepHtml + '</div>',
    '        <div class="pipe-foot" style="margin-top:auto"><span class="chip ghost">SEQ 0041</span><span class="chip violet"><i></i>STATE SYNCED</span></div>',
    '      </div></div>',
    '    </div>',
    '  </div>',
    '</div>'
  ].join("\n");

  function $(id) { return document.getElementById(id); }

  /* queue rows */
  var askRows = [], bidRows = [];
  (function () {
    function makeRows(host, cls) {
      var html = "";
      for (var i = 0; i < 4; i++) {
        html += '<div class="q-row ' + cls + '"><span class="qp"></span><div class="q-lane"><div class="q-block" style="left:0px">0x00</div><div class="q-block" style="left:60px">0x01</div><div class="q-block" style="left:120px">0x02</div><div class="q-block" style="left:180px">0x03</div></div><span class="q-seq"></span></div>';
      }
      host.innerHTML = html;
      return Array.prototype.slice.call(host.children);
    }
    askRows = makeRows($("askRows"), "ask");
    bidRows = makeRows($("bidRows"), "bid");
  })();

  var logRows = Array.prototype.slice.call($("logBody").children);
  var nodes = [0, 1, 2, 3].map(function (i) { return $("node" + i); });
  var nodeStates = [0, 1, 2, 3].map(function (i) { return $("ns" + i); });
  var nodeDots = [0, 1, 2, 3].map(function (i) { return [$("nq" + i + "0"), $("nq" + i + "1"), $("nq" + i + "2")]; });
  var steps = [0, 1, 2, 3, 4].map(function (i) { return $("step" + i); });
  var stepBars = [0, 1, 2, 3, 4].map(function (i) { return $("sbar" + i); });
  var pulses = [$("pulse0"), $("pulse1"), $("pulse2")];
  var busChip = document.querySelector(".pipe-foot .chip.lime");

  function stageAge(t, stageIdx) {
    var a = (t - stageIdx * STAGE_DT) % CYCLE;
    return a < 0 ? a + CYCLE : a;
  }
  function midPrice(t) {
    return 68480.4 + 2.2 * Demo.wave(t, 2) + 0.9 * Demo.wave(t, 5, 0.22);
  }
  function fmtPx(v) { return Demo.num(v, 1); }

  /* ------------------------------------------------------------------ draw */
  function draw(t) {
    /* ---- event timing ---- */
    var evIdx = Math.floor(t / STAGE_DT);
    var stageIdx = evIdx % 5;
    var cyc = Math.floor(evIdx / 5) % 5;
    var evAge = t - evIdx * STAGE_DT;
    var order = ORDERS[cyc];

    /* ---- pipeline nodes ---- */
    for (var n = 0; n < 4; n++) {
      var age = ((t - n * STAGE_DT) % CYCLE + CYCLE) % CYCLE;
      var nodeEl = nodes[n];
      var st = nodeStates[n];
      var active = age < 0.5;
      var done = age >= 0.5 && age < 2.35;
      nodeEl.className = "node" + (active ? " active" : done ? " done" : "");
      Demo.setText(st, active ? "ACTIVE" : done ? "DONE" : "READY");
      var qc = 1 + ((evIdx + n * 3) % 3);
      for (var qd = 0; qd < 3; qd++) {
        nodeDots[n][qd].className = qd < qc ? (n === 2 ? "cy" : "on") : "";
      }
      Demo.setText($("nqc" + n), "QUEUE " + qc);
    }

    if (busChip) {
      var busAge = stageAge(t, 4);
      busChip.style.boxShadow = busAge < 0.9 ? "0 0 " + (28 * (1 - busAge / 0.9)).toFixed(1) + "px rgba(200,255,98,.35)" : "";
      busChip.style.borderColor = busAge < 0.9 ? "rgba(200,255,98," + (0.28 + 0.4 * (1 - busAge / 0.9)).toFixed(2) + ")" : "";
    }

    /* ---- rail pulses ---- */
    var railW = 600 - 32 - 32;
    for (var p = 0; p < 3; p++) {
      var ph = Demo.loop(t, p * (CYCLE / 3), CYCLE) / CYCLE;
      pulses[p].style.left = (16 + ph * (railW + 6)).toFixed(1) + "px";
      pulses[p].style.opacity = (0.35 + 0.65 * Math.sin(Math.PI * Math.min(1, ph * 2))).toFixed(2);
    }

    /* ---- event log (continuous conveyor) ---- */
    var lifet = LOG_ROWS * STAGE_DT;
    var visible = [];
    for (var e = 0; e < EVENTS; e++) {
      var ag = Demo.age(t, e * STAGE_DT);
      if (ag < lifet) visible.push({ e: e, age: ag });
    }
    visible.sort(function (a, b) { return a.age - b.age; });
    for (var r = 0; r < LOG_ROWS; r++) {
      var row = logRows[r], item = visible[r];
      if (!item) { row.style.opacity = "0"; continue; }
      var si = item.e % 5, ci = Math.floor(item.e / 5) % 5, o = ORDERS[ci], sg = STAGES[si];
      var fadeIn = item.age < 0.1 ? Demo.smooth(item.age / 0.1) : 1;
      var fadeOut = item.age > (LOG_ROWS - 2.6) * STAGE_DT ? Math.max(0, 1 - (item.age - (LOG_ROWS - 2.6) * STAGE_DT) / (2.0 * STAGE_DT)) : 1;
      row.style.opacity = (fadeIn * fadeOut).toFixed(3);
      row.style.transform = "translate3d(0," + ((item.age / STAGE_DT) * 30 - 30).toFixed(2) + "px,0)";
      var vt = t - item.age;
      var ms = Math.floor((((vt % 1) + 1) % 1) * 1000);
      Demo.setText(row.children[0], Demo.hhmmss(BASE_SEC + vt) + "." + Demo.pad(ms, 3));
      row.children[1].children[0].className = sg.key;
      Demo.setText(row.children[1].children[1], sg.node);
      var evEl = row.children[2];
      evEl.className = "le " + sg.key;
      Demo.setText(evEl, sg.name);
      Demo.setText(row.children[3], sg.detail(o));
    }

    /* ---- queue conveyor ---- */
    var mid = midPrice(t);
    var bestAsk = Math.round((mid + 0.1) * 10) / 10;
    var bestBid = Math.round((mid - 0.1) * 10) / 10;
    Demo.setText($("qMid"), fmtPx(mid));
    Demo.setText($("qSpr"), "spread 0.20");

    function renderQueue(rows, isAsk) {
      for (var i = 0; i < rows.length; i++) {
        var rowEl = rows[i];
        var price = isAsk ? bestAsk + (rows.length - 1 - i) * 0.1 : bestBid - i * 0.1;
        rowEl.children[0].textContent = fmtPx(price);
        var lane = rowEl.children[1];
        lane.style.width = "";
        var lw = lane.clientWidth || 300;
        var laneW = lw;
        var off = (isAsk ? i : i + 4) * 0.31;
        var blocks = lane.children;
        var maxA = 0;
        for (var k = 0; k < blocks.length; k++) {
          var a = ((t - off) / CYCLE + k / 4) % 1;
          if (a < 0) a += 1;
          var x = laneW - 54 - a * (laneW - 54);
          var gen = Math.floor((t - off) / CYCLE + k / 4) % 5;
          if (gen < 0) gen += 5;
          blocks[k].style.left = x.toFixed(1) + "px";
          blocks[k].style.opacity = a < 0.03 ? (a / 0.03).toFixed(2) : "1";
          blocks[k].className = "q-block" + (a > 0.8 ? " front" : "");
          blocks[k].textContent = "0x" + Demo.pad(0x1a + k + gen * 3, 2);
          maxA = Math.max(maxA, a);
        }
        var flash = maxA > 0.965 ? 0.22 : maxA > 0.9 ? 0.1 : 0;
        rowEl.style.background = flash > 0
          ? (isAsk ? "rgba(255,180,92," + (flash * 0.55).toFixed(3) + ")" : "rgba(46,230,197," + (flash * 0.45).toFixed(3) + ")")
          : "transparent";
        rowEl.children[2].textContent = "Q" + (4 + ((evIdx + i) % 3));
      }
    }
    renderQueue(askRows, true);
    renderQueue(bidRows, false);

    /* ---- match / ledger highlight ---- */
    var matchAge = stageAge(t, 2);
    var ledgerAge = stageAge(t, 3);
    var lit = Math.max(0, 1 - matchAge / 0.8);
    var post = Math.max(0, 1 - ledgerAge / 1.1);
    $("mBuy").className = "m-tile buy" + (lit > 0.05 ? " lit" : "");
    $("mSell").className = "m-tile sell" + (lit > 0.05 ? " lit" : "");
    $("ledgerBox").style.boxShadow = "0 0 " + (26 * post).toFixed(1) + "px rgba(200,255,98," + (0.16 * post).toFixed(3) + ")";
    $("ledgerBox").style.borderColor = "rgba(200,255,98," + (0.07 + 0.3 * post).toFixed(3) + ")";
    $("balChk").className = "chk" + (post > 0.1 ? "" : " off");

    var o = order;
    Demo.setText($("mBuyId"), o.id);
    Demo.setText($("mBuyQty"), o.qty + " BTC");
    Demo.setText($("mSellId"), o.maker);
    Demo.setText($("mSellQty"), o.qty + " BTC");
    Demo.setText($("mPrice"), fmtPx(o.price));
    Demo.setText($("leDebit"), o.debit + " · USDT");
    Demo.setText($("leCredit"), o.credit + " · BTC");
    Demo.setText($("leAmt1"), Demo.num(o.price * Number(o.qty), 2));
    Demo.setText($("leAmt2"), o.qty);

    /* ---- invariants ---- */
    $("inv0").className = "inv-card" + (post > 0.1 ? " pulse" : "");
    $("inv2").className = "inv-card" + (post > 0.1 ? " pulse" : "");
    Demo.setText($("invSt0"), post > 0.1 ? "VERIFIED" : "HOLD");
    Demo.setText($("invSt2"), post > 0.1 ? "VERIFIED" : "SAFE");

    /* ---- lifecycle ---- */
    Demo.setText($("lifeOrder"), order.id);
    for (var si2 = 0; si2 < 5; si2++) {
      var stepEl = steps[si2];
      var cls = si2 < stageIdx ? "step done" : si2 === stageIdx ? "step on" : "step";
      if (stepEl.className !== cls) stepEl.className = cls;
      var pw = si2 < stageIdx ? 100 : si2 === stageIdx ? Math.min(100, (evAge / STAGE_DT) * 100) : 0;
      if (si2 === 0) pw = 100;
      stepBars[si2].style.width = pw.toFixed(1) + "%";
      Demo.setText(stepEl.children[2], si2 < stageIdx ? "DONE" : si2 === stageIdx ? "RUNNING" : "WAIT");
    }
  }

  Demo.mount(draw, { duration: D });
})();
