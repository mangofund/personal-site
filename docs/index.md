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
      <nav class="home-topics" aria-label="文章栏目"><a class="home-topic" href="/ai/">AI<span>36</span></a><a class="home-topic" href="/investment/">投资<span>7</span></a><a class="home-topic" href="/thinking/">思考<span>6</span></a><a class="home-topic is-all" href="/archive">全部 49 篇 →</a></nav>
    </div>
    <div class="article-list latest-grid">
    <div class="home-carousel" data-carousel>
      <div class="hc-stage">
        <a class="hc-slide is-active" href="/ai/trends/ai-datacenter-moratorium"><img class="hc-img" src="/images/ai-datacenter-moratorium-cover.jpg" alt="AI数据中心突然被叫停：算力基建的监管拐点到了" loading="eager" fetchpriority="high" decoding="async" /></a>
        <a class="hc-slide" href="/ai/trends/tesla-cybertruck-winddown"><img class="hc-img" src="/images/tesla-cybertruck-winddown-cover.jpg" alt="特斯拉逐步停产Cybertruck：是在止血，还是在认输" loading="lazy" decoding="async" /></a>
        <a class="hc-slide" href="/ai/trends/us-market-crash-retail"><img class="hc-img" src="/images/us-market-crash-cover.jpg" alt="美股暴跌一天蒸发约1万亿，散户现在该干什么" loading="lazy" decoding="async" /></a>
        <button class="hc-arrow hc-prev" type="button" aria-label="上一篇">‹</button>
        <button class="hc-arrow hc-next" type="button" aria-label="下一篇">›</button>
        <div class="hc-dots"><button class="hc-dot is-active" type="button" aria-label="第 1 篇"></button><button class="hc-dot" type="button" aria-label="第 2 篇"></button><button class="hc-dot" type="button" aria-label="第 3 篇"></button></div>
      </div>
      <div class="hc-panels">
        <a class="hc-panel is-active" href="/ai/trends/ai-datacenter-moratorium">
          <span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-07">2026.11.07</time></span>
          <strong>AI数据中心突然被叫停：算力基建的监管拐点到了</strong><small>得州选出承诺叫停数据中心审批的州长，40比1的地方公投，474吉瓦并网排队。暂停早就存在，选举改写的是解除暂停的预期——地方政府为什么从抢项目转向踩刹车，三条链会怎么传导。</small>
        </a>
        <a class="hc-panel" href="/ai/trends/tesla-cybertruck-winddown">
          <span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-07">2026.11.07</time></span>
          <strong>特斯拉逐步停产Cybertruck：是在止血，还是在认输</strong><small>11月6日，Musk 宣布特斯拉逐步停产 Cybertruck，2027 年年中德州工厂停产、给 Cybercab 让产能。拆一笔产品账：三年销量、价格锚、皮卡市场水土不服，停产省的是什么、认的是什么。</small>
        </a>
        <a class="hc-panel" href="/ai/trends/us-market-crash-retail">
          <span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-07">2026.11.07</time></span>
          <strong>美股暴跌一天蒸发约1万亿，散户现在该干什么</strong><small>11月5日纳指跌5.52%、费半跌12.25%，七大科技股单日蒸发超1万亿美元。拆传导链：高通指引、监管担忧、半导体领跌、VIX与比特币联动，再给暴跌后的仓位检查清单。</small>
        </a>
      </div>
    </div>
      <a class="article-card" href="/thinking/life/fix-life-in-1-day">
        <img class="article-card-thumb" src="/images/fix-life-in-1-day/cover.jpg" alt="如何用一天重启你的人生" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">思考</span><time datetime="2026-11-05">2026.11.05</time></span><strong>如何用一天重启你的人生</strong></div>
      </a>
      <a class="article-card" href="/ai/trends/xi-yin-ai">
        <img class="article-card-thumb" src="/images/xi-yin-cover.jpg" alt="尹希说：“我不认为存在任何一种人类智力能力，是 AI 无法复制的”" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-05">2026.11.05</time></span><strong>尹希说：“我不认为存在任何一种人类智力能力，是 AI 无法复制的”</strong></div>
      </a>
      <a class="article-card" href="/ai/trends/midterm-markets">
        <img class="article-card-thumb" src="/images/midterm-markets-cover.jpg" alt="民主党赢下国会，特朗普失去控制权：2026 美国中期选举后，美股会怎么走？" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-05">2026.11.05</time></span><strong>民主党赢下国会，特朗普失去控制权：2026 美国中期选举后，美股会怎么走？</strong></div>
      </a>
      <a class="article-card" href="/ai/trends/claude-search-surge">
        <img class="article-card-thumb" src="/images/claude-search-surge/fig01_gt_compare.png" alt="Claude 搜索热度是 OpenAI 的 13 倍？开发者为什么都在用 Claude" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-10-16">2026.10.16</time></span><strong>Claude 搜索热度是 OpenAI 的 13 倍？开发者为什么都在用 Claude</strong></div>
      </a>
    </div>
    <ul class="latest-rows">
      <li><a href="/ai/trends/ai-manhua-rally"><span class="latest-row-head"><span class="latest-row-title">AI漫剧：1.5亿海外用户，多少是收入，多少只是题材？</span><span class="latest-row-date">· <time datetime="2026-11-03">2026.11.03</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/ai-manhua-cover.jpg" alt="AI漫剧：1.5亿海外用户，多少是收入，多少只是题材？" loading="lazy" decoding="async" /><span class="latest-row-desc">11 月 2 日 AI 漫剧批量涨停，海外用户据报超 1.5 亿：哪些涨法背后有收入撑着，哪些只是题材？成本账、收入账、财报账一次算清。</span></span></a></li>
      <li><a href="/ai/trends/anthropic-residency-500k"><span class="latest-row-head"><span class="latest-row-title">Anthropic 开出 50 万美元年薪，招一批不懂 AI 的技术高手</span><span class="latest-row-date">· <time datetime="2026-11-03">2026.11.03</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/anthropic-residency-cover.jpg" alt="Anthropic 开出 50 万美元年薪，招一批不懂 AI 的技术高手" loading="lazy" decoding="async" /><span class="latest-row-desc">Anthropic 开出 35–50 万美元年薪招募 Residency，不要求博士学位、机器学习经验和论文，却只要已经证明过自己的技术领袖。这篇文章拆解它为什么这么选，以及这对程序员意味着什么。</span></span></a></li>
      <li><a href="/ai/agents/apple-qwen-agent"><span class="latest-row-head"><span class="latest-row-title">苹果等了两年半，千问 12 月住进国行 iPhone：Agent 大战为什么会在手机上见分晓？</span><span class="latest-row-date">· <time datetime="2026-11-02">2026.11.02</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/apple-qwen-cover.jpg" alt="苹果等了两年半，千问 12 月住进国行 iPhone：Agent 大战为什么会在手机上见分晓？" loading="lazy" decoding="async" /><span class="latest-row-desc">千问 12 月住进国行 iPhone，苹果把中国版 Agent 的默认入口交给了阿里：Agent 大战的决战地不在云端架构，而在手机上。</span></span></a></li>
      <li><a href="/ai/trends/reddit-ai-search-traffic"><span class="latest-row-head"><span class="latest-row-title">营收涨 53%，股价跌 29%：谁偷走了 Reddit 的流量？</span><span class="latest-row-date">· <time datetime="2026-11-02">2026.11.02</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/reddit-cover.jpg" alt="营收涨 53%，股价跌 29%：谁偷走了 Reddit 的流量？" loading="lazy" decoding="async" /><span class="latest-row-desc">营收涨 53% 却暴跌 29%，Reddit 财报电话会上的一句警告揭开了 AI 搜索截流的真相：谷歌 AI 正在拿走全网流量，内容站长的流量经济学正在重构。</span></span></a></li>
      <li><a href="/ai/agents/super-agent-design"><span class="latest-row-head"><span class="latest-row-title">DeepSeek 提出 Super-agent：AI Agent 为什么需要摆脱聊天窗口？</span><span class="latest-row-date">· <time datetime="2026-11-02">2026.11.02</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/super-agent-cover.jpg" alt="DeepSeek 提出 Super-agent：AI Agent 为什么需要摆脱聊天窗口？" loading="lazy" decoding="async" /><span class="latest-row-desc">Super-agent 不是更大的模型，而是一套让 Agent 摆脱聊天窗口、长期持续工作的架构：两层调度、事件驱动、异步执行与独立看门狗。</span></span></a></li>
      <li><a href="/investment/crypto/crypto-decentralization-shoddy"><span class="latest-row-head"><span class="latest-row-title">加密货币的“去中心化”，到底是不是草台班子？</span><span class="latest-row-date">· <time datetime="2026-10-31">2026.10.31</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/crypto-decentralization-shoddy/cover.jpg" alt="加密货币的“去中心化”，到底是不是草台班子？" loading="lazy" decoding="async" /><span class="latest-row-desc">币安热钱包约63亿美元被盗后，平台兜底、发行方冻结与执法追偿齐上阵。加密宣传里的「去中心化」，和用户实际依赖的中心化权力，究竟差在哪里。</span></span></a></li>
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
