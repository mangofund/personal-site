<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { directions, games, neighbors, randomCell, slideTiles, type TileMotion } from './arcade'

const props = defineProps<{ game: string; english?: boolean }>()
const t = (zh: string, en: string) => props.english ? en : zh
const lang = computed(() => Number(Boolean(props.english)))
const home = computed(() => props.english ? '/en/games/' : '/games/')
const game = computed(() => games.find(item => item.id === props.game))
const board = ref<number[]>([])
const motions = ref<TileMotion[]>([])
const merged = ref<number[]>([])
const spawned = ref(-1)
const mergeTurn = ref(0)
let slideTimer: ReturnType<typeof setTimeout> | undefined
let queuedDirection: number | undefined
const visibleTiles = computed(() => motions.value.length ? motions.value : board.value.flatMap((value, index) =>
  value ? [{ from: index, to: index, value }] : []
))
const state = ref('ready')
const score = ref(0)
const best = ref(0)
const playfield = ref<HTMLElement>()
const size = 12
const reefSize = 8
const walls = [28, 29, 30, 63, 75, 80, 92, 104, 111, 112]
const dock = 130
const trail = ref<number[]>([])
const parcel = ref(-1)
let heading = 3
let nextHeading = 3
let timer: ReturnType<typeof setInterval> | undefined
const hazards = ref(new Set<number>())
const revealed = ref(new Set<number>())
const flags = ref(new Set<number>())
const flagMode = ref(false)
const sonar = ref(false)
let pointer: { x: number; y: number } | undefined
const cells = (length: number) => Array.from({ length }, (_, index) => index)
const terminal = computed(() => state.value === 'won' || state.value === 'lost')
const status = computed(() => {
  if (state.value === 'won') return t('挑战成功！', 'Challenge complete!')
  if (state.value === 'lost') return t('本局结束，再试一次？', 'Round over. Try again?')
  if (state.value === 'paused') return t('已暂停', 'Paused')
  if (props.game === 'courier') return score.value === 6
    ? t('包裹已收齐，驶向圆形终点。', 'All parcels collected. Head to the circular dock.')
    : t('收集菱形包裹，圆形标记是终点。', 'Collect the diamonds. The circle marks the dock.')
  if (props.game === 'survey') return flagMode.value ? t('标记模式', 'Flag mode') : t('翻开模式', 'Reveal mode')
  return t('目标 3072', 'Target 3072')
})

function stop() {
  clearInterval(timer)
  timer = undefined
}

function finish(result: 'won' | 'lost') {
  stop()
  state.value = result
}

function addTile(value: number) {
  const empty = cells(16).filter(index => !board.value[index])
  if (!empty.length) return -1
  const index = randomCell(empty)
  board.value[index] = value
  return index
}

function newParcel() {
  const free = cells(size * size).filter(index => !walls.includes(index) && !trail.value.includes(index) && index !== dock)
  parcel.value = randomCell(free)
}

function cancelSlide() {
  clearTimeout(slideTimer)
  slideTimer = undefined
  queuedDirection = undefined
}

function reset() {
  stop()
  state.value = 'ready'
  score.value = 0
  if (props.game === 'merge') {
    cancelSlide()
    motions.value = []
    merged.value = []
    spawned.value = -1
    board.value = Array<number>(16).fill(0)
    addTile(3)
    addTile(3)
  } else if (props.game === 'courier') {
    trail.value = [73, 72]
    heading = nextHeading = 3
    newParcel()
  } else if (props.game === 'survey') {
    hazards.value = new Set()
    revealed.value = new Set()
    flags.value = new Set()
    flagMode.value = false
    sonar.value = true
  }
}

function updateBest() {
  if (score.value <= best.value) return
  best.value = score.value
  try {
    localStorage.setItem('mango-arcade-' + props.game, String(best.value))
  } catch { /* Storage can be unavailable in private browser contexts. */ }
}

function drive() {
  heading = nextHeading
  const head = trail.value[0]
  const step = directions[heading]
  const x = head % size + step.x
  const y = Math.floor(head / size) + step.y
  const next = y * size + x
  const collecting = next === parcel.value
  const occupied = collecting ? trail.value : trail.value.slice(0, -1)
  if (x < 0 || y < 0 || x >= size || y >= size || occupied.includes(next) || walls.includes(next)) {
    finish('lost')
    return
  }
  trail.value = [next, ...occupied]
  if (collecting) {
    score.value++
    updateBest()
    if (score.value === 6) parcel.value = -1
    else newParcel()
  }
  if (next === dock && score.value === 6) finish('won')
}

function pause() {
  if (state.value === 'running') {
    stop()
    state.value = 'paused'
  }
}

function run() {
  if (state.value !== 'ready' && state.value !== 'paused') return
  state.value = 'running'
  playfield.value?.focus({ preventScroll: true })
  timer = setInterval(drive, 230)
}

function move(direction: number) {
  if (terminal.value) return
  if (props.game === 'courier') {
    if (heading + direction !== 3) nextHeading = direction
    if (state.value === 'ready') run()
    return
  }
  if (slideTimer !== undefined) {
    queuedDirection = direction
    return
  }
  const result = slideTiles(board.value, direction)
  if (!result.changed) return

  const settle = () => {
    slideTimer = undefined
    mergeTurn.value++
    board.value = result.next
    motions.value = []
    merged.value = result.merged
    score.value += result.points
    updateBest()
    spawned.value = addTile(Math.random() < 0.9 ? 3 : 6)
    if (board.value.includes(3072)) finish('won')
    else if (!directions.some((_, index) => slideTiles(board.value, index).changed)) finish('lost')
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    settle()
    return
  }

  merged.value = []
  spawned.value = -1
  motions.value = result.motions
  const duration = Math.max(...result.motions.map(slideDuration))
  slideTimer = setTimeout(() => {
    const next = queuedDirection
    queuedDirection = undefined
    settle()
    if (next !== undefined && !terminal.value) move(next)
  }, duration)
}

function slideDuration(tile: TileMotion) {
  if (tile.from === tile.to) return 0
  const weight = Math.log2(tile.value / 3)
  const steps = Math.abs(tile.to % 4 - tile.from % 4) + Math.abs(Math.floor(tile.to / 4) - Math.floor(tile.from / 4))
  return 115 + steps * 17 + weight * 9
}

function tileStyle(tile: TileMotion) {
  const weight = Math.log2(tile.value / 3)
  const dx = tile.to % 4 - tile.from % 4
  const dy = Math.floor(tile.to / 4) - Math.floor(tile.from / 4)
  return {
    gridColumn: tile.to % 4 + 1,
    gridRow: Math.floor(tile.to / 4) + 1,
    background: 'hsl(' + (48 - weight * 4) + ' 84% 70%)',
    '--slide-x': `calc(${-dx * 100}% + ${-dx * 6}px)`,
    '--slide-y': `calc(${-dy * 100}% + ${-dy * 6}px)`,
    '--overshoot-x': `calc(${dx * 2}% + ${dx * 0.12}px)`,
    '--overshoot-y': `calc(${dy * 2}% + ${dy * 0.12}px)`,
    '--slide-duration': slideDuration(tile) + 'ms',
    '--landing-scale': 1.08 + weight * 0.008
  }
}

function key(event: KeyboardEvent) {
  const direction = ['ArrowLeft', 'ArrowUp', 'ArrowDown', 'ArrowRight'].indexOf(event.key)
  if (direction !== -1) {
    event.preventDefault()
    move(direction)
  } else if (props.game === 'courier' && event.code === 'Space') {
    event.preventDefault()
    if (!event.repeat) state.value === 'running' ? pause() : run()
  }
}

function swipe(event: PointerEvent) {
  if (!pointer) return
  const x = event.clientX - pointer.x
  const y = event.clientY - pointer.y
  pointer = undefined
  if (Math.max(Math.abs(x), Math.abs(y)) < 18) return
  move(Math.abs(x) > Math.abs(y) ? (x < 0 ? 0 : 3) : (y < 0 ? 1 : 2))
}

function hazardCount(index: number) {
  return neighbors(index, reefSize).filter(cell => hazards.value.has(cell)).length
}

function reveal(index: number) {
  if (terminal.value || flags.value.has(index) || revealed.value.has(index)) return
  if (!hazards.value.size) {
    const safe = [index, ...neighbors(index, reefSize)]
    const pool = cells(reefSize ** 2).filter(cell => !safe.includes(cell))
    for (let i = 0; i < 10; i++) {
      hazards.value.add(pool.splice(pool.indexOf(randomCell(pool)), 1)[0])
    }
  }
  if (hazards.value.has(index)) {
    finish('lost')
    return
  }
  const queue = [index]
  while (queue.length) {
    const cell = queue.pop()!
    if (revealed.value.has(cell) || flags.value.has(cell)) continue
    revealed.value.add(cell)
    if (!hazardCount(cell)) queue.push(...neighbors(cell, reefSize))
  }
  if (revealed.value.size === reefSize ** 2 - hazards.value.size) finish('won')
}

function flag(index: number) {
  if (terminal.value || revealed.value.has(index)) return
  if (!flags.value.delete(index)) flags.value.add(index)
}

function scan() {
  if (!sonar.value || terminal.value) return
  const hidden = cells(reefSize ** 2).filter(index => !hazards.value.has(index) && !revealed.value.has(index))
  const cell = randomCell(hidden)
  sonar.value = false
  flags.value.delete(cell)
  reveal(cell)
}

function reefLabel(index: number) {
  const position = `${Math.floor(index / reefSize) + 1}, ${index % reefSize + 1}`
  if (terminal.value && hazards.value.has(index)) return position + t(' 暗礁', ' hazard')
  if (revealed.value.has(index)) return position + ' ' + hazardCount(index)
  return position + (flags.value.has(index) ? t(' 已标记', ' flagged') : t(' 未勘探', ' unexplored'))
}

onMounted(() => {
  reset()
  try {
    best.value = Number(localStorage.getItem('mango-arcade-' + props.game)) || 0
  } catch { /* The games work without persistent storage. */ }
  window.addEventListener('blur', pause)
})
onBeforeUnmount(() => {
  cancelSlide()
  stop()
  window.removeEventListener('blur', pause)
})
</script>

<template>
  <main class="arcade" :style="{ '--game-accent': game?.color }">
    <template v-if="!game">
      <header class="arcade-intro">
        <h1>{{ t('小游戏', 'Games') }}</h1>
        <p>{{ t('选一款，打开网页就能玩。', 'Pick a game and start playing in your browser.') }}</p>
      </header>
      <div class="game-list">
        <a v-for="item in games" :key="item.id" class="game-card" :href="withBase(home + item.id)" :style="{ '--game-accent': item.color }">
          <div class="game-art" aria-hidden="true">{{ item.mark }}</div>
          <div class="game-caption">
            <h2>{{ item.title[lang] }}</h2>
            <p>{{ item.description[lang] }}</p>
            <span>{{ t('开始游戏', 'Play') }} →</span>
          </div>
        </a>
      </div>
    </template>
    <template v-else>
      <a class="back" :href="withBase(home)">← {{ t('小游戏', 'Games') }}</a>
      <header class="game-intro">
        <h1>{{ game.title[lang] }}</h1>
        <p>{{ game.description[lang] }}</p>
      </header>
      <div class="game-panel">
        <div class="game-toolbar">
          <span v-if="game.id === 'merge'">{{ t('分数', 'Score') }} <b>{{ score }}</b> · {{ t('最高分', 'Best') }} <b>{{ best }}</b></span>
          <span v-else-if="game.id === 'courier'">{{ t('包裹', 'Parcels') }} <b>{{ score }}/6</b> · {{ t('最佳', 'Best') }} <b>{{ best }}</b></span>
          <span v-else>{{ t('已勘探', 'Surveyed') }} <b>{{ revealed.size }}/54</b> · {{ t('标记', 'Flags') }} <b>{{ flags.size }}/10</b></span>
          <button type="button" @click="reset">{{ t('重开', 'Restart') }}</button>
        </div>
        <div v-if="game.id !== 'survey'" ref="playfield" class="playfield" tabindex="0" :aria-label="game.title[lang]"
          @keydown="key" @pointerdown="pointer = { x: $event.clientX, y: $event.clientY }; $event.currentTarget.setPointerCapture($event.pointerId)"
          @pointerup="swipe" @pointercancel="pointer = undefined">
          <div v-if="game.id === 'merge'" class="board merge-board">
            <div v-for="index in cells(16)" :key="'cell-' + index" class="tile" aria-hidden="true"
              :style="{ gridColumn: index % 4 + 1, gridRow: Math.floor(index / 4) + 1 }" />
            <div v-for="tile in visibleTiles" :key="`${mergeTurn}-${motions.length ? 'slide' : 'land'}-${tile.from}`"
              class="tile filled merge-tile" :class="{
                'is-sliding': tile.from !== tile.to,
                'is-merged': merged.includes(tile.to),
                'is-spawned': tile.to === spawned
              }" :style="tileStyle(tile)">{{ tile.value }}</div>
          </div>
          <div v-else class="board courier-board" aria-hidden="true">
            <div v-for="index in cells(size ** 2)" :key="index" class="tile" :class="{
              wall: walls.includes(index), trail: trail.includes(index),
              head: trail[0] === index, dock: index === dock && score === 6
            }">{{ index === parcel ? '◆' : index === dock ? '◎' : '' }}</div>
          </div>
        </div>
        <div v-else class="board reef-board" :aria-label="game.title[lang]">
          <button v-for="index in cells(reefSize ** 2)" :key="index" type="button" class="tile"
            :class="{ revealed: revealed.has(index), hazard: terminal && hazards.has(index) }"
            :aria-label="reefLabel(index)" @click="flagMode ? flag(index) : reveal(index)" @contextmenu.prevent="flag(index)">
            {{ terminal && hazards.has(index) ? '◆' : revealed.has(index) ? hazardCount(index) || '' : flags.has(index) ? '⚑' : '' }}
          </button>
        </div>
        <p class="game-status" role="status">{{ status }}</p>
        <div class="game-controls">
          <template v-if="game.id === 'survey'">
            <button type="button" :aria-pressed="flagMode" :disabled="terminal" @click="flagMode = !flagMode">{{ t('标记模式', 'Flag mode') }}</button>
            <button type="button" :disabled="!sonar || terminal" @click="scan">{{ t('声呐', 'Sonar') }} · {{ sonar ? 1 : 0 }}</button>
          </template>
          <template v-else>
            <button v-if="game.id === 'courier'" type="button" :disabled="terminal" @click="state === 'running' ? pause() : run()">
              {{ state === 'running' ? t('暂停', 'Pause') : state === 'paused' ? t('继续', 'Resume') : t('开始', 'Start') }}
            </button>
            <button v-for="(direction, index) in directions" :key="direction.icon" type="button" :aria-label="direction.label[lang]"
              :disabled="terminal || state === 'paused'" @click="move(index)">{{ direction.icon }}</button>
          </template>
        </div>
      </div>
      <div class="game-guide">
        <h2>{{ t('玩法', 'How to play') }}</h2>
        <p>{{ game.guide[lang] }}</p>
        <p>{{ t('开源玩法参考', 'Open-source gameplay reference') }} · <a :href="game.source">{{ game.reference }}</a></p>
      </div>
    </template>
  </main>
</template>

<style scoped>
.arcade { max-width: 1100px; min-height: 70vh; margin: auto; padding: 52px 22px 72px; }
.arcade h1 { color: var(--vp-c-text-1); font-size: clamp(2.5rem, 7vw, 4.75rem); font-weight: 800; line-height: 1.08; letter-spacing: -.045em; }
.arcade p { line-height: 1.65; color: var(--vp-c-text-2); }
.arcade-intro { margin-bottom: 32px; }
.arcade-intro p, .game-intro p { margin-top: 12px; }
.game-list { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }
.game-card { overflow: hidden; border: 1px solid var(--vp-c-divider); border-radius: 18px; background: var(--vp-c-bg-soft); transition: border-color .18s; }
.game-card:hover, .game-card:focus-visible { border-color: var(--game-accent); }
.game-art { display: grid; place-items: center; aspect-ratio: 2 / 1; color: var(--game-accent); background: radial-gradient(ellipse at center, #29322c, #171e1a); font: 700 clamp(2.45rem, 6vw, 4rem)/1 var(--vp-font-family-mono); }
.game-caption { padding: 20px; }
.game-caption h2 { font-size: 1.35rem; font-weight: 750; }
.game-caption p { margin: 8px 0 16px; }
.game-caption span, .back, .game-guide a { color: var(--vp-c-brand-1); font-weight: 650; }
.game-intro, .game-guide, .back { display: block; max-width: 520px; margin-inline: auto; }
.game-intro { margin-block: 18px 24px; }
.game-intro h1 { font-size: clamp(2.2rem, 6vw, 3.4rem); }
.game-panel { max-width: 520px; margin: auto; padding: clamp(12px, 4vw, 22px); border: 1px solid #35413a; border-radius: 22px; background: #171e1a; color: #f5f7f2; }
.game-toolbar, .game-controls { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.game-toolbar { justify-content: space-between; margin-bottom: 12px; font-size: .9rem; }
.game-toolbar b { color: var(--game-accent); }
.game-controls { justify-content: center; }
.game-toolbar button, .game-controls button { min-height: 42px; min-width: 42px; padding: 4px 10px; border: 1px solid #63766a; border-radius: 8px; color: inherit; }
.game-controls button[aria-pressed="true"] { background: var(--game-accent); color: #171e1a; }
.game-panel button:not(:disabled):hover { border-color: var(--game-accent); }
.game-panel button:disabled { opacity: .45; }
.game-panel :focus-visible, .game-card:focus-visible { outline: 2px solid var(--game-accent); outline-offset: 2px; }
.playfield { touch-action: none; }
.board { display: grid; gap: 4px; }
.merge-board { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px; }
.courier-board { grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 2px; }
.reef-board { grid-template-columns: repeat(8, minmax(0, 1fr)); }
.tile { display: grid; place-items: center; aspect-ratio: 1; min-width: 0; border-radius: 5px; background: #29362f; font-weight: 750; line-height: 1; }
.merge-board .tile { font-size: clamp(1rem, 5vw, 2.5rem); }
.tile.filled { color: #251b0d; }
.merge-tile { z-index: 1; }
.merge-tile.is-sliding { z-index: 2; animation: tile-slide var(--slide-duration) both; }
.merge-tile.is-merged { animation: tile-merge 180ms ease-out both; }
.merge-tile.is-spawned { animation: tile-spawn 145ms ease-out both; }
@keyframes tile-slide {
  0% { transform: translate(var(--slide-x), var(--slide-y)); animation-timing-function: cubic-bezier(.3, .05, .23, 1); }
  80% { transform: translate(var(--overshoot-x), var(--overshoot-y)); animation-timing-function: ease-out; }
  100% { transform: translate(0, 0); }
}
@keyframes tile-merge {
  0% { transform: scale(.96); }
  45% { transform: scale(var(--landing-scale)); }
  75% { transform: scale(.99); }
  100% { transform: scale(1); }
}
@keyframes tile-spawn {
  from { opacity: 0; transform: scale(.65); }
  to { opacity: 1; transform: scale(1); }
}
@media (prefers-reduced-motion: reduce) {
  .merge-tile.is-sliding, .merge-tile.is-merged, .merge-tile.is-spawned { animation: none; }
}
.courier-board .tile { color: var(--game-accent); font-size: clamp(.7rem, 3vw, 1.2rem); border-radius: 3px; }
.tile.wall { background: #687872; }
.tile.trail { background: #4f825e; }
.tile.head, .tile.dock { background: var(--game-accent); color: #18271d; }
.reef-board .tile { background: #29424a; border: 1px solid #48606a; color: var(--game-accent); font-size: clamp(.85rem, 4vw, 1.35rem); }
.reef-board .tile.revealed { background: #1b2a2c; border-color: #28373b; }
.reef-board .tile.hazard { background: #843c32; color: #fff1dc; }
.game-panel .game-status { min-height: 1.65em; margin: 10px 0; color: #e3eee5; text-align: center; }
.game-guide { margin-top: 26px; }
.game-guide h2 { font-size: 1.12rem; font-weight: 750; }
.game-guide p { margin-top: 6px; }
@media (max-width: 760px) {
  .arcade { padding-top: 34px; }
  .game-list { grid-template-columns: 1fr; }
  .game-art { aspect-ratio: 3 / 1; }
}
</style>
