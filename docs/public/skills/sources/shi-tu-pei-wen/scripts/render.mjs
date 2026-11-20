// render.mjs — 把一张 HTML 卡片截成 PNG（Playwright）
// 用法：node render.mjs --html 卡片.html --out 输出.png [--width 2100] [--height 900] [--selector .card]
import { chromium } from 'playwright-core';
import path from 'node:path';

function opt(name, fallback) {
  const i = process.argv.indexOf(name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const html = opt('--html', '');
const out = opt('--out', '');
const width = parseInt(opt('--width', '2100'), 10);
const height = parseInt(opt('--height', '900'), 10);
const selector = opt('--selector', '.card');

if (!html || !out) {
  console.error('用法: node render.mjs --html 卡片.html --out 输出.png [--width 2100] [--height 900]');
  process.exit(2);
}

const browser = await chromium.launch({ args: ['--no-sandbox', '--force-color-profile=srgb'] });
try {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.resolve(html), { waitUntil: 'load' });
  await page.waitForTimeout(400);
  const el = await page.$(selector);
  if (!el) {
    console.error('找不到元素：' + selector);
    process.exit(3);
  }
  // 卡片尺寸以 --width/--height 为准：模板写死 2100×900 时也按传入尺寸改，
  // 否则 16:9 渲出来仍是 2100×900（截图截的是元素，不是 viewport）。
  await el.evaluate((node, size) => {
    node.style.width = size.w + 'px';
    node.style.height = size.h + 'px';
  }, { w: width, h: height });
  await el.screenshot({ path: out });
  console.log('已出图：' + out + '（' + width + 'x' + height + '）');
} finally {
  await browser.close();
}
