@echo off
chcp 65001 >nul
echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║        🚀 启动 GameAI 服务器 - 阿里云百炼 Qwen3.5-Plus    ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

echo 当前配置:
findstr /R "^API_PROVIDER=" .env
findstr /R "^MODEL=" .env
echo.

echo 🚀 启动服务器...
node server.js

pause
