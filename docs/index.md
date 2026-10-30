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
  <aside class="home-trends is-left" id="trends-digest">
    <TrendsDigest column="left" />
  </aside>

  <div class="home-main">
  <section class="home-section home-latest">
<!-- LATEST-START:以下由 scripts/gen-seo.mjs 构建时自动生成,勿手工改 -->
    <div class="home-head">
      <h1>最新文章</h1>
      <nav class="home-topics" aria-label="文章栏目"><a class="home-topic" href="/ai/">AI<span>25</span></a><a class="home-topic" href="/investment/">投资<span>5</span></a><a class="home-topic" href="/thinking/">思考<span>5</span></a><a class="home-topic is-all" href="/archive">全部 35 篇 →</a></nav>
    </div>
    <div class="article-list latest-grid">
    <div class="home-carousel" data-carousel>
      <div class="hc-stage">
        <a class="hc-slide is-active" href="/ai/trends/hongguo-ai-attention"><img class="hc-img" src="/images/hongguo-ai-attention/cover.jpg" alt="红果日活1.68亿，人均每天看两小时：真正可怕的，是AI开始批量生产你的注意力" loading="eager" fetchpriority="high" decoding="async" /></a>
        <a class="hc-slide" href="/ai/agents/luckin-coffee-mcp"><img class="hc-img" src="/images/luckin-coffee-mcp/cover.jpg" alt="如何让Grokbot帮我点一杯瑞幸咖啡" loading="lazy" decoding="async" /></a>
        <a class="hc-slide" href="/ai/trends/claude-prevent-ban-guide"><img class="hc-img" src="/images/claude-prevent-ban-guide/cover.jpg" alt="Claude预防封号保姆级教程" loading="lazy" decoding="async" /></a>
        <button class="hc-arrow hc-prev" type="button" aria-label="上一篇">‹</button>
        <button class="hc-arrow hc-next" type="button" aria-label="下一篇">›</button>
        <div class="hc-dots"><button class="hc-dot is-active" type="button" aria-label="第 1 篇"></button><button class="hc-dot" type="button" aria-label="第 2 篇"></button><button class="hc-dot" type="button" aria-label="第 3 篇"></button></div>
      </div>
      <div class="hc-panels">
        <a class="hc-panel is-active" href="/ai/trends/hongguo-ai-attention">
          <span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-10-29">2026.10.29</time></span>
          <strong>红果日活1.68亿，人均每天看两小时：真正可怕的，是AI开始批量生产你的注意力</strong><small>红果日活1.68亿、人均单日125分钟。秦朔看到“字节时间”，程苓峰看到AI短剧的“核爆”。当内容几乎可以无限生成，真正稀缺的是人的注意力，以及自主分配它的能力。</small>
        </a>
        <a class="hc-panel" href="/ai/agents/luckin-coffee-mcp">
          <span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-10-29">2026.10.29</time></span>
          <strong>如何让Grokbot帮我点一杯瑞幸咖啡</strong><small>瑞幸开放标准 MCP 后，我用 Grok Bot 自定义连接器真实下单了一杯大杯冰美式；文末附滴滴、高德、麦当劳等国内 MCP 入口。</small>
        </a>
        <a class="hc-panel" href="/ai/trends/claude-prevent-ban-guide">
          <span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-10-29">2026.10.29</time></span>
          <strong>Claude预防封号保姆级教程</strong><small>从积分制、注册、支付、固定 IP、客户端分工到观察期处置与一页清单，整理 Claude 防封的社区经验（非官方）。主线：环境先于付款，稳定先于一切。</small>
        </a>
      </div>
    </div>
      <a class="article-card" href="/investment/us-stocks/alphabet-q3-earnings-miss">
        <img class="article-card-thumb" src="/images/alphabet-q3-cover.webp" alt="Alphabet Q3：销售额和利润双双不及预期，云是唯一亮点" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">投资</span><time datetime="2026-10-29">2026.10.29</time></span><strong>Alphabet Q3：销售额和利润双双不及预期，云是唯一亮点</strong></div>
      </a>
      <a class="article-card" href="/ai/agents/grok-bot-guide">
        <img class="article-card-thumb" src="/images/grok-bot-guide/cover.jpg" alt="Grok Bot 是什么，以及怎么真正用起来" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-10-29">2026.10.29</time></span><strong>Grok Bot 是什么，以及怎么真正用起来</strong></div>
      </a>
      <a class="article-card" href="/ai/trends/claude-drug-development">
        <img class="article-card-thumb" src="/images/claude-drug-development/cover-scene.jpg" alt="用 Claude 加速药物研发：早期进展" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-10-28">2026.10.28</time></span><strong>用 Claude 加速药物研发：早期进展</strong></div>
      </a>
      <a class="article-card" href="/ai/trends/claude-search-surge">
        <img class="article-card-thumb" src="/images/claude-search-surge/fig01_gt_compare.png" alt="Claude 搜索热度是 OpenAI 的 13 倍？开发者为什么都在用 Claude" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-10-16">2026.10.16</time></span><strong>Claude 搜索热度是 OpenAI 的 13 倍？开发者为什么都在用 Claude</strong></div>
      </a>
    </div>
    <ul class="latest-rows">
      <li><a href="/ai/design/how-i-design-with-ai-pt2"><span class="latest-row-head"><span class="latest-row-title">我如何用 AI 做设计（其二）</span><span class="latest-row-date">· <time datetime="2026-10-28">2026.10.28</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/how-i-design-with-ai-pt2/cover.jpg" alt="我如何用 AI 做设计（其二）" loading="lazy" decoding="async" /><span class="latest-row-desc">用大量 agents 设计复杂功能时如何少塞 slop：先理解系统、追踪轨迹、扫全状态、放大关键界面，再和团队打磨后发版。</span></span></a></li>
      <li><a href="/ai/agents/multiagent-eng-problems"><span class="latest-row-head"><span class="latest-row-title">工程师觉得自己要失业？多 Agent 真正卡在软件工程</span><span class="latest-row-date">· <time datetime="2026-10-28">2026.10.28</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/multiagent-eng-problems.jpg" alt="工程师觉得自己要失业？多 Agent 真正卡在软件工程" loading="lazy" decoding="async" /><span class="latest-row-desc">Anthropic 平台负责人 Katelyn Lesse 说，多 Agent 系统要解锁真正硬问题，必须先由软件工程师把基础设施、身份授权、隔离和熔断做出来。</span></span></a></li>
      <li><a href="/ai/trends/claude-ban-reasons"><span class="latest-row-head"><span class="latest-row-title">Claude 为什么动不动封号？官方条款 vs X 上的防封玄学</span><span class="latest-row-date">· <time datetime="2026-10-27">2026.10.27</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/claude-ban-reasons/cover.jpg" alt="Claude 为什么动不动封号？官方条款 vs X 上的防封玄学" loading="lazy" decoding="async" /><span class="latest-row-desc">Anthropic 半年封了 1140 万账号。官方三类封因、Supported Regions（含控股穿透）、Usage Policy 与社区传闻怎么对照，以及被封后能做什么。</span></span></a></li>
      <li><a href="/ai/coding/claude-code-team-review"><span class="latest-row-head"><span class="latest-row-title">Claude Code 团队如何做代码审查</span><span class="latest-row-date">· <time datetime="2026-10-27">2026.10.27</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/claude-code-team-review/cover.jpg" alt="Claude Code 团队如何做代码审查" loading="lazy" decoding="async" /><span class="latest-row-desc">Claude 写了约 90% 的 Claude Code。在日合并量暴涨时，他们如何用多层自动化审查、按风险分级人工审批，并把事故做成评测集。</span></span></a></li>
      <li><a href="/thinking/technology/ai-most-important-ability"><span class="latest-row-head"><span class="latest-row-title">当 AI 能帮你做任何事，你最重要的能力是什么？</span><span class="latest-row-date">· <time datetime="2026-10-25">2026.10.25</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/ai-most-important-ability-cover.jpg" alt="当 AI 能帮你做任何事，你最重要的能力是什么？" loading="lazy" decoding="async" /><span class="latest-row-desc">AI 时代最重要的能力是什么？当 AI 让想法的实现成本大幅下降，真正决定一个人能走多远的，不再是能做多少事，而是判断什么事值得做。</span></span></a></li>
      <li><a href="/ai/coding/muse-build-personal-site"><span class="latest-row-head"><span class="latest-row-title">从装一个 App 到上线一个站：我用 Muse 搭 promangofund.com 的全过程</span><span class="latest-row-date">· <time datetime="2026-10-25">2026.10.25</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/muse-site-home.png" alt="从装一个 App 到上线一个站：我用 Muse 搭 promangofund.com 的全过程" loading="lazy" decoding="async" /><span class="latest-row-desc">这个站从 10 月 5 日第一行配置，到今天每一次改版，都是我一句话、Muse 去干活。</span></span></a></li>
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
    </div>
  </section>
  </div>

  <aside class="home-trends is-right" id="trends-digest-right">
    <TrendsDigest column="right" />
  </aside>

</div>
