<script setup>
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { regions, subscriptions, trackers, initialStore, initialFx, initialSignals, snapshotDate, storeUrl, signalUrl } from '../../../../lib/ai-product-data.mjs'

const props = defineProps({ english: Boolean })
const t = (zh, en) => props.english ? en : zh
const sections = ['pricing', 'resets', 'invites']
const labels = [t('订阅比价', 'Subscription prices'), t('额度重置', 'Quota resets'), t('邀请码共享', 'Invite exchange')]
const section = ref('pricing')
const selected = ref('codex'), plan = ref(0), tracker = ref('codex')
const prices = ref({}), fx = ref(initialFx)
const signals = ref(Object.fromEntries(Object.entries(initialSignals).map(([key, date]) => [key, { checked: snapshotDate, dates: [date] }])))
const items = ref([]), product = ref(''), code = ref(''), received = ref(null)
const listState = ref('loading'), notice = ref(''), busy = ref(false), refreshState = ref('')
let revision = 0, mounted = false
const pendingClaims = new Map()
const sorted = computed(() => Object.entries(regions).map(([id, region]) => {
  const entry = prices.value[selected.value]?.find(v => v.region === id) || initialStore(selected.value, id)
  const amount = entry.prices[plan.value]
  return { id, region, entry, amount, cny: amount == null ? null : amount / fx.value.rates[region.currency] }
}).sort((a, b) => (a.cny ?? Infinity) - (b.cny ?? Infinity)))
const money = value => value.toLocaleString(props.english ? 'en-US' : 'zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const endpoint = path => (import.meta.env.BASE_URL === '/' ? '' : 'https://promangofund.com') + '/api/ai-products/' + path
async function api(path, options) {
  const response = await fetch(endpoint(path), { signal: AbortSignal.timeout(20000), ...options })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'unavailable')
  return data
}
async function load() {
  const seq = ++revision
  const which = section.value, key = selected.value
  refreshState.value = 'loading'
  if (which === 'invites') listState.value = 'loading'
  try {
    if (which === 'invites') {
      const result = await api('invites')
      if (seq !== revision) return
      items.value = result.items
      listState.value = 'ready'
    } else {
      const data = await api('observations?product=' + (which === 'resets' ? 'signals' : key))
      if (seq !== revision) return
      if (which === 'resets') signals.value = data
      else { prices.value = { ...prices.value, [key]: data.stores }; fx.value = data.fx }
    }
    refreshState.value = ''
  } catch {
    if (seq !== revision) return
    refreshState.value = 'offline'
    if (which === 'invites') listState.value = 'error'
  }
}
function choose(value) {
  section.value = value
  history.replaceState(history.state, '', '#' + value)
}
function readHash() {
  const value = location.hash.slice(1)
  section.value = sections.includes(value) ? value : 'pricing'
}
onMounted(() => {
  const initial = section.value
  readHash()
  window.addEventListener('hashchange', readHash)
  mounted = true
  if (section.value === initial) load()
})
onBeforeUnmount(() => { window.removeEventListener('hashchange', readHash); revision++ })
watch(section, () => { notice.value = ''; if (mounted) load() })
watch(selected, () => { plan.value = 0; if (mounted) load() })
async function mutate(action, id) {
  if (busy.value) return
  busy.value = true
  notice.value = ''
  try {
    let receipt
    if (action === 'claim') {
      receipt = pendingClaims.get(id) || crypto.randomUUID()
      pendingClaims.set(id, receipt)
    }
    const result = await api('invites', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action === 'share' ? { action, product: product.value, code: code.value } : { action, id, receipt }) })
    if (action === 'share') { code.value = ''; notice.value = t('已发布，其他访客现在可以领取。', 'Published and ready to claim.') }
    else { received.value = result; pendingClaims.delete(id) }
    await load()
  } catch (err) {
    const errors = {
      invalid: t('请检查产品名称和邀请码格式。', 'Check the product name and code format.'),
      duplicate_or_limit: t('此码已分享，或已达到今日发布上限。', 'Already shared or the daily publishing limit was reached.'),
      claimed_or_limit: t('该码已被领取或过期，或已达到今日领取上限。', 'Taken, expired, or the daily claim limit was reached.')
    }
    notice.value = errors[err.message] || t('服务暂时不可用，请重试。', 'Service unavailable. Please try again.')
    if (err.message === 'claimed_or_limit') await load()
  } finally { busy.value = false }
}
</script>
<template>
<main class="desk">
  <header><h1>{{ t('AI 产品工具', 'AI product tools') }}</h1></header>
  <nav :aria-label="t('产品工具', 'Product tools')">
    <a v-for="(id, i) in sections" :key="id" :href="'#' + id" :aria-current="section === id ? 'page' : undefined" @click.prevent="choose(id)">{{ labels[i] }}</a>
  </nav>
  <section v-if="section === 'pricing'">
    <h2>{{ labels[0] }}</h2>
    <div class="controls"><label>{{ t('产品', 'Product') }}<select v-model="selected"><option v-for="(p, id) in subscriptions" :value="id">{{ p.name }}</option></select></label>
    <label>{{ t('套餐', 'Plan') }}<select v-model="plan"><option v-for="(p, i) in subscriptions[selected].plans" :value="i">{{ p }}</option></select></label></div>
    <p>{{ t('按人民币参考价排序。同名内购有多个价格时取最低展示价，扣费周期及税费请核对当地商店。', 'Sorted by estimated CNY. For duplicate purchase names, the lowest listed price is shown. Check the store for billing period and tax.') }}</p>
    <div class="table-wrap"><table><thead><tr><th>{{ t('地区 / 来源', 'Storefront') }}</th><th>{{ t('当地价格', 'Local price') }}</th><th>{{ t('约合人民币', 'Est. CNY') }}</th><th>{{ t('采集日期', 'Observed') }}</th></tr></thead>
    <tbody><tr v-for="row in sorted" :key="row.id"><td><a :href="storeUrl(selected, row.id)">{{ english ? row.region.en : row.region.zh }} ↗</a></td>
    <td>{{ row.amount == null ? '—' : row.region.currency + ' ' + money(row.amount) }}</td><td>{{ row.cny == null ? '—' : '¥' + money(row.cny) }}</td><td>{{ row.entry.date }}</td></tr></tbody></table></div>
    <small><a href="https://api.frankfurter.dev/v1/latest?base=CNY">Frankfurter</a> · {{ t('参考汇率日期', 'FX date') }} {{ fx.date }}</small>
    <details><summary>{{ t('近 30 天价格记录', 'Past 30 days of observations') }}</summary>
    <div v-for="row in sorted" :key="row.id"><strong>{{ english ? row.region.en : row.region.zh }}</strong>
    <span v-for="point in [...(row.entry.history || []), row.entry].filter(x => x.prices[plan] != null)" :key="point.date" class="point">{{ point.date }} · {{ row.region.currency }} {{ money(point.prices[plan]) }}</span></div>
    <small>{{ t('有访问时采样，缺少记录的日期留空。', 'Sampled on visits. Unobserved dates are omitted.') }}</small></details>
  </section>
  <section v-else-if="section === 'resets'">
    <h2>{{ labels[1] }}</h2><p>{{ t('跟踪 BetterOPC 公开报道的产品级额度重置。个人账号的剩余额度和刷新时间请在产品内查看。', 'Tracks product-wide reset reports from BetterOPC. Check your account for your own usage window.') }}</p>
    <div class="controls"><label>{{ t('产品', 'Product') }}<select v-model="tracker"><option v-for="(name, id) in trackers" :value="id">{{ name }}</option></select></label></div>
    <h3>{{ trackers[tracker] }}</h3><small>{{ t('来源核对日期', 'Source checked') }} {{ signals[tracker].checked }}</small>
    <ul><li v-for="date in signals[tracker].dates" :key="date"><time>{{ date }}</time> · {{ t('来源收录了额度重置', 'Quota reset reported') }}</li></ul>
    <a :href="signalUrl(tracker)">{{ t('查看来源及完整历史', 'Source and full history') }} ↗</a>
  </section>
  <section v-else>
    <h2>{{ labels[2] }}</h2><p>{{ t('分享单次使用的公开邀请码。每个码仅发给一位领取者，未领取的码保留七天。', 'Share a single-use public product invite. Each code goes to one visitor and expires here after seven days.') }}</p>
    <form @submit.prevent="mutate('share')" class="controls">
    <label>{{ t('产品名称', 'Product name') }}<input v-model.trim="product" maxlength="40" required /></label>
    <label>{{ t('邀请码', 'Invite code') }}<input v-model.trim="code" autocomplete="off" maxlength="32" pattern="[A-Za-z0-9_\-]{4,32}" required :placeholder="t('4–32 位字母、数字、_ 或 -', '4–32 letters, digits, _ or -')" /></label>
    <button :disabled="busy">{{ t('分享邀请码', 'Share invite') }}</button></form>
    <p v-if="notice" role="status">{{ notice }}</p>
    <p v-if="received" role="status" class="receipt">{{ received.product }} · {{ t('已领取，请保存', 'Claimed. Save your code') }} <strong>{{ received.code }}</strong></p>
    <h3>{{ t('可领取', 'Available invites') }}</h3>
    <p v-if="listState === 'loading'">{{ t('正在读取…', 'Loading…') }}</p>
    <p v-else-if="listState === 'error'">{{ t('暂时无法读取邀请码。', 'Invites are temporarily unavailable.') }} <button @click="load">{{ t('重试', 'Retry') }}</button></p>
    <p v-else-if="!items.length">{{ t('暂无可领取的邀请码。', 'No invites available yet.') }}</p>
    <ul v-else><li v-for="item in items" :key="item.id" class="invite"><span>{{ item.product }} · {{ new Date(item.created * 1000).toISOString().slice(0, 10) }}</span><button :disabled="busy" @click="mutate('claim', item.id)">{{ t('领取', 'Claim') }}</button></li></ul>
  </section>
  <small v-if="section !== 'invites' && refreshState === 'offline'" role="status">{{ t('在线更新暂不可用，当前显示最近保存的记录。', 'Live update unavailable. Showing saved observations.') }}</small>
</main>
</template>
<style scoped>
.desk{max-width:880px;margin:0 auto;padding:48px 24px 80px;color:var(--vp-c-text-1)}
h1{font-size:clamp(2rem,5vw,3rem);line-height:1.18;font-weight:700;letter-spacing:-.04em}
nav{display:flex;flex-wrap:wrap;gap:.3rem 1.4rem;border-bottom:1px solid var(--vp-c-divider);margin:24px 0 32px}
nav a{padding:10px 0;color:var(--vp-c-text-2);border-bottom:3px solid transparent;font-weight:600}
nav a[aria-current]{color:var(--vp-c-brand-1);border-color:currentColor}
h2{font-size:1.5rem;font-weight:650;margin-bottom:12px}h3{font-weight:650;font-size:1.1rem;margin:22px 0 8px}
p,small{color:var(--vp-c-text-2);line-height:1.65}p{margin:12px 0}small{display:block}
.controls{display:flex;gap:12px;flex-wrap:wrap;align-items:end;margin:18px 0}
label{display:grid;gap:5px;font-size:.86rem;font-weight:600}
select,input,button{font:inherit;border:1px solid var(--vp-c-divider);padding:8px 12px;border-radius:7px;background:var(--vp-c-bg);color:var(--vp-c-text-1)}
select{appearance:auto}button,summary{cursor:pointer}button{font-weight:600;color:var(--vp-c-brand-1)}button:disabled{opacity:.6}
a{color:var(--vp-c-brand-1)}section a{text-decoration:underline;text-underline-offset:3px}
.table-wrap{overflow:auto;margin:16px 0 8px}table{width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums;white-space:nowrap}th,td{text-align:left;padding:12px 10px;border-bottom:1px solid var(--vp-c-divider)}th{background:var(--vp-c-bg-soft);font-size:.85rem}
details{margin:20px 0;padding:12px 0;border-top:1px solid var(--vp-c-divider)}details div{margin-top:10px}.point{display:block;font-size:.88rem}
ul{padding:0;list-style:none}li{padding:8px 0}.invite{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--vp-c-divider)}
.receipt{padding:12px;background:var(--vp-c-bg-soft)}.receipt strong{user-select:all;overflow-wrap:anywhere}
@media(max-width:600px){.desk{padding:30px 16px 64px}th,td{padding:8px 6px;font-size:.8rem}.controls label{max-width:100%}nav{gap:1rem}}
</style>
