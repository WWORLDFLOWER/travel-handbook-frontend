<script setup lang="ts">
// 路線地圖（Leaflet）：只在瀏覽器裡建立，伺服器產生靜態頁時只輸出外框
import 'leaflet/dist/leaflet.css'
import type { Map as LeafletMap, Polyline, LatLngBoundsExpression } from 'leaflet'
import type { RouteLeg } from '~/data/trips'

export interface Stop { id: string; name: string; lat: number; lng: number; item: string; day: number }

const props = defineProps<{ stops: Stop[]; legs: RouteLeg[]; day: number | null; linkTo: (path: string) => string }>()

// 開車：粗實線（外面一圈淡色光暈，像 Google 時間軸）；火車、纜車：虛線；渡輪、汽車火車：點線
const STYLE: Record<RouteLeg['mode'], { color: string; dash?: string }> = {
  car: { color: '#d9536b' },
  train: { color: '#5a84c9', dash: '8 8' },
  cable: { color: '#5a84c9', dash: '8 8' },
  ferry: { color: '#3f9a7e', dash: '2 8' },
  carTrain: { color: '#3f9a7e', dash: '2 8' },
}

const el = ref<HTMLElement>()
const config = useRuntimeConfig()
let map: LeafletMap | undefined
const lines: { leg: RouteLeg; parts: Polyline[] }[] = []

onMounted(async () => {
  const L = (await import('leaflet')).default
  // 手機：單指捲網頁、雙指移動和縮放地圖（不然整頁會被地圖卡住捲不動）
  map = L.map(el.value!, { scrollWheelZoom: false, zoomSnap: 0.25, dragging: !L.Browser.mobile, tap: false } as L.MapOptions)
  if (L.Browser.mobile) {
    // 兩指碰到地圖時才開放拖曳，放開就關掉
    el.value!.addEventListener('touchstart', e => { if (e.touches.length > 1) map?.dragging.enable() }, { passive: true })
    el.value!.addEventListener('touchend', e => { if (e.touches.length === 0) map?.dragging.disable() }, { passive: true })
  }
  // OpenStreetMap 官方圖塊：免費、不用金鑰，但一定要標示來源（CARTO 現在要金鑰，不能用）
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map)

  for (const leg of props.legs) {
    const s = STYLE[leg.mode]
    const parts: Polyline[] = []
    if (leg.mode === 'car') parts.push(L.polyline(leg.path, { color: s.color, weight: 14, opacity: 0.18 }).addTo(map))
    parts.push(L.polyline(leg.path, { color: s.color, weight: leg.mode === 'car' ? 5 : 4, opacity: 0.9, dashArray: s.dash, lineCap: 'round' }).addTo(map))
    lines.push({ leg, parts })
  }

  // 地點：按順序編號；點一下顯示名稱和「看細節」連結
  const base = config.app.baseURL.replace(/\/$/, '')
  props.stops.forEach((st, i) => {
    const icon = L.divIcon({ className: 'stop-pin', html: `<span>${i + 1}</span>`, iconSize: [24, 24], iconAnchor: [12, 12] })
    L.marker([st.lat, st.lng], { icon, title: st.name })
      .bindPopup(`<b>${st.name}</b><br>Day ${st.day}<br><a href="${base}${props.linkTo(`/item/${st.item}/`)}">看細節 →</a>`)
      .addTo(map!)
  })

  focus()
})

onBeforeUnmount(() => map?.remove())

// 選了某一天：把那天的路線放大、其他天變淡
function focus() {
  if (!map) return
  const pts: [number, number][] = []
  for (const { leg, parts } of lines) {
    const on = props.day == null || leg.day === props.day
    parts.forEach((p, i) => p.setStyle({ opacity: on ? (i === 0 && parts.length > 1 ? 0.18 : 0.9) : 0.12 }))
    if (on) pts.push(...leg.path)
  }
  if (!pts.length) for (const s of props.stops) if (s.day === props.day) pts.push([s.lat, s.lng])
  if (pts.length) map.fitBounds(pts as LatLngBoundsExpression, { padding: [30, 30], maxZoom: 13 })
}

watch(() => props.day, focus)
</script>

<template>
  <div ref="el" class="map" />
</template>

<style scoped>
.map { height: min(70vh, 640px); border-radius: var(--radius); box-shadow: var(--shadow); z-index: 0; }
:deep(.stop-pin) {
  display: grid; place-items: center;
  border-radius: 50%; border: 2px solid #fff;
  background: #d9536b; color: #fff; font-size: 11px; font-weight: 800;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
}
:deep(.leaflet-popup-content) { font-size: 14px; line-height: 1.6; }
:deep(.leaflet-popup-content a) { color: #d9536b; font-weight: 700; }
</style>
