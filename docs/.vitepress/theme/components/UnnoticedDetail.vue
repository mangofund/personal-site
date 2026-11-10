<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, withBase } from 'vitepress'
import { useIsEnglish } from '../useLocale'

interface Work {
  id: string
  title: string
  summary: string
  pitch: string
  image: string | null
  url: string
  likes: number
  createdAt: number
}

interface Rating {
  avg: number
  count: number
  dist: Record<string, number>
  mine: number
}

interface CommentItem {
  id: string
  author: string
  body: string
  createdAt: number
}

const STAR_PATH = 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'
const route = useRoute()
const isEnglish = useIsEnglish()
const work = ref<Work | null>(null)
const rating = ref<Rating>({ avg: 0, count: 0, dist: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, mine: 0 })
const ratingsReady = ref(true)
const comments = ref<CommentItem[]>([])
const commentsReady = ref(true)
const liked = ref(false)
const loading = ref(true)
const error = ref('')
const broken = ref(false)
const liking = ref(false)
const hoverStars = ref(0)
const ratingBusy = ref(false)
const author = ref('')
const body = ref('')
const honeypot = ref('')
const commentBusy = ref(false)
const message = ref('')
const messageTone = ref<'muted' | 'bad'>('muted')

const copy = computed(() =>
  isEnglish.value
    ? {
        back: '← Unnoticed',
        loading: 'Loading',
        notFound: 'This work was not found.',
        unavailable: 'The gallery database is not connected yet.',
        visit: 'Visit',
        pitchLabel: 'Who it is for',
        ratingTitle: 'Ratings',
        ratingCount: (n: number) => `${n} rating${n === 1 ? '' : 's'}`,
        noRatings: 'No ratings yet.',
        ratePrompt: 'Tap a star to rate this work.',
        yourRating: 'Your rating',
        commentsTitle: 'Comments',
        noComments: 'No comments yet. Be the first to write one.',
        nameLabel: 'Nickname',
        namePlaceholder: 'Nickname (optional)',
        bodyLabel: 'Comment',
        bodyPlaceholder: 'Say something… it shows right after posting.',
        submitComment: 'Post comment',
        posting: 'Posting',
        anonymous: 'Anonymous',
        feedbackPending: 'Ratings and comments are being connected. Check back soon.',
        rated: 'Your rating is saved.',
        commented: 'Your comment is live.',
        invalid_comment: 'Write 4–500 characters.',
        invalid_author: 'Keep the nickname within 20 characters.',
        invalid_stars: 'Pick 1–5 stars.',
        rate_limited: 'Too many actions just now. Try again later.',
        feedback_unavailable: 'Ratings and comments are not enabled yet. Try again later.',
        storage_error: 'That did not save. Try again.'
      }
    : {
        back: '← 无人问津',
        loading: '正在读取',
        notFound: '没有找到这个作品。',
        unavailable: '作品库还没接上。',
        visit: '访问',
        pitchLabel: '做给谁、解决什么问题',
        ratingTitle: '评分',
        ratingCount: (n: number) => `共 ${n} 个评分`,
        noRatings: '还没有人评分。',
        ratePrompt: '轻点星星，给这个作品打分。',
        yourRating: '你的评分',
        commentsTitle: '评论',
        noComments: '还没有评论，来写第一条。',
        nameLabel: '昵称',
        namePlaceholder: '昵称（可选）',
        bodyLabel: '评论',
        bodyPlaceholder: '写点什么……发布后直接显示。',
        submitComment: '发布评论',
        posting: '正在发布',
        anonymous: '匿名',
        feedbackPending: '评分和评论正在接通，稍后再来。',
        rated: '已记录你的评分。',
        commented: '你的评论已经显示。',
        invalid_comment: '评论请写 4–500 字。',
        invalid_author: '昵称请写在 20 字以内。',
        invalid_stars: '请选择 1–5 颗星。',
        rate_limited: '操作太频繁，请稍后再试。',
        feedback_unavailable: '评分和评论还没启用，稍后再试。',
        storage_error: '刚才没保存成功，请再试一次。'
      }
)

const backHref = computed(() => withBase(isEnglish.value ? '/en/unnoticed/' : '/unnoticed/'))
const workId = computed(() => {
  const raw = route.query.id
  return typeof raw === 'string' ? raw : ''
})
const fillPct = computed(() => Math.max(0, Math.min(100, (rating.value.avg / 5) * 100)))
const maxDist = computed(() => Math.max(1, ...[1, 2, 3, 4, 5].map((n) => rating.value.dist[String(n)] || 0)))
const canComment = computed(() => {
  const len = [...body.value.trim()].length
  return commentsReady.value && !commentBusy.value && len >= 4 && len <= 500
})

function stamp(value: number): string {
  if (!value) return ''
  return new Intl.DateTimeFormat(isEnglish.value ? 'en-US' : 'zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  }).format(value)
}

function hostOf(value: string): string {
  try {
    return new URL(value).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

function say(text: string, tone: 'muted' | 'bad' = 'muted') {
  message.value = text
  messageTone.value = tone
}

function explain(errorCode: string): string {
  const table = copy.value as Record<string, string>
  return table[errorCode] || copy.value.storage_error
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

async function load() {
  const id = workId.value
  work.value = null
  error.value = ''
  message.value = ''
  if (!id) {
    loading.value = false
    error.value = copy.value.notFound
    return
  }
  loading.value = true
  const data = await readJson(`/api/unnoticed/work?id=${encodeURIComponent(id)}`)
  loading.value = false
  if (data.ok !== true) {
    error.value = data.error === 'not_found' ? copy.value.notFound : copy.value.unavailable
    return
  }
  work.value = data.work as Work
  rating.value = data.rating as Rating
  ratingsReady.value = data.ratingsReady !== false
  comments.value = Array.isArray(data.comments) ? (data.comments as CommentItem[]) : []
  commentsReady.value = data.commentsReady !== false
  liked.value = data.liked === true
  document.title = `${work.value.title} - ${isEnglish.value ? 'Unnoticed' : '无人问津'}`
}

async function toggleLike() {
  if (!work.value || liking.value) return
  liking.value = true
  const data = await readJson('/api/unnoticed/like', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ id: work.value.id })
  })
  liking.value = false
  if (data.ok !== true) {
    say(explain(String(data.error || '')), 'bad')
    return
  }
  work.value.likes = Number(data.likes) || 0
  liked.value = data.liked === true
}

function likeLabel(): string {
  if (!work.value) return ''
  if (isEnglish.value) return liked.value ? `Liked, ${work.value.likes}` : `Like, ${work.value.likes}`
  return liked.value ? `已点赞，${work.value.likes}` : `点赞，${work.value.likes}`
}

async function submitRate(stars: number) {
  if (!work.value || ratingBusy.value || !ratingsReady.value) return
  ratingBusy.value = true
  const data = await readJson('/api/unnoticed/rate', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ id: work.value.id, stars, mf_company: honeypot.value })
  })
  ratingBusy.value = false
  hoverStars.value = 0
  if (data.ok !== true) {
    say(explain(String(data.error || '')), 'bad')
    return
  }
  rating.value = data.rating as Rating
  say(copy.value.rated)
}

async function postComment() {
  if (!work.value || !canComment.value) {
    say(copy.value.invalid_comment, 'bad')
    return
  }
  commentBusy.value = true
  const data = await readJson('/api/unnoticed/comment', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      id: work.value.id,
      author: author.value.trim(),
      body: body.value.trim(),
      mf_company: honeypot.value
    })
  })
  commentBusy.value = false
  if (data.ok !== true) {
    say(explain(String(data.error || '')), 'bad')
    return
  }
  comments.value = [data.comment as CommentItem, ...comments.value]
  body.value = ''
  say(copy.value.commented)
}

onMounted(() => {
  void load()
})

watch(
  () => route.query.id,
  () => {
    void load()
  }
)
</script>

<template>
  <div class="unnoticed-detail">
    <p><a class="unnoticed-back" :href="backHref">{{ copy.back }}</a></p>

    <p v-if="loading" class="unnoticed-note">{{ copy.loading }}</p>
    <p v-else-if="error" class="unnoticed-note">{{ error }}</p>

    <template v-else-if="work">
      <div class="unnoticed-cover is-detail">
        <img
          v-if="work.image && !broken"
          :src="work.image"
          :alt="work.title"
          referrerpolicy="no-referrer"
          @error="broken = true"
        />
        <span v-else class="unnoticed-placeholder">{{ work.title }}</span>
      </div>
      <h1>{{ work.title }}</h1>
      <p class="unnoticed-meta">{{ hostOf(work.url) }} · {{ stamp(work.createdAt) }}</p>
      <p class="unnoticed-summary is-detail">{{ work.summary }}</p>
      <p v-if="work.pitch" class="unnoticed-pitch">
        <strong>{{ copy.pitchLabel }}</strong> {{ work.pitch }}
      </p>

      <div class="unnoticed-detail-actions">
        <a
          class="unnoticed-visit"
          :href="work.url"
          target="_blank"
          rel="noopener noreferrer"
          referrerpolicy="no-referrer"
        >
          {{ copy.visit }}
        </a>
        <button
          type="button"
          class="unnoticed-like"
          :class="{ 'is-on': liked }"
          :aria-pressed="liked"
          :aria-label="likeLabel()"
          :disabled="liking"
          @click="toggleLike"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 20.5s-7.2-4.4-7.2-9.6A3.9 3.9 0 0 1 12 7.8a3.9 3.9 0 0 1 7.2 3.1c0 5.2-7.2 9.6-7.2 9.6z"
              :fill="liked ? 'currentColor' : 'none'"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linejoin="round"
            />
          </svg>
          <span>{{ work.likes }}</span>
        </button>
      </div>

      <section class="unnoticed-rate-card" :aria-label="copy.ratingTitle">
        <h2>{{ copy.ratingTitle }}</h2>
        <div class="unnoticed-rate-top">
          <div class="unnoticed-rate-avg">
            <span class="unnoticed-rate-num">{{ rating.avg.toFixed(1) }}</span>
            <span class="unnoticed-stars" aria-hidden="true">
              <span class="unnoticed-stars-row is-base">
                <svg v-for="n in 5" :key="'b' + n" viewBox="0 0 24 24"><path :d="STAR_PATH" /></svg>
              </span>
              <span class="unnoticed-stars-row is-fill" :style="{ width: fillPct + '%' }">
                <svg v-for="n in 5" :key="'f' + n" viewBox="0 0 24 24"><path :d="STAR_PATH" /></svg>
              </span>
            </span>
            <span class="unnoticed-rate-count">
              {{ rating.count ? copy.ratingCount(rating.count) : copy.noRatings }}
            </span>
          </div>
          <div class="unnoticed-dist">
            <div v-for="n in [5, 4, 3, 2, 1]" :key="n" class="unnoticed-dist-row">
              <span class="unnoticed-dist-label">{{ n }}★</span>
              <span class="unnoticed-dist-bar">
                <span
                  class="unnoticed-dist-fill"
                  :style="{ width: ((rating.dist[String(n)] || 0) / maxDist) * 100 + '%' }"
                />
              </span>
              <span class="unnoticed-dist-num">{{ rating.dist[String(n)] || 0 }}</span>
            </div>
          </div>
        </div>
        <div v-if="ratingsReady" class="unnoticed-rater">
          <p>{{ rating.mine ? copy.yourRating : copy.ratePrompt }}</p>
          <div class="unnoticed-rate-btns">
            <button
              v-for="n in 5"
              :key="n"
              type="button"
              class="unnoticed-rate-btn"
              :class="{ 'is-on': n <= (hoverStars || rating.mine) }"
              :disabled="ratingBusy"
              :aria-label="String(n)"
              @mouseenter="hoverStars = n"
              @mouseleave="hoverStars = 0"
              @click="submitRate(n)"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true"><path :d="STAR_PATH" /></svg>
            </button>
          </div>
        </div>
        <p v-else class="unnoticed-note">{{ copy.feedbackPending }}</p>
      </section>

      <section class="unnoticed-comments" :aria-label="copy.commentsTitle">
        <h2>
          {{ copy.commentsTitle }}
          <span v-if="comments.length">({{ comments.length }})</span>
        </h2>
        <p v-if="!commentsReady" class="unnoticed-note">{{ copy.feedbackPending }}</p>
        <template v-else>
          <p v-if="!comments.length" class="unnoticed-note">{{ copy.noComments }}</p>
          <article v-for="c in comments" :key="c.id" class="unnoticed-comment">
            <p class="unnoticed-comment-head">
              <strong>{{ c.author || copy.anonymous }}</strong>
              <span>{{ stamp(c.createdAt) }}</span>
            </p>
            <p class="unnoticed-comment-body">{{ c.body }}</p>
          </article>
          <form class="unnoticed-comment-form" @submit.prevent="postComment">
            <div class="unnoticed-hp" aria-hidden="true">
              <label>Company <input v-model="honeypot" tabindex="-1" autocomplete="off" name="mf_company" /></label>
            </div>
            <label class="unnoticed-field">
              <span>{{ copy.nameLabel }}</span>
              <input v-model="author" type="text" maxlength="20" :placeholder="copy.namePlaceholder" />
            </label>
            <label class="unnoticed-field">
              <span>{{ copy.bodyLabel }}</span>
              <textarea v-model="body" rows="3" maxlength="500" :placeholder="copy.bodyPlaceholder" required />
            </label>
            <button type="submit" class="unnoticed-btn is-solid" :disabled="!canComment">
              {{ commentBusy ? copy.posting : copy.submitComment }}
            </button>
          </form>
        </template>
      </section>

      <p v-if="message" class="unnoticed-status" :class="{ 'is-bad': messageTone === 'bad' }" role="status">
        {{ message }}
      </p>
    </template>
  </div>
</template>
