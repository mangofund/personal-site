---
image: /images/luckin-coffee-mcp/cover.jpg
title: 如何让Grokbot帮我点一杯瑞幸咖啡
description: 瑞幸开放标准 MCP 与 Streamable HTTP 端点后，我用 Grok Bot 自定义连接器真实下单了一杯大杯冰美式。
keywords: 瑞幸咖啡 MCP, Luckin MCP, Grok Bot, MCP 接入, Streamable HTTP, 自定义连接器, AI 点咖啡
date: 2026-10-29
category: AI
tags: [AI, MCP, 瑞幸, Grok Bot, Agent]
order: 20
draft: false
---

# 如何让Grokbot帮我点一杯瑞幸咖啡
<div class="meta-line">2026.10.29 · AI · 阅读约 8 分钟</div>

<div class="article-cover">

![如何让Grokbot帮我点一杯瑞幸咖啡](/images/luckin-coffee-mcp/cover.jpg)

</div>

作者：hello pro（[@PRO_AI_99T](https://x.com/PRO_AI_99T)） · 2026.10.29

我用 Grok Bot 接上瑞幸的 MCP，真的点到了一杯冰美式。

桌面上现在放着那杯标准美式，大杯，加冰，旁边还有小票。

这篇文章把接入路径和实战流程写清楚。

官方宣传提到一句话下单，也提到智能优惠和标准 MCP，登录状态大约能留一个月。

我这边验证过，连接器能列出工具，预览能出金额，确认后能拿到支付链接，付款后能查到取餐码。

支付这一步必须人点。

文里不会出现真实 Token，也不会贴完整支付链接。

## 瑞幸开放了什么？

开放平台入口在这里：[https://open.luckincoffee.com/mcp](https://open.luckincoffee.com/mcp)

落地页标题很直接，让 AI 帮你点一杯咖啡。

它宣传的能力有四块。

一句话发起下单，自动串联找店和选品，关键节点确认后再去支付。

自动匹配优惠券，尽量拿到当期最低优惠。

基于标准 MCP 协议，现有 AI 应用可以较快接上下单能力。

登录状态保留约一个月，日常使用不用反复登录。

MCP 端点是 Streamable HTTP。

`https://gwmcp.lkcoffee.com/order/user/mcp`

下面这张图是落地页本身。

<div class="article-cover">

![瑞幸咖啡 MCP 开放平台落地页](/images/luckin-coffee-mcp/02-mcp-landing.jpg)

</div>

使用示例也写得很白话。

比如「帮我来一杯冰美式」，「找一下附近的瑞幸门店」，或「帮我看一下最近的订单」。

<div class="article-cover">

![瑞幸 MCP 使用示例](/images/luckin-coffee-mcp/01-usage-examples.png)

</div>

所以它把自然语言接进工具链，没有另做一套只能在自家 App 里用的私有接口。

对做 Agent 的人来说，品牌能力第一次能以标准协议出现在工具列表里。

## Token 怎么拿？

Token 在瑞幸的 AI 控制台里复制。

MCP 和 CLI 共用这一枚 Bearer Token。

官方说法是登录状态大约能留一个月，过期再登一次就行。

<div class="article-cover">

![瑞幸 AI 控制台复制 Token（已打码）](/images/luckin-coffee-mcp/05-ai-console-token.jpg)

</div>

这枚 Token 等于你的下单身份。

别贴进公开对话，别写进仓库，别发到群里。

我的做法是放进本机 header 文件，路径大致是 `~/.config/luckin/mcp.headers` 这一类。

文件内容本文不展示。

你只要记住，Authorization 头在本机，不进聊天记录。

## 三种接入方式

官方给了三条路。

一条是 MCP 配置。

一条是 CLI。

还有一条是 Skill zip。

先说 MCP 配置。官方给了一段 JSON，Bearer 位置务必换成你自己登录后复制的 Token。

```json
{
  "mcpServers": {
    "my-coffee": {
      "type": "streamablehttp",
      "url": "https://gwmcp.lkcoffee.com/order/user/mcp",
      "headers": {
        "Authorization": "Bearer <登录后复制Token替换>"
      }
    }
  }
}
```

支持自定义 MCP 的客户端，把这段配进去就能连上远程端点。

第二条是 CLI。

落地页和文档里有命令行入口，适合你想在终端里直接调工具的时候。

<div class="article-cover">

![瑞幸 MCP CLI 接入说明](/images/luckin-coffee-mcp/03-cli.jpg)

</div>

第三条是 Skill zip，下载地址在下面。

[https://unpkg.luckincoffeecdn.com/@luckin/my-coffee-skill@latest/dist/my-coffee-skill.zip](https://unpkg.luckincoffeecdn.com/@luckin/my-coffee-skill@latest/dist/my-coffee-skill.zip)

把 zip 交给支持 Skill 的 Agent，它会按 Skill 里的流程去调 MCP。

<div class="article-cover">

![瑞幸 my-coffee Skill 说明](/images/luckin-coffee-mcp/04-skill.jpg)

</div>

我这次走的是第一条的变体：自定义 MCP 连接器。

原因很简单。插件市场当时还没有瑞幸官方插件，等上架不如自己先接。

## 八个工具各自干什么？

连接器就绪后，tools/list 能拉到下面这八个工具。

我在本机 `user-luckin-coffee` 连接器上核对过，名单一致。

| 工具 | 作用 |
|------|------|
| queryShopList | 按经纬度或店名查门店 |
| searchProductForMcp | 用自然语言在指定门店搜商品 |
| switchProduct | 切换杯型与温度，或糖度等属性 |
| queryProductDetailInfo | 查商品详情 |
| previewOrder | 预览金额、优惠券与应付 |
| createOrder | 创建订单，返回支付信息 |
| queryOrderDetailInfo | 查订单详情与取餐码 |
| cancelOrder | 取消订单 |

整条链可以压成一句话。

先找店，再选品，必要时改属性，然后预览，再下单，最后查单，不行就取消。

真正花钱的闸门，卡在 preview 之后、create 之前，以及支付链接打开之后。

这三处都必须停下来等人。

## Grok Bot 实战：市场没有插件时怎么接？

当时插件市场里还没有瑞幸官方插件。

所以我走自定义 MCP。

步骤不长。

先把 Bearer Token 写进本机 header 文件，只给本机进程读。

再用 `mcp-remote`，加上 `--header-file`，把 Authorization 头带上远程端点。

最后把这条远程 MCP 装成连接器，名字我用的是 `luckin-coffee`。

装完以后，先做两件验证。

先跑 initialize，确认会话能建起来。

tools/list 再核对一遍，名单必须是上面那八个。

两步都过了，我才敢进入自然语言点单。

这里有一个边界要说清楚。

自定义连接器只解决一件事：Agent 能不能看见瑞幸的工具。

它不替你付钱。

也不替你跳过人确认。

如果某次对话里 Agent 想直接 createOrder，我会先拦住，让它回到 preview。

## 完整点单：从一句话到桌上一杯

我跟 Grok Bot 说的大意是，附近瑞幸，来一杯大杯冰美式。

Agent 先查门店，再搜商品。

下面这张图是找店加搜品的实操截图。

本机开了 Location 权限后，按当前位置列出附近门店，再在最近店给出预估到手价。

结尾仍是，说门店和杯型，先预览，确认后再支付。

<div class="article-cover">

![Grok Bot 找店搜品（含预估到手价）](/images/luckin-coffee-mcp/08-find-shop-search.jpg)

</div>

杯型和温度不对时，再用 switchProduct 调成大杯、加冰。

然后它调用 previewOrder。

预览结果很具体。

标准美式，大杯冰，数量 1。

应付大约 ¥12.45。

原价 ¥15，优惠大约 ¥2.55。

到这里，流程停下来等人。

我确认金额和门店没问题，才让它继续 createOrder。

createOrder 之后，对话里出现了待付款状态，以及支付链接或二维码入口。

下面这张图是当时的 Agent 对话截图。

订单号、门店与支付链都已打码。

<div class="article-cover">

![Grok Bot 瑞幸下单对话（待付款，已打码）](/images/luckin-coffee-mcp/06-agent-order-chat.jpg)

</div>

支付必须我自己点。

Agent 不会、也不应该替我完成付款。

付完之后，再用 queryOrderDetailInfo 查取餐码，到店取杯。

最后桌上就是这张实拍。

杯贴写着标准美式，大杯加冰，旁边是小票。隐私字段已经打码。

<div class="article-cover">

![标准美式大杯冰实拍与小票（已打码）](/images/luckin-coffee-mcp/07-iced-americano-cup.jpg)

</div>

所以整条链路可以复述成六个动作。

自然语言找店和选品。

previewOrder 出金额。

人确认。

createOrder。

人付款。

queryOrderDetailInfo 拿取餐码。

缺了中间那两次「人」，就不该继续。

前面说到的 ¥12.45，就是这条链在我这边跑通时的应付金额。

杯贴和小票是结果，不是起点。

## 接入时要注意什么？

Token 大概一个月有效，过期就回控制台再复制一枚。

支付链接只能人点。

别想着让 Agent 自动代付，也别教别人绕过确认。

密钥放本机 header 文件。

别把完整 Token 写进对话、日志或文章。

另外，preview 和 create 是两步。

预览只是报价，创建订单才会进入待付款。

你没确认之前，不要催 Agent 往下走。

门店和订单号，还有手机号这类字段，对外分享前先打码。

本文配图都按这个标准处理过。

## MCP 把品牌能力接进 Agent，意味着什么？

以前品牌能力停在 App 里。

现在瑞幸把找店到选品，再把优惠和下单，一起收成标准 MCP 工具。

Agent 只要会调工具，就能把点咖啡接进对话。

我这次用 Grok Bot 做的，只是把这条链跑通一次，并留下可核对的截图。

你如果也在给 Agent 接外部服务，优先看三件事。

端点是不是标准协议。

Token 怎么隔离。

花钱动作有没有人确认。

这三件事清楚了，接瑞幸和接别的品牌，方法是同一套。

欢迎来 X 上找我交流，我是 [@PRO_AI_99T](https://x.com/PRO_AI_99T)。
