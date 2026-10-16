<script setup lang="ts">
const { notes } = useTrip()
const COLORS = ['#e87a8a', '#5a84c9', '#e3a457', '#3f9a7e', '#9273bf', '#e07a4f']
useHead({ title: '注意事項 | 德瑞自駕手冊' })
</script>

<template>
  <div class="wrap">
    <h1 class="section-title">📝 注意事項 & 省錢秘訣</h1>
    <div class="grid">
      <section v-for="(n, i) in notes" :key="n.title" class="card note" :style="{ '--c': COLORS[i % COLORS.length] }">
        <h2><span class="icon">{{ n.icon }}</span>{{ n.title }}</h2>
        <ul>
          <li v-for="t in n.items" :key="t">{{ t }}</li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style scoped>
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 14px; }
.note { border-top: 6px solid var(--c); }
h2 { display: flex; align-items: center; gap: 10px; margin: 0 0 10px; font-size: 19px; color: var(--c); }
.icon {
  display: grid; place-items: center; width: 40px; height: 40px; border-radius: 12px;
  background: color-mix(in srgb, var(--c) 15%, #fff); font-size: 22px;
}
ul { margin: 0; padding-left: 20px; display: grid; gap: 8px; }
</style>
