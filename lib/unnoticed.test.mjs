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
  isNonPublicAddress,
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
    resolveHost: extra.resolveHost || (async () => ({ ok: true })),
    now: extra.now
  }
}

const publicDns = async (host) => (host === 'rebind.example' ? { ok: false, reason: 'blocked_address' } : { ok: true })

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
  }, publicDns)
  assert.equal(blocked.ok, false)
  assert.equal(blocked.reason, 'invalid_url')
  const seen = []
  const rebound = await defaultFetchPage('https://example.com/go', async (href) => {
    seen.push(href)
    return new Response(null, { status: 302, headers: { location: 'https://rebind.example/secret' } })
  }, publicDns)
  assert.equal(rebound.reason, 'invalid_url')
  assert.deepEqual(seen, ['https://example.com/go'])
  const ok = await defaultFetchPage('https://example.com/go', async (href) => {
    if (href === 'https://example.com/go') return new Response(null, { status: 302, headers: { location: '/next' } })
    return new Response('<title>Next</title>', { status: 200, headers: { 'content-type': 'text/html' } })
  }, publicDns)
  assert.equal(ok.ok, true)
  assert.equal(ok.url, 'https://example.com/next')
  assert.match(ok.html, /Next/)
})

test('private and reserved addresses are blocked, public ones are not', () => {
  for (const address of [
    '0.0.0.0', '10.1.2.3', '100.64.0.1', '127.0.0.1', '169.254.169.254', '172.16.0.1',
    '192.0.2.1', '192.168.1.1', '198.18.0.1', '198.51.100.1', '203.0.113.1', '224.0.0.1', '255.255.255.255',
    '::', '::1', 'fc00::1', 'fd12::1', 'fe80::1', 'ff02::1', '::ffff:127.0.0.1', '::ffff:10.0.0.1',
    '2001:db8::1', '2002:0808:0808::'
  ]) {
    assert.equal(isNonPublicAddress(address), true, address)
  }
  assert.equal(isNonPublicAddress('1.1.1.1'), false)
  assert.equal(isNonPublicAddress('8.8.8.8'), false)
  assert.equal(isNonPublicAddress('93.184.216.34'), false)
  assert.equal(isNonPublicAddress('2606:4700:4700::1111'), false)
})

test('page text cannot carry a script, and drafts do not invent a pitch', () => {
  const drafted = buildDraft({
    title: '<script>alert(1)</script>Widget',
    description: 'Notes <img src=x onerror=alert(1)> only',
    pitch: '给自己记笔记',
    host: 'widget.example',
    lang: 'zh'
  })
  assert.equal(drafted.title, 'Widget')
  assert.equal(drafted.summary.includes('<'), false)
  assert.equal(drafted.summary.includes('onerror'), false)
  assert.equal(drafted.summary, 'Notes only 提交者说：给自己记笔记')
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
  assert.equal(created.status, 'approved')
  const stored = db.db.prepare('SELECT status, reviewed_at, image_url FROM works WHERE id = ?').get(created.id)
  assert.equal(stored.status, 'approved')
  assert.equal(stored.reviewed_at, 1_000)
  assert.equal(stored.image_url, 'https://cdn.example/cover.jpg')
  const latest = await onWorks(context(db, request('https://promangofund.com/api/unnoticed/works?sort=latest')))
  const latestBody = await latest.json()
  assert.equal(latestBody.works.length, 1)
  assert.equal(latestBody.works[0].likes, 0)
  assert.equal(latestBody.works[0].url, 'https://widget.example/app')
  const locked = await onReviewGet(context(db, request('https://promangofund.com/api/unnoticed/review')))
  assert.equal(locked.status, 401)
  const queue = await onReviewGet(context(db, request('https://promangofund.com/api/unnoticed/review', { token: TOKEN })))
  assert.deepEqual((await queue.json()).works, [])
  const alreadyPublic = await onReviewPost(context(db, request('https://promangofund.com/api/unnoticed/review', {
    method: 'POST',
    token: TOKEN,
    body: { id: created.id, action: 'approve' }
  })))
  assert.equal(alreadyPublic.status, 404)
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
  const secondBody = await second.json()
  const secondId = secondBody.id
  assert.equal(secondBody.status, 'approved')
  const ordered = await (await onWorks(context(db, request('https://promangofund.com/api/unnoticed/works?sort=latest')))).json()
  assert.deepEqual(ordered.works.map((work) => work.id), [secondId, created.id])
  const chance = await (await onWorks(context(db, request('https://promangofund.com/api/unnoticed/works?sort=chance')))).json()
  assert.deepEqual(chance.works.map((work) => work.id).sort(), [created.id, secondId].sort())
  const beforeDuplicate = db.db.prepare('SELECT title, summary, pitch, status FROM works WHERE id = ?').get(created.id)
  const duplicate = await onSubmit(context(db, request('https://promangofund.com/api/unnoticed/submit', {
    method: 'POST',
    ip: '203.0.113.13',
    body: { url: 'https://widget.example/app', pitch: '再投一次试试', title: 'Renamed', summary: '提交者说：再投一次试试' }
  }), { fetchPage }))
  assert.equal(duplicate.status, 409)
  assert.equal((await duplicate.json()).error, 'duplicate_public')
  assert.deepEqual(db.db.prepare('SELECT title, summary, pitch, status FROM works WHERE id = ?').get(created.id), beforeDuplicate)
  const rejectedId = '33333333-3333-4333-8333-333333333333'
  db.db.prepare(
    `INSERT INTO works (id, url, pitch, title, summary, image_url, status, like_count, created_at)
     VALUES (?, 'https://spam.example/', '到处留广告链接', 'Spam', '提交者说：到处留广告链接', NULL, 'pending', 0, 3)`
  ).run(rejectedId)
  const rejected = await onReviewPost(context(db, request('https://promangofund.com/api/unnoticed/review', {
    method: 'POST',
    token: TOKEN,
    body: { id: rejectedId, action: 'reject' }
  })))
  assert.equal((await rejected.json()).status, 'rejected')
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

test('a pending url cannot be overwritten or published by another confirm', async () => {
  const db = createDb()
  const id = '66666666-6666-4666-8666-666666666666'
  db.db.prepare(
    `INSERT INTO works (id, url, pitch, title, summary, image_url, status, like_count, created_at)
     VALUES (?, 'https://bravelife.example/', '给想试东京生活的人', 'BraveLife', '提交者说：给想试东京生活的人', NULL, 'pending', 0, 10)`
  ).run(id)
  const retry = await onSubmit(context(db, request('https://promangofund.com/api/unnoticed/submit', {
    method: 'POST',
    body: {
      url: 'https://bravelife.example/',
      pitch: '换成另一句',
      title: '别的名字',
      summary: '提交者说：换成另一句'
    }
  }), { fetchPage: async () => ({ ok: false }), now: 20 }))
  assert.equal(retry.status, 409)
  assert.equal((await retry.json()).error, 'duplicate_pending')
  const row = db.db.prepare('SELECT status, title, pitch, summary FROM works WHERE id = ?').get(id)
  assert.equal(row.status, 'pending')
  assert.equal(row.title, 'BraveLife')
  assert.equal(row.pitch, '给想试东京生活的人')
  const listed = await (await onWorks(context(db, request('https://promangofund.com/api/unnoticed/works?sort=latest')))).json()
  assert.equal(listed.works.some((work) => work.id === id), false)
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

test('fetch stops on timeout and oversized bodies', async () => {
  const hung = await defaultFetchPage(
    'https://example.com/',
    (_href, init) => new Promise((_resolve, reject) => {
      init.signal.addEventListener('abort', () => reject(new Error('aborted')))
    }),
    publicDns,
    { timeoutMs: 20, totalMs: 40 }
  )
  assert.equal(hung.ok, false)
  assert.equal(hung.reason, 'fetch_failed')
  const huge = await defaultFetchPage(
    'https://example.com/',
    () => new Response('<title>' + 'x'.repeat(100) + '</title>', {
      status: 200,
      headers: { 'content-type': 'text/html', 'content-length': '999999' }
    }),
    publicDns,
    { byteLimit: 32 }
  )
  assert.equal(huge.ok, false)
  const clipped = await defaultFetchPage(
    'https://example.com/',
    () => new Response('<title>' + 'x'.repeat(80) + '</title>', {
      status: 200,
      headers: { 'content-type': 'text/html' }
    }),
    publicDns,
    { byteLimit: 24 }
  )
  assert.equal(clipped.ok, true)
  assert.ok(new TextEncoder().encode(clipped.html).byteLength <= 24)
})

test('pending and rejected works never appear in latest or chance', async () => {
  const db = createDb()
  const hiddenPitch = '待审核的秘密句子'
  db.db.prepare(
    `INSERT INTO works (id, url, pitch, title, summary, image_url, status, like_count, created_at)
     VALUES ('44444444-4444-4444-8444-444444444444', 'https://hidden.example/a', ?, 'Hidden', ?, NULL, 'pending', 0, 10)`
  ).run(hiddenPitch, '提交者说：' + hiddenPitch)
  db.db.prepare(
    `INSERT INTO works (id, url, pitch, title, summary, image_url, status, like_count, created_at)
     VALUES ('55555555-5555-4555-8555-555555555555', 'https://rejected.example/', '已拒绝的句子', 'Rejected', '提交者说：已拒绝的句子', NULL, 'rejected', 0, 11)`
  ).run()
  const created = await onSubmit(context(db, request('https://promangofund.com/api/unnoticed/submit', {
    method: 'POST',
    ip: '203.0.113.40',
    body: { url: 'https://shown.example/', pitch: '给自己看公开的', title: 'Shown', summary: '提交者说：给自己看公开的' }
  }), { fetchPage: async () => ({ ok: false }), now: 20 }))
  const id = (await created.json()).id
  assert.equal(db.db.prepare(`SELECT status FROM works WHERE url = 'https://hidden.example/a'`).get().status, 'pending')
  for (const sort of ['latest', 'chance', 'pending', 'rejected']) {
    const body = await (await onWorks(context(db, request(`https://promangofund.com/api/unnoticed/works?sort=${sort}`)))).json()
    const encoded = JSON.stringify(body)
    assert.equal(encoded.includes(hiddenPitch), false)
    assert.equal(encoded.includes('hidden.example'), false)
    assert.deepEqual(body.works.map((work) => work.id), [id])
  }
  const denied = await onReviewGet(context(db, request('https://promangofund.com/api/unnoticed/review')))
  assert.equal(JSON.stringify(await denied.json()).includes(hiddenPitch), false)
  const queried = await onReviewGet(context(db, request(`https://promangofund.com/api/unnoticed/review?token=${TOKEN}`, { token: TOKEN })))
  const queriedText = JSON.stringify(await queried.json())
  assert.equal(queried.status, 400)
  assert.equal(queriedText.includes(TOKEN), false)
  assert.equal(queriedText.includes(hiddenPitch), false)
})

test('parallel likes stay consistent with stored rows', async () => {
  const db = createDb()
  const created = await onSubmit(context(db, request('https://promangofund.com/api/unnoticed/submit', {
    method: 'POST',
    body: { url: 'https://like.example/', pitch: '给自己点一下', title: 'Like', summary: '提交者说：给自己点一下' }
  }), { fetchPage: async () => ({ ok: false }), now: 30 }))
  const id = (await created.json()).id
  const jar = request('https://promangofund.com/api/unnoticed/works')
  const listed = await onWorks(context(db, jar))
  const cookie = (listed.headers.get('set-cookie') || '').match(/mf_unnoticed=[a-f0-9]{32}/)[0]
  const [first, second] = await Promise.all([
    onLike(context(db, request('https://promangofund.com/api/unnoticed/like', { method: 'POST', cookie, body: { id } }))),
    onLike(context(db, request('https://promangofund.com/api/unnoticed/like', { method: 'POST', cookie, body: { id } })))
  ])
  const rows = db.db.prepare('SELECT COUNT(*) AS n FROM work_likes WHERE work_id = ?').get(id).n
  const likes = db.db.prepare('SELECT like_count AS n FROM works WHERE id = ?').get(id).n
  assert.equal(likes, rows)
  assert.ok(rows === 0 || rows === 1)
  for (const res of [first, second]) {
    const body = await res.json()
    assert.equal(body.ok, true)
    assert.ok(body.likes === 0 || body.likes === 1)
  }
  const pending = await onLike(context(db, request('https://promangofund.com/api/unnoticed/like', {
    method: 'POST',
    cookie,
    body: { id: '00000000-0000-4000-8000-000000000000' }
  })))
  assert.equal(pending.status, 404)
})

test('parallel previews cannot exceed the hourly cap', async () => {
  const db = createDb()
  const fetchPage = async () => ({ ok: true, url: 'https://widget.example/', html: htmlPage() })
  const results = await Promise.all(Array.from({ length: 20 }, () => onPreview(context(db, request('https://promangofund.com/api/unnoticed/preview', {
    method: 'POST',
    ip: '203.0.113.77',
    body: { url: 'https://widget.example/', pitch: '给自己记笔记' }
  }), { fetchPage, now: 9_000 }))))
  const oks = results.filter((res) => res.status === 200).length
  assert.equal(oks, 12)
})

test('image host that resolves privately is dropped', async () => {
  const db = createDb()
  const res = await onPreview(context(db, request('https://promangofund.com/api/unnoticed/preview', {
    method: 'POST',
    body: { url: 'https://widget.example/app', pitch: '给自己记笔记' }
  }), {
    fetchPage: pageFetch(),
    resolveHost: async (host) => (host === 'cdn.example' ? { ok: false, reason: 'blocked_address' } : { ok: true })
  }))
  assert.equal((await res.json()).image, null)
})

test('unsafe stored urls are not returned as links', async () => {
  const db = createDb()
  db.db.prepare(
    `INSERT INTO works (id, url, pitch, title, summary, image_url, status, like_count, created_at)
     VALUES ('11111111-1111-4111-8111-111111111111', 'javascript:alert(1)', '给自己看', 'Bad', '提交者说：给自己看', 'http://127.0.0.1/x.png', 'approved', 3, 1)`
  ).run()
  db.db.prepare(
    `INSERT INTO works (id, url, pitch, title, summary, image_url, status, like_count, created_at)
     VALUES ('22222222-2222-4222-8222-222222222222', 'javascript:alert(2)', '待审核秘密', 'Queued', '提交者说：待审核秘密', NULL, 'pending', 0, 2)`
  ).run()
  const listed = await (await onWorks(context(db, request('https://promangofund.com/api/unnoticed/works')))).json()
  assert.equal(listed.works.length, 0)
  const queue = await (await onReviewGet(context(db, request('https://promangofund.com/api/unnoticed/review', { token: TOKEN })))).json()
  assert.equal(queue.works[0].url, '')
  assert.equal(JSON.stringify(queue).includes('javascript:'), false)
})
