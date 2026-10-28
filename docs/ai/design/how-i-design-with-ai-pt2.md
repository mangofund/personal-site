---
image: /images/how-i-design-with-ai-pt2/cover.jpg
title: 我如何用 AI 做设计（其二）
description: 用大量 agents 设计复杂功能时如何少塞 slop：先理解系统、追踪轨迹、扫全状态、放大关键界面，再和团队打磨后发版。
date: 2026-10-28
category: AI
tags: [AI, 设计, Agent, Ref, UX]
draft: false
---

# 我如何用 AI 做设计（其二）

<div class="meta-line">2026.10.28 · AI · 阅读约 9 分钟</div>

> 译文整理自 [Matt Dailey（@reactiverobot）](https://x.com/reactiverobot) 的 X Article：[How I Design with AI. (pt 2)](https://x.com/i/article/2114870495447564289)（[原始帖](https://x.com/reactiverobot/status/2115075879923765615)）。插图保留原文配图。

我讨厌 slop（烂设计/注水输出）。你也讨厌。而 agents 却特别爱把 slop 塞进我们的设计里。

在 [Part 1](/ai/design/how-i-design-with-ai-pt1) 里，我讲过针对单个界面（surface）的 AI 设计流程。现实是：今天我们常常用一条 prompt 做跨越许多界面的复杂功能，这给了 agents 大量制造混乱的机会。

下面是我如何用大量 agents、尽量少的 slop，去设计复杂功能。

<video autoplay loop muted playsinline controls poster="/images/how-i-design-with-ai-pt2/media-01-poster.jpg" src="/images/how-i-design-with-ai-pt2/media-01.mp4"></video>

*复杂功能里，每一屏都是 agent 往你设计里塞 slop 的机会。*

## 1. Understand how it works.（先搞懂它怎么工作）

"Good design makes a product understandable."  —Dieter Rams

推论：不先理解产品，就做不出好设计。

![居然引用 Dieter Rams？这人一定很懂。](/images/how-i-design-with-ai-pt2/media-02.jpg)

*居然引用 Dieter Rams？这人一定很懂。*

我在研究和规划阶段会花很多时间。**我不想在复杂功能落地时，被 agents 做出的技术或产品决策吓一跳。**

那是不是意味着我要读每一行代码？当然不是。

这一阶段，我是在给 agents 要穿越的地形画一张心智地图。我想清楚它们会碰到哪些产品界面、面对哪些技术约束，好让它们能做出像样的选择。

举例：我们最近给 Ref 加了 ACP 支持，让用户能在浏览器里控制笔记本和云端机器上的远程 agents。我需要先理解 ACP、用户会经过的状态，以及设计空间的约束。我亲手写下想启用的流程，然后问了大量「它到底怎么工作」的问题。**真正建立理解既费时间，也需要好奇心。**

![关于用 ACP 管理远程 agents 的研究。](/images/how-i-design-with-ai-pt2/media-03.jpg)

*关于用 ACP 管理远程 agents 的研究。*

## 2. Trace the agent's trajectory.（追踪 agent 走过的路径）

把计划交给 agent，然后去院子里陪孩子玩。我希望回来时，看到的是一个大致可用、功能雏形在、设计大概很烂的版本。这是我们要捏的泥巴。

**Trace（轨迹）是我们第一次抓住 slop 惊喜的机会。** Agent 做完后，我会快速浏览它产出的全部产物，看实现路径有没有异常偏离。如果和预期差得很大，说明我还停在第 1 步，需要更好地理解这个功能。

![可能暴露「惊喜」的产物：进度日志、演示视频、截图和 PR。](/images/how-i-design-with-ai-pt2/media-04.jpg)

*可能暴露「惊喜」的产物：进度日志、演示视频、截图和 PR。*

## 3. Zoom out and look at everything.（拉远，把所有状态看一遍）

一旦做出来，我的个人规矩是：**用户可能碰到的每一个状态，都要看过。** 可以是 stub 数据，设计可以很烂，但发版前我至少得把眼睛扫过每个状态。

以前靠人做这件事特别烦，但 agents 很乐意配合。我会让 agent 点开每一个界面上的每一个状态，并输出两样东西：

1. 按界面分组的、该功能全部状态的截图集合。
2. 途中遇到的一堆 bug。（这基本是白送的奖金。）

🧹 我用的 skill：[/ui-sweep](https://github.com/ref-tools/marketplace/tree/main/plugins/ref-skills)

<video controls playsinline poster="/images/how-i-design-with-ai-pt2/media-05-poster.jpg" src="/images/how-i-design-with-ai-pt2/media-05.mp4"></video>

*Ref 里所有与 ACP 相关界面的截图。*

我先快速扫一遍找惊喜。不抠细节，只确认眼前的屏幕是我预期的那些，没有多出新东西。这也是又一次发现「我其实还不懂这个功能、得退回第 1 步」的机会。

如果到这里还没有惊喜，我就开始往下滚，标出那些小而明显的修复。我们还没有完美的设计系统或 DESIGN.md，所以总有一堆小改动要分流处理。

这是流程里**我反复说「把这个删掉」**的阶段。只要你放任，agents 就爱把所有多余的元数据塞进 UI。别放任！删东西是 [Part 1 的 Rule #2](/ai/design/how-i-design-with-ai-pt1#2-remove-stuff删东西)。

![滚动那一长串截图，标出显而易见的小修复。](/images/how-i-design-with-ai-pt2/media-06.jpg)

*滚动那一长串截图，标出显而易见的小修复。*

## 4. Zoom in on the crux surfaces.（放大关键界面）

有些界面或交互需要更多注意力。它们是设计流程的 crux（关键点）：做对了，功能才真正成立。做复杂功能的艺术，就在于选对这些界面。

**Crux surfaces 是情境相关的。** 对一个功能最重要的界面，对另一个可能无所谓。它可能是最耗时的一步、onboarding、快捷键、焦点态，或任何东西。如果第 1 步做扎实、真的理解了功能，你就会知道。

一旦锁定 crux surfaces，我会把它们拉到 Figma 或 HTML 原型里。然后就好玩了。

**我允许自己放松下来，专注细节。** 在 AI 世界里，我同时干十件事，还不停问那个「tokenmaxxing」问题：「这事为什么要我做，不能让 agent 做？」有时这真挺糟的。放大一个关键功能，是我能把世界关在门外、认真做出好东西的时候。

![对 ACP 来说，聊天视图是一个 crux surface，需要最多 TLC（精心打磨）。](/images/how-i-design-with-ai-pt2/media-07.jpg)

*对 ACP 来说，聊天视图是一个 crux surface，需要最多 TLC（精心打磨）。*

再来一张，因为这才是好玩的部分。

<video autoplay loop muted playsinline controls poster="/images/how-i-design-with-ai-pt2/media-08-poster.jpg" src="/images/how-i-design-with-ai-pt2/media-08.mp4"></video>

*做一个定制工具，探索我们 onboarding 的时机。*

## 5. Get out of the silo and refine with the team.（走出孤岛，和团队一起打磨）

人类反馈无可替代。不幸的是，今天比以往任何时候都更难拿到。

这些年我一个人就能做超大功能。曾经要一整个工程师团队分担的实现，现在一个人就干完了。效率提升的问题是：**我们丢掉了一整队本来会打磨功能的意见。**

我很想相信自己品味无懈可击，但这完全不对。我喜欢信息密集、文字很多的 UI。结果是，我爱的东西会让别人眼睛出血，所以我依赖团队来拯救用户的视网膜。

我们的流程是：发到 staging、自己先用（dogfood），再一起清理不完美之处。我们用一个叫 #design-adjustments 的 Slack 频道，谁都能跳进去提设计微调、修自己发现的问题。唯一规则是：发说明，并附上前后对比截图。

![在 #design-adjustments 分享，让团队对齐、又不卡流程。](/images/how-i-design-with-ai-pt2/media-09.jpg)

*在 #design-adjustments 分享，让团队对齐、又不卡流程。*

## 6. Ship, learn, and expect surprises.（发版、学习，并预期惊喜）

这句话永远成立，也值得反复说。到头来，没有什么会完美。但如果你做的东西真有价值，又已经放大并打磨过关键交互，用户仍会感谢你……然后给你惊喜。

复杂功能里，总有你没料到的交互，而用户几乎一定会找到它。**你只能交到他们手里，才能搞清楚。**

![我们爱用户的创造力。](/images/how-i-design-with-ai-pt2/media-10.jpg)

*我们爱用户的创造力。*

GLHF!

---

本文译自 [@reactiverobot](https://x.com/reactiverobot)（Matt Dailey）的 X Article，仅供学习交流；观点属原作者。上篇见 [我如何用 AI 做设计（其一）](/ai/design/how-i-design-with-ai-pt1)。
