---
title: "Dual Stack"
description: "Java and Go implementations of one exchange blueprint, a single versioned contract source, a side-by-side comparison, and the architecture both stacks share."
translationKey: "stack"
layout: "blocks"
blocks:
  - type: hero
    variant: compact
    kicker: "JAVA × GO · ONE BLUEPRINT"
    title: "Two implementations.<br>One <em>blueprint</em>."
    lede: "ffex ships as a Java platform and a Go platform built to the same business blueprint — the same domains, the same invariants, the same acceptance criteria. Both are yours to extend."
    media: stack
    actions:
      - { label: "Explore capabilities", href: "capabilities/", style: "primary" }
      - { label: "Talk to us", href: "contact/", style: "ghost" }

  - type: stack
    kicker: "01 / DUAL STACK"
    title: "The right runtime<br>is a <em>business decision</em>."
    lede: "Some operators already run a JVM estate and a deep Java bench. Others want small Go binaries and a goroutine-native hot path. The choice changes the runtime — not the business semantics."
    items:
      - name: "Java"
        tag: "JVM · ENTERPRISE ESTATE"
        badge: "PRODUCTION LINE"
        desc: "A Spring-based platform for operators who already run the JVM in production and want strongly typed service boundaries, mature operational tooling and a large hiring pool."
        bullets:
          - "Spring Boot services, one deployable per domain"
          - "JVM concurrency with explicit single-writer ownership on hot paths"
          - "The broadest driver, client and observability ecosystem"
          - "Independent build, release and rollback per service"
        accent: "violet"
      - name: "Go"
        tag: "GO · LEAN FOOTPRINT"
        badge: "PRODUCTION LINE"
        desc: "A Go platform for teams that want small static binaries, fast starts and goroutine-native concurrency without giving up a single business invariant."
        bullets:
          - "Small static binaries per service"
          - "Goroutines and channels, with context propagated end to end"
          - "Straightforward horizontal scale-out and fast rollouts"
          - "Same contracts and acceptance criteria as the Java line"
        accent: "cyan"
    shared:
      title: "The shared contract blueprint"
      desc: "Both stacks consume one versioned contract source. Every internal interface is defined once, generated for Java and Go, and released as a fixed-version package — so the two lines cannot drift apart quietly."
      points:
        - "One contract source, generated Java and Go packages"
        - "Breaking changes become new versions, not surprises"
        - "The same domain map, ledger invariants and failure semantics"
        - "External HTTP and WebSocket APIs stay stable across stacks"
        - "Frontends talk to either stack through the same API surface"
    matrix:
      columns: ["Dimension", "Java", "Go"]
      rows:
        - label: "Runtime"
          values: ["JVM · Spring Boot services", "Static Go binaries"]
        - label: "Concurrency model"
          values: ["Threads and async pipelines, explicit single writer", "Goroutines and channels, explicit single writer"]
        - label: "Matching approach"
          values: ["In-memory books, one writer per market", "In-memory books, one writer per market"]
        - label: "Team profile"
          values: ["Existing Java/JVM team and estate", "Team comfortable owning Go services"]
        - label: "Ecosystem"
          values: ["Broad JVM tooling and integrations", "Standard library, strong tooling, static builds"]
        - label: "Frontends"
          values: ["Admin Web, H5 and native app over HTTP/WS", "Same frontends, same API surface"]
        - label: "Deployment"
          values: ["Containers on Kubernetes, per-service pipelines", "Containers on Kubernetes, smaller images"]
        - label: "Observability"
          values: ["OpenTelemetry, structured logs, trace-to-log jumps", "Same semantic model and coverage"]
        - label: "Best fit"
          values: ["Enterprise teams standardising on the JVM", "Lean teams optimising footprint and ramp-up"]
    cta:
      label: "Talk through the trade-offs"
      href: "contact/"
      linkLabel: "Book a technical call"

  - type: bento
    kicker: "02 / ARCHITECTURE"
    title: "Eight building blocks,<br>shared <em>responsibilities</em>."
    lede: "Whichever stack you choose, the platform is assembled from the same boundaries of responsibility — and each block has one owner of its data."
    items:
      - tag: "EDGE / API"
        title: "Edge & API layer"
        desc: "HTTP and WebSocket termination, authentication, rate and pre-trade gates, and routing into the domains."
        icon: "network"
        accent: "violet"
        span: "normal"
      - tag: "MATCHING"
        title: "Matching"
        desc: "In-memory order books, one writer per market, price-time priority, persistence behind the fill."
        icon: "cpu"
        accent: "cyan"
        span: "normal"
      - tag: "RISK"
        title: "Risk & liquidation"
        desc: "Margin and position risk, forced liquidation and loss socialization, isolated from the matching hot path."
        icon: "shield"
        accent: "rose"
        span: "normal"
      - tag: "LEDGER / CUSTODY"
        title: "Ledger & custody"
        desc: "Decimal-only balances, journaled movements, deposits and withdrawals, hot/cold segregation and reconciliation."
        icon: "wallet"
        accent: "amber"
        span: "normal"
      - tag: "MARKET DATA"
        title: "Market data"
        desc: "Snapshot-plus-increment streams for public data, with per-subscriber backpressure."
        icon: "activity"
        accent: "violet"
        span: "normal"
      - tag: "NOTIFICATION"
        title: "Notification & events"
        desc: "The async backbone and multi-channel delivery: ordered events, retries, delivery receipts."
        icon: "bell"
        accent: "amber"
        span: "normal"
      - tag: "OBSERVABILITY"
        title: "Observability"
        desc: "Traces, metrics and structured logs sharing one context, from the edge to the last consumer."
        icon: "pulse"
        accent: "cyan"
        span: "normal"
      - tag: "DEPLOYMENT"
        title: "Release & deployment"
        desc: "Kubernetes workloads, pinned images, ordered migrations and pipeline-gated change."
        icon: "server"
        accent: "lime"
        span: "normal"

  - type: principles
    kicker: "03 / ENGINEERING PRINCIPLES"
    title: "One discipline,<br>both implementations."
    lede: "What the two stacks share is more than interfaces: it is the set of engineering constraints that make the platform trustworthy."
    items:
      - index: "01"
        title: "One writer per state"
        desc: "Each order book and each account-asset balance has exactly one logical writer. Correctness follows from event order, not from lock discipline."
      - index: "02"
        title: "Contracts, not shared tables"
        desc: "Domains expose versioned contracts and ordered events. No service reaches into another domain's storage."
      - index: "03"
        title: "Async with resolved semantics"
        desc: "Idempotency, ordering and explicit UNKNOWN handling make the event backbone safe to rely on, not just fast."
      - index: "04"
        title: "One acceptance bar for both stacks"
        desc: "Tests, failure-mode drills and acceptance criteria live in the blueprint. A behaviour that passes in one stack has to pass in the other."

  - type: cta
    kicker: "NEXT STEP"
    title: "Pick the stack later.<br>Start with the <em>requirements</em>."
    lede: "We will walk through the trade-offs in the first technical call — runtime, operations, hiring, delivery pace — and let the requirements decide."
    actions:
      - { label: "Talk to us", href: "contact/", style: "primary" }
      - { label: "See the capability map", href: "capabilities/", style: "ghost" }
    contacts:
      - { label: "Telegram", value: "@bitdevops", href: "https://t.me/bitdevops", icon: "telegram" }
      - { label: "Email", value: "horizonvideo@gmail.com", href: "mailto:horizonvideo@gmail.com", icon: "mail" }
    note: "Source code is part of delivery for either stack."
---
