// A claim and its receipt are recorded in one conditional UPDATE. Retrying a
// claim with the same receipt can recover the code after a dropped connection.
const table = 'ai_product_invites'
const schema = `CREATE TABLE IF NOT EXISTS ai_product_invites (
  id TEXT PRIMARY KEY, product TEXT NOT NULL, code TEXT NOT NULL,
  publisher TEXT NOT NULL, created INTEGER NOT NULL, claimed_by TEXT,
  receipt TEXT, claimed INTEGER, UNIQUE(product, code)
)`
const reply = (data, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } })
const day = 86400
const now = () => Math.floor(Date.now() / 1000)

async function visitor(request) {
  const input = Math.floor(now() / day) + ':' + (request.headers.get('CF-Connecting-IP') || 'local')
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input))
  return Array.from(new Uint8Array(bytes), n => n.toString(16).padStart(2, '0')).join('')
}
async function handle({ request, env }) {
  const db = env.UNNOTICED_DB
  if (!db) return reply({ error: 'unavailable' }, 503)
  await db.prepare(schema).run()
  const time = now()
  const cutoff = time - 7 * day
  if (request.method === 'GET') {
    const { results } = await db.prepare(`SELECT id, product, created FROM ${table}
      WHERE claimed IS NULL AND created > ? ORDER BY created DESC LIMIT 60`).bind(cutoff).all()
    return reply({ items: results })
  }
  if (request.method !== 'POST') return reply({ error: 'method' }, 405)
  if (request.headers.get('origin') !== new URL(request.url).origin ||
      !request.headers.get('content-type')?.startsWith('application/json')) return reply({ error: 'origin' }, 403)
  if (Number(request.headers.get('content-length')) > 1024) return reply({ error: 'invalid' }, 413)
  const reader = request.body?.getReader()
  if (!reader) return reply({ error: 'invalid' }, 400)
  const decoder = new TextDecoder()
  let raw = '', size = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.length
    if (size > 1024) { await reader.cancel(); return reply({ error: 'invalid' }, 413) }
    raw += decoder.decode(value, { stream: true })
  }
  let form
  try { form = JSON.parse(raw + decoder.decode()) } catch { return reply({ error: 'invalid' }, 400) }
  const actor = await visitor(request)
  if (form?.action === 'share') {
    const product = String(form.product || '').trim()
    const code = String(form.code || '').trim()
    if (!/^[\p{L}\p{N}][\p{L}\p{N} ._-]{0,39}$/u.test(product) ||
        !/^[a-zA-Z0-9_-]{4,32}$/.test(code)) return reply({ error: 'invalid' }, 400)
    await db.prepare(`DELETE FROM ${table} WHERE created <= ?`).bind(cutoff).run()
    const result = await db.prepare(`INSERT OR IGNORE INTO ${table} (id,product,code,publisher,created)
      SELECT ?,?,?,?,? WHERE (SELECT count(*) FROM ${table} WHERE publisher = ?) < 5
      AND (SELECT count(*) FROM ${table} WHERE created >= ?) < 300`)
      .bind(crypto.randomUUID(), product, code, actor, time, actor, time - day).run()
    return result.meta.changes ? reply({ ok: true }, 201) : reply({ error: 'duplicate_or_limit' }, 409)
  }
  const uuid = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i
  if (form?.action !== 'claim' || !uuid.test(form.id) || !uuid.test(form.receipt)) return reply({ error: 'invalid' }, 400)
  const args = [actor, form.receipt, time, form.id, cutoff, actor]
  await db.prepare(`UPDATE ${table} SET claimed_by = ?, receipt = ?, claimed = ?
    WHERE id = ? AND created > ? AND claimed IS NULL AND
    (SELECT count(*) FROM ${table} WHERE claimed_by = ?) < 10`).bind(...args).run()
  const row = await db.prepare(`SELECT product, code FROM ${table} WHERE id = ? AND receipt = ? AND created > ?`)
    .bind(form.id, form.receipt, cutoff).first()
  return row ? reply(row) : reply({ error: 'claimed_or_limit' }, 409)
}
export const onRequest = context => handle(context).catch(() => reply({ error: 'unavailable' }, 503))
