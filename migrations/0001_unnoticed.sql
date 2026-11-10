-- 无人问津：待审核作品、点赞、限流。
-- 远程 D1 不会由仓库自动创建。部署步骤见 wrangler.jsonc 顶部注释。
-- 本地：npx wrangler d1 migrations apply unnoticed --local

CREATE TABLE IF NOT EXISTS works (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  pitch TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  image_url TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  like_count INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  reviewed_at INTEGER
);

-- 同一个链接在待审核或已公开时不能再投一次。拒绝后可以重新提交。
CREATE UNIQUE INDEX IF NOT EXISTS works_url_open
  ON works (url)
  WHERE status IN ('pending', 'approved');

CREATE INDEX IF NOT EXISTS works_public_recent
  ON works (status, created_at DESC);

CREATE TABLE IF NOT EXISTS work_likes (
  work_id TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (work_id, visitor_id)
);

CREATE TABLE IF NOT EXISTS rate_buckets (
  bucket TEXT PRIMARY KEY,
  hits INTEGER NOT NULL,
  reset_at INTEGER NOT NULL
);
