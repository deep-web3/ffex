---
title: "ffex at a Glance: A Complete Exchange Platform, Engineered Twice"
date: 2026-10-10
description: "What ffex is: a complete digital-asset exchange platform — spot, derivatives, options, OTC, custody, risk and admin — built twice from one blueprint."
tags: ["Architecture", "Overview"]
weight: 1
---

If you are planning to operate a digital-asset exchange, the hard part is
rarely the idea — it is the engineering. Order flow that cannot lose money,
custody that cannot be casually drained, an operations posture you can
actually debug at 3 a.m. **ffex is a complete exchange platform solution
built around exactly those three concerns.**

## What ffex delivers

ffex covers the full surface a working exchange needs:

- **Trading** — spot markets, perpetual futures with the full funding-rate
  and liquidation machinery, options, and OTC desks.
- **Accounts and identity** — registration, authentication, permissioning,
  and KYC-ready identity flows.
- **Wallet and custody** — deposit and withdrawal pipelines with hot/cold
  segregation, on-chain transfer monitoring, and approval-gated cold-wallet
  movement.
- **Risk and clearing** — margin accounting, position risk, forced-liquidation
  and loss-socialization logic kept isolated from the trading hot path.
- **Market making tooling, notifications, and a full back-office console** for
  listings, fees, users and finance.
- **Three frontends** — an admin console, an H5 web trading client, and a
  mobile app.

None of this is a thin white-label skin over a template. It is a
domain-partitioned service platform, and the rest of this blog walks through
how each part is built to behave.

## One blueprint, two production implementations

The most unusual decision in ffex is that the platform exists **twice**: a
Java implementation and a Go implementation of the same business blueprint.

Both lines are generated against a single source of truth for service
contracts — one proto definition per interface, versioned, published as
generated packages. The result is that the two implementations cannot drift
apart quietly: a contract change is a versioned artifact, and both stacks
consume it explicitly.

Why maintain two? Because the right runtime for an exchange is a business
decision, not a religious one. Some operators have deep Java teams and an
existing JVM estate; others want Go's deployment profile and concurrency
model for the hot path. With ffex, that choice does not change the business
semantics, the safety invariants, or the acceptance criteria — the platform
is validated against the same behavior in both stacks.

## The connective tissue

The platform's communication rules are simple and strict:

- **External edge** — HTTP REST for account and order management, WebSocket
  for market data and order updates.
- **Internal synchronous calls** — gRPC with typed, versioned contracts.
  No ad-hoc JSON over HTTP between services.
- **Asynchronous backbone** — an event streaming platform (Kafka) carries
  everything that must not block the trading path: ledger updates,
  notifications, analytics, audit trails.
- **Storage** — MySQL where money and orders need transactional discipline,
  Redis for the hot path, MongoDB for high-volume flexible records such as
  market history.

These are not implementation trivia — they are the reason the platform can
be audited, scaled, and operated. The following articles take each area in
turn: [business domains](../2026-10-11-business-domain-breakdown/),
[throughput](../2026-10-12-throughput-by-design/),
[fund safety](../2026-10-13-fund-safety-as-discipline/) and
[operations](../2026-10-14-observability-and-operations/).

One note on what you will *not* find here: this blog describes what the
architecture is built to achieve and how it is organized. The internals —
matching core data structures, capacity engineering, tuning playbooks — are
shared with partners under NDA, not published. For the full capability map,
see [capabilities](../../capabilities/) and the [dual stack](../../stack/).
If that is the conversation you want,
[talk to us](../../contact/).
