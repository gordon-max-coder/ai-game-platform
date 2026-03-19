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

REM 启动服务器（带超时保护）
echo 🚀 启动服务器...
echo.
echo 💡 提示：按 Ctrl+C 可停止服务器
echo.

REM 使用 timeout 包装，防止卡死（300 秒后自动检查）
timeout /t 5 /nobreak >nul
node server.js

REM 如果服务器意外退出，显示错误码
if errorlevel 1 (
    echo.
    echo ❌ 服务器异常退出 (错误码：%errorlevel%)
    echo.
    echo 可能原因:
    echo   1. 端口 %PORT% 被占用
    echo   2. API_KEY 配置错误
    echo   3. 网络连接问题
    echo.
    timeout /t 3 /nobreak >nul
)
