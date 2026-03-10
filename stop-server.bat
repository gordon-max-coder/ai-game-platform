@echo off
chcp 65001 >nul
title Stop GameAI Server

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║        🛑 Stop GameAI Server                             ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

echo 🛑 正在停止服务器...
taskkill /F /IM node.exe >nul 2>&1

if %errorlevel% equ 0 (
    echo ✅ 服务器已停止
) else (
    echo ℹ️  未找到运行中的服务器
)

echo.
echo 按任意键退出...
pause >nul
