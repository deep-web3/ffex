---
title: "About"
description: "What ffex is, how we build it, and why this site publishes reasoning rather than benchmarks, client names or internal implementation details."
translationKey: "about"
layout: "blocks"
blocks:
  - type: "hero"
    variant: "compact"
    kicker: "ABOUT FFEX"
    title: "An exchange platform<br>built to be <em>owned</em>."
    lede: "A complete digital-asset exchange platform, implemented twice from one contract-first blueprint. This site publishes how it is built to behave; the internals stay under NDA."
    media: "none"
    actions:
      - { label: "Cooperation models", href: "cooperation/", style: "primary" }
      - { label: "Talk to us", href: "contact/", style: "ghost" }

  - type: "prose"

  - type: "principles"
    kicker: "HOW WE WORK"
    title: "The standards behind the <em>source</em>"
    lede: "Four commitments that hold across every engagement and every release."
    items:
      - index: "01"
        title: "Reasoning over numbers"
        desc: "Design intent, invariants and failure modes are public. Measured capacity belongs in a scoped evaluation on your workload, not on a landing page."
      - index: "02"
        title: "The source is part of the deal"
        desc: "Source-code delivery means you can inspect, extend and audit what you run. No black box and no rented platform."
      - index: "03"
        title: "Honest scope, early"
        desc: "We say early when a request is a poor fit, when a date is still a guess, and when the work needs something the platform does not cover yet."
      - index: "04"
        title: "Operations is engineering"
        desc: "A release is not done at deploy. Runbooks, reconciliation and incident response are designed with the feature, not patched on afterwards."

  - type: "cta"
    kicker: "NEXT STEP"
    title: "Judge the platform on its <em>engineering</em>."
    lede: "Read the cooperation models, or start a conversation with the constraints you actually have."
    actions:
      - { label: "Talk to us", href: "contact/", style: "primary" }
      - { label: "Read insights", href: "posts/", style: "ghost" }
    contacts:
      - { label: "Telegram", value: "@bitdevops", href: "https://t.me/bitdevops", icon: "telegram" }
      - { label: "Email", value: "horizonvideo@gmail.com", href: "mailto:horizonvideo@gmail.com", icon: "mail" }
    note: "We answer in English and Chinese. Operating an exchange requires the operator's own licences, compliance programme and risk controls."
---

**ffex** is a complete digital-asset exchange platform: spot, perpetual futures, options and OTC trading; wallet custody; risk and clearing; market data; notifications; back-office; and the admin, H5 and mobile frontends.

It is implemented twice — in Java and in Go — from one contract-first blueprint. Same business surface, same invariants, same observability model, in two runtimes. Operators pick the stack their team can build, hire for and operate.

## How we build

We treat an exchange as a set of invariants that must survive failure, not a set of screens that must look right in a demo.

- Single writer, ordering held by construction.
- Idempotency for anything that moves money.
- UNKNOWN treated as a state, not an exception to retry blindly.
- Reconciliation and audit designed in from the start.
- Full-link observability: trace, metrics and structured logs across HTTP, WebSocket, gRPC, Kafka, MySQL, Redis and asynchronous work.

None of these ideas is unusual on its own. Carrying them through every domain is — and that is what makes a platform auditable and operable rather than merely functional.

## What we publish, and what stays under NDA

This site is public and permanent. It describes design intent and engineering judgement, not internals: the architecture story, domain boundaries, the observability model and how engagements run.

It does not contain matching-core data structures, internal interface definitions, configuration dumps, deployment topology or measured capacity. Those are shared with serious counterparts under a mutual NDA, in a conversation where they can be examined properly.

## Why there are no benchmarks or client logos

We do not publish throughput or latency figures. Numbers that were not measured on your workload, under your risk controls, are marketing rather than evidence. We do not name clients either: their deployments are not ours to advertise. The comparable proof is a scoped pilot with acceptance criteria agreed up front.

## Contact

You do not need a finished requirements document to start. Tell us the scenario, product mix, timeline and deployment environment, and we will take it from there. If an NDA is needed before the technical conversation, say so in the first message.

- **Telegram**: [@bitdevops](https://t.me/bitdevops)
- **Email**: [horizonvideo@gmail.com](mailto:horizonvideo@gmail.com)

We answer in English and Chinese.
