// 无人问津的校验、元数据拼简介、审核和点赞。
// 仓库里没有可直接调用的语言模型，也不读任何 API Key。
// 简介只拼接页面 title / description 和提交者的那句话，不另编卖点。
// 以后若接入模型，应在提交者确认前生成草稿，并继续把原文留给审核。

const PITCH_MIN = 4
const PITCH_MAX = 80
const TITLE_MAX = 80
const SUMMARY_MIN = 4
const SUMMARY_MAX = 280
const URL_MAX = 500
const BODY_MAX = 20000
const FETCH_MS = 6000
const FETCH_BYTES = 262144
const COOKIE = 'mf_unnoticed'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 400
const TOKEN_MIN = 16

const PREVIEW_PER_HOUR = 12
const SUBMIT_PER_HOUR = 4
const SUBMIT_PER_DAY = 8
const LIKE_PER_HOUR = 30
const REVIEW_PER_HOUR = 120
const REVIEW_FAIL_PER_HOUR = 20
const GLOBAL_PREVIEW_PER_HOUR = 300
const GLOBAL_SUBMIT_PER_HOUR = 80

export const LIST_LATEST_SQL = `SELECT id, title, summary, image_url, url, like_count, created_at
  FROM works
  WHERE status = 'approved'
  ORDER BY created_at DESC, id DESC
  LIMIT 48`

// 缘分作品：在已审核作品里随机抽，不按点赞排序，避免曝光一直停在少数热门上。
export const LIST_CHANCE_SQL = `SELECT id, title, summary, image_url, url, like_count, created_at
  FROM works
  WHERE status = 'approved'
  ORDER BY RANDOM()
  LIMIT 24`

const TRACKING_KEYS = new Set([
  'fbclid', 'gclid', 'gbraid', 'wbraid', 'dclid', 'gclsrc',
  'mc_cid', 'mc_eid', 'igshid', 'igsh', 'yclid', 'msclkid',
  'twclid', 'ttclid', '_ga', '_gl', 'gad_source', 'gad_campaignid',
  'srsltid', 'si', 'spm', 'scm', 'ref', 'referrer',
  'fb_action_ids', 'fb_action_types', 'fb_source', 'oly_anon_id',
  'oly_enc_id', 'vero_id', '_hsenc', '_hsmi', 'mc_tc', 'mkt_tok'
])

const NAMED_ENTITIES = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' '
}

export function clipText(text, max) {
  const chars = [...text]
  if (chars.length <= max) return text
  if (max < 1) return ''
  return chars.slice(0, max - 1).join('') + '…'
}

export function plainText(input) {
  if (typeof input !== 'string') return ''
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function charCount(text) {
  return [...text].length
}

export function decodeEntities(value) {
  return String(value).replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (all, ent) => {
    const named = NAMED_ENTITIES[ent.toLowerCase()]
    if (named) return named
    if (ent[0] !== '#') return all
    const hex = ent[1] === 'x' || ent[1] === 'X'
    const code = Number.parseInt(ent.slice(hex ? 2 : 1), hex ? 16 : 10)
    if (!Number.isFinite(code) || code <= 0 || code > 0x10ffff) return all
    try {
      return String.fromCodePoint(code)
    } catch {
      return all
    }
  })
}

function collapse(value) {
  return decodeEntities(value).replace(/\s+/g, ' ').trim()
}

function isDottedNumeric(host) {
  const parts = host.split('.')
  if (parts.length < 2) return false
  return parts.every((part) => /^\d+$/.test(part) || /^0x[0-9a-f]+$/i.test(part))
}

function isBlockedHost(host) {
  if (
    host === 'localhost' ||
    host.endsWith('.localhost') ||
    host.endsWith('.local') ||
    host.endsWith('.internal') ||
    host.endsWith('.localdomain') ||
    host.endsWith('.intranet') ||
    host.endsWith('.lan') ||
    host === 'metadata.google.internal' ||
    host === 'metadata.internal'
  ) {
    return true
  }
  if (host.includes(':')) return true
  if (/^\d+$/.test(host) || /^0x[0-9a-f]+$/i.test(host)) return true
  if (isDottedNumeric(host)) return true
  if (!host.includes('.')) return true
  return false
}

export function normalizePublicUrl(input) {
  if (typeof input !== 'string') return null
  const raw = input.trim()
  if (!raw || raw.length > URL_MAX) return null
  let url
  try {
    url = new URL(raw)
  } catch {
    return null
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
  if (url.username || url.password) return null
  if (url.port) return null
  const host = url.hostname.toLowerCase().replace(/\.$/, '')
  if (!host || host.length > 253 || isBlockedHost(host)) return null
  url.hostname = host
  url.hash = ''
  if (url.pathname.length > 1) url.pathname = url.pathname.replace(/\/+$/, '')
  for (const key of [...url.searchParams.keys()]) {
    const lower = key.toLowerCase()
    if (lower.startsWith('utm_') || TRACKING_KEYS.has(lower)) url.searchParams.delete(key)
  }
  if (url.href.length > URL_MAX) return null
  return url
}

function metaContent(html, key) {
  const headEnd = html.toLowerCase().indexOf('</head>')
  const scope = headEnd >= 0 ? html.slice(0, headEnd + 7) : html.slice(0, 100000)
  const wanted = key.toLowerCase()
  for (const tag of scope.match(/<meta\b[^>]*>/gi) || []) {
    const attrs = {}
    for (const match of tag.matchAll(/([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g)) {
      attrs[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? ''
    }
    const name = (attrs.property || attrs.name || attrs.itemprop || '').toLowerCase()
    if (name === wanted && attrs.content) return attrs.content
  }
  return ''
}

export function extractMeta(html, pageUrl) {
  const rawTitle = metaContent(html, 'og:title') || metaContent(html, 'twitter:title')
  const titleTag = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  const title = collapse(rawTitle || (titleTag ? titleTag[1] : ''))
  const description = collapse(
    metaContent(html, 'og:description') ||
      metaContent(html, 'description') ||
      metaContent(html, 'twitter:description')
  )
  const imageRaw =
    metaContent(html, 'og:image') ||
    metaContent(html, 'og:image:secure_url') ||
    metaContent(html, 'twitter:image')
  let image = ''
  if (imageRaw) {
    try {
      const abs = new URL(imageRaw, pageUrl)
      const normalized = normalizePublicUrl(abs.href)
      if (normalized && normalized.protocol === 'https:') image = normalized.href
    } catch {
      image = ''
    }
  }
  return { title, description, image }
}

export function buildDraft({ title, description, pitch, host, lang }) {
  const pageTitle = collapse(title || '')
  let desc = collapse(description || '')
  const cleanPitch = plainText(pitch)
  const usedTitle = Boolean(pageTitle)
  const heading = clipText(pageTitle || host.replace(/^www\./i, ''), TITLE_MAX)
  if (desc && (desc === pageTitle || desc === heading || desc === cleanPitch)) desc = ''
  desc = clipText(desc, 160)
  const said = lang === 'en' ? `Submitter: ${cleanPitch}` : `提交者说：${cleanPitch}`
  return {
    title: heading,
    summary: clipText(desc ? `${desc} ${said}` : said, SUMMARY_MAX),
    usedTitle,
    usedDescription: Boolean(desc)
  }
}

async function readHead(res) {
  const reader = res.body?.getReader()
  if (!reader) return ''
  const decoder = new TextDecoder()
  let size = 0
  let text = ''
  try {
    while (size < FETCH_BYTES) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      text += decoder.decode(value, { stream: true })
      if (text.toLowerCase().includes('</head>')) break
    }
  } finally {
    try {
      await reader.cancel()
    } catch {
      /* 连接已结束 */
    }
  }
  text += decoder.decode()
  return text
}

export async function defaultFetchPage(target, fetchImpl = globalThis.fetch) {
  let current = typeof target === 'string' ? normalizePublicUrl(target) : target
  if (!current) return { ok: false, reason: 'invalid_url' }
  for (let hop = 0; hop < 4; hop++) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), FETCH_MS)
    let res
    try {
      res = await fetchImpl(current.href, {
        method: 'GET',
        redirect: 'manual',
        signal: controller.signal,
        headers: {
          accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.1',
          'user-agent': 'MangoFundUnnoticed/1.0 (+https://promangofund.com/unnoticed/)'
        }
      })
    } catch {
      return { ok: false, reason: 'fetch_failed', url: current.href }
    } finally {
      clearTimeout(timer)
    }
    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get('location')
      try {
        await res.body?.cancel()
      } catch {
        /* 忽略 */
      }
      if (!location || hop === 3) return { ok: false, reason: 'fetch_failed', url: current.href }
      let next
      try {
        next = normalizePublicUrl(new URL(location, current).href)
      } catch {
        next = null
      }
      if (!next) return { ok: false, reason: 'invalid_url' }
      current = next
      continue
    }
    if (!res.ok) {
      try {
        await res.body?.cancel()
      } catch {
        /* 忽略 */
      }
      return { ok: false, reason: 'fetch_failed', url: current.href }
    }
    const type = (res.headers.get('content-type') || '').toLowerCase()
    if (!type.includes('text/html') && !type.includes('application/xhtml')) {
      try {
        await res.body?.cancel()
      } catch {
        /* 忽略 */
      }
      return { ok: true, url: current.href, html: '', contentType: type }
    }
    const html = await readHead(res)
    return { ok: true, url: current.href, html, contentType: type }
  }
  return { ok: false, reason: 'fetch_failed', url: current.href }
}

export function shanghaiParts(date = new Date()) {
  const bag = {}
  for (const part of new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(date)) {
    bag[part.type] = part.value
  }
  const hour = bag.hour === '24' ? '00' : bag.hour
  return { day: `${bag.year}-${bag.month}-${bag.day}`, hour }
}

export async function clientKey(request) {
  const ip =
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`unnoticed-v1:${ip}`))
  return [...new Uint8Array(digest)].slice(0, 8).map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function allow(db, slots, now) {
  await db.prepare('DELETE FROM rate_buckets WHERE reset_at < ?').bind(now).run()
  for (const slot of slots) {
    await db
      .prepare(
        `INSERT INTO rate_buckets (bucket, hits, reset_at) VALUES (?, 1, ?)
         ON CONFLICT(bucket) DO UPDATE SET hits = hits + 1`
      )
      .bind(slot.bucket, slot.resetAt)
      .run()
    const row = await db.prepare('SELECT hits FROM rate_buckets WHERE bucket = ?').bind(slot.bucket).first()
    if (!row || Number(row.hits) > slot.limit) return false
  }
  return true
}

function hourSlots(prefix, key, limit, globalLimit, now, parts) {
  const resetAt = now + 2 * 60 * 60 * 1000
  return [
    { bucket: `${prefix}:${key}:${parts.day}:${parts.hour}`, limit, resetAt },
    { bucket: `${prefix}:all:${parts.day}:${parts.hour}`, limit: globalLimit, resetAt }
  ]
}

export async function tokenMatches(given, expected) {
  if (typeof expected !== 'string' || charCount(expected) < TOKEN_MIN) return false
  const provided = typeof given === 'string' ? given.slice(0, 512) : ''
  const encoder = new TextEncoder()
  const [providedHash, expectedHash] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(provided)),
    crypto.subtle.digest('SHA-256', encoder.encode(expected))
  ])
  const left = new Uint8Array(providedHash)
  const right = new Uint8Array(expectedHash)
  if (typeof crypto.subtle.timingSafeEqual === 'function') {
    return crypto.subtle.timingSafeEqual(left, right)
  }
  let diff = 0
  for (let i = 0; i < left.length; i++) diff |= left[i] ^ right[i]
  return diff === 0
}

function json(data, status = 200, headers) {
  const out = new Headers(headers)
  out.set('content-type', 'application/json; charset=utf-8')
  out.set('cache-control', 'no-store')
  return new Response(JSON.stringify(data), { status, headers: out })
}

function fail(error, status) {
  return json({ ok: false, error }, status)
}

function storageError() {
  console.error(JSON.stringify({ source: 'unnoticed', error: 'storage_error' }))
  return fail('storage_error', 500)
}

function databaseOf(context) {
  return context.env?.UNNOTICED_DB || null
}

function nowOf(context) {
  return typeof context.now === 'number' ? context.now : Date.now()
}

function fetchPageOf(context) {
  return context.fetchPage || defaultFetchPage
}

async function readBody(request) {
  const declared = Number(request.headers.get('content-length') || 0)
  if (Number.isFinite(declared) && declared > BODY_MAX) return { error: 'payload_too_large' }
  let text = ''
  try {
    text = await request.text()
  } catch {
    return { error: 'invalid_json' }
  }
  if (text.length > BODY_MAX) return { error: 'payload_too_large' }
  try {
    const body = JSON.parse(text)
    if (!body || typeof body !== 'object' || Array.isArray(body)) return { error: 'invalid_request' }
    return { body }
  } catch {
    return { error: 'invalid_json' }
  }
}

function honeypot(body) {
  return Boolean(body.mf_company)
}

function readCookie(request, name) {
  const raw = request.headers.get('cookie') || ''
  for (const part of raw.split(';')) {
    const [key, ...rest] = part.trim().split('=')
    if (key === name) return decodeURIComponent(rest.join('='))
  }
  return ''
}

function visitorFrom(request) {
  const current = readCookie(request, COOKIE)
  if (/^[a-f0-9]{32}$/.test(current)) return { id: current, fresh: false }
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  const id = [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('')
  return { id, fresh: true }
}

function visitorCookie(id, request) {
  const secure = new URL(request.url).protocol === 'https:'
  const parts = [`${COOKIE}=${id}`, 'Path=/', `Max-Age=${COOKIE_MAX_AGE}`, 'HttpOnly', 'SameSite=Lax']
  if (secure) parts.push('Secure')
  return parts.join('; ')
}

function withVisitor(data, status, request, visitor) {
  const headers = new Headers()
  if (visitor?.fresh) headers.append('set-cookie', visitorCookie(visitor.id, request))
  return json(data, status, headers)
}

function bearer(request) {
  const header = request.headers.get('authorization') || ''
  const match = header.match(/^Bearer\s+(\S.*)$/i)
  if (match) return match[1].trim()
  return (request.headers.get('x-review-token') || '').trim()
}

function isUuid(value) {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
}

async function pageFacts(context, href) {
  try {
    return await fetchPageOf(context)(href)
  } catch {
    return { ok: false, reason: 'fetch_failed', url: href }
  }
}

function draftFrom(fetched, pitch, lang, fallbackHost) {
  const meta = fetched.ok && fetched.html ? extractMeta(fetched.html, fetched.url || `https://${fallbackHost}/`) : { title: '', description: '', image: '' }
  const draft = buildDraft({
    title: meta.title,
    description: meta.description,
    pitch,
    host: fallbackHost,
    lang
  })
  return {
    ...draft,
    image: meta.image || null,
    fetched: Boolean(fetched.ok && fetched.html)
  }
}

function changesOf(result) {
  return Number(result?.meta?.changes ?? 0)
}

async function openWork(db, url) {
  return db
    .prepare(`SELECT id, status FROM works WHERE url = ? AND status IN ('pending', 'approved') LIMIT 1`)
    .bind(url)
    .first()
}

export async function onPreview(context) {
  try {
    const db = databaseOf(context)
    if (!db) return fail('storage_unconfigured', 503)
    const parsed = await readBody(context.request)
    if (parsed.error) return fail(parsed.error, parsed.error === 'payload_too_large' ? 413 : 400)
    if (honeypot(parsed.body)) return fail('invalid_request', 400)
    const pitch = plainText(parsed.body.pitch)
    const pitchLength = charCount(pitch)
    if (pitchLength < PITCH_MIN || pitchLength > PITCH_MAX) return fail('invalid_pitch', 400)
    const url = normalizePublicUrl(parsed.body.url)
    if (!url) return fail('invalid_url', 400)
    const lang = parsed.body.lang === 'en' ? 'en' : 'zh'
    const now = nowOf(context)
    const parts = shanghaiParts(new Date(now))
    const key = await clientKey(context.request)
    const allowed = await allow(db, hourSlots('preview', key, PREVIEW_PER_HOUR, GLOBAL_PREVIEW_PER_HOUR, now, parts), now)
    if (!allowed) return fail('rate_limited', 429)
    const fetched = await pageFacts(context, url.href)
    if (fetched.reason === 'invalid_url') return fail('invalid_url', 400)
    const draft = draftFrom(fetched, pitch, lang, url.hostname)
    return json({
      ok: true,
      url: fetched.url && normalizePublicUrl(fetched.url) ? fetched.url : url.href,
      title: draft.title,
      summary: draft.summary,
      image: draft.image,
      fetched: draft.fetched,
      usedTitle: draft.usedTitle,
      usedDescription: draft.usedDescription
    })
  } catch {
    return storageError()
  }
}

export async function onSubmit(context) {
  try {
    const db = databaseOf(context)
    if (!db) return fail('storage_unconfigured', 503)
    const parsed = await readBody(context.request)
    if (parsed.error) return fail(parsed.error, parsed.error === 'payload_too_large' ? 413 : 400)
    if (honeypot(parsed.body)) return fail('invalid_request', 400)
    const pitch = plainText(parsed.body.pitch)
    const title = plainText(parsed.body.title)
    const summary = plainText(parsed.body.summary)
    if (charCount(pitch) < PITCH_MIN || charCount(pitch) > PITCH_MAX) return fail('invalid_pitch', 400)
    if (charCount(title) < 1 || charCount(title) > TITLE_MAX) return fail('invalid_title', 400)
    if (charCount(summary) < SUMMARY_MIN || charCount(summary) > SUMMARY_MAX) return fail('invalid_summary', 400)
    const url = normalizePublicUrl(parsed.body.url)
    if (!url) return fail('invalid_url', 400)
    const existing = await openWork(db, url.href)
    if (existing) return fail('duplicate_url', 409)
    const now = nowOf(context)
    const parts = shanghaiParts(new Date(now))
    const key = await clientKey(context.request)
    const allowed = await allow(
      db,
      [
        ...hourSlots('submit', key, SUBMIT_PER_HOUR, GLOBAL_SUBMIT_PER_HOUR, now, parts),
        { bucket: `submitday:${key}:${parts.day}`, limit: SUBMIT_PER_DAY, resetAt: now + 36 * 60 * 60 * 1000 }
      ],
      now
    )
    if (!allowed) return fail('rate_limited', 429)
    const fetched = await pageFacts(context, url.href)
    if (fetched.reason === 'invalid_url') return fail('invalid_url', 400)
    const meta = fetched.ok && fetched.html ? extractMeta(fetched.html, fetched.url || url.href) : { image: '' }
    const image = meta.image || null
    const id = crypto.randomUUID()
    try {
      await db
        .prepare(
          `INSERT INTO works (id, url, pitch, title, summary, image_url, status, like_count, created_at, reviewed_at)
           VALUES (?, ?, ?, ?, ?, ?, 'pending', 0, ?, NULL)`
        )
        .bind(id, url.href, pitch, title, summary, image, now)
        .run()
    } catch (error) {
      const message = String(error?.message || error)
      if (message.includes('UNIQUE') || message.toLowerCase().includes('constraint')) return fail('duplicate_url', 409)
      throw error
    }
    return json({ ok: true, id, status: 'pending' })
  } catch {
    return storageError()
  }
}

function presentWork(row) {
  const url = normalizePublicUrl(row.url)
  if (!url) return null
  let image = null
  if (row.image_url) {
    const parsed = normalizePublicUrl(row.image_url)
    if (parsed && parsed.protocol === 'https:') image = parsed.href
  }
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    image,
    url: url.href,
    likes: Number(row.like_count) || 0,
    createdAt: Number(row.created_at)
  }
}

export async function onWorks(context) {
  try {
    const db = databaseOf(context)
    if (!db) return fail('storage_unconfigured', 503)
    const sort = new URL(context.request.url).searchParams.get('sort') === 'chance' ? 'chance' : 'latest'
    const visitor = visitorFrom(context.request)
    const listed = await db.prepare(sort === 'chance' ? LIST_CHANCE_SQL : LIST_LATEST_SQL).all()
    const works = []
    for (const row of listed.results || []) {
      const work = presentWork(row)
      if (work) works.push(work)
    }
    let liked = []
    if (works.length) {
      const marks = works.map(() => '?').join(', ')
      const rows = await db
        .prepare(`SELECT work_id FROM work_likes WHERE visitor_id = ? AND work_id IN (${marks})`)
        .bind(visitor.id, ...works.map((work) => work.id))
        .all()
      liked = (rows.results || []).map((row) => row.work_id)
    }
    return withVisitor({ ok: true, sort, works, liked }, 200, context.request, visitor)
  } catch {
    return storageError()
  }
}

export async function onLike(context) {
  try {
    const db = databaseOf(context)
    if (!db) return fail('storage_unconfigured', 503)
    const parsed = await readBody(context.request)
    if (parsed.error) return fail(parsed.error, parsed.error === 'payload_too_large' ? 413 : 400)
    if (honeypot(parsed.body)) return fail('invalid_request', 400)
    if (!isUuid(parsed.body.id)) return fail('not_found', 404)
    const now = nowOf(context)
    const parts = shanghaiParts(new Date(now))
    const key = await clientKey(context.request)
    const allowed = await allow(db, hourSlots('like', key, LIKE_PER_HOUR, 4000, now, parts), now)
    if (!allowed) return fail('rate_limited', 429)
    const visitor = visitorFrom(context.request)
    const work = await db
      .prepare(`SELECT id FROM works WHERE id = ? AND status = 'approved'`)
      .bind(parsed.body.id)
      .first()
    if (!work) return withVisitor({ ok: false, error: 'not_found' }, 404, context.request, visitor)
    const existing = await db
      .prepare('SELECT 1 AS ok FROM work_likes WHERE work_id = ? AND visitor_id = ?')
      .bind(parsed.body.id, visitor.id)
      .first()
    if (existing) {
      await db.batch([
        db.prepare('DELETE FROM work_likes WHERE work_id = ? AND visitor_id = ?').bind(parsed.body.id, visitor.id),
        db.prepare('UPDATE works SET like_count = MAX(like_count - 1, 0) WHERE id = ?').bind(parsed.body.id)
      ])
    } else {
      const inserted = await db
        .prepare('INSERT OR IGNORE INTO work_likes (work_id, visitor_id, created_at) VALUES (?, ?, ?)')
        .bind(parsed.body.id, visitor.id, now)
        .run()
      if (changesOf(inserted) === 1) {
        await db.prepare('UPDATE works SET like_count = like_count + 1 WHERE id = ?').bind(parsed.body.id).run()
      }
    }
    const row = await db.prepare('SELECT like_count FROM works WHERE id = ?').bind(parsed.body.id).first()
    return withVisitor(
      { ok: true, liked: !existing, likes: Number(row?.like_count) || 0 },
      200,
      context.request,
      visitor
    )
  } catch {
    return storageError()
  }
}

async function requireReviewer(context) {
  const expected = context.env?.UNNOTICED_REVIEW_TOKEN
  if (typeof expected !== 'string' || charCount(expected.trim()) < TOKEN_MIN) return fail('review_unconfigured', 503)
  const ok = await tokenMatches(bearer(context.request), expected.trim())
  if (!ok) return fail('unauthorized', 401)
  return null
}

async function gateReview(context) {
  const db = databaseOf(context)
  if (!db) return { error: fail('storage_unconfigured', 503) }
  const denied = await requireReviewer(context)
  const now = nowOf(context)
  const parts = shanghaiParts(new Date(now))
  const key = await clientKey(context.request)
  if (denied) {
    const allowed = await allow(
      db,
      [{ bucket: `reviewfail:${key}:${parts.day}:${parts.hour}`, limit: REVIEW_FAIL_PER_HOUR, resetAt: now + 2 * 60 * 60 * 1000 }],
      now
    )
    if (!allowed) return { error: fail('rate_limited', 429) }
    return { error: denied }
  }
  const allowed = await allow(db, hourSlots('review', key, REVIEW_PER_HOUR, 600, now, parts), now)
  if (!allowed) return { error: fail('rate_limited', 429) }
  return { db, now }
}

export async function onReviewGet(context) {
  try {
    const gate = await gateReview(context)
    if (gate.error) return gate.error
    const { db } = gate
    const listed = await db
      .prepare(
        `SELECT id, url, pitch, title, summary, image_url, created_at
         FROM works
         WHERE status = 'pending'
         ORDER BY created_at ASC, id ASC
         LIMIT 100`
      )
      .all()
    const works = (listed.results || []).map((row) => ({
      id: row.id,
      url: row.url,
      pitch: row.pitch,
      title: row.title,
      summary: row.summary,
      image: row.image_url || null,
      createdAt: Number(row.created_at)
    }))
    return json({ ok: true, works })
  } catch {
    return storageError()
  }
}

export async function onReviewPost(context) {
  try {
    const gate = await gateReview(context)
    if (gate.error) return gate.error
    const parsed = await readBody(context.request)
    if (parsed.error) return fail(parsed.error, parsed.error === 'payload_too_large' ? 413 : 400)
    const action = parsed.body.action === 'approve' ? 'approved' : parsed.body.action === 'reject' ? 'rejected' : ''
    if (!action || !isUuid(parsed.body.id)) return fail('invalid_request', 400)
    const { db, now } = gate
    const result = await db
      .prepare(`UPDATE works SET status = ?, reviewed_at = ? WHERE id = ? AND status = 'pending'`)
      .bind(action, now, parsed.body.id)
      .run()
    if (changesOf(result) !== 1) return fail('not_found', 404)
    return json({ ok: true, status: action })
  } catch {
    return storageError()
  }
}
