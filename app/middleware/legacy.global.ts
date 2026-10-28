// 舊網址（還沒分旅行之前分享出去的 /item/xxx、/budget…）自動轉到德瑞那趟
const OLD = /^\/(item|category|budget|notes)(\/|$)/

export default defineNuxtRouteMiddleware((to) => {
  if (OLD.test(to.path)) return navigateTo({ path: `/2025muc-swiss${to.path}`, query: to.query, hash: to.hash }, { replace: true })
})
