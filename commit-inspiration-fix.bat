@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║     Commit Inspiration.js Restoration                   ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

git add -A

echo Committing inspiration.js restoration...
git commit -m "🎲 CRITICAL: Recreate missing inspiration.js (25KB)

File was lost, causing button to not work.
Now fully functional with all features."

if %errorlevel% equ 0 (
    echo.
    echo ✅ Committed!
) else (
    echo.
    echo ℹ No changes or already committed
)

echo.
git log --oneline -3

pause
