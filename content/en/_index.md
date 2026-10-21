---
title: "ffex — Exchange platform engineering"
description: "A complete digital-asset exchange platform implemented twice — Java and Go — on one contract-first blueprint. Trading, custody, risk, market data, frontends and full-link observability, delivered as source you can own."
translationKey: "home"
blocks:
  - type: hero
    variant: home
    kicker: "DUAL-STACK EXCHANGE ENGINE · JAVA × GO"
    title: "The exchange platform you can <em>own</em>."
    lede: "Two production implementations of a complete digital-asset exchange, built on one contract-first blueprint. Trading, custody, risk, market data, frontends and full-link observability — delivered as source you can build, deploy and extend."
    media: console
    actions:
      - { label: "Explore capabilities", href: "capabilities/", style: "primary" }
      - { label: "Get source & terms", href: "cooperation/", style: "ghost" }
    stats:
      - { value: "02", label: "CEX stacks" }
      - { value: "01", label: "Contract source" }
      - { value: "03", label: "Frontends" }
      - { value: "E2E", label: "Full-link trace" }
    footnote: "Interface shown is an illustrative demo. No live market data."

  - type: marquee
    items: ["SPOT", "PERPETUALS", "OPTIONS", "OTC", "WALLET & CUSTODY", "RISK & LIQUIDATION", "CLEARING", "MARKET DATA", "ADMIN & OPS", "NOTIFICATION", "FULL-LINK TRACE", "KUBERNETES"]

  - type: bento
    id: capabilities
    kicker: "01 / CAPABILITY MAP"
    title: "Everything an exchange needs, <em>in one system</em>."
    lede: "Not a feature list. A set of owned business domains with clear boundaries, shared contracts and one observability model."
    items:
      - tag: "01 / TRADING"
        title: "Spot & derivatives core"
        desc: "Order lifecycle, price-time priority matching, fills, positions and settlement — deterministic state transitions designed for recovery."
        icon: "bolt"
        accent: "violet"
        href: "capabilities/"
        linkLabel: "Capability map"
      - tag: "02 / CUSTODY"
        title: "Wallet & custody"
        desc: "Deposits, withdrawals, hot and cold separation, on-chain reconciliation and auditable approval paths."
        icon: "wallet"
        accent: "cyan"
        href: "capabilities/"
        linkLabel: "Custody domain"
      - tag: "03 / RISK"
        title: "Risk & liquidation"
        desc: "Margin, exposure, liquidation and pre-trade checks with explicit limits and fail-closed defaults."
        icon: "shield"
        accent: "amber"
        href: "capabilities/"
        linkLabel: "Risk domain"
      - tag: "04 / CLEARING"
        title: "Clearing & settlement"
        desc: "Ledger postings, balance conservation, fee settlement and reconciliation invariants — every movement traceable."
        icon: "scale"
        accent: "lime"
        href: "capabilities/"
        linkLabel: "Clearing domain"
      - tag: "05 / MARKET DATA"
        title: "Market data & streams"
        desc: "Depth, trades, klines and streaming market data with bounded backpressure and consistent snapshots."
        icon: "chart"
        accent: "cyan"
        href: "capabilities/"
        linkLabel: "Market data"
      - tag: "06 / IDENTITY"
        title: "Identity & admin"
        desc: "TOTP multi-factor admin access, role-based permissions and audit trails for every privileged action."
        icon: "lock"
        accent: "violet"
        href: "capabilities/"
        linkLabel: "Admin & identity"
      - tag: "07 / FRONTENDS"
        title: "Frontends & interfaces"
        desc: "Admin console, H5 and native app, HTTP APIs and WebSocket streams — built on shared contracts and one design language."
        icon: "layers"
        accent: "cyan"
        span: "wide"
        href: "capabilities/"
        linkLabel: "Product surfaces"
      - tag: "08 / COMMON"
        title: "Notification & common platform"
        desc: "Dedicated notification platform with Java and Go SDKs, versioned infrastructure components, and release tooling shared by every service."
        icon: "bell"
        accent: "amber"
        span: "wide"
        href: "capabilities/"
        linkLabel: "Common capabilities"

  - type: showcase
    id: demos
    kicker: "02 / INTERFACE PREVIEW"
    title: "See the system <em>in motion</em>."
    lede: "Five generated tours: the trading terminal, matching and ledger path, full-link traces, the risk console and the notification platform."
    note: "All visuals are illustrative demos generated with sample data — not live market data, and not screenshots of any client system."
    items:
      - id: terminal
        tab: "Trading terminal"
        tag: "SURFACE / TRADING"
        title: "Spot & derivatives terminal"
        desc: "Order entry, depth, candles and positions in one workspace — the surface your traders live in."
        video: "demo/terminal.webm"
        mp4: "demo/terminal.mp4"
        poster: "demo/terminal.jpg"
        bullets:
          - "Order book and trade tape"
          - "Candles, depth and indicators"
          - "Positions and margin state"
          - "One shell for spot and derivatives"
      - id: matching
        tab: "Matching & ledger"
        tag: "CORE / MATCHING"
        title: "Matching and ledger path"
        desc: "An order's journey from gateway to risk, matching core and ledger — with invariants checked at every boundary."
        video: "demo/matching.webm"
        mp4: "demo/matching.mp4"
        poster: "demo/matching.jpg"
        bullets:
          - "Price-time priority queue"
          - "Single-writer ledger postings"
          - "Idempotent writes and replay-safe events"
          - "Recovery-oriented state transitions"
      - id: trace
        tab: "Full-link trace"
        tag: "OBSERVABILITY / TRACE"
        title: "One trace, end to end"
        desc: "HTTP, WebSocket, gRPC, matching, MySQL and Kafka linked in a single causality chain, ready for investigation."
        video: "demo/trace.webm"
        mp4: "demo/trace.mp4"
        poster: "demo/trace.jpg"
        bullets:
          - "Span links across async boundaries"
          - "Structured logs carrying trace_id"
          - "Sampling and data-safety rules"
          - "Metrics on every critical path"
      - id: admin
        tab: "Risk console"
        tag: "OPERATIONS / ADMIN"
        title: "Risk and operations console"
        desc: "Withdrawal approvals, exposure review and an audit trail for every privileged action."
        video: "demo/admin.webm"
        mp4: "demo/admin.mp4"
        poster: "demo/admin.jpg"
        bullets:
          - "TOTP multi-factor admin access"
          - "Risk and exposure review"
          - "Withdrawal approval workflow"
          - "Immutable audit trail"
      - id: notify
        tab: "Notification"
        tag: "COMMON / NOTIFY"
        title: "Notification platform"
        desc: "One message model, multiple delivery channels, with receipts and retries handled as first-class states."
        video: "demo/notify.webm"
        mp4: "demo/notify.mp4"
        poster: "demo/notify.jpg"
        bullets:
          - "Email, SMS and Feishu channels"
          - "Template-driven content"
          - "Receipt accounting and retry"
          - "Java and Go SDKs"

  - type: stack
    id: stack
    kicker: "03 / DUAL STACK"
    title: "Java or Go. <em>Same blueprint</em>."
    lede: "Choose the runtime that fits your team and your operations. Both stacks implement the same domain semantics from one contract source."
    items:
      - name: "Java"
        tag: "JVM · ENTERPRISE ECOSYSTEM"
        badge: "Mature stack"
        desc: "For teams already invested in the JVM: mature libraries, familiar operations and a deep hiring pool."
        accent: "violet"
        bullets:
          - "Spring-based service boundaries"
          - "gRPC internal contracts"
          - "JVM observability tooling"
          - "Enterprise integration ready"
      - name: "Go"
        tag: "GOROUTINE · EFFICIENT CONCURRENCY"
        badge: "Lean runtime"
        desc: "For lean, high-density operations: compact binaries, predictable concurrency and low operational overhead."
        accent: "cyan"
        bullets:
          - "Lightweight service processes"
          - "Goroutine-based concurrency"
          - "Fast startup and small images"
          - "Kubernetes-native operations"
    shared:
      title: "ONE CONTRACT SOURCE"
      desc: "Both implementations speak the same semantics: internal gRPC calls, external HTTP and WebSocket boundaries, and Kafka events keep identical meanings across stacks."
      points:
        - "Single proto contract source"
        - "Identical domain and error semantics"
        - "Same observability model"
        - "Independent build, test and release pipelines"
    matrix:
      columns: ["Dimension", "Java", "Go"]
      rows:
        - { label: "Runtime", values: ["JVM", "Goroutines"] }
        - { label: "Concurrency", values: ["Thread pools & async I/O", "Goroutines & channels"] }
        - { label: "Service shape", values: ["Spring-based services", "Composable packages"] }
        - { label: "Internal contracts", values: ["gRPC · proto", "gRPC · proto"] }
        - { label: "External edge", values: ["HTTP + WebSocket", "HTTP + WebSocket"] }
        - { label: "Event backbone", values: ["Kafka", "Kafka"] }
        - { label: "Frontends", values: ["Admin · H5 · App", "Admin · H5 · App"] }
        - { label: "Operations", values: ["Kubernetes · OTLP", "Kubernetes · OTLP"] }
        - { label: "Best fit", values: ["Enterprise JVM teams", "Lean, high-density teams"] }
    cta: { label: "Need help choosing a stack?", href: "stack/", linkLabel: "Compare in detail" }

  - type: trace
    id: observability
    kicker: "04 / FULL-LINK OBSERVABILITY"
    title: "Every trade can be <em>explained</em>."
    lede: "Tracing is not a dashboard bolted on afterwards. One trace identity runs from the edge through matching, storage and async workers."
    media:
      video: "demo/trace.webm"
      mp4: "demo/trace.mp4"
      poster: "demo/trace.jpg"
    coverage:
      - { name: "HTTP & WebSocket", desc: "Inbound requests and streaming sessions", icon: "globe" }
      - { name: "gRPC", desc: "Internal service contracts", icon: "network" }
      - { name: "Kafka", desc: "Batch spans with links for async causality", icon: "pulse" }
      - { name: "MySQL", desc: "Ledger and business transactions", icon: "database" }
      - { name: "Redis", desc: "Cache and coordination paths", icon: "layers" }
      - { name: "MongoDB", desc: "Document reads and writes", icon: "blocks" }
      - { name: "Workers & cron", desc: "Background jobs and scheduled tasks", icon: "activity" }
      - { name: "External HTTP", desc: "Custody, liquidity and provider APIs", icon: "server" }
    principles:
      - { title: "Propagation by default", desc: "Context crosses HTTP, WebSocket, gRPC and messaging without manual wiring in business code." }
      - { title: "Async causality", desc: "Batch spans and links keep message-driven flows connected without changing ordering or commit semantics." }
      - { title: "One identity in logs", desc: "Structured logs carry trace_id and span_id, so an investigation never loses the thread." }
      - { title: "Data safety first", desc: "Telemetry excludes payloads, credentials and query values; sampling is an explicit policy." }
    link: { label: "Explore full-link observability", href: "observability/" }

  - type: common
    id: common
    kicker: "05 / COMMON PLATFORM"
    title: "The layer that holds <em>everything together</em>."
    lede: "Shared capabilities are owned, versioned and independently replaceable — not copy-pasted into each service."
    items:
      - tag: "NOTIFY"
        title: "Notification platform"
        desc: "A dedicated multi-channel notification service with template planning, delivery receipts and retry semantics."
        icon: "bell"
        accent: "amber"
        bullets: ["Email, SMS and Feishu", "Receipts & UNKNOWN states", "Java and Go SDKs"]
      - tag: "RUNTIME"
        title: "Language infrastructure"
        desc: "Trace, metrics, logs and client components per language, each with an independent version and release path."
        icon: "blocks"
        accent: "violet"
        bullets: ["Traces · metrics · logs", "Kafka · MySQL · Redis · MongoDB", "Independently replaceable"]
      - tag: "IDENTITY"
        title: "Admin identity & audit"
        desc: "TOTP-compatible multi-factor authentication, role-based permissions and privileged-action audit."
        icon: "lock"
        accent: "cyan"
        bullets: ["TOTP MFA", "RBAC", "Immutable audit"]
      - tag: "DELIVERY"
        title: "Release & deployment"
        desc: "Kubernetes manifests, pipeline-gated releases, runbooks and rollback paths for every service."
        icon: "server"
        accent: "lime"
        bullets: ["Kubernetes", "Pipeline gates", "Runbooks"]

  - type: principles
    id: principles
    kicker: "06 / ENGINEERING DISCIPLINE"
    title: "Fund safety is a <em>design constraint</em>."
    lede: "Exchange software is judged on what happens when something goes wrong. These rules are enforced in the architecture, not in a checklist."
    items:
      - { index: "01", title: "Single writer per ledger", desc: "Every balance movement has one ordered writer. Concurrency never becomes a second source of truth." }
      - { index: "02", title: "Idempotency before retries", desc: "Retries, timeouts and UNKNOWN outcomes are treated as normal states, never as exceptions to clean up later." }
      - { index: "03", title: "Balance conservation", desc: "Every debit has a matching credit. Reconciliation is a first-class workflow, not an afterthought." }
      - { index: "04", title: "Contract-first boundaries", desc: "Proto contracts, explicit error semantics and stable interfaces keep two implementations honest." }
      - { index: "05", title: "Evidence over claims", desc: "We publish design intent and engineering discipline. Measured figures and internals stay in the NDA room." }

  - type: models
    id: cooperation
    kicker: "07 / COOPERATION"
    title: "Choose how you want to <em>own it</em>."
    lede: "From full source licensing to turnkey delivery and joint builds — the engagement model follows your team, not the other way around."
    items:
      - id: source
        badge: "01 / SOURCE LICENCE"
        name: "Source-code delivery"
        subtitle: "Own the codebase"
        desc: "Full platform source in Java, Go or both, with documentation, deployment assets and a defined update window."
        accent: "violet"
        featured: true
        deliverables:
          - "Java and/or Go source repositories"
          - "Proto contracts and frontends"
          - "Deployment and operations assets"
          - "Handover and engineering sessions"
        fit: "Teams with engineering capacity"
        cta: { label: "Source terms", href: "cooperation/" }
      - id: turnkey
        badge: "02 / DIRECT DELIVERY"
        name: "Turnkey delivery"
        subtitle: "We ship with you"
        desc: "We deploy, configure and integrate with your team on your infrastructure, through go-live and handover."
        accent: "cyan"
        deliverables:
          - "Deployment on your infrastructure"
          - "Configuration and integration"
          - "Go-live support"
        fit: "Operators who need speed"
        cta: { label: "Delivery scope", href: "cooperation/" }
      - id: joint
        badge: "03 / JOINT BUILD"
        name: "Joint build"
        subtitle: "Co-build the next line"
        desc: "A shared engineering team for new product lines, regional requirements and third-party integrations."
        accent: "lime"
        deliverables:
          - "Joint roadmap and team"
          - "Custom product domains"
          - "Shared acceptance criteria"
        fit: "Established operators"
        cta: { label: "Joint model", href: "cooperation/" }
      - id: custom
        badge: "04 / CUSTOM MODULES"
        name: "Custom modules"
        subtitle: "Solve one hard problem"
        desc: "A matching layer, custody domain, risk engine or observability stack, integrated into an existing platform."
        accent: "amber"
        deliverables:
          - "Module design and build"
          - "Integration with your platform"
          - "Tests and runbooks"
        fit: "Platforms with a specific gap"
        cta: { label: "Module scope", href: "cooperation/" }
    note: "The full cooperation page covers support and operations. Pricing is scoped by platform scope, licence model and support level — shared after an NDA discussion."

  - type: process
    id: process
    kicker: "08 / HOW IT STARTS"
    title: "From first call to <em>running exchange</em>."
    lede: "A structured path with written scope and acceptance criteria — no vague demos, no open-ended discovery."
    steps:
      - { title: "Intro call", meta: "STEP 01", desc: "Goals, scope, constraints and timing. Short — and an engineer joins the first conversation." }
      - { title: "Technical deep-dive", meta: "STEP 02 · NDA", desc: "Architecture, matching core, data and observability internals: the parts that stay off this site." }
      - { title: "Scope & proposal", meta: "STEP 03", desc: "Module scope, licence model, delivery plan and acceptance criteria, written down." }
      - { title: "Delivery & handover", meta: "STEP 04", desc: "Staged delivery, acceptance, deployment support and source handover with documentation." }

  - type: insights
    id: insights
    kicker: "09 / INSIGHTS"
    title: "Engineering notes from <em>the platform</em>."
    lede: "How the platform is designed to behave: domain boundaries, throughput design, fund safety, observability and operations."
    limit: 3

  - type: cta
    kicker: "LET'S TALK"
    title: "Tell us what you are <em>building</em>."
    lede: "A short message about your scenario is enough to start: greenfield or existing platform, product mix, and your timeline."
    actions:
      - { label: "Start a conversation", href: "contact/", style: "primary" }
      - { label: "Cooperation models", href: "cooperation/", style: "ghost" }
    contacts:
      - { label: "Telegram", value: "@bitdevops", href: "https://t.me/bitdevops", icon: "telegram" }
      - { label: "Email", value: "horizonvideo@gmail.com", href: "mailto:horizonvideo@gmail.com", icon: "mail" }
    note: "We reply in English and Chinese. No obligation, no sales deck — an engineer joins the first call."
---
