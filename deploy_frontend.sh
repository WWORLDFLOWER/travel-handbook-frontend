#!/usr/bin/env bash
# 更新前端：重新 build 並上線（nginx 不用動）
# 用法：在這個資料夾執行 ./deploy_frontend.sh
set -euo pipefail
cd "$(dirname "$0")"

echo "== 重新 build 並啟動前端 =="
if ! docker compose up -d --build; then
    echo "失敗了，網站維持舊版。請把上面的錯誤訊息給 Claude 看。"
    exit 1
fi

echo "== 清掉舊版留下的映像檔 =="
docker image prune -f > /dev/null

echo "== 目前狀態 =="
docker compose ps
echo "完成！過幾秒重新整理網頁就是新版。"
echo "本機：http://localhost:8090/travel-handbook/"
./show_url.sh
