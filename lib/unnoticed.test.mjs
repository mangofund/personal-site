import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { DatabaseSync } from 'node:sqlite'
import { test } from 'node:test'
import {
  LIST_CHANCE_SQL,
  LIST_LATEST_SQL,
  buildDraft,
  clientKey,
  defaultFetchPage,
  extractMeta,
  normalizePublicUrl,
  onLike,
  onPreview,
  onReviewGet,
  onReviewPost,
  onSubmit,
  onWorks,
  shanghaiParts,
  tokenMatches
} from './unnoticed.mjs'

const TOKEN = 'local-test-token-32chars-minimum'
const schema = readFileSync(new URL('../migrations/0001_unnoticed.sql', import.meta.url), 'utf8')

class Stmt {
  constructor(db, sql, params = []) {
    this.db = db
    this.sql = sql
    this.params = params
  }
  bind(...params) {
    return new Stmt(this.db, this.sql, params)
  }
  async first() {
    const row = this.db.prepare(this.sql).get(...this.params)
    return row ?? null
  }
  async all() {
    return { results: this.db.prepare(this.sql).all(...this.params) }
  }
  async run() {
    const info = this.db.prepare(this.sql).run(...this.params)
    return { success: true, meta: { changes: info.changes ?? 0 } }
  }
}

class FakeD1 {
  constructor(db) {
    this.db = db
  }
  prepare(sql) {
    return new Stmt(this.db, sql)
  }
  async batch(statements) {
    this.db.exec('BEGIN')
    const results = []
    try {
      for (const statement of statements) results.push(await statement.run())
      this.db.exec('COMMIT')
    } catch (error) {
      this.db.exec('ROLLBACK')
      throw error
    }
    return results
  }
}

function createDb() {
  const sqlite = new DatabaseSync(':memory:')
  sqlite.exec(schema)
  return new FakeD1(sqlite)
}

function request(url, { method = 'GET', body, cookie, token, ip = '203.0.113.10' } = {}) {
  const headers = new Headers({ 'cf-connecting-ip': ip })
  if (body !== undefined) headers.set('content-type', 'application/json')
  if (cookie) headers.set('cookie', cookie)
  if (token) headers.set('authorization', `Bearer ${token}`)
  return new Request(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined
  })
}

function context(db, req, extra = {}) {
  return {
    request: req,
    env: { UNNOTICED_DB: db, UNNOTICED_REVIEW_TOKEN: TOKEN, ...extra.env },
    fetchPage: extra.fetchPage,
    now: extra.now
  }
}

function htmlPage({ title = 'Widget', description = 'A small tool for notes.', image = 'https://cdn.example/cover.jpg' } = {}) {
  return `<!doctype html><html><head>
    <meta content="${title}" property="og:title">
    <meta name="description" content="${description}">
    <meta property="og:image" content="${image}">
    <title>Ignored</title>
  </head><body></body></html>`
}

function pageFetch(html = htmlPage()) {
  return async () => ({ ok: true, url: 'https://widget.example/app', html })
}

function cookieFrom(res) {
  const match = (res.headers.get('set-cookie') || '').match(/mf_unnoticed=([a-f0-9]{32})/)
  return match ? `mf_unnoticed=${match[1]}` : ''
}

test('public urls drop tracking params and block private targets', () => {
  const clean = normalizePublicUrl('https://EX.com/a/?utm_source=x&id=1&fbclid=abc#top')
  assert.equal(clean.href, 'https://ex.com/a?id=1')
  assert.equal(normalizePublicUrl('https://ex.com/a/')?.href, 'https://ex.com/a')
  for (const bad of [
    'javascript:alert(1)',
    'https://user:pass@ex.com/',
    'http://localhost/admin',
    'http://127.0.0.1/',
    'http://169.254.169.254/latest',
    'http://10.1.2.3/',
    'http://192.168.0.1/',
    'http://172.16.0.1/',
    'http://[::1]/',
    'http://metadata.google.internal/',
    'http://printer.local/',
    'https://ex.com:8443/',
    'http://2130706433/',
    'http://0177.0.0.1/',
    'example.com'
  ]) {
    assert.equal(normalizePublicUrl(bad), null, bad)
  }
})

test('draft uses page metadata and the submitter sentence only', () => {
  const drafted = buildDraft({
    title: 'Widget',
    description: 'A small tool for notes.',
    pitch: '给自己记笔记',
    host: 'widget.example',
    lang: 'zh'
  })
  assert.deepEqual(drafted, {
    title: 'Widget',
    summary: 'A small tool for notes. 提交者说：给自己记笔记',
    usedTitle: true,
    usedDescription: true
  })
  const bare = buildDraft({ title: '', description: '', pitch: '给自己记笔记', host: 'www.widget.example', lang: 'zh' })
  assert.equal(bare.title, 'widget.example')
  assert.equal(bare.summary, '提交者说：给自己记笔记')
  assert.equal(bare.usedDescription, false)
  const same = buildDraft({ title: 'Widget', description: 'Widget', pitch: '给自己记笔记', host: 'widget.example', lang: 'en' })
  assert.equal(same.summary, 'Submitter: 给自己记笔记')
})

test('meta tags keep source text and only https images', () => {
  const meta = extractMeta(
    `<head><meta content="A &amp; B" property="og:title"><meta name="description" content="Notes &quot;here&quot;"><meta property="og:image" content="/cover.jpg"></head>`,
    'https://example.com/app'
  )
  assert.equal(meta.title, 'A & B')
  assert.equal(meta.description, 'Notes "here"')
  assert.equal(meta.image, 'https://example.com/cover.jpg')
  const unsafe = extractMeta('<head><meta property="og:image" content="http://127.0.0.1/pixel.png"></head>', 'https://example.com/')
  assert.equal(unsafe.image, '')
})

test('fetch follows public redirects and stops at private ones', async () => {
  const blocked = await defaultFetchPage('https://example.com/go', async (href) => {
    if (href === 'https://example.com/go') return new Response(null, { status: 302, headers: { location: 'http://127.0.0.1/secret' } })
    throw new Error('should not fetch private host')
  })
  assert.equal(blocked.ok, false)
  assert.equal(blocked.reason, 'invalid_url')
  const ok = await defaultFetchPage('https://example.com/go', async (href) => {
    if (href === 'https://example.com/go') return new Response(null, { status: 302, headers: { location: '/next' } })
    return new Response('<title>Next</title>', { status: 200, headers: { 'content-type': 'text/html' } })
  })
  assert.equal(ok.ok, true)
  assert.equal(ok.url, 'https://example.com/next')
  assert.match(ok.html, /Next/)
})

test('lists are newest-first or random, never ranked by likes', () => {
  assert.match(LIST_LATEST_SQL, /ORDER BY created_at DESC/)
  assert.doesNotMatch(LIST_LATEST_SQL, /ORDER BY[^\n]*like_count/)
  assert.match(LIST_CHANCE_SQL, /ORDER BY RANDOM\(\)/)
  assert.doesNotMatch(LIST_CHANCE_SQL, /ORDER BY[^\n]*like_count/)
})

test('shanghai hour and client key do not keep the raw ip', async () => {
  assert.deepEqual(shanghaiParts(new Date('2026-11-10T00:30:00Z')), { day: '2026-11-10', hour: '08' })
  const key = await clientKey(request('https://promangofund.com/api/unnoticed/works', { ip: '203.0.113.8' }))
  assert.equal(key.length, 16)
  assert.doesNotMatch(key, /203/)
})

test('review token compare rejects short and wrong secrets', async () => {
  assert.equal(await tokenMatches(TOKEN, TOKEN), true)
  assert.equal(await tokenMatches('nope-but-long-enough', TOKEN), false)
  assert.equal(await tokenMatches('', TOKEN), false)
  assert.equal(await tokenMatches(TOKEN, 'short'), false)
})

test('preview does not store a work and ignores blocked hosts', async () => {
  const db = createDb()
  let fetched = false
  const blocked = await onPreview(context(db, request('https://promangofund.com/api/unnoticed/preview', {
    method: 'POST',
    body: { url: 'http://127.0.0.1/', pitch: '给自己用的', lang: 'zh' }
  }), { fetchPage: async () => { fetched = true; return { ok: true, html: '<title>x</title>' } } }))
  assert.equal(blocked.status, 400)
  assert.equal(fetched, false)
  const preview = await onPreview(context(db, request('https://promangofund.com/api/unnoticed/preview', {
    method: 'POST',
    body: { url: 'https://widget.example/app', pitch: '给自己记笔记', lang: 'zh', mf_company: '' }
  }), { fetchPage: pageFetch() }))
  assert.equal(preview.status, 200)
  const body = await preview.json()
  assert.equal(body.summary, 'A small tool for notes. 提交者说：给自己记笔记')
  assert.equal(body.image, 'https://cdn.example/cover.jpg')
  assert.equal(db.db.prepare('SELECT COUNT(*) AS n FROM works').get().n, 0)
})

test('submit, review, like, and both sorts', async () => {
  const db = createDb()
  const fetchPage = pageFetch()
  const first = await onSubmit(context(db, request('https://promangofund.com/api/unnoticed/submit', {
    method: 'POST',
    body: {
      url: 'https://widget.example/app?utm_source=spam',
      pitch: '给自己记笔记',
      title: 'Widget',
      summary: 'A small tool for notes. 提交者说：给自己记笔记',
      image: 'https://evil.example/pixel.gif'
    }
  }), { fetchPage, now: 1_000 }))
  assert.equal(first.status, 200)
  const created = await first.json()
  const hidden = await onWorks(context(db, request('https://promangofund.com/api/unnoticed/works')))
  assert.deepEqual((await hidden.json()).works, [])
  const locked = await onReviewGet(context(db, request('https://promangofund.com/api/unnoticed/review')))
  assert.equal(locked.status, 401)
  const queue = await onReviewGet(context(db, request('https://promangofund.com/api/unnoticed/review', { token: TOKEN })))
  const pending = await queue.json()
  assert.equal(pending.works.length, 1)
  assert.equal(pending.works[0].pitch, '给自己记笔记')
  assert.equal(pending.works[0].url, 'https://widget.example/app')
  const storedImage = db.db.prepare('SELECT image_url FROM works WHERE id = ?').get(created.id).image_url
  assert.equal(storedImage, 'https://cdn.example/cover.jpg')
  const approved = await onReviewPost(context(db, request('https://promangofund.com/api/unnoticed/review', {
    method: 'POST',
    token: TOKEN,
    body: { id: created.id, action: 'approve' }
  })))
  assert.equal((await approved.json()).status, 'approved')
  const latest = await onWorks(context(db, request('https://promangofund.com/api/unnoticed/works?sort=latest')))
  const latestBody = await latest.json()
  assert.equal(latestBody.works.length, 1)
  assert.equal(latestBody.works[0].likes, 0)
  assert.equal(latestBody.works[0].url, 'https://widget.example/app')
  const like = await onLike(context(db, request('https://promangofund.com/api/unnoticed/like', {
    method: 'POST',
    body: { id: created.id, visitorId: 'ffffffffffffffffffffffffffffffff' }
  })))
  const likeBody = await like.json()
  assert.equal(likeBody.liked, true)
  assert.equal(likeBody.likes, 1)
  const cookie = cookieFrom(like)
  const unlike = await onLike(context(db, request('https://promangofund.com/api/unnoticed/like', {
    method: 'POST',
    cookie,
    body: { id: created.id }
  })))
  assert.deepEqual(await unlike.json(), { ok: true, liked: false, likes: 0 })
  await onLike(context(db, request('https://promangofund.com/api/unnoticed/like', {
    method: 'POST',
    cookie,
    body: { id: created.id }
  })))
  const other = await onLike(context(db, request('https://promangofund.com/api/unnoticed/like', {
    method: 'POST',
    ip: '203.0.113.11',
    body: { id: created.id }
  })))
  assert.equal((await other.json()).likes, 2)
  const second = await onSubmit(context(db, request('https://promangofund.com/api/unnoticed/submit', {
    method: 'POST',
    ip: '203.0.113.12',
    body: { url: 'https://other.example/', pitch: '给同学对答案', title: 'Other', summary: '提交者说：给同学对答案' }
  }), { fetchPage: async () => ({ ok: false, reason: 'fetch_failed' }), now: 2_000 }))
  const secondId = (await second.json()).id
  await onReviewPost(context(db, request('https://promangofund.com/api/unnoticed/review', {
    method: 'POST',
    token: TOKEN,
    body: { id: secondId, action: 'approve' }
  })))
  const ordered = await (await onWorks(context(db, request('https://promangofund.com/api/unnoticed/works?sort=latest')))).json()
  assert.deepEqual(ordered.works.map((work) => work.id), [secondId, created.id])
  const chance = await (await onWorks(context(db, request('https://promangofund.com/api/unnoticed/works?sort=chance')))).json()
  assert.deepEqual(chance.works.map((work) => work.id).sort(), [created.id, secondId].sort())
  const duplicate = await onSubmit(context(db, request('https://promangofund.com/api/unnoticed/submit', {
    method: 'POST',
    ip: '203.0.113.13',
    body: { url: 'https://widget.example/app', pitch: '再投一次试试', title: 'Widget', summary: '提交者说：再投一次试试' }
  }), { fetchPage }))
  assert.equal(duplicate.status, 409)
  const rejected = await onSubmit(context(db, request('https://promangofund.com/api/unnoticed/submit', {
    method: 'POST',
    ip: '203.0.113.14',
    body: { url: 'https://spam.example/', pitch: '到处留广告链接', title: 'Spam', summary: '提交者说：到处留广告链接' }
  }), { fetchPage: async () => ({ ok: false, reason: 'fetch_failed' }), now: 3_000 }))
  const rejectedId = (await rejected.json()).id
  await onReviewPost(context(db, request('https://promangofund.com/api/unnoticed/review', {
    method: 'POST',
    token: TOKEN,
    body: { id: rejectedId, action: 'reject' }
  })))
  const afterReject = await (await onWorks(context(db, request('https://promangofund.com/api/unnoticed/works')))).json()
  assert.equal(afterReject.works.some((work) => work.id === rejectedId), false)
  const again = await onSubmit(context(db, request('https://promangofund.com/api/unnoticed/submit', {
    method: 'POST',
    ip: '203.0.113.15',
    body: { url: 'https://spam.example/', pitch: '改完再投一次', title: 'Spam', summary: '提交者说：改完再投一次' }
  }), { fetchPage: async () => ({ ok: false, reason: 'fetch_failed' }), now: 4_000 }))
  assert.equal(again.status, 200)
  const honey = await onSubmit(context(db, request('https://promangofund.com/api/unnoticed/submit', {
    method: 'POST',
    ip: '203.0.113.16',
    body: { url: 'https://bot.example/', pitch: '机器人填表', title: 'Bot', summary: '提交者说：机器人填表', mf_company: 'acme' }
  }), { fetchPage }))
  assert.equal(honey.status, 400)
  assert.equal(db.db.prepare(`SELECT COUNT(*) AS n FROM works WHERE url = 'https://bot.example/'`).get().n, 0)
})

test('preview rate limit trips before another outbound fetch', async () => {
  const db = createDb()
  let fetches = 0
  const fetchPage = async () => {
    fetches += 1
    return { ok: true, url: 'https://widget.example/', html: htmlPage() }
  }
  for (let i = 0; i < 12; i++) {
    const res = await onPreview(context(db, request('https://promangofund.com/api/unnoticed/preview', {
      method: 'POST',
      body: { url: 'https://widget.example/', pitch: '给自己记笔记' }
    }), { fetchPage, now: 5_000 }))
    assert.equal(res.status, 200)
  }
  const limited = await onPreview(context(db, request('https://promangofund.com/api/unnoticed/preview', {
    method: 'POST',
    body: { url: 'https://widget.example/', pitch: '给自己记笔记' }
  }), { fetchPage, now: 5_000 }))
  assert.equal(limited.status, 429)
  assert.equal(fetches, 12)
})
