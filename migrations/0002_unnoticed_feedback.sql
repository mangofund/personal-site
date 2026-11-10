-- 无人问津：详情页评分与评论。无需审核，直接公开。
-- 远程 D1 不会由仓库自动创建。本地迁移：npm run unnoticed:d1:local
-- 远程应用（在 Mac 上，wrangler 已登录）：npx --yes wrangler@4.45.0 d1 migrations apply mangofund-unnoticed --remote --config local/unnoticed-d1.jsonc
-- 在迁移应用到远程之前，详情接口会返回 ratingsReady/commentsReady=false，详情页照常显示作品介绍，评分与评论区显示“稍后启用”，不报错。

CREATE TABLE IF NOT EXISTS work_ratings (
  work_id TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  stars INTEGER NOT NULL CHECK (stars BETWEEN 1 AND 5),
  created_at INTEGER NOT NULL,
  PRIMARY KEY (work_id, visitor_id)
);

CREATE INDEX IF NOT EXISTS work_ratings_work
  ON work_ratings (work_id, stars);

CREATE TABLE IF NOT EXISTS work_comments (
  id TEXT PRIMARY KEY,
  work_id TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS work_comments_work
  ON work_comments (work_id, created_at DESC);
