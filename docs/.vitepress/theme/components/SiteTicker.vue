<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { withBase } from 'vitepress'
import { useIsEnglish } from '../useLocale'
import { TICKER_DISMISS_KEY, tickerItems } from '../siteTickerItems'

const TICKER_MIN_SECONDS = 56
const TICKER_SECONDS_PER_ITEM = 3.2

const isEnglish = useIsEnglish()
const items = computed(() => tickerItems(isEnglish.value))
const copies = [false, true] as const
const duration = computed(() => {
  const seconds = Math.max(TICKER_MIN_SECONDS, Math.round(items.value.length * TICKER_SECONDS_PER_ITEM))
  return `${seconds}s`
})

function markDismissed(): void {
  const root = document.documentElement
  root.dataset.tickerDismissed = '1'
  root.style.removeProperty('--site-ticker-offset')
}

onMounted(() => {
  document.documentElement.style.removeProperty('--site-ticker-offset')
  try {
    if (sessionStorage.getItem(TICKER_DISMISS_KEY) === '1') markDismissed()
  } catch {
    /* 忽略 */
  }
})

function dismiss(): void {
  markDismissed()
  try {
    sessionStorage.setItem(TICKER_DISMISS_KEY, '1')
  } catch {
    /* 忽略 */
  }
}
</script>

<template>
  <section
    class="site-ticker"
    :style="{ '--ticker-duration': duration }"
    :aria-label="isEnglish ? 'Skills, projects, and enterprise MCP' : '技能、项目与企业 MCP'"
  >
    <div class="site-ticker-viewport">
      <div class="site-ticker-track">
        <ul
          v-for="hidden in copies"
          :key="hidden ? 'copy' : 'live'"
          class="site-ticker-list"
          :aria-hidden="hidden ? 'true' : undefined"
          :inert="hidden ? true : undefined"
        >
          <li v-for="item in items" :key="item.id">
            <a
              class="site-ticker-link"
              :href="withBase(item.path)"
              :tabindex="hidden ? -1 : undefined"
            >
              <img
                v-if="item.logo"
                class="site-ticker-logo"
                :src="withBase(item.logo)"
                :alt="item.name"
                width="20"
                height="20"
                decoding="async"
              />
              <span class="site-ticker-name">{{ item.name }}</span>
              <span class="site-ticker-meta">{{ item.meta }}</span>
              <span v-if="item.pitch" class="site-ticker-pitch">{{ item.pitch }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <button
      class="site-ticker-close"
      type="button"
      :aria-label="isEnglish ? 'Close' : '关闭'"
      @click="dismiss"
    >
      ×
    </button>
  </section>
</template>

<style scoped>
.site-ticker {
  --ticker-duration: 56s;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: calc(var(--vp-z-index-nav, 30) + 1);
  display: flex;
  align-items: stretch;
  height: var(--site-ticker-height, 36px);
  background: #111;
  color: #f6f6f3;
  font-family: var(--vp-font-family-base);
  font-size: 13px;
  line-height: 1.2;
  overflow: hidden;
  color-scheme: dark;
}

.site-ticker-viewport {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
}

.site-ticker-track {
  display: flex;
  width: max-content;
  animation: site-ticker var(--ticker-duration) linear infinite;
}

.site-ticker:hover .site-ticker-track,
.site-ticker:focus-within .site-ticker-track {
  animation-play-state: paused;
}

.site-ticker-list {
  display: flex;
  flex: none;
  margin: 0;
  padding: 0;
  list-style: none;
}

.site-ticker-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 20px;
  color: #f6f6f3;
  text-decoration: none;
  white-space: nowrap;
}

.site-ticker-link:hover .site-ticker-name,
.site-ticker-link:focus-visible .site-ticker-name {
  text-decoration: underline;
  text-underline-offset: 2px;
}

.site-ticker-link:focus-visible {
  outline: 1px solid #f6f6f3;
  outline-offset: -2px;
}

.site-ticker-logo {
  width: 20px;
  height: 20px;
  border-radius: 999px;
  object-fit: contain;
  background: #f6f6f3;
  flex: 0 0 20px;
}

.site-ticker-name {
  font-weight: 700;
  color: #f6f6f3;
}

.site-ticker-meta,
.site-ticker-pitch {
  color: #bdbdb6;
  font-weight: 400;
}

.site-ticker-close {
  flex: 0 0 40px;
  width: 40px;
  border: 0;
  border-left: 1px solid rgba(255, 255, 255, 0.15);
  background: #111;
  color: #f6f6f3;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
}

.site-ticker-close:hover {
  background: rgba(255, 255, 255, 0.08);
}

.site-ticker-close:focus-visible {
  outline: 1px solid #f6f6f3;
  outline-offset: -2px;
}

@keyframes site-ticker {
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .site-ticker-viewport {
    overflow-x: auto;
  }

  .site-ticker-track {
    animation: none;
    transform: none;
  }

  .site-ticker-list[aria-hidden='true'] {
    display: none;
  }
}
</style>
