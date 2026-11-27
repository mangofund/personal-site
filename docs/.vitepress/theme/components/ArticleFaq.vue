<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter, lang } = useData()
const questions = computed(() => {
  const faq = frontmatter.value.faq
  return Array.isArray(faq)
    ? faq.filter((item): item is { q: string; a: string } =>
      !!item && typeof item.q === 'string' && typeof item.a === 'string')
    : []
})
</script>

<template>
  <section v-if="questions.length" class="vp-doc" aria-labelledby="article-faq-heading">
    <h2 id="article-faq-heading">{{ lang.startsWith('en') ? 'Frequently asked questions' : '常见问题' }}</h2>
    <div v-for="(item, index) in questions" :key="index">
      <h3>{{ item.q }}</h3>
      <p>{{ item.a }}</p>
    </div>
  </section>
</template>
