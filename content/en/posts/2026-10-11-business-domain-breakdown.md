---
title: "Inside ffex: How the Platform Is Split into Business Domains"
date: 2026-10-11
description: "A guided tour of ffex's business domains — identity, trading, clearing and risk, custody, products, and platform services — and the boundary rules that keep them honest."
tags: ["Architecture", "Business Domains"]
weight: 2
---

Large exchange codebases fail in a predictable way: everything grows into
everything else until a fee change can break a wallet transfer. ffex is
organized to make that failure structurally difficult. The platform is split
into business domains with hard boundaries, and every domain can be reasoned
about — and scaled, and audited — on its own.

## The domain map

| Domain | Owns |
|---|---|
| **Identity & Account** | Registration, sign-in, sessions, permissions, KYC-ready identity flows, invitations, security settings |
| **Spot Trading** | Order entry, planned orders, matching, balances and positions for spot markets |
| **Derivatives Trading** | Perpetual futures: leveraged positions, margin modes, batch orders, position management |
| **Market Data** | Tickers, depth, trades, K-lines, snapshot + incremental push over WebSocket |
| **Clearing & Risk** | Funding rates, forced liquidation, position reduction, insurance-fund mechanics, risk monitoring |
| **Wallet & Custody** | Deposits, withdrawals, address management, on-chain monitoring, hot/cold segregation, third-party custody adapters |
| **Product Lines** | Options and OTC as first-class product domains, not bolt-ons |
| **Market Making** | Robot/market-maker runners with pair switches and inventory discipline |
| **Notification** | Multi-channel delivery (email, SMS, webhook-class channels) with retries and receipts |
| **Back-office** | Admin console: listings, fee tiers, risk parameters, users, finance, audit exports |
| **Platform Services** | Scheduling, cross-domain sync workers, shared runtimes |

The point of the table is not the list — it is that each row has **one
owner of its data and its invariants**. The trading chain walks through them
like this:

> order entry → pre-trade checks → routing → **matching** → execution →
> persistence → push

Every arrow is either a typed internal RPC (synchronous validation, where
the caller needs an answer now) or an event on the async backbone (where the
trader must not wait). There is no third kind of hop — no shared database
tables reached around domain boundaries, no service reading another
service's tables.

## The boundary rules

Three rules keep the domains honest:

1. **Each domain owns its data.** Cross-domain reads go through contracts,
   not through the other domain's storage. When a domain needs to react to
   another domain's state change, it consumes an event.
2. **Contracts are typed and versioned.** Internal synchronous calls are
   gRPC services generated from one proto source of truth. Breaking changes
   are new versions, not surprises.
3. **Money-touching state changes are events, replayed safely.** What the
   ledger, the notification system and the analytics pipeline consume is an
   ordered, idempotent event stream — never a direct callback into another
   domain's internals.

## Why operators should care

Domain boundaries are usually sold as a developer convenience. For an
exchange they are a risk control:

- A bug in marketing notifications cannot touch order handling, because
  there is no code path between them.
- Load on market data does not degrade order placement, because they scale
  independently.
- Auditors can review the custody domain without reading the entire
  platform.
- New product lines (a new derivatives type, a new desk) land as new domains
  instead of edits spread across the codebase.

The next article looks at what those boundaries buy on the hot path:
[Throughput by Design](../2026-10-12-throughput-by-design/).
