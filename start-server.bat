@echo off
chcp 65001 >nul
title AI Game Generator

cd /d "%~dp0"

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║        🎮 AI 游戏生成器 - 启动服务器                     ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

start "" /MIN node server.js

timeout /t 2 /nobreak >nul

echo ✅ 服务器已在后台启动！
echo.
echo 🌐 请在浏览器打开：
echo    http://localhost:3000/simple-generator.html
echo.
echo ℹ️  服务器在后台运行，关闭此窗口不影响服务
echo    如需停止服务，请打开任务管理器结束 node.exe
echo.

start http://localhost:3000/simple-generator.html

exit
