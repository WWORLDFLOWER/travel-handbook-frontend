<script setup lang="ts">
const { trip, budget } = useTrip()

const COLORS: Record<string, string> = {
  機票: '#5a84c9', 住宿: '#9273bf', '門票/車票': '#d9667f', 租車: '#5ea8c0',
  吃飯: '#e07a4f', 油錢: '#e3a457', 網卡: '#3f9a7e', 停車: '#a8988f',
}
const ICONS: Record<string, string> = {
  機票: '✈️', 住宿: '🛏️', '門票/車票': '🎟️', 租車: '🚗', 吃飯: '🍽️', 油錢: '⛽', 網卡: '📶', 停車: '🅿️',
}
const rows = [...budget.rows].sort((a, b) => b.total - a.total)
const pct = (n: number) => (n / budget.total) * 100

// 圓環圖：每一塊的起訖角度
const ring = computed(() => {
  let acc = 0
  return rows.map(r => {
    const start = acc
    acc += pct(r.total)
    return `${COLORS[r.category]} ${start}% ${acc}%`
  }).join(', ')
})

useHead({ title: `總花費 | ${trip.title}` })
</script>

<template>
  <div class="wrap">
    <h1 class="section-title">💰 總花費</h1>

    <div class="top">
      <div class="big total">
        <span>全團總花費（{{ trip.people }} 人）</span>
        <b>NT${{ money(budget.total) }}</b>
      </div>
      <div class="big per">
        <span>人均</span>
        <b>NT${{ money(budget.perPerson) }}</b>
      </div>
      <div class="donut-box card">
        <div class="donut" :style="{ background: `conic-gradient(${ring})` }">
          <div class="hole">12 天<br><small>{{ trip.people }} 人</small></div>
        </div>
      </div>
    </div>

    <div class="card">
      <h2>各項花費</h2>
      <div v-for="r in rows" :key="r.category" class="bar-row">
        <div class="label"><span>{{ ICONS[r.category] }}</span> {{ r.category }}</div>
        <div class="bar-track">
          <div class="bar" :style="{ width: pct(r.total) + '%', background: COLORS[r.category] }" />
        </div>
        <div class="nums">
          <b>NT${{ money(r.total) }}</b>
          <span class="muted">人均 NT${{ money(r.perPerson) }}・{{ pct(r.total).toFixed(1) }}%</span>
        </div>
      </div>

      <table class="tbl">
        <thead><tr><th>分類</th><th>台幣總計（{{ trip.people }} 人）</th><th>人均</th></tr></thead>
        <tbody>
          <tr v-for="r in rows" :key="r.category">
            <td><span class="dot" :style="{ background: COLORS[r.category] }" />{{ r.category }}</td>
            <td>{{ money(r.total) }}</td>
            <td>{{ money(r.perPerson) }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr><td>總計</td><td>{{ money(budget.total) }}</td><td>{{ money(budget.perPerson) }}</td></tr>
        </tfoot>
      </table>
      <p class="muted small">{{ budget.note }}</p>
    </div>
  </div>
</template>

<style scoped>
.top { display: grid; grid-template-columns: 1fr 1fr 220px; gap: 14px; margin-bottom: 16px; }
.big {
  display: flex; flex-direction: column; justify-content: center;
  padding: 22px; border-radius: var(--radius); color: #fff; box-shadow: var(--shadow);
}
.big span { font-weight: 700; opacity: 0.95; }
.big b { font-size: clamp(28px, 5vw, 40px); line-height: 1.2; }
.total { background: linear-gradient(135deg, var(--sunset-1), var(--sunset-2)); }
.per { background: linear-gradient(135deg, #ee9672, #f0bb78); }
.donut-box { display: flex; align-items: center; justify-content: center; padding: 14px; }
.donut { width: 170px; height: 170px; border-radius: 50%; display: grid; place-items: center; }
.hole { width: 96px; height: 96px; border-radius: 50%; background: #fff; display: grid; place-items: center; text-align: center; font-weight: 800; line-height: 1.2; }
.hole small { font-weight: 600; color: var(--muted); }

h2 { margin: 0 0 14px; font-size: 18px; }
.bar-row { display: grid; grid-template-columns: 120px 1fr 200px; gap: 12px; align-items: center; padding: 8px 0; }
.label { font-weight: 700; }
.bar-track { height: 16px; border-radius: 999px; background: #f8e9e1; overflow: hidden; }
.bar { height: 100%; border-radius: 999px; }
.nums { display: flex; flex-direction: column; text-align: right; font-variant-numeric: tabular-nums; }
.nums span { font-size: 12px; }

.tbl { width: 100%; border-collapse: collapse; margin-top: 20px; font-variant-numeric: tabular-nums; }
.tbl th, .tbl td { padding: 10px 12px; text-align: right; border-bottom: 1px solid var(--line); }
.tbl th:first-child, .tbl td:first-child { text-align: left; }
.tbl th { font-size: 13px; color: var(--muted); }
.tbl tfoot td { font-weight: 900; font-size: 17px; border-bottom: 0; background: #fdeee6; }
.dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 8px; }
.small { font-size: 13px; }

@media (max-width: 760px) {
  .top { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
  .donut-box { grid-column: 1 / -1; }
  .bar-row { grid-template-columns: 1fr auto; }
  .bar-track { grid-column: 1 / -1; grid-row: 2; }
}
@media (max-width: 520px) {
  .top { grid-template-columns: minmax(0, 1fr); }
}
</style>
