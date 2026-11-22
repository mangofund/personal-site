import type { SkillBeforeAfter, SkillDetailCopy, SkillFaqItem } from './homeSkills'

/**
 * 详情页 P0-3 信息头 + P1-2 FAQ + P0-2 前后对比实证的数据。
 * 事实口径：
 * - 包内容：逐个 ZIP 用 unzip -l 核对过的文件清单（2026-11-22）；视频一栏以 homeSkills.ts 里
 *   有无 video 字段为准（27 个有，custom_connector_setup 与 writing-plans 无）。
 * - 兼容 Agent：SKILL.md 是通用文本，各 Agent 行均指「能读 SKILL.md 的 Agent 直接粘贴可用」，
 *   另有专属配置的技能（grill-me 的 agents/openai.yaml、koubo-storyboard 的 INSTALL-MUSE.md、
 *   custom_connector_setup 的 README-GROKBOT.md、impeccable 的 INSTALL.md）在该行注明。
 * - 安装：只写步骤，不写耗时（未实测不编数字）；有 references/、scripts/ 或 templates/ 的包
 *   须用 ZIP 并保留目录结构——依据站内《安装指南》。
 * - FAQ 答案每条至少含一处该技能的具体信息，取自本站详情文案与各技能 SKILL.md / ZIP 内容。
 */

const AGENTS_GENERIC_ZH =
  'SKILL.md 通用文本：Claude Code、Codex、Cursor、Muse 等能读 SKILL.md 的 Agent 都可直接粘贴使用。'
const AGENTS_GENERIC_EN =
  'Plain SKILL.md text: paste it into any agent that reads SKILL.md — Claude Code, Codex, Cursor, Muse, and others.'

const INSTALL_BASE_ZH =
  '点本页「复制技能」粘贴给 Agent 即可用；也可以下载 ZIP 解压后按站内《安装指南》放进 Agent 的技能目录，再用一个具体任务验证是否生效。'
const INSTALL_BASE_EN =
  'Use Copy skill on this page and paste it to your agent, or download the ZIP, unzip it into your agent’s skills directory per the site’s installation guide, then verify with one concrete task.'

const INSTALL_ZIP_REFS_ZH =
  '本包带 references/，只复制 SKILL.md 会丢引用，须下载 ZIP 并保留目录结构。'
const INSTALL_ZIP_REFS_EN =
  'This package ships references/ files — copying SKILL.md alone drops them, so download the ZIP and keep its directory structure.'

export type SkillInfo = Pick<
  SkillDetailCopy,
  'packageZh' | 'packageEn' | 'agentsZh' | 'agentsEn' | 'installZh' | 'installEn'
> & { faq: SkillFaqItem[] }

export const SKILL_INFO: Record<string, SkillInfo> = {
  'de-ai-writing': {
    packageZh: 'SKILL.md、references/（去 AI 味规则与 README、LICENSE 共 3 篇）、scripts/style_stats.py、演示视频、ZIP 下载',
    packageEn: 'SKILL.md, references/ (de-AI rules, README and LICENSE — 3 files), scripts/style_stats.py, demo video, ZIP download',
    agentsZh: AGENTS_GENERIC_ZH,
    agentsEn: AGENTS_GENERIC_EN,
    installZh: `${INSTALL_BASE_ZH}${INSTALL_ZIP_REFS_ZH}`,
    installEn: `${INSTALL_BASE_EN}${INSTALL_ZIP_REFS_EN}`,
    faq: [
      {
        qZh: '这技能是干什么的？',
        qEn: 'What does this skill do?',
        aZh: '从你 2 篇以上文章提炼写作风格档案，之后按档案写新稿，或对成稿只做命中规则的最小清理，不碰观点和结构。',
        aEn: 'It distills a style profile from 2+ of your articles, then writes new drafts to that profile — or cleans a finished draft with minimal whitelist-only edits that never touch your views or structure.'
      },
      {
        qZh: '支持哪些 Agent？',
        qEn: 'Which agents does it work with?',
        aZh: '通用 SKILL.md 文本，Claude Code、Codex、Cursor、Muse 都能用；使用时说明场景：按档案写新稿，还是清理成稿。',
        aEn: 'Plain SKILL.md text works with Claude Code, Codex, Cursor, and Muse. When you use it, say which scene: write to the profile, or clean a finished draft.'
      },
      {
        qZh: '怎么安装？',
        qEn: 'How do I install it?',
        aZh: '点「复制技能」粘贴即可；包带 references/ 与 scripts/style_stats.py，用 ZIP 才完整。验证：拿一篇你的文章建档案再写一段，看口吻是否一次对齐。',
        aEn: 'Copy skill and paste it, or download the ZIP — the package includes references/ and scripts/style_stats.py, so the ZIP is the complete install. Verify by building a profile from one of your articles and drafting a paragraph against it.'
      }
    ]
  },
  'ai-ui-design': {
    packageZh: 'SKILL.md、references/（tokens.css、motion.ts、流式滚动与输入法守卫等 9 个文件）、演示视频、ZIP 下载',
    packageEn: 'SKILL.md, references/ (tokens.css, motion.ts, streaming-scroll and IME guards — 9 files), demo video, ZIP download',
    agentsZh: AGENTS_GENERIC_ZH,
    agentsEn: AGENTS_GENERIC_EN,
    installZh: `${INSTALL_BASE_ZH}${INSTALL_ZIP_REFS_ZH}`,
    installEn: `${INSTALL_BASE_EN}${INSTALL_ZIP_REFS_EN}`,
    faq: [
      {
        qZh: '这技能是干什么的？',
        qEn: 'What does this skill do?',
        aZh: '给 AI 聊天与 Agent 前端定界面与交互规范：设计令牌、弹簧动效参数、中文输入法守卫、流式滚动，一次定好不再返工。',
        aEn: 'It sets interface and interaction rules for AI chat and agent front ends: design tokens, spring motion parameters, Chinese IME guards, and streaming scroll — decided once, no rework.'
      },
      {
        qZh: '支持哪些 Agent？',
        qEn: 'Which agents does it work with?',
        aZh: '通用 SKILL.md 文本，Claude Code、Codex、Cursor、Muse 都能用；使用时说明要做的组件：聊天框、工具卡还是整套前端。',
        aEn: 'Plain SKILL.md text works with Claude Code, Codex, Cursor, and Muse. Say what to build: a chat box, tool cards, or the whole front end.'
      },
      {
        qZh: '怎么安装？',
        qEn: 'How do I install it?',
        aZh: '点「复制技能」粘贴即可；包带 references/（含 tokens.css 与 useStreamScrollPin.ts 等），用 ZIP 才完整。验证：让 Agent 按规范出一个聊天框，检查中文输入法组合中不触发发送。',
        aEn: 'Copy skill and paste it, or download the ZIP — the package includes references/ (tokens.css, useStreamScrollPin.ts and more). Verify by having the agent build a chat box to the spec and checking that IME composition never sends.'
      }
    ]
  },
  'diagram-design': {
    packageZh: 'SKILL.md、references/（导入、导出与 63 篇图解类型文档）、演示视频、ZIP 下载',
    packageEn: 'SKILL.md, references/ (import, export, and 63 diagram-type documents), demo video, ZIP download',
    agentsZh: AGENTS_GENERIC_ZH,
    agentsEn: AGENTS_GENERIC_EN,
    installZh: `${INSTALL_BASE_ZH}${INSTALL_ZIP_REFS_ZH}`,
    installEn: `${INSTALL_BASE_EN}${INSTALL_ZIP_REFS_EN}`,
    faq: [
      {
        qZh: '这技能是干什么的？',
        qEn: 'What does this skill do?',
        aZh: '45 种静态图解，输出一份自包含 HTML：架构图、流程图、时序图、甘特图、桑基图都有，支持 .drawio、Mermaid、Excalidraw 导入。',
        aEn: 'Forty-five static diagram types, each a self-contained HTML file — architecture, flowcharts, sequence, Gantt, Sankey — with imports from .drawio, Mermaid, and Excalidraw.'
      },
      {
        qZh: '支持哪些 Agent？',
        qEn: 'Which agents does it work with?',
        aZh: '通用 SKILL.md 文本，Claude Code、Codex、Cursor、Muse 都能用；有草稿就贴 Mermaid 或 drawio，没有就口述要表达的结构。',
        aEn: 'Plain SKILL.md text works with Claude Code, Codex, Cursor, and Muse. Paste a Mermaid or drawio draft if you have one, or describe the structure in words.'
      },
      {
        qZh: '怎么安装？',
        qEn: 'How do I install it?',
        aZh: '必须下载 ZIP：references/ 有 63 篇，复制 SKILL.md 一个文件会丢全部类型文档。验证：按一段文字描述出一张流程图，看节点数是否只保留说明所需的。',
        aEn: 'Download the ZIP — references/ holds 63 documents, so copying SKILL.md alone loses every diagram type. Verify by turning a written description into a flowchart and checking the node count stays at what the explanation needs.'
      }
    ]
  },
  anatomy: {
    packageZh: 'SKILL.md、references/（3d、craft、kit、motion、publish、react、verify、walkthrough、webgl 共 9 篇）、演示视频、ZIP 下载',
    packageEn: 'SKILL.md, references/ (3d, craft, kit, motion, publish, react, verify, walkthrough, webgl — 9 documents), demo video, ZIP download',
    agentsZh: AGENTS_GENERIC_ZH,
    agentsEn: AGENTS_GENERIC_EN,
    installZh: `${INSTALL_BASE_ZH}${INSTALL_ZIP_REFS_ZH}`,
    installEn: `${INSTALL_BASE_EN}${INSTALL_ZIP_REFS_EN}`,
    faq: [
      {
        qZh: '这技能是干什么的？',
        qEn: 'What does this skill do?',
        aZh: '把技术概念画成一台可交互的等轴测小仪器：表盘、旋钮、滑轨都能动，数字和模型同一套数据，读者一看就懂。',
        aEn: 'It draws a technical idea as an interactive isometric instrument — dials, knobs, and rails that move, every number driven by the same model the reader sees.'
      },
      {
        qZh: '支持哪些 Agent？',
        qEn: 'Which agents does it work with?',
        aZh: '通用 SKILL.md 文本，Claude Code、Codex、Cursor、Muse 都能用；使用时说明要解释的技术概念和关键数字。',
        aEn: 'Plain SKILL.md text works with Claude Code, Codex, Cursor, and Muse. Name the technical idea and the key numbers when you use it.'
      },
      {
        qZh: '怎么安装？',
        qEn: 'How do I install it?',
        aZh: '点「复制技能」粘贴即可；包带 references/（9 篇），用 ZIP 才完整。验证：在浏览器里点一点，看部件和数字是否联动，零件遮挡顺序是否正确。',
        aEn: 'Copy skill and paste it, or download the ZIP — the package includes references/ (9 documents). Verify in the browser: do the parts move with the numbers, and is the painter’s order correct?'
      }
    ]
  },
  cover_image_gen: {
    packageZh: 'SKILL.md、skill.yaml、ORIGIN.md、演示视频、ZIP 下载',
    packageEn: 'SKILL.md, skill.yaml, ORIGIN.md, demo video, ZIP download',
    agentsZh: AGENTS_GENERIC_ZH,
    agentsEn: AGENTS_GENERIC_EN,
    installZh: INSTALL_BASE_ZH,
    installEn: INSTALL_BASE_EN,
    faq: [
      {
        qZh: '这技能是干什么的？',
        qEn: 'What does this skill do?',
        aZh: '把定好的中文标题做成网站、公众号或 X 的封面：固定 3D 纸雕黏土风，同一题出三版构图，标题逐字验过再交付 JPG。',
        aEn: 'It turns a finished Chinese title into a cover for the site, WeChat, or X — locked to the 3D paper-craft clay style, three compositions, then a character-by-character check before the JPG is delivered.'
      },
      {
        qZh: '支持哪些 Agent？',
        qEn: 'Which agents does it work with?',
        aZh: '通用 SKILL.md 文本，Claude Code、Codex、Cursor、Muse 都能用；使用时说明标题、黄底高亮的词，以及封面用在哪。',
        aEn: 'Plain SKILL.md text works with Claude Code, Codex, Cursor, and Muse. State the title, the words highlighted on yellow, and where the cover will go.'
      },
      {
        qZh: '怎么安装？',
        qEn: 'How do I install it?',
        aZh: '包只有 SKILL.md、skill.yaml、ORIGIN.md，点「复制技能」粘贴或下载 ZIP 都可。验证：收回三版构图后逐字对标题，错字或乱码就重生；公众号上传须转 JPG（quality=92），不认 WebP。',
        aEn: 'The package is only SKILL.md, skill.yaml, and ORIGIN.md — copy-paste or ZIP both work. Verify by proof-reading every character of the title on all three compositions and regenerating on any error; WeChat upload needs JPG (quality=92), not WebP.'
      }
    ]
  },
  desk_watercolor: {
    packageZh: 'SKILL.md、skill.yaml、演示视频、ZIP 下载',
    packageEn: 'SKILL.md, skill.yaml, demo video, ZIP download',
    agentsZh: AGENTS_GENERIC_ZH,
    agentsEn: AGENTS_GENERIC_EN,
    installZh: INSTALL_BASE_ZH,
    installEn: INSTALL_BASE_EN,
    faq: [
      {
        qZh: '这技能是干什么的？',
        qEn: 'What does this skill do?',
        aZh: '暖纸水彩手绘风插画：水彩加墨线画在米色纸上，琥珀色调，全图只有一个橙色点缀；要写字时带短句手写字，逐字验过再交付。',
        aEn: 'Warm hand-drawn watercolor illustrations: ink and wash on cream paper, an amber palette, and exactly one orange accent — with short handwritten text when asked, checked character by character.'
      },
      {
        qZh: '支持哪些 Agent？',
        qEn: 'Which agents does it work with?',
        aZh: '通用 SKILL.md 文本，Claude Code、Codex、Cursor、Muse 都能用；使用时说明场景、点缀物和光线，要写字时给出原文和落点。',
        aEn: 'Plain SKILL.md text works with Claude Code, Codex, Cursor, and Muse. Describe the scene, the accent object, and the light; give exact text and placement when you want words.'
      },
      {
        qZh: '怎么安装？',
        qEn: 'How do I install it?',
        aZh: '包只有 SKILL.md 与 skill.yaml，点「复制技能」粘贴或下载 ZIP 都可。验证：数画面里的饱和橙色点缀是不是只有一个，纸纹是否贯穿整张图。',
        aEn: 'The package is only SKILL.md and skill.yaml — copy-paste or ZIP both work. Verify that the image has exactly one saturated orange accent and paper grain running through the whole picture.'
      }
    ]
  },
  custom_connector_setup: {
    packageZh: 'SKILL.md、skill.yaml、templates/（连接器与技能模板）、bin/ 脚本、references/（2 篇）、README-GROKBOT.md、ZIP 下载；无演示视频',
    packageEn: 'SKILL.md, skill.yaml, templates/ (connector and skill templates), bin/ scripts, references/ (2 documents), README-GROKBOT.md, ZIP download; no demo video',
    agentsZh: `${AGENTS_GENERIC_ZH}包内 README-GROKBOT.md 另有 GrokBot 侧的用法。`,
    agentsEn: `${AGENTS_GENERIC_EN} The package’s README-GROKBOT.md also covers the GrokBot-side usage.`,
    installZh: '本包带 bin/ 脚本与 templates/，只复制 SKILL.md 会丢脚手架，须下载 ZIP 并保留目录结构；凭证走专门的凭证请求流程，不在聊天里要密钥。先用一次无害的只读调用验证连通。',
    installEn: 'This package ships bin/ scripts and templates/ — copying SKILL.md alone loses the scaffolding, so download the ZIP and keep its structure. Credentials go through the dedicated credential-request flow, never in chat. Verify with one harmless read-only call first.',
    faq: [
      {
        qZh: '这技能是干什么的？',
        qEn: 'What does this skill do?',
        aZh: '把没有内置连接器的第三方服务，用它的 API 或 MCP 接进来：先走官方路线，再搭文档、做一次无害读取验证，沉淀成可复用的连接器文档。',
        aEn: 'It connects a service with no bundled connector through its API or MCP: prefer official routes, then scaffold docs, verify with a harmless read, and save reusable connector docs.'
      },
      {
        qZh: '支持哪些 Agent？',
        qEn: 'Which agents does it work with?',
        aZh: '通用 SKILL.md 文本，Claude Code、Codex、Cursor、Muse 都能用；包内 README-GROKBOT.md 另有 GrokBot 侧的用法。',
        aEn: 'Plain SKILL.md text works with Claude Code, Codex, Cursor, and Muse. The package’s README-GROKBOT.md also covers the GrokBot-side usage.'
      },
      {
        qZh: '怎么安装？',
        qEn: 'How do I install it?',
        aZh: '必须下载 ZIP：bin/ 脚本与 templates/ 只在 ZIP 里，复制 SKILL.md 会丢脚手架；本站无该技能的演示视频。验证：先用一次无害的只读调用（例如读取一个任务列表）验证连通，通了再保存连接器文档。',
        aEn: 'Download the ZIP — the bin/ scripts and templates/ only ship in it, and this skill has no demo video on the site. Verify with one harmless read-only call (for example reading one task list) before saving the connector docs.'
      }
    ]
  },
  'personal-site-build': {
    packageZh: 'SKILL.md、references/ui-catalog.md、演示视频、ZIP 下载',
    packageEn: 'SKILL.md, references/ui-catalog.md, demo video, ZIP download',
    agentsZh: AGENTS_GENERIC_ZH,
    agentsEn: AGENTS_GENERIC_EN,
    installZh: `${INSTALL_BASE_ZH}${INSTALL_ZIP_REFS_ZH}`,
    installEn: `${INSTALL_BASE_EN}${INSTALL_ZIP_REFS_EN}`,
    faq: [
      {
        qZh: '这技能是干什么的？',
        qEn: 'What does this skill do?',
        aZh: '从 0 搭个人或品牌站：先用飞书文档当内容底稿，再按品类挑 UI 参考站，让 AI 抓代码、截图和风格关键词后整合实现，发布前还有图片外链清理检查。',
        aEn: 'It builds a personal or brand site from scratch: a Feishu doc as the content brief, UI references picked by category, AI-harvested code, screenshots, and style keywords — with an image-link cleanup check before launch.'
      },
      {
        qZh: '支持哪些 Agent？',
        qEn: 'Which agents does it work with?',
        aZh: '通用 SKILL.md 文本，Claude Code、Codex、Cursor、Muse 都能用；使用时贴上飞书内容底稿链接，说明站点类型。',
        aEn: 'Plain SKILL.md text works with Claude Code, Codex, Cursor, and Muse. Paste the Feishu brief link and name the site type.'
      },
      {
        qZh: '怎么安装？',
        qEn: 'How do I install it?',
        aZh: '点「复制技能」粘贴即可；包带 references/ui-catalog.md，用 ZIP 才完整。验证：全文搜索 feishu / lark / 临时外链残留，生产站里一个也不能留。',
        aEn: 'Copy skill and paste it, or download the ZIP — the package includes references/ui-catalog.md. Verify by searching the whole project for leftover feishu / lark / temporary external links; none may remain on the production site.'
      }
    ]
  },
  'frontend-design': {
    packageZh: 'SKILL.md、LICENSE.txt、演示视频、ZIP 下载',
    packageEn: 'SKILL.md, LICENSE.txt, demo video, ZIP download',
    agentsZh: `${AGENTS_GENERIC_ZH}这是 Anthropic 官方 Skill，Claude Code 侧原生支持最好。`,
    agentsEn: `${AGENTS_GENERIC_EN} This is Anthropic’s official skill, with the best native support in Claude Code.`,
    installZh: INSTALL_BASE_ZH,
    installEn: INSTALL_BASE_EN,
    faq: [
      {
        qZh: '这技能是干什么的？',
        qEn: 'What does this skill do?',
        aZh: 'Anthropic 官方的前端设计 Skill：像设计工作室的主创一样，给每个项目定有辨识度的视觉方向，配色、字体、排版都 deliberate，不做 AI 默认审美。',
        aEn: 'Anthropic’s official frontend-design skill: art-direct every project like a design studio lead — deliberate palette, typography, and layout, never the generic AI look.'
      },
      {
        qZh: '支持哪些 Agent？',
        qEn: 'Which agents does it work with?',
        aZh: '通用 SKILL.md 文本，Claude Code、Codex、Cursor、Muse 都能用，Claude Code 侧原生支持最好；使用时说明项目调性和「不要像谁」。',
        aEn: 'Plain SKILL.md text works with Claude Code, Codex, Cursor, and Muse, with the best native support in Claude Code. Name the vibe and what it must not look like.'
      },
      {
        qZh: '怎么安装？',
        qEn: 'How do I install it?',
        aZh: '包只有 SKILL.md 与 LICENSE.txt，点「复制技能」粘贴或下载 ZIP 都可。验证：让它先给定视觉方向，再出页面，不要直接跳到出页面。',
        aEn: 'The package is only SKILL.md and LICENSE.txt — copy-paste or ZIP both work. Verify by having it set the visual direction first, then build pages.'
      }
    ]
  },
  'ui-design-refs': {
    packageZh: 'SKILL.md、references/ui-catalog.md、演示视频、ZIP 下载',
    packageEn: 'SKILL.md, references/ui-catalog.md, demo video, ZIP download',
    agentsZh: AGENTS_GENERIC_ZH,
    agentsEn: AGENTS_GENERIC_EN,
    installZh: `${INSTALL_BASE_ZH}${INSTALL_ZIP_REFS_ZH}`,
    installEn: `${INSTALL_BASE_EN}${INSTALL_ZIP_REFS_EN}`,
    faq: [
      {
        qZh: '这技能是干什么的？',
        qEn: 'What does this skill do?',
        aZh: '8 大类 60+ UI 参考站：组件、动效、整站灵感、产品流程、微交互、配色素材、AI 建站、设计 Skill，按场景挑链接再交给 AI，商用前核对授权。',
        aEn: 'Sixty-plus UI reference sites in eight buckets — components, motion, full-site inspiration, product flows, micro-interactions, palettes, AI site builders, design skills. Pick by scene, hand to AI, check licenses before commercial use.'
      },
      {
        qZh: '支持哪些 Agent？',
        qEn: 'Which agents does it work with?',
        aZh: '通用 SKILL.md 文本，Claude Code、Codex、Cursor、Muse 都能用；使用时说明场景：组件、动效还是整站灵感。',
        aEn: 'Plain SKILL.md text works with Claude Code, Codex, Cursor, and Muse. Name the scene: components, motion, or full-site inspiration.'
      },
      {
        qZh: '怎么安装？',
        qEn: 'How do I install it?',
        aZh: '点「复制技能」粘贴即可；包带 references/ui-catalog.md，用 ZIP 才完整。验证：写进实现简报时每个品类链接不超过 3 个，且写明授权风险。',
        aEn: 'Copy skill and paste it, or download the ZIP — the package includes references/ui-catalog.md. Verify that the build brief keeps at most 3 links per category and states the licence risks.'
      }
    ]
  },
  'haiwai-new-keyword-launch': {
    packageZh: 'SKILL.md、references/tools.md、演示视频、ZIP 下载',
    packageEn: 'SKILL.md, references/tools.md, demo video, ZIP download',
    agentsZh: AGENTS_GENERIC_ZH,
    agentsEn: AGENTS_GENERIC_EN,
    installZh: `${INSTALL_BASE_ZH}${INSTALL_ZIP_REFS_ZH}`,
    installEn: `${INSTALL_BASE_EN}${INSTALL_ZIP_REFS_EN}`,
    faq: [
      {
        qZh: '这技能是干什么的？',
        qEn: 'What does this skill do?',
        aZh: '用 Google Trends 词根法找新词，四项检查判断值不值得立刻做，再按 D0–D5 SOP 当天上站、次日铺长尾：抢的是按周计的 SEO/GEO 红利。',
        aEn: 'It finds new keywords with the Google Trends root-word method, runs the four checks, then ships the same day on the D0–D5 SOP and covers long-tails on day two — chasing an SEO/GEO window measured in weeks.'
      },
      {
        qZh: '支持哪些 Agent？',
        qEn: 'Which agents does it work with?',
        aZh: '通用 SKILL.md 文本，Claude Code、Codex、Cursor、Muse 都能用；使用时贴上新词，跑四项检查：搜索量、竞争、域名、变现。',
        aEn: 'Plain SKILL.md text works with Claude Code, Codex, Cursor, and Muse. Paste the new term and run the four checks: volume, competition, domain, monetization.'
      },
      {
        qZh: '怎么安装？',
        qEn: 'How do I install it?',
        aZh: '点「复制技能」粘贴即可；包带 references/tools.md，用 ZIP 才完整。验证：D0 的目标是一个当天可点开的站，而不是完整产品。',
        aEn: 'Copy skill and paste it, or download the ZIP — the package includes references/tools.md. Verify against the D0 bar: a site that opens the same day, not a finished product.'
      }
    ]
  },
  'haiwai-monetize-convert': {
    packageZh: 'SKILL.md、references/tools.md、演示视频、ZIP 下载',
    packageEn: 'SKILL.md, references/tools.md, demo video, ZIP download',
    agentsZh: AGENTS_GENERIC_ZH,
    agentsEn: AGENTS_GENERIC_EN,
    installZh: `${INSTALL_BASE_ZH}${INSTALL_ZIP_REFS_ZH}`,
    installEn: `${INSTALL_BASE_EN}${INSTALL_ZIP_REFS_EN}`,
    faq: [
      {
        qZh: '这技能是干什么的？',
        qEn: 'What does this skill do?',
        aZh: '站有流量之后的事：假生成提停留、锚定定价、照抄竞品再按数据改、Feed 与分享做留存、GA4 与支付埋点对齐、Stripe 风控，一套组合拳提付费转化。',
        aEn: 'For after you have traffic: fake generation for dwell time, anchor pricing, copy competitors then revise by data, Feed and sharing for retention, aligned GA4 and payment events, Stripe risk controls — a combo to lift paid conversion.'
      },
      {
        qZh: '支持哪些 Agent？',
        qEn: 'Which agents does it work with?',
        aZh: '通用 SKILL.md 文本，Claude Code、Codex、Cursor、Muse 都能用；使用时先对齐埋点：GA4、支付、行为三件套。',
        aEn: 'Plain SKILL.md text works with Claude Code, Codex, Cursor, and Muse. Align events first: GA4, payments, and the behaviour trio.'
      },
      {
        qZh: '怎么安装？',
        qEn: 'How do I install it?',
        aZh: '点「复制技能」粘贴即可；包带 references/tools.md，用 ZIP 才完整。验证：上支付的同一天，GA4 的购买成功事件与后台订单对齐抽查，失败付款也要有记录。',
        aEn: 'Copy skill and paste it, or download the ZIP — the package includes references/tools.md. Verify on the day payment goes live: GA4 purchase-success events spot-checked against back-office orders, with failed payments logged too.'
      }
    ]
  },
  'writing-skills': {
    packageZh: 'SKILL.md、NOTICE.md、演示视频、ZIP 下载',
    packageEn: 'SKILL.md, NOTICE.md, demo video, ZIP download',
    agentsZh: AGENTS_GENERIC_ZH,
    agentsEn: AGENTS_GENERIC_EN,
    installZh: INSTALL_BASE_ZH,
    installEn: INSTALL_BASE_EN,
    faq: [
      {
        qZh: '这技能是干什么的？',
        qEn: 'What does this skill do?',
        aZh: '把一套验证过的经验、方法或流程，写成 Agent 能直接用的 SKILL.md：什么时候写、怎么写、发布前怎么验证有效。',
        aEn: 'It turns a proven method or workflow into a SKILL.md an agent can actually use: when to write one, how to write it, and how to verify it works before shipping.'
      },
      {
        qZh: '支持哪些 Agent？',
        qEn: 'Which agents does it work with?',
        aZh: '通用 SKILL.md 文本，Claude Code、Codex、Cursor、Muse 都能用；使用时说明要固化的方法和它解决什么问题。',
        aEn: 'Plain SKILL.md text works with Claude Code, Codex, Cursor, and Muse. Name the method to solidify and the problem it solves.'
      },
      {
        qZh: '怎么安装？',
        qEn: 'How do I install it?',
        aZh: '包只有 SKILL.md 与 NOTICE.md，点「复制技能」粘贴或下载 ZIP 都可。验证：写技能前亲眼看过代理在没有技能时犯错（红-绿-重构），技能只针对记录到的违规行为。',
        aEn: 'The package is only SKILL.md and NOTICE.md — copy-paste or ZIP both work. Verify the red-green-refactor way: the agent was seen failing without the skill first, and the skill targets only the recorded violations.'
      }
    ]
  },
  brainstorming: {
    packageZh: 'SKILL.md、NOTICE.md、演示视频、ZIP 下载',
    packageEn: 'SKILL.md, NOTICE.md, demo video, ZIP download',
    agentsZh: AGENTS_GENERIC_ZH,
    agentsEn: AGENTS_GENERIC_EN,
    installZh: INSTALL_BASE_ZH,
    installEn: INSTALL_BASE_EN,
    faq: [
      {
        qZh: '这技能是干什么的？',
        qEn: 'What does this skill do?',
        aZh: '动手之前先问对问题：任何创造性工作，先把「你到底想要什么、为什么」聊清楚；需求已经完全明确的小事不适用。',
        aEn: 'It asks the right questions before building: for any creative work, pin down what you really want and why first. Skip it for simple tasks with fully clear requirements.'
      },
      {
        qZh: '支持哪些 Agent？',
        qEn: 'Which agents does it work with?',
        aZh: '通用 SKILL.md 文本，Claude Code、Codex、Cursor、Muse 都能用；使用时说出初步想法，允许它追问。',
        aEn: 'Plain SKILL.md text works with Claude Code, Codex, Cursor, and Muse. Share your rough idea and let it ask questions.'
      },
      {
        qZh: '怎么安装？',
        qEn: 'How do I install it?',
        aZh: '包只有 SKILL.md 与 NOTICE.md，点「复制技能」粘贴或下载 ZIP 都可。验证：聊到「要什么、为什么」都清楚再动手，而不是问两句就开工。',
        aEn: 'The package is only SKILL.md and NOTICE.md — copy-paste or ZIP both work. Verify by building only once the what and why are both clear, not after two questions.'
      }
    ]
  },
  'systematic-debugging': {
    packageZh: 'SKILL.md、NOTICE.md、演示视频、ZIP 下载',
    packageEn: 'SKILL.md, NOTICE.md, demo video, ZIP download',
    agentsZh: AGENTS_GENERIC_ZH,
    agentsEn: AGENTS_GENERIC_EN,
    installZh: INSTALL_BASE_ZH,
    installEn: INSTALL_BASE_EN,
    faq: [
      {
        qZh: '这技能是干什么的？',
        qEn: 'What does this skill do?',
        aZh: '遇到 bug 先别「改一行试试」：按四阶段排查——复现、定位、找根因、再修，修症状不算修好。',
        aEn: 'When a bug hits, resist “change one line and see”: debug in four phases — reproduce, isolate, find the root cause, then fix. Fixing symptoms does not count.'
      },
      {
        qZh: '支持哪些 Agent？',
        qEn: 'Which agents does it work with?',
        aZh: '通用 SKILL.md 文本，Claude Code、Codex、Cursor、Muse 都能用；使用时先复现并描述现象，不要先改代码。',
        aEn: 'Plain SKILL.md text works with Claude Code, Codex, Cursor, and Muse. Reproduce and describe the symptom first — no code changes yet.'
      },
      {
        qZh: '怎么安装？',
        qEn: 'How do I install it?',
        aZh: '包只有 SKILL.md 与 NOTICE.md，点「复制技能」粘贴或下载 ZIP 都可。验证：修复提出之前已经有根因证据，修的是源头，不是报错出现的位置。',
        aEn: 'The package is only SKILL.md and NOTICE.md — copy-paste or ZIP both work. Verify that root-cause evidence exists before any fix is proposed, and that the fix lands at the source, not where the error surfaced.'
      }
    ]
  },
  'verification-before-completion': {
    packageZh: 'SKILL.md、NOTICE.md、演示视频、ZIP 下载',
    packageEn: 'SKILL.md, NOTICE.md, demo video, ZIP download',
    agentsZh: AGENTS_GENERIC_ZH,
    agentsEn: AGENTS_GENERIC_EN,
    installZh: INSTALL_BASE_ZH,
    installEn: INSTALL_BASE_EN,
    faq: [
      {
        qZh: '这技能是干什么的？',
        qEn: 'What does this skill do?',
        aZh: '说「做完了」之前，先拿出证据：跑验证命令、看真实输出，有证据再下「成功」的结论。',
        aEn: 'Before you say done, show evidence: run the verification commands, read the real output — evidence first, “success” claims after.'
      },
      {
        qZh: '支持哪些 Agent？',
        qEn: 'Which agents does it work with?',
        aZh: '通用 SKILL.md 文本，Claude Code、Codex、Cursor、Muse 都能用；使用时说清楚「完成」长什么样：测试过、构建过、线上验过。',
        aEn: 'Plain SKILL.md text works with Claude Code, Codex, Cursor, and Muse. Define what “done” looks like: tested, built, verified live.'
      },
      {
        qZh: '怎么安装？',
        qEn: 'How do I install it?',
        aZh: '包只有 SKILL.md 与 NOTICE.md，点「复制技能」粘贴或下载 ZIP 都可。验证：断言来自刚刚跑的那一次命令，不是上次的结果；「应该」「大概」「看起来」都是红线词。',
        aEn: 'The package is only SKILL.md and NOTICE.md — copy-paste or ZIP both work. Verify that the claim comes from a command run just now, not an earlier result; “should”, “probably” and “looks like” are red-flag words.'
      }
    ]
  },
  'writing-plans': {
    packageZh: 'SKILL.md、NOTICE.md、ZIP 下载；无演示视频',
    packageEn: 'SKILL.md, NOTICE.md, ZIP download; no demo video',
    agentsZh: AGENTS_GENERIC_ZH,
    agentsEn: AGENTS_GENERIC_EN,
    installZh: INSTALL_BASE_ZH,
    installEn: INSTALL_BASE_EN,
    faq: [
      {
        qZh: '这技能是干什么的？',
        qEn: 'What does this skill do?',
        aZh: '手里有需求、多步骤任务，动手写代码之前：先把规格拆成没见过代码库的工程师也能一步步执行的实现计划。',
        aEn: 'You have the requirements and a multi-step task: before coding, break the spec into an implementation plan any engineer — even one new to the repo — can execute step by step.'
      },
      {
        qZh: '支持哪些 Agent？',
        qEn: 'Which agents does it work with?',
        aZh: '通用 SKILL.md 文本，Claude Code、Codex、Cursor、Muse 都能用；使用时贴上需求或规格说明。',
        aEn: 'Plain SKILL.md text works with Claude Code, Codex, Cursor, and Muse. Paste the requirements or spec.'
      },
      {
        qZh: '怎么安装？',
        qEn: 'How do I install it?',
        aZh: '包只有 SKILL.md 与 NOTICE.md，点「复制技能」粘贴或下载 ZIP 都可；本站无该技能的演示视频。验证：审计划——步骤是否可执行、验证点是否齐全，通过再动手。',
        aEn: 'The package is only SKILL.md and NOTICE.md — copy-paste or ZIP both work; this skill has no demo video on the site. Verify by reviewing the plan: are the steps executable, are verification points complete?'
      }
    ]
  },
  'ai-project-delivery': {
    packageZh: 'SKILL.md、README.md、LICENSE.txt、演示视频、ZIP 下载',
    packageEn: 'SKILL.md, README.md, LICENSE.txt, demo video, ZIP download',
    agentsZh: AGENTS_GENERIC_ZH,
    agentsEn: AGENTS_GENERIC_EN,
    installZh: INSTALL_BASE_ZH,
    installEn: INSTALL_BASE_EN,
    faq: [
      {
        qZh: '这技能是干什么的？',
        qEn: 'What does this skill do?',
        aZh: '用 AI Coding Agent 做新功能、修问题或交付可运行项目时：把需求澄清、代码库勘察、实施计划、分步编码、测试验证组织成可追踪的工程流程。',
        aEn: 'When building features, fixing issues, or shipping a runnable project with an AI coding agent: organize requirement clarification, repo recon, implementation planning, stepwise coding, and test verification into a traceable engineering flow.'
      },
      {
        qZh: '支持哪些 Agent？',
        qEn: 'Which agents does it work with?',
        aZh: '通用 SKILL.md 文本，Claude Code、Codex、Cursor、Muse 等 Coding Agent 都能用；使用时说清需求，让它先澄清再勘察代码库。',
        aEn: 'Plain SKILL.md text works with Claude Code, Codex, Cursor, Muse, and other coding agents. State the requirements; have it clarify and recon the repo first.'
      },
      {
        qZh: '怎么安装？',
        qEn: 'How do I install it?',
        aZh: '包只有 SKILL.md、README.md、LICENSE.txt，点「复制技能」粘贴或下载 ZIP 都可。验证：测试、构建结果都是真实运行得到的，交付说明含改动、验证、未验证项与回滚方式。',
        aEn: 'The package is only SKILL.md, README.md, and LICENSE.txt — copy-paste or ZIP both work. Verify that test and build results come from real runs, and that the delivery note covers changes, verification, unverified items, and rollback.'
      }
    ]
  },
  'website-launch-check': {
    packageZh: 'SKILL.md（仅一个文件）、演示视频、ZIP 下载',
    packageEn: 'SKILL.md (a single file), demo video, ZIP download',
    agentsZh: AGENTS_GENERIC_ZH,
    agentsEn: AGENTS_GENERIC_EN,
    installZh: INSTALL_BASE_ZH,
    installEn: INSTALL_BASE_EN,
    faq: [
      {
        qZh: '这技能是干什么的？',
        qEn: 'What does this skill do?',
        aZh: '网站准备发布或刚改版：逐项验证页面、移动端、链接、表单、SEO、分享卡、性能、隐私与回滚，输出带证据的上线清单，「本地能跑」不算上线。',
        aEn: 'For a site about to launch or just redesigned: verify pages, mobile, links, forms, SEO, share cards, performance, privacy, and rollback item by item — and ship an evidence-backed launch checklist. “Works locally” is not launched.'
      },
      {
        qZh: '支持哪些 Agent？',
        qEn: 'Which agents does it work with?',
        aZh: '通用 SKILL.md 文本，Claude Code、Codex、Cursor、Muse 都能用；使用时说明是新站发布还是改版验收。',
        aEn: 'Plain SKILL.md text works with Claude Code, Codex, Cursor, and Muse. Say whether it is a new launch or a redesign check.'
      },
      {
        qZh: '怎么安装？',
        qEn: 'How do I install it?',
        aZh: '包只有 SKILL.md 一个文件，点「复制技能」粘贴即可，不用下载 ZIP。验证：每一项都有命令、截图或页面地址作证据；没有环境权限的检查标「未验证」，不写成通过。',
        aEn: 'The package is a single SKILL.md file — Copy skill and paste it, no ZIP needed. Verify that every line has a command, screenshot, or URL as evidence, and that checks without environment access are marked “not verified”, never “pass”.'
      }
    ]
  },
  'content-repurpose': {
    packageZh: 'SKILL.md（仅一个文件）、演示视频、ZIP 下载',
    packageEn: 'SKILL.md (a single file), demo video, ZIP download',
    agentsZh: AGENTS_GENERIC_ZH,
    agentsEn: AGENTS_GENERIC_EN,
    installZh: INSTALL_BASE_ZH,
    installEn: INSTALL_BASE_EN,
    faq: [
      {
        qZh: '这技能是干什么的？',
        qEn: 'What does this skill do?',
        aZh: '把一篇文章、访谈、视频转写或读书笔记，拆成公众号、X、短帖、邮件和网站的多种内容：先提炼母稿再按平台重组，保留事实与口吻，不机械缩写。',
        aEn: 'It turns an article, interview, video transcript, or reading note into content for WeChat, X, short posts, email, and the web: distill the master draft first, then restructure per platform — facts and voice intact, no mechanical condensing.'
      },
      {
        qZh: '支持哪些 Agent？',
        qEn: 'Which agents does it work with?',
        aZh: '通用 SKILL.md 文本，Claude Code、Codex、Cursor、Muse 都能用；使用时说明要出哪些平台版本。',
        aEn: 'Plain SKILL.md text works with Claude Code, Codex, Cursor, and Muse. Name the platform versions you want.'
      },
      {
        qZh: '怎么安装？',
        qEn: 'How do I install it?',
        aZh: '包只有 SKILL.md 一个文件，点「复制技能」粘贴即可，不用下载 ZIP。验证：先审母稿提炼，再审各平台版本；本次改写没有新增任何数据、引语或经历。',
        aEn: 'The package is a single SKILL.md file — Copy skill and paste it, no ZIP needed. Verify by reviewing the master distillation first, then each platform version; the rewrite must add no new data, quotes, or experiences.'
      }
    ]
  },
  'browser-automation': {
    packageZh: 'SKILL.md（仅一个文件）、演示视频、ZIP 下载',
    packageEn: 'SKILL.md (a single file), demo video, ZIP download',
    agentsZh: AGENTS_GENERIC_ZH,
    agentsEn: AGENTS_GENERIC_EN,
    installZh: INSTALL_BASE_ZH,
    installEn: INSTALL_BASE_EN,
    faq: [
      {
        qZh: '这技能是干什么的？',
        qEn: 'What does this skill do?',
        aZh: '把重复的网页操作整理成可执行、可恢复的自动化流程：先识别页面状态与风险，再设计定位、验证、重试和人工确认，高风险动作永远留确认。',
        aEn: 'It turns repetitive web work into executable, recoverable automation: first map page states and risks, then design selectors, verification, retries, and human confirmation — high-risk actions always keep a checkpoint.'
      },
      {
        qZh: '支持哪些 Agent？',
        qEn: 'Which agents does it work with?',
        aZh: '通用 SKILL.md 文本，Claude Code、Codex、Cursor、Muse 都能用；使用时描述重复操作和页面，标出高风险动作。',
        aEn: 'Plain SKILL.md text works with Claude Code, Codex, Cursor, and Muse. Describe the repetitive work and the pages; flag high-risk actions.'
      },
      {
        qZh: '怎么安装？',
        qEn: 'How do I install it?',
        aZh: '包只有 SKILL.md 一个文件，点「复制技能」粘贴即可，不用下载 ZIP。验证：批量操作之前先用 3 条做样本试跑，确认结果后再扩大；不尝试绕过验证码或访问限制。',
        aEn: 'The package is a single SKILL.md file — Copy skill and paste it, no ZIP needed. Verify with a 3-row trial run before the batch, and never try to bypass CAPTCHAs or access limits.'
      }
    ]
  },
  'data-analysis': {
    packageZh: 'SKILL.md（仅一个文件）、演示视频、ZIP 下载',
    packageEn: 'SKILL.md (a single file), demo video, ZIP download',
    agentsZh: AGENTS_GENERIC_ZH,
    agentsEn: AGENTS_GENERIC_EN,
    installZh: INSTALL_BASE_ZH,
    installEn: INSTALL_BASE_EN,
    faq: [
      {
        qZh: '这技能是干什么的？',
        qEn: 'What does this skill do?',
        aZh: '从业务表格、事件日志或导出数据里建口径、查质量、拆漏斗与分群，产出能指导下一步动作的分析：先验证数据与计算，再给结论。',
        aEn: 'It builds definitions, checks quality, and breaks down funnels and cohorts from business tables, event logs, or exports — producing analysis that drives next actions. Verify data and math before conclusions.'
      },
      {
        qZh: '支持哪些 Agent？',
        qEn: 'Which agents does it work with?',
        aZh: '通用 SKILL.md 文本，Claude Code、Codex、Cursor、Muse 都能用；使用时说明业务问题和数据来源。',
        aEn: 'Plain SKILL.md text works with Claude Code, Codex, Cursor, and Muse. Name the business question and the data source.'
      },
      {
        qZh: '怎么安装？',
        qEn: 'How do I install it?',
        aZh: '包只有 SKILL.md 一个文件，点「复制技能」粘贴即可，不用下载 ZIP。验证：比较的是同口径、同时间窗的数据，关键结果抽样复算过，证据不足的原因写成待验证假设。',
        aEn: 'The package is a single SKILL.md file — Copy skill and paste it, no ZIP needed. Verify that comparisons use the same definitions and time windows, key results were spot-checked by recomputation, and thin evidence stays a hypothesis to test.'
      }
    ]
  },
  'landing-page-design': {
    packageZh: 'SKILL.md、ATTRIBUTION.md、LICENSE（MIT，致谢 Elaya / taste-skill）、演示视频、ZIP 下载',
    packageEn: 'SKILL.md, ATTRIBUTION.md, LICENSE (MIT, credit Elaya / taste-skill), demo video, ZIP download',
    agentsZh: AGENTS_GENERIC_ZH,
    agentsEn: AGENTS_GENERIC_EN,
    installZh: INSTALL_BASE_ZH,
    installEn: INSTALL_BASE_EN,
    faq: [
      {
        qZh: '这技能是干什么的？',
        qEn: 'What does this skill do?',
        aZh: '专做落地页，不做首页：围绕「一个出价 → 一个受众 → 一个主行动」走完整体系，先问清转化，再定结构与文案，最后套上不可妥协的视觉硬规则。',
        aEn: 'Built for landing pages, not homepages. One offer → one audience → one primary action: intake, structure and copy first, then non-negotiable visual rules.'
      },
      {
        qZh: '支持哪些 Agent？',
        qEn: 'Which agents does it work with?',
        aZh: '通用 SKILL.md 文本，Claude Code、Codex、Cursor、Muse 都能用；使用时一次说清：出价、受众、主行动、证明材料与品牌约束。',
        aEn: 'Plain SKILL.md text works with Claude Code, Codex, Cursor, and Muse. State offer, audience, primary action, proof, and brand constraints in one pass.'
      },
      {
        qZh: '怎么安装？',
        qEn: 'How do I install it?',
        aZh: '包只有 SKILL.md、ATTRIBUTION.md、LICENSE，点「复制技能」粘贴或下载 ZIP 都可。验证：页面只有一个主行动，首屏五件套（结果型标题、副标题、主 CTA、信任证明、产品视觉）齐全。',
        aEn: 'The package is only SKILL.md, ATTRIBUTION.md, and LICENSE — copy-paste or ZIP both work. Verify exactly one primary action and the full above-the-fold five-piece set (outcome headline, subhead, primary CTA, proof signal, hero visual).'
      }
    ]
  },
  'grill-me': {
    packageZh: 'SKILL.md、grill-me/ 与 grilling/ 两个子技能（含 agents/openai.yaml）、ATTRIBUTION.md、LICENSE、演示视频、ZIP 下载',
    packageEn: 'SKILL.md, grill-me/ and grilling/ sub-skills (with agents/openai.yaml), ATTRIBUTION.md, LICENSE, demo video, ZIP download',
    agentsZh: `${AGENTS_GENERIC_ZH}ZIP 含 agents/openai.yaml，Codex 有专属配置；入口技能 grill-me 会唤起 grilling。`,
    agentsEn: `${AGENTS_GENERIC_EN} The ZIP includes agents/openai.yaml with a Codex-specific setup; the grill-me entry skill hands off to grilling.`,
    installZh: '下载 ZIP：包里是 grill-me 与 grilling 两个技能，解压后两个目录一起放进 Agent 的技能目录；只复制一个 SKILL.md 会丢另一半。',
    installEn: 'Download the ZIP: the package holds two skills, grill-me and grilling — put both directories into your agent’s skills directory. Copying one SKILL.md alone loses the other half.',
    faq: [
      {
        qZh: '这技能是干什么的？',
        qEn: 'What does this skill do?',
        aZh: 'Matt Pocock 的质询组合包：入口技能 grill-me 会唤起 grilling，按设计树工作，每轮问完当前可问的整条前沿，并给出推荐答案，直到没有隐含假设。',
        aEn: 'Matt Pocock’s grilling pair: grill-me hands off to grilling. Work a design tree, ask the whole frontier each round with recommended answers, until nothing is silently assumed.'
      },
      {
        qZh: '支持哪些 Agent？',
        qEn: 'Which agents does it work with?',
        aZh: '通用 SKILL.md 文本，Claude Code、Codex、Cursor、Muse 都能用；ZIP 含 agents/openai.yaml，Codex 有专属配置。',
        aEn: 'Plain SKILL.md text works with Claude Code, Codex, Cursor, and Muse. The ZIP includes agents/openai.yaml with a Codex-specific setup.'
      },
      {
        qZh: '怎么安装？',
        qEn: 'How do I install it?',
        aZh: '必须下载 ZIP：包里是 grill-me 与 grilling 两个技能，解压后两个目录一起放进技能目录。验证：前沿清空且你确认共识后再动手，未确认共识前不直接改代码。',
        aEn: 'Download the ZIP: the package holds two skills, grill-me and grilling — install both directories together. Verify by acting only after the frontier is empty and you confirm shared understanding.'
      }
    ]
  },
  zhishuo: {
    packageZh: 'SKILL.md、skill.yaml、ATTRIBUTION.md、演示视频、ZIP 下载',
    packageEn: 'SKILL.md, skill.yaml, ATTRIBUTION.md, demo video, ZIP download',
    agentsZh: AGENTS_GENERIC_ZH,
    agentsEn: AGENTS_GENERIC_EN,
    installZh: INSTALL_BASE_ZH,
    installEn: INSTALL_BASE_EN,
    faq: [
      {
        qZh: '这技能是干什么的？',
        qEn: 'What does this skill do?',
        aZh: 'AI 有个毛病：先铺垫半天，再绕到答案。直说把这个毛病治掉：回答先给结论，再给理由，用户读完第一行就知道下一步干什么。',
        aEn: 'AI has a habit: half a page of preamble before the answer. Speak Directly fixes it: conclusion first, reasons after, so the reader knows the next step after the first line.'
      },
      {
        qZh: '支持哪些 Agent？',
        qEn: 'Which agents does it work with?',
        aZh: '通用 SKILL.md 文本，Claude Code、Codex、Cursor、Muse 都能用；在对话里说「直说」或「别绕弯子」，规则对整个会话生效。',
        aEn: 'Plain SKILL.md text works with Claude Code, Codex, Cursor, and Muse. Say “speak directly” in the conversation and the rules apply to the whole session.'
      },
      {
        qZh: '怎么安装？',
        qEn: 'How do I install it?',
        aZh: '包只有 SKILL.md、skill.yaml、ATTRIBUTION.md，点「复制技能」粘贴或下载 ZIP 都可。验证：写完回答先念一遍第一行，说不清结论或下一步就重写。',
        aEn: 'The package is only SKILL.md, skill.yaml, and ATTRIBUTION.md — copy-paste or ZIP both work. Verify by reading the first line back: if it does not state the conclusion or next step, rewrite.'
      }
    ]
  },
  'xu-qiu-fang-tan': {
    packageZh: 'SKILL.md、skill.yaml、ATTRIBUTION.md、演示视频、ZIP 下载',
    packageEn: 'SKILL.md, skill.yaml, ATTRIBUTION.md, demo video, ZIP download',
    agentsZh: AGENTS_GENERIC_ZH,
    agentsEn: AGENTS_GENERIC_EN,
    installZh: INSTALL_BASE_ZH,
    installEn: INSTALL_BASE_EN,
    faq: [
      {
        qZh: '这技能是干什么的？',
        qEn: 'What does this skill do?',
        aZh: '用户只给一句话是常态，把隐含需求挖出来正是访谈的价值：三轮访谈（目标与价值、范围与验收、约束与执行）之后，产出一份九字段结构化 brief。',
        aEn: 'A one-line request is normal; surfacing hidden requirements is the interview’s job. Three rounds (goals and value, scope and acceptance, constraints and execution) end in a nine-field brief.'
      },
      {
        qZh: '支持哪些 Agent？',
        qEn: 'Which agents does it work with?',
        aZh: '通用 SKILL.md 文本，Claude Code、Codex、Cursor、Muse 都能用；使用时说要做什么，回答三轮访谈的问题。',
        aEn: 'Plain SKILL.md text works with Claude Code, Codex, Cursor, and Muse. State the task and answer three rounds of questions.'
      },
      {
        qZh: '怎么安装？',
        qEn: 'How do I install it?',
        aZh: '包只有 SKILL.md、skill.yaml、ATTRIBUTION.md，点「复制技能」粘贴或下载 ZIP 都可。验证：九个字段全部填满，「已确认」与「待确认」分开标注，访谈耗时不超过任务预估时间的五分之一。',
        aEn: 'The package is only SKILL.md, skill.yaml, and ATTRIBUTION.md — copy-paste or ZIP both work. Verify all nine fields are filled, confirmed and unconfirmed are kept apart, and the interview took no more than a fifth of the task’s estimated time.'
      }
    ]
  },
  'shi-tu-pei-wen': {
    packageZh: 'SKILL.md、skill.yaml、templates/（21:9、1:1、16:9 三个画板）、scripts/（render.mjs、overlay_pil.py）、ATTRIBUTION.md、演示视频、ZIP 下载',
    packageEn: 'SKILL.md, skill.yaml, templates/ (21:9, 1:1, and 16:9 boards), scripts/ (render.mjs, overlay_pil.py), ATTRIBUTION.md, demo video, ZIP download',
    agentsZh: AGENTS_GENERIC_ZH,
    agentsEn: AGENTS_GENERIC_EN,
    installZh: '本包带 templates/ 与 scripts/，只复制 SKILL.md 会丢画板与渲染脚本，须下载 ZIP 并保留目录结构；渲染用 scripts/render.mjs，需本机 Node 与 Playwright（Playwright 两次跑不通时走 PIL 兜底 overlay_pil.py）。',
    installEn: 'This package ships templates/ and scripts/ — copying SKILL.md alone loses the boards and render scripts, so download the ZIP and keep its structure. Rendering uses scripts/render.mjs with local Node and Playwright (PIL fallback overlay_pil.py if Playwright fails twice).',
    faq: [
      {
        qZh: '这技能是干什么的？',
        qEn: 'What does this skill do?',
        aZh: '给内容配一张与内容对应的真实照片，再把文字用代码排上去出 PNG 卡片：图片是下载到的真实照片，文字是 HTML 渲出来的，一个字都不会错。',
        aEn: 'It pairs content with a real photo, then renders the words in code into a PNG card: the photo is a real downloaded photo, the text is rendered in HTML, not a single character wrong.'
      },
      {
        qZh: '支持哪些 Agent？',
        qEn: 'Which agents does it work with?',
        aZh: '通用 SKILL.md 文本，Claude Code、Codex、Cursor、Muse 都能用；定内容、找真图、选画板，五步出一张卡，渲染脚本需本机 Node 与 Playwright。',
        aEn: 'Plain SKILL.md text works with Claude Code, Codex, Cursor, and Muse. Set the content, find a real photo, pick a board — five steps to a card; the render script needs local Node and Playwright.'
      },
      {
        qZh: '怎么安装？',
        qEn: 'How do I install it?',
        aZh: '必须下载 ZIP：templates/（21:9、1:1、16:9 三个画板）与 scripts/（render.mjs、overlay_pil.py）只在 ZIP 里。验证：打开 PNG 逐字核文字、核图片和内容对得上、核 SOURCES.md 有来源，三样都过才交付。',
        aEn: 'Download the ZIP: templates/ (21:9, 1:1, and 16:9 boards) and scripts/ (render.mjs, overlay_pil.py) only ship in it. Verify by opening the PNG and checking the words verbatim, the photo against the content, and the source in SOURCES.md — deliver only when all three pass.'
      }
    ]
  },
  impeccable: {
    packageZh: 'SKILL.md、reference/（critique、audit、polish、craft-floor、routing 共 5 篇）、INSTALL.md、LICENSE、NOTICE.md、演示视频、ZIP 下载',
    packageEn: 'SKILL.md, reference/ (critique, audit, polish, craft-floor, routing — 5 documents), INSTALL.md, LICENSE, NOTICE.md, demo video, ZIP download',
    agentsZh: `${AGENTS_GENERIC_ZH}无 CLI 时按 reference/ 文档执行；要完整能力按 INSTALL.md 装上游（npx impeccable）。`,
    agentsEn: `${AGENTS_GENERIC_EN} Without the CLI, follow the reference/ docs; for the full toolkit see INSTALL.md (npx impeccable).`,
    installZh: `${INSTALL_BASE_ZH}${INSTALL_ZIP_REFS_ZH}商店包是 critique / audit / polish 精简子集，完整 CLI 见包内 INSTALL.md。`,
    installEn: `${INSTALL_BASE_EN}${INSTALL_ZIP_REFS_EN} The store package is the critique / audit / polish subset; the full CLI is in INSTALL.md.`,
    faq: [
      {
        qZh: '这技能是干什么的？',
        qEn: 'What does this skill do?',
        aZh: '来自 pbakaus/impeccable 的商店精简包：保留 critique、audit、polish 与质量地板，是设计审阅工具链，用来挑毛病和打磨，而不是替代 frontend-design 从零定视觉方向。',
        aEn: 'A store-friendly subset of pbakaus/impeccable: critique, audit, polish, and the craft floor. A design-review toolchain — not a frontend-design replacement.'
      },
      {
        qZh: '支持哪些 Agent？',
        qEn: 'Which agents does it work with?',
        aZh: '通用 SKILL.md 文本，Claude Code、Codex、Cursor、Muse 都能用；无 CLI 时按 reference/ 文档执行，完整 CLI 见 INSTALL.md（npx impeccable）。',
        aEn: 'Plain SKILL.md text works with Claude Code, Codex, Cursor, and Muse. Without the CLI, follow the reference/ docs; the full CLI is in INSTALL.md (npx impeccable).'
      },
      {
        qZh: '怎么安装？',
        qEn: 'How do I install it?',
        aZh: '点「复制技能」粘贴即可；包带 reference/（5 篇）与 INSTALL.md，用 ZIP 才完整。验证：critique、audit、polish 三步都有输出，改动保持原品牌。',
        aEn: 'Copy skill and paste it, or download the ZIP — the package includes reference/ (5 documents) and INSTALL.md. Verify all three steps produce output and the brand identity is preserved.'
      }
    ]
  },
  'koubo-storyboard': {
    packageZh: 'SKILL.md、skill.yaml、INSTALL-MUSE.md、演示视频、ZIP 下载',
    packageEn: 'SKILL.md, skill.yaml, INSTALL-MUSE.md, demo video, ZIP download',
    agentsZh: `${AGENTS_GENERIC_ZH}包内 INSTALL-MUSE.md 专写 Muse 的安装路径（~/workspace/skills/custom/koubo-storyboard/ 或 Muse 设置里「自定义技能」上传入口）。`,
    agentsEn: `${AGENTS_GENERIC_EN} The package’s INSTALL-MUSE.md covers the Muse install path (~/workspace/skills/custom/koubo-storyboard/ or the “custom skills” upload in Muse settings).`,
    installZh: INSTALL_BASE_ZH,
    installEn: INSTALL_BASE_EN,
    faq: [
      {
        qZh: '这技能是干什么的？',
        qEn: 'What does this skill do?',
        aZh: '把资料堆砌改成「有人在跟你讲一件事」：素材事实条 → 口播剧本 → 分镜表 → 证据帧（截图+黄标+字幕）→ 视频/X Article/短帖同源分发。',
        aEn: 'It turns research dumps into “someone telling you a story”: fact lines → spoken script → storyboard → evidence frames (screenshot + highlight + subtitle) → one script for video, X Article, and short posts.'
      },
      {
        qZh: '支持哪些 Agent？',
        qEn: 'Which agents does it work with?',
        aZh: '通用 SKILL.md 文本，Claude Code、Codex、Cursor、Muse 都能用；Muse 用户按 INSTALL-MUSE.md 安装。',
        aEn: 'Plain SKILL.md text works with Claude Code, Codex, Cursor, and Muse. Muse users install per INSTALL-MUSE.md.'
      },
      {
        qZh: '怎么安装？',
        qEn: 'How do I install it?',
        aZh: '包只有 SKILL.md、skill.yaml、INSTALL-MUSE.md，点「复制技能」粘贴或下载 ZIP 都可；Muse 用户把整个目录拷到自定义 skills 下。验证：大声读不拗口，有第一人称或读者称呼，每帧有字幕句。',
        aEn: 'The package is only SKILL.md, skill.yaml, and INSTALL-MUSE.md — copy-paste or ZIP both work; Muse users copy the whole directory into custom skills. Verify it reads aloud smoothly, has first-person or audience address, and every frame has a subtitle line.'
      }
    ]
  }
}

/**
 * P0-2 前后对比实证区（仅自研三件）。
 * - zhishuo：4 例逐字取自技能原文 ~/workspace/custom-skills/zhishuo/SKILL.md「前后对比」一节；
 *   英文为本站翻译（与 skillDemos.ts 同一做法，原文为中文）。
 * - xu-qiu-fang-tan：2026-11-22 按技能三轮流程实际跑的一次访谈，访谈对象为本次详情页改造
 *   任务书（parent 任务原文）；三轮问题按技能流程提问，答案逐条取自任务书
 *   GOAL / SCOPE / ACCEPTANCE / FORBIDDEN / REPORT，未编造；推断项已标「待确认」；
 *   brief 全文尚未经 parent 亲口确认，待 parent 按 ACCEPTANCE 验收时确认。
 * - shi-tu-pei-wen：按技能五步流程制作的对比图（见同目录图片来源文件）。
 */
export const SKILL_BEFORE_AFTER: Record<string, SkillBeforeAfter> = {
  zhishuo: {
    titleZh: '实证：改前 vs 改后',
    titleEn: 'See it in action: before vs after',
    introZh: '4 例逐字取自技能原文「前后对比」一节，改前是 AI 常见写法，改后是按直说规则重写的结果。',
    introEn: 'Four examples taken verbatim from the skill’s own before/after section — the “before” is how AI usually writes, the “after” is the same answer rewritten to the Speak Directly rules.',
    items: [
      {
        labelZh: '例一：问能不能上线',
        labelEn: 'Example 1: can it ship?',
        beforeZh: '这个问题问得很好。方案本身有几个地方需要注意，首先是接口的兼容性，其次是配置的改动，最后是回滚的方案。整体来看，上线的风险是可控的，但还是要谨慎一些。',
        beforeEn: 'Great question. There are a few things to watch in this plan: first the API compatibility, then the config changes, and finally the rollback plan. Overall the launch risk looks manageable, but we should still be careful.',
        afterZh: '能上线。改两处：1. 接口版本号升到 2.3；2. 回滚脚本先跑一遍。改完直接发。',
        afterEn: 'Yes, it can ship. Two changes: 1. bump the API version to 2.3; 2. run the rollback script once first. Then ship.'
      },
      {
        labelZh: '例二：问快不快',
        labelEn: 'Example 2: is it fast?',
        beforeZh: '这个接口整体表现还是不错的，速度挺快的，基本能满足需求。',
        beforeEn: 'This API performs pretty well overall — it is quite fast and basically meets the requirements.',
        afterZh: '平均 120 毫秒，P95 是 340 毫秒。够用了。',
        afterEn: 'Average 120 ms, P95 is 340 ms. Good enough.'
      },
      {
        labelZh: '例三：报错',
        labelEn: 'Example 3: reporting an error',
        beforeZh: '哎呀，测试挂了，好像有点问题，我再看一下。',
        beforeEn: 'Oops, the tests failed — something seems off, let me take another look.',
        afterZh: '测试在第 42 行失败：期望 200，实际 401。原因：请求缺 Authorization 头。修法：加上 Bearer token 再跑。',
        afterEn: 'The test fails at line 42: expected 200, got 401. Cause: the request is missing the Authorization header. Fix: add the Bearer token and rerun.'
      },
      {
        labelZh: '例四：列得多',
        labelEn: 'Example 4: a long list',
        beforeZh: '这次要改 9 处：登录接口、注册接口、密码重置、验证码、短信模板、邮件模板、错误提示、日志格式、监控告警。',
        beforeEn: 'Nine changes this time: login API, signup API, password reset, captcha, SMS templates, email templates, error messages, log format, monitoring alerts.',
        afterZh: '先改前 5 个：1. 登录接口；2. 注册接口；3. 密码重置；4. 验证码；5. 短信模板。剩下 4 个（邮件模板、错误提示、日志格式、监控告警）不急，等你点头再动。',
        afterEn: 'Do the first 5 now: 1. login API; 2. signup API; 3. password reset; 4. captcha; 5. SMS templates. The other 4 (email templates, error messages, log format, monitoring alerts) can wait until you say go.'
      }
    ],
    noteZh: '来源：技能原文 ~/workspace/custom-skills/zhishuo/SKILL.md「前后对比」一节，逐字引用，未改一字；英文为本站翻译。',
    noteEn: 'Source: the skill’s own SKILL.md, “before/after” section, quoted verbatim; the English is this site’s translation.'
  },
  'xu-qiu-fang-tan': {
    titleZh: '实证：一次真实访谈产出的 brief',
    titleEn: 'See it in action: a brief from a real interview',
    introZh: '2026-11-22 按技能三轮流程实际跑的一次访谈：访谈对象是本次详情页改造任务书，问题按流程提问，答案取自任务书原文。',
    introEn: 'A real interview run on 2026-11-22 following the skill’s three rounds. The interviewee was this detail-page revamp brief itself; the questions follow the skill, and the answers come from the brief’s own text.',
    items: [
      {
        labelZh: '第一轮 · 目标与价值',
        labelEn: 'Round 1 · Goals and value',
        beforeZh: '一句话原请求：“改造 promangofund.com 全部技能详情页（P0-2、P0-3、P1-2、P1-4 详情页徽章）。”',
        beforeEn: 'The one-line request: “Revamp all skill detail pages on promangofund.com (P0-2, P0-3, P1-2, P1-4 detail-page badges).”',
        afterZh: 'GOAL：给技能商店的读者一次讲清每个技能——包里有什么、支持哪些 Agent、怎么装、有没有实证、来源是谁；做完的标志是改动清单、实证来源、覆盖统计三样齐全。（“读者是来挑技能的人”为访谈员推断，待确认。）',
        afterEn: 'GOAL: tell skill-store readers everything about each skill in one place — what is in the package, which agents it supports, how to install it, whether there is evidence it works, and where it comes from. Done means three things exist: a change list, evidence sources, and coverage stats. (“Readers are people picking a skill” is the interviewer’s inference, unconfirmed.)'
      },
      {
        labelZh: '第二轮 · 范围与验收',
        labelEn: 'Round 2 · Scope and acceptance',
        beforeZh: '原请求没说范围边界，也没说怎么做完才算成。',
        beforeEn: 'The original request stated no scope boundaries and no definition of done.',
        afterZh: 'SCOPE 做：P0-2 自研三件实证区；P0-3 信息头先上三件再铺其余 26 个；P1-2 FAQ 覆盖 29 个；P1-4 来源徽章只给 12 个已核实。不做：不改 SkillShowcase.vue、目录页、首页、组合包与文章正文，不改 .github/workflows/，不构建、不推送、不提交、不发消息。ACCEPTANCE：改动清单、实证来源、覆盖统计、中英文同步、跳过原因。VERIFY：parent 按 ACCEPTANCE 逐项验收。',
        afterEn: 'SCOPE — do: P0-2 evidence sections for the three in-house skills; P0-3 info headers for those three first, then the other 26; P1-2 FAQ for all 29; P1-4 source badges only for the 12 verified. Do not: touch SkillShowcase.vue, catalog pages, the homepage, bundles, article bodies, or .github/workflows/; no build, push, commit, or messages. ACCEPTANCE: change list, evidence sources, coverage stats, Chinese–English sync, reasons for anything skipped. VERIFY: the parent checks each acceptance item.'
      },
      {
        labelZh: '第三轮 · 约束与执行',
        labelEn: 'Round 3 · Constraints and execution',
        beforeZh: '原请求没提禁区、时间与汇报方式。',
        beforeEn: 'The original request said nothing about red lines, timing, or reporting.',
        afterZh: 'TIMEBOX：任务书未设截止时间，本轮会话内交付；时间不够先保 P0-2、P0-3（待确认）。FORBIDDEN：不编数字、不编实证、不编安装耗时。REPORT：最终报告给 parent：改动清单、完成/跳过状态、实证来源、覆盖统计。STANDING：详情页文案只写核实过的实情，来源未核实的不写。',
        afterEn: 'TIMEBOX: the brief sets no deadline; deliver within this session, and protect P0-2 and P0-3 first if time runs short (unconfirmed). FORBIDDEN: never invent numbers, evidence, or install times. REPORT: final report to the parent — change list, done/skipped status, evidence sources, coverage stats. STANDING: detail pages state only verified facts; unverified sources are not shown.'
      }
    ],
    noteZh: '访谈记录：2026-11-22，三轮问题按技能原文流程提问，答案逐条取自 parent 任务书 GOAL / SCOPE / ACCEPTANCE / FORBIDDEN / REPORT，未编造；“待确认”的两项（读者身份、时间不够先保 P0）为访谈员推断。brief 全文尚未经 parent 亲口确认，待验收时确认。',
    noteEn: 'Interview record: 2026-11-22. The three rounds follow the skill’s own flow; every answer comes from the parent brief’s GOAL / SCOPE / ACCEPTANCE / FORBIDDEN / REPORT — nothing invented. Two items are marked unconfirmed (reader identity, protect P0 first if short on time). The brief has not yet been confirmed aloud by the parent; confirmation happens at acceptance.'
  },
  'shi-tu-pei-wen': {
    titleZh: '实证：同一内容，纯文字 vs 实图配文',
    titleEn: 'See it in action: same content, plain text vs real photo caption',
    introZh: '同一标题与 3 条要点：上半部分是纯文字，下半部分是按技能五步流程出的实图配文卡。',
    introEn: 'The same title and three points: plain text on top, a real-photo caption card below, made with the skill’s five-step flow.',
    image: '/images/skills/shi-tu-pei-wen-before-after.png',
    imageAltZh: '对比图：上半部分是纯文字版的宁德时代文章标题与 3 条要点，下半部分是同一内容的实图配文卡，配汽车工厂机器人生产线实拍照片',
    imageAltEn: 'Comparison: the CATL article title and three points as plain text on top, and the same content as a real-photo caption card below, with a real photo of a car-factory robot line',
    imageCaptionZh: '标题逐字取自本站文章《宁德时代一天三封催款邮件？车企的钱到底卡在哪？》，3 条要点取自该文原文；配图为 Flickr CC-BY 2.0 汽车工厂实拍（作者 jurvetson）。',
    imageCaptionEn: 'The title is copied verbatim from this site’s CATL article and the three points come from its text; the photo is a Flickr CC-BY 2.0 shot of a car-factory robot line (by jurvetson).',
    noteZh: '制作：2026-11-22，按技能五步流程（定内容、找真图、选画板、排字渲图、睁眼验），下半部分卡片用技能自带 templates/template-cover.html + scripts/render.mjs（Playwright）渲染；图片来源见 shi-tu-pei-wen-before-after-SOURCES.md。',
    noteEn: 'Made 2026-11-22 with the skill’s five-step flow (set content, find a real photo, pick a board, render, verify by eye). The lower card was rendered with the skill’s own templates/template-cover.html + scripts/render.mjs (Playwright); photo source in shi-tu-pei-wen-before-after-SOURCES.md.'
  }
}
