// 所有旅行：網址 /<代號>/，新增一趟就加一個 JSON 檔 + 在這裡登記
import muc2025 from './2025-muc-swiss.json'

export type TripData = typeof muc2025

export const TRIPS: Record<string, TripData> = {
  '2025-muc-swiss': muc2025,
}

// 路線地圖的道路線條（scripts/build_route.py 產生），檔案較大，只在地圖頁才載入
export interface RouteLeg {
  from: string
  to: string
  mode: 'car' | 'train' | 'cable' | 'ferry' | 'carTrain'
  day: number
  km?: number
  minutes?: number
  path: [number, number][]
}

export const ROUTES: Record<string, () => Promise<{ legs: RouteLeg[] }>> = {
  '2025-muc-swiss': () => import('./2025-muc-swiss.route.json').then(m => m.default as { legs: RouteLeg[] }),
}
