@echo off
chcp 65001 >nul
echo ╔══════════════════════════════════════════════════════════╗
echo ║        🔍 检查 3000 端口占用详情                           ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

echo 正在检查 3000 端口...
echo.

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    echo ────────────────────────────────────────
    echo 🔴 发现占用进程！
    echo.
    echo 📌 PID (进程 ID): %%a
    echo.
    echo 📋 进程详情:
    tasklist /FI "PID eq %%a" /FO TABLE
    echo.
    
    echo 操作选项:
    echo   1. 终止此进程并启动服务器
    echo   2. 不终止，使用其他端口
    echo   3. 退出
    echo.
    set /p choice="请选择 (1-3): "
    
    if "!choice!"=="1" (
        echo.
        echo ⏹️  正在终止进程...
        taskkill /F /PID %%a
        if errorlevel 1 (
            echo ❌ 终止失败，请以管理员身份运行
        ) else (
            echo ✅ 已终止进程
            timeout /t 2 >nul
        )
        echo.
        echo 🚀 启动服务器...
        node server.js
    ) else if "!choice!"=="2" (
        echo.
        set /p newport="输入新端口 (默认 3001): "
        if "!newport!"=="" set newport=3001
        echo.
        echo 修改端口为 !newport!...
        (
            for /f "delims=" %%i in ('findstr /n "^" .env') do (
                set "line=%%i"
                setlocal enabledelayedexpansion
                set "line=!line:*:=!"
                if "!line:~0,5!"=="PORT=" (
                    echo PORT=!newport!
                ) else (
                    echo(!line!
                )
                endlocal
            )
        ) > .env.tmp
        move /y .env.tmp .env >nul
        echo ✅ 端口已修改为 !newport!
        echo.
        echo 🚀 启动服务器...
        node server.js
    ) else (
        echo ❌ 已退出
    )
    goto end
)

echo ✅ 3000 端口未被占用
echo.
echo 🚀 启动服务器...
node server.js

:end
pause
