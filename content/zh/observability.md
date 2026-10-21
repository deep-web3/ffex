---
title: "可观测性"
description: "贯穿 HTTP、WebSocket、gRPC、Kafka、数据库、异步 worker 与定时任务的全链路追踪，以及结构化日志与 trace 关联。"
translationKey: "observability"
layout: "blocks"
blocks:
  - type: hero
    variant: compact
    kicker: "可观测性 · 每一跳都有据可查"
    title: "trace 不会<br>停在<em>消息队列</em>边上。"
    lede: "多数平台追到请求为止，消息一进队列就断了。ffex 用同一个上下文贯穿同步调用、异步阶段、数据存储与后台任务——真正的硬故障恰好藏在这些地方。"
    media: trace
    actions:
      - { label: "预约一次演示", href: "contact/", style: "primary" }
      - { label: "对比双技术栈", href: "stack/", style: "ghost" }

  - type: trace
    kicker: "01 / 追踪覆盖"
    title: "十类链路节点，<br>一条<em>连起来</em>的时间线。"
    lede: "插桩是平台层的能力，不是每个服务各自打补丁。上下文在入口创建，跨过每一跳，并通过显式 links 在队列两侧接续。"
    media:
      video: "demo/trace.webm"
      mp4: "demo/trace.mp4"
      poster: "demo/trace.jpg"
    coverage:
      - name: "HTTP 入口与出口"
        desc: "入口 server span 按路由模板记录，出口 client span 携带 W3C 上下文跨服务传递。"
        icon: "globe"
      - name: "WebSocket"
        desc: "握手与消息处理批次都有 span，长连接会话同样能归因到具体请求。"
        icon: "bolt"
      - name: "gRPC"
        desc: "一元与流式拦截器记录方法、状态、耗时与消息大小——从不记录消息体。"
        icon: "network"
      - name: "Kafka"
        desc: "每个消费批次一个 span，通过 links 关联所有上游生产者上下文；顺序、提交与重试完全不受影响。"
        icon: "layers"
      - name: "MySQL"
        desc: "语句级 client span：系统、操作类别、连接池等待与错误。参数值不记录。"
        icon: "database"
      - name: "Redis"
        desc: "缓存操作的 client span，含连接池等待与错误；key 与 value 不进入 span。"
        icon: "activity"
      - name: "MongoDB"
        desc: "文档操作按命令类别与连接池等待追踪；文档内容不附加到 span。"
        icon: "blocks"
      - name: "线程池与 goroutine"
        desc: "上下文被显式桥接穿过线程池与 goroutine，没有后台上下文，也没有断链的 span。"
        icon: "cpu"
      - name: "worker 与定时任务"
        desc: "后台任务与调度器建立自己的根 span；存在来源上下文时继续沿用。"
        icon: "server"
      - name: "外部 HTTP"
        desc: "对第三方的出站调用携带上下文并记录状态与耗时；凭据与载荷被排除。"
        icon: "arrow"
    principles:
      - title: "上下文传播是默认行为"
        desc: "每个入口接受 W3C trace 上下文，每个出口发出它。请求没带上下文时生成新的根，而不是悄悄留一个缺口。"
      - title: "异步因果用 links 表达"
        desc: "Kafka 批次只建一个消费者 span，用 links 指向每一个上游生产者 span。消息的来源跨过队列，而不是假装是某个生产者的子 span。"
      - title: "日志携带 trace 身份"
        desc: "结构化 JSON 日志包含 trace_id 与 span_id，trace 与日志之间一步互跳，按 ID 搜索就能重建完整过程。"
      - title: "采样不拿资金冒险"
        desc: "采样规则显式定义，敏感载荷不进入 span 与日志，丢弃观测数据不能改变订单、提交或账本语义。"
    link:
      label: "阅读运维那篇文章"
      href: "posts/2026-10-14-observability-and-operations/"

  - type: bento
    kicker: "02 / 信号与运维"
    title: "三种信号，<br>一次<em>完整排查</em>。"
    lede: "追踪、指标与日志共享服务身份和 trace 上下文。值班工程师从症状出发，直接落到出问题的那一跳。"
    items:
      - tag: "追踪"
        title: "分布式 trace"
        desc: "一次请求或一条消息跨过每个服务、队列与数据存储的完整路径，span links 保留异步因果。"
        icon: "network"
        accent: "violet"
        span: "normal"
        bullets:
          - "W3C 上下文端到端"
          - "消息链路用批次 span 与 links"
          - "按路由模板而非原始 URL"
      - tag: "指标"
        title: "低基数指标"
        desc: "计数器、直方图与饱和度信号，标签有边界——订单号、用户 ID 不进时间序列。"
        icon: "gauge"
        accent: "cyan"
        span: "normal"
        bullets:
          - "订单、撮合与消息速率"
          - "以秒为单位的延迟直方图"
          - "连接池、lag 与积压饱和度"
      - tag: "日志"
        title: "结构化日志"
        desc: "JSON 日志携带服务、环境、trace 与 span 身份，外加事件名与结果，按 trace 一步可查。"
        icon: "code"
        accent: "amber"
        span: "normal"
        bullets:
          - "每行都有 trace_id 与 span_id"
          - "事件名与结果分类"
          - "敏感载荷按规则排除"
      - tag: "看板 / 告警"
        title: "看板与告警"
        desc: "每个业务域都有面向症状的看板，告警规则绑定运营方可感知的结果，而不是原始噪声。"
        icon: "chart"
        accent: "lime"
        span: "normal"
        bullets:
          - "按域划分的服务与市场视图"
          - "按用户可见症状告警"
          - "从面板下钻到 trace 与日志"
      - tag: "采样 / 安全"
        title: "采样与数据安全"
        desc: "采样策略显式可控，载荷在源头过滤；观测开关可关闭，且关闭它不会阻塞交易、提交或账本写入。"
        icon: "shield"
        accent: "rose"
        span: "normal"
        bullets:
          - "开关永不阻塞业务"
          - "密钥与完整载荷不进观测数据"
          - "采集端故障只影响观测"
      - tag: "运维"
        title: "运维实践"
        desc: "健康检查、runbook 驱动的故障流程、发布门禁与基于 trace 的复盘，都是交付内容的一部分。"
        icon: "server"
        accent: "cyan"
        span: "normal"
        bullets:
          - "可操作的健康与饱和度检查"
          - "一条 trace 支撑事故复盘"
          - "明确定义回滚点的发布门禁"

  - type: principles
    kicker: "03 / 插桩原则"
    title: "观测不能改变<br><em>资金路径</em>。"
    lede: "最难的要求不是覆盖范围，而是覆盖绝不改变业务结果。下面每一条都围绕这个前提。"
    items:
      - index: "01"
        title: "在组件层插桩一次"
        desc: "追踪、指标与日志由可版本化的组件库提供。业务服务只声明需要什么，绝不重复实现管道。"
      - index: "02"
        title: "永不改变资金路径"
        desc: "插桩可开关。关掉观测、或采集端不可用，都不能改变顺序、提交、重试或账本效果。"
      - index: "03"
        title: "传播，而不是倒推"
        desc: "上下文通过标准 header 与消息元数据传递。因果在发生时就被记录，而不是事后用时间戳去猜。"
      - index: "04"
        title: "数据安全也是可观测性的一部分"
        desc: "密钥、token 与完整载荷默认排除。trace 数据就是生产数据，有保留期与访问规则。"

  - type: cta
    kicker: "下一步"
    title: "先看它<em>跑起来</em>，<br>再做决定。"
    lede: "在限定范围的试点里，我们可以在真实环境展示同一条 trace——以及半夜真出故障时，值班工程师到底能看到什么。"
    actions:
      - { label: "预约一次演示", href: "contact/", style: "primary" }
      - { label: "对比双技术栈", href: "stack/", style: "ghost" }
    contacts:
      - { label: "Telegram", value: "@bitdevops", href: "https://t.me/bitdevops", icon: "telegram" }
      - { label: "邮箱", value: "horizonvideo@gmail.com", href: "mailto:horizonvideo@gmail.com", icon: "mail" }
    note: "任何环境访问之前都可以先签 NDA。"
---
