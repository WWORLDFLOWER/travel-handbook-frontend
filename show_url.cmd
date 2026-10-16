@echo off
chcp 65001 >nul
REM 顯示臨時對外網址（Cloudflare quick tunnel，容器重開就會換）
cd /d "%~dp0"
set "URL="
for /f "usebackq delims=" %%u in (`powershell -NoProfile -Command "docker compose logs quick-tunnel 2>$null | Select-String -Pattern 'https://[a-z0-9-]+\.trycloudflare\.com' -AllMatches | ForEach-Object { $_.Matches.Value } | Select-Object -Last 1"`) do set "URL=%%u"
if not defined URL (
    echo 還沒拿到網址，等幾秒再執行一次（或看 docker compose logs quick-tunnel）
    exit /b 0
)
echo 臨時對外網址：%URL%/travel-handbook/
