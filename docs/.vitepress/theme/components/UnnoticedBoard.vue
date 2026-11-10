<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { withBase } from 'vitepress'
import { useIsEnglish } from '../useLocale'

interface Work {
  id: string
  title: string
  summary: string
  image: string | null
  url: string
  likes: number
  createdAt: number
}

interface Draft {
  key: string
  url: string
  title: string
  summary: string
  image: string | null
  fetched: boolean
  usedDescription: boolean
}

const isEnglish = useIsEnglish()
const sort = ref<'latest' | 'chance'>('latest')
const works = ref<Work[]>([])
const liked = ref<string[]>([])
const loading = ref(true)
const unavailable = ref(false)
const broken = ref<Set<string>>(new Set())
const liking = ref('')
const url = ref('')
const pitch = ref('')
const honeypot = ref('')
const draft = ref<Draft | null>(null)
const title = ref('')
const summary = ref('')
const drafting = ref(false)
const submitting = ref(false)
const message = ref('')
const messageTone = ref<'muted' | 'bad'>('muted')
let loadSeq = 0

const copy = computed(() =>
  isEnglish.value
    ? {
        heading: 'Unnoticed',
        intro: 'Leave a link and one sentence about who it is for. The blurb comes from the page, and it stays off the list until you confirm it and it is reviewed.',
        sortLabel: 'Order',
        latest: 'Latest',
        chance: 'By chance',
        chanceNote: 'A random sample of reviewed works. Likes do not decide the order.',
        loading: 'Loading',
        empty: 'Nothing public yet.',
        unavailable: 'The gallery database is not connected yet. This page is up, but submissions are paused.',
        visit: 'Visit',
        formTitle: 'Submit a work',
        url: 'Link',
        pitch: 'Who it is for, and what problem it solves',
        draft: 'Draft the blurb',
        drafting: 'Reading the page',
        title: 'Name',
        summary: 'Blurb',
        confirm: 'Submit for review',
        submitting: 'Submitting',
        back: 'Edit the link',
        sent: 'Submitted. It stays off this page until it is reviewed.',
        noteReady: 'The blurb uses the page description and your sentence. Edit it before submitting.',
        noteNoDesc: 'The page had no description, so the draft is only your sentence.',
        noteClosed: 'The page did not open. The name is the domain for now, and the blurb is only your sentence.',
        finalUrl: 'This link will be saved',
        invalid_url: 'Use a public http or https link.',
        invalid_pitch: 'One sentence, 4–80 characters.',
        invalid_title: 'Keep the name within 80 characters.',
        invalid_summary: 'Keep the blurb within 4–280 characters.',
        duplicate_url: 'This link is already in review or on the page.',
        rate_limited: 'Too many submissions just now. Try again later.',
        storage_error: 'That did not save. Try again.',
        invalid_request: 'This submission was blocked.',
        payload_too_large: 'That is too long.',
        not_found: 'That work is not on the page.'
      }
    : {
        heading: '无人问津',
        intro: '把作品链接和一句话留下。简介按页面上能读到的信息生成，确认后才进入审核。',
        sortLabel: '排序',
        latest: '最新',
        chance: '缘分作品',
        chanceNote: '从已通过审核的作品里随机抽出，不按点赞排序。',
        loading: '正在读取',
        empty: '还没有公开的作品。',
        unavailable: '作品库还没接上，页面可以看，提交暂时不可用。',
        visit: '访问',
        formTitle: '提交作品',
        url: '作品链接',
        pitch: '做给谁、解决什么问题',
        draft: '生成简介',
        drafting: '正在读页面',
        title: '作品名',
        summary: '简介',
        confirm: '确认提交',
        submitting: '正在提交',
        back: '返回修改',
        sent: '已提交。审核通过后才会出现在这里。',
        noteReady: '简介来自页面上的说明和你写的那一句。提交前可以改。',
        noteNoDesc: '页面没有可读的简介，草稿只有你写的那一句。',
        noteClosed: '没有打开这个页面。标题暂用域名，简介只有你写的那一句。',
        finalUrl: '将保存这个链接',
        invalid_url: '请填写可公开访问的 http 或 https 链接。',
        invalid_pitch: '用一句话写做给谁、解决什么问题（4–80 字）。',
        invalid_title: '作品名请写在 80 字以内。',
        invalid_summary: '简介请写在 4–280 字以内。',
        duplicate_url: '这个链接已经在审核或展示中。',
        rate_limited: '刚刚提交太多了，请稍后再试。',
        storage_error: '刚才没保存成功，请再试一次。',
        invalid_request: '这次提交被拦下了。',
        payload_too_large: '内容太长了。',
        not_found: '没有找到这个作品。'
      }
)

const draftKey = computed(() => `${url.value.trim()}|${pitch.value.trim()}`)
const pitchCount = computed(() => [...pitch.value.trim()].length)
const canDraft = computed(() => !unavailable.value && !drafting.value && url.value.trim().length > 0 && pitchCount.value >= 4 && pitchCount.value <= 80)
const canConfirm = computed(() => {
  if (!draft.value || draft.value.key !== draftKey.value || submitting.value) return false
  const name = [...title.value.trim()].length
  const blurb = [...summary.value.trim()].length
  return name >= 1 && name <= 80 && blurb >= 4 && blurb <= 280
})

watch(draftKey, (key) => {
  if (draft.value && draft.value.key !== key) draft.value = null
})

function explain(error: string): string {
  const table = copy.value as Record<string, string>
  return table[error] || copy.value.storage_error
}

function say(text: string, tone: 'muted' | 'bad' = 'muted') {
  message.value = text
  messageTone.value = tone
}

async function readJson(path: string, init?: RequestInit): Promise<Record<string, unknown>> {
  try {
    const response = await fetch(withBase(path), {
      credentials: 'same-origin',
      ...init,
      headers: { accept: 'application/json', ...(init?.headers || {}) }
    })
    const data = (await response.json().catch(() => null)) as Record<string, unknown> | null
    if (!data || typeof data.ok !== 'boolean') return { ok: false, error: 'storage_unconfigured' }
    return data
  } catch {
    return { ok: false, error: 'storage_unconfigured' }
  }
}

async function loadWorks() {
  const seq = ++loadSeq
  loading.value = true
  const data = await readJson(`/api/unnoticed/works?sort=${sort.value}`)
  if (seq !== loadSeq) return
  loading.value = false
  if (data.ok !== true) {
    unavailable.value = data.error === 'storage_unconfigured'
    works.value = []
    if (!unavailable.value) say(explain(String(data.error || '')), 'bad')
    return
  }
  unavailable.value = false
  works.value = Array.isArray(data.works) ? (data.works as Work[]) : []
  liked.value = Array.isArray(data.liked) ? (data.liked as string[]) : []
}

function choose(next: 'latest' | 'chance') {
  sort.value = next
  void loadWorks()
}

function hostOf(value: string): string {
  try {
    return new URL(value).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

function initial(value: string): string {
  return [...value][0] || '·'
}

function markBroken(id: string) {
  const next = new Set(broken.value)
  next.add(id)
  broken.value = next
}

function draftNote(info: Draft): string {
  if (!info.fetched) return copy.value.noteClosed
  if (!info.usedDescription) return copy.value.noteNoDesc
  return copy.value.noteReady
}

async function makeDraft() {
  if (!canDraft.value) {
    say(pitchCount.value < 4 || pitchCount.value > 80 ? copy.value.invalid_pitch : copy.value.invalid_url, 'bad')
    return
  }
  drafting.value = true
  message.value = ''
  const data = await readJson('/api/unnoticed/preview', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      url: url.value.trim(),
      pitch: pitch.value.trim(),
      lang: isEnglish.value ? 'en' : 'zh',
      mf_company: honeypot.value
    })
  })
  drafting.value = false
  if (data.ok !== true) {
    say(explain(String(data.error || '')), 'bad')
    return
  }
  const next: Draft = {
    key: draftKey.value,
    url: String(data.url || ''),
    title: String(data.title || ''),
    summary: String(data.summary || ''),
    image: typeof data.image === 'string' ? data.image : null,
    fetched: data.fetched === true,
    usedDescription: data.usedDescription === true
  }
  draft.value = next
  title.value = next.title
  summary.value = next.summary
  say(draftNote(next))
}

async function confirmDraft() {
  if (!draft.value || !canConfirm.value) return
  submitting.value = true
  const data = await readJson('/api/unnoticed/submit', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      url: draft.value.url,
      pitch: pitch.value.trim(),
      title: title.value.trim(),
      summary: summary.value.trim(),
      lang: isEnglish.value ? 'en' : 'zh',
      mf_company: honeypot.value
    })
  })
  submitting.value = false
  if (data.ok !== true) {
    say(explain(String(data.error || '')), 'bad')
    return
  }
  url.value = ''
  pitch.value = ''
  title.value = ''
  summary.value = ''
  draft.value = null
  say(copy.value.sent)
}

async function toggleLike(work: Work) {
  if (liking.value) return
  liking.value = work.id
  const data = await readJson('/api/unnoticed/like', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ id: work.id })
  })
  liking.value = ''
  if (data.ok !== true) {
    say(explain(String(data.error || '')), 'bad')
    return
  }
  work.likes = Number(data.likes) || 0
  const on = data.liked === true
  liked.value = on ? [...liked.value, work.id] : liked.value.filter((id) => id !== work.id)
}

function likeLabel(work: Work): string {
  const on = liked.value.includes(work.id)
  if (isEnglish.value) return on ? `Liked, ${work.likes}` : `Like, ${work.likes}`
  return on ? `已点赞，${work.likes}` : `点赞，${work.likes}`
}

onMounted(() => {
  void loadWorks()
})
</script>

<template>
  <div class="unnoticed-board unnoticed-stage">
    <div class="unnoticed-rail">
      <header class="unnoticed-intro">
        <h1>{{ copy.heading }}</h1>
        <p>{{ copy.intro }}</p>
      </header>
      <div class="unnoticed-rail-body">
        <section class="unnoticed-form" :aria-label="copy.formTitle">
          <h2>{{ copy.formTitle }}</h2>
          <form @submit.prevent="makeDraft">
            <div class="unnoticed-hp" aria-hidden="true">
              <label>Company <input v-model="honeypot" tabindex="-1" autocomplete="off" name="mf_company" /></label>
            </div>
            <label class="unnoticed-field">
              <span>{{ copy.url }}</span>
              <input v-model="url" type="text" inputmode="url" autocomplete="url" placeholder="https://" :disabled="unavailable" required />
            </label>
            <label class="unnoticed-field">
              <span>{{ copy.pitch }} <em>{{ pitchCount }}/80</em></span>
              <input v-model="pitch" type="text" maxlength="80" :disabled="unavailable" required />
            </label>
            <button type="submit" class="unnoticed-btn" :disabled="!canDraft">
              {{ drafting ? copy.drafting : copy.draft }}
            </button>
          </form>

          <div v-if="draft && draft.key === draftKey" class="unnoticed-preview">
            <p class="unnoticed-note">{{ draftNote(draft) }}</p>
            <p class="unnoticed-final"><span>{{ copy.finalUrl }}</span> {{ draft.url }}</p>
            <div v-if="draft.image && !broken.has('draft')" class="unnoticed-cover is-draft">
              <img :src="draft.image" alt="" referrerpolicy="no-referrer" @error="markBroken('draft')" />
            </div>
            <label class="unnoticed-field">
              <span>{{ copy.title }}</span>
              <input v-model="title" type="text" maxlength="80" required />
            </label>
            <label class="unnoticed-field">
              <span>{{ copy.summary }} <em>{{ [...summary.trim()].length }}/280</em></span>
              <textarea v-model="summary" rows="4" maxlength="280" required />
            </label>
            <div class="unnoticed-actions">
              <button type="button" class="unnoticed-btn is-solid" :disabled="!canConfirm" @click="confirmDraft">
                {{ submitting ? copy.submitting : copy.confirm }}
              </button>
              <button type="button" class="unnoticed-btn" @click="draft = null">{{ copy.back }}</button>
            </div>
          </div>
          <p v-if="message" class="unnoticed-status" :class="{ 'is-bad': messageTone === 'bad' }" role="status">{{ message }}</p>
        </section>
      </div>
    </div>

    <div class="unnoticed-stream">
      <div class="unnoticed-toolbar">
        <div class="skill-sort" role="group" :aria-label="copy.sortLabel">
          <button
            type="button"
            class="skill-sort-option"
            :class="{ 'is-active': sort === 'latest' }"
            :aria-pressed="sort === 'latest'"
            @click="choose('latest')"
          >
            {{ copy.latest }}
          </button>
          <button
            type="button"
            class="skill-sort-option"
            :class="{ 'is-active': sort === 'chance' }"
            :aria-pressed="sort === 'chance'"
            @click="choose('chance')"
          >
            {{ copy.chance }}
          </button>
        </div>
        <p v-if="sort === 'chance'" class="unnoticed-note">{{ copy.chanceNote }}</p>
      </div>

      <div class="unnoticed-stream-body">
        <p v-if="loading" class="unnoticed-note">{{ copy.loading }}</p>
        <p v-else-if="unavailable" class="unnoticed-note">{{ copy.unavailable }}</p>
        <p v-else-if="works.length === 0" class="unnoticed-note">{{ copy.empty }}</p>

        <div v-if="works.length" class="unnoticed-grid">
      <article v-for="work in works" :key="work.id" class="unnoticed-card">
        <a class="unnoticed-cover" :href="work.url" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">
          <img
            v-if="work.image && !broken.has(work.id)"
            :src="work.image"
            :alt="work.title"
            referrerpolicy="no-referrer"
            @error="markBroken(work.id)"
          />
          <span v-else class="unnoticed-placeholder" aria-hidden="true">{{ initial(work.title) }}</span>
        </a>
        <h2>
          <a class="unnoticed-title" :href="work.url" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">{{ work.title }}</a>
        </h2>
        <p class="unnoticed-summary">{{ work.summary }}</p>
        <div class="unnoticed-foot">
          <span class="unnoticed-host">{{ hostOf(work.url) }}</span>
          <span class="unnoticed-actions">
            <a class="unnoticed-visit" :href="work.url" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">{{ copy.visit }}</a>
            <button
              type="button"
              class="unnoticed-like"
              :class="{ 'is-on': liked.includes(work.id) }"
              :aria-pressed="liked.includes(work.id)"
              :aria-label="likeLabel(work)"
              :disabled="liking === work.id"
              @click="toggleLike(work)"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12 20.5s-7.2-4.4-7.2-9.6A3.9 3.9 0 0 1 12 7.8a3.9 3.9 0 0 1 7.2 3.1c0 5.2-7.2 9.6-7.2 9.6z"
                  :fill="liked.includes(work.id) ? 'currentColor' : 'none'"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linejoin="round"
                />
              </svg>
              <span>{{ work.likes }}</span>
            </button>
          </span>
        </div>
        </article>
        </div>
      </div>
    </div>
  </div>
</template>
