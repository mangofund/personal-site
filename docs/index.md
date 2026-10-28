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
  <section class="home-section home-latest">
<!-- LATEST-START:以下由 scripts/gen-seo.mjs 构建时自动生成,勿手工改 -->
    <div class="home-head">
      <h1>最新文章</h1>
      <nav class="home-topics" aria-label="文章栏目"><a class="home-topic" href="/ai/">AI<span>20</span></a><a class="home-topic" href="/thinking/">思考<span>5</span></a><a class="home-topic" href="/investment/">投资<span>4</span></a><a class="home-topic is-all" href="/archive">全部 29 篇 →</a></nav>
    </div>
    <div class="article-list latest-grid">
    <div class="home-carousel" data-carousel>
      <div class="hc-stage">
        <a class="hc-slide is-active" href="/ai/agents/multiagent-eng-problems"><img class="hc-img" src="/images/multiagent-eng-problems.jpg" alt="工程师觉得自己要失业？多 Agent 真正卡在软件工程" loading="eager" fetchpriority="high" decoding="async" /></a>
        <a class="hc-slide" href="/ai/design/how-i-design-with-ai-pt1"><img class="hc-img" src="/images/how-i-design-with-ai-pt1/cover.jpg" alt="我如何用 AI 做设计（其一）" loading="lazy" decoding="async" /></a>
        <a class="hc-slide" href="/ai/design/how-i-design-with-ai-pt2"><img class="hc-img" src="/images/how-i-design-with-ai-pt2/cover.jpg" alt="我如何用 AI 做设计（其二）" loading="lazy" decoding="async" /></a>
        <button class="hc-arrow hc-prev" type="button" aria-label="上一篇">‹</button>
        <button class="hc-arrow hc-next" type="button" aria-label="下一篇">›</button>
        <div class="hc-dots"><button class="hc-dot is-active" type="button" aria-label="第 1 篇"></button><button class="hc-dot" type="button" aria-label="第 2 篇"></button><button class="hc-dot" type="button" aria-label="第 3 篇"></button></div>
      </div>
      <div class="hc-panels">
        <a class="hc-panel is-active" href="/ai/agents/multiagent-eng-problems">
          <span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-10-28">2026.10.28</time></span>
          <strong>工程师觉得自己要失业？多 Agent 真正卡在软件工程</strong><small>Anthropic 平台负责人 Katelyn Lesse 说，多 Agent 系统要解锁真正硬问题，必须先由软件工程师把基础设施、身份授权、隔离和熔断做出来。</small>
        </a>
        <a class="hc-panel" href="/ai/design/how-i-design-with-ai-pt1">
          <span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-10-28">2026.10.28</time></span>
          <strong>我如何用 AI 做设计（其一）</strong><small>工程师如何用 AI 做产品设计去 slop：从整体约束、删减、设计工具迭代，到组件库、预览部署与品味打磨。</small>
        </a>
        <a class="hc-panel" href="/ai/design/how-i-design-with-ai-pt2">
          <span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-10-28">2026.10.28</time></span>
          <strong>我如何用 AI 做设计（其二）</strong><small>用大量 agents 设计复杂功能时如何少塞 slop：先理解系统、追踪轨迹、扫全状态、放大关键界面，再和团队打磨后发版。</small>
        </a>
      </div>
    </div>
      <a class="article-card" href="/ai/coding/claude-code-team-review">
        <img class="article-card-thumb" src="/images/claude-code-team-review/cover.jpg" alt="Claude Code 团队如何做代码审查" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-10-27">2026.10.27</time></span><strong>Claude Code 团队如何做代码审查</strong></div>
      </a>
      <a class="article-card" href="/ai/trends/claude-ban-reasons">
        <img class="article-card-thumb" src="/images/claude-ban-reasons/cover.jpg" alt="Claude 为什么动不动封号？官方条款 vs X 上的防封玄学" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-10-27">2026.10.27</time></span><strong>Claude 为什么动不动封号？官方条款 vs X 上的防封玄学</strong></div>
      </a>
      <a class="article-card" href="/ai/coding/muse-build-personal-site">
        <img class="article-card-thumb" src="/images/muse-site-home.png" alt="从装一个 App 到上线一个站：我用 Muse 搭 promangofund.com 的全过程" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-10-25">2026.10.25</time></span><strong>从装一个 App 到上线一个站：我用 Muse 搭 promangofund.com 的全过程</strong></div>
      </a>
      <a class="article-card" href="/ai/trends/claude-search-surge">
        <img class="article-card-thumb" src="/images/claude-search-surge/fig01_gt_compare.png" alt="Claude 搜索热度是 OpenAI 的 13 倍？开发者为什么都在用 Claude" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-10-16">2026.10.16</time></span><strong>Claude 搜索热度是 OpenAI 的 13 倍？开发者为什么都在用 Claude</strong></div>
      </a>
    </div>
    <ul class="latest-rows">
      <li><a href="/ai/workflows/my-ai-skills-part-1"><span class="latest-row-head"><span class="latest-row-title">我的 AI 技能包（上）：每天在用的 10 个技能，全部带演示视频</span><span class="latest-row-date">· <time datetime="2026-10-23">2026.10.23</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/ai-skills-part1-cover.jpg" alt="我的 AI 技能包（上）：每天在用的 10 个技能，全部带演示视频" loading="lazy" decoding="async" /><span class="latest-row-desc">我给自己攒了 22 个 AI 技能，这篇只写每天真在用的 10 个：去AI味写作、封面图生成、水彩插画、浏览器自动化、个人网站搭建、原理解剖图、图解设计、一稿多用、数据分析、出海新词上站。每个技能都配了一段 30 秒演示视频。</span></span></a></li>
      <li><a href="/ai/workflows/my-ai-skills-part-2"><span class="latest-row-head"><span class="latest-row-title">我的 AI 技能包（下）：另外 10 个每天在用的技能，全部带演示视频</span><span class="latest-row-date">· <time datetime="2026-10-23">2026.10.23</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/ai-skills-part2-cover.jpg" alt="我的 AI 技能包（下）：另外 10 个每天在用的技能，全部带演示视频" loading="lazy" decoding="async" /><span class="latest-row-desc">技能包下篇：AI 界面设计规范、前端设计、UI 设计参考清单、出海变现转化、技能编写、头脑风暴、系统化排查、交付前验证、网站上线验收、AI 项目交付。管设计、管变现、管排查、管交付，每个技能配一段 30 秒演示视频。</span></span></a></li>
      <li><a href="/ai/products/bing-wallpaper-for-mac"><span class="latest-row-head"><span class="latest-row-title">必应每日壁纸 for Mac：用 REA 逆向 Windows 官方版，复刻到 macOS 的开源应用</span><span class="latest-row-date">· <time datetime="2026-10-22">2026.10.22</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/bing-wallpaper/cover.jpg" alt="必应每日壁纸 for Mac：用 REA 逆向 Windows 官方版，复刻到 macOS 的开源应用" loading="lazy" decoding="async" /><span class="latest-row-desc">微软官方必应壁纸只有 Windows 版。fairzy 用 REA 逆向官方版 1.1.469.0 的行为，用 Swift 在 macOS 上原生复刻：菜单栏应用、每 30 分钟检查新图、12 个市场、主题轮换，MIT 开源免费。</span></span></a></li>
      <li><a href="/ai/products/claude-duet"><span class="latest-row-head"><span class="latest-row-title">Anthropic上线官方AI 管家App：Claude Duet ，这不就是一直我在用的Muse和GrokBot吗？</span><span class="latest-row-date">· <time datetime="2026-10-22">2026.10.22</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/claude-duet/cover.jpg" alt="Anthropic上线官方AI 管家App：Claude Duet ，这不就是一直我在用的Muse和GrokBot吗？" loading="lazy" decoding="async" /><span class="latest-row-desc">Anthropic 发布主动型 AI 助理 Claude Duet：每天晨报、定时巡查、动手前先审批。与 Meta Muse、OpenAI Dots 放在一起对比，以及它和我用了一个月的自建助理的异同。</span></span></a></li>
      <li><a href="/ai/products/codex-usage-desktop-guide"><span class="latest-row-head"><span class="latest-row-title">Codex Usage Desktop 使用指南：看清 Token 去向与剩余额度</span><span class="latest-row-date">· <time datetime="2026-10-21">2026.10.21</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/codex-usage/cover.jpg" alt="Codex Usage Desktop 使用指南：看清 Token 去向与剩余额度" loading="lazy" decoding="async" /><span class="latest-row-desc">朋友开源的 Codex 用量桌面应用，本地读取会话日志，查看 Token、5 小时与周额度、项目与会话明细。附安装方式、使用步骤与隐私说明。</span></span></a></li>
      <li><a href="/investment/methodology/ai-invest-clear"><span class="latest-row-head"><span class="latest-row-title">AI 越成功，投资者越需要保持清醒</span><span class="latest-row-date">· <time datetime="2026-10-18">2026.10.18</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/ai-invest-clear/cover.jpg" alt="AI 越成功，投资者越需要保持清醒" loading="lazy" decoding="async" /><span class="latest-row-desc">李录在 2026 年格雷厄姆—多德午餐会上把 AI 的技术前景与资本市场的定价逻辑分开：技术能走多远、企业能赚多少、价格计入多少，是三道不同的题目。</span></span></a></li>
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
