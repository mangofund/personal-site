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
      <nav class="home-topics" aria-label="文章栏目"><a class="home-topic" href="/ai/">AI<span>49</span></a><a class="home-topic" href="/investment/">投资<span>8</span></a><a class="home-topic" href="/thinking/">思考<span>6</span></a><a class="home-topic is-all" href="/archive">全部 63 篇 →</a></nav>
    </div>
    <div class="article-list latest-grid">
    <div class="home-carousel" data-carousel>
      <div class="hc-stage">
        <a class="hc-slide is-active" href="/investment/crypto/bitcoin-below-68000"><img class="hc-img" src="/images/bitcoin-below-68000-cover.jpg" alt="比特币跌破 6.8 万美元，牛市结束了吗" loading="eager" fetchpriority="high" decoding="async" /></a>
        <a class="hc-slide" href="/ai/trends/spacex-starship-chopstick-catch"><img class="hc-img" src="/images/spacex-starship-chopstick-catch-cover.jpg" alt="星舰飞船第一次被&quot;筷子&quot;夹回，可复用火箭的账怎么算" loading="lazy" decoding="async" /></a>
        <a class="hc-slide" href="/ai/trends/nvidia-huang-resignation"><img class="hc-img" src="/images/nvidia-huang-resignation-cover.jpg" alt="黄仁勋辞职，是美国社会对亚裔的围剿吗？英伟达之后怎么办？" loading="lazy" decoding="async" /></a>
        <button class="hc-arrow hc-prev" type="button" aria-label="上一篇">‹</button>
        <button class="hc-arrow hc-next" type="button" aria-label="下一篇">›</button>
        <div class="hc-dots"><button class="hc-dot is-active" type="button" aria-label="第 1 篇"></button><button class="hc-dot" type="button" aria-label="第 2 篇"></button><button class="hc-dot" type="button" aria-label="第 3 篇"></button></div>
      </div>
      <div class="hc-panels">
        <a class="hc-panel is-active" href="/investment/crypto/bitcoin-below-68000">
          <span class="article-card-meta"><span class="article-card-cat">投资</span><time datetime="2026-11-15">2026.11.15</time></span>
          <strong>比特币跌破 6.8 万美元，牛市结束了吗</strong><small>比特币 11 月 13 日跌破 68000 美元，24 小时 14.7 亿美元爆仓，同日金价午后回落、再度跌破 3900 美元。爆仓潮是怎么发生的，比特币还是&quot;数字黄金&quot;吗，牛市到底结束没有。</small>
        </a>
        <a class="hc-panel" href="/ai/trends/spacex-starship-chopstick-catch">
          <span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-15">2026.11.15</time></span>
          <strong>星舰飞船第一次被&quot;筷子&quot;夹回，可复用火箭的账怎么算</strong><small>星舰 Ship 42 从轨道飞回发射台，被发射塔的机械臂接住，史上第一次。助推器没回来，双回收只成了一半。我们拆回收机制、算复用这笔账：回收一次省多少，复用率怎么决定发射成本。</small>
        </a>
        <a class="hc-panel" href="/ai/trends/nvidia-huang-resignation">
          <span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-13">2026.11.13</time></span>
          <strong>黄仁勋辞职，是美国社会对亚裔的围剿吗？英伟达之后怎么办？</strong><small>黄仁勋辞去英伟达总裁、CEO 及董事职务，Kress 临时接任：创始人为什么走到这一步，没有他的英伟达护城河还在吗，市场该为离职折价多少。</small>
        </a>
      </div>
    </div>
      <a class="article-card" href="/ai/trends/tencent-ai-native-reorg">
        <img class="article-card-thumb" src="/images/tencent-ai-native-cover.jpg" alt="腾讯一半人去搞 AI Native，大厂转型这步棋怎么下？" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-13">2026.11.13</time></span><strong>腾讯一半人去搞 AI Native，大厂转型这步棋怎么下？</strong></div>
      </a>
      <a class="article-card" href="/ai/trends/anthropic-ipo-wealth">
        <img class="article-card-thumb" src="/images/anthropic-ipo-wealth-cover.jpg" alt="Anthropic 七子上市后，人均身价近 180 亿美元，亚马逊谷歌瓜分 2746 亿美元" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-12">2026.11.12</time></span><strong>Anthropic 七子上市后，人均身价近 180 亿美元，亚马逊谷歌瓜分 2746 亿美元</strong></div>
      </a>
      <a class="article-card" href="/ai/trends/anthropic-amd-cuda-moat">
        <img class="article-card-thumb" src="/images/anthropic-amd-cuda-moat-cover.jpg" alt="Claude 只用 3 天跑上 AMD，英伟达的 CUDA 护城河还剩多少？" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-12">2026.11.12</time></span><strong>Claude 只用 3 天跑上 AMD，英伟达的 CUDA 护城河还剩多少？</strong></div>
      </a>
      <a class="article-card" href="/ai/trends/claude-search-surge">
        <img class="article-card-thumb" src="/images/claude-search-surge/fig01_gt_compare.png" alt="Claude 搜索热度是 OpenAI 的 13 倍？开发者为什么都在用 Claude" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-10-16">2026.10.16</time></span><strong>Claude 搜索热度是 OpenAI 的 13 倍？开发者为什么都在用 Claude</strong></div>
      </a>
    </div>
    <ul class="latest-rows">
      <li><a href="/ai/trends/anthropic-ipo-valuation"><span class="latest-row-head"><span class="latest-row-title">Anthropic IPO 定价 70–78 美元：1.4 万亿估值到底贵不贵</span><span class="latest-row-date">· <time datetime="2026-11-11">2026.11.11</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/anthropic-ipo-valuation-cover.jpg" alt="Anthropic IPO 定价 70–78 美元：1.4 万亿估值到底贵不贵" loading="lazy" decoding="async" /><span class="latest-row-desc">发行价 70 到 78 美元，8.25 亿股，最高募资 644 亿美元。1.4 万亿这个数字没错，但它算的是全稀释口径；按招股书自己印的股数算，市值约 1.02 万亿。只拆估值账，不复述 IPO 新闻。</span></span></a></li>
      <li><a href="/ai/trends/nvidia-founder-risk-pricing"><span class="latest-row-head"><span class="latest-row-title">英伟达两日跌 4300 亿美元：市场到底在怕什么？</span><span class="latest-row-date">· <time datetime="2026-11-11">2026.11.11</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/nvidia-founder-risk-cover.jpg" alt="英伟达两日跌 4300 亿美元：市场到底在怕什么？" loading="lazy" decoding="async" /><span class="latest-row-desc">从10月初高点回落30.6%，两天蒸发约4300亿美元（11月9–10日，收盘口径）。市场怕的不是调查本身，是黄仁勋能不能继续掌舵。拆三成跌幅的构成、估值压缩的账，和11月17日财报夜的看点。</span></span></a></li>
      <li><a href="/ai/trends/october-cpi-rate-hike-covered-calls"><span class="latest-row-head"><span class="latest-row-title">美国 10 月 CPI 超预期，12 月加息几成定局：科技股和备兑仓位怎么办</span><span class="latest-row-date">· <time datetime="2026-11-11">2026.11.11</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/october-cpi-rate-hike-covered-calls-cover.jpg" alt="美国 10 月 CPI 超预期，12 月加息几成定局：科技股和备兑仓位怎么办" loading="lazy" decoding="async" /><span class="latest-row-desc">10 月 CPI 环比涨 0.4%，核心 CPI 连续第三个月涨 0.3%，12 月加 50 个基点的概率一天之内从 1.1% 涨到 15.3%。拆传导链：通胀数据怎么改写加息预期，美债收益率怎么动，科技股估值怎么被重算，备兑仓位上卖 call 和买 put 各自意味着什么。</span></span></a></li>
      <li><a href="/ai/trends/claude-fable-5-2-seo"><span class="latest-row-head"><span class="latest-row-title">如何用 Claude Fable 5.2 做 SEO，好到感觉像犯法</span><span class="latest-row-date">· <time datetime="2026-11-10">2026.11.10</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/claude-fable-5-2-seo-1.jpg" alt="如何用 Claude Fable 5.2 做 SEO，好到感觉像犯法" loading="lazy" decoding="async" /><span class="latest-row-desc">Nicholas Dulait 的 X 长文译文：用 Claude Fable 5.2 搭配 ChatSEO 做 SEO 的全套打法——从 Search Console 里挑关键词，到写出值得谷歌排名的页面，每一步都有提示词。</span></span></a></li>
      <li><a href="/ai/trends/spacex-orbital-supercomputer"><span class="latest-row-head"><span class="latest-row-title">马斯克预告SpaceX轨道超级计算机：算力为什么要上天</span><span class="latest-row-date">· <time datetime="2026-11-09">2026.11.09</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/spacex-orbital-supercomputer-cover.jpg" alt="马斯克预告SpaceX轨道超级计算机：算力为什么要上天" loading="lazy" decoding="async" /><span class="latest-row-desc">Musk 预告 SpaceX 轨道超级计算机 Starmind：100 万颗卫星的申请、AI1 的 250 千瓦算力载荷、2027 年原型、2028 年商业规模。拆三道坎（电、热、延迟）加一笔成本账，算力上天是噱头还是下一条路。</span></span></a></li>
      <li><a href="/ai/trends/anthropic-openai-ipo"><span class="latest-row-head"><span class="latest-row-title">Anthropic 与 OpenAI 即将上市：两个创始人，如何走出不同的 AI 道路？</span><span class="latest-row-date">· <time datetime="2026-11-08">2026.11.08</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/anthropic-openai-ipo/cover.jpg" alt="Anthropic 与 OpenAI 即将上市：两个创始人，如何走出不同的 AI 道路？" loading="lazy" decoding="async" /><span class="latest-row-desc">Anthropic 递交 S-1 冲击万亿美元 IPO，OpenAI 暂缓上市。从 Dario Amodei 与 Sam Altman 的成长、分裂与治理结构，看安全、资本与控制权如何塑造两家 AI 公司。</span></span></a></li>
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
