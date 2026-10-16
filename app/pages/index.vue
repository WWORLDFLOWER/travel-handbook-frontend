<script setup lang="ts">
const { trip, days, items, budget, skipped, itemsOfDay } = useTrip()
const tickets = items.filter(i => !i.date)

const countryRoute = ['TW', 'DE', 'FR', 'CH', 'DE', 'TW']
</script>

<template>
  <div>
    <!-- 封面 -->
    <section class="hero">
      <div class="wrap hero-in">
        <p class="hero-date">2025 / 10 / 3 — 10 / 14</p>
        <h1>{{ trip.title }}</h1>
        <p class="hero-sub">{{ trip.subtitle }}</p>
        <div class="route">
          <template v-for="(c, i) in countryRoute" :key="i">
            <span class="flag" :style="{ background: COUNTRIES[c]!.color }">{{ COUNTRIES[c]!.name }}</span>
            <span v-if="i < countryRoute.length - 1" class="arrow">→</span>
          </template>
        </div>
        <div class="stats">
          <div><b>12</b><span>天</span></div>
          <div><b>3</b><span>國</span></div>
          <div><b>{{ trip.people }}</b><span>人</span></div>
          <NuxtLink to="/budget"><b>NT${{ money(budget.perPerson) }}</b><span>人均花費 →</span></NuxtLink>
        </div>
      </div>
      <svg class="mountains" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 120 L0 70 L120 30 L230 80 L360 10 L470 70 L560 40 L700 95 L820 20 L940 75 L1060 35 L1180 85 L1300 25 L1440 70 L1440 120 Z" fill="#fff7f2" />
        <path d="M360 10 L395 32 L380 30 L360 40 L345 28 L330 33 Z M820 20 L850 38 L835 36 L818 46 L805 34 L792 37 Z M1300 25 L1330 45 L1315 42 L1298 52 L1285 40 L1272 44 Z" fill="#ffffff" />
      </svg>
    </section>

    <div class="wrap">
      <!-- 分類圖例 -->
      <div class="legend">
        <NuxtLink v-for="c in CATEGORIES" :key="c.slug" :to="`/category/${c.slug}`" class="chip" :style="{ background: c.soft, color: c.color }">
          {{ c.icon }} {{ c.name }}
        </NuxtLink>
      </div>

      <h2 class="section-title">🗓️ 行程總表</h2>
      <p class="muted hint">依照實際走的行程排列，點任何一列看細節（地圖、訂房、金額）。</p>

      <section v-for="d in days" :key="d.date" class="day" :style="{ '--c': COUNTRIES[d.country]!.color }">
        <div class="day-side">
          <div class="day-no">Day {{ d.no }}</div>
          <div class="day-date">{{ fmtDate(d.date) }}</div>
          <div class="day-flag">📍 {{ COUNTRIES[d.country]!.name }}</div>
        </div>
        <div class="day-body">
          <h3 class="day-title">{{ d.title }}</h3>
          <NuxtLink v-for="it in itemsOfDay(d.date)" :key="it.id" :to="`/item/${it.id}`" class="row">
            <span class="time">{{ it.time }}</span>
            <span class="what">
              <CategoryChip :name="it.category" />
              <span class="name">{{ it.title }}</span>
            </span>
            <span class="go">›</span>
          </NuxtLink>
        </div>
      </section>

      <h2 class="section-title">🎟️ 行前準備的票券</h2>
      <div class="tickets">
        <NuxtLink v-for="it in tickets" :key="it.id" :to="`/item/${it.id}`" class="card ticket">
          <CategoryChip :name="it.category" />
          <b>{{ it.title }}</b>
        </NuxtLink>
      </div>

      <h2 class="section-title">💭 有規劃但沒去成</h2>
      <p class="muted hint">行程規劃時列的備案，下次可以參考。</p>
      <div class="skipped">
        <div v-for="s in skipped" :key="s.title" class="card skip">
          <div class="muted small">{{ fmtDate(s.date) }}</div>
          <b>{{ s.title }}</b>
          <p v-if="s.reason" class="small">{{ s.reason }}</p>
          <div class="skip-links">
            <a v-for="m in s.maps ?? []" :key="m.url" :href="m.url" target="_blank" rel="noopener">📍 {{ m.label }}</a>
            <a v-for="l in s.links ?? []" :key="l.url" :href="l.url" target="_blank" rel="noopener">🔗 {{ l.label }}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero {
  position: relative;
  background: linear-gradient(135deg, var(--sunset-1) 0%, var(--sunset-2) 50%, var(--sunset-3) 100%);
  color: #fff;
  overflow: hidden;
}
.hero::before {
  content: "";
  position: absolute;
  width: 260px; height: 260px;
  right: 8%; top: -60px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0) 70%);
}
.hero-in { position: relative; padding: 48px 16px 90px; }
.hero-date { margin: 0; font-weight: 700; letter-spacing: 2px; opacity: 0.9; }
.hero h1 { margin: 6px 0 4px; font-size: clamp(36px, 7vw, 60px); line-height: 1.15; text-shadow: 0 3px 16px rgba(140, 50, 40, 0.25); }
.hero-sub { margin: 0; font-size: 18px; font-weight: 600; }
.route { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin: 18px 0; }
.flag { padding: 3px 12px; border-radius: 999px; font-weight: 800; font-size: 15px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); }
.arrow { font-size: 16px; opacity: 0.8; }
.stats { display: flex; flex-wrap: wrap; gap: 10px; }
.stats > * {
  display: flex; flex-direction: column; min-width: 84px;
  padding: 10px 16px; border-radius: 16px;
  background: rgba(255, 255, 255, 0.22); backdrop-filter: blur(4px);
  text-decoration: none; color: #fff;
}
.stats b { font-size: 24px; line-height: 1.2; }
.stats span { font-size: 13px; opacity: 0.95; }
.mountains { position: absolute; bottom: -1px; left: 0; width: 100%; height: 80px; }

.legend { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 20px; }
.legend a { text-decoration: none; font-size: 14px; padding: 5px 14px; }
.hint { margin-top: -6px; }

.table-head {
  display: grid; grid-template-columns: 130px 120px 1fr;
  padding: 0 20px 6px; font-size: 13px; font-weight: 700; color: var(--muted);
}

.day {
  display: grid;
  grid-template-columns: 130px 1fr;
  margin-bottom: 14px;
  background: #fff;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
}
.day-side {
  padding: 18px 16px;
  background: color-mix(in srgb, var(--c) 14%, #fff);
  border-left: 6px solid var(--c);
}
.day-no { font-weight: 900; font-size: 20px; color: var(--c); }
.day-date { font-weight: 700; }
.day-flag { font-size: 13px; color: var(--muted); }
.day-body { padding: 12px 12px 12px 0; }
.day-title { margin: 6px 12px 8px; font-size: 17px; }
.row {
  display: grid;
  grid-template-columns: 120px 1fr 20px;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 12px;
  text-decoration: none;
}
.row:hover { background: #fdeee6; }
.time { font-variant-numeric: tabular-nums; color: var(--muted); font-size: 14px; font-weight: 600; }
.what { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.name { font-weight: 600; }
.go { color: #e3b5a6; font-size: 22px; line-height: 1; }

.tickets { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px; }
.ticket { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; text-decoration: none; border-top: 5px solid #d9667f; }

.skipped { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; }
.skip { background: #faf1ee; box-shadow: none; border: 2px dashed #ecd6cf; padding: 16px; }
.skip b { color: #7a5e5e; }
.small { font-size: 13px; margin: 4px 0; }
.skip-links { display: flex; flex-direction: column; gap: 2px; margin-top: 6px; font-size: 14px; }
.skip-links a { color: #c9606f; text-decoration: none; }

@media (max-width: 640px) {
  .hero-in { padding: 32px 16px 80px; }
  .table-head { display: none; }
  .day { grid-template-columns: 1fr; }
  .day-side { display: flex; align-items: baseline; gap: 10px; border-left: 0; border-top: 6px solid var(--c); padding: 10px 16px; }
  .day-body { padding: 4px 4px 10px; }
  .row { grid-template-columns: 82px 1fr 14px; padding: 8px; }
  .time { font-size: 13px; }
}
</style>
