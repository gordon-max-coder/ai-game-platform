@echo off
netstat -ano | findstr :3000
if %errorlevel% equ 0 (
    echo Server is running
) else (
    echo Server is NOT running
    echo Starting server...
    cd /d "%~dp0"
    start-server-quick.bat
)
pause
