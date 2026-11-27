import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type HeadConfig } from 'vitepress'

const base = process.env.BASE_PATH ?? '/'
// 部署目标域名:Cloudflare Pages 构建时通过环境变量 SITE_URL 传入(如 https://xxx.pages.dev);缺省为 GitHub Pages 地址
// 容错:没写 https:// 时自动补上,避免 canonical 写出裸域名
const _rawSiteUrl = (process.env.SITE_URL ?? 'https://mangofund.github.io').replace(/\/$/, '')
const SITE_URL = /^https?:\/\//i.test(_rawSiteUrl) ? _rawSiteUrl : `https://${_rawSiteUrl}`
// 规范域名:搜索引擎认定的主域名。GitHub Pages 镜像构建时通过 CANONICAL_URL 传入新域名,
// 使旧站每页 canonical/og:url 指向新站对应页面(去 base 前缀);缺省=本站地址
const _rawCanon = (process.env.CANONICAL_URL ?? SITE_URL).replace(/\/$/, '')
const CANONICAL_URL = /^https?:\/\//i.test(_rawCanon) ? _rawCanon : `https://${_rawCanon}`
const SITE_TITLE = 'PRO的茶里芒果'
const SITE_DESC = 'AI、投资、产品，以及一些关于世界如何运行的思考。'
const EN_TITLE = "Pro's MangoFund"
const EN_DESC = 'Notes on AI products, side hustles, investing, and digital products.'
const DOCS_DIR = fileURLToPath(new URL('..', import.meta.url))
const GITHUB_PROFILE = 'https://github.com/mangofund'
// 站长 X 用户名，不要带 @。填 TODO 或留空时不输出 X 图标和 twitter 账号 meta。
const X_HANDLE = 'PRO_AI_99T'

function configuredXHandle(handle: string): string | null {
  const trimmed = handle.trim().replace(/^@/, '')
  if (!trimmed || /todo/i.test(trimmed)) return null
  if (!/^[A-Za-z0-9_]{1,15}$/.test(trimmed)) return null
  return trimmed
}

// 默认值为站长账号 ID（页面源码里本就公开可见），环境变量可覆盖；设为空字符串即可关闭
const GA_MEASUREMENT_ID = (process.env.GA_MEASUREMENT_ID ?? 'G-59PPF02MZT').trim()
const ADSENSE_CLIENT = (process.env.ADSENSE_CLIENT ?? 'ca-pub-4963054235083860').trim()
const xHandle = configuredXHandle(X_HANDLE)
const xProfile = xHandle ? `https://x.com/${xHandle}` : ''
const authorSameAs = [GITHUB_PROFILE, ...(xProfile ? [xProfile] : [])]

/** 读构建期生成的 JSON；本地 dev 没跑 gen-seo 时文件可能不存在，返回兜底值 */
function readJson<T>(path: string, fallback: T): T {
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as T
  } catch {
    return fallback
  }
}

type LatestPost = { title: string; description: string; category: string; url: string; date: string; image: string }
// gen-seo.mjs 写出的中英文首页最新文章，用于首页 Blog 结构化数据
const latestPosts = () => readJson<LatestPost[]>(join(DOCS_DIR, '.vitepress', 'latest-posts.json'), [])
const enLatestPosts = () => readJson<LatestPost[]>(join(DOCS_DIR, '.vitepress', 'en-latest-posts.json'), [])
// gen-seo.mjs 维护的内容更新时间快照(key: docs/<relativePath>)，用作 dateModified
const contentDates = readJson<Record<string, string>>(fileURLToPath(new URL('../../scripts/content-dates.json', import.meta.url)), {})

interface SkillMeta {
  id: string
  name: string
  pitch: string
  image: string
  video: string
  zipPath: string
}

let cachedHomeSkillsText: string | null = null
function readHomeSkillsText(): string {
  if (cachedHomeSkillsText === null) {
    cachedHomeSkillsText = readFileSync(join(DOCS_DIR, '.vitepress', 'theme', 'homeSkills.ts'), 'utf8')
  }
  return cachedHomeSkillsText
}

/** 解析技能详情页对应的 homeSkills.ts 元数据（封面图、视频、ZIP、简介） */
function pageSkillMeta(source: string, isEn: boolean): SkillMeta | null {
  const skillId = source.match(/<SkillDetail\s+skill-id="([^"]+)"/)?.[1]
  if (!skillId) return null
  const text = readHomeSkillsText()
  const start = text.search(new RegExp(`\\n {4}id: '${skillId}',`))
  if (start < 0) return null
  const next = text.slice(start + 1).search(/\n {4}id: '/)
  const block = next >= 0 ? text.slice(start, start + 1 + next) : text.slice(start)
  const video = block.match(/video: '([^']+)'/)?.[1] ?? ''
  const image = block.match(/image: '([^']+)'/)?.[1] ?? ''
  const name = block.match(isEn ? /nameEn: '([^']+)'/ : /nameZh: '([^']+)'/)?.[1] ?? ''
  const pitch = block.match(isEn ? /pitchEn: '([^']+)'/ : /pitchZh: '([^']+)'/)?.[1] ?? ''
  const zipFile = block.match(/zipFile: '([^']+)'/)?.[1] ?? ''
  const zipPath = zipFile ? `/skills/zips/${zipFile}` : ''
  return { id: skillId, name, pitch, image, video, zipPath }
}

/** 估算正文有效字数（中文按字、英文按词，排除 frontmatter 和代码块），用于 Article.wordCount */
function estimateWordCount(source: string): number {
  const withoutFm = source.startsWith('---') ? source.slice(source.indexOf('\n---', 3) + 4) : source
  const plain = withoutFm.replace(/```[\s\S]*?```/g, ' ').replace(/<[^>]+>/g, ' ')
  const cjk = (plain.match(/[\u4e00-\u9fff]/g) ?? []).length
  const words = (plain.replace(/[\u4e00-\u9fff]/g, ' ').match(/[A-Za-z0-9_'-]+/g) ?? []).length
  return cjk + words
}

interface ArticleMeta {
  key: string
  title: string
  date: string
}

/** 侧栏文章列表改由 articles.json 自动生成：新文章发布后，下次构建自动进侧栏（按日期倒序），不用再手动改配置 */
const sidebarGroups = (
  prefix: string,
  groups: { dirs: string[]; label: string }[]
) => {
  const all = readJson<ArticleMeta[]>(join(DOCS_DIR, 'public', 'articles.json'), [])
  return groups
    .map(({ dirs, label }) => ({
      text: label,
      items: all
        .filter((a) => dirs.some((d) => a.key.startsWith(`${prefix}${d}/`)))
        .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
        .map((a) => ({ text: a.title, link: `/${a.key.replace(/\.md$/, '')}` }))
    }))
    .filter((g) => g.items.length > 0)
}

interface PageVideo {
  name: string
  description: string
  thumbnail: string
  src: string
}

/** 文章正文里的 <video>，以及技能详情页头图使用的演示视频（来自 homeSkills.ts） */
function pageVideos(relativePath: string, isEn: boolean, title: string, desc: string): PageVideo[] {
  const source = readFileSync(join(DOCS_DIR, relativePath), 'utf8')
  const out: PageVideo[] = []
  for (const tag of source.match(/<video\b[^>]*>/g) ?? []) {
    const src = tag.match(/\ssrc="([^"]+)"/)?.[1]
    if (src) out.push({ name: title, description: desc, thumbnail: tag.match(/\sposter="([^"]+)"/)?.[1] ?? '', src })
  }
  const skillId = source.match(/<SkillDetail\s+skill-id="([^"]+)"/)?.[1]
  if (skillId) {
    const text = readFileSync(join(DOCS_DIR, '.vitepress', 'theme', 'homeSkills.ts'), 'utf8')
    // 缩进 4 格的 id 才是技能条目本身；顶部分类表里同名的 id 要跳过
    const start = text.search(new RegExp(`\\n {4}id: '${skillId}',`))
    if (start >= 0) {
      const next = text.slice(start + 1).search(/\n {4}id: '/)
      const block = next >= 0 ? text.slice(start, start + 1 + next) : text.slice(start)
      const video = block.match(/video: '([^']+)'/)?.[1]
      const image = block.match(/image: '([^']+)'/)?.[1]
      const name = block.match(isEn ? /nameEn: '([^']+)'/ : /nameZh: '([^']+)'/)?.[1]
      const pitch = block.match(isEn ? /pitchEn: '([^']+)'/ : /pitchZh: '([^']+)'/)?.[1]
      if (video && name) out.push({ name, description: pitch ?? desc, thumbnail: image ?? '', src: video })
    }
  }
  return out
}

// 面包屑里的栏目名(按路径第一段)
const SECTION_NAMES: Record<string, { zh: string; en: string }> = {
  ai: { zh: 'AI', en: 'AI' },
  investment: { zh: '投资', en: 'Investing' },
  thinking: { zh: '思考', en: 'Thinking' },
  skills: { zh: '技能', en: 'Skills' },
  'enterprise-mcp': { zh: '企业MCP', en: 'Enterprise MCP' },
  projects: { zh: '项目', en: 'Projects' },
  unnoticed: { zh: '工具', en: 'Tools' },
  about: { zh: '关于', en: 'About' }
}

// 把 base 尾斜杠统一去掉,避免拼接出双斜杠
const baseNoSlash = base.endsWith('/') && base.length > 1 ? base.slice(0, -1) : base === '/' ? '' : base

/** frontmatter 的 relativePath -> 站内规范路径(不带 base),cleanUrls 风格 */
function pagePath(relativePath: string): string {
  let p = relativePath.replace(/\.md$/, '')
  if (p === 'index') return '/'
  // 目录首页的真实 URL 带尾斜杠（Cloudflare Pages 对无斜杠版 308 跳斜杠版）；
  // canonical/hreflang 必须与之一致，否则与重定向形成死循环被 Google 判备用网页。
  if (p.endsWith('/index')) return '/' + p.slice(0, -'/index'.length) + '/'
  return '/' + p
}

/** 去掉 locale 前缀后的 slug。首页为 index。 */
function localeSlug(relativePath: string): { english: boolean; slug: string } {
  let slug = relativePath.replace(/\.md$/, '')
  const english = slug === 'en' || slug.startsWith('en/')
  if (english) slug = slug === 'en' ? 'index' : slug.slice('en/'.length)
  return { english, slug }
}

function markdownPath(slug: string, english: boolean): string {
  if (english) return slug === 'index' ? 'en/index.md' : `en/${slug}.md`
  return `${slug}.md`
}

/** 两种语言都有的页面才输出 hreflang。x-default 指向中文。 */
function hreflangAlternates(relativePath: string): { zh: string; en: string } | null {
  const { slug } = localeSlug(relativePath)
  if (!existsSync(join(DOCS_DIR, markdownPath(slug, false)))) return null
  if (!existsSync(join(DOCS_DIR, markdownPath(slug, true)))) return null
  const zhPath = pagePath(markdownPath(slug, false))
  const enPath = pagePath(markdownPath(slug, true))
  return { zh: `${CANONICAL_URL}${zhPath}`, en: `${CANONICAL_URL}${enPath}` }
}

export default defineConfig({
  base,
  lang: 'zh-CN',
  title: SITE_TITLE,
  description: SITE_DESC,
  cleanUrls: true,
  appearance: true,
  // public/skills 里的 SKILL.md 是复制和 ZIP 的源文件，不做成站内页面。
  srcExclude: ['public/skills/**'],
  // sitemap 由 scripts/gen-seo.mjs 自行生成到 public/(VitePress 内置 sitemap 不拼接 base 路径,故不用它)
  themeConfig: {
    // 注意：logo 不要手拼 base 前缀，VitePress 会自动 withBase；手拼会导致镜像站路径双前缀。
    logo: { src: '/images/mango-logo-nav.png', width: 18, height: 24 },
    siteTitle: SITE_TITLE,
    nav: [
      { text: '首页', link: '/' },
      { text: 'AI', link: '/ai/', activeMatch: '^/ai/' },
      { text: '小游戏', link: '/games/', activeMatch: '^/games/' },
      { text: '技能', link: '/skills/', activeMatch: '^/skills/' },
      { text: '项目', link: '/projects/', activeMatch: '^/projects/' },
      { text: '工具', link: '/unnoticed/', activeMatch: '^/unnoticed/' },
      {
        text: '关于',
        activeMatch: '^/(enterprise-mcp|friends|subscribe|guestbook)(/|$)',
        items: [
          { text: '企业MCP', link: '/enterprise-mcp/', activeMatch: '^/enterprise-mcp/' },
          { text: '友链', link: '/friends' },
          {
            items: [
              { text: '留言板', link: '/guestbook' },
              { text: '订阅', link: '/subscribe' }
            ]
          }
        ]
      },
      { component: 'LangSwitch' }
    ],
    sidebar: {
      '/ai/': [
        { text: 'AI', link: '/ai/' },
        ...sidebarGroups('ai/', [
          { dirs: ['design'], label: '设计' },
          { dirs: ['trends'], label: '趋势' },
          { dirs: ['agents'], label: 'Agent' },
          { dirs: ['products'], label: '产品' },
          { dirs: ['coding'], label: 'Coding' },
          { dirs: ['workflows'], label: '工作流' }
        ])
      ],
      '/investment/': [
        { text: '投资', link: '/investment/' },
        ...sidebarGroups('investment/', [
          { dirs: ['crypto'], label: '加密货币' },
          { dirs: ['tesla'], label: '美股与长期主义' },
          { dirs: ['us-stocks'], label: '美股策略' },
          { dirs: ['hk-stocks'], label: '港股策略' },
          { dirs: ['methodology'], label: '方法论' }
        ])
      ],
      '/thinking/': [
        { text: '思考', link: '/thinking/' },
        ...sidebarGroups('thinking/', [
          { dirs: ['wealth', 'first-principles', 'technology'], label: '长期思考' },
          { dirs: ['society'], label: 'AI 与社会' },
          { dirs: ['life'], label: '人生与选择' }
        ])
      ],
      '/about/': [
        { text: '关于', link: '/about/' },
        { text: '时间线', link: '/about/timeline' }
      ]
    },
    search: { provider: 'local' },
    socialLinks: [
      { icon: 'github', link: GITHUB_PROFILE },
      ...(xProfile ? [{ icon: 'x' as const, link: xProfile }] : [])
    ],
    footer: {
      message: '每天做有价值的事情，人生永远要有 Plan B。',
      copyright: '© 2026 PRO的茶里芒果 · <a href="/privacy">隐私政策</a> · <a href="/admin/index.html" target="_self">编辑</a>'
    },
    outline: { label: '本页目录', level: [2, 3] },
    docFooter: { prev: '上一篇', next: '下一篇' },
    darkModeSwitchLabel: '外观',
    darkModeSwitchTitle: '切换到深色模式',
    lightModeSwitchTitle: '切换到浅色模式',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '回到顶部',
    langMenuLabel: '语言',
    skipToContentLabel: '跳到正文'
  },

  locales: {
    root: {
      label: '中文',
      lang: 'zh-CN',
      title: SITE_TITLE,
      description: SITE_DESC
    },
    en: {
      label: 'English',
      lang: 'en',
      title: EN_TITLE,
      description: EN_DESC,
      themeConfig: {
        siteTitle: EN_TITLE,
        logoLink: '/en/',
        nav: [
          { text: 'Home', link: '/en/', activeMatch: '^/en/?$' },
          { text: 'AI', link: '/en/ai/', activeMatch: '^/en/ai/' },
          { text: 'Games', link: '/en/games/', activeMatch: '^/en/games/' },
          { text: 'Skills', link: '/en/skills/', activeMatch: '^/en/skills/' },
          { text: 'Projects', link: '/en/projects/', activeMatch: '^/en/projects/' },
          { text: 'Tools', link: '/en/unnoticed/', activeMatch: '^/en/unnoticed/' },
          {
            text: 'About',
            activeMatch: '^(/en/enterprise-mcp|/en/friends|/subscribe|/guestbook)',
            items: [
              { text: 'Enterprise MCP', link: '/en/enterprise-mcp/', activeMatch: '^/en/enterprise-mcp/' },
              { text: 'Friends', link: '/en/friends' },
              {
                items: [
                  { text: 'Guestbook', link: '/guestbook' },
                  { text: 'Subscribe', link: '/subscribe' }
                ]
              }
            ]
          },
          { component: 'LangSwitch' }
        ],
        sidebar: {
          '/en/ai/': [
            { text: 'AI', link: '/en/ai/' },
            {
              text: 'Trends',
              items: [
                {
                  text: 'Claude vs OpenAI on Google Trends: Why Claude Search Interest Looks 13× Higher',
                  link: '/en/ai/trends/claude-search-surge'
                }
              ]
            },
            {
              text: 'Products',
              items: [
                {
                  text: 'Bing Wallpaper for Mac: An Open-Source Port Reverse-Engineered from the Official Windows App with REA',
                  link: '/en/ai/products/bing-wallpaper-for-mac'
                },
                {
                  text: "Anthropic's Claude Duet Is an Official AI Butler App — Isn't That the Muse and GrokBot I've Been Using All Along?",
                  link: '/en/ai/products/claude-duet'
                },
                {
                  text: 'Codex Usage Desktop Guide: See Where Your Codex Tokens and Quota Go',
                  link: '/en/ai/products/codex-usage-desktop-guide'
                }
              ]
            },
            {
              text: 'Coding',
              items: [
                {
                  text: 'How to Automate a Personal Website Deploy with Muse',
                  link: '/en/ai/coding/muse-auto-deploy'
                }
              ]
            },
            {
              text: 'Workflows',
              items: [
                {
                  text: 'How to Make an AI Rap Video: Tools, Workflow, and Pitfalls',
                  link: '/en/ai/workflows/ai-rap-video-generator-guide'
                },
                {
                  text: 'Agent Skills Installation Guide: How to Use SKILL.md with Coding Agents',
                  link: '/en/ai/workflows/agent-skills-installation-guide'
                },
                {
                  text: 'AI Data Analysis Workflow: From Raw Data to Verifiable Decisions',
                  link: '/en/ai/workflows/ai-data-analysis-workflow'
                },
                {
                  text: 'AI Coding Project Delivery: From Request to Verifiable Results',
                  link: '/en/ai/workflows/ai-project-delivery-workflow'
                },
                {
                  text: 'Website Launch Checklist: QA, SEO, Mobile, Analytics, and Rollback',
                  link: '/en/ai/workflows/website-launch-checklist'
                }
              ]
            }
          ],
          '/en/investment/': [
            { text: 'Investing', link: '/en/investment/' },
            {
              text: 'US stocks',
              items: [
                {
                  text: 'Tesla Q3 2026 Earnings Preview: What Actually Moves the Stock',
                  link: '/en/investment/tesla/q3-earnings-preview'
                }
              ]
            }
          ],
          '/en/thinking/': [
            { text: 'Thinking', link: '/en/thinking/' }
          ],
          '/en/about/': [
            { text: 'About', link: '/en/about/' }
          ]
        },
        footer: {
          message: 'Do something valuable every day, and always keep a Plan B.',
          copyright: "© 2026 Pro's MangoFund · <a href=\"/admin/index.html\" target=\"_self\">Edit</a>"
        },
        outline: { label: 'On this page', level: [2, 3] },
        docFooter: { prev: 'Previous page', next: 'Next page' },
        darkModeSwitchLabel: 'Appearance',
        darkModeSwitchTitle: 'Switch to dark mode',
        lightModeSwitchTitle: 'Switch to light mode',
        sidebarMenuLabel: 'Menu',
        returnToTopLabel: 'Return to top',
        langMenuLabel: 'Language',
        skipToContentLabel: 'Skip to content'
      }
    }
  },

  // 文章页可见「更新于」：只在更新日晚于发布日时显示，日期取 frontmatter updated，其次内容更新时间快照。
  // 与 JSON-LD 的 dateModified 同源，避免页面可见日期和结构化数据对不上。
  transformHtml(code, _id, { pageData }) {
    const fm = pageData.frontmatter ?? {}
    if (typeof fm.date !== 'string' || !fm.date) return
    const raw = typeof fm.updated === 'string' && fm.updated ? fm.updated : contentDates[`docs/${pageData.relativePath}`]
    const day = raw ? String(raw).slice(0, 10) : ''
    const published = fm.date.slice(0, 10)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || day <= published) return
    const label = pageData.relativePath.startsWith('en/') ? 'Updated' : '更新于'
    return code.replace(
      /(class="meta-line">\s*\d{4}\.\d{2}\.\d{2})/,
      `$1 · <time datetime="${day}">${label} ${day.replace(/-/g, '.')}</time>`
    )
  },

  // 每页自动输出 canonical + Open Graph / Twitter Card,取值来自该页 frontmatter
  transformHead({ pageData }) {
    const fm = pageData.frontmatter ?? {}
    const isEn = pageData.relativePath.startsWith('en/')
    const siteTitle = isEn ? EN_TITLE : SITE_TITLE
    const siteDesc = isEn ? EN_DESC : SITE_DESC
    const localeLang = isEn ? 'en' : 'zh-CN'
    const ogLocale = isEn ? 'en_US' : 'zh_CN'
    const canonical = `${CANONICAL_URL}${pagePath(pageData.relativePath)}`
    const title = typeof fm.title === 'string' && fm.title ? fm.title : siteTitle
    const desc = typeof fm.description === 'string' && fm.description ? fm.description : siteDesc
    const isHome = pageData.relativePath === 'index.md' || pageData.relativePath === 'en/index.md'
    const rawDateStr = typeof fm.date === 'string' ? fm.date.trim().replace(/^(\d{4})\.(\d{2})\.(\d{2})$/, '$1-$2-$3') : ''
    const isArticle = rawDateStr.length > 0 && !Number.isNaN(Date.parse(rawDateStr))
    const isGuide = !isArticle && /^(?:en\/)?ai\/workflows\/(?!index\.md)/.test(pageData.relativePath)
    const isCollection = pageData.relativePath.endsWith('/index.md') || pageData.relativePath === 'archive.md'
    const isAbout = pageData.relativePath === 'about/index.md' || pageData.relativePath === 'en/about/index.md'
    const pageSource = existsSync(join(DOCS_DIR, pageData.relativePath))
      ? readFileSync(join(DOCS_DIR, pageData.relativePath), 'utf8')
      : ''
    const skillMeta = pageSource ? pageSkillMeta(pageSource, isEn) : null
    // 默认分享卡(1200x630);文章可在 frontmatter 里用 image 覆盖，技能详情页自动复用 homeSkills.ts 封面图
    const rawCover = typeof fm.image === 'string' && fm.image
      ? fm.image
      : skillMeta?.image
        ? skillMeta.image
        : ''
    const hasArticleCover = rawCover.length > 0
    const imgPath = hasArticleCover ? rawCover : '/images/social-card.png'
    // 分享图与结构化数据图片一律走 CANONICAL_URL，避免镜像/预览域泄露非规范图片地址
    const imgUrl = `${CANONICAL_URL}${imgPath.startsWith('/') ? imgPath : '/' + imgPath}`
    // 默认封面再配一张正方形微信版：微信只读 og:image 且缩略图是小正方形，X 则优先读 twitter:image(1200x630)
    const squareImgUrl = `${CANONICAL_URL}/images/social-card-square.png`

    const head: HeadConfig[] = [
      ['link', { rel: 'canonical', href: canonical }],
      ['meta', { property: 'og:locale', content: ogLocale }],
      ['meta', { property: 'og:site_name', content: siteTitle }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: desc }],
      ['meta', { property: 'og:url', content: canonical }],
      ['meta', { property: 'og:image', content: hasArticleCover ? imgUrl : squareImgUrl }],
    ]
    if (isEn) {
      head.push(['link', { rel: 'alternate', type: 'application/rss+xml', title: `${EN_TITLE} RSS`, href: `${baseNoSlash}/en/feed.xml` }])
    }
    // 尺寸只标在默认分享卡上。文章封面尺寸不固定，不写死 1200×630。
    // 默认封面：og:image 用正方形微信版(800x800)，twitter:image 继续用宽版(1200x630)。
    if (!hasArticleCover) {
      head.push(['meta', { property: 'og:image:width', content: '800' }])
      head.push(['meta', { property: 'og:image:height', content: '800' }])
    }
    head.push(
      ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: desc }],
      ['meta', { name: 'twitter:image', content: imgUrl }]
    )
    if (xHandle) {
      head.push(['meta', { name: 'twitter:site', content: `@${xHandle}` }])
      head.push(['meta', { name: 'twitter:creator', content: `@${xHandle}` }])
    }
    if (typeof fm.keywords === 'string' && fm.keywords.trim()) {
      head.push(['meta', { name: 'keywords', content: fm.keywords.trim() }])
    }
    const alternates = hreflangAlternates(pageData.relativePath)
    if (alternates) {
      head.push(['meta', { property: 'og:locale:alternate', content: isEn ? 'zh_CN' : 'en_US' }])
      head.push(['link', { rel: 'alternate', hreflang: 'zh-CN', href: alternates.zh }])
      head.push(['link', { rel: 'alternate', hreflang: 'en', href: alternates.en }])
      head.push(['link', { rel: 'alternate', hreflang: 'x-default', href: alternates.zh }])
    }

    if (fm.noindex === true || fm.draft === true) {
      head.push(['meta', { name: 'robots', content: 'noindex, follow' }])
    }

    const updatedRawGlobal = typeof fm.updated === 'string' && fm.updated ? fm.updated : contentDates[`docs/${pageData.relativePath}`]
    const updatedDate = updatedRawGlobal ? new Date(updatedRawGlobal) : null
    const tags = Array.isArray(fm.tags) ? fm.tags.filter((t: unknown): t is string => typeof t === 'string') : []

    if (!isArticle && !isGuide) {
      head.push(['meta', { property: 'og:type', content: 'website' }])
    } else {
      head.push(['meta', { property: 'og:type', content: 'article' }])
      if (isArticle && rawDateStr) {
        const d = new Date(rawDateStr)
        if (!Number.isNaN(d.getTime())) {
          head.push(['meta', { property: 'article:published_time', content: d.toISOString() }])
          if (updatedDate && !Number.isNaN(updatedDate.getTime()) && updatedDate >= d) {
            head.push(['meta', { property: 'article:modified_time', content: updatedDate.toISOString() }])
          }
        }
      } else if (isGuide && updatedDate && !Number.isNaN(updatedDate.getTime())) {
        head.push(['meta', { property: 'article:modified_time', content: updatedDate.toISOString() }])
      }
      if (typeof fm.category === 'string' && fm.category) {
        head.push(['meta', { property: 'article:section', content: fm.category }])
      }
      for (const tag of tags) {
        head.push(['meta', { property: 'article:tag', content: tag }])
      }
    }

    // ---- 结构化数据 JSON-LD(供搜索引擎/AI 问答引擎摘取) ----
    // 首页 → WebSite + Blog;关于页 → AboutPage;技能详情页 → SoftwareApplication;
    // 带日期文章 → Article;工作流指南 → TechArticle;栏目页 → CollectionPage;frontmatter faq → FAQPage
    // author 只保留站上既有的 name / url / sameAs，不补职务、邮箱等未公开字段。
    const schemas: Record<string, unknown>[] = []
    const author = {
      '@type': 'Person',
      name: 'pro',
      url: isEn && existsSync(join(DOCS_DIR, 'en/about/index.md'))
        ? `${CANONICAL_URL}/en/about/`
        : `${CANONICAL_URL}/about/`,
      sameAs: authorSameAs
    }
    if (isHome) {
      const websiteId = `${canonical}#website`
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': websiteId,
        name: siteTitle,
        alternateName: isEn ? SITE_TITLE : EN_TITLE,
        url: canonical,
        description: desc,
        inLanguage: localeLang,
        author
      })
      schemas.push({ '@context': 'https://schema.org', ...author })
      // 中英文首页文章流：给搜索引擎和 AI 问答引擎一份带日期、栏目和摘要的最新文章清单
      const posts = isEn ? enLatestPosts() : latestPosts()
      if (posts.length > 0) {
        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: siteTitle,
          url: canonical,
          description: desc,
          inLanguage: localeLang,
          isPartOf: { '@id': websiteId },
          author,
          blogPost: posts.map((p) => ({
            '@type': 'BlogPosting',
            headline: p.title,
            description: p.description,
            url: p.url,
            datePublished: p.date,
            ...(p.category ? { articleSection: p.category } : {}),
            ...(p.image ? { image: p.image } : {})
          }))
        })
      }
    } else if (isAbout) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: title,
        description: desc,
        url: canonical,
        inLanguage: localeLang,
        image: imgUrl,
        isPartOf: {
          '@type': 'WebSite',
          name: siteTitle,
          url: `${CANONICAL_URL}${isEn ? '/en/' : '/'}`
        },
        mainEntity: author
      })
    } else if (title) {
      const publisher = {
        '@type': 'Organization',
        name: siteTitle,
        url: `${CANONICAL_URL}${isEn ? '/en/' : '/'}`,
        logo: { '@type': 'ImageObject', url: `${CANONICAL_URL}/images/site-icon.png` }
      }
      if (skillMeta) {
        const appSchema: Record<string, unknown> = {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: title,
          description: desc,
          url: canonical,
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Any',
          inLanguage: localeLang,
          image: imgUrl,
          author,
          publisher,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD'
          },
          isPartOf: { '@type': 'WebSite', name: siteTitle, url: `${CANONICAL_URL}${isEn ? '/en/' : '/'}` }
        }
        if (skillMeta.zipPath) appSchema.downloadUrl = `${CANONICAL_URL}${skillMeta.zipPath}`
        if (updatedDate && !Number.isNaN(updatedDate.getTime())) {
          appSchema.dateModified = updatedDate.toISOString()
        }
        schemas.push(appSchema)
      } else {
        const pageType = isArticle ? 'Article' : isGuide ? 'TechArticle' : isCollection ? 'CollectionPage' : 'WebPage'
        const article: Record<string, unknown> = {
          '@context': 'https://schema.org',
          '@type': pageType,
          ...(isArticle || isGuide ? { headline: title } : { name: title }),
          description: desc,
          url: canonical,
          mainEntityOfPage: canonical,
          inLanguage: localeLang,
          author,
          publisher,
          image: imgUrl
        }
        if (isArticle) {
          const d = new Date(rawDateStr)
          if (!Number.isNaN(d.getTime())) {
            article.datePublished = d.toISOString()
            article.dateModified = (updatedDate && !Number.isNaN(updatedDate.getTime()) && updatedDate >= d ? updatedDate : d).toISOString()
          }
          if (pageSource) article.wordCount = estimateWordCount(pageSource)
        } else if (isGuide) {
          if (updatedDate && !Number.isNaN(updatedDate.getTime())) {
            article.dateModified = updatedDate.toISOString()
          }
          if (pageSource) article.wordCount = estimateWordCount(pageSource)
        }
        if (typeof fm.category === 'string' && fm.category) article.articleSection = fm.category
        if (tags.length > 0) article.keywords = tags.join(', ')
        article.isPartOf = { '@type': 'WebSite', name: siteTitle, url: `${CANONICAL_URL}${isEn ? '/en/' : '/'}` }
        schemas.push(article)
      }

      // 面包屑：首页 → 栏目 → 文章
      const { slug } = localeSlug(pageData.relativePath)
      const section = slug.split('/')[0]
      const sectionName = SECTION_NAMES[section]
      const crumbs: { name: string; item: string }[] = [
        { name: siteTitle, item: `${CANONICAL_URL}${isEn ? '/en/' : '/'}` }
      ]
      if (sectionName && slug !== section && slug !== `${section}/index`) {
        const sectionFile = markdownPath(`${section}/index`, isEn)
        if (existsSync(join(DOCS_DIR, sectionFile))) {
          crumbs.push({ name: isEn ? sectionName.en : sectionName.zh, item: `${CANONICAL_URL}${pagePath(sectionFile)}` })
        }
      }
      crumbs.push({ name: title, item: canonical })
      if (crumbs.length > 1) {
        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.item }))
        })
      }
      const faqRaw = (fm as Record<string, unknown>).faq
      if (Array.isArray(faqRaw)) {
        const qa = faqRaw
          .filter((e): e is { q: string; a: string } =>
            !!e && typeof (e as { q?: unknown }).q === 'string' && typeof (e as { a?: unknown }).a === 'string')
          .map((e) => ({
            '@type': 'Question',
            name: e.q,
            acceptedAnswer: { '@type': 'Answer', text: e.a }
          }))
        if (qa.length > 0) {
          schemas.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: qa })
        }
      }
    }
    // 带演示视频的页面（文章与技能详情页）输出 VideoObject，供视频富媒体结果与 AI 引用
    if (!isHome && !isAbout && title) {
      const rawDate = typeof fm.updated === 'string' && fm.updated ? fm.updated : typeof fm.date === 'string' && fm.date ? fm.date : contentDates[`docs/${pageData.relativePath}`]
      const uploaded = rawDate ? new Date(rawDate) : null
      if (uploaded && !Number.isNaN(uploaded.getTime())) {
        const toAbs = (p: string) => (/^https?:\/\//i.test(p) ? p : `${CANONICAL_URL}${p.startsWith('/') ? p : '/' + p}`)
        for (const v of pageVideos(pageData.relativePath, isEn, title, desc)) {
          schemas.push({
            '@context': 'https://schema.org',
            '@type': 'VideoObject',
            name: v.name,
            description: v.description,
            ...(v.thumbnail ? { thumbnailUrl: toAbs(v.thumbnail) } : {}),
            uploadDate: uploaded.toISOString(),
            contentUrl: toAbs(v.src),
            embedUrl: canonical,
            inLanguage: localeLang
          })
        }
      }
    }
    for (const s of schemas) {
      head.push(['script', { type: 'application/ld+json' }, JSON.stringify(s).replace(/<\//g, '<\\/')])
    }
    return head
  },

  // 图片懒加载：正文图片默认 loading="lazy"
  markdown: {
    config: (md) => {
      const defaultRender = md.renderer.rules.image || function (tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options)
      }
      md.renderer.rules.image = function (tokens, idx, options, env, self) {
        const token = tokens[idx]
        const pageKey = String(env.relativePath || env.path || '')
        if (env.lazyImagePage !== pageKey) {
          env.lazyImagePage = pageKey
          env.lazyImageCount = 0
        }
        env.lazyImageCount += 1
        // 每页首图可能在首屏，不懒加载；其余图片懒加载。
        if (!token.attrGet('loading') && env.lazyImageCount > 1) {
          token.attrSet('loading', 'lazy')
        }
        if (!token.attrGet('decoding')) {
          token.attrSet('decoding', 'async')
        }
        return defaultRender(tokens, idx, options, env, self)
      }
    }
  },

  head: [
    // 会话内关掉顶栏滚动条后，首屏绘制前就藏起来，避免闪一下。
    ['script', {}, `try{if(sessionStorage.getItem('mangofund:ticker-dismissed')==='1')document.documentElement.dataset.tickerDismissed='1'}catch(e){}`],

    // 界面用 Source Sans 3，文章用 Source Serif 4。不用 Anthropic 专有字体文件。
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,200..900;1,200..900&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,400;1,8..60,500&display=swap' }],

    // RSS 订阅入口
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: `${SITE_TITLE} RSS`, href: `${baseNoSlash}/feed.xml` }],

    // 站点图标
    ['link', { rel: 'icon', type: 'image/x-icon', href: `${baseNoSlash}/favicon.ico` }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: `${baseNoSlash}/favicon-32x32.png` }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: `${baseNoSlash}/favicon-16x16.png` }],
    ['link', { rel: 'apple-touch-icon', href: `${baseNoSlash}/apple-touch-icon.png` }],

    // ---- 访问统计(Umami 已启用,见 ANALYTICS_SETUP.md) ----
    ['script', { defer: '', src: 'https://cloud.umami.is/script.js', 'data-website-id': '9be496a4-8003-46ab-9f02-de2fa19abab4' }],
    // Plausible(备用,未启用):
    // ['script', { defer: '', 'data-domain': 'mangofund.github.io', src: 'https://plausible.io/js/script.js' }]

    // ---- Google Analytics 4 / AdSense(可选,由构建环境变量开启;未设置时不输出任何 Google 脚本) ----
    // Cloudflare Pages 构建变量:GA_MEASUREMENT_ID=G-XXXXXXX,ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
    ...(/^G-[A-Z0-9]+$/.test(GA_MEASUREMENT_ID) ? [
      ['script', { async: '', src: `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}` }],
      ['script', {}, `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${GA_MEASUREMENT_ID}');`]
    ] as HeadConfig[] : []),
    ...(/^ca-pub-\d+$/.test(ADSENSE_CLIENT) ? [
      ['script', { async: '', src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`, crossorigin: 'anonymous' }]
    ] as HeadConfig[] : [])
  ]
})
