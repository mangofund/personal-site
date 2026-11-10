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
      <nav class="home-topics" aria-label="文章栏目"><a class="home-topic" href="/ai/">AI<span>40</span></a><a class="home-topic" href="/investment/">投资<span>7</span></a><a class="home-topic" href="/thinking/">思考<span>6</span></a><a class="home-topic is-all" href="/archive">全部 53 篇 →</a></nav>
    </div>
    <div class="article-list latest-grid">
    <div class="home-carousel" data-carousel>
      <div class="hc-stage">
        <a class="hc-slide is-active" href="/ai/trends/claude-fable-5-2-seo"><img class="hc-img" src="/images/claude-fable-5-2-seo-1.jpg" alt="如何用 Claude Fable 5.2 做 SEO，好到感觉像犯法" loading="eager" fetchpriority="high" decoding="async" /></a>
        <a class="hc-slide" href="/ai/trends/spacex-orbital-supercomputer"><img class="hc-img" src="/images/spacex-orbital-supercomputer-cover.jpg" alt="马斯克预告SpaceX轨道超级计算机：算力为什么要上天" loading="lazy" decoding="async" /></a>
        <a class="hc-slide" href="/ai/trends/anthropic-openai-ipo"><img class="hc-img" src="/images/anthropic-openai-ipo/cover.jpg" alt="Anthropic 与 OpenAI 即将上市：两个创始人，如何走出不同的 AI 道路？" loading="lazy" decoding="async" /></a>
        <button class="hc-arrow hc-prev" type="button" aria-label="上一篇">‹</button>
        <button class="hc-arrow hc-next" type="button" aria-label="下一篇">›</button>
        <div class="hc-dots"><button class="hc-dot is-active" type="button" aria-label="第 1 篇"></button><button class="hc-dot" type="button" aria-label="第 2 篇"></button><button class="hc-dot" type="button" aria-label="第 3 篇"></button></div>
      </div>
      <div class="hc-panels">
        <a class="hc-panel is-active" href="/ai/trends/claude-fable-5-2-seo">
          <span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-10">2026.11.10</time></span>
          <strong>如何用 Claude Fable 5.2 做 SEO，好到感觉像犯法</strong><small>Nicholas Dulait 的 X 长文译文：用 Claude Fable 5.2 搭配 ChatSEO 做 SEO 的全套打法——从 Search Console 里挑关键词，到写出值得谷歌排名的页面，每一步都有提示词。</small>
        </a>
        <a class="hc-panel" href="/ai/trends/spacex-orbital-supercomputer">
          <span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-09">2026.11.09</time></span>
          <strong>马斯克预告SpaceX轨道超级计算机：算力为什么要上天</strong><small>Musk 预告 SpaceX 轨道超级计算机 Starmind：100 万颗卫星的申请、AI1 的 250 千瓦算力载荷、2027 年原型、2028 年商业规模。拆三道坎（电、热、延迟）加一笔成本账，算力上天是噱头还是下一条路。</small>
        </a>
        <a class="hc-panel" href="/ai/trends/anthropic-openai-ipo">
          <span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-08">2026.11.08</time></span>
          <strong>Anthropic 与 OpenAI 即将上市：两个创始人，如何走出不同的 AI 道路？</strong><small>Anthropic 递交 S-1 冲击万亿美元 IPO，OpenAI 暂缓上市。从 Dario Amodei 与 Sam Altman 的成长、分裂与治理结构，看安全、资本与控制权如何塑造两家 AI 公司。</small>
        </a>
      </div>
    </div>
      <a class="article-card" href="/ai/agents/claude-agent-memory">
        <img class="article-card-thumb" src="/images/claude-agent-memory/cover.jpg" alt="Claude 靠做梦整理记忆" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-08">2026.11.08</time></span><strong>Claude 靠做梦整理记忆</strong></div>
      </a>
      <a class="article-card" href="/ai/trends/tesla-cybertruck-winddown">
        <img class="article-card-thumb" src="/images/tesla-cybertruck-winddown-cover.jpg" alt="特斯拉逐步停产Cybertruck：是在止血，还是在认输" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-07">2026.11.07</time></span><strong>特斯拉逐步停产Cybertruck：是在止血，还是在认输</strong></div>
      </a>
      <a class="article-card" href="/ai/trends/us-market-crash-retail">
        <img class="article-card-thumb" src="/images/us-market-crash-cover.jpg" alt="美股暴跌一天蒸发约1万亿，散户现在该干什么" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-07">2026.11.07</time></span><strong>美股暴跌一天蒸发约1万亿，散户现在该干什么</strong></div>
      </a>
      <a class="article-card" href="/ai/trends/claude-search-surge">
        <img class="article-card-thumb" src="/images/claude-search-surge/fig01_gt_compare.png" alt="Claude 搜索热度是 OpenAI 的 13 倍？开发者为什么都在用 Claude" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-10-16">2026.10.16</time></span><strong>Claude 搜索热度是 OpenAI 的 13 倍？开发者为什么都在用 Claude</strong></div>
      </a>
    </div>
    <ul class="latest-rows">
      <li><a href="/thinking/life/fix-life-in-1-day"><span class="latest-row-head"><span class="latest-row-title">如何用一天重启你的人生</span><span class="latest-row-date">· <time datetime="2026-11-05">2026.11.05</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/fix-life-in-1-day/cover.jpg" alt="如何用一天重启你的人生" loading="lazy" decoding="async" /><span class="latest-row-desc">Dan Koe 这篇在 X 上约 2 亿阅读，相关中文图解本据拼多多商品页约卖 265 万。全文整理其七大观点与一日重启协议，帮你挖清真正想要的人生。</span></span></a></li>
      <li><a href="/ai/trends/xi-yin-ai"><span class="latest-row-head"><span class="latest-row-title">尹希说：“我不认为存在任何一种人类智力能力，是 AI 无法复制的”</span><span class="latest-row-date">· <time datetime="2026-11-05">2026.11.05</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/xi-yin-cover.jpg" alt="尹希说：“我不认为存在任何一种人类智力能力，是 AI 无法复制的”" loading="lazy" decoding="async" /><span class="latest-row-desc">哈佛物理学家尹希离开 OpenAI：AI 让他的科研编码提效至少 100 倍，也让他相信人类智力皆可复制；陶哲轩的担忧、年轻人就业缺口与智力不再稀缺后的定价转移。</span></span></a></li>
      <li><a href="/ai/trends/midterm-markets"><span class="latest-row-head"><span class="latest-row-title">民主党赢下国会，特朗普失去控制权：2026 美国中期选举后，美股会怎么走？</span><span class="latest-row-date">· <time datetime="2026-11-05">2026.11.05</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/midterm-markets-cover.jpg" alt="民主党赢下国会，特朗普失去控制权：2026 美国中期选举后，美股会怎么走？" loading="lazy" decoding="async" /><span class="latest-row-desc">民主党夺回国会两院，11 月 4 日美股却全面上涨：财政、利率、能源与 AI 数据中心的分化逻辑，以及未来 12 个月的三条情景推演。</span></span></a></li>
      <li><a href="/ai/trends/ai-earnings-72h"><span class="latest-row-head"><span class="latest-row-title">苹果超预期跌 4%，Palantir 翻倍也跌：72 小时财报到底在验证 AI 交易的哪一环？</span><span class="latest-row-date">· <time datetime="2026-11-03">2026.11.03</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/ai-earnings-cover.jpg" alt="苹果超预期跌 4%，Palantir 翻倍也跌：72 小时财报到底在验证 AI 交易的哪一环？" loading="lazy" decoding="async" /><span class="latest-row-desc">苹果与 Palantir 双双超预期却同夜下跌，AMD 实绩大超预期：72 小时财报到底在验证 AI 交易的哪一环？变现环、成本环、供给环三环拆解。</span></span></a></li>
      <li><a href="/ai/trends/ai-manhua-rally"><span class="latest-row-head"><span class="latest-row-title">AI漫剧：1.5亿海外用户，多少是收入，多少只是题材？</span><span class="latest-row-date">· <time datetime="2026-11-03">2026.11.03</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/ai-manhua-cover.jpg" alt="AI漫剧：1.5亿海外用户，多少是收入，多少只是题材？" loading="lazy" decoding="async" /><span class="latest-row-desc">11 月 2 日 AI 漫剧批量涨停，海外用户据报超 1.5 亿：哪些涨法背后有收入撑着，哪些只是题材？成本账、收入账、财报账一次算清。</span></span></a></li>
      <li><a href="/ai/trends/anthropic-residency-500k"><span class="latest-row-head"><span class="latest-row-title">Anthropic 开出 50 万美元年薪，招一批不懂 AI 的技术高手</span><span class="latest-row-date">· <time datetime="2026-11-03">2026.11.03</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/anthropic-residency-cover.jpg" alt="Anthropic 开出 50 万美元年薪，招一批不懂 AI 的技术高手" loading="lazy" decoding="async" /><span class="latest-row-desc">Anthropic 开出 35–50 万美元年薪招募 Residency，不要求博士学位、机器学习经验和论文，却只要已经证明过自己的技术领袖。这篇文章拆解它为什么这么选，以及这对程序员意味着什么。</span></span></a></li>
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
