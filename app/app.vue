<script setup lang="ts">
const route = useRoute()
const nav = [
  { to: '/', label: '行程總表', icon: '🗓️' },
  { to: '/category/spots', label: '分類', icon: '🏷️', prefix: '/category' },
  { to: '/budget', label: '總花費', icon: '💰' },
  { to: '/notes', label: '注意事項', icon: '📝' },
]
const active = (n: (typeof nav)[number]) =>
  n.prefix ? route.path.startsWith(n.prefix) : route.path.replace(/\/$/, '') === n.to.replace(/\/$/, '')
</script>

<template>
  <div>
    <header class="topbar">
      <div class="wrap topbar-in">
        <NuxtLink to="/" class="brand"><span>🏔️</span><span class="name"> 德瑞自駕手冊</span></NuxtLink>
        <nav>
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
      2025/10/3 – 10/14 德國・法國・瑞士自駕
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

@media (max-width: 640px) {
  .brand .name { display: none; }
  .topbar-in { height: auto; padding-top: 8px; padding-bottom: 8px; }
  nav { flex: 1; justify-content: space-between; }
  nav a { flex-direction: column; gap: 0; padding: 4px 8px; font-size: 12px; border-radius: 12px; }
}
</style>
