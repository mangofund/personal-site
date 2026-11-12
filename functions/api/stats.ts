// 统计查询:GET /api/stats?from=YYYY-MM-DD&to=YYYY-MM-DD
// token 走 Authorization: Bearer 头（2026-11-05 安全审计 low 项修复，query 不再接受，
// 避免凭据进 URL 日志）；token 在 Cloudflare Pages 环境变量 STATS_TOKEN 里配置，
// 每日 cron（~/workspace/site-stats/daily-stats.mjs）用 Bearer 头拉数。
interface Env {
  STATS_KV?: KVNamespace
  STATS_TOKEN?: string
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

function parseDay(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s)
  if (!m) return null
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])))
  return Number.isNaN(d.getTime()) ? null : d
}

function fmtDay(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url)
  const expected = context.env.STATS_TOKEN || ''
  const auth = context.request.headers.get('authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  if (!expected || !constantTimeEqual(token, expected)) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: { 'content-type': 'application/json' }
    })
  }
  const kv = context.env.STATS_KV
  if (!kv) {
    return new Response(JSON.stringify({ error: 'not_configured' }), {
      status: 503,
      headers: { 'content-type': 'application/json' }
    })
  }
  const toParam = url.searchParams.get('to') || ''
  const fromParam = url.searchParams.get('from') || toParam
  const from = parseDay(fromParam)
  const to = parseDay(toParam) || from
  if (!from || !to) {
    return new Response(JSON.stringify({ error: 'bad_date' }), {
      status: 400,
      headers: { 'content-type': 'application/json' }
    })
  }
  // 最多 32 天,防止滥用
  const days: string[] = []
  const cur = new Date(from.getTime())
  while (cur.getTime() <= to.getTime() && days.length < 32) {
    days.push(fmtDay(cur))
    cur.setUTCDate(cur.getUTCDate() + 1)
  }
  const out: Record<string, unknown> = {}
  for (const d of days) {
    try {
      const raw = await kv.get(`stats:${d}`)
      out[d] = raw
        ? JSON.parse(raw)
        : { pv: 0, bookmark: 0, unbookmark: 0, useful: 0, paths: {} }
    } catch {
      out[d] = { pv: 0, bookmark: 0, unbookmark: 0, useful: 0, paths: {} }
    }
  }
  // 访客明细(留存计算用):&visitors=1 时附带全部访客记录的 {f:首访日,c:首触渠道,l:最近访问日}
  // 不含访客 ID;个人站量级下全量枚举足够(上限 1000 条,超出截断并标注)
  if (url.searchParams.get('visitors') === '1') {
    const visitors: Array<{ f: string; c: string; l: string }> = []
    try {
      let cursor: string | undefined
      for (let page = 0; page < 5 && visitors.length < 1000; page++) {
        const listed = await kv.list({ prefix: 'v:', cursor, limit: 200 })
        // 原先逐条 await kv.get：访客上千时串行耗时约 2 分钟，常撞 Cloudflare 524
        // （2026-11-12 早上日报轮即如此）。改为每批 25 个并发取，同一批结果
        // 仍按原顺序处理；总量上限 1000 条不变。
        const names = listed.keys.map((k) => k.name).slice(0, 1000 - visitors.length)
        for (let i = 0; i < names.length; i += 25) {
          const raws = await Promise.all(names.slice(i, i + 25).map((n) => kv.get(n)))
          for (const raw of raws) {
            if (!raw) continue
            try {
              const rec = JSON.parse(raw)
              if (rec && rec.f && rec.l) visitors.push({ f: rec.f, c: rec.c || 'direct', l: rec.l })
            } catch {
              /* 跳过坏记录 */
            }
          }
        }
        if (listed.list_complete) break
        cursor = listed.cursor
      }
    } catch {
      /* 访客枚举失败不影响日计数返回 */
    }
    out['visitors'] = visitors
    out['visitors_truncated'] = visitors.length >= 1000
  }
  return new Response(JSON.stringify(out), {
    headers: { 'content-type': 'application/json' }
  })
}

export const onRequestPost: PagesFunction = async () => {
  return new Response(null, { status: 405 })
}
