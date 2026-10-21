---
title: "Cooperation"
description: "Five ways to work with ffex: source-code licensing, turnkey delivery, joint build, custom modules and long-term support. Scope, licence and support set pricing."
translationKey: "cooperation"
layout: "blocks"
blocks:
  - type: "hero"
    variant: "compact"
    kicker: "WORK WITH FFEX"
    title: "Buy the platform.<br>Own the <em>source</em>."
    lede: "Five ways to engage, from full source-code licensing to long-term operations. Scope, licence and support level are agreed before work starts, and pricing follows discovery. We do not publish a rate card."
    media: "none"
    actions:
      - { label: "Request terms", href: "contact/", style: "primary" }
      - { label: "See capabilities", href: "capabilities/", style: "ghost" }

  - type: "bento"
    kicker: "WHAT SETS THE PRICE"
    title: "Price follows <em>three</em> things"
    lede: "Every engagement is scoped differently, so there is no standard price list. These three factors decide the shape of the proposal you receive."
    note: "Pricing is quoted per engagement after discovery and, where needed, a mutual NDA."
    items:
      - tag: "01 / SCOPE"
        title: "Scope defines the work"
        desc: "Which domains ship, how deep the customisation goes, how many environments and integrations. One module and a full white-label launch are not the same project."
        icon: "layers"
        accent: "violet"
      - tag: "02 / LICENCE MODEL"
        title: "Licence defines ownership"
        desc: "Source-code licence, turnkey delivery or joint build: the model decides what you own, what we operate and how the engagement is priced."
        icon: "lock"
        accent: "cyan"
      - tag: "03 / SUPPORT LEVEL"
        title: "Support is scoped, not bundled"
        desc: "From a defined handover to a long-term operations plan with response windows. Support is agreed explicitly and priced on its own."
        icon: "shield"
        accent: "lime"

  - type: "models"
    id: "models"
    kicker: "ENGAGEMENT MODELS"
    title: "Five ways to <em>own</em> it"
    lede: "The platform underneath is the same in every model. What changes is how much you run, how much we run, and where the source sits."
    note: "Source code is part of delivery under licence. The exchange source itself is not published or linked from this site."
    items:
      - id: "source-licensing"
        badge: "MOST DIRECT"
        name: "Source-code licensing"
        subtitle: "Your platform, your repository"
        desc: "We license the platform source and its contract-first blueprint to your engineering organisation. You build, deploy and extend it with full visibility into every domain."
        deliverables:
          - "Full Java or Go source tree, including the shared contract blueprint"
          - "Build, configuration and deployment documentation"
          - "Architecture and domain walkthroughs with your engineers"
          - "Licence covering commercial operation and extension"
          - "Handover acceptance checklist"
        fit: "Operators with an in-house engineering team who want ownership and long-term control."
        accent: "violet"
        featured: true
        cta: { label: "Request licence terms", href: "contact/" }

      - id: "turnkey-delivery"
        badge: "HANDS-ON"
        name: "Turnkey / direct delivery"
        subtitle: "We build it, then hand over the keys"
        desc: "A fixed scope delivered by our team: platform configured, deployed to your infrastructure, integrated with your liquidity and custody partners, then supported through launch."
        deliverables:
          - "Written statement of work with acceptance criteria"
          - "Deployment to your Kubernetes environment"
          - "Integration with your liquidity, custody and payment partners"
          - "Launch support and operational runbooks"
          - "Handover training"
        fit: "Teams that need a running exchange on a date and do not have the bench to build one yet."
        accent: "cyan"
        cta: { label: "Scope a delivery", href: "contact/" }

      - id: "joint-build"
        badge: "TOGETHER"
        name: "Joint build"
        subtitle: "One delivery, two teams"
        desc: "We work inside your process: same repository, same review and release discipline. Capability and ownership transfer while the platform is being built."
        deliverables:
          - "Engineers embedded in platform and domain work"
          - "Shared repository, code review and release gates"
          - "Architecture and domain decisions documented as they land"
          - "Progressive handover of ownership responsibilities"
        fit: "Operators growing an engineering team who want capability, not just a dependency."
        accent: "amber"
        cta: { label: "Discuss a joint build", href: "contact/" }

      - id: "custom-modules"
        badge: "SURGICAL"
        name: "Custom modules & integration"
        subtitle: "One hard problem, solved properly"
        desc: "For platforms already in production: a new product line, a matching layer, custody and wallet domain, risk and clearing, or the observability stack, delivered as a domain that fits your contracts."
        deliverables:
          - "Domain design against your existing contracts"
          - "New module implemented in Java or Go"
          - "Integration and migration plan"
          - "Test suite with agreed acceptance criteria"
          - "Runbooks and ownership documentation"
        fit: "Operators with a live exchange who need one domain brought to production standard."
        accent: "lime"
        cta: { label: "Describe the gap", href: "contact/" }

      - id: "long-term-support"
        badge: "ONGOING"
        name: "Long-term support & operations"
        subtitle: "A runbook, not a renewal letter"
        desc: "Ongoing support after launch: releases, incident response, capacity reviews and platform upgrades, under an agreed response model with a named owner."
        deliverables:
          - "Support plan with response and resolution windows"
          - "Release management and upgrade path"
          - "Incident response across platform and domain layers"
          - "Scheduled capacity and reliability reviews"
          - "Regular knowledge-transfer sessions"
        fit: "Operators who run the platform themselves and want a named engineering partner behind it."
        accent: "rose"
        cta: { label: "Discuss support", href: "contact/" }

  - type: "deliverables"
    kicker: "WHAT YOU RECEIVE"
    title: "Source, documentation,<br>and a system that runs"
    lede: "Whatever the model, delivery is not a zip file. These arrive with the project and are checked off at handover."
    groups:
      - title: "Platform and source"
        items:
          - "Java and Go implementations of the same blueprint"
          - "Domain modules: trading, custody, risk, clearing, market data"
          - "Admin, H5 and mobile frontend source"
          - "Shared contract definitions"
          - "Notes on invariants and failure handling"
      - title: "Deployment and observability"
        items:
          - "Kubernetes deployment configuration"
          - "Environment and release pipeline setup"
          - "Full-link trace, metrics and structured logs"
          - "Operational runbooks and recovery procedures"
      - title: "Handover and enablement"
        items:
          - "Architecture and domain walkthroughs"
          - "Code review sessions with your engineers"
          - "Acceptance checklist signed at handover"
          - "Named contact through the first release"

  - type: "process"
    id: "process"
    kicker: "HOW AN ENGAGEMENT RUNS"
    title: "Scoped first, <em>built</em> second"
    lede: "No big-bang handover. Every stage produces something you can read, test or run."
    steps:
      - title: "Intro call"
        desc: "Your scenario, product mix, team and timeline. We say early if the fit is wrong."
        meta: "01 / INTRO"
      - title: "NDA and technical deep-dive"
        desc: "Under NDA we walk through architecture, domain boundaries, invariants and the parts deliberately kept off this site."
        meta: "02 / DEEP-DIVE"
      - title: "Scope and proposal"
        desc: "A written scope: domains, licence, support level, delivery model and acceptance criteria. Pricing follows the scope."
        meta: "03 / PROPOSAL"
      - title: "Pilot or phased delivery"
        desc: "Delivery in stages, with working software at each gate instead of a single launch-day reveal."
        meta: "04 / DELIVERY"
      - title: "Handover and support"
        desc: "Source, documentation and runbooks transfer against an acceptance checklist; support continues under an agreed plan."
        meta: "05 / HANDOVER"

  - type: "faq"
    id: "faq"
    kicker: "BEFORE THE FIRST CALL"
    title: "Questions buyers actually ask"
    items:
      - q: "Can we buy the source code?"
        a: "Yes. Source-code licensing is the most direct model: the platform source, its contract blueprint and the documentation are delivered together, under a licence that covers commercial operation and extension by your team."
      - q: "Why is there no price on the site?"
        a: "Scope, licence model and support level differ from one engagement to the next, so pricing is scoped after discovery and, where needed, an NDA. You receive a written proposal before any commitment."
      - q: "Java or Go, which should we choose?"
        a: "Both implementations come from the same blueprint and cover the same business surface. Choose the one your team can run, hire for and operate. We deliver both, and will say so if one fits your operations less well."
      - q: "Can you work with our existing exchange?"
        a: "Often, yes. Custom modules and integration are built for live platforms: a matching layer, custody domain, risk and clearing engine, or the observability stack, delivered as a domain that fits your contracts. We review the interface before committing to scope."
      - q: "How long does delivery take?"
        a: "It depends on scope, and on how much of your infrastructure, liquidity and custody integration is already in place. The proposal breaks the work into stages with dates at each gate. We do not quote a launch date before discovery."
      - q: "Do we need an NDA?"
        a: "For a technical deep-dive, yes. It lets both sides speak concretely about architecture, integration constraints and failure handling. It is a mutual NDA, not a sales gate."
      - q: "What happens after launch?"
        a: "Either you operate the platform with your own team, or support continues under a long-term plan with response windows, release management and capacity reviews. Both are legitimate outcomes, and both are scoped explicitly."
      - q: "Can we operate it under our own brand?"
        a: "Yes. The platform is delivered to you, and your brand, domains, products and operator identity are yours to define. Licences, compliance and risk controls for operating an exchange remain with you as the operator."
      - q: "What if we only need one module?"
        a: "That is a normal engagement. We deliver the module, its integration plan and its tests as a domain; the rest of the platform stays yours."

  - type: "cta"
    kicker: "NEXT STEP"
    title: "Tell us what you are building.<br>We will tell you what it takes."
    lede: "One message with your scenario and constraints is enough to start. We answer in English and Chinese."
    actions:
      - { label: "Talk to us", href: "contact/", style: "primary" }
      - { label: "About ffex", href: "about/", style: "ghost" }
    contacts:
      - { label: "Telegram", value: "@bitdevops", href: "https://t.me/bitdevops", icon: "telegram" }
      - { label: "Email", value: "horizonvideo@gmail.com", href: "mailto:horizonvideo@gmail.com", icon: "mail" }
    note: "Operating an exchange requires the operator's own licences, compliance programme and risk controls."
---
