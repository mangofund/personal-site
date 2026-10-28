---
image: /images/how-i-design-with-ai-pt1/cover.jpg
title: 我如何用 AI 做设计（其一）
description: 工程师如何用 AI 做产品设计去 slop：从整体约束、删减、设计工具迭代，到组件库、预览部署与品味打磨。
date: 2026-10-28
category: AI
tags: [AI, 设计, Agent, Ref, UX]
draft: false
---

# 我如何用 AI 做设计（其一）

<div class="meta-line">2026.10.28 · AI · 阅读约 8 分钟</div>

> 译文整理自 [Matt Dailey（@reactiverobot）](https://x.com/reactiverobot) 的 X Article：[How I Design with AI.](https://x.com/i/article/2092403772534460416)（[原始帖](https://x.com/reactiverobot/status/2092638003789439075)）。插图保留原文配图。

*作为一个不是设计师、又讨厌 slop 的工程师。*

每个落地页、每个 app、每个 tui 看起来都一个样。它们是 slop，而且大多让人看不懂。

下面是我如何给产品设计去 slop。

## 1. Always consider the whole.（始终考虑整体）

设计过程大致三步：

1. 列出你在为之设计的全部约束。
2. 考虑能满足这些约束的一组方案。
3. 如果发现必须加一条约束，或可以去掉一条，回到 #1。

这来自 Christopher Alexander 的 *Notes on the Synthesis of Form*（《形式综合论》）。对设计过程的探讨严谨得令人愉快。

![《形式综合论》，一本很好的书。](/images/how-i-design-with-ai-pt1/media-01.jpg)

*《形式综合论》，一本很好的书。*

约束可以有很多形态。可能是字体和尺寸规则、必须支持的工作流，或业务逻辑状态。重要的是：约束由你来定。

常见问题是跳过第 3 步，玩起 design wackamole（设计打地鼠）。

用户一困惑，人就很容易跳进「解题模式」。我们团队经常被这种事 nerd sniped。尤其是左侧栏——它把太多信息和操作塞进一小块空间。**诱惑是局部 spot-fix，但那条路通向毁灭。**

![小空间里塞了大量信息和操作。避免 wackamole 式设计。](/images/how-i-design-with-ai-pt1/media-02.jpg)

*小空间里塞了大量信息和操作。避免 wackamole 式设计。*

跳过「先列出约束」的后果，是得到一块东拼西凑的补丁布：随机抬高某些交互、压低另一些。AI 会加重这种 wackamole 设计的吸引力。它鼓励你 prompt「把 X 做得更显眼」或「加一个做 Y 的 affordance」。最后，更多用户更糊涂。

**反馈来了，先评估它是否改变了你的设计约束，再跳进解决方案。** 我们的做法是维护一份文档，记录 papercuts（小刺痛）和恼人点。明显的修复会很快做掉，次要的先记着，等真正 redesign 时再整体处理。关键是避免过度反应，制造更多烂摊子。

## 2. Remove stuff.（删东西）

Agents 爱加东西。**你的工作是删掉不必要的部分。**

这应该很眼熟，因为 agents 在代码和计划里干的是同一件事。它们爱 belt-and-suspenders（双保险叠保险），多包一层 try-catch，或把同一个 utility 重写一遍又一遍。

在 UI 设计里，agents 也一样。它们爱加多余文案、线条和图标。你最后得到的是「看起来比多数工程师手搓更好、其实有点烂」的真·设计。

简单一步：盯着设计里的每一个元素，对每个元素问：「我真的需要这个吗？」

![清掉 agent 留下的垃圾。](/images/how-i-design-with-ai-pt1/media-03.jpg)

*清掉 agent 留下的垃圾。*

## 3. Iterate in a design tool.（在设计工具里迭代）

你不应该在产品里迭代设计。用一个能给你细粒度控制、又能快速迭代、且额外上下文最少的工具。

**Prototype gravity（原型引力）是沉默杀手。** 意思是：你让 agent 在代码库里做出第一版之后，就会觉得继续打磨它比探索别的方案更省事。在真实代码库里做设计，也会迫使 agent 做出一个嫁接到你真实……

Figma 仍然是 GOAT，而且 AI 集成每周都在变好。Cursor Design Mode、Claude Design、一堆新创业公司，甚至 HTML 原型也都很好。

请务必用真正为设计准备的工具，并让 AI 为每样东西生成 3–4 个变体。

![Figma 仍然是设计迭代的 GOAT。](/images/how-i-design-with-ai-pt1/media-04.jpg)

*Figma 仍然是设计迭代的 GOAT。*

## 4. Use components and libraries.（用组件和库）

对多数工程师这大概显而易见，但很重要，所以我简单说一句。

**把视图和逻辑分开。创建可复用组件。**

这不难，而且回报很大。你的 app 会视觉上统一，而不是一堆被重新实现过的按钮拼出来的补丁。

在 Ref，我们为此维护一个 /showcase 页面。先让 agents 在那里搭 UI 组件、把玩它们，再接到主应用。

![/showcase 页面，放着 Ref 的全部组件。](/images/how-i-design-with-ai-pt1/media-05.jpg)

*/showcase 页面，放着 Ref 的全部组件。*

## 5. Use preview deploys.（用预览部署）

评估设计最好的方式是用真实数据。Preview deploys 让你能在真实后端上试用新设计。

要记住：总还会有一些 polish 和返工。**就算 agent 精确按你说的做出来了，你拿着真实数据上手一试，仍可能发现不对。**

涉及前后端的大功能里，preview deploys 可能比较麻烦。在 Ref，我们用「前端 PR 和后端 PR 分开」解决。后端改动可以用单元测试和集成测试验证；前端改动需要人眼验证，而 preview deploys 让分享链接变得很容易。

![GitHub Action 为每个前端 PR 搭好 preview deploy。](/images/how-i-design-with-ai-pt1/media-06.jpg)

*GitHub Action 为每个前端 PR 搭好 preview deploy。*

## 6. Steal stuff.（偷东西）

多数 UX 问题已经被解决过了，你该做的是拆零件、再拼起来。**花点时间看看在解决类似问题、或传达类似想法的产品。**

我共事过的每一位 cracked designer（顶级设计师），每个项目开头都会先攒一堆截图。你也该这么做——发给 agent 时，这是极好的上下文。

![一位非常优秀的真·设计师收集的落地页灵感。](/images/how-i-design-with-ai-pt1/media-07.jpg)

*一位非常优秀的真·设计师收集的落地页灵感。*

## 7. Explore your taste.（探索你的品味）

这是好玩的部分！

Taste（品味）就是反思你自己对某样东西的反应。抱歉了 [Kyle Chayka](https://kylechayka.substack.com/p/why-tech-bros-are-obsessed-with-taste)，但反思自身体验并不是 Brooklyn loft 派对的专属。要创造、而不是制造 slop，这是必要的。

**产品工程师很擅长看出设计哪里不行，却很难知道该怎么修。** 工程师缺的是从经验里攒下的解决方案库。建这个库，靠的就是反复试、再反思。

玩和探索很有趣。但也可能相当残酷——因为在东西够好之前，是一波接一波的批评。

在 Ref 我们没有全职设计师，所以用一种「农业打谷」式的方法打磨品味：把设计扔到中间，用棍子抽，直到我们觉得够好。

<video autoplay loop muted playsinline controls poster="/images/how-i-design-with-ai-pt1/media-08-poster.jpg" src="/images/how-i-design-with-ai-pt1/media-08.mp4"></video>

*Ref 团队把一个设计抽到服帖。*

我就这些。GLHF.

---

本文译自 [@reactiverobot](https://x.com/reactiverobot)（Matt Dailey）的 X Article，仅供学习交流；观点属原作者。续篇见 [我如何用 AI 做设计（其二）](/ai/design/how-i-design-with-ai-pt2)。
