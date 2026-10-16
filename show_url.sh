#!/usr/bin/env bash
# 顯示臨時對外網址（Cloudflare quick tunnel，容器重開就會換）
cd "$(dirname "$0")"
url=$(docker compose logs quick-tunnel 2>/dev/null | grep -o 'https://[a-z0-9-]*\.trycloudflare\.com' | tail -1)
if [ -n "$url" ]; then
    echo "臨時對外網址：$url/travel-handbook/"
else
    echo "還沒拿到網址，等幾秒再執行一次（或看 docker compose logs quick-tunnel）"
fi
