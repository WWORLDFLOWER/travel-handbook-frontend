<script setup lang="ts">
const route = useRoute()
const { items, days } = useTrip()

const cat = computed(() => CATEGORIES.find(c => c.slug === route.params.slug))
if (!cat.value) throw createError({ statusCode: 404, statusMessage: '找不到這個分類' })

const list = computed(() => items.filter(i => i.category === cat.value!.name))
const dayNo = (date: string | null) => days.find(d => d.date === date)?.no

useHead({ title: () => `${cat.value?.name} | 德瑞自駕手冊` })
</script>

<template>
  <div v-if="cat" class="wrap" :style="{ '--c': cat.color, '--soft': cat.soft }">
    <h1 class="section-title">🏷️ 行程分類</h1>

    <div class="tabs">
      <NuxtLink
        v-for="c in CATEGORIES" :key="c.slug" :to="`/category/${c.slug}`"
        :style="{ '--tc': c.color, '--ts': c.soft }" :class="{ on: c.slug === cat.slug }"
      >
        <span class="ic">{{ c.icon }}</span>
        <span>{{ c.name }}</span>
        <span class="n">{{ items.filter(i => i.category === c.name).length }}</span>
      </NuxtLink>
    </div>

    <div class="list">
      <NuxtLink v-for="it in list" :key="it.id" :to="`/item/${it.id}`" class="card entry">
        <div class="when">
          <template v-if="it.date">
            <b>Day {{ dayNo(it.date) }}</b>
            <span>{{ fmtDate(it.date) }}</span>
            <span v-if="it.time" class="muted">{{ it.time }}</span>
          </template>
          <b v-else>行前準備</b>
        </div>
        <div class="body">
          <h3>{{ it.title }}</h3>
          <p v-if="it.desc" class="muted">{{ it.desc }}</p>
          <div class="tags">
            <span v-if="it.maps?.length">📍 地圖 {{ it.maps.length }}</span>
            <span v-if="it.booking">🛏️ Booking</span>
            <span v-if="it.costs?.length">💰 有花費紀錄</span>
            <span v-if="it.tips?.length">💡 小提醒</span>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.tabs { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-bottom: 20px; }
.tabs a {
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  padding: 12px 6px; border-radius: 16px;
  background: var(--ts); color: var(--tc);
  text-decoration: none; font-weight: 800;
  border: 3px solid transparent;
}
.tabs a.on { background: var(--tc); color: #fff; box-shadow: 0 8px 20px color-mix(in srgb, var(--tc) 35%, transparent); }
.ic { font-size: 26px; }
.n { font-size: 12px; opacity: 0.85; }

.list { display: grid; gap: 12px; }
.entry { display: grid; grid-template-columns: 130px 1fr; gap: 16px; text-decoration: none; border-left: 6px solid var(--c); }
.entry:hover { background: var(--soft); }
.when { display: flex; flex-direction: column; font-size: 14px; }
.when b { color: var(--c); font-size: 16px; }
.body h3 { margin: 0; font-size: 18px; }
.body p { margin: 4px 0 0; font-size: 14px; }
.tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.tags span { font-size: 12px; padding: 2px 8px; border-radius: 999px; background: var(--soft); color: var(--c); font-weight: 700; }

@media (max-width: 640px) {
  .tabs { gap: 6px; }
  .tabs a { padding: 8px 2px; font-size: 13px; }
  .ic { font-size: 20px; }
  .entry { grid-template-columns: 1fr; gap: 6px; }
  .when { flex-direction: row; gap: 8px; align-items: baseline; flex-wrap: wrap; }
}
</style>
