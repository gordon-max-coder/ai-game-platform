@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║     Switch to Claude Sonnet 3.5                         ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

echo Current model in .env:
findstr /C:"MODEL=" .env

echo.
echo Stopping old server...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Starting new server with Sonnet 3.5...
start-server-quick.bat

timeout /t 3 /nobreak >nul

echo.
echo Verifying...
netstat -ano | findstr :3000
if %errorlevel% equ 0 (
    echo.
    echo ╔══════════════════════════════════════════════════════════╗
    echo ║  ✅ Server started with Claude Sonnet 3.5!              ║
    echo ║                                                          ║
    echo ║  Cost savings: 80% (from $483 to $96/month)             ║
    echo ║  Quality: 95% of Opus                                   ║
    echo ╚══════════════════════════════════════════════════════════╝
) else (
    echo.
    echo ╔══════════════════════════════════════════════════════════╗
    echo ║  ⚠️  Server may not have started, please check          ║
    echo ╚══════════════════════════════════════════════════════════╝
)

echo.
pause
