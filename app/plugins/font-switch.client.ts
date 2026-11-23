// 站內換頁時網址帶 ?ff_type= 也要切換（第一次載入由 <head> 裡的 FONT_SCRIPT 處理，見 app/assets/fonts.ts）
export default defineNuxtPlugin(() => {
  const router = useRouter()
  router.afterEach((to) => {
    const t = to.query.ff_type
    if (t != null) (window as any).__setFont?.(String(t))
  })
})
