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
      <nav class="home-topics" aria-label="文章栏目"><a class="home-topic" href="/ai/">AI<span>55</span></a><a class="home-topic" href="/investment/">投资<span>10</span></a><a class="home-topic" href="/thinking/">思考<span>6</span></a><a class="home-topic is-all" href="/archive">全部 71 篇 →</a></nav>
    </div>
    <div class="article-list latest-grid">
    <div class="home-carousel" data-carousel>
      <div class="hc-stage">
        <a class="hc-slide is-active" href="/investment/us-stocks/pinduoduo-q3-2026-earnings"><img class="hc-img" src="/images/2026-11-20-pinduoduo-q3-earnings-cover-paper-cut.jpg" alt="拼多多盘中大涨近13%：营收没增长，华尔街为什么反而买单？" loading="eager" fetchpriority="high" decoding="async" /></a>
        <a class="hc-slide" href="/ai/trends/anthropic-ipo-83"><img class="hc-img" src="/images/2026-11-19-anthropic-ipo-83-cover-scrapbook.jpg" alt="Anthropic IPO：83美元定价，凭什么值1.5万亿美元？" loading="lazy" decoding="async" /></a>
        <a class="hc-slide" href="/investment/asset-allocation/gold-below-3800"><img class="hc-img" src="/images/2026-11-19-gold-below-3800-cover-paper-cut.jpg" alt="金价跌破3800美元，现在抄底还是再等等？" loading="lazy" decoding="async" /></a>
        <button class="hc-arrow hc-prev" type="button" aria-label="上一篇">‹</button>
        <button class="hc-arrow hc-next" type="button" aria-label="下一篇">›</button>
        <div class="hc-dots"><button class="hc-dot is-active" type="button" aria-label="第 1 篇"></button><button class="hc-dot" type="button" aria-label="第 2 篇"></button><button class="hc-dot" type="button" aria-label="第 3 篇"></button></div>
      </div>
      <div class="hc-panels">
        <a class="hc-panel is-active" href="/investment/us-stocks/pinduoduo-q3-2026-earnings">
          <span class="article-card-meta"><span class="article-card-cat">投资</span><time datetime="2026-11-20">2026.11.20</time></span>
          <strong>拼多多盘中大涨近13%：营收没增长，华尔街为什么反而买单？</strong><small>拼多多三季度营收 1083.41 亿元基本持平、低于华尔街预期 6.6%，但营销费用减少 50 亿元推动营业利润增长 24.5%，Non-GAAP 净利润超预期 10.7%；11 月 19 日股价收涨 11.04%，同一天纳指跌 2.3%。</small>
        </a>
        <a class="hc-panel" href="/ai/trends/anthropic-ipo-83">
          <span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-19">2026.11.19</time></span>
          <strong>Anthropic IPO：83美元定价，凭什么值1.5万亿美元？</strong><small>Anthropic 以 83 美元定价上市，完全稀释估值约 1.5 万亿美元，史上最大 IPO。813 亿美元募资、332 亿美元收入、9000 亿美元算力承诺，1.5 万亿到底贵不贵。</small>
        </a>
        <a class="hc-panel" href="/investment/asset-allocation/gold-below-3800">
          <span class="article-card-meta"><span class="article-card-cat">投资</span><time datetime="2026-11-19">2026.11.19</time></span>
          <strong>金价跌破3800美元，现在抄底还是再等等？</strong><small>金价 11 月 18 日跌破 3800 美元，创 14 个月新低，美联储纪要比市场想的更鹰。跌了三成多是不是便宜了，央行还在买意味着什么，现在抄底要赌对什么。</small>
        </a>
      </div>
    </div>
      <a class="article-card" href="/ai/trends/nvidia-q3-earnings-followup">
        <img class="article-card-thumb" src="/images/nvidia-q3-earnings-followup-cover.jpg" alt="没有黄仁勋的第一份财报，英伟达还转得动吗？" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-18">2026.11.18</time></span><strong>没有黄仁勋的第一份财报，英伟达还转得动吗？</strong></div>
      </a>
      <a class="article-card" href="/ai/trends/doubao-wechat-challenge">
        <img class="article-card-thumb" src="/images/doubao-wechat-challenge-cover-scrapbook.jpg" alt="豆包新增聊天功能，国内互联网进入“字节时间”？" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-18">2026.11.18</time></span><strong>豆包新增聊天功能，国内互联网进入“字节时间”？</strong></div>
      </a>
      <a class="article-card" href="/ai/trends/ai-datacenter-diesel-generator">
        <img class="article-card-thumb" src="/images/ai-datacenter-diesel-generator-cover-scrapbook.jpg" alt="AI 算力烧到了柴油发电机：订单排到 2027 年，电网为什么跟不上？" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-17">2026.11.17</time></span><strong>AI 算力烧到了柴油发电机：订单排到 2027 年，电网为什么跟不上？</strong></div>
      </a>
      <a class="article-card" href="/ai/trends/claude-search-surge">
        <img class="article-card-thumb" src="/images/claude-search-surge/fig01_gt_compare.png" alt="Claude 搜索热度是 OpenAI 的 13 倍？开发者为什么都在用 Claude" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-10-16">2026.10.16</time></span><strong>Claude 搜索热度是 OpenAI 的 13 倍？开发者为什么都在用 Claude</strong></div>
      </a>
    </div>
    <ul class="latest-rows">
      <li><a href="/ai/trends/deepseek-search-half-cent"><span class="latest-row-head"><span class="latest-row-title">DeepSeek 搜索一次只要半分钱，推理成本战打到什么程度了</span><span class="latest-row-date">· <time datetime="2026-11-16">2026.11.16</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/deepseek-search-half-cent-cover.jpg" alt="DeepSeek 搜索一次只要半分钱，推理成本战打到什么程度了" loading="lazy" decoding="async" /><span class="latest-row-desc">DeepSeek 搜索每 1000 次 5 元，一次只要半分钱，11 月 13 日全家桶 API 开放后登上头条热榜。半分钱是真的，但它不是一次联网问答的全部成本。我们拆三笔账：半分钱在为什么付钱、一次问答到底花多少、这个价对做 AI 产品的人意味着什么。</span></span></a></li>
      <li><a href="/investment/crypto/bitcoin-below-68000"><span class="latest-row-head"><span class="latest-row-title">比特币跌破 6.8 万美元，牛市结束了吗</span><span class="latest-row-date">· <time datetime="2026-11-15">2026.11.15</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/bitcoin-below-68000-cover.jpg" alt="比特币跌破 6.8 万美元，牛市结束了吗" loading="lazy" decoding="async" /><span class="latest-row-desc">比特币 11 月 13 日跌破 68000 美元，24 小时 14.7 亿美元爆仓，同日金价午后回落、再度跌破 3900 美元。爆仓潮是怎么发生的，比特币还是&quot;数字黄金&quot;吗，牛市到底结束没有。</span></span></a></li>
      <li><a href="/ai/trends/spacex-starship-chopstick-catch"><span class="latest-row-head"><span class="latest-row-title">星舰飞船第一次被&quot;筷子&quot;夹回，可复用火箭的账怎么算</span><span class="latest-row-date">· <time datetime="2026-11-15">2026.11.15</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/spacex-starship-chopstick-catch-cover.jpg" alt="星舰飞船第一次被&quot;筷子&quot;夹回，可复用火箭的账怎么算" loading="lazy" decoding="async" /><span class="latest-row-desc">星舰 Ship 42 从轨道飞回发射台，被发射塔的机械臂接住，史上第一次。助推器没回来，双回收只成了一半。我们拆回收机制、算复用这笔账：回收一次省多少，复用率怎么决定发射成本。</span></span></a></li>
      <li><a href="/ai/trends/nvidia-huang-resignation"><span class="latest-row-head"><span class="latest-row-title">黄仁勋辞职，是美国社会对亚裔的围剿吗？英伟达之后怎么办？</span><span class="latest-row-date">· <time datetime="2026-11-13">2026.11.13</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/nvidia-huang-resignation-cover.jpg" alt="黄仁勋辞职，是美国社会对亚裔的围剿吗？英伟达之后怎么办？" loading="lazy" decoding="async" /><span class="latest-row-desc">黄仁勋辞去英伟达总裁、CEO 及董事职务，Kress 临时接任：创始人为什么走到这一步，没有他的英伟达护城河还在吗，市场该为离职折价多少。</span></span></a></li>
      <li><a href="/ai/trends/tencent-ai-native-reorg"><span class="latest-row-head"><span class="latest-row-title">腾讯一半人去搞 AI Native，大厂转型这步棋怎么下？</span><span class="latest-row-date">· <time datetime="2026-11-13">2026.11.13</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/tencent-ai-native-cover.jpg" alt="腾讯一半人去搞 AI Native，大厂转型这步棋怎么下？" loading="lazy" decoding="async" /><span class="latest-row-desc">腾讯 28 周年会上马化腾提出一半人守现有业务、一半探索 AI Native：重资产的 AI 账怎么算，组织怎么改，中间管理层为什么最难动。</span></span></a></li>
      <li><a href="/ai/trends/anthropic-ipo-wealth"><span class="latest-row-head"><span class="latest-row-title">Anthropic 七子上市后，人均身价近 180 亿美元，亚马逊谷歌瓜分 2746 亿美元</span><span class="latest-row-date">· <time datetime="2026-11-12">2026.11.12</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/anthropic-ipo-wealth-cover.jpg" alt="Anthropic 七子上市后，人均身价近 180 亿美元，亚马逊谷歌瓜分 2746 亿美元" loading="lazy" decoding="async" /><span class="latest-row-desc">Anthropic IPO 财富分配：七位联合创始人每人持股约 176 亿～178 亿美元，亚马逊与谷歌持股合计约 2746 亿美元。拆创始人、员工、巨头、风投、投行的分账。</span></span></a></li>
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
