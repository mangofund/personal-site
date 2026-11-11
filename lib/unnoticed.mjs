// 无人问津的校验、元数据拼简介和点赞。
// 仓库里没有可直接调用的语言模型，也不读任何 API Key。
// 简介只拼接页面 title / description 和提交者的那句话，不另编卖点。
// 提交者确认后的新作品写入 approved，马上进入公开列表。
// 已经是 pending 的旧行不在这里改状态；审核页仍只处理那些行。

const PITCH_MIN = 4
const PITCH_MAX = 80
const TITLE_MAX = 80
const SUMMARY_MIN = 4
const SUMMARY_MAX = 280
const URL_MAX = 500
const BODY_MAX = 20000
const THUMB_MAX = 262144
const IMAGE_BODY_MAX = 300000
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
const RATE_PER_HOUR = 30
const COMMENT_PER_HOUR = 10
const GLOBAL_RATE_PER_HOUR = 1000
const GLOBAL_COMMENT_PER_HOUR = 200
const COMMENT_MIN = 4
const COMMENT_MAX = 500
const AUTHOR_MAX = 20
const COMMENTS_LIMIT = 100

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
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
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

function ipv4ToInt(ip) {
  const parts = ip.split('.')
  if (parts.length !== 4) return null
  const nums = []
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) return null
    const value = Number(part)
    if (value > 255) return null
    nums.push(value)
  }
  return (((nums[0] << 24) | (nums[1] << 16) | (nums[2] << 8) | nums[3]) >>> 0)
}

function ipv4Prefix(value, bits) {
  const mask = bits >= 32 ? 0xffffffff : ((0xffffffff << (32 - bits)) >>> 0)
  return ((value >>> 0) & mask) >>> 0
}

function isNonPublicV4(ip) {
  const value = ipv4ToInt(ip)
  if (value == null) return true
  const inside = (text, bits) => ipv4Prefix(value, bits) === ipv4Prefix(ipv4ToInt(text), bits)
  if (inside('0.0.0.0', 8)) return true
  if (inside('10.0.0.0', 8)) return true
  if (inside('100.64.0.0', 10)) return true
  if (inside('127.0.0.0', 8)) return true
  if (inside('169.254.0.0', 16)) return true
  if (inside('172.16.0.0', 12)) return true
  if (inside('192.0.0.0', 24)) return true
  if (inside('192.0.2.0', 24)) return true
  if (inside('192.88.99.0', 24)) return true
  if (inside('192.168.0.0', 16)) return true
  if (inside('198.18.0.0', 15)) return true
  if (inside('198.51.100.0', 24)) return true
  if (inside('203.0.113.0', 24)) return true
  if (inside('224.0.0.0', 4)) return true
  if (inside('240.0.0.0', 4)) return true
  return false
}

function parseIpv6(input) {
  let text = input.toLowerCase().replace(/^\[|\]$/g, '')
  if (!text || text.includes('%')) return null
  const dotted = text.match(/(?:^|:)(\d{1,3}(?:\.\d{1,3}){3})$/)
  if (dotted) {
    const value = ipv4ToInt(dotted[1])
    if (value == null) return null
    const hi = (value >>> 16).toString(16)
    const lo = (value & 0xffff).toString(16)
    text = text.slice(0, text.length - dotted[1].length) + `${hi}:${lo}`
  }
  const halves = text.split('::')
  if (halves.length > 2) return null
  const head = halves[0] ? halves[0].split(':') : []
  const tail = halves.length === 2 && halves[1] ? halves[1].split(':') : []
  if (halves.length === 1 && head.length !== 8) return null
  const missing = 8 - head.length - tail.length
  if (halves.length === 2 && missing < 1 && !(halves[0] === '' && halves[1] === '' && missing === 8)) {
    if (missing < 0) return null
  }
  if (missing < 0) return null
  const groups = halves.length === 1 ? head : [...head, ...Array(missing).fill('0'), ...tail]
  if (groups.length !== 8) return null
  const bytes = []
  for (const group of groups) {
    if (!/^[0-9a-f]{1,4}$/.test(group)) return null
    const value = Number.parseInt(group, 16)
    bytes.push((value >> 8) & 255, value & 255)
  }
  return bytes
}

function isNonPublicV6(bytes) {
  if (bytes.slice(0, 15).every((byte) => byte === 0) && (bytes[15] === 0 || bytes[15] === 1)) return true
  if (bytes.slice(0, 10).every((byte) => byte === 0) && bytes[10] === 0xff && bytes[11] === 0xff) {
    return isNonPublicV4(`${bytes[12]}.${bytes[13]}.${bytes[14]}.${bytes[15]}`)
  }
  if (bytes.slice(0, 12).every((byte) => byte === 0)) {
    return isNonPublicV4(`${bytes[12]}.${bytes[13]}.${bytes[14]}.${bytes[15]}`)
  }
  const first = bytes[0]
  if ((first & 0xfe) === 0xfc) return true
  if (first === 0xfe && (bytes[1] & 0xc0) === 0x80) return true
  if (first === 0xfe && (bytes[1] & 0xc0) === 0xc0) return true
  if (first === 0xff) return true
  if (bytes[0] === 0x20 && bytes[1] === 0x01 && bytes[2] === 0x0d && bytes[3] === 0xb8) return true
  if (bytes[0] === 0x20 && bytes[1] === 0x01 && bytes[2] === 0x00 && bytes[3] === 0x00) return true
  if (bytes[0] === 0x20 && bytes[1] === 0x02) return true
  if (
    bytes[0] === 0x00 &&
    bytes[1] === 0x64 &&
    bytes[2] === 0xff &&
    bytes[3] === 0x9b &&
    bytes.slice(4, 12).every((byte) => byte === 0)
  ) {
    return true
  }
  if (first === 0x01 && bytes[1] === 0x00 && bytes.slice(2, 8).every((byte) => byte === 0)) return true
  return false
}

export function isNonPublicAddress(input) {
  if (typeof input !== 'string') return true
  const text = input.trim().toLowerCase().replace(/^\[|\]$/g, '')
  if (!text) return true
  if (text.includes(':')) {
    const bytes = parseIpv6(text)
    return !bytes || isNonPublicV6(bytes)
  }
  return isNonPublicV4(text)
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
  const pageTitle = plainText(collapse(title || ''))
  let desc = plainText(collapse(description || ''))
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

async function readHead(res, byteLimit) {
  const reader = res.body?.getReader()
  if (!reader) return ''
  const decoder = new TextDecoder()
  let size = 0
  let text = ''
  try {
    while (size < byteLimit) {
      const { done, value } = await reader.read()
      if (done) break
      const room = byteLimit - size
      const chunk = value.byteLength > room ? value.subarray(0, room) : value
      size += chunk.byteLength
      text += decoder.decode(chunk, { stream: true })
      if (value.byteLength > room || text.toLowerCase().includes('</head>')) break
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

async function cancelBody(res) {
  try {
    await res.body?.cancel()
  } catch {
    /* 忽略 */
  }
}

export async function resolveHost(hostname, fetchImpl = globalThis.fetch) {
  if (typeof hostname !== 'string' || !hostname || isBlockedHost(hostname)) {
    return { ok: false, reason: 'blocked_host' }
  }
  const addresses = []
  for (const type of ['A', 'AAAA']) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 3000)
    try {
      const response = await fetchImpl(
        `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(hostname)}&type=${type}`,
        { headers: { accept: 'application/dns-json' }, signal: controller.signal, redirect: 'manual' }
      )
      if (response.status >= 300 && response.status < 400) {
        await cancelBody(response)
        return { ok: false, reason: 'dns_failed' }
      }
      if (!response.ok) return { ok: false, reason: 'dns_failed' }
      const data = await response.json()
      if (data.Status !== 0 && !(data.Answer || []).some((item) => item.type === 1 || item.type === 28)) {
        return { ok: false, reason: 'dns_failed' }
      }
      for (const item of data.Answer || []) {
        if (item.type === 1 || item.type === 28) addresses.push(String(item.data || ''))
      }
    } catch {
      return { ok: false, reason: 'dns_failed' }
    } finally {
      clearTimeout(timer)
    }
  }
  if (!addresses.length) return { ok: false, reason: 'dns_failed' }
  if (addresses.some((address) => isNonPublicAddress(address))) return { ok: false, reason: 'blocked_address' }
  return { ok: true }
}

export async function defaultFetchPage(target, fetchImpl = globalThis.fetch, resolveImpl = resolveHost, options = {}) {
  const timeoutMs = options.timeoutMs ?? FETCH_MS
  const totalMs = options.totalMs ?? 8000
  const byteLimit = options.byteLimit ?? FETCH_BYTES
  const started = Date.now()
  let current = typeof target === 'string' ? normalizePublicUrl(target) : target
  if (!current) return { ok: false, reason: 'invalid_url' }
  for (let hop = 0; hop < 4; hop++) {
    const verdict = await resolveImpl(current.hostname, fetchImpl)
    if (!verdict?.ok) return { ok: false, reason: 'invalid_url' }
    const remaining = totalMs - (Date.now() - started)
    if (remaining <= 0) return { ok: false, reason: 'fetch_failed', url: current.href }
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), Math.min(timeoutMs, remaining))
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
      await cancelBody(res)
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
    const declared = Number(res.headers.get('content-length') || 0)
    if (Number.isFinite(declared) && declared > byteLimit) {
      await cancelBody(res)
      return { ok: false, reason: 'fetch_failed', url: current.href }
    }
    if (!res.ok) {
      await cancelBody(res)
      return { ok: false, reason: 'fetch_failed', url: current.href }
    }
    const type = (res.headers.get('content-type') || '').toLowerCase()
    if (!type.includes('text/html') && !type.includes('application/xhtml')) {
      await cancelBody(res)
      return { ok: true, url: current.href, html: '', contentType: type }
    }
    const html = await readHead(res, byteLimit)
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
    const row = await db
      .prepare(
        `INSERT INTO rate_buckets (bucket, hits, reset_at) VALUES (?, 1, ?)
         ON CONFLICT(bucket) DO UPDATE SET hits = hits + 1
         RETURNING hits`
      )
      .bind(slot.bucket, slot.resetAt)
      .first()
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

function resolverOf(context) {
  return context.resolveHost || resolveHost
}

const DATA_IMAGE_RE = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/

// 严格校验用户上传的缩略图 data URL：只认 jpeg/png/webp，拒绝 SVG 与其他类型，
// base64 必须规整，且解码后的字节头要与声明的格式对上（防改后缀冒充）。
// 返回 null 表示不是合法的缩略图；不抛错。
export function parseDataImage(value) {
  if (typeof value !== 'string' || !value.startsWith('data:image/')) return null
  if (value.length > THUMB_MAX) return null
  const match = DATA_IMAGE_RE.exec(value)
  if (!match) return null
  const payload = match[2]
  if (payload.length % 4 !== 0) return null
  let bytes
  try {
    bytes = Uint8Array.from(atob(payload), (char) => char.charCodeAt(0))
  } catch {
    return null
  }
  if (bytes.length > THUMB_MAX) return null
  const mime = match[1]
  if (mime === 'jpeg' && !(bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff)) return null
  if (mime === 'png' && !(bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47)) return null
  if (
    mime === 'webp' &&
    !(
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50
    )
  ) {
    return null
  }
  return { mime, bytes: bytes.length }
}

// 读出路径共用的封面呈现：https 外链沿用旧规则；data URL 只认 parseDataImage 放过的。
// 库里只应有 vettedImage 写进去的值，这里是纵深校验，脏值一律不返回。
export function presentImage(value) {
  if (!value) return null
  if (typeof value === 'string' && value.startsWith('data:')) {
    return parseDataImage(value) ? value : null
  }
  const parsed = normalizePublicUrl(value)
  if (parsed && parsed.protocol === 'https:') return parsed.href
  return null
}

async function vettedImage(image, resolveImpl) {
  if (!image) return { ok: true, image: null }
  if (typeof image === 'string' && image.startsWith('data:')) {
    if (image.length > THUMB_MAX) return { ok: false, error: 'image_too_large' }
    if (!parseDataImage(image)) return { ok: false, error: 'invalid_image' }
    return { ok: true, image }
  }
  let host = ''
  try {
    host = new URL(image).hostname
  } catch {
    return { ok: true, image: null }
  }
  const verdict = await resolveImpl(host)
  if (!verdict?.ok) return { ok: true, image: null }
  return { ok: true, image }
}

// 提交体里的 image 字段只认用户上传的缩略图 data URL；
// 其他值（比如旧客户端随手带的外链）沿用老行为：忽略，走抓来的 og:image。
function thumbnailOf(body) {
  const value = body?.image
  return typeof value === 'string' && value.startsWith('data:') ? value : ''
}

async function readBody(request, limit = BODY_MAX) {
  const declared = Number(request.headers.get('content-length') || 0)
  if (Number.isFinite(declared) && declared > limit) return { error: 'payload_too_large' }
  let text = ''
  try {
    text = await request.text()
  } catch {
    return { error: 'invalid_json' }
  }
  if (text.length > limit) return { error: 'payload_too_large' }
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
    const parsed = await readBody(context.request, IMAGE_BODY_MAX)
    if (parsed.error) return fail(parsed.error, parsed.error === 'payload_too_large' ? 413 : 400)
    if (honeypot(parsed.body)) return fail('invalid_request', 400)
    const pitch = plainText(parsed.body.pitch)
    const pitchLength = charCount(pitch)
    if (pitchLength < PITCH_MIN || pitchLength > PITCH_MAX) return fail('invalid_pitch', 400)
    const url = normalizePublicUrl(parsed.body.url)
    if (!url) return fail('invalid_url', 400)
    const providedImage = thumbnailOf(parsed.body)
    if (providedImage) {
      const checked = await vettedImage(providedImage, resolverOf(context))
      if (!checked.ok) return fail(checked.error, checked.error === 'image_too_large' ? 413 : 400)
    }
    const lang = parsed.body.lang === 'en' ? 'en' : 'zh'
    const now = nowOf(context)
    const parts = shanghaiParts(new Date(now))
    const key = await clientKey(context.request)
    const allowed = await allow(db, hourSlots('preview', key, PREVIEW_PER_HOUR, GLOBAL_PREVIEW_PER_HOUR, now, parts), now)
    if (!allowed) return fail('rate_limited', 429)
    const fetched = await pageFacts(context, url.href)
    if (fetched.reason === 'invalid_url') return fail('invalid_url', 400)
    const draft = draftFrom(fetched, pitch, lang, url.hostname)
    const fetchedImage = (await vettedImage(draft.image, resolverOf(context))).image
    const image = providedImage || fetchedImage
    const safeUrl = fetched.url && normalizePublicUrl(fetched.url) ? fetched.url : url.href
    return json({
      ok: true,
      url: safeUrl,
      title: draft.title,
      summary: draft.summary,
      image,
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
    const parsed = await readBody(context.request, IMAGE_BODY_MAX)
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
    const providedImage = thumbnailOf(parsed.body)
    if (providedImage) {
      const checked = await vettedImage(providedImage, resolverOf(context))
      if (!checked.ok) return fail(checked.error, checked.error === 'image_too_large' ? 413 : 400)
    }
    const existing = await openWork(db, url.href)
    if (existing?.status === 'approved') return fail('duplicate_public', 409)
    if (existing?.status === 'pending') return fail('duplicate_pending', 409)
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
    const fetchedImage = (await vettedImage(meta.image || null, resolverOf(context))).image
    const image = providedImage || fetchedImage
    const id = crypto.randomUUID()
    try {
      await db
        .prepare(
          `INSERT INTO works (id, url, pitch, title, summary, image_url, status, like_count, created_at, reviewed_at)
           VALUES (?, ?, ?, ?, ?, ?, 'approved', 0, ?, ?)`
        )
        .bind(id, url.href, pitch, title, summary, image, now, now)
        .run()
    } catch (error) {
      const message = String(error?.message || error)
      if (message.includes('UNIQUE') || message.toLowerCase().includes('constraint')) return fail('duplicate_url', 409)
      throw error
    }
    const task = notifyOwner(context, { id, title, summary, url: url.href }).catch(() => {
      logNotify({ email: 'failed', telegram: 'failed' })
    })
    if (typeof context.waitUntil === 'function') context.waitUntil(task)
    else await task
    return json({ ok: true, id, status: 'approved' })
  } catch {
    return storageError()
  }
}

const NOTIFY_MS = 4000

function logNotify(status) {
  console.log(JSON.stringify({ source: 'unnoticed', notify: status }))
}

const OWNER_REVIEW_URL = 'https://promangofund.com/unnoticed/review'

function reviewPage(request) {
  const page = new URL(request.url)
  page.pathname = '/unnoticed/review'
  page.search = ''
  page.hash = ''
  return page.href
}

function ownerReviewUrl(request) {
  let page
  try {
    page = new URL(request.url)
  } catch {
    return ''
  }
  if (page.protocol !== 'https:') return ''
  const host = page.hostname.toLowerCase()
  if (host !== 'promangofund.com' && host !== 'www.promangofund.com') return ''
  return OWNER_REVIEW_URL
}

function telegramChatId(value) {
  if (typeof value !== 'string') return ''
  const trimmed = value.trim()
  if (trimmed.startsWith('+') || /[^\d-]/.test(trimmed)) return ''
  if (!/^-?\d{5,16}$/.test(trimmed)) return ''
  return trimmed
}

function ownerFetch(context, url, init) {
  const impl = context.notifyFetch || fetch
  return impl(url, init)
}

async function sendOwnerEmail(context, work) {
  const mailer = context.env?.UNNOTICED_MAILER
  if (!mailer || typeof mailer.fetch !== 'function') return 'skipped'
  const review = ownerReviewUrl(context.request)
  if (!review) return 'skipped'
  try {
    const response = await mailer.fetch('https://unnoticed-mailer.internal/notify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        title: work.title,
        url: work.url,
        summary: work.summary,
        reviewUrl: review
      }),
      signal: AbortSignal.timeout(NOTIFY_MS)
    })
    return response.ok ? 'sent' : 'failed'
  } catch {
    return 'failed'
  }
}

async function sendOwnerTelegram(context, work) {
  const env = context.env || {}
  const token = typeof env.TELEGRAM_BOT_TOKEN === 'string' ? env.TELEGRAM_BOT_TOKEN.trim() : ''
  const chatId = telegramChatId(env.TELEGRAM_CHAT_ID)
  if (!token || token.length > 200 || !chatId) return 'skipped'
  const review = reviewPage(context.request)
  try {
    const response = await ownerFetch(context, `https://api.telegram.org/bot${encodeURIComponent(token)}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        disable_web_page_preview: true,
        text: clipText(`无人问津\n${work.title}\n${work.url}\n${review}`, 1000)
      }),
      signal: AbortSignal.timeout(NOTIFY_MS)
    })
    return response.ok ? 'sent' : 'failed'
  } catch {
    return 'failed'
  }
}

export async function notifyOwner(context, work) {
  const [email, telegram] = await Promise.all([
    sendOwnerEmail(context, work),
    sendOwnerTelegram(context, work)
  ])
  const status = { email, telegram }
  logNotify(status)
  return status
}

function presentWork(row) {
  const url = normalizePublicUrl(row.url)
  if (!url) return null
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    image: presentImage(row.image_url),
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

async function hasTable(db, name) {
  try {
    await db.prepare(`SELECT COUNT(*) AS n FROM ${name}`).first()
    return true
  } catch {
    return false
  }
}

async function readRating(db, workId, visitorId) {
  const rows = await db
    .prepare('SELECT stars, COUNT(*) AS n FROM work_ratings WHERE work_id = ? GROUP BY stars')
    .bind(workId)
    .all()
  const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  let count = 0
  let total = 0
  for (const row of rows.results || []) {
    const stars = Number(row.stars)
    const n = Number(row.n) || 0
    if (stars < 1 || stars > 5 || n < 0) continue
    dist[stars] = n
    count += n
    total += stars * n
  }
  let mine = 0
  if (visitorId) {
    const own = await db
      .prepare('SELECT stars FROM work_ratings WHERE work_id = ? AND visitor_id = ?')
      .bind(workId, visitorId)
      .first()
    mine = Number(own?.stars) || 0
  }
  return { avg: count ? Math.round((total / count) * 10) / 10 : 0, count, dist, mine }
}

function emptyRating() {
  return { avg: 0, count: 0, dist: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, mine: 0 }
}

export async function onWorkDetail(context) {
  try {
    const db = databaseOf(context)
    if (!db) return fail('storage_unconfigured', 503)
    const id = new URL(context.request.url).searchParams.get('id') || ''
    if (!isUuid(id)) return fail('not_found', 404)
    const row = await db
      .prepare(
        `SELECT id, url, pitch, title, summary, image_url, like_count, created_at
         FROM works WHERE id = ? AND status = 'approved'`
      )
      .bind(id)
      .first()
    if (!row) return fail('not_found', 404)
    const work = presentWork(row)
    if (!work) return fail('not_found', 404)
    work.pitch = plainText(row.pitch)
    const visitor = visitorFrom(context.request)
    const ratingsReady = await hasTable(db, 'work_ratings')
    const commentsReady = await hasTable(db, 'work_comments')
    const rating = ratingsReady ? await readRating(db, id, visitor.id) : emptyRating()
    let comments = []
    if (commentsReady) {
      const listed = await db
        .prepare(
          `SELECT id, author, body, created_at FROM work_comments
           WHERE work_id = ? ORDER BY created_at DESC, id DESC LIMIT ?`
        )
        .bind(id, COMMENTS_LIMIT)
        .all()
      comments = (listed.results || []).map((item) => ({
        id: item.id,
        author: plainText(item.author || ''),
        body: plainText(item.body || ''),
        createdAt: Number(item.created_at)
      }))
    }
    const mark = await db
      .prepare('SELECT 1 AS ok FROM work_likes WHERE work_id = ? AND visitor_id = ?')
      .bind(id, visitor.id)
      .first()
    return withVisitor(
      { ok: true, work, rating, ratingsReady, comments, commentsReady, liked: Boolean(mark) },
      200,
      context.request,
      visitor
    )
  } catch {
    return storageError()
  }
}

export async function onRate(context) {
  try {
    const db = databaseOf(context)
    if (!db) return fail('storage_unconfigured', 503)
    const parsed = await readBody(context.request)
    if (parsed.error) return fail(parsed.error, parsed.error === 'payload_too_large' ? 413 : 400)
    if (honeypot(parsed.body)) return fail('invalid_request', 400)
    if (!isUuid(parsed.body.id)) return fail('not_found', 404)
    const stars = Number(parsed.body.stars)
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) return fail('invalid_stars', 400)
    if (!(await hasTable(db, 'work_ratings'))) return fail('feedback_unavailable', 503)
    const now = nowOf(context)
    const parts = shanghaiParts(new Date(now))
    const key = await clientKey(context.request)
    const allowed = await allow(db, hourSlots('rate', key, RATE_PER_HOUR, GLOBAL_RATE_PER_HOUR, now, parts), now)
    if (!allowed) return fail('rate_limited', 429)
    const visitor = visitorFrom(context.request)
    const work = await db
      .prepare(`SELECT id FROM works WHERE id = ? AND status = 'approved'`)
      .bind(parsed.body.id)
      .first()
    if (!work) return withVisitor({ ok: false, error: 'not_found' }, 404, context.request, visitor)
    await db
      .prepare(
        `INSERT INTO work_ratings (work_id, visitor_id, stars, created_at) VALUES (?, ?, ?, ?)
         ON CONFLICT(work_id, visitor_id) DO UPDATE SET stars = excluded.stars, created_at = excluded.created_at`
      )
      .bind(parsed.body.id, visitor.id, stars, now)
      .run()
    const rating = await readRating(db, parsed.body.id, visitor.id)
    return withVisitor({ ok: true, rating }, 200, context.request, visitor)
  } catch {
    return storageError()
  }
}

export async function onComment(context) {
  try {
    const db = databaseOf(context)
    if (!db) return fail('storage_unconfigured', 503)
    const parsed = await readBody(context.request)
    if (parsed.error) return fail(parsed.error, parsed.error === 'payload_too_large' ? 413 : 400)
    if (honeypot(parsed.body)) return fail('invalid_request', 400)
    if (!isUuid(parsed.body.id)) return fail('not_found', 404)
    const author = plainText(parsed.body.author || '')
    const body = plainText(parsed.body.body || '')
    if (charCount(author) > AUTHOR_MAX) return fail('invalid_author', 400)
    if (charCount(body) < COMMENT_MIN || charCount(body) > COMMENT_MAX) return fail('invalid_comment', 400)
    if (!(await hasTable(db, 'work_comments'))) return fail('feedback_unavailable', 503)
    const now = nowOf(context)
    const parts = shanghaiParts(new Date(now))
    const key = await clientKey(context.request)
    const allowed = await allow(db, hourSlots('comment', key, COMMENT_PER_HOUR, GLOBAL_COMMENT_PER_HOUR, now, parts), now)
    if (!allowed) return fail('rate_limited', 429)
    const visitor = visitorFrom(context.request)
    const work = await db
      .prepare(`SELECT id FROM works WHERE id = ? AND status = 'approved'`)
      .bind(parsed.body.id)
      .first()
    if (!work) return withVisitor({ ok: false, error: 'not_found' }, 404, context.request, visitor)
    const id = crypto.randomUUID()
    await db
      .prepare('INSERT INTO work_comments (id, work_id, visitor_id, author, body, created_at) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(id, parsed.body.id, visitor.id, author, body, now)
      .run()
    return withVisitor({ ok: true, comment: { id, author, body, createdAt: now } }, 200, context.request, visitor)
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
    const recount = `UPDATE works SET like_count = (
      SELECT COUNT(*) FROM work_likes WHERE work_id = ?
    ) WHERE id = ? AND status = 'approved'`
    if (existing) {
      await db.batch([
        db.prepare('DELETE FROM work_likes WHERE work_id = ? AND visitor_id = ?').bind(parsed.body.id, visitor.id),
        db.prepare(recount).bind(parsed.body.id, parsed.body.id)
      ])
    } else {
      await db.batch([
        db.prepare('INSERT OR IGNORE INTO work_likes (work_id, visitor_id, created_at) VALUES (?, ?, ?)').bind(
          parsed.body.id,
          visitor.id,
          now
        ),
        db.prepare(recount).bind(parsed.body.id, parsed.body.id)
      ])
    }
    const row = await db.prepare('SELECT like_count FROM works WHERE id = ?').bind(parsed.body.id).first()
    const still = await db
      .prepare('SELECT 1 AS ok FROM work_likes WHERE work_id = ? AND visitor_id = ?')
      .bind(parsed.body.id, visitor.id)
      .first()
    return withVisitor(
      { ok: true, liked: Boolean(still), likes: Number(row?.like_count) || 0 },
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

function tokenInUrl(request) {
  const url = new URL(request.url)
  for (const key of url.searchParams.keys()) {
    if (/token/i.test(key)) return true
  }
  return false
}

function sameOriginPost(request) {
  if (request.method !== 'POST') return true
  const origin = request.headers.get('origin')
  let expected = ''
  try {
    expected = new URL(request.url).host
  } catch {
    return false
  }
  if (origin) {
    try {
      return new URL(origin).host === expected
    } catch {
      return false
    }
  }
  const site = (request.headers.get('sec-fetch-site') || '').toLowerCase()
  return site === '' || site === 'same-origin' || site === 'none'
}

async function gateReview(context) {
  if (tokenInUrl(context.request)) return { error: fail('invalid_request', 400) }
  if (!sameOriginPost(context.request)) return { error: fail('bad_origin', 403) }
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
    const published = await db
      .prepare(
        `SELECT id, url, pitch, title, summary, image_url, created_at
         FROM works
         WHERE status = 'approved'
         ORDER BY created_at DESC, id DESC
         LIMIT 48`
      )
      .all()
    return json({ ok: true, works: rowsOf(listed), publicWorks: rowsOf(published) })
  } catch {
    return storageError()
  }
}

function rowsOf(listed) {
  const works = []
  for (const row of listed.results || []) {
    const url = normalizePublicUrl(row.url)
    works.push({
      id: row.id,
      url: url ? url.href : '',
      pitch: plainText(row.pitch),
      title: plainText(row.title),
      summary: plainText(row.summary),
      image: presentImage(row.image_url),
      createdAt: Number(row.created_at)
    })
  }
  return works
}

export async function onReviewPost(context) {
  try {
    const gate = await gateReview(context)
    if (gate.error) return gate.error
    const parsed = await readBody(context.request)
    if (parsed.error) return fail(parsed.error, parsed.error === 'payload_too_large' ? 413 : 400)
    if (!isUuid(parsed.body.id)) return fail('invalid_request', 400)
    const { db, now } = gate
    if (parsed.body.action === 'edit') {
      const summary = plainText(parsed.body.summary)
      if (charCount(summary) < SUMMARY_MIN || charCount(summary) > SUMMARY_MAX) return fail('invalid_summary', 400)
      const result = await db
        .prepare(`UPDATE works SET summary = ? WHERE id = ? AND status = 'approved'`)
        .bind(summary, parsed.body.id)
        .run()
      if (changesOf(result) !== 1) return fail('not_found', 404)
      return json({ ok: true, status: 'edited' })
    }
    const action = parsed.body.action === 'approve'
      ? 'approved'
      : parsed.body.action === 'reject' || parsed.body.action === 'downlist'
        ? 'rejected'
        : ''
    if (!action) return fail('invalid_request', 400)
    const from = parsed.body.action === 'downlist' ? 'approved' : 'pending'
    const result = await db
      .prepare(`UPDATE works SET status = ?, reviewed_at = ? WHERE id = ? AND status = ?`)
      .bind(action, now, parsed.body.id, from)
      .run()
    if (changesOf(result) !== 1) return fail('not_found', 404)
    return json({ ok: true, status: action })
  } catch {
    return storageError()
  }
}
