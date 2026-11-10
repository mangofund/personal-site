<script setup lang="ts">
import { ref } from 'vue'
import { withBase } from 'vitepress'

interface PendingWork {
  id: string
  url: string
  pitch: string
  title: string
  summary: string
  image: string | null
  createdAt: number
}

const token = ref('')
const works = ref<PendingWork[]>([])
const publicWorks = ref<PendingWork[]>([])
const loading = ref(false)
const message = ref('')
const acting = ref('')

function detailHref(id: string): string {
  return withBase(`/unnoticed/detail?id=${id}`)
}

function stamp(value: number): string {
  if (!value) return ''
  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }).format(value)
}

function explain(error: string): string {
  if (error === 'unauthorized') return '令牌不对。'
  if (error === 'review_unconfigured') return '审核还没启用。'
  if (error === 'rate_limited') return '操作太频繁，请稍后再试。'
  if (error === 'not_found') return '这条已经不在可处理的状态里。'
  if (error === 'bad_origin') return '来源不对，没有改动。'
  if (error === 'invalid_summary') return '简介请写在 4–280 字以内。'
  if (error === 'storage_unconfigured') return '作品库还没接上。'
  return '刚才没有完成，请再试一次。'
}

async function call(path: string, init?: RequestInit): Promise<Record<string, unknown>> {
  const response = await fetch(withBase(path), {
    credentials: 'same-origin',
    ...init,
    headers: {
      accept: 'application/json',
      authorization: `Bearer ${token.value.trim()}`,
      ...(init?.headers || {})
    }
  })
  const data = (await response.json().catch(() => null)) as Record<string, unknown> | null
  if (!data || typeof data.ok !== 'boolean') return { ok: false, error: 'storage_unconfigured' }
  return data
}

async function load() {
  message.value = ''
  if (token.value.trim().length < 16) {
    message.value = '令牌至少 16 位。'
    return
  }
  loading.value = true
  const data = await call('/api/unnoticed/review')
  loading.value = false
  if (data.ok !== true) {
    works.value = []
    message.value = explain(String(data.error || ''))
    return
  }
  works.value = Array.isArray(data.works) ? (data.works as PendingWork[]) : []
  publicWorks.value = Array.isArray(data.publicWorks) ? (data.publicWorks as PendingWork[]) : []
  if (!works.value.length && !publicWorks.value.length) message.value = '没有可处理的作品。'
}

async function decide(work: PendingWork, action: 'approve' | 'reject' | 'downlist' | 'edit') {
  acting.value = work.id
  const data = await call('/api/unnoticed/review', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ id: work.id, action, summary: work.summary })
  })
  acting.value = ''
  if (data.ok !== true) {
    message.value = explain(String(data.error || ''))
    return
  }
  if (action === 'downlist') {
    publicWorks.value = publicWorks.value.filter((item) => item.id !== work.id)
    message.value = '已从公开列表撤下。'
    return
  }
  if (action === 'edit') {
    message.value = '简介已更新。'
    return
  }
  works.value = works.value.filter((item) => item.id !== work.id)
  message.value = action === 'approve' ? '已通过，公开列表里能看到。' : '已拒绝，不会公开。'
}

</script>

<template>
  <div class="unnoticed-board unnoticed-review">
    <form class="unnoticed-form" @submit.prevent="load">
      <label class="unnoticed-field">
        <span>审核令牌</span>
        <input v-model="token" type="password" autocomplete="off" spellcheck="false" />
      </label>
      <button type="submit" class="unnoticed-btn is-solid" :disabled="loading">
        {{ loading ? '正在读取' : '查看作品' }}
      </button>
    </form>
    <p v-if="message" class="unnoticed-status" role="status">{{ message }}</p>
    <div v-if="publicWorks.length" class="unnoticed-queue">
      <article v-for="work in publicWorks" :key="work.id" class="unnoticed-card">
        <h2>
          <a class="unnoticed-title" :href="detailHref(work.id)" target="_blank" rel="noopener noreferrer">{{ work.title }}</a>
        </h2>
        <p class="unnoticed-host">{{ stamp(work.createdAt) }}</p>
        <p class="unnoticed-summary"><strong>提交者的话</strong> {{ work.pitch }}</p>
        <label class="unnoticed-field">
          <span>公开简介</span>
          <textarea v-model="work.summary" rows="4" maxlength="280" />
        </label>
        <p class="unnoticed-actions">
          <a v-if="work.url" class="unnoticed-visit" :href="work.url" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">打开链接</a>
          <button type="button" class="unnoticed-btn is-solid" :disabled="acting === work.id" @click="decide(work, 'edit')">保存简介</button>
          <button type="button" class="unnoticed-btn" :disabled="acting === work.id" @click="decide(work, 'downlist')">从列表撤下</button>
        </p>
      </article>
    </div>
    <div v-if="works.length" class="unnoticed-queue">
      <article v-for="work in works" :key="work.id" class="unnoticed-card">
        <h2>
          <a class="unnoticed-title" :href="detailHref(work.id)" target="_blank" rel="noopener noreferrer">{{ work.title }}</a>
        </h2>
        <p class="unnoticed-host">{{ stamp(work.createdAt) }}</p>
        <p class="unnoticed-summary"><strong>提交者的话</strong> {{ work.pitch }}</p>
        <p class="unnoticed-summary"><strong>将公开的简介</strong> {{ work.summary }}</p>
        <p class="unnoticed-actions">
          <a v-if="work.url" class="unnoticed-visit" :href="work.url" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">打开链接</a>
          <button type="button" class="unnoticed-btn is-solid" :disabled="acting === work.id" @click="decide(work, 'approve')">通过</button>
          <button type="button" class="unnoticed-btn" :disabled="acting === work.id" @click="decide(work, 'reject')">拒绝</button>
        </p>
      </article>
    </div>
  </div>
</template>
