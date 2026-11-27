# SEO / GEO 检查与维护

检查日期：2026-10-30。范围：本地 VitePress 源码与静态构建产物，未检查线上 CDN、Search Console 或实际排名。

## 本次修改

- 默认规范域名改为主站 promangofund.com，避免未设置环境变量时产生旧域名信号。显式环境变量继续支持镜像部署。
- 草稿从 sitemap 排除，HTML 标记 noindex, follow；noindex 页面保持可抓取，以便搜索引擎读取指令。草稿仍可通过 URL 访问，不能用于存放私密内容。
- 栏目与目录使用 CollectionPage，其他普通页面使用 WebPage，有发布日期的文章使用 Article；Open Graph 同步区分文章与网站页面。
- sitemap 的手动 updated 优先于 git 时间，与 Article 日期策略一致。
- 已有 frontmatter FAQ 在正文末尾静态渲染，问答与 JSON-LD 共用数据源。不会因为存在 FAQ 标记就获得富结果。
- 中英文关于页公开相同作者标识与已有账号链接，增强来源可识别性。
- 修复 llms.txt 的栏目 URL 尾斜杠。保留既有 AI 爬虫访问策略，不改变训练爬虫授权。
- 构建检查增加 canonical 唯一性、noindex 与 sitemap 一致性、栏目类型和 FAQ 可见区域检查。

## 内容维护

新文章写独立 title、description、date，实质更新时填写 updated。结论应有正文支持；涉及数字、产品变化和投资判断时，链接原始来源，说明数据日期、方法和个人判断边界。仅在确有问答价值时添加 faq，避免关键词堆砌或批量生成相似页面。

llms.txt 是补充导航，不是收录要求，也不能保证 AI 引用。GEO 的重点仍是可抓取正文、真实来源、明确作者、可靠内容与内部链接。

## 发布后验证

1. 确认主站及镜像的 canonical、robots、sitemap 都指向主站，CDN 没有阻挡搜索爬虫。
2. 在 Google Search Console 和 Bing Webmaster Tools 提交主站 sitemap；检查首页、栏目页、中英文文章的 URL 索引状态。
3. 持续观察展示、点击、有效索引与来自 AI 搜索的访问。当前没有接入后台数据，无法给出排名或引用提升结论。

参考：https://developers.google.com/search/docs/appearance/ai-features
