<script setup lang="ts">
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

const data = digest as Digest

const catClass = (category: string) => `td-cat td-cat--${category}`
const rowTitle = (item: DigestItem) => `${item.title} — ${item.blurb}`
</script>

<template>
  <section class="trends-digest" aria-labelledby="trends-digest-title">
    <header class="td-head">
      <h2 id="trends-digest-title" class="td-side-title">{{ data.title }}</h2>
      <p class="td-meta">
        <time :datetime="data.updated">{{ data.updatedLabel }}</time>
        <span class="td-dot" aria-hidden="true">·</span>
        <span>{{ data.disclaimer }}</span>
      </p>
    </header>

    <ul class="td-list">
      <li
        v-for="item in data.items"
        :key="item.id"
        class="td-row"
        :title="rowTitle(item)"
      >
        <span :class="catClass(item.category)">{{ item.categoryLabel }}</span>
        <strong class="td-title">{{ item.title }}</strong>
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
  margin-bottom: 4px;
}

.td-side-title {
  margin: 0 0 2px !important;
  padding: 0 !important;
  border: 0 !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  letter-spacing: 0.14em !important;
  text-transform: uppercase !important;
  line-height: 1.6 !important;
  color: var(--vp-c-text-1);
}

.td-meta {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 11px;
  line-height: 1.35;
}

.td-dot {
  margin: 0 4px;
  opacity: 0.55;
}

.td-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.td-row {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  column-gap: 6px;
  align-items: center;
  margin: 0;
  padding: 2px 0;
  min-width: 0;
  border: 0;
  border-radius: 0;
  background: none;
  box-shadow: none;
}

.td-cat {
  padding: 0 4px;
  border-radius: 3px;
  font-size: 10px;
  line-height: 1.5;
  white-space: nowrap;
  color: var(--vp-c-brand-1);
  background: color-mix(in srgb, var(--vp-c-brand-1) 10%, transparent);
}

.td-title {
  min-width: 0;
  color: var(--vp-c-text-1);
  font-size: 12px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
