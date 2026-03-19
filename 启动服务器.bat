@echo off
chcp 65001 >nul
title 清理 Node 进程并启动服务器

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║        🧹 清理后台 Node 进程                               ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

echo 🔍 正在查找 Node 进程...
echo.

tasklist | findstr node.exe

if errorlevel 1 (
    echo ✅ 没有发现 Node 进程
    goto start
)

echo.
echo ⚠️  发现 Node 进程，正在终止...
taskkill /F /IM node.exe

if errorlevel 1 (
    echo ❌ 终止失败，请以管理员身份运行
    echo.
    echo 请手动关闭所有 Node 窗口
    pause
    exit /b 1
)

echo ✅ 已清理所有 Node 进程
timeout /t 2 >nul

:start
echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║        🚀 启动 GameAI 服务器                              ║
echo ╚══════════════════════════════════════════════════════════╝
echo.
echo 当前配置:
findstr /R "^API_PROVIDER=" .env
findstr /R "^MODEL=" .env
echo.
echo 📖 使用说明:
echo   - 保持此窗口打开
echo   - 访问 http://localhost:3000/create.html
echo   - 按 Ctrl+C 停止服务器
echo.
echo ────────────────────────────────────────
echo.

node server.js

pause
