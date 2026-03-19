@echo off
chcp 65001 >nul
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║         🛑 停止 Node.js 服务器                                ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

echo 正在停止 Node.js 进程...
taskkill /F /IM node.exe 2>nul
if errorlevel 1 (
    echo ℹ️  未发现运行中的 Node.js 进程
) else (
    echo ✅ Node.js 进程已停止
)

echo.
echo 等待 2 秒...
timeout /t 2 /nobreak >nul

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║         🚀 启动 GameAI 服务器                                 ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo 当前配置:
findstr /R "^MODEL=" .env
findstr /R "^API_PROVIDER=" .env
echo.

echo 启动服务器...
start "" node server.js

echo.
echo 等待服务器启动...
timeout /t 3 /nobreak >nul

echo.
echo ═══════════════════════════════════════════════════════════════
echo ✅ 服务器已启动！
echo.
echo 📍 访问地址：http://localhost:3000
echo 🎨 创作页面：http://localhost:3000/create.html
echo 🎮 我的游戏：http://localhost:3000/my-games.html
echo ═══════════════════════════════════════════════════════════════
echo.
echo 按任意键退出...
pause >nul
