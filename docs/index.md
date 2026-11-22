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
      <nav class="home-topics" aria-label="文章栏目"><a class="home-topic" href="/ai/">AI<span>58</span></a><a class="home-topic" href="/investment/">投资<span>14</span></a><a class="home-topic" href="/thinking/">思考<span>6</span></a><a class="home-topic is-all" href="/archive">全部 79 篇 →</a></nav>
    </div>
    <div class="article-list latest-grid">
    <div class="home-carousel" data-carousel>
      <div class="hc-stage">
        <a class="hc-slide is-active" href="/ai/trends/tesla-fsd-v15-rollout"><img class="hc-img" src="/images/2026-11-22-tesla-fsd-v15-cover-shi-tu-pei-wen.jpg" alt="特斯拉FSD v15开始推送：安全提升25倍，离真正无人驾驶还有多远？" loading="eager" fetchpriority="high" decoding="async" /></a>
        <a class="hc-slide" href="/investment/asset-allocation/fed-rate-hikes-market-crash"><img class="hc-img" src="/images/2026-11-21-fed-rate-hikes-market-crash-cover-paper-cut.jpg" alt="美联储又要连续加息？黄金、比特币、美股一起暴跌，制造黑色星期五" loading="lazy" decoding="async" /></a>
        <a class="hc-slide" href="/ai/trends/claude-riemann-hypothesis-proof"><img class="hc-img" src="/images/claude-riemann-hypothesis-proof-cover.jpg" alt="Claude证明了黎曼猜想？25万页写不完的证明，机器已经开始验了" loading="lazy" decoding="async" /></a>
        <button class="hc-arrow hc-prev" type="button" aria-label="上一篇">‹</button>
        <button class="hc-arrow hc-next" type="button" aria-label="下一篇">›</button>
        <div class="hc-dots"><button class="hc-dot is-active" type="button" aria-label="第 1 篇"></button><button class="hc-dot" type="button" aria-label="第 2 篇"></button><button class="hc-dot" type="button" aria-label="第 3 篇"></button></div>
      </div>
      <div class="hc-panels">
        <a class="hc-panel is-active" href="/ai/trends/tesla-fsd-v15-rollout">
          <span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-22">2026.11.22</time></span>
          <strong>特斯拉FSD v15开始推送：安全提升25倍，离真正无人驾驶还有多远？</strong><small>11月21日特斯拉开始向首批用户推送FSD v15，关键接管指标改善25倍。视觉编码器与Robotaxi、Optimus共享，Reality View上线，路线规划开始学习车队偏好。25倍到底指什么，离无人驾驶还有多远？</small>
        </a>
        <a class="hc-panel" href="/investment/asset-allocation/fed-rate-hikes-market-crash">
          <span class="article-card-meta"><span class="article-card-cat">投资</span><time datetime="2026-11-21">2026.11.21</time></span>
          <strong>美联储又要连续加息？黄金、比特币、美股一起暴跌，制造黑色星期五</strong><small>11月20日纳指单日跌5.28%、年内涨幅全部蒸发，黄金跌破3600美元、比特币跌破6万美元。摩根大通预计美联储12月、明年1月和3月连续加息三次，利率预期翻转之下，为什么避险资产也一起跌？</small>
        </a>
        <a class="hc-panel" href="/ai/trends/claude-riemann-hypothesis-proof">
          <span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-21">2026.11.21</time></span>
          <strong>Claude证明了黎曼猜想？25万页写不完的证明，机器已经开始验了</strong><small>Anthropic 数学研究员 Levent Alpöge 宣布与 Claude 合作找到了黎曼猜想的证明：25 万页文字版、1700 万行 Lean 代码，MIT 独立核验已通过多项机器检查。机器能验算，不等于人类已理解。</small>
        </a>
      </div>
    </div>
      <a class="article-card" href="/ai/trends/nvidia-ai-bubble-crash">
        <img class="article-card-thumb" src="/images/nvidia-ai-bubble-crash-cover.jpg" alt="英伟达一天暴跌14%，AI泡沫还在吗？" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-21">2026.11.21</time></span><strong>英伟达一天暴跌14%，AI泡沫还在吗？</strong></div>
      </a>
      <a class="article-card" href="/investment/tesla/musk-china-shanghai-factory-role">
        <img class="article-card-thumb" src="/images/2026-11-20-musk-china-shanghai-factory-role-cover-shi-tu-pei-wen.jpg" alt="马斯克访华说要增产，但是中国的销量跌了15%：上海工厂的角色变了？" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">投资</span><time datetime="2026-11-20">2026.11.20</time></span><strong>马斯克访华说要增产，但是中国的销量跌了15%：上海工厂的角色变了？</strong></div>
      </a>
      <a class="article-card" href="/ai/trends/claude-search-surge">
        <img class="article-card-thumb" src="/images/claude-search-surge/fig01_gt_compare.png" alt="Claude 搜索热度是 OpenAI 的 13 倍？开发者为什么都在用 Claude" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-10-16">2026.10.16</time></span><strong>Claude 搜索热度是 OpenAI 的 13 倍？开发者为什么都在用 Claude</strong></div>
      </a>
      <a class="article-card" href="/ai/trends/claude-prevent-ban-guide">
        <img class="article-card-thumb" src="/images/claude-prevent-ban-guide/cover.jpg" alt="Claude预防封号保姆级教程" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-10-29">2026.10.29</time></span><strong>Claude预防封号保姆级教程</strong></div>
      </a>
    </div>
    <ul class="latest-rows">
      <li><a href="/investment/hk-stocks/tencent-qq-wechat-gap"><span class="latest-row-head"><span class="latest-row-title">微信QQ月活差9亿，腾讯为什么还留着QQ？</span><span class="latest-row-date">· <time datetime="2026-11-20">2026.11.20</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/2026-11-20-tencent-qq-wechat-gap-cover-scrapbook.jpg" alt="微信QQ月活差9亿，腾讯为什么还留着QQ？" loading="lazy" decoding="async" /><span class="latest-row-desc">微信及WeChat合并月活14.49亿，QQ移动终端月活5.33亿，相差9.16亿。但QQ连续三个季度环比增长，18至35岁用户占比超一半。腾讯留着QQ，留的不是情怀，是另一张关系网。</span></span></a></li>
      <li><a href="/investment/us-stocks/catl-li-auto-payment-terms"><span class="latest-row-head"><span class="latest-row-title">宁德时代一天三封催款邮件？车企的钱到底卡在哪？</span><span class="latest-row-date">· <time datetime="2026-11-20">2026.11.20</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/2026-11-20-catl-li-auto-payment-terms-cover-shi-tu-pei-wen.jpg" alt="宁德时代一天三封催款邮件？车企的钱到底卡在哪？" loading="lazy" decoding="async" /><span class="latest-row-desc">理想供应部门员工称，自研电池官宣后每天收到宁德时代至少三封催款邮件。理想账上有 875 亿元现金，14 家车企应付账款合计 7825 亿元、平均周转 187 天，60 天承诺与财报数字之间差了三倍。</span></span></a></li>
      <li><a href="/investment/us-stocks/pinduoduo-q3-2026-earnings"><span class="latest-row-head"><span class="latest-row-title">拼多多盘中大涨近13%：营收没增长，华尔街为什么反而买单？</span><span class="latest-row-date">· <time datetime="2026-11-20">2026.11.20</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/2026-11-20-pinduoduo-q3-earnings-cover-paper-cut.jpg" alt="拼多多盘中大涨近13%：营收没增长，华尔街为什么反而买单？" loading="lazy" decoding="async" /><span class="latest-row-desc">拼多多三季度营收 1083.41 亿元基本持平、低于华尔街预期 6.6%，但营销费用减少 50 亿元推动营业利润增长 24.5%，Non-GAAP 净利润超预期 10.7%；11 月 19 日股价收涨 11.04%，同一天纳指跌 2.3%。</span></span></a></li>
      <li><a href="/ai/trends/anthropic-ipo-83"><span class="latest-row-head"><span class="latest-row-title">Anthropic IPO：83美元定价，凭什么值1.5万亿美元？</span><span class="latest-row-date">· <time datetime="2026-11-19">2026.11.19</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/2026-11-19-anthropic-ipo-83-cover-scrapbook.jpg" alt="Anthropic IPO：83美元定价，凭什么值1.5万亿美元？" loading="lazy" decoding="async" /><span class="latest-row-desc">Anthropic 以 83 美元定价上市，完全稀释估值约 1.5 万亿美元，史上最大 IPO。813 亿美元募资、332 亿美元收入、9000 亿美元算力承诺，1.5 万亿到底贵不贵。</span></span></a></li>
      <li><a href="/investment/asset-allocation/gold-below-3800"><span class="latest-row-head"><span class="latest-row-title">金价跌破3800美元，现在抄底还是再等等？</span><span class="latest-row-date">· <time datetime="2026-11-19">2026.11.19</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/2026-11-19-gold-below-3800-cover-paper-cut.jpg" alt="金价跌破3800美元，现在抄底还是再等等？" loading="lazy" decoding="async" /><span class="latest-row-desc">金价 11 月 18 日跌破 3800 美元，创 14 个月新低，美联储纪要比市场想的更鹰。跌了三成多是不是便宜了，央行还在买意味着什么，现在抄底要赌对什么。</span></span></a></li>
      <li><a href="/ai/trends/nvidia-q3-earnings-followup"><span class="latest-row-head"><span class="latest-row-title">没有黄仁勋的第一份财报，英伟达还转得动吗？</span><span class="latest-row-date">· <time datetime="2026-11-18">2026.11.18</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/nvidia-q3-earnings-followup-cover.jpg" alt="没有黄仁勋的第一份财报，英伟达还转得动吗？" loading="lazy" decoding="async" /><span class="latest-row-desc">黄仁勋辞职六天后，英伟达交出 Q3 财报：营收 1158 亿美元，Q4 指引 1300 亿美元，Kress 把 FY2028 增速抬到 75%，董事会当场关上黄仁勋回归的大门。</span></span></a></li>
    </ul>
    <!-- LATEST-END -->
  </section>

  <section class="home-section">
    <div style="display:flex;align-items:baseline;justify-content:space-between;gap:12px;">
      <h2>技能商店</h2>
      <a href="skills/" style="font-size:14px;color:#1d9bf0;white-space:nowrap;">进入技能商店 →</a>
    </div>
    <SkillShowcase variant="featured" />
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
