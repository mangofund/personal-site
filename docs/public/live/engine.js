export const GIFTS = [
  { id: 'heart', name: 'Heart', emoji: '💗', value: 1 },
  { id: 'rose', name: 'Rose', emoji: '🌹', value: 10 },
  { id: 'star', name: 'Star', emoji: '🌟', value: 52 },
  { id: 'castle', name: 'Castle', emoji: '🏰', value: 520 }
];

export function initialState() {
  return {
    title: 'The Spotlight Room',
    players: ['Luna', 'Coco', 'Aria', 'Mia'].map((name, id) => ({ id, name, score: 0 })),
    duration: 180, remaining: 180, deadline: null, status: 'ready', mode: 'regular',
    round: 1, giftCount: 0, teams: {}, history: [], events: [], requests: [], source: 'demo'
  };
}

export class CommandError extends Error {}
function requireThat(condition, message) { if (!condition) throw new CommandError(message); }
function integer(n, min, max) { return Number.isSafeInteger(n) && n >= min && n <= max; }
function text(v, max) { return typeof v === 'string' && v.trim().length > 0 && v.length <= max; }
export function participants(s) { return s.mode === 'pk' ? s.players.slice(0, 2) : s.players; }
export function seconds(s, now = Date.now()) {
  return s.status === 'running' ? Math.max(0, Math.ceil((s.deadline - now) / 1000)) : s.remaining;
}
function log(s, kind, detail, points, now) {
  s.events.push({ id: `${s.round}-${now}-${s.events.length}`, round: s.round, at: now, kind, detail, points });
  s.events = s.events.slice(-300);
}
function finish(s, now) {
  s.remaining = seconds(s, now); s.deadline = null; s.status = 'ended';
  const ps = participants(s), max = Math.max(...ps.map(p => p.score));
  log(s, 'end', { winners: max ? ps.filter(p => p.score === max).map(p => p.name).join(', ') : '' }, 0, now);
}
export function settle(state, now = Date.now()) {
  const s = structuredClone(state);
  if (s.status === 'running' && seconds(s, now) === 0) finish(s, s.deadline);
  return s;
}
function checkpoint(s) {
  s.history.push({ scores: s.players.map(p => p.score), teams: { ...s.teams }, giftCount: s.giftCount });
  s.history = s.history.slice(-50);
}

// Every command is reduced on the server in cloud mode. Clients never submit scores/state.
export function applyCommand(state, command, now = Date.now()) {
  const s = settle(state, now);
  requireThat(command && typeof command === 'object', 'Invalid command.');
  switch (command.type) {
    case 'start':
      requireThat(s.status === 'ready' || s.status === 'paused', 'Start a new round first.');
      s.deadline = now + s.remaining * 1000; s.status = 'running';
      log(s, 'start', {}, 0, now); break;
    case 'pause':
      requireThat(s.status === 'running', 'This round is not running.');
      s.remaining = seconds(s, now); s.deadline = null; s.status = 'paused';
      log(s, 'pause', {}, 0, now); break;
    case 'end':
      requireThat(s.status === 'running' || s.status === 'paused', 'This round is not active.');
      finish(s, now); break;
    case 'next':
      requireThat(s.status !== 'running' && s.status !== 'paused', 'End this round before starting another.');
      s.round++; s.players.forEach(p => { p.score = 0; }); s.teams = {}; s.history = [];
      s.giftCount = 0; s.deadline = null; s.remaining = s.duration; s.status = 'ready';
      log(s, 'next', {}, 0, now); break;
    case 'mode':
      requireThat(s.status === 'ready' && s.players.every(p => p.score === 0), 'Change modes in a fresh round.');
      requireThat(['regular', 'pk'].includes(command.mode), 'Invalid mode.');
      s.mode = command.mode; break;
    case 'config': {
      requireThat(s.status === 'ready' && s.players.every(p => p.score === 0), 'Edit settings in a fresh round.');
      requireThat(text(command.title, 40), 'Stage name must contain 1–40 characters.');
      requireThat(integer(command.duration, 10, 7200), 'Duration must be 10–7200 seconds.');
      requireThat(Array.isArray(command.names) && command.names.length >= 2 && command.names.length <= 8 && command.names.every(n => text(n, 20)), 'Add 2–8 names, each 1–20 characters.');
      s.title = command.title.trim(); s.duration = command.duration; s.remaining = command.duration;
      s.players = command.names.map((name, id) => ({ id, name: name.trim(), score: 0 }));
      s.history = []; s.teams = {}; break;
    }
    case 'gift': {
      requireThat(s.status === 'running', 'Start or resume the round before sending gifts.');
      const gift = GIFTS.find(g => g.id === command.giftId), ps = participants(s);
      requireThat(gift && integer(command.quantity, 1, 999), 'Invalid gift or quantity.');
      requireThat(text(command.user, 40), 'Enter a viewer name (1–40 characters).');
      requireThat(['direct', 'team', 'gift'].includes(command.rule), 'Invalid scoring rule.');
      requireThat(ps.some(p => p.id === command.target), 'Choose a participating creator.');
      checkpoint(s);
      const user = command.user.trim(), key = 'viewer:' + user;
      let target = command.target;
      if (command.rule === 'gift') target = ps[GIFTS.indexOf(gift) % ps.length].id;
      if (command.rule === 'team') {
        requireThat(Object.hasOwn(s.teams, key) || Object.keys(s.teams).length < 500, 'Viewer limit reached for this round.');
        if (!Object.hasOwn(s.teams, key)) s.teams[key] = target;
        target = s.teams[key];
      }
      const player = ps.find(p => p.id === target), points = gift.value * command.quantity;
      player.score += points; s.giftCount += command.quantity;
      log(s, 'gift', { user, gift: gift.name, quantity: command.quantity, player: player.name }, points, now);
      break;
    }
    case 'adjust': {
      requireThat(s.status !== 'ended', 'Finished rounds are read-only.');
      const p = participants(s).find(p => p.id === command.target);
      requireThat(p && integer(command.delta, -1000000, 1000000) && command.delta !== 0, 'Choose a participating creator and a nonzero integer.');
      checkpoint(s); const delta = Math.max(0, p.score + command.delta) - p.score;
      p.score += delta; log(s, 'adjust', { player: p.name }, delta, now); break;
    }
    case 'undo': {
      requireThat(s.status !== 'ended', 'Finished rounds are read-only.');
      const old = s.history.pop(); requireThat(old, 'Nothing to undo.');
      const before = s.players.reduce((n, p) => n + p.score, 0);
      s.players.forEach((p, i) => { p.score = old.scores[i]; }); s.teams = old.teams; s.giftCount = old.giftCount;
      log(s, 'undo', {}, s.players.reduce((n, p) => n + p.score, 0) - before, now); break;
    }
    default: throw new CommandError('Unknown command.');
  }
  return s;
}

export function displayState(state) {
  const { title, players, duration, remaining, deadline, status, mode, round, giftCount, source } = state;
  return { title, players, duration, remaining, deadline, status, mode, round, giftCount, source };
}
