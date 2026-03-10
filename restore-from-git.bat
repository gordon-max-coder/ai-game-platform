@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║     Restore inspiration.js from Git                     ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

echo Checking current status...
if exist js\inspiration.js (
    echo ✅ inspiration.js exists
) else (
    echo ❌ inspiration.js MISSING - restoring from Git...
    
    REM Try to restore from the commit where it was added
    git checkout 7147afe -- js/inspiration.js 2>nul
    
    if exist js\inspiration.js (
        echo ✅ Successfully restored from Git
        echo.
        echo File info:
        dir js\inspiration.js
    ) else (
        echo ❌ Failed to restore from Git
        echo.
        echo Will recreate the file...
    )
)

echo.
pause
