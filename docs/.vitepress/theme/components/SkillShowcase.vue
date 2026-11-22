<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, withBase } from 'vitepress'
import {
  SKILL_EDITOR_PICK_IDS,
  SKILL_FILTER_ALL,
  SKILL_SCENE_FILTERS,
  SKILL_SORTS,
  SKILL_SORT_RECOMMENDED,
  SKILL_TYPE_FILTERS,
  editorPickSkills,
  homeShowcaseSkills,
  homeSkills,
  newestSkills,
  skillsForFilter,
  skillPagePath,
  sortSkills,
  type HomeSkill,
  type SkillFilterOption,
  type SkillSortId
} from '../homeSkills'
import { useSkillCopy, type SkillActionSource } from '../useSkillCopy'
import { useBarePath } from '../useLocale'
import { loadSkillHeat, skillHeat } from '../skillHeat'

const barePath = useBarePath()
const { isEnglish, feedbackBySkillId, buttonLabel, buttonAriaLabel, zipLabel, zipAriaLabel, copySkill, trackDownload } = useSkillCopy()
onMounted(loadSkillHeat)
const activeFilterId = ref(SKILL_FILTER_ALL)
const activeSortId = ref<SkillSortId>(SKILL_SORT_RECOMMENDED)
const searchQuery = ref('')

const onCatalog = computed(() => {
  const path = barePath.value.replace(/\/$/, '') || '/'
  return path === '/skills' || path === '/en/skills'
})

/** 目录页默认视图：无搜索、无筛选、排序未改动；此时分三个区展示，否则恢复平铺过滤结果 */
const isDefaultView = computed(
  () =>
    onCatalog.value &&
    searchQuery.value.trim() === '' &&
    activeFilterId.value === SKILL_FILTER_ALL &&
    activeSortId.value === SKILL_SORT_RECOMMENDED
)

const visibleSkills = computed(() => {
  const filtered = skillsForFilter(onCatalog.value ? activeFilterId.value : SKILL_FILTER_ALL)
  const sorted = !onCatalog.value
    ? homeShowcaseSkills(filtered, undefined, skillHeat.value)
    : sortSkills(filtered, activeSortId.value, skillHeat.value)
  const query = searchQuery.value.trim().toLowerCase()
  if (!onCatalog.value || query === '') return sorted
  return sorted.filter((skill) =>
    `${skill.nameZh} ${skill.nameEn} ${skill.pitchZh} ${skill.pitchEn}`.toLowerCase().includes(query)
  )
})

/** 搜索/筛选命中数：与现有计数共用同一口径 */
const skillCountText = computed(() => {
  const count = visibleSkills.value.length
  if (!isEnglish.value) return `${count} 个 Skills`
  return count === 1 ? '1 Skill' : `${count} Skills`
})

/** 展示行：分组标题或一张卡。分组只在目录页默认视图出现，其余情况就是平铺列表。 */
interface DisplayRow {
  kind: 'heading' | 'skill'
  key: string
  titleZh?: string
  titleEn?: string
  skill?: HomeSkill
}

const displayRows = computed<DisplayRow[]>(() => {
  if (onCatalog.value && isDefaultView.value) {
    const latest = newestSkills(homeSkills, 3, SKILL_EDITOR_PICK_IDS)
    const latestIdSet = new Set(latest.map((skill) => skill.id))
    const picks = editorPickSkills()
    const pickIdSet = new Set(picks.map((skill) => skill.id))
    const rest = sortSkills(homeSkills, SKILL_SORT_RECOMMENDED).filter(
      (skill) => !latestIdSet.has(skill.id) && !pickIdSet.has(skill.id)
    )
    const rows: DisplayRow[] = []
    rows.push({ kind: 'heading', key: 'latest', titleZh: '最新上架', titleEn: 'Newest' })
    latest.forEach((skill) => rows.push({ kind: 'skill', key: skill.id, skill }))
    rows.push({ kind: 'heading', key: 'picks', titleZh: '编辑推荐', titleEn: "Editors' picks" })
    picks.forEach((skill) => rows.push({ kind: 'skill', key: skill.id, skill }))
    rows.push({ kind: 'heading', key: 'rest', titleZh: '其余全部', titleEn: 'All others' })
    rest.forEach((skill) => rows.push({ kind: 'skill', key: skill.id, skill }))
    return rows
  }
  return visibleSkills.value.map((skill) => ({ kind: 'skill', key: skill.id, skill }))
})

/** 列表里第一张卡：首图 eager 加载，其余 lazy；分组标题不占这个名额 */
function isFirstSkillRow(rowIndex: number): boolean {
  return displayRows.value.slice(0, rowIndex).every((row) => row.kind !== 'skill')
}

function filterLabel(filter: SkillFilterOption): string {
  return isEnglish.value ? filter.labelEn : filter.labelZh
}

function selectFilter(filterId: string): void {
  activeFilterId.value = filterId
}

function sortLabel(sort: (typeof SKILL_SORTS)[number]): string {
  return isEnglish.value ? sort.labelEn : sort.labelZh
}

function selectSort(sortId: SkillSortId): void {
  activeSortId.value = sortId
}

function titleFor(skill: HomeSkill): string {
  return isEnglish.value ? skill.nameEn : skill.nameZh
}

function pitchFor(skill: HomeSkill): string {
  return isEnglish.value ? skill.pitchEn : skill.pitchZh
}

function chipFor(skill: HomeSkill): string {
  return isEnglish.value ? skill.chipEn : skill.chipZh
}

function imageAltFor(skill: HomeSkill): string {
  return isEnglish.value ? skill.imageAltEn : skill.imageAltZh
}

function hrefFor(skill: HomeSkill): string | null {
  const path = skillPagePath(skill, isEnglish.value, onCatalog.value)
  return path ? withBase(path) : null
}

/** 来源徽章：没填 source 的技能不显示。改编默认是「概念来源 XX，原创重写」；直接打包原作者技能的只写来源。 */
function sourceLabel(skill: HomeSkill): string | null {
  const source = skill.source
  if (!source) return null
  if (source.kind === 'original') return isEnglish.value ? 'Original by PRO的茶里芒果' : 'PRO的茶里芒果原创'
  if (source.kind === 'official') return isEnglish.value ? 'Official by Anthropic' : 'Anthropic 官方'
  const name = isEnglish.value ? source.nameEn ?? source.nameZh ?? '' : source.nameZh ?? source.nameEn ?? ''
  if (source.rewritten === false) return isEnglish.value ? `Source: ${name}` : `来源 ${name}`
  return isEnglish.value ? `Concept from ${name}, rewritten from scratch` : `概念来源 ${name}，原创重写`
}

const actionSource = computed<SkillActionSource>(() => (onCatalog.value ? 'catalog' : 'home'))

/** 技能卡视频：进入视野自动静音循环播放，滚出暂停；系统要求减少动态时不自动播 */
const showcaseRoot = ref<HTMLElement | null>(null)
let thumbObserver: IntersectionObserver | null = null

function setupThumbAutoplay(): void {
  thumbObserver?.disconnect()
  thumbObserver = null
  const root = showcaseRoot.value
  if (!root) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const videos = root.querySelectorAll<HTMLVideoElement>('video.skill-thumb-video')
  if (videos.length === 0) return
  thumbObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const v = entry.target as HTMLVideoElement
        if (entry.isIntersecting) {
          v.play().catch(() => {})
        } else {
          v.pause()
        }
      })
    },
    { threshold: 0.2 }
  )
  videos.forEach((v) => thumbObserver!.observe(v))
}

onMounted(() => {
  void nextTick(setupThumbAutoplay)
})
watch(visibleSkills, () => {
  void nextTick(setupThumbAutoplay)
})
watch(displayRows, () => {
  void nextTick(setupThumbAutoplay)
})
onUnmounted(() => {
  thumbObserver?.disconnect()
})
</script>

<template>
  <div ref="showcaseRoot" :class="{ 'skill-browse-layout': onCatalog }">
    <nav v-if="onCatalog" class="skill-filters" :aria-label="isEnglish ? 'Filter skills' : '筛选技能'">
      <div class="skill-filter-group">
        <label class="skill-filter-label" for="skill-search">{{ isEnglish ? 'Search' : '搜索' }}</label>
        <input
          id="skill-search"
          v-model="searchQuery"
          type="search"
          :placeholder="isEnglish ? 'Search by title or description…' : '按标题或简介搜索…'"
          :aria-label="isEnglish ? 'Search skills' : '搜索技能'"
          style="width:100%;min-height:36px;padding:7px 12px;border:1px solid var(--vp-c-divider);border-radius:10px;background:var(--vp-c-bg);color:var(--vp-c-text-1);font-size:14px;"
        />
        <button
          v-if="searchQuery"
          type="button"
          class="skill-filter"
          @click="searchQuery = ''"
        >
          {{ isEnglish ? 'Clear' : '清除' }}
        </button>
      </div>
      <div class="skill-filter-group">
        <p class="skill-filter-label">{{ isEnglish ? 'Type' : '类型' }}</p>
        <button
          type="button"
          class="skill-filter"
          :class="{ 'is-active': activeFilterId === SKILL_FILTER_ALL }"
          :aria-pressed="activeFilterId === SKILL_FILTER_ALL"
          @click="selectFilter(SKILL_FILTER_ALL)"
        >
          {{ isEnglish ? 'All' : '全部' }}
        </button>
        <button
          v-for="filter in SKILL_TYPE_FILTERS"
          :key="filter.id"
          type="button"
          class="skill-filter"
          :class="{ 'is-active': activeFilterId === filter.id }"
          :aria-pressed="activeFilterId === filter.id"
          @click="selectFilter(filter.id)"
        >
          {{ filterLabel(filter) }}
        </button>
      </div>
      <div class="skill-filter-group">
        <p class="skill-filter-label">{{ isEnglish ? 'Scenario' : '场景' }}</p>
        <button
          v-for="filter in SKILL_SCENE_FILTERS"
          :key="filter.id"
          type="button"
          class="skill-filter"
          :class="{ 'is-active': activeFilterId === filter.id }"
          :aria-pressed="activeFilterId === filter.id"
          @click="selectFilter(filter.id)"
        >
          {{ filterLabel(filter) }}
        </button>
      </div>
    </nav>
    <div class="skill-catalog-main">
      <div v-if="onCatalog" class="skill-catalog-bar">
        <p class="skill-count">{{ skillCountText }}</p>
        <div
          class="skill-sort"
          role="group"
          :aria-label="isEnglish ? 'Sort skills' : '排序技能'"
        >
          <button
            v-for="sort in SKILL_SORTS"
            :key="sort.id"
            type="button"
            class="skill-sort-option"
            :class="{ 'is-active': activeSortId === sort.id }"
            :aria-pressed="activeSortId === sort.id"
            @click="selectSort(sort.id)"
          >{{ sortLabel(sort) }}</button>
        </div>
      </div>
      <div class="skill-catalog">
    <p v-if="onCatalog && visibleSkills.length === 0" class="skill-filter-empty">
      {{ isEnglish ? 'No skills match this filter.' : '没有符合这个筛选的技能。' }}
    </p>
    <template v-for="(row, rowIndex) in displayRows" :key="row.key">
      <component
        :is="onCatalog ? 'h2' : 'h3'"
        v-if="row.kind === 'heading'"
        style="grid-column:1/-1;margin:6px 0 0;font-size:16px;font-weight:700;line-height:1.4;"
      >{{ isEnglish ? row.titleEn : row.titleZh }}</component>
      <article v-else-if="row.skill" :id="row.skill.id" class="skill-tile">
      <a v-if="hrefFor(row.skill)" class="skill-thumb" :href="hrefFor(row.skill) || undefined">
        <video
          v-if="row.skill.video"
          class="skill-thumb-video"
          :src="withBase(row.skill.video)"
          :poster="withBase(row.skill.image)"
          :width="row.skill.imageWidth"
          :height="row.skill.imageHeight"
          muted
          loop
          playsinline
          preload="metadata"
        />
        <img
          v-else
          :src="withBase(row.skill.image)"
          :alt="imageAltFor(row.skill)"
          :width="row.skill.imageWidth"
          :height="row.skill.imageHeight"
          :loading="isFirstSkillRow(rowIndex) ? 'eager' : 'lazy'"
          decoding="async"
        />
      </a>
      <div v-else class="skill-thumb">
        <video
          v-if="row.skill.video"
          class="skill-thumb-video"
          :src="withBase(row.skill.video)"
          :poster="withBase(row.skill.image)"
          :width="row.skill.imageWidth"
          :height="row.skill.imageHeight"
          muted
          loop
          playsinline
          preload="metadata"
        />
        <img
          v-else
          :src="withBase(row.skill.image)"
          :alt="imageAltFor(row.skill)"
          :width="row.skill.imageWidth"
          :height="row.skill.imageHeight"
          :loading="isFirstSkillRow(rowIndex) ? 'eager' : 'lazy'"
          decoding="async"
        />
      </div>
      <component :is="onCatalog ? 'h2' : 'h3'" class="skill-title">
        <a v-if="hrefFor(row.skill)" :href="hrefFor(row.skill) || undefined">{{ titleFor(row.skill) }}</a>
        <span v-else>{{ titleFor(row.skill) }}</span>
      </component>
      <p class="skill-pitch">{{ pitchFor(row.skill) }}</p>
      <p
        v-if="sourceLabel(row.skill)"
        style="margin:6px 0 0;color:var(--vp-c-text-2);font-size:12px;line-height:1.5;"
      >{{ sourceLabel(row.skill) }}</p>
      <div class="skill-foot">
        <span class="skill-chip">{{ chipFor(row.skill) }}</span>
        <a
          v-if="!onCatalog && hrefFor(row.skill)"
          class="skill-detail-link"
          :href="hrefFor(row.skill) || undefined"
        >{{ isEnglish ? 'Click for details' : '点击查看详情' }}</a>
        <div v-else class="skill-controls">
          <button
            type="button"
            class="skill-copy"
            :class="{ 'is-copied': feedbackBySkillId[row.skill.id] === 'copied' }"
            :aria-label="buttonAriaLabel(row.skill, titleFor(row.skill))"
            @click="copySkill(row.skill, actionSource)"
          >
            <span aria-live="polite">{{ buttonLabel(row.skill.id) }}</span>
          </button>
          <a
            class="skill-zip"
            :href="withBase(row.skill.zipPath)"
            :download="row.skill.zipFile"
            :aria-label="zipAriaLabel(titleFor(row.skill))"
            @click="trackDownload(row.skill, actionSource)"
          >{{ zipLabel() }}</a>
        </div>
      </div>
    </article>
    </template>
      </div>
    </div>
  </div>
</template>
