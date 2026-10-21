/* ==========================================================================
   ffex demo · trace
   Full-link observability console: trace tail, span waterfall, correlated
   structured logs and service graph. Generated demo traces only — no
   measured performance figures.
   ========================================================================== */
(function () {
  "use strict";
  var Demo = window.Demo, D = 14;
  var TRACE_CYCLE = D / 3;            // 3 selected traces per loop
  var LOG_EVENTS = 16, LOG_INTERVAL = D / LOG_EVENTS, LOG_ROWS = 8;
  var BASE_SEC = 21 * 3600 + 42 * 60 + 10;

  var SVC = {
    WEB: { c: "#8b6cff", label: "WEB" },
    WS: { c: "#2ee6c5", label: "WS" },
    GATEWAY: { c: "#8b6cff", label: "GATEWAY" },
    MATCHING: { c: "#c8ff62", label: "MATCHING" },
    LEDGER: { c: "#ffb45c", label: "LEDGER" },
    EVENTS: { c: "#ff6f91", label: "EVENTS" },
    WORKER: { c: "#2ee6c5", label: "WORKER" },
    MARKET: { c: "#c8ff62", label: "MARKET DATA" },
    RISK: { c: "#c8ff62", label: "RISK" },
    ADMIN: { c: "#8b6cff", label: "ADMIN" },
    CACHE: { c: "#ffb45c", label: "CACHE" }
  };
  var PROTO_COLOR = { HTTP: "#8b6cff", WS: "#2ee6c5", gRPC: "#2ee6c5", MySQL: "#ffb45c", REDIS: "#ffb45c", Kafka: "#ff6f91", CORE: "#c8ff62", WORKER: "#2ee6c5" };

  function span(svc, name, proto, indent, start, dur, attrs) {
    return { svc: svc, name: name, proto: proto, indent: indent, start: start, dur: dur, attrs: attrs };
  }

  var TRACES = [
    {
      id: "0x3f8a…c2e1", root: "POST /spot/order", time: "21:42:18.204", spans: [
        span("WEB", "POST /spot/order", "HTTP", 0, 0, 1, [["http.method", "POST"], ["route", "spot.order"], ["status", "200 OK"]]),
        span("GATEWAY", "auth + rate limit", "HTTP", 1, 0.05, 0.12, [["principal", "session 0x7e…"], ["result", "passed"]]),
        span("GATEWAY", "order.submit", "gRPC", 1, 0.2, 0.58, [["order", "BUY 0.0420 BTC"], ["venue", "spot"]]),
        span("RISK", "risk + reserve", "gRPC", 2, 0.26, 0.16, [["exposure", "within limit"], ["margin", "reserved"]]),
        span("MATCHING", "price-time match", "CORE", 2, 0.44, 0.2, [["book", "BTC/USDT"], ["queue", "oldest first"]]),
        span("LEDGER", "ledger.post", "MySQL", 2, 0.68, 0.14, [["entry", "double entry"], ["state", "committed"]]),
        span("EVENTS", "event.publish", "Kafka", 2, 0.84, 0.1, [["event", "order.filled"], ["consumers", "1 group"]]),
        span("WORKER", "async settlement", "WORKER", 1, 0.88, 0.12, [["task", "settle order"], ["result", "done"]])
      ]
    },
    {
      id: "0x77b1…90ad", root: "WS market.push", time: "21:42:16.881", spans: [
        span("WS", "WS market.push", "WS", 0, 0, 1, [["channel", "book.btc-usdt"], ["frames", "delta stream"]]),
        span("GATEWAY", "subscription.auth", "WS", 1, 0.04, 0.1, [["principal", "session 0x2c…"], ["result", "subscribed"]]),
        span("MARKET", "snapshot.build", "gRPC", 1, 0.18, 0.42, [["book", "BTC/USDT"], ["depth", "top levels"]]),
        span("CACHE", "cache.read", "REDIS", 2, 0.24, 0.1, [["key", "book snapshot"], ["result", "hit"]]),
        span("MARKET", "delta.apply", "CORE", 2, 0.4, 0.2, [["updates", "applied"], ["sequence", "kept"]]),
        span("WS", "frame.encode", "WS", 1, 0.64, 0.18, [["format", "binary frame"], ["result", "ok"]]),
        span("GATEWAY", "push.frame", "WS", 1, 0.72, 0.22, [["clients", "push fan-out"], ["result", "delivered"]]),
        span("WORKER", "audit.sink", "WORKER", 1, 0.9, 0.08, [["task", "audit append"], ["result", "done"]])
      ]
    },
    {
      id: "0x5d2c…4f17", root: "POST /wallet/withdraw", time: "21:42:14.552", spans: [
        span("WEB", "POST /wallet/withdraw", "HTTP", 0, 0, 1, [["http.method", "POST"], ["route", "wallet.withdraw"], ["status", "202 Accepted"]]),
        span("GATEWAY", "auth + 2FA check", "HTTP", 1, 0.05, 0.16, [["factor", "TOTP"], ["result", "verified"]]),
        span("ADMIN", "approval.verify", "gRPC", 1, 0.2, 0.3, [["reviewer", "risk desk"], ["decision", "approve"]]),
        span("RISK", "exposure.check", "gRPC", 2, 0.26, 0.18, [["limit", "within policy"], ["result", "pass"]]),
        span("LEDGER", "balance.reserve", "MySQL", 2, 0.5, 0.16, [["asset", "USDT"], ["state", "held"]]),
        span("LEDGER", "ledger.post", "MySQL", 2, 0.7, 0.14, [["entry", "double entry"], ["state", "committed"]]),
        span("EVENTS", "event.publish", "Kafka", 2, 0.86, 0.1, [["event", "withdraw.approved"], ["consumers", "1 group"]]),
        span("WORKER", "receipt.notify", "WORKER", 1, 0.9, 0.08, [["channel", "email + sms"], ["result", "queued"]])
      ]
    }
  ];

  var LIST_ROWS = [
    { id: "0x3f8a…c2e1", root: "POST /spot/order", time: "21:42:18.204", ok: true, spans: 8 },
    { id: "0x77b1…90ad", root: "WS market.push", time: "21:42:16.881", ok: true, spans: 8 },
    { id: "0x5d2c…4f17", root: "POST /wallet/withdraw", time: "21:42:14.552", ok: true, spans: 8 },
    { id: "0x9a40…71be", root: "POST /spot/cancel", time: "21:42:12.310", ok: true, spans: 6 },
    { id: "0x2e17…b8d3", root: "GET /market/mark-price", time: "21:42:10.905", ok: true, spans: 5 },
    { id: "0x8c93…15ea", root: "POST /admin/approve", time: "21:42:09.128", ok: true, spans: 7 },
    { id: "0x1b6f…d042", root: "WS order.events", time: "21:42:07.663", ok: true, spans: 6 }
  ];

  var LOG_TEMPLATES = [
    { lvl: "INFO", svc: "GATEWAY", msg: "order accepted · validation passed" },
    { lvl: "INFO", svc: "MATCHING", msg: "price-time queue updated · oldest first" },
    { lvl: "INFO", svc: "LEDGER", msg: "ledger post committed · debit = credit" },
    { lvl: "INFO", svc: "EVENTS", msg: "event published to stream · consumer group ack" },
    { lvl: "INFO", svc: "WORKER", msg: "async settlement completed" },
    { lvl: "DEBUG", svc: "GATEWAY", msg: "ws frame pushed · book.btc-usdt delta" },
    { lvl: "INFO", svc: "MATCHING", msg: "match executed · maker priority preserved" },
    { lvl: "WARN", svc: "WORKER", msg: "delivery retry scheduled · attempt 2" },
    { lvl: "DEBUG", svc: "RISK", msg: "exposure check recomputed · within policy" },
    { lvl: "INFO", svc: "WS", msg: "snapshot restored from cache · sequence kept" },
    { lvl: "INFO", svc: "GATEWAY", msg: "session refreshed · trace context propagated" },
    { lvl: "INFO", svc: "LEDGER", msg: "balance reserved · single writer held" },
    { lvl: "DEBUG", svc: "MATCHING", msg: "book state synced · invariant check passed" },
    { lvl: "INFO", svc: "ADMIN", msg: "withdrawal approved · audit entry written" },
    { lvl: "INFO", svc: "EVENTS", msg: "event delivered to async worker" },
    { lvl: "INFO", svc: "WORKER", msg: "receipt aggregated · channel status updated" }
  ];

  /* ------------------------------------------------------------------- DOM */
  var stage = Demo.shell({
    product: "OBSERVABILITY",
    nav: ["Overview", "Traces", "Logs", "Services"],
    active: 1,
    clock: "UTC+8 · DEMO"
  });

  var listHtml = "";
  LIST_ROWS.forEach(function (r, i) {
    var bars = "";
    var seed = Demo.rng(9100 + i * 17);
    for (var b = 0; b < 9; b++) {
      var w = 6 + Math.floor(seed() * 16);
      var c = ["#8b6cff", "#2ee6c5", "#c8ff62", "#ffb45c", "#ff6f91"][b % 5];
      bars += '<i style="width:' + w + 'px;background:' + c + ';opacity:.65"></i>';
    }
    listHtml += '<div class="trace-row' + (i === 0 ? " sel" : "") + '" id="trow' + i + '">' +
      '<div class="tr-top"><span class="tr-id">' + r.id + '</span><span class="chip ghost" style="height:17px;padding:0 6px;font-size:7px">OK</span><span class="tr-time">' + r.time + "</span></div>" +
      '<div class="tr-root">' + r.root + "</div>" +
      '<div class="tr-bars">' + bars + "<span style=\"margin-left:auto;font:7px var(--mono);color:var(--faint)\">" + r.spans + " spans</span></div>" +
      "</div>";
  });

  var wfRowsHtml = "";
  for (var w = 0; w < 8; w++) {
    wfRowsHtml += '<div class="span-row" id="span' + w + '"><span class="svc"><i class="sd2"></i><span class="svcn"></span></span><span class="nm"></span><span class="pr"></span><div class="bar-lane"><span class="bar"></span></div></div>';
  }

  var logRowsHtml = "";
  for (var g = 0; g < LOG_ROWS; g++) {
    logRowsHtml += '<div class="log-line"><span class="lt2"></span><span class="lv"></span><span class="lsvc"></span><span class="lmsg"></span><span class="lid"></span></div>';
  }

  stage.innerHTML = [
    '<div class="scene-head">',
    '  <div class="left">',
    '    <span class="kicker">FULL-LINK OBSERVABILITY</span>',
    '    <span class="scene-title">One trace, every hop</span>',
    '    <span class="scene-sub">HTTP → WebSocket → gRPC → matching → ledger → events · generated demo data</span>',
    '  </div>',
    '  <div class="right">',
    '    <span class="chip violet"><i></i>TRACE CONTEXT PROPAGATED</span>',
    '    <span class="chip cyan"><i></i>STRUCTURED LOGS</span>',
    '  </div>',
    '</div>',
    '<div class="grid trace-grid">',
    /* -------- left: trace list -------- */
    '  <div class="col">',
    '    <div class="panel list-panel">',
    '      <div class="panel-hd"><span class="panel-name">Recent traces</span><span class="panel-aux"><span class="tag lime">LIVE TAIL</span></span></div>',
    '      <div class="panel-bd" style="display:flex;flex-direction:column">',
    '        <div class="list-sum"><div><div class="k">TRACES / WINDOW</div><div class="v">1,284</div></div><div><div class="k">SERVICES</div><div class="v">08</div></div><div><div class="k">STATUS</div><div class="v" style="color:var(--lime)">OK</div></div></div>',
    '        <div>' + listHtml + '</div>',
    '        <div class="list-foot"><span class="chip ghost">SAMPLE 100%</span><span class="chip ghost">W3C CONTEXT</span><span class="chip ghost">SPAN LINKS</span></div>',
    '      </div>',
    '    </div>',
    '  </div>',
    /* -------- middle: waterfall + logs -------- */
    '  <div class="col">',
    '    <div class="panel wf-panel">',
    '      <div class="panel-hd"><span class="panel-name">Trace waterfall</span><span class="panel-aux"><span class="tag cyan">FULL-LINK</span><span class="tag">ROOT + CHILD SPANS</span></span></div>',
    '      <div class="panel-bd"><div class="wf-body" id="wfBody">',
    '        <div class="wf-top"><span class="tid" id="wfId">0x3f8a…c2e1</span><span class="tag violet">POST /spot/order</span><span class="tag lime">OK</span><span style="margin-left:auto" class="tag" id="wfCount">8 SPANS · 6 SERVICES</span></div>',
    '        <div class="wf-cols"><span>Service</span><span>Span</span><span>Protocol</span><span>Relative timeline</span></div>',
    '        <div style="position:relative">' + wfRowsHtml + '<div class="wf-playhead" id="playhead" style="left:0"></div></div>',
    '        <div class="wf-legend"><span class="lg">SPAN FLOW</span><span class="lg" style="color:#8b6cff">HTTP</span><span class="lg" style="color:#2ee6c5">WS / gRPC</span><span class="lg" style="color:#c8ff62">CORE</span><span class="lg" style="color:#ffb45c">MYSQL / CACHE</span><span class="lg" style="color:#ff6f91">KAFKA</span></div>',
    '      </div></div>',
    '    </div>',
    '    <div class="panel logs-panel">',
    '      <div class="panel-hd"><span class="panel-name">Correlated log stream</span><span class="panel-aux"><span class="tag violet">TRACE_ID · SPAN_ID</span><span class="tag cyan">JSON FIELDS</span></span></div>',
    '      <div class="panel-bd"><div class="logs-head"><span>Time</span><span>Level</span><span>Service</span><span>Message</span><span>trace / span</span></div>',
    '        <div class="logs-body" id="logBody">' + logRowsHtml + '</div>',
    '      </div>',
    '    </div>',
    '  </div>',
    /* -------- right: span detail + service graph -------- */
    '  <div class="col">',
    '    <div class="panel detail-panel">',
    '      <div class="panel-hd"><span class="panel-name">Span detail</span><span class="panel-aux"><span class="tag violet">SELECTED</span></span></div>',
    '      <div class="panel-bd"><div class="detail-body">',
    '        <div class="d-top"><span class="d-ico" id="dIco" style="color:#c8ff62;background:rgba(200,255,98,.12);border:1px solid rgba(200,255,98,.24)">M</span><div><div class="d-name" id="dName">price-time match</div><div class="d-svc" id="dSvc" style="margin-left:0">MATCHING · CORE</div></div><span class="tag lime" id="dStatus">OK</span></div>',
    '        <div class="d-ids">',
    '          <div class="d-idrow"><span class="k">trace_id</span><span class="v" id="dTrace">0x3f8a…c2e1</span></div>',
    '          <div class="d-idrow"><span class="k">span_id</span><span class="v" id="dSpan">0x9c1d…21a4</span></div>',
    '          <div class="d-idrow"><span class="k">parent_span</span><span class="v" id="dParent">0x4b0e…77c2</span></div>',
    '        </div>',
    '        <div class="d-attrs" id="dAttrs"></div>',
    '      </div></div>',
    '    </div>',
    '    <div class="panel graph-panel">',
    '      <div class="panel-hd"><span class="panel-name">Service graph</span><span class="panel-aux"><span class="tag lime">TRACE-AWARE</span></span></div>',
    '      <div class="panel-bd"><div class="graph-body">',
    '        <svg id="graph" width="300" height="268" viewBox="0 0 300 268"></svg>',
    '        <div class="graph-chips"><span class="chip ghost">HTTP</span><span class="chip ghost">WEBSOCKET</span><span class="chip ghost">gRPC</span><span class="chip ghost">MYSQL</span><span class="chip ghost">REDIS</span><span class="chip ghost">KAFKA</span><span class="chip ghost">ASYNC WORKER</span></div>',
    '      </div></div>',
    '    </div>',
    '  </div>',
    '</div>'
  ].join("\n");

  function $(id) { return document.getElementById(id); }

  /* waterfall rows */
  var spanRows = [];
  for (var sr = 0; sr < 8; sr++) {
    spanRows.push({
      el: $("span" + sr),
      svc: $("span" + sr).children[0],
      dot: $("span" + sr).children[0].children[0],
      svcn: $("span" + sr).children[0].children[1],
      nm: $("span" + sr).children[1],
      pr: $("span" + sr).children[2],
      lane: $("span" + sr).children[3],
      bar: $("span" + sr).children[3].children[0]
    });
  }
  var logRows = Array.prototype.slice.call($("logBody").children);

  /* trace list rows */
  var listRows = LIST_ROWS.map(function (r, i) { return $("trow" + i); });

  /* trace service graph */
  var NODES = [
    { id: "WEB", x: 48, y: 42 },
    { id: "WS", x: 48, y: 166 },
    { id: "GATEWAY", x: 146, y: 104 },
    { id: "MATCHING", x: 246, y: 42 },
    { id: "LEDGER", x: 246, y: 166 },
    { id: "EVENTS", x: 146, y: 222 },
    { id: "WORKER", x: 250, y: 248 }
  ];
  var EDGES = [
    ["WEB", "GATEWAY"], ["WS", "GATEWAY"], ["GATEWAY", "MATCHING"],
    ["GATEWAY", "LEDGER"], ["MATCHING", "EVENTS"], ["LEDGER", "EVENTS"], ["EVENTS", "WORKER"]
  ];
  var nodeById = {};
  NODES.forEach(function (n) { nodeById[n.id] = n; });
  var svgNS = "http://www.w3.org/2000/svg";
  var svg = $("graph");
  var pulses = [];
  (function buildGraph() {
    EDGES.forEach(function (e) {
      var a = nodeById[e[0]], b = nodeById[e[1]];
      var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 - 12;
      var d = "M" + a.x + " " + a.y + " Q" + mx + " " + my + " " + b.x + " " + b.y;
      var path = document.createElementNS(svgNS, "path");
      path.setAttribute("d", d);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "rgba(255,255,255,0.16)");
      path.setAttribute("stroke-width", "1");
      svg.appendChild(path);
      for (var k = 0; k < 2; k++) {
        var dot = document.createElementNS(svgNS, "circle");
        dot.setAttribute("r", "2.4");
        dot.setAttribute("fill", SVC[b.id].c);
        dot.setAttribute("opacity", "0.85");
        svg.appendChild(dot);
        pulses.push({ el: dot, path: path, len: path.getTotalLength ? path.getTotalLength() : 0, offset: (e[0].length * 0.13 + k * 0.5) });
      }
    });
    NODES.forEach(function (n) {
      var g = document.createElementNS(svgNS, "g");
      var rect = document.createElementNS(svgNS, "rect");
      rect.setAttribute("x", n.x - 33); rect.setAttribute("y", n.y - 11);
      rect.setAttribute("width", 66); rect.setAttribute("height", 22);
      rect.setAttribute("rx", 6);
      rect.setAttribute("fill", "rgba(12,15,26,0.9)");
      rect.setAttribute("stroke", SVC[n.id].c);
      rect.setAttribute("stroke-opacity", "0.35");
      g.appendChild(rect);
      var txt = document.createElementNS(svgNS, "text");
      txt.setAttribute("x", n.x); txt.setAttribute("y", n.y + 2.6);
      txt.setAttribute("text-anchor", "middle");
      txt.setAttribute("font-family", "JetBrains Mono");
      txt.setAttribute("font-size", "6.6");
      txt.setAttribute("letter-spacing", "0.06em");
      txt.setAttribute("fill", "#c9cede");
      txt.textContent = n.id;
      g.appendChild(txt);
      svg.appendChild(g);
      n.glow = rect;
    });
  })();

  var PLAY_CYCLE = 2.8;               // pulse travel time (divides the loop)

  function currentTrace(t) {
    var u = t - 0.6 + TRACE_CYCLE;
    var idx = Math.floor(u / TRACE_CYCLE) % TRACES.length;
    return { idx: idx, local: u % TRACE_CYCLE, trace: TRACES[idx] };
  }
  function hx(seed, len) { return Demo.hex(seed, len); }
  function fmtPx(v) { return Demo.num(v, 1); }

  function draw(t) {
    var cur = currentTrace(t);
    var trace = cur.trace, local = cur.local;
    var op = Math.min(1, Demo.smooth(local / 0.26), Demo.smooth((TRACE_CYCLE - local) / 0.3));
    var wfBody = $("wfBody");
    wfBody.style.opacity = op.toFixed(3);

    /* trace list selection */
    for (var tr = 0; tr < listRows.length; tr++) {
      var sel = tr === cur.idx;
      listRows[tr].className = "trace-row" + (sel ? " sel" : "");
    }

    /* waterfall header */
    Demo.setText($("wfId"), trace.id);
    $("wfBody").querySelector(".wf-top").children[1].textContent = trace.root;
    var svcCount = {};
    trace.spans.forEach(function (sp) { svcCount[sp.svc] = 1; });
    Demo.setText($("wfCount"), trace.spans.length + " SPANS · " + Object.keys(svcCount).length + " SERVICES");

    /* spans */
    var spanCount = trace.spans.length;
    for (var i = 0; i < 8; i++) {
      var row = spanRows[i], sp = trace.spans[i];
      if (!sp) { row.el.style.opacity = "0"; continue; }
      var reveal = 0.15 + i * 0.11;
      var grow = Demo.smooth((local - reveal) / 0.38);
      row.el.style.opacity = Math.min(1, grow * 2.5).toFixed(3);
      var svc = SVC[sp.svc];
      row.dot.style.background = svc.c;
      row.dot.style.boxShadow = "0 0 7px " + svc.c;
      Demo.setText(row.svcn, svc.label);
      row.nm.textContent = sp.name;
      row.nm.style.paddingLeft = sp.indent * 12 + "px";
      row.pr.textContent = sp.proto;
      row.pr.style.color = PROTO_COLOR[sp.proto] || "var(--faint)";
      var bar = row.bar;
      bar.className = "bar" + (sp.indent === 0 ? " root" : "");
      bar.style.left = (sp.start * 100).toFixed(2) + "%";
      bar.style.width = Math.max(0.4, (sp.dur * 100 * grow)).toFixed(2) + "%";
      bar.style.background = "linear-gradient(90deg," + svc.c + "cc," + svc.c + "55)";
      bar.style.boxShadow = "0 0 10px " + svc.c + "30";
    }

    /* playhead + selected span */
    var play = Demo.smooth((local - 0.5) / 2.6);
    var ph = $("playhead");
    var lane = spanRows[0].lane;
    var xs = lane.offsetLeft + 6;
    var laneW = lane.offsetWidth - 12;
    ph.style.left = (xs + play * laneW).toFixed(1) + "px";
    ph.style.opacity = (play > 0.01 ? 1 : 0).toFixed(2);

    var selIdx = Demo.clamp(Math.floor((local - 0.95) / 0.5), 0, spanCount - 1);
    for (var s2 = 0; s2 < spanCount; s2++) {
      spanRows[s2].el.className = "span-row" + (s2 === selIdx ? " sel" : "");
    }
    var spn = trace.spans[selIdx];
    Demo.setText($("dName"), spn.name);
    Demo.setText($("dSvc"), SVC[spn.svc].label + " · " + spn.proto);
    $("dIco").textContent = spn.svc.slice(0, 1);
    $("dIco").style.color = SVC[spn.svc].c;
    $("dIco").style.background = SVC[spn.svc].c + "1f";
    $("dIco").style.borderColor = SVC[spn.svc].c + "44";
    Demo.setText($("dTrace"), trace.id);
    Demo.setText($("dSpan"), "0x" + hx(700 + cur.idx * 11 + selIdx, 4) + "…" + hx(720 + cur.idx * 11 + selIdx, 4));
    Demo.setText($("dParent"), "0x" + hx(640 + cur.idx * 7, 4) + "…" + hx(660 + cur.idx * 7, 4));
    var attrsHtml = "";
    var extraAttrs = [["span.kind", spn.indent === 0 ? "server" : "internal"], ["sampled", "yes · full trace"], ["environment", "demo"], ["links", "1 parent · 2 children"]];
    for (var a = 0; a < spn.attrs.length; a++) {
      attrsHtml += '<div class="d-attr"><span class="k">' + Demo.esc(spn.attrs[a][0]) + '</span><span class="v">' + Demo.esc(spn.attrs[a][1]) + "</span></div>";
    }
    for (var xa = 0; xa < extraAttrs.length; xa++) {
      attrsHtml += '<div class="d-attr"><span class="k">' + Demo.esc(extraAttrs[xa][0]) + '</span><span class="v">' + Demo.esc(extraAttrs[xa][1]) + "</span></div>";
    }
    Demo.setHTML($("dAttrs"), attrsHtml);

    /* ---- correlated log stream ---- */
    var visible = [];
    for (var e = 0; e < LOG_EVENTS; e++) {
      var ag = Demo.age(t, e * LOG_INTERVAL);
      if (ag < LOG_ROWS * LOG_INTERVAL) visible.push({ e: e, age: ag });
    }
    visible.sort(function (x, y) { return x.age - y.age; });
    for (var r = 0; r < LOG_ROWS; r++) {
      var rowEl = logRows[r], item = visible[r];
      if (!item) { rowEl.style.opacity = "0"; continue; }
      var tmpl = LOG_TEMPLATES[item.e % LOG_TEMPLATES.length];
      var vtime = t - item.age;
      var ms = Math.floor((((vtime % 1) + 1) % 1) * 1000);
      var fadeIn = item.age < 0.08 ? Demo.smooth(item.age / 0.08) : 1;
      var fadeOut = item.age > (LOG_ROWS - 2.4) * LOG_INTERVAL ? Math.max(0, 1 - (item.age - (LOG_ROWS - 2.4) * LOG_INTERVAL) / (2.2 * LOG_INTERVAL)) : 1;
      rowEl.style.opacity = (fadeIn * fadeOut).toFixed(3);
      rowEl.style.transform = "translate3d(0," + ((item.age / LOG_INTERVAL) * 29 - 29).toFixed(2) + "px,0)";
      Demo.setText(rowEl.children[0], Demo.hhmmss(BASE_SEC + vtime) + "." + Demo.pad(ms, 3));
      var lv = rowEl.children[1];
      lv.className = "lv " + (tmpl.lvl === "WARN" ? "w" : tmpl.lvl === "DEBUG" ? "d" : "i");
      Demo.setText(lv, tmpl.lvl);
      Demo.setText(rowEl.children[2], tmpl.svc);
      Demo.setText(rowEl.children[3], tmpl.msg);
      var tid = TRACES[item.e % 3].id;
      Demo.setText(rowEl.children[4], "trace=" + tid + " span=0x" + hx(900 + item.e * 5, 4));
    }
    $("logBody").style.pointerEvents = "none";

    /* ---- service graph pulses ---- */
    for (var p = 0; p < pulses.length; p++) {
      var pu = pulses[p];
      if (!pu.len) continue;
      var prog = Demo.loop(t, pu.offset * 1.7, PLAY_CYCLE) / PLAY_CYCLE;
      var pt = pu.path.getPointAtLength(prog * pu.len);
      pu.el.setAttribute("cx", pt.x.toFixed(2));
      pu.el.setAttribute("cy", pt.y.toFixed(2));
      pu.el.setAttribute("opacity", (0.25 + 0.75 * Math.sin(Math.PI * prog)).toFixed(2));
    }
    /* node glow follows the selected trace services */
    var alias = { RISK: "MATCHING", ADMIN: "GATEWAY", CACHE: "LEDGER", MARKET: "MATCHING" };
    for (var n = 0; n < NODES.length; n++) {
      var node = NODES[n];
      var present = trace.spans.some(function (sp) { return (alias[sp.svc] || sp.svc) === node.id; });
      node.glow.setAttribute("stroke-opacity", present ? "0.75" : "0.2");
      node.glow.setAttribute("fill", present ? "rgba(21,25,42,0.96)" : "rgba(12,15,26,0.9)");
    }
  }

  Demo.mount(draw, { duration: D });
})();
