@echo off
chcp 65001 >nul
title 验证服务器卡死修复

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║        ✅ 验证服务器卡死修复                            ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

echo 📋 检查修复项目...
echo.

REM 检查 1: server.js 超时保护
echo [1/4] 检查 server.js 超时保护...
findstr /C:"serverTimeout" server.js >nul
if %errorlevel% equ 0 (
    echo ✅ server.js 包含超时保护
) else (
    echo ❌ server.js 缺少超时保护
)

findstr /C:"serverTimer" server.js >nul
if %errorlevel% equ 0 (
    echo ✅ server.js 包含定时器清理
) else (
    echo ❌ server.js 缺少定时器清理
)
echo.

REM 检查 2: start-server.bat 无 pause
echo [2/4] 检查 start-server.bat...
findstr /C:"pause" start-server.bat >nul
if %errorlevel% equ 1 (
    echo ✅ start-server.bat 已移除 pause 命令
) else (
    echo ⚠️  start-server.bat 仍包含 pause 命令
)
echo.

REM 检查 3: nodejs-test-noninteractive 技能
echo [3/4] 检查 nodejs-test-noninteractive 技能...
findstr /C:"name: nodejs-test-noninteractive" ..\active_skills\nodejs-test-noninteractive\SKILL.md >nul
if %errorlevel% equ 0 (
    echo ✅ 技能包含 YAML Front Matter
) else (
    echo ❌ 技能缺少 YAML Front Matter
)

findstr /C:"description:" ..\active_skills\nodejs-test-noninteractive\SKILL.md >nul
if %errorlevel% equ 0 (
    echo ✅ 技能包含 description
) else (
    echo ❌ 技能缺少 description
)
echo.

REM 检查 4: 诊断工具
echo [4/4] 检查诊断工具...
if exist "fix-server-hang.bat" (
    echo ✅ fix-server-hang.bat 存在
) else (
    echo ❌ fix-server-hang.bat 不存在
)

if exist "FIX-SERVER-HANG.md" (
    echo ✅ FIX-SERVER-HANG.md 文档存在
) else (
    echo ❌ FIX-SERVER-HANG.md 文档不存在
)
echo.

echo ═══════════════════════════════════════════════════════════
echo 验证完成！
echo ═══════════════════════════════════════════════════════════
echo.

REM 测试服务器启动（可选）
echo 💡 是否现在测试服务器启动？
echo.
set /p choice="选择 (Y/N): "
if /i "%choice%"=="Y" (
    echo.
    echo 🚀 启动服务器（5 秒后自动检查）...
    echo.
    
    REM 后台启动服务器
    start "GameAI Server Test" cmd /k "cd /d %~dp0 && node server.js"
    
    REM 等待 5 秒
    timeout /t 5 /nobreak >nul
    
    REM 检查服务器是否启动
    echo.
    echo 📋 检查服务器状态...
    netstat -ano | findstr :3000 >nul
    if %errorlevel% equ 0 (
        echo ✅ 服务器已成功启动（端口 3000 已监听）
        echo.
        echo 💡 提示：服务器在新窗口运行，可以关闭此窗口
    ) else (
        echo ⚠️  服务器可能未启动，请检查新窗口的错误信息
    )
) else (
    echo.
    echo 💡 提示：可以手动运行 start-server.bat 启动服务器
)

echo.
timeout /t 2 /nobreak >nul
