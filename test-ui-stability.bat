@echo off
chcp 65001 >nul
title 测试 UI 稳定性方案

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║        🎯 测试 UI 稳定性方案                            ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

echo 📋 检查实施项目...
echo.

REM 检查 1: server.js 固定 UI 规范
echo [1/6] 检查 server.js 固定 UI 规范...
findstr /C:"FIXED_UI_SPEC" server.js >nul
if %errorlevel% equ 0 (
    echo ✅ server.js 包含固定 UI 规范
) else (
    echo ❌ server.js 缺少固定 UI 规范
)
echo.

REM 检查 2: 游戏历史管理函数
echo [2/6] 检查游戏历史管理函数...
findstr /C:"loadGameHistory" server.js >nul
if %errorlevel% equ 0 (
    echo ✅ loadGameHistory 函数存在
) else (
    echo ❌ loadGameHistory 函数不存在
)

findstr /C:"saveGameHistory" server.js >nul
if %errorlevel% equ 0 (
    echo ✅ saveGameHistory 函数存在
) else (
    echo ❌ saveGameHistory 函数不存在
)

findstr /C:"generateGameId" server.js >nul
if %errorlevel% equ 0 (
    echo ✅ generateGameId 函数存在
) else (
    echo ❌ generateGameId 函数不存在
)
echo.

REM 检查 3: 游戏历史 API
echo [3/6] 检查游戏历史 API...
findstr /C:"game-history" server.js >nul
if %errorlevel% equ 0 (
    echo ✅ 游戏历史 API 端点存在
) else (
    echo ❌ 游戏历史 API 端点不存在
)
echo.

REM 检查 4: 游戏模板
echo [4/6] 检查游戏模板...
if exist "game-template.html" (
    echo ✅ game-template.html 存在
) else (
    echo ❌ game-template.html 不存在
)
echo.

REM 检查 5: 前端历史模块
echo [5/6] 检查前端历史模块...
if exist "js\game-history.js" (
    echo ✅ game-history.js 存在
) else (
    echo ❌ game-history.js 不存在
)

findstr /C:"GameHistoryManager" js\game-history.js >nul
if %errorlevel% equ 0 (
    echo ✅ GameHistoryManager 存在
) else (
    echo ❌ GameHistoryManager 不存在
)
echo.

REM 检查 6: game-history 目录
echo [6/6] 检查游戏历史目录...
if exist "game-history" (
    echo ✅ game-history 目录存在
) else (
    echo ⚠️  game-history 目录不存在（首次运行时创建）
)
echo.

echo ═══════════════════════════════════════════════════════════
echo 检查完成！
echo ═══════════════════════════════════════════════════════════
echo.

REM 测试服务器
echo 💡 是否现在测试服务器？
echo.
echo 选项:
echo   1. 启动服务器并测试
echo   2. 只启动服务器
echo   3. 跳过
echo.
set /p choice="请选择 (1-3): "

if "%choice%"=="1" (
    echo.
    echo 🚀 启动服务器...
    start "GameAI Server" cmd /k "cd /d %~dp0 && node server.js"
    
    echo.
    echo 等待 5 秒...
    timeout /t 5 /nobreak >nul
    
    echo.
    echo 📋 测试 API...
    curl -s http://localhost:3000/api/health
    
    echo.
    echo.
    echo 📋 测试游戏历史 API...
    curl -s http://localhost:3000/api/game-history/
    
    echo.
    echo.
    echo ✅ 服务器已启动，可以开始测试
    echo.
    echo 💡 提示：
    echo   1. 访问 http://localhost:3000/create.html
    echo   2. 创建新游戏（会生成游戏 ID）
    echo   3. 修改游戏（会累加历史记录）
    echo   4. 检查 game-history 目录
) else if "%choice%"=="2" (
    echo.
    echo 🚀 启动服务器...
    start "GameAI Server" cmd /k "cd /d %~dp0 && node server.js"
    echo ✅ 服务器已启动
) else (
    echo.
    echo 💡 提示：可以手动运行 start-server.bat 启动服务器
)

echo.
timeout /t 2 /nobreak >nul
