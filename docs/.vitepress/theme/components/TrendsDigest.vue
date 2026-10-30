<script setup lang="ts">
import { computed, ref } from 'vue'
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
const expanded = ref(false)

/** 首页默认展示前 8 条，展开后看全部；保持紧凑不挤压文章列表 */
const PREVIEW = 8
const visible = computed(() =>
  expanded.value ? data.items : data.items.slice(0, PREVIEW)
)
const moreCount = computed(() => Math.max(0, data.items.length - PREVIEW))

const catClass = (c: string) => `td-cat td-cat--${c}`
</script>

<template>
  <section class="trends-digest" aria-labelledby="trends-digest-title">
    <header class="td-head">
      <div class="td-titles">
        <h2 id="trends-digest-title">{{ data.title }}</h2>
        <p class="td-meta">
          <time :datetime="data.updated">{{ data.updatedLabel }}</time>
          <span class="td-dot" aria-hidden="true">·</span>
          <span>{{ data.disclaimer }}</span>
        </p>
      </div>
    </header>

    <ul class="td-grid">
      <li v-for="item in visible" :key="item.id" class="td-card">
        <span :class="catClass(item.category)">{{ item.categoryLabel }}</span>
        <strong class="td-title">{{ item.title }}</strong>
        <p class="td-blurb">{{ item.blurb }}</p>
      </li>
    </ul>

    <button
      v-if="moreCount > 0"
      type="button"
      class="td-more"
      @click="expanded = !expanded"
    >
      {{ expanded ? '收起' : `展开其余 ${moreCount} 条` }}
    </button>
  </section>
</template>

<style scoped>
.trends-digest {
  margin: 0;
  padding: 4px 0 2px;
}

.td-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.td-titles h2 {
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
  line-height: 1.5;
}

.td-dot {
  margin: 0 6px;
  opacity: 0.55;
}

.td-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 10px;
}

@media (min-width: 860px) {
  .td-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .td-grid {
    grid-template-columns: 1fr;
  }
}

.td-card {
  margin: 0;
  padding: 10px 12px;
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  border: 1px solid color-mix(in srgb, var(--vp-c-divider) 80%, transparent);
  box-shadow: var(--card-shadow-ring);
  min-height: 0;
}

.td-cat {
  display: inline-block;
  margin-bottom: 5px;
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
  font-size: 13.5px;
  font-weight: 600;
  line-height: 1.35;
  letter-spacing: -0.01em;
}

.td-blurb {
  margin: 4px 0 0;
  color: var(--vp-c-text-2);
  font-size: 12px;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.td-more {
  display: block;
  margin: 10px auto 0;
  padding: 4px 12px;
  border: none;
  background: transparent;
  color: #1d9bf0;
  font-size: 13px;
  cursor: pointer;
}

.td-more:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>
