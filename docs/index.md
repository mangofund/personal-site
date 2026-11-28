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
      <nav class="home-topics" aria-label="文章栏目"><a class="home-topic" href="/archive?category=AI">AI<span>71</span></a><a class="home-topic" href="/investment/">投资<span>27</span></a><a class="home-topic" href="/thinking/">思考<span>7</span></a><a class="home-topic is-all" href="/archive">全部 106 篇 →</a></nav>
    </div>
    <div class="article-list latest-grid">
    <div class="home-carousel" data-carousel>
      <div class="hc-stage">
        <a class="hc-slide is-active" href="/investment/chinext-rally-1161"><img class="hc-img" src="/images/2026-11-28-chinext-rally-cover-photo.jpg" alt="创业板一天涨11.61%，年内还跌23.7%" loading="eager" fetchpriority="high" decoding="async" /></a>
        <a class="hc-slide" href="/ai/trends/gpt6-quantum-gravity"><img class="hc-img" src="/images/2026-11-27-gpt6-quantum-gravity-cover-shi-tu.jpg" alt="斯坦福学者用GPT-6花了4亿token探路量子引力" loading="lazy" decoding="async" /></a>
        <a class="hc-slide" href="/investment/spacex-two-shares-trump-account"><img class="hc-img" src="/images/spacex-two-shares-trump-account/cover.jpg" alt="马斯克送孩子的两股SpaceX股票，到底值多少钱" loading="lazy" decoding="async" /></a>
        <button class="hc-arrow hc-prev" type="button" aria-label="上一篇">‹</button>
        <button class="hc-arrow hc-next" type="button" aria-label="下一篇">›</button>
        <div class="hc-dots"><button class="hc-dot is-active" type="button" aria-label="第 1 篇"></button><button class="hc-dot" type="button" aria-label="第 2 篇"></button><button class="hc-dot" type="button" aria-label="第 3 篇"></button></div>
      </div>
      <div class="hc-panels">
        <a class="hc-panel is-active" href="/investment/chinext-rally-1161">
          <span class="article-card-meta"><span class="article-card-cat">投资</span><time datetime="2026-11-28">2026.11.28</time></span>
          <strong>创业板一天涨11.61%，年内还跌23.7%</strong><small>11 月 27 日，创业板单日暴涨 11.61%，但年内仍跌 23.7%。午间国常会首次同时点名国家队与中央汇金的类平准基金，把一场超跌反弹点成了全市场井喷。本文拆解这次表述新在哪、类平准基金怎么运转，以及“抄底力度已超 924”这个说法到底站不站得住脚。</small>
        </a>
        <a class="hc-panel" href="/ai/trends/gpt6-quantum-gravity">
          <span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-27">2026.11.27</time></span>
          <strong>斯坦福学者用GPT-6花了4亿token探路量子引力</strong><small>斯坦福学者 Chandrasekaran 用 GPT-6 Astra 烧掉 4 亿 token，交出一份 83 页的量子引力候选方案。账其实不贵，框架也不是大一统——它离真正的检验还隔着三道墙。</small>
        </a>
        <a class="hc-panel" href="/investment/spacex-two-shares-trump-account">
          <span class="article-card-meta"><span class="article-card-cat">投资</span><time datetime="2026-11-27">2026.11.27</time></span>
          <strong>马斯克送孩子的两股SpaceX股票，到底值多少钱</strong><small>马斯克给每个美国孩子两股 SpaceX 股票，名义 180 亿美元。但只有激活的特朗普账户能拿到，股票还要锁 5 年，成年取现还要缴税。</small>
        </a>
      </div>
    </div>
      <a class="article-card" href="/investment/trump-shenzhen-tariffs">
        <img class="article-card-thumb" src="/images/trump-tariffs/cover.jpg" alt="特朗普刚夸完深圳，转身就想对华加20%关税？" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">投资</span><time datetime="2026-11-26">2026.11.26</time></span><strong>特朗普刚夸完深圳，转身就想对华加20%关税？</strong></div>
      </a>
      <a class="article-card" href="/investment/liang-wenfeng-deepseek-valuation">
        <img class="article-card-thumb" src="/images/liang-wenfeng/cover.jpg" alt="梁文锋身价飙升到550亿美元，持股变少但钱变多了" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">投资</span><time datetime="2026-11-26">2026.11.26</time></span><strong>梁文锋身价飙升到550亿美元，持股变少但钱变多了</strong></div>
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
      <li><a href="/investment/spacex-starmind"><span class="latest-row-head"><span class="latest-row-title">SpaceX获批部署百万颗卫星，什么样的AI生意值得搬上太空?</span><span class="latest-row-date">· <time datetime="2026-11-26">2026.11.26</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/2026-11-26-spacex-starmind-cover-photo.jpg" alt="SpaceX获批部署百万颗卫星，什么样的AI生意值得搬上太空?" loading="lazy" decoding="async" /><span class="latest-row-desc">FCC 附条件批准 SpaceX 部署最多 100 万颗计算卫星 Starmind，美国历史上首个太空数据中心星座授权。本文从第一颗卫星的生意算起：谁愿意付钱，把一道原本可以在地面算的题送上天？</span></span></a></li>
      <li><a href="/ai/trends/tesla-fsd-duan-yongping"><span class="latest-row-head"><span class="latest-row-title">特斯拉FSD年度最好的免费代言：段永平雇了一个月薪99美元没驾照的“司机”</span><span class="latest-row-date">· <time datetime="2026-11-26">2026.11.26</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/tesla-fsd-duan/cover.jpg" alt="特斯拉FSD年度最好的免费代言：段永平雇了一个月薪99美元没驾照的“司机”" loading="lazy" decoding="async" /><span class="latest-row-desc">段永平在雪球上说，自己的司机没驾照，一个月 99 美元。FSD 从新鲜感变成日常习惯，再变成租车时的必要条件——特斯拉卖的可能是一份数字劳动力。</span></span></a></li>
      <li><a href="/thinking/life/dan-koe-deep-work-routine"><span class="latest-row-head"><span class="latest-row-title">Dan Koe：改变我人生的深度工作法（每天早上 1 小时）</span><span class="latest-row-date">· <time datetime="2026-11-26">2026.11.26</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/dan-koe-deep-work/cover.jpg" alt="Dan Koe：改变我人生的深度工作法（每天早上 1 小时）" loading="lazy" decoding="async" /><span class="latest-row-desc">Dan Koe：如果你能花 8 小时帮别人实现梦想，就能花 1 小时实现自己的梦想。每天早上 1 小时深度工作，365 小时改变人生。全文翻译，附版权说明。</span></span></a></li>
      <li><a href="/investment/asset-allocation/fu-peng-market-crash"><span class="latest-row-head"><span class="latest-row-title">《付鹏深度访谈》完整解读版</span><span class="latest-row-date">· <time datetime="2026-11-26">2026.11.26</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/fu-peng-v2-cover.jpg" alt="《付鹏深度访谈》完整解读版" loading="lazy" decoding="async" /><span class="latest-row-desc">为什么每次市场崩盘，大多数人都跑不掉？付鹏在《不会就问》完整访谈中，从 2015 年提前撤出、杠杆链条、AI 产业周期，一路拆解到财富积累的底层规律。</span></span></a></li>
      <li><a href="/investment/openai-125t-valuation"><span class="latest-row-head"><span class="latest-row-title">OpenAI估值低了1500亿美元，谁拿回了定价权？</span><span class="latest-row-date">· <time datetime="2026-11-25">2026.11.25</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/2026-11-25-openai-125t-valuation-cover-photo.jpg" alt="OpenAI估值低了1500亿美元，谁拿回了定价权？" loading="lazy" decoding="async" /><span class="latest-row-desc">OpenAI一个季度做了100亿美元收入，经调整经营亏损却达到109亿美元，而新投资人愿意给它的投前估值，仍有1.25万亿美元。本文从这组反差出发，拆解定价权、收入结构与五年业绩兑现。</span></span></a></li>
      <li><a href="/ai/trends/humanoid-factory-orders"><span class="latest-row-head"><span class="latest-row-title">人形机器人刷屏，工厂为什么还在买机械臂？</span><span class="latest-row-date">· <time datetime="2026-11-25">2026.11.25</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/2026-11-25-humanoid-factory-orders-cover-photo.jpg" alt="人形机器人刷屏，工厂为什么还在买机械臂？" loading="lazy" decoding="async" /><span class="latest-row-desc">宝马让人形机器人搬过逾 9 万件钣金件，支持生产逾 3 万辆 X3，可公开资料里能找到的结算数字，是约 1,250 个运行小时。本文从这组反差出发，拆解工厂订单、成本账与 2,300 亿美元市场的归属。</span></span></a></li>
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
