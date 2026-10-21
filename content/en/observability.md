---
title: "Observability"
description: "Full-link tracing across HTTP, WebSocket, gRPC, Kafka, databases, async workers and schedulers — with structured logs and trace-to-log correlation."
translationKey: "observability"
layout: "blocks"
blocks:
  - type: hero
    variant: compact
    kicker: "OBSERVABILITY · EVERY HOP ACCOUNTED FOR"
    title: "A trace that<br>does not stop at the <em>queue</em>."
    lede: "Most platforms trace the request and lose the message. ffex keeps one context across synchronous calls, async stages, datastores and background work — because that is where the hard failures live."
    media: trace
    actions:
      - { label: "Ask for a walkthrough", href: "contact/", style: "primary" }
      - { label: "Explore the dual stack", href: "stack/", style: "ghost" }

  - type: trace
    kicker: "01 / TRACE COVERAGE"
    title: "Ten hop types.<br>One <em>connected</em> timeline."
    lede: "Instrumentation is a platform concern, not a per-service patch. Context is created at the edge, carried across every hop, and joined across queues with explicit links."
    media:
      video: "demo/trace.webm"
      mp4: "demo/trace.mp4"
      poster: "demo/trace.jpg"
    coverage:
      - name: "HTTP in / out"
        desc: "Server spans keyed by route template, client spans for outbound calls, with W3C context carried across services."
        icon: "globe"
      - name: "WebSocket"
        desc: "Spans for the handshake and for message-handling batches, so streaming sessions stay attributable."
        icon: "bolt"
      - name: "gRPC"
        desc: "Unary and streaming interceptors record method, status, duration and message size — never payloads."
        icon: "network"
      - name: "Kafka"
        desc: "One consumer span per batch, linked to every contributing producer context. Ordering, commits and retries are untouched."
        icon: "layers"
      - name: "MySQL"
        desc: "Statement-level client spans: system, operation class, connection-pool wait and errors. Parameter values are not recorded."
        icon: "database"
      - name: "Redis"
        desc: "Cache operations traced with pool wait and errors; keys and values stay out of spans."
        icon: "activity"
      - name: "MongoDB"
        desc: "Document operations traced by command category and pool wait; document bodies are never attached."
        icon: "blocks"
      - name: "Thread pools & goroutines"
        desc: "Context is bridged across thread pools and goroutines explicitly — no background context, no orphaned spans."
        icon: "cpu"
      - name: "Workers & scheduled tasks"
        desc: "Background jobs and schedulers open their own root spans and continue the originating context where there is one."
        icon: "server"
      - name: "External HTTP"
        desc: "Outbound third-party calls carry context and record status and duration; credentials and payloads are excluded."
        icon: "arrow"
    principles:
      - title: "Context propagation is the default"
        desc: "Every entry point accepts W3C trace context and every exit point emits it. A request that arrives without one gets a new root, not a silent gap."
      - title: "Async causality uses links"
        desc: "A Kafka batch gets one consumer span linked to every contributing producer span. A message's origin survives the queue without pretending to be a child of one producer."
      - title: "Logs carry trace identity"
        desc: "Structured JSON logs include trace_id and span_id, so trace-to-log and log-to-trace jumps take one step — and a search by ID reconstructs the story."
      - title: "Sampling is explicit and bounded"
        desc: "Sampling rules are explicit, sensitive payloads never enter spans or logs, and dropping telemetry cannot change order, commit or ledger semantics."
    link:
      label: "Read the operations article"
      href: "posts/2026-10-14-observability-and-operations/"

  - type: bento
    kicker: "02 / SIGNALS & OPERATIONS"
    title: "Three signals,<br>one <em>investigation</em>."
    lede: "Traces, metrics and logs share service identity and trace context. The on-call engineer starts with a symptom and lands on the exact hop that failed."
    items:
      - tag: "TRACES"
        title: "Distributed traces"
        desc: "One request or message path across every service, queue and datastore, with span links preserving async causality."
        icon: "network"
        accent: "violet"
        span: "normal"
        bullets:
          - "W3C trace context end to end"
          - "Batch spans with links for messaging"
          - "Route templates, not raw URLs"
      - tag: "METRICS"
        title: "Metrics that stay low-cardinality"
        desc: "Counters, histograms and saturation signals with bounded labels — no order IDs or user IDs in the time series."
        icon: "gauge"
        accent: "cyan"
        span: "normal"
        bullets:
          - "Order, matching and messaging rates"
          - "Latency histograms in seconds"
          - "Pool, lag and backlog saturation"
      - tag: "LOGS"
        title: "Structured logs"
        desc: "JSON logs with service, environment, trace and span identity, plus an event name and result — queryable by trace in one step."
        icon: "code"
        accent: "amber"
        span: "normal"
        bullets:
          - "trace_id and span_id on every line"
          - "Event names and result classifications"
          - "Sensitive payloads excluded by rule"
      - tag: "DASHBOARDS / ALERTING"
        title: "Dashboards & alerting"
        desc: "Symptom-level dashboards for each domain, with alert rules tied to operator outcomes rather than raw noise."
        icon: "chart"
        accent: "lime"
        span: "normal"
        bullets:
          - "Per-domain service and market views"
          - "Alerts on user-visible symptoms"
          - "Trace-to-log drill-down from a panel"
      - tag: "SAMPLING / SAFETY"
        title: "Sampling & data safety"
        desc: "Sampling policy is explicit, payloads are filtered at the source, and telemetry toggles never block trading, commits or ledger writes."
        icon: "shield"
        accent: "rose"
        span: "normal"
        bullets:
          - "Toggles that never block business"
          - "No secrets or full payloads in telemetry"
          - "Exporter outages degrade telemetry, not trading"
      - tag: "OPERATIONS"
        title: "Operability in practice"
        desc: "Health checks, runbook-driven incident flow, release gates and trace-based post-mortems are part of what gets delivered."
        icon: "server"
        accent: "cyan"
        span: "normal"
        bullets:
          - "Actionable health and saturation checks"
          - "Incident review from one trace"
          - "Release gates with a defined rollback point"

  - type: principles
    kicker: "03 / INSTRUMENTATION PRINCIPLES"
    title: "Telemetry that cannot<br>change <em>the money path</em>."
    lede: "The hard requirement is not coverage — it is that coverage never changes business outcomes. Everything here is built around that."
    items:
      - index: "01"
        title: "Instrument once, at the component layer"
        desc: "Tracing, metrics and logging live in versioned component libraries. Business services declare what they need; they never reimplement plumbing."
      - index: "02"
        title: "Never change the money path"
        desc: "Instrumentation is switchable. Turning telemetry off, or losing the exporter, cannot alter ordering, commits, retries or ledger effects."
      - index: "03"
        title: "Propagate, do not reconstruct"
        desc: "Context travels in standard headers and message metadata. Cause is recorded as it happens, not inferred from timestamps later."
      - index: "04"
        title: "Data safety is part of observability"
        desc: "Secrets, tokens and full payloads are excluded by default. Trace data is production data, with retention and access rules."

  - type: cta
    kicker: "NEXT STEP"
    title: "See it running<br>before you decide."
    lede: "In a scoped pilot we can show the same trace across a live environment — and what an on-call engineer actually sees when something breaks at night."
    actions:
      - { label: "Ask for a walkthrough", href: "contact/", style: "primary" }
      - { label: "Compare the dual stack", href: "stack/", style: "ghost" }
    contacts:
      - { label: "Telegram", value: "@bitdevops", href: "https://t.me/bitdevops", icon: "telegram" }
      - { label: "Email", value: "horizonvideo@gmail.com", href: "mailto:horizonvideo@gmail.com", icon: "mail" }
    note: "An NDA can be in place before any environment access."
---
