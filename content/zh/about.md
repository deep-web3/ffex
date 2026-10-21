---
title: "关于"
description: "ffex 是一套完整的数字资产交易所平台，以 Java 与 Go 双实现交付同一份契约优先蓝图。本站说明它是什么、我们如何构建，以及哪些内容公开、哪些留在 NDA 之后，为什么不发布性能数字与客户名单。"
translationKey: "about"
layout: "blocks"
blocks:
  - type: "hero"
    variant: "compact"
    kicker: "关于 FFEX"
    title: "一套你可以<em>拥有</em>的<br>交易所平台。"
    lede: "完整的数字资产交易所平台，以同一份契约优先蓝图实现两遍。本站说明它被设计来如何运行；内部实现留在 NDA 之后。"
    media: "none"
    actions:
      - { label: "合作模式", href: "cooperation/", style: "primary" }
      - { label: "联系我们", href: "contact/", style: "ghost" }

  - type: "prose"

  - type: "principles"
    kicker: "工作方式"
    title: "源码背后的<em>标准</em>"
    lede: "四条贯穿每次合作与每个版本的标准。"
    items:
      - index: "01"
        title: "讲推理，不讲数字"
        desc: "设计意图、不变量与故障模式都可以公开。实测容量属于你方负载上的限定评估，不放在落地页上。"
      - index: "02"
        title: "源码是交易的一部分"
        desc: "源码交付意味着你能检查、扩展与审计自己运行的东西。没有黑盒，也不是租来的平台。"
      - index: "03"
        title: "范围要诚实，而且要早"
        desc: "不匹配的需求、还只是猜测的日期、平台尚未覆盖的能力，我们都会尽早说清楚。"
      - index: "04"
        title: "运维也是工程"
        desc: "发布不是部署完就结束。运维手册、对账与故障响应和功能一起设计，而不是事后补。"

  - type: "cta"
    kicker: "下一步"
    title: "用工程本身<em>判断</em>这套平台。"
    lede: "看看合作模式，或者直接带着你真实的约束来聊。"
    actions:
      - { label: "联系我们", href: "contact/", style: "primary" }
      - { label: "阅读洞察", href: "posts/", style: "ghost" }
    contacts:
      - { label: "Telegram", value: "@bitdevops", href: "https://t.me/bitdevops", icon: "telegram" }
      - { label: "邮箱", value: "horizonvideo@gmail.com", href: "mailto:horizonvideo@gmail.com", icon: "mail" }
    note: "中英文均可沟通。运营交易所需要运营方自行取得牌照、建立合规体系与风控措施。"
---

**ffex** 是一套完整的数字资产交易所平台：现货、永续合约、期权与 OTC 交易，钱包托管，风控与清算，行情，通知，后台管理，以及管理端、H5 与移动端三套前端。

它以同一份契约优先蓝图实现了两遍——一遍 Java，一遍 Go。同样的业务面，同样的不变量，同样的可观测模型，两个运行时。运营方选自己团队能构建、能招人、能运维的那一套。

## 我们怎么构建

我们把交易所看成一组必须在故障下依然成立的不变量，而不是一组演示时好看的页面。

- 单写者，顺序由结构保证。
- 一切涉及资金的动作都幂等。
- UNKNOWN 是一种状态，不是可以盲目重试的异常。
- 对账与审计从第一天就是设计的一部分。
- 全链路可观测：trace、指标与结构化日志贯穿 HTTP、WebSocket、gRPC、Kafka、MySQL、Redis 与异步任务。

这些原则单看都不稀奇。难的是让它们贯穿每个业务域——平台之所以可审计、可运维，靠的正是这一点。

## 我们发布什么，不发布什么

这个站点是公开且长期存在的，所以它讲设计意图与工程判断，不讲内部实现：架构思路、业务域边界、可观测模型，以及合作如何推进。

它不包含撮合核心的数据结构、内部接口定义、配置清单、部署拓扑或实测容量。这些内容只在双向 NDA 下，与认真评估的对手方逐项核对。

## 为什么没有性能数字和客户 logo

我们不发布吞吐与延迟数字。没有在你方负载、你方风控条件下测出的数字，是营销，不是证据。我们也不写客户名字：客户的部署不属于我们，也不该由我们拿来宣传。可比的证明方式，是在约定基础设施上、按事先写好的验收标准做限定范围试点。

## 联系

起步不需要一份写完的需求文档。说明场景、产品组合、时间表与部署环境，剩下的我们来接。如果技术沟通之前需要 NDA，第一条消息里直接说。

- **Telegram**：[@bitdevops](https://t.me/bitdevops)
- **邮箱**：[horizonvideo@gmail.com](mailto:horizonvideo@gmail.com)

中英文均可。
