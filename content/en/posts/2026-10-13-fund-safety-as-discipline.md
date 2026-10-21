---
title: "Fund Safety Is a Discipline, Not a Feature"
date: 2026-10-13
description: "The disciplines that keep ffex balances honest: decimal-only money, conservation invariants, idempotency, single writers, reconciliation and custody segregation."
tags: ["Fund Safety", "Reliability"]
weight: 4
---

Ask an exchange engineer what keeps them up at night and it is rarely
downtime — it is the quiet ways money can go wrong: a retried withdrawal
that pays twice, a rounding rule that leaks satoshis, a partial failure
that leaves a balance frozen forever. ffex treats fund safety as a set of
non-negotiable engineering disciplines. None of them are glamorous. All of
them are why the balances reconcile.

## Money is never a float

Every amount in the platform is decimal-typed with explicit precision and
explicitly defined rounding. Floating-point arithmetic does not touch
balances, fees, or funding calculations, because binary floats cannot
represent 0.1 and no amount of testing makes them honest accountants.

## Balances obey conservation laws

The core invariant of the ledger is taught in accounting, not computer
science: **the sum of available and frozen balances changes only through
explicit, journaled movements.** Every state change leaves an immutable
ledger trail; balances are derived, continuously cross-checked, and
reconciled against the movement history. An amount that appears from
nowhere — or vanishes — is a loud failure, not a rounding artifact.

## Idempotency on every funds-affecting operation

Each operation that can move money carries an idempotency key. A retry of
the same logical operation is recognized and collapses to the same single
effect — the 30th retry of a withdrawal request cannot create the 30th
payout.

Paired with this is the rule most platforms learn the hard way:

> **A timeout is not a failure.**

When the outcome of a funds operation is unknown, the system does not
blindly re-issue it. It resolves the outcome — via deterministic recovery
and reconciliation — and only then decides. Duplicate messages, out-of-order
delivery, and process restarts are treated as *normal input*, with designed
recovery paths, not as exceptional surprises.

## One writer per account asset

Just as each order book has a single writer, mutations of a given
account-asset balance are serialized through one logical owner. Concurrent
updates to the same balance do not race; they queue. The performance cost
is bounded and explicit; the correctness benefit is total.

## Custody: segregation by default

On-chain funds follow the classic segregation pattern:

- **Hot wallets** hold only operational floats, sized for normal withdrawal
  flow.
- **Cold storage** movement is approval-gated and monitored — no single
  operator, and no single running process, can move cold funds.
- **On-chain monitoring** watches deposits, confirmations and transfer
  states as a first-class service, with reconciliation against expected
  flows.
- Third-party custody adapters are integrated through the same audited
  wallet domain, not sprinkled through the codebase.

## Auditable by construction

Because every movement is a journaled event and every admin action flows
through the back-office with its own audit trail, "who moved what, when,
under whose approval" is a query, not a forensic project.

---

Performance gets the headlines; this discipline is what lets an operator
sleep. Next up: the other half of operability —
[observability and operations](../2026-10-14-observability-and-operations/).
