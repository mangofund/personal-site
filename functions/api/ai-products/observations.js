import { regions, subscriptions, trackers, initialStore, initialFx, initialSignals, storeUrl, snapshotDate } from '../../../lib/ai-product-data.mjs'
import { initialCodex, refreshCodex } from '../../../lib/codex-reset.mjs'

const hour = 3600
const day = 24 * hour
const today = () => new Date(Date.now() + 8 * hour * 1000).toISOString().slice(0, 10)
const namespace = 'ai-products:v2:'

async function observe(key, fallback, ttl, read, kv) {
  const cached = kv && await kv.get(namespace + key, 'json').catch(() => null)
  if (cached && Date.now() - cached.at < ttl * 1000) return cached.data
  try {
    const data = await read(cached?.data || fallback)
    if (kv) await kv.put(namespace + key, JSON.stringify({ at: Date.now(), data })).catch(() => {})
    return data
  } catch {
    return cached?.data || fallback
  }
}

async function remote(url) {
  const response = await fetch(url, {
    headers: { 'Accept-Language': 'en-US,en;q=0.8' }, signal: AbortSignal.timeout(7000),
    cf: { cacheTtl: hour, cacheEverything: true }
  })
  if (!response.ok) throw new Error('Source unavailable')
  return response
}

// Collect rendered element text, including inline children and streamed chunks.
async function collect(response, selector) {
  const entries = []
  const stack = []
  await new HTMLRewriter().on(selector, {
    element(el) {
      const item = { href: el.getAttribute('href'), text: '' }
      stack.push(item)
      el.onEndTag(() => { stack.pop(); entries.push(item) })
    },
    text(chunk) { if (stack.length) stack[stack.length - 1].text += chunk.text }
  }).transform(response).arrayBuffer()
  return entries
}

export function pricesFromRows(entries, plans, region) {
  const symbol = ({ gb: '£', ph: '₱' })[region] || '$'
  return plans.map(plan => {
    const amounts = entries.flatMap(({ text }) => {
      const row = text.replace(/\s+/g, ' ').trim()
      if (!row.startsWith(plan)) return []
      const match = /^(?:US|CA|CAD|USD|GBP)?\s*([$£₱])\s*([\d,]+\.\d{2})$/.exec(row.slice(plan.length).trim())
      return match && match[1] === symbol ? [Number(match[2].replace(/,/g, ''))] : []
    })
    return amounts.length ? Math.min(...amounts) : null
  })
}

async function prices(product, kv) {
  const stores = await Promise.all(Object.keys(regions).map(region =>
    observe('store:' + product + ':' + region, initialStore(product, region), 8 * hour, async previous => {
      const entries = await collect(await remote(storeUrl(product, region)), 'li')
      const values = pricesFromRows(entries, subscriptions[product].plans, region)
      if (values.every(value => value === null)) throw new Error('No matching listings')
      const date = today()
      const past = (previous.history || []).filter(row => row.date < date && row.date >= new Date(Date.now() - 30 * day * 1000).toISOString().slice(0, 10))
      if (previous.date !== date && Date.parse(date) - Date.parse(previous.date) <= 30 * day * 1000 && !past.some(row => row.date === previous.date))
        past.push({ date: previous.date, prices: previous.prices })
      return { region, date, prices: values, history: past }
    }, kv)))
  const fx = await observe('fx', initialFx, 12 * hour, async () => {
    const value = await (await remote('https://api.frankfurter.dev/v1/latest?base=CNY')).json()
    if (value.base !== 'CNY' || !/^\d{4}-\d{2}-\d{2}$/.test(value.date) ||
        !Object.values(regions).every(r => value.rates?.[r.currency] > 0)) throw new Error('Missing FX')
    return { date: value.date, rates: value.rates }
  }, kv)
  return { stores, fx }
}

export function signalDate(text, date) {
  const match = /(\d{1,2})\s*\/\s*(\d{1,2})\s*·/.exec(text)
  if (!match) return null
  const suffix = match[1].padStart(2, '0') + '-' + match[2].padStart(2, '0')
  const year = Number(date.slice(0, 4)) - Number(suffix > date.slice(5))
  const iso = year + '-' + suffix
  const parsed = Date.parse(iso)
  return Number.isFinite(parsed) && new Date(parsed).toISOString().startsWith(iso) ? iso : null
}
async function otherSignals(kv) {
  const fallback = Object.fromEntries(Object.entries(initialSignals).map(([id, date]) => [id, { checked: snapshotDate, dates: [date] }]))
  return observe('signals', fallback, hour, async previous => {
    const entries = await collect(await remote('https://betteropc.com/'), 'a[href*="/ai-products/reset-signals/"]')
    const next = { ...previous }
    let found = false
    for (const { href, text } of entries) {
      const id = href?.split('/').pop()
      if (id === 'codex' || !Object.hasOwn(trackers, id)) continue
      const date = signalDate(text, today())
      if (!date) continue
      next[id] = { checked: today(), dates: [...new Set([date, ...next[id].dates])].sort().reverse().slice(0, 60) }
      found = true
    }
    if (!found) throw new Error('No dated reports')
    return next
  }, kv)
}

export async function onRequestGet({ request, env }) {
  const product = new URL(request.url).searchParams.get('product')
  if (product !== 'signals' && !Object.hasOwn(subscriptions, product)) return new Response(null, { status: 400 })
  let data
  if (product === 'signals') {
    const [others, codex] = await Promise.all([
      otherSignals(env.STATS_KV),
      observe('codex-x', initialCodex, hour, previous => refreshCodex(previous, env.X_BEARER_TOKEN, remote, today), env.STATS_KV)
    ])
    data = { ...others, codex: { ...codex, dates: [...new Set(codex.posts.map(post => post.date))] } }
  } else {
    data = await prices(product, env.STATS_KV)
  }
  return Response.json(data, { headers: { 'Cache-Control': 'public, max-age=900' } })
}
