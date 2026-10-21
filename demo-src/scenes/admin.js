/* ==========================================================================
   ffex demo · admin
   Admin & risk console: exposure dashboard, withdrawal approval queue with
   TOTP confirmation and an immutable audit trail. Generated demo data.
   ========================================================================== */
(function () {
  "use strict";
  var Demo = window.Demo, TAU = Demo.TAU, D = 14;
  var T_OPEN = 4.2, T_CONFIRM = 7.0, T_RESET = 12.2;
  var BASE_SEC = 21 * 3600 + 42 * 60 + 10;

  function wave(t, k, ph) { return Math.sin(TAU * (k * t / D + ph)); }

  var AUDIT_INTERVAL = D / 10;
  var AUDIT_EVENTS = [
    { t: "MFA verified", a: "risk.desk · TOTP", c: "violet", actor: "risk.desk" },
    { t: "Admin session opened", a: "platform.team · web", c: "cyan", actor: "platform.team" },
    { t: "Exposure limit updated", a: "risk.desk · policy", c: "amber", actor: "risk.desk" },
    { t: "Withdrawal rejected", a: "policy check · auto", c: "rose", actor: "policy.engine" },
    { t: "Role granted", a: "platform.team · reviewer", c: "violet", actor: "platform.team" },
    { t: "Withdrawal approved", a: "24,800.00 USDT · risk.desk", c: "lime", actor: "risk.desk" },
    { t: "MFA verified", a: "admin.ops · TOTP", c: "violet", actor: "admin.ops" },
    { t: "Report export requested", a: "compliance · csv", c: "cyan", actor: "compliance" },
    { t: "Config snapshot saved", a: "platform.team", c: "cyan", actor: "platform.team" },
    { t: "Price guard acknowledged", a: "risk.desk", c: "amber", actor: "risk.desk" }
  ];

  var ALERTS = [
    { sev: "amber", name: "Large withdrawal awaiting risk review", time: "21:42:05", state: "REVIEW" },
    { sev: "rose", name: "Price deviation guard triggered", time: "21:41:38", state: "OPEN" },
    { sev: "cyan", name: "New device sign-in · admin console", time: "21:40:52", state: "ACK" },
    { sev: "lime", name: "Margin call check passed", time: "21:40:10", state: "OK" }
  ];

  var WITHDRAWALS = [
    { id: "0x9f3a…c21", acct: "acct 0x7f3a…2c · USDT · TRC-20", amount: "24,800.00", sub: "24,800.00 USDT", risk: "LOW", riskCls: "ghost" },
    { id: "0x41d8…9b0", acct: "acct 0x2b8e…71 · USDT · ERC-20", amount: "8,420.00", sub: "8,420.00 USDT", risk: "LOW", riskCls: "ghost" },
    { id: "0x7c2e…4f7", acct: "acct 0x9d10…b4 · BTC · BTC", amount: "0.8610", sub: "0.8610 BTC", risk: "MED", riskCls: "amber" },
    { id: "0x5a91…e03", acct: "acct 0x4c77…09 · USDT · BEP-20", amount: "63,180.00", sub: "63,180.00 USDT", risk: "REVIEW", riskCls: "rose" }
  ];
  var CODES = "482916";

  /* ------------------------------------------------------------------- DOM */
  var stage = Demo.shell({
    product: "ADMIN & RISK",
    nav: ["Overview", "Risk", "Approvals", "Audit"],
    active: 1,
    clock: "UTC+8 · DEMO"
  });

  var alertRowsHtml = "";
  ALERTS.forEach(function (a) {
    alertRowsHtml += '<div class="alert-row"><span class="chip ' + a.sev + '" style="height:19px;padding:0 7px;font-size:7.5px">' + a.state + "</span>" +
      '<span class="an" style="padding-left:8px">' + a.name + '</span><span class="at">' + a.time + '</span>' +
      '<span class="as"><span class="tag">' + (a.sev === "rose" ? "HIGH" : a.sev === "amber" ? "MED" : "LOW") + "</span></span></div>";
  });

  var wqHtml = "";
  WITHDRAWALS.forEach(function (w, i) {
    wqHtml += '<div class="wq-row" id="wq' + i + '">' +
      '<div><div class="wq-id">' + w.id + '</div><div class="wq-sub">' + w.acct + "</div></div>" +
      '<div class="wq-amt"><span id="wqAmt' + i + '">' + w.amount + "</span><small>" + w.sub + "</small></div>" +
      '<div class="wq-st"><span class="tag ' + w.riskCls + '">' + w.risk + '</span><span id="wqSt' + i + '"><span class="tag amber">PENDING</span></span></div>' +
      "</div>";
  });

  var auditRowsHtml = "";
  for (var ar = 0; ar < 9; ar++) {
    auditRowsHtml += '<div class="audit-row"><span class="au-t"></span><span class="au-a"></span><span class="au-w"></span></div>';
  }

  var totpBoxes = "";
  for (var tb = 0; tb < 6; tb++) totpBoxes += '<span class="totp-box" id="totp' + tb + '"></span>';

  stage.innerHTML = [
    '<div class="scene-head">',
    '  <div class="left">',
    '    <span class="kicker">ADMIN · RISK · APPROVALS</span>',
    '    <span class="scene-title">Risk &amp; approval console</span>',
    '    <span class="scene-sub">Exposure, withdrawal review with TOTP and immutable audit · generated demo data</span>',
    '  </div>',
    '  <div class="right">',
    '    <span class="chip cyan"><i></i>2FA ENFORCED</span>',
    '    <span class="chip violet"><i></i>AUDIT LOGGED</span>',
    '  </div>',
    '</div>',
    '<div class="grid admin-grid">',
    /* -------- left -------- */
    '  <div class="col">',
    '    <div class="kpi-row">',
    '      <div class="kpi-tile tint-violet"><div class="kt-k">PORTFOLIO EXPOSURE</div><div class="kt-v"><span id="kExposureV">12.48</span><small>M USDT</small></div><div class="kt-f"><span style="color:var(--lime)">+1.24%</span><span>vs. open</span></div><svg class="kt-spark" width="76" height="26" viewBox="0 0 76 26"><polyline id="spark0" fill="none" stroke="#8b6cff" stroke-width="1.4" stroke-linecap="round" points=""/></svg></div>',
    '      <div class="kpi-tile tint-cyan"><div class="kt-k">MARGIN RATIO</div><div class="kt-v"><span id="kMarginV">218</span><small>%</small></div><div class="kt-f"><span style="color:var(--cyan)">HEALTHY</span><span>cross margin</span></div><svg class="kt-spark" width="76" height="26" viewBox="0 0 76 26"><polyline id="spark1" fill="none" stroke="#2ee6c5" stroke-width="1.4" stroke-linecap="round" points=""/></svg></div>',
    '      <div class="kpi-tile tint-amber"><div class="kt-k">RISK ALERTS</div><div class="kt-v"><span id="kAlertsV">3</span><small>OPEN</small></div><div class="kt-f"><span style="color:var(--amber)">1 MEDIUM</span><span>· 1 HIGH</span></div><svg class="kt-spark" width="76" height="26" viewBox="0 0 76 26"><polyline id="spark2" fill="none" stroke="#ffb45c" stroke-width="1.4" stroke-linecap="round" points=""/></svg></div>',
    '    </div>',
    '    <div class="panel exposure-panel">',
    '      <div class="panel-hd"><span class="panel-name">Exposure &amp; risk</span><span class="panel-aux"><span class="tag lime">WITHIN LIMITS</span><span class="tag">CROSS MARGIN</span></span></div>',
    '      <div class="panel-bd"><div class="exp-body">',
    '        <div class="gauge-wrap">',
    '          <svg width="150" height="150" viewBox="0 0 150 150">',
    '            <defs><linearGradient id="gg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8b6cff"/><stop offset="0.6" stop-color="#2ee6c5"/><stop offset="1" stop-color="#c8ff62"/></linearGradient></defs>',
    '            <circle cx="75" cy="75" r="56" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="8" stroke-dasharray="263.9 351.9" transform="rotate(135 75 75)"/>',
    '            <circle id="gaugeArc" cx="75" cy="75" r="56" fill="none" stroke="url(#gg)" stroke-width="8" stroke-linecap="round" stroke-dasharray="190 351.9" transform="rotate(135 75 75)"/>',
    '          </svg>',
    '          <div class="gauge-center"><div style="font:500 27px/1 var(--disp);letter-spacing:-.02em;color:#f4f5fc" id="gaugeVal">0.72</div><div class="gauge-label" style="margin-top:5px">RISK SCORE</div></div>',
    '          <div class="gauge-sub" id="gaugeNote">util 68% · buffer 32%</div>',
    '        </div>',
    '        <div class="exp-bars">',
    '          <div class="exp-row"><div class="er-top"><span>BTC</span><span><span class="pct" id="expPct0">42%</span><span class="amt">5.24M</span></span></div><div class="bar-track"><div class="bar-fill" id="expBar0" style="width:42%"></div></div></div>',
    '          <div class="exp-row"><div class="er-top"><span>ETH</span><span><span class="pct" id="expPct1">26%</span><span class="amt">3.24M</span></span></div><div class="bar-track"><div class="bar-fill" id="expBar1" style="width:26%"></div></div></div>',
    '          <div class="exp-row"><div class="er-top"><span>SOL</span><span><span class="pct" id="expPct2">14%</span><span class="amt">1.75M</span></span></div><div class="bar-track"><div class="bar-fill lime" id="expBar2" style="width:14%"></div></div></div>',
    '          <div class="exp-row"><div class="er-top"><span>USDT</span><span><span class="pct" id="expPct3">12%</span><span class="amt">1.50M</span></span></div><div class="bar-track"><div class="bar-fill" id="expBar3" style="width:12%"></div></div></div>',
    '          <div class="exp-row"><div class="er-top"><span>OTHER</span><span><span class="pct" id="expPct4">6%</span><span class="amt">0.74M</span></span></div><div class="bar-track"><div class="bar-fill rose" id="expBar4" style="width:6%"></div></div></div>',
    '          <div class="util-line"><span>LIMIT UTILISATION</span><span id="utilVal" style="color:var(--amber)">68%</span></div>',
    '        </div>',
    '        <div class="exp-foot"><span class="ef">COLLATERAL<b id="efColl">8.42M</b></span><span class="ef">BORROWED<b id="efBor">4.06M</b></span><span class="ef">BUFFER<b style="color:var(--lime)" id="efBuf">32%</b></span><span class="ef" style="margin-left:auto">STRESS · 10% MOVE<b style="color:var(--amber)">WITHIN</b></span></div>',
    '      </div></div>',
    '    </div>',
    '    <div class="panel alerts-panel">',
    '      <div class="panel-hd"><span class="panel-name">Risk alerts</span><span class="panel-aux"><span class="tag amber">3 OPEN</span></span></div>',
    '      <div class="panel-bd">',
    '        <div class="alert-head"><span>Severity</span><span>Alert</span><span>Time</span><span style="text-align:right">Risk</span></div>',
    '        <div id="alertRows">' + alertRowsHtml + '</div>',
    '        <div class="q-foot" style="border-top:1px solid var(--line)"><span class="chip ghost">PRICE GUARD</span><span class="chip ghost">MARGIN CALL</span><span class="chip ghost">WITHDRAWAL REVIEW</span></div>',
    '      </div>',
    '    </div>',
    '  </div>',
    /* -------- right -------- */
    '  <div class="col">',
    '    <div class="panel queue-panel">',
    '      <div class="panel-hd"><span class="panel-name">Withdrawal approvals</span><span class="panel-aux"><span class="tag amber">TOTP REQUIRED</span><span class="tag">4 QUEUED</span></span></div>',
    '      <div class="q-toolbar"><span class="seg"><span class="on">Pending</span><span>Approved</span><span>All</span></span><span class="tag">RISK-SCORED</span><span style="margin-left:auto" class="tag violet">DUAL CONTROL</span></div>',
    '      <div id="wqRows">' + wqHtml + '</div>',
    '      <div class="q-foot"><span class="tag lime">SINGLE WRITER</span><span class="tag">AUDIT EVERY ACTION</span><span style="margin-left:auto;font:8px var(--mono);color:var(--faint)">DEMO ACCOUNT</span></div>',
    '    </div>',
    '    <div class="panel audit-panel">',
    '      <div class="panel-hd"><span class="panel-name">Audit trail</span><span class="panel-aux"><span class="tag cyan">IMMUTABLE</span><span class="tag">ADMIN ACTIONS</span></span></div>',
    '      <div class="panel-bd"><div class="audit-head"><span>Time</span><span>Action</span><span style="text-align:right">Actor</span></div>',
    '        <div class="audit-body" id="auditBody">' + auditRowsHtml + '</div>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</div>',
    /* -------- modal -------- */
    '<div class="modal-backdrop" id="mBackdrop">',
    '  <div class="modal" id="mfaModal">',
    '    <div class="modal-hd">',
    '      <span style="width:32px;height:32px;border-radius:9px;display:grid;place-items:center;color:#ffd1a0;background:rgba(255,180,92,.12);border:1px solid rgba(255,180,92,.3)"><svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2l5 2v3.4c0 3.1-2.1 5.3-5 6.6-2.9-1.3-5-3.5-5-6.6V4z"/><path d="M8 6v3M8 11.2h.01"/></svg></span>',
    '      <div><div style="font:500 14px var(--disp);letter-spacing:-.01em;color:#f2f4fb">Withdrawal approval</div><div style="margin-top:3px;font:8px var(--mono);letter-spacing:.12em;color:var(--faint)">TOTP · DUAL CONTROL · DEMO</div></div>',
    '      <span class="tag amber" style="margin-left:auto">2FA REQUIRED</span>',
    '    </div>',
    '    <div class="modal-bd">',
    '      <div class="w-summary"><div><div style="font:7px var(--mono);letter-spacing:.14em;color:var(--faint)">WITHDRAWAL REQUEST</div><div class="ws-amt" style="margin-top:5px">24,800.00 <small>USDT</small></div></div>',
    '        <div class="ws-meta"><div>acct <b>0x7f3a…2c91</b></div><div>network <b>TRC-20</b></div><div>requested <b>21:42:05</b></div></div></div>',
    '      <div style="margin-top:14px;font:8px var(--mono);letter-spacing:.13em;color:var(--faint)">AUTHENTICATOR CODE</div>',
    '      <div class="totp-boxes" id="totpBoxes">' + totpBoxes + '</div>',
    '      <div class="totp-meta"><svg class="totp-ring" viewBox="0 0 20 20"><circle cx="10" cy="10" r="7.5" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="1.6"/><circle id="totpRing" cx="10" cy="10" r="7.5" fill="none" stroke="#2ee6c5" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="47.1" stroke-dashoffset="0" transform="rotate(-90 10 10)"/></svg><span id="totpHint">ENTERING CODE · 30S WINDOW</span></div>',
    '      <div class="mfa-note">Confirming releases the withdrawal and writes an immutable entry to the audit trail.</div>',
    '    </div>',
    '    <div class="modal-ft"><div class="btn ghost" style="flex:1">Reject</div><div class="btn grad" id="confirmBtn" style="flex:1.5">Confirm approval</div></div>',
    '  </div>',
    '</div>'
  ].join("\n");

  function $(id) { return document.getElementById(id); }
  var auditRows = Array.prototype.slice.call($("auditBody").children);
  var alertRows = Array.prototype.slice.call($("alertRows").children);
  var totp = [0, 1, 2, 3, 4, 5].map(function (i) { return $("totp" + i); });
  var wqRows = [0, 1, 2, 3].map(function (i) { return $("wq" + i); });
  var sparkEls = [0, 1, 2].map(function (i) { return $("spark" + i); });

  function sparkPath(el, t, k, ph, amp) {
    var pts = [];
    for (var i = 0; i < 22; i++) {
      var x = i / 21 * 76;
      var y = 13 - (Math.sin(TAU * (k * t / D) + ph + i * 0.42) * amp + Math.sin(i * 1.7 + k) * 2.2);
      pts.push(x.toFixed(1) + "," + y.toFixed(1));
    }
    el.setAttribute("points", pts.join(" "));
  }

  function draw(t) {
    /* ---- KPI tiles ---- */
    var exp = 12.48 + 0.045 * wave(t, 2, 0.4) + 0.018 * wave(t, 7, 1.1);
    Demo.setText($("kExposureV"), Demo.num(exp, 2));
    var margin = 218 + 2.4 * wave(t, 3, 1.7) + 1.1 * wave(t, 8, 0.3);
    Demo.setText($("kMarginV"), Demo.num(margin, 0));
    Demo.setText($("kAlertsV"), String(3 + (wave(t, 2, 2.2) > 0.55 ? 1 : 0)));
    sparkPath(sparkEls[0], t, 3, 0.4, 5);
    sparkPath(sparkEls[1], t, 4, 1.7, 5);
    sparkPath(sparkEls[2], t, 2, 2.2, 4);

    /* ---- risk gauge ---- */
    var score = 0.72 + 0.012 * wave(t, 4, 0.9);
    var arc = 263.9 * score;
    $("gaugeArc").setAttribute("stroke-dasharray", arc.toFixed(1) + " 351.9");
    $("gaugeVal").textContent = Demo.num(score, 2);
    var util = 68 + 0.9 * wave(t, 5, 0.2);
    Demo.setText($("utilVal"), Demo.num(util, 0) + "%");
    Demo.setText($("efColl"), Demo.num(8.42 + 0.03 * wave(t, 3, 0.6), 2) + "M");
    Demo.setText($("efBor"), Demo.num(4.06 + 0.02 * wave(t, 4, 1.4), 2) + "M");
    Demo.setText($("efBuf"), Demo.num(100 - util, 0) + "%");
    $("gaugeNote").textContent = "util " + Demo.num(util, 0) + "% · buffer " + Demo.num(100 - util, 0) + "%";

    var pcts = [42, 26, 14, 12, 6];
    var amts = [5.24, 3.24, 1.75, 1.50, 0.74];
    for (var e = 0; e < 5; e++) {
      var v = pcts[e] + (e === 0 ? 0.5 * wave(t, 3, 0.7 + e) : 0.35 * wave(t, 4, 0.5 + e));
      Demo.setText($("expPct" + e), Demo.num(v, 1) + "%");
      $("expBar" + e).style.width = v.toFixed(1) + "%";
      var amtEl = $("expPct" + e).parentElement.querySelector(".amt");
      if (amtEl) Demo.setText(amtEl, Demo.num(amts[e] * (1 + (v - pcts[e]) / 100), 2) + "M");
    }

    /* ---- alerts ---- */
    var flash = Math.max(0, 1 - (Demo.age(t, 2.4) / 1.2));
    if (flash > 0.05) alertRows[0].classList.add("flash"); else alertRows[0].classList.remove("flash");

    /* ---- withdrawal queue ---- */
    var modalAge = Demo.age(t, T_OPEN);
    var modalOpen = modalAge < 3.15;
    var sel = modalOpen;
    var approved = !modalOpen && t > T_CONFIRM && t < T_RESET;
    var signed = ((t - T_RESET + D / 2) % D) - D / 2;
    var dip = Demo.clamp(Math.abs(signed) / 0.3, 0.12, 1);
    wqRows[0].style.opacity = dip.toFixed(3);
    for (var w = 1; w < 4; w++) wqRows[w].style.opacity = "1";
    wqRows[0].className = "wq-row" + (sel ? " sel" : "") + (approved ? " approved" : "");
    Demo.setHTML($("wqSt0"), approved
      ? '<span class="tag lime">APPROVED</span>'
      : sel ? '<span class="tag violet">IN REVIEW</span>' : '<span class="tag amber">PENDING</span>');
    var flashApproved = approved ? Demo.smooth((t - T_CONFIRM) / 0.4) * (1 - Demo.smooth((t - T_CONFIRM - 0.9) / 0.8)) : 0;
    wqRows[0].style.background = flashApproved > 0.02
      ? "rgba(200,255,98," + (0.1 * flashApproved).toFixed(3) + ")"
      : "";

    /* ---- audit trail ---- */
    var visible = [];
    for (var a = 0; a < AUDIT_EVENTS.length; a++) {
      var ag = Demo.age(t, a * AUDIT_INTERVAL);
      if (ag < 7.4 * AUDIT_INTERVAL) visible.push({ i: a, age: ag });
    }
    visible.sort(function (x, y) { return x.age - y.age; });
    for (var r = 0; r < auditRows.length; r++) {
      var rowEl = auditRows[r], item = visible[r];
      if (!item) { rowEl.style.opacity = "0"; continue; }
      var ev = AUDIT_EVENTS[item.i];
      var vt = t - item.age;
      var fadeIn = item.age < 0.1 ? Demo.smooth(item.age / 0.1) : 1;
      var fadeOut = item.age > 5.6 * AUDIT_INTERVAL ? Math.max(0, 1 - (item.age - 5.6 * AUDIT_INTERVAL) / (1.6 * AUDIT_INTERVAL)) : 1;
      rowEl.style.opacity = (fadeIn * fadeOut).toFixed(3);
      rowEl.style.transform = "translate3d(0," + ((item.age / AUDIT_INTERVAL) * 34 - 34).toFixed(2) + "px,0)";
      Demo.setText(rowEl.children[0], Demo.hhmmss(BASE_SEC + vt));
      Demo.setHTML(rowEl.children[1], '<span class="tag ' + ev.c + '" style="height:15px;padding:0 5px;font-size:6.5px;margin-right:5px">' + Demo.esc(ev.t) + "</span>" + Demo.esc(ev.a));
      Demo.setText(rowEl.children[2], ev.actor);
    }

    /* ---- TOTP modal ---- */
    var back = $("mBackdrop");
    if (!modalOpen) {
      back.style.opacity = "1";
      back.style.background = "transparent";
      back.style.pointerEvents = "none";
      $("mfaModal").style.opacity = "0";
      $("confirmBtn").style.transform = "";
      $("confirmBtn").textContent = "Confirm approval";
    } else {
      var fadeIn = Demo.smooth(modalAge / 0.3);
      var fadeOut = modalAge > 2.85 ? 1 - Demo.smooth((modalAge - 2.85) / 0.3) : 1;
      var alpha = Math.min(fadeIn, fadeOut);
      back.style.opacity = "1";
      back.style.background = "rgba(3,4,10," + (0.62 * alpha).toFixed(3) + ")";
      back.style.pointerEvents = "none";
      $("mfaModal").style.opacity = alpha.toFixed(3);
      $("mfaModal").style.transform = "translate3d(0," + ((1 - fadeIn) * 16).toFixed(2) + "px,0) scale(" + (0.985 + 0.015 * fadeIn).toFixed(4) + ")";
      for (var d = 0; d < 6; d++) {
        var fillAt = 0.62 + d * 0.24;
        var filled = modalAge >= fillAt;
        var isActive = !filled && (d === 0 || modalAge >= 0.62 + (d - 1) * 0.24);
        totp[d].className = "totp-box" + (filled ? " filled" : isActive ? " active" : "");
        Demo.setText(totp[d], filled ? CODES[d] : "");
      }
      var ringP = Demo.clamp(modalAge / 3.0, 0, 1);
      $("totpRing").setAttribute("stroke-dashoffset", (47.1 * (1 - ringP)).toFixed(1));
      Demo.setText($("totpHint"), modalAge > 2.6 ? "CODE VERIFIED · CONFIRM TO RELEASE" : "ENTERING CODE · 30S WINDOW");
      var pressed = modalAge > 2.72 && modalAge < 3.02;
      var btn = $("confirmBtn");
      btn.textContent = pressed ? "Approving…" : "Confirm approval";
      btn.style.transform = pressed ? "scale(0.975)" : "";
      btn.style.boxShadow = pressed ? "0 0 34px rgba(200,255,98,.4)" : "";
    }
  }

  Demo.mount(draw, { duration: D });
})();
