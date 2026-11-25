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
      <nav class="home-topics" aria-label="文章栏目"><a class="home-topic" href="/archive?category=AI">AI<span>69</span></a><a class="home-topic" href="/investment/">投资<span>21</span></a><a class="home-topic" href="/thinking/">思考<span>6</span></a><a class="home-topic is-all" href="/archive">全部 97 篇 →</a></nav>
    </div>
    <div class="article-list latest-grid">
    <div class="home-carousel" data-carousel>
      <div class="hc-stage">
        <a class="hc-slide is-active" href="/investment/xiaomi-2026-q3"><img class="hc-img" src="/images/xiaomi-2026-q3-cover.jpg" alt="小米少赚64亿元，钱到底去哪了？" loading="eager" fetchpriority="high" decoding="async" /></a>
        <a class="hc-slide" href="/investment/shenzhou-24"><img class="hc-img" src="/images/2026-11-25-shenzhou-24-cover-photo.jpg" alt="神舟二十四号之后，中国商业航天离赚钱还有多远？" loading="lazy" decoding="async" /></a>
        <a class="hc-slide" href="/ai/trends/ai-short-drama-chouhu"><img class="hc-img" src="/images/ai-short-drama-chouhu-cover.jpg" alt="有人用AI做出《丑狐》短剧，首集三天播放破亿" loading="lazy" decoding="async" /></a>
        <button class="hc-arrow hc-prev" type="button" aria-label="上一篇">‹</button>
        <button class="hc-arrow hc-next" type="button" aria-label="下一篇">›</button>
        <div class="hc-dots"><button class="hc-dot is-active" type="button" aria-label="第 1 篇"></button><button class="hc-dot" type="button" aria-label="第 2 篇"></button><button class="hc-dot" type="button" aria-label="第 3 篇"></button></div>
      </div>
      <div class="hc-panels">
        <a class="hc-panel is-active" href="/investment/xiaomi-2026-q3">
          <span class="article-card-meta"><span class="article-card-cat">投资</span><time datetime="2026-11-25">2026.11.25</time></span>
          <strong>小米少赚64亿元，钱到底去哪了？</strong><small>小米三季度经调整净利润 48.84 亿元，同比少赚 64.27 亿元。研发只多花了 1.83 亿，钱到底去哪了？本文从利润表出发，拆四门生意的毛利缺口、汽车的盈亏平衡与 AI 投入的回报周期。</small>
        </a>
        <a class="hc-panel" href="/investment/shenzhou-24">
          <span class="article-card-meta"><span class="article-card-cat">投资</span><time datetime="2026-11-25">2026.11.25</time></span>
          <strong>神舟二十四号之后，中国商业航天离赚钱还有多远？</strong><small>一枚火箭的平均成本降了近两成，造火箭的公司却在九个月里亏了约7.49亿元。本文从中科宇航的招股书出发，拆解成本、发射频率、回收复用与星座订单，看中国商业航天离赚钱还有多远。</small>
        </a>
        <a class="hc-panel" href="/ai/trends/ai-short-drama-chouhu">
          <span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-25">2026.11.25</time></span>
          <strong>有人用AI做出《丑狐》短剧，首集三天播放破亿</strong><small>一个人加 AI 做出《丑狐》，首集三天播放破亿。但能复制的不是爆款本身，而是它背后的工时分配、定脸返工与结算结构。</small>
        </a>
      </div>
    </div>
      <a class="article-card" href="/investment/asset-allocation/fu-peng-market-crash">
        <img class="article-card-thumb" src="/images/2026-11-25-fu-peng-market-crash-cover.jpg" alt="为什么每次市场崩盘，大多数人都跑不掉？——读付鹏访谈有感" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">投资</span><time datetime="2026-11-25">2026.11.25</time></span><strong>为什么每次市场崩盘，大多数人都跑不掉？——读付鹏访谈有感</strong></div>
      </a>
      <a class="article-card" href="/ai/trends/humanoid-factory-orders">
        <img class="article-card-thumb" src="/images/2026-11-25-humanoid-factory-orders-cover-photo.jpg" alt="人形机器人刷屏，工厂为什么还在买机械臂？" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-25">2026.11.25</time></span><strong>人形机器人刷屏，工厂为什么还在买机械臂？</strong></div>
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
      <li><a href="/ai/trends/mental-obesity"><span class="latest-row-head"><span class="latest-row-title">人类正在进入精神肥胖时代</span><span class="latest-row-date">· <time datetime="2026-11-24">2026.11.24</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/2026-11-24-mental-obesity-cover.jpg" alt="人类正在进入精神肥胖时代" loading="lazy" decoding="async" /><span class="latest-row-desc">Dan Koe 说人类正在变得“精神肥胖”：信息生产能力暴涨，处理能力原地踏步，AI 还在加速。NIH 实验、微软 319 人研究与多巴胺排毒的真相，都指向同一件事——该像管理饮食一样管理信息了。</span></span></a></li>
      <li><a href="/investment/tesla/spacex-tesla-merger"><span class="latest-row-head"><span class="latest-row-title">SpaceX与特斯拉合并提速，3.5万亿美元巨头将诞生？</span><span class="latest-row-date">· <time datetime="2026-11-24">2026.11.24</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/2026-11-24-spacex-tesla-merger-cover.jpg" alt="SpaceX与特斯拉合并提速，3.5万亿美元巨头将诞生？" loading="lazy" decoding="async" /><span class="latest-row-desc">《金融时报》11月24日披露，SpaceX与特斯拉特别委员会成员及投行安排浮出水面：五名董事、摩根士丹利与高盛、Evercore，全股票合并指向约3.5万亿美元。本文拆解谈判进度、换股机制、协同逻辑与监管障碍，以及特斯拉股东可能面临的五种情景。</span></span></a></li>
      <li><a href="/investment/ai-server-price-cost-profit"><span class="latest-row-head"><span class="latest-row-title">AI服务器最高涨价45%，谁在赚走算力的钱？</span><span class="latest-row-date">· <time datetime="2026-11-24">2026.11.24</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/ai-server-price-cost-profit-cover.jpg" alt="AI服务器最高涨价45%，谁在赚走算力的钱？" loading="lazy" decoding="async" /><span class="latest-row-desc">AI服务器部分订单最高涨价45%，背后是GPU、HBM、DRAM及企业级SSD的供需变化。本文从产业链定价权、成本传导、算力利用率和资本回报出发，分析AI基础设施涨价最终由谁承担。</span></span></a></li>
      <li><a href="/ai/trends/gta-6-first-day-sales"><span class="latest-row-head"><span class="latest-row-title">全球最大的娱乐产品：GTA 6首日卖了37.9亿美元</span><span class="latest-row-date">· <time datetime="2026-11-24">2026.11.24</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/gta-6-first-day-sales-cover.jpg" alt="全球最大的娱乐产品：GTA 6首日卖了37.9亿美元" loading="lazy" decoding="async" /><span class="latest-row-desc">11月19日，Rockstar正式发售《GTA 6》，首日零售销售额37.9亿美元，发售前已售出3250万份。为什么消费者愿意提前数月为尚未交付的产品付款？这套打法对软件开发者、AI创业公司有什么值得学习的地方？</span></span></a></li>
      <li><a href="/ai/trends/huang-return-ai-bubble"><span class="latest-row-head"><span class="latest-row-title">黄仁勋回来了，但AI泡沫消失了吗？</span><span class="latest-row-date">· <time datetime="2026-11-24">2026.11.24</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/huang-return-ai-bubble-cover.jpg" alt="黄仁勋回来了，但AI泡沫消失了吗？" loading="lazy" decoding="async" /><span class="latest-row-desc">黄仁勋回来了，AI概念股集体反弹。但循环融资、算力过剩、资本开支失控这些问题，真的随着他的归来一并消失了吗？从塔勒布的反脆弱视角，重新审视AI产业的风险结构。</span></span></a></li>
      <li><a href="/ai/trends/multi-agent-100-vs-1"><span class="latest-row-head"><span class="latest-row-title">让100个Agent协作，真的比1个Agent更聪明吗？</span><span class="latest-row-date">· <time datetime="2026-11-24">2026.11.24</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/multi-agent-100-vs-1-cover.jpg" alt="让100个Agent协作，真的比1个Agent更聪明吗？" loading="lazy" decoding="async" /><span class="latest-row-desc">11月22日，一个挑战 P vs NP 的 Agent 集群项目登上 Hacker News，拿了 187 个积分。Google 的实验显示，多 Agent 在金融分析上能提升 80.9%，却在顺序推理上倒退 39% 至 70%。100 个 Agent 协作，到底是更聪明，还是更贵、更乱？</span></span></a></li>
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
