---
title: "Throughput by Design: Engineering the Trading Hot Path"
date: 2026-10-12
description: "How ffex engineers its trading hot path for six-figure TPS-class workloads — in-memory matching, single-writer order books, staged routing, cache layers and an event backbone."
tags: ["Architecture", "Performance"]
weight: 3
---

Throughput is not a number you tune in at the end. It is a property of
where the design refuses to spend time. This article walks the ffex trading
hot path and explains the decisions that add up to a platform designed for
**six-figure TPS-class aggregate matching capacity per cluster** and
**single-digit-millisecond order-placement budgets** at the edge.

To be explicit about scope: those are *design targets* built into the
architecture, and we validate them per deployment against the customer's
real workload — this blog does not publish benchmark reports.

## The matching core: memory first, one writer per book

The matching engine keeps the order book in memory. Orders do not wait on a
database round-trip to match; persistence happens behind the trade, not in
front of it.

The second decision is older than crypto: **each order book has exactly one
writer**. All mutations of a market's book are serialized through a single
logical owner. There are no cross-thread write races on the hot path,
because there is nothing to race with — the correctness argument for the
book is the order of events, not lock discipline.

## Staged routing: spread the load before it concentrates

Between the API edge and the matching core sit deliberately boring routing
stages: order routing, market routing, execution routing. Their job is to
fan load out — by market, by shard, by downstream — so that no single hop
becomes the bottleneck, and so that stages fail and recover independently.
If a routing stage is degraded, orders queue at a known point with known
semantics instead of scattering half-processed across the platform.

## Cache layers for the read side

Market data and position queries dominate real traffic volumes. ffex puts
dedicated cache layers in front of both — snapshots of book state, cached
position and margin views — so that a burst of ten thousand depth
subscriptions is served from memory, not by re-deriving state per request.

## The event backbone: the trade path never waits

Everything that must *eventually* happen — ledger updates, notifications,
analytics, audit trails — is published to the event backbone and consumed
asynchronously. The trader's order placement does not wait for an email to
be sent or a row to land in an analytics store.

This only works because consumers are engineered for it: **idempotent,
ordered, single-consumer-group processing** with explicit UNKNOWN-result
handling. A consumer that timed out does not blindly re-apply a funds
side-effect; it resolves the outcome deterministically. That discipline is
what makes "async" safe rather than merely fast.

## Scale-out shape

- Stateless services scale horizontally behind the routers.
- Markets partition across matching shards, so capacity grows with the
  book count, not against one global engine.
- WebSocket push has its own backpressure handling: a slow subscriber slows
  down *itself*, never the engine feeding it.

## What we will not put in a blog post

The remaining performance work — data-structure choices inside the matching
core, memory layout, tuning parameters, measured capacity under specific
hardware profiles — is exactly the part we share with partners under NDA
and validate in a scoped pilot. If you are comparing platforms for a real
deployment, that is the conversation worth having:
[talk to us](../2026-10-15-working-with-ffex/).
