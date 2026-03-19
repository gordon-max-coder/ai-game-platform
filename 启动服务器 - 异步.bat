@echo off
chcp 65001 >nul
cd /d "%~dp0"

:: 先停止旧服务器
taskkill /F /IM node.exe 2>nul

:: 等待 1 秒
timeout /t 1 /nobreak >nul

:: 完全异步启动服务器（不等待）
start "" /B node server.js > server.log 2>&1

:: 立即退出
exit /b 0
