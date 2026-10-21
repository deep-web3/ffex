---
title: "双技术栈"
description: "同一份交易所蓝图的 Java 与 Go 双实现：唯一的版本化契约源、逐项对比，以及两套栈共享的架构与部署方式。"
translationKey: "stack"
layout: "blocks"
blocks:
  - type: hero
    variant: compact
    kicker: "Java × Go · 一份蓝图"
    title: "两套实现，<br>一份<em>蓝图</em>。"
    lede: "ffex 以两种形态交付：Java 平台与 Go 平台，遵循同一份业务蓝图——同样的业务域、同样的不变量、同样的验收标准，并且都归你所有、由你扩展。"
    media: stack
    actions:
      - { label: "了解平台能力", href: "capabilities/", style: "primary" }
      - { label: "联系我们", href: "contact/", style: "ghost" }

  - type: stack
    kicker: "01 / 双技术栈"
    title: "选哪套运行时，<br>是<em>业务决策</em>。"
    lede: "有的运营方已经有成熟的 JVM 资产和 Java 团队；有的希望用小巧的 Go 二进制和 goroutine 原生并发承载热路径。这个选择改变的是运行时，不是业务语义。"
    items:
      - name: "Java"
        tag: "JVM · 企业既有资产"
        badge: "生产实现"
        desc: "基于 Spring 的平台，适合已经在生产环境运行 JVM、需要强类型服务边界、成熟运维工具与充足招聘来源的运营方。"
        bullets:
          - "Spring Boot 服务，每个业务域一个可部署单元"
          - "JVM 并发，热路径上显式的单写者归属"
          - "最广泛的驱动、客户端与可观测生态"
          - "每个服务独立构建、发布与回滚"
        accent: "violet"
      - name: "Go"
        tag: "GO · 轻量部署形态"
        badge: "生产实现"
        desc: "Go 平台，适合想要小巧静态二进制、快速启动与 goroutine 原生并发，同时不愿放弃任何业务不变量的团队。"
        bullets:
          - "每个服务一个小巧的静态二进制"
          - "goroutine 与 channel，上下文全程传递"
          - "水平扩展简单，发布节奏快"
          - "与 Java 实现相同的契约与验收标准"
        accent: "cyan"
    shared:
      title: "共享的契约蓝图"
      desc: "两套实现消费同一个版本化契约源。每个内部接口只定义一次，按语言生成 Java 与 Go 依赖包并以固定版本发布——两条实现线不可能悄悄漂移。"
      points:
        - "一份契约源，生成 Java 与 Go 依赖包"
        - "破坏性变更是新版本，不是突然袭击"
        - "相同的业务域地图、账本不变量与失败语义"
        - "对外 HTTP 与 WebSocket API 在两条栈上保持一致"
        - "前端通过同一套 API 接入任一技术栈"
    matrix:
      columns: ["维度", "Java", "Go"]
      rows:
        - label: "运行时"
          values: ["JVM · Spring Boot 服务", "Go 静态二进制"]
        - label: "并发模型"
          values: ["线程与异步流水线，显式单写者", "goroutine 与 channel，显式单写者"]
        - label: "撮合方式"
          values: ["内存订单簿，每个市场一个写者", "内存订单簿，每个市场一个写者"]
        - label: "团队画像"
          values: ["已有 Java/JVM 团队与资产", "愿意自己维护 Go 服务的团队"]
        - label: "生态"
          values: ["JVM 工具与集成最广", "标准库优先，工具链强，静态构建"]
        - label: "前端"
          values: ["后台、H5 与 App，走 HTTP/WS", "同一套前端，同一套 API"]
        - label: "部署"
          values: ["容器化运行于 Kubernetes，按服务流水线", "容器化运行于 Kubernetes，镜像更小"]
        - label: "可观测性"
          values: ["OpenTelemetry、结构化日志、trace 与日志互跳", "相同的语义模型与覆盖范围"]
        - label: "适合谁"
          values: ["以 JVM 为标准的规模型企业团队", "看重部署体积与上手速度的精简团队"]
    cta:
      label: "聊聊怎么选"
      href: "contact/"
      linkLabel: "预约一次技术沟通"

  - type: bento
    kicker: "02 / 架构组成"
    title: "八个组成部件，<br>共享同一套<em>职责边界</em>。"
    lede: "无论选择哪套栈，平台都由同样的职责边界组成，并且每个部件对自己的数据只有一个 owner。"
    items:
      - tag: "入口 / API"
        title: "入口与 API 层"
        desc: "HTTP 与 WebSocket 接入、身份认证、限流与交易前校验，并把请求路由到各业务域。"
        icon: "network"
        accent: "violet"
        span: "normal"
      - tag: "撮合"
        title: "撮合"
        desc: "内存订单簿，每个市场一个写者，价格优先时间优先，持久化发生在成交之后。"
        icon: "cpu"
        accent: "cyan"
        span: "normal"
      - tag: "风控"
        title: "风控与强平"
        desc: "保证金与仓位风险、强制平仓与损失分担，与撮合热路径严格隔离。"
        icon: "shield"
        accent: "rose"
        span: "normal"
      - tag: "账本 / 托管"
        title: "账本与托管"
        desc: "纯十进制余额、有流水的资金变动、充提流程、冷热分离与对账。"
        icon: "wallet"
        accent: "amber"
        span: "normal"
      - tag: "行情"
        title: "行情"
        desc: "公共数据以快照加增量方式推送，背压按订阅者隔离。"
        icon: "activity"
        accent: "violet"
        span: "normal"
      - tag: "通知"
        title: "通知与事件"
        desc: "异步主干与多渠道投递：有序事件、重试与投递回执。"
        icon: "bell"
        accent: "amber"
        span: "normal"
      - tag: "可观测"
        title: "可观测"
        desc: "追踪、指标与结构化日志共享同一上下文，从入口直到最后一个消费者。"
        icon: "pulse"
        accent: "cyan"
        span: "normal"
      - tag: "部署"
        title: "发布与部署"
        desc: "Kubernetes 工作负载、锁定镜像、有序迁移与流水线门禁的变更。"
        icon: "server"
        accent: "lime"
        span: "normal"

  - type: principles
    kicker: "03 / 工程原则"
    title: "一套纪律，<br>两套实现。"
    lede: "两套栈共享的不只是接口，还有让平台值得信任的那些工程约束。"
    items:
      - index: "01"
        title: "每个状态一个写者"
        desc: "每本订单簿、每个账户资产余额都只有唯一的逻辑写者。正确性来自事件顺序，而不是锁纪律。"
      - index: "02"
        title: "用契约，不共享表"
        desc: "业务域只暴露版本化契约与有序事件。没有任何服务去读另一个域的存储。"
      - index: "03"
        title: "异步，但语义明确"
        desc: "幂等、有序与显式的 UNKNOWN 处理，让事件主干不仅快，而且可以被依赖。"
      - index: "04"
        title: "两套栈，一条验收线"
        desc: "测试、故障演练与验收标准写在蓝图里。一套栈通过的行为，另一套栈也必须通过。"

  - type: cta
    kicker: "下一步"
    title: "技术栈可以晚点定，<br>先谈<em>需求</em>。"
    lede: "第一次技术沟通里，我们会把两套实现的差异讲清楚——运行时、运维成本、招聘、交付节奏——让需求来做决定。"
    actions:
      - { label: "联系我们", href: "contact/", style: "primary" }
      - { label: "查看能力地图", href: "capabilities/", style: "ghost" }
    contacts:
      - { label: "Telegram", value: "@bitdevops", href: "https://t.me/bitdevops", icon: "telegram" }
      - { label: "邮箱", value: "horizonvideo@gmail.com", href: "mailto:horizonvideo@gmail.com", icon: "mail" }
    note: "无论选择哪套栈，源码都是交付的一部分。"
---
