/* ==========================================================================
   ffex demo · notify
   Notification platform: message intake, template plan, delivery routes with
   retry / UNKNOWN reconciliation and receipt aggregation. Generated demo data.
   ========================================================================== */
(function () {
  "use strict";
  var Demo = window.Demo, TAU = Demo.TAU, D = 14;
  var CYCLE = 2.8;                    // 5 messages per loop
  var BASE_SEC = 21 * 3600 + 42 * 60 + 10;
  var EV_INTERVAL = D / 16, EV_ROWS = 8;

  function wave(t, k, ph) { return Math.sin(TAU * (k * t / D + ph)); }

  var CH = {
    EMAIL: { cls: "email", color: "#8b6cff", icon: '<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="3.5" width="12" height="9" rx="2"/><path d="M2.5 5l5.5 4 5.5-4"/></svg>' },
    SMS: { cls: "sms", color: "#2ee6c5", icon: '<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 3.5h10v7H8l-3 2.5v-2.5H3z"/></svg>' },
    FEISHU: { cls: "feishu", color: "#c8ff62", icon: '<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M2 12.5L13.5 2.5M6 2.5l7.5 1v7.5M2.5 8l5.5 5.5"/></svg>' }
  };
  var CH_LIST = ["EMAIL", "SMS", "FEISHU"];

  var MSG_DATA = [
    { ch: "EMAIL", to: "user 0x7f3a…2c91", amt: "24,800.00", asset: "USDT", ref: "0x9f3a…c21", net: "TRC-20" },
    { ch: "SMS", to: "+65 8••• 42", amt: "8,420.00", asset: "USDT", ref: "0x41d8…9b0", net: "ERC-20" },
    { ch: "FEISHU", to: "risk desk · ops channel", amt: "24,800.00", asset: "USDT", ref: "0x9f3a…c21", net: "TRC-20" },
    { ch: "EMAIL", to: "user 0x2b8e…71", amt: "0.8610", asset: "BTC", ref: "0x7c2e…4f7", net: "BTC" },
    { ch: "SMS", to: "+86 138•••• 07", amt: "63,180.00", asset: "USDT", ref: "0x5a91…e03", net: "BEP-20" }
  ];

  var TPL = {
    EMAIL: { title: "EMAIL · RICH TEMPLATE", subject: "Your withdrawal is confirmed", body: "Hi — your withdrawal of <b>{amt} {asset}</b> has been approved and is on its way. Ref <b>{ref}</b>.", render: "template · withdrawal.receipt · v3" },
    SMS: { title: "SMS · SHORT TEMPLATE", subject: "ffex: withdrawal confirmed", body: "<b>{amt} {asset}</b> confirmed. Ref {ref}. Not you? Contact support.", render: "template · short.receipt · v2" },
    FEISHU: { title: "FEISHU · CARD TEMPLATE", subject: "Withdrawal approved · risk desk", body: "Amount <b>{amt} {asset}</b> · network {net} · ref {ref}", render: "template · ops.card · v2" }
  };

  var EVENTS = [
    { ch: "EMAIL", msg: "delivered · receipt stored", id: "msg 0x3f8a" },
    { ch: "SMS", msg: "retry scheduled · attempt 2", id: "msg 0x77b1" },
    { ch: "FEISHU", msg: "unknown receipt · reconcile queued", id: "msg 0x5d2c" },
    { ch: "FEISHU", msg: "reconciled · delivery confirmed", id: "msg 0x5d2c" },
    { ch: "EMAIL", msg: "receipt aggregated · channel total updated", id: "msg 0x9a40" },
    { ch: "SMS", msg: "delivered · attempt 2 succeeded", id: "msg 0x77b1" },
    { ch: "EMAIL", msg: "template plan resolved · 1 variant", id: "msg 0x2e17" },
    { ch: "SMS", msg: "queued · provider accepted", id: "msg 0x8c93" },
    { ch: "FEISHU", msg: "receipt aggregated · ops channel", id: "msg 0x1b6f" },
    { ch: "EMAIL", msg: "delivered · receipt stored", id: "msg 0x4b0e" },
    { ch: "SMS", msg: "unknown receipt · retry window open", id: "msg 0x6a52" },
    { ch: "FEISHU", msg: "reconciled · no duplicate send", id: "msg 0x2d17" },
    { ch: "EMAIL", msg: "bounce suppressed · address verified", id: "msg 0x71c8" },
    { ch: "SMS", msg: "delivered · receipt stored", id: "msg 0x6a52" },
    { ch: "FEISHU", msg: "aggregated · receipt window closed", id: "msg 0x9f0d" },
    { ch: "EMAIL", msg: "aggregated · receipt window closed", id: "msg 0x4b0e" }
  ];

  /* ------------------------------------------------------------------- DOM */
  var stage = Demo.shell({
    product: "NOTIFY",
    nav: ["Overview", "Messages", "Channels", "Receipts"],
    active: 1,
    clock: "UTC+8 · DEMO"
  });

  var routeRowsHtml = "";
  CH_LIST.forEach(function (ch, i) {
    var nodes = ch === "EMAIL" ? ["QUEUED", "SENT", "DELIVERED"] : ch === "SMS" ? ["QUEUED", "SENT", "RETRY", "DELIVERED"] : ["QUEUED", "SENT", "UNKNOWN", "RECONCILED"];
    var nodeHtml = "";
    nodes.forEach(function (n, k) {
      var pos = (k / (nodes.length - 1)) * 100;
      nodeHtml += '<i class="lane-node" id="node' + i + "_" + k + '" style="left:calc(' + pos + '% - 4.5px)"></i>';
    });
    var labels = nodes.map(function (n) { return n; }).join(" · ");
    routeRowsHtml += '<div class="route-row">' +
      '<div class="route-id"><span class="ch-badge ' + CH[ch].cls + '">' + CH[ch].icon + "</span><div><div class=\"rch\">" + ch + '</div><div class="raddr" id="raddr' + i + '">masked · provider route</div></div></div>' +
      '<div class="lane"><div style="position:absolute;left:0;right:0;top:0;display:flex;justify-content:space-between;font:6px var(--mono);letter-spacing:.1em;color:var(--faint)">' + nodes.map(function (n) { return "<span>" + n + "</span>"; }).join("") + "</div>" +
      '<div class="lane-track"></div>' + nodeHtml + '<div class="packet" id="pkt' + i + '" style="left:0"></div></div>' +
      '<div class="route-state"><span id="rst' + i + '"></span><span class="rid2" id="rrc' + i + '">receipt 0x0000</span></div>' +
      "</div>";
  });

  var aggRowsHtml = "";
  ["DELIVERED", "PENDING", "RETRY", "UNKNOWN"].forEach(function (s, i) {
    aggRowsHtml += '<div class="agg-row"><span class="ar-k"><span class="dot ' + (i === 0 ? "lime" : i === 1 ? "cyan" : i === 2 ? "amber" : "rose") + '"></span>' + s + '</span><span class="ar-n" id="aggN' + i + '">0</span><div class="bar-track"><div class="bar-fill ' + (i === 0 ? "lime" : i === 2 ? "rose" : "") + '" id="aggB' + i + '" style="width:0%"></div></div></div>';
  });

  var chRowsHtml = "";
  CH_LIST.forEach(function (ch, i) {
    chRowsHtml += '<div class="agg-row"><span class="ar-k" style="color:' + CH[ch].color + '">' + ch + '</span><span class="ar-n" id="chnN' + i + '">0</span><div class="bar-track"><div class="bar-fill" id="chnB' + i + '" style="width:0%;background:linear-gradient(90deg,' + CH[ch].color + '99,' + CH[ch].color + '44)"></div></div></div>';
  });

  var evRowsHtml = "";
  for (var er = 0; er < EV_ROWS; er++) evRowsHtml += '<div class="ev-row"><span class="et"></span><span class="ech"></span><span class="lvl2"></span><span class="emsg"></span><span class="eid"></span></div>';

  stage.innerHTML = [
    '<div class="scene-head">',
    '  <div class="left">',
    '    <span class="kicker">MULTI-CHANNEL · DELIVERY</span>',
    '    <span class="scene-title">Notifications that settle</span>',
    '    <span class="scene-sub">Template plan, delivery routes, receipts &amp; reconciliation · generated demo data</span>',
    '  </div>',
    '  <div class="right">',
    '    <span class="chip cyan"><i></i>AT-LEAST-ONCE</span>',
    '    <span class="chip lime"><i></i>RECEIPT RECONCILIATION</span>',
    '  </div>',
    '</div>',
    '<div class="grid notify-grid">',
    '  <div class="nrow1">',
    /* message in */
    '    <div class="panel">',
    '      <div class="panel-hd"><span class="panel-name">Message in</span><span class="panel-aux"><span class="tag lime">ACCEPTED</span></span></div>',
    '      <div class="panel-bd"><div class="msg-body">',
    '        <div class="msg-card" id="msgCard">',
    '          <div class="mc-top"><span class="ch-badge email" id="msgBadge">' + CH.EMAIL.icon + '</span><span class="mc-tt" id="msgTitle">EMAIL · WITHDRAWAL RECEIPT</span><span class="mc-time" id="msgTime">21:42:10</span></div>',
    '          <div class="mc-sub" id="msgSub">to user 0x7f3a…2c91 · template withdrawal.receipt</div>',
    '          <div class="mc-amt"><span id="msgAmtV">24,800.00</span> <small id="msgAmtSym">USDT</small></div>',
    '          <div class="mc-sub" id="msgNet" style="margin-top:5px">network TRC-20 · ref 0x9f3a…c21</div>',
    '        </div>',
    '        <div class="payload">',
    '          <div class="pl"><span class="k">MESSAGE ID</span><span class="v" id="plId">0x3f8a…c2e1</span></div>',
    '          <div class="pl"><span class="k">TEMPLATE</span><span class="v">withdrawal.receipt</span></div>',
    '          <div class="pl"><span class="k">IDEMPOTENCY KEY</span><span class="v" id="plKey">0x9f3a…c21</span></div>',
    '          <div class="pl"><span class="k">CHANNEL PLAN</span><span class="v" id="plPlan">EMAIL · SMS · FEISHU</span></div>',
    '        </div>',
    '        <div class="queue-mini">',
    '          <div class="qm"><span class="dot cyan"></span>SMS · queued<span class="dot dim" style="margin-left:auto"></span></div>',
    '          <div class="qm"><span class="dot lime"></span>FEISHU · queued<span class="dot dim" style="margin-left:auto"></span></div>',
    '        </div>',
    '        <div class="msg-foot"><span class="chip ghost">DEDUPLICATED</span><span class="chip ghost" style="margin-left:auto">QUEUE 03</span></div>',
    '      </div></div>',
    '    </div>',
    /* template plan */
    '    <div class="panel">',
    '      <div class="panel-hd"><span class="panel-name">Template plan</span><span class="panel-aux"><span class="tag violet">RENDERED PER CHANNEL</span></span></div>',
    '      <div class="panel-bd"><div class="tpl-body" id="tplBody">',
    '        <div class="tpl-card email" id="tpl0"><div class="tc-top">' + CH.EMAIL.icon + 'EMAIL<span class="tag" id="tplTag0">READY</span></div><div class="tc-line"><b id="tplSub0">Your withdrawal is confirmed</b></div><div class="tc-line" id="tplBody0">Hi — your withdrawal is on its way.</div><div class="tc-render" id="tplRender0">template · withdrawal.receipt · v3</div></div>',
    '        <div class="tpl-card sms" id="tpl1"><div class="tc-top">' + CH.SMS.icon + 'SMS<span class="tag" id="tplTag1">READY</span></div><div class="tc-line"><b id="tplSub1">ffex: withdrawal confirmed</b></div><div class="tc-line" id="tplBody1">Short receipt message.</div><div class="tc-render" id="tplRender1">template · short.receipt · v2</div></div>',
    '        <div class="tpl-card feishu" id="tpl2"><div class="tc-top">' + CH.FEISHU.icon + 'FEISHU<span class="tag" id="tplTag2">READY</span></div><div class="tc-line"><b id="tplSub2">Withdrawal approved · risk desk</b></div><div class="tc-line" id="tplBody2">Ops card with amount and reference.</div><div class="tc-render" id="tplRender2">template · ops.card · v2</div></div>',
    '      </div></div>',
    '    </div>',
    /* delivery routes */
    '    <div class="panel">',
    '      <div class="panel-hd"><span class="panel-name">Delivery routes</span><span class="panel-aux"><span class="tag cyan">RETRY · BACKOFF</span><span class="tag amber">UNKNOWN HANDLED</span></span></div>',
    '      <div class="panel-bd"><div class="routes-body">' + routeRowsHtml + '</div></div>',
    '    </div>',
    '  </div>',
    '  <div class="nrow2">',
    /* aggregation */
    '    <div class="panel">',
    '      <div class="panel-hd"><span class="panel-name">Receipt aggregation</span><span class="panel-aux"><span class="tag">ROLLING WINDOW</span><span class="tag lime">CONSISTENT</span></span></div>',
    '      <div class="panel-bd"><div class="agg-body">',
    '        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">',
    '          <div><div class="caps" style="margin-bottom:7px">BY STATE</div>' + aggRowsHtml + '<div class="agg-stack" id="aggStack"></div></div>',
    '          <div><div class="caps" style="margin-bottom:7px">BY CHANNEL</div>' + chRowsHtml + '<div style="margin-top:10px" class="pl" id="aggTotal"></div></div>',
    '        </div>',
    '        <div class="agg-legend"><span class="al"><i style="background:#c8ff62"></i>DELIVERED</span><span class="al"><i style="background:#2ee6c5"></i>PENDING</span><span class="al"><i style="background:#ffb45c"></i>RETRY</span><span class="al"><i style="background:#ff6f91"></i>UNKNOWN</span><span class="al" style="margin-left:auto;color:var(--faint)">RECEIPTS ARCHIVED · IMMUTABLE</span></div>',
    '      </div></div>',
    '    </div>',
    /* delivery events */
    '    <div class="panel">',
    '      <div class="panel-hd"><span class="panel-name">Delivery events</span><span class="panel-aux"><span class="tag violet">RECEIPT STATE MACHINE</span><span class="tag">STRUCTURED</span></span></div>',
    '      <div class="panel-bd"><div class="ev-head"><span>Time</span><span>Channel</span><span>State</span><span>Event</span><span>Message</span></div>',
    '        <div class="events-body" id="evBody">' + evRowsHtml + '</div>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</div>'
  ].join("\n");

  function $(id) { return document.getElementById(id); }

  var evRows = Array.prototype.slice.call($("evBody").children);
  var pkt = [0, 1, 2].map(function (i) { return $("pkt" + i); });
  var nodes = [0, 1, 2].map(function (i) {
    return [0, 1, 2, 3].map(function (k) { return $("node" + i + "_" + k); }).filter(Boolean);
  });
  var routeState = [0, 1, 2].map(function (i) { return $("rst" + i); });
  var routeReceipt = [0, 1, 2].map(function (i) { return $("rrc" + i); });
  var tplCards = [0, 1, 2].map(function (i) { return $("tpl" + i); });
  var tplTags = [0, 1, 2].map(function (i) { return $("tplTag" + i); });

  function stateChip(txt, cls) { return '<span class="tag ' + cls + '">' + txt + "</span>"; }

  function draw(t) {
    var cv = Math.floor(t / CYCLE);
    var local = t - cv * CYCLE;
    var c = cv % 5;
    var msg = MSG_DATA[c];
    var chd = CH[msg.ch];

    /* ---- message in ---- */
    var flash = Math.max(0, 1 - local / 0.5);
    $("msgCard").style.boxShadow = "0 0 " + (26 + 34 * flash).toFixed(1) + "px rgba(139,108,255," + (0.1 + 0.25 * flash).toFixed(3) + ")";
    $("msgBadge").className = "ch-badge " + chd.cls;
    $("msgBadge").innerHTML = chd.icon;
    Demo.setText($("msgTitle"), msg.ch + " · WITHDRAWAL RECEIPT");
    Demo.setText($("msgTime"), Demo.hhmmss(BASE_SEC + cv * CYCLE));
    Demo.setText($("msgSub"), "to " + msg.to + " · template withdrawal.receipt");
    Demo.setText($("msgAmtV"), msg.amt);
    Demo.setText($("msgAmtSym"), msg.asset);
    Demo.setText($("msgNet"), "network " + msg.net + " · ref " + msg.ref);
    Demo.setText($("plId"), "0x" + Demo.hex(1200 + c * 17, 4) + "…" + Demo.hex(1202 + c * 17, 4));
    Demo.setText($("plKey"), msg.ref);
    Demo.setText($("plPlan"), "EMAIL · SMS · FEISHU");

    /* ---- template plan ---- */
    var idx = CH_LIST.indexOf(msg.ch);
    for (var i = 0; i < 3; i++) {
      var on = i === idx;
      tplCards[i].className = "tpl-card " + CH_LIST[i].toLowerCase() + (on ? " on" : "");
      tplCards[i].style.opacity = on ? "1" : "0.5";
      Demo.setText(tplTags[i], on ? "RENDERING" : "READY");
      tplTags[i].className = "tag" + (on ? " violet" : "");
    }
    var tpl = TPL[msg.ch];
    var activeBody = $("tplBody" + idx);
    if (activeBody) {
      Demo.setHTML(activeBody, tpl.body.replace("{amt}", msg.amt).replace("{asset}", msg.asset).replace("{ref}", msg.ref).replace("{net}", msg.net));
      Demo.setText($("tplRender" + idx), tpl.render);
      Demo.setText($("tplSub" + idx), tpl.subject);
    }
    /* keep inactive previews content-consistent too */
    for (var tj = 0; tj < 3; tj++) {
      var key = CH_LIST[tj];
      if (tj === idx) continue;
      Demo.setHTML($("tplBody" + tj), TPL[key].body.replace("{amt}", msg.amt).replace("{asset}", msg.asset).replace("{ref}", msg.ref).replace("{net}", msg.net));
      Demo.setText($("tplSub" + tj), TPL[key].subject);
      Demo.setText($("tplRender" + tj), TPL[key].render);
    }

    /* ---- delivery routes ---- */
    for (var r = 0; r < 3; r++) {
      var ch = CH_LIST[r];
      var pr = Demo.loop(t, r * 0.32, CYCLE) / CYCLE;
      var laneEl = pkt[r].parentElement;
      var lw = laneEl.offsetWidth - 13;
      pkt[r].style.left = (pr * lw).toFixed(1) + "px";
      pkt[r].style.background = "radial-gradient(circle at 35% 35%, #fff, " + CH[ch].color + " 55%, " + CH[ch].color + "55)";
      pkt[r].style.boxShadow = "0 0 14px " + CH[ch].color + "e6";
      var st, cls, receiptCh;
      if (ch === "EMAIL") {
        var touched = pr > 0.28 ? 1 : 0, done = pr > 0.62 ? 1 : 0;
        st = pr < 0.28 ? "QUEUED" : pr < 0.62 ? "SENT" : "DELIVERED";
        cls = st === "DELIVERED" ? "lime" : st === "SENT" ? "cyan" : "ghost";
        nodes[r][0].className = "lane-node" + (pr > 0.05 ? " done" : "");
        nodes[r][1].className = "lane-node" + (touched ? " done" : "");
        nodes[r][2].className = "lane-node" + (done ? " done" : "");
        Demo.setText($("raddr" + r), "user mailbox · masked");
        Demo.setText(routeReceipt[r], "receipt 0x" + Demo.hex(2200 + r * 7 + (pr > 0.62 ? 3 : 0), 4));
      } else if (ch === "SMS") {
        var retry = pr >= 0.4 && pr < 0.66;
        var done2 = pr >= 0.78;
        st = pr < 0.2 ? "QUEUED" : pr < 0.4 ? "SENT" : retry ? "RETRY" : done2 ? "DELIVERED" : "SENT";
        cls = st === "DELIVERED" ? "lime" : st === "RETRY" ? "amber" : st === "SENT" ? "cyan" : "ghost";
        nodes[r][0].className = "lane-node" + (pr > 0.05 ? " done" : "");
        nodes[r][1].className = "lane-node" + (pr > 0.28 ? " done" : "");
        nodes[r][2].className = "lane-node" + (retry || pr > 0.66 ? " warn" : "") + (pr > 0.66 ? " done" : "");
        nodes[r][3].className = "lane-node" + (done2 ? " done" : "");
        Demo.setText($("raddr" + r), "mobile number · masked");
        Demo.setText(routeReceipt[r], retry ? "attempt 2 · backoff" : "receipt 0x" + Demo.hex(2300 + r * 7, 4));
      } else {
        var unk = pr >= 0.44 && pr < 0.82;
        var rec = pr >= 0.82;
        st = pr < 0.2 ? "QUEUED" : pr < 0.44 ? "SENT" : unk ? "UNKNOWN" : rec ? "RECONCILED" : "SENT";
        cls = st === "RECONCILED" ? "lime" : st === "UNKNOWN" ? "amber" : st === "SENT" ? "cyan" : "ghost";
        nodes[r][0].className = "lane-node" + (pr > 0.05 ? " done" : "");
        nodes[r][1].className = "lane-node" + (pr > 0.3 ? " done" : "");
        nodes[r][2].className = "lane-node" + (unk || rec ? " warn" : "") + (rec ? " done" : "");
        nodes[r][3].className = "lane-node" + (rec ? " done" : "");
        Demo.setText($("raddr" + r), "ops channel · webhook");
        Demo.setText(routeReceipt[r], unk ? "reconciling receipt…" : "receipt 0x" + Demo.hex(2400 + r * 7, 4));
      }
      Demo.setHTML(routeState[r], stateChip(st, cls));
      var pktEl = pkt[r];
      pktEl.style.top = "12px";
      if (st === "RETRY" || st === "UNKNOWN") pktEl.style.background = "radial-gradient(circle at 35% 35%, #fff, #ffb45c 55%, #ffb45c55)";
    }

    /* ---- receipt aggregation ---- */
    var agg = [
      1284 + Math.round(6 * wave(t, 2, 0.2)),
      36 + Math.round(2 * wave(t, 3, 1.4)),
      9 + Math.round(1.4 * (0.5 + 0.5 * wave(t, 4, 0.6))),
      3 + Math.round(1.2 * (0.5 + 0.5 * wave(t, 2, 2.4)))
    ];
    var total = agg[0] + agg[1] + agg[2] + agg[3];
    var maxA = agg[0];
    for (var a = 0; a < 4; a++) {
      Demo.setText($("aggN" + a), Demo.num(agg[a], 0));
      $("aggB" + a).style.width = Math.max(1.5, agg[a] / maxA * 100).toFixed(1) + "%";
    }
    var stack = $("aggStack");
    if (stack.children.length !== 4) {
      stack.innerHTML = '<i style="background:#c8ff62"></i><i style="background:#2ee6c5"></i><i style="background:#ffb45c"></i><i style="background:#ff6f91"></i>';
    }
    var colors = ["#c8ff62", "#2ee6c5", "#ffb45c", "#ff6f91"];
    for (var s = 0; s < 4; s++) {
      stack.children[s].style.width = (agg[s] / total * 100).toFixed(2) + "%";
      stack.children[s].style.background = colors[s];
    }
    var chCounts = [Math.round(total * 0.72), Math.round(total * 0.22), 0];
    chCounts[2] = total - chCounts[0] - chCounts[1];
    var chMax = chCounts[0];
    for (var c2 = 0; c2 < 3; c2++) {
      Demo.setText($("chnN" + c2), Demo.num(chCounts[c2], 0));
      $("chnB" + c2).style.width = Math.max(2, chCounts[c2] / chMax * 100).toFixed(1) + "%";
    }
    Demo.setHTML($("aggTotal"), '<span class="k" style="color:var(--faint);font:7px var(--mono);letter-spacing:.12em">TOTAL RECEIPTS</span><span class="v" style="font:500 12px var(--mono);color:#eef0f8">' + Demo.num(total, 0) + "</span>");

    /* ---- delivery events ---- */
    var visible = [];
    for (var e = 0; e < EVENTS.length; e++) {
      var ag2 = Demo.age(t, e * EV_INTERVAL);
      if (ag2 < EV_ROWS * EV_INTERVAL) visible.push({ e: e, age: ag2 });
    }
    visible.sort(function (x, y) { return x.age - y.age; });
    for (var rr = 0; rr < evRows.length; rr++) {
      var row = evRows[rr], item = visible[rr];
      if (!item) { row.style.opacity = "0"; continue; }
      var ev = EVENTS[item.e];
      var vt = t - item.age;
      var ms = Math.floor((((vt % 1) + 1) % 1) * 1000);
      var fi = item.age < 0.1 ? Demo.smooth(item.age / 0.1) : 1;
      var fo = item.age > (EV_ROWS - 2.3) * EV_INTERVAL ? Math.max(0, 1 - (item.age - (EV_ROWS - 2.3) * EV_INTERVAL) / (2.2 * EV_INTERVAL)) : 1;
      row.style.opacity = (fi * fo).toFixed(3);
      row.style.transform = "translate3d(0," + ((item.age / EV_INTERVAL) * 27 - 27).toFixed(2) + "px,0)";
      Demo.setText(row.children[0], Demo.hhmmss(BASE_SEC + vt) + "." + Demo.pad(ms, 3));
      var chEl = row.children[1];
      chEl.className = "ech";
      chEl.textContent = ev.ch;
      chEl.style.color = CH[ev.ch].color;
      var stEl = row.children[2];
      var isWarn = /retry|unknown|reconcil/i.test(ev.msg);
      var isOk = /delivered|reconciled|aggregated|resolved/.test(ev.msg);
      stEl.innerHTML = stateChip(isWarn ? (/unknown/i.test(ev.msg) ? "UNKNOWN" : "RETRY") : isOk ? "OK" : "INFO", isWarn ? "amber" : isOk ? "lime" : "ghost");
      Demo.setText(row.children[3], ev.msg);
      Demo.setText(row.children[4], ev.id);
    }
  }

  Demo.mount(draw, { duration: D });
})();
