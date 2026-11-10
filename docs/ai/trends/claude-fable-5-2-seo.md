---
image: /images/claude-fable-5-2-seo-1.jpg
title: 如何用 Claude Fable 5.2 做 SEO，好到感觉像犯法
description: Nicholas Dulait 的 X 长文译文：用 Claude Fable 5.2 搭配 ChatSEO 做 SEO 的全套打法——从 Search Console 里挑关键词，到写出值得谷歌排名的页面，每一步都有提示词。
date: 2026-11-10
category: AI
tags: [AI, Claude, SEO, 翻译]
draft: false
---

# 如何用 Claude Fable 5.2 做 SEO，好到感觉像犯法

<div class="meta-line">2026.11.10 · AI · 阅读约 12 分钟</div>

<div class="article-cover">

![如何用 Claude Fable 5.2 做 SEO，好到感觉像犯法](/images/claude-fable-5-2-seo-1.jpg)

</div>

> 本文为译文。原文作者 Nicholas Dulait（@NicholasDulait），2026 年 11 月 10 日发表于 X。[阅读原文](https://x.com/nicholasdulait/status/2120063043614716174)。

FABLE 5.2 昨天刚发布，这就是全套 SEO 打法，免费。别滑过去。

Anthropic 在 11 月 9 日发布了 Fable 5.2，输入 token 每百万 8 美元，比 Fable 5.1 的 10 美元便宜，速度还快了最多 30%。

这周所有人都会拿它去测代码，几乎没人会把它指向自己的 Search Console。

钱就在这里。

![ChatSEO 数据看板截图](/images/claude-fable-5-2-seo-2.jpg)

-> 想为你的业务拿到类似的结果：[CHATSEO.APP 免费试用 7 天](https://chatseo.app/)

这就是全套打法。从 Search Console 里拿一个关键词，到做出一个谷歌有理由给排名的页面，每一步都有提示词。

全文用的例子是一家家具店，要攻 "oak coffee table" 这个词。换成你自己的就行。

收藏这篇。你会回来找它的。

## 开始之前：先更新 Claude Code，否则它不认这个模型

Fable 5.2 是一个新的模型 ID，旧版 Claude Code 不知道它的存在。

所以前两条命令很无聊，但一步都不能跳：

```
claude update
claude --model claude-fable-5-2 --effort high
```

Fable 5.2 随 Claude Code 2.1.321 一起发布。运行 `claude --version` 看一下：再老的版本都不认这个模型。

然后记住 Fable 5.2 自己不可能知道的事：

- 每个月有多少人搜 "oak coffee table"
- 你的点击、展示和排名
- 谷歌今天在结果页上展示了什么
- 哪些竞争对手的页面正在抢走你的流量

你问它，它还是会答，答的是它训练数据里的东西。你在那个答案上建的一切，都是猜。

所以这份工作分成三部分：

- Fable 5.2 是手。它负责规划、写作、检查。
- ChatSEO 是大脑。它通过 MCP 带来你的 Search Console、关键词搜索量、实时结果页和竞争对手的页面。
- 你是老板。没有你的同意，什么都不能上线。

![四步流程图](/images/claude-fable-5-2-seo-3.jpg)

要接上这个大脑，先注册一个 ChatSEO 账号，添加你的网站，接上 Search Console，再把 MCP 加到 Claude Code 里：

```
claude mcp add --transport http chatseo https://api.chatseo.app/mcp
```

从现在起，下面每个提示词用的都是真实数据，而不是模型的记忆。

![ChatSEO 数据看板截图](/images/claude-fable-5-2-seo-4.jpg)

-> 想为你的业务拿到类似的结果：[CHATSEO.APP 免费试用 7 天](https://chatseo.app/)

## 1. 动笔之前，先挑能赚钱的关键词

模型再好，给错的关键词写页面，也只会让你更快地归零。

"What is a coffee table" 能带来访客，但搜这个词的人没一个是来买东西的。

"oak coffee table" 是手里拿着卡的人会搜的词。

你不需要工具来判断搜索意图，因为谷歌已经替你测过了。搜一下这个关键词，看看排在前面的是什么：

- 博客文章，顶部还有一个定义框：这是信息型。先跳过。
- 产品页、带价格的分类页：这是商业型。这就是你的目标。

然后是第二个过滤条件，这个条件能毙掉大多数项目：以你的体量，你能打赢这个结果页吗？

![关键词筛选示意图](/images/claude-fable-5-2-seo-5.jpg)

用 ChatSEO，给我网站最好的 SEO 策略。然后：

1. 只保留那些当前前 3 名是产品页、分类页或落地页的关键词。被博客文章主导的，全删掉。
2. 对剩下的每个关键词，告诉我有没有和我体量差不多的网站能排进前 10。如果前 10 全是大品牌，标记为 LATER。
3. 给我最值得先做的 10 个关键词：关键词、月搜索量、谷歌想要的页面类型。
4. 只用 ChatSEO 返回的搜索量。绝不估算。

第 4 条是大多数人会跳过的那条线。如果模型给你的搜索量不是任何工具给它的，那它就是在猜。

## 让我们头几个月付出代价的错误

在做 ChatSEO 之前，我和 Paul 做过一个商业计划生成器。

机会是真实的：几千个查询，竞争低，购买意图明显。

所以我们快速上线，快速发布。

它从来没有排上去过。不是慢，是从来没有。

我们当时是一个全新的域名，零品牌搜索，零外链，发布速度快得像谷歌归类为"批量生成"的每一个网站。

-> 我们当时籍籍无名，却声势浩大。

2024 年 3 月，谷歌把"规模化内容滥用"加进了垃圾内容政策。不管内容来自自动化、人工，还是两者都有，都适用。

量本身不是违规。没有增量的页面才是。

模型更快，只会让这个错误重复得更便宜，这正是你为什么要先过滤。

## 2. 把 Fable 花在页面上，而不是花在分拣上

Fable 5.2 是贵的引擎，所以 effort 级别是一个预算决策。

Medium 是 Claude Code 里的默认值。Anthropic 说 5.2 在 Medium 下用的 token 比 5.1 更少。

在 Pro 和标准 Team 席位上，Fable 包含在你每周用量上限的最多 50% 里。把这些烧在分拣关键词上，真正重要的页面就没剩下的了。

我是这么分工的：

- Low：清理导出文件、给关键词分组、重命名列。
- Medium：读前 3 名的页面，抽出大纲。
- High：写 "oak coffee table" 这个页面本身。
- Xhigh：那个你都不想看到它出现在第四页的页面。

![按工作类型分级的四卡片图](/images/claude-fable-5-2-seo-6.jpg)

把分拣的工作放在单独的会话里，用 Low 起手：

```
claude --model claude-fable-5-2 --effort low
```

已经在一个会话里了？输入 `/effort`，选 Low，不用重启。

-> 同一个模型，不需要动脑子的工作，花费只是零头。

## 3. 一个关键词，一个页面，比前 3 名更好

最贵的错误，是写了一个你已经有的页面。

两个页面抢 "oak coffee table"，会分散谷歌的注意力，两个都赢不了。

动笔之前，先做 Paul 亲手做的那道检查：打开 Search Console，进 Performance，按这个精确搜索词过滤，再看 Pages 标签页。如果已经有一个页面出现了，你要做的是改进它，而不是再写一个。

然后切到 High，照着已经排上去的页面来建你的页面。

用 ChatSEO，拉取 "oak coffee table" 的前 3 名结果，读它们的页面。

1. 列出 3 个页面都有的每个部分。我的页面每个都要有。
2. 列出只有其中 1 个有的。说它值不值得抄。
3. 找出 3 个都没有、而我能加的东西，只用我真正能展示的（木纹照片、真实尺寸、保养指南、送货时间）。
4. 写大纲：一个带关键词的 H1、H2、每节写什么。
5. 然后写页面。每个无法核实的事实都标上 [CHECK]。

第 3 步就是全部。只做到和前 3 名一样，你的页面就是同一页面的第十个复制品，而谷歌已经有九个了。

![页面结构的三种内容来源](/images/claude-fable-5-2-seo-7.jpg)

Anthropic 说 5.2 比 5.1 表达得更清楚。这会让初稿更好，但不等于写完了。

然后你逐行改，逐个改 [CHECK]。页面上署的是你的名字，不是模型的。

![ChatSEO 数据看板截图](/images/claude-fable-5-2-seo-8.jpg)

想为你的业务拿到类似的结果：[CHATSEO.APP 免费试用 7 天](https://chatseo.app/)

## 4. 在谷歌之前，先检查 Fable 写的东西

排不上去的页面，大多数都栽在检查清单能发现的问题上。

这份清单是给 "oak coffee table" 这个页面的：

- Title 标签。关键词尽量靠前，60 个字符以内，为点击而写。
- Meta 描述。一句话，说清读者能得到什么。
- 一个 H1。带关键词。只能有一个。
- URL。短，带关键词，不要日期。
- 内链。至少有 2 个你自己的页面链向它，用的词要能说明它是什么。
- 图片。压缩过，alt 文本要说清图里是什么。
- 结构化数据。Product，带价格和库存状态。

把 Fable 指向这个页面的线上 URL，跑下面这段：

```
读取 [URL] 的 HTML，这是我针对 "oak coffee table" 的页面。

按这份清单检查，给我一张通过/不通过的表：
title 标签、meta 描述、带关键词的唯一 H1、URL、
指向内外的内链、图片 alt 文本、结构化数据。

每个不通过的项，都写出确切的修复：新的标题、新的 meta、
可以直接粘贴的 Product JSON-LD 代码块。
```

JSON-LD 那里是模型真正值钱的地方。没有人会手写两次结构化数据。

## Sitemap 陷阱

你的 sitemap 告诉谷歌哪些页面存在。

Paul 当时在测 ChatSEO 的一个功能，要读一个网站的 sitemap，它一直忽略他前一天刚发布的一个页面。页面是 live 的，但 sitemap 停止更新了。

没有任何提醒。每次发布后，都要检查你最新的页面是不是已经进了 sitemap。

## 5. 每周一，让 Search Console 告诉 Fable 该修什么

几周之后，谷歌会告诉你下一步该做什么，而大多数人从来不问。

找那些你排在第 5 到第 15 位的搜索。谷歌已经觉得你相关了，所以你离首页只差一次好的修改。

用 ChatSEO，看我过去 28 天的 Search Console。

1. 列出平均排名在 5 到 15 位之间的搜索，带上点击、展示和排名的页面。
2. 按页面分组。
3. 对展示量最大的 3 个页面，告诉我该加什么、改什么，才能让页面更好地回答这些搜索。
4. 跳过我过去 60 天内改过的页面。谷歌还没重新读过它们。

用 Medium 跑。它是在读，不是在写。

![排名位置与每周循环横幅图](/images/claude-fable-5-2-seo-9.jpg)

每周一小时。这就是整个循环。

## 我可能错的地方，或者说只是运气好

Fable 5.2 才出来一天。模型是昨天发布的。这篇文章里没有任何一项是 5.2 的排名结果，它是我们已经在跑的那套打法，换了一个更新的引擎。

基准测试是 Anthropic 的。更快、更便宜、写得更清楚：那是他们的发布文章，不是我们的测试。Anthropic 自己也写道："For most coding and knowledge tasks, we recommend that users start with Claude Opus 5.5, our strongest daily driver."

我们起步时是有观众的。Paul 是法国最知名的 SEO 之一。我们早期的一些链接，是因为有人认识这个名字才来的。一个没有品牌的网站，起步会比我们慢。

我确信能推广的是顺序。我不确信能推广的是 5.2 到底能带来多大的提升。

## 今晚我会怎么做

- 运行 `claude update`，然后用 High 起手 Fable 5.2
- 接上 ChatSEO MCP，让每个答案都来自真实数据
- 挑 10 个关键词，搜的人手里拿着卡，前 10 名还不全是大品牌
- 用 High 写一个页面，比前 3 名更好，逐行改
- 跑一遍页面检查，再检查 sitemap
- 每周一，用 Medium 修离首页最近的 3 个页面

按这个顺序，因为每一步都只有在上一步存在时才成立。

更新。挑能赚钱的词。把力气花在一个页面上。检查。然后每周一重复。

感谢阅读！

🎁 如果你想（免费）聘请你的第一位 AI SEO 员工，可以[点击这里](https://chatseo.app/?utm_source=x&utm_medium=x-article&utm_campaign=fable-5-2-seo&utm_content=nicho&utm_term=en)。
