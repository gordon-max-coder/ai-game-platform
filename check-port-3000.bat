@echo off
chcp 65001 >nul
echo ╔══════════════════════════════════════════════════════════╗
echo ║        🔍 检查 3000 端口占用情况                           ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

echo 正在检查 3000 端口...
netstat -ano | findstr :3000

if errorlevel 1 (
    echo.
    echo ✅ 3000 端口未被占用
    echo.
    echo 🚀 启动服务器...
    node server.js
) else (
    echo.
    echo ⚠️  3000 端口已被占用！
    echo.
    echo 正在查找占用进程...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
        echo PID: %%a
        tasklist | findstr %%a
        echo.
        echo 是否终止该进程？(Y/N)
        set /p choice=">"
        if /i "!choice!"=="Y" (
            taskkill /F /PID %%a
            echo ✅ 已终止进程
            timeout /t 2 >nul
            echo.
            echo 🚀 启动服务器...
            node server.js
        ) else (
            echo ❌ 未终止进程，请手动关闭占用程序
        )
    )
)

pause
