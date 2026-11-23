// 旅遊手冊：純靜態網站（npm run generate 產生 .output/public），沒有後端
// 資料都在 app/data/trip.json，改資料後重新 build 即可
import { FONT_SCRIPT } from './app/assets/fonts'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  app: {
    // 網址前綴，例如 /travel-handbook/（由 Dockerfile 的 build arg 帶入）
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      htmlAttrs: { lang: 'zh-Hant-TW' },
      title: '德瑞自駕手冊',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '2025/10 德國・法國・瑞士 12 天自駕行程手冊' },
        { name: 'theme-color', content: '#ee9672' },
        // 私人旅遊紀錄，不讓搜尋引擎收錄
        { name: 'robots', content: 'noindex, nofollow' },
      ],
      link: [
        // 字型可用網址 ?ff_type= 切換（app/assets/fonts.ts）；Google Fonts 只在選了 1 / 2 時才載入
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'icon', href: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏔️</text></svg>' }],
      // 畫面出來前就套好字型，避免先閃一下原本的字
      script: [{ innerHTML: FONT_SCRIPT, tagPosition: 'head' }],
    },
  },

  css: ['~/assets/main.css'],

  // 靜態輸出：從首頁開始爬所有連結，每一頁都產生 HTML
  nitro: {
    prerender: { crawlLinks: true, routes: ['/'] },
  },
})
