---
title: PRO的茶里芒果
titleTemplate: AI、投资与长期思考的中文个人博客
description: AI、投资、产品，以及一些关于世界如何运行的思考。
keywords: PRO的茶里芒果, AI 趋势, Claude, AI Agent, AI 编程, 美股投资, 特斯拉, 价值投资, 长期主义, Agent Skills
aside: false
---

<script setup>
import { withBase } from 'vitepress'
import { onMounted, onUnmounted } from 'vue'
const xmadeImg = withBase('/images/projects/xmade.jpg')
const storeUrl = 'https://chromewebstore.google.com/detail/xmade-twitter-video-downl/bgopfpaklpnjmjbngflljdnjnblhnbjm'
const streamlyricImg = withBase('/images/projects/streamlyric.jpg')
const streamlyricStoreUrl = 'https://chromewebstore.google.com/detail/streamlyric-youtube-music/faagghkdpemmnbidgnooigolgkmbkkna'
const bingImg = withBase('/images/bing-wallpaper/cover.jpg')

// 首页头条轮播:每 5 秒切换,图与下方文字同步;悬停暂停,圆点和箭头可手动切
let hcStop = null
onMounted(() => {
  const root = document.querySelector('[data-carousel]')
  if (!root) return
  const slides = [...root.querySelectorAll('.hc-slide')]
  const panels = [...root.querySelectorAll('.hc-panel')]
  const dots = [...root.querySelectorAll('.hc-dot')]
  if (slides.length < 2) return
  let cur = 0
  let timer = null
  const show = (n) => {
    cur = (n + slides.length) % slides.length
    slides.forEach((el, i) => el.classList.toggle('is-active', i === cur))
    panels.forEach((el, i) => el.classList.toggle('is-active', i === cur))
    dots.forEach((el, i) => el.classList.toggle('is-active', i === cur))
  }
  const play = () => { stop(); timer = setInterval(() => show(cur + 1), 5000) }
  const stop = () => { if (timer) { clearInterval(timer); timer = null } }
  dots.forEach((d, i) => d.addEventListener('click', () => { show(i); play() }))
  root.querySelector('.hc-prev')?.addEventListener('click', () => { show(cur - 1); play() })
  root.querySelector('.hc-next')?.addEventListener('click', () => { show(cur + 1); play() })
  root.addEventListener('mouseenter', stop)
  root.addEventListener('mouseleave', play)
  play()
  hcStop = stop
})
onUnmounted(() => { if (hcStop) hcStop() })
</script>

<!-- Latest 板块由构建脚本按当次部署目标自动生成。技能卡链到 /skills/，相对路径兼容 GitHub Pages 与 Cloudflare Pages。-->
<div class="home-page">
  <section class="home-section home-latest">
<!-- LATEST-START:以下由 scripts/gen-seo.mjs 构建时自动生成,勿手工改 -->
    <div class="home-head">
      <h1>最新文章</h1>
      <nav class="home-topics" aria-label="文章栏目"><a class="home-topic" href="/ai/">AI<span>33</span></a><a class="home-topic" href="/investment/">投资<span>7</span></a><a class="home-topic" href="/thinking/">思考<span>5</span></a><a class="home-topic is-all" href="/archive">全部 45 篇 →</a></nav>
    </div>
    <div class="article-list latest-grid">
    <div class="home-carousel" data-carousel>
      <div class="hc-stage">
        <a class="hc-slide is-active" href="/ai/trends/midterm-markets"><img class="hc-img" src="/images/midterm-markets-cover.jpg" alt="民主党赢下国会，特朗普失去控制权：2026 美国中期选举后，美股会怎么走？" loading="eager" fetchpriority="high" decoding="async" /></a>
        <a class="hc-slide" href="/ai/trends/xi-yin-ai"><img class="hc-img" src="/images/xi-yin-cover.jpg" alt="尹希说：“我不认为存在任何一种人类智力能力，是 AI 无法复制的”" loading="lazy" decoding="async" /></a>
        <a class="hc-slide" href="/ai/trends/ai-earnings-72h"><img class="hc-img" src="/images/ai-earnings-cover.jpg" alt="苹果超预期跌 4%，Palantir 翻倍也跌：72 小时财报到底在验证 AI 交易的哪一环？" loading="lazy" decoding="async" /></a>
        <button class="hc-arrow hc-prev" type="button" aria-label="上一篇">‹</button>
        <button class="hc-arrow hc-next" type="button" aria-label="下一篇">›</button>
        <div class="hc-dots"><button class="hc-dot is-active" type="button" aria-label="第 1 篇"></button><button class="hc-dot" type="button" aria-label="第 2 篇"></button><button class="hc-dot" type="button" aria-label="第 3 篇"></button></div>
      </div>
      <div class="hc-panels">
        <a class="hc-panel is-active" href="/ai/trends/midterm-markets">
          <span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-05">2026.11.05</time></span>
          <strong>民主党赢下国会，特朗普失去控制权：2026 美国中期选举后，美股会怎么走？</strong><small>民主党夺回国会两院，11 月 4 日美股却全面上涨：财政、利率、能源与 AI 数据中心的分化逻辑，以及未来 12 个月的三条情景推演。</small>
        </a>
        <a class="hc-panel" href="/ai/trends/xi-yin-ai">
          <span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-05">2026.11.05</time></span>
          <strong>尹希说：“我不认为存在任何一种人类智力能力，是 AI 无法复制的”</strong><small>哈佛物理学家尹希离开 OpenAI：AI 让他的科研编码提效至少 100 倍，也让他相信人类智力皆可复制；陶哲轩的担忧、年轻人就业缺口与智力不再稀缺后的定价转移。</small>
        </a>
        <a class="hc-panel" href="/ai/trends/ai-earnings-72h">
          <span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-03">2026.11.03</time></span>
          <strong>苹果超预期跌 4%，Palantir 翻倍也跌：72 小时财报到底在验证 AI 交易的哪一环？</strong><small>苹果与 Palantir 双双超预期却同夜下跌，AMD 实绩大超预期：72 小时财报到底在验证 AI 交易的哪一环？变现环、成本环、供给环三环拆解。</small>
        </a>
      </div>
    </div>
      <a class="article-card" href="/ai/trends/ai-manhua-rally">
        <img class="article-card-thumb" src="/images/ai-manhua-cover.jpg" alt="AI漫剧：1.5亿海外用户，多少是收入，多少只是题材？" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-03">2026.11.03</time></span><strong>AI漫剧：1.5亿海外用户，多少是收入，多少只是题材？</strong></div>
      </a>
      <a class="article-card" href="/ai/trends/anthropic-residency-500k">
        <img class="article-card-thumb" src="/images/anthropic-residency-cover.jpg" alt="Anthropic 开出 50 万美元年薪，招一批不懂 AI 的技术高手" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-03">2026.11.03</time></span><strong>Anthropic 开出 50 万美元年薪，招一批不懂 AI 的技术高手</strong></div>
      </a>
      <a class="article-card" href="/ai/agents/apple-qwen-agent">
        <img class="article-card-thumb" src="/images/apple-qwen-cover.jpg" alt="苹果等了两年半，千问 12 月住进国行 iPhone：Agent 大战为什么会在手机上见分晓？" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-02">2026.11.02</time></span><strong>苹果等了两年半，千问 12 月住进国行 iPhone：Agent 大战为什么会在手机上见分晓？</strong></div>
      </a>
      <a class="article-card" href="/ai/trends/claude-search-surge">
        <img class="article-card-thumb" src="/images/claude-search-surge/fig01_gt_compare.png" alt="Claude 搜索热度是 OpenAI 的 13 倍？开发者为什么都在用 Claude" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-10-16">2026.10.16</time></span><strong>Claude 搜索热度是 OpenAI 的 13 倍？开发者为什么都在用 Claude</strong></div>
      </a>
    </div>
    <ul class="latest-rows">
      <li><a href="/ai/agents/super-agent-design"><span class="latest-row-head"><span class="latest-row-title">DeepSeek 提出 Super-agent：AI Agent 为什么需要摆脱聊天窗口？</span><span class="latest-row-date">· <time datetime="2026-11-02">2026.11.02</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/super-agent-cover.jpg" alt="DeepSeek 提出 Super-agent：AI Agent 为什么需要摆脱聊天窗口？" loading="lazy" decoding="async" /><span class="latest-row-desc">Super-agent 不是更大的模型，而是一套让 Agent 摆脱聊天窗口、长期持续工作的架构：两层调度、事件驱动、异步执行与独立看门狗。</span></span></a></li>
      <li><a href="/investment/crypto/crypto-decentralization-shoddy"><span class="latest-row-head"><span class="latest-row-title">加密货币的“去中心化”，到底是不是草台班子？</span><span class="latest-row-date">· <time datetime="2026-10-31">2026.10.31</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/crypto-decentralization-shoddy/cover.jpg" alt="加密货币的“去中心化”，到底是不是草台班子？" loading="lazy" decoding="async" /><span class="latest-row-desc">币安热钱包约63亿美元被盗后，平台兜底、发行方冻结与执法追偿齐上阵。加密宣传里的「去中心化」，和用户实际依赖的中心化权力，究竟差在哪里。</span></span></a></li>
      <li><a href="/investment/crypto/binance-security-incident-2026"><span class="latest-row-head"><span class="latest-row-title">币安热钱包被盗约63亿美元：公司说用户不用赔，我们该看哪几条</span><span class="latest-row-date">· <time datetime="2026-10-31">2026.10.31</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/binance-security-incident-2026/cover.jpg" alt="币安热钱包被盗约63亿美元：公司说用户不用赔，我们该看哪几条" loading="lazy" decoding="async" /><span class="latest-row-desc">币安官方通报热钱包遭未授权提现，损失约63亿美元；承诺用SAFU与自有资金兜底，已备超63.4亿、链上冻结约30亿。本文按官方更新整理时间线，并标出可核对的后续节点。</span></span></a></li>
      <li><a href="/ai/trends/hongguo-ai-attention"><span class="latest-row-head"><span class="latest-row-title">红果日活1.68亿，人均每天看两小时：真正可怕的，是AI开始批量生产你的注意力</span><span class="latest-row-date">· <time datetime="2026-10-29">2026.10.29</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/hongguo-ai-attention/cover.jpg" alt="红果日活1.68亿，人均每天看两小时：真正可怕的，是AI开始批量生产你的注意力" loading="lazy" decoding="async" /><span class="latest-row-desc">红果日活1.68亿、人均单日125分钟。秦朔看到“字节时间”，程苓峰看到AI短剧的“核爆”。当内容几乎可以无限生成，真正稀缺的是人的注意力，以及自主分配它的能力。</span></span></a></li>
      <li><a href="/ai/agents/luckin-coffee-mcp"><span class="latest-row-head"><span class="latest-row-title">如何让Grokbot帮我点一杯瑞幸咖啡</span><span class="latest-row-date">· <time datetime="2026-10-29">2026.10.29</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/luckin-coffee-mcp/cover.jpg" alt="如何让Grokbot帮我点一杯瑞幸咖啡" loading="lazy" decoding="async" /><span class="latest-row-desc">瑞幸开放标准 MCP 后，我用 Grok Bot 自定义连接器真实下单了一杯大杯冰美式；文末附滴滴、高德、麦当劳等国内 MCP 入口。</span></span></a></li>
      <li><a href="/ai/trends/claude-prevent-ban-guide"><span class="latest-row-head"><span class="latest-row-title">Claude预防封号保姆级教程</span><span class="latest-row-date">· <time datetime="2026-10-29">2026.10.29</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/claude-prevent-ban-guide/cover.jpg" alt="Claude预防封号保姆级教程" loading="lazy" decoding="async" /><span class="latest-row-desc">从积分制、注册、支付、固定 IP、客户端分工到观察期处置与一页清单，整理 Claude 防封的社区经验（非官方）。主线：环境先于付款，稳定先于一切。</span></span></a></li>
    </ul>
    <!-- LATEST-END -->
  </section>

  <section class="home-section">
    <div style="display:flex;align-items:baseline;justify-content:space-between;gap:12px;">
      <h2>技能商店</h2>
      <a href="skills/" style="font-size:14px;color:#1d9bf0;white-space:nowrap;">进入技能商店 →</a>
    </div>
    <SkillShowcase />
  </section>

  <section class="home-section" id="projects">
    <div style="display:flex;align-items:baseline;justify-content:space-between;gap:12px;">
      <h2>项目</h2>
      <a href="projects/" style="font-size:14px;color:#1d9bf0;white-space:nowrap;">查看全部项目 →</a>
    </div>
    <div class="project-list project-list-home">
      <article class="project-tile">
        <a class="skill-thumb" :href="storeUrl" target="_blank" rel="noopener">
          <img :src="xmadeImg" alt="XMade：一键下载 X 上的推文、视频和长文" width="800" height="450" loading="lazy" decoding="async" />
        </a>
        <h3><a :href="storeUrl" target="_blank" rel="noopener">XMade</a></h3>
        <p class="skill-pitch">Chrome 扩展：一键下载 X 上的推文、视频和长文，整理好直接推送到微信公众号草稿。我自己每天在用的工具。</p>
        <div class="skill-foot">
          <span class="skill-chip">Chrome 扩展</span>
          <div class="skill-controls">
            <a class="skill-zip" :href="storeUrl" target="_blank" rel="noopener">去 Chrome 应用店安装 →</a>
          </div>
        </div>
      </article>
      <article class="project-tile">
        <a class="skill-thumb" :href="streamlyricStoreUrl" target="_blank" rel="noopener">
          <img :src="streamlyricImg" alt="StreamLyric：给 YouTube Music 加上同步歌词" width="800" height="450" loading="lazy" decoding="async" />
        </a>
        <h3><a :href="streamlyricStoreUrl" target="_blank" rel="noopener">StreamLyric</a></h3>
        <p class="skill-pitch">Chrome 扩展：给 YouTube Music 加上同步歌词，字体、颜色、布局都能调，调好了一键推到 OBS，直播、录屏都能用。</p>
        <div class="skill-foot">
          <span class="skill-chip">Chrome 扩展</span>
          <div class="skill-controls">
            <a class="skill-zip" :href="streamlyricStoreUrl" target="_blank" rel="noopener">去 Chrome 应用店安装 →</a>
          </div>
        </div>
      </article>
      <article class="project-tile">
        <a class="skill-thumb" href="https://fairzy.github.io/bingwallpaper-for-mac/" target="_blank" rel="noopener">
          <img :src="bingImg" alt="必应每日壁纸 for Mac：每天自动把必应每日图片设成桌面" width="800" height="450" loading="lazy" decoding="async" />
        </a>
        <h3><a href="https://fairzy.github.io/bingwallpaper-for-mac/" target="_blank" rel="noopener">必应每日壁纸 for Mac</a></h3>
        <p class="skill-pitch">开源应用：用 REA 逆向 Windows 官方必应壁纸的行为，在 macOS 上用 Swift 原生复刻。只占菜单栏，每天自动换上必应每日图片，MIT 开源，免费。</p>
        <div class="skill-foot">
          <span class="skill-chip">macOS 应用 · 开源</span>
          <div class="skill-controls">
            <a class="skill-zip" href="/ai/products/bing-wallpaper-for-mac">看介绍 →</a>
            <a class="skill-zip" href="https://github.com/fairzy/bingwallpaper-for-mac" target="_blank" rel="noopener">GitHub →</a>
          </div>
        </div>
      </article>
    </div>
  </section>

</div>
