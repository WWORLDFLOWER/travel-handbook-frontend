<script setup lang="ts">
import { ROUTES, type RouteLeg } from '~/data/trips'

const { slug, to, trip, map, days } = useTrip()

// 道路線條檔案比較大，只在這頁載入
const { data: route } = await useAsyncData(`route-${slug}`, () => ROUTES[slug]?.() ?? Promise.resolve({ legs: [] as RouteLeg[] }))
const legs = computed(() => route.value?.legs ?? [])
const stopName = (id: string) => map.stops.find(s => s.id === id)?.name ?? id

const MODE: Record<RouteLeg['mode'], string> = { car: '🚗 開車', train: '🚞 火車', cable: '🚡 纜車', ferry: '⛴️ 渡輪', carTrain: '🚆 汽車火車' }

// 選一天只看那天（null = 全部）
const day = ref<number | null>(null)
// 從細節頁按「回路線地圖」回來：?day=4&stop=zermatt → 回到那天、打開那個地點
const stop = ref<string | null>(null)
// 跟細節頁一樣：畫面載入後才看參數，而且要等 router 的網址有參數（剛載入時還沒有）
const router = useRouter()
const mounted = ref(false)
onMounted(() => { mounted.value = true })
watch(() => mounted.value && router.currentRoute.value.query, (q) => {
  if (!q) return
  const d = Number(q.day)
  if (d) day.value = d
  if (q.stop) stop.value = String(q.stop)
}, { immediate: true })
// 有路段或有地點的天才有按鈕（Day 10 整天在慕尼黑市區走路，只有地點）
const routeDays = computed(() => days.filter(d => legs.value.some(l => l.day === d.no) || map.stops.some(s => s.day === d.no)))
const shown = computed(() => legs.value.filter(l => day.value == null || l.day === day.value))
const driveKm = computed(() => shown.value.reduce((s, l) => s + (l.km ?? 0), 0))

const duration = (m: number) => (m >= 60 ? `${Math.floor(m / 60)} 小時 ${m % 60} 分` : `${m} 分`)

useHead({ title: `路線地圖 | ${trip.title}` })
</script>

<template>
  <div class="wrap">
    <h1 class="section-title">🗺️ 路線地圖</h1>

    <div class="days">
      <button :class="{ on: day == null }" @click="day = null">全部</button>
      <button v-for="d in routeDays" :key="d.no" :class="{ on: day === d.no }" @click="day = d.no">
        Day {{ d.no }}<small>{{ fmtDate(d.date).replace(/（.*）/, '') }}</small>
      </button>
    </div>

    <ClientOnly>
      <TripMap :stops="map.stops" :legs="legs" :day="day" :focus-stop="stop" :link-to="to" />
      <template #fallback><div class="map-fallback">地圖載入中…</div></template>
    </ClientOnly>

    <div class="legend">
      <span><i class="car" />開車</span>
      <span><i class="train" />火車、纜車</span>
      <span><i class="ferry" />渡輪、汽車火車</span>
      <span class="muted">開車路線是依照道路估算的，數字是參考值</span>
      <span class="muted touch">手機：用兩根手指移動、放大地圖</span>
    </div>

    <div class="card">
      <h2>{{ day == null ? '全程路段' : `Day ${day} 路段` }}<span v-if="shown.length" class="muted total">開車約 {{ driveKm }} 公里</span></h2>
      <p v-if="!shown.length" class="muted walk">這天沒有開車，在市區走路逛：{{ map.stops.filter(s => s.day === day).map(s => s.name).join('、') }}</p>
      <ol v-else class="legs">
        <li v-for="(l, i) in shown" :key="i">
          <span class="d">Day {{ l.day }}</span>
          <span class="ft">{{ stopName(l.from) }} → {{ stopName(l.to) }}</span>
          <span class="m">{{ MODE[l.mode] }}<template v-if="l.km">・{{ l.km }} km・約 {{ duration(l.minutes!) }}</template></span>
        </li>
      </ol>
    </div>
  </div>
</template>

<style scoped>
.days { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 10px; margin-bottom: 6px; }
.days button {
  flex: none; display: flex; flex-direction: column; align-items: center;
  padding: 6px 12px; border: 0; border-radius: 12px; cursor: pointer;
  background: #fdeee6; color: var(--ink); font: inherit; font-weight: 700; font-size: 14px;
}
.days button small { font-size: 11px; font-weight: 600; color: var(--muted); }
.days button.on { background: linear-gradient(135deg, var(--sunset-1), var(--sunset-2)); color: #fff; }
.days button.on small { color: #fff; }

.map-fallback { height: min(70vh, 640px); border-radius: var(--radius); background: #f8e9e1; display: grid; place-items: center; color: var(--muted); }

.legend { display: flex; flex-wrap: wrap; gap: 6px 18px; margin: 12px 4px 20px; font-size: 13px; align-items: center; }
.legend span { display: inline-flex; align-items: center; gap: 6px; }
.legend i { display: inline-block; width: 28px; height: 0; border-top: 4px solid #d9536b; }
.legend i.train { border-top: 3px dashed #5a84c9; }
.legend i.ferry { border-top: 3px dotted #3f9a7e; }

h2 { margin: 0 0 10px; font-size: 18px; display: flex; flex-wrap: wrap; align-items: baseline; gap: 10px; }
.total { font-size: 14px; font-weight: 600; }
.walk { margin: 0; }
.legs { margin: 0; padding: 0; list-style: none; display: grid; gap: 2px; }
.legs li { display: grid; grid-template-columns: 64px 1fr auto; gap: 10px; padding: 8px 4px; border-bottom: 1px dashed var(--line); align-items: baseline; }
.d { color: #d9536b; font-weight: 800; font-size: 13px; }
.ft { font-weight: 600; }
.m { font-size: 13px; color: var(--muted); white-space: nowrap; }

.touch { display: none !important; }
@media (pointer: coarse) { .touch { display: inline-flex !important; } }

@media (max-width: 640px) {
  .legs li { grid-template-columns: 54px 1fr; }
  .m { grid-column: 2; white-space: normal; }
}
</style>
