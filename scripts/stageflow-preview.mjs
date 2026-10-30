// Explicit preview-only deployment. The website's Git-based production config stays untouched.
import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
if (Number(process.versions.node.split('.')[0]) < 22) throw new Error('Use Node.js 22 or newer.');
const branch = execFileSync('git', ['branch', '--show-current'], {cwd:root,encoding:'utf8'}).trim();
if (branch !== 'feat/stageflow-live') throw new Error('This script only deploys feat/stageflow-live.');
const configPath = join(root, 'wrangler.jsonc');
if (existsSync(configPath)) throw new Error('A Wrangler config already exists; it will not be overwritten.');
writeFileSync(configPath, readFileSync(join(root,'wrangler.stageflow.jsonc')));
let result;
try {
  result = spawnSync(process.execPath, [join(root,'node_modules/wrangler/bin/wrangler.js'),
    'pages','deploy','docs/.vitepress/dist','--project-name','mangofund','--branch',branch], {cwd:root,stdio:'inherit'});
} finally { unlinkSync(configPath); }
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
