<script setup lang="ts">
import { computed } from 'vue'
// 只渲染 items。政治排除项不得写入这份数据，避免进入首页打包产物。
import digest from '../data/trends-digest.json'

type DigestItem = {
  id: string
  category: string
  categoryLabel: string
  title: string
  blurb: string
  source: string
}

type Digest = {
  updated: string
  updatedLabel: string
  title: string
  disclaimer: string
  items: DigestItem[]
}

const props = defineProps<{
  column: 'left' | 'right'
}>()

const data = digest as Digest

/** 按原顺序对半拆开：左栏从上往下是前半，右栏是后半。 */
const columnItems = computed(() => {
  const midpoint = Math.ceil(data.items.length / 2)
  return props.column === 'left'
    ? data.items.slice(0, midpoint)
    : data.items.slice(midpoint)
})

const titleId = computed(() =>
  props.column === 'left' ? 'trends-digest-title' : 'trends-digest-title-right'
)

const catClass = (category: string) => `td-cat td-cat--${category}`
</script>

<template>
  <section class="trends-digest" :aria-labelledby="titleId">
    <header class="td-head">
      <h2 v-if="column === 'left'" :id="titleId" class="td-side-title">{{ data.title }}</h2>
      <p v-else :id="titleId" class="td-side-title">{{ data.title }}</p>
      <p class="td-meta">
        <time :datetime="data.updated">{{ data.updatedLabel }}</time>
        <span class="td-disclaimer">{{ data.disclaimer }}</span>
      </p>
    </header>

    <ul class="td-list">
      <li v-for="item in columnItems" :key="item.id" class="td-card">
        <span :class="catClass(item.category)">{{ item.categoryLabel }}</span>
        <strong class="td-title">{{ item.title }}</strong>
        <p class="td-blurb">{{ item.blurb }}</p>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.trends-digest {
  margin: 0;
  padding: 0;
}

.td-head {
  margin-bottom: 10px;
}

.td-side-title {
  margin: 0 0 4px !important;
  padding: 0 !important;
  border: 0 !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  letter-spacing: 0.14em !important;
  text-transform: uppercase !important;
  line-height: 1.4 !important;
  color: var(--vp-c-text-1);
}

.td-meta {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 12px;
  line-height: 1.45;
}

.td-meta time,
.td-disclaimer {
  display: block;
}

.td-disclaimer {
  margin-top: 2px;
}

.td-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.td-card {
  margin: 0;
  padding: 8px 10px;
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  border: 1px solid color-mix(in srgb, var(--vp-c-divider) 80%, transparent);
  box-shadow: var(--card-shadow-ring);
  min-width: 0;
}

.td-cat {
  display: inline-block;
  margin-bottom: 4px;
  padding: 1px 7px;
  border-radius: 999px;
  font-size: 11px;
  line-height: 1.5;
  color: var(--vp-c-brand-1);
  background: color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent);
}

.td-title {
  display: block;
  color: var(--vp-c-text-1);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.35;
  letter-spacing: -0.01em;
}

.td-blurb {
  margin: 3px 0 0;
  color: var(--vp-c-text-2);
  font-size: 12px;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
