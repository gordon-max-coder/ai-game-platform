@echo off
chcp 65001 >nul
cd /d "%~dp0"
if exist js\show-code.js (
    echo ✅ show-code.js exists
) else (
    echo ❌ show-code.js NOT FOUND - Need to create it
)
pause
