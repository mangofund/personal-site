import catalog from './data/enterprise-mcp.json'
import skillRows from './data/skill-ticker.json'
import { siteProjects } from './siteProjects'

/** 与页头内联脚本、sessionStorage 使用同一把钥匙。 */
export const TICKER_DISMISS_KEY = 'mangofund:ticker-dismissed'

/**
 * 企业 logo 里多数是横版字标，收进 20px 圆标会糊掉。
 * 只留接近方形、缩小后仍能认出的图标。
 */
const SQUARE_LOGO_IDS = new Set(['alipay', 'dingtalk', 'feishu', 'mcd', 'yuque'])

const META = {
  skill: { zh: '技能', en: 'Skill' },
  project: { zh: '项目', en: 'Project' },
  mcp: { zh: 'MCP', en: 'MCP' }
} as const

export interface TickerItem {
  id: string
  name: string
  meta: string
  pitch: string
  path: string
  logo?: string
}

interface SkillTickerRow {
  id: string
  nameZh: string
  nameEn: string
  pitchZh: string
  pitchEn: string
  detailSlug: string
}

interface EnterpriseRow {
  id: string
  nameZh: string
  nameEn: string
  pitchZh: string
  pitchEn: string
  status: string
  logo: string
}

function localePath(path: string, english: boolean): string {
  if (!english) return path
  if (path === '/en' || path.startsWith('/en/')) return path
  return `/en${path.startsWith('/') ? path : `/${path}`}`
}

function interleave<T>(columns: readonly (readonly T[])[]): T[] {
  const merged: T[] = []
  const length = Math.max(0, ...columns.map((column) => column.length))
  for (let index = 0; index < length; index += 1) {
    for (const column of columns) {
      const item = column[index]
      if (item) merged.push(item)
    }
  }
  return merged
}

/** 技能、项目、企业 MCP 交错。敬请期待的 MCP 不进滚动条。 */
export function tickerItems(english: boolean): TickerItem[] {
  const meta = (kind: keyof typeof META) => (english ? META[kind].en : META[kind].zh)
  const skills: TickerItem[] = (skillRows as SkillTickerRow[]).map((row) => ({
    id: `skill-${row.id}`,
    name: english ? row.nameEn : row.nameZh,
    meta: meta('skill'),
    pitch: english ? row.pitchEn : row.pitchZh,
    path: localePath(`/${row.detailSlug}`, english)
  }))
  const projects: TickerItem[] = siteProjects.map((project) => ({
    id: `project-${project.id}`,
    name: english ? project.nameEn : project.nameZh,
    meta: meta('project'),
    pitch: english ? project.pitchEn : project.pitchZh,
    path: localePath(project.path, english)
  }))
  const enterprises = (catalog.enterprises as EnterpriseRow[]).filter((entry) => entry.status !== 'coming')
  const mcps: TickerItem[] = enterprises.map((entry) => ({
    id: `mcp-${entry.id}`,
    name: english ? entry.nameEn : entry.nameZh,
    meta: meta('mcp'),
    pitch: english ? entry.pitchEn : entry.pitchZh,
    path: localePath(`/enterprise-mcp/#${entry.id}`, english),
    logo: SQUARE_LOGO_IDS.has(entry.id) ? entry.logo : undefined
  }))
  return interleave([skills, projects, mcps])
}
