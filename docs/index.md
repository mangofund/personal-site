---
title: PRO的茶里芒果
titleTemplate: AI、投资与长期思考的中文个人博客
description: AI、投资、产品，以及一些关于世界如何运行的思考。
keywords: PRO的茶里芒果, AI 趋势, Claude, AI Agent, AI 编程, 美股投资, 特斯拉, 价值投资, 长期主义, Agent Skills
aside: false
---

<script setup>
import { withBase } from 'vitepress'
import { onMounted, onUnmounted, ref } from 'vue'
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

// 首页「今日」区：客户端拉同源 /market/briefings.json，按分类取最新一条渲染。
// feed 每小时同步更新，页面每次打开都重新校验取最新，不用等网站重新构建。
const todayDate = ref('')
const todayGold = ref(null)
const todayTrends = ref([])
const todayBriefs = ref([])
const todayError = ref(false)
const fmtNum = (n, d = 2) => Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })
const fmtPct = (n) => (n > 0 ? '+' : '') + Number(n).toFixed(2) + '%'
const stripBold = (s) => (s || '').replace(/\*\*/g, '')
const fmtPushDate = (s) => {
  const m = (s || '').match(/^(\d{4})-(\d{2})-(\d{2})$/)
  return m ? `${m[1]}年${Number(m[2])}月${Number(m[3])}日` : (s || '')
}
onMounted(async () => {
  try {
    const res = await fetch(withBase('/market/briefings.json'), { cache: 'no-cache' })
    if (!res.ok) throw new Error('feed ' + res.status)
    const data = await res.json()
    const items = (data.items || []).filter((it) => it && it.status === 'ok')
    const byDateId = (a, b) => (a.pushDate < b.pushDate ? 1 : a.pushDate > b.pushDate ? -1 : b.id - a.id)
    const golds = items.filter((it) => it.category === 'gold').sort(byDateId)
    const gold = golds.find((it) => it.slot === 'close') || golds[0]
    const trend = items.filter((it) => it.category === 'trends').sort(byDateId)[0]
    const briefs = items.filter((it) => it.category !== 'gold' && it.category !== 'trends').sort(byDateId).slice(0, 3)
    if (gold) {
      const m = gold.metrics || {}
      todayGold.value = {
        date: fmtPushDate(gold.pushDate),
        slot: gold.slot === 'close' ? '收盘' : '参考',
        domestic: m.domestic ? { price: fmtNum(m.domestic.price), chg: fmtPct(m.domestic.chgPct) } : null,
        au9999: m.au9999 ? { price: fmtNum(m.au9999.price), chg: fmtPct(m.au9999.chgPct) } : null,
        intl: m.intl ? { price: fmtNum(m.intl.price), chg: fmtPct(m.intl.chgPct) } : null,
      }
      todayDate.value = fmtPushDate(gold.pushDate)
    }
    if (trend) {
      todayTrends.value = (trend.summary || '').split('\n').map((s) => stripBold(s).trim()).filter(Boolean).slice(0, 5)
      if (!todayDate.value) todayDate.value = fmtPushDate(trend.pushDate)
    }
    todayBriefs.value = briefs.map((it) => ({ title: it.title, summary: stripBold(it.summary || '') }))
  } catch (e) {
    todayError.value = true
  }
})
</script>

<!-- Latest 板块由构建脚本按当次部署目标自动生成。技能卡链到 /skills/，相对路径兼容 GitHub Pages 与 Cloudflare Pages。-->
<div class="home-page">
  <section class="home-section home-today" aria-label="今日">
    <div style="display:flex;align-items:baseline;justify-content:space-between;gap:12px;">
      <h2>今日</h2>
      <span class="today-date" v-if="todayDate">{{ todayDate }} · 每日更新</span>
    </div>
    <div class="today-grid">
      <article class="today-card">
        <h3>今日金价</h3>
        <div v-if="todayGold" class="today-rows">
          <div v-if="todayGold.domestic" class="today-row"><span>国内金价</span><strong>{{ todayGold.domestic.price }} 元/克 <em>{{ todayGold.domestic.chg }}</em></strong></div>
          <div v-if="todayGold.au9999" class="today-row"><span>黄金9999</span><strong>{{ todayGold.au9999.price }} 元/克 <em>{{ todayGold.au9999.chg }}</em></strong></div>
          <div v-if="todayGold.intl" class="today-row"><span>国际黄金</span><strong>{{ todayGold.intl.price }} 美元/盎司 <em>{{ todayGold.intl.chg }}</em></strong></div>
          <div class="today-note">{{ todayGold.date }} {{ todayGold.slot }}</div>
        </div>
        <p v-else-if="todayError" class="today-empty">暂无数据</p>
        <p v-else class="today-empty">加载中…</p>
        <a class="today-link" href="/investment/asset-allocation/shuibei-gold-rush">水贝买金 →</a>
      </article>
      <article class="today-card">
        <h3>今日热搜</h3>
        <ol v-if="todayTrends.length" class="today-list">
          <li v-for="(t, i) in todayTrends" :key="i">{{ t }}</li>
        </ol>
        <p v-else-if="todayError" class="today-empty">暂无数据</p>
        <p v-else class="today-empty">加载中…</p>
        <a class="today-link" href="/archive">更多文章 →</a>
      </article>
      <article class="today-card">
        <h3>最新简报</h3>
        <ul v-if="todayBriefs.length" class="today-list today-briefs">
          <li v-for="(b, i) in todayBriefs" :key="i"><strong>{{ b.title }}</strong><span>{{ b.summary }}</span></li>
        </ul>
        <p v-else-if="todayError" class="today-empty">暂无数据</p>
        <p v-else class="today-empty">加载中…</p>
        <a class="today-link" href="/market/briefings.json">全部简报 →</a>
      </article>
    </div>
  </section>

  <section class="home-section home-latest">
<!-- LATEST-START:以下由 scripts/gen-seo.mjs 构建时自动生成,勿手工改 -->
    <div class="home-head">
      <h1>最新文章</h1>
      <nav class="home-topics" aria-label="文章栏目"><a class="home-topic" href="/archive?category=AI">AI<span>70</span></a><a class="home-topic" href="/investment/">投资<span>25</span></a><a class="home-topic" href="/thinking/">思考<span>7</span></a><a class="home-topic is-all" href="/archive">全部 103 篇 →</a></nav>
    </div>
    <div class="article-list latest-grid">
    <div class="home-carousel" data-carousel>
      <div class="hc-stage">
        <a class="hc-slide is-active" href="/investment/liang-wenfeng-deepseek-valuation"><img class="hc-img" src="/images/liang-wenfeng/cover.jpg" alt="梁文锋身价飙升到550亿美元，持股变少但钱变多了" loading="eager" fetchpriority="high" decoding="async" /></a>
        <a class="hc-slide" href="/investment/spacex-starmind"><img class="hc-img" src="/images/2026-11-26-spacex-starmind-cover-photo.jpg" alt="SpaceX获批部署百万颗卫星，什么样的AI生意值得搬上太空?" loading="lazy" decoding="async" /></a>
        <a class="hc-slide" href="/ai/trends/tesla-fsd-duan-yongping"><img class="hc-img" src="/images/tesla-fsd-duan/cover.jpg" alt="特斯拉FSD年度最好的免费代言：段永平雇了一个月薪99美元没驾照的“司机”" loading="lazy" decoding="async" /></a>
        <button class="hc-arrow hc-prev" type="button" aria-label="上一篇">‹</button>
        <button class="hc-arrow hc-next" type="button" aria-label="下一篇">›</button>
        <div class="hc-dots"><button class="hc-dot is-active" type="button" aria-label="第 1 篇"></button><button class="hc-dot" type="button" aria-label="第 2 篇"></button><button class="hc-dot" type="button" aria-label="第 3 篇"></button></div>
      </div>
      <div class="hc-panels">
        <a class="hc-panel is-active" href="/investment/liang-wenfeng-deepseek-valuation">
          <span class="article-card-meta"><span class="article-card-cat">投资</span><time datetime="2026-11-26">2026.11.26</time></span>
          <strong>梁文锋身价飙升到550亿美元，持股变少但钱变多了</strong><small>梁文锋持股从 81.65% 降到 67.4%，身家却从 360 亿美元涨到 550 亿美元。涨的不是他收到的钱，是投资人重新给 DeepSeek 定的价。</small>
        </a>
        <a class="hc-panel" href="/investment/spacex-starmind">
          <span class="article-card-meta"><span class="article-card-cat">投资</span><time datetime="2026-11-26">2026.11.26</time></span>
          <strong>SpaceX获批部署百万颗卫星，什么样的AI生意值得搬上太空?</strong><small>FCC 附条件批准 SpaceX 部署最多 100 万颗计算卫星 Starmind，美国历史上首个太空数据中心星座授权。本文从第一颗卫星的生意算起：谁愿意付钱，把一道原本可以在地面算的题送上天？</small>
        </a>
        <a class="hc-panel" href="/ai/trends/tesla-fsd-duan-yongping">
          <span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-26">2026.11.26</time></span>
          <strong>特斯拉FSD年度最好的免费代言：段永平雇了一个月薪99美元没驾照的“司机”</strong><small>段永平在雪球上说，自己的司机没驾照，一个月 99 美元。FSD 从新鲜感变成日常习惯，再变成租车时的必要条件——特斯拉卖的可能是一份数字劳动力。</small>
        </a>
      </div>
    </div>
      <a class="article-card" href="/thinking/life/dan-koe-deep-work-routine">
        <img class="article-card-thumb" src="/images/dan-koe-deep-work/cover.jpg" alt="Dan Koe：改变我人生的深度工作法（每天早上 1 小时）" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">思考</span><time datetime="2026-11-26">2026.11.26</time></span><strong>Dan Koe：改变我人生的深度工作法（每天早上 1 小时）</strong></div>
      </a>
      <a class="article-card" href="/investment/asset-allocation/fu-peng-market-crash">
        <img class="article-card-thumb" src="/images/fu-peng-v2-cover.jpg" alt="《付鹏深度访谈》完整解读版" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">投资</span><time datetime="2026-11-26">2026.11.26</time></span><strong>《付鹏深度访谈》完整解读版</strong></div>
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
      <li><a href="/investment/trump-shenzhen-tariffs"><span class="latest-row-head"><span class="latest-row-title">特朗普刚夸完深圳，转身就想对华加20%关税？</span><span class="latest-row-date">· <time datetime="2026-11-26">2026.11.26</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/trump-tariffs/cover.jpg" alt="特朗普刚夸完深圳，转身就想对华加20%关税？" loading="lazy" decoding="async" /><span class="latest-row-desc">特朗普刚夸完深圳干净无瑕，六天后 USTR 就对华提出最高 20% 的关税方案。20% 从哪来、手机和餐盘为什么待遇不同、40% 又在什么情况下才会用？</span></span></a></li>
      <li><a href="/investment/openai-125t-valuation"><span class="latest-row-head"><span class="latest-row-title">OpenAI估值低了1500亿美元，谁拿回了定价权？</span><span class="latest-row-date">· <time datetime="2026-11-25">2026.11.25</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/2026-11-25-openai-125t-valuation-cover-photo.jpg" alt="OpenAI估值低了1500亿美元，谁拿回了定价权？" loading="lazy" decoding="async" /><span class="latest-row-desc">OpenAI一个季度做了100亿美元收入，经调整经营亏损却达到109亿美元，而新投资人愿意给它的投前估值，仍有1.25万亿美元。本文从这组反差出发，拆解定价权、收入结构与五年业绩兑现。</span></span></a></li>
      <li><a href="/ai/trends/humanoid-factory-orders"><span class="latest-row-head"><span class="latest-row-title">人形机器人刷屏，工厂为什么还在买机械臂？</span><span class="latest-row-date">· <time datetime="2026-11-25">2026.11.25</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/2026-11-25-humanoid-factory-orders-cover-photo.jpg" alt="人形机器人刷屏，工厂为什么还在买机械臂？" loading="lazy" decoding="async" /><span class="latest-row-desc">宝马让人形机器人搬过逾 9 万件钣金件，支持生产逾 3 万辆 X3，可公开资料里能找到的结算数字，是约 1,250 个运行小时。本文从这组反差出发，拆解工厂订单、成本账与 2,300 亿美元市场的归属。</span></span></a></li>
      <li><a href="/investment/xiaomi-2026-q3"><span class="latest-row-head"><span class="latest-row-title">小米少赚64亿元，钱到底去哪了？</span><span class="latest-row-date">· <time datetime="2026-11-25">2026.11.25</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/xiaomi-2026-q3-cover.jpg" alt="小米少赚64亿元，钱到底去哪了？" loading="lazy" decoding="async" /><span class="latest-row-desc">小米三季度经调整净利润 48.84 亿元，同比少赚 64.27 亿元。研发只多花了 1.83 亿，钱到底去哪了？本文从利润表出发，拆四门生意的毛利缺口、汽车的盈亏平衡与 AI 投入的回报周期。</span></span></a></li>
      <li><a href="/investment/shenzhou-24"><span class="latest-row-head"><span class="latest-row-title">神舟二十四号之后，中国商业航天离赚钱还有多远？</span><span class="latest-row-date">· <time datetime="2026-11-25">2026.11.25</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/2026-11-25-shenzhou-24-cover-photo.jpg" alt="神舟二十四号之后，中国商业航天离赚钱还有多远？" loading="lazy" decoding="async" /><span class="latest-row-desc">一枚火箭的平均成本降了近两成，造火箭的公司却在九个月里亏了约7.49亿元。本文从中科宇航的招股书出发，拆解成本、发射频率、回收复用与星座订单，看中国商业航天离赚钱还有多远。</span></span></a></li>
      <li><a href="/ai/trends/ai-short-drama-chouhu"><span class="latest-row-head"><span class="latest-row-title">有人用AI做出《丑狐》短剧，首集三天播放破亿</span><span class="latest-row-date">· <time datetime="2026-11-25">2026.11.25</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/ai-short-drama-chouhu-cover.jpg" alt="有人用AI做出《丑狐》短剧，首集三天播放破亿" loading="lazy" decoding="async" /><span class="latest-row-desc">一个人加 AI 做出《丑狐》，首集三天播放破亿。但能复制的不是爆款本身，而是它背后的工时分配、定脸返工与结算结构。</span></span></a></li>
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
