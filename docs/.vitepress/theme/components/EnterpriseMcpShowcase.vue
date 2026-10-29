<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'
import catalog from '../data/enterprise-mcp.json'
import { useIsEnglish } from '../useLocale'

type EnterpriseStatus = 'live' | 'available' | 'limited' | 'coming'

interface EnterpriseCategory {
  id: string
  labelZh: string
  labelEn: string
}

interface EnterpriseEntry {
  id: string
  nameZh: string
  nameEn: string
  category: string
  categoryEn: string
  pitchZh: string
  pitchEn: string
  auth: string
  transport: string
  docsUrl: string | null
  endpointHint: string | null
  articleUrl: string | null
  status: EnterpriseStatus
  featured: boolean
  logo: string
}

const STATUS_RANK: Record<EnterpriseStatus, number> = {
  live: 0,
  available: 1,
  limited: 2,
  coming: 3
}

const STATUS_LABEL: Record<EnterpriseStatus, { zh: string; en: string }> = {
  live: { zh: '已接入', en: 'Live' },
  available: { zh: '可用', en: 'Available' },
  limited: { zh: '有门槛', en: 'Limited' },
  coming: { zh: '敬请期待', en: 'Coming soon' }
}

const CATEGORY_ALL = 'all'
const EMPTY_TAG = new Set(['', '—', '-'])

const categories = catalog.categories as EnterpriseCategory[]
const enterprises = catalog.enterprises as EnterpriseEntry[]

const knownCategoryIds = new Set(categories.map((category) => category.id))
if (!knownCategoryIds.has(CATEGORY_ALL)) {
  throw new Error('企业 MCP 目录缺少「全部」分类')
}
for (const entry of enterprises) {
  if (!(entry.status in STATUS_RANK)) {
    throw new Error(`未知企业 MCP 状态: ${entry.id}`)
  }
  if (!knownCategoryIds.has(entry.category)) {
    throw new Error(`未知企业 MCP 分类: ${entry.id}`)
  }
  const LOGO_EXTENSIONS = ['.svg', '.png', '.jpg', '.jpeg', '.webp']
  if (
    !entry.logo.startsWith('/images/enterprise-mcp/') ||
    !LOGO_EXTENSIONS.some((ext) => entry.logo.endsWith(ext))
  ) {
    throw new Error(`企业 MCP logo 路径不符合约定: ${entry.id}`)
  }
}

const isEnglish = useIsEnglish()
const activeCategoryId = ref(CATEGORY_ALL)
const query = ref('')

function categoryLabel(category: EnterpriseCategory): string {
  return isEnglish.value ? category.labelEn : category.labelZh
}

function nameFor(entry: EnterpriseEntry): string {
  return isEnglish.value ? entry.nameEn : entry.nameZh
}

function pitchFor(entry: EnterpriseEntry): string {
  return isEnglish.value ? entry.pitchEn : entry.pitchZh
}

function statusLabel(status: EnterpriseStatus): string {
  const label = STATUS_LABEL[status]
  return isEnglish.value ? label.en : label.zh
}

function hasTag(value: string): boolean {
  return !EMPTY_TAG.has(value.trim())
}

function articleHref(entry: EnterpriseEntry): string | null {
  return entry.articleUrl ? withBase(entry.articleUrl) : null
}

const visibleEnterprises = computed(() => {
  const keyword = query.value.trim().toLowerCase()
  return enterprises
    .map((entry, index) => ({ entry, index }))
    .filter(({ entry }) => {
      if (activeCategoryId.value !== CATEGORY_ALL && entry.category !== activeCategoryId.value) return false
      if (!keyword) return true
      const haystack = `${entry.nameZh}\n${entry.nameEn}\n${entry.pitchZh}\n${entry.pitchEn}`.toLowerCase()
      return haystack.includes(keyword)
    })
    .sort((a, b) => {
      const byStatus = STATUS_RANK[a.entry.status] - STATUS_RANK[b.entry.status]
      if (byStatus !== 0) return byStatus
      const byFeatured = Number(b.entry.featured) - Number(a.entry.featured)
      if (byFeatured !== 0) return byFeatured
      return a.index - b.index
    })
    .map((item) => item.entry)
})

const countText = computed(() => {
  const count = visibleEnterprises.value.length
  if (!isEnglish.value) return `${count} 家`
  return count === 1 ? '1 enterprise' : `${count} enterprises`
})
</script>

<template>
  <div class="skill-browse-layout">
    <nav class="skill-filters" :aria-label="isEnglish ? 'Filter enterprises' : '筛选企业'">
      <div class="skill-filter-group">
        <p class="skill-filter-label">{{ isEnglish ? 'Category' : '分类' }}</p>
        <button
          v-for="category in categories"
          :key="category.id"
          type="button"
          class="skill-filter"
          :class="{ 'is-active': activeCategoryId === category.id }"
          :aria-pressed="activeCategoryId === category.id"
          @click="activeCategoryId = category.id"
        >
          {{ categoryLabel(category) }}
        </button>
      </div>
    </nav>
    <div class="skill-catalog-main">
      <div class="skill-catalog-bar">
        <p class="skill-count">{{ countText }}</p>
        <input
          v-model="query"
          class="emcp-search"
          type="search"
          autocomplete="off"
          :aria-label="isEnglish ? 'Search enterprises' : '搜索企业'"
          :placeholder="isEnglish ? 'Search name or capability' : '搜索名称或能力'"
        />
      </div>
      <div class="skill-catalog">
        <p v-if="visibleEnterprises.length === 0" class="skill-filter-empty">
          {{ isEnglish ? 'No enterprises match this filter.' : '没有符合这个筛选的企业。' }}
        </p>
        <article
          v-for="(entry, index) in visibleEnterprises"
          :id="entry.id"
          :key="entry.id"
          class="skill-tile"
          :class="{
            'is-coming': entry.status === 'coming',
            'is-limited': entry.status === 'limited'
          }"
        >
          <a
            v-if="articleHref(entry)"
            class="skill-thumb emcp-mark"
            :href="articleHref(entry) || undefined"
          >
            <img
              :src="withBase(entry.logo)"
              :alt="nameFor(entry)"
              width="256"
              height="256"
              :loading="index === 0 ? 'eager' : 'lazy'"
              decoding="async"
            />
            <span v-if="entry.status === 'coming'" class="emcp-soon">{{ statusLabel(entry.status) }}</span>
          </a>
          <div v-else class="skill-thumb emcp-mark">
            <img
              :src="withBase(entry.logo)"
              :alt="nameFor(entry)"
              width="256"
              height="256"
              :loading="index === 0 ? 'eager' : 'lazy'"
              decoding="async"
            />
            <span v-if="entry.status === 'coming'" class="emcp-soon">{{ statusLabel(entry.status) }}</span>
          </div>
          <h2 class="skill-title">
            <a v-if="articleHref(entry)" :href="articleHref(entry) || undefined">{{ nameFor(entry) }}</a>
            <span v-else>{{ nameFor(entry) }}</span>
          </h2>
          <p class="skill-pitch emcp-pitch">{{ pitchFor(entry) }}</p>
          <div class="emcp-meta">
            <div class="emcp-tags">
              <span class="skill-chip" :class="`emcp-status-${entry.status}`">{{ statusLabel(entry.status) }}</span>
              <span v-if="hasTag(entry.auth)" class="skill-chip">{{ entry.auth }}</span>
              <span v-if="hasTag(entry.transport)" class="skill-chip">{{ entry.transport }}</span>
            </div>
            <div v-if="entry.docsUrl || articleHref(entry)" class="skill-controls">
              <a
                v-if="entry.docsUrl"
                class="skill-detail-link"
                :href="entry.docsUrl"
                target="_blank"
                rel="noopener noreferrer"
                :title="entry.endpointHint || undefined"
              >{{ isEnglish ? 'Docs' : '文档' }}</a>
              <a
                v-if="articleHref(entry)"
                class="skill-detail-link emcp-guide"
                :href="articleHref(entry) || undefined"
              >{{ isEnglish ? 'Guide' : '站内教程' }}</a>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>
