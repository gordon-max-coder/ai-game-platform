@echo off
chcp 65001 >nul
title 修复服务器卡死问题

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║        🔧 修复服务器卡死问题                            ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

echo 📋 检查 Node.js 进程...
echo.

REM 检查端口 3000 占用
echo [1/4] 检查端口 3000 占用情况...
netstat -ano | findstr :3000 >nul
if %errorlevel% equ 0 (
    echo ⚠️  端口 3000 被占用：
    netstat -ano | findstr :3000
    echo.
    
    REM 获取占用端口的 PID
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
        set PID=%%a
        goto :found_pid
    )
) else (
    echo ✅ 端口 3000 空闲
    goto :check_node
)

:found_pid
echo.
echo [2/4] 检查进程 %PID%...
tasklist /FI "PID eq %PID%" /V | findstr node.exe >nul
if %errorlevel% equ 0 (
    echo ⚠️  发现卡死的 Node.js 进程 (PID: %PID%)
    echo.
    echo 选项:
    echo   1. 终止此进程并重启服务器 (推荐)
    echo   2. 仅终止进程
    echo   3. 取消
    echo.
    set /p choice="请选择 (1-3): "
    
    if "%choice%"=="1" (
        echo.
        echo 🛑 正在终止进程 %PID%...
        taskkill /F /PID %PID%
        if %errorlevel% equ 0 (
            echo ✅ 进程已终止
            goto :restart_server
        ) else (
            echo ❌ 终止失败，请手动关闭
            goto :end
        )
    ) else if "%choice%"=="2" (
        echo.
        echo 🛑 正在终止进程 %PID%...
        taskkill /F /PID %PID%
        if %errorlevel% equ 0 (
            echo ✅ 进程已终止
        ) else (
            echo ❌ 终止失败
        )
        goto :end
    ) else (
        echo 已取消
        goto :end
    )
) else (
    echo ✅ 进程 %PID% 不是 Node.js
    goto :check_node
)

:check_node
echo.
echo [3/4] 检查其他 Node.js 进程...
tasklist /FI "IMAGENAME eq node.exe" /V >nul
if %errorlevel% equ 0 (
    echo ⚠️  发现以下 Node.js 进程:
    tasklist /FI "IMAGENAME eq node.exe" /FI "STATUS eq Running"
    echo.
    echo 这些进程可能占用资源，建议清理
) else (
    echo ✅ 没有运行中的 Node.js 进程
)

:restart_server
echo.
echo [4/4] 准备重启服务器...
echo.
set /p confirm="是否现在启动服务器？(Y/N): "
if /i "%confirm%"=="Y" (
    echo.
    echo 🚀 启动服务器...
    start "GameAI Server" cmd /k "cd /d %~dp0 && node server.js"
    echo ✅ 服务器已在新窗口启动
) else (
    echo.
    echo 💡 提示：可以手动运行 start-server.bat 启动服务器
)

:end
echo.
echo ═══════════════════════════════════════════════════════════
echo 修复完成！
echo ═══════════════════════════════════════════════════════════
echo.
timeout /t 2 /nobreak >nul
