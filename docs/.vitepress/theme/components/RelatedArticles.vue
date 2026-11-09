<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import latestPosts from '../../latest-posts.json'

interface LatestPost {
  title: string
  description: string
  category: string
  url: string
  date: string
  image: string
}

const { frontmatter, page } = useData()

// latest-posts.json 里的 url / image 是镜像站绝对地址，转成本站相对路径
const toPath = (u: string): string => {
  try {
    return new URL(u).pathname
  } catch {
    return u
  }
}

const fmtDate = (d: string): string => {
  const d0 = new Date(d)
  if (Number.isNaN(d0.getTime())) return d
  const m = String(d0.getMonth() + 1).padStart(2, '0')
  const day = String(d0.getDate()).padStart(2, '0')
  return `${d0.getFullYear()}.${m}.${day}`
}

const picks = computed(() => {
  const category = (frontmatter.value as { category?: string }).category
  if (!category) return []
  const current = '/' + page.value.relativePath.replace(/\.md$/, '')
  const all = (latestPosts as LatestPost[])
    .map((p) => ({ ...p, path: toPath(p.url), img: toPath(p.image) }))
    .filter((p) => p.path !== current)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
  const same = all.filter((p) => p.category === category)
  const rest = all.filter((p) => p.category !== category)
  return [...same, ...rest].slice(0, 2)
})
</script>

<template>
  <section v-if="picks.length" class="related-articles">
    <div class="related-title">看完文章的人还看了这篇</div>
    <div class="related-list">
      <a v-for="p in picks" :key="p.path" class="related-card" :href="p.path">
        <img v-if="p.img" class="related-thumb" :src="p.img" :alt="p.title" loading="lazy" />
        <span class="related-body">
          <span class="related-card-title">{{ p.title }}</span>
          <span class="related-date">{{ fmtDate(p.date) }}</span>
        </span>
      </a>
    </div>
  </section>
</template>

<style scoped>
.related-articles {
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid var(--vp-c-divider);
}

.related-title {
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin-bottom: 16px;
}

.related-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.related-card {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 12px;
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  text-decoration: none;
  transition: border-color 0.2s ease;
}

.related-card:hover {
  border-color: var(--vp-c-brand-1);
}

.related-thumb {
  width: 96px;
  height: 64px;
  flex: none;
  object-fit: cover;
  border-radius: 8px;
}

.related-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.related-card-title {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;
  color: var(--vp-c-text-1);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-date {
  font-size: 12px;
  color: var(--vp-c-text-2);
}

@media (max-width: 640px) {
  .related-list {
    grid-template-columns: 1fr;
  }
}
</style>
