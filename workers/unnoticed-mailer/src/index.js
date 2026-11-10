const RECIPIENT = 'jeffreylsp@gmail.com'
const SENDER = 'unnoticed@promangofund.com'
const REVIEW_URL = 'https://promangofund.com/unnoticed/review'
const MAX_BODY_CHARS = 4096
const NOTICE_KEYS = ['title', 'url', 'summary', 'reviewUrl']

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    if (char === '&') return '&amp;'
    if (char === '<') return '&lt;'
    if (char === '>') return '&gt;'
    if (char === '"') return '&quot;'
    return '&#39;'
  })
}

function charCount(value) {
  return [...value].length
}

function isWorkUrl(value) {
  if (typeof value !== 'string' || value.length > 500) return false
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && url.username === '' && url.password === '' && url.hostname.includes('.')
  } catch {
    return false
  }
}

export function parseNotice(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null
  const keys = Object.keys(body)
  if (keys.length !== NOTICE_KEYS.length || keys.some((key) => !NOTICE_KEYS.includes(key))) return null
  if (typeof body.title !== 'string') return null
  const title = body.title.trim()
  if (!title || charCount(title) > 80 || /[\r\n]/.test(title)) return null
  if (!isWorkUrl(body.url)) return null
  if (typeof body.summary !== 'string') return null
  const summary = body.summary.trim()
  if (charCount(summary) < 4 || charCount(summary) > 280) return null
  if (body.reviewUrl !== REVIEW_URL) return null
  return { title, url: body.url, summary }
}

function noticeHtml(notice) {
  const title = escapeHtml(notice.title)
  const url = escapeHtml(notice.url)
  const summary = escapeHtml(notice.summary)
  const review = escapeHtml(REVIEW_URL)
  return `<p><strong>${title}</strong></p><p><a href="${url}">${url}</a></p><p>${summary}</p><p><a href="${review}">${review}</a></p>`
}

export async function handleMailerRequest(request, env) {
  if (request.method !== 'POST') return Response.json({ ok: false, error: 'method' }, { status: 405 })
  let pathname = ''
  try {
    pathname = new URL(request.url).pathname
  } catch {
    return Response.json({ ok: false, error: 'not_found' }, { status: 404 })
  }
  if (pathname !== '/notify') return Response.json({ ok: false, error: 'not_found' }, { status: 404 })
  const raw = await request.text()
  if (raw.length > MAX_BODY_CHARS) return Response.json({ ok: false, error: 'payload' }, { status: 400 })
  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch {
    return Response.json({ ok: false, error: 'payload' }, { status: 400 })
  }
  const notice = parseNotice(parsed)
  if (!notice) return Response.json({ ok: false, error: 'payload' }, { status: 400 })
  const email = env?.EMAIL
  if (!email || typeof email.send !== 'function') {
    console.log(JSON.stringify({ source: 'unnoticed-mailer', ok: false, code: 'binding_missing' }))
    return Response.json({ ok: false, error: 'send_failed' }, { status: 502 })
  }
  try {
    await email.send({
      to: RECIPIENT,
      from: SENDER,
      subject: `无人问津：${notice.title}`,
      text: `${notice.title}\n${notice.url}\n${notice.summary}\n\n${REVIEW_URL}`,
      html: noticeHtml(notice)
    })
  } catch (error) {
    const code = typeof error?.code === 'string' && /^E_[A-Z0-9_]{1,40}$/.test(error.code) ? error.code : 'send_failed'
    console.log(JSON.stringify({ source: 'unnoticed-mailer', ok: false, code }))
    return Response.json({ ok: false, error: 'send_failed' }, { status: 502 })
  }
  console.log(JSON.stringify({ source: 'unnoticed-mailer', ok: true }))
  return Response.json({ ok: true })
}

export default {
  fetch(request, env) {
    return handleMailerRequest(request, env)
  }
}
