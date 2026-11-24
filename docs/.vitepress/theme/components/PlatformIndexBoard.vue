<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  PLATFORM_INDEX_ENTRIES,
  PLATFORM_INDEX_GROUPS,
  type PlatformIndexEntry,
  type PlatformIndexGroupCode
} from '../platform-index-data'

type GroupFilter = PlatformIndexGroupCode | 'all' | 'fav'
type QueryFilter = 'all' | 'keyword' | 'list' | 'own'

const FAVORITES_KEY = 'platform-index-favorites'

const search = ref('')
const group = ref<GroupFilter>('all')
const query = ref<QueryFilter>('all')
const favorites = ref<Set<string>>(new Set())

const hotEntries = computed(() => PLATFORM_INDEX_ENTRIES.filter((e) => e.isHot))

const groupCounts = computed(() => {
  const counts: Record<string, number> = { all: PLATFORM_INDEX_ENTRIES.length }
  for (const g of PLATFORM_INDEX_GROUPS) {
    counts[g.code] = PLATFORM_INDEX_ENTRIES.filter((e) => e.groupCode === g.code).length
  }
  counts.fav = favorites.value.size
  return counts
})

function matchesQuery(entry: PlatformIndexEntry): boolean {
  if (query.value === 'all') return true
  if (query.value === 'keyword') return entry.queryType === 'keyword' || entry.queryType === 'both'
  if (query.value === 'list') return entry.queryType === 'list'
  return entry.queryType === 'own'
}

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return PLATFORM_INDEX_ENTRIES.filter((entry) => {
    if (group.value === 'fav') {
      if (!favorites.value.has(entry.code)) return false
    } else if (group.value !== 'all' && entry.groupCode !== group.value) {
      return false
    }
    if (!matchesQuery(entry)) return false
    if (!q) return true
    return [entry.platform, entry.indexName, entry.measures]
      .join(' ')
      .toLowerCase()
      .includes(q)
  })
})

function isFavorite(code: string): boolean {
  return favorites.value.has(code)
}

function toggleFavorite(code: string): void {
  const next = new Set(favorites.value)
  if (next.has(code)) next.delete(code)
  else next.add(code)
  favorites.value = next
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...next]))
  } catch {
    /* 隐私模式等场景拿不到 storage 时只记内存 */
  }
}

function hostOf(value: string): string {
  try {
    return new URL(value).hostname.replace(/^www\./, '')
  } catch {
    return value
  }
}

function queryLabel(entry: PlatformIndexEntry): string {
  if (entry.queryType === 'keyword') return '可按关键词查'
  if (entry.queryType === 'both') return '可按关键词查 + 榜单'
  if (entry.queryType === 'own') return '仅自己账号'
  return '仅看榜单'
}

function groupLabel(code: PlatformIndexGroupCode): string {
  return PLATFORM_INDEX_GROUPS.find((g) => g.code === code)?.label ?? code
}

onMounted(() => {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    if (raw) {
      const parsed: unknown = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        favorites.value = new Set(parsed.filter((v): v is string => typeof v === 'string'))
      }
    }
  } catch {
    /* 读不到就从空收藏开始 */
  }
})
</script>

<template>
  <div class="pi-board">
    <section class="pi-hot" aria-label="热榜入口">
      <h2 class="pi-hot-title">热榜入口 · {{ hotEntries.length }} 个</h2>
      <p class="pi-note">下面这些直接看当天正在火什么，点开就是各平台的热榜。</p>
      <ul class="pi-hot-list">
        <li v-for="entry in hotEntries" :key="entry.code">
          <a
            v-if="entry.url && entry.groupCode !== 'discontinued'"
            class="pi-hot-link"
            :href="entry.url"
            target="_blank"
            rel="noopener noreferrer"
            :title="entry.urlNote || entry.indexName"
          >
            {{ entry.platform }} · {{ entry.indexName }}
          </a>
          <span v-else class="pi-hot-link is-app" :title="entry.urlNote || entry.indexName">
            {{ entry.platform }} · {{ entry.indexName }}（App 内）
          </span>
        </li>
      </ul>
    </section>

    <div class="pi-toolbar">
      <label class="pi-search">
        <span class="pi-search-label">搜索</span>
        <input v-model="search" type="search" placeholder="搜平台、指数名或测什么，例如：小红书、热搜、搜索量" />
      </label>

      <div class="skill-sort" role="group" aria-label="分组">
        <button
          type="button"
          class="skill-sort-option"
          :class="{ 'is-active': group === 'all' }"
          :aria-pressed="group === 'all'"
          @click="group = 'all'"
        >
          全部 {{ groupCounts.all }}
        </button>
        <button
          v-for="g in PLATFORM_INDEX_GROUPS"
          :key="g.code"
          type="button"
          class="skill-sort-option"
          :class="{ 'is-active': group === g.code }"
          :aria-pressed="group === g.code"
          @click="group = g.code"
        >
          {{ g.label }} {{ groupCounts[g.code] }}
        </button>
        <button
          type="button"
          class="skill-sort-option"
          :class="{ 'is-active': group === 'fav' }"
          :aria-pressed="group === 'fav'"
          @click="group = 'fav'"
        >
          我的收藏 {{ groupCounts.fav }}
        </button>
      </div>

      <div class="skill-sort" role="group" aria-label="查法">
        <button
          type="button"
          class="skill-sort-option"
          :class="{ 'is-active': query === 'all' }"
          :aria-pressed="query === 'all'"
          @click="query = 'all'"
        >
          全部查法
        </button>
        <button
          type="button"
          class="skill-sort-option"
          :class="{ 'is-active': query === 'keyword' }"
          :aria-pressed="query === 'keyword'"
          @click="query = 'keyword'"
        >
          可按关键词查
        </button>
        <button
          type="button"
          class="skill-sort-option"
          :class="{ 'is-active': query === 'list' }"
          :aria-pressed="query === 'list'"
          @click="query = 'list'"
        >
          仅看榜单
        </button>
        <button
          type="button"
          class="skill-sort-option"
          :class="{ 'is-active': query === 'own' }"
          :aria-pressed="query === 'own'"
          @click="query = 'own'"
        >
          仅自己账号
        </button>
      </div>
    </div>

    <p class="pi-count">共 {{ filtered.length }} 条</p>

    <p v-if="filtered.length === 0" class="pi-note">没有符合条件的条目，换个关键词或分组试试。</p>

    <div v-else class="pi-grid">
      <article
        v-for="entry in filtered"
        :key="entry.code"
        class="pi-card"
        :class="{ 'is-discontinued': entry.groupCode === 'discontinued' }"
      >
        <header class="pi-card-head">
          <span class="pi-code">{{ entry.code }}</span>
          <span class="pi-platform">{{ entry.platform }}</span>
          <span class="pi-group-tag">{{ groupLabel(entry.groupCode) }}</span>
          <span v-if="entry.groupCode === 'discontinued'" class="pi-dead-tag">已停运</span>
          <span v-if="entry.verifyStatus === 'live'" class="pi-verify-tag">已实测</span>
          <button
            type="button"
            class="pi-star"
            :class="{ 'is-on': isFavorite(entry.code) }"
            :aria-pressed="isFavorite(entry.code)"
            :aria-label="isFavorite(entry.code) ? `取消收藏 ${entry.indexName}` : `收藏 ${entry.indexName}`"
            @click="toggleFavorite(entry.code)"
          >
            {{ isFavorite(entry.code) ? '★' : '☆' }}
          </button>
        </header>
        <h3 class="pi-name">{{ entry.indexName }}</h3>
        <p class="pi-measures">{{ entry.measures }}</p>
        <dl class="pi-fields">
          <div>
            <dt>免费 / 付费</dt>
            <dd>{{ entry.freeText }}</dd>
          </div>
          <div>
            <dt>登录 / 开户</dt>
            <dd>{{ entry.loginText }}</dd>
          </div>
          <div>
            <dt>查法</dt>
            <dd>{{ queryLabel(entry) }}：{{ entry.queryText }}</dd>
          </div>
          <div>
            <dt>更新频率</dt>
            <dd>{{ entry.updateFreq }}</dd>
          </div>
          <div>
            <dt>API / 导出</dt>
            <dd>{{ entry.apiText }}</dd>
          </div>
          <div>
            <dt>官方入口</dt>
            <dd>
              <a
                v-if="entry.url && entry.groupCode !== 'discontinued'"
                :href="entry.url"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ hostOf(entry.url) }}
              </a>
              <span v-else-if="entry.url" class="pi-dead-url">{{ hostOf(entry.url) }}（已停运）</span>
              <span v-else>无网页版</span>
              <span v-if="entry.urlNote" class="pi-url-note">{{ entry.urlNote }}</span>
            </dd>
          </div>
        </dl>
        <p v-if="entry.note" class="pi-entry-note">{{ entry.note }}</p>
      </article>
    </div>
  </div>
</template>

<style scoped>
.pi-board {
  margin: 24px 0;
}

.pi-hot {
  margin-bottom: 24px;
  padding: 16px 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

.pi-hot-title {
  margin: 0 0 4px;
  border: none;
  padding: 0;
  font-size: 17px;
  line-height: 1.5;
}

.pi-note {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.6;
}

.pi-hot-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
}

.pi-hot-link {
  display: inline-block;
  padding: 5px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.5;
  text-decoration: none;
  white-space: nowrap;
}

.pi-hot-link:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.pi-hot-link.is-app {
  color: var(--vp-c-text-2);
  cursor: default;
}

.pi-hot-link.is-app:hover {
  border-color: var(--vp-c-divider);
  color: var(--vp-c-text-2);
}

.pi-toolbar {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 8px;
}

.pi-toolbar .skill-sort {
  align-self: flex-start;
  flex-wrap: wrap;
}

.pi-search {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pi-search-label {
  flex: 0 0 auto;
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 600;
}

.pi-search input {
  flex: 1;
  min-width: 0;
  height: 38px;
  padding: 0 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-family: inherit;
  font-size: 14px;
}

.pi-search input:focus {
  border-color: var(--vp-c-brand-1);
  outline: none;
}

.pi-count {
  margin: 12px 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.pi-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

@media (max-width: 720px) {
  .pi-grid {
    grid-template-columns: 1fr;
  }
}

.pi-card {
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

.pi-card.is-discontinued {
  opacity: 0.85;
}

.pi-card-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.pi-code {
  color: var(--vp-c-text-3);
  font-size: 12px;
  font-weight: 700;
}

.pi-platform {
  font-size: 13px;
  font-weight: 700;
}

.pi-group-tag,
.pi-dead-tag,
.pi-verify-tag {
  padding: 1px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.7;
}

.pi-group-tag {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
}

.pi-dead-tag {
  background: #fdeceb;
  color: #b3261e;
}

.dark .pi-dead-tag {
  background: rgba(179, 38, 30, 0.25);
  color: #ffb4ab;
}

.pi-verify-tag {
  background: #e6f4ea;
  color: #137333;
}

.dark .pi-verify-tag {
  background: rgba(19, 115, 51, 0.25);
  color: #81c995;
}

.pi-star {
  appearance: none;
  margin-left: auto;
  padding: 0 4px;
  border: none;
  background: transparent;
  color: var(--vp-c-text-3);
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  box-shadow: none;
}

.pi-star.is-on {
  color: #f59e0b;
}

.pi-name {
  margin: 10px 0 6px;
  border: none;
  padding: 0;
  font-size: 16px;
  line-height: 1.5;
}

.pi-measures {
  margin: 0 0 12px;
  font-size: 14px;
  line-height: 1.7;
}

.pi-fields {
  margin: 0;
  display: grid;
  gap: 8px;
}

.pi-fields > div {
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  gap: 10px;
  font-size: 13px;
  line-height: 1.6;
}

.pi-fields dt {
  color: var(--vp-c-text-2);
  font-weight: 600;
}

.pi-fields dd {
  margin: 0;
  overflow-wrap: anywhere;
}

.pi-url-note {
  display: block;
  margin-top: 2px;
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.pi-dead-url {
  text-decoration: line-through;
}

.pi-entry-note {
  margin: 12px 0 0;
  padding: 8px 10px;
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.6;
}
</style>
