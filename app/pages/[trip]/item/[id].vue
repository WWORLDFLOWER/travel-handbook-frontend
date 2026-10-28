<script setup lang="ts">
const route = useRoute()
const { to, trip, items, days, costTwd, foreign } = useTrip()

const index = computed(() => items.findIndex(i => i.id === route.params.id))
const item = computed(() => items[index.value])
if (!item.value) throw createError({ statusCode: 404, statusMessage: '找不到這個行程' })

const cat = computed(() => categoryOf(item.value!.category))
const day = computed(() => days.find(d => d.date === item.value!.date))
const prev = computed(() => items[index.value - 1])
const next = computed(() => items[index.value + 1])

const costs = computed(() => (item.value!.costs ?? []).map(c => ({ ...c, ...costTwd(c) })))
// 合計只算「全團」的花費；標示每人的（例如機票）另外顯示
const groupCosts = computed(() => costs.value.filter(c => !c.perPerson && !c.free))
const total = computed(() => groupCosts.value.reduce((s, c) => s + c.value, 0))
const totalApprox = computed(() => groupCosts.value.some(c => c.approx))

useHead({ title: () => `${item.value?.title} | ${trip.title}` })
</script>

<template>
  <div v-if="item" class="page" :style="{ '--c': cat.color, '--soft': cat.soft }">
    <section class="head">
      <div class="wrap">
        <NuxtLink :to="to('/')" class="back">‹ 回行程總表</NuxtLink>
        <div class="meta">
          <CategoryChip :name="item.category" solid />
          <span v-if="day">Day {{ day.no }}・{{ fmtDate(item.date!) }}</span>
          <span v-if="item.time" class="time">🕒 {{ item.time }}</span>
        </div>
        <h1>{{ item.title }}</h1>
        <p v-if="item.drive" class="drive">🚗 {{ item.drive }}</p>
      </div>
    </section>

    <div class="wrap grid">
      <div class="main">
        <div v-if="item.desc || item.details" class="card">
          <p v-if="item.desc" class="desc">{{ item.desc }}</p>
          <ul v-if="item.details" class="details">
            <li v-for="d in item.details" :key="d">✈️ {{ d }}</li>
          </ul>
        </div>

        <div v-if="item.booking" class="card">
          <h2>🛏️ 訂房</h2>
          <a :href="item.booking" target="_blank" rel="noopener" class="btn booking">Booking.com 訂房頁 ↗</a>
        </div>

        <div v-if="item.maps?.length" class="card">
          <h2>📍 地點</h2>
          <ul class="link-list">
            <li v-for="m in item.maps" :key="m.url">
              <a :href="m.url" target="_blank" rel="noopener">
                <span class="pin">📍</span>
                <span>{{ m.label }}</span>
              </a>
            </li>
          </ul>
        </div>

        <div v-if="item.links?.length" class="card">
          <h2>🔗 相關連結</h2>
          <ul class="link-list">
            <li v-for="l in item.links" :key="l.url">
              <a :href="l.url" target="_blank" rel="noopener">
                <span class="pin">🔗</span>
                <span>{{ l.label }}</span>
              </a>
            </li>
          </ul>
        </div>

        <div v-if="item.tips?.length" class="card tips">
          <h2>💡 小提醒</h2>
          <ul>
            <li v-for="t in item.tips" :key="t">{{ t }}</li>
          </ul>
        </div>
      </div>

      <aside>
        <div class="card money">
          <h2>💰 費用</h2>
          <template v-if="costs.length">
            <div v-for="(c, i) in costs" :key="i" class="cost">
              <div class="cost-label">
                {{ c.label }}
                <span v-if="c.estimate" class="est">預估</span>
              </div>
              <div class="cost-num">
                <template v-if="c.free">免費</template>
                <template v-else>
                  <span v-if="foreign(c)" class="fx">{{ foreign(c) }}</span>
                  <b>{{ c.approx ? '≈ ' : '' }}NT${{ money(c.value) }}</b>
                  <span v-if="c.perPerson" class="pp">/ 人</span>
                </template>
              </div>
            </div>
            <div v-if="groupCosts.length" class="sum">
              <div><span>全團合計（{{ trip.people }} 人）</span><b>{{ totalApprox ? '≈ ' : '' }}NT${{ money(total) }}</b></div>
              <div><span>人均</span><b>{{ totalApprox ? '≈ ' : '' }}NT${{ money(Math.round(total / trip.people)) }}</b></div>
            </div>
            <p class="muted note">
              金額來自記帳表的實際花費。刷卡的用實際台幣；付現的用匯率換算（€1 ≈ {{ trip.eurRate }}、CHF 1 ≈ {{ trip.chfRate }}），標示「≈」。
            </p>
          </template>
          <p v-else class="muted">這一項沒有花費紀錄。</p>
        </div>
      </aside>
    </div>

    <nav class="wrap pager">
      <NuxtLink v-if="prev" :to="to(`/item/${prev.id}`)" class="card">‹ <span>{{ prev.title }}</span></NuxtLink>
      <span v-else />
      <NuxtLink v-if="next" :to="to(`/item/${next.id}`)" class="card right"><span>{{ next.title }}</span> ›</NuxtLink>
    </nav>
  </div>
</template>

<style scoped>
.head {
  background: linear-gradient(135deg, var(--c), color-mix(in srgb, var(--c) 55%, #f0bb78));
  color: #fff;
  padding: 18px 0 30px;
}
.back { color: #fff; text-decoration: none; font-weight: 700; opacity: 0.9; }
.meta { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-top: 14px; font-weight: 700; }
.meta :deep(.chip) { background: rgba(255, 255, 255, 0.25) !important; }
.head h1 { margin: 8px 0 0; font-size: clamp(26px, 5vw, 38px); line-height: 1.25; }
.drive { margin: 8px 0 0; font-weight: 600; }

.grid { display: grid; grid-template-columns: 1fr 340px; gap: 16px; margin-top: -14px; align-items: start; }
.main { display: grid; gap: 16px; }
h2 { margin: 0 0 12px; font-size: 18px; }
.desc { margin: 0; font-size: 17px; }
.details { list-style: none; padding: 0; margin: 10px 0 0; display: grid; gap: 6px; font-variant-numeric: tabular-nums; }
.link-list a { background: var(--soft); color: color-mix(in srgb, var(--c) 70%, #000); }
.pin { font-size: 18px; }
.booking { background: #003b95; color: #fff; }
.tips ul { margin: 0; padding-left: 20px; display: grid; gap: 6px; }
.tips { background: #fff6ec; }

aside { position: sticky; top: 76px; }
.money { border-top: 6px solid var(--c); }
.cost { display: flex; justify-content: space-between; gap: 10px; padding: 8px 0; border-bottom: 1px dashed var(--line); }
.cost-label { font-size: 14px; }
.cost-num { text-align: right; white-space: nowrap; }
.fx { display: block; font-size: 12px; color: var(--muted); }
.pp { font-size: 12px; color: var(--muted); }
.est { font-size: 11px; background: #eee; border-radius: 6px; padding: 0 5px; margin-left: 4px; }
.sum { margin-top: 12px; padding: 12px; border-radius: 12px; background: var(--soft); display: grid; gap: 4px; }
.sum div { display: flex; justify-content: space-between; }
.sum b { color: var(--c); font-size: 18px; }
.note { font-size: 12px; margin: 12px 0 0; }

.pager { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 28px; }
.pager a { text-decoration: none; font-weight: 700; display: flex; gap: 8px; align-items: center; padding: 14px 18px; }
.pager .right { justify-content: flex-end; text-align: right; }

@media (max-width: 800px) {
  .grid { grid-template-columns: 1fr; }
  aside { position: static; }
}
@media (max-width: 640px) {
  .pager { grid-template-columns: 1fr; }
}
</style>
