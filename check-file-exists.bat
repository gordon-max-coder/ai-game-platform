@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo Checking if inspiration.js exists...
if exist js\inspiration.js (
    echo ✅ inspiration.js EXISTS
    echo File size:
    dir js\inspiration.js | findstr "inspiration"
) else (
    echo ❌ inspiration.js DOES NOT EXIST!
    echo.
    echo Need to restore from backup or Git
)

echo.
pause
