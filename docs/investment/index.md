---
title: 投资
description: 投资是对未来现金流、竞争结构与人类行为的长期判断。这里记录美股、Tesla、AI 基础设施、资产配置与投资方法论。
layout: page
sidebar: false
pageClass: archive-discover
---

<script setup>
import { ref } from 'vue'
// 子栏目筛选:'all' 或子目录名;卡片和标签的绑定由 scripts/gen-seo.mjs 生成
const filter = ref('all')
</script>

<div class="archive-page">
<header class="archive-header">
<h1>投资</h1>
<p>对未来现金流、竞争结构与人类行为的长期判断。文章不构成投资建议。</p>
</header>
<div class="archive-layout is-single">
<div class="archive-main">

<!-- INVESTMENT-FEED-START:以下由 scripts/gen-seo.mjs 构建时自动生成,勿手工改 -->
<div class="archive-tabs" role="group" aria-label="按分类筛选"><button type="button" class="archive-tab" :aria-pressed="filter === 'all'" @click="filter = 'all'">全部<span>7</span></button><button type="button" class="archive-tab" :aria-pressed="filter === 'tesla'" @click="filter = 'tesla'">Tesla<span>2</span></button><button type="button" class="archive-tab" :aria-pressed="filter === 'us-stocks'" @click="filter = 'us-stocks'">美股<span>2</span></button><button type="button" class="archive-tab" :aria-pressed="filter === 'methodology'" @click="filter = 'methodology'">方法论<span>1</span></button><button type="button" class="archive-tab" :aria-pressed="filter === 'crypto'" @click="filter = 'crypto'">加密货币<span>2</span></button></div>
<div class="feed-list">
<a class="feed-row" href="/investment/crypto/crypto-decentralization-shoddy" data-cat="crypto" v-show="filter === 'all' || filter === 'crypto'"><div class="feed-row-head"><strong>加密货币的“去中心化”，到底是不是草台班子？</strong><span class="feed-row-date"> · <time datetime="2026-10-31">2026.10.31</time></span></div><div class="feed-row-body"><div class="feed-row-thumb"><img class="archive-card-img" src="/images/crypto-decentralization-shoddy/cover.jpg" alt="加密货币的“去中心化”，到底是不是草台班子？" loading="eager" fetchpriority="high" decoding="async" /></div><p>币安热钱包约63亿美元被盗后，平台兜底、发行方冻结与执法追偿齐上阵。加密宣传里的「去中心化」，和用户实际依赖的中心化权力，究竟差在哪里。</p></div></a>
<a class="feed-row" href="/investment/crypto/binance-security-incident-2026" data-cat="crypto" v-show="filter === 'all' || filter === 'crypto'"><div class="feed-row-head"><strong>币安热钱包被盗约63亿美元：公司说用户不用赔，我们该看哪几条</strong><span class="feed-row-date"> · <time datetime="2026-10-31">2026.10.31</time></span></div><div class="feed-row-body"><div class="feed-row-thumb"><img class="archive-card-img" src="/images/binance-security-incident-2026/cover.jpg" alt="币安热钱包被盗约63亿美元：公司说用户不用赔，我们该看哪几条" loading="lazy" decoding="async" /></div><p>币安官方通报热钱包遭未授权提现，损失约63亿美元；承诺用SAFU与自有资金兜底，已备超63.4亿、链上冻结约30亿。本文按官方更新整理时间线，并标出可核对的后续节点。</p></div></a>
<a class="feed-row" href="/investment/us-stocks/alphabet-q3-earnings-miss" data-cat="us-stocks" v-show="filter === 'all' || filter === 'us-stocks'"><div class="feed-row-head"><strong>Alphabet Q3：销售额和利润双双不及预期，云是唯一亮点</strong><span class="feed-row-date"> · <time datetime="2026-10-29">2026.10.29</time></span></div><div class="feed-row-body"><div class="feed-row-thumb"><img class="archive-card-img" src="/images/alphabet-q3-cover.webp" alt="Alphabet Q3：销售额和利润双双不及预期，云是唯一亮点" loading="lazy" decoding="async" /></div><p>Alphabet 第三季度营收 1276亿美元、每股收益 2.12美元，均低于预期；自由现金流 -90.7亿美元，连续两季为负；谷歌云营收 307.1亿美元、增长 103%，成为本季唯一亮点。</p></div></a>
<a class="feed-row" href="/investment/methodology/ai-invest-clear" data-cat="methodology" v-show="filter === 'all' || filter === 'methodology'"><div class="feed-row-head"><strong>AI 越成功，投资者越需要保持清醒</strong><span class="feed-row-date"> · <time datetime="2026-10-18">2026.10.18</time></span></div><div class="feed-row-body"><div class="feed-row-thumb"><img class="archive-card-img" src="/images/ai-invest-clear/cover.jpg" alt="AI 越成功，投资者越需要保持清醒" loading="lazy" decoding="async" /></div><p>李录在 2026 年格雷厄姆—多德午餐会上把 AI 的技术前景与资本市场的定价逻辑分开：技术能走多远、企业能赚多少、价格计入多少，是三道不同的题目。</p></div></a>
<a class="feed-row" href="/investment/tesla/q3-earnings-preview" data-cat="tesla" v-show="filter === 'all' || filter === 'tesla'"><div class="feed-row-head"><strong>特斯拉 Q3 财报前瞻：会飞的 Roadster 之后，真正决定股价的是什么</strong><span class="feed-row-date"> · <time datetime="2026-10-16">2026.10.16</time></span></div><div class="feed-row-body"><div class="feed-row-thumb"><img class="archive-card-img" src="/images/tesla-q3/cover.webp" alt="特斯拉 Q3 财报前瞻：会飞的 Roadster 之后，真正决定股价的是什么" loading="lazy" decoding="async" /></div><p>Roadster 是营销，不是营收。10 月 21 日财报更该盯 FSD/Robotaxi、HW3 拿不到 v15，以及交付与利润率。</p></div></a>
<a class="feed-row" href="/investment/us-stocks/ai-stage-invest-guide" data-cat="us-stocks" v-show="filter === 'all' || filter === 'us-stocks'"><div class="feed-row-head"><strong>AI 进行到哪一步了？普通人如何投资美股</strong><span class="feed-row-date"> · <time datetime="2026-10-06">2026.10.06</time></span></div><div class="feed-row-body"><div class="feed-row-thumb"><img class="archive-card-img" src="/images/ai-guide-two-axes.png" alt="AI 进行到哪一步了？普通人如何投资美股" loading="lazy" decoding="async" /></div><p>用“技术成熟度 × 商业兑现”两轴给 AI 进程定位：基础设施正在兑现，应用层开始分化。阶段不同，投资策略完全不同。</p></div></a>
<a class="feed-row" href="/investment/tesla/long-term-value" data-cat="tesla" v-show="filter === 'all' || filter === 'tesla'"><div class="feed-row-head"><strong>Tesla 的长期价值究竟来自汽车吗？</strong><span class="feed-row-date"> · <time datetime="2026-09-24">2026.09.24</time></span></div><div class="feed-row-body"><div class="feed-row-thumb"><img class="archive-card-img" src="/images/tesla-three-layers.png" alt="Tesla 的长期价值究竟来自汽车吗？" loading="lazy" decoding="async" /></div><p>把一家公司的价值拆成制造、软件与能源三层。</p></div></a>
</div>
<!-- INVESTMENT-FEED-END -->

</div>
</div>
</div>
