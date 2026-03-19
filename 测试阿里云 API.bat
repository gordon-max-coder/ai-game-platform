@echo off
chcp 65001 >nul
title 测试阿里云 API

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║        🧪 测试阿里云百炼 API                              ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

cd /d %~dp0
node test-aliyun-api.js

pause
