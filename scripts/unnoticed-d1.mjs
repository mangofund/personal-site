// 只对本地 D1 应用「无人问津」迁移。不连接、不创建远程库。
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const configPath = new URL('../local/unnoticed-d1.jsonc', import.meta.url)
const text = readFileSync(configPath, 'utf8')
const id = text.match(/"database_id"\s*:\s*"([^"]+)"/)?.[1] || ''
const PLACEHOLDER_IDS = new Set(['', '00000000-0000-4000-8000-000000000000'])
if (process.argv.includes('--remote') || PLACEHOLDER_IDS.has(id)) {
  console.error('拒绝：这个脚本只对本地 sqlite 做迁移，不会访问远程 D1，也不会执行 pages deploy。')
  process.exit(1)
}

const result = spawnSync(
  'npx',
  ['--yes', 'wrangler@4.45.0', 'd1', 'migrations', 'apply', 'mangofund-unnoticed', '--local', '--persist-to', '.wrangler/state', '--config', configPath.pathname],
  { stdio: 'inherit' }
)
process.exit(result.status ?? 1)
