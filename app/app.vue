<script setup lang="ts">
import { TRIPS } from '~/data/trips'

const route = useRoute()
// 在某一趟旅行裡（/2025-muc-swiss/...）才顯示那趟的選單；首頁只顯示旅行列表
const slug = computed(() => String(route.params.trip ?? ''))
const trip = computed(() => TRIPS[slug.value]?.trip)
const nav = computed(() => [
  { to: `/${slug.value}`, label: '行程總表', icon: '🗓️' },
  { to: `/${slug.value}/category/spots`, label: '分類', icon: '🏷️', prefix: `/${slug.value}/category` },
  { to: `/${slug.value}/budget`, label: '總花費', icon: '💰' },
  { to: `/${slug.value}/notes`, label: '注意事項', icon: '📝' },
])
const active = (n: { to: string; prefix?: string }) =>
  n.prefix ? route.path.startsWith(n.prefix) : route.path.replace(/\/$/, '') === n.to.replace(/\/$/, '')
</script>

<template>
  <div>
    <header class="topbar">
      <div class="wrap topbar-in">
        <NuxtLink :to="trip ? `/${slug}` : '/'" class="brand"><span>🏔️</span><span class="name"> {{ trip?.title ?? '旅遊手冊' }}</span></NuxtLink>
        <nav v-if="trip">
          <NuxtLink v-for="n in nav" :key="n.to" :to="n.to" :class="{ on: active(n) }">
            <span>{{ n.icon }}</span><span class="t">{{ n.label }}</span>
          </NuxtLink>
        </nav>
      </div>
    </header>
    <main>
      <NuxtPage />
    </main>
    <footer class="wrap foot muted">
      <NuxtLink v-if="trip" to="/" class="all">所有旅行</NuxtLink>
    </footer>
  </div>
</template>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(255, 247, 242, 0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--line);
}
.topbar-in { display: flex; align-items: center; justify-content: space-between; gap: 12px; height: 58px; }
.brand { font-weight: 900; font-size: 18px; text-decoration: none; white-space: nowrap; }
nav { display: flex; gap: 4px; }
nav a {
  display: flex; align-items: center; gap: 4px;
  padding: 6px 12px; border-radius: 999px;
  text-decoration: none; font-weight: 700; font-size: 15px; color: var(--muted);
}
nav a.on { background: linear-gradient(90deg, var(--sunset-1), var(--sunset-2)); color: #fff; }
.foot { padding: 40px 16px 48px; font-size: 13px; text-align: center; }
.all { color: var(--muted); }

@media (max-width: 640px) {
  .brand .name { display: none; }
  .topbar-in { height: auto; padding-top: 8px; padding-bottom: 8px; }
  nav { flex: 1; justify-content: space-between; }
  nav a { flex-direction: column; gap: 0; padding: 4px 8px; font-size: 12px; border-radius: 12px; }
}
</style>
