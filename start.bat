@echo off
chcp 65001 >nul
title AI Game Generator Server

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║           🎮 AI 游戏生成平台 - 本地服务器                ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo 检查 Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未找到 Node.js!
    echo.
    echo 请先安装 Node.js:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [✓] Node.js 已安装
node --version
echo.

echo 启动服务器...
echo.

node server.js

pause
