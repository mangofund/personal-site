// Public App Store in-app purchase listings. Identical names can cover several
// billing periods. Keep a comparable entry per storefront and link the receipt source.
export const regions = {
  us: { zh: '美国', en: 'United States', currency: 'USD' },
  ca: { zh: '加拿大', en: 'Canada', currency: 'CAD' },
  gb: { zh: '英国', en: 'United Kingdom', currency: 'GBP' }
}
export const subscriptions = {
  codex: { name: 'ChatGPT · Codex', app: 'chatgpt/id6448311069', plans: ['ChatGPT Plus', 'ChatGPT Pro 100', 'ChatGPT Pro 200'] },
  claude: { name: 'Claude', app: 'claude-by-anthropic/id6473753684', plans: ['Claude Pro - Monthly', 'Claude Max - Monthly', 'Claude Ultra - Monthly'] },
  grok: { name: 'Grok', app: 'grok/id6670324846', plans: ['SuperGrok', 'SuperGrok Plus', 'SuperGrok Heavy'] }
}
export const trackers = {
  codex: 'Codex', 'claude-code': 'Claude Code', 'grok-bot': 'Grok Bot',
  qoder: 'Qoder', glm: 'GLM', antigravity: 'Antigravity'
}
export const snapshotDate = '2026-11-24'
export const initialFx = { date: '2026-11-23', rates: { USD: 0.15004, CAD: 0.2155, GBP: 0.11477 } }
const amounts = {
  codex: { us: [19.99, 100, 200], ca: [24.99, 152.99, 249], gb: [19.99, 88.9, 200] },
  claude: { us: [20, 124.99, 249.99], ca: [28, 179.99, 349.99], gb: [20, 119.99, 249.99] },
  grok: { us: [30, 100, 300], ca: [40, 129, 400], gb: [30, 100, 300] }
}
export function storeUrl(product, region) {
  return 'https://apps.apple.com/' + region + '/app/' + subscriptions[product].app
}
export function initialStore(product, region) {
  return { region, date: snapshotDate, prices: amounts[product][region] }
}
export function signalUrl(product) {
  return 'https://betteropc.com/ai-products/reset-signals/' + product
}
export const initialSignals = {
  codex: '2026-11-13', 'claude-code': '2026-11-11', 'grok-bot': '2026-11-10',
  qoder: '2026-09-15', glm: '2026-08-11', antigravity: '2026-11-24'
}
