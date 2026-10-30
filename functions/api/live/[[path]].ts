import { applyCommand, initialState, displayState, settle, CommandError } from '../../../docs/public/live/engine.js';

type Room = { id: string; admin_hash: string; view_hash: string; state: string; version: number; expires_at: number };
const MAX_BODY = 8192;
const headers = {
  'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store',
  'referrer-policy': 'no-referrer', 'x-content-type-options': 'nosniff'
};
function json(data: unknown, status = 200) { return new Response(JSON.stringify(data), { status, headers }); }
async function digest(value: string) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(bytes)].map(b => b.toString(16).padStart(2, '0')).join('');
}
function token() { return [...crypto.getRandomValues(new Uint8Array(32))].map(b => b.toString(16).padStart(2, '0')).join(''); }
function equal(a: string, b: string) {
  // Compare the fixed-length digests without exiting on the first differing byte.
  if (a.length !== b.length) return false;
  let diff = 0; for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
async function body(request: Request): Promise<Record<string, unknown>> {
  if (!request.headers.get('content-type')?.startsWith('application/json')) throw new CommandError('Use application/json.');
  if (Number(request.headers.get('content-length')) > MAX_BODY) throw new CommandError('Request too large.');
  const reader = request.body?.getReader(); if (!reader) throw new CommandError('Missing body.');
  let size = 0, raw = ''; const decoder = new TextDecoder();
  try {
    while (true) {
      const part = await reader.read(); if (part.done) break;
      size += part.value.byteLength;
      if (size > MAX_BODY) { await reader.cancel(); throw new CommandError('Request too large.'); }
      raw += decoder.decode(part.value, { stream: true });
    }
    const parsed = JSON.parse(raw + decoder.decode());
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error();
    return parsed;
  } catch (error) {
    if (error instanceof CommandError) throw error;
    throw new CommandError('Invalid JSON.');
  } finally { reader.releaseLock(); }
}

export const onRequest: PagesFunction<Env> = async context => {
  const { request, env } = context, url = new URL(request.url);
  const path = url.pathname.replace(/^\/api\/live\/?/, '').split('/').filter(Boolean);
  if (request.method === 'OPTIONS') return new Response(null, { status: 405, headers });
  if (!['GET', 'POST'].includes(request.method)) return json({ error: 'Method not allowed.' }, 405);
  if (request.method === 'POST' && request.headers.get('origin') !== url.origin) return json({ error: 'Same-origin requests only.' }, 403);
  if (path.join('/') === 'status' && request.method === 'GET') {
    return json({ cloud: Boolean(env.STAGEFLOW_DB), tiktok: false, source: 'demo', pollingMs: 2000 });
  }
  if (!env.STAGEFLOW_DB) return json({ error: 'Cloud rooms are not enabled on this deployment. Local demo is available.', code: 'not_configured' }, 503);
  const db = env.STAGEFLOW_DB;
  try {
    if (path.join('/') === 'rooms' && request.method === 'POST') {
      const input = await body(request), now = Date.now();
      let state = initialState();
      if (input.config) state = applyCommand(state, { ...(input.config as object), type: 'config' }, now);
      // Daily hashed address is used only for room-creation abuse control; never stored raw.
      const creator = await digest(`${request.headers.get('cf-connecting-ip') || 'local'}:${Math.floor(now / 86400000)}`);
      const recent = await db.prepare('SELECT COUNT(*) AS count FROM stageflow_rooms WHERE creator_hash = ?1 AND created_at > ?2').bind(creator, now - 86400000).first<{ count: number }>();
      if ((recent?.count || 0) >= 5) return json({ error: 'Daily room limit reached. Reopen an existing control link.' }, 429);
      const id = crypto.randomUUID(), adminToken = token(), viewToken = token(), expiresAt = now + 7 * 86400000;
      await db.prepare('INSERT INTO stageflow_rooms (id, admin_hash, view_hash, state, creator_hash, created_at, expires_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)')
        .bind(id, await digest(adminToken), await digest(viewToken), JSON.stringify(state), creator, now, expiresAt).run();
      context.waitUntil(db.prepare('DELETE FROM stageflow_rooms WHERE expires_at < ?1').bind(now).run().then(() => undefined));
      return json({ id, adminToken, viewToken, state, version: 0, expiresAt }, 201);
    }
    if (path.length < 2 || path[0] !== 'rooms' || !/^[a-f0-9-]{36}$/.test(path[1])) return json({ error: 'Not found.' }, 404);
    const credential = request.headers.get('authorization')?.replace(/^Bearer /, '') || '';
    if (!/^[a-f0-9]{64}$/.test(credential)) return json({ error: 'A valid room access link is required.' }, 401);
    const room = await db.prepare('SELECT id, admin_hash, view_hash, state, version, expires_at FROM stageflow_rooms WHERE id = ?1').bind(path[1]).first<Room>();
    if (!room || room.expires_at < Date.now()) return json({ error: 'This room has expired or does not exist.' }, 404);
    const hash = await digest(credential), isAdmin = equal(hash, room.admin_hash), isViewer = equal(hash, room.view_hash);
    if (!isAdmin && !isViewer) return json({ error: 'Access link is invalid or was revoked.' }, 403);
    if (path.length === 2 && request.method === 'GET') {
      const state = settle(JSON.parse(room.state));
      return json({ id: room.id, version: room.version, expiresAt: room.expires_at, state: isAdmin ? state : displayState(state), role: isAdmin ? 'admin' : 'viewer' });
    }
    if (!isAdmin) return json({ error: 'Display links cannot control a room.' }, 403);
    if (path.length === 3 && path[2] === 'rotate' && request.method === 'POST') {
      const viewToken = token();
      await db.prepare('UPDATE stageflow_rooms SET view_hash = ?1 WHERE id = ?2').bind(await digest(viewToken), room.id).run();
      return json({ viewToken });
    }
    if (path.length === 3 && path[2] === 'commands' && request.method === 'POST') {
      const input = await body(request), state = JSON.parse(room.state);
      if (typeof input.requestId !== 'string' || !/^[a-f0-9-]{36}$/.test(input.requestId)) throw new CommandError('Invalid request ID.');
      if (state.requests.includes(input.requestId)) return json({ state: settle(state), version: room.version, duplicate: true });
      if (!Number.isSafeInteger(input.version) || input.version !== room.version) return json({ error: 'The room changed in another controller. Refresh and try again.', code: 'conflict' }, 409);
      const next = applyCommand(state, input.command);
      next.requests = [...state.requests, input.requestId].slice(-200);
      const result = await db.prepare('UPDATE stageflow_rooms SET state = ?1, version = version + 1 WHERE id = ?2 AND version = ?3')
        .bind(JSON.stringify(next), room.id, room.version).run();
      if (result.meta.changes !== 1) return json({ error: 'The room changed. Refresh and try again.', code: 'conflict' }, 409);
      return json({ state: next, version: room.version + 1 });
    }
    return json({ error: 'Not found.' }, 404);
  } catch (error) {
    if (error instanceof CommandError) return json({ error: error.message }, 400);
    console.error(JSON.stringify({ event: 'stageflow_api_error', method: request.method, error: error instanceof Error ? error.name : 'unknown' }));
    return json({ error: 'The room service is temporarily unavailable. Your last saved state is unchanged.' }, 503);
  }
};
