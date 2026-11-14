"""產生路線地圖的道路線條（只要地點或路段改了才需要重跑）

用法（在 frontend 資料夾）：python -I scripts/build_route.py 2025-muc-swiss
讀 app/data/trips/<代號>.json 的 map（stops 地點、legs 路段），
開車的路段向 OSRM 公開服務要實際道路，其他（火車、纜車、渡輪、汽車火車）畫直線，
結果寫到 app/data/trips/<代號>.route.json。
"""
import json
import math
import sys
import time
import urllib.request
from pathlib import Path

OSRM = 'https://router.project-osrm.org/route/v1/driving/'
TOLERANCE = 0.0004  # 簡化線條的容許誤差（度，約 40 公尺），越大檔案越小


def simplify(pts, tol):
    """Douglas–Peucker：去掉幾乎在直線上的點"""
    if len(pts) < 3:
        return pts
    (y1, x1), (y2, x2) = pts[0], pts[-1]
    dx, dy = x2 - x1, y2 - y1
    norm = math.hypot(dx, dy) or 1e-12
    far, idx = 0.0, 0
    for i, (y, x) in enumerate(pts[1:-1], 1):
        d = abs(dy * x - dx * y + x2 * y1 - y2 * x1) / norm
        if d > far:
            far, idx = d, i
    if far <= tol:
        return [pts[0], pts[-1]]
    return simplify(pts[: idx + 1], tol)[:-1] + simplify(pts[idx:], tol)


def drive(points):
    coords = ';'.join(f'{lng},{lat}' for lat, lng in points)
    url = f'{OSRM}{coords}?overview=full&geometries=geojson'
    req = urllib.request.Request(url, headers={'User-Agent': 'travel-handbook/1.0'})
    data = json.load(urllib.request.urlopen(req, timeout=30))
    route = data['routes'][0]
    path = [[round(lat, 5), round(lng, 5)] for lng, lat in route['geometry']['coordinates']]
    return simplify(path, TOLERANCE), route['distance'] / 1000, route['duration'] / 60


def main(slug):
    base = Path(__file__).resolve().parent.parent / 'app' / 'data' / 'trips'
    trip = json.loads((base / f'{slug}.json').read_text(encoding='utf-8'))
    stops = {s['id']: s for s in trip['map']['stops']}
    out = []
    for leg in trip['map']['legs']:
        a, b = stops[leg['from']], stops[leg['to']]
        ends = [[a['lat'], a['lng']], [b['lat'], b['lng']]]
        item = {'from': leg['from'], 'to': leg['to'], 'mode': leg['mode'], 'day': leg['day']}
        if leg['mode'] == 'car':
            path, km, minutes = drive([ends[0], *leg.get('via', []), ends[1]])
            item.update(km=round(km), minutes=round(minutes), path=path)
            print(f"{a['name']} → {b['name']}: {km:.0f} km, {minutes:.0f} 分, {len(path)} 點")
            time.sleep(1)  # 公開服務，不要打太快
        else:
            item['path'] = ends
        out.append(item)
    (base / f'{slug}.route.json').write_text(json.dumps({'legs': out}, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    main(sys.argv[1])
