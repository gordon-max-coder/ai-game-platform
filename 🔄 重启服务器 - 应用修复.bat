@echo off
chcp 65001 >nul
echo ========================================
echo 🔄 重启服务器（应用最新代码）
echo ========================================
echo.
echo 正在停止服务器...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo 正在启动服务器...
cd /d "%~dp0"
start "AI Game Server" node server.js

timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo ✅ 服务器已重启
echo ========================================
echo.
echo 现在请在浏览器中：
echo 1. 按 Ctrl+Shift+R 强制刷新
echo 2. 或者使用无痕模式 (Ctrl+Shift+N)
echo 3. 选择 "MiMo V2 Pro" 模型
echo 4. 测试创建游戏
echo.
pause
