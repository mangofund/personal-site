[中文](./README.md) · [English](./README.en.md)

# PRO的茶里芒果

个人站 [promangofund.com](https://promangofund.com)（英文站名 Pro's MangoFund）。中文在站点根路径，英文在 [`/en/`](https://promangofund.com/en/)。内容是 Markdown，用 VitePress 建成静态站。

仓库：<https://github.com/mangofund/personal-site>

## 技术栈

- [VitePress](https://vitepress.dev/) 1.6（`package.json` 里 `vitepress` `^1.6.4`）
- 主题、导航、侧栏：`docs/.vitepress/`（入口 `theme/index.ts`，样式 `theme/custom.css`）
- 中英是 VitePress 的两套 locale：默认 `root`（中文），`en` 对应 `/en/`
- Node：`.github/workflows/deploy.yml` 用 20，`.github/workflows/validate-site-build.yml` 用 22。本地用 20 或 22 即可。仓库没有 `engines` 字段

## 本地运行

```bash
npm ci
npm run docs:dev
```

`docs:dev` 会先执行 `scripts/patch-vitepress-locale.mjs`（修正 VitePress 英文首页的语言判断）和 `scripts/pack-skills.mjs`（打包技能 ZIP），再启动 `vitepress dev docs`。

## 构建与预览

对齐主站域名时：

```bash
SITE_URL=https://promangofund.com npm run docs:build
npm run docs:preview
```

`npm run docs:build` 的顺序：

1. `scripts/patch-vitepress-locale.mjs`
2. `scripts/pack-skills.mjs`
3. `scripts/gen-seo.mjs` — sitemap、robots、feed、llms.txt、`_headers`、`articles.json`，并重写首页 / 归档 / 栏目列表里的生成区块
4. `vitepress build docs`
5. `scripts/fix-logo-alt.mjs` — 给导航 logo 补 alt
6. `scripts/fix-img-dims.mjs` — 给本地图片补 width / height
7. `scripts/check-seo.mjs` — 检查 `docs/.vitepress/dist`，失败则构建失败

产物在 `docs/.vitepress/dist`。`docs:preview` 即 `vitepress preview docs`（默认端口 4173）。重新构建后要重启预览，否则新的带哈希资源会 404。

不设 `SITE_URL` 时，规范域名默认是 `https://mangofund.github.io`（见 `docs/.vitepress/config.ts` 和 `scripts/gen-seo.mjs`）。查本地构建是否像主站，加上 `SITE_URL=https://promangofund.com`。主站 `base` 是 `/`，不要设 `BASE_PATH`。

本地构建会改写这些生成区块，不要手改：

- `docs/index.md` 的 `LATEST-START` … `LATEST-END`
- `docs/archive.md` 和 `docs/en/archive.md` 的 `ARCHIVE-START` … `ARCHIVE-END`
- `docs/ai/index.md`、`docs/thinking/index.md`、`docs/investment/index.md`，以及 `docs/en/` 下同名栏目页里的 `*-FEED` 区块。英文列表只收 `docs/en/` 里的文章

`scripts/content-dates.json` 和 `docs/public/articles.json` 会随 git 时间格式变动。没有故意改内容时，提交前还原：

```bash
git checkout -- scripts/content-dates.json docs/public/articles.json
```

## 内容目录

文章都在 `docs/`。英文稿放在对应的 `docs/en/` 下，相对路径与中文一致时才会输出 hreflang。英文稿不进中文 RSS、首页 Latest、归档和 `articles.json`。

| 路径 | 内容 |
|---|---|
| `docs/index.md` | 中文首页 |
| `docs/en/index.md` | 英文首页 |
| `docs/ai/` | AI。子目录：`trends`、`agents`、`coding`、`workflows`、`products`、`thinking`。栏目页按子目录筛选，显示名在 `scripts/gen-seo.mjs` 的 `AI_TABS` |
| `docs/investment/` | 投资 |
| `docs/thinking/` | 思考 |
| `docs/skills/` | 技能页。条目数据在 `docs/.vitepress/theme/homeSkills.ts`；源文件在 `docs/public/skills/sources/`，构建时打成 ZIP |
| `docs/projects/` | 项目 |
| `docs/about/` | 关于 |
| `docs/archive.md`、`docs/en/archive.md` | 中文归档、英文归档 |
| `docs/friends.md`、`subscribe.md`、`guestbook.md`、`sponsor.md`、`privacy.md`、`utm.md` | 友链、订阅、留言、赞助、隐私、UTM 生成页。英文稿目前有 `docs/en/friends.md`、`docs/en/sponsor.md` |

`docs/public/skills/**/*.md` 被 `srcExclude` 排除，不会变成站内页面。图片放 `docs/public/images/`，上传前压到 200KB 以内，宽度不超过 1600px。

`docs/en/` 有首页、AI / 思考 / 投资栏目页、归档、部分文章、技能、项目、关于、友链和赞助。栏目页在，不代表每篇中文稿都有英文版。思考栏目页目前没有英文文章，构建后列表是空的。

## 新增文章

1. 在对应目录加 Markdown，例如 `docs/ai/coding/my-post.md`。有英文版时再加 `docs/en/ai/coding/my-post.md`。
2. Frontmatter 至少写 `title`、`description`、`date`、`category`。栏目常用值是 `AI`、`投资`、`思考`。可选 `image`（封面和分享图）、`tags`、`updated`。`draft: true` 或 `noindex: true` 的页面不会进 sitemap 和栏目列表。
3. 需要出现在侧栏时，改 `docs/.vitepress/config.ts` 的 `sidebar`（英文在 `locales.en.themeConfig.sidebar`）。栏目列表本身由 `gen-seo.mjs` 按 frontmatter 生成，不用手改 `*-FEED`。
4. 构建一次，确认列表、sitemap 和 SEO 检查通过。

## 在浏览器里改文章

管理页是 [Sveltia CMS](https://sveltiacms.app/)，地址 <https://promangofund.com/admin/>（`/admin/index.html` 也可以）。页脚的「编辑」链到这里，并加了 `target="_self"`，避免被 VitePress 的站内路由当成一篇不存在的文章。

本地 `npm run docs:dev` 不会把 `/admin/` 落到 `index.html`，请打开 <http://localhost:5173/admin/index.html>。构建后的预览和 Cloudflare Pages 上，`/admin/` 可用。

登录用 **Sign In Using Access Token**（文档里也叫 Sign In with Token），贴 GitHub Personal Access Token。旁边的 Sign In with GitHub 会走 Netlify OAuth，这个站不在 Netlify 上，点了不会成功。不要开 Netlify Identity，`docs/public/admin/config.yml` 里也不要写 `base_url`（OAuth 以后再加）。界面语言跟着浏览器，中文浏览器会显示中文。

Fine-grained token：仓库选 `mangofund/personal-site`，权限：

- Contents：Read and write（读文章、提交到 `main`）
- Pull requests：Read and write（登录页预选；当前是直接提交 `main`，还没用 Editorial Workflow）

经典 token 用 `repo` scope 即可。令牌只留在浏览器里，不要写进仓库。

保存会直接提交 `main`，Cloudflare Pages 大约 1 分钟上线。栏目 `index.md` 里的列表由 `scripts/gen-seo.mjs` 生成，不要在 CMS 里改那一块。新建文章时把 Slug 改成英文短横线文件名（例如 `claude-code-team-review`），和现有文章一致。需要出现在侧栏时，仍改 `docs/.vitepress/config.ts`。封面传到媒体库，落在 `docs/public/images/`，文章里写 `/images/...`。

## 部署

主站是 **Cloudflare Pages**，不是 GitHub Pages。

仓库里没有 Wrangler 配置，Pages 项目接在 Cloudflare 控制台。依据在仓库里：`functions/`（Pages Functions）、`docs/public/_redirects`、构建时生成的 `_headers`，以及 `scripts/check-seo.mjs` 允许的域名 `promangofund.com`、`mangofund.github.io`、`mangofund.pages.dev`。

- 主域名：<https://promangofund.com>
- `mangofund.pages.dev` 同时保留，不做 301（见 `docs/public/_redirects`）
- 推到 `main` 后由 Pages 自动构建上线。分支预览：`https://<分支名，/ 换成 ->.mangofund.pages.dev`
- 主站 `base` 为 `/`。Pages 默认浅克隆；`gen-seo.mjs` 会尝试加深 git 历史，失败则用 frontmatter 和 `scripts/content-dates.json` 写 lastmod
- `functions/api/hit.ts`、`stats.ts`、`skill-rank.ts` 只在 Pages 上生效。未绑定 KV 时统计接口静默返回，不影响页面

### GitHub Pages 镜像

`.github/workflows/deploy.yml` 在推到 `main`（以及手动触发）时另行构建，并用 `actions/deploy-pages` 发到**本仓库**的 GitHub Pages。构建环境：

- `BASE_PATH` = `/${仓库名}/`，当前仓库是 `personal-site`，即 `/personal-site/`
- `CANONICAL_URL` = `https://promangofund.com`（镜像页的 canonical 指回主站）
- `SITE_URL` = `https://tsla2000.github.io`

最后这项和现在的仓库所有者 `mangofund` 不一致，也不是 `check-seo.mjs` 里允许的 `https://mangofund.github.io`。主站不使用这个 `SITE_URL`。旧 README 里「以后绑定自定义域名时把 `BASE_PATH` 改成 `/`」已经过时：自定义域名在 Cloudflare 上，`base` 本来就是 `/`。

### 不会在每次推送时运行的工作流

| 文件 | 作用 |
|---|---|
| `.github/workflows/validate-site-build.yml` | 对 `main` 的 PR，以及推送到 `main` 时，用 Node 22 跑 `npm ci` 和 `npm run docs:build` |
| `.github/workflows/deploy-cos.yml` | 腾讯云 COS 镜像。2026-10-06 起停用自动触发，只留 `workflow_dispatch` |
| `.github/workflows/publish-mp.yml` | 把指定 Markdown 发到微信公众号草稿或直接发表，手动触发 |

## 脚本

| 脚本 | 作用 |
|---|---|
| `scripts/patch-vitepress-locale.mjs` | 修补 VitePress，让英文首页走 `en` locale |
| `scripts/pack-skills.mjs` | 把 `docs/public/skills/sources/` 打成 ZIP，并写技能包清单 |
| `scripts/gen-seo.mjs` | 生成 SEO 文件，重写首页 / 归档 / 栏目列表 |
| `scripts/fix-logo-alt.mjs` | 构建后给 logo 补 alt |
| `scripts/fix-img-dims.mjs` | 构建后给图片补尺寸 |
| `scripts/check-seo.mjs` | 构建后门禁 |
| `scripts/sync-cos.py` | COS 同步，仅手动工作流使用 |
| `scripts/mp-publish.py` | 公众号发布，仅手动工作流使用 |

流量和技能事件的口径在 [ANALYTICS_SETUP.md](./ANALYTICS_SETUP.md)。

## 链接

- 主站：<https://promangofund.com>
- 英文：<https://promangofund.com/en/>
- RSS：<https://promangofund.com/feed.xml>
- Pages 域名：<https://mangofund.pages.dev>
