---
title: "ffex — 交易所平台工程"
description: "一套完整的数字资产交易所平台，以 Java 与 Go 两套实现构建于同一份契约优先蓝图之上——交易、托管、风控、行情、前端与全链路可观测，以可真正拥有的源码交付。"
translationKey: "home"
blocks:
  - type: hero
    variant: home
    kicker: "双栈交易所引擎 · JAVA × GO"
    title: "一套你可以<em>真正拥有</em>的交易所。"
    lede: "Java 与 Go 两套生产级实现，构建于同一份契约优先蓝图之上。交易、托管、风控、行情、前端与全链路可观测，以可编译、可部署、可扩展的源码交付。"
    media: console
    actions:
      - { label: "探索平台能力", href: "capabilities/", style: "primary" }
      - { label: "获取源码与方案", href: "cooperation/", style: "ghost" }
    stats:
      - { value: "02", label: "套 CEX 实现" }
      - { value: "01", label: "份契约源" }
      - { value: "03", label: "套前端" }
      - { value: "E2E", label: "全链路追踪" }
    footnote: "界面为演示示意，非实时行情数据。"

  - type: marquee
    items: ["现货", "永续合约", "期权", "OTC", "钱包托管", "风控清算", "清算结算", "行情数据", "后台运营", "通知平台", "全链路追踪", "KUBERNETES"]

  - type: bento
    id: capabilities
    kicker: "01 / 能力地图"
    title: "交易所需要的一切，<em>在一个系统里</em>。"
    lede: "这不是一份功能清单，而是一组拥有清晰边界、共享契约与统一观测模型的业务域。"
    items:
      - tag: "01 / 交易"
        title: "现货与衍生品核心"
        desc: "订单生命周期、价格优先时间优先撮合、成交、持仓与结算——为可恢复性设计的确定性状态流转。"
        icon: "bolt"
        accent: "violet"
        href: "capabilities/"
        linkLabel: "查看能力地图"
      - tag: "02 / 托管"
        title: "钱包与托管"
        desc: "充值、提现、冷热分离、链上对账与可审计的审批路径。"
        icon: "wallet"
        accent: "cyan"
        href: "capabilities/"
        linkLabel: "托管业务域"
      - tag: "03 / 风控"
        title: "风控与强平"
        desc: "保证金、敞口、强平与交易前风控检查，限额明确，默认失败即拒绝。"
        icon: "shield"
        accent: "amber"
        href: "capabilities/"
        linkLabel: "风控业务域"
      - tag: "04 / 清算"
        title: "清算与结算"
        desc: "账本记账、余额守恒、手续费结算与对账不变量——每一笔资金变动都可追溯。"
        icon: "scale"
        accent: "lime"
        href: "capabilities/"
        linkLabel: "清算业务域"
      - tag: "05 / 行情"
        title: "行情与数据流"
        desc: "深度、逐笔、K 线与行情推送，具备有界背压与一致快照。"
        icon: "chart"
        accent: "cyan"
        href: "capabilities/"
        linkLabel: "行情能力"
      - tag: "06 / 身份"
        title: "身份与后台"
        desc: "TOTP 多因素后台认证、基于角色的权限与所有特权操作的审计轨迹。"
        icon: "lock"
        accent: "violet"
        href: "capabilities/"
        linkLabel: "后台与身份"
      - tag: "07 / 前端"
        title: "前端与接口"
        desc: "管理端、H5 与原生 App，HTTP API 与 WebSocket 推送——同一套契约与同一套设计语言。"
        icon: "layers"
        accent: "cyan"
        span: "wide"
        href: "capabilities/"
        linkLabel: "产品界面"
      - tag: "08 / 公共"
        title: "通知与公共平台"
        desc: "独立通知平台与 Java / Go SDK、可独立版本化的基础设施组件，以及所有服务共用的发布工具链。"
        icon: "bell"
        accent: "amber"
        span: "wide"
        href: "capabilities/"
        linkLabel: "公共能力"

  - type: showcase
    id: demos
    kicker: "02 / 界面预览"
    title: "看见系统<em>如何运转</em>。"
    lede: "五段生成的界面演示：交易终端、撮合与账本链路、全链路追踪、风控后台与通知平台。"
    note: "所有画面均为使用示例数据生成的演示示意，不代表实时行情，也不是任何客户系统的截图。"
    items:
      - id: terminal
        tab: "交易终端"
        tag: "界面 / 交易"
        title: "现货与衍生品终端"
        desc: "下单、盘口、K 线与持仓集中在同一个工作区——交易员每天面对的那一层界面。"
        video: "demo/terminal.webm"
        mp4: "demo/terminal.mp4"
        poster: "demo/terminal.jpg"
        bullets:
          - "盘口与逐笔成交"
          - "K 线、深度与指标"
          - "持仓与保证金状态"
          - "现货与衍生品统一工作台"
      - id: matching
        tab: "撮合与账本"
        tag: "核心 / 撮合"
        title: "撮合与账本链路"
        desc: "一笔订单从网关进入风控、撮合核心和账本的完整旅程，每个边界都校验不变量。"
        video: "demo/matching.webm"
        mp4: "demo/matching.mp4"
        poster: "demo/matching.jpg"
        bullets:
          - "价格优先、时间优先队列"
          - "单写者账本记账"
          - "幂等写入与可重放事件"
          - "面向恢复的状态流转"
      - id: trace
        tab: "全链路追踪"
        tag: "可观测 / TRACE"
        title: "一条链路，端到端"
        desc: "HTTP、WebSocket、gRPC、撮合、MySQL 与 Kafka 串成同一条因果链，随时可以开始排查。"
        video: "demo/trace.webm"
        mp4: "demo/trace.mp4"
        poster: "demo/trace.jpg"
        bullets:
          - "跨异步边界的 span links"
          - "结构化日志携带 trace_id"
          - "采样与数据安全规则"
          - "关键路径全部有指标"
      - id: admin
        tab: "风控后台"
        tag: "运营 / 后台"
        title: "风控与运营后台"
        desc: "提现审批、敞口复核，以及每一次特权操作留下的审计轨迹。"
        video: "demo/admin.webm"
        mp4: "demo/admin.mp4"
        poster: "demo/admin.jpg"
        bullets:
          - "TOTP 多因素后台认证"
          - "风险与敞口复核"
          - "提现审批工作流"
          - "不可篡改的审计轨迹"
      - id: notify
        tab: "通知平台"
        tag: "公共 / NOTIFY"
        title: "通知平台"
        desc: "一套消息模型、多个投递渠道，回执与重试被当作一等状态处理。"
        video: "demo/notify.webm"
        mp4: "demo/notify.mp4"
        poster: "demo/notify.jpg"
        bullets:
          - "邮件、短信与飞书渠道"
          - "模板驱动的内容"
          - "回执核算与重试"
          - "Java 与 Go SDK"

  - type: stack
    id: stack
    kicker: "03 / 双技术栈"
    title: "Java 或 Go，<em>同一份蓝图</em>。"
    lede: "选择适合你团队与运维体系的运行时。两套实现从同一份契约源出发，保持一致的领域语义。"
    items:
      - name: "Java"
        tag: "JVM · 企业级生态"
        badge: "成熟技术栈"
        desc: "适合已经投入 JVM 的团队：成熟的类库、熟悉的运维方式与充足的人才储备。"
        accent: "violet"
        bullets:
          - "基于 Spring 的服务边界"
          - "gRPC 内部契约"
          - "JVM 观测工具链"
          - "企业系统集成友好"
      - name: "Go"
        tag: "GOROUTINE · 高效并发"
        badge: "轻量运行时"
        desc: "适合轻量、高密度的运营：紧凑的二进制、可预期的并发与更低的运维开销。"
        accent: "cyan"
        bullets:
          - "轻量服务进程"
          - "基于 Goroutine 的并发"
          - "快速启动与小镜像"
          - "面向 Kubernetes 的运维"
    shared:
      title: "同一份契约源"
      desc: "两套实现讲同一种语义：内部 gRPC 调用、外部 HTTP 与 WebSocket 边界、Kafka 事件，在不同技术栈之间保持一致含义。"
      points:
        - "唯一的 proto 契约源"
        - "一致的领域与错误语义"
        - "同一套可观测模型"
        - "各自独立的构建、测试与发布流水线"
    matrix:
      columns: ["维度", "Java", "Go"]
      rows:
        - { label: "运行时", values: ["JVM", "Goroutine"] }
        - { label: "并发模型", values: ["线程池与异步 I/O", "Goroutine 与 channel"] }
        - { label: "服务形态", values: ["Spring 服务", "可组合的包"] }
        - { label: "内部契约", values: ["gRPC · proto", "gRPC · proto"] }
        - { label: "外部边界", values: ["HTTP + WebSocket", "HTTP + WebSocket"] }
        - { label: "事件总线", values: ["Kafka", "Kafka"] }
        - { label: "前端", values: ["管理端 · H5 · App", "管理端 · H5 · App"] }
        - { label: "运维", values: ["Kubernetes · OTLP", "Kubernetes · OTLP"] }
        - { label: "适合", values: ["企业级 JVM 团队", "轻量高密度团队"] }
    cta: { label: "需要帮助选型？", href: "stack/", linkLabel: "查看详细对比" }

  - type: trace
    id: observability
    kicker: "04 / 全链路可观测"
    title: "每一笔交易都能<em>被解释</em>。"
    lede: "链路追踪不是事后补上的看板。同一个 trace 身份，从接入层贯穿撮合、存储与异步任务。"
    media:
      video: "demo/trace.webm"
      mp4: "demo/trace.mp4"
      poster: "demo/trace.jpg"
    coverage:
      - { name: "HTTP 与 WebSocket", desc: "入站请求与长连接会话", icon: "globe" }
      - { name: "gRPC", desc: "内部服务契约", icon: "network" }
      - { name: "Kafka", desc: "批次 span 与异步因果 links", icon: "pulse" }
      - { name: "MySQL", desc: "账本与业务事务", icon: "database" }
      - { name: "Redis", desc: "缓存与协同路径", icon: "layers" }
      - { name: "MongoDB", desc: "文档读写", icon: "blocks" }
      - { name: "后台任务与定时任务", desc: "Worker 与 cron", icon: "activity" }
      - { name: "外部 HTTP", desc: "托管、流动性与供应商 API", icon: "server" }
    principles:
      - { title: "默认传播", desc: "上下文自动跨越 HTTP、WebSocket、gRPC 与消息边界，业务代码无需手工接线。" }
      - { title: "异步因果", desc: "批次 span 与 links 让消息链路保持连贯，同时不改变顺序、提交与不变量语义。" }
      - { title: "日志同一身份", desc: "结构化日志携带 trace_id 与 span_id，排查过程中线索永不丢失。" }
      - { title: "数据安全优先", desc: "遥测不包含载荷、凭据与查询值；采样策略是显式配置，而不是随手打开。" }
    link: { label: "了解全链路可观测", href: "observability/" }

  - type: common
    id: common
    kicker: "05 / 公共平台"
    title: "把一切<em>连接起来</em>的那一层。"
    lede: "公共能力有明确 owner、独立版本与可替换实现，而不是被复制粘贴进每一个服务。"
    items:
      - tag: "NOTIFY"
        title: "通知平台"
        desc: "独立的多渠道通知服务，包含模板计划、投递回执与重试语义。"
        icon: "bell"
        accent: "amber"
        bullets: ["邮件、短信与飞书", "回执与 UNKNOWN 状态", "Java 与 Go SDK"]
      - tag: "RUNTIME"
        title: "语言级基础设施"
        desc: "按语言分别建设的 trace、metrics、日志与客户端组件，各自拥有独立版本与发布路径。"
        icon: "blocks"
        accent: "violet"
        bullets: ["Trace · Metrics · Logs", "Kafka · MySQL · Redis · MongoDB", "可独立替换"]
      - tag: "IDENTITY"
        title: "后台身份与审计"
        desc: "兼容 TOTP 的多因素认证、基于角色的权限，以及特权操作审计。"
        icon: "lock"
        accent: "cyan"
        bullets: ["TOTP 多因素", "RBAC", "不可篡改审计"]
      - tag: "DELIVERY"
        title: "发布与部署"
        desc: "Kubernetes 清单、流水线门禁、runbook 与回滚路径，覆盖每个服务。"
        icon: "server"
        accent: "lime"
        bullets: ["Kubernetes", "流水线门禁", "Runbook"]

  - type: principles
    id: principles
    kicker: "06 / 工程纪律"
    title: "资金安全是<em>设计约束</em>。"
    lede: "交易所软件的价值，体现在出问题的时候。下面这些规则写在架构里，而不是写在检查清单上。"
    items:
      - { index: "01", title: "账本只有一个写者", desc: "每一笔余额变动都有唯一的顺序写入者。并发永远不会成为第二个事实来源。" }
      - { index: "02", title: "重试之前先幂等", desc: "重试、超时与 UNKNOWN 结果都是正常状态，而不是留给以后清理的异常。" }
      - { index: "03", title: "余额守恒", desc: "每一笔借方都有对应的贷方。对账是一等业务流程，而不是事后补丁。" }
      - { index: "04", title: "契约优先的边界", desc: "proto 契约、明确的错误语义与稳定接口，让两套实现保持诚实一致。" }
      - { index: "05", title: "证据胜过声明", desc: "我们公开设计意图与工程纪律；实测数字与内部实现留在 NDA 房间里。" }

  - type: models
    id: cooperation
    kicker: "07 / 合作方式"
    title: "选择你想要的<em>拥有方式</em>。"
    lede: "从完整源码授权到交钥匙交付与联合建设——合作模式跟随你的团队，而不是反过来。"
    items:
      - id: source
        badge: "01 / 源码授权"
        name: "源码交付"
        subtitle: "拥有整个代码库"
        desc: "Java、Go 或双栈的完整平台源码，附带文档、部署资产与明确的更新窗口。"
        accent: "violet"
        featured: true
        deliverables:
          - "Java 与/或 Go 源码仓库"
          - "Proto 契约与前端"
          - "部署与运维资产"
          - "交接与工程沟通"
        fit: "具备工程能力的团队"
        cta: { label: "源码条款", href: "cooperation/" }
      - id: turnkey
        badge: "02 / 直接交付"
        name: "交钥匙交付"
        subtitle: "我们一起上线"
        desc: "我们在你的基础设施上部署、配置并与你的团队集成，直到上线与交接完成。"
        accent: "cyan"
        deliverables:
          - "在你的基础设施上部署"
          - "配置与系统集成"
          - "上线支持"
        fit: "需要速度的运营方"
        cta: { label: "交付范围", href: "cooperation/" }
      - id: joint
        badge: "03 / 联合建设"
        name: "联合建设"
        subtitle: "共同打造下一条产品线"
        desc: "共享的工程团队，面向新产品线、区域合规需求与第三方集成。"
        accent: "lime"
        deliverables:
          - "联合路线图与团队"
          - "定制业务域"
          - "共同验收标准"
        fit: "已有规模的运营方"
        cta: { label: "联合模式", href: "cooperation/" }
      - id: custom
        badge: "04 / 定制模块"
        name: "定制模块"
        subtitle: "只解决最难的那一个问题"
        desc: "撮合层、托管域、风控引擎或可观测体系，集成进你现有的平台。"
        accent: "amber"
        deliverables:
          - "模块设计与实现"
          - "与现有平台集成"
          - "测试与 runbook"
        fit: "存在明确短板的平台"
        cta: { label: "模块范围", href: "cooperation/" }
    note: "完整合作页面还包含长期支持与运维。报价由平台范围、授权方式与支持等级决定，在 NDA 沟通后提供明细。"

  - type: process
    id: process
    kicker: "08 / 如何开始"
    title: "从第一次沟通，到<em>运行中的交易所</em>。"
    lede: "一条有书面范围与验收标准的路径——没有含糊的演示，也没有无休止的探索。"
    steps:
      - { title: "介绍沟通", meta: "STEP 01", desc: "目标、范围、约束与时间。简短，而且第一次沟通就有工程师参与。" }
      - { title: "技术深谈", meta: "STEP 02 · NDA", desc: "架构、撮合核心、数据与可观测内部实现：那些不放在本站上的部分。" }
      - { title: "范围与方案", meta: "STEP 03", desc: "模块范围、授权方式、交付计划与验收标准，全部落在书面上。" }
      - { title: "交付与交接", meta: "STEP 04", desc: "分阶段交付、验收、部署支持，以及附文档的源码交接。" }

  - type: insights
    id: insights
    kicker: "09 / 洞察"
    title: "来自<em>平台工程</em>的笔记。"
    lede: "平台被设计成如何运行：业务域边界、吞吐设计、资金安全、可观测与运维。"
    limit: 3

  - type: cta
    kicker: "聊聊你的计划"
    title: "告诉我们，你正在<em>构建什么</em>。"
    lede: "一段简短说明就足够开始：全新启动还是已有平台、产品组合，以及你的时间表。"
    actions:
      - { label: "开始沟通", href: "contact/", style: "primary" }
      - { label: "查看合作方式", href: "cooperation/", style: "ghost" }
    contacts:
      - { label: "Telegram", value: "@bitdevops", href: "https://t.me/bitdevops", icon: "telegram" }
      - { label: "邮箱", value: "horizonvideo@gmail.com", href: "mailto:horizonvideo@gmail.com", icon: "mail" }
    note: "我们使用中文或英文沟通。无需承诺，也没有销售 PPT——第一次沟通就会有工程师参与。"
---
