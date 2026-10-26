<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'
import { homeSkills, homeShowcaseSkills, skillPagePath } from '../homeSkills'
import { useIsEnglish } from '../useLocale'

// 归档页右侧栏:技能商店 / 项目 / 订阅。技能取编辑推荐前 4 个,总数跟随技能目录。
const ARCHIVE_SKILL_LIMIT = 4
const isEnglish = useIsEnglish()
const skillTotal = homeSkills.length
const skills = computed(() =>
  homeShowcaseSkills(homeSkills, ARCHIVE_SKILL_LIMIT).map((skill) => ({
    id: skill.id,
    name: isEnglish.value ? skill.nameEn : skill.nameZh,
    pitch: isEnglish.value ? skill.pitchEn : skill.pitchZh,
    image: withBase(skill.image),
    href: withBase(skillPagePath(skill, isEnglish.value, false) ?? (isEnglish.value ? '/en/skills/' : '/skills/'))
  }))
)

// 项目目前只有 XMade,与 docs/projects/index.md、docs/en/projects/index.md 保持一致
const project = computed(() => ({
  name: 'XMade',
  pitch: isEnglish.value
    ? 'A Chrome extension that downloads posts, videos, and long articles from X, then sends them to WeChat Official Account drafts.'
    : '一键下载 X 上的推文、视频和长文，整理好直接推送到公众号草稿。',
  chip: isEnglish.value ? 'Chrome Extension' : 'Chrome 扩展',
  image: withBase('/images/projects/xmade.jpg'),
  href: withBase(isEnglish.value ? '/en/projects/' : '/projects/')
}))

const RSS_URL = 'https://promangofund.com/feed.xml'
const copied = ref(false)
function copyRss(): void {
  try {
    void navigator.clipboard.writeText(RSS_URL).then(() => {
      copied.value = true
      window.setTimeout(() => (copied.value = false), 1600)
    })
  } catch {
    /* 忽略 */
  }
}

const copy = computed(() =>
  isEnglish.value
    ? {
        sidebar: 'Sidebar',
        skills: 'Skills Store',
        allSkills: `All ${skillTotal} →`,
        projects: 'Projects',
        view: 'View →',
        subscribe: 'Subscribe',
        note: 'The RSS feed updates when a new article is published. You can also follow the site and see a reminder on your next visit.',
        copyRss: copied.value ? 'RSS URL copied' : 'Copy RSS URL',
        subscribeBtn: 'Subscribe',
        skillsHref: '/en/skills/',
        subscribeHref: '/subscribe'
      }
    : {
        sidebar: '侧栏',
        skills: '技能商店',
        allSkills: `全部 ${skillTotal} 个 →`,
        projects: '项目',
        view: '查看 →',
        subscribe: '订阅',
        note: '新文章发布后 RSS 会同步更新，也可以收藏本站，回访时提醒你有新文章。',
        copyRss: copied.value ? '已复制 RSS 地址' : '复制 RSS 地址',
        subscribeBtn: '去订阅',
        skillsHref: '/skills/',
        subscribeHref: '/subscribe'
      }
)
</script>

<template>
  <aside class="archive-side" :aria-label="copy.sidebar">
    <section class="side-card">
      <div class="side-head">
        <h2>{{ copy.skills }}</h2>
        <a :href="withBase(copy.skillsHref)">{{ copy.allSkills }}</a>
      </div>
      <ul class="side-skills">
        <li v-for="skill in skills" :key="skill.id">
          <a class="side-skill" :href="skill.href">
            <img :src="skill.image" :alt="skill.name" width="96" height="54" loading="lazy" decoding="async" />
            <span>
              <strong>{{ skill.name }}</strong>
              <small>{{ skill.pitch }}</small>
            </span>
          </a>
        </li>
      </ul>
    </section>

    <section class="side-card">
      <div class="side-head">
        <h2>{{ copy.projects }}</h2>
        <a :href="project.href">{{ copy.view }}</a>
      </div>
      <a class="side-skill side-project" :href="project.href">
        <img :src="project.image" :alt="project.name" width="96" height="54" loading="lazy" decoding="async" />
        <span>
          <strong>{{ project.name }}<span class="archive-chip">{{ project.chip }}</span></strong>
          <small>{{ project.pitch }}</small>
        </span>
      </a>
    </section>

    <section class="side-card">
      <div class="side-head">
        <h2>{{ copy.subscribe }}</h2>
      </div>
      <p class="side-note">{{ copy.note }}</p>
      <div class="side-actions">
        <button type="button" class="side-btn" @click="copyRss">{{ copy.copyRss }}</button>
        <a class="side-btn side-btn-primary" :href="withBase(copy.subscribeHref)">{{ copy.subscribeBtn }}</a>
      </div>
    </section>
  </aside>
</template>
