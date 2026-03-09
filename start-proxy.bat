@echo off
chcp 65001 >nul
echo ================================================
echo   AI 游戏生成平台 - 代理服务器启动器
echo ================================================
echo.
echo 此服务器用于解决 CORS 跨域问题
echo.

cd /d "%~dp0"

echo 检查 Node.js 安装...
node --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未找到 Node.js
    echo 请先安装 Node.js: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [✓] Node.js 已安装
node --version
echo.

echo ================================================
echo   启动代理服务器...
echo ================================================
echo.
echo 代理地址：http://localhost:3000
echo API 端点：http://localhost:3000/proxy/chat/completions
echo.
echo 保持此窗口运行，不要关闭！
echo 按 Ctrl+C 停止服务器
echo.
echo ================================================
echo.

node proxy-server.js

pause
