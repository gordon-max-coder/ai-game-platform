@echo off
chcp 65001 >nul
title GameAI Server

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║        🎮 GameAI Server Manager                          ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

REM 检查 .env 文件
if not exist ".env" (
    echo ⚠️  警告：未找到 .env 文件
    echo.
    echo 请复制 .env.example 到 .env 并配置 API_KEY
    echo.
    echo 按任意键退出...
    pause >nul
    exit /b 1
)

echo ✅ 检测到 .env 文件
echo.

REM 启动服务器
echo 🚀 启动服务器...
node server.js

pause
