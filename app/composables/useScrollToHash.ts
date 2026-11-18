// 從細節頁按「回…」回來時網址帶 #it-<id>：畫面載入後直接捲到那一筆
// （Nuxt 內建的 hash 捲動在這裡不穩定，自己做；試兩次，避免被換頁時的捲到頂部蓋掉）
export function useScrollToHash() {
  const router = useRouter()
  onMounted(() => {
    const go = () => {
      const hash = router.currentRoute.value.hash || location.hash
      if (!hash) return
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ block: 'start' })
    }
    nextTick(go)
    setTimeout(go, 300)
  })
}
