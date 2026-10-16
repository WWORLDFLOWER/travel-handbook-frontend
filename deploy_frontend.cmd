@echo off
chcp 65001 >nul
REM 更新前端：重新 build 並上線（nginx 不用動）
REM 用法：在這個資料夾執行 .\deploy_frontend.cmd（或直接雙擊）
cd /d "%~dp0"

echo == 重新 build 並啟動前端 ==
docker compose up -d --build
if errorlevel 1 (
    echo 失敗了，網站維持舊版。請把上面的錯誤訊息給 Claude 看。
    exit /b 1
)

echo == 清掉舊版留下的映像檔 ==
docker image prune -f >nul

echo == 目前狀態 ==
docker compose ps
echo 完成！過幾秒重新整理網頁就是新版。
echo 本機：http://localhost:8090/travel-handbook/
echo GitHub 網頁（https://wworldflower.github.io/travel-handbook-frontend/）要 commit + push 才會更新。
