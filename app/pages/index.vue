<script setup lang="ts">
import { TRIPS } from '~/data/trips'

// 新的旅行排前面
const trips = Object.entries(TRIPS)
  .map(([slug, d]) => ({ slug, ...d.trip, days: d.days.length }))
  .sort((a, b) => b.start.localeCompare(a.start))

useHead({ title: '旅遊手冊' })
</script>

<template>
  <div class="wrap">
    <h1 class="section-title">🧳 旅遊手冊</h1>
    <div class="list">
      <NuxtLink v-for="t in trips" :key="t.slug" :to="`/${t.slug}`" class="trip">
        <span class="date">{{ t.start.replaceAll('-', '/') }} – {{ t.end.slice(5).replace('-', '/') }}</span>
        <b>{{ t.title }}</b>
        <span>{{ t.subtitle }}</span>
        <span class="go">看行程 →</span>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.list { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; }
.trip {
  display: flex; flex-direction: column; gap: 4px;
  padding: 22px; border-radius: var(--radius); box-shadow: var(--shadow);
  background: linear-gradient(135deg, var(--sunset-1), var(--sunset-2) 55%, var(--sunset-3));
  color: #fff; text-decoration: none;
}
.trip b { font-size: 24px; line-height: 1.3; }
.date { font-size: 13px; font-weight: 700; letter-spacing: 1px; opacity: 0.9; }
.go { margin-top: 10px; font-weight: 700; }
</style>
