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
      <nav class="home-topics" aria-label="文章栏目"><a class="home-topic" href="/ai/">AI<span>65</span></a><a class="home-topic" href="/investment/">投资<span>16</span></a><a class="home-topic" href="/thinking/">思考<span>6</span></a><a class="home-topic is-all" href="/archive">全部 88 篇 →</a></nav>
    </div>
    <div class="article-list latest-grid">
    <div class="home-carousel" data-carousel>
      <div class="hc-stage">
        <a class="hc-slide is-active" href="/ai/trends/multi-agent-100-vs-1"><img class="hc-img" src="/images/multi-agent-100-vs-1-cover.jpg" alt="让100个Agent协作，真的比1个Agent更聪明吗？" loading="eager" fetchpriority="high" decoding="async" /></a>
        <a class="hc-slide" href="/ai/trends/huang-return-ai-bubble"><img class="hc-img" src="/images/huang-return-ai-bubble-cover.jpg" alt="黄仁勋回来了，但AI泡沫消失了吗？" loading="lazy" decoding="async" /></a>
        <a class="hc-slide" href="/ai/trends/meta-wang-superintelligence-arriving"><img class="hc-img" src="/images/2026-11-23-meta-wang-superintelligence-arriving-cover-photo.jpg" alt="Meta首席AI官：超级智能正在到来" loading="lazy" decoding="async" /></a>
        <button class="hc-arrow hc-prev" type="button" aria-label="上一篇">‹</button>
        <button class="hc-arrow hc-next" type="button" aria-label="下一篇">›</button>
        <div class="hc-dots"><button class="hc-dot is-active" type="button" aria-label="第 1 篇"></button><button class="hc-dot" type="button" aria-label="第 2 篇"></button><button class="hc-dot" type="button" aria-label="第 3 篇"></button></div>
      </div>
      <div class="hc-panels">
        <a class="hc-panel is-active" href="/ai/trends/multi-agent-100-vs-1">
          <span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-24">2026.11.24</time></span>
          <strong>让100个Agent协作，真的比1个Agent更聪明吗？</strong><small>11月22日，一个挑战 P vs NP 的 Agent 集群项目登上 Hacker News，拿了 187 个积分。Google 的实验显示，多 Agent 在金融分析上能提升 80.9%，却在顺序推理上倒退 39% 至 70%。100 个 Agent 协作，到底是更聪明，还是更贵、更乱？</small>
        </a>
        <a class="hc-panel" href="/ai/trends/huang-return-ai-bubble">
          <span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-24">2026.11.24</time></span>
          <strong>黄仁勋回来了，但AI泡沫消失了吗？</strong><small>黄仁勋回来了，AI概念股集体反弹。但循环融资、算力过剩、资本开支失控这些问题，真的随着他的归来一并消失了吗？从塔勒布的反脆弱视角，重新审视AI产业的风险结构。</small>
        </a>
        <a class="hc-panel" href="/ai/trends/meta-wang-superintelligence-arriving">
          <span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-23">2026.11.23</time></span>
          <strong>Meta首席AI官：超级智能正在到来</strong><small>Meta 首席 AI 官 Alexandr Wang 称超级智能正在到来，论据是 Claude 协助证明的黎曼猜想；本文逐项拆解他的推理链——AIME 类比、递归自我改进、1000 倍、控制权与权限，以及 Meta 与 OpenAI 的路线分歧。</small>
        </a>
      </div>
    </div>
      <a class="article-card" href="/investment/asset-allocation/shuibei-gold-rush">
        <img class="article-card-thumb" src="/images/2026-11-23-shuibei-gold-rush-cover-scrapbook.jpg" alt="深圳水贝排队买金的人又多起来了" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">投资</span><time datetime="2026-11-23">2026.11.23</time></span><strong>深圳水贝排队买金的人又多起来了</strong></div>
      </a>
      <a class="article-card" href="/ai/trends/trump-huang-return">
        <img class="article-card-thumb" src="/images/trump-huang-return-cover.jpg" alt="特朗普要黄仁勋回来，老黄是不是被他坑大了？" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-23">2026.11.23</time></span><strong>特朗普要黄仁勋回来，老黄是不是被他坑大了？</strong></div>
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
      <li><a href="/ai/trends/chip-war-supply-chain"><span class="latest-row-head"><span class="latest-row-title">芯片战争打到供应链，谁在卡谁的脖子？</span><span class="latest-row-date">· <time datetime="2026-11-23">2026.11.23</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/2026-11-23-chip-war-supply-chain-cover-scrapbook.jpg" alt="芯片战争打到供应链，谁在卡谁的脖子？" loading="lazy" decoding="async" /><span class="latest-row-desc">《芯片战争》作者米勒11月21日在《金融时报》发文：AI供应链成为美中竞争的下一个战场。美国卡设计与设备，中国卡材料精炼与电子制造——谁更容易被对方卡住？</span></span></a></li>
      <li><a href="/ai/trends/riemann-second-proof"><span class="latest-row-head"><span class="latest-row-title">黎曼猜想的第二份证明出来了</span><span class="latest-row-date">· <time datetime="2026-11-23">2026.11.23</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/riemann-second-proof-cover.jpg" alt="黎曼猜想的第二份证明出来了" loading="lazy" decoding="async" /><span class="latest-row-desc">2026 年 11 月 20 日，数学界同一天迎来两份黎曼猜想证明：Alpöge 与 Claude 的 1700 万行 Lean 形式化证明已通过多项独立机器核验；Masullo 的 940 页传统手稿，第 13 章关键定理还没写出来。</span></span></a></li>
      <li><a href="/investment/us-stocks/masters-holdings-returns"><span class="latest-row-head"><span class="latest-row-title">股神们一年都白干，段永平却赚了12%</span><span class="latest-row-date">· <time datetime="2026-11-23">2026.11.23</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/2026-11-23-masters-holdings-returns-cover-shi-tu-pei-wen.jpg" alt="股神们一年都白干，段永平却赚了12%" loading="lazy" decoding="async" /><span class="latest-row-desc">11月20日纳指暴跌5.28%，六位华人投资大佬近一年只有段永平赚钱：+12.29%。拆他的13F持仓：苹果加伯克希尔占了三分之二，英伟达三季度减仓63%。</span></span></a></li>
      <li><a href="/ai/trends/tesla-fsd-v15-rollout"><span class="latest-row-head"><span class="latest-row-title">特斯拉FSD v15开始推送：安全提升25倍，离真正无人驾驶还有多远？</span><span class="latest-row-date">· <time datetime="2026-11-22">2026.11.22</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/2026-11-22-tesla-fsd-v15-cover-shi-tu-pei-wen.jpg" alt="特斯拉FSD v15开始推送：安全提升25倍，离真正无人驾驶还有多远？" loading="lazy" decoding="async" /><span class="latest-row-desc">11月21日特斯拉开始向首批用户推送FSD v15，关键接管指标改善25倍。视觉编码器与Robotaxi、Optimus共享，Reality View上线，路线规划开始学习车队偏好。25倍到底指什么，离无人驾驶还有多远？</span></span></a></li>
      <li><a href="/ai/trends/xpeng-robot-ces-visa-denial"><span class="latest-row-head"><span class="latest-row-title">小鹏机器人赴美遭拒签：美国开始限制中国AI工程师了？</span><span class="latest-row-date">· <time datetime="2026-11-22">2026.11.22</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/2026-11-22-xpeng-robot-ces-visa-denial-cover-shi-tu-pei-wen.jpg" alt="小鹏机器人赴美遭拒签：美国开始限制中国AI工程师了？" loading="lazy" decoding="async" /><span class="latest-row-desc">11月19日《日经亚洲》报道，小鹏、众擎等中国机器人企业的部分技术人员申请赴美参加 CES 遭拒签，一家企业 15 名技术人员全被拒后退出 CES。签证、设备认证、出口管制，三重门槛意味着什么？</span></span></a></li>
      <li><a href="/investment/asset-allocation/fed-rate-hikes-market-crash"><span class="latest-row-head"><span class="latest-row-title">美联储又要连续加息？黄金、比特币、美股一起暴跌，制造黑色星期五</span><span class="latest-row-date">· <time datetime="2026-11-21">2026.11.21</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/2026-11-21-fed-rate-hikes-market-crash-cover-paper-cut.jpg" alt="美联储又要连续加息？黄金、比特币、美股一起暴跌，制造黑色星期五" loading="lazy" decoding="async" /><span class="latest-row-desc">11月20日纳指单日跌5.28%、年内涨幅全部蒸发，黄金跌破3600美元、比特币跌破6万美元。摩根大通预计美联储12月、明年1月和3月连续加息三次，利率预期翻转之下，为什么避险资产也一起跌？</span></span></a></li>
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
