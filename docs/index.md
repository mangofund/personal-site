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
      <nav class="home-topics" aria-label="文章栏目"><a class="home-topic" href="/ai/">AI<span>28</span></a><a class="home-topic" href="/investment/">投资<span>7</span></a><a class="home-topic" href="/thinking/">思考<span>5</span></a><a class="home-topic is-all" href="/archive">全部 40 篇 →</a></nav>
    </div>
    <div class="article-list latest-grid">
    <div class="home-carousel" data-carousel>
      <div class="hc-stage">
        <a class="hc-slide is-active" href="/ai/agents/apple-qwen-agent"><img class="hc-img" src="/images/apple-qwen-cover.jpg" alt="苹果等了两年半，千问 12 月住进国行 iPhone：Agent 大战为什么会在手机上见分晓？" loading="eager" fetchpriority="high" decoding="async" /></a>
        <a class="hc-slide" href="/ai/trends/reddit-ai-search-traffic"><img class="hc-img" src="/images/reddit-cover.jpg" alt="营收涨 53%，股价跌 29%：谁偷走了 Reddit 的流量？" loading="lazy" decoding="async" /></a>
        <a class="hc-slide" href="/ai/agents/super-agent-design"><img class="hc-img" src="/images/super-agent-cover.jpg" alt="DeepSeek 提出 Super-agent：AI Agent 为什么需要摆脱聊天窗口？" loading="lazy" decoding="async" /></a>
        <button class="hc-arrow hc-prev" type="button" aria-label="上一篇">‹</button>
        <button class="hc-arrow hc-next" type="button" aria-label="下一篇">›</button>
        <div class="hc-dots"><button class="hc-dot is-active" type="button" aria-label="第 1 篇"></button><button class="hc-dot" type="button" aria-label="第 2 篇"></button><button class="hc-dot" type="button" aria-label="第 3 篇"></button></div>
      </div>
      <div class="hc-panels">
        <a class="hc-panel is-active" href="/ai/agents/apple-qwen-agent">
          <span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-02">2026.11.02</time></span>
          <strong>苹果等了两年半，千问 12 月住进国行 iPhone：Agent 大战为什么会在手机上见分晓？</strong><small>千问 12 月住进国行 iPhone，苹果把中国版 Agent 的默认入口交给了阿里：Agent 大战的决战地不在云端架构，而在手机上。</small>
        </a>
        <a class="hc-panel" href="/ai/trends/reddit-ai-search-traffic">
          <span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-02">2026.11.02</time></span>
          <strong>营收涨 53%，股价跌 29%：谁偷走了 Reddit 的流量？</strong><small>营收涨 53% 却暴跌 29%，Reddit 财报电话会上的一句警告揭开了 AI 搜索截流的真相：谷歌 AI 正在拿走全网流量，内容站长的流量经济学正在重构。</small>
        </a>
        <a class="hc-panel" href="/ai/agents/super-agent-design">
          <span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-11-02">2026.11.02</time></span>
          <strong>DeepSeek 提出 Super-agent：AI Agent 为什么需要摆脱聊天窗口？</strong><small>Super-agent 不是更大的模型，而是一套让 Agent 摆脱聊天窗口、长期持续工作的架构：两层调度、事件驱动、异步执行与独立看门狗。</small>
        </a>
      </div>
    </div>
      <a class="article-card" href="/investment/crypto/crypto-decentralization-shoddy">
        <img class="article-card-thumb" src="/images/crypto-decentralization-shoddy/cover.jpg" alt="加密货币的“去中心化”，到底是不是草台班子？" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">投资</span><time datetime="2026-10-31">2026.10.31</time></span><strong>加密货币的“去中心化”，到底是不是草台班子？</strong></div>
      </a>
      <a class="article-card" href="/investment/crypto/binance-security-incident-2026">
        <img class="article-card-thumb" src="/images/binance-security-incident-2026/cover.jpg" alt="币安热钱包被盗约63亿美元：公司说用户不用赔，我们该看哪几条" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">投资</span><time datetime="2026-10-31">2026.10.31</time></span><strong>币安热钱包被盗约63亿美元：公司说用户不用赔，我们该看哪几条</strong></div>
      </a>
      <a class="article-card" href="/ai/trends/hongguo-ai-attention">
        <img class="article-card-thumb" src="/images/hongguo-ai-attention/cover.jpg" alt="红果日活1.68亿，人均每天看两小时：真正可怕的，是AI开始批量生产你的注意力" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-10-29">2026.10.29</time></span><strong>红果日活1.68亿，人均每天看两小时：真正可怕的，是AI开始批量生产你的注意力</strong></div>
      </a>
      <a class="article-card" href="/ai/trends/claude-search-surge">
        <img class="article-card-thumb" src="/images/claude-search-surge/fig01_gt_compare.png" alt="Claude 搜索热度是 OpenAI 的 13 倍？开发者为什么都在用 Claude" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-10-16">2026.10.16</time></span><strong>Claude 搜索热度是 OpenAI 的 13 倍？开发者为什么都在用 Claude</strong></div>
      </a>
    </div>
    <ul class="latest-rows">
      <li><a href="/ai/trends/claude-prevent-ban-guide"><span class="latest-row-head"><span class="latest-row-title">Claude预防封号保姆级教程</span><span class="latest-row-date">· <time datetime="2026-10-29">2026.10.29</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/claude-prevent-ban-guide/cover.jpg" alt="Claude预防封号保姆级教程" loading="lazy" decoding="async" /><span class="latest-row-desc">从积分制、注册、支付、固定 IP、客户端分工到观察期处置与一页清单，整理 Claude 防封的社区经验（非官方）。主线：环境先于付款，稳定先于一切。</span></span></a></li>
      <li><a href="/investment/us-stocks/alphabet-q3-earnings-miss"><span class="latest-row-head"><span class="latest-row-title">Alphabet Q3：销售额和利润双双不及预期，云是唯一亮点</span><span class="latest-row-date">· <time datetime="2026-10-29">2026.10.29</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/alphabet-q3-cover.webp" alt="Alphabet Q3：销售额和利润双双不及预期，云是唯一亮点" loading="lazy" decoding="async" /><span class="latest-row-desc">Alphabet 第三季度营收 1276亿美元、每股收益 2.12美元，均低于预期；自由现金流 -90.7亿美元，连续两季为负；谷歌云营收 307.1亿美元、增长 103%，成为本季唯一亮点。</span></span></a></li>
      <li><a href="/ai/agents/grok-bot-guide"><span class="latest-row-head"><span class="latest-row-title">Grok Bot 是什么，以及怎么真正用起来</span><span class="latest-row-date">· <time datetime="2026-10-29">2026.10.29</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/grok-bot-guide/cover.jpg" alt="Grok Bot 是什么，以及怎么真正用起来" loading="lazy" decoding="async" /><span class="latest-row-desc">译自 Mahax 的 X 长文：Grok Bot 不是模型，而是让模型在云端电脑上替你长期干活的一层。含 7 段可直接粘贴的中文提示词（LinkedIn 获客、会前简报、周刊编辑、口碑监控、初稿、Lead Bot、安全规则），以及什么时候不该用。</span></span></a></li>
      <li><a href="/ai/trends/claude-drug-development"><span class="latest-row-head"><span class="latest-row-title">用 Claude 加速药物研发：早期进展</span><span class="latest-row-date">· <time datetime="2026-10-28">2026.10.28</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/claude-drug-development/cover-scene.jpg" alt="用 Claude 加速药物研发：早期进展" loading="lazy" decoding="async" /><span class="latest-row-desc">Anthropic 生命科学团队与六家药企/机构合作，用 Claude 覆盖靶点、分子设计、优化、生产文书与临床试验规划；并收购 Mithril，推进罕见肌营养不良症项目。</span></span></a></li>
      <li><a href="/ai/design/how-i-design-with-ai-pt1"><span class="latest-row-head"><span class="latest-row-title">我如何用 AI 做设计（其一）</span><span class="latest-row-date">· <time datetime="2026-10-28">2026.10.28</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/how-i-design-with-ai-pt1/cover.jpg" alt="我如何用 AI 做设计（其一）" loading="lazy" decoding="async" /><span class="latest-row-desc">工程师如何用 AI 做产品设计去 slop：从整体约束、删减、设计工具迭代，到组件库、预览部署与品味打磨。</span></span></a></li>
      <li><a href="/ai/design/how-i-design-with-ai-pt2"><span class="latest-row-head"><span class="latest-row-title">我如何用 AI 做设计（其二）</span><span class="latest-row-date">· <time datetime="2026-10-28">2026.10.28</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/how-i-design-with-ai-pt2/cover.jpg" alt="我如何用 AI 做设计（其二）" loading="lazy" decoding="async" /><span class="latest-row-desc">用大量 agents 设计复杂功能时如何少塞 slop：先理解系统、追踪轨迹、扫全状态、放大关键界面，再和团队打磨后发版。</span></span></a></li>
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
    <div class="project-list">
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
    </div>
  </section>

</div>
