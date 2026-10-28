// 舊網址自動轉到德瑞那趟（/2025-muc-swiss/…）：
// - 還沒分旅行之前分享出去的 /item/xxx、/budget…
// - 代號改名前的 /2025muc-swiss/…
const TRIP = '/2025-muc-swiss'
const NO_TRIP = /^\/(item|category|budget|notes)(\/|$)/
const OLD_SLUG = /^\/2025muc-swiss(?=\/|$)/

export default defineNuxtRouteMiddleware((to) => {
  let path = ''
  if (NO_TRIP.test(to.path)) path = TRIP + to.path
  else if (OLD_SLUG.test(to.path)) path = to.path.replace(OLD_SLUG, TRIP)
  if (path) return navigateTo({ path, query: to.query, hash: to.hash }, { replace: true })
})
