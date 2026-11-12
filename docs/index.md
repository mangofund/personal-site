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
      <nav class="home-topics" aria-label="文章栏目"><a class="home-topic" href="/ai/">AI<span>46</span></a><a class="home-topic" href="/investment/">投资<span>7</span></a><a class="home-topic" href="/thinking/">思考<span>6</span></a><a class="home-topic is-all" href="/archive">全部 59 篇 →</a></nav>
    </div>
    <div class="article-list latest-grid">
    <div class="home-carousel" data-carousel>
      <div class="hc-stage">
        <a class="hc-slide is-active" href="/ai/trends/anthropic-amd-cuda-moat"><img class="hc-img" src="/images/anthropic-amd-cuda-moat-cover.jpg" alt="Claude 只用 3 天跑上 AMD，英伟达的 CUDA 护城河还剩多少？" loading="eager" fetchpriority="high" decoding="async" /></a>
        <a class="hc-slide" href="/ai/trends/nvidia-huang-second-affair"><img class="hc-img" src="/images/nvidia-huang-second-affair-cover.jpg" alt="黄仁勋第二段婚外情曝光，英伟达一夜蒸发数千亿美元：最贵的可能不是离婚" loading="lazy" decoding="async" /></a>
        <a class="hc-slide" href="/ai/trends/anthropic-ipo-wealth"><img class="hc-img" src="/images/anthropic-ipo-wealth-cover.jpg" alt="Anthropic 七子上市后，人均身价近 180 亿美元，亚马逊谷歌瓜分 2746 亿美元" loading="lazy" decoding="async" /></a>
        <button class="hc-arrow hc-prev" type="button" aria-label="上一篇">‹</button>
        <button class="hc-arrow hc-next" type="button" aria-label="下一篇">›</button>
        <div class="hc-dots"><button class="hc-dot is-active" type="button" aria-label="第 1 篇"></button><button class="hc-dot" type="button" aria-label="第 2 篇"></button><button class="hc-dot" type="button" aria-label="第 3 篇"></button></div>
      </div>
      <div class="hc-panels">
        <a class="hc-panel is-active" href="/ai/trends/anthropic-amd-cuda-moat">
          <span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-12">2026.11.12</time></span>
          <strong>Claude 只用 3 天跑上 AMD，英伟达的 CUDA 护城河还剩多少？</strong><small>Claude Mythos 只用约 3 天就让一个模型在 AMD MI355X 上跑起提示词处理，传统方式要 6–12 个月。CUDA 的软件锁定开始松动，但英伟达的系统级优势还在。</small>
        </a>
        <a class="hc-panel" href="/ai/trends/nvidia-huang-second-affair">
          <span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-12">2026.11.12</time></span>
          <strong>黄仁勋第二段婚外情曝光，英伟达一夜蒸发数千亿美元：最贵的可能不是离婚</strong><small>《纽约时报》曝出黄仁勋第二段婚外情，对象是直接下属、医疗业务副总裁 Kimberly Powell；《华尔街日报》称董事会正在考虑罢免他。NVDA 11 月 11 日收 173.73 美元，盘后一度跌 8%。拆治理折价、估值情景和离婚分割账。</small>
        </a>
        <a class="hc-panel" href="/ai/trends/anthropic-ipo-wealth">
          <span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-12">2026.11.12</time></span>
          <strong>Anthropic 七子上市后，人均身价近 180 亿美元，亚马逊谷歌瓜分 2746 亿美元</strong><small>Anthropic IPO 财富分配：七位联合创始人每人持股约 176 亿～178 亿美元，亚马逊与谷歌持股合计约 2746 亿美元。拆创始人、员工、巨头、风投、投行的分账。</small>
        </a>
      </div>
    </div>
      <a class="article-card" href="/ai/trends/anthropic-ipo-valuation">
        <img class="article-card-thumb" src="/images/anthropic-ipo-valuation-cover.jpg" alt="Anthropic IPO 定价 70–78 美元：1.4 万亿估值到底贵不贵" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-11">2026.11.11</time></span><strong>Anthropic IPO 定价 70–78 美元：1.4 万亿估值到底贵不贵</strong></div>
      </a>
      <a class="article-card" href="/ai/trends/nvidia-founder-risk-pricing">
        <img class="article-card-thumb" src="/images/nvidia-founder-risk-cover.jpg" alt="英伟达两日跌 4300 亿美元：市场到底在怕什么？" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-11">2026.11.11</time></span><strong>英伟达两日跌 4300 亿美元：市场到底在怕什么？</strong></div>
      </a>
      <a class="article-card" href="/ai/trends/october-cpi-rate-hike-covered-calls">
        <img class="article-card-thumb" src="/images/october-cpi-rate-hike-covered-calls-cover.jpg" alt="美国 10 月 CPI 超预期，12 月加息几成定局：科技股和备兑仓位怎么办" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-11">2026.11.11</time></span><strong>美国 10 月 CPI 超预期，12 月加息几成定局：科技股和备兑仓位怎么办</strong></div>
      </a>
      <a class="article-card" href="/ai/trends/claude-search-surge">
        <img class="article-card-thumb" src="/images/claude-search-surge/fig01_gt_compare.png" alt="Claude 搜索热度是 OpenAI 的 13 倍？开发者为什么都在用 Claude" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-10-16">2026.10.16</time></span><strong>Claude 搜索热度是 OpenAI 的 13 倍？开发者为什么都在用 Claude</strong></div>
      </a>
    </div>
    <ul class="latest-rows">
      <li><a href="/ai/trends/spacex-orbital-supercomputer"><span class="latest-row-head"><span class="latest-row-title">马斯克预告SpaceX轨道超级计算机：算力为什么要上天</span><span class="latest-row-date">· <time datetime="2026-11-09">2026.11.09</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/spacex-orbital-supercomputer-cover.jpg" alt="马斯克预告SpaceX轨道超级计算机：算力为什么要上天" loading="lazy" decoding="async" /><span class="latest-row-desc">Musk 预告 SpaceX 轨道超级计算机 Starmind：100 万颗卫星的申请、AI1 的 250 千瓦算力载荷、2027 年原型、2028 年商业规模。拆三道坎（电、热、延迟）加一笔成本账，算力上天是噱头还是下一条路。</span></span></a></li>
      <li><a href="/ai/trends/anthropic-openai-ipo"><span class="latest-row-head"><span class="latest-row-title">Anthropic 与 OpenAI 即将上市：两个创始人，如何走出不同的 AI 道路？</span><span class="latest-row-date">· <time datetime="2026-11-08">2026.11.08</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/anthropic-openai-ipo/cover.jpg" alt="Anthropic 与 OpenAI 即将上市：两个创始人，如何走出不同的 AI 道路？" loading="lazy" decoding="async" /><span class="latest-row-desc">Anthropic 递交 S-1 冲击万亿美元 IPO，OpenAI 暂缓上市。从 Dario Amodei 与 Sam Altman 的成长、分裂与治理结构，看安全、资本与控制权如何塑造两家 AI 公司。</span></span></a></li>
      <li><a href="/ai/agents/claude-agent-memory"><span class="latest-row-head"><span class="latest-row-title">Claude 靠做梦整理记忆</span><span class="latest-row-date">· <time datetime="2026-11-08">2026.11.08</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/claude-agent-memory/cover.jpg" alt="Claude 靠做梦整理记忆" loading="lazy" decoding="async" /><span class="latest-row-desc">Anthropic 工程博客拆解：Claude 如何把经验写成记忆，再用「做梦」纠错、建 wiki、提升层级、按目标塑形。含 CL-Bench、宝可梦与 Stainless 实测数字。</span></span></a></li>
      <li><a href="/ai/trends/tesla-cybertruck-winddown"><span class="latest-row-head"><span class="latest-row-title">特斯拉逐步停产Cybertruck：是在止血，还是在认输</span><span class="latest-row-date">· <time datetime="2026-11-07">2026.11.07</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/tesla-cybertruck-winddown-cover.jpg" alt="特斯拉逐步停产Cybertruck：是在止血，还是在认输" loading="lazy" decoding="async" /><span class="latest-row-desc">11月6日，Musk 宣布特斯拉逐步停产 Cybertruck，2027 年年中德州工厂停产、给 Cybercab 让产能。拆一笔产品账：三年销量、价格锚、皮卡市场水土不服，停产省的是什么、认的是什么。</span></span></a></li>
      <li><a href="/ai/trends/us-market-crash-retail"><span class="latest-row-head"><span class="latest-row-title">美股暴跌一天蒸发约1万亿，散户现在该干什么</span><span class="latest-row-date">· <time datetime="2026-11-07">2026.11.07</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/us-market-crash-cover.jpg" alt="美股暴跌一天蒸发约1万亿，散户现在该干什么" loading="lazy" decoding="async" /><span class="latest-row-desc">11月5日纳指跌5.52%、费半跌12.25%，七大科技股单日蒸发超1万亿美元。拆传导链：高通指引、监管担忧、半导体领跌、VIX与比特币联动，再给暴跌后的仓位检查清单。</span></span></a></li>
      <li><a href="/ai/trends/ai-datacenter-moratorium"><span class="latest-row-head"><span class="latest-row-title">AI数据中心突然被叫停：算力基建的监管拐点到了</span><span class="latest-row-date">· <time datetime="2026-11-07">2026.11.07</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/ai-datacenter-moratorium-cover.jpg" alt="AI数据中心突然被叫停：算力基建的监管拐点到了" loading="lazy" decoding="async" /><span class="latest-row-desc">得州选出承诺叫停数据中心审批的州长，40比1的地方公投，474吉瓦并网排队。暂停早就存在，选举改写的是解除暂停的预期——地方政府为什么从抢项目转向踩刹车，三条链会怎么传导。</span></span></a></li>
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
