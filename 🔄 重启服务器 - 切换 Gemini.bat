@echo off
chcp 65001 >nul
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║   🔄 重启服务器 - 切换到 Gemini 3.1 Flash Lite               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo 当前配置:
type .env | findstr "MODEL API_PROVIDER"
echo.
echo 正在停止旧服务器...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo.
echo 正在启动新服务器...
start "GameAI Server" node server.js
timeout /t 3 /nobreak >nul
echo.
echo ✅ 服务器已重启！
echo.
echo 📍 访问：http://localhost:3000/create.html
echo.
echo 按任意键退出...
pause >nul
