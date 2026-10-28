// 行程資料 + 共用的小工具（分類顏色、金額換算、日期格式）
import { TRIPS } from '~/data/trips'

export interface Link { label: string; url: string; added?: boolean }
export interface Cost {
  label: string
  twd?: number
  eur?: number
  chf?: number
  perPerson?: boolean
  free?: boolean
  estimate?: boolean
}
export interface Item {
  id: string
  date: string | null
  time: string
  title: string
  category: CategoryName
  desc?: string
  drive?: string
  details?: string[]
  maps?: Link[]
  links?: Link[]
  booking?: string
  costs?: Cost[]
  tips?: string[]
}
export type CategoryName = '景點' | '美食' | '交通' | '住宿' | '票卷'

export const CATEGORIES: { name: CategoryName; slug: string; icon: string; color: string; soft: string }[] = [
  { name: '景點', slug: 'spots', icon: '🏔️', color: '#3f9a7e', soft: '#e2f3ec' },
  { name: '美食', slug: 'food', icon: '🍽️', color: '#e07a4f', soft: '#fdeadf' },
  { name: '交通', slug: 'transport', icon: '🚗', color: '#5a84c9', soft: '#e5edf8' },
  { name: '住宿', slug: 'stay', icon: '🛏️', color: '#9273bf', soft: '#efe8f7' },
  { name: '票卷', slug: 'tickets', icon: '🎟️', color: '#d9667f', soft: '#fbe5ea' },
]

export const COUNTRIES: Record<string, { name: string; color: string }> = {
  TW: { name: '台灣', color: '#5ea8c0' },
  DE: { name: '德國', color: '#e3a457' },
  FR: { name: '法國', color: '#7590d0' },
  CH: { name: '瑞士', color: '#e07a78' },
}

const WEEK = ['日', '一', '二', '三', '四', '五', '六']

export function categoryOf(name: string) {
  return CATEGORIES.find(c => c.name === name) ?? CATEGORIES[0]!
}

export function fmtDate(date: string) {
  const d = new Date(date + 'T00:00:00')
  return `${d.getMonth() + 1}/${d.getDate()}（${WEEK[d.getDay()]}）`
}

export function money(n: number, digits = 0) {
  return n.toLocaleString('zh-TW', { minimumFractionDigits: digits, maximumFractionDigits: digits })
}

// 目前網址是哪一趟旅行（/2025-muc-swiss/... → 2025-muc-swiss），不在 /<代號>/ 底下就是空字串
export function useTripSlug() {
  const route = useRoute()
  return String(route.params.trip ?? '')
}

export function useTrip() {
  const slug = useTripSlug()
  const data = TRIPS[slug]
  if (!data) throw createError({ statusCode: 404, statusMessage: '找不到這趟旅行', fatal: true })
  // 站內連結都要加上旅行代號：to(`/item/${id}`) → /2025-muc-swiss/item/xxx
  const to = (path = '') => `/${slug}${path}`
  const trip = data.trip
  const items = data.items as Item[]
  const days = data.days

  // 換成台幣：有刷卡紀錄就用實際台幣，現金用匯率估算
  function costTwd(c: Cost): { value: number; approx: boolean } {
    if (c.twd != null) return { value: c.twd, approx: false }
    if (c.eur != null) return { value: Math.round(c.eur * trip.eurRate), approx: true }
    if (c.chf != null) return { value: Math.round(c.chf * trip.chfRate), approx: true }
    return { value: 0, approx: false }
  }

  function foreign(c: Cost) {
    if (c.eur != null) return `€${money(c.eur, c.eur % 1 ? 2 : 0)}`
    if (c.chf != null) return `CHF ${money(c.chf, c.chf % 1 ? 2 : 0)}`
    return ''
  }

  function itemsOfDay(date: string) {
    return items.filter(i => i.date === date)
  }

  function stayOfDay(date: string) {
    return items.find(i => i.date === date && i.category === '住宿' && i.booking)
  }

  return { slug, to, trip, items, days, skipped: data.skipped, budget: data.budget, notes: data.notes, costTwd, foreign, itemsOfDay, stayOfDay }
}
