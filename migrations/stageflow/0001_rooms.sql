CREATE TABLE IF NOT EXISTS stageflow_rooms (
  id TEXT PRIMARY KEY,
  admin_hash TEXT NOT NULL,
  view_hash TEXT NOT NULL,
  state TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 0,
  creator_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS stageflow_rooms_expiry ON stageflow_rooms(expires_at);
CREATE INDEX IF NOT EXISTS stageflow_rooms_creator ON stageflow_rooms(creator_hash, created_at);
