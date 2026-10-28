// 所有旅行：網址 /<代號>/，新增一趟就加一個 JSON 檔 + 在這裡登記
import muc2025 from './2025muc-swiss.json'

export type TripData = typeof muc2025

export const TRIPS: Record<string, TripData> = {
  '2025muc-swiss': muc2025,
}
